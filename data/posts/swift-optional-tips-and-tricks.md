---
title: Tip and Tricks working with Swift's Optionals
tags: ["swift", "swift-optional"]
date: 2020-07-14T12:55:20Z
draft: true
---

`Optional` is a very common type in Swift, but there are a couple of tips and tricks that I think could be useful

## Optionals Can be `map`ed

The `Optional` type has both `map(_:)` and `flatMap(_:)` functions, which can allow code like:

```swift
if let url = url {
  loadURL(url)
}
```

to be:

```swift
url.map(loadURL(_:))
```

## Checking if `Any` is an Optional

Sometimes you might need to write an API that takes an `Any` value and cast it to non-Any optional, e.g.:

```swift
let optionalStringAsAny: Any = Optional.some("String")
let optionalString = optionalStringAsAny as? String? // Don't do this
```

In this scenario the type of `optionalString` is `String??`.

So you might try:

```swift
let optionalStringAsAny: Any = Optional.some("String")
let optionalString = optionalStringAsAny as? String // Don't do this either
```

Something I find myself using more and more are the `map(_:)` and `flatMap(_:)` functions that are available on Swift's `Optional` type.

This post is part of a series of posts discussing the `Optional` type in Swift. To view other posts on this subject view the [swift-optional tag](/tags/swift-options).
