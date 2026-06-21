import MetaCodable
import Foundation

public struct BlogPost: Equatable, Sendable {
    public let slug: String
    public let title: String
    public let contentHTML: String
    public let excerptHTML: String?
    public let publishDate: Date
    public let updateDate: Date?
    public let draft: Bool
    public var url: String {
        "/posts/\(slug)"
    }
    public let tags: [String]
    public let imageURL: String?

    public init(
        slug: String,
        title: String,
        contentHTML: String,
        excerptHTML: String? = nil,
        publishDate: Date,
        updateDate: Date? = nil,
        draft: Bool = false,
        tags: [String] = [],
        imageURL: String? = nil,
    ) {
        self.slug = slug
        self.title = title
        self.contentHTML = contentHTML
        self.excerptHTML = excerptHTML
        self.publishDate = publishDate
        self.updateDate = updateDate
        self.draft = draft
        self.tags = tags
        self.imageURL = imageURL
    }
}

@ConformDecodable
public struct BlogPostMetadata: Equatable, Sendable {
    public var title: String
    public var date: Date
    public var updateDate: Date?
    @Default(ifMissing: false)
    public var draft: Bool
    @Default(ifMissing: [])
    public var tags: [String]
    public var imageURL: String?
    public var series: String?

    public init(
        title: String,
        date: Date,
        updateDate: Date? = nil,
        draft: Bool = false,
        tags: [String] = [],
        imageURL: String? = nil,
        series: String? = nil,
    ) {
        self.title = title
        self.date = date
        self.updateDate = updateDate
        self.draft = draft
        self.tags = tags
        self.imageURL = imageURL
        self.series = series
    }
}
