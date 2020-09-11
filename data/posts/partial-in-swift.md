---
title: Partial in Swift
tags: ["swift", "partial"]
date: 2018-07-10
---

Structs are incredibly useful in Swift, especially when representing static read-only data. However, the values of a struct often come from multiple sources, such as view controllers, network requests, and files on disk, which can make the creation of these structs cumbersome.

There are numerous methods to work around this, but each have their downsides. One of these methods is to change the struct to a class and update the properties to vars, but this removes the advantages of read-only structs. Another is to make a "builder" object, but the API of this object must be kept in-sync with the object is wraps.

`Partial` eliminates these problems by providing a type-safe API for building structs by utilising generics and `KeyPath`s. Although I learned of the concept of `Partial` through TypeScript – which [provides `Partial` as a built-in type][1] – the Swift implementation supports many more use cases.

<!-- more -->

To demonstrate the use of `Partial` I will use some simple structs with a few let properties.

```swift
struct Order {

    let userId: Int

    let itemIds: [Int]

    let promoCode: String?

    let address: Address

    let billingDetails: BillingDetails

}

struct Address {

    let name: String

    let firstLine: String

    let additionalLines: [String]

    let city: String

    let postCode: String

}

struct BillingDetails {

    let creditCardNumber: String

    let ccv: String

    let address: Address

}
```

## The basic implementation

For simple use cases, only a very simple implementation is required.

```swift
struct Partial<Wrapped> {

    private var values: [PartialKeyPath<Wrapped>: Any] = [:]

    subscript<ValueType>(key: KeyPath<Wrapped, ValueType>) -> ValueType? {
        get {
            return values[key] as? ValueType
        }
        set {
            values[key] = newValue
        }
    }

}
```

You can get and set values by using the subscript of a `Partial` and passing a `KeyPath` of the wrapped type.

```swift
var partialOrder = Partial<Order>()
partialOrder[\.userId] // nil
partialOrder[\.userId] = 123
partialOrder[\.userId] // 123
```

However, `Partial`s can be much for more powerful than just this.

### Initialisation of the Wrapped Type

One of the first issues you run across with `Partial`s as basic as this is that the initialisation of the wrapped type can be a bit cumbersome.

```swift
struct Order {

    // ...

    init?(partial: Partial<Order>) {
        guard let userId = partial[\.userId] else { return nil }
        guard let itemIds = partial[\.itemIds] else { return nil }

        self.userId = userId
        self.itemIds = itemIds
        self.promoCode = partial[\.promoCode]

        // Must check for both scenarios
        let partialAddress = partial[partial: \Order.address]
        if let name = partialAddress[\.name],
            let firstLine = partialAddress[\.firstLine],
            let additionalLines = partialAddress[\.additionalLines],
            let city = partialAddress[\.city],
            let postCode = partialAddress[\.postCode] {
            self.address = Address(name: name, firstLine: firstLine, additionalLines: additionalLines, city: city, postCode: postCode)
        } else if let address = partial[\.address] {
            self.address = address
        } else {
            return nil
        }

        // Same must be done for `billingDetails`...
    }

```

By defining a new protocol, a throwing function that can retrieve values, and adding a new subscript that can "unwrap" any values stored in sub-`Partial`s, the call site can be much more concise and clear.

