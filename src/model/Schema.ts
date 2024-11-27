import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
}

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Users = mongoose.model<IUser>("Users", userSchema);

export { Users };
