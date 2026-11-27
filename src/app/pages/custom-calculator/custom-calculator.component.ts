import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormField, applyEach, form, max, min } from '@angular/forms/signals';
import { FooterService } from '../../services/footer.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideArrowLeft, LucideCheck, LucidePlus, LucideRotateCw, LucideSave, LucideTrash2 } from '@lucide/angular';
import { CLAVE_GUARDADO, CalculadoraPersonalizada, calcularResultado, leerCamposGuardados } from './calculo-personalizado';

@Component({
  selector: 'app-custom-calculator',
  imports: [RouterLink, FormField, TranslatePipe, LucideArrowLeft, LucideCheck, LucidePlus, LucideRotateCw, LucideSave, LucideTrash2],
  templateUrl: './custom-calculator.component.html',
  styleUrl: './custom-calculator.component.css'
})
export class CustomCalculatorComponent implements OnInit, OnDestroy {
  private readonly footerService = inject(FooterService);
  private readonly translate = inject(TranslateService);

  private readonly modelo = signal<CalculadoraPersonalizada>({
    campos: leerCamposGuardados(localStorage.getItem(CLAVE_GUARDADO)),
    minimaAprobatoria: null
  });
  protected readonly calculadoraForm = form(this.modelo, ruta => {
    applyEach(ruta.campos, campo => min(campo.nota, 0));
    min(ruta.minimaAprobatoria, 0);
    max(ruta.minimaAprobatoria, 5);
  });

  protected readonly cantidadCampos = computed(() => this.modelo().campos.length);
  protected readonly resultado = computed(() => calcularResultado(this.modelo()));
  protected readonly showResetFeedback = signal(false);

  ngOnInit(): void {
    this.footerService.madeByVisible.set(false);
  }

  ngOnDestroy(): void {
    this.footerService.madeByVisible.set(true);
  }

  protected agregarCampo(): void {
    this.modelo.update(modelo => ({
      ...modelo,
      campos: [...modelo.campos, { nombre: '', porcentaje: null, nota: null }]
    }));
  }

  protected eliminarCampo(indice: number): void {
    this.modelo.update(modelo => ({
      ...modelo,
      campos: modelo.campos.filter((_, i) => i !== indice)
    }));
  }

  protected guardarCalculadora(): void {
    const campos = this.modelo().campos;
    if (campos.length === 0) {
      this.alertar('CUSTOM_CALCULATOR.ADD_FIELD_ALERT');
      return;
    }
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(campos));
    this.alertar('CUSTOM_CALCULATOR.SAVE_SUCCESS_ALERT');
  }

  protected restablecer(): void {
    if (this.cantidadCampos() === 0) return;

    this.modelo.set({ campos: [], minimaAprobatoria: null });
    this.showResetFeedback.set(true);
    setTimeout(() => this.showResetFeedback.set(false), 2000);
  }

  private alertar(clave: string): void {
    this.translate.get(clave).subscribe((res: string) => alert(res));
  }
}
