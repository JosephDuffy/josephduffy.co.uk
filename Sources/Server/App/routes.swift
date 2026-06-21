import Vapor
import VaporElementary

func routes(
    _ app: Application,
    contentRepository: ContentRepository,
    feedService: FeedService,
) throws {
    app.get { _ async in
        let posts = await contentRepository.posts()
        return HTMLResponse {
            SitePage(title: "Joseph Duffy") {
                HomeView(posts: Array(posts.prefix(5)))
            }
        }
    }

    app.get("posts") { _ async in
        let posts = await contentRepository.posts()
        return HTMLResponse {
            SitePage(title: "Posts") {
                PostsIndexView(posts: posts)
            }
        }
    }

    app.get("posts", ":slug") { request async throws in
        guard let slug = request.parameters.get("slug"),
              let post = await contentRepository.post(slug: slug)
        else {
            throw Abort(.notFound)
        }
        return HTMLResponse {
            SitePage(title: post.title) {
                PostDetailView(post: post)
            }
        }
    }

    app.get("rss.xml") { _ async throws in
        let posts = await contentRepository.posts()
        let response = Response(status: .ok)
        response.headers.contentType = HTTPMediaType(type: "application", subType: "rss+xml")
        response.body = .init(string: try feedService.rss(posts: posts))
        return response
    }

    app.get("atom.xml") { _ async throws in
        let posts = await contentRepository.posts()
        let response = Response(status: .ok)
        response.headers.contentType = HTTPMediaType(type: "application", subType: "atom+xml")
        response.body = .init(string: try feedService.atom(posts: posts))
        return response
    }

    app.get("feed.json") { _ async throws in
        let posts = await contentRepository.posts()
        let response = Response(status: .ok)
        response.headers.contentType = HTTPMediaType(type: "application", subType: "feed+json")
        response.body = .init(string: try feedService.json(posts: posts))
        return response
    }
}
