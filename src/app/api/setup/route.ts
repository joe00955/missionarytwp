import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Check if already seeded
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@twp.io" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Database already seeded. Admin account exists." },
        { status: 200 }
      );
    }

    // Create admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@twp.io",
        password: adminPassword,
        displayName: "System Admin",
        role: "admin",
        points: 0,
        rank: "Shadow Elite",
      },
    });

    // Create demo user
    const demoPassword = await bcrypt.hash("demo123", 10);
    const demo = await prisma.user.create({
      data: {
        username: "ghost_01",
        email: "missionary@twp.io",
        password: demoPassword,
        displayName: "Ghost Protocol",
        role: "missionary",
        points: 150,
        rank: "Operative",
      },
    });

    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const threeWeeks = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

    const missions = await Promise.all([
      prisma.mission.create({
        data: {
          title: "SIGNAL BROADCAST // Stream Protocol Alpha",
          description: "Stream any TWP project for a minimum of 60 minutes on Twitch or YouTube.",
          briefing: "Your objective is to broadcast a live session featuring any TWP project. Engage with your audience, demonstrate the project features, and maintain stream quality throughout. Minimum duration: 60 minutes. Document your viewer count and any notable interactions.",
          points: 100,
          difficulty: "STANDARD",
          category: "STREAM",
          deadline: weekFromNow,
          createdBy: admin.id,
          isGlobal: true,
        },
      }),
      prisma.mission.create({
        data: {
          title: "VISUAL DISPATCH // Content Creation Unit",
          description: "Create a video review or showcase of a TWP project. Minimum 3 minutes.",
          briefing: "Produce a polished video that showcases a TWP project. The video must be at least 3 minutes in length and uploaded to YouTube, TikTok, or Instagram. Include your honest thoughts, highlight key features, and tag @theworldproject in your post.",
          points: 200,
          difficulty: "COVERT",
          category: "VIDEO",
          deadline: twoWeeks,
          createdBy: admin.id,
          isGlobal: true,
        },
      }),
      prisma.mission.create({
        data: {
          title: "NETWORK INFILTRATION // Social Amplification",
          description: "Share TWP content across 3 social platforms with original commentary.",
          briefing: "Deploy across a minimum of 3 social media platforms (Twitter/X, Instagram, TikTok, Reddit, etc.). Each post must contain original commentary about a TWP project — no copy-paste across platforms. Use relevant hashtags and tag official TWP accounts. Screenshot all posts as proof.",
          points: 75,
          difficulty: "RECON",
          category: "SOCIAL",
          deadline: weekFromNow,
          createdBy: admin.id,
          isGlobal: true,
        },
      }),
      prisma.mission.create({
        data: {
          title: "BLACK SITE // Fan Art & Creative Works",
          description: "Create original artwork, music, or creative content inspired by TWP.",
          briefing: "This is a high-value creative mission. Produce an original piece of art, music, writing, or other creative work inspired by The World Project universe. Quality and effort will be evaluated. Submit your work along with a brief description of your creative process and inspiration.",
          points: 500,
          difficulty: "BLACK_OPS",
          category: "CREATIVE",
          deadline: threeWeeks,
          createdBy: admin.id,
          isGlobal: true,
        },
      }),
    ]);

    // Assign missions to demo user
    for (const mission of missions) {
      await prisma.userMission.create({
        data: {
          userId: demo.id,
          missionId: mission.id,
          status: "available",
        },
      });
    }

    // Welcome notification for demo user
    await prisma.notification.create({
      data: {
        userId: demo.id,
        title: "WELCOME TO THE WORLD PROJECT",
        message: "Your missionary clearance has been granted. Check your available missions to begin.",
        type: "system",
      },
    });

    return NextResponse.json({
      message: "Database seeded successfully!",
      accounts: {
        admin: { email: "admin@twp.io", password: "admin123" },
        demo: { email: "missionary@twp.io", password: "demo123" },
      },
      missions: missions.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database. Check server logs." },
      { status: 500 }
    );
  }
}
