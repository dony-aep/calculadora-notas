import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { DefaultCalculatorComponent } from './default-calculator.component';

// Las pruebas recorren el DOM y no los campos del componente, para que sigan
// valiendo si cambia cómo guarda el estado.
describe('DefaultCalculatorComponent', () => {
  let fixture: ComponentFixture<DefaultCalculatorComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultCalculatorComponent],
      providers: [provideRouter([]), provideTranslateService({ fallbackLang: 'es' })]
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', {
      DEFAULT_CALCULATOR: {
        PREDICTION_FIELD_HINT: 'Sugerido: {{grade}}',
        PREDICTION_SECURE: 'Seguro: {{grade}}',
        PREDICTION_NEEDED: 'Necesitas {{grade}} en {{count}}'
      }
    });
    translate.use('es');

    fixture = TestBed.createComponent(DefaultCalculatorComponent);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => vi.restoreAllMocks());

  const inputs = () => Array.from(element.querySelectorAll<HTMLInputElement>('input[type=number]'));
  const texto = (selector: string) => element.querySelector(selector)?.textContent?.trim() ?? null;
  const textos = (selector: string) =>
    Array.from(element.querySelectorAll(selector)).map(el => el.textContent?.trim());

  async function escribir(notas: (number | string | null)[]): Promise<void> {
    for (const [i, nota] of notas.entries()) {
      if (nota === null) continue;
      const input = inputs()[i];
      input.value = String(nota);
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    }
  }

  it('calcula cada corte al 15 % + 15 % y suma el total', async () => {
    await escribir([4, 3, 2, 5]);

    expect(textos('.nota-definitiva p')).toEqual(['1.05', '1.05']);
    expect(texto('.nota-definitiva-total p:last-child')).toBe('2.1');
    expect(texto('.mensaje-aprobacion')).toBe('DEFAULT_CALCULATOR.FAIL_MESSAGE');
  });

  it('predice la nota mínima de los campos vacíos y la que asegura aprobar en el siguiente', async () => {
    await escribir([4, 3, 2, 5]);

    const panel = element.querySelector('.prediccion-panel');
    expect(panel?.classList).toContain('is-possible');
    expect(texto('.prediccion-nota')).toBe('2.3');
    expect(texto('.prediccion-detalle')).toBe('Necesitas 2.3 en 2');
    expect(textos('.prediccion-hint')).toEqual(['Sugerido: 2.3', 'Sugerido: 2.3']);
    expect(textos('.prediccion-seguridad')).toEqual(['Seguro: 4.5']);
  });

  it('pondera el corte 3 al 20 % + 20 % y no promete una nota segura imposible', async () => {
    await escribir([null, null, null, null, 5, 5]);

    expect(textos('.nota-definitiva p')).toEqual(['2.00']);
    expect(texto('.nota-definitiva-total p:last-child')).toBe('2.0');
    expect(texto('.prediccion-nota')).toBe('1.7');
    expect(element.querySelector('.prediccion-seguridad')).toBeNull();
  });

  it('avisa cuando la aprobación ya está asegurada', async () => {
    await escribir([5, 5, 5, 5]);

    expect(texto('.nota-definitiva-total p:last-child')).toBe('3.0');
    expect(texto('.mensaje-aprobacion')).toBe('DEFAULT_CALCULATOR.PASS_MESSAGE');
    expect(element.querySelector('.prediccion-panel')?.classList).toContain('is-guaranteed');
  });

  it('avisa cuando ya no es posible aprobar', async () => {
    await escribir([1, 1, 1, 1]);

    expect(texto('.nota-definitiva-total p:last-child')).toBe('0.6');
    expect(element.querySelector('.prediccion-panel')?.classList).toContain('is-impossible');
  });

  it('no muestra predicción con las seis notas', async () => {
    await escribir([4, 3, 2, 5, 3, 3]);

    expect(textos('.nota-definitiva p')).toEqual(['1.05', '1.05', '1.20']);
    expect(texto('.nota-definitiva-total p:last-child')).toBe('3.3');
    expect(texto('.mensaje-aprobacion')).toBe('DEFAULT_CALCULATOR.PASS_MESSAGE');
    expect(element.querySelector('.prediccion-panel')).toBeNull();
  });

  it('rechaza una nota fuera de 0–5 con una alerta y vacía el campo', async () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await escribir([6]);

    expect(alert).toHaveBeenCalledWith('DEFAULT_CALCULATOR.INVALID_GRADE_ALERT');
    expect(inputs()[0].value).toBe('');
    expect(element.querySelector('.nota-definitiva-total')).toBeNull();
  });

  it('restablece todas las notas', async () => {
    const boton = element.querySelector<HTMLButtonElement>('#restablecer-btn')!;
    expect(boton.disabled).toBe(true);

    await escribir([4, 3]);
    expect(boton.disabled).toBe(false);

    boton.click();
    await fixture.whenStable();

    expect(inputs().map(input => input.value)).toEqual(['', '', '', '', '', '']);
    expect(element.querySelector('.nota-definitiva-total')).toBeNull();
    expect(boton.disabled).toBe(true);
  });
});
