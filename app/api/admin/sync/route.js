import prisma from '@/lib/prisma';
import { requireAdmin, logActivity } from '@/lib/admin';
import { getServices, getBalance } from '@/lib/mtp';

export async function POST(req) {
  const { admin, error } = await requireAdmin('services', true);
  if (error) return error;

  try {
    const { action } = await req.json();

    if (action === 'test') {
      // Test MTP connection
      const balance = await getBalance();
      return Response.json({ success: true, balance });
    }

    if (action === 'sync') {
      // Fetch all services from MTP
      const mtpServices = await getServices();

      if (!Array.isArray(mtpServices)) {
        return Response.json({ error: 'Invalid response from MTP' }, { status: 400 });
      }

      // Get current settings for default markup
      const markupSetting = await prisma.setting.findUnique({ where: { key: 'defaultMarkup' } });
      const defaultMarkup = Number(markupSetting?.value) || 54;

      let created = 0, updated = 0, skipped = 0;

      for (const svc of mtpServices) {
        const apiId = Number(svc.service);
        const costPer1k = Math.round(parseFloat(svc.rate) * 100); // Convert to kobo
        const sellPer1k = Math.round(costPer1k * (1 + defaultMarkup / 100));

        // Determine category from MTP category string
        const category = categorize(svc.category);

        try {
          const existing = await prisma.service.findFirst({ where: { apiId } });

          if (existing) {
            // Update cost, keep existing markup/sell price if admin customized
            await prisma.service.update({
              where: { id: existing.id },
              data: {
                name: svc.name,
                category: category,
                costPer1k,
                min: Number(svc.min) || 10,
                max: Number(svc.max) || 100000,
                refill: svc.refill === true || svc.refill === 'true',
                avgTime: svc.average_time || null,
                // Only update sell price if admin hasn't customized markup
                ...(existing.markup === defaultMarkup ? { sellPer1k } : {}),
              },
            });
            updated++;
          } else {
            // Create new service
            await prisma.service.create({
              data: {
                apiId,
                name: svc.name,
                category,
                costPer1k,
                sellPer1k,
                markup: defaultMarkup,
                min: Number(svc.min) || 10,
                max: Number(svc.max) || 100000,
                refill: svc.refill === true || svc.refill === 'true',
                avgTime: svc.average_time || null,
                enabled: false, // New services disabled by default — admin enables manually
              },
            });
            created++;
          }
        } catch (e) {
          skipped++;
        }
      }

      await logActivity(admin.name, `Synced services from MTP: ${created} new, ${updated} updated, ${skipped} skipped`, 'service');

      return Response.json({
        success: true,
        total: mtpServices.length,
        created,
        updated,
        skipped,
      });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('[Sync]', err.message);
    return Response.json({ error: err.message || 'Sync failed' }, { status: 500 });
  }
}

/**
 * Categorize MTP service into platform categories
 */
function categorize(mtpCategory) {
  if (!mtpCategory) return 'Other';
  const c = mtpCategory.toLowerCase();
  if (c.includes('instagram')) return 'Instagram';
  if (c.includes('tiktok') || c.includes('tik tok')) return 'TikTok';
  if (c.includes('youtube')) return 'YouTube';
  if (c.includes('twitter') || c.includes('/x')) return 'Twitter/X';
  if (c.includes('facebook') || c.includes('fb')) return 'Facebook';
  if (c.includes('telegram')) return 'Telegram';
  if (c.includes('spotify')) return 'Spotify';
  if (c.includes('snapchat')) return 'Snapchat';
  if (c.includes('linkedin')) return 'LinkedIn';
  if (c.includes('pinterest')) return 'Pinterest';
  if (c.includes('twitch')) return 'Twitch';
  if (c.includes('discord')) return 'Discord';
  if (c.includes('thread')) return 'Threads';
  return mtpCategory.split(' ')[0] || 'Other';
}
