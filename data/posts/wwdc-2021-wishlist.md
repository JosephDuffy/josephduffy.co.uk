---
title: My WWDC 2021 Wishlist
tags: ["swift", "xcode", "ios", "wwdc"]
date: 2021-03-04T12:52:34Z
---

With WWDC 2021 just around the corner I've been thinking about what I'd like to see there.

A lot of the popular discourse around this time of year is focussed on features of the operating systems but I want to look at what I'd like to see as a developer for Apple platforms.

I love to develop for Apple platforms but it can often be a painful process. May is like a christmas for Apple developers.

<!-- more -->

## Integrate the App Store Connection API with Xcode

The App Store Connect API has proved itself very useful by allowing the use of API keys to access to various App Store Connect features, such as uploading and submitting apps and managing certificates.

If it were integrated in to Xcode it could enable downloading signing certificates and provisioning profiles without logging in. This could make deployment from continuous deployment servers easier without the need for external tools like fastlane.

## Concurrency Improvements in Swift

These changes are almost guaranteed since they're mentioned in the [Changelog for Swift](https://github.com/apple/swift/blob/main/CHANGELOG.md).

I've converted one of my projects to use `async`/`await`, which surfaced a bug _and_ reduced the number of lines of code. Migrating some of the thread-safe code to use actors will further reduce the complexity and likely improve performance and possible remove more bugs, so I'm very excited for this!

## Expanded Capabilities for Xcode Extensions

Xcode extensions are currently quite limited, only having access to the currently open file and devoid of invocation methods outside of the menu bar/keyboard shortcuts.

Expanding the capabilities to allow triggering invocation on save, adding UI to the editor, and providing syntax highlighting could enable a plethora of new extensions. These could allow Apple to focus on the core IDE experience and debugging tools while leaving the nice-to-haves up to the community, such as:

- Code formatting
- Code linting
- Intellisense features such as highlighting dead code, unused parameters, call count, etc.
- Support for Apple-adjacent tools such as GYB, SwiftGen, Sourcery, etc.

Apple could even provide some of these extensions and update them independently of Xcode releases.

## Improvements to Wireless Debugging

With rumours of a portless iPhone on the horizon wireless debugging will need to see some drastic improvements.

The main limitation of wireless debugging seems to be data throughput so I'm guessing that these would be not be sold as wireless debugging improvements but overall improvements to debugging speed, such as by reducing the data that needs to be sent to the device.

## SwiftUI Improvements

SwiftUI is still my favourite changes of the last few years. I was ecstatic when it was announced. But there are a lot of areas that still need improving.

### Cross Platform Use

SwiftUI was sold as a UI framework with cross platform support, but that quickly falls apart if you want write a SwiftUI-only app.

My biggest gripe occurs when trying to use a modifier that is only supported on a subset of platforms, such as tap gestures and navigation title styles. Making these no-ops on unsupported platforms (similar to what Catalyst does on macOS) or providing a method to only apply a modifier on a specific platform would be very welcomed.

The [Swift evolution pitch "‘#if’ for postfix member expressions"](https://forums.swift.org/t/if-for-postfix-member-expressions/44159) could fix this but it's not yet been reviewed.

### Bring SwiftUI Views On-Par With Their UIKit/AppKit Counterparts

Some SwiftUI views do not have feature parity with their UIKit or AppKit counterparts. For example setting the preferred display mode for a split view is not possible. SwiftUI tries to be clever and use a `UISplitViewController` when the content of a `NavigationView` contains more than 1 view, but it's not possible to then control how these are shown.

A lot of the time saved by using SwiftUI can be lost to silly things like this requiring a fallback to UIKit or AppKit, which can lead to a different set of bugs and limitations. Hopefully some of these gaps are filled this year!

## Centralised Store for OS Runtimes

A large chunk of the download size of Xcode is the support for various platforms.

They appear to be compatible with each other and [symlinking the runtimes is recommended when using GitHub Actions](https://github.com/actions/virtual-environments/issues/551#issuecomment-788822538), so in theory they could be store centrally.

This could reduce the initial download size of Xcode and ease updating. Sometimes I only care about a Swift update or a new IDE feature and I don't need the latest tvOS runtime, so why do I have to download it?

## Moonshots

### A CI Solution From Apple

Since Apple bought buddybuild in early 2018 I've been hoping it would go a similar way to the TestFlight acquisition and be integrated in to their developer services. It's been 3 years and I'm still hoping for this, but I'm putting this in the moonshot category because I now think if Apple were to provide this they'd want the servers to run on Apple Silicon and the current hardware offerings aren't aimed at the server market, although the M1 Mac Mini could be a candidate.

### Unlocking of Existential Types

I love generics a little too much and often abuse them. While I aim to improve my use of generics – often by removing them – unlocking existential types would be a huge win.

There's an evolution pitch ([Lifting the “Self or associated type” constraint on existentials](https://forums.swift.org/t/lifting-the-self-or-associated-type-constraint-on-existentials/18025)) that's been discussing this for a few years but I'm still hopeful it could make its way in to Swift 6.

### Documentation Improvements

Apple's quality and quantity of documentation has fallen in recent years and while we've seen some improvements lately I have a feeling WWDC 2021 isn't going to fix all of this.

I don't believe Apple would've been holding back on us when it comes to documentation updates, especially since there have been updates recently, such as adding missing documentation to some Combine APIs.

I would love to be wrong about this and see the majority of new APIs have clear documentation when the Xcode 13 beta is available but I'm still classing this as a moonshot.

### Support for New APIs and Bug Fixes on Previous iOS Versions

Currently the vast majority of bug fixes are fixed by OS updates. Although the adoption rate of iOS updates is high it's not something that can be relied on.

A recent example of this the bug fix that now allows multiple `sheet(isPresented:onDismiss:content:)` and `fullScreenCover(item:onDismiss:content:)` modifiers in the same view hierarchy, [as long as the user is running iOS 14.5 beta 3 or later](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14_5-beta-release-notes#Resolved-in-iOS-&-iPadOS-14.5-Beta-3). This means that without bumping the deployment target the fix cannot be use. This is a bug that's very easy to miss in testing, especially if you're unaware of it.

For some APIs this could be a shim layer that gets downloaded with the first app that uses the API and then dynamically linked at app launch. I'm not familiar enough with how this could work on a technical level to say if this is viable but I know it would be massively loved by developers!

### A Developer-Focussed iOS Device, OS Version, or Apps

The [Apple Security Research Device Program](https://developer.apple.com/programs/security-research-device/) allows security researchers to own an iPhone that provides shell access. This level of access would not be required for developers. I would be very happy with support for downgrading the OS version and more on-device options for debugging such as simulating the location of device without Xcode.

While working on macOS apps I find the `defaults` command very useful. Having something similar on iOS would surely prove itself useful too. This may require the sandbox to be loosened and so feels unlikely, although if this were allowed there may be many more developer-focussed apps that it would enable.

### Safari Vertical Tabs

The [Tree Style Tab Firefox extension](https://piro.sakura.ne.jp/xul/_treestyletab.html.en) makes navigating more than a few tabs manageable. I find this most useful when researching something, such as when looking at a new API and utilising different blog posts, documentation, etc.

This a real moonshot because I don't see Apple adding this as a native feature to Safari, nor do I see them opening the extensions API to allow a 3rd party to develop this.

For now I'll likely be sticking with Firefox!

---

Writing this post has made me very excited for WWDC 2021, which is looking to be the second virtual conference in a row. Personally I like the virtual format but I'm looking forward to the possibility of attending in person again!
