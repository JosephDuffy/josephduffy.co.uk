---
title: HashableByKeyPath framework release 1.0.0
tags: ["swift", "HashableByKeyPath"]
date: 2020-04-30
---

Today I have released the 1.0.0 version of a Swift package that aids with adding `Equatable` and `Hashable` conformance by using `KeyPath`s.

The package is [available on GitHub](https://github.com/JosephDuffy/HashableByKeyPath/).

I created the [Swift Playground that sparked this concept in December 2018](/images/HashableByKeyPath/playground-metadata.png), so this concept has been rattling around in my brain for a couple of years. The API has changed a _lot_ since the original concept, but the core has stayed the same: a protocol that requires a single function to be implemented that uses `KeyPath`s to synthesise `Equatable` and/or `Hashable` conformance.

<!-- more -->

One of the mistakes I've made more times than I care to admit is comparing the wrong properties or objects when adding `Equatable` conformance, e.g.:

```swift
struct Foo: Equatable {
    static func == (lhs: Foo, rhs: Foo) -> Bool {
        return lhs.bar1 == rhs.bar1 && lhs.bar2 == rhs.bar1 && rhs.bar3 == rhs.bar3
    }

    var bar1: String
    var bar2: String
    var bar3: Int
}
```

These can be easy to type and hard to spot (even with better layout). The `EquatableByKeyPath` protocol fixes this issue:

```swift
struct Foo: EquatableByKeyPath {
    static func addEquatableKeyPaths<Consumer: EquatableKeyPathConsumer>(to consumer: inout Consumer) where Consumer.Root == Self {
        consumer.addEquatableKeyPath(\.bar1)
        consumer.addEquatableKeyPath(\.bar2)
        consumer.addEquatableKeyPath(\.bar3)
    }

    var bar1: String
    var bar2: String
    var bar3: Int
}
```

Adding the `addEquatableKeyPaths(to:)` function will synthesise `Equatable` conformance. Since you provide every `KeyPath` once it's not possible to compare the wrong properties or objects.

Another mistake I've made a lot is not keeping my `Equatable` and `Hashable` conformance in sync. e.g. I add a new property but only add it to `==` and not `hash(into:)`. According to `Hashable`, this is bad:

> Hashing a value means feeding its essential components into a hash function, represented by the Hasher type. Essential components are those that contribute to the type’s implementation of Equatable. Two instances that are equal must feed the same values to Hasher in hash(into:), in the same order.

_Source: [https://developer.apple.com/documentation/swift/hashable](https://developer.apple.com/documentation/swift/hashable)_

The `HashableByKeyPath` protocol fixes this issue:

```swift
struct Foo: HashableByKeyPath {
    static func addHashableKeyPaths<Consumer: HashableKeyPathConsumer>(to consumer: inout Consumer) where Consumer.Root == Self {
        consumer.addHashableKeyPath(\.bar1)
        consumer.addHashableKeyPath(\.bar2)
        consumer.addHashableKeyPath(\.bar3)
    }

    var bar1: String
    var bar2: String
    var bar3: Int
}
```

Adding the `addHashableKeyPaths(to:)` function will synthesise `Hashable`, `EquatableByKeyPath`, and `Equatable` conformance. Since you provide every `KeyPath` once and only have 1 functions it's not possible to compare the wrong properties or objects or have your `Equatable` and `Hashable` conformances out of sync.

I will admit that this can't replace _every_ `Equatable` and `Hashable` conformance out there, but I've not had a scenario yet I had to manually implement `==` or `hash(into:)`.
