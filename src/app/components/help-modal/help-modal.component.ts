import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { bloquearScrollMientras } from '../bloquear-scroll';
import { LucideCalculator, LucideInfo, LucideSlidersHorizontal, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-help-modal',
  imports: [TranslatePipe, LucideCalculator, LucideInfo, LucideSlidersHorizontal, LucideX],
  templateUrl: './help-modal.component.html',
  styleUrl: './help-modal.component.css',
  host: {
    '(click)': 'onBackdropClick($event)'
  }
})
export class HelpModalComponent {
  // Usando input() y output() en lugar de decoradores
  isVisible = input(false);
  close = output<void>();

  constructor() {
    bloquearScrollMientras(this.isVisible);
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.onClose();
    }
  }
} 