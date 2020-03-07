---
title: Gathered 1.0.1 and the Disable Device Sleep Setting
tags:
  - ios
  - gathered
  - yetii
date: 2015-12-06
---

Gathered 1.0.1 was released a couple of weeks ago and I wanted to write a quick blog post addressing part of the [changelog](https://josephduffy.co.uk/apps/gathered/changelog "Gathered changelog")<!-- more -->:

> Removed the "Disable Device Sleep" option (at Apple's request)

Without posting lots of useless code, the offending code was as follows:

```swift
UIApplication.sharedApplication().idleTimerDisabled = newValue
```

where `newValue` is a `Bool`.

This code was in Gathered 1.0, but upon submitting the 1.0.1 update I received the following message from Apple:

> PLA 3.3.1
>
> Your app uses public APIs in an unapproved manner, which does not comply with section 3.3.1 of the [Apple Developer Program License Agreement](http://developer.apple.com/membercenter/index.action#agreements).
>
> Specifically, this app does not meet the requirements of our [UIApplication documentation](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/#//apple_ref/occ/instp/UIApplication/idleTimerDisabled). It would be appropriate to remove this app's use of idleTimerDisabled before resubmitting for review.
>
> Since there is no accurate way of predicting how an API may be modified and what effects those modifications may have, Apple does not permit unapproved uses of public APIs in App Store apps.

Note that the link to the Apple Developer Program License Agreement requires you to be logged in with a developer Apple ID. Looking up section 3.3.1, the relevant part is:

> Applications may only use Documented APIs in the manner prescribed by Apple and
> must not use or call any private APIs.

Looking at the [documentation for the `idleTimerDisabled` property of `UIApplication`](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/#//apple_ref/occ/instp/UIApplication/idleTimerDisabled), it states:

> You should set this property only if necessary and should be sure to reset it to `false` when the need no longer exists. Most apps should let the system turn off the screen when the idle timer elapses. This includes audio apps. With appropriate use of Audio Session Services, playback and recording proceed uninterrupted when the screen turns off. The only apps that should disable the idle timer are mapping apps, games, or **programs where the app needs to continue displaying content when user interaction is minimal**.

_(emphasis is mine)_

I assumed this was just something that was flagged internally by some sort of automated code scanner and submitted an appeal to the App Review Board, stating that I felt Gathered fell under the category of apps which "[need] to continue displaying content when user interaction is minimal." A few days later I received an email scheduling a phone call, in which I am told that the functionality would not be accepted. I was not give any more of a reason, other than "your app was found to be out of compliance with App Store Review Guidelines" and that I must remove the feature and resubmit my update.

At this point I had no choice but to remove the feature. I removed it, and submitted an update with the changelog as shown on [Gathered's changelog page](https://josephduffy.co.uk/apps/gathered/changelog). However, this was rejected due to the meta data with the following message:

> We noticed that your app's metadata includes the following information, which is not relevant to the application content and functionality:
>
> Removed the "Disable Device Sleep" option at Apple's request

Ok, fair enough, I was being slightly cheeky. I update that line of the changelog to:

> Removed the "Disable Device Sleep" option

and the update was approved.

So, in summary, I'm sorry for the removal of the "Disable Device Sleep" feature, but I had no choice. This is also what caused the release of 1.0.1 to be delayed by 2 to 3 weeks. If you have any comments or feature requests for Gathered, either visit [Gathered's feedback page](https://yetii.net/contact?subject=gathered) or [contact me on Twitter](https://twitter.com/Joe_Duffy).
