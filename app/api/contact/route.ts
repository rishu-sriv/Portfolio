import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function avatarUrl(name: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; message?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "name, email, and message are required" },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (message.trim().length < 10) {
    return NextResponse.json(
      { error: "Message must be at least 10 characters" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    await Contact.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      avatar: avatarUrl(name.trim()),
    });
  } catch {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }

  // Optional: send email via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && resendKey !== "your_resend_api_key_here") {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: "rishupayne04@gmail.com",
        subject: `New message from ${name.trim()}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      });
    } catch {
      // Email failure is non-fatal — message is saved to DB
    }
  }

  return NextResponse.json(
    { success: true, message: "Message received. Thank you!" },
    { status: 200 }
  );
}
