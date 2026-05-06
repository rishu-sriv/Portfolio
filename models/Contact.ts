import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  avatar: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>({
  name:      { type: String, required: true, trim: true, maxlength: 80 },
  email:     { type: String, required: true, trim: true, lowercase: true },
  message:   { type: String, required: true, trim: true, maxlength: 2000 },
  avatar:    { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const Contact: Model<IContact> =
  mongoose.models.Contact ??
  mongoose.model<IContact>("Contact", ContactSchema);
