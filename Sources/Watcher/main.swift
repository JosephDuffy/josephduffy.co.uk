import Foundation
import FSWatcher
import Subprocess
import os.log

@main
enum Entrypoint {
    static func main() async throws {
        let projectRoot = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .appending(components: "Server/", directoryHint: .isDirectory)
        let service = WatcherService(rootPath: projectRoot)
        try await service.run()
    }
}

struct WatcherService {
    private let rootPath: URL

    init(rootPath: URL) {
        self.rootPath = rootPath
    }

    func run() async throws {
        try await debugRunner()

        print("Creating file watcher for “\(rootPath.path)”")
        var options = RecursiveWatchOptions()
        options.excludePatterns = ["Watcher"]
        let watcher = try RecursiveDirectoryWatcher(url: rootPath, options: options)
        watcher.start()
        print("Watcher started... waiting for files to change")

        for await url in watcher.directoryChanges {
            print("File changed:", url)
            try await debugRunner()
        }

        print("Finished")
    }

    private func debugRunner() async throws {
        print("Asking Xcode to debug scheme")

        let debugScript = """
        tell application "Xcode"
            tell workspace document 1
                debug scheme "Runner"
            end tell
        end tell
        """
        let debugResult = try await Subprocess.run(
            .name("osascript"),
            arguments: ["-e", debugScript],
            output: .standardOutput,
            error: .standardError,
        )
        print("Debug result", debugResult)
    }
}
