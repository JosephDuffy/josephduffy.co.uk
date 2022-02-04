---
title: My Opinionated Swift Style and Rules
tags: ["swift", "swiftpm"]
date: 2022-02-04T15:01:14Z
draft: true
---

Inspired by a [Twitter thread on writing clearer code](https://twitter.com/chockenberry/status/1486399628954062848) I wanted to write down my own style and rules that I follow when writing Swift.

As someone that struggles with reading in general (my dyslexia report states a very low score for comprehension) I find terse and

<!-- more -->

<p class="info">
I want to preface this post by saying that these are my <em>opinions</em> and I do not try to force them on anyone I work with.
</p>

## When in doubt: whitespace

Since there aren't any automated formatters for Swift that integrate cleanly with Xcode I find it hard to

### Indent to show scope

```swift
guard let firstName = form.firstName, let lastName = form.lastName else { return nil }
```

```swift
guard let firstName = form.firstName,
    let lastName = form.lastName
    else { return nil }
```

```swift
func doSomething(price: Decimal,
                 quantity: Int,
                 name: String) {
    // Do something
}
```

## Verbosity > Compactness

### Using `$0`

Never use `$0` unless it's on the same line as the opening `{` for the closure. Looking at the following it's impossible to know what `$0` is:

```swift
  if $0.price > 0 {
    return "\($0.price)"
  } else {
    return "Free"
  }
}
```

We know it's returning the price _something_, but it could be anything: a product, a shipping option, a service, etc.

This is much clearer with the name:

```swift
  if shippingMethod.price > 0 {
    return "\(shippingMethod.price)"
  } else {
    return "Free"
  }
}
```

Now we know this is a shipping method and not "something with a price."

### Multiple `guard`s or `if`s

I have seen increadably long single-line `guard`s similar to:

```swift
guard let firstName = form.firstName, let lastName = form.lastName, let email = form.email, let message = form.message else { return nil }
```

Not only is this very long but a lot of the information is lost.

One way to improve this is to at least break it up on to multiple lines:

```swift
guard
    let firstName = form.firstName,
    let lastName = form.lastName,
    let email = form.email,
    let message = form.message
else { return nil }
```

It may be more code to write but it's both easier to read and debug when these are broken up:

## Log Generously

I often include very noisy and verbose logs. This is primarily due to it being essentially impossible to debug an issue that has just occurred without any logs; there's no timetravelling debugger for Swift and most bugs have you thinking "huh, that should never happen!"

There are 2 fairly big downsides to this: Xcode has quite poor log filtering, and debug and info logs are discarded by the iOS simulator without changing the settings.

I would love for Console.app to be built in to Xcode in some way, although that wouldn't solve this compeltely.

### Console.app Sidebar

Console.app could be _so good_ but it's missing a major feature: the ability to share/save filters. If I want to share a filter set with another developer or across multiple computers I have to write down how to create the filter. There's no share option and copy/pasting only works on the computer it was copied from because the filter field uses a custom pasteboard data type.
