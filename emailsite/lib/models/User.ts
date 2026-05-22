import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "editor";
  avatar: string;
  bio: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const schema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ["admin", "editor"], default: "editor" },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

schema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

schema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", schema);
export default User;
