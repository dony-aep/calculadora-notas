import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { ThemeService } from '../../services/theme.service';
import { Subscription, Observable } from 'rxjs';
import { FooterService } from '../../services/footer.service';
import { TranslationService } from '../../services/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-layout-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, HelpModalComponent, TranslateModule],
  templateUrl: './layout-footer.component.html',
  styleUrl: './layout-footer.component.css'
})
export class LayoutFooterComponent implements OnInit, OnDestroy {
  isLanguageDropdownVisible = false;
  isHelpModalVisible = false;
  
  currentTheme: 'light' | 'dark' = 'light';
  private themeSubscription: Subscription;
  madeByVisible$: Observable<boolean>;

  selectedLanguage$: Observable<string>;
  currentLang = 'es';
  private langSubscription: Subscription;

  constructor(
    private themeService: ThemeService,
    private footerService: FooterService,
    private elementRef: ElementRef,
    private translationService: TranslationService
  ) {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
    this.madeByVisible$ = this.footerService.madeByVisible$;

    this.selectedLanguage$ = this.translationService.currentLangName$;
    this.langSubscription = this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isLanguageDropdownVisible) {
      this.isLanguageDropdownVisible = false;
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  openHelpModal() {
    this.isHelpModalVisible = true;
  }

  closeHelpModal() {
    this.isHelpModalVisible = false;
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