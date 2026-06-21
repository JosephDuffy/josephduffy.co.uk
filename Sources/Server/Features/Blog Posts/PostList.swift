import Elementary
import Foundation

public struct PostList: HTML, Sendable {
    let posts: [BlogPost]

    public var body: some HTML {
        div(.class("item-list")) {
            for post in posts {
                article(.class("entry")) {
                    h2 {
                        a(.href(post.url)) { post.title }
                    }
                    p(.class("metadata")) { post.publishDate.formatted(.shortDate) }
                    if let excerptHTML = post.excerptHTML {
                        HTMLRaw(excerptHTML)
                    }
                }
            }
        }
    }
}
