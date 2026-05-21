const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    featuredImage: { type: String, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, trim: true, default: "General" },
    tags: [{ type: String, trim: true, lowercase: true }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date, default: null },
    views: { type: Number, default: 0 },
    // SEO
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// Auto-generate slug from title
blogSchema.pre("validate", async function (next) {
  if (this.isModified("title") || this.isNew) {
    const base = slugify(this.title, { lower: true, strict: true });
    let slug = base;
    let count = 1;
    // Ensure slug is unique
    while (await mongoose.models.Blog.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${base}-${count++}`;
    }
    this.slug = slug;
  }
  // Set metaTitle/metaDescription from title/excerpt if not provided
  if (!this.metaTitle) this.metaTitle = this.title;
  if (!this.metaDescription) this.metaDescription = this.excerpt;
  next();
});

// Set publishedAt when status changes to published
blogSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Text index for search
blogSchema.index({ title: "text", content: "text", tags: "text" });
blogSchema.index({ status: 1, publishedAt: -1 });

module.exports = mongoose.model("Blog", blogSchema);
