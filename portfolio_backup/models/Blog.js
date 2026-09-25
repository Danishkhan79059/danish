import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    subject: {
      type: String,
      required: [true, "Blog subject/category is required"],
      trim: true,
      maxlength: [100, "Subject cannot exceed 100 characters"],
    },
    summary: {
      type: String,
      required: [true, "Blog summary/description is required"],
      trim: true,
      maxlength: [1200, "Summary cannot exceed 1200 characters"],
    },
    content: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "Danish Khan",
    },
    readTime: {
      type: String,
      default: "3 min read",
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Reuse compiled model in Next.js development hot-reload
const Blog = mongoose.models?.Blog || mongoose.model("Blog", BlogSchema);

export async function getBlogModel() {
  return Blog;
}

export default Blog;
