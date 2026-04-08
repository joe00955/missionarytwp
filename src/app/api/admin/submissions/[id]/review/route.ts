import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRankForPoints } from "@/lib/ranks";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { action, reviewNote } = await request.json();

  if (!action || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const userMission = await prisma.userMission.findUnique({
    where: { id },
    include: { mission: true, user: true },
  });

  if (!userMission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!["under_review", "submitted"].includes(userMission.status)) {
    return NextResponse.json({ error: "Not reviewable" }, { status: 400 });
  }

  if (action === "approve") {
    const pointsToAward = userMission.mission.points;
    const newPoints = userMission.user.points + pointsToAward;
    const newRank = getRankForPoints(newPoints);
    const rankChanged = newRank !== userMission.user.rank;

    await prisma.$transaction([
      prisma.userMission.update({
        where: { id },
        data: {
          status: "approved",
          pointsAwarded: pointsToAward,
          reviewedAt: new Date(),
          reviewNote: reviewNote || "Mission verified by wrldAI.",
        },
      }),
      prisma.user.update({
        where: { id: userMission.userId },
        data: { points: newPoints, rank: newRank },
      }),
      prisma.notification.create({
        data: {
          userId: userMission.userId,
          title: "MISSION VERIFIED",
          message: `Your submission for "${userMission.mission.title}" has been approved. +${pointsToAward} points awarded.`,
          type: "mission_approved",
          metadata: JSON.stringify({
            missionId: userMission.missionId,
            points: pointsToAward,
            newTotal: newPoints,
            rankUp: rankChanged ? newRank : null,
          }),
        },
      }),
    ]);

    if (rankChanged) {
      await prisma.notification.create({
        data: {
          userId: userMission.userId,
          title: "RANK PROMOTION",
          message: `You have been promoted to ${newRank}. Continue your operations.`,
          type: "rank_up",
          metadata: JSON.stringify({ newRank }),
        },
      });
    }
  } else {
    await prisma.$transaction([
      prisma.userMission.update({
        where: { id },
        data: {
          status: "rejected",
          reviewedAt: new Date(),
          reviewNote: reviewNote || "Submission did not meet requirements.",
        },
      }),
      prisma.notification.create({
        data: {
          userId: userMission.userId,
          title: "SUBMISSION REJECTED",
          message: `Your submission for "${userMission.mission.title}" was not approved. ${reviewNote || "Review the requirements and try again."}`,
          type: "mission_rejected",
          metadata: JSON.stringify({ missionId: userMission.missionId }),
        },
      }),
    ]);
  }

  return NextResponse.json({ success: true });
}
