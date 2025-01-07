import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';

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
      [visible]="showDialog"
      title="Clear All Data"
      message="Are you sure you want to delete all contacts? This action cannot be undone."
      (confirm)="confirmClear()"
      (cancel)="cancelClear()"
    ></app-confirm-dialog>
  `,
  styles: [`
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
  `]
})
export class SettingsComponent {
  showDialog = false;

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
}
