import SwiftUI
import ContactsUI

struct ComposeMessageView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var messageManager = MessageManager()
    @State private var recipient = ""
    @State private var content = ""
    @State private var scheduledTime = Date()
    @State private var isRecurring = false
    @State private var weekdaysOnly = false
    @State private var showingContactPicker = false
    
    var body: some View {
        NavigationView {
            Form {
                Section("Recipient") {
                    HStack {
                        TextField("Recipient", text: $recipient)
                        Button(action: { showingContactPicker = true }) {
                            Image(systemName: "person.crop.circle")
                        }
                    }
                }
                
                Section("Message") {
                    TextEditor(text: $content)
                        .frame(height: 100)
                }
                
                Section("Schedule") {
                    DatePicker("Send Time", selection: $scheduledTime)
                    Toggle("Recurring", isOn: $isRecurring)
                    Toggle("Weekdays Only", isOn: $weekdaysOnly)
                }
                
                Section {
                    Button("Schedule Message") {
                        scheduleMessage()
                    }
                    Button("Save as Draft") {
                        saveDraft()
                    }
                }
            }
            .navigationTitle("New Message")
            .navigationBarItems(trailing: Button("Cancel") { dismiss() })
            .sheet(isPresented: $showingContactPicker) {
                ContactPickerView(selectedContact: { contact in
                    recipient = contact.phoneNumber
                })
            }
        }
    }
    
    private func scheduleMessage() {
        let message = Message(
            id: UUID(),
            recipient: recipient,
            content: content,
            scheduledTime: scheduledTime,
            isRecurring: isRecurring,
            recurringInterval: nil,
            isDraft: false,
            conditions: MessageConditions(weekdaysOnly: weekdaysOnly, timeRange: nil)
        )
        
        try? messageManager.scheduleMessage(message)
        dismiss()
    }
    
    private func saveDraft() {
        let draft = Message(
            id: UUID(),
            recipient: recipient,
            content: content,
            scheduledTime: scheduledTime,
            isRecurring: isRecurring,
            recurringInterval: nil,
            isDraft: true,
            conditions: MessageConditions(weekdaysOnly: weekdaysOnly, timeRange: nil)
        )
        
        messageManager.saveDraft(draft)
        dismiss()
    }
}

struct ContactPickerView: UIViewControllerRepresentable {
    let selectedContact: (Contact) -> Void
    
    func makeUIViewController(context: Context) -> CNContactPickerViewController {
        let picker = CNContactPickerViewController()
        picker.delegate = context.coordinator
        return picker
    }
    
    func updateUIViewController(_ uiViewController: CNContactPickerViewController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(selectedContact: selectedContact)
    }
    
    class Coordinator: NSObject, CNContactPickerDelegate {
        let selectedContact: (Contact) -> Void
        
        init(selectedContact: @escaping (Contact) -> Void) {
            self.selectedContact = selectedContact
        }
        
        func contactPicker(_ picker: CNContactPickerViewController, didSelect contact: CNContact) {
            if let phoneNumber = contact.phoneNumbers.first?.value.stringValue {
                selectedContact(Contact(
                    id: UUID(),
                    name: "\(contact.givenName) \(contact.familyName)",
                    phoneNumber: phoneNumber
                ))
            }
        }
    }
}