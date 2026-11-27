import { Component, ElementRef, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { WhatsNewModalComponent, WHATS_NEW_VERSION } from '../whats-new-modal/whats-new-modal.component';
import { ThemeService } from '../../services/theme.service';
import { filter, map } from 'rxjs';
import { FooterService } from '../../services/footer.service';
import { Idioma, TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideCheck, LucideChevronDown, LucideChevronUp, LucideCircleQuestionMark, LucideLanguages, LucideMoon, LucideSparkles, LucideSun } from '@lucide/angular';
import { siAndroid } from 'simple-icons';

const esRutaDescarga = (url: string) => url.includes('/app-download');

@Component({
  selector: 'app-layout-footer',
  imports: [RouterLink, HelpModalComponent, WhatsNewModalComponent, TranslatePipe, LucideCheck, LucideChevronDown, LucideChevronUp, LucideCircleQuestionMark, LucideLanguages, LucideMoon, LucideSparkles, LucideSun],
  templateUrl: './layout-footer.component.html',
  styleUrl: './layout-footer.component.css',
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class LayoutFooterComponent {
  private readonly themeService = inject(ThemeService);
  private readonly translationService = inject(TranslationService);
  private readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);

  protected readonly isLanguageDropdownVisible = signal(false);
  protected readonly isHelpModalVisible = signal(false);
  // El modal de novedades se abre solo una vez por versión.
  protected readonly isWhatsNewModalVisible = signal(localStorage.getItem('whatsNewSeenVersion') !== WHATS_NEW_VERSION);
  protected readonly isAppDownloadRoute = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => esRutaDescarga(event.urlAfterRedirects))
    ),
    { initialValue: esRutaDescarga(this.router.url) }
  );
  // Lucide no trae logos de marca; el de Android sale de Simple Icons.
  protected readonly androidIconPath = siAndroid.path;

  protected readonly currentTheme = this.themeService.theme;
  protected readonly currentLang = this.translationService.currentLang;
  protected readonly selectedLanguage = this.translationService.currentLangName;
  protected readonly madeByVisible = inject(FooterService).madeByVisible.asReadonly();

  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isLanguageDropdownVisible.set(false);
    }
  }

  protected closeWhatsNewModal(): void {
    this.isWhatsNewModalVisible.set(false);
    localStorage.setItem('whatsNewSeenVersion', WHATS_NEW_VERSION);
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected toggleLanguageDropdown(): void {
    this.isLanguageDropdownVisible.update(visible => !visible);
  }

  protected selectLanguage(language: Idioma): void {
    this.translationService.setLanguage(language);
    this.isLanguageDropdownVisible.set(false);
  }
}
