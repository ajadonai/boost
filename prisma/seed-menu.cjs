// Nitro Menu Seed Script
// Run: node prisma/seed-menu.js
// Creates service groups + tiers using real MTP service IDs from your DB

const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// Markup: cost → sell price (in kobo). Using Nitro's tiered markup strategy.
// Budget = ~2.5-3x, Standard = ~2x, Premium = ~1.7x
// Prices below are sell prices per 1K in KOBO (₦1 = 100 kobo)

const MENU = [
  // ═══════════════════════════════════════════
  // INSTAGRAM
  // ═══════════════════════════════════════════
  {
    name: "Instagram Followers", platform: "Instagram", type: "followers",
    tiers: [
      { tier: "Budget",   apiId: 1402, sellPer1k: 50000,  speed: "1-5K/day",    refill: true  }, // FB followers repurposed — use IG one below
      { tier: "Standard", apiId: 8927, sellPer1k: 85000,  speed: "1-5K/day",    refill: true  },
      { tier: "Premium",  apiId: 8927, sellPer1k: 140000, speed: "1-5K/day",    refill: true  },
    ]
  },
  {
    name: "Instagram Post Likes", platform: "Instagram", type: "likes",
    tiers: [
      { tier: "Budget",   apiId: 578,  sellPer1k: 8000,   speed: "500-1K/day",  refill: false },
      { tier: "Standard", apiId: 578,  sellPer1k: 25000,  speed: "500-1K/day",  refill: false },
    ]
  },
  {
    name: "Instagram Reel/Video Views", platform: "Instagram", type: "views",
    tiers: [
      { tier: "Budget",   apiId: 7661, sellPer1k: 300,    speed: "10-20M/day",  refill: false },
      { tier: "Standard", apiId: 2127, sellPer1k: 800,    speed: "100-500K/day", refill: true },
      { tier: "Premium",  apiId: 2504, sellPer1k: 1500,   speed: "400-800K/day", refill: true },
    ]
  },
  {
    name: "Instagram Photo Views", platform: "Instagram", type: "views",
    tiers: [
      { tier: "Standard", apiId: 8703, sellPer1k: 1500,   speed: "50-300K/day", refill: false },
    ]
  },
  {
    name: "Instagram Shares", platform: "Instagram", type: "engagement",
    tiers: [
      { tier: "Standard", apiId: 5707, sellPer1k: 1000,   speed: "50-100K/day", refill: false },
    ]
  },
  {
    name: "Instagram Story Views", platform: "Instagram", type: "views",
    tiers: [
      { tier: "Standard", apiId: 9035, sellPer1k: 1200,   speed: "100-150K/day", refill: true },
    ]
  },

  // ═══════════════════════════════════════════
  // TIKTOK
  // ═══════════════════════════════════════════
  {
    name: "TikTok Video Views", platform: "TikTok", type: "views",
    tiers: [
      { tier: "Budget",   apiId: 2026, sellPer1k: 300,    speed: "5-50K/day",   refill: false },
      { tier: "Standard", apiId: 9349, sellPer1k: 1000,   speed: "500-1M/day",  refill: true  },
      { tier: "Premium",  apiId: 1130, sellPer1k: 2000,   speed: "50-500K/day", refill: true  },
    ]
  },
  {
    name: "TikTok Saves", platform: "TikTok", type: "engagement",
    tiers: [
      { tier: "Budget",   apiId: 5025, sellPer1k: 1500,   speed: "50-100K/day", refill: false },
      { tier: "Standard", apiId: 5827, sellPer1k: 2500,   speed: "100-200K/day", refill: true },
    ]
  },

  // ═══════════════════════════════════════════
  // YOUTUBE
  // ═══════════════════════════════════════════
  {
    name: "YouTube Likes", platform: "YouTube", type: "likes",
    tiers: [
      { tier: "Budget",   apiId: 935,  sellPer1k: 3000,   speed: "10-100K/day", refill: false },
    ]
  },
  {
    name: "YouTube Subscribers", platform: "YouTube", type: "followers",
    tiers: [
      { tier: "Budget",   apiId: 2386, sellPer1k: 3500,   speed: "10-50K/day",  refill: false },
    ]
  },
  {
    name: "YouTube Comment Likes", platform: "YouTube", type: "engagement",
    tiers: [
      { tier: "Standard", apiId: 912,  sellPer1k: 8000,   speed: "5-10K/day",   refill: true  },
    ]
  },

  // ═══════════════════════════════════════════
  // TWITTER / X
  // ═══════════════════════════════════════════
  {
    name: "X/Twitter Tweet Views", platform: "Twitter/X", type: "views",
    tiers: [
      { tier: "Budget",   apiId: 981,  sellPer1k: 300,    speed: "100-500K/day", refill: false },
      { tier: "Standard", apiId: 2990, sellPer1k: 500,    speed: "100-200K/day", refill: false },
    ]
  },
  {
    name: "X/Twitter Video Views", platform: "Twitter/X", type: "views",
    tiers: [
      { tier: "Standard", apiId: 350,  sellPer1k: 400,    speed: "Fast",        refill: false },
    ]
  },

  // ═══════════════════════════════════════════
  // FACEBOOK
  // ═══════════════════════════════════════════
  {
    name: "Facebook Video Views", platform: "Facebook", type: "views",
    tiers: [
      { tier: "Budget",   apiId: 680,  sellPer1k: 3000,   speed: "20-30K/day",  refill: true  },
      { tier: "Standard", apiId: 7654, sellPer1k: 4500,   speed: "5-15K/day",   refill: true  },
      { tier: "Premium",  apiId: 6336, sellPer1k: 6000,   speed: "50-100K/day", refill: true  },
    ]
  },
  {
    name: "Facebook Reel Views", platform: "Facebook", type: "views",
    tiers: [
      { tier: "Standard", apiId: 6337, sellPer1k: 4500,   speed: "20-30K/day",  refill: true  },
      { tier: "Premium",  apiId: 6339, sellPer1k: 6000,   speed: "50-100K/day", refill: true  },
    ]
  },
  {
    name: "Facebook Followers", platform: "Facebook", type: "followers",
    tiers: [
      { tier: "Budget",   apiId: 1402, sellPer1k: 60000,  speed: "1-5K/day",    refill: true  },
      { tier: "Standard", apiId: 8927, sellPer1k: 85000,  speed: "1-5K/day",    refill: true  },
    ]
  },
  {
    name: "Facebook Post Likes", platform: "Facebook", type: "likes",
    tiers: [
      { tier: "Budget",   apiId: 578,  sellPer1k: 8000,   speed: "500-1K/day",  refill: false },
    ]
  },
  {
    name: "Facebook Group Members", platform: "Facebook", type: "followers",
    tiers: [
      { tier: "Standard", apiId: 1724, sellPer1k: 8000,   speed: "1-5K/day",    refill: false },
    ]
  },

  // ═══════════════════════════════════════════
  // TELEGRAM
  // ═══════════════════════════════════════════
  {
    name: "Telegram Post Views", platform: "Telegram", type: "views",
    tiers: [
      { tier: "Budget",   apiId: 4880, sellPer1k: 800,    speed: "100-200K/day", refill: false },
      { tier: "Standard", apiId: 2949, sellPer1k: 1500,   speed: "100-200K/day", refill: false },
    ]
  },
  {
    name: "Telegram Reactions (Positive)", platform: "Telegram", type: "engagement",
    tiers: [
      { tier: "Standard", apiId: 2737, sellPer1k: 1200,   speed: "Fast",        refill: false },
    ]
  },

  // ═══════════════════════════════════════════
  // SPOTIFY
  // ═══════════════════════════════════════════
  {
    name: "Spotify Plays — Global", platform: "Spotify", type: "plays",
    tiers: [
      { tier: "Standard", apiId: 1612, sellPer1k: 6000,   speed: "20-30K/day",  refill: true  },
    ]
  },
  {
    name: "Spotify Plays — USA", platform: "Spotify", type: "plays",
    tiers: [
      { tier: "Premium",  apiId: 2482, sellPer1k: 6500,   speed: "20-30K/day",  refill: true  },
    ]
  },
  {
    name: "Spotify Followers", platform: "Spotify", type: "followers",
    tiers: [
      { tier: "Standard", apiId: 1981, sellPer1k: 6500,   speed: "100K-2M/day", refill: true  },
    ]
  },
  {
    name: "Spotify Followers — Nigeria 🇳🇬", platform: "Spotify", type: "followers", nigerian: true,
    tiers: [
      { tier: "Standard", apiId: 4453, sellPer1k: 7000,   speed: "1M/day",      refill: true  },
    ]
  },

  // ═══════════════════════════════════════════
  // SNAPCHAT
  // ═══════════════════════════════════════════
  {
    name: "Snapchat Followers", platform: "Snapchat", type: "followers",
    tiers: [
      { tier: "Budget",   apiId: 8384, sellPer1k: 350000, speed: "50-200/day",  refill: false },
      { tier: "Standard", apiId: 8385, sellPer1k: 500000, speed: "500-1K/day",  refill: true  },
      { tier: "Premium",  apiId: 8386, sellPer1k: 650000, speed: "500-1K/day",  refill: true  },
    ]
  },
  {
    name: "Snapchat Likes", platform: "Snapchat", type: "likes",
    tiers: [
      { tier: "Budget",   apiId: 8387, sellPer1k: 260000, speed: "100-200/day", refill: false },
      { tier: "Standard", apiId: 8388, sellPer1k: 280000, speed: "500-1K/day",  refill: true  },
    ]
  },

  // ═══════════════════════════════════════════
  // LINKEDIN
  // ═══════════════════════════════════════════
  {
    name: "LinkedIn Post Likes", platform: "LinkedIn", type: "likes",
    tiers: [
      { tier: "Standard", apiId: 5472, sellPer1k: 350000, speed: "500-2K/day",  refill: false },
      { tier: "Premium",  apiId: 9417, sellPer1k: 550000, speed: "200-500/day", refill: true  },
    ]
  },
  {
    name: "LinkedIn Followers", platform: "LinkedIn", type: "followers",
    tiers: [
      { tier: "Standard", apiId: 5466, sellPer1k: 600000, speed: "100-500/day", refill: false },
    ]
  },
  {
    name: "LinkedIn Company Followers", platform: "LinkedIn", type: "followers",
    tiers: [
      { tier: "Standard", apiId: 5467, sellPer1k: 600000, speed: "100-500/day", refill: false },
    ]
  },

  // ═══════════════════════════════════════════
  // THREADS
  // ═══════════════════════════════════════════
  {
    name: "Threads Likes", platform: "Threads", type: "likes",
    tiers: [
      { tier: "Standard", apiId: 2776, sellPer1k: 350000, speed: "200-1K/day",  refill: false },
    ]
  },
  {
    name: "Threads Followers", platform: "Threads", type: "followers",
    tiers: [
      { tier: "Standard", apiId: 2775, sellPer1k: 600000, speed: "200-1K/day",  refill: false },
    ]
  },
];

