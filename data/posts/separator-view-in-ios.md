---
title: Creating a Separator View in iOS
tags: ["swift", "ios", "uikit"]
date: 2020-07-14T12:55:20Z
draft: true
---

I've seen a lot of examples of separator views (sometimes called dividers or hairline views) for iOS but most have common pitfalls that can both be easily fixed while making overall the implementation simpler.

# Calculating 1 Pixel

A 1px line is a line that is exactly 1 pixel thick. In iOS sizes are measured in points, but some displays use more than 1 pixel to represent a single point. Using 1pt separators can look out of place and distracting, so 1px lines are used.

Some posts recommend using [`UIScreen.main.nativeScale`](https://developer.apple.com/documentation/uikit/uiscreen/1617825-nativescale), but this does not account for views on external displays, or for scale changes.

Another option is to use [`UIView.contentScaleFactor`](https://developer.apple.com/documentation/uikit/uiview/1622657-contentscalefactor). The downsides of this are that `draw(_:)` must be overridden to get the real value and there's no simple way to know when it has changed (KVO may work but I have not tried). Without tracking scale changes the view may look odd when moving between displays, e.g. in a Mac Catalyst app or if iOS ever gets enhanced external display support.

The best solution is to use [`traitCollection.displayScale`](https://developer.apple.com/documentation/uikit/uitraitcollection/1623519-displayscale) because this fixes both of the above issues: `draw(_:)` does not need to be overridden and `traitCollectionDidChange_:)` can be used to know when the display scale changes.

# Sizing the view

Using constraints for the view is not a good idea because adding both height and width constraints will make the view a 1px x 1px square. An alternative is to have a 2 different classes – `HorizontalSeparator` and `VerticalSeparator` – but then we have 2 classes to maintain.

Setting the intrinsic content size instead allows the same view to be used for both horizontal and vertical separators, and enables use of the view without using constraints.

# The implementation

```swift
/// A view with an intrinsic content size of 1 pixel by 1 pixel.
public final class SeparatorView: UIView {
    public override var intrinsicContentSize: CGSize {
        guard traitCollection.displayScale != 0 else {
            return CGSize(width: 1, height: 1)
        }

        let pointSize = 1 / traitCollection.displayScale
        return CGSize(width: pointSize, height: pointSize)
    }

    /// The color of separator.
    public var separatorColor: UIColor? {
        get {
            backgroundColor
        }
        set {
            backgroundColor = newValue
        }
    }

    public convenience init(separatorColor: UIColor) {
        self.init(frame: .zero)

        self.separatorColor = separatorColor
    }

    public override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)

        guard previousTraitCollection?.displayScale != traitCollection.displayScale else { return }

        invalidateIntrinsicContentSize()
    }
}
```

This will:

- [x] Adjust to external displays
- [x] Work in any dimension (vertical separator or horizontal separator)
- [x] Work with any type of constraints or frame-based layout
