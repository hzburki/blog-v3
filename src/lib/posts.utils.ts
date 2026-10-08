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
