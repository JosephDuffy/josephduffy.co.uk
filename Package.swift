// swift-tools-version: 6.3
import PackageDescription

let package = Package(
    name: "JosephDuffyWebsite",
    platforms: [
        .macOS(.v26),
    ],
    products: [
        .library(name: "Server", targets: ["Server"]),
        .executable(name: "Runner", targets: ["Runner"]),
        .executable(name: "Watcher", targets: ["Watcher"]),
    ],
    dependencies: [
        .package(url: "https://github.com/vapor/Vapor.git", from: "4.121.4"),
        .package(url: "https://github.com/elementary-swift/Elementary.git", from: "0.7.1"),
        .package(url: "https://github.com/vapor-community/vapor-elementary.git", from: "0.2.2"),
        .package(url: "https://github.com/swiftlang/swift-markdown.git", from: "0.8.0"),
        .package(url: "https://github.com/jpsim/Yams.git", from: "6.2.2"),
//        .package(url: "https://github.com/nmdias/FeedKit.git", from: "10.4.0"),
        // Encodes items in a channel after all other elements.
        .package(url: "https://github.com/JosephDuffy/FeedKit.git", branch: "main"),
        .package(url: "https://github.com/apple/swift-algorithms.git", from: "1.2.0"),
        .package(url: "https://github.com/SwiftyLab/MetaCodable.git", from: "1.6.0"),
        .package(url: "https://github.com/JosephDuffy/UseCaseMacro.git", branch: "main"),
        .package(url: "https://github.com/apple/swift-collections.git", from: "1.6.0"),
        .package(
            url: "https://github.com/swiftlang/swift-subprocess.git",
            .upToNextMinor(from: "0.4.0")
        )
    ],
    targets: [
        .target(
            name: "Server",
            dependencies: [
                .product(name: "Algorithms", package: "swift-algorithms"),
                .product(name: "Vapor", package: "Vapor"),
                .product(name: "Elementary", package: "Elementary"),
                .product(name: "VaporElementary", package: "vapor-elementary"),
                .product(name: "Markdown", package: "swift-markdown"),
                .product(name: "Yams", package: "Yams"),
                .product(name: "FeedKit", package: "FeedKit"),
                .product(name: "XMLKit", package: "FeedKit"),
                .product(name: "MetaCodable", package: "MetaCodable"),
                .product(name: "UseCaseMacro", package: "UseCaseMacro"),
                .product(name: "OrderedCollections", package: "swift-collections"),
            ],
        ),
        .executableTarget(
            name: "Runner",
            dependencies: [
                .target(name: "Server"),
            ],
        ),
        .executableTarget(
            name: "Watcher",
            dependencies: [
                .product(name: "Subprocess", package: "swift-subprocess"),
            ],
        ),
        .testTarget(
            name: "ServerTests",
            dependencies: [
                .target(name: "Server"),
                .product(name: "XCTVapor", package: "vapor"),
            ],
        )
    ]
)
