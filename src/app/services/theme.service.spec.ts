import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-mode');
  });

  it('usa el tema guardado', () => {
    localStorage.setItem('theme', 'dark');
    const service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.classList).toContain('dark-mode');
  });

  it('ignora un valor guardado desconocido y sigue al sistema', () => {
    localStorage.setItem('theme', 'azul');
    const service = TestBed.inject(ThemeService);

    // El stub de matchMedia en test-setup.ts responde que el sistema no está en oscuro.
    expect(service.theme()).toBe('light');
  });

  it('alterna el tema y lo guarda', () => {
    const service = TestBed.inject(ThemeService);

    service.toggleTheme();

    expect(service.theme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList).toContain('dark-mode');
  });
});
