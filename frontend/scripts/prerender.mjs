import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const POSTS_DIR = join(
  __dirname,
  "..",
  "..",
  "backend",
  "src",
  "chris",
  "datasets",
  "data",
  "blog",
  "posts",
);
const SITE = "https://chrisgregory.me";

// Brysbaert, M. (2019) - English non-fiction reading speed
// Matches backend content_to_reading_time in blog_routes.py
function readingTime(content) {
  const words = content.split(/\s+/).filter(Boolean);
  const nWords = words.length;
  const nLetters = words.reduce((sum, w) => sum + w.length, 0);
  const avgLetters = nWords > 0 ? nLetters / nWords : 0;
  const wpm = avgLetters > 0 ? 238 * (4.6 / avgLetters) : 0;
  const minutes = wpm > 0 ? nWords / wpm : 0;
  return Math.max(1, Math.round(minutes));
}

// Strip markdown syntax to get plain text
function stripMarkdown(md) {
  return (
    md
      // Remove HTML tags
      .replace(/<[^>]+>/g, "")
      // Remove images
      .replace(/!\[.*?\]\(.*?\)/g, "")
      // Replace links with just text
      .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
      // Remove footnote references
      .replace(/\[\^[^\]]+\]/g, "")
      // Remove bold/italic markers
      .replace(/[*_]{1,3}(.+?)[*_]{1,3}/g, "$1")
      // Remove headers
      .replace(/^#{1,6}\s+/gm, "")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove math blocks
      .replace(/\$\$[\s\S]*?\$\$/g, "")
      // Remove inline math
      .replace(/\$([^$]+)\$/g, "$1")
      // Collapse whitespace
      .replace(/\n{2,}/g, "\n\n")
      .trim()
  );
}

function getDescription(content, maxLen = 155) {
  const plain = stripMarkdown(content);
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s+\S*$/, "") + "...";
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeJsonLd(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

// Read and parse all blog posts
function loadPosts() {
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const posts = [];

  for (const file of files) {
    const raw = readFileSync(join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    if (data.status !== "published" || data.archived) continue;

    posts.push({
      title: data.title,
      slug: data.slug,
      date: data.date,
      content,
      reading_time: readingTime(content),
      description: getDescription(content),
      plainText: stripMarkdown(content),
    });
  }

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

// Generate pre-rendered HTML for a single blog post
function renderPostPage(template, post) {
  let html = template;

  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(post.title)} | Chris Gregory</title>`,
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${escapeHtml(post.description)}" />`,
  );

  // Replace OG tags
  html = html.replace(
    /<meta property="og:type" content=".*?" \/>/,
    `<meta property="og:type" content="article" />`,
  );
  html = html.replace(
    /<meta property="og:url" content=".*?" \/>/,
    `<meta property="og:url" content="${SITE}/blog/${post.slug}" />`,
  );
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${escapeHtml(post.title)}" />`,
  );
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="${escapeHtml(post.description)}" />`,
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:url" content=".*?" \/>/,
    `<meta name="twitter:url" content="${SITE}/blog/${post.slug}" />`,
  );
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${escapeHtml(post.title)}" />`,
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="${escapeHtml(post.description)}" />`,
  );

  // Add canonical URL and BlogPosting JSON-LD before </head>
  const dateStr =
    post.date instanceof Date
      ? post.date.toISOString().split("T")[0]
      : String(post.date);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: dateStr,
    url: `${SITE}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: "Chris Gregory",
    },
    isPartOf: { "@id": `${SITE}/#website` },
    articleBody: post.plainText,
    timeRequired: `PT${post.reading_time}M`,
  };

  const headInsert = `
    <link rel="canonical" href="${SITE}/blog/${post.slug}" />
    <script type="application/ld+json">
      ${JSON.stringify(jsonLd)}
    </script>`;

  html = html.replace("</head>", `${headInsert}\n  </head>`);

  // Add noscript fallback before </body>
  const noscriptContent = `
    <noscript>
      <article>
        <h1>${escapeHtml(post.title)}</h1>
        <p>${post.reading_time} min read</p>
        <div>${escapeHtml(post.plainText).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</div>
      </article>
    </noscript>`;

  html = html.replace("</body>", `${noscriptContent}\n  </body>`);

  return html;
}

// Generate pre-rendered blog index page
function renderBlogIndex(template, posts) {
  let html = template;

  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>Blog | Chris Gregory</title>`,
  );
  html = html.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="Blog posts by Chris Gregory" />`,
  );
  html = html.replace(
    /<meta property="og:url" content=".*?" \/>/,
    `<meta property="og:url" content="${SITE}/blog" />`,
  );
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="Blog | Chris Gregory" />`,
  );
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="Blog posts by Chris Gregory" />`,
  );
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="Blog | Chris Gregory" />`,
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="Blog posts by Chris Gregory" />`,
  );

  const headInsert = `
    <link rel="canonical" href="${SITE}/blog" />`;
  html = html.replace("</head>", `${headInsert}\n  </head>`);

  const postLinks = posts
    .map((p) => {
      const dateStr =
        p.date instanceof Date
          ? p.date.toISOString().split("T")[0]
          : String(p.date);
      return `        <li><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a> - ${dateStr} - ${p.reading_time} min read</li>`;
    })
    .join("\n");

  const noscriptContent = `
    <noscript>
      <h1>Blog</h1>
      <ul>
${postLinks}
      </ul>
    </noscript>`;

  html = html.replace("</body>", `${noscriptContent}\n  </body>`);

  return html;
}

// Generate sitemap.xml
function generateSitemap(posts) {
  const staticPages = [
    "",
    "/blog",
    "/projects",
    "/running",
    "/music",
    "/books",
    "/pottery",
    "/contact",
  ];

  const staticEntries = staticPages
    .map(
      (path) => `  <url>
    <loc>${SITE}${path}</loc>
  </url>`,
    )
    .join("\n");

  const postEntries = posts
    .map((p) => {
      const dateStr =
        p.date instanceof Date
          ? p.date.toISOString().split("T")[0]
          : String(p.date);
      return `  <url>
    <loc>${SITE}/blog/${p.slug}</loc>
    <lastmod>${dateStr}</lastmod>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>
`;
}

// Main
const template = readFileSync(join(DIST, "index.html"), "utf-8");
const posts = loadPosts();

console.log(`Found ${posts.length} published blog posts`);

// Generate individual post pages
for (const post of posts) {
  const dir = join(DIST, "blog", post.slug);
  mkdirSync(dir, { recursive: true });
  const html = renderPostPage(template, post);
  writeFileSync(join(dir, "index.html"), html);
  console.log(`  Generated blog/${post.slug}/index.html`);
}

// Generate blog index page
mkdirSync(join(DIST, "blog"), { recursive: true });
writeFileSync(join(DIST, "blog", "index.html"), renderBlogIndex(template, posts));
console.log(`  Generated blog/index.html`);

// Generate sitemap
writeFileSync(join(DIST, "sitemap.xml"), generateSitemap(posts));
console.log(`  Generated sitemap.xml`);

console.log("Pre-rendering complete!");
