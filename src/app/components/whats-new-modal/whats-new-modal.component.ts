import { Component, input, output, ChangeDetectionStrategy, effect, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../services/translation.service';

/** Bump these when announcing a new release: version + date of its commit (CHANGELOG date). */
export const WHATS_NEW_VERSION = '4.6.0';
const WHATS_NEW_DATE = '2026-05-28';

@Component({
  selector: 'app-whats-new-modal',
  imports: [TranslateModule],
  templateUrl: './whats-new-modal.component.html',
  styleUrl: './whats-new-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'onBackdropClick($event)'
  }
})
export class WhatsNewModalComponent {
  isVisible = input(false);
  close = output<void>();

  private readonly lang = toSignal(inject(TranslationService).currentLang$);

  readonly version = WHATS_NEW_VERSION;
  readonly changelogUrl = 'https://github.com/dony-aep/calculadora-notas/blob/main/CHANGELOG.md';

  // i18n key suffixes for each announced item; edit this list to manage what's shown.
  readonly newFeatures = [1, 2, 3, 4];

  /** Static release date, localized to the active language. */
  readonly updatedAt = computed(() =>
    new Intl.DateTimeFormat(this.lang() ?? 'es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
      .format(new Date(WHATS_NEW_DATE))
  );

  constructor() {
    effect(() => {
      document.body.classList.toggle('modal-open', this.isVisible());
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
