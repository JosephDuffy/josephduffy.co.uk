//import Server
//import XCTest
//
//final class FeedServiceTests: XCTestCase {
//    func testGeneratesRSSAtomAndJSONFeeds() async throws {
//        let repository = ContentRepository(
//            postsDirectory: URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
//                .appendingPathComponent("data/posts", isDirectory: true),
//            markdownRenderer: MarkdownRenderer()
//        )
//        let settings = SiteSettings(environment: TestEnvironment(values: [
//            "WEBSITE_URL": "https://josephduffy.co.uk/",
//        ]))
//        let service = FeedService(settings: settings)
//        let posts = Array(try await repository.posts(forFeeds: settings.websiteURL).prefix(2))
//
//        let rss = try service.rss(posts: posts)
//        let atom = try service.atom(posts: posts)
//        let json = try service.json(posts: posts)
//
//        XCTAssertTrue(rss.contains("<rss"))
//        XCTAssertTrue(atom.contains("<feed"))
//        XCTAssertTrue(json.contains(#""version" : "https:\/\/jsonfeed.org\/version\/1""#))
//    }
//
//    func testRSSIncludesSelfLink() throws {
//        let settings = SiteSettings(environment: TestEnvironment(values: [
//            "WEBSITE_URL": "https://josephduffy.co.uk/",
//        ]))
//        let service = FeedService(settings: settings)
//
//        let rss = try service.rss(posts: [])
//
//        XCTAssertTrue(rss.contains(#"xmlns:atom="http://www.w3.org/2005/Atom""#))
//        XCTAssertTrue(rss.contains(#"<atom:link href="https://josephduffy.co.uk/rss.xml" rel="self" type="application/rss+xml" />"#))
//    }
//
//    func testRSSSelfLinkAppearsBeforeItems() throws {
//        let settings = SiteSettings(environment: TestEnvironment(values: [
//            "WEBSITE_URL": "https://josephduffy.co.uk/",
//        ]))
//        let service = FeedService(settings: settings)
//        let post = BlogPost(
//            slug: "example",
//            title: "Example",
//            contentHTML: "<p>Hello</p>",
//            publishDate: Date(timeIntervalSince1970: 1),
//            url: "/posts/example",
//        )
//
//        let rss = try service.rss(posts: [post])
//
//        let atomLinkRange = try XCTUnwrap(rss.range(of: "<atom:link"))
//        let itemRange = try XCTUnwrap(rss.range(of: "<item>"))
//        XCTAssertLessThan(atomLinkRange.lowerBound, itemRange.lowerBound)
//    }
//
//    func testWrapsHTMLFeedContentInCDATA() throws {
//        let settings = SiteSettings(environment: TestEnvironment(values: [
//            "WEBSITE_URL": "https://josephduffy.co.uk/",
//        ]))
//        let service = FeedService(settings: settings)
//        let post = BlogPost(
//            slug: "example",
//            title: "Example",
//            contentHTML: "<p>Hello ]]> world</p>",
//            excerptHTML: "<p>Summary</p>",
//            publishDate: Date(timeIntervalSince1970: 1),
//            updateDate: nil,
//            draft: false,
//            url: "/posts/example",
//            tags: [],
//            imageURL: nil,
//        )
//
//        let rss = try service.rss(posts: [post])
//        let atom = try service.atom(posts: [post])
//
//        XCTAssertTrue(rss.contains("<description><![CDATA[<p>Summary</p>]]></description>"))
//        XCTAssertTrue(rss.contains("<content:encoded><![CDATA[<p>Hello ]]]]><![CDATA[> world</p>]]></content:encoded>"))
//        XCTAssertTrue(atom.contains("<summary type=\"html\"><![CDATA[<p>Summary</p>]]></summary>"))
//        XCTAssertTrue(atom.contains("<content type=\"html\"><![CDATA[<p>Hello ]]]]><![CDATA[> world</p>]]></content>"))
//    }
//}
//
//private struct TestEnvironment: EnvironmentReading {
//    var values: [String: String]
//
//    func value(_ key: String) -> String? {
//        values[key]
//    }
//}
