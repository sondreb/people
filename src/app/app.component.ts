import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CommonModule, FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  deferredPrompt: any;
  showInstallButton = false;
  contacts: any[] = [];
  newContact: any = {};

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton = true;
    });
  }

  async installPwa() {
    if (!this.deferredPrompt) return;
    
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      this.showInstallButton = false;
    }
    this.deferredPrompt = null;
  }

  addContact() {
    this.contacts.push(this.newContact);
    this.newContact = {};
  }

  editContact(contact: any) {
    this.newContact = contact;
  }

  deleteContact(contact: any) {
    const index = this.contacts.indexOf(contact);
    if (index > -1) {
      this.contacts.splice(index, 1);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newContact.photo = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
