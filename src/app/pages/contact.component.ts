import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-contact',
  template: `
    <div class="page-container">
      <div class="form-card">
        <h2>{{ isEditMode ? 'Edit Contact' : 'Add New Contact' }}</h2>
        <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
          <div class="image-upload">
            <div class="image-container">
              <img [src]="imagePreview || 'images/profile.png'" alt="Profile image" class="profile-image">
              <button type="button" (click)="fileInput.click()" class="change-image-btn">
                <i class="fas fa-camera"></i>
              </button>
            </div>
            <input type="file" accept="image/*" (change)="onImageSelected($event)" #fileInput>
          </div>

          <div class="form-group">
            <label for="name">Name</label>
            <input id="name" type="text" formControlName="name" placeholder="Enter name">
          </div>

          <div class="form-group" formArrayName="emails">
            <label>Email Addresses</label>
            <div *ngFor="let email of emails.controls; let i=index" class="array-entry">
              <input [formControlName]="i" type="email" [placeholder]="'Email address ' + (i + 1)">
              <button type="button" class="remove-btn" (click)="removeEmail(i)">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <button type="button" class="add-btn" (click)="addEmail()">
              <i class="fas fa-plus"></i> Add Email
            </button>
          </div>

          <div class="form-group" formArrayName="phones">
            <label>Phone Numbers</label>
            <div *ngFor="let phone of phones.controls; let i=index" class="array-entry">
              <input [formControlName]="i" type="tel" [placeholder]="'Phone number ' + (i + 1)">
              <button type="button" class="remove-btn" (click)="removePhone(i)">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <button type="button" class="add-btn" (click)="addPhone()">
              <i class="fas fa-plus"></i> Add Phone
            </button>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" (click)="cancel()">Cancel</button>
            <button type="submit" [disabled]="!contactForm.valid">
              {{ isEditMode ? 'Update' : 'Add' }} Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-card {
      background: var(--card);
      border-radius: 12px;
      padding: 24px;
      box-shadow: var(--shadow);
    }

    h2 {
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .image-upload {
      text-align: center;
      margin-bottom: 24px;
    }

    .image-container {
      position: relative;
      display: inline-block;
    }

    .profile-image {
      width: 120px;
      height: 120px;
      border-radius: 60px;
      object-fit: cover;
    }

    .change-image-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: var(--primary);
      color: white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--text);
    }

    .array-entry {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    .array-entry input {
      flex: 1;
    }

    .add-btn {
      background: var(--success);
      color: white;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
    }

    .remove-btn {
      background: var(--danger);
      color: white;
      padding: 8px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .form-actions button {
      flex: 1;
      padding: 12px;
    }

    .cancel-btn {
      background: var(--text-light);
      color: white;
    }

    button[type="submit"] {
      background: var(--primary);
      color: white;
    }

    button[type="submit"]:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    input[type="file"] {
      display: none;
    }
  `],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isEditMode = false;
  contactId?: number;
  imagePreview: string | null = null;
  private imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      emails: this.fb.array([]),
      phones: this.fb.array([]),
      imageUrl: ['']
    });
  }

  get emails() {
    return this.contactForm.get('emails') as FormArray;
  }

  addEmail() {
    this.emails.push(this.fb.control(''));
  }

  removeEmail(index: number) {
    this.emails.removeAt(index);
  }

  get phones() {
    return this.contactForm.get('phones') as FormArray;
  }

  addPhone() {
    this.phones.push(this.fb.control(''));
  }

  removePhone(index: number) {
    this.phones.removeAt(index);
  }

  async onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile = file;
      this.imagePreview = await this.readFileAsDataUrl(file);
    }
  }

  removeImage() {
    this.imageFile = null;
    this.imagePreview = null;
    this.contactForm.patchValue({ imageUrl: '' });
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.contactId = Number(id);
      const contact = await this.storage.getContact(this.contactId);
      if (contact) {
        this.contactForm.patchValue({ 
          name: contact.name,
          imageUrl: contact.imageUrl 
        });
        this.imagePreview = contact.imageUrl || null;
        
        contact.emails?.forEach(email => {
          this.emails.push(this.fb.control(email));
        });
        
        contact.phones?.forEach(phone => {
          this.phones.push(this.fb.control(phone));
        });
      }
    } else {
      this.addEmail();
      this.addPhone();
    }
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;
      const contact = {
        ...formValue,
        emails: formValue.emails?.filter((e: string) => e.trim().length > 0) || [],
        phones: formValue.phones?.filter((p: string) => p.trim().length > 0) || [],
        imageUrl: this.imagePreview
      };
      
      if (this.isEditMode && this.contactId) {
        contact.id = this.contactId;
        await this.storage.updateContact(contact);
      } else {
        await this.storage.addContact(contact);
      }
      this.router.navigate(['']);
    }
  }

  cancel() {
    this.router.navigate(['']);
  }
}
