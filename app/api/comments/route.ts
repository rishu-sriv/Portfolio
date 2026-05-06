import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Comment } from "@/models/Comment";

function avatarUrl(name: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

// ── GET /api/comments ─────────────────────────────────────────────────────────
export async function GET() {
  try {
    await connectDB();
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    return NextResponse.json(comments, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// ── POST /api/comments ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { name, message } = await req.json();

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "name and message are required" },
        { status: 400 }
      );
    }
    if (message.trim().length > 500) {
      return NextResponse.json(
        { error: "Message must be under 500 characters" },
        { status: 400 }
      );
    }

    await connectDB();
    const comment = await Comment.create({
      name: name.trim(),
      message: message.trim(),
      avatar: avatarUrl(name.trim()),
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
