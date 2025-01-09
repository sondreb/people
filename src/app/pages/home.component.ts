import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Contact } from '../models/contact';
import { StorageService } from '../services/storage.service';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';

@Component({
  selector: 'app-home',
  template: `
    <div class="page-container">
      <h1 class="page-title">People</h1>
      <div class="contacts-list">
        <div *ngFor="let contact of contacts" class="contact-card">
          <img [src]="contact.imageUrl || 'images/profile.png'" alt="Profile image" class="contact-image">
          <div class="contact-info">
            <h3>{{ contact.name }}</h3>
            <div class="contact-details">
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
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
})
export class HomeComponent implements OnInit {
  contacts: Contact[] = [];
  router = inject(Router);
  showDeleteDialog = false;
  contactToDelete: Contact | null = null;

  constructor(private storage: StorageService) {}

  async ngOnInit() {
    this.contacts = await this.storage.getAllContacts();
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
