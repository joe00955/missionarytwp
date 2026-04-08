import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = (session.user as Record<string, unknown>).id as string;

  const mission = await prisma.mission.findUnique({ where: { id } });
  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  const userMission = await prisma.userMission.findUnique({
    where: { userId_missionId: { userId, missionId: id } },
  });

  return NextResponse.json({
    mission: {
      ...mission,
      deadline: mission.deadline.toISOString(),
      createdAt: mission.createdAt.toISOString(),
      updatedAt: mission.updatedAt.toISOString(),
    },
    userMission: userMission
      ? {
          id: userMission.id,
          status: userMission.status,
          acceptedAt: userMission.acceptedAt?.toISOString(),
          submittedAt: userMission.submittedAt?.toISOString(),
          reviewedAt: userMission.reviewedAt?.toISOString(),
          submission: userMission.submission,
          reviewNote: userMission.reviewNote,
          pointsAwarded: userMission.pointsAwarded,
        }
      : null,
  });
}
