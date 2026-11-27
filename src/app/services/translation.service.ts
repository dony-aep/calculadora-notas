import { Service, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs';

export type Idioma = 'es' | 'en';

const IDIOMAS: readonly Idioma[] = ['es', 'en'];
const esIdioma = (valor: unknown): valor is Idioma => IDIOMAS.includes(valor as Idioma);

@Service()
export class TranslationService {
  private readonly translate = inject(TranslateService);

  private readonly idioma = signal<Idioma>(this.idiomaInicial());
  readonly currentLang = this.idioma.asReadonly();
  // translate.stream vuelve a emitir cuando llega el JSON del idioma; un
  // computed con instant() mostraría la clave cruda mientras carga.
  readonly currentLangName = toSignal(
    toObservable(this.idioma).pipe(
      switchMap(lang => this.translate.stream(lang === 'es' ? 'LANGUAGES.SPANISH' : 'LANGUAGES.ENGLISH'))
    ),
    { initialValue: '' }
  );

  constructor() {
    this.translate.addLangs([...IDIOMAS]);
    this.translate.setFallbackLang('es');
    this.aplicar(this.idioma());
  }

  setLanguage(lang: Idioma): void {
    this.idioma.set(lang);
    this.aplicar(lang);
    localStorage.setItem('language', lang);
  }

  private idiomaInicial(): Idioma {
    const guardado = localStorage.getItem('language');
    if (esIdioma(guardado)) {
      return guardado;
    }
    const navegador = this.translate.getBrowserLang();
    return esIdioma(navegador) ? navegador : 'es';
  }

  private aplicar(lang: Idioma): void {
    this.translate.use(lang);
    document.documentElement.lang = lang;
  }
}
