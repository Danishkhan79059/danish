import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const subscribers = await prisma.newslettersocial.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: subscribers,
      count: subscribers.length,
      source: "postgresql",
    });
  } catch (error) {
    console.error("GET /api/newsletter error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newslettersocial.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        data: existing,
        message: "You are already subscribed to our newsletter!",
        alreadySubscribed: true,
      });
    }

    const subscriber = await prisma.newslettersocial.create({
      data: { email },
    });

    return NextResponse.json(
      {
        success: true,
        data: subscriber,
        message: "Thank you for subscribing to the newsletter!",
        source: "postgresql",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/newsletter error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process newsletter subscription",
      },
      { status: 500 }
    );
  }
}
