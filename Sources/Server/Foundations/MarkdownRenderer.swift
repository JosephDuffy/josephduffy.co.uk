import Foundation
import Markdown

public struct MarkdownRenderer: Sendable {
    public static func render(_ markdown: String, baseURL: URL? = nil) -> String {
        MarkdownRenderer().render(markdown, baseURL: baseURL)
    }

    public init() {}

    public func render(_ markdown: String, baseURL: URL? = nil) -> String {
        var document: Markup = Document(parsing: markdown)
        print(document.debugDescription())
        if let baseURL {
            document = MarkupURLRewriter.rewrite(document, baseURL: baseURL)
        }
        let modifiedDocument = document
            .replacingYouTubeInlinesWithHTMLEmbeds()
            .escapingHTML()
        // TODO: Rewrite inline attributes that match playgrounds to produce HTML
        // TODO: Rewrite footnotes. Add `<section>` at the end. Link back to source. Use id based on slug + footnote link from Markdown.

        return HTMLFormatter.format(modifiedDocument, options: .parseAsides)
    }
}

extension Markup {
    func replacingYouTubeInlinesWithHTMLEmbeds() -> Markup {
        YouTubeEmbedRewriter.rewrite(self)
    }

    func escapingHTML() -> Markup {
        EscapeHTMLRewriter.rewrite(self)
    }
}

public struct EscapeHTMLRewriter: MarkupRewriter {
    public static func rewrite(_ markup: Markup) -> Markup {
        var rewriter = EscapeHTMLRewriter()
        return rewriter.visit(markup) ?? markup
    }

    public mutating func visitCodeBlock(_ codeBlock: CodeBlock) -> Markup? {
        var codeBlock = codeBlock
        codeBlock.code = escapeHTML(codeBlock.code)
        codeBlock.language = codeBlock.language.map(escapeAttribute)
        return codeBlock
    }

    public mutating func visitImage(_ image: Image) -> Markup? {
        var image = image
        image.source = image.source.map(escapeAttribute)
        image.title = image.title.map(escapeAttribute)
        return defaultVisit(image)
    }

    public mutating func visitInlineAttributes(_ attributes: InlineAttributes) -> Markup? {
        var attributes = attributes
        attributes.attributes = escapeAttribute(attributes.attributes)
        return defaultVisit(attributes)
    }

    public mutating func visitInlineCode(_ inlineCode: InlineCode) -> Markup? {
        var inlineCode = inlineCode
        inlineCode.code = escapeHTML(inlineCode.code)
        return inlineCode
    }

    public mutating func visitLink(_ link: Link) -> Markup? {
        var link = link
        link.destination = link.destination.map(escapeAttribute)
        link.title = link.title.map(escapeAttribute)
        return defaultVisit(link)
    }

    public mutating func visitSymbolLink(_ symbolLink: SymbolLink) -> Markup? {
        var symbolLink = symbolLink
        symbolLink.destination = symbolLink.destination.map(escapeHTML)
        return symbolLink
    }

    public mutating func visitText(_ text: Text) -> Markup? {
        var text = text
        text.string = escapeHTML(text.string)
        return text
    }

    private func escapeHTML(_ string: String) -> String {
        string
            .replacingOccurrences(of: "&", with: "&amp;")
            .replacingOccurrences(of: "<", with: "&lt;")
            .replacingOccurrences(of: ">", with: "&gt;")
    }

    private func escapeAttribute(_ string: String) -> String {
        escapeHTML(string)
            .replacingOccurrences(of: "\"", with: "&quot;")
            .replacingOccurrences(of: "'", with: "&#39;")
    }
}

public struct YouTubeEmbedRewriter: MarkupRewriter {
    static func rewrite(_ markup: Markup) -> Markup {
        var rewriter = Self()
        return rewriter.visit(markup) ?? markup
    }

    public func visitInlineAttributes(_ attributes: InlineAttributes) -> Markup? {
        do {
            let decoder = JSONDecoder()
            decoder.allowsJSON5 = true
            decoder.assumesTopLevelDictionary = true
            let decodedAttributes = try decoder.decode(
                YouTubeInlineAttributes.self,
                from: Data(attributes.attributes.utf8)
            )
            guard let url = embedURL(for: decodedAttributes.youtube) else {
                return attributes
            }
            let title = (attributes.child(at: 0) as? Text).map { "\($0.string) on YouTube" } ?? "YouTube video player"
            return HTMLBlock("""
                <iframe class="youtube-embed" width="560" height="315" src="\(url.absoluteString)" title="\(title)" allow="fullscreen"></iframe>
                """)
        } catch {
            print(error)
            return attributes
        }
    }

    private func embedURL(for url: URL) -> URL? {
        guard url.host() == "www.youtube.com" else {
            return nil
        }

        if url.path().hasPrefix("/embed/") {
            return url.appending(queryItems: [URLQueryItem(name: "playsinline", value: "1")])
        }

        guard let urlComponents = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            return nil
        }

        guard let videoId = urlComponents.queryItems?.first(where: { $0.name == "v" })?.value else {
            return nil
        }

        return URL(string: "/embed/\(videoId)", relativeTo: url)?
            .appending(queryItems: [URLQueryItem(name: "playsinline", value: "1")])
    }
}

private struct YouTubeInlineAttributes: Decodable {
    let youtube: URL
}

private struct MarkupURLRewriter: MarkupRewriter {
    private let baseURL: URL

    static func rewrite(_ markup: Markup, baseURL: URL) -> Markup {
        var rewriter = Self(baseURL: baseURL)
        return rewriter.visit(markup) ?? markup
    }

    mutating func visitImage(_ image: Image) -> Markup? {
        var image = image
        image.source = image.source.map(absoluteURLString)
        return defaultVisit(image)
    }

    mutating func visitLink(_ link: Link) -> Markup? {
        var link = link
        link.destination = link.destination.map(absoluteURLString)
        return defaultVisit(link)
    }

    private func absoluteURLString(_ string: String) -> String {
        guard string.hasPrefix("/") else {
            return string
        }

        return URL(string: string, relativeTo: baseURL)?.absoluteURL.absoluteString ?? string
    }
}
