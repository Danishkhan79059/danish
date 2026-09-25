import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function POST(req) {
  try {
    const body = await req.json();
    let rawToken = body?.token;

    if (!rawToken || typeof rawToken !== "string" || !rawToken.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid JWT token string." },
        { status: 400 }
      );
    }

    // Sanitize token: remove 'Bearer ' prefix, quotes, and whitespace
    let token = rawToken.trim();
    if (token.toLowerCase().startsWith("bearer ")) {
      token = token.slice(7).trim();
    }
    token = token.replace(/^["']|["']$/g, "").trim();

    const parts = token.split(".");
    if (parts.length < 2 || parts.length > 3) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JWT format: A JSON Web Token must contain at least 2 or 3 parts separated by dots (header.payload[.signature]).",
        },
        { status: 400 }
      );
    }

    // Decode Header using jwt-decode
    let header;
    try {
      header = jwtDecode(token, { header: true });
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          error: `Header decoding failed: ${err.message || "Invalid Base64URL or JSON in header"}`,
        },
        { status: 400 }
      );
    }

    // Decode Payload using jwt-decode
    let payload;
    try {
      payload = jwtDecode(token);
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          error: `Payload decoding failed: ${err.message || "Invalid Base64URL or JSON in payload"}`,
        },
        { status: 400 }
      );
    }

    const signature = parts[2] || "";

    // Calculate expiration status
    let expirationStatus = "no_exp";
    if (typeof payload.exp === "number") {
      const currentEpoch = Math.floor(Date.now() / 1000);
      expirationStatus = payload.exp > currentEpoch ? "valid" : "expired";
    }

    const headerBytes = new TextEncoder().encode(JSON.stringify(header)).length;
    const payloadBytes = new TextEncoder().encode(JSON.stringify(payload)).length;

    return NextResponse.json({
      success: true,
      raw: token,
      headerPart: parts[0],
      payloadPart: parts[1],
      signaturePart: signature,
      header,
      payload,
      signature,
      headerSize: headerBytes,
      payloadSize: payloadBytes,
      claimsCount: Object.keys(payload).length,
      expirationStatus,
    });
  } catch (err) {
    console.error("JWT Decode API Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to decode JWT: ${err.message || "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
