import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';
import { Contact } from '../models/contact';
import { ThemeService, Theme } from '../services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent, FormsModule],
  template: `
    <div class="page-container">
      <div class="settings-card">
        <h1>Settings</h1>

        <div class="setting-group">
          <h2>Theme</h2>
          <div class="theme-selector">
            <select [(ngModel)]="currentTheme" (ngModelChange)="onThemeChange($event)">
              <option value="auto">Auto (System)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div class="setting-group">
          <h2>Data Management</h2>
          <div class="button-group">
            <div class="import-group">
              <button class="primary-btn" (click)="fileInput.click()">
                <i class="fas fa-file-import"></i>
                Import Contacts
              </button>
              <input
                type="file"
                #fileInput
                (change)="onFileSelected($event)"
                accept=".json,.csv"
                style="display: none"
              />
              <div class="import-info">Supports JSON or CSV files</div>
            </div>
            <button class="primary-btn" (click)="exportData()">
              <i class="fas fa-file-export"></i>
              Export Contacts
            </button>
            <button class="danger-btn" (click)="showDeleteConfirm()">
              <i class="fas fa-trash"></i>
              Clear All Data
            </button>
          </div>
        </div>

        <div class="setting-group">
          <h2>About</h2>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>

    <app-confirm-dialog
      [visible]="showImportDialog"
      title="Import Contacts"
      [message]="'Import ' + importCount + ' contacts?'"
      (confirm)="confirmImport()"
      (cancel)="cancelImport()"
    ></app-confirm-dialog>

    <app-confirm-dialog
      [visible]="showDialog"
      title="Clear All Data"
      message="Are you sure you want to delete all contacts? This action cannot be undone."
      (confirm)="confirmClear()"
      (cancel)="cancelClear()"
    ></app-confirm-dialog>
  `,
  styles: [
    `
      .page-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .settings-card {
        background: var(--card);
        border-radius: 12px;
        padding: 24px;
        box-shadow: var(--shadow);
      }
      .setting-group {
        margin-bottom: 32px;
      }
      h1 {
        margin: 0 0 24px 0;
        font-size: 24px;
        font-weight: 600;
      }
      h2 {
        font-size: 18px;
        font-weight: 500;
        margin: 0 0 16px 0;
        color: var(--text-light);
      }
      .danger-btn {
        background: var(--danger);
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .button-group {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      .primary-btn {
        background: var(--primary);
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .import-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .import-info {
        font-size: 12px;
        color: var(--text-light);
      }
      .theme-selector select {
        padding: 8px 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--card);
        color: var(--text);
        font-family: inherit;
        font-size: 14px;
        width: 200px;
      }

      .theme-selector select:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }
    `,
  ],
})
export class SettingsComponent implements OnInit {
  currentTheme: Theme = 'auto';
  showDialog = false;
  showImportDialog = false;
  importCount = 0;
  private contactsToImport: Contact[] = [];

