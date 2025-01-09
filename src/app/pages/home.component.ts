import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Contact } from '../models/contact';
import { StorageService } from '../services/storage.service';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';
import { SearchService } from '../services/search.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  template: `
    <div class="page-container">
      <h1 class="page-title">People</h1>
      <div class="sort-controls">
        <label>Sort by:</label>
        <select [(ngModel)]="sortField" (change)="applySorting()">
          <option value="name">Name</option>
          <option value="birthday">Birthday</option>
          <option value="company">Company</option>
          <option value="email">Email</option>
        </select>
        <button (click)="toggleSortDirection()" class="sort-direction">
          <i class="fas" [class.fa-sort-up]="sortAscending" [class.fa-sort-down]="!sortAscending"></i>
        </button>
      </div>
      <div class="contacts-list">
        <div *ngFor="let contact of filteredContacts" class="contact-card">
          <img [src]="contact.imageUrl || 'images/profile.png'" alt="Profile image" class="contact-image">
          <div class="contact-info">
            <h3>{{ contact.name || (contact.emails && contact.emails[0]) || 'Unknown Contact' }}</h3>
            <div *ngIf="contact.company" class="contact-company">
              <i class="fas fa-building"></i>
              <span>{{ contact.company }}</span>
            </div>
            <div class="contact-details">
              <div *ngIf="contact.birthday" class="contact-detail">
                <i class="fas fa-birthday-cake"></i>
                <span>{{ contact.birthday | date:'mediumDate' }}</span>
              </div>
              <div *ngFor="let email of contact.emails" class="contact-detail">
                <i class="fas fa-envelope"></i>
                <span>{{ email }}</span>
              </div>
              <div *ngFor="let phone of contact.phones" class="contact-detail">
                <i class="fas fa-phone"></i>
                <span>{{ phone }}</span>
              </div>
            </div>
          </div>
          <div class="contact-actions">
            <button class="edit-btn" (click)="editContact(contact)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" (click)="deleteContact(contact)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <a routerLink="/contact" class="add-button">
        <i class="fas fa-plus square-icon"></i>
      </a>
    </div>
    <app-confirm-dialog
      [visible]="showDeleteDialog"
      title="Delete Contact"
      [message]="'Are you sure you want to delete ' + (contactToDelete?.name || '') + '?'"
      (confirm)="confirmDelete()"
      (cancel)="cancelDelete()"
    ></app-confirm-dialog>
  `,
  styles: [`
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 24px;
      color: var(--text);
    }

    .sort-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .sort-controls select {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--background);
      color: var(--text);
    }

    .sort-direction {
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 6px 12px;
      cursor: pointer;
    }

    .sort-direction:hover {
      background: var(--card);
    }

    .contacts-list {
      display: grid;
      gap: 16px;
    }

    .contact-card {
      background: var(--card);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow);
    }

    .contact-image {
      width: 56px;
      height: 56px;
      border-radius: 28px;
      object-fit: cover;
    }

    .contact-info {
      flex: 1;
    }

    .contact-info h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .contact-company {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-light);
      font-size: 14px;
      margin-bottom: 8px;
    }

    .contact-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .contact-detail {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-light);
      font-size: 14px;
    }

    .contact-actions {
      display: flex;
      gap: 8px;
    }

    .edit-btn {
      background: var(--primary);
      color: white;
    }

    .delete-btn {
      background: var(--danger);
      color: white;
    }

    button i {
      font-size: 14px;
    }
  `],
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent, FormsModule],
})
export class HomeComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  private searchSubscription: Subscription;
  router = inject(Router);
  showDeleteDialog = false;
  contactToDelete: Contact | null = null;
  sortField = 'name';
  sortAscending = true;

  constructor(
    private storage: StorageService,
    private searchService: SearchService
  ) {
    this.searchSubscription = this.searchService.searchTerm$.subscribe(term => {
      this.filterContacts(term);
    });
  }

  async ngOnInit() {
    this.contacts = await this.storage.getAllContacts();
    this.filteredContacts = [...this.contacts];
    this.applySorting();
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  private filterContacts(term: string) {
    term = term.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(term) ||
      contact.emails?.some(email => email.toLowerCase().includes(term)) ||
      contact.phones?.some(phone => phone.includes(term)) ||
      contact.company?.toLowerCase().includes(term)
    );
    this.applySorting();
  }

  applySorting() {
    // First filter out contacts that don't have the selected field
    this.filteredContacts = this.filteredContacts.filter(contact => {
      switch (this.sortField) {
        case 'birthday':
          return !!contact.birthday;
        case 'company':
          return !!contact.company;
        case 'email':
          return !!contact.emails?.length;
        case 'name':
          return true; // Always show contacts when sorting by name
        default:
          return true;
      }
    });

    // Then sort the remaining contacts
    this.filteredContacts.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortField) {
        case 'birthday':
          if (a.birthday && b.birthday) {
            const dateA = new Date(0, a.birthday.getMonth(), a.birthday.getDate());
            const dateB = new Date(0, b.birthday.getMonth(), b.birthday.getDate());
            valueA = dateA.getTime();
            valueB = dateB.getTime();
          } else {
            valueA = a.birthday ? 0 : 1; // Sort contacts with birthdays before those without
            valueB = b.birthday ? 0 : 1;
          }
          break;
        case 'name':
          valueA = a.name?.toLowerCase() || '';
          valueB = b.name?.toLowerCase() || '';
          break;
        case 'company':
          valueA = a.company?.toLowerCase() || '';
          valueB = b.company?.toLowerCase() || '';
          break;
        case 'email':
          valueA = a.emails?.[0]?.toLowerCase() || '';
          valueB = b.emails?.[0]?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return this.sortAscending ? -1 : 1;
      if (valueA > valueB) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }

  toggleSortDirection() {
    this.sortAscending = !this.sortAscending;
    this.applySorting();
  }

  editContact(contact: Contact) {
    this.router.navigate(['/contact', contact.id]);
  }

  deleteContact(contact: Contact) {
    this.contactToDelete = contact;
    this.showDeleteDialog = true;
  }

  async confirmDelete() {
    if (this.contactToDelete) {
      const index = this.contacts.indexOf(this.contactToDelete);
      if (index > -1) {
        this.contacts.splice(index, 1);
        await this.storage.deleteContact(this.contactToDelete.id!);
      }
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.contactToDelete = null;
  }
}
