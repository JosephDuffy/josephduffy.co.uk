import Elementary
import Foundation

public struct PostDetailView: HTML, Sendable {
    let post: BlogPost

    public var body: some HTML {
        article {
            h1 { post.title }
            p(.class("metadata")) { "\(post.publishDate.formatted(.shortDate))" }
            HTMLRaw(post.contentHTML)
        }
    }
}
