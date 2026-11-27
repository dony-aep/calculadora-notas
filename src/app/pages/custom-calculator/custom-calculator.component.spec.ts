import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { CustomCalculatorComponent } from './custom-calculator.component';

const CLAVE_GUARDADO = 'calculadoraPersonalizada';

describe('CustomCalculatorComponent', () => {
  let fixture: ComponentFixture<CustomCalculatorComponent>;
  let element: HTMLElement;

  async function crear(): Promise<void> {
    fixture = TestBed.createComponent(CustomCalculatorComponent);
    element = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CustomCalculatorComponent],
      providers: [provideRouter([]), provideTranslateService({ fallbackLang: 'es' })]
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', {
      CUSTOM_CALCULATOR: {
        WARN_INCOMPLETE_MSG: 'Incompleto: {{value}}',
        ERROR_EXCEEDS_MSG: 'Excede: {{value}}'
      }
    });
    translate.use('es');
  });

  afterEach(() => vi.restoreAllMocks());

  const input = (id: string) => element.querySelector<HTMLInputElement>(`#${id}`)!;
  const texto = (selector: string) => element.querySelector(selector)?.textContent?.trim() ?? null;
  const total = () => texto('#nota-definitiva-total-personalizada');
  const mensaje = () => texto('#mensaje-aprobacion-personalizada');

  async function clic(selector: string): Promise<void> {
    element.querySelector<HTMLButtonElement>(selector)!.click();
    await fixture.whenStable();
  }

  async function escribir(id: string, valor: string | number): Promise<void> {
    const campo = input(id);
    campo.value = String(valor);
    campo.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  async function agregarCampo(porcentaje: number, nota: number): Promise<void> {
    const indice = element.querySelectorAll('.campo-personalizado').length;
    await clic('#agregar-campo-btn');
    await escribir(`porcentaje-${indice}`, porcentaje);
    await escribir(`nota-${indice}`, nota);
  }

  it('calcula la nota ponderada cuando los porcentajes suman 100', async () => {
    await crear();
    await agregarCampo(50, 4);
    await agregarCampo(50, 2);

    expect(total()).toBe('3.00');
    expect(mensaje()).toBe('CUSTOM_CALCULATOR.PASS_MESSAGE');
    expect(texto('.field-count-badge')).toBe('2');
  });

  it('avisa si los porcentajes no llegan a 100', async () => {
    await crear();
    await agregarCampo(40, 4);

    expect(total()).toBeNull();
    expect(mensaje()).toBe('Incompleto: 40.0');
  });

  it('marca error si los porcentajes pasan de 100', async () => {
    await crear();
    await agregarCampo(60, 4);
    await agregarCampo(50, 4);

    expect(total()).toBeNull();
    expect(mensaje()).toBe('Excede: 110.0');
  });

  it('usa la nota mínima configurada en lugar de 3.0', async () => {
    await crear();
    await agregarCampo(50, 4);
    await agregarCampo(50, 2);
    await escribir('minima-aprobatoria-input', 3.5);

    expect(total()).toBe('3.00');
    expect(mensaje()).toBe('CUSTOM_CALCULATOR.FAIL_MESSAGE');
  });

  it('recalcula al eliminar un campo', async () => {
    await crear();
    await agregarCampo(50, 4);
    await agregarCampo(50, 2);

    element.querySelectorAll<HTMLButtonElement>('.eliminar-campo-btn')[1].click();
    await fixture.whenStable();

    expect(element.querySelectorAll('.campo-personalizado').length).toBe(1);
    expect(mensaje()).toBe('Incompleto: 50.0');
  });

  it('guarda los campos en localStorage', async () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    await crear();
    await clic('#agregar-campo-btn');
    await escribir('nombre-0', 'Parcial');
    await escribir('porcentaje-0', 100);
    await escribir('nota-0', 4.5);

    await clic('#guardar-calculadora-btn');

    expect(JSON.parse(localStorage.getItem(CLAVE_GUARDADO)!)).toEqual([
      { nombre: 'Parcial', porcentaje: 100, nota: 4.5 }
    ]);
    expect(alert).toHaveBeenCalledWith('CUSTOM_CALCULATOR.SAVE_SUCCESS_ALERT');
  });

  it('no guarda una calculadora sin campos', async () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    await crear();

    await clic('#guardar-calculadora-btn');

    expect(localStorage.getItem(CLAVE_GUARDADO)).toBeNull();
    expect(alert).toHaveBeenCalledWith('CUSTOM_CALCULATOR.ADD_FIELD_ALERT');
  });

  it('carga la calculadora guardada', async () => {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify([
      { nombre: 'Taller', porcentaje: 30, nota: 5 },
      { nombre: 'Final', porcentaje: 70, nota: 3 }
    ]));
    await crear();

    expect(input('nombre-1').value).toBe('Final');
    expect(input('porcentaje-0').value).toBe('30');
    expect(total()).toBe('3.60');
  });

  it('ignora un guardado que no es JSON', async () => {
    localStorage.setItem(CLAVE_GUARDADO, '{roto');
    await crear();

    expect(element.querySelectorAll('.campo-personalizado').length).toBe(0);
  });

  it('descarta las entradas guardadas que no tienen la forma de un campo', async () => {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify([
      { nombre: 'Final', porcentaje: 100, nota: 4 },
      { nombre: 'Sin nota', porcentaje: '50' },
      'texto',
      null
    ]));
    await crear();

    expect(element.querySelectorAll('.campo-personalizado').length).toBe(1);
    expect(total()).toBe('4.00');
  });

  it('restablece campos y nota mínima', async () => {
    await crear();
    await agregarCampo(100, 4);
    await escribir('minima-aprobatoria-input', 4.5);

    await clic('#restablecer-personalizada-btn');

    expect(element.querySelectorAll('.campo-personalizado').length).toBe(0);
    expect(input('minima-aprobatoria-input').value).toBe('');
    expect(mensaje()).toBe('');
  });
});
