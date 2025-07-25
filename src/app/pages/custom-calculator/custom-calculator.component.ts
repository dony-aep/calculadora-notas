import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterService } from '../../services/footer.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface Campo {
  nombre: string;
  porcentaje: number | null;
  nota: number | null;
}

@Component({
  selector: 'app-custom-calculator',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, TranslateModule],
  templateUrl: './custom-calculator.component.html',
  styleUrl: './custom-calculator.component.css'
})
export class CustomCalculatorComponent implements OnInit, OnDestroy {
  campos: Campo[] = [];
  notaDefinitivaTotal = 0;
  minimaAprobatoria: number | null = null;
  mensajeAprobacion = '';
  mensajeParams: object = {}; // Para los parámetros de traducción
  mensajeColor = '';
  showResetFeedback = false;
  showNotaDefinitiva = false;

  constructor(
    private footerService: FooterService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.footerService.madeByVisible$.next(false);
    this.cargarCalculadora();
  }

  ngOnDestroy(): void {
    this.footerService.madeByVisible$.next(true);
  }

  get hasInputs(): boolean {
    return this.campos.length > 0;
  }

  agregarCampo(): void {
    this.campos.push({ nombre: '', porcentaje: null, nota: null });
  }

  eliminarCampo(index: number): void {
    this.campos.splice(index, 1);
    this.calcularNotaPersonalizada();
  }

  calcularNotaPersonalizada(): void {
    let notaTotal = 0;
    let porcentajeTotal = 0;

    this.campos.forEach(campo => {
      const nota = campo.nota ?? 0;
      const porcentaje = campo.porcentaje ?? 0;

      if (nota >= 0 && porcentaje > 0) {
        notaTotal += (nota * porcentaje) / 100;
        porcentajeTotal += porcentaje;
      }
    });

    const minima = this.minimaAprobatoria ?? 3.0;

    this.notaDefinitivaTotal = 0;
    this.showNotaDefinitiva = false;
    this.mensajeAprobacion = '';
    this.mensajeParams = {};

    if (porcentajeTotal > 100) {
        this.mensajeAprobacion = 'CUSTOM_CALCULATOR.ERROR_EXCEEDS_MSG';
        this.mensajeParams = { value: porcentajeTotal.toFixed(1) };
        this.mensajeColor = 'var(--color-danger)';
    } else if (porcentajeTotal > 0 && porcentajeTotal < 100) {
        this.mensajeAprobacion = 'CUSTOM_CALCULATOR.WARN_INCOMPLETE_MSG';
        this.mensajeParams = { value: porcentajeTotal.toFixed(1) };
        this.mensajeColor = 'orange';
    } else if (porcentajeTotal === 100) {
        this.notaDefinitivaTotal = notaTotal;
        this.showNotaDefinitiva = true;
        if (this.notaDefinitivaTotal < minima) {
            this.mensajeAprobacion = 'CUSTOM_CALCULATOR.FAIL_MESSAGE';
            this.mensajeParams = {};
            this.mensajeColor = 'var(--color-danger)';
        } else {
            this.mensajeAprobacion = 'CUSTOM_CALCULATOR.PASS_MESSAGE';
            this.mensajeParams = {};
            this.mensajeColor = 'var(--color-secondary)';
        }
    } else {
        this.mensajeAprobacion = '';
        this.mensajeParams = {};
    }
  }

  guardarCalculadora(): void {
    if (this.campos.length === 0) {
      this.translate.get('CUSTOM_CALCULATOR.ADD_FIELD_ALERT').subscribe((res: string) => {
        alert(res);
      });
      return;
    }
    localStorage.setItem('calculadoraPersonalizada', JSON.stringify(this.campos));
    this.translate.get('CUSTOM_CALCULATOR.SAVE_SUCCESS_ALERT').subscribe((res: string) => {
      alert(res);
    });
  }

  cargarCalculadora(): void {
    const data = localStorage.getItem('calculadoraPersonalizada');
    if (data) {
      this.campos = JSON.parse(data);
      this.calcularNotaPersonalizada();
    }
  }

  restablecer(): void {
    if (!this.hasInputs) return;

    this.campos = [];
    this.minimaAprobatoria = null;
    this.calcularNotaPersonalizada();

    this.showResetFeedback = true;
    setTimeout(() => {
      this.showResetFeedback = false;
    }, 2000);
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }
} 