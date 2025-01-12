import { Injectable } from '@angular/core';
import { Contact, parseCsvContacts } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbName = 'people-db';
  private storeName = 'contacts';
  private db: IDBDatabase | null = null;

  async initDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async getAllContacts(): Promise<Contact[]> {
    await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addContact(contact: Contact): Promise<Contact> {
    await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(contact);

      request.onsuccess = () => {
        contact.id = request.result as number;
        resolve(contact);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getContact(id: number): Promise<Contact | undefined> {
    await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateContact(contact: Contact): Promise<void> {
    await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(contact);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteContact(id: number): Promise<void> {
    await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData(): Promise<void> {
    await this.ensureDb();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async importContacts(contacts: Contact[]): Promise<void> {
    await this.ensureDb();
    
    // Get existing contacts first
    const existingContacts = await this.getAllContacts();
  
    // Process all contacts first before starting transaction
    const processedContacts = contacts.map(newContact => {
      const existingContact = existingContacts.find(existing => 
        this.isMatchingContact(existing, newContact)
      );
  
      if (existingContact) {
        return this.mergeContacts(existingContact, newContact);
      }
      return newContact;
    });
  
    // Now handle the database transaction
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
  
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
  
      // Process all contacts within the same transaction
      processedContacts.forEach(contact => {
        if (contact.id) {
          store.put(contact);
        } else {
          store.add(contact);
        }
      });
    });
  }

  private isMatchingContact(contact1: Contact, contact2: Contact): boolean {
    // Match based on email address first
    if (contact1.emailAddress && contact2.emailAddress && 
        contact1.emailAddress.toLowerCase() === contact2.emailAddress.toLowerCase()) {
      return true;
    }

    // Match based on name and phone number
    if (contact1.firstName && contact2.firstName && 
        contact1.lastName && contact2.lastName && 
        contact1.mobilePhone && contact2.mobilePhone) {
      return contact1.firstName.toLowerCase() === contact2.firstName.toLowerCase() &&
             contact1.lastName.toLowerCase() === contact2.lastName.toLowerCase() &&
             contact1.mobilePhone === contact2.mobilePhone;
    }

    return false;
  }

  private mergeContacts(existing: Contact, newContact: Contact): Contact {
    const merged: any = { ...existing };
    
    // Iterate through all properties of the new contact
    Object.keys(newContact).forEach(key => {
      const prop = key as keyof Contact;
      if (newContact[prop] && (!merged[prop] || merged[prop] === '')) {
        merged[prop] = newContact[prop] as any as Contact[typeof prop];
      }
    });

    return merged;
  }

  parseCsv(csvContent: string): Contact[] {

    return parseCsvContacts(csvContent);
    
    // const parseCSVLine = (line: string): string[] => {
    //   const result: string[] = [];
    //   let field = '';
    //   let insideQuotes = false;
      
    //   for (let i = 0; i < line.length; i++) {
    //     const char = line[i];
        
    //     if (char === '"') {
    //       if (i + 1 < line.length && line[i + 1] === '"') {
    //         // Handle escaped quotes
    //         field += '"';
    //         i++; // Skip next quote
    //       } else {
    //         insideQuotes = !insideQuotes;
    //       }
    //     } else if (char === ',' && !insideQuotes) {
    //       result.push(field.trim());
    //       field = '';
    //     } else {
    //       field += char;
    //     }
    //   }
      
    //   result.push(field.trim());
    //   return result;
    // };

    // Split content into lines while preserving newlines in quoted fields
    // const lines: string[] = [];
    // let currentLine = '';
    // let insideQuotes = false;
    
    // for (let i = 0; i < csvContent.length; i++) {
    //   const char = csvContent[i];
      
    //   if (char === '"') {
    //     insideQuotes = !insideQuotes;
    //     currentLine += char;
    //   } else if (char === '\n' && !insideQuotes) {
    //     lines.push(currentLine); // Remove the trim() check here
    //     currentLine = '';
    //   } else {
    //     currentLine += char;
    //   }
    // }
    // if (currentLine) { // Remove trim() check here as well
    //   lines.push(currentLine);
    // }

    // // Parse headers and create contacts
    // const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
    // const contacts: Contact[] = [];

    // for (let i = 1; i < lines.length; i++) {
    //   const line = lines[i];
    //   if (!line) continue; // Skip truly empty lines, but keep lines with just commas
      
    //   const values = parseCSVLine(lines[i]);
    //   const contact: Contact = { name: '' };
    //   const emails: string[] = [];
    //   const phones: string[] = [];

    //   headers.forEach((header, index) => {
    //     const value = values[index];
    //     if (!value) return;

    //     // Remove surrounding quotes if they exist
    //     const cleanValue = value.replace(/^"(.*)"$/, '$1').replace(/""/g, '"');

    //     if (header.includes('name')) {
    //       contact.name = cleanValue;
    //     } else if (header.includes('company')) {
    //       contact.company = cleanValue;
    //     } else if (header.includes('email')) {
    //       emails.push(cleanValue);
    //     } else if (header.includes('phone')) {
    //       phones.push(cleanValue);
    //     } else if (header.includes('birth')) {
    //       // Try to parse various date formats
    //       const date = new Date(cleanValue);
    //       if (!isNaN(date.getTime())) {
    //         contact.birthday = date;
    //       }
    //     }
    //   });

    //   // Modified validation: Accept contact if it has either a name or at least one email
    //   if (contact.name || emails.length > 0) {
    //     contact.emails = emails;
    //     contact.phones = phones;
    //     // If no name is provided, use the first email as the name
    //     if (!contact.name && emails.length > 0) {
    //       contact.name = emails[0];
    //     }
    //     contacts.push(contact);
    //   }
    // }

    // return contacts;
  }

  private async ensureDb(): Promise<void> {
    if (!this.db) {
      await this.initDb();
    }
  }
}
