import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { LayoutFooterComponent } from './layout-footer.component';
import { WHATS_NEW_VERSION } from '../whats-new-modal/whats-new-modal.component';

describe('LayoutFooterComponent', () => {
  let fixture: ComponentFixture<LayoutFooterComponent>;
  let element: HTMLElement;

  async function crear(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [LayoutFooterComponent],
      providers: [provideRouter([]), provideTranslateService({ fallbackLang: 'es' })]
    }).compileComponents();
    fixture = TestBed.createComponent(LayoutFooterComponent);
    element = fixture.nativeElement;
    await fixture.whenStable();
  }

  async function clic(selector: string): Promise<void> {
    element.querySelector<HTMLElement>(selector)!.click();
    await fixture.whenStable();
  }

  const bloqueado = () => document.body.classList.contains('modal-open');

  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove('modal-open');
  });

  it('abre las novedades una vez por versión y bloquea el scroll del fondo', async () => {
    await crear();

    expect(element.querySelector('app-whats-new-modal .modal')).not.toBeNull();
    expect(bloqueado()).toBe(true);

    await clic('app-whats-new-modal .close-button');

    expect(element.querySelector('app-whats-new-modal .modal')).toBeNull();
    expect(localStorage.getItem('whatsNewSeenVersion')).toBe(WHATS_NEW_VERSION);
    expect(bloqueado()).toBe(false);
  });

  it('bloquea el scroll mientras la ayuda está abierta', async () => {
    localStorage.setItem('whatsNewSeenVersion', WHATS_NEW_VERSION);
    await crear();
    expect(bloqueado()).toBe(false);

    await clic('#ayuda-btn');
    expect(bloqueado()).toBe(true);

    await clic('app-help-modal .close-button');
    expect(bloqueado()).toBe(false);
  });
});
