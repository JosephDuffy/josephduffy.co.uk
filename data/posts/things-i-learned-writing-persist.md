---
title: Things I Learned Writing Persist
tags: ["swift", "persist"]
date: 2020-06-18
draft: true
---

Recently I released the 1.0 version of Persist, a Swift package I've been working on for the last few months, and thought it would be interesting to write up some of the things I learned along the way.

## UserDefaults

`UserDefaults` is a very common method of persisting data on Apple's platforms. Normally I would write code similar to:

```swift
UserDefaults.standard.set(123.45, forKey: "my-key")
UserDefaults.standard.double(forKey: "my-key")
```

However, when adding generics around `UserDefaults` surfaces some of the internals. For example, setting a `Double` without a factional part for a key and requesting the value from `objectForKey(_:)` will return an `Int`:

```swift
UserDefaults.standard.set(123 as Double, forKey: "my-key")
UserDefaults.standard.objectForKey("my-key") // Int(123)
```

This is also true of `Bool`s:

```swift
UserDefaults.standard.set(false, forKey: "my-key")
UserDefaults.standard.objectForKey("my-key") // Int(0)
```

<!-- more -->
