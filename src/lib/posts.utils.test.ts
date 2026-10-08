import assert from "node:assert/strict";
import { test } from "node:test";
import {
  countPostsByTag,
  getVisiblePosts,
  groupPostsByTag,
} from "./posts.utils.ts";

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

const tagged = (id: string, status: "draft" | "published", tags: string[]) => ({
  id,
  data: { status, date: new Date("2025-01-01"), tags },
});

const taggedPosts = [
  tagged("coolify", "published", ["AWS", "DevOps"]),
  tagged("airflow", "draft", ["Airflow", "DevOps"]),
  tagged("billing", "published", ["AWS"]),
];

const groupIds = (groups: Map<string, { id: string }[]>) =>
  Object.fromEntries([...groups].map(([tag, list]) => [tag, ids(list)]));

test("posts are grouped under each of their tags, in input order", () => {
  assert.deepEqual(groupIds(groupPostsByTag(taggedPosts)), {
    AWS: ["coolify", "billing"],
    DevOps: ["coolify", "airflow"],
    Airflow: ["airflow"],
  });
});

test("tag pages built from visible posts omit drafts and draft-only tags", () => {
  const groups = groupPostsByTag(getVisiblePosts(taggedPosts, false));

  assert.deepEqual(groupIds(groups), {
    AWS: ["coolify", "billing"],
    DevOps: ["coolify"],
  });
});

test("a tag repeated on one post lists that post once", () => {
  const groups = groupPostsByTag([tagged("dup", "published", ["AWS", "AWS"])]);

  assert.deepEqual(groupIds(groups), { AWS: ["dup"] });
});

test("tags differing only in case are separate groups", () => {
  const groups = groupPostsByTag([
    tagged("a", "published", ["DevOps"]),
    tagged("b", "published", ["devops"]),
  ]);

  assert.deepEqual([...groups.keys()], ["DevOps", "devops"]);
});

test("tag counts are sorted alphabetically and count each post once", () => {
  assert.deepEqual(countPostsByTag(taggedPosts), [
    ["Airflow", 1],
    ["AWS", 2],
    ["DevOps", 2],
  ]);
});

test("tag counts for visible posts leave out drafts", () => {
  assert.deepEqual(countPostsByTag(getVisiblePosts(taggedPosts, false)), [
    ["AWS", 2],
    ["DevOps", 1],
  ]);
});
