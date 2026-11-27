import { Service, signal } from '@angular/core';

export type Tema = 'light' | 'dark';

const esTema = (valor: unknown): valor is Tema => valor === 'light' || valor === 'dark';

@Service()
export class ThemeService {
  private readonly tema = signal<Tema>(this.temaInicial());
  readonly theme = this.tema.asReadonly();

  constructor() {
    this.applyTheme(this.tema());
  }

  toggleTheme(): void {
    this.applyTheme(this.tema() === 'dark' ? 'light' : 'dark');
  }

  private temaInicial(): Tema {
    const guardado = localStorage.getItem('theme');
    if (esTema(guardado)) {
      return guardado;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Tema): void {
    this.tema.set(theme);
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');
    // La barra del navegador móvil toma el fondo del tema activo, no el del sistema.
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
    if (bg) {
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
    }
    localStorage.setItem('theme', theme);
  }
}
