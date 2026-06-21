import Foundation

extension FormatStyle where Self == Date.FormatStyle {
    static var shortDate: Date.FormatStyle {
        .dateTime.locale(Locale(identifier: "en_GB")).year().month(.abbreviated).day()
    }
}
