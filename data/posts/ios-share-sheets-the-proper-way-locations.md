---
title: iOS Share Sheets the Proper Way - Locations
tags:
  [
    "ios",
    "share-sheet",
    "UIActivityViewController",
    "UIActivityItem",
    "location",
  ]
date: 2016-03-07
---

Sharing a location on iOS is something that not a lot of apps need, but after requiring it for my latest app, [Scanula](https://scanula.com), I found that there isn't a good resource explaining how to do it properly. This is the first post in a series of planned posts going over a few of the tips, tricks, and common pitfalls I have found while working with iOS Share Sheets.

<!-- more -->

## Sharing on iOS - An Overview

![](/images/ios-share-icon.png 'Standard iOS "Action" Icon')

Sharing on iOS is done using the Share Sheet, which is often opened via the "Action" icon (shown left). When tapping this, the user is presented with a Share Sheet, which provides various options, depending on the item being shared. In the blog post we'll be looking at location exclusively, but there are a various things that can be shared, from images, to URLs, to text files. The full list can be found in [Apple's Documention](https://developer.apple.com/library/ios/documentation/MobileCoreServices/Reference/UTTypeRef/#//apple_ref/doc/uid/TP40008771-CH100-SW2 "UTType Constants").

### UIActivityViewController and UIActivityItem

There's not a whole lot of documentation that helps determine exactly how to use [`UIActivityViewController`](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIActivityViewController_Class/) and its associated classes, but the simplest way to use it would be:

```swift
// This code assumes:
// - This is inside a subclass of `UIViewController`
// - This is inside a class that contains a property called `shareBarButtonItem` of type `UIBarButtonItem`

let activityItems: [AnyObject] = [
    "A shared piece of text"
];

let vc = UIActivityViewController(activityItems: activityItems, applicationActivities: nil)

// If run on iPad, this is required
vc.popoverPresentationController?.barButtonItem = shareBarButtonItem

presentViewController(vc, animated: true, completion: nil)
```

This would present a Share Sheet sharing "A shared piece of text". This would allow the user to share this text via various built-in applications, such as Messages, Mail, or Notes, via 3rd party apps, such as Dropbox or Facebook, or via AirDrop. On its own, this isn't particularly useful, but it's a start.

Note that `UIActivityViewController`'s designated initialiser takes in an array of `AnyObject`. This may look like an open invitation to just pop anything in the array, but it's actually far from that. Even though it's smart enough to figure out what you want with simple things (such as text, as shown in the example), it cant infer what you want to send for all items.

For more complex items, items should conform to [`UIActivityItemSource`](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIActivityItemSource_protocol/index.html#//apple_ref/occ/intf/UIActivityItemSource) (something I hope to write another blog post on). However, in this case, simply using [`NSItemProvider`](https://developer.apple.com/library/prerelease/ios/documentation/Foundation/Reference/NSItemProvider_Class/index.html) will help a lot.

## Sharing Locations

The primary focus for this blog post is going to be sharing locations. So, without further adu, here's the meat to go with your potatoes.

### The "Copy/Paste From StackOverflow" way

When searching Google for "uiactivityviewcontroller share location", the top results (I've not checked all ~150,000) point to a very similar solution:

- Create a VCard containing the location
  - Note that some solutions suggested creating an contact via the `AddressBook` framework and using that to generate the VCard contents, _crazy_!
- Write the VCard data to a temperary location on disk
- Pass in the `NSURL` of the file

Here's my example code:

```swift
// Note: Don't use this code!
func activityItems(latitude: Double, longitude: Double) -> [AnyObject]? {
    var items = [AnyObject]()

    let locationTitle = "Shared Location"

    let locationVCardString = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "PRODID:-//Joseph Duffy//Blog Post Example//EN",
        "N:;\(locationTitle);;;",
        "FN:\(locationTitle)",
        "item1.URL;type=pref:https://maps.apple.com/?ll=\(latitude),\(longitude)",
        "item1.X-ABLabel:map url",
        "END:VCARD"
        ].joinWithSeparator("\n")

    guard let vCardData = locationVCardString.dataUsingEncoding(NSUTF8StringEncoding) else {
        return nil
    }

    let fileManager = NSFileManager.defaultManager()
    guard let cacheDirectory = try? fileManager.URLForDirectory(.CachesDirectory, inDomain: .UserDomainMask, appropriateForURL: nil, create: true) else {
        return nil
    }

    let fileLocation = cacheDirectory.URLByAppendingPathComponent("\(latitude),\(longitude).loc.vcf")
    vCardData.writeToURL(fileLocation, atomically: true)

    return [
        fileLocation
    ]
}
```

While this does technically work for most use cases, when sharing via AirDrop the items is interpreted as a file (as it techncially should). This has some unwanted side effects:

- Some apps that _should_ be able to share a location (such as Facebook's Messenger) see the item as a file and refuse to share it
- When sharing via AirDrop, the item is shared as a contact card, and the user is prompted to add the contact the their contacts, not view the location
- The information is written to disk, which while not being a big deal, _can_ be avoided, so why not just keep it in memory?

## Lead By Example - The Apple way

When trying to figure out the correct way of doing this I created a smalled app for debugging Share Sheet items (hopefully more on this in another blog post). This shows me that Apple's built-in Maps application does things a little differently by sharing:

- A single text item (the title of the location)
- An Apple Maps `NSURL`
- The location in the form of a VCard, but simply as NSData (not stored in a file)

Doing this is fairly easy. Here's my code to do it:

```swift
func activityItems(latitude: Double, longitude: Double) -> [AnyObject]? {
    var items = [AnyObject]()

    let locationTitle = "Shared Location"
    let URLString = "https://maps.apple.com?ll=\(latitude),\(longitude)"

    if let url = NSURL(string: URLString) {
        items.append(url)
    }

    let locationVCardString = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "PRODID:-//Joseph Duffy//Blog Post Example//EN",
        "N:;\(locationTitle);;;",
        "FN:\(locationTitle)",
        "item1.URL;type=pref:\(URLString)",
        "item1.X-ABLabel:map url",
        "END:VCARD"
        ].joinWithSeparator("\n")

    guard let vCardData = locationVCardString.dataUsingEncoding(NSUTF8StringEncoding) else {
        return nil
    }

    let vCardActivity = NSItemProvider(item: vCardData, typeIdentifier: kUTTypeVCard as String)

    items.append(vCardActivity)

    items.append(locationTitle)

    return items
}
```

This doesn't require much more code, but has a few other added bonuses:

- When shared via AriDrop, ipens Maps.app
- Allows sharing via apps that don't support sharing file, such as Facebook's Messenger
- Allows the user to copy the location to the clipboard in form of "&lt;url&gt; &lt;share title&gt;"

I've been doing a lot of work with Share Sheets lately, so if you've found this post useful and want to see more, check back soon, [subscribe to the RSS feed for this blog](/rss), or [follow me on Twitter](https://www.twitter.com/Joe_Duffy).
