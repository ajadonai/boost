import prisma from '@/lib/prisma';
import { requireAdmin, logActivity } from '@/lib/admin';

export async function GET() {
  const { admin, error } = await requireAdmin('orders');
  if (error) return error;

  try {
    const orders = await prisma.order.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 500,
      include: {
        user: { select: { name: true, email: true } },
        service: { select: { name: true, category: true } },
      },
    });

    return Response.json({
      orders: orders.map(o => ({
        id: o.orderId || o.id,
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
    });
  } catch (err) {
    console.error('[Admin Orders]', err.message);
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
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'Canceled' },
      });
      await logActivity(admin.name, `Cancelled order ${orderId}`, 'order');
      return Response.json({ success: true, message: 'Order cancelled' });
    }

    if (action === 'refill') {
      // Mark for refill — actual refill happens via MoreThanPanel API (future)
      await logActivity(admin.name, `Requested refill for ${orderId}`, 'order');
      return Response.json({ success: true, message: 'Refill requested' });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('[Admin Orders POST]', err.message);
    return Response.json({ error: 'Action failed' }, { status: 500 });
  }
}
