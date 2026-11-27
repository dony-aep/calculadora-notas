import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormField, form, max, min } from '@angular/forms/signals';
import { FooterService } from '../../services/footer.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideArrowLeft, LucideCheck, LucideRotateCw } from '@lucide/angular';
import {
  CAMPOS, CampoNota, NOTA_APROBATORIA, NOTA_MAXIMA, NOTAS_VACIAS, NotasUa, PORCENTAJES,
  calcularCortes, calcularPrediccion, rellenar
} from './calculo-ua';

interface NotaUi {
  campo: CampoNota;
  etiqueta: string;
  placeholder: string;
  lado: 'nota-left' | 'nota-right';
}

interface CorteUi {
  clave: string;
  notas: readonly [NotaUi, NotaUi];
}

const CORTES_UI: readonly CorteUi[] = [
  {
    clave: 'DEFAULT_CALCULATOR.CUT_1',
    notas: [
      { campo: 'formativa1', etiqueta: 'DEFAULT_CALCULATOR.GRADE_1_FORMATIVE', placeholder: 'DEFAULT_CALCULATOR.ENTER_FORMATIVE', lado: 'nota-left' },
      { campo: 'cognitiva1', etiqueta: 'DEFAULT_CALCULATOR.GRADE_2_COGNITIVE', placeholder: 'DEFAULT_CALCULATOR.ENTER_COGNITIVE', lado: 'nota-right' }
    ]
  },
  {
    clave: 'DEFAULT_CALCULATOR.CUT_2',
    notas: [
      { campo: 'formativa2', etiqueta: 'DEFAULT_CALCULATOR.GRADE_3_FORMATIVE', placeholder: 'DEFAULT_CALCULATOR.ENTER_FORMATIVE', lado: 'nota-left' },
      { campo: 'cognitiva2', etiqueta: 'DEFAULT_CALCULATOR.GRADE_4_COGNITIVE', placeholder: 'DEFAULT_CALCULATOR.ENTER_COGNITIVE', lado: 'nota-right' }
    ]
  },
  {
    clave: 'DEFAULT_CALCULATOR.CUT_3',
    notas: [
      { campo: 'formativa3', etiqueta: 'DEFAULT_CALCULATOR.GRADE_5_FORMATIVE', placeholder: 'DEFAULT_CALCULATOR.ENTER_FORMATIVE', lado: 'nota-left' },
      { campo: 'cognitiva3', etiqueta: 'DEFAULT_CALCULATOR.GRADE_6_COGNITIVE', placeholder: 'DEFAULT_CALCULATOR.ENTER_COGNITIVE', lado: 'nota-right' }
    ]
  }
];

@Component({
  selector: 'app-default-calculator',
  imports: [RouterLink, FormField, TranslatePipe, LucideArrowLeft, LucideCheck, LucideRotateCw],
  templateUrl: './default-calculator.component.html',
  styleUrl: './default-calculator.component.css'
})
export class DefaultCalculatorComponent implements OnInit, OnDestroy {
  private readonly footerService = inject(FooterService);
  private readonly translate = inject(TranslateService);

  protected readonly cortes = CORTES_UI;
  protected readonly porcentajes = PORCENTAJES;

  protected readonly notas = signal<NotasUa>(NOTAS_VACIAS);
  protected readonly notasForm = form(this.notas, ruta => {
    for (const campo of CAMPOS) {
      min(ruta[campo], 0);
      max(ruta[campo], NOTA_MAXIMA);
    }
  });

  protected readonly hasInputs = computed(() => CAMPOS.some(campo => this.notas()[campo] !== null));
  protected readonly resultado = computed(() => calcularCortes(rellenar(this.notas(), 0)));
  protected readonly prediccion = computed(() => calcularPrediccion(this.notas()));
  protected readonly mensaje = computed(() => {
    const total = this.resultado().total;
    if (total === 0) {
      return { clave: '', color: '' };
    }
    return total < NOTA_APROBATORIA
      ? { clave: 'DEFAULT_CALCULATOR.FAIL_MESSAGE', color: 'var(--color-danger)' }
      : { clave: 'DEFAULT_CALCULATOR.PASS_MESSAGE', color: 'var(--color-secondary)' };
  });
  protected readonly showResetFeedback = signal(false);

  ngOnInit(): void {
    this.footerService.madeByVisible.set(false);
  }

  ngOnDestroy(): void {
    this.footerService.madeByVisible.set(true);
  }

  // FormField también escucha `input` y no se sabe cuál corre primero: vaciar
  // el elemento y el modelo deja el campo en null en cualquiera de los dos órdenes.
  protected rechazarFueraDeRango(campo: CampoNota, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value === '' || (input.valueAsNumber >= 0 && input.valueAsNumber <= NOTA_MAXIMA)) {
      return;
    }
    input.value = '';
    this.notas.update(notas => ({ ...notas, [campo]: null }));
    this.translate.get('DEFAULT_CALCULATOR.INVALID_GRADE_ALERT').subscribe((res: string) => alert(res));
  }

  protected restablecer(): void {
    if (!this.hasInputs()) return;

    this.notas.set(NOTAS_VACIAS);
    this.showResetFeedback.set(true);
    setTimeout(() => this.showResetFeedback.set(false), 2000);
  }
}
