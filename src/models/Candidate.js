import { getMongoose } from "@/lib/mongodb";

export async function getCandidateModel() {
  const mongoose = await getMongoose();
  if (!mongoose) return null;

  if (mongoose.models && mongoose.models.Candidate) {
    return mongoose.models.Candidate;
  }

  const CandidateSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Candidate name is required"],
        trim: true,
        maxlength: [80, "Candidate name cannot exceed 80 characters"],
      },
      wins: {
        type: Number,
        default: 0,
      },
      lastWonAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

  return mongoose.model("Candidate", CandidateSchema);
}

export default getCandidateModel;
