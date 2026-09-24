import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadBase64ToMinio } from "@/lib/minio";

// Helper to generate a slug from title
function generateSlug(title) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${baseSlug}-${Date.now().toString(36)}`;
}

// Helper to format blog object for full compatibility with existing frontend
function formatBlog(blog) {
  if (!blog) return null;

  // Extract content text if stored as JSON object or string
  let parsedContent = blog.content;
  if (typeof parsedContent === "object" && parsedContent !== null) {
    parsedContent = parsedContent.text || parsedContent.content || JSON.stringify(parsedContent);
  }

  return {
    ...blog,
    _id: String(blog.id),
    id: blog.id,
    subject: blog.category,
    summary: blog.description,
    image: blog.featuredImage,
    readTime: blog.readingTime,
    content: parsedContent || "",
  };
}

export async function GET() {
  try {
    const blogs = await prisma.socialblog.findMany({
      orderBy: { createdAt: "desc" },
    });

    const formattedBlogs = blogs.map(formatBlog);

    return NextResponse.json({
      success: true,
      data: formattedBlogs,
      count: formattedBlogs.length,
      source: "postgresql",
    });
  } catch (error) {
    console.error("GET /api/blogs PostgreSQL error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch blogs from PostgreSQL database",
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
      category,
      summary,
      description,
      content = "",
      image = "",
      featuredImage = "",
      author = "Danish Khan",
      tags = [],
      readingTime,
      readTime,
      slug: customSlug,
    } = body;

    // Validation
    const blogTitle = (title || "").trim();
    if (!blogTitle) {
      return NextResponse.json(
        { success: false, error: "Blog title is required" },
        { status: 400 }
      );
    }

    const blogCategory = (category || subject || "").trim();
    if (!blogCategory) {
      return NextResponse.json(
        { success: false, error: "Category / Subject is required" },
        { status: 400 }
      );
    }

    const blogDesc = (description || summary || "").trim();
    if (!blogDesc) {
      return NextResponse.json(
        { success: false, error: "Description / Summary is required" },
        { status: 400 }
      );
    }

    // Image Handling: Upload to MinIO if base64 data URL
    let rawImage = (image || featuredImage || "").trim();
    let finalImageUrl = rawImage || "/aishiplogo.png";

    if (rawImage.startsWith("data:image/")) {
      try {
        finalImageUrl = await uploadBase64ToMinio(rawImage, "blog-cover");
      } catch (uploadErr) {
        console.error("Failed to upload image to MinIO:", uploadErr);
        // Fallback to default if upload fails
        finalImageUrl = "/aishiplogo.png";
      }
    }

    // Calculate approximate read time if not provided
    const totalWords = `${blogTitle} ${blogDesc} ${typeof content === "string" ? content : ""}`.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(totalWords / 150));
    const calculatedReadTime = readingTime || readTime || `${minutes} min read`;

    // Process tags
    let processedTags = Array.isArray(tags) ? tags : [];
    if (typeof tags === "string") {
      processedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (t.startsWith("#") ? t : `#${t}`));
    }
    if (processedTags.length === 0) {
      processedTags = [`#${blogCategory.replace(/\s+/g, "")}`];
    }

    // Slug generation
    const slug = customSlug ? customSlug.trim() : generateSlug(blogTitle);

    // Save to PostgreSQL via Prisma
    const createdBlog = await prisma.socialblog.create({
      data: {
        title: blogTitle,
        slug,
        description: blogDesc,
        content: typeof content === "string" ? { text: content } : (content || {}),
        featuredImage: finalImageUrl,
        author: author?.trim() || "Danish Khan",
        category: blogCategory,
        tags: processedTags,
        readingTime: calculatedReadTime,
        isPublished: true,
        publishedDate: new Date(),
      },
    });

    const formatted = formatBlog(createdBlog);

    return NextResponse.json(
      {
        success: true,
        data: formatted,
        message: "Blog post successfully saved to PostgreSQL database with MinIO image storage!",
        source: "postgresql",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/blogs PostgreSQL write error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save blog in PostgreSQL database",
      },
      { status: 500 }
    );
  }
}
