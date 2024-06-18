---
title: Smuggling Values Across Actors
tags: ["swift", "concurrency", "swift-6"]
date: 2024-06-18T01:12:34Z
---

I recently started updating an app to use the Swift 6 language mode and ran in to an issue using `AVCaptureMetadataOutputObjectsDelegate`. The issue is that the compiler cannot reason about which actor the delegate function is called on and it must be treated as nonisolated, however _we_ know that it's being called on a specific actor (in this case the `MainActor`), so how can we tell the compiler?

In Swift 5 language mode we can use `MainActor.assumeIsolated` and call it a day. But in Swift 6 this will produce an error:

```swift
import AVFoundation
import UIKit

@MainActor
final class ViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    private var output: AVCaptureMetadataOutput?

    override func viewDidLoad() {
        super.viewDidLoad()

        let output = AVCaptureMetadataOutput()
        output.setMetadataObjectsDelegate(self, queue: .main)
        self.output = output
    }

    private func doSomethingWithMetadataObjects(_ metadataObjects: [AVMetadataObject]) {}

    // Must be marked nonisolated because the AVCaptureMetadataOutputObjectsDelegate protocol cannot declare the actor on which the function will be called.
    nonisolated func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        // We know it's on the main actor so we should be able to assume
        // isolated and pass metadata objects to another function.
        MainActor.assumeIsolated {
            // This does not compile though, presumably because AVMetadataObject
            // is not Sendable.
            doSomethingWithMetadataObjects(metadataObjects) // ❌ Error: Sending 'metadataObjects' risks causing data races
        }
    }
}
```

This reminded me of a macro I created recently, or more specifically the type used to workaround a similar issue with stored properties in Swift 5: [`UnsafeSendable`](https://github.com/JosephDuffy/UnsafeSendable/blob/main/Sources/UnsafeSendable/UnsafeSendable.swift). This type works by using `@unchecked Sendable` to send store values we _know_ are sendable but have no native way of telling the compiler.

In this case, however, it can also be used to smuggle values across an actor boundary that we _know_ is safe.

```swift
public struct Smuggler<Smuggled>: @unchecked Sendable {
    public var smuggled: Smuggled

    public init(unsafeSmuggled smuggled: Smuggled) {
        self.smuggled = smuggled
    }

    @available(*, deprecated, message: "Smuggler is not needed when `Smuggled` is Sendable")
    public init(unsafeSmuggled smuggled: Smuggled) where Smuggled: Sendable {
        self.smuggled = smuggled
    }
}
```

With this we can smuggle our value through:

```swift
    nonisolated func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        // We know it's on the main actor so we should be able to assume
        // isolated and pass metadata objects to another function.
        let smuggler = Smuggler(unsafeSmuggled: metadataObjects)
        MainActor.assumeIsolated {
            let metadataObjects = smuggler.smuggled
            doSomethingWithMetadataObjects(metadataObjects) // ✅ Works
        }
    }
```

We can add an extension to `MainActor` that makes this a little more convenient.

```swift
extension MainActor {
    public static func assumeIsolated<Smuggled>(
        smuggling smuggled: Smuggled,
        operation: @MainActor (_ smuggled: Smuggled) -> Void,
        file: StaticString = #fileID,
        line: UInt = #line
    ) {
        let smuggler = Smuggler(unsafeSmuggled: smuggled)
        withoutActuallyEscaping(operation) { escapingOperation in
            let smuggledOperation = Smuggler(unsafeSmuggled: escapingOperation)
            assumeIsolated({
                smuggledOperation.smuggled(smuggler.smuggled)
            }, file: file, line: line)
        }
    }
}
```

I have been playing around with trying to add a function to `GlobalActor` that would make the API a bit nicer but I think it's going to require a macro, lest we resort to reimplementing [`MainActor.assumeIsolated`](https://github.com/apple/swift/blob/main/stdlib/public/Concurrency/MainActor.swift#L142) 😊

Although this isn't really "smuggling" because the value is not actually crossing an actor boundary I like the term and I'm sticking to it! Especially because I assume this workaround will be temporary.

P.S. I created a [demo project of the issue](https://github.com/JosephDuffy/AVCaptureMetadataOutputObjectsDelegateConcurrency), which I also submitted to Apple as feedback FB13950073 ✌️
