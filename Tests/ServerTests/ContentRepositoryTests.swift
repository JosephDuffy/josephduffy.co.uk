//import Server
//import XCTest
//
//final class ContentRepositoryTests: XCTestCase {
//    func testLoadsExistingPostsFromDataDirectory() async throws {
//        let repository = ContentRepository(
//            postsDirectory: URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
//                .appendingPathComponent("data/posts", isDirectory: true),
//            markdownRenderer: MarkdownRenderer()
//        )
//
//        let posts = try await repository.posts()
//
//        XCTAssertFalse(posts.isEmpty)
//        XCTAssertTrue(posts.contains { $0.slug == "smuggling-values-across-actors" })
//        XCTAssertTrue(posts.allSatisfy { !$0.draft })
//    }
//
//    func testLoadsExcerptsFromMoreSeparator() async throws {
//        let repository = ContentRepository(
//            postsDirectory: URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
//                .appendingPathComponent("data/posts", isDirectory: true),
//            markdownRenderer: MarkdownRenderer()
//        )
//
//        let post = try await repository.post(slug: "partial-in-swift")
//
//        XCTAssertNotNil(post?.excerptHTML)
//        XCTAssertTrue(post?.contentHTML.contains("<!-- more -->") == false)
//    }
//}
