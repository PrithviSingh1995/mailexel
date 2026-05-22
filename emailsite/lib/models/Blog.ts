import mongoose, { Document, Model } from "mongoose";
import slugify from "slugify";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt: Date | null;
  views: number;
  metaTitle: string;
  metaDescription: string;
}

const schema = new mongoose.Schema<IBlog>(
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
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

schema.pre("validate", async function () {
  if (this.isModified("title") || this.isNew) {
    const base = slugify(this.title, { lower: true, strict: true });
    let slug = base;
    let count = 1;
    const BlogModel = mongoose.models.Blog as Model<IBlog>;
    while (await BlogModel.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${base}-${count++}`;
    }
    this.slug = slug;
  }
  if (!this.metaTitle) this.metaTitle = this.title;
  if (!this.metaDescription) this.metaDescription = this.excerpt;
});

schema.pre("save", function () {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

schema.index({ title: "text", content: "text", tags: "text" });
schema.index({ status: 1, publishedAt: -1 });

const Blog: Model<IBlog> =
  (mongoose.models.Blog as Model<IBlog>) || mongoose.model<IBlog>("Blog", schema);
export default Blog;
