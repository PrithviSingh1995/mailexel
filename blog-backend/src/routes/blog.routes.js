const router = require("express").Router();
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

// ── Public routes ──────────────────────────────────────────────────────────────
router.get("/", getPublishedBlogs);
router.get("/categories", getCategories);
router.get("/tags", getTags);
router.get("/:slug", getBlogBySlug);

// ── Protected admin routes ─────────────────────────────────────────────────────
router.get("/admin/stats", protect, getStats);
router.get("/admin/all", protect, getAdminBlogs);

// Image library — returns empty in serverless (no persistent filesystem)
router.get("/admin/images", protect, (req, res) => {
  res.json({ success: true, data: [] });
});

router.delete("/admin/images/:filename", protect, (req, res) => {
  res.status(410).json({ success: false, message: "File storage not available in serverless mode. Use external image URLs." });
});

router.get("/admin/:id", protect, getAdminBlogById);
router.post("/admin", protect, createBlog);
router.put("/admin/:id", protect, updateBlog);
router.patch("/admin/:id/publish", protect, togglePublish);
router.delete("/admin/:id", protect, deleteBlog);

// ── Image upload — converts to base64 data URL (no disk required) ───────────
router.post("/upload", protect, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  res.json({ success: true, url: dataUrl, filename: req.file.originalname });
});

module.exports = router;
