import Server
import Vapor

@main
enum Entrypoint {
    static func main() async throws {
        var environment = try Environment.detect()
        try LoggingSystem.bootstrap(from: &environment)
        let app = try await Application.make(environment)
        let projectRoot = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
        var directory = DirectoryConfiguration(workingDirectory: projectRoot.path())
        directory.publicDirectory = directory.workingDirectory + "public/"
        app.directory = directory
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
