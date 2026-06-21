import Elementary

public struct PostsIndexView: HTML, Sendable {
    let posts: [BlogPost]

    public var body: some HTML {
        h1 { "Posts" }
        PostList(posts: posts)
    }
}
