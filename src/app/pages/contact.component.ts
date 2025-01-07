import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-contact',
  template: `<div class="add-contact-container">
  <h2>{{ isEditMode ? 'Edit Contact' : 'Add New Contact' }}</h2>
  <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
    <div>
      <label for="name">Name:</label>
      <input id="name" type="text" formControlName="name">
    </div>
    <div formArrayName="emails">
      <label>Email Addresses: (optional)</label>
      <div *ngFor="let email of emails.controls; let i=index" class="array-entry">
        <input [formControlName]="i" type="email" [placeholder]="'Email ' + (i + 1)">
        <button type="button" (click)="removeEmail(i)" class="remove-btn">✕</button>
      </div>
      <button type="button" (click)="addEmail()" class="add-btn">Add Email</button>
    </div>
    <div formArrayName="phones">
      <label>Phone Numbers: (optional)</label>
      <div *ngFor="let phone of phones.controls; let i=index" class="array-entry">
        <input [formControlName]="i" type="tel" [placeholder]="'Phone ' + (i + 1)">
        <button type="button" (click)="removePhone(i)" class="remove-btn">✕</button>
      </div>
      <button type="button" (click)="addPhone()" class="add-btn">Add Phone</button>
    </div>
    <div class="button-group">
      <button type="submit" [disabled]="!contactForm.valid">
        {{ isEditMode ? 'Update' : 'Add' }} Contact
      </button>
      <button type="button" (click)="cancel()">Cancel</button>
    </div>
  </form>
</div>`,
  styles: [`
    // ...existing styles...
    .button-group {
      display: flex;
      gap: 10px;
    }
    .array-entry {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .remove-btn {
      padding: 0 8px;
      background: #ff4444;
    }
    .add-btn {
      margin: 8px 0;
      background: #4CAF50;
    }
  `],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isEditMode = false;
  contactId?: number;

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      emails: this.fb.array([]),
      phones: this.fb.array([])
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

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.contactId = Number(id);
      const contact = await this.storage.getContact(this.contactId);
      if (contact) {
        this.contactForm.patchValue({ name: contact.name });
        
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
        phones: formValue.phones?.filter((p: string) => p.trim().length > 0) || []
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
