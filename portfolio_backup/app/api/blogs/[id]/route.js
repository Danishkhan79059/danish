import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function formatBlog(blog) {
  if (!blog) return null;

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

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Blog ID or Slug is required" },
        { status: 400 }
      );
    }

    const numericId = parseInt(id, 10);
    let blog = null;

    if (!isNaN(numericId)) {
      blog = await prisma.socialblog.findUnique({
        where: { id: numericId },
      });
    }

    // If not found by numeric ID or ID is a slug
    if (!blog) {
      blog = await prisma.socialblog.findUnique({
        where: { slug: id },
      });
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: formatBlog(blog),
      source: "postgresql",
    });
  } catch (error) {
    console.error("GET /api/blogs/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      await prisma.socialblog.delete({
        where: { slug: id },
      });
    } else {
      await prisma.socialblog.delete({
        where: { id: numericId },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/blogs/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
