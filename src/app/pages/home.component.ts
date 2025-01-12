import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Contact } from '../models/contact';
import { StorageService } from '../services/storage.service';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';
import { SearchService } from '../services/search.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ContactCardComponent } from '../components/contact-card.component';

@Component({
  selector: 'app-home',
  template: `
    <div class="page-container">
      <div class="header-container">
        <div class="title-section">
          <h1 class="page-title">People</h1>
          <span class="contact-count">
            {{ filteredContacts.length }} {{ filteredContacts.length === contacts.length ? 'contacts' : 'results' }}
          </span>
        </div>
        <div class="sort-controls">
          <label>Sort by:</label>
        </div>
      </div>
      <div class="contacts-list">
        <app-contact-card
          *ngFor="let contact of filteredContacts"
          [contact]="contact"
          (onEdit)="editContact($event)"
          (onDelete)="deleteContact($event)"
        ></app-contact-card>
      </div>
      <a routerLink="/contact" class="add-button">
        <i class="fas fa-plus square-icon"></i>
      </a>
    </div>
    <app-confirm-dialog
      [visible]="showDeleteDialog"
      title="Delete Contact"
      [message]="'Are you sure you want to delete ' + (contactToDelete?.firstName || '') + '?'"
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

    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .title-section {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }

    .page-title {
      margin: 0;
    }

    .contact-count {
      color: var(--text-light);
      font-size: 14px;
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
  imports: [CommonModule, RouterModule, ConfirmDialogComponent, FormsModule, ContactCardComponent],
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
    // this.applySorting();
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  private filterContacts(term: string) {
    term = term.toLowerCase().trim();

    if (!term) {
      this.filteredContacts = [...this.contacts];
      return;
    }

    this.filteredContacts = this.contacts.filter(contact => {
      // Helper function to check if a value contains the search term
      const matchesTerm = (value: any) => {
        if (!value) return false;
        return String(value).toLowerCase().includes(term);
      };

      // Check name fields
      if (matchesTerm(contact.firstName) || 
          matchesTerm(contact.middleName) || 
          matchesTerm(contact.lastName) ||
          matchesTerm(contact.nickname)) {
        return true;
      }

      // Check email addresses
      if (matchesTerm(contact.emailAddress) || 
          matchesTerm(contact.email2Address) || 
          matchesTerm(contact.email3Address)) {
        return true;
      }

      // Check phone numbers
      if (matchesTerm(contact.mobilePhone) ||
          matchesTerm(contact.homePhone) ||
          matchesTerm(contact.businessPhone) ||
          matchesTerm(contact.primaryPhone)) {
        return true;
      }

      // Check company related fields
      if (matchesTerm(contact.company) ||
          matchesTerm(contact.jobTitle) ||
          matchesTerm(contact.department)) {
        return true;
      }

      // Check addresses
      if (matchesTerm(contact.homeCity) ||
          matchesTerm(contact.homeState) ||
          matchesTerm(contact.homeCountry) ||
          matchesTerm(contact.businessCity) ||
          matchesTerm(contact.businessState) ||
          matchesTerm(contact.businessCountry)) {
        return true;
      }

      // Check notes
      if (matchesTerm(contact.notes)) {
        return true;
      }

      // Check other fields
      if (matchesTerm(contact.spouse) ||
          matchesTerm(contact.children) ||
          matchesTerm(contact.categories) ||
          matchesTerm(contact.hobby) ||
          matchesTerm(contact.location)) {
        return true;
      }

      return false;
    });
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
