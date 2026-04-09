import prisma from '@/lib/prisma';
import { log } from "@/lib/logger";
import { requireAdmin, logActivity } from '@/lib/admin';

export async function GET(req) {
  const { admin, error } = await requireAdmin('orders');
  if (error) return error;

  try {
    const url = new URL(req.url);
    const cursor = url.searchParams.get('cursor');
    const limit = Math.min(Number(url.searchParams.get('limit')) || 50, 200);

    const orders = await prisma.order.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit + 1, // fetch one extra to detect if there are more
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        user: { select: { name: true, email: true } },
        service: { select: { name: true, category: true } },
      },
    });

    const hasMore = orders.length > limit;
    const items = hasMore ? orders.slice(0, limit) : orders;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return Response.json({
      orders: items.map(o => ({
        id: o.orderId || o.id,
        internalId: o.id,
        user: o.user?.name || 'Unknown',
        email: o.user?.email || '',
        service: o.service?.name || o.serviceId,
        category: o.service?.category || 'unknown',
        link: o.link,
        quantity: o.quantity,
        charge: o.charge / 100,
        cost: o.cost / 100,
        status: o.status,
        apiOrderId: o.apiOrderId,
        created: o.createdAt.toISOString(),
      })),
      nextCursor,
      hasMore,
    });
  } catch (err) {
    log.error('Admin Orders', err.message);
    return Response.json({ error: 'Failed to load orders' }, { status: 500 });
  }
}

export async function POST(req) {
  const { admin, error } = await requireAdmin('orders', true);
  if (error) return error;

  try {
    const { action, orderId } = await req.json();

    if (!orderId) return Response.json({ error: 'Order ID required' }, { status: 400 });

    const order = await prisma.order.findFirst({
      where: { OR: [{ orderId }, { id: orderId }], deletedAt: null },
    });
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    if (action === 'cancel') {
      // Cancel on MTP if possible
      if (order.apiOrderId && process.env.MTP_API_KEY) {
        try {
          const { cancelOrder } = await import('@/lib/mtp');
          await cancelOrder(order.apiOrderId);
        } catch (e) { log.warn('Admin Cancel MTP', e.message); }
      }
      await prisma.order.update({ where: { id: order.id }, data: { status: 'Cancelled' } });
      await logActivity(admin.name, `Cancelled order ${orderId}`, 'order');
      return Response.json({ success: true, message: 'Order cancelled' });
    }

    if (action === 'refill') {
      if (order.apiOrderId && process.env.MTP_API_KEY) {
        try {
          const { refillOrder } = await import('@/lib/mtp');
          await refillOrder(order.apiOrderId);
        } catch (e) { log.warn('Admin Refill MTP', e.message); }
      }
      await logActivity(admin.name, `Requested refill for ${orderId}`, 'order');
      return Response.json({ success: true, message: 'Refill requested' });
    }

    if (action === 'check') {
      if (order.apiOrderId && process.env.MTP_API_KEY) {
        try {
          const { checkOrder } = await import('@/lib/mtp');
          const status = await checkOrder(order.apiOrderId);
          const statusMap = { 'Completed': 'Completed', 'In progress': 'Processing', 'Processing': 'Processing', 'Pending': 'Pending', 'Partial': 'Partial', 'Canceled': 'Cancelled', 'Refunded': 'Cancelled' };
          const newStatus = statusMap[status.status] || order.status;
          if (newStatus !== order.status) {
            await prisma.order.update({ where: { id: order.id }, data: { status: newStatus } });
          }
          await logActivity(admin.name, `Checked order ${orderId}: ${newStatus}`, 'order');
          return Response.json({ success: true, status: newStatus, remains: status.remains });
        } catch (e) {
          return Response.json({ success: true, status: order.status, message: e.message });
        }
      }
      return Response.json({ success: true, status: order.status, message: 'No MTP tracking' });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    log.error('Admin Orders POST', err.message);
    return Response.json({ error: 'Action failed' }, { status: 500 });
  }
}
