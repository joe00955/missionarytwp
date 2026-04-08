import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(body.role && { role: body.role }),
      ...(body.displayName !== undefined && { displayName: body.displayName }),
    },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      role: true,
      points: true,
      rank: true,
    },
  });

  return NextResponse.json({ user });
}
