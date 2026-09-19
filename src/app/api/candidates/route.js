import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import getCandidateModel from "@/models/Candidate";

// In-memory fallback if MongoDB or Mongoose is waiting to be connected/installed
let fallbackCandidates = [
  { _id: "fallback-1", name: "Danish Khan", wins: 0, createdAt: new Date() },
  { _id: "fallback-2", name: "Rahul Sharma", wins: 0, createdAt: new Date() },
  { _id: "fallback-3", name: "Priya Verma", wins: 0, createdAt: new Date() },
  { _id: "fallback-4", name: "Aman Gupta", wins: 0, createdAt: new Date() },
  { _id: "fallback-5", name: "Sara Ali", wins: 0, createdAt: new Date() },
];

export async function GET() {
  try {
    const conn = await connectToDatabase();
    const Candidate = await getCandidateModel();

    if (conn && Candidate) {
      const candidates = await Candidate.find({}).sort({ createdAt: 1 }).lean();
      return NextResponse.json({
        success: true,
        data: candidates,
        source: "mongodb",
      });
    }

    return NextResponse.json({
      success: true,
      data: fallbackCandidates,
      source: "memory_fallback",
    });
  } catch (error) {
    console.error("GET candidates fallback error:", error);
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

    try {
      const conn = await connectToDatabase();
      const Candidate = await getCandidateModel();

      if (conn && Candidate) {
        const newCandidate = await Candidate.create({ name });
        return NextResponse.json(
          { success: true, data: newCandidate, source: "mongodb" },
          { status: 201 }
        );
      }
    } catch (dbErr) {
      console.warn("MongoDB insert error, using session memory:", dbErr);
    }

    const fallbackItem = {
      _id: `fallback-${Date.now()}`,
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

    try {
      const conn = await connectToDatabase();
      const Candidate = await getCandidateModel();

      if (conn && Candidate) {
        if (clearAll) {
          await Candidate.deleteMany({});
          fallbackCandidates = [];
          return NextResponse.json({ success: true, message: "All candidates cleared" });
        }

        if (id && !id.startsWith("fallback-") && !id.startsWith("seed-") && !id.startsWith("local-")) {
          await Candidate.findByIdAndDelete(id);
          fallbackCandidates = fallbackCandidates.filter((c) => c._id !== id);
          return NextResponse.json({ success: true, message: "Candidate deleted" });
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB delete error, applying to session memory:", dbErr);
    }

    if (clearAll) {
      fallbackCandidates = [];
    } else if (id) {
      fallbackCandidates = fallbackCandidates.filter((c) => c._id !== id);
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
