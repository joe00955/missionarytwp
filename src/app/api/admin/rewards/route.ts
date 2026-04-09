import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rewards = await prisma.reward.findMany({
    include: { _count: { select: { claims: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    rewards: rewards.map((r) => ({
      ...r,
      expiresAt: r.expiresAt.toISOString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      claimCount: r._count.claims,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, tier, cost, category, imageEmoji, stock, challenge, expiresAt, featured } = body;

  if (!title || !description || !tier || !cost || !category || !expiresAt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const adminId = (session.user as Record<string, unknown>).id as string;

  const reward = await prisma.reward.create({
    data: {
      title,
      description,
      tier,
      cost: Number(cost),
      category,
      imageEmoji: imageEmoji || "🎁",
      stock: stock != null ? Number(stock) : -1,
      challenge: tier === "MYTHIC" ? (challenge || null) : null,
      expiresAt: new Date(expiresAt),
      featured: Boolean(featured),
      createdBy: adminId,
    },
  });

  return NextResponse.json({ reward }, { status: 201 });
}
