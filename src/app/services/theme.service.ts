import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: 'light' | 'dark';
  public theme$: BehaviorSubject<'light' | 'dark'>;

  constructor() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    this.theme$ = new BehaviorSubject(this.currentTheme);
    this.applyTheme(this.currentTheme);
  }

  private applyTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('theme', theme);
    this.theme$.next(this.currentTheme);
  }

  toggleTheme() {
    this.applyTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
  }
} 