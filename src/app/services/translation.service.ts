import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly translate = inject(TranslateService);
  
  public readonly currentLang$: BehaviorSubject<string>;
  public readonly currentLangName$: Observable<string>;

  constructor() {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('es');

    const savedLang = localStorage.getItem('language') || this.translate.getBrowserLang() || 'es';
    const initialLang = this.translate.getLangs().includes(savedLang) ? savedLang : 'es';
    
    this.translate.use(initialLang);
    this.currentLang$ = new BehaviorSubject(initialLang);

    this.currentLangName$ = this.currentLang$.pipe(
      switchMap(lang => {
        const langKey = lang === 'es' ? 'LANGUAGES.SPANISH' : 'LANGUAGES.ENGLISH';
        return this.translate.stream(langKey);
      })
    );
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.currentLang$.next(lang);
  }
} 