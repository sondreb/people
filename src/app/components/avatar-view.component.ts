import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../models/contact';
import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-avatar-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar-grid">
      <div *ngFor="let contact of contacts" 
           class="avatar-item"
           (click)="onEdit.emit(contact)">
        <div class="avatar-container">
          <img [src]="contact.avatarUrl || defaultAvatar" 
               [alt]="getFullName(contact)" 
               class="avatar"
               (error)="handleImageError(contact)">
          <div class="hover-info">
            <h3>{{ getFullName(contact) }}</h3>
            <div *ngIf="contact.emailAddress">{{ contact.emailAddress }}</div>
            <div *ngIf="getPrimaryPhone(contact)">{{ getPrimaryPhone(contact) }}</div>
            <div *ngIf="contact.company">{{ contact.company }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .avatar-container {
      position: relative;
      cursor: pointer;
    }
    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 60px;
      transition: transform 0.2s;
    }
    .hover-info {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      color: white;
      border-radius: 60px;
      padding: 10px;
      opacity: 0;
      transition: opacity 0.2s;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 12px;
    }
    .hover-info h3 {
      margin: 0 0 5px 0;
      font-size: 14px;
    }
    .avatar-container:hover .hover-info {
      opacity: 1;
    }
    .avatar-container:hover .avatar {
      transform: scale(1.05);
    }
  `]
})
export class AvatarViewComponent implements OnInit {
  @Input() contacts: Contact[] = [];
  @Output() onEdit = new EventEmitter<Contact>();
  
  defaultAvatar = 'assets/default-avatar.png'; // You might want to add a default avatar image

  constructor(private avatarService: AvatarService) {}

  async ngOnInit() {
    // Load all avatars when component initializes
    await this.loadAvatars();
  }

  private async loadAvatars() {
    for (const contact of this.contacts) {
      await this.loadAvatarForContact(contact);
    }
  }

  private async loadAvatarForContact(contact: Contact) {
    try {
      contact.avatarUrl = await this.avatarService.getAvatarUrl(
        contact.emailAddress,
        this.getFullName(contact),
        240
      );
    } catch (error) {
      console.error('Error loading avatar:', error);
      contact.avatarUrl = this.defaultAvatar;
    }
  }

  async handleImageError(contact: Contact) {
    await this.loadAvatarForContact(contact);
  }

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
