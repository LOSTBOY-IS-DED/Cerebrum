import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
}

interface CSchema extends Document {
  type: string;
  link: string;
  title: string;
  tags: string[];
  userId: mongoose.Types.ObjectId;
}

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const contentSchema: Schema<CSchema> = new Schema({
  type: {
    type: String,
    enum: ["document", "tweet", "youtube", "link"],
    required: true,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  tags: {
    type: [String],
    required: true,
    validate: {
      validator: function (v: any) {
        return v.length > 0;
      },
      message: "At least one tag is required",
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

const Content = mongoose.model("Content", contentSchema);
const Users = mongoose.model<IUser>("Users", userSchema);

export { Users, Content };
