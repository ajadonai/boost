import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ok, error } from '@/lib/utils';

export async function POST(req) {
  try {
    const session = await getCurrentUser();
    if (!session) return error('Not authenticated', 401);

    const { notifOrders, notifPromo, notifEmail } = await req.json();

    const data = {};
    if (typeof notifOrders === 'boolean') data.notifOrders = notifOrders;
    if (typeof notifPromo === 'boolean') data.notifPromo = notifPromo;
    if (typeof notifEmail === 'boolean') data.notifEmail = notifEmail;

    if (Object.keys(data).length === 0) {
      return error('No valid preferences provided', 400);
    }

    await prisma.user.update({
      where: { id: session.id },
      data,
    });

    return ok({ message: 'Notification preferences updated', ...data });
  } catch (err) {
    console.error('[Notifications]', err);
    return error('Failed to update preferences', 500);
  }
}
