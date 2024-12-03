import Foundation
import Messages
import UserNotifications

class MessageManager: ObservableObject {
    @Published private(set) var scheduledMessages: [Message] = []
    @Published private(set) var drafts: [Message] = []
    
    private let storage = StorageManager.shared
    
    init() {
        loadMessages()
    }
    
    func scheduleMessage(_ message: Message) throws {
        guard validateMessageConditions(message) else {
            throw MessageError.invalidConditions
        }
        
        scheduledMessages.append(message)
        storage.saveMessages(scheduledMessages)
        scheduleNotification(for: message)
    }
    
    private func validateMessageConditions(_ message: Message) -> Bool {
        guard let conditions = message.conditions else { return true }
        
        let scheduleDate = message.scheduledTime
        
        if conditions.weekdaysOnly {
            let weekday = Calendar.current.component(.weekday, from: scheduleDate)
            if weekday == 1 || weekday == 7 { return false }
        }
        
        if let timeRange = conditions.timeRange {
            let scheduleTime = Calendar.current.dateComponents([.hour, .minute], from: scheduleDate)
            let startTime = Calendar.current.dateComponents([.hour, .minute], from: timeRange.start)
            let endTime = Calendar.current.dateComponents([.hour, .minute], from: timeRange.end)
            
            if scheduleTime < startTime || scheduleTime > endTime { return false }
        }
        
        return true
    }
    
    private func scheduleNotification(for message: Message) {
        let content = UNMutableNotificationContent()
        content.title = "Scheduled Message"
        content.body = "Message to \(message.recipient) will be sent soon"
        
        let triggerDate = message.scheduledTime.addingTimeInterval(-5 * 60)
        let trigger = UNCalendarNotificationTrigger(
            dateMatching: Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: triggerDate),
            repeats: false
        )
        
        let request = UNNotificationRequest(
            identifier: message.id.uuidString,
            content: content,
            trigger: trigger
        )
        
        UNUserNotificationCenter.current().add(request)
    }
    
    func saveDraft(_ message: Message) {
        drafts.append(message)
        storage.saveDrafts(drafts)
    }
    
    private func loadMessages() {
        scheduledMessages = storage.loadMessages()
        drafts = storage.loadDrafts()
    }
}

enum MessageError: Error {
    case invalidConditions
    case sendingFailed
    case unauthorized
}