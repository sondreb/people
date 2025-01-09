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
      bottom: 0;          /* Changed from top: 0 to bottom: 0 */
      left: 0;
      right: 0;
      background: var(--primary);
      color: white;
      padding: 16px;      /* Slightly increased padding */
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      z-index: 1000;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);  /* Added top shadow */
    }

    button {
      background: white;
      color: var(--primary);
      border: none;
      padding: 8px 16px;  /* Slightly increased padding */
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;  /* Added transition */
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
