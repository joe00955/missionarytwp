import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const rewards = await prisma.reward.findMany({
    where: { expiresAt: { gt: now } },
    include: {
      _count: { select: { claims: true } },
    },
    orderBy: [{ featured: "desc" }, { tier: "asc" }, { cost: "desc" }],
  });

  const userId = (session.user as Record<string, unknown>).id as string;
  const userClaims = await prisma.rewardClaim.findMany({
    where: { userId },
    select: { rewardId: true, status: true },
  });

  const claimMap: Record<string, string> = {};
  for (const c of userClaims) {
    claimMap[c.rewardId] = c.status;
  }

  return NextResponse.json({
    rewards: rewards.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      tier: r.tier,
      cost: r.cost,
      category: r.category,
      imageEmoji: r.imageEmoji,
      stock: r.stock,
      claimed: r._count.claims,
      challenge: r.challenge,
      expiresAt: r.expiresAt.toISOString(),
      featured: r.featured,
      userClaimStatus: claimMap[r.id] || null,
    })),
  });
}
