import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './help-modal.component.html',
  styleUrl: './help-modal.component.css'
})
export class HelpModalComponent {
  private _isVisible = false;

  @Input()
  set isVisible(value: boolean) {
    this._isVisible = value;
    if (value) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.onClose();
    }
  }
} 