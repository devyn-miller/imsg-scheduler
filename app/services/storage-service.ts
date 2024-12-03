import { ApplicationSettings } from '@nativescript/core';

export class StorageService {
  private static readonly MESSAGES_KEY = 'scheduled_messages';
  private static readonly DRAFTS_KEY = 'message_drafts';

  static saveMessages(messages: any[]): void {
    ApplicationSettings.setString(this.MESSAGES_KEY, JSON.stringify(messages));
  }

  static getMessages(): any[] {
    const data = ApplicationSettings.getString(this.MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveDrafts(drafts: any[]): void {
    ApplicationSettings.setString(this.DRAFTS_KEY, JSON.stringify(drafts));
  }

  static getDrafts(): any[] {
    const data = ApplicationSettings.getString(this.DRAFTS_KEY);
    return data ? JSON.parse(data) : [];
  }
}