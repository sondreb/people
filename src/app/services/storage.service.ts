import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';

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
    const transaction = this.db!.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);

      contacts.forEach(contact => {
        store.add(contact);
      });
    });
  }

  parseCsvContacts(csvContent: string): Contact[] {
    const lines = csvContent.split('\n');
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const contacts: Contact[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const contact: Contact = { name: '' };
      const emails: string[] = [];
      const phones: string[] = [];

      headers.forEach((header, index) => {
        const value = values[index];
        if (!value) return;

        if (header.includes('name')) {
          contact.name = value;
        }
        else if (header.includes('email')) {
          emails.push(value);
        }
        else if (header.includes('phone')) {
          phones.push(value);
        }
      });

      if (contact.name) {
        contact.emails = emails;
        contact.phones = phones;
        contacts.push(contact);
      }
    }

    return contacts;
  }

  private async ensureDb(): Promise<void> {
    if (!this.db) {
      await this.initDb();
    }
  }
}
