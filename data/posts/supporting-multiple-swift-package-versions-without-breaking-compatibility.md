---
title: Supporting Multiple Swift Package Versions Without Breaking Compatibility
tags: ["swift", "swiftpm"]
date: 2020-08-11T19:08:20Z
updateDate: 2020-10-25T16:53:42Z
---

The Xcode 12 beta includes Swift 5.3 but drops support for iOS 8.x. This means that Swift packages that support iOS 8 will cause a warning:

> The iOS deployment target 'IPHONEOS_DEPLOYMENT_TARGET' is set to 8.0, but the range of supported deployment target versions is 9.0 to 14.0.99.

It's not possible to remove this warning within a project that depends on a Swift package with a deployment target of iOS 8, but it is possible to fix this in the dependency without removing support for iOS 8 for older versions of Swift. There are multiple way this can be accomplished.

<!-- more -->

## Version-Specific Manifests

I was not able to find documentation on version-specific manifests, but the source code shows they [take priority over the default `Package.swift` file](https://github.com/apple/swift-package-manager/blob/cce860c70c3d96d6b21d5f56c06a7edb53996d90/Sources/PackageLoading/ToolsVersionLoader.swift#L41) and [will search for files in the following order](https://github.com/apple/swift-package-manager/blob/d196d9df58ef0b9067b8343533110e190c6c7997/swift-tools-support-core/Sources/TSCUtility/Versioning.swift#L58):

- @swift-(major).(minor).(patch)
- @swift-(major).(minor)
- @swift-(major)

In this example a new `Package@swift-5.3.swift` file can be added with a small change:

```diff
-// swift-tools-version:5.2
+// swift-tools-version:5.3
```

```diff
    platforms: [
-        .iOS(.v8),
+        .iOS(.v9),
    ],
```

This change is arguably not a breaking change so does not require a new major version of the package but it still fixes the warning. It could be argued that someone may use Xcode 12 with an older version of Swift or an older version of Xcode with a newer version of Swift, but the App Store would not accept an app built a Swift toolchain that did not come with the download of Xcode.

I have made this change in a personal project ([Persist](https://github.com/JosephDuffy/Persist/commit/af709436b15eb8241c1c8107f16a755779570ecf)) without any issues, and have also opened PRs on 2 projects that I use: [DeviceKit](https://github.com/devicekit/DeviceKit/pull/250) and [KeychainAccess](https://github.com/kishikawakatsumi/KeychainAccess/pull/498).

## Using `#if compiler` Compilation Condition

A second option is to use `#if compiler` to update the supported platforms. This has the advantage of not requiring multiple package files, but can also lead to confusing if the package file is large and the condition is easy to miss.

This can be added after the `let package =` declaration:

```swift
#if compiler(>= 5.3)
package.platforms = [.iOS(.v9)] // Ensure to add any other platforms your support here too!
#endif
```

Note that `#if compiler` is used rather than `#if swift` to allow for newer compilers that are compiling code using an older Swift language version. This change was pointed out to me when I was making this change as part of a [PR on the CombineX project](https://github.com/cx-org/CombineX/pull/91/files) to fix the warning in Xcode 12.
