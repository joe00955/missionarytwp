import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const missions = await prisma.mission.findMany({
    include: {
      _count: { select: { userMissions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    missions: missions.map((m) => ({
      ...m,
      deadline: m.deadline.toISOString(),
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      assignedCount: m._count.userMissions,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, briefing, points, difficulty, category, deadline, isGlobal, userIds } = body;

  if (!title || !description || !briefing || !points || !category || !deadline) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const adminId = (session.user as Record<string, unknown>).id as string;

  const mission = await prisma.mission.create({
    data: {
      title,
      description,
      briefing,
      points: Number(points),
      difficulty: difficulty || "STANDARD",
      category,
      deadline: new Date(deadline),
      createdBy: adminId,
      isGlobal: Boolean(isGlobal),
    },
  });

  if (isGlobal) {
    const allUsers = await prisma.user.findMany({
      where: { role: "missionary" },
      select: { id: true },
    });
    for (const user of allUsers) {
      await prisma.userMission.create({
        data: { userId: user.id, missionId: mission.id, status: "available" },
      });
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "NEW MISSION AVAILABLE",
          message: `Mission "${mission.title}" has been assigned to you.`,
          type: "mission_assigned",
          metadata: JSON.stringify({ missionId: mission.id }),
        },
      });
    }
  } else if (userIds && Array.isArray(userIds)) {
    for (const uid of userIds) {
      await prisma.userMission.create({
        data: { userId: uid, missionId: mission.id, status: "available" },
      });
      await prisma.notification.create({
        data: {
          userId: uid,
          title: "NEW MISSION AVAILABLE",
          message: `Mission "${mission.title}" has been assigned to you.`,
          type: "mission_assigned",
          metadata: JSON.stringify({ missionId: mission.id }),
        },
      });
    }
  }

  return NextResponse.json({ mission }, { status: 201 });
}
