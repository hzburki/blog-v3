import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
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
