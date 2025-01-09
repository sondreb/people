import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private theme = new BehaviorSubject<Theme>('auto');
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    this.mediaQuery.addEventListener('change', (e) => {
      if (this.theme.value === 'auto') {
        this.applyTheme('auto');
      }
    });
  }

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      const savedTheme = localStorage.getItem('theme') as Theme;
      // Apply theme immediately before any rendering
      if (savedTheme) {
        this.setTheme(savedTheme);
      } else {
        this.applyTheme('auto');
      }
      resolve();
    });
  }

  getCurrentTheme() {
    return this.theme.asObservable();
  }

  setTheme(theme: Theme) {
    localStorage.setItem('theme', theme);
    this.theme.next(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      const isDark = this.mediaQuery.matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
    
    this.theme.next(theme);
  }
}
