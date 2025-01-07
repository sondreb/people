import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="nav-brand">
          <a routerLink="/">Contacts</a>
        </div>
        <div class="nav-items">
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
  `]
})
export class NavBarComponent {}