  constructor(
    private storage: StorageService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.themeService.getCurrentTheme().subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  onThemeChange(theme: Theme) {
    this.themeService.setTheme(theme);
  }

  showDeleteConfirm() {
    this.showDialog = true;
  }

  async confirmClear() {
    await this.storage.clearAllData();
    this.showDialog = false;
    window.location.reload();
  }

  cancelClear() {
    this.showDialog = false;
  }

  async exportData() {
    const contacts = await this.storage.getAllContacts();
    
    // Define CSV headers
    const headers = [
      'First Name', 'Middle Name', 'Last Name', 'Title', 'Suffix', 'Nickname', 'Given Yomi', 'Surname Yomi',
      'E-mail Address', 'E-mail 2 Address', 'E-mail 3 Address', 'Home Phone', 'Home Phone 2',
      'Business Phone', 'Business Phone 2', 'Mobile Phone', 'Car Phone', 'Other Phone', 'Primary Phone',
      'Pager', 'Business Fax', 'Home Fax', 'Other Fax', 'Company Main Phone', 'Callback', 'Radio Phone',
      'Telex', 'TTY/TDD Phone', 'IMAddress', 'Job Title', 'Department', 'Company', 'Office Location',
      'Manager\'s Name', 'Assistant\'s Name', 'Assistant\'s Phone', 'Company Yomi',
      'Business Street', 'Business Street 2', 'Business Street 3', 'Business Address PO Box',
      'Business City', 'Business State', 'Business Postal Code', 'Business Country', 'Business Country/Region',
      'Home Street', 'Home Street 2', 'Home Street 3', 'Home Address PO Box',
      'Home City', 'Home State', 'Home Postal Code', 'Home Country', 'Home Country/Region',
      'Other Street', 'Other Street 2', 'Other Street 3', 'Other Address PO Box',
      'Other City', 'Other State', 'Other Postal Code', 'Other Country', 'Other Country/Region',
      'Personal Web Page', 'Spouse', 'Schools', 'Hobby', 'Location', 'Web Page',
      'Birthday', 'Anniversary', 'Notes', 'Categories'
    ].join(',') + '\n';
  
    // Convert contacts to CSV rows
    const rows = contacts.map(contact => {
      const fields = [
        this.escapeCsvField(contact.firstName || ''),
        '', // Middle Name
        this.escapeCsvField(contact.lastName || ''),
        '', // Title
        '', // Suffix
        '', // Nickname
        '', // Given Yomi
        '', // Surname Yomi
        this.escapeCsvField(contact.emailAddress || ''),
        '', // Email 2
        '', // Email 3
        '', // Home Phone
        '', // Home Phone 2
        '', // Business Phone
        '', // Business Phone 2
        this.escapeCsvField(contact.mobilePhone || ''),
        '', // Car Phone
        '', // Other Phone
        '', // Primary Phone
        '', // Pager
        '', // Business Fax
        '', // Home Fax
        '', // Other Fax
        '', // Company Main Phone
        '', // Callback
        '', // Radio Phone
        '', // Telex
        '', // TTY/TDD Phone
        '', // IMAddress
        '', // Job Title
        '', // Department
        this.escapeCsvField(contact.company || ''),
        '', // Office Location
        '', // Manager's Name
        '', // Assistant's Name
        '', // Assistant's Phone
        '', // Company Yomi
        this.escapeCsvField(contact.businessStreet || ''),
        '', // Business Street 2
        '', // Business Street 3
        '', // Business Address PO Box
        this.escapeCsvField(contact.businessCity || ''),
        this.escapeCsvField(contact.businessState || ''),
        this.escapeCsvField(contact.businessPostalCode || ''),
        this.escapeCsvField(contact.businessCountry || ''),
        '', // Business Country/Region
        this.escapeCsvField(contact.homeStreet || ''),
        '', // Home Street 2
        '', // Home Street 3
        '', // Home Address PO Box
        this.escapeCsvField(contact.homeCity || ''),
        this.escapeCsvField(contact.homeState || ''),
        this.escapeCsvField(contact.homePostalCode || ''),
        this.escapeCsvField(contact.homeCountry || ''),
        '', // Home Country/Region
        '', // Other Street
        '', // Other Street 2
        '', // Other Street 3
        '', // Other Address PO Box
        '', // Other City
        '', // Other State
        '', // Other Postal Code
        '', // Other Country
        '', // Other Country/Region
        '', // Personal Web Page
        '', // Spouse
        '', // Schools
        '', // Hobby
        '', // Location
        '', // Web Page
        contact.birthday ? this.formatDate(contact.birthday) : '',
        '', // Anniversary
        this.escapeCsvField(contact.notes || ''),
        this.escapeCsvField(contact.categories || '')
      ];
      return fields.join(',');
    }).join('\n');
  
    const csv = headers + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  
  private escapeCsvField(field: string): string {
    if (!field) return '';
    // If the field contains commas, quotes, or newlines, wrap it in quotes and escape existing quotes
    if (field.includes('"') || field.includes(',') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const content = await file.text();
    try {
      if (file.name.endsWith('.json')) {
        this.contactsToImport = JSON.parse(content);
      } else if (file.name.endsWith('.csv')) {
        this.contactsToImport = this.storage.parseCsv(content);
      }

      if (this.contactsToImport.length > 0) {
        this.importCount = this.contactsToImport.length;
        this.showImportDialog = true;
      } else {
        alert('No valid contacts found in file');
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Error parsing file: ' + errorMessage);
    }

    // Clear the input
    (event.target as HTMLInputElement).value = '';
  }

  async confirmImport() {
    try {
      await this.storage.importContacts(this.contactsToImport);
      debugger;
      this.showImportDialog = false;
      this.contactsToImport = [];
      window.location.reload();
    } catch (error) {
        console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Error importing contacts: ' + errorMessage);
    }
  }

  cancelImport() {
    this.showImportDialog = false;
    this.contactsToImport = [];
  }
}
