---
title: Don't Use Scope Modifiers with Extensions
tags:
  - swift
date: 2022-03-21T21:13:34Z
imageURL: "/images/swift-extension-scope-modifiers.png"
---

Extending types in Swift support setting the scope for the extension, i.e. `public`, `internal`, or `private`, with `internal` being implicit if nothing is specified.

This may seem useful, but given the following snippet it's impossible to know what the scope of a function is:

```swift
func doSomething() {
    // Do the thing
}
```

<!-- more -->

The reason for this is that the context is entirely lost. If there's a chance this is declared on an extension it could be literally anything. Without having all the surrounding context the line above – or hundreds of lines above – there could be an `extension MyType` with any scope.

It could be any of these:

```swift
/* Implicitly internal */ extension MyType {
    func doSomething() {
        // Do the thing
    }
}
```

```swift
public extension MyType {
    func doSomething() {
        // Do the thing
    }
}
```

```swift
internal extension MyType {
    func doSomething() {
        // Do the thing
    }
}
```

```swift
private extension MyType {
    func doSomething() {
        // Do the thing
    }
}
```

I've been aiming to improve the maintainability of my code lately, and this is one of the things I'm doing to improve that. If I want to jump in and quickly fix a bug or make an update I don't want to guess the access level of anything.

In frameworks I've found it useful always be explicit about the access level. This forces me to think about a symbol being `public` or `internal`, so even if the `internal` is implicit I like to add it. Maybe I'll change my mind of that though, just as I did with explicit `self` 😬
