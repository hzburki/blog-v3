import assert from "node:assert/strict";
import { test } from "node:test";
import { getVisiblePosts } from "./posts.utils.ts";

const post = (id: string, status: "draft" | "published", date: string) => ({
  id,
  data: { status, date: new Date(date) },
});

const posts = [
  post("old", "published", "2019-04-16"),
  post("draft", "draft", "2025-09-18"),
  post("new", "published", "2025-04-30"),
];

const ids = (list: { id: string }[]) => list.map((p) => p.id);

test("drafts are excluded when includeDrafts is false", () => {
  assert.deepEqual(ids(getVisiblePosts(posts, false)), ["new", "old"]);
});

test("drafts are included when includeDrafts is true", () => {
  assert.deepEqual(ids(getVisiblePosts(posts, true)), ["draft", "new", "old"]);
});

test("posts are sorted newest first", () => {
  const dates = getVisiblePosts(posts, true).map((p) => p.data.date.valueOf());
  assert.deepEqual(
    dates,
    [...dates].sort((a, b) => b - a),
  );
});

test("the input array is not mutated", () => {
  const before = ids(posts);
  getVisiblePosts(posts, false);
  assert.deepEqual(ids(posts), before);
});

test("only drafts yields an empty list in production", () => {
  assert.deepEqual(
    getVisiblePosts([post("d", "draft", "2025-01-01")], false),
    [],
  );
});
