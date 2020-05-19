---
title: Capturing More Than `self`
tags: ["swift"]
date: 2020-05-14
---

A common pattern when using closures in Swift is to add `[weak self]` in the captures list to hold a weak reference to `self` and avoid a retain cycle. This is then often followed by the following:

```swift
guard let self = self else { return }
```

But I often forget that capture lists can capture other variables in the current scope, so I thought I'd highlight some other use cases.

<!-- more -->

When creating a closure in mutating function of a `struct` capturing `self` is not possible:

```swift
struct Foo {
    var bar: Bool

    mutating func createClosure() -> () -> Bool {
        return { // Error: Escaping closure captures mutating 'self' parameter
            return self.bar
        }
    }
}

var foo = Foo(bar: true)
let closure = foo.createClosure()
closure()
```

To work around this you can capture the property:

```swift
struct Foo {
    var bar: Bool

    mutating func createClosure() -> () -> Bool {
        return { [bar] in
            return bar
        }
    }
}

var foo = Foo(bar: true)
let closure = foo.createClosure()
closure() // true
```

Another use case is capturing a variable a time of closure creation, when it can also be useful to rename the variable:

```swift
class Foo {
    var bar: Bool

    init(bar: Bool) { self.bar = bar }

    func doSomething() {
        let closure = { [weak self, originalBar = bar] in
            guard let self = self else { return }

            if originalBar != self.bar {
                print("Bar has changed")
            } else {
                print("Bar did not change")
            }
        }

        bar.toggle()

        closure()
    }
}

let foo = Foo(bar: true)
foo.doSomething()
```

The above code will print `Bar has changed`.

To read more in-deptch information about closures read the [Swift language guide page on closures](https://docs.swift.org/swift-book/LanguageGuide/Closures.html).
