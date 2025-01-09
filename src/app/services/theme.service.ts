import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'preferred-theme';
  private themeSubject = new BehaviorSubject<Theme>(this.getStoredTheme());

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.applyTheme(this.themeSubject.value);
    if (this.themeSubject.value === 'auto') {
      this.setupMediaQueryListener();
    }
  }

  private setupMediaQueryListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      document.documentElement.dataset['theme'] = 'auto';
    };
    
    mediaQuery.addEventListener('change', handleChange);
    handleChange(mediaQuery);
  }

  private getStoredTheme(): Theme {
    return (localStorage.getItem(this.THEME_KEY) as Theme) || 'auto';
  }

  getCurrentTheme() {
    return this.themeSubject.asObservable();
  }

  setTheme(theme: Theme) {
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme) {
    document.documentElement.dataset['theme'] = theme;
  }
}
