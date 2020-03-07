import App from "../../models/App"

const gathered: App = {
  name: "Gathered",
  slug: "gathered",
  logoURL: "/images/gathered/icon.svg",
  shortDescription:
    "Gathered is an app that facilitates the viewing, recording, and sharing of over 25 sources of data available on iOS and iPadOS devices, from the GPS and accelerometer to the advertising identifier and the WiFi. Gathered is the perfect app to enable the recording of all the data required to calulcate position, acceleration, and ambient conditions of the device.",
  fullDescription: `
Gathered is an app to help you monitor, record, and export information from your iOS device. If you've ever wondered what sensors your device possesses, what information can be determined from them, or what an app can know about your device, then Gathered is for you.

<div class="screenshots">
  <a href="/images/gathered/screenshots/monitor-tab.png">
    <img src="/images/gathered/screenshots/monitor-tab.png" width="270" height="464">
  </a>
  <a href="/images/gathered/screenshots/record-tab.png">
    <img src="/images/gathered/screenshots/record-tab.png" width="270" height="464">
  </a>
  <a href="/images/gathered/screenshots/complete-recording.png">
    <img src="/images/gathered/screenshots/complete-recording.png" width="270" height="464">
  </a>
  <a href="/images/gathered/screenshots/settings-tab.png">
    <img src="/images/gathered/screenshots/settings-tab.png" width="270" height="464">
  </a>
  <a href="/images/gathered/screenshots/apple-watch-app.png">
    <img src="/images/gathered/screenshots/apple-watch-app.png" width="270" height="450">
  </a>
</ul>

Gathered offers a fast and simple interface to monitor, record, and export all of the data your device offers. All features are offered for free with the option to pay to remove adverts. With Gathered you can:

- Monitor data sources in real-time
- Easily copy values
- Record the data from every data source
  - View previous recordings
  - Export via Document Picker
  - Share via standard Share Sheet
  - Drag-and-drop support on iPads
  - Copy using iTunes File Sharing
  - Pick between exporting to JSON or CSV
- Easily enable, disable, and reorder the data sources being displayed or recorded
- Adjustable update frequency (0.1 - 120 seconds)
- Portrait and landscape support

Gathered features over 20 data sources (where available), including:

- GPS
- WiFi
- Microphone
- Cell Radio
- Advertising
- Authentication
- Memory (RAM)
- Barometer (altitude and pressure)
- Accelerometer
- Storage
- Gyroscope
- Magnetometer (compass)
- Apple Watch Accelerometer
- Bluetooth
- Battery
- The screen
- The device itself
- Proximity
`,
  url: "https://geo.itunes.apple.com/app/apple-store/id929726748?mt=8",
  tags: ["gathered"],
  changelogs: [
    {
      version: "1.2.0",
      releaseDate: "2016-10-18",
      content: `
- Fixed bug in iOS 10 preventing exporting recording to CSV
- Updated Microphone data source to not pause audio from other apps
- Added link in Settings to the permission settings for Gathered, allowing for easy toggling of permissions
- Updated versions of frameworks
- Fully removed iAds, relying on only AdMob for adverts
- Replaced Device’s "Headphones Attached" with "Audio Output Method"
`,
    },
    {
      version: "1.1.1",
      releaseDate: "2016-05-05",
      content: `
# Additions

- Recordings can now be exported to JSON and CSV (this includes those recorded on older versions of Gathered)
- Added analytics to help aid future development

# Fixes

- Fixed "Thank you for your support! ☺️" line in Settings after buying all In App Purchases having a disclosure indicator
- Fixed GPS data source crashing on iOS 7
- Fixed In App Purchase related rows on the Settings tab not being refreshed after moving away from the Settings screen

# Changes

- When a recording is exported to a file, the file name has "Gathered-Recording-" prepended to it now
`,
    },
    {
      version: "1.1.0",
      releaseDate: "2016-02-29",
      content: `
# Recording

You can now record all of the data sources using the new Record tab. Recorded data can be exported in multiple ways:

- Save to another app using the Document Picker (iOS 8+ only)
- Share using the share extension
- Manually copy the file using iTunes File Sharing

# Bug Fixes and Improvements

Various bugs have been destroyed and other small improvements have been made, including:

- The core functionality of Gathered has been rewritten, and is now faster, more stable, and allows each of the data sources to be recorded
- Improved the handling of updating the values with the "Update While Scrolling" option enabled - the table should no longer "jump" while scrolling
- The "Data Sources" tab has been renamed to "Monitor" to better reflect its use
- Added check for whether the device supports Touch ID under the Device data source
- Fixed a bug causing adverts to not be displayed in some situations
- Fixed a crash that would sometimes occur when using the microphone sensor
- Improved reliability of Cell Radio data source when switching carriers
- Improved reliability and freshness of data of the GPS data source
- Improved accessibility of the Monitor tab
- Various other little bug fixes
- Adverts are now shown on all tabs
- The Update Frequency input will now update the "Second(s)" suffix as you type
`,
    },
    {
      version: "1.0.1",
      releaseDate: "2015-11-12",
      content: `
- Removed the Location and Device tabs
- Moved the Settings screen to its own tab
- Removed the "Disable Device Sleep" option (at Apple's request)
- Gathered will now remember which tab you had selected and if you were editing, even when you leave the app closed for a long time
- Improved reliability of purchasing and restoring in-app purchases
- Fixed multiple crashes on the Settings screen on iOS 7, including:

- Restoring or purchasing in-app purchases
- Tapping on Rate Gathered on iTunes, Feedback, or Privacy Policy

- Improvements and fixes for iOS 9
- Reduced app size
- Improved layout of alert to choose how to view a Twitter profile from the About screen
- Lots of other little behind the scenes fixes to make Gathered faster and more stable
`,
    },
    {
      version: "1.0",
      releaseDate: "2015-01-23",
      content: `
- Initial release
`,
    },
  ],
}

export default gathered
