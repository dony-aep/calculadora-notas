# CalNotas — Calculadora de Notas (Angular)

PWA-less SPA en Angular 22 (standalone) para calcular notas académicas de la Universidad
Americana (Colombia). Desplegada en Vercel: https://calnotas.vercel.app/

Sistema de evaluación UA 2025 (lógica de negocio central, no deducible del código sin leerlo):
Cortes 1 y 2 = 15% formativa + 15% cognitiva; Corte 3 = 20% + 20%. Notas en rango **0–5**,
nota aprobatoria **3.0**.

## Comandos

```bash
npm start                                          # dev server → http://localhost:4200
npm run build                                      # build de producción → dist/
npm test                                           # tests en modo watch (interactivo)
npx ng test --watch=false                          # tests en CI / verificación no interactiva
npm audit                                          # debe reportar 0 vulnerabilidades
```

Usa siempre la variante `--watch=false` al verificar cambios: `npm test` a secas se queda colgado
esperando. Los tests corren con **Vitest** sobre jsdom (`@angular/build:unit-test`); la bandera
`--browsers` de Karma ya no existe.

## Convenciones de código

Siguen las reglas de Angular 22. Las de esta lista se cumplen en todo el código; mantenlas al
agregar archivos nuevos.

- **No escribas `changeDetection`**: `OnPush` es el default en v22. Un componente que necesite el
  comportamiento anterior usa `ChangeDetectionStrategy.Eager` (`Default` está deprecado).
- **No escribas `standalone: true`**: es implícito desde Angular 19.
- **`@Service()`** para servicios singleton, no `@Injectable({ providedIn: 'root' })`. `@Service`
  no admite parámetros de constructor; queda `@Injectable` solo para un scope distinto de root o un
  proveedor `useClass`/`useValue`/`useExisting`.
- **`inject()`**, nunca inyección por constructor.
- **`input()` / `output()`**, nunca `@Input()` / `@Output()`.
- **Control flow nativo** en templates: `@if`, `@for` (con `track`), `@switch`. Nunca `*ngIf` / `*ngFor`.
- **Sin `CommonModule`**: importa solo lo que usa la plantilla (`AsyncPipe` en `layout-footer`).
  Tampoco `ngClass` / `ngStyle`: usa bindings `[class.x]` y `[style.x]`.
- **Rutas con `loadComponent`**: toda página nueva se carga diferida. Solo `HomeComponent`, la
  página de llegada, va en el bundle inicial.
- **Imágenes estáticas con `NgOptimizedImage`**: `ngSrc` con `width` y `height`, y `priority` en la
  imagen principal de la página.
- **`styleUrl`** (singular), no `styleUrls`.
- **Objeto `host`** en el decorador, no `@HostBinding` / `@HostListener`.
- **Nombres de negocio en español** (`notaFormativa`, `calcularNotas`); el resto de la API de
  Angular en inglés.
- Indentación de 2 espacios y comillas simples en `.ts` (ver `.editorconfig`).

Dos partes siguen con el patrón anterior a v22, y lo nuevo no debe copiarlas:

- **Estado de los servicios**: hoy es un `BehaviorSubject` público `readonly` con sufijo `$`, que
  los componentes consumen con `toSignal()` o el pipe `async`. El estado nuevo va en signals
  (`signal()`, `computed()`), y los componentes no deben llevar campos sueltos con `markForCheck()`.
- **Formularios**: las dos calculadoras usan `ngModel`. Un formulario nuevo va con Signal Forms
  (`@angular/forms/signals`).

Para dudas de Angular moderno más allá de esta lista, invoca la skill `angular-best-practices`.
Para trabajo visual, la skill `frontend-design`. Para commits, la skill `git-commit`.

## i18n (ngx-translate)

- Traducciones en `src/assets/i18n/es.json` y `en.json`. Claves jerárquicas `SECCION.CLAVE`
  (ej. `DEFAULT_CALCULATOR.TITLE`).
- **Todo texto nuevo va en AMBOS archivos**, en la misma posición. Un texto solo en `es.json`
  aparece como clave cruda en inglés.
- Idioma por defecto: `es`. En templates: `{{ 'CLAVE' | translate }}`; el componente debe
  importar `TranslatePipe` (`TranslateModule` ya no existe en ngx-translate 18).

## Temas y estilos

- Variables CSS en `src/assets/styles/variables.css`; el tema oscuro es la clase `.dark-mode`
  en `<html>`.
- **Usa siempre `var(--color-*)`**, nunca colores hardcodeados. Nunca `!important`.
- **Iconos con `@lucide/angular`**: `<svg lucideNombre class="...">` e importa `LucideNombre` en el
  componente. El tamaño sale del `font-size` del propio icono (24px por defecto, regla `svg.lucide`
  en `styles.css`) y el trazo global de `provideLucideConfig` en `app.config.ts`. Lucide no trae
  logos de marca: tómalos de `simple-icons` en un `<svg class="brand-icon">` (ver el de Android en
  `layout-footer`). Material Symbols ya no se carga.

## Estado persistido en localStorage

| Clave | Contenido |
|---|---|
| `theme` | `'light'` \| `'dark'` |
| `language` | `'es'` \| `'en'` |
| `calculadoraPersonalizada` | configuración de la calculadora personalizada |
| `whatsNewSeenVersion` | última versión de novedades vista; si no coincide con `WHATS_NEW_VERSION`, `layout-footer` abre el modal solo |

