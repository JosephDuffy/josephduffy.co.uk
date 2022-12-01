---
title: The Bug That Bit Me Twice
tags: ["overamped"]
date: 2022-12-01T19:45:37Z
---

I've been working on a fix for a bug in Overamped, which causes the popover UI shown when tapping on an image in Google Images to be blank, if the link goes to an AMP page. This was a silly bug that never should've happened; knowing that Google can change their page structure at any time I should've been more cautious with my checks.

As a temporary quick fix I removed all custom handling of Google results, tested my changes in the simulator, and uploaded a new build to TestFlight.

After installing the TestFlight update on my phone I checked a search result that I knew recreated the problem, but it was still happening! I have other extensions installed so I disabled some, refreshed, and the bug was fixed!

I thought it would be very strange for the same – very specific – bug to appear in multiple extensions, so I did a little digging.

<!-- more -->

I quickly narrowed down the extension that was causing this bug. Knowing that the same extension is installed on my Mac – and that if I were to release an app on multiple platforms I would use the same JavaScript across platforms – I inspected the app and found the extension. Inside was a file that looked like exactly what I was looking for: `redirect-amp.js`.

After opening and formatting the file for easier reading, I took a brief look over it. Something stood out to me as soon as I spotted it:

```javascript
const c = (function (e) {
  const t = e.querySelector("span[aria-label='AMP logo']")
  if (t) return t
  if (e.dataset.ampHlt) {
    let t = e.parentElement
    for (; t && !t.classList.contains("card-section"); ) t = t.parentElement
    if (t) return t.querySelector("span[aria-label='AMP logo']")
  }
  return null
})(e)
```

This felt incredibly familiar, so I compared it with my own code:

```typescript
function findAMPLogoRelativeToAnchor(
  anchor: HTMLAnchorElement,
): HTMLSpanElement | null {
  const childLogo = anchor.querySelector("span[aria-label='AMP logo']")

  if (childLogo) {
    return childLogo as HTMLSpanElement
  }

  if (anchor.dataset.ampHlt) {
    console.debug(
      `Anchor is from a "Featured Snippet"; searching parent for container`,
    )
    // The "Featured Snippet" puts the logo outside of the anchor
    let parent = anchor.parentElement

    while (parent && !parent.classList.contains("card-section")) {
      parent = parent.parentElement
    }

    if (parent) {
      console.debug("Found card section parent", parent)
      return parent.querySelector(
        "span[aria-label='AMP logo']",
      ) as HTMLSpanElement | null
    }
  }

  console.debug("Failed to find corresponding AMP logo <span> for", anchor)

  return null
}
```

Ok, so maybe that's a just a coincidence; there are only so many ways to do these lookups. However, it's worth noting that currently, to the best of my knowledge, this code does nothing. When I started working on my AMP redirector in June 2021 Google would show a small bolt next to AMP results. The aim of this code was to remove that bolt. However, before the app was released in September 2021 Google had removed this bolt, so this code was effectively useless. I left it in just in case they decided to re-add the bolt in the future.

At this point I was suspicious, so I bug a little deeper so something more specific: the code causing the bug.

My code would remove anything it thought was an AMP popover, but the search for the popover wasn't cautious enough:

