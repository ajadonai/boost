import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { placeOrder } from '@/lib/mtp';

export async function POST(req) {
  try {
    const session = await getCurrentUser();
    if (!session) return Response.json({ error: 'Not authenticated' }, { status: 401 });

    const { serviceId, link, quantity } = await req.json();

    if (!serviceId || !link || !quantity) {
      return Response.json({ error: 'Service, link, and quantity required' }, { status: 400 });
    }

    // Validate link
    const trimmedLink = link.trim();
    if (trimmedLink.length < 5 || trimmedLink.length > 500) {
      return Response.json({ error: 'Invalid link' }, { status: 400 });
    }

    // Get service
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.enabled) {
      return Response.json({ error: 'Service not available' }, { status: 400 });
    }

    const qty = Number(quantity);
    if (qty < service.min || qty > service.max) {
      return Response.json({ error: `Quantity must be between ${service.min} and ${service.max}` }, { status: 400 });
    }

    // Calculate charge
    const charge = Math.round((service.sellPer1k / 1000) * qty);
    const cost = Math.round((service.costPer1k / 1000) * qty);

    // Check balance
    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });
    if (user.balance < charge) {
      return Response.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Generate order ID
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // Place order on MTP (if apiId exists)
    let apiOrderId = null;
    if (service.apiId && process.env.MTP_API_KEY) {
      try {
        const mtpResult = await placeOrder(service.apiId, trimmedLink, qty);
        apiOrderId = mtpResult.order ? String(mtpResult.order) : null;
      } catch (err) {
        console.error('[Order MTP]', err.message);
        // Don't fail the order — mark as pending for manual processing
      }
    }

    // Deduct balance + create order + create transaction in one atomic operation
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          orderId,
          userId: user.id,
          serviceId: service.id,
          link: trimmedLink,
          quantity: qty,
          charge,
          cost,
          status: apiOrderId ? 'Processing' : 'Pending',
          apiOrderId,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: charge } },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          type: 'order',
          amount: -charge,
          method: 'wallet',
          status: 'Completed',
          reference: orderId,
          note: `Order ${orderId} — ${service.name} x${qty.toLocaleString()}`,
        },
      }),
    ]);

    return Response.json({
      success: true,
      order: {
        id: orderId,
        service: service.name,
        quantity: qty,
        charge: charge / 100,
        status: order.status,
      },
    });
  } catch (err) {
    console.error('[Orders POST]', err.message);
    return Response.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
