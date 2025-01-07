import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="settings-card">
        <h1>Settings</h1>
        
        <div class="setting-group">
          <h2>Data Management</h2>
          <button class="danger-btn" (click)="clearData()">
            <i class="fas fa-trash"></i>
            Clear All Data
          </button>
        </div>

        <div class="setting-group">
          <h2>About</h2>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
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
  `]
})
export class SettingsComponent {
  constructor(private storage: StorageService) {}

  async clearData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      // Add method to storage service to clear data
      await this.storage.clearAllData();
      window.location.reload();
    }
  }
}
