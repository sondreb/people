import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService } from '../services/search.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  template: `
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="nav-brand">
          <a routerLink="/">
            <img src="icons/icon-72x72.png" alt="People App Icon" class="nav-icon">
            <span>People</span>
          </a>
        </div>
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search contacts..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearch($event)"
          >
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
      background: rgba(var(--card-rgb), 0.8);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
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
    .nav-brand {
      display: flex;
      align-items: center;
    }
    .nav-brand a {
      font-size: 20px;
      font-weight: 600;
      color: var(--text);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .nav-icon {
      width: 32px;
      height: 32px;
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
    .search-box {
      flex: 1;
      max-width: 400px;
      margin: 0 20px;
      position: relative;
    }
    .search-box i {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-light);
    }
    .search-box input {
      width: 100%;
      padding: 8px 12px 8px 36px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--background);
      color: var(--text);
      font-size: 14px;
    }
    .search-box input:focus {
      outline: none;
      border-color: var(--primary);
    }
  `]
})
export class NavBarComponent implements OnInit {
  searchTerm = '';
  deferredPrompt: any = null;

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

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

  onSearch(term: string) {
    // Navigate to home if not already there
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
    
    this.searchService.updateSearchTerm(term);
  }
}
