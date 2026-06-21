import Elementary

public struct HomeView: HTML, Sendable {
    let posts: [BlogPost]

    public var body: some HTML {
        h1 { "Hi 👋 I'm Joseph Duffy" }
        p { "I enjoy building software. This website contains information about the apps I have created, open-source projects, and blog posts. Welcome to my corner of the internet!" }
        h2 { "Recent Posts" }
        PostList(posts: posts)
    }
}