## Ritual de release

La versión canónica del proyecto vive en `CHANGELOG.md` (Keep a Changelog + SemVer), y
`package.json` debe reflejar esa misma versión. Si difieren, manda el changelog.

Al anunciar una versión nueva hay que tocar cuatro cosas o el modal de novedades queda inconsistente:

1. `CHANGELOG.md`: nueva sección `## [X.Y.Z] - YYYY-MM-DD`.
2. `whats-new-modal.component.ts`: `WHATS_NEW_VERSION` y `WHATS_NEW_DATE` (misma fecha que el
   changelog) y la lista `newFeatures` con los ítems a mostrar.
3. `es.json` / `en.json`: claves `WHATS_NEW.NEW_<n>_TITLE` y `WHATS_NEW.NEW_<n>_DESC` para cada
   número de esa lista.
4. `package.json`: campo `version` con la misma `X.Y.Z` del changelog.

## Iconos de marca e imagen para compartir

`public/favicon.svg` es el logo de barras y cambia de color con el tema del sistema. Safari no usa
favicons SVG y toma `public/favicon.ico`, que por eso lleva fondo blanco. iOS usa
`public/apple-touch-icon.png` (180×180, con fondo propio porque rellena de negro la transparencia).
El `.ico` y el icono de iOS salen de `python design/generar-iconos.py`: si cambias el logo, cámbialo
en el SVG y en ese script.

Los metadatos de `src/index.html` son estáticos y en español: los crawlers no ejecutan JavaScript,
así que ngx-translate no los alcanza. `og:image` es `public/og-image.png` (1200×630), generado desde
`design/og-image.html`. Si cambias el nombre, el lema o el logo, edita el HTML y regenera el PNG
desde la raíz del repo en Git Bash (`pwd -W` da la ruta `D:/...` que Chrome necesita; `$PWD` falla):

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=8000 --screenshot="$(pwd -W)/public/og-image.png" "file:///$(pwd -W)/design/og-image.html"
```

WhatsApp guarda en caché la vista previa de cada enlace: un cambio no se ve en los chats donde ya
se compartió.

## Trampas conocidas

- **No hay PWA ni service worker.** Se eliminaron en v4.5.6. No existen `ngsw-config.json` ni
  `manifest.webmanifest`, y `app.config.ts` no registra `provideServiceWorker`. No los añadas
  "de vuelta" sin que se pida.
- **Actualiza Angular con `npx ng update @angular/core @angular/cli`**, no con `npm install`
  paquete por paquete: los paquetes de Angular se piden entre sí la versión exacta como peer, y npm
  falla con `ERESOLVE` contra el lock.
- **`package.json` no tiene `overrides`.** El último (`vite`) se quitó al subir a 22.3.0, que ya
  fija una vite parchada. Si aparece una vulnerabilidad transitiva, comprueba primero si una versión
  nueva del CLI ya declara la versión parchada; un override olvidado frena parches, como pasó con
  `vite: ">=7.3.5 <8"` antes de v22. Nunca uses `npm audit fix --force`: propone degradar
  `@angular/build`.
- **`tsconfig.json` sigue la plantilla de `ng new` 22.3**: `"files": []` con `references` a
  `tsconfig.app.json` y `tsconfig.spec.json`, para que el editor compile cada archivo con su propio
  programa (sin eso marca `TS2593` en `describe` dentro de los specs). `experimentalDecorators: true`
  también viene de la plantilla; la versión 4.4.0 la quitó creyendo que Angular 21 usaba
  decoradores TC39, pero la plantilla de angular-cli nunca la ha retirado y el bundle sale idéntico
  con o sin ella. TypeScript queda en 6.0 hasta que `@angular/compiler-cli` acepte 7.x (hoy pide
  `>=6.0 <6.1`).
- **No hay `zone.js`.** Angular corre zoneless por defecto desde v21 (`bootstrapApplication`
  inyecta el proveedor solo), así que el polyfill se eliminó en la migración a v22. No añadas
  `provideZonelessChangeDetection()`: es el default y no haría nada. Lo que sí importa es que todo
  cambio de estado llegue por una vía que notifique al scheduler: escritura de signal,
  `markForCheck()`, pipe `async`/`translate`, listener de template o `host`, o navegación del router.
- **`engines.node` está fijado a `24.x`.** El CLI de v22 exige Node >= 22.22.3 y `"22.x"` resuelve
  en Vercel a un parche anterior, lo que rompe el build.
- La validación de notas inválidas usa `alert()` con texto traducido (`src/app/pages/*`). Es
  intencional; no lo cambies por un toast sin pedirlo.
- Solo existe un archivo de test: `src/app/app.component.spec.ts` (3 especificaciones). No
  asumas cobertura de la lógica de cálculo.
- **`src/test-setup.ts` existe porque jsdom no implementa `window.matchMedia`**, que `ThemeService`
  consulta en su constructor. Sin ese stub no arranca ningún spec que monte el árbol de la app.

## Antes de dar algo por terminado

1. `npm run build` → sin errores.
2. `npx ng test --watch=false` → todo en verde.
3. Si tocaste UI: verifica cambio de tema y cambio de idioma (la UI completa debe traducirse).
4. Si tocaste cálculos: comprueba a mano un caso con los porcentajes UA 2025.
