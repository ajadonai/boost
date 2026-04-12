import prisma from '@/lib/prisma';
import { log } from "@/lib/logger";

export async function POST(req) {
  try {
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      return Response.json({ error: 'Not configured' }, { status: 503 });
    }

    // Verify Flutterwave webhook signature
    const body = await req.text();
    const signature = req.headers.get('verif-hash');
    const hash = process.env.FLUTTERWAVE_WEBHOOK_HASH;

    if (hash && signature !== hash) {
      console.warn('[Webhook] Invalid Flutterwave signature');
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.completed' && event.data?.status === 'successful') {
      const { tx_ref: reference, amount } = event.data;
      const amountKobo = Math.round(amount * 100);

      // Atomically claim the pending transaction
      const claimed = await prisma.transaction.updateMany({
        where: { reference, status: 'Pending' },
        data: { status: 'Processing' },
      });

      if (claimed.count === 0) {
        console.log(`[Webhook] No pending tx for ref: ${reference} (already claimed or missing)`);
        return Response.json({ received: true });
      }

      const tx = await prisma.transaction.findFirst({
        where: { reference, status: 'Processing' },
      });

      if (!tx) {
        return Response.json({ received: true });
      }

      // Check for coupon bonus
      let couponBonus = 0;
      let couponLabel = '';
      let couponUpdateData = null;
      const couponMatch = (tx.note || '').match(/\[coupon:([^\]]+)\]/);
      if (couponMatch) {
        try {
          const couponId = couponMatch[1];
          const alreadyUsed = await prisma.transaction.findFirst({
            where: { userId: tx.userId, type: 'bonus', note: { contains: `[cid:${couponId}]` } },
          });
          if (!alreadyUsed) {
            const row = await prisma.setting.findUnique({ where: { key: 'coupons' } });
            if (row) {
              const coupons = JSON.parse(row.value);
              const coupon = coupons.find(c => c.id === couponId && c.enabled !== false);
              if (coupon) {
                const notExpired = !coupon.expires || new Date(coupon.expires) >= new Date();
                const notMaxed = !coupon.maxUses || coupon.maxUses === 0 || (coupon.used || 0) < coupon.maxUses;
                if (notExpired && notMaxed) {
                  couponBonus = coupon.type === 'percent' ? Math.round(amountKobo * (coupon.value / 100)) : coupon.value * 100;
                  couponLabel = `Coupon ${coupon.code}: bonus [cid:${couponId}]`;
                  couponUpdateData = JSON.stringify(coupons.map(c => c.id === couponId ? { ...c, used: (c.used || 0) + 1 } : c));
                }
              }
            }
          }
        } catch {}
      }

      const totalCredit = amountKobo + couponBonus;

      const ops = [
        prisma.user.update({ where: { id: tx.userId }, data: { balance: { increment: totalCredit } } }),
        prisma.transaction.update({ where: { id: tx.id }, data: { status: 'Completed', amount: amountKobo } }),
      ];
      if (couponBonus > 0) {
        ops.push(prisma.transaction.create({
          data: { userId: tx.userId, type: 'bonus', amount: couponBonus, status: 'Completed', note: couponLabel },
        }));
      }
      await prisma.$transaction(ops);

      if (couponUpdateData) {
        try { await prisma.setting.update({ where: { key: 'coupons' }, data: { value: couponUpdateData } }); } catch {}
      }

      console.log(`[Webhook] ₦${amountKobo / 100} + ₦${couponBonus / 100} bonus credited to user ${tx.userId} (ref: ${reference})`);
    }

    return Response.json({ received: true });
  } catch (err) {
    log.error('Webhook', err.message);
    return Response.json({ received: true });
  }
}
