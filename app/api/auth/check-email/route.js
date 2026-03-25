import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || email.length < 5) return Response.json({ available: true });

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, emailVerified: true },
    });

    // Email is "available" if no user exists, or user exists but never verified (stale signup)
    const available = !existing || !existing.emailVerified;

    return Response.json({ available });
  } catch {
    return Response.json({ available: true }); // Don't block signup on check failure
  }
}
