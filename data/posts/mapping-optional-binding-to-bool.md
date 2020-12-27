---
title: Mapping Optional Binding to Bool
tags: ["swift", "swiftui"]
date: 2020-12-27T13:03:42Z
---

When displaying an alert in SwiftUI, if the value used to calculate whether the alert is presented is both `Optional` and does not conform to `Identifiable`<sup>1</sup> it is often recommended to use a separate flag, similar to:

```swift
struct ContentView: View {
    @State private var alertText: String?
    @State private var isPresentingAlert = false

    var body: some View {
        Button("Show Alert") {
            self.alertText = "Alert Text"
            self.isPresentingAlert = true
        }
        .alert(isPresented: $isPresentingAlert) {
            Alert(title: Text(alertText!))
        }
    }
}
```

There are 2 main downsides to this:

1. `alertText` is not set back to `nil`, which may cause bugs and will increase memory usage (even if only a little in this case)
2. The `isPresentingAlert` flag needs to be managed

To work around these issues I create a small extension to `Binding` the allows this same code to be updated to:

```swift
struct ContentView: View {
    @State private var alertText: String?

    var body: some View {
        Button("Show Alert") {
            self.alertText = "Alert Text"
        }
        .alert(isPresented: $alertText.mappedToBool()) {
            Alert(title: Text(alertText!))
        }
    }
}
```

The extension is fairly small and simple:

```swift
import os.log
import SwiftUI

extension Binding where Value == Bool {
    /// Creates a binding by mapping an optional value to a `Bool` that is
    /// `true` when the value is non-`nil` and `false` when the value is `nil`.
    ///
    /// When the value of the produced binding is set to `false` the value
    /// of `bindingToOptional`'s `wrappedValue` is set to `nil`.
    ///
    /// Setting the value of the produce binding to `true` does nothing and
    /// will log an error.
    ///
    /// - parameter bindingToOptional: A `Binding` to an optional value, used to calculate the `wrappedValue`.
    public init<Wrapped>(mappedTo bindingToOptional: Binding<Wrapped?>) {
        self.init(
            get: { bindingToOptional.wrappedValue != nil },
            set: { newValue in
                if !newValue {
                    bindingToOptional.wrappedValue = nil
                } else {
                    os_log(
                        .error,
                        "Optional binding mapped to optional has been set to `true`, which will have no effect. Current value: %@",
                        String(describing: bindingToOptional.wrappedValue)
                    )
                }
            }
        )
    }
}

extension Binding {
    /// Returns a binding by mapping this binding's value to a `Bool` that is
    /// `true` when the value is non-`nil` and `false` when the value is `nil`.
    ///
    /// When the value of the produced binding is set to `false` this binding's value
    /// is set to `nil`.
    public func mappedToBool<Wrapped>() -> Binding<Bool> where Value == Wrapped? {
        return Binding<Bool>(mappedTo: self)
    }
}
```

The extension isn't tied directly to showing an alert or a sheet and can be used in any context, but this is one of the better examples of its usage.

This extension is [available on GitHub under the MIT license](https://gist.github.com/JosephDuffy/f6291ad150e8aedf4515c29fdf5ab7e3).

<sup>1</sup> If it does conform to `Identifiable` use [`alert(item:content:)`](<https://developer.apple.com/documentation/swiftui/view/alert(item:content:)>)
