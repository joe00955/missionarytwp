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

  const userMission = await prisma.userMission.findUnique({
    where: { userId_missionId: { userId, missionId: id } },
    include: { mission: true },
  });

  if (!userMission) {
    return NextResponse.json({ error: "Mission not assigned" }, { status: 404 });
  }

  if (userMission.status !== "available") {
    return NextResponse.json({ error: "Mission already accepted" }, { status: 400 });
  }

  if (new Date(userMission.mission.deadline) < new Date()) {
    return NextResponse.json({ error: "Mission deadline passed" }, { status: 400 });
  }

  const updated = await prisma.userMission.update({
    where: { id: userMission.id },
    data: { status: "active", acceptedAt: new Date() },
  });

  return NextResponse.json({ userMission: updated });
}
