import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { id, name } = await request.json();

    if (!id && !name) {
      return NextResponse.json(
        { success: false, error: "Winner ID or Name required" },
        { status: 400 }
      );
    }

    if (prisma?.candidate) {
      try {
        let updated = null;
        const numericId = parseInt(id, 10);

        if (!isNaN(numericId)) {
          updated = await prisma.candidate.update({
            where: { id: numericId },
            data: {
              wins: { increment: 1 },
              lastWonAt: new Date(),
            },
          });
        } else if (name) {
          const found = await prisma.candidate.findFirst({
            where: { name },
          });

          if (found) {
            updated = await prisma.candidate.update({
              where: { id: found.id },
              data: {
                wins: { increment: 1 },
                lastWonAt: new Date(),
              },
            });
          }
        }

        if (updated) {
          return NextResponse.json({
            success: true,
            winner: {
              ...updated,
              _id: String(updated.id),
            },
            source: "postgresql",
          });
        }
      } catch (dbErr) {
        console.warn("PostgreSQL winner update error:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      winner: { id, _id: String(id), name, wins: 1, lastWonAt: new Date() },
      source: "fallback",
    });
  } catch (error) {
    console.error("Winner recording error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record winner" },
      { status: 500 }
    );
  }
}
