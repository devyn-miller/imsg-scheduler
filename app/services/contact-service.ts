import { Contacts } from '@nativescript/contacts';
import { Contact } from '../models/message';

export class ContactService {
  static async getContacts(): Promise<Contact[]> {
    const contacts: Contact[] = [];
    
    try {
      const permission = await Contacts.requestPermission();
      if (!permission) {
        console.log('Permission denied');
        return contacts;
      }

      const fetchedContacts = await Contacts.getAllContacts();
      fetchedContacts.forEach(contact => {
        if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
          contacts.push({
            id: contact.id,
            name: `${contact.name.given} ${contact.name.family}`,
            phoneNumber: contact.phoneNumbers[0].value
          });
        }
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }

    return contacts;
  }
}