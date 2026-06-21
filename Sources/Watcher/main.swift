import Subprocess
import os.log

@main
enum Entrypoint {
    static func main() async throws {
        try await debugRunner()
    }

    private static func debugRunner() async throws {
        print("Asking Xcode to debug scheme")

        let debugScript = """
            tell application "Xcode"
                tell workspace document 1
                    debug scheme "Runner"
                end tell
            end tell
            """
        let debugResult = try await run(
            .name("osascript"),
            arguments: ["-e", debugScript],
            output: .standardOutput,
            error: .standardError,
        )
        print("Debug result", debugResult)

        // TODO: Keep process running and listen for file changes. On file change, tell Xcode to debug the scheme.
    }
}
