import mongoose from "mongoose";

// eslint-disable-next-line no-var
declare global { var _mc: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined }

let cached = global._mc;
if (!cached) cached = global._mc = { conn: null, promise: null };

export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  if (cached!.conn) return cached!.conn;
  if (!cached!.promise) {
    cached!.promise = mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  }
  try {
    cached!.conn = await cached!.promise;
    await seedAdmin();
  } catch (e) {
    cached!.promise = null;
    throw e;
  }
  return cached!.conn;
}

async function seedAdmin() {
  const { default: User } = await import("./models/User");
  try {
    const exists = await User.findOne({ role: "admin" });
    if (!exists) {
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL || "admin@mailexel.com",
        password: process.env.ADMIN_PASSWORD || "Admin@Mailexel2026",
        role: "admin",
      });
    }
  } catch (err) {
    if ((err as { code?: number }).code !== 11000) console.error("Seed error:", err);
  }
}
