import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateService } from '../services/update.service';

@Component({
  selector: 'app-update-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="updateService.updateAvailable$ | async" class="update-notification">
      <span>A new version is available!</span>
      <button (click)="updateApp()">Update Now</button>
    </div>
  `,
  styles: [`
    .update-notification {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: var(--primary);
      color: white;
      padding: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      z-index: 1000;
    }

    button {
      background: white;
      color: var(--primary);
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    button:hover {
      background: var(--background);
    }
  `]
})
export class UpdateNotificationComponent {
  constructor(public updateService: UpdateService) {}

  updateApp() {
    this.updateService.updateApplication();
  }
}
