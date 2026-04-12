import prisma from '@/lib/prisma';
import { log } from '@/lib/logger';
import { checkOrder } from '@/lib/smm';

// Polls provider APIs for order status updates
// Auto-refunds failed/cancelled orders
// Runs every 10 minutes via Vercel Cron
// GET /api/cron/orders

export async function GET(req) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = { checked: 0, updated: 0, refunded: 0, errors: 0 };

  try {
    // Get all active orders (Processing or Pending with apiOrderId)
    const activeOrders = await prisma.order.findMany({
      where: {
        status: { in: ['Processing', 'Pending', 'In progress'] },
        apiOrderId: { not: null },
        deletedAt: null,
      },
      include: { service: { select: { provider: true } } },
      take: 200, // batch limit
      orderBy: { createdAt: 'asc' }, // oldest first
    });

    if (activeOrders.length === 0) {
      return Response.json({ success: true, message: 'No active orders to check', ...stats });
    }

    // Group orders by provider for efficient batch checking
    const byProvider = {};
    for (const order of activeOrders) {
      const provider = order.service?.provider || 'mtp';
      if (!byProvider[provider]) byProvider[provider] = [];
      byProvider[provider].push(order);
    }

    for (const [provider, orders] of Object.entries(byProvider)) {
      // Check orders one by one (most providers don't support reliable bulk status)
      for (const order of orders) {
        try {
          stats.checked++;
          const result = await checkOrder(provider, order.apiOrderId);

          // Normalize status from provider
          const providerStatus = (result.status || '').toLowerCase();
          let newStatus = null;

          if (['completed', 'complete'].includes(providerStatus)) {
            newStatus = 'Completed';
          } else if (['partial', 'partially completed'].includes(providerStatus)) {
            newStatus = 'Partial';
          } else if (['cancelled', 'canceled', 'refunded'].includes(providerStatus)) {
            newStatus = 'Cancelled';
          } else if (['in progress', 'inprogress', 'processing'].includes(providerStatus)) {
            newStatus = 'Processing';
          }

          // Skip if no change or unknown status
          if (!newStatus || newStatus === order.status) continue;

          // Update order status
          await prisma.order.update({
            where: { id: order.id },
            data: { status: newStatus },
          });
          stats.updated++;

          // Auto-refund cancelled orders
          if (newStatus === 'Cancelled') {
            await refundOrder(order);
            stats.refunded++;
          }

          // Partial refund for partial orders
          if (newStatus === 'Partial' && result.remains) {
            const remains = Number(result.remains) || 0;
            if (remains > 0 && order.charge > 0 && order.quantity > 0) {
              const refundAmount = Math.round((remains / order.quantity) * order.charge);
              if (refundAmount > 0) {
                await refundOrder(order, refundAmount);
                stats.refunded++;
              }
            }
          }

        } catch (err) {
          stats.errors++;
          log.warn(`Cron order check ${order.orderId}`, err.message);
        }

        // Small delay between API calls to avoid rate limiting
        await new Promise(r => setTimeout(r, 200));
      }
    }

    log.info('Cron orders', `Checked ${stats.checked}, updated ${stats.updated}, refunded ${stats.refunded}, errors ${stats.errors}`);
    return Response.json({ success: true, ...stats });

  } catch (err) {
    log.error('Cron orders', err.message);
    return Response.json({ error: err.message, ...stats }, { status: 500 });
  }
}

async function refundOrder(order, amount = null) {
  const refundAmount = amount || order.charge;
  if (!refundAmount || refundAmount <= 0) return;

  await prisma.$transaction(async (tx) => {
    // Credit user balance
    await tx.$executeRaw`UPDATE users SET balance = balance + ${refundAmount} WHERE id = ${order.userId}`;

    // Create refund transaction
    await tx.transaction.create({
      data: {
        userId: order.userId,
        type: 'refund',
        amount: refundAmount,
        method: 'wallet',
        status: 'Completed',
        reference: `REF-${order.orderId}`,
        note: amount
          ? `Partial refund for ${order.orderId} (${amount === order.charge ? 'full' : 'partial'})`
          : `Auto-refund for cancelled order ${order.orderId}`,
      },
    });
  });
}
