import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { google } from "googleapis";
import { authOptions } from "@/lib/auth";

interface ExtendedSession {
  accessToken?: string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !(session as ExtendedSession).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { to, subject, body } = await req.json();

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: (session as ExtendedSession).accessToken });

    const gmail = google.gmail({ version: "v1", auth });

    const emailLines = [
      `To: ${to}`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${subject}`,
      "",
      body,
    ];
    const email = emailLines.join("\r\n");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: Buffer.from(email).toString("base64"),
      },
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
} 