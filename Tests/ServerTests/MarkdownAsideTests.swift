import Server
import Testing

public struct MarkdownAsideTests {
    @Test
    func blockQuoteAsidesRendering() {
        let markdown = """
        > Note:
        > My note!
        """
        let html = MarkdownRenderer.render(markdown)

        #expect(html.contains(#"<aside data-kind="Note">"#))
        #expect(html.contains("My note!"))
        #expect(html.contains("</aside>"))
    }
}
