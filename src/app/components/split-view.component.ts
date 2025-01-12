import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-split-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="split-view" [class.detail-open]="showDetail">
      <div class="master-view">
        <ng-content select="[master]"></ng-content>
      </div>
      <div class="detail-view" *ngIf="showDetail">
        <ng-content select="[detail]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .split-view {
      display: flex;
      height: calc(100vh - 60px);
      width: 100%;
    }

    .master-view {
      flex: 1;
      overflow-y: auto;
      border-right: 1px solid var(--border);
    }

    .detail-view {
      flex: 1;
      overflow-y: auto;
      background: var(--background);
    }

    @media (max-width: 768px) {
      .split-view.detail-open .master-view {
        display: none;
      }

      .detail-view {
        width: 100%;
      }
    }

    @media (min-width: 769px) {
      .master-view {
        max-width: 400px;
      }

      .detail-view {
        flex: 2;
      }
    }
  `]
})
export class SplitViewComponent {
  @Input() showDetail = false;
}
