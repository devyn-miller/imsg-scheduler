import { Observable } from '@nativescript/core';
import { Message } from '../models/message';
import { MessageService } from '../services/message-service';
import { ContactService } from '../services/contact-service';

export class MessageComposeViewModel extends Observable {
  private _searchQuery: string = '';
  private _recipient: string = '';
  private _content: string = '';
  private _scheduledTime: Date = new Date();
  private _isRecurring: boolean = false;
  private _conditions = {
    weekdaysOnly: false,
    timeRange: {
      start: '09:00',
      end: '17:00'
    }
  };

  constructor() {
    super();
  }

  async showContactPicker() {
    try {
      const contacts = await ContactService.getContacts();
      // Show contact picker dialog
      // Implementation depends on UI framework choice
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  onSchedule() {
    const message: Message = {
      id: Date.now().toString(),
      recipient: this._recipient,
      content: this._content,
      scheduledTime: this._scheduledTime,
      isRecurring: this._isRecurring,
      isDraft: false,
      conditions: this._conditions
    };

    if (MessageService.scheduleMessage(message)) {
      // Clear form and show success message
      this.resetForm();
    } else {
      // Show error message about invalid conditions
    }
  }

  onImport() {
    // Show file picker and import messages
    // Implementation depends on platform-specific file picker
  }

  onExport() {
    const filePath = MessageService.exportMessages();
    // Show success message with file path
  }

  private resetForm() {
    this._recipient = '';
    this._content = '';
    this._scheduledTime = new Date();
    this._isRecurring = false;
    this._conditions = {
      weekdaysOnly: false,
      timeRange: {
        start: '09:00',
        end: '17:00'
      }
    };
    this.notifyPropertyChange('recipient', '');
    this.notifyPropertyChange('content', '');
    this.notifyPropertyChange('scheduledTime', this._scheduledTime);
    this.notifyPropertyChange('isRecurring', false);
    this.notifyPropertyChange('conditions', this._conditions);
  }

  // Getters and setters for all properties
  // ... (implementation omitted for brevity)
}