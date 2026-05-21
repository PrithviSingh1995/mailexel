const Blog = require("../models/Blog.model");

// ── Public ─────────────────────────────────────────────────────────────────────

// GET /api/blogs
// Query: page, limit, category, tag, search
const getPublishedBlogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter = { status: "published" };
    if (req.query.category) filter.category = new RegExp(req.query.category, "i");
    if (req.query.tag) filter.tags = req.query.tag.toLowerCase();
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate("author", "name avatar bio")
        .select("-content")
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/blogs/:slug
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: "published" }).populate(
      "author",
      "name avatar bio"
    );
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    // Increment views (fire and forget)
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();

    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/blogs/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct("category", { status: "published" });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/blogs/tags
const getTags = async (req, res) => {
  try {
    const tags = await Blog.distinct("tags", { status: "published" });
    res.json({ success: true, data: tags });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Admin ──────────────────────────────────────────────────────────────────────

// GET /api/admin/blogs
// Query: page, limit, status, search
const getAdminBlogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.$text = { $search: req.query.search };
    // Editors can only see their own blogs
    if (req.user.role === "editor") filter.author = req.user._id;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate("author", "name avatar")
        .select("-content")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/blogs/:id
const getAdminBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name avatar");
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    // Editors can only access their own blogs
    if (req.user.role === "editor" && blog.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/blogs
const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, status, metaTitle, metaDescription, featuredImage } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({ success: false, message: "Title, excerpt, and content are required" });
    }

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      category,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map((t) => t.trim()) : []),
      status: status || "draft",
      metaTitle,
      metaDescription,
      featuredImage,
      author: req.user._id,
    });

    await blog.populate("author", "name avatar");
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/blogs/:id
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (req.user.role === "editor" && blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { title, excerpt, content, category, tags, status, metaTitle, metaDescription, featuredImage } = req.body;

    if (title) blog.title = title;
    if (excerpt) blog.excerpt = excerpt;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (tags !== undefined) blog.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim());
    if (status) blog.status = status;
    if (metaTitle !== undefined) blog.metaTitle = metaTitle;
    if (metaDescription !== undefined) blog.metaDescription = metaDescription;
    if (featuredImage !== undefined) blog.featuredImage = featuredImage;

    await blog.save();
    await blog.populate("author", "name avatar");
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/blogs/:id/publish
const togglePublish = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (req.user.role === "editor" && blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    blog.status = blog.status === "published" ? "draft" : "published";
    await blog.save();

    res.json({
      success: true,
      message: `Blog ${blog.status === "published" ? "published" : "unpublished"} successfully`,
      data: { status: blog.status, publishedAt: blog.publishedAt },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/blogs/:id
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    if (req.user.role === "editor" && blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await blog.deleteOne();
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [total, published, drafts, totalViews] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: "published" }),
      Blog.countDocuments({ status: "draft" }),
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
    ]);

    const topBlogs = await Blog.find({ status: "published" })
      .select("title slug views publishedAt")
      .sort({ views: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        total,
        published,
        drafts,
        totalViews: totalViews[0]?.total || 0,
        topBlogs,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
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
};
