---
title: On Code Coverage
tags: ["swift", "tests"]
date: 2022-01-07T19:50:47Z
draft: true
---

Code coverage is a measure of a test suite, but I pine for better insight in to the quality of a test suite.

I recently updated [Persist](https://github.com/JosephDuffy/Persist) to have 100% code coverage, which is something I'm happy to have, but it's not the whole story.

<!-- more -->

## 100% Coverage Does Not Mean 100% of Code Paths

There are various scenarios that can show as 100% code coverage but still have edge cases. Some of these are quite obvious, but a lot of them are going to be subtle. An example of something subtle that could be part of something more complex are explictly unwrapped optionals. Great care should be taken when explicitly unwrapping an optional, and it could be argued they shouldn't be used, but that's beside the point.

```swift
func doSomethingWithNumber(_ number: Int) {
    var string: String?

    if number > 0 {
        string = "hello"
    } else if string < 0 {
        string = "goodbye"
    }

    print(string!)
}

func test_doSomethingWithNumber() {
    doSomethingWithNumber(1)
    doSomethingWithNumber(-1)
}
```

Ignoring that great care should be taken when explicitly unwrapping an optional and that this is

This test would provide 100% code coverage. But in reality the explicitly unwrapped optional is not being tested. If this were expanded it would become clear what's not being tested:

```swift
func doSomethingWithNumber(_ number: Int) {
    var string: String?

    if number > 0 {
        string = "hello"
    } else if string < 0 {
        string = "goodbye"
    }

    if let string = string {
        print(string)
    } else {
        fatalError("`string` is `nil`")
    }
}
```

These kinds of branches can occur in less contrived ways, and they're often much harder to spot.

## It Encourages Fluff Tests

Aiming for 100% coverage often leads to the creation of "fluff" tests -- tests that aren't actually proving any sort of correctness or providing protection against regressions.
