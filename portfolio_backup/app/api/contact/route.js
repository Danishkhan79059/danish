import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactNotification } from "@/lib/mail";

export async function GET() {
  try {
    const contacts = await prisma.contactform.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: contacts,
      count: contacts.length,
      source: "postgresql",
    });
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone = "", company = "", subject, projectType, message } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const trimmedSubject = (subject || projectType || "General Inquiry").trim();
    const trimmedPhone = (phone || "").trim();
    const trimmedCompany = company?.trim() || null;

    // 1. Save to PostgreSQL database
    const contactEntry = await prisma.contactform.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: trimmedPhone,
        company: trimmedCompany,
        subject: trimmedSubject,
        message: message.trim(),
      },
    });

    // 2. Send email notification asynchronously using env credentials
    sendContactNotification({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: trimmedPhone,
      company: trimmedCompany,
      subject: trimmedSubject,
      message: message.trim(),
    }).catch((mailErr) => {
      console.warn("Contact notification email delivery failed:", mailErr?.message || mailErr);
    });

    return NextResponse.json(
      {
        success: true,
        data: contactEntry,
        message: "Message successfully submitted and saved to PostgreSQL database!",
        source: "postgresql",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save contact message",
      },
      { status: 500 }
    );
  }
}