```swift
protocol PartialConvertible {

    init(partial: Partial<Self>) throws

}

struct Partial<Wrapped> {

    // ...

    enum Error: Swift.Error {
        case missingKey(PartialKeyPath<Wrapped>)
        case invalidValueType(key: PartialKeyPath<Wrapped>, actualValue: Any)
    }

    func value<ValueType>(for key: KeyPath<Wrapped, ValueType>) throws -> ValueType {
        if let value = values[key] {
            if let value = value as? ValueType {
                return value
            } else {
                throw Error.invalidValueType(key: key, actualValue: value)
            }
        } else if let value = backingValue?[keyPath: key] {
            return value
        } else {
            return Error.missingKey(key)
        }
    }

    func value<ValueType>(for key: KeyPath<Wrapped, ValueType>) throws -> ValueType where ValueType: PartialConvertible {
        if let value = values[key] {
            if let value = value as? ValueType {
                return value
            } else if let partial = value as? Partial<ValueType> {
                return try ValueType(partial: partial)
            } else {
                throw Error.invalidValueType(key: key, actualValue: value)
            }
        } else if let value = backingValue?[keyPath: key] {
            return value
        } else {
            throw Error.missingKey(key)
        }
    }

    subscript<ValueType>(key: KeyPath<Wrapped, ValueType>) -> ValueType? where ValueType: PartialConvertible {
        get {
            return try? value(for: key)
        }
        set {
            values[key] = newValue
        }
    }

}

struct ExportOptions: PartialConvertible {

    // ...

   init(partial: Partial<Order>) throws {
        userId = try partial.value(for: \.userId)
        itemIds = try partial.value(for: \.itemIds)
        promoCode = try partial.value(for: \.promoCode)
        address = try partial.value(for: \.address)
        billingDetails = try partial.value(for: \.billingDetails)
    }

}

extension Order.Address: PartialConvertible {

    init(partial: Partial<Order.Address>) throws {
        name = try partial.value(for: \.name)
        firstLine = try partial.value(for: \.firstLine)
        additionalLines = try partial.value(for: \.additionalLines)
        city = try partial.value(for: \.city)
        postCode = try partial.value(for: \.postCode)
    }

}

extension Order.BillingDetails: PartialConvertible {

    init(partial: Partial<Order.BillingDetails>) throws {
        creditCardNumber = try partial.value(for: \.creditCardNumber)
        ccv = try partial.value(for: \.ccv)
        address = try partial.value(for: \.address)
    }

}
```

Much better!

## Recursive `Partial`s

`Partial`s on their own are great, but once you try to access a property of a property of a `Partial` it stops working quite as expected.

```swift
partialOrder[\.address][\.name] = "Santa Claus" // Not possible
```

To support this a new subscript and a `value(for:)` function that utilises the `PartialConvertible` protocol is required.

```swift

struct Partial<Wrapped> {

    // ...

    func value<ValueType>(for key: KeyPath<Wrapped, ValueType>) throws -> ValueType where ValueType: PartialConvertible {
        guard let value = values[key] else {
            throw Error.missingKey(key)
        }
        if let value = value as? ValueType {
            return value
        } else if let partial = value as? Partial<ValueType> {
           return try ValueType(partial: partial)
        } else {
           throw Error.invalidValueType(key: key, actualValue: value)
        }
    }

    subscript<ValueType>(key: KeyPath<Wrapped, ValueType>) -> Partial<ValueType> where ValueType: PartialConvertible {
        get {
            return values[key] as? Partial<ValueType> ?? Partial<ValueType>()
        }
        set {
            values[key] = newValue
        }
    }

}

partialOrder[\.address][\.name] // nil
partialOrder[\.address][\.name] = "Johnny Appleseed"
partialOrder[\.address][\.name] // "Johnny Appleseed"
```

However, because it will always return a `Partial`, there will be an issue if the value has been explicitly set elsewhere:

```swift
partialOrder[\.address] = Address(name: "Johnny Appleseed", ...)
partialOrder[\.address] // An empty `Partial`
try? Order.Address(partial: partialOrder[\.address]) // nil
```

To support this a backing value is added, allowing the stored value to be wrapped and its properties overridden.

The type of the `values` property is also updated to `[PartialKeyPath<Wrapped>: Any?]` and subscript setters are updated to use the `updateValue(_:forKey:)` function. This is to support unsetting values by assigning a key to `nil` when a backing value is used.

```swift
struct Partial<Wrapped> {

    // ...

    private var values: [PartialKeyPath<Wrapped>: Any?] = [:]

    private var backingValue: Wrapped? = nil

    init(backingValue: Wrapped? = nil) {
        self.backingValue = backingValue
    }

    func value<ValueType>(for key: KeyPath<Wrapped, ValueType>) throws -> ValueType {
        if let value = values[key] {
            if let value = value as? ValueType {
                return value
            } else {
                throw Error.invalidValueType(key: key, actualValue: value)
            }
        } else if let value = backingValue?[keyPath: key] {
            return value
        } else {
            throw Error.missingKey(key)
        }
    }

    func value<ValueType>(for key: KeyPath<Wrapped, ValueType>) throws -> ValueType where ValueType: PartialConvertible {
        if let value = values[key] {
            if let value = value as? ValueType {
                return value
            } else if let partial = value as? Partial<ValueType> {
                return try ValueType(partial: partial)
            } else {
                throw Error.invalidValueType(key: key, actualValue: value)
            }
        } else if let value = backingValue?[keyPath: key] {
            return value
        } else {
            throw Error.missingKey(key)
        }
    }

    subscript<ValueType>(key: KeyPath<Wrapped, ValueType>) -> ValueType? {
        get {
            return try? value(for: key)
        }
        set {
            values.updateValue(newValue, forKey: key)
        }
    }

    subscript<ValueType>(key: KeyPath<Wrapped, ValueType>) -> Partial<ValueType> where ValueType: PartialConvertible {
        get {
            if let value = try? self.value(for: key) {
                return Partial<ValueType>(backingValue: value)
            } else if let partial = values[key] as? Partial<ValueType> {
                return partial
            } else {
                return Partial<ValueType>()
            }
        }
        set {
            values.updateValue(newValue, forKey: key)
        }
    }

}

partialOrder[\.address] = Address(name: "Mr Appleseed", ...)
partialOrder[\.address][\.name] // "Mr Appleseed"
partialOrder[\.billingAddress][\.address] = partialOrder[\.address]
partialOrder[\.billingAddress][\.address][\.name] = "Johnny Appleseed"
partialOrder[\.billingAddress][\.address][\.name] // "Johnny Appleseed"
```

