import { Component, OnInit, OnDestroy, ElementRef, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { WhatsNewModalComponent, WHATS_NEW_VERSION } from '../whats-new-modal/whats-new-modal.component';
import { ThemeService } from '../../services/theme.service';
import { Subscription, Observable, filter } from 'rxjs';
import { FooterService } from '../../services/footer.service';
import { TranslationService } from '../../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-layout-footer',
  imports: [CommonModule, RouterLink, HelpModalComponent, WhatsNewModalComponent, TranslateModule],
  templateUrl: './layout-footer.component.html',
  styleUrl: './layout-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class LayoutFooterComponent implements OnInit, OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly footerService = inject(FooterService);
  private readonly elementRef = inject(ElementRef);
  private readonly translationService = inject(TranslationService);
  private readonly router = inject(Router);

  isLanguageDropdownVisible = false;
  isHelpModalVisible = false;
  isWhatsNewModalVisible = false;
  isAppDownloadRoute = false;
  
  currentTheme: 'light' | 'dark' = 'light';
  private themeSubscription!: Subscription;
  private routerSubscription!: Subscription;
  madeByVisible$: Observable<boolean> = this.footerService.madeByVisible$;

  selectedLanguage$: Observable<string> = this.translationService.currentLangName$;
  currentLang = 'es';
  private langSubscription!: Subscription;

  constructor() {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    this.langSubscription = this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });

    // Check initial route
    this.isAppDownloadRoute = this.router.url.includes('/app-download');

    // Subscribe to route changes
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAppDownloadRoute = event.urlAfterRedirects.includes('/app-download');
    });
  }

  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isLanguageDropdownVisible) {
      this.isLanguageDropdownVisible = false;
    }
  }

  ngOnInit(): void {
    // Auto-show the "What's New" modal once per version, on entry.
    if (localStorage.getItem('whatsNewSeenVersion') !== WHATS_NEW_VERSION) {
      this.isWhatsNewModalVisible = true;
    }
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  openHelpModal() {
    this.isHelpModalVisible = true;
  }

  closeHelpModal() {
    this.isHelpModalVisible = false;
  }

  openWhatsNewModal() {
    this.isWhatsNewModalVisible = true;
  }

  closeWhatsNewModal() {
    this.isWhatsNewModalVisible = false;
    localStorage.setItem('whatsNewSeenVersion', WHATS_NEW_VERSION);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleLanguageDropdown() {
    this.isLanguageDropdownVisible = !this.isLanguageDropdownVisible;
  }

  selectLanguage(language: string) {
    this.translationService.setLanguage(language);
    this.isLanguageDropdownVisible = false;
  }
} 