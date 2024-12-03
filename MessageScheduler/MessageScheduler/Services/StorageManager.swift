import Foundation

class StorageManager {
    static let shared = StorageManager()
    
    private let messagesKey = "scheduledMessages"
    private let draftsKey = "messageDrafts"
    
    private init() {}
    
    func saveMessages(_ messages: [Message]) {
        if let encoded = try? JSONEncoder().encode(messages) {
            UserDefaults.standard.set(encoded, forKey: messagesKey)
        }
    }
    
    func loadMessages() -> [Message] {
        guard let data = UserDefaults.standard.data(forKey: messagesKey),
              let messages = try? JSONDecoder().decode([Message].self, from: data) else {
            return []
        }
        return messages
    }
    
    func saveDrafts(_ drafts: [Message]) {
        if let encoded = try? JSONEncoder().encode(drafts) {
            UserDefaults.standard.set(encoded, forKey: draftsKey)
        }
    }
    
    func loadDrafts() -> [Message] {
        guard let data = UserDefaults.standard.data(forKey: draftsKey),
              let drafts = try? JSONDecoder().decode([Message].self, from: data) else {
            return []
        }
        return drafts
    }
}