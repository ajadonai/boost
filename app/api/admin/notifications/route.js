import prisma from '@/lib/prisma';
import { requireAdmin, logActivity } from '@/lib/admin';
import { sendEmail } from '@/lib/email';

async function getHistory() {
  try {
    const row = await prisma.setting.findUnique({ where: { key: 'notification_history' } });
    return row ? JSON.parse(row.value) : [];
  } catch { return []; }
}

async function saveHistory(history) {
  await prisma.setting.upsert({
    where: { key: 'notification_history' },
    update: { value: JSON.stringify(history.slice(0, 100)) },
    create: { key: 'notification_history', value: JSON.stringify(history.slice(0, 100)) },
  });
}

export async function GET() {
  const { admin, error } = await requireAdmin('notifications');
  if (error) return error;

  try {
    const history = await getHistory();
    return Response.json({ history });
  } catch (err) {
    console.error('[Admin Notifications]', err.message);
    return Response.json({ error: 'Failed to load' }, { status: 500 });
  }
}

export async function POST(req) {
  const { admin, error } = await requireAdmin('notifications', true);
  if (error) return error;

  try {
    const { subject, message, target } = await req.json();
    if (!message?.trim()) return Response.json({ error: 'Message required' }, { status: 400 });

    const subj = subject?.trim() || 'Notification from Nitro';
    const msg = message.trim();

    // Get target users
    let whereClause = { status: 'Active' };
    if (target === 'new') {
      // Users who signed up in last 7 days
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      whereClause.createdAt = { gte: weekAgo };
    } else if (target === 'active') {
      // Users who have at least 1 order
      whereClause.orders = { some: {} };
    }
    // 'all' = all active users

    const users = await prisma.user.findMany({
      where: whereClause,
      select: { email: true, name: true },
    });

    // Build email HTML
    const html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #c47d8e, #8b5e6b); display: inline-flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #fff;">N</div>
        </div>
        <h1 style="font-size: 20px; font-weight: 600; color: #1a1a1a; text-align: center; margin-bottom: 16px;">${subj}</h1>
        <div style="font-size: 15px; color: #444; line-height: 1.7; white-space: pre-wrap;">${msg}</div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="font-size: 12px; color: #bbb;">Nitro — Premium SMM Services</p>
        </div>
      </div>
    `;

    // Send emails (batch — fire all, count successes)
    let sent = 0;
    let failed = 0;
    const batchSize = 10;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map(u => sendEmail(u.email, subj, html))
      );
      results.forEach(r => {
        if (r.status === 'fulfilled' && r.value?.success) sent++;
        else failed++;
      });
    }

    const totalStatus = failed === 0 ? 'sent' : sent === 0 ? 'failed' : 'partial';

    // Store in history
    const history = await getHistory();
    history.unshift({
      id: Date.now().toString(),
      subject: subj,
      message: msg,
      target: target || 'all',
      sentBy: admin.name,
      sentAt: new Date().toISOString(),
      status: totalStatus,
      recipients: users.length,
      sent,
      failed,
    });
    await saveHistory(history);

    await logActivity(admin.name, `Sent notification "${subj}" to ${users.length} users (${sent} delivered)`, 'notification');

    return Response.json({
      success: true,
      message: `Sent to ${sent}/${users.length} users${failed > 0 ? ` (${failed} failed)` : ''}`,
      status: totalStatus,
    });
  } catch (err) {
    console.error('[Admin Notifications POST]', err.message);
    return Response.json({ error: 'Failed to send' }, { status: 500 });
  }
}
