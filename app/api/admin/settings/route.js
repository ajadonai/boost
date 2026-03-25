import prisma from '@/lib/prisma';
import { requireAdmin, logActivity } from '@/lib/admin';

export async function GET() {
  const { admin, error } = await requireAdmin('settings');
  if (error) return error;

  try {
    const rows = await prisma.setting.findMany();
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });

    return Response.json({ settings });
  } catch (err) {
    console.error('[Admin Settings GET]', err.message);
    return Response.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(req) {
  const { admin, error } = await requireAdmin('settings', true);
  if (error) return error;

  // Only superadmin can change settings
  if (admin.role !== 'superadmin') {
    return Response.json({ error: 'Only superadmin can change settings' }, { status: 403 });
  }

  try {
    const { settings } = await req.json();
    if (!settings || typeof settings !== 'object') {
      return Response.json({ error: 'Invalid settings data' }, { status: 400 });
    }

    // Upsert each setting
    const ops = Object.entries(settings).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await prisma.$transaction(ops);
    await logActivity(admin.name, 'Updated site settings', 'settings');

    return Response.json({ success: true, message: 'Settings saved' });
  } catch (err) {
    console.error('[Admin Settings POST]', err.message);
    return Response.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
