import App from "../../models/App"

const scanula: App = {
  name: "Scanula",
  slug: "scanula",
  platform: "iOS",
  logoURL: "/images/scanula/icon.png",
  appId: "1063048919",
  shortDescription:
    "Scanula is a clean, modern, and fast QR, data matrix, and barcode scanner.",
  fullDescription: `
Scanula is a clean, modern, and fast QR code, data matrix, and barcode scanner. There are 3 ways of detecting QR codes:

- Use the Scan tab and point the device’s camera at a QR code
- Tap the photos icon on the top right and of the Scan tab and pick a photo from your photo library*
- Use the share sheet with a URL, webpage, or image, and choose the "Scan for QR Codes" action*

When using the camera Scanula will also detect barcodes, data matrices, and many other scannable codes. Scan results show detailed information about the scanned object and is customised for various types of scanned content, such as displaying a scanned location on a map, getting the balance of a bitcoin address, or showing the details of a contact card.

All information can be easily shared using the built-in share sheet, or by generating a QR code. If your device supports handoff you can easily open URLs on a Mac or another iOS device.

Scanula also makes it easy to find, share, and view previous scan results from the History tab, which displays scan results in reverse scan-date order and can be easily filtered by type of object scanned and by assigning favourites.

Features:

- Scan QR codes via:
  - The camera
  - Saved images
  - Any shareable URL or image, including in Safari - Scan a webpage for QR codes
- Scan and detect over 10 different object types, including:
  - URLs
  - Bitcoin Addresses
  - Locations
  - Contact Cards
  - Calendar Events
  - Barcodes
  - WiFi Access Points
- Share scanned objects using the built-in share sheet
- Quickly scan using the camera, or via a saved photo or screenshot, directly from the home screen using Quick Actions via 3D Touch
- Handoff Support - Scan a URL on your iOS device and load the URL on your Mac

* Detection of QR codes via images requires an iPhone 5s, iPad Air, iPad Mini 2, or newer
`,
  downloadURL: "https://apps.apple.com/app/apple-store/id1063048919",
  tags: ["scanula"],
  changelogs: [
    {
      version: "1.1.2",
      releaseDate: "2018-05-06",
      content: `
Version 1.1.2 improves the reliability of animating the screen brightness when viewing QR codes.

Thank you for using Scanula!
`,
    },
    {
      version: "1.1.1",
      releaseDate: "2018-04-26",
      content: `
Version 1.1.1 addresses an issue that may cause the camera to appear blank on certain devices.

Thank you for using Scanula!
`,
    },
    {
      version: "1.1",
      releaseDate: "2018-01-22",
      content: `
Version 1.1 updates Scanula to utilise some of the latest iOS features.

- iPhone X support

- Haptic feedback when the camera detects an object

- When viewing a QR code in full screen the brightness change is animated
`,
    },
    {
      version: "1.0",
      releaseDate: "2016-04-04",
      content: `
- Initial release
`,
    },
  ],
  privacyPolicy: `
Scanula contains SDKs that are provided by third parties that collect and record data. There third party SDKs are shown below.

## Fabric

Fabric is used to integrate Crashlytics and Answers. Crashlytics is used to collect crashes that occur within the app. Some basic non-user-identifiable information is collected via Answers. For more information visit [Fabric's Privacy and Security page](https://docs.fabric.io/apple/fabric/data-privacy.html).

Scanula 1.1.2 uses the Crashlytics 3.10.1 and Fabric 1.7.6 SDKs.
`,
}

export default scanula
