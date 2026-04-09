import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { action, adminNote } = await request.json();

  if (!action || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const claim = await prisma.rewardClaim.findUnique({
    where: { id },
    include: { reward: true, user: true },
  });

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  if (claim.status !== "pending") {
    return NextResponse.json({ error: "Claim already processed" }, { status: 400 });
  }

  if (action === "approve") {
    await prisma.$transaction([
      prisma.rewardClaim.update({
        where: { id },
        data: { status: "approved", adminNote: adminNote || "Claim approved." },
      }),
      prisma.notification.create({
        data: {
          userId: claim.userId,
          title: "REWARD APPROVED",
          message: `Your claim for "${claim.reward.title}" has been approved! ${adminNote || "An admin will be in touch with fulfillment details."}`,
          type: "system",
          metadata: JSON.stringify({ rewardId: claim.rewardId }),
        },
      }),
    ]);
  } else {
    // Reject: refund points
    await prisma.$transaction([
      prisma.rewardClaim.update({
        where: { id },
        data: { status: "rejected", adminNote: adminNote || "Claim rejected." },
      }),
      prisma.user.update({
        where: { id: claim.userId },
        data: { points: { increment: claim.pointsSpent } },
      }),
      prisma.notification.create({
        data: {
          userId: claim.userId,
          title: "REWARD CLAIM REJECTED",
          message: `Your claim for "${claim.reward.title}" was rejected. ${claim.pointsSpent} points have been refunded. ${adminNote || ""}`,
          type: "system",
          metadata: JSON.stringify({ rewardId: claim.rewardId, refunded: claim.pointsSpent }),
        },
      }),
    ]);
  }

  return NextResponse.json({ success: true });
}
