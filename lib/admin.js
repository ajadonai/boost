import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

// ═══════════════════════════════════════════
// ROLE DEFINITIONS
// ═══════════════════════════════════════════

// Pages each role can VIEW
const ROLE_PAGES = {
  owner: '*',
  superadmin: '*',
  admin: ['overview', 'orders', 'users', 'services', 'menu-builder', 'tickets', 'blog', 'alerts', 'coupons', 'activity', 'analytics', 'pricing'],
  support: ['overview', 'tickets', 'users', 'orders'],
  finance: ['overview', 'analytics', 'payments', 'orders'],
};

// Pages each role can WRITE (mutate data)
const ROLE_WRITE_PAGES = {
  owner: '*',
  superadmin: '*',
  admin: ['orders', 'users', 'services', 'menu-builder', 'tickets', 'blog', 'alerts', 'coupons', 'pricing'],
  support: ['tickets', 'orders'], // reply to tickets, check/cancel orders
  finance: ['orders'], // process refunds
};

// Actions restricted to specific roles (beyond page access)
const RESTRICTED_ACTIONS = {
  // Only owner can do these
  'team.delete': ['owner'],
  'team.changeRole': ['owner'],
  'team.create': ['owner', 'superadmin'],
  // Only owner + superadmin
  'maintenance.toggle': ['owner', 'superadmin'],
  'payments.configure': ['owner', 'superadmin'],
  'notifications.send': ['owner', 'superadmin'],
  'api.sync': ['owner', 'superadmin', 'admin'],
  'settings.save': ['owner', 'superadmin'],
  'users.ban': ['owner', 'superadmin', 'admin'],
  'users.adjustBalance': ['owner', 'superadmin'],
};

// ═══════════════════════════════════════════
// CORE AUTH FUNCTION
// ═══════════════════════════════════════════

/**
 * Verify admin is authenticated and check permissions
 * @param {string} requiredPage - page slug to check access for
 * @param {boolean} requireWrite - require write access (not view-only)
 * @returns {{ admin, error }}
 */
export async function requireAdmin(requiredPage = null, requireWrite = false) {
  const payload = await getCurrentAdmin();
  if (!payload) {
    return { admin: null, error: Response.json({ error: 'Not authenticated' }, { status: 401 }) };
  }

  const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
  if (!admin || admin.status !== 'Active') {
    return { admin: null, error: Response.json({ error: 'Admin not found or inactive' }, { status: 403 }) };
  }

  // Resolve accessible pages (custom overrides > role defaults)
  const resolvedPages = getAdminPages(admin);

  // Check page access
  if (requiredPage) {
    if (resolvedPages !== '*' && !resolvedPages.includes(requiredPage)) {
      return { admin: null, error: Response.json({ error: 'Access denied' }, { status: 403 }) };
    }
  }

  // Check write access
  if (requireWrite && requiredPage) {
    const writePages = getAdminWritePages(admin);
    if (writePages !== '*' && !writePages.includes(requiredPage)) {
      return { admin: null, error: Response.json({ error: 'View-only access' }, { status: 403 }) };
    }
  }

  return { admin, error: null };
}

/**
 * Check if admin can perform a restricted action
 * @param {object} admin - admin object from DB
 * @param {string} action - action key like 'team.delete'
 * @returns {boolean}
 */
export function canPerformAction(admin, action) {
  const allowed = RESTRICTED_ACTIONS[action];
  if (!allowed) return true; // unrestricted action
  return allowed.includes(admin.role);
}

/**
 * Get resolved page list for an admin (customPages override role defaults)
 */
export function getAdminPages(admin) {
  // Custom pages override — if set, use those
  if (admin.customPages) {
    try {
      const custom = JSON.parse(admin.customPages);
      if (Array.isArray(custom) && custom.length > 0) return custom;
    } catch {}
  }
  // Fall back to role defaults
  return ROLE_PAGES[admin.role] || [];
}

/**
 * Get write-accessible pages for an admin
 */
export function getAdminWritePages(admin) {
  if (admin.role === 'owner' || admin.role === 'superadmin') return '*';

  const roleWrite = ROLE_WRITE_PAGES[admin.role] || [];

  // If custom pages are set, grant write to ALL custom pages
  if (admin.customPages) {
    try {
      const custom = JSON.parse(admin.customPages);
      if (Array.isArray(custom) && custom.length > 0) return custom;
    } catch {}
  }

  return roleWrite;
}

/**
 * Log an admin action
 */
export async function logActivity(adminName, action, type = 'action') {
  try {
    await prisma.activityLog.create({
      data: { adminName, action, type },
    });
  } catch (e) {
    console.error('[ActivityLog] Failed to log:', e.message);
  }
}

// Export role config for frontend use
export const ROLES = ROLE_PAGES;
export const WRITE_ROLES_MAP = ROLE_WRITE_PAGES;
