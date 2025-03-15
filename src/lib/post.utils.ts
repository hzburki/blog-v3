// Sort posts by date
export const sortPosts = (posts: any[]) =>
  posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

// Filter published posts
export const filterPosts = (posts: any[], status: string = "published") =>
  posts.filter((post) => post.data.status === status);

// Confirm
export const isLocalEnv = (url: string) => Boolean(url === "localhost");

// Show draft
export const showDraft = (isLocal: boolean, status: string) => isLocal &&
  status === "draft";

