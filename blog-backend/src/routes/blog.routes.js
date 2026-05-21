const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const {
  getPublishedBlogs,
  getBlogBySlug,
  getCategories,
  getTags,
  getAdminBlogs,
  getAdminBlogById,
  createBlog,
  updateBlog,
  togglePublish,
  deleteBlog,
  getStats,
} = require("../controllers/blog.controller");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");

// ── Public routes ──────────────────────────────────────────────────────────────
router.get("/", getPublishedBlogs);
router.get("/categories", getCategories);
router.get("/tags", getTags);
router.get("/:slug", getBlogBySlug);

// ── Protected admin routes ─────────────────────────────────────────────────────
router.get("/admin/stats", protect, getStats);
router.get("/admin/all", protect, getAdminBlogs);

// ── Image management (must be before /admin/:id to avoid slug clash) ───────────
router.get("/admin/images", protect, (req, res) => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      return res.json({ success: true, data: [] });
    }
    const files = fs.readdirSync(UPLOADS_DIR).filter((f) =>
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f)
    );
    const images = files
      .map((filename) => {
        const stats = fs.statSync(path.join(UPLOADS_DIR, filename));
        return {
          filename,
          url: `${req.protocol}://${req.get("host")}/uploads/${filename}`,
          size: stats.size,
          createdAt: stats.mtime,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/admin/images/:filename", protect, (req, res) => {
  const { filename } = req.params;
  // Prevent path traversal
  if (/[/\\.]\./.test(filename) || filename.includes("..")) {
    return res.status(400).json({ success: false, message: "Invalid filename" });
  }
  const filePath = path.join(UPLOADS_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }
    fs.unlinkSync(filePath);
    res.json({ success: true, message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/admin/:id", protect, getAdminBlogById);
router.post("/admin", protect, createBlog);
router.put("/admin/:id", protect, updateBlog);
router.patch("/admin/:id/publish", protect, togglePublish);
router.delete("/admin/:id", protect, deleteBlog);

// ── Image upload ───────────────────────────────────────────────────────────────
router.post("/upload", protect, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ success: true, url, filename: req.file.filename });
});

module.exports = router;
