import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import getCandidateModel from "@/models/Candidate";

export async function POST(request) {
  try {
    const { id, name } = await request.json();

    if (!id && !name) {
      return NextResponse.json(
        { success: false, error: "Winner ID or Name required" },
        { status: 400 }
      );
    }

    try {
      const conn = await connectToDatabase();
      const Candidate = await getCandidateModel();

      if (conn && Candidate) {
        let updated = null;
        if (id && !id.startsWith("fallback-") && !id.startsWith("seed-") && !id.startsWith("local-")) {
          updated = await Candidate.findByIdAndUpdate(
            id,
            { $inc: { wins: 1 }, $set: { lastWonAt: new Date() } },
            { new: true }
          );
        } else if (name) {
          updated = await Candidate.findOneAndUpdate(
            { name },
            { $inc: { wins: 1 }, $set: { lastWonAt: new Date() } },
            { new: true }
          );
        }

        if (updated) {
          return NextResponse.json({
            success: true,
            winner: updated,
          });
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB winner update error:", dbErr);
    }

    return NextResponse.json({
      success: true,
      winner: { id, name, wins: 1, lastWonAt: new Date() },
    });
  } catch (error) {
    console.error("Winner recording error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record winner" },
      { status: 500 }
    );
  }
}
