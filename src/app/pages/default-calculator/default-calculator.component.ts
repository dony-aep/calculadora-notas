import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterService } from '../../services/footer.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-default-calculator',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, TranslateModule],
  templateUrl: './default-calculator.component.html',
  styleUrl: './default-calculator.component.css'
})
export class DefaultCalculatorComponent implements OnInit, OnDestroy {
  // Propiedades para las notas de entrada
  notaFormativa1: number | null = null;
  notaCognitiva1: number | null = null;
  notaFormativa2: number | null = null;
  notaCognitiva2: number | null = null;
  notaFormativa3: number | null = null;
  notaCognitiva3: number | null = null;

  // Propiedades para los resultados calculados
  definitiva1 = 0;
  definitiva2 = 0;
  definitiva3 = 0;
  definitivaTotal = 0;

  // Propiedades para los mensajes de feedback
  mensajeAprobacion = '';
  mensajeColor = '';
  showResetFeedback = false;

  constructor(
    private footerService: FooterService,
    private translate: TranslateService
  ) {}

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

    this.definitiva1 = parseFloat(((nf1 * 0.15) + (nc1 * 0.15)).toFixed(2));
    this.definitiva2 = parseFloat(((nf2 * 0.15) + (nc2 * 0.15)).toFixed(2));
    this.definitiva3 = parseFloat(((nf3 * 0.20) + (nc3 * 0.20)).toFixed(2));

    this.definitivaTotal = this.definitiva1 + this.definitiva2 + this.definitiva3;

    this.actualizarMensajeAprobacion();
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
    
    this.calcularNotas();

    this.showResetFeedback = true;
    setTimeout(() => {
      this.showResetFeedback = false;
    }, 2000);
  }
} 