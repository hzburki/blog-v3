# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Source for [hzburki.com](https://hzburki.com), Haseeb Zia Burki's personal blog: a fully static Astro v7 site with posts written in MDX. Forked from the [miniblog](https://github.com/nicholasdly/miniblog) template, which is why `package.json` is still named `miniblog`.

## Commands

```bash
npm run dev           # dev server on localhost:4321 (drafts visible)
npm run build         # astro check (type-check) + static build to dist/
npm run preview       # serve the production build
npm test              # unit tests (node:test)
npm run format        # Prettier, writes
npm run format:check  # Prettier, check only
```

Node version is pinned in `.nvmrc` (v22).

There is no linter and no CI. `npm run build` catches type errors and frontmatter schema violations; `npm test` runs the unit tests (`src/**/*.test.ts`, Node's built-in test runner, no extra dependencies). Run it after changing pages, layouts, components, or `src/content.config.ts`.

## Deployment and git workflow

- `main` is production: pushing to it triggers an automatic deploy. Nothing in the repo configures this; it lives in the hosting provider.
- Do work on a branch and merge to `main`; never commit to `main` directly.

## Architecture

All content comes from one content collection, `posts`, defined in `src/content.config.ts` with a `glob()` loader. Entries are addressed by `post.id` (the filename without extension) and rendered with `render(post)` from `astro:content`. Every page is prerendered from it:

| Route           | File                              | Notes                                |
| --------------- | --------------------------------- | ------------------------------------ |
| `/`             | `src/pages/index.astro`           | Bio; duplicated in `README.md`       |
| `/posts`        | `src/pages/posts/index.astro`     | List, newest first                   |
| `/posts/<slug>` | `src/pages/posts/[...slug].astro` | Slug is the MDX filename             |
| `/tags`         | `src/pages/tags/index.astro`      | Tag cloud with counts                |
| `/tags/<tag>`   | `src/pages/tags/[tag].astro`      | Tag used verbatim as the URL segment |
| `/rss.xml`      | `src/pages/rss.xml.js`            |                                      |
| `/robots.txt`   | `src/pages/robots.txt.ts`         | Points at the generated sitemap      |

`src/layouts/Layout.astro` is the single layout: SEO/OG meta, font preloads, the header, and the inline theme script. Site-wide strings (`SITE_URL`, `SITE_TITLE`, `SITE_DESCRIPTION`) live in `src/consts.ts`, which `astro.config.mjs` also imports for `site`.

React is used only for the three MDX components in `src/components/blog/`; everything else is `.astro`.

### Drafts

Posts with `status: "draft"` are meant to be visible in dev and absent from production. There is no shared helper: each page checks `import.meta.env.DEV` and `post.data.status` on its own. Any new page or endpoint that reads the collection has to repeat that filter.

`getVisiblePosts()` in `src/lib/posts.utils.ts` does the filter and the newest-first sort; the RSS feed uses it and new code should too. One place still does not filter, so drafts leak into production output:

- `src/pages/tags/[tag].astro` lists drafts and generates pages for draft-only tags. The linked post page is not built, so those links 404.

### Dark mode

Class-based: `global.css` declares `@custom-variant dark` keyed on `.dark`. An inline script in `Layout.astro` sets the class on `<html>` from `localStorage.theme`, falling back to `prefers-color-scheme`, and a `MutationObserver` writes changes back to `localStorage`. `theme-toggle.astro` just toggles the `dark` class. Both scripts re-run on `astro:after-swap` because the site uses view transitions; any new script that touches the DOM needs the same treatment.

Shiki renders dual themes (`catppuccin-latte` / `catppuccin-mocha`); the `html.dark .astro-code` rule in `global.css` switches to the dark one.

## Styling

- Tailwind v4 through the `@tailwindcss/vite` plugin (registered in `astro.config.mjs`). There is no `tailwind.config.*`; theme settings live in the `@theme` block of `src/styles/global.css`.
- Default palette only: `zinc-*` for neutrals, `blue-500` for links. There are no custom color tokens.
- `global.css` keeps the v3 default border color (`gray-200`) with a base-layer rule, so a bare `border` is light gray, not `currentColor`.
- A component `<style>` block that uses `@apply` must start with `@reference "../styles/global.css";` (see `header.astro`).
- Dark mode is done with explicit `dark:` variants, so every color you add needs its dark counterpart.
- Fonts are self-hosted Geist (`font-sans`) and Geist Mono (`font-mono`) from `public/fonts/`, preloaded in `Layout.astro`.
- Markdown elements inside a post are styled by the nested `article { ... }` rules in `src/styles/global.css`. Add or change element styles there, not per post.
- `cn()` from `src/lib` (tailwind-merge + clsx) merges class names.

## Writing and editing posts

Posts are `src/content/posts/<slug>.mdx`. Required frontmatter:

```yaml
title: string
description: string
image: string # optional; path under /static/feature-images/
date: date # any string Date can parse: "2019-09-07", "April 30, 2025"
tags: string[]
status: draft | published
```

- **Prose is proofread-only.** Fixing typos and grammar is fine. Do not reword, restructure, or extend the author's writing unless asked.
- **Tags must match existing spelling and casing exactly** (`AWS`, `NodeJS`, `SequelizeJS`, `DevOps`, `Elastic Beanstalk`). They are used raw as URL segments, so a variant creates a separate tag page.
- **Omit `image` rather than setting it to `""`.** The schema default only applies when the key is absent; an empty string makes `og:image` resolve to the page's own URL. The feature image is only used for `og:image`, never rendered on the page.
- Images used in a post body go in `public/static/post-images/<slug>/`.
- The page template already renders the title as an `<h1>`, so start in-post headings at `##`.

### MDX components

```mdx
import { Accordion, Callout, Image } from "../../components/blog";

<Callout client:load type="info">
  {" "}
  {/* info | success | danger */}
  Text
</Callout>

<Accordion client:load heading="Click to expand">
  Hidden content
</Accordion>

<Image
  client:load
  src="/static/post-images/<slug>/example.png"
  alt="Describe the image"
  caption="Optional caption"
  extendWidth={false}
/>
```

`Accordion` and `Image` are stateful and render inert without a `client:*` directive. `Callout` is stateless; existing posts put `client:load` on it anyway. `extendWidth` breaks the image out of the 576px content column.

## Conventions

- Kebab-case filenames. React blog components end in `.comp.tsx`, utilities in `.utils.ts`, and each folder re-exports through `index.ts`.
- Relative imports only; no path aliases are configured.
- Prettier is the only style tool (astro, tailwindcss, and organize-imports plugins; config is in `package.json`).

## Known issues

- The default OG image `/static/blog-placeholder.png` (referenced in `content.config.ts` and `Layout.astro`) does not exist in `public/`, so pages without a feature image ship a broken `og:image`.
- `Callout` and `Accordion` have no `dark:` variants.
- `astro.config.mjs` sets `compressHTML: true` on purpose. Astro 7's default (`'jsx'`) strips the spaces around inline links in `.astro` templates such as the home page bio.
- TypeScript is held at 6.x because `@astrojs/check` does not support TypeScript 7 yet.
- Improvement backlog: [TODO.md](TODO.md).
