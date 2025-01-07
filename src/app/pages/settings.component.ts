import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';
import { Contact } from '../models/contact';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <div class="settings-card">
        <h1>Settings</h1>

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
    `,
  ],
})
export class SettingsComponent {
  showDialog = false;
  showImportDialog = false;
  importCount = 0;
  private contactsToImport: Contact[] = [];

  constructor(private storage: StorageService) {}

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
    const json = JSON.stringify(contacts, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const content = await file.text();
    try {
      if (file.name.endsWith('.json')) {
        this.contactsToImport = JSON.parse(content);
      } else if (file.name.endsWith('.csv')) {
        this.contactsToImport = this.storage.parseCsvContacts(content);
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
