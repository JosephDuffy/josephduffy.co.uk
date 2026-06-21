import Server
import XCTest

final class MarkdownRendererTests: XCTestCase {
    func testRendersRawHTMLAndFencedCodeWithoutHighlighting() {
        let html = MarkdownRenderer.render("""
        <p class="info">Heads up</p>

        ```swift
        let value = "<escaped>"
        ```
        """)

        XCTAssertTrue(html.contains(#"<p class="info">Heads up</p>"#))
        XCTAssertTrue(html.contains(#"<pre><code class="language-swift">"#))
        XCTAssertFalse(html.contains("let value = &quot;"))
        XCTAssertTrue(html.contains("let value = \"&lt;escaped&gt;\""))
    }

    func testEscapesMarkdownTextAndInlineCode() {
        let html = MarkdownRenderer.render("""
        Use `Smuggler<Smuggled>` when 1 < 2.
        """)

        XCTAssertTrue(html.contains("<code>Smuggler&lt;Smuggled&gt;</code>"))
        XCTAssertTrue(html.contains("when 1 &lt; 2."))
    }

    func testRendersBlockquoteAsides() {
        let html = MarkdownRenderer.render("""
        > Warning:
        > Check this.
        """)

        XCTAssertTrue(html.contains(#"<aside data-kind="Warning">"#))
        XCTAssertTrue(html.contains("Check this."))
        XCTAssertTrue(html.contains("</aside>"))
    }

    func testAbsolutizesRootRelativeLinksAndImages() {
        let html = MarkdownRenderer.render(
            "[Post](/posts/example)\n\n![Alt](/images/example.png)",
            baseURL: URL(string: "https://josephduffy.co.uk/")!
        )

        XCTAssertTrue(html.contains(#"href="https://josephduffy.co.uk/posts/example""#))
        XCTAssertTrue(html.contains(#"src="https://josephduffy.co.uk/images/example.png""#))
    }
}
