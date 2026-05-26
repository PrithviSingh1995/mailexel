import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      { userAgent: "GPTBot",         allow: "/" },
      { userAgent: "OAI-SearchBot",  allow: "/" },
      { userAgent: "ClaudeBot",      allow: "/" },
      { userAgent: "PerplexityBot",  allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Googlebot",      allow: "/" },
      { userAgent: "bingbot",        allow: "/" },
    ],
    sitemap: "https://www.mailexel.com/sitemap.xml",
  };
}
