---
title: Partial framework release 1.0.0
tags: ["swift"]
date: 2019-07-10
---

Today marks 1 year since I released a [blog post demonstrating an implementation of Partial in Swift](https://josephduffy.co.uk/partial-in-swift), and it also marks the release of the 1.0.0 version of a Swift package for Partial.

The package is [available on GitHub](https://github.com/JosephDuffy/Partial/) and supports SwiftPM, Carthage, and CocoaPods.

This blog post will go over some of the changes that have been made since the original blog post, my rationale when making certain decisions, and how I have thought about maintenance. If you want to try out Partial and see how it can be used head over to the [GitHub page](https://github.com/JosephDuffy/Partial/).

<!-- more -->

## Changes since the original blog post

Since the original blog post on Partial I have used Partial in production, learned a lot more about Swift, and Swift has received a few updates. Throughout this time I have found some shortcomings and have had more time to think about how some aspects should work.

From a consumer's point of view one of the main things that have been updated is that there are no longer any possibilities for ambiguity, which were a real problem with the previous implementation. The `PartialBuilder` has also been upgraded to provide subscriptions.

Internally the implementation has been simplified, making testing much easier.

### Dynamic member lookup

As of writing Swift 5.1 is in beta. As part of the 1.0.0 release I have added support for dynamic member lookup when compiling with Swift 5.1, which is a very nice improvement over the subscripting API:

```swift
// Swift 5.0
partial[\.foo]

// Swift 5.1
partial.foo
```

Version 1.0.0 still supports subscripts, but they are deprecated when using Swift 5.1.

### `PartialBuilder`

In the original blog post I mentioned `PartialBuilder`, but it was not included in the linked gist. As part of the package release I have included `PartialBuilder`. The new implementation include subscriptions to all changes and key path changes.

### Removal of embedded partials

While at first embedded partials seemed useful I have found that there are better ways to handle setting a partial value on another partial, and it also caused some frustrating ambiguity with the Swift compiler.

Rather than setting a partial value I found it more useful to _attempt_ to set a partial value. For example, assuming `CGSize` conforms to `PartialConvertible`, setting a key path of type `CGSize` to a partial can be done via `setValue(_:for:)`. If the value fails to be unwrapped this function will rethrow the error.

```swift
struct SizeWrapper {
    let size: CGSize
}
var wrapperPartial = Partial<SizeWrapper>()
var sizePartial = Partial<CGSize>()
try wrapperPartial.setValue(sizePartial, for: \.size) // Will throw an error, value will not be set
sizePartial.width = 6016
sizePartial.height = 3384
try wrapperPartial.setValue(sizePartial, for: \.size) // Will set `size` to `CGSize(width: 6016, height: 3384)`
```

This has a few advantages:
 - When unwrapping a `PartialConvertible` type the implementer does not need to check for partial values
 - It is possible to subscribe for changes to a key path on a `PartialBuilder` and only be notified when a valid value has been set
 - Internally `Partial` does need to check for `Partial` values
 - 2 `setValue(_:for:)` and 2 `partialValue(for:)` functions could be removed

I do still find the concept of an embedded partial useful, but propose an alternative approach. For example, you may build an instance across multiple screens, setting the values on a single builder by utilising multiple builders.

```swift
struct SizeWrapper {
    let size: CGSize
}
let wrapperBuilder = PartialBuilder<SizeWrapper>()
let sizeSubscription = wrapperBuilder.subscribeForChanges(to: \.size) { update in
    print("Size has been set to \(update.newValue)")
}

let sizeBuilder = PartialBuilder<CGSize>()
let sizeSubscription = wrapperBuilder.subscribeToAllChanges { _, builder in
    do {
        try wrapperBuilder.setValue(builder, for: \.size)
    } catch {
        // Optionally remove the value here, or show the error to the user
        wrapperBuilder.removeValue(for: \.size)
        print("Error unwrapping partial size:", error)
    }
}
sizeBuilder.width = 6016
wrapperBuilder.size // `nil`
sizeBuilder.height = 3384
wrapperBuilder.size // `CGSize(width: 6016, height: 3384)`
```

Default values can be implemented by providing a custom unwrapping closure:

```swift
wrapperBuilder.subscribeToAllChanges { _, builder in
    wrapperBuilder.setValue(builder, for: \.size) { sizePartial in
        let width = sizePartial.width ?? 6016
        let height = sizePartial.height ?? 3384
        return CGSize(width: width, height: height)
    }
}
```

Note that because the unwrapping closure does not throw the call to `setValue(_:for:unwrapper:)` does not need to include `try`.

### Removal of `Optional`-specific functions

When I created the original version of Partial I found it necessary to create separate functions for handling `Optional`s. I am not sure if a Swift update has made the handling of `Optional` values better or my understanding around their handling was incorrect, but once I added the test suite and then removed the `Optional`-specific functions I found them to be unnecessary.

### Xcode autocomplete works (sometimes)

When I was writing the original blog post autocomplete for key paths was not provided within Xcode. As of writing this blog post this now works in _most_ situations. For example, typing `partial.`, `partial[\.]`, or `partial.value(for: \.)` will provide autocomplete, but `partial.setValue("new value", for: \.)` will not. This is a major improvement, but it's still not perfect.

## Future Updates

I wanted to get an MVP version 1.0.0 released as soon as possible. Partly to get the project setup complete so I can utilise the structure in other projects, but also because I have a habit of getting carried away with adding new features and never releasing anything.

One of the features I chose not to include in 1.0.0 is support for [Combine](https://developer.apple.com/documentation/combine). This was partly due to the desire to get a 1.0.0 released, but also because iOS 13 (which is required for Combine) is still in beta. I have used Combine in [GatheredKit](https://github.com/josephduffy/GatheredKit) and can see how simple it would be to implement so it is definitely slated for 1.1.0.

## Maintenance

In the past I have found that if I take a break from project a I will often to met with a certain amount of maintenance that needs to be performed before I can start work on the changes I want to make. To combat this I have been making some changes to how I setup my projects to make general maintenance easier:

 - Full test coverage
 - Automatic deployment
 - Automatic dependency updates

Having full test coverage is a no-brainer; I can feel much more confident about changes that are made. This is especially important for smaller projects like Partial because I will likely take larger breaks between chunks of work.

Automatic deployment is setup via git tags; when a tag is pushed Travis CI will create a pre-built binary for Carthage and attach it to a GitHub release. To remove the development dependencies from the SwiftPM package I have setup [Rocket](https://github.com/shibapm/Rocket/), which makes creating a release as easy as running `swift run rocket v1.0.0`. This vastly reduces the friction required for creating releases, meaning updates won't be sitting unreleased for extended periods of time.

Automatic dependency updates have proved worthwhile for me on other projects, so I have added [Dependabot](https://dependabot.com/) to the project. For my TypeScript projects this is much more useful because all dependencies can be updated, but unfortunately Dependabot does not support any Swift dependency managers (neither do any other dependency managers; I am not throwing shade at Dependabot here). This means that only some dependencies, such as those provided by RubyGems, are automatically updated. Nevertheless this is better than nothing.

## Summary

[Partial 1.0.0](https://github.com/JosephDuffy/Partial/releases/tag/v1.0.0) is a great update compared to the original blog post. It is much easier for me to maintain and is usable in production. If you find any issues, have any questions, and would like to request a feature please [open an issue on GitHub](https://github.com/JosephDuffy/Partial/issues/new/choose) or message [me on Twitter](https://twitter.com/Joe_Duffy).
