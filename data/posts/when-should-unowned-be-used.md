---
title: When Should unowned Be Used?
tags: ["swift"]
date: 2021-03-04T12:53:34Z
draft: true
---

`unowned` is a commonly misused of Swift; when I started my first iOS job the crash rate of the was brought up by a significant percent by searching the crash logs for references to `unowned`.

There are a few different scenarios where it's tempting to use `unowned`, but I would like to make a case for `unowned` to almost never be used

<!-- more -->

# The One Exception?

The only scenario I personally use `unowned` in is when the object being referenced and the object storing a closure are **fully** controlled the same object. For example:

```swift
protocol Animal {
    var speak:
}

final class Cat: Animal {

}
```
