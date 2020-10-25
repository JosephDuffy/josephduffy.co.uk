---
title: Gathered 1.3 Release Notes
tags: ["ios", "gathered", "yetii", "release-notes"]
date: 2018-03-11T19:57:27Z
---

Gathered 1.3 has been released and is now [available on the App Store](https://itunes.apple.com/us/app/apple-store/id929726748?mt=8 "Gathered's App Store Page"). Version 1.3 brings 2 new data sources, app-wide speed and UX improvements, and support for various features added in recent versions of iOS.

This update also has lots of behind-the-scenes changes that will make future updates easier to create and deploy, which – along with my features roadmap – should mean more frequent updates.

I wasn't very happy removing the Heart Rate data source but Apple weren't very happy with the use of HealthKit.

<!-- more -->

## Full Changelog

- Adds Advertising and Authentication data sources
- Removes the Heart Rate (via Apple Watch) data source at the request of Apple
- Data sources can now be reordered
- Values can now be copied by tapping the cell
- Adds support for iPhone X
- Improves layout on iPads
- Adds drag and drop support for recordings on iPads running iOS 11 or newer
- Altimeter's "Relative Altitude" value can be reset to zero by tapping the cell
- Adds "Speed (estimated)" to GPS data source
- A "Start Recording" Quick Action has been added to the home screen icon
- Recordings will now always use the update frequency set in the Settings tab
- Fixes some exported CSV files being invalid
- Fixes the Microphone data source pausing other audio
- Fixes a crash that may occur when stopping a recording