### Dealing with Optional Properties

When using a property of `Wrapped` that's optional, such as `promoCode` on `Order`, the type of `partial[\.promoCode]` will be `String??`. To work around this every function and subscript needs to be duplicated to support a key of type `KeyPath<Wrapped, ValueType?>`.

For the sake of brevity, only one of these is shown below.

```swift
struct Partial<Wrapped> {

    // ...

    subscript<ValueType>(key: KeyPath<Wrapped, ValueType?>) -> ValueType? {
        get {
            return try? value(for: key)
        }
        set {
            values.updateValue(newValue, forKey: key)
        }
    }

}
```

Swift will pick the right one based on context.

## Downsides

Using `Partial` _does_ have some downsides. One is that you still have to create a custom `init` function, a requirement that could be removed by adding `Partial` to the standard library or made easier using metaprogramming tools such as Sourcery.

Another downside is that Xcode will not provide autocomplete suggestions for `KeyPath`s, _unless_ the type is provided before the period.

```swift
partialOrder[\.userId] // Will not autocomplete
partialOrder[\Order.userId] // Will autocomplete
```

This is not an issue with `Partial` itself but is a shortcoming due to its reliance on `KeyPath`

<!--A radar has been filled about this issue-->

`Partial` is still a value type, which prevents the same instance being passed between objects. Some may choose to update `Partial` to be a class, but I prefer to provide a small wrapper in the form of a class with a single `partial` property and a convenient function for `PartialConvertible` values. It could be subclassed or extended to support per-type convenience functions, a delegate, a completion closure, etc.

```swift
class PartialBuilder<Wrapped> {

    var partial: Partial<Wrapped>

    init(partial: Partial<Wrapped> = Partial<Wrapped>()) {
        self.partial = partial
    }

    init(backingValue: Wrapped) {
        partial = Partial(backingValue: backingValue)
    }

}

extension PartialBuilder where Wrapped: PartialConvertible {

    func unwrappedValue() throws -> Wrapped {
        return try Wrapped(partial: partial)
    }

}

```

## Full Code

If you want to try `Partial` yourself you can [download the playground][2], or [download Partial.swift][3] and add it to your project.

Below is the full code – excluding documentation and `CustomStringConvertible` and `CustomDebugStringConvertible` conformance for the sake of brevity – plus a full example of how `Partial` can be used.

