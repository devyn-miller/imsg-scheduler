export interface Message {
  id: string;
  recipient: string;
  content: string;
  scheduledTime: Date;
  isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly';
  isDraft: boolean;
  conditions?: {
    weekdaysOnly: boolean;
    timeRange?: {
      start: string;
      end: string;
    };
  };
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

export interface MessageExport {
  version: string;
  messages: Message[];
  exportDate: string;
}