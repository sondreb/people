import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../models/contact';
import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-contact-card',
  template: `
    <div class="contact-card">
      <img [src]="contact.imageUrl || avatarUrl" [alt]="contact.firstName" class="contact-image">
      <div class="contact-info">
        <h3>{{ contact.firstName || contact.emailAddress || 'Unknown Contact' }}</h3>
        <div *ngIf="contact.company" class="contact-company">
          <i class="fas fa-building"></i>
          <span>{{ contact.company }}</span>
        </div>
        <div class="contact-details">
          <div *ngIf="contact.birthday" class="contact-detail">
            <i class="fas fa-birthday-cake"></i>
            <span>{{ contact.birthday | date:'mediumDate' }}</span>
          </div>
        </div>
      </div>
      <div class="contact-actions">
        <button class="edit-btn" (click)="onEdit.emit(contact)">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn" (click)="onDelete.emit(contact)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
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

    .edit-btn, .delete-btn {
      padding: 8px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
    }

    .edit-btn {
      background: var(--primary);
      color: white;
    }

    .delete-btn {
      background: var(--danger);
      color: white;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class ContactCardComponent {
  @Input() contact!: Contact;
  @Output() onEdit = new EventEmitter<Contact>();
  @Output() onDelete = new EventEmitter<Contact>();

  avatarUrl: string = '';

  constructor(private avatarService: AvatarService) {}

  async ngOnInit() {
    if (!this.contact.imageUrl) {
      this.avatarUrl = await this.avatarService.getAvatarUrl(this.contact.emailAddress || '');
    }
  }
}
