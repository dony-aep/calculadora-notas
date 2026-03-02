# Angular Version History and Compatibility Reference

Source: https://angular.dev/reference/versions (official Angular documentation)
Last reviewed: March 2026. Always verify current status at the URL above.

---

## Active Versions (Supported)

| Version | Release Date | LTS Until  | Status  |
|---------|-------------|------------|---------|
| 21.x    | Nov 2025    | Nov 2027   | Active  |
| 20.x    | May 2025    | May 2027   | LTS     |
| 19.x    | Nov 2024    | Nov 2026   | LTS     |
| 18.x    | May 2024    | May 2026   | LTS     |

## End of Life (EOL) — Do Not Use in New Projects

| Version | EOL Date |
|---------|----------|
| 17.x    | Nov 2025 |
| 16.x    | May 2025 |
| 15.x    | Nov 2024 |
| 14.x    | Nov 2023 |
| 13.x    | May 2023 |
| < 13    | Legacy   |

## Release Cadence

- Major versions: every 6 months (May and November)
- Minor and patch releases: as needed within the current major
- LTS support: 18 months after the major release date

---

## Full Compatibility Matrix

All data is taken directly from https://angular.dev/reference/versions.
Node.js minimum versions must be respected exactly — not just the major version number.

### Angular 21.x

| Dependency  | Version range                              |
|-------------|--------------------------------------------|
| TypeScript  | >=5.9.0 <6.0.0                             |
| RxJS        | ^7.4.0 (latest stable: 7.8.x)             |
| Node.js     | ^20.19.0 or ^22.12.0 or ^24.0.0           |
| zone.js     | ~0.15.x (optional — zoneless is default)   |
| ngx-translate | 17.x                                     |

Notes for Angular 21:
- Zoneless change detection is the DEFAULT in v21. Zone.js is no longer required.
  If using Zone.js for legacy compatibility, keep it in polyfills and use
  provideZoneChangeDetection({ eventCoalescing: true }) explicitly.
- TC39 standard decorators are used by default. Remove experimentalDecorators: true
  from tsconfig.json if present — it conflicts with the new decorator implementation.
- Vitest replaces Karma/Jasmine as the default test runner for new projects (ng new).
  Existing projects can migrate using the migration schematic or keep Karma.
- ngx-translate v17 changed its provider API. Use fallbackLang, not defaultLanguage.

### Angular 20.x

| Minor       | TypeScript         | Node.js                                    | RxJS     |
|-------------|-------------------|--------------------------------------------|----------|
| 20.0 / 20.1 | >=5.8.0 <5.9.0    | ^20.19.0 or ^22.12.0 or ^24.0.0           | ^7.4.0   |
| 20.2 / 20.3 | >=5.8.0 <6.0.0    | ^20.19.0 or ^22.12.0 or ^24.0.0           | ^7.4.0   |

Note: TypeScript 5.9.x is supported starting from Angular 20.2.x.
zone.js: ~0.15.x. Zoneless was in developer preview in v20.

### Angular 19.x

| Minor  | TypeScript         | Node.js                                      | RxJS     |
|--------|--------------------|----------------------------------------------|----------|
| 19.0.x | >=5.5.0 <5.7.0     | ^18.19.1 or ^20.11.1 or ^22.0.0             | ^7.4.0   |
| 19.1.x | >=5.5.0 <5.8.0     | ^18.19.1 or ^20.11.1 or ^22.0.0             | ^7.4.0   |
| 19.2.x | >=5.5.0 <5.9.0     | ^18.19.1 or ^20.11.1 or ^22.0.0             | ^7.4.0   |

zone.js: ~0.15.x. Node 24 is NOT supported in v19.

### Angular 18.x

| Minor       | TypeScript         | Node.js                                      | RxJS     |
|-------------|-------------------|----------------------------------------------|----------|
| 18.0.x      | >=5.4.0 <5.5.0    | ^18.19.1 or ^20.11.1 or ^22.0.0             | ^7.4.0   |
| 18.1 / 18.2 | >=5.4.0 <5.6.0    | ^18.19.1 or ^20.11.1 or ^22.0.0             | ^7.4.0   |

zone.js: ~0.14.x (18.0) or ~0.15.x (18.1+). Node 24 is NOT supported in v18.

### Angular 17.x (EOL Nov 2025)

