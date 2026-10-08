# TODO

Improvement backlog from a full code and dependency review (2026-10-09). Ordered by priority within each section. Tick items off as they land.

## 1. Bugs

- [x] **Drafts leak into the production RSS feed.** `src/pages/rss.xml.js` maps over every post. Filter on `status === "published"` and sort newest first.
- [ ] **Drafts leak into production tag pages.** `src/pages/tags/[tag].astro` builds from the unfiltered collection, so drafts are listed (linking to a 404) and draft-only tags get their own page (`/tags/Airflow`, `/tags/Docker`, `/tags/Python`, `/tags/Localhost`). `tags/index.astro` does filter, so the tag cloud and the tag pages disagree.
- [ ] **Centralise the draft filter.** The dev/prod `status` check is copy-pasted into three files and missing from two. Add one `getPosts()` helper in `src/lib/` that filters and sorts, and use it everywhere. This fixes both leaks above and prevents the next one.
- [ ] **Default OG image does not exist.** `/static/blog-placeholder.png` is the default in `src/content.config.ts` and `Layout.astro`, but there is no such file in `public/static/`. Home, post list, tag pages, and any post without an image ship a broken `og:image`.
- [ ] **`image: ""` produces a wrong `og:image`.** Three posts (`aws-to-cloudflare-domain-transfer-guide`, `setting-up-coolify-aws-ec2-for-development`, `setup-airflow-part-one`) set an empty string, which bypasses the schema default and resolves to the post's own URL. Remove the key from those posts and make the schema reject or ignore `""`.
- [ ] **Twitter card tags use `property=` instead of `name=`** in `Layout.astro`, and `og:type` is `website` on post pages (should be `article`).
- [ ] **RSS items carry no `pubDate`.** The feed spreads `post.data`, which has `date`, not `pubDate`, so readers cannot order entries. Map `date` to `pubDate` explicitly instead of spreading the whole frontmatter.

## 2. Accessibility

- [ ] `Accordion` toggles with a `<div onClick>`: not focusable, not keyboard-operable, no `aria-expanded`. Replace with native `<details>/<summary>`, which also removes the need to hydrate it.
- [ ] `Image` zoom trigger is a `<div onClick>` and the modal has no dialog role, focus trap, or close button. Use a `<button>` plus `<dialog>`. `closeModal` also forces `body.style.overflow = "auto"` instead of restoring the previous value.
- [ ] Post pages have several `<h1>`s: the page title plus every `# Heading` inside the MDX (`full-height-gatsby-site`, `setting-up-coolify-aws-ec2-for-development`, `setup-airflow-part-one`). Demote in-post headings to `##`.
- [ ] External links on the home page use `target="_blank"` without `rel="noopener noreferrer"`.
- [ ] `Callout` and `Accordion` have no `dark:` styles. `Callout` shows a pale pastel box on the dark background; `Accordion` keeps a light gray border.
- [ ] `article aside` in `global.css` uses hard-coded light hex colors and does not adapt to dark mode.
- [ ] Header nav has no current-page indication (`aria-current`).

## 3. Performance

- [ ] **Stop hydrating `Callout`.** It is stateless, but every use has `client:load`, so posts that only use callouts (`aws-to-cloudflare-domain-transfer-guide`, `setting-up-coolify-aws-ec2-for-development`) download about 213 KB of React runtime for nothing. Drop the directive, or better, rewrite `Callout` as an `.astro` component.
- [ ] **Make `Accordion` and `Image` framework-free.** With `<details>` and `<dialog>` they need a few lines of vanilla JS at most. That removes React from every page (see section 5 for the packages this frees).
- [ ] Use `client:visible` instead of `client:load` for below-the-fold images if React stays.
- [ ] `public/static/feature-images/nestjs-sequelize-feature-image.jpeg` is 4.1 MB and is only ever used as an `og:image`. Resize to 1200x630 and recompress.
- [ ] `public/static/post-images/full-height-gatsby/result-as-promised.gif` is 1.4 MB. Convert to a short MP4/WebM `<video>`.
- [ ] Post images are raw `<img>` tags from `public/`, so they are not optimised and have no `width`/`height` (layout shift). Move them under `src/assets/` and render with `astro:assets`.
- [ ] Only preload the font used above the fold. `geist-mono-variable.woff2` is preloaded on every page, including the home page, which has no monospace text.

