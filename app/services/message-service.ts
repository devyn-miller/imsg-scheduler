import { Message, MessageExport } from '../models/message';
import { StorageService } from './storage-service';
import { LocalNotifications } from '@nativescript/local-notifications';
import { Utils, File, Folder, knownFolders } from '@nativescript/core';

export class MessageService {
  static scheduleMessage(message: Message): boolean {
    if (!this.validateMessageConditions(message)) {
      return false;
    }

    const messages = StorageService.getMessages();
    messages.push(message);
    StorageService.saveMessages(messages);

    LocalNotifications.schedule([{
      id: parseInt(message.id),
      title: 'Scheduled Message',
      body: `Message to ${message.recipient} will be sent soon`,
      at: new Date(message.scheduledTime.getTime() - 5 * 60000)
    }]);

    return true;
  }

  private static validateMessageConditions(message: Message): boolean {
    if (!message.conditions) {
      return true;
    }

    const scheduleDate = new Date(message.scheduledTime);
    
    // Check weekdays only condition
    if (message.conditions.weekdaysOnly && 
        (scheduleDate.getDay() === 0 || scheduleDate.getDay() === 6)) {
      return false;
    }

    // Check time range condition
    if (message.conditions.timeRange) {
      const scheduleTime = scheduleDate.getHours() * 60 + scheduleDate.getMinutes();
      const [startHour, startMin] = message.conditions.timeRange.start.split(':').map(Number);
      const [endHour, endMin] = message.conditions.timeRange.end.split(':').map(Number);
      
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      if (scheduleTime < startTime || scheduleTime > endTime) {
        return false;
      }
    }

    return true;
  }

  static saveDraft(message: Message): void {
    const drafts = StorageService.getDrafts();
    drafts.push(message);
    StorageService.saveDrafts(drafts);
  }

  static deleteDraft(id: string): void {
    const drafts = StorageService.getDrafts();
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    StorageService.saveDrafts(updatedDrafts);
  }

  static exportMessages(): string {
    const messages = StorageService.getMessages();
    const drafts = StorageService.getDrafts();
    
    const exportData: MessageExport = {
      version: '1.0',
      messages: [...messages, ...drafts],
      exportDate: new Date().toISOString()
    };

    const documentsFolder = knownFolders.documents();
    const filePath = documentsFolder.path + '/message_backup.json';
    const jsonString = JSON.stringify(exportData, null, 2);
    
    File.writeText(filePath, jsonString);
    return filePath;
  }

  static importMessages(filePath: string): boolean {
    try {
      const content = File.readText(filePath);
      const importData: MessageExport = JSON.parse(content);
      
      if (importData.version !== '1.0') {
        return false;
      }

      const messages = importData.messages.filter(m => !m.isDraft);
      const drafts = importData.messages.filter(m => m.isDraft);

      StorageService.saveMessages(messages);
      StorageService.saveDrafts(drafts);
      
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  static sendMessage(message: Message): void {
    if (Utils.isIOS) {
      // iOS specific implementation using Messages framework
      console.log('Sending message on iOS:', message);
    } else if (Utils.isAndroid) {
      // Android specific implementation using SMS Manager
      console.log('Sending message on Android:', message);
    }
  }
}