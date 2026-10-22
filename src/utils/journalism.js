import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Journalism articles: one Markdown file per article in content/journalism/, read at build
// time. Only use these helpers inside getStaticProps / getStaticPaths (they read the disk).
// See content/journalism/README.md for how to post.

const dir = path.join(process.cwd(), "content", "journalism");

const toDateString = (value) => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

function readArticle(file) {
  const slug = file.replace(/\.md$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
  if (data.draft) return null;
  return {
    slug,
    title: data.title || slug,
    author: data.author || null,
    role: data.role || null,
    date: toDateString(data.date),
    summary: data.summary || null,
    cover: data.cover || null,
    coverAlt: data.coverAlt || "",
    html: marked.parse(content),
  };
}

/** Every published article, newest first. */
export function allArticles() {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .map(readArticle)
    .filter(Boolean)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export const articleBySlug = (slug) => allArticles().find((a) => a.slug === slug) || null;

/** "October 22, 2026" from "2026-10-22", without time-zone drift. */
export function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
