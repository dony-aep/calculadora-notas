# Copilot Instructions - Calculadora de Notas Angular

## Project Overview

PWA de calculadora de notas académicas para la Universidad Americana (Colombia). Permite calcular notas con el sistema de evaluación 2025 (Cortes 1-2: 15% formativa + 15% cognitiva; Corte 3: 20% + 20%) y crear calculadoras personalizadas.

**Stack**: Angular 20 standalone components, ngx-translate (i18n), PWA con Service Worker, desplegado en Vercel.

## Architecture

```
src/app/
├── pages/           # Páginas principales (rutas)
│   ├── home/                    # Landing page
│   ├── default-calculator/      # Calculadora con porcentajes fijos (UA 2025)
│   ├── custom-calculator/       # Calculadora personalizable (localStorage)
│   └── app-download/            # Página de descarga APK
├── components/      # Componentes reutilizables
│   ├── layout-footer/           # Footer global con controles (tema, idioma, ayuda)
│   └── help-modal/              # Modal de ayuda contextual
├── services/        # Servicios singleton
│   ├── theme.service.ts         # Dark/light mode (localStorage + system preference)
│   ├── translation.service.ts   # Wrapper ngx-translate (es/en)
│   └── footer.service.ts        # Control visibilidad "Made by" en footer
└── app.config.ts    # Providers (router, http, translate, service-worker)
```

## Key Patterns

### Standalone Components (Angular 20+)
Todos los componentes son standalone por defecto en Angular 19+. **NO usar `standalone: true`** en el decorador (es implícito). Usar `inject()` para inyección de dependencias y `ChangeDetectionStrategy.OnPush`:

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
// ✅ Correcto (Angular 20+)
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

## Development Commands

```bash
npm start          # Dev server en http://localhost:4200
npm run build      # Build producción (incluye PWA)
npm test           # Tests con Karma
npx ng version     # Verificar versiones instaladas
```

## Build System

Angular 20 usa `@angular/build` (no `@angular-devkit/build-angular`). Builders en `angular.json`:
- `@angular/build:application`
- `@angular/build:dev-server`
- `@angular/build:karma`

## Important Files

| Archivo | Propósito |
|---------|-----------|
| `angular.json` | Configuración build/serve, builders |
| `ngsw-config.json` | Estrategia cache PWA |
| `src/manifest.webmanifest` | Metadata PWA |
| `src/assets/styles/variables.css` | Variables CSS (temas) |
| `src/assets/i18n/*.json` | Traducciones |
| `CHANGELOG.md` | Historial de cambios por versión |

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
1. `ng serve` funciona sin errores
2. Cambio de tema funciona
3. Cambio de idioma actualiza toda la UI
4. Cálculos producen resultados correctos
5. PWA: `npm run build` genera service worker
