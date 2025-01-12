import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-split-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="split-view" [class.detail-open]="showDetail">
      <div class="master-view" [@masterState]="showDetail ? 'narrow' : 'full'">
        <ng-content select="[master]"></ng-content>
      </div>
      <div class="detail-view" *ngIf="showDetail" [@detailState]="showDetail ? 'visible' : 'hidden'">
        <div [@contentState]="contentId">
          <ng-content select="[detail]"></ng-content>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('masterState', [
      state('full', style({
        maxWidth: '100%',
        flex: '1'
      })),
      state('narrow', style({
        maxWidth: '400px',
        flex: '0 0 400px'
      })),
      transition('full <=> narrow', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ]),
    trigger('detailState', [
      state('hidden', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('hidden => visible', [
        style({ transform: 'translateX(30%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ]),
      transition('visible => hidden', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ transform: 'translateX(30%)', opacity: 0 }))
      ])
    ]),
    trigger('contentState', [
      transition('* => *', [
        style({ 
          transform: 'translateX(30px)',
          opacity: 0
        }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ 
            transform: 'translateX(0)',
            opacity: 1
          })
        )
      ])
    ])
  ],
  styles: [`
    .split-view {
      display: flex;
      height: calc(100vh - 60px);
      width: 100%;
      overflow: hidden; /* Important for animations */
    }

    .master-view {
      overflow-y: auto;
      transition: padding 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
      will-change: padding, max-width;
    }

    .detail-view {
      flex: 1;
      overflow-y: auto;
      background: var(--background);
      border-left: 1px solid var(--border);
      will-change: transform, opacity;
    }

    /* When no detail is shown, allow master view to use full width with proper padding */
    .split-view:not(.detail-open) .master-view {
      padding: 0 20px;
    }

    /* When detail is shown, adjust master view padding */
    .split-view.detail-open .master-view {
      padding: 0 10px;
    }

    @media (max-width: 768px) {
      .split-view.detail-open .master-view {
        display: none;
      }

      .detail-view {
        width: 100%;
        border-left: none;
      }

      /* Ensure proper padding on mobile */
      .split-view:not(.detail-open) .master-view {
        padding: 0 10px;
      }
    }

    @media (min-width: 769px) {
      .detail-view {
        flex: 2;
      }
    }
  `]
})
export class SplitViewComponent {
  @Input() showDetail = false;
  @Input() contentId: any = null; // This will trigger the animation when it changes
}
