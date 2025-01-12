import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../models/contact';

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table class="contacts-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Company</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let contact of contacts">
          <td>
            <span class="name-link" (click)="onEdit.emit(contact)">
              {{ getFullName(contact) }}
            </span>
          </td>
          <td>{{ contact.emailAddress }}</td>
          <td>{{ getPrimaryPhone(contact) }}</td>
          <td>{{ contact.company }}</td>
          <td>
            <button class="edit-btn" (click)="onEdit.emit(contact)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" (click)="onDelete.emit(contact)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .contacts-table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    th {
      background: var(--card);
      font-weight: 600;
    }
    tr:hover {
      background: var(--card);
    }
    .edit-btn, .delete-btn {
      padding: 6px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      margin-right: 8px;
    }
    .edit-btn {
      background: var(--primary);
      color: white;
    }
    .delete-btn {
      background: var(--danger);
      color: white;
    }
    .name-link {
      cursor: pointer;
      color: var(--text);
      transition: color 0.2s;
    }
    .name-link:hover {
      color: var(--primary);
    }
  `]
})
export class TableViewComponent {
  @Input() contacts: Contact[] = [];
  @Output() onEdit = new EventEmitter<Contact>();
  @Output() onDelete = new EventEmitter<Contact>();

  getFullName(contact: Contact): string {
    return [contact.firstName, contact.middleName, contact.lastName]
      .filter(part => part?.trim())
      .join(' ') || 'Unknown';
  }

  getPrimaryPhone(contact: Contact): string | null {
    return contact.mobilePhone || 
           contact.primaryPhone || 
           contact.businessPhone || 
           contact.homePhone || 
           null;
  }
}
