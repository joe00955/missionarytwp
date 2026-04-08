import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  const userMissions = await prisma.userMission.findMany({
    where: { userId, status: "available" },
    include: {
      mission: true,
    },
    orderBy: { mission: { deadline: "asc" } },
  });

  const missions = userMissions.map((um) => ({
    id: um.mission.id,
    title: um.mission.title,
    description: um.mission.description,
    points: um.mission.points,
    difficulty: um.mission.difficulty,
    category: um.mission.category,
    deadline: um.mission.deadline.toISOString(),
    status: um.status,
    userMissionId: um.id,
  }));

  return NextResponse.json({ missions });
}
