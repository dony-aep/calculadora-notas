import { Component, input, output, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-modal',
  imports: [CommonModule, TranslateModule],
  templateUrl: './help-modal.component.html',
  styleUrl: './help-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'onBackdropClick($event)'
  }
})
export class HelpModalComponent {
  // Usando input() y output() en lugar de decoradores
  isVisible = input(false);
  close = output<void>();

  constructor() {
    // Efecto para manejar la clase del body cuando cambia isVisible
    effect(() => {
      if (this.isVisible()) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    });
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