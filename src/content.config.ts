import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().default("/static/blog-placeholder.png"),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    status: z.enum(["draft", "published"]),
  }),
});

export const collections = { posts };
