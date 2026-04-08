import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const submissions = await prisma.userMission.findMany({
    where: { status: { in: ["under_review", "submitted"] } },
    include: {
      user: { select: { id: true, username: true, displayName: true, points: true, rank: true } },
      mission: true,
    },
    orderBy: { submittedAt: "asc" },
  });

  return NextResponse.json({
    submissions: submissions.map((s) => ({
      id: s.id,
      userId: s.userId,
      missionId: s.missionId,
      status: s.status,
      submission: s.submission,
      submittedAt: s.submittedAt?.toISOString(),
      user: s.user,
      mission: {
        title: s.mission.title,
        description: s.mission.description,
        points: s.mission.points,
        difficulty: s.mission.difficulty,
        category: s.mission.category,
      },
    })),
  });
}
