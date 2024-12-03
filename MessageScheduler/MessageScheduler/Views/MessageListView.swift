import SwiftUI

struct MessageListView: View {
    @StateObject private var messageManager = MessageManager()
    @State private var showingCompose = false
    
    var body: some View {
        NavigationView {
            List {
                Section("Scheduled Messages") {
                    ForEach(messageManager.scheduledMessages) { message in
                        MessageRow(message: message)
                    }
                }
                
                Section("Drafts") {
                    ForEach(messageManager.drafts) { message in
                        MessageRow(message: message)
                    }
                }
            }
            .navigationTitle("Messages")
            .toolbar {
                Button(action: { showingCompose = true }) {
                    Image(systemName: "square.and.pencil")
                }
            }
            .sheet(isPresented: $showingCompose) {
                ComposeMessageView()
            }
        }
    }
}

struct MessageRow: View {
    let message: Message
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(message.recipient)
                .font(.headline)
            Text(message.content)
                .font(.subheadline)
                .foregroundColor(.secondary)
            Text(message.scheduledTime, style: .date)
                .font(.caption)
        }
    }
}