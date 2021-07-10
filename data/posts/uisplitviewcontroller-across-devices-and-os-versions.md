---
title: UISplitViewController Across Devices and OS Versions
tags: ["swift", "UISplitViewController"]
date: 2021-05-29T17:58:13Z
draft: true
---

Using `UISplitViewController` across multiple iOS/iPadOS versions and devices poses a few problems, depending on the desired functionality. In this post I will explain how to setup a `UISplitViewController` that has the following characteristics:

- Works inside a `UITabBarController`
- Works on iOS/iPadOS 13.0+
- Doesn't use [`UISplitViewController.Style.unspecified`](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/style/unspecified) on iOS 14.0+
- Preserves the navigation stack when transitioning between regular and compact horizontal size classes

Meeting all these requires while updating [Scanula][scanula-website] has been a very educating process, which I hope is useful for others.

I've created a [generic solution for this and made it available on GitHub][github-repo], but if you're trying to make these changes to an existing project or understand how this solution works it's worth reading the rest of the post.

<!-- more -->

## Using a `UISplitViewController` inside a `UITabBarController`

While this view controller hierarchy is [invalid according to Apple](https://developer.apple.com/library/archive/documentation/WindowsViews/Conceptual/ViewControllerCatalog/Chapters/CombiningViewControllers.html), who state that "only certain arrangements are valid" and that a split view controller should only be a parent. However, many apps do this and have not had issues with app review. Even Apple do this with the Files app on iOS:

!["Files app running on an iPhone 11 Pro Max running iOS 14.5 with the light UI appearance"][files-app-light]

This however does cause a problem when not using [`UISplitViewController.Style.unspecified`](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/style/unspecified) on iOS 14.0+: the horizontal size class will be `compact` no matter the horizontal size class of the `UITabBarController`. This appears to be done by `UISplitViewController`; overriding the trait collection in `overrideTraitCollection(forChild:)` within the parent `UITabBarController` is not honoured.

A quick solution to this is to override `traitCollection`, however this is not supported and will log the message "If you're trying to override traits, you must use the appropriate API".

The solution I have come to is to embed the `UISplitViewController` inside another `UIViewController`. This solution enables the use of `doubleColumn` and `tripleColumn` styles without requiring any function overrides.

## Bonus UI Tests

Given how changes between OS versions can alter our functionality – and because I don't trust any of the code I write – adding UI tests to this was very important to me. While writing the tests I learned a few tricks to allow for all the tests to be written using a single function.

[scanula-webite]: /apps/scanula
[files-app-light]: /images/uisplitviewcontroller-across-devices-and-os-versions/files-app-iphone-11-pro-max-ios-14-5-light-ui.png "Files app running on an iPhone 11 Pro Max running iOS 14.5 with the light UI appearance"
[github-repo]: https://github.com/JosephDuffy/UISplitViewController-Example
