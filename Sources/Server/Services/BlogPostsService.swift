import Foundation
import UseCaseMacro
import OrderedCollections
import Yams

@UseCase
public struct URLsProviderUseCase: Sendable {
    /// Loads and returns the URLs this use case provides.
    public func callAsFunction() -> [URL]
}

extension URLsProviderUseCase {
    public static func blogPosts(in rootDirectory: URL) -> Self {
        .init {
            print("Finding blog post files in \(rootDirectory)")
            guard let directoryEnumerator = FileManager.default.enumerator(
                at: rootDirectory,
                includingPropertiesForKeys: nil,
                options: [.skipsHiddenFiles]
            ) else {
                return []
            }

            return directoryEnumerator.compactMap { item -> URL? in
                guard let url = item as? URL, url.pathExtension == "md" else {
                    return nil
                }
                return url
            }
        }
    }
}

public typealias ContentRepository = BlogPostsService

public actor BlogPostsService {
    /// An collection of blog posts, indexed by their slug and ordered by the publish date in
    /// descending order.
    private typealias BlogPosts = OrderedDictionary<String, BlogPost>

    private let loadPostURLs: URLsProviderUseCase
    private let markdownRenderer: MarkdownRenderer
    private let cachePosts: Bool
    private let includeDrafts: Bool
    private let baseURL: URL?
    private var loadingPostsTask: Task<BlogPosts, Never>?
    private var cachedPosts: BlogPosts?

    public init(
        postURLsUseCase: URLsProviderUseCase,
        markdownRenderer: MarkdownRenderer,
        cachePosts: Bool = true,
        includeDrafts: Bool = false,
        baseURL: URL? = nil,
    ) {
        loadPostURLs = postURLsUseCase
        self.markdownRenderer = markdownRenderer
        self.cachePosts = cachePosts
        self.includeDrafts = includeDrafts
        self.baseURL = baseURL
    }

    public func posts() async -> [BlogPost] {
        await getPosts().values.elements
    }

    public func post(slug: String) async -> BlogPost? {
        if cachePosts {
            return await getPosts()[slug]
        } else {
            for postURL in loadPostURLs() {
                let postSlug = self.slug(from: postURL)
                if slug == postSlug {
                    return try? loadPost(at: postURL)
                }
            }

            return nil
        }
    }

    private func getPosts() async -> BlogPosts {
        if cachePosts, let cachedPosts {
            return cachedPosts
        } else if let loadingPostsTask {
            if cachePosts {
                return await loadingPostsTask.value
            } else {
                loadingPostsTask.cancel()
            }
        }

        let loadingPostsTask = Task { @concurrent () -> BlogPosts in
            let postURLs = loadPostURLs()

            return await withTaskGroup(of: BlogPost?.self) { [weak self] taskGroup in
                for postURL in postURLs {
                    taskGroup.addTask {
                        try? self?.loadPost(at: postURL)
                    }
                }

                var posts: BlogPosts = [:]

                for await post in taskGroup {
                    if let post {
                        if posts[post.slug] == nil {
                            posts[post.slug] = post
                        } else {
                            print("Found duplicate posts for slug “\(post.slug)”")
                        }
                    }
                }

                posts.sort(by: { $0.value.publishDate > $1.value.publishDate })
                return posts
            }
        }
        self.loadingPostsTask = loadingPostsTask
        let posts = await loadingPostsTask.value
        if !Task.isCancelled {
            self.loadingPostsTask = nil
            cachedPosts = posts
        }
        return posts
    }

    private nonisolated func loadPost(at postURL: URL) throws -> BlogPost? {
        do {
            print("Loading blog post at \(postURL)")

            guard let data = FileManager.default.contents(atPath: postURL.path) else {
                print("Failed to get contents for post at \(postURL)")
                return nil
            }
            guard let source = String(data: data, encoding: .utf8) else {
                print("Failed to parse post data as UTF8 string at \(postURL)")
                return nil
            }
            let post = try parsePost(source: source, url: postURL)
            print("Successfully loaded \(post.title) from \(postURL)")
            return post
        } catch {
            print("Failed to parse post contents at \(postURL): \(error)")
            return nil
        }
    }

    private nonisolated func parsePost(source: String, url: URL) throws -> BlogPost {
        let (frontmatter, contentMarkdown) = try splitPost(from: source)

        let decoder = YAMLDecoder()
        let metadataDTO = try decoder.decode(BlogPostMetadataDTO.self, from: frontmatter)
        let metadata = metadataDTO.asBlogPostMetadata()

        let slug = slug(from: url)
        let excerptSeparator = "<!-- more -->"
        let excerptMarkdown = contentMarkdown.components(separatedBy: excerptSeparator).first
        let excerpt = contentMarkdown.contains(excerptSeparator) ? excerptMarkdown : nil

        return BlogPost(
            slug: slug,
            title: metadata.title,
            contentHTML: markdownRenderer.render(contentMarkdown.replacingOccurrences(of: excerptSeparator, with: ""), baseURL: baseURL),
            excerptHTML: excerpt.map { markdownRenderer.render($0, baseURL: baseURL) },
            publishDate: metadata.date,
            updateDate: metadata.updateDate,
            draft: metadata.draft,
            tags: metadata.tags,
            imageURL: metadata.imageURL
        )
    }

    private nonisolated func splitPost(from source: String) throws -> (frontmatter: String, contentMarkdown: String) {
        let splits = source.split(separator: "\n---\n", maxSplits: 1, omittingEmptySubsequences: false)
        guard splits.count == 2 else {
            // Could be that the separator was not found, could be that there's nothing after the
            // separator. To provide a better error we'd need to check.
            throw ContentError.missingFrontmatter
        }

        let frontmatter = String(splits[0])
        let contentMarkdown = String(splits[1])

        return (frontmatter, contentMarkdown)
    }

    private nonisolated func slug(from fileURL: URL) -> String {
        fileURL.deletingPathExtension().lastPathComponent.replacingOccurrences(of: " ", with: "-")
    }
}

public enum ContentError: Error {
    case missingFrontmatter
}

private struct BlogPostMetadataDTO: Decodable {
    var title: String
    var date: Date
    var updateDate: Date?
    var draft: Bool?
    var tags: [String]?
    var imageURL: String?
    var series: String?

    func asBlogPostMetadata() -> BlogPostMetadata {
        BlogPostMetadata(
            title: title,
            date: date,
            updateDate: updateDate,
            draft: draft ?? false,
            tags: tags ?? [],
            imageURL: imageURL,
            series: series
        )
    }
}
