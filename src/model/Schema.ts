import mongoose, { Schema, Document, Types } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
}

interface CSchema extends Document {
  type: string;
  link: string;
  title: string;
  tags: Types.ObjectId[]; // Assuming tags reference another model
  userId: Types.ObjectId | { _id: Types.ObjectId; username: string }; // Updated type for userId
}

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const contentSchema: Schema<CSchema> = new Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "Users", required: true }, // Fixed to a single reference
});

const linkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
});

const Content = mongoose.model("Content", contentSchema);
const Users = mongoose.model<IUser>("Users", userSchema);
const Link = mongoose.model("Links", linkSchema);

export { Users, Content, Link };
