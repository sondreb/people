import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" *ngIf="visible" (click)="onCancel()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="dialog-actions">
          <button class="cancel-btn" (click)="onCancel()">Cancel</button>
          <button class="confirm-btn" (click)="onConfirm()">Confirm</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: var(--card);
      color: var(--text);
      padding: 24px;
      border-radius: 12px;
      box-shadow: var(--shadow);
      max-width: 400px;
      width: 90%;
    }

    h2 {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--text);
    }

    p {
      margin: 0 0 24px 0;
      color: var(--text-light);
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    button {
      font-family: inherit;
      font-size: 14px;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .cancel-btn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
    }

    .cancel-btn:hover {
      background: var(--border);
    }

    .confirm-btn {
      background: var(--danger);
      color: white;
    }

    .confirm-btn:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
