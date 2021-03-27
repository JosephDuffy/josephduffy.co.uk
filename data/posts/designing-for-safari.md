---
title: Designing for Safari
tags: ["ios", "safari", "web", "css"]
date: 2021-03-27T13:37:44Z
draft: true
---

Safari provides a few constants and features that are useful when designing a website that is primarily aimed at Apple users, especially on iOS. These can provide an improved experience for the user and make your website feel more familiar when being viewed in Safari.

<!-- more -->

## CSS System Font Constants

WebKit provides [constants that can be used to use fonts that support large type](https://webkit.org/blog/3709/using-the-system-font-in-web-content/). Although they can't always be mapped directly to a specific element they can provide useful values. For example I have captions styles as:

```css
figcaption {
  font-size: 0.8rem;
  font: -apple-system-footnote;
}
```

This ensures that when browser on a non-Apple browser a smaller font size is used but when viewed in Safari this will respect the user's large type setting.
