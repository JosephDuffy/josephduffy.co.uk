---
title: Tips on Using Swift Collections
tags: ["swift", "swiftpm"]
date: 2022-02-04T15:01:43Z
draft: true
---

Most people working with Swift will be familiar with at least 2 collections: `Array` and `Set`. But it might not be clear that there are other collections being used, such as `String` and `LazyCollection`.

<!-- more -->

## Indices

## Lazy

Lazy can be very useful and aid with performance, but note that it can also hurt performance.

`LazyCollection` has extra overhead, but it can help when you might not need to iterate over the full collection.

For example take this:

```swift
let mixedArray: [Any] = [
  0,
  "1",
  [
    "0",
    1,
  ],
  3.0,
]

let firstInteger = mixedArray.compactMap { $0 as? Int }.first
```

TODO: Make custom iterator to demonstrait.

This will iterate over our entire array, check the type of every element, and then check if the resulting array has an element.

Using `lazy` means we can stop early:

```swift
let mixedArray: [Any] = [
  0,
  "1",
  [
    "0",
    1,
  ],
  3.0,
]

let firstInteger = mixedArray.lazy.compactMap { $0 as? Int }.first
```
