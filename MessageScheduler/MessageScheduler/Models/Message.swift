import Foundation

struct Message: Codable, Identifiable {
    let id: UUID
    var recipient: String
    var content: String
    var scheduledTime: Date
    var isRecurring: Bool
    var recurringInterval: RecurringInterval?
    var isDraft: Bool
    var conditions: MessageConditions?
    
    enum RecurringInterval: String, Codable {
        case daily, weekly, monthly
    }
}

struct MessageConditions: Codable {
    var weekdaysOnly: Bool
    var timeRange: TimeRange?
}

struct TimeRange: Codable {
    var start: Date
    var end: Date
}

struct Contact: Identifiable {
    let id: UUID
    var name: String
    var phoneNumber: String
}