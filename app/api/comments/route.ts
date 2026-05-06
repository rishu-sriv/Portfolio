import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Comment } from "@/models/Comment";

function avatarUrl(name: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serialize(doc: any) {
  return { ...doc, _id: String(doc._id) };
}

export async function GET() {
  try {
    await connectDB();
    const comments = await Comment.find().sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json(comments.map(serialize), { status: 200 });
  } catch {
    // DB not configured or unreachable — return empty list so the UI uses localStorage
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, message, inkColor } = await req.json();

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "name and message are required" }, { status: 400 });
    }
    if (message.trim().length > 500) {
      return NextResponse.json({ error: "Message must be under 500 characters" }, { status: 400 });
    }

    await connectDB();

    const comment = await Comment.create({
      name: name.trim(),
      message: message.trim(),
      avatar: avatarUrl(name.trim()),
      inkColor: inkColor ?? null,
    });

    return NextResponse.json(serialize(comment.toObject()), { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    // If DB not configured, signal client to save locally
    if (msg.includes("not configured") || msg.includes("MONGODB_URI")) {
      return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
