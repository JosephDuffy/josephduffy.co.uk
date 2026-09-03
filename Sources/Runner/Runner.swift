import Server
import Vapor

@main
enum Runner {
    static func main() async throws {
        var environment = try Environment.detect()
        try LoggingSystem.bootstrap(from: &environment)
        let app = try await Application.make(environment)

        #if Xcode
        let projectRoot = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
        app.directory = DirectoryConfiguration(workingDirectory: projectRoot.path())
        #endif

        app.directory.publicDirectory = app.directory.workingDirectory + "public/"
        do {
            try await configure(app)
            try await app.execute()
        } catch {
            app.logger.report(error: error)
            try await app.asyncShutdown()
            throw error
        }
        try await app.asyncShutdown()
    }
}
