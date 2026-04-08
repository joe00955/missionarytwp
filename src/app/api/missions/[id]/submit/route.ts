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
  const { submission } = await request.json();

  if (!submission || submission.trim().length < 10) {
    return NextResponse.json(
      { error: "Submission must be at least 10 characters" },
      { status: 400 }
    );
  }

  const userMission = await prisma.userMission.findUnique({
    where: { userId_missionId: { userId, missionId: id } },
  });

  if (!userMission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  if (userMission.status !== "active") {
    return NextResponse.json(
      { error: "Mission must be active to submit" },
      { status: 400 }
    );
  }

  const updated = await prisma.userMission.update({
    where: { id: userMission.id },
    data: {
      status: "under_review",
      submission: submission.trim(),
      submittedAt: new Date(),
    },
  });

  return NextResponse.json({ userMission: updated });
}
