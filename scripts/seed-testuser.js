import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'testuser@gmail.com';
  const password = await bcrypt.hash('12345678', 12);

  // Delete existing user if present
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.session.deleteMany({ where: { userId: existing.id } });
    await prisma.transaction.deleteMany({ where: { userId: existing.id } });
    await prisma.order.deleteMany({ where: { userId: existing.id } });
    await prisma.ticket.deleteMany({ where: { userId: existing.id } });
    await prisma.user.delete({ where: { id: existing.id } });
    console.log('Deleted existing testuser');
  }

  // Create user with 25k balance (stored in kobo)
  const user = await prisma.user.create({
    data: {
      email,
      password,
      name: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      phone: '+2348012345678',
      balance: 2500000, // ₦25,000 in kobo
      referralCode: 'NTR-TEST',
      emailVerified: true,
      notifOrders: true,
      notifPromo: true,
      notifEmail: true,
      status: 'Active',
    },
  });

  console.log(`Created user: ${user.id} (${user.email})`);

  // Get some services for orders
  const services = await prisma.service.findMany({ take: 8 });
  if (services.length === 0) {
    console.log('No services found — skipping orders');
    await prisma.$disconnect();
    return;
  }

  // Seed orders — mix of statuses
  const orderData = [
    { service: services[0], qty: 1000, charge: 350000, cost: 150000, status: 'Completed', daysAgo: 0 },
    { service: services[1] || services[0], qty: 5000, charge: 850000, cost: 400000, status: 'Completed', daysAgo: 1 },
    { service: services[2] || services[0], qty: 2000, charge: 420000, cost: 200000, status: 'Completed', daysAgo: 2 },
    { service: services[3] || services[0], qty: 500, charge: 175000, cost: 80000, status: 'Completed', daysAgo: 3 },
    { service: services[4] || services[0], qty: 10000, charge: 1500000, cost: 700000, status: 'Completed', daysAgo: 4 },
    { service: services[5] || services[0], qty: 3000, charge: 650000, cost: 300000, status: 'Completed', daysAgo: 5 },
    { service: services[6] || services[0], qty: 1500, charge: 280000, cost: 130000, status: 'Completed', daysAgo: 7 },
    { service: services[0], qty: 2500, charge: 520000, cost: 250000, status: 'Completed', daysAgo: 10 },
    { service: services[1] || services[0], qty: 800, charge: 190000, cost: 90000, status: 'Completed', daysAgo: 12 },
    { service: services[2] || services[0], qty: 4000, charge: 720000, cost: 340000, status: 'Completed', daysAgo: 14 },
    { service: services[3] || services[0], qty: 1000, charge: 350000, cost: 150000, status: 'Processing', daysAgo: 0 },
    { service: services[4] || services[0], qty: 2000, charge: 480000, cost: 220000, status: 'Processing', daysAgo: 0 },
    { service: services[5] || services[0], qty: 500, charge: 120000, cost: 55000, status: 'Pending', daysAgo: 0 },
    { service: services[0], qty: 1000, charge: 350000, cost: 150000, status: 'Canceled', daysAgo: 6 },
    { service: services[1] || services[0], qty: 3000, charge: 580000, cost: 270000, status: 'Partial', daysAgo: 8 },
  ];

  let orderCount = 0;
  for (const o of orderData) {
    const d = new Date();
    d.setDate(d.getDate() - o.daysAgo);
    d.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));

    await prisma.order.create({
      data: {
        orderId: `NTR-${100000 + orderCount}`,
        userId: user.id,
        serviceId: o.service.id,
        link: 'https://instagram.com/nitro.ng',
        quantity: o.qty,
        charge: o.charge,
        cost: o.cost,
        status: o.status,
        createdAt: d,
      },
    });
    orderCount++;
  }
  console.log(`Created ${orderCount} orders`);

  // Seed transactions
  const txData = [
    { type: 'deposit', amount: 5000000, method: 'Paystack', note: 'Card deposit', daysAgo: 0 },
    { type: 'deposit', amount: 3000000, method: 'Paystack', note: 'Card deposit', daysAgo: 3 },
    { type: 'deposit', amount: 10000000, method: 'Flutterwave', note: 'Bank transfer', daysAgo: 7 },
    { type: 'deposit', amount: 2000000, method: 'Paystack', note: 'Card deposit', daysAgo: 12 },
    { type: 'order', amount: -350000, method: null, note: 'Order NTR-100000', daysAgo: 0 },
    { type: 'order', amount: -850000, method: null, note: 'Order NTR-100001', daysAgo: 1 },
    { type: 'order', amount: -420000, method: null, note: 'Order NTR-100002', daysAgo: 2 },
    { type: 'order', amount: -175000, method: null, note: 'Order NTR-100003', daysAgo: 3 },
    { type: 'order', amount: -1500000, method: null, note: 'Order NTR-100004', daysAgo: 4 },
    { type: 'order', amount: -650000, method: null, note: 'Order NTR-100005', daysAgo: 5 },
    { type: 'referral', amount: 50000, method: null, note: 'Referral bonus — @david', daysAgo: 2 },
    { type: 'referral', amount: 50000, method: null, note: 'Referral bonus — @chioma', daysAgo: 5 },
    { type: 'referral', amount: 50000, method: null, note: 'Referral bonus — @emeka', daysAgo: 9 },
  ];

  let txCount = 0;
  for (const tx of txData) {
    const d = new Date();
    d.setDate(d.getDate() - tx.daysAgo);
    d.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));

    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: tx.type,
        amount: tx.amount,
        method: tx.method,
        reference: `ref_${Date.now()}_${txCount}`,
        status: 'Completed',
        note: tx.note,
        createdAt: d,
      },
    });
    txCount++;
  }
  console.log(`Created ${txCount} transactions`);

  console.log('\n✅ Test user seeded successfully');
  console.log(`   Email: testuser@gmail.com`);
  console.log(`   Password: 12345678`);
  console.log(`   Balance: ₦25,000`);
  console.log(`   Orders: ${orderCount} (10 completed, 2 processing, 1 pending, 1 canceled, 1 partial)`);
  console.log(`   Transactions: ${txCount}`);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
