# CalNotas — Calculadora de Notas (Angular)

PWA-less SPA en Angular 21 (standalone) para calcular notas académicas de la Universidad
Americana (Colombia). Desplegada en Vercel: https://calnotas.vercel.app/

Sistema de evaluación UA 2025 (lógica de negocio central, no deducible del código sin leerlo):
Cortes 1 y 2 = 15% formativa + 15% cognitiva; Corte 3 = 20% + 20%. Notas en rango **0–5**,
nota aprobatoria **3.0**.

## Comandos

```bash
npm start                                          # dev server → http://localhost:4200
npm run build                                      # build de producción → dist/
npm test                                           # tests en modo watch (interactivo)
npx ng test --watch=false --browsers=ChromeHeadless # tests en CI / verificación no interactiva
npm audit                                          # debe reportar 0 vulnerabilidades
```

Usa siempre la variante `--watch=false --browsers=ChromeHeadless` al verificar cambios: `npm test`
a secas se queda colgado esperando.

## Convenciones de código

Estas reglas se cumplen hoy en el 100% del código; mantenlas al agregar archivos nuevos.

- **`ChangeDetectionStrategy.OnPush` en todos los componentes**, sin excepción (8/8 actualmente).
- **`inject()`**, nunca inyección por constructor.
- **`input()` / `output()`**, nunca `@Input()` / `@Output()`.
- **No escribas `standalone: true`**: es implícito en Angular 19+.
- **Control flow nativo** en templates: `@if`, `@for` (con `track`), `@switch`. Nunca `*ngIf` / `*ngFor`.
- **`styleUrl`** (singular), no `styleUrls`.
- **Objeto `host`** en el decorador, no `@HostBinding` / `@HostListener`.
- **Estado reactivo en servicios**: `BehaviorSubject` público `readonly` con sufijo `$` +
  `providedIn: 'root'`. En componentes, `toSignal()` para consumirlo.
- **Nombres de negocio en español** (`notaFormativa`, `calcularNotas`); el resto de la API de
  Angular en inglés.
- Indentación de 2 espacios y comillas simples en `.ts` (ver `.editorconfig`).

Para dudas de Angular moderno más allá de esta lista, invoca la skill `angular-best-practices`.
Para trabajo visual, la skill `frontend-design`. Para commits, la skill `git-commit`.

## i18n (ngx-translate)

- Traducciones en `src/assets/i18n/es.json` y `en.json`. Claves jerárquicas `SECCION.CLAVE`
  (ej. `DEFAULT_CALCULATOR.TITLE`).
- **Todo texto nuevo va en AMBOS archivos**, en la misma posición. Un texto solo en `es.json`
  aparece como clave cruda en inglés.
- Idioma por defecto: `es`. En templates: `{{ 'CLAVE' | translate }}`; el componente debe
  importar `TranslateModule`.

## Temas y estilos

- Variables CSS en `src/assets/styles/variables.css`; el tema oscuro es la clase `.dark-mode`
  en `<html>`.
- **Usa siempre `var(--color-*)`**, nunca colores hardcodeados. Nunca `!important`.

## Estado persistido en localStorage

| Clave | Contenido |
|---|---|
| `theme` | `'light'` \| `'dark'` |
| `language` | `'es'` \| `'en'` |
| `customCalculator` | configuración de la calculadora personalizada |
| `whatsNewSeenVersion` | última versión de novedades vista; si no coincide con `WHATS_NEW_VERSION`, `layout-footer` abre el modal solo |

## Ritual de release

La versión del proyecto vive en `CHANGELOG.md`, **no en `package.json`** (ahí sigue en `0.0.0`
a propósito — no lo "arregles"). El changelog sigue Keep a Changelog + SemVer.

Al anunciar una versión nueva hay que tocar tres cosas o el modal de novedades queda inconsistente:

1. `CHANGELOG.md`: nueva sección `## [X.Y.Z] - YYYY-MM-DD`.
2. `whats-new-modal.component.ts`: `WHATS_NEW_VERSION` y `WHATS_NEW_DATE` (misma fecha que el
   changelog) y la lista `newFeatures` con los ítems a mostrar.
3. `es.json` / `en.json`: claves `WHATS_NEW.NEW_<n>_TITLE` y `WHATS_NEW.NEW_<n>_DESC` para cada
   número de esa lista.

## Trampas conocidas

- **No hay PWA ni service worker.** Se eliminaron en v4.5.6. No existen `ngsw-config.json` ni
  `manifest.webmanifest`, y `app.config.ts` no registra `provideServiceWorker`. No los añadas
  "de vuelta" sin que se pida.
- **`.github/copilot-instructions.md` cubre el mismo terreno para Copilot** y está sincronizado
  con este archivo. Si cambias una convención aquí, actualízalo allí también; si en algún momento
  se contradicen, este archivo manda.
- **Vulnerabilidades transitivas se arreglan con `overrides` en `package.json`**, siguiendo el
  patrón ya presente. Nunca uses `npm audit fix --force`: propone degradar `@angular/cli`.
- La validación de notas inválidas usa `alert()` con texto traducido (`src/app/pages/*`). Es
  intencional; no lo cambies por un toast sin pedirlo.
- Solo existe un archivo de test: `src/app/app.component.spec.ts` (3 especificaciones). No
  asumas cobertura de la lógica de cálculo.

## Antes de dar algo por terminado

1. `npm run build` → sin errores.
2. `npx ng test --watch=false --browsers=ChromeHeadless` → todo en verde.
3. Si tocaste UI: verifica cambio de tema y cambio de idioma (la UI completa debe traducirse).
4. Si tocaste cálculos: comprueba a mano un caso con los porcentajes UA 2025.
