import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="nav-brand">
          <a routerLink="/">Contacts</a>
        </div>
        <div class="nav-items">
          <button *ngIf="deferredPrompt" class="install-btn" (click)="installApp()">
            <i class="fas fa-download"></i>
            Install App
          </button>
          <a routerLink="/settings" routerLinkActive="active">
            <i class="fas fa-cog"></i>
            Settings
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-bar {
      background: var(--card);
      box-shadow: var(--shadow);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-brand a {
      font-size: 20px;
      font-weight: 600;
      color: var(--text);
      text-decoration: none;
    }
    .nav-items a {
      color: var(--text-light);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .nav-items a:hover, .nav-items a.active {
      background: var(--background);
      color: var(--primary);
    }
    .install-btn {
      background: var(--success);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      margin-right: 12px;
      transition: all 0.2s;
    }
    .install-btn:hover {
      background: var(--primary);
    }
    .nav-items {
      display: flex;
      align-items: center;
    }
  `]
})
export class NavBarComponent implements OnInit {
  deferredPrompt: any = null;

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
    });
  }

  async installApp() {
    if (!this.deferredPrompt) return;

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    
    // We no longer need the prompt
    this.deferredPrompt = null;
  }
}
