import Elementary
import Vapor

public struct SitePage<Content: HTML & Sendable>: HTMLDocument, Sendable {
    public let title: String

    public let lang = "en-GB"

    private let content: Content

    public init(title: String, @HTMLBuilder content: () -> Content) {
        if let environment = try? Environment.detect(), environment == .development {
            self.title = "Dev: \(title)"
        } else {
            self.title = title
        }
        self.content = content()
    }

    public var head: some HTML {
        meta(.charset(.utf8))
        meta(.name(.viewport), .content("width=device-width, initial-scale=1"))
        link(.rel(.stylesheet), .href("/styles/global.css"))
        link(.rel(.icon), .href("/favicon.ico"))
    }

    public var body: some HTML {
        a(.href("#main"), .id("skip-to-content")) { "Skip to content" }
        header(.id("header")) {
            nav {
                a(.href("/")) { "Home" }
                a(.href("/posts")) { "Blog Posts" }
            }
        }
        main(.id("main")) {
            content
        }
        footer(.id("footer")) {
            nav {
                a(.href("/contact")) { "Contact" }
                a(.href("/projects")) { "Projects" }
                a(.href("/privacy")) { "Privacy" }
                a(.href("/yetii")) { "Yetii Ltd." }
                a(.href("/bio")) { "Bio" }
            }
            div(.class("copyright")) {
                "© Joseph Duffy. Blog posts published under"
                a(.href("https://creativecommons.org/licenses/by/4.0/")) { "CC-BY-4.0" }
                ", unless otherwise specified."
            }
            // TODO: Add commit details
        }
    }
}
