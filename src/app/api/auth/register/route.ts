import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? "Email already in use" : "Username already taken" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Assign all global missions to new user
    const globalMissions = await prisma.mission.findMany({
      where: { isGlobal: true, deadline: { gt: new Date() } },
    });

    for (const mission of globalMissions) {
      await prisma.userMission.create({
        data: {
          userId: user.id,
          missionId: mission.id,
          status: "available",
        },
      });
    }

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "WELCOME TO THE WORLD PROJECT",
        message: "Your missionary clearance has been granted. Check your available missions to begin.",
        type: "system",
      },
    });

    return NextResponse.json(
      { message: "Account created", userId: user.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
