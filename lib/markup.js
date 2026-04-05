// Nitro markup calculator
// Cost and sell prices are in kobo (100 kobo = ₦1)
// Rates are per 1K units

const MARKUP_TIERS = [
  { max: 2000, multiplier: 3 },       // ₦0–20 cost → 3x
  { max: 20000, multiplier: 2.5 },    // ₦20–200 cost → 2.5x
  { max: 100000, multiplier: 2 },     // ₦200–1K cost → 2x
  { max: 500000, multiplier: 1.7 },   // ₦1K–5K cost → 1.7x
  { max: 2000000, multiplier: 1.5 },  // ₦5K–20K cost → 1.5x
  { max: Infinity, multiplier: 1.35 }, // ₦20K+ cost → 1.35x
];

const MIN_MARGIN = 0.5; // 50% minimum margin floor

/**
 * Calculate sell price from cost per 1K (in kobo)
 * @param {number} costPer1k - cost in kobo per 1K units
 * @returns {number} sellPer1k - sell price in kobo per 1K units (rounded up)
 */
export function calculateMarkup(costPer1k) {
  if (!costPer1k || costPer1k <= 0) return 0;

  // Find the right tier
  const tier = MARKUP_TIERS.find(t => costPer1k <= t.max);
  const multiplier = tier ? tier.multiplier : 1.35;

  let sellPrice = Math.ceil(costPer1k * multiplier);

  // Enforce 50% minimum margin floor
  const minSell = Math.ceil(costPer1k * (1 + MIN_MARGIN));
  if (sellPrice < minSell) sellPrice = minSell;

  return sellPrice;
}

/**
 * Get the markup multiplier for a given cost
 * @param {number} costPer1k - cost in kobo per 1K
 * @returns {number} multiplier
 */
export function getMultiplier(costPer1k) {
  if (!costPer1k || costPer1k <= 0) return 3;
  const tier = MARKUP_TIERS.find(t => costPer1k <= t.max);
  return tier ? tier.multiplier : 1.35;
}

/**
 * Format kobo to Naira string
 * @param {number} kobo
 * @returns {string}
 */
export function koboToNaira(kobo) {
  return `₦${(kobo / 100).toLocaleString('en-NG')}`;
}

/**
 * Calculate margin percentage
 * @param {number} cost
 * @param {number} sell
 * @returns {number} margin percentage
 */
export function marginPercent(cost, sell) {
  if (!cost || cost <= 0) return 0;
  return Math.round(((sell - cost) / cost) * 100);
}
