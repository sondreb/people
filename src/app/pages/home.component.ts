import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Contact } from '../models/contact';
import { StorageService } from '../services/storage.service';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';

@Component({
  selector: 'app-home',
  template: `
    <div class="contacts-list">
      <div *ngFor="let contact of contacts" class="contact-card">
        <img [src]="contact.imageUrl || 'images/profile.png'" alt="Profile image" class="contact-image">
        <div class="contact-info">
          <h3>{{ contact.name }}</h3>
          <div *ngFor="let email of contact.emails" class="contact-detail">
            <p>{{ email }}</p>
          </div>
          <div *ngFor="let phone of contact.phones" class="contact-detail">
            <p>{{ phone }}</p>
          </div>
        </div>
        <div class="contact-actions">
          <button (click)="editContact(contact)">Edit</button>
          <button (click)="deleteContact(contact)">Delete</button>
        </div>
      </div>
    </div>
    <a routerLink="/contact" class="add-button">Add New Contact</a>
    
    <app-confirm-dialog
      [visible]="showDeleteDialog"
      title="Delete Contact"
      [message]="'Are you sure you want to delete ' + (contactToDelete?.name || '') + '?'"
      (confirm)="confirmDelete()"
      (cancel)="cancelDelete()"
    ></app-confirm-dialog>
  `,
  styles: [`
    .contact-detail {
      margin: 4px 0;
    }
    .contact-image {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 15px;
    }
    .contact-card {
      display: flex;
      align-items: center;
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
