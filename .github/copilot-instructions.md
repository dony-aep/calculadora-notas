# Copilot Instructions - Calculadora de Notas Angular

## Project Overview

PWA de calculadora de notas académicas para la Universidad Americana (Colombia). Permite calcular notas con el sistema de evaluación 2025 (Cortes 1-2: 15% formativa + 15% cognitiva; Corte 3: 20% + 20%) y crear calculadoras personalizadas.

**Stack**: Angular 21 standalone components, ngx-translate (i18n), desplegado en Vercel.

> **No hay PWA ni Service Worker.** La integración del web manifest se eliminó en la v4.5.6
> (ver `CHANGELOG.md`). No existen `ngsw-config.json` ni `src/manifest.webmanifest`, y
> `app.config.ts` no registra `provideServiceWorker`. No los reintroduzcas sin que se pida.

## Architecture

```
src/app/
├── pages/           # Páginas principales (rutas)
│   ├── home/                    # Landing page
│   ├── default-calculator/      # Calculadora con porcentajes fijos (UA 2025)
│   ├── custom-calculator/       # Calculadora personalizable (localStorage)
│   └── app-download/            # Página de descarga APK
├── components/      # Componentes reutilizables
│   ├── layout-footer/           # Footer global con controles (tema, idioma, ayuda, novedades)
│   ├── help-modal/              # Modal de ayuda contextual
│   └── whats-new-modal/         # Modal de novedades por versión (auto-abre en release nueva)
├── services/        # Servicios singleton
│   ├── theme.service.ts         # Dark/light mode (localStorage + system preference)
│   ├── translation.service.ts   # Wrapper ngx-translate (es/en)
│   └── footer.service.ts        # Control visibilidad "Made by" en footer
└── app.config.ts    # Providers (router, http, translate)
```

## Key Patterns

### Standalone Components (Angular 21+)
Todos los componentes son standalone por defecto en Angular 19+. **NO usar `standalone: true`** en el decorador (es implícito). Usar `inject()` para inyección de dependencias y `ChangeDetectionStrategy.OnPush`. Angular 21 usa decoradores TC39 estándar (**NO usar `experimentalDecorators`** en tsconfig.json):

```typescript
@Component({
  selector: 'app-example',
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  private readonly someService = inject(SomeService);
}
```

### Signals e Inputs/Outputs Modernos
Usar funciones `input()` y `output()` en lugar de decoradores `@Input()` y `@Output()`:

```typescript
// ✅ Correcto (Angular 21+)
isVisible = input(false);
close = output<void>();

// ❌ Evitar (legacy)
@Input() isVisible = false;
@Output() close = new EventEmitter<void>();
```

### Control Flow Nativo en Templates
Usar `@if`, `@for`, `@switch` en lugar de directivas estructurales:

```html
<!-- ✅ Correcto (Angular 17+) -->
@if (showMessage) {
  <p>{{ message }}</p>
}

@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}

<!-- ❌ Evitar (legacy) -->
<p *ngIf="showMessage">{{ message }}</p>
<div *ngFor="let item of items">{{ item.name }}</div>
```

### Internationalization (i18n)
- Archivos: `src/assets/i18n/{es,en}.json`
- Estructura jerárquica: `SECTION.KEY` (ej: `DEFAULT_CALCULATOR.TITLE`)
- En templates: `{{ 'KEY' | translate }}` o `[translate]="'KEY'"`
- Variables: `{{ 'KEY' | translate: { value: variable } }}`
- **Siempre** agregar traducciones en ambos archivos al crear texto nuevo

### Theme System
- CSS variables en `src/assets/styles/variables.css`
- Clase `.dark-mode` en `<html>` para tema oscuro
- Usar `var(--color-*)` para colores, nunca hardcodear valores
- `ThemeService.toggleTheme()` para cambiar tema

### State Persistence
- Tema: `localStorage.getItem('theme')`
- Idioma: `localStorage.getItem('language')`
- Calculadora personalizada: `localStorage.getItem('customCalculator')`
- Última versión de novedades vista: `localStorage.getItem('whatsNewSeenVersion')`

### Modal de Novedades (release ritual)
`layout-footer` abre el modal automáticamente cuando `whatsNewSeenVersion` no coincide con
`WHATS_NEW_VERSION`. Al anunciar una versión hay que tocar **tres** sitios o el modal queda
inconsistente:
1. `CHANGELOG.md`: nueva sección `## [X.Y.Z] - YYYY-MM-DD`.
2. `whats-new-modal.component.ts`: `WHATS_NEW_VERSION`, `WHATS_NEW_DATE` (misma fecha que el
   changelog) y la lista `newFeatures`.
3. `es.json` / `en.json`: claves `WHATS_NEW.NEW_<n>_TITLE` y `WHATS_NEW.NEW_<n>_DESC` por cada
   número de esa lista.

La versión del proyecto vive en `CHANGELOG.md`, **no** en `package.json` (ahí se queda en
`0.0.0` a propósito).

## Development Commands

```bash
npm start          # Dev server en http://localhost:4200
npm run build      # Build producción → dist/calculadora-notas-angular
npm test           # Tests con Karma (modo watch, interactivo)
npx ng version     # Verificar versiones instaladas

# Verificación no interactiva (usar esta al comprobar cambios; npm test se queda colgado)
npx ng test --watch=false --browsers=ChromeHeadless
```

## Build System

Angular 21 usa `@angular/build` (no `@angular-devkit/build-angular`). Builders en `angular.json`:
- `@angular/build:application`
- `@angular/build:dev-server`
- `@angular/build:karma`

### Configuración i18n (ngx-translate v17+)
En `app.config.ts` se usa el nuevo patrón funcional:
```typescript
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

provideTranslateService(),
provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
```
En componentes, seguir importando `TranslateModule` para acceder al pipe `translate` en templates.

## Important Files

| Archivo | Propósito |
|---------|-----------|
| `angular.json` | Configuración build/serve, builders |
| `src/assets/styles/variables.css` | Variables CSS (temas) |
| `src/assets/i18n/*.json` | Traducciones |
| `CHANGELOG.md` | Historial de cambios y **versión real** del proyecto |
| `CLAUDE.md` | Instrucciones equivalentes para Claude Code |

## Code Conventions

- **Idioma código**: Español para variables/métodos de negocio (`notaFormativa`, `calcularNotas`)
- **Inyección**: Usar `inject()` en lugar de constructor injection
- **Change Detection**: Siempre usar `ChangeDetectionStrategy.OnPush`
- **Servicios**: Usar `BehaviorSubject` con `readonly` para estado reactivo, `providedIn: 'root'`
- **CSS**: BEM-like con variables CSS, nunca `!important`
- **Rutas**: Definidas en `app.routes.ts`, usar `RouterLink` para navegación
- **Validación notas**: Rango 0-5, mostrar `alert()` traducido si inválida
- **Host bindings**: Usar objeto `host` en decorador, no `@HostBinding`/`@HostListener`

## Testing Checklist

Antes de commit verificar:
1. `npm run build` termina sin errores
2. `npx ng test --watch=false --browsers=ChromeHeadless` pasa en verde
3. Cambio de tema funciona
4. Cambio de idioma actualiza toda la UI
5. Cálculos producen resultados correctos (comprobar a mano un caso con los % UA 2025)

Solo existe un archivo de test (`src/app/app.component.spec.ts`, 3 especificaciones): no asumas
que la lógica de cálculo está cubierta.
