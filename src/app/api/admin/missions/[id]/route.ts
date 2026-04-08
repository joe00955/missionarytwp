import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const mission = await prisma.mission.findUnique({
    where: { id },
    include: {
      userMissions: {
        include: { user: { select: { id: true, username: true, displayName: true } } },
      },
    },
  });

  if (!mission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ mission });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const mission = await prisma.mission.update({
    where: { id },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.description && { description: body.description }),
      ...(body.briefing && { briefing: body.briefing }),
      ...(body.points && { points: Number(body.points) }),
      ...(body.difficulty && { difficulty: body.difficulty }),
      ...(body.category && { category: body.category }),
      ...(body.deadline && { deadline: new Date(body.deadline) }),
    },
  });

  return NextResponse.json({ mission });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.userMission.deleteMany({ where: { missionId: id } });
  await prisma.mission.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
