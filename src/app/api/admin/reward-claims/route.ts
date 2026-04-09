import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const claims = await prisma.rewardClaim.findMany({
    where: { status: "pending" },
    include: {
      user: { select: { id: true, username: true, displayName: true, points: true, rank: true } },
      reward: { select: { id: true, title: true, tier: true, cost: true, category: true, challenge: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    claims: claims.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
  });
}
