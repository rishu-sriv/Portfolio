import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  name: string;
  message: string;
  avatar: string;
  inkColor?: string | null;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  name:      { type: String, required: true, trim: true, maxlength: 80 },
  message:   { type: String, required: true, trim: true, maxlength: 500 },
  avatar:    { type: String, required: true },
  inkColor:  { type: String, default: null },
  createdAt: { type: Date, default: () => new Date() },
});

export const Comment: Model<IComment> =
  mongoose.models.Comment ??
  mongoose.model<IComment>("Comment", CommentSchema);
