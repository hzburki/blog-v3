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
