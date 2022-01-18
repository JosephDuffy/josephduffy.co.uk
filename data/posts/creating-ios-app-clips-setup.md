---
title: Creating iOS App Clips – Setup
tags: ["swift", "xcode", "ios", "app-clips"]
date: 2021-03-04T12:54:34Z
draft: true
---

App Clips were introduced at WWDC 2020 as a method of shipping a stripped down version of an iOS app that has a few advantages:

- The user does not need to input a password to download the app
- The app can be invoked from various sources, such as an NFC tag, QR code, a webpage, the Messages app, or a unique App Clip code
- You can send the user notifications for 8 hours from when the App Clip is launched, even without a permissions prompt.

All of this makes for a very streamlined experience for users and removes a lot of the friction of trying a new app.

A lot of Apple's example revolve around real-world places, such as paying and ordering at a restaurant or paying to park your car. But they can be applied to any app.

<!-- more -->

## Restrictions

App Clips

## Useful Links

While working on App Clips I've found a few links particularly useful and have them compiled here.

### App Clip Code Generator

This is a command line tool that creates App Clip Codes. It can be used to create these in batches and is a good way to ensure your URL will fit in a single image.

It's available from [Apple's Developer Downloads](https://developer.apple.com/download/more/?=App%20Clip).
