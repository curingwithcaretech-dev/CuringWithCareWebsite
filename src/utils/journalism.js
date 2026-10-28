import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import sharp from "sharp";

// Journalism articles: one Markdown file per article in content/journalism/, read at build
// time. Only use these helpers inside getStaticProps / getStaticPaths (they read the disk).
// See content/journalism/README.md for how to post.

const dir = path.join(process.cwd(), "content", "journalism");
const publicDir = path.join(process.cwd(), "public");

const toDateString = (value) => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

const escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const sizeCache = new Map();

/** Pixel size of a photo under public/ (null if it is missing or not a local file). */
async function imageSize(src) {
  if (!src || !src.startsWith("/") || src.startsWith("//")) return null;
  if (!sizeCache.has(src)) {
    let size = null;
    try {
      const { width, height } = await sharp(path.join(publicDir, decodeURI(src.split("?")[0]))).metadata();
      if (width && height) size = { width, height };
    } catch {
      // The file is not there (yet). The article still builds; the photo just will not show.
    }
    sizeCache.set(src, size);
  }
  return sizeCache.get(src);
}

/**
 * Markdown to HTML. Photos become <figure>s with their real width and height (so the page
 * does not jump while they load), lazy loading, the alt text the writer gave and, if they
 * gave a title, a caption.
 */
async function renderBody(markdown) {
  const sizes = {};
  const md = new Marked({
    async: true,
    walkTokens: async (token) => {
      if (token.type === "image") sizes[token.href] = await imageSize(token.href);
    },
    renderer: {
      image({ href, title, text }) {
        const size = sizes[href];
        const dims = size ? ` width="${size.width}" height="${size.height}"` : "";
        const caption = title ? `<figcaption>${escapeHtml(title)}</figcaption>` : "";
        return `<figure><img src="${escapeHtml(href)}" alt="${escapeHtml(text || "")}"${dims} loading="lazy" decoding="async">${caption}</figure>`;
      },
      paragraph(token) {
        // A photo on a line of its own is a figure, not a paragraph with a figure inside it.
        if (token.tokens?.length === 1 && token.tokens[0].type === "image") return this.parser.parseInline(token.tokens);
        return false;
      },
    },
  });
  return md.parse(markdown);
}

async function readArticle(file) {
  const slug = file.replace(/\.md$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
  if (data.draft) return null;

  // The cover goes through next/image, which only accepts files in public/. Anything else
  // would break the build, so it is dropped with a note.
  let cover = data.cover || null;
  if (cover && !(await imageSize(cover))) {
    console.warn(`journalism: ${file} names cover "${cover}", which is not a photo in public/. Showing the article without it.`);
    cover = null;
  }

  return {
    slug,
    title: data.title || slug,
    author: data.author || null,
    role: data.role || null,
    date: toDateString(data.date),
    summary: data.summary || null,
    cover,
    coverAlt: data.coverAlt || "",
    html: await renderBody(content),
  };
}

/** Every published article, newest first. */
export async function allArticles() {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
  const articles = await Promise.all(files.map(readArticle));
  return articles.filter(Boolean).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export const articleBySlug = async (slug) => (await allArticles()).find((a) => a.slug === slug) || null;

/** "October 22, 2026" from "2026-10-22", without time-zone drift. */
export function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