```swift
struct Partial<Wrapped>: CustomStringConvertible, CustomDebugStringConvertible {

    enum Error<ValueType>: Swift.Error {
        case missingKey(KeyPath<Wrapped, ValueType>)
        case invalidValueType(key: KeyPath<Wrapped, ValueType>, actualValue: Any)
    }

    private var values: [PartialKeyPath<Wrapped>: Any?] = [:]

    private var backingValue: Wrapped? = nil}
    }

    init(backingValue: Wrapped? = nil) {
        self.backingValue = backingValue
    }

    func value<ValueType>(for key: KeyPath<Wrapped, ValueType>) throws -> ValueType {
        if let value = values[key] {
            if let value = value as? ValueType {
                return value
            } else if let value = value {
                throw Error.invalidValueType(key: key, actualValue: value)
            }
        } else if let value = backingValue?[keyPath: key] {
            return value
        }

        throw Error.missingKey(key)
    }

    func value<ValueType>(for key: KeyPath<Wrapped, ValueType?>) throws -> ValueType {
        if let value = values[key] {
            if let value = value as? ValueType {
                return value
            } else if let value = value {
                throw Error.invalidValueType(key: key, actualValue: value)
            }
        } else if let value = backingValue?[keyPath: key] {
            return value
        }

        throw Error.missingKey(key)
    }

    func value<ValueType>(for key: KeyPath<Wrapped, ValueType>) throws -> ValueType where ValueType: PartialConvertible {
        if let value = values[key] {
            if let value = value as? ValueType {
                return value
            } else if let partial = value as? Partial<ValueType> {
                return try ValueType(partial: partial)
            } else if let value = value {
                throw Error.invalidValueType(key: key, actualValue: value)
            }
        } else if let value = backingValue?[keyPath: key] {
            return value
        }

        throw Error.missingKey(key)
    }

    func value<ValueType>(for key: KeyPath<Wrapped, ValueType?>) throws -> ValueType where ValueType: PartialConvertible {
        if let value = values[key] {
            if let value = value as? ValueType {
                return value
            } else if let partial = value as? Partial<ValueType> {
                return try ValueType(partial: partial)
            } else if let value = value {
                throw Error.invalidValueType(key: key, actualValue: value)
            }
        } else if let value = backingValue?[keyPath: key] {
            return value
        }

        throw Error.missingKey(key)
    }

    subscript<ValueType>(key: KeyPath<Wrapped, ValueType>) -> ValueType? {
        get {
            return try? value(for: key)
        }
        set {
            values.updateValue(newValue, forKey: key)
        }
    }

    subscript<ValueType>(key: KeyPath<Wrapped, ValueType?>) -> ValueType? {
        get {
            return try? value(for: key)
        }
        set {
            values.updateValue(newValue, forKey: key)
        }
    }

    subscript<ValueType>(key: KeyPath<Wrapped, ValueType>) -> Partial<ValueType> where ValueType: PartialConvertible {
        get {
            if let value = try? self.value(for: key) {
                return Partial<ValueType>(backingValue: value)
            } else if let partial = values[key] as? Partial<ValueType> {
                return partial
            } else {
                return Partial<ValueType>()
            }
        }
        set {
            values.updateValue(newValue, forKey: key)
        }
    }

    subscript<ValueType>(key: KeyPath<Wrapped, ValueType?>) -> Partial<ValueType> where ValueType: PartialConvertible {
        get {
            if let value = try? self.value(for: key) {
                return Partial<ValueType>(backingValue: value)
            } else if let partial = values[key] as? Partial<ValueType> {
                return partial
            } else {
                return Partial<ValueType>()
            }
        }
        set {
            values.updateValue(newValue, forKey: key)
        }
    }

}

var partialOrder = Partial<Order>()
partialOrder[\.userId] = 123
partialOrder[\.itemIds] = [1, 4, 7]
partialOrder[\.promoCode] = "HELLO10"
partialOrder[\.address] = Address(name: "Johnny Appleseed", firstLine: "One Infinite Loop", additionalLines: ["Cupertino"], city: "CA", postCode: "95014")
partialOrder[\.billingDetails][\.creditCardNumber] = "1111 2222 3333 4444"
partialOrder[\.billingDetails][\.ccv] = "123"
partialOrder[\.billingDetails][\.address] = partialOrder[\.address]
partialOrder[\.billingDetails][\.address][\.name] = "Santa Claus"
partialOrder[\.billingDetails][\.address][\.firstLine] = "Santa's Grotto"
partialOrder[\.billingDetails][\.address][\.additionalLines] = []
partialOrder[\.billingDetails][\.address][\.city] = "Reindeerland"
partialOrder[\.billingDetails][\.address][\.postCode] = "XM4 5HQ"

do {
    let order = try Order(partial: partialOrder)
    order.userId // 123
    order.address.name // Johnny Appleseed
    order.billingDetails.address.name // "Santa Clause"
} catch {
    error
}
```

## Special Thanks

[Shaps][4] helped me a lot with this post, from working with me through the evolution of the implementation to reading drafts of this post. Thanks, Shaps!

[1]: https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
[2]: https://josephduffy.co.uk/public/Partial.playground.zip
[3]: https://gist.github.com/JosephDuffy/66dba40d3d591f83518d0d0d28a0f7f8
[4]: https://twitter.com/shaps