| Minor       | TypeScript         | Node.js                           | RxJS     |
|-------------|-------------------|-----------------------------------|----------|
| 17.0.x      | >=5.2.0 <5.3.0    | ^18.13.0 or ^20.9.0              | ^7.4.0   |
| 17.1 / 17.2 | >=5.2.0 <5.4.0    | ^18.13.0 or ^20.9.0              | ^7.4.0   |
| 17.3.x      | >=5.2.0 <5.5.0    | ^18.13.0 or ^20.9.0              | ^7.4.0   |

zone.js: ~0.14.x. Node 22 is NOT supported in v17.

### Angular 16.x (EOL May 2025)

| Minor       | TypeScript         | Node.js                           | RxJS     |
|-------------|-------------------|-----------------------------------|----------|
| 16.0.x      | >=4.9.3 <5.1.0    | ^16.14.0 or ^18.10.0             | ^7.4.0   |
| 16.1 / 16.2 | >=4.9.3 <5.2.0    | ^16.14.0 or ^18.10.0             | ^7.4.0   |

zone.js: ~0.13.x.

---

## Key Changes by Version

### Angular 21.x (Nov 2025)
- Zoneless change detection is the DEFAULT — Zone.js is no longer a required dependency
- Vitest is the default test runner for new projects (ng new); replaces Karma/Jasmine
- New test builder in angular.json: @angular/build:unit-test (for Vitest)
- Signal Forms (experimental)
- New @angular/aria package (WAI-ARIA directive collection)
- TC39 standard decorators by default — remove experimentalDecorators from tsconfig.json
- Stable: incremental hydration, Resource API, @defer improvements
- Deprecated: Jest and Web Test Runner support marked as deprecated

### Angular 20.x (May 2025)
- Signal-based forms (developer preview)
- effect() stabilized with cleanup support
- Zoneless change detection in developer preview
- httpResource for declarative HTTP with signals
- Vite 6 build performance improvements
- TypeScript 5.8 support (5.9 from 20.2+)
- Vitest introduced as experimental test runner

### Angular 19.x (Nov 2024)
- @let template variable syntax
- Incremental hydration (developer preview)
- Signal inputs and outputs stabilized
- Route-level render mode (SSR / SSG / CSR per route)
- HMR for styles and templates

### Angular 18.x (May 2024)
- Zoneless change detection (experimental, opt-in)
- Angular Material 3 stable
- ng-content fallback content
- Route redirects as functions
- Builder namespace changed: @angular-devkit/build-angular -> @angular/build

### Angular 17.x (Nov 2023)
- New control flow syntax: @if, @for, @switch (replaces *ngIf, *ngFor)
- Deferrable views: @defer
- Vite + esbuild build system (default)
- Standalone components strongly encouraged

### Angular 16.x (May 2023)
- Angular Signals introduced (developer preview)
- Required inputs
- takeUntilDestroyed() operator

### Angular 15.x (Nov 2022)
- Standalone components stable
- Directive composition API
- Functional route guards

---

## Builder Changes Reference

### Angular 18+: Application and Dev Server builders

| Old (pre-18)                                 | New (18+)                        |
|----------------------------------------------|----------------------------------|
| @angular-devkit/build-angular:application    | @angular/build:application       |
| @angular-devkit/build-angular:dev-server     | @angular/build:dev-server        |
| @angular-devkit/build-angular:extract-i18n   | @angular/build:extract-i18n      |

### Angular 21+: Test runner builders

| Runner  | Builder in angular.json              |
|---------|--------------------------------------|
| Vitest  | @angular/build:unit-test (default in new projects) |
| Karma   | @angular/build:karma (still available, opt-in)     |

In devDependencies: replace @angular-devkit/build-angular with @angular/build.

---

## ngx-translate v17 — API Changes (Angular 17+)

ngx-translate v17 is compatible with Angular 17 through 21. It introduced breaking changes:

The `loader` must be provided INSIDE the `provideTranslateService()` config object:

```typescript
// app.config.ts
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'en',            // renamed from defaultLanguage in v17
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
```

Key breaking changes from v16 to v17:
- defaultLanguage renamed to fallbackLang
- Loader must be inside provideTranslateService(), not provided separately
- TranslateModule.forRoot() replaced by provideTranslateService()
- provideTranslateHttpLoader() replaces TranslateHttpLoader constructor configuration

---

## Upgrade Path

Always upgrade one major version at a time:

```
15 -> 16 -> 17 -> 18 -> 19 -> 20 -> 21
```

Interactive migration guide: https://update.angular.io/
