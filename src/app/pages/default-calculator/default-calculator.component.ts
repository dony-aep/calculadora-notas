import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterService } from '../../services/footer.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-default-calculator',
  imports: [RouterLink, FormsModule, CommonModule, TranslateModule],
  templateUrl: './default-calculator.component.html',
  styleUrl: './default-calculator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultCalculatorComponent implements OnInit, OnDestroy {
  private readonly footerService = inject(FooterService);
  private readonly translate = inject(TranslateService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Propiedades para las notas de entrada
  notaFormativa1: number | null = null;
  notaCognitiva1: number | null = null;
  notaFormativa2: number | null = null;
  notaCognitiva2: number | null = null;
  notaFormativa3: number | null = null;
  notaCognitiva3: number | null = null;

  // Propiedades para los porcentajes
  readonly porcentajeFormativa1 = 15;
  readonly porcentajeCognitiva1 = 15;
  readonly porcentajeFormativa2 = 15;
  readonly porcentajeCognitiva2 = 15;
  readonly porcentajeFormativa3 = 20;
  readonly porcentajeCognitiva3 = 20;

  // Pesos (en decimal) de cada una de las 6 notas, en orden.
  private readonly pesos = [
    this.porcentajeFormativa1 / 100,
    this.porcentajeCognitiva1 / 100,
    this.porcentajeFormativa2 / 100,
    this.porcentajeCognitiva2 / 100,
    this.porcentajeFormativa3 / 100,
    this.porcentajeCognitiva3 / 100,
  ];

  // Propiedades para los resultados calculados
  definitiva1 = 0;
  definitiva2 = 0;
  definitiva3 = 0;
  definitivaTotal = 0;

  // Nota mínima para aprobar la asignatura
  readonly notaAprobatoria = 3.0;

  // Propiedades para la predicción de notas
  prediccionEstado: 'none' | 'guaranteed' | 'possible' | 'impossible' | 'complete' = 'none';
  notaMinimaRequerida = 0;
  camposVacios = 0;
  notaSeguridad: number | null = null;
  numeroNotaSeguridad = 0;

  // Propiedades para los mensajes de feedback
  mensajeAprobacion = '';
  mensajeColor = '';
  showResetFeedback = false;

  ngOnInit(): void {
    this.footerService.madeByVisible$.next(false);
  }

  ngOnDestroy(): void {
    this.footerService.madeByVisible$.next(true);
  }

  get hasInputs(): boolean {
    return this.notaFormativa1 !== null || this.notaCognitiva1 !== null ||
           this.notaFormativa2 !== null || this.notaCognitiva2 !== null ||
           this.notaFormativa3 !== null || this.notaCognitiva3 !== null;
  }

  get mostrarSugerencias(): boolean {
    return this.prediccionEstado === 'possible';
  }

  onNotaChange(value: string, fieldName: 'notaFormativa1' | 'notaCognitiva1' | 'notaFormativa2' | 'notaCognitiva2' | 'notaFormativa3' | 'notaCognitiva3') {
    const numValue = (value === '' || value === null) ? null : parseFloat(value);

    if (numValue !== null && (numValue < 0 || numValue > 5)) {
      this.translate.get('DEFAULT_CALCULATOR.INVALID_GRADE_ALERT').subscribe((res: string) => {
        alert(res);
      });
      this[fieldName] = null;
    } else {
      this[fieldName] = numValue;
    }
    
    this.calcularNotas();
  }

  calcularNotas(): void {
    const getGrade = (val: number | null) => val ?? 0;

    const nf1 = getGrade(this.notaFormativa1);
    const nc1 = getGrade(this.notaCognitiva1);
    const nf2 = getGrade(this.notaFormativa2);
    const nc2 = getGrade(this.notaCognitiva2);
    const nf3 = getGrade(this.notaFormativa3);
    const nc3 = getGrade(this.notaCognitiva3);

    this.definitiva1 = parseFloat(((nf1 * (this.porcentajeFormativa1 / 100)) + (nc1 * (this.porcentajeCognitiva1 / 100))).toFixed(2));
    this.definitiva2 = parseFloat(((nf2 * (this.porcentajeFormativa2 / 100)) + (nc2 * (this.porcentajeCognitiva2 / 100))).toFixed(2));
    this.definitiva3 = parseFloat(((nf3 * (this.porcentajeFormativa3 / 100)) + (nc3 * (this.porcentajeCognitiva3 / 100))).toFixed(2));

    this.definitivaTotal = this.definitiva1 + this.definitiva2 + this.definitiva3;

    this.actualizarMensajeAprobacion();
    this.calcularPrediccion();
  }

  calcularPrediccion(): void {
    this.camposVacios = this.notasArray.filter(nota => nota === null).length;
    this.notaSeguridad = null;
    this.numeroNotaSeguridad = 0;

    // Sin notas ingresadas: no se predice nada.
    if (!this.hasInputs) {
      this.prediccionEstado = 'none';
      this.notaMinimaRequerida = 0;
      return;
    }

    // Todos los campos llenos: ya hay resultado definitivo.
    if (this.camposVacios === 0) {
      this.prediccionEstado = 'complete';
      this.notaMinimaRequerida = 0;
      return;
    }

    // La aprobación ya está asegurada aunque saque 0.0 en las notas restantes.
    if (this.aprueba(this.calcularTotalConRelleno(0))) {
      this.prediccionEstado = 'guaranteed';
      this.notaMinimaRequerida = 0;
      return;
    }

    // Ni con 5.0 en las notas restantes se alcanza la nota aprobatoria.
    if (!this.aprueba(this.calcularTotalConRelleno(5))) {
      this.prediccionEstado = 'impossible';
      this.notaMinimaRequerida = 0;
      return;
    }

    // Se busca la nota mínima (en pasos de 0.1) que garantiza la aprobación,
    // reutilizando el mismo redondeo por corte que usa la calculadora.
    for (let paso = 1; paso <= 50; paso++) {
      const nota = paso / 10;
      if (this.aprueba(this.calcularTotalConRelleno(nota))) {
        this.prediccionEstado = 'possible';
        this.notaMinimaRequerida = nota;
        this.calcularNotaSeguridad();
        return;
      }
    }
  }

  // Nota mínima en el SIGUIENTE campo vacío que asegura aprobar por sí sola,
  // asumiendo 0.0 en los demás campos vacíos. Solo aporta valor con 2+ vacíos.
  private calcularNotaSeguridad(): void {
    if (this.camposVacios < 2) {
      return;
    }

    const notas = this.notasArray;
    const indiceSiguiente = notas.findIndex(nota => nota === null);
    const base = notas.map(nota => nota ?? 0);

    for (let paso = 1; paso <= 50; paso++) {
      const nota = paso / 10;
      const valores = [...base];
      valores[indiceSiguiente] = nota;
      if (this.aprueba(this.totalDesdeValores(valores))) {
        this.notaSeguridad = nota;
        this.numeroNotaSeguridad = indiceSiguiente + 1;
        return;
      }
    }
  }

  private get notasArray(): (number | null)[] {
    return [
      this.notaFormativa1, this.notaCognitiva1,
      this.notaFormativa2, this.notaCognitiva2,
      this.notaFormativa3, this.notaCognitiva3,
    ];
  }

  private aprueba(total: number): boolean {
    return total >= this.notaAprobatoria;
  }

  private calcularTotalConRelleno(relleno: number): number {
    return this.totalDesdeValores(this.notasArray.map(nota => nota ?? relleno));
  }

  // Calcula la nota total replicando el mismo redondeo por corte de calcularNotas().
  private totalDesdeValores(valores: number[]): number {
    const d1 = parseFloat((valores[0] * this.pesos[0] + valores[1] * this.pesos[1]).toFixed(2));
    const d2 = parseFloat((valores[2] * this.pesos[2] + valores[3] * this.pesos[3]).toFixed(2));
    const d3 = parseFloat((valores[4] * this.pesos[4] + valores[5] * this.pesos[5]).toFixed(2));
    return d1 + d2 + d3;
  }

  actualizarMensajeAprobacion(): void {
    if (this.definitivaTotal === 0) {
      this.mensajeAprobacion = '';
      return;
    }

    if (this.definitivaTotal < 3.0) {
      this.mensajeAprobacion = 'DEFAULT_CALCULATOR.FAIL_MESSAGE';
      this.mensajeColor = 'var(--color-danger)';
    } else {
      this.mensajeAprobacion = 'DEFAULT_CALCULATOR.PASS_MESSAGE';
      this.mensajeColor = 'var(--color-secondary)';
    }
  }

  restablecer(): void {
    if (!this.hasInputs) return;

    this.notaFormativa1 = null;
    this.notaCognitiva1 = null;
    this.notaFormativa2 = null;
    this.notaCognitiva2 = null;
    this.notaFormativa3 = null;
    this.notaCognitiva3 = null;

    this.prediccionEstado = 'none';
    this.notaMinimaRequerida = 0;
    this.camposVacios = 0;
    this.notaSeguridad = null;
    this.numeroNotaSeguridad = 0;

    this.calcularNotas();

    this.showResetFeedback = true;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.showResetFeedback = false;
      this.cdr.markForCheck();
    }, 2000);
  }
} 