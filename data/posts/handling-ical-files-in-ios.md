---
title: Handling iCal Files in iOS
tags: ["ical", "ios"]
date: 2021-06-06T19:50:47Z
---

The iCal format, first defined as a standard as [RFC 2445](https://datatracker.ietf.org/doc/html/rfc2445) in 1998, is the universally accepted format for distributing calendar files, mainly used for distributing events.

As part of my [QR code scanning app Scanula](/apps/scanula) I added support for detecting events in scanned objects. Thanks to the fantastic [libical](https://github.com/libical/libical) and the Swift wrapper [swift-ical](https://github.com/tbartelmess/swift-ical) it's fairly easy to parse an iCal feed, but adding it to iOS is a bit trickier.

<!-- more -->

The best solution I have come up with is to host a small HTTP server within the app that redirects all requests to a `data:` URL containing the iCal text. Hosting a server to serve a single file to be able to add calendar events may sound a bit farfetched. To explain why I think this is the best solution I'll first go over the alternatives, with the final solution at the end.

In versions prior to 1.2 of Scanula I would create a new [`EKEventEditViewController`](https://developer.apple.com/documentation/eventkitui/ekeventeditviewcontroller), passing in a few pieces of information from the scanned iCal text. This is done by creating an [`EKEvent`](https://developer.apple.com/documentation/eventkit/ekevent) object and populating the various properties. This has a few downside though:

- It's easy to miss a field
- Not all fields supported by iCal are supported by `EKEvent`
- There's a lot of manual code required to setup the properties

So I started looking in to alternatives. The first thing that I tried was to write the iCal text to a temporary file and then providing the URL to a [`UIDocumentInteractionController`](https://developer.apple.com/documentation/uikit/uidocumentinteractioncontroller). I thought this would offer the user the option to add the event to their calendar, however, the bottom bar is simply missing. This isn't a commonly reported issue, but there others commenting on this ([1](https://developer.apple.com/forums/thread/105849), [2](https://stackoverflow.com/questions/27927665/uidocumentinteractioncontroller-calendar-access)). Pre-requesting access to the calendar does not fix this; I assume that Apple's Safari and Mail can do this thanks to a special entitlement.

I thought that my best bet was to handoff the handling to Safari, but since the iCal text has been scanned via an image I can't provide a web URL for Safari to open. Since Shortcuts has special permissions it _can_ open Safari with a non-http(s) URL, e.g. a `data:` URL. So I created a Shortcut that opens Safari with a hardcoded `data:text/calendar;base64,{base64-encoded-ical}` URL. It worked! But how can I have this be done by my own app?

`SFSafariViewController` has the same limitation and will crash when opening a non-http(s) URL. This is where the local web server comes in. By hosting a web server on port 8080 within the app and passing in `localhost:8080` as the URL it will query the local web server. All this web server does it redirect to `data:text/calendar;base64,{base64-encoded-ical}` and then stop itself. For this I used [Embassy](https://github.com/envoy/Embassy/) because it seemed the most lightweight.

The UX of this isn't quite perfect because it will present an `SFSafariViewController`, which will then present the view controller containing the calendar event. When the calendar event view controller is dismissed the user is left with an empty `SFSafariViewController`, but I feel that these are all fair tradeoffs.

I do this with a fairly simple server:

```swift
import Embassy
import Foundation

public final class RedirectionServer {
    public private(set) static var shared = RedirectionServer()

    private var loop: EventLoop?
    private var server: HTTPServer?
    private var loopQueue: DispatchQueue?

    public func redirectNextRequestTo(_ url: URL) throws -> URL {
        tearDown()

        let loop = try SelectorEventLoop(selector: try KqueueSelector())
        let server = DefaultHTTPServer(eventLoop: loop, port: 8080) { [weak self] _, startResponse, sendBody in
            startResponse("302", [
                ("Location", url.absoluteString),
            ])
            // Empty data ends response
            sendBody(Data())

            self?.tearDown()
        }

        try server.start()

        let loopQueue = DispatchQueue(label: "Redirection Server")

        self.loop = loop
        self.server = server
        self.loopQueue = loopQueue

        loopQueue.async {
            loop.runForever()
        }

        return URL(string: "http://localhost:8080")!
    }

    private func tearDown() {
        server?.stop()
        loop?.stop()

        server = nil
        loop = nil
        loopQueue = nil
    }
}
```

Presenting the UI to the user is also fairly simple:

```swift
let data = Data(iCalString.utf8)
let base64Calendar = data.base64EncodedString()
let calendarDataURL = URL(string: "data:text/calendar;base64," + base64Calendar)!

DispatchQueue.global().async {
    do {
        let redirectionURL = try RedirectionServer.shared.redirectNextRequestTo(calendarDataURL)

        DispatchQueue.main.async {
            let safariViewController = SFSafariViewController(url: redirectionURL)
            safariViewController.modalPresentationStyle = .formSheet
            parentViewController.present(safariViewController, animated: true, completion: nil)
        }
    } catch {
        print("Failed to start redirection server:", error)
    }
}
```
