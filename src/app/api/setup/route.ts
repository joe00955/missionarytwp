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

    // Sample rewards for the shop
    const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const twoMonths = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    await Promise.all([
      prisma.reward.create({
        data: {
          title: "SINGULARITY PASS // All-Access Vacation Package",
          description: "A fully paid vacation package for 2 to a destination of your choice. Flights, hotel, and spending money included. The ultimate reward for the ultimate missionary.",
          tier: "MYTHIC",
          cost: 25000,
          category: "TRAVEL",
          imageEmoji: "🌍",
          stock: 1,
          challenge: "You must have completed at least 50 approved missions AND hold the rank of Commander or higher. Submit a 500-word essay on what TWP means to you.",
          expiresAt: twoMonths,
          featured: true,
          createdBy: admin.id,
        },
      }),
      prisma.reward.create({
        data: {
          title: "PHANTOM PROTOCOL // $500 Cash Drop",
          description: "$500 sent directly to your PayPal or bank account. No questions asked. Pure cash for your dedication.",
          tier: "LEGENDARY",
          cost: 10000,
          category: "CASH",
          imageEmoji: "💰",
          stock: 3,
          expiresAt: monthFromNow,
          featured: true,
          createdBy: admin.id,
        },
      }),
      prisma.reward.create({
        data: {
          title: "FRONT ROW // Concert or Match Tickets",
          description: "Two premium tickets to a concert, football match, or live event of your choice (up to $200 value per ticket).",
          tier: "LEGENDARY",
          cost: 8000,
          category: "EXPERIENCE",
          imageEmoji: "🎟️",
          stock: 5,
          expiresAt: twoMonths,
          featured: false,
          createdBy: admin.id,
        },
      }),
      prisma.reward.create({
        data: {
          title: "ARSENAL DROP // Any Game of Your Choice",
          description: "Any game on Steam, PlayStation, Xbox, or Nintendo eShop up to $70 value. Just tell us what you want.",
          tier: "EPIC",
          cost: 2000,
          category: "GAMING",
          imageEmoji: "🎮",
          stock: -1,
          expiresAt: monthFromNow,
          createdBy: admin.id,
        },
      }),
      prisma.reward.create({
        data: {
          title: "SUPPLY CACHE // $50 Gift Card",
          description: "A $50 gift card to Amazon, Steam, or a store of your choice. Versatile and valuable.",
          tier: "GOLD",
          cost: 1500,
          category: "PRODUCT",
          imageEmoji: "🎁",
          stock: -1,
          expiresAt: monthFromNow,
          createdBy: admin.id,
        },
      }),
      prisma.reward.create({
        data: {
          title: "OPERATIVE GEAR // TWP Merch Bundle",
          description: "Exclusive TWP hoodie, t-shirt, and sticker pack. Rep the project in the real world.",
          tier: "SILVER",
          cost: 500,
          category: "PRODUCT",
          imageEmoji: "👟",
          stock: 20,
          expiresAt: monthFromNow,
          createdBy: admin.id,
        },
      }),
      prisma.reward.create({
        data: {
          title: "SIGNAL BOOST // 1000 V-Bucks / Robux",
          description: "1000 V-Bucks (Fortnite) or equivalent Robux (Roblox). Your choice of in-game currency.",
          tier: "SILVER",
          cost: 400,
          category: "GAMING",
          imageEmoji: "⚡",
          stock: -1,
          expiresAt: monthFromNow,
          createdBy: admin.id,
        },
      }),
      prisma.reward.create({
        data: {
          title: "FIELD RATION // $10 Gift Card",
          description: "A quick $10 gift card to Amazon, Steam, or a store of your choice. Small but steady.",
          tier: "BRONZE",
          cost: 150,
          category: "PRODUCT",
          imageEmoji: "🃏",
          stock: -1,
          expiresAt: monthFromNow,
          createdBy: admin.id,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Database seeded successfully!",
      accounts: {
        admin: { email: "admin@twp.io", password: "admin123" },
        demo: { email: "missionary@twp.io", password: "demo123" },
      },
      missions: missions.length,
      rewards: 8,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database. Check server logs." },
      { status: 500 }
    );
  }
}