```typescript
interface AnchorAttributes {
  url: string
  ampPopover: Element | null
}

// The URL to redirect to – if found – and the element
// that contains the AMP popover (used in image searches)
const attributes = ((): AnchorAttributes | null => {
  const ampCur = anchor.dataset.ampCur

  if (ampCur && ampCur.length > 0) {
    // data-amp-cur is available on News search results (not news.google)
    // and has the full canonical URL
    hasCanonicalURL = true
    return { url: ampCur, ampPopover: null }
  }

  if (anchor.dataset.amp) {
    return { url: anchor.dataset.amp, ampPopover: null }
  }

  if (anchor.dataset.cur) {
    return { url: anchor.dataset.cur, ampPopover: null }
  } else {
    // Check if this is an AMP result within an image search result
    // This is a little fragile but seems to be the most efficient
    // without replacing links that aren't to AMP pages.
    //
    // TODO: Check if it's possible to detect links on image search
    // result pages. e.g. the Universe Today link on
    // https://www.google.co.uk/search?q=eta+carinae&client=safari&hl=en-gb&prmd=nivx&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjBqdOumez1AhXoJEQIHS7UBWAQ_AUoAnoECAIQAg&biw=375&bih=635&dpr=3

    // This is a div containing the links
    const upperContainer = anchor.parentElement?.parentElement

    if (!upperContainer) {
      return null
    }

    if (!upperContainer.nextElementSibling) {
      // Likely not an AMP link; the next sibling should be
      // the element that displays the AMP page
      return null
    }

    // Double check this is in fact an AMP link
    if (
      upperContainer.nextElementSibling.querySelector(
        "div[aria-label*='AMP']",
      ) === null
    ) {
      return null
    }

    return { url: anchor.href, ampPopover: upperContainer.nextElementSibling }
  }
})()

const { url: anchorURLString, ampPopover } = attributes

const anchorURL = new URL(anchorURLString)

if (anchorURL.hostname === window.location.hostname) {
  // Do not override internal links, e.g. links to `"#"` used for anchors acting as buttons
  // `role="button"` could also be used but may exclude too many anchors
  return
}

// ...

if (ampPopover) {
  console.debug("Removing AMP popover", ampPopover)
  ampPopover.remove()
}
```

Oh how innocent the "Double check this is in fact an AMP link" comment seems, now knowing the bug it didn't prevent 😅 (the bug is that it's only checking if it _contains_ a `div` with `aria-label` contains "AMP", which would technically be true for any parent element)

Searching in the same extension's code reveals the following:

```javascript
const [r, o] = (() => {
  var t
  const { ampCur: r } = e.dataset
  if (r && r.length > 0) return [r, null]
  if (e.dataset.amp) return [e.dataset.amp, null]
  if (e.dataset.cur) return [e.dataset.cur, null]
  const n =
    null === (t = e.parentElement) || void 0 === t ? void 0 : t.parentElement
  return (null == n ? void 0 : n.nextElementSibling) &&
    null !== n.nextElementSibling.querySelector("div[aria-label*='AMP']")
    ? [e.href, n.nextElementSibling]
    : e.href && new URL(e.href).hostname !== location.hostname
    ? [e.href, null]
    : [null, null]
})()

// ...

o && o.remove()
```

At this point I was quite confident: somehow, my code had ended up in this extension.

As a user of the app in question for a long time (my emails show I purchased it in May 2016 and have been subscribed since January 2020) I assumed either I was mistaken and this was all a coincidence, this was an honest mistake, or something like GitHub Copilot had chewed up my code and spat it out for the extension's development team.

Hoping to get some insight on this I tweeted some screenshots of the code and mentioned the developer of the extension, fully expecting the tweet to enter the void and for me to hear nothing more of it.

To my surprise I woke up the next day to a Twitter DM explaining that the the extension developer hired someone else to write this part of the extension, they didn't know this code had been copied, and that they had removed the offending code and submitted an update to Apple 🎉 All of this, easily within 12 hours of my finding the offending code.

You may have noticed I didn't mention the extension in question in this post. That's because the point of this was tell the story of how I found the copied code, and also because I find it funny that a bug _of my own creation_ came back to bite me twice: once in my own app, and once in a different one!

My original tweet does mention the app that included this copied code, but all I will say is that I am and plan to continue being a customer of this app, and if there's anything else you take away from this post it should be that the developers behind it were not acting maliciously. I would, however, like to know more about the developer that submitted my work to them though 😈

For those wondering: the [Overamped source code is available on GitHub](https://github.com/JosephDuffy/Overamped/), which is probably where this code was copied from. The source code is available for auditing purposes only and is not licensed. As such, the code in this post does not fall under the usual CC-BY-4.0 license used by other posts on this website.

I _did_ expect something like this to happen eventually, but I always assumed it would be more brazen – such as a clear re-upload of the app using a different name – and didn't expect it to be resolved so quickly.
