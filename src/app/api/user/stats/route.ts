import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRankForPoints, getNextRank, getRankProgress } from "@/lib/ranks";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const missions = await prisma.userMission.groupBy({
    by: ["status"],
    where: { userId },
    _count: true,
  });

  const counts = Object.fromEntries(
    missions.map((m) => [m.status, m._count])
  );

  const nextRank = getNextRank(user.points);

  return NextResponse.json({
    points: user.points,
    rank: getRankForPoints(user.points),
    rankProgress: getRankProgress(user.points),
    nextRank: nextRank?.name || null,
    pointsToNext: nextRank?.pointsNeeded || null,
    totalMissions: Object.values(counts).reduce((a, b) => a + b, 0),
    completedMissions: (counts.approved || 0),
    activeMissions: (counts.active || 0) + (counts.submitted || 0) + (counts.under_review || 0),
  });
}
