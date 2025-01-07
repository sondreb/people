import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-add-contact',
  template: `<div class="add-contact-container">
  <h2>Add New Contact</h2>
  <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
    <div>
      <label for="name">Name:</label>
      <input id="name" type="text" formControlName="name">
    </div>
    <div>
      <label for="email">Email:</label>
      <input id="email" type="email" formControlName="email">
    </div>
    <div>
      <label for="phone">Phone:</label>
      <input id="phone" type="tel" formControlName="phone">
    </div>
    <button type="submit" [disabled]="!contactForm.valid">Add Contact</button>
  </form>
</div>
`,
  styles: `.add-contact-container {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
  }
  
  form div {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #cccccc;
  }
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.storage.addContact(this.contactForm.value);
      this.router.navigate(['']);  // Changed from '/' to ''
    }
  }
}
