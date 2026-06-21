import Algorithms
import FeedKit
import Foundation
import XMLKit

public struct FeedService: Sendable {
    private let websiteURL: URL

    public init(websiteURL: URL) {
        self.websiteURL = websiteURL
    }

    public func rss(posts: [BlogPost]) throws -> String {
        let feed = RSSFeed(
            channel: RSSFeedChannel(
                title: "Joseph Duffy's Posts",
                link: absoluteURL("/posts").absoluteString,
                description: "Posts written by Joseph Duffy",
                language: "en-GB",
                copyright: "Joseph Duffy",
                items: posts.map(rssItem),
                atom: Atom(links: [
                    AtomLink(attributes: AtomLinkAttributes(
                        href: absoluteURL("/rss.xml").absoluteString,
                        rel: "self",
                        type: "application/rss+xml",
                    )),
                ]),
            ),
        )
        return try feed.toXMLString(formatted: true)
    }

    public func json(posts: [BlogPost]) throws -> String {
        let feed = JSONFeed(
            title: "Joseph Duffy's Posts",
            homePageURL: websiteURL.absoluteString,
            feedURL: absoluteURL("/feed.json").absoluteString,
            description: "Blog posts written by Joseph Duffy",
            favicon: absoluteURL("/favicon.ico").absoluteString,
            author: JSONFeedAuthor(name: "Joseph Duffy", url: websiteURL.absoluteString),
            items: posts.map(jsonItem),
        )
        return try feed.toJSONString(formatted: true)
    }

    public func atom(posts: [BlogPost]) throws -> String {
        let updated = posts.flatMap { [$0.publishDate, $0.updateDate] }.compacted().max() ?? Date()
        let feed = AtomFeed(
            title: AtomFeedTitle(text: "Joseph Duffy's Posts"),
            subtitle: AtomFeedSubtitle(text: "Blog posts written by Joseph Duffy"),
            links: [
                AtomFeedLink(attributes: AtomFeedLinkAttributes(href: absoluteURL("/posts").absoluteString)),
                AtomFeedLink(attributes: AtomFeedLinkAttributes(href: absoluteURL("/atom.xml").absoluteString, rel: "self")),
            ],
            updated: updated,
            authors: [
                AtomFeedAuthor(name: "Joseph Duffy", uri: websiteURL.absoluteString),
            ],
            id: websiteURL.absoluteString,
            entries: posts.map(atomEntry),
        )
        let encoder = XMLEncoder()
        encoder.dateEncodingStrategy = .formatter(makeAtomDateFormatter())
        let document = try encoder.encode(value: feed)
        document.setRootName(name: "feed")
        document.setRootAttribute(name: "xmlns", value: "http://www.w3.org/2005/Atom")
        return document.toXMLString(formatted: true)
    }

    private func rssItem(_ post: BlogPost) -> RSSFeedItem {
        RSSFeedItem(
            title: post.title,
            link: absoluteURL(post.url).absoluteString,
            description: cdata(post.excerptHTML ?? post.contentHTML),
            guid: RSSFeedGUID(text: absoluteURL(post.url).absoluteString),
            pubDate: post.publishDate,
            content: post.excerptHTML == nil ? nil : Content(encoded: cdata(post.contentHTML)),
        )
    }

    private func jsonItem(_ post: BlogPost) -> JSONFeedItem {
        JSONFeedItem(
            id: absoluteURL(post.url).absoluteString,
            url: absoluteURL(post.url).absoluteString,
            title: post.title,
            contentHtml: post.contentHTML,
            datePublished: post.publishDate,
            dateModified: post.updateDate,
            tags: post.tags,
        )
    }

    private func atomEntry(_ post: BlogPost) -> AtomFeedEntry {
        AtomFeedEntry(
            title: post.title,
            summary: post.excerptHTML.map {
                AtomFeedSummary(text: cdata($0), attributes: AtomFeedSummaryAttributes(type: "html"))
            },
            links: [
                AtomFeedLink(attributes: AtomFeedLinkAttributes(href: absoluteURL(post.url).absoluteString)),
            ],
            updated: post.updateDate ?? post.publishDate,
            id: absoluteURL(post.url).absoluteString,
            content: AtomFeedContent(text: cdata(post.contentHTML), attributes: AtomFeedContentAttributes(type: "html")),
            published: post.publishDate,
        )
    }

    private func absoluteURL(_ path: String) -> URL {
        URL(string: path, relativeTo: websiteURL)!.absoluteURL
    }

    private func makeAtomDateFormatter() -> DateFormatter {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"
        return formatter
    }

    private func cdata(_ html: String) -> String {
        "<![CDATA[\(html.replacingOccurrences(of: "]]>", with: "]]]]><![CDATA[>"))]]>"
    }
}
