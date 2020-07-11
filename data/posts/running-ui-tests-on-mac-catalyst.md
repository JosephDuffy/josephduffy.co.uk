---
title: Running UI Tests on Mac Catalyst
tags: ["ios", "macos", "mac-catalyst", "ui-tests"]
date: 2020-07-11
---

While working on the 2.0 update for [Gathered](/apps/gathered) I have been trying to develop the app multiple platforms simultaneously. SwiftUI will solve this problem in the future, but I wish to support some OS versions that SwiftUI does not support.

As part of this I have been creating UI tests to test performance, but ran in to an issue when running the UI tests on macOS using Mac Catalyst:

```
Running tests...
The bundle “PerformanceXCTests” couldn’t be loaded because it is damaged or missing necessary resources. Try reinstalling the bundle.
(dlopen_preflight(...): no suitable image found.  Did find:
	...: code signature in (...) not valid for use in process using Library Validation: mapped file has no Team ID and is not a platform binary (signed with custom identity or adhoc?))
```

<!-- more -->

The solution to this problem (as hinted in the error) is to opt out of library validation. This can be done using the Disable Library Validation entitlement, but when editing the test target in Xcode the Signing & Capabilities tab doesn't have the Hardened Runtime section.

To get around this a custom entitlements file can be created:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.security.cs.disable-library-validation</key>
	<true/>
</dict>
</plist>
```

This file can saved anywhere (I have it at the root of the tests directory) and then set as the value for the Code Signing Entitlements (`CODE_SIGN_ENTITLEMENTS`) option in the Build Settings tab.

Re-run the tests with My Mac selected and your UI tests should run using Mac Catalyst.
