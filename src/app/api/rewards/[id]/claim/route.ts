import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = (session.user as Record<string, unknown>).id as string;
  const body = await request.json();

  const reward = await prisma.reward.findUnique({
    where: { id },
    include: { _count: { select: { claims: true } } },
  });

  if (!reward) {
    return NextResponse.json({ error: "Reward not found" }, { status: 404 });
  }

  if (new Date() > reward.expiresAt) {
    return NextResponse.json({ error: "This reward has expired" }, { status: 400 });
  }

  if (reward.stock !== -1 && reward._count.claims >= reward.stock) {
    return NextResponse.json({ error: "This reward is out of stock" }, { status: 400 });
  }

  const existingClaim = await prisma.rewardClaim.findFirst({
    where: { userId, rewardId: id, status: { in: ["pending", "approved", "fulfilled"] } },
  });

  if (existingClaim) {
    return NextResponse.json({ error: "You have already claimed this reward" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.points < reward.cost) {
    return NextResponse.json({ error: "Not enough points" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.rewardClaim.create({
      data: {
        userId,
        rewardId: id,
        status: "pending",
        pointsSpent: reward.cost,
        note: body.note || null,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { points: { decrement: reward.cost } },
    }),
    prisma.notification.create({
      data: {
        userId,
        title: "REWARD CLAIMED",
        message: `Your claim for "${reward.title}" is pending admin review. ${reward.cost} points have been deducted.`,
        type: "system",
        metadata: JSON.stringify({ rewardId: reward.id, cost: reward.cost }),
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
