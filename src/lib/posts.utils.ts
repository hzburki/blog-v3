import { DEFAULT_OG_IMAGE } from "../consts.ts";

interface PostLike {
  data: { status: "draft" | "published"; date: Date };
}

// Drafts are only listed when includeDrafts is set (the dev server); newest first.
export function getVisiblePosts<T extends PostLike>(
  posts: T[],
  includeDrafts: boolean,
): T[] {
  return posts
    .filter((post) => includeDrafts || post.data.status === "published")
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// Maps each tag to the posts carrying it, keeping the order of the input.
export function groupPostsByTag<T extends { data: { tags: string[] } }>(
  posts: T[],
): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  for (const post of posts) {
    for (const tag of new Set(post.data.tags)) {
      groups.set(tag, [...(groups.get(tag) ?? []), post]);
    }
  }

  return groups;
}

// [tag, number of posts] pairs, sorted alphabetically by tag.
export function countPostsByTag<T extends { data: { tags: string[] } }>(
  posts: T[],
): [string, number][] {
  return [...groupPostsByTag(posts)]
    .map(([tag, list]): [string, number] => [tag, list.length])
    .sort((a, b) => a[0].localeCompare(b[0]));
}

// A missing or blank frontmatter image falls back to the default og:image.
export function resolveFeatureImage(image?: string): string {
  return image?.trim() || DEFAULT_OG_IMAGE;
}
