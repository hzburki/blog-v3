import { getCollection } from "astro:content";
import { getVisiblePosts } from "./posts.utils";

// The one place pages and endpoints read posts from: drafts are included on
// the dev server only, and the result is sorted newest first.
export async function getPosts() {
  return getVisiblePosts(await getCollection("posts"), import.meta.env.DEV);
}