## 4. Code quality

- [ ] Run `npm run format`. `format:check` fails on 17 files after the Prettier plugin upgrades (mostly Tailwind class order). Do it in its own commit so the diff stays reviewable.
- [ ] Type the untyped bits: `post: any` in `tags/[tag].astro`, missing `Props` interfaces in `blog-card.astro` and `tag-badge.astro`, and rename `rss.xml.js` to `.ts`.
- [ ] `[...slug].astro` is a rest route but slugs are single segments; rename to `[slug].astro`.
- [ ] The back-arrow SVG in `[...slug].astro` and the sun/moon SVGs in `theme-toggle.astro` are inlined by hand while `lucide-react` is installed. Pick one approach.
- [ ] `consts.ts`: remove the stale `// Deployment Count: 1` comment and the template boilerplate comment.
- [ ] `package.json`: rename from `miniblog`, remove the duplicate `start` script, add `"engines": { "node": ">=22.12.0" }`.
- [ ] Tag URLs contain spaces (`/tags/AWS%20Lambda`). Slugify tags for URLs and keep the display name separate. This changes existing URLs, so add redirects.
- [ ] The home page bio is duplicated in `README.md` and `src/pages/index.astro`.
- [ ] Drop the v3 border-color compatibility rule in `global.css` once every bare `border` has an explicit color class.

## 5. Dependencies

Done in this pass: everything is on its latest release except TypeScript, `npm audit` reports 0 vulnerabilities (was 46), and `clsx`, `react-dom`, and `@types/react-dom` are now declared instead of being resolved transitively.

- [ ] **TypeScript 7.** Held at 6.0.3 because `@astrojs/check` only accepts `^5 || ^6`. Upgrade when `@astrojs/check` adds support.
- [ ] **Bump `.nvmrc`.** It pins v22.14.0; a transitive dependency (`undici`) now asks for Node >= 22.19 and prints an engine warning on install. Move to the current 22.x and make sure the hosting build uses the same version.
- [ ] **Remove React entirely** once section 3 is done. That drops `react`, `react-dom`, `@astrojs/react`, `@types/react`, `@types/react-dom`, and `lucide-react`: six packages kept alive by three small components and five icons.
- [ ] **Remove `tailwind-merge` and `clsx`.** `cn()` is called once, in `Layout.astro`, to let a page override `max-w-xl`. Replace it with a `maxWidth` prop or Astro's built-in `class:list` and delete `src/lib/styles.utils.ts`.
- [ ] Move build-only packages to `devDependencies` (`@astrojs/check`, `typescript`, `tailwindcss`, `@tailwindcss/vite`). Cosmetic for a static site; confirm the host installs dev dependencies first.
- [ ] `prettier-plugin-astro-organize-imports` is optional. Keep it only if automatic import sorting in `.astro` files is wanted.

## 6. Content

- [ ] `setup-airflow-part-one.mdx` (draft) has an empty `description`; fill it in before publishing.
- [ ] `serverless-apis-on-the-go.mdx` has a stray `categories:` frontmatter key that the schema silently drops.
- [ ] `serverless-apis-on-the-go.mdx` line 323: `**--env**` renders as a dash followed by "env". Wrap the flag in backticks.
- [ ] `setting-up-coolify-aws-ec2-for-development.mdx` has a code block tagged `gitignore`, which Shiki does not know (falls back to plain text with a build warning). Use `text` or `ini`.
- [ ] `smoke_dag.png` and `smoke_dag_tasks.png` under `post-images/setup-airflow-part-one/` are not referenced by any post.

## 7. Repo hygiene

- [ ] Add CI: one workflow running `npm ci`, `npm run format:check`, and `npm run build` on pull requests. `main` deploys automatically, so this is the only gate before production.
- [ ] `README.md` is only the bio. Add setup, commands, and how to write a post.
- [ ] Remove the leftover local `supabase/` directory (untracked remains of a deleted post).
- [ ] Add a 404 page (`src/pages/404.astro`); there is none.
