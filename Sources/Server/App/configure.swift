import Vapor

public func configure(_ app: Application) async throws {
    // TODO: Remove default error handlers, which just return JSON, and handle them by returning an actual page.
//    app.middleware = .init()

    let rootURL = URL(fileURLWithPath: app.directory.workingDirectory, isDirectory: true)
    app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))

    let websiteURL = if let environmentURL = ProcessInfo.processInfo.environment["WEBSITE_URL"].flatMap(URL.init(string:)) {
        environmentURL
    } else {
        URL(string: "http://localhost:8080/")!
    }
    let renderer = MarkdownRenderer()
    let cacheBlogPosts = app.environment != .development
    let contentRepository = BlogPostsService(
        postURLsUseCase: .blogPosts(in: rootURL.appendingPathComponent("data/posts", isDirectory: true)),
        markdownRenderer: renderer,
        cachePosts: cacheBlogPosts,
        includeDrafts: app.environment == .development,
        baseURL: websiteURL,
    )
    let feedService = FeedService(websiteURL: websiteURL)

    if cacheBlogPosts {
        Task {
            // Warm the cache for the posts.
            _ = await contentRepository.posts()
        }
    }

    try routes(
        app,
        contentRepository: contentRepository,
        feedService: feedService,
    )
}
