import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  
  public currentLang$: BehaviorSubject<string>;
  public currentLangName$: Observable<string>;

  constructor(private translate: TranslateService) {
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