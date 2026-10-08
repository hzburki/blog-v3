// Checks the production build in dist/. Run with `npm run test:build`.
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const ROOT = join(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");
const SITE = "https://hzburki.com";

const page = (path: string) =>
  readFileSync(join(DIST, path, "index.html"), "utf8");

const meta = (html: string, attr: "property" | "name", key: string) =>
  html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1];

const postSlugs = readdirSync(join(DIST, "posts"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const pages = [
  "",
  "posts",
  "tags",
  ...postSlugs.map((slug) => `posts/${slug}`),
];

test("every page's og:image points at an image file that exists", () => {
  for (const path of pages) {
    const image = meta(page(path), "property", "og:image");

    assert.ok(image, `${path || "/"} has no og:image`);
    assert.match(image, /\.(png|jpe?g|webp)$/, `${path || "/"}: ${image}`);
    assert.ok(
      existsSync(join(DIST, new URL(image).pathname)),
      `${path || "/"}: ${image} is not in the build`,
    );
  }
});

test("pages without a feature image use the default og:image", () => {
  assert.equal(
    meta(page(""), "property", "og:image"),
    `${SITE}/static/blog-placeholder.png`,
  );
});

test("twitter card tags use name=, open graph tags use property=", () => {
  for (const path of pages) {
    const html = page(path);

    assert.doesNotMatch(html, /<meta property="twitter:/, path || "/");
    assert.doesNotMatch(html, /<meta name="og:/, path || "/");

    for (const key of ["card", "url", "title", "description", "image"]) {
      assert.ok(meta(html, "name", `twitter:${key}`), `${path || "/"}: ${key}`);
    }
    assert.equal(meta(html, "name", "twitter:card"), "summary_large_image");
  }
});

test("post pages are og:type article, every other page is website", () => {
  for (const path of pages) {
    const expected = path.startsWith("posts/") ? "article" : "website";

    assert.equal(
      meta(page(path), "property", "og:type"),
      expected,
      path || "/",
    );
  }
});

const feedItems = () =>
  [
    ...readFileSync(join(DIST, "rss.xml"), "utf8").matchAll(
      /<item>([\s\S]*?)<\/item>/g,
    ),
  ].map(([, item]) => ({
    link: item.match(/<link>(.*?)<\/link>/)?.[1],
    pubDate: item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1],
  }));

test("the RSS feed has one item per published post", () => {
  const links = feedItems().map((item) => item.link);

  assert.deepEqual(
    [...links].sort(),
    postSlugs.map((slug) => `${SITE}/posts/${slug}/`).sort(),
  );
});

test("every RSS item has a valid pubDate, newest first", () => {
  const dates = feedItems().map((item) => {
    assert.ok(item.pubDate, `${item.link} has no pubDate`);
    const time = Date.parse(item.pubDate);
    assert.ok(!Number.isNaN(time), `${item.link}: ${item.pubDate}`);
    return time;
  });

  assert.ok(dates.length > 0);
  assert.deepEqual(
    dates,
    [...dates].sort((a, b) => b - a),
  );
});
