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
