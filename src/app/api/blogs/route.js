import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: blogs,
      count: blogs.length,
      source: "mongodb",
    });
  } catch (error) {
    console.error("GET /api/blogs MongoDB error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch blogs from database",
        data: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      subject,
      summary,
      content = "",
      image = "",
      author = "Danish Khan",
      tags = [],
    } = body;

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Blog title is required" },
        { status: 400 }
      );
    }

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { success: false, error: "Subject / Category is required" },
        { status: 400 }
      );
    }

    if (!summary || !summary.trim()) {
      return NextResponse.json(
        { success: false, error: "Summary / Description is required" },
        { status: 400 }
      );
    }

    // Calculate approximate read time
    const totalWords = `${title} ${summary} ${content}`.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(totalWords / 150));
    const calculatedReadTime = `${minutes} min read`;

    // Process tags
    let processedTags = Array.isArray(tags) ? tags : [];
    if (typeof tags === "string") {
      processedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (t.startsWith("#") ? t : `#${t}`));
    }

    // Connect to database directly
    await connectToDatabase();

    const newBlogPayload = {
      title: title.trim(),
      subject: subject.trim(),
      summary: summary.trim(),
      content: content.trim(),
      image: image.trim(),
      author: author.trim() || "Danish Khan",
      readTime: calculatedReadTime,
      tags:
        processedTags.length > 0
          ? processedTags
          : [`#${subject.replace(/\s+/g, "")}`],
    };

    // Save directly to MongoDB Atlas
    const createdBlog = await Blog.create(newBlogPayload);

    return NextResponse.json(
      {
        success: true,
        data: createdBlog,
        message: "Blog post successfully saved to MongoDB Atlas database!",
        source: "mongodb",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/blogs MongoDB write error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save blog in MongoDB database",
      },
      { status: 500 }
    );
  }
}
