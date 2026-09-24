import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fallback candidates if DB is newly initialized and empty
let fallbackCandidates = [
  { id: 1, _id: "1", name: "Danish Khan", wins: 0, createdAt: new Date() },
  { id: 2, _id: "2", name: "Rahul Sharma", wins: 0, createdAt: new Date() },
  { id: 3, _id: "3", name: "Priya Verma", wins: 0, createdAt: new Date() },
  { id: 4, _id: "4", name: "Aman Gupta", wins: 0, createdAt: new Date() },
  { id: 5, _id: "5", name: "Sara Ali", wins: 0, createdAt: new Date() },
];

function formatCandidate(c) {
  return {
    ...c,
    _id: String(c.id),
  };
}

export async function GET() {
  try {
    if (prisma?.candidate) {
      const candidates = await prisma.candidate.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (candidates.length > 0) {
        return NextResponse.json({
          success: true,
          data: candidates.map(formatCandidate),
          source: "postgresql",
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: fallbackCandidates,
      source: "memory_fallback",
    });
  } catch (error) {
    console.error("GET candidates PostgreSQL error:", error);
    return NextResponse.json({
      success: true,
      data: fallbackCandidates,
      source: "memory_fallback",
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Candidate name is required" },
        { status: 400 }
      );
    }

    if (prisma?.candidate) {
      try {
        const newCandidate = await prisma.candidate.create({
          data: { name },
        });

        return NextResponse.json(
          {
            success: true,
            data: formatCandidate(newCandidate),
            source: "postgresql",
          },
          { status: 201 }
        );
      } catch (dbErr) {
        console.warn("PostgreSQL insert error, using session memory:", dbErr);
      }
    }

    const fallbackItem = {
      id: Date.now(),
      _id: String(Date.now()),
      name,
      wins: 0,
      createdAt: new Date(),
    };
    fallbackCandidates.push(fallbackItem);

    return NextResponse.json(
      {
        success: true,
        data: fallbackItem,
        source: "memory_fallback",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST candidate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("all") === "true";

    if (prisma?.candidate) {
      try {
        if (clearAll) {
          await prisma.candidate.deleteMany({});
          fallbackCandidates = [];
          return NextResponse.json({ success: true, message: "All candidates cleared" });
        }

        if (id) {
          const numericId = parseInt(id, 10);
          if (!isNaN(numericId)) {
            await prisma.candidate.delete({
              where: { id: numericId },
            });
          }
          fallbackCandidates = fallbackCandidates.filter((c) => String(c.id) !== String(id) && c._id !== id);
          return NextResponse.json({ success: true, message: "Candidate deleted" });
        }
      } catch (dbErr) {
        console.warn("PostgreSQL candidate delete error, updating memory:", dbErr);
      }
    }

    if (clearAll) {
      fallbackCandidates = [];
    } else if (id) {
      fallbackCandidates = fallbackCandidates.filter((c) => String(c.id) !== String(id) && c._id !== id);
    }

    return NextResponse.json({
      success: true,
      message: "Candidate removed",
    });
  } catch (error) {
    console.error("DELETE candidate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete candidate" },
      { status: 500 }
    );
  }
}
