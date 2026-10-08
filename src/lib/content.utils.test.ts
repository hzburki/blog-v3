import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";

const SRC = join(import.meta.dirname, "..");
const ALLOWED = ["lib/content.utils.ts"];

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory())
      return entry.name === "content" ? [] : sourceFiles(path);
    return /\.(astro|ts|tsx|js)$/.test(entry.name) &&
      !/\.test\.ts$/.test(entry.name)
      ? [path]
      : [];
  });

// Reading the collection directly skips the draft filter, which is how drafts
// leaked into the RSS feed and tag pages. Everything must go through getPosts().
test("only content.utils.ts reads the posts collection directly", () => {
  const offenders = sourceFiles(SRC)
    .filter((file) => /\bgetCollection\s*\(/.test(readFileSync(file, "utf8")))
    .map((file) => relative(SRC, file))
    .filter((file) => !ALLOWED.includes(file));

  assert.deepEqual(offenders, []);
});

test("getPosts() applies the draft filter", () => {
  const source = readFileSync(join(SRC, "lib/content.utils.ts"), "utf8");

  assert.match(source, /getVisiblePosts\(/);
  assert.match(source, /import\.meta\.env\.DEV/);
});
