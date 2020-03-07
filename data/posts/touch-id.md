---
title: Touch ID on the Lock Screen
tags: ["ios", "user-experience"]
date: 2015-10-03
---

Touch ID is a wonderful piece of technology, to the point where wouldn't buy an iOS device without it. It had many great uses, such as:

- Unlock the device
- Authorise Apple Pay payments
- Add biometric restrictions within apps

However, I wish to discuss the first of these: unlocking the device.

<!-- more -->

## When is fast too fast?

I do not currently own an iPhone 6s or iPhone 6s Plus so I have not been able to try out the new (claimed 2x faster) Touch ID. However, from my own experience using my iPhone 6 I can confirm the problem that some people feel they are having: the device unlocks too fast. Simply pressing the home button to check the time or a notification is often enough for the device to read the fingerprint and unlock. Personally, the majority of the time, unlocking the device is what I want to do. However, assuming that Touch ID continues to improve and its uses continue to grow I see a potential new way for it to work.

## Pre-authorise

Touch ID currently works on the principal of:

1. The user asks for an action that requires biometric authentication (or the PIN, which is loaded after biometric authentication if we want to get technical)
2. The system asks the user to authenticate with their fingerprint
3. If the authentication fails, return to step 2
4. If authentication succeeds, continue with the user's action

This is of course an over simplification, but it demonstrates what's happening. However, in the case of unlocking the device the action of "unlock the device" is assumed, which is not always correct. My proposal is to allow the user to pre-authorise an action from the lock screen. The user could then perform any of the following actions without having to touch the Touch ID sensor:

- Unlock the device
- Authorise an Apple Pay payment
- Perform an action on a notification that requires authentication

## Letting the user know what's happening

This would obviously be a confusing change for some users, and is something would likely only appeal to the nerds that care about the small time save/loss. For this reason I would personally set it as an option that is off by default (or mentioned during setup) and have a visual indicator of what's happening.

![](/images/lockglyph-open-ui.jpg "LockGlyph device unlocking UI")

[LockGlyph](http://cydia.saurik.com/package/com.evilgoldfish.lockglyph/) (shown above) is a tweak available for iOS 8 that adds the Apple Pay animation to the lock screen when unlocking. If instead of fully unlocking the device when authentication the checkmark were to stay to indicate authentication and acted as the pre-authorisation for the next action. To try and keep the action of unlocking quick the checkmark could also be tapped to unlock the device, as well as the classic slide to unlock. It may even be possible for Apple to implement some form of check so that when the user may wish to interact with the lock screen (such as a notification or music controls being shown) this options is turned on, but in other situations the auto-unlock would only happen based on the user preferences. To summarise, the interaction would go a little like this:

- User unlocks device (via home button or power button)
- User's fingerprint is read and authorised
- If there are pending notifications or music controls showing, do not unlock the device
- If there are no pending notification or music controls showing, auto-unlock the device based on the user's preferences

## Conclusion

That's a simple little idea I thought about recently. I'm no UX Designer so this may be an awful idea, but I feel I would personally benefit from it. Either way, I'd love to hear your thoughts. The best way to contact me would be [via Twitter](https://josephduffy.co.uk/twitter "My Twitter profile").
