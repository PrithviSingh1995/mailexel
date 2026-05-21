require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const blogRoutes = require("./routes/blog.routes");

const app = express();

// ── Connect Database ───────────────────────────────────────────────────────────
connectDB().then(() => seedAdmin()).catch(console.error);

// ── Global Middleware ──────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiting ──────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again later." },
});

app.use("/api/", limiter);
app.use("/api/auth/login", authLimiter);

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Blog API is running", timestamp: new Date().toISOString() });
});

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ── Seed Admin User ────────────────────────────────────────────────────────────
async function seedAdmin() {
  const User = require("./models/User.model");
  const exists = await User.findOne({ role: "admin" });
  if (!exists) {
    await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@mailexel.com",
      password: process.env.ADMIN_PASSWORD || "Admin@123456",
      role: "admin",
    });
    console.log(`Admin user created → ${process.env.ADMIN_EMAIL || "admin@mailexel.com"}`);
  }
}

// ── Start Server (local only) ──────────────────────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Blog API running on http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