async function seed() {
  console.log('🌱 Seeding Nitro menu...\n');

  // Build apiId → service.id map
  const allApiIds = [...new Set(MENU.flatMap(g => g.tiers.map(t => t.apiId)))];
  const services = await p.service.findMany({
    where: { apiId: { in: allApiIds } },
    select: { id: true, apiId: true },
  });
  const svcMap = {};
  services.forEach(s => { svcMap[s.apiId] = s.id; });

  const missing = allApiIds.filter(id => !svcMap[id]);
  if (missing.length) {
    console.log(`⚠️  Missing MTP service IDs (not in DB): ${missing.join(', ')}`);
    console.log('   Run Sync in admin first, then re-run this script.\n');
  }

  // Clear existing menu
  await p.serviceTier.deleteMany();
  await p.serviceGroup.deleteMany();
  console.log('🗑️  Cleared existing menu\n');

  let groupCount = 0, tierCount = 0, skipped = 0;

  for (let i = 0; i < MENU.length; i++) {
    const g = MENU[i];
    const group = await p.serviceGroup.create({
      data: {
        name: g.name,
        platform: g.platform,
        type: g.type || 'Standard',
        nigerian: g.nigerian || false,
        enabled: true,
        sortOrder: i + 1,
      },
    });
    groupCount++;

    for (let j = 0; j < g.tiers.length; j++) {
      const t = g.tiers[j];
      const serviceId = svcMap[t.apiId];
      if (!serviceId) {
        console.log(`   ⏭️  Skipping ${g.name} → ${t.tier} (apiId ${t.apiId} not found)`);
        skipped++;
        continue;
      }

      await p.serviceTier.create({
        data: {
          groupId: group.id,
          serviceId,
          tier: t.tier,
          sellPer1k: t.sellPer1k,
          refill: t.refill,
          speed: t.speed,
          enabled: true,
          sortOrder: j + 1,
        },
      });
      tierCount++;
    }

    console.log(`   ✅ ${g.platform} → ${g.name} (${g.tiers.length} tiers)`);
  }

  console.log(`\n🎉 Done! ${groupCount} groups, ${tierCount} tiers created, ${skipped} skipped.`);
}

seed().catch(e => { console.error('❌ Seed failed:', e.message); }).finally(() => p.$disconnect());
