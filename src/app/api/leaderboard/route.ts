import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: { role: "missionary" },
    select: {
      id: true,
      username: true,
      displayName: true,
      points: true,
      rank: true,
      _count: {
        select: {
          userMissions: { where: { status: "approved" } },
        },
      },
    },
    orderBy: { points: "desc" },
    take: 50,
  });

  const leaderboard = users.map((u, i) => ({
    position: i + 1,
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    points: u.points,
    rank: u.rank,
    completedMissions: u._count.userMissions,
  }));

  return NextResponse.json({ leaderboard });
}
