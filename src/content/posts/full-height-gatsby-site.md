---
title: "100% heights to all divs - GatsbyJS"
description:
  "A simple UI containing a header, main and footer built with GatsbyJS.
  The footer should stick to the bottom if content above it (main) does
  not fill the whole view and get pushed down if the content (main)
  exceeds the view height."
image: "/static/feature-images/full-height-gatsby-feature-image.jpeg"
date: "2019-07-10"
status: "published"
tags:
  - gatsbyjs
  - css
---

# Use Case

A simple UI containing a header, main and footer. The footer should stick to the bottom if content above it (main) does not fill the whole view and get pushed down if the content (main) exceeds the view height.

![](/static/post-images/full-height-gatsby/what-we-have.png)

what we have!

![](/static/post-images/full-height-gatsby/what-we-want.png)

what we want.

# The Simple Solution

Gatsby uses [@reach/router](https://github.com/reach/router) which wraps the `Layout` component in an additional div. So you can see how adding style to a javascript injected div without any `class` or `id`

**But!!! 😮😮😮**

![](/static/post-images/full-height-gatsby/additional-div-highlighted.png)

additional div highlighted

Gatsby uses [@reach/router](https://github.com/reach/router) which wraps the `Layout` component in an additional div. So you can see how adding style to a javascript injected div without any `class` or `id` might be an issue.

@reach/router can automatically manage the focus as part of making sure sites are usable by screen readers.

# The Real Solution

Well the **real solution** is actually still the same, we need to assign a `height: '100%'` to all parent divs.

- Create a new css file and name it `global.css`. I’ve put it in a separate styles folder in my repo.

```js
/*
 * Purpose:
 * Assign height: "100%" to
 * html, body, #___gatsby &
 * div with role="group"
*/
html, body, #___gatsby {
    height: 100%;
}
body {
    margin: 0px;
}
div[role="group"][tabindex] {
    height: 100%;
}
```

- In the root of your directory, look for `gatsby-browser.js` and import `global.css`.

```js
import "./src/styles/global.css";
```

- I like to start my projects from scratch. This is my take on `Layout` Component.

```js
<div
  style={{
    height: "100%",
    display: "flex",
    flexDirection: "column",
  }}
>
  <header>
    <Header siteTitle={data.site.siteMetadata.title} />
  </header>
  <main
    style={{
      backgroundColor: "pink",
      flexGrow: 1,
    }}
  >
    {children}
  </main>
  <footer
    style={{
      backgroundColor: "aquamarine",
    }}
  >
    © {new Date().getFullYear()}, Built with
    {` `}
    <a href="https://www.gatsbyjs.org">Gatsby</a>
  </footer>
</div>
```

# The Result as Promised !!

![](/static/post-images/full-height-gatsby/result-as-promised.gif)

The footer is now pushed down by the content.

This solution is based on a [github thread](https://github.com/gatsbyjs/gatsby/issues/7310).
