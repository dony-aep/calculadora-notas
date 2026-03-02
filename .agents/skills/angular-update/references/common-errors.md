# Common Angular Update Errors and Fixes

All PowerShell commands assume Windows. Linux/macOS equivalents are noted where relevant.

---

## Dependency and Install Errors

### ERESOLVE unable to resolve dependency tree

Cause: Peer dependency conflict between installed packages after a version change.

Fix: Do not use --force or --legacy-peer-deps blindly.
1. Read the full error to identify which package is conflicting.
2. Adjust that package's version to match the documented compatible range.
3. Consult references/angular-versions.md for the correct ranges.
4. Only use --legacy-peer-deps if you understand and accept the risk.

```powershell
npm install
# only if conflict is understood and accepted:
npm install --legacy-peer-deps
```

### Cannot find module '@angular/xxx'

Cause: Partial or failed installation, often after a manual cleanup.

Fix:
```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
```

### Found incompatible module (during ng update)

Cause: ng update detects a version mismatch between packages in the workspace.

Fix: Always update @angular/core and @angular/cli first, then other Angular packages:
```powershell
npx ng update @angular/core@21 @angular/cli@21
npx ng update @angular/material
npx ng update @ngrx/store
```

---

## Build Errors

### Builder not found (Angular 18+)

Cause: angular.json still references the old builder namespace after upgrading to Angular 18+.

Fix: Update all builder entries in angular.json:

| Old                                          | New                              |
|----------------------------------------------|----------------------------------|
| @angular-devkit/build-angular:application    | @angular/build:application       |
| @angular-devkit/build-angular:dev-server     | @angular/build:dev-server        |
| @angular-devkit/build-angular:extract-i18n   | @angular/build:extract-i18n      |
| @angular-devkit/build-angular:karma          | @angular/build:karma             |

Also update devDependencies in package.json: remove @angular-devkit/build-angular, add @angular/build.

### Test builder not found after upgrading to Angular 21

Cause: Angular 21 changed the default test runner from Karma/Jasmine to Vitest.
The new Vitest builder is @angular/build:unit-test.

Fix:
- For projects that want to use Vitest (recommended for new setup):
  Update the test builder in angular.json to @angular/build:unit-test
  and run the migration schematic: npx ng generate @angular/build:vitest-test

- For projects that want to keep Karma:
  Continue using @angular/build:karma and add --test-runner=karma explicitly.

Note: Jest and Web Test Runner support was deprecated in Angular 21.

### JavaScript heap out of memory

Cause: Large project or insufficient Node.js memory allocated for the build process.

Fix:
```powershell
$env:NODE_OPTIONS="--max_old_space_size=8192"
npx ng build
```

Linux/macOS:
```bash
export NODE_OPTIONS=--max_old_space_size=8192
npx ng build
```

### Build hangs at "Generating browser application bundles"

Cause: Corrupted .angular cache or memory issue.

Fix:
```powershell
Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue
npx ng build --no-cache
```

### NG6002: Appears in NgModule.imports but could not be resolved

Cause: Missing peer dependency or package renamed after update.

Fix:
```powershell
npm install <missing-package>
npm ls <package-name>
```

---

## TypeScript Errors

### Type 'X' is not assignable to type 'Y'

Cause: Stricter TypeScript version or Angular typed forms (introduced in v14).

Fix for typed forms:
```typescript
// Specify the type explicitly (recommended)
formControl = new FormControl<string>('');

// Temporary workaround while migrating
formControl = new UntypedFormControl('');
```

### TypeScript version outside supported range

Cause: Installed TypeScript version is outside the range Angular supports for this version.

The ranges are more specific than a single tilde version. Consult references/angular-versions.md.
Example for Angular 21: install typescript@">=5.9.0 <6.0.0", not typescript@~5.9.x.

Fix:
```powershell
# Angular 21
npm install "typescript@>=5.9.0 <6.0.0" --save-dev

# Angular 20.2+
npm install "typescript@>=5.8.0 <6.0.0" --save-dev

# Angular 19.2.x
npm install "typescript@>=5.5.0 <5.9.0" --save-dev
```

### experimentalDecorators conflict (Angular 21)

Cause: tsconfig.json has experimentalDecorators: true, which conflicts with TC39 standard
decorators used by default starting in Angular 21.

Fix: Remove or comment out the option in tsconfig.json compilerOptions:
```json
// Remove this line:
"experimentalDecorators": true
```

---

## Zoneless Migration (Angular 21)

### provideExperimentalZonelessChangeDetection is not a function / not found

Cause: The experimental API from v18-v20 was stabilized in v21 under a new name.

Fix: The function changed between versions:
```typescript
// Angular 18-19 (experimental)
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

// Angular 20-21 (stable)
import { provideZonelessChangeDetection } from '@angular/core';
```

### Zone.js still loading in a zoneless project

Cause: Zone.js is still listed in polyfills inside angular.json.

Fix:
1. In angular.json, remove zone.js and zone.js/testing from the polyfills array.
2. Uninstall the package: npm uninstall zone.js
3. Make sure provideZoneChangeDetection is not in any providers list.

### Zone.js required: I still need it for legacy compatibility

Fix: Keep zone.js in your dependencies and add the provider explicitly:
```typescript
// app.config.ts
import { provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // rest of providers
  ],
};
```
Also keep zone.js listed in the polyfills array in angular.json.

---

## RxJS Import Errors

### Cannot find module 'rxjs/operators' or operator not found

Cause: RxJS 7 moved operators from 'rxjs/operators' into the main 'rxjs' entry point.
The minimum required RxJS version for Angular 15+ is ^7.4.0, not a specific 7.8.x.

Fix:
```typescript
// Old (RxJS 6)
import { map, switchMap, filter } from 'rxjs/operators';

// New (RxJS 7+)
import { map, switchMap, filter } from 'rxjs';
```

---

## ngx-translate Errors (Angular 17+ / ngx-translate v17)

### NullInjectorError: No provider for TranslateService

Cause: The module-based setup using TranslateModule.forRoot() was replaced by provider
functions in ngx-translate v17.

Fix: Update app.config.ts with the v17 provider API:
```typescript
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'en',              // this was defaultLanguage in v16
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
```

Important: the loader must be provided INSIDE the provideTranslateService config object.
If provided separately it will be ignored.

### Property 'defaultLanguage' does not exist on type

Cause: In ngx-translate v17, defaultLanguage was renamed to fallbackLang.

Fix:
```typescript
// v16 (old)
provideTranslateService({ defaultLanguage: 'en' })

// v17 (correct)
provideTranslateService({ fallbackLang: 'en' })
```

### translate pipe not found in template

Cause: TranslatePipe is not imported in the standalone component.

Fix:
```typescript
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';

@Component({
  imports: [TranslatePipe, TranslateDirective],
})
```

---

## Template Errors

### NG8001: 'app-xxx' is not a known element

Cause: Missing component import in a standalone component or missing declaration in NgModule.

Fix for standalone component:
```typescript
@Component({
  imports: [MissingComponent],
})
```

Fix for NgModule:
```typescript
@NgModule({
  declarations: [MissingComponent],
})
```

### NG5002: Unexpected character "@" (in Angular < 17)

Cause: Using the new @if, @for, @switch control flow syntax in a project running Angular < 17.

Fix: Upgrade to Angular 17+ or use the legacy structural directives (*ngIf, *ngFor).

---

## SSR and Hydration Errors (Angular 16+)

### NG0500: Error during hydration

Cause: Mismatch between server-rendered HTML and the client component tree.
Often caused by browser-only APIs called during server-side rendering.

Fix:
```typescript
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

readonly platformId = inject(PLATFORM_ID);

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    // browser-only code here
  }
}
```

### ReferenceError: window is not defined

Cause: Browser global referenced during SSR execution.

Fix: Guard with isPlatformBrowser() or use afterRender / afterNextRender hooks,
which only execute in the browser context.

---

## Angular Material Errors

### MatLegacy* components not found (Angular 15+)

Cause: Legacy Material components were removed in Angular 15.

Fix: Run the Material migration schematics:
```powershell
npx ng update @angular/material
```

### mat-form-field must contain a MatFormFieldControl

Cause: Input inside mat-form-field is missing the matInput directive.

Fix:
```html
<mat-form-field>
  <input matInput placeholder="Example">
</mat-form-field>
```

---

## Diagnostic Commands (Windows)

```powershell
# Full Angular, Node.js, TypeScript version report
npx ng version

# Check if CLI and Core versions match
npm list @angular/core @angular/cli

# Detect unmet peer dependencies
npm ls --depth=1 2>&1 | Select-String "UNMET PEER"

# TypeScript version in use
npx tsc --version

# Node.js version (verify minimum patch version is met)
node -e "console.log(process.version)"

# Security audit
npm audit --audit-level=moderate

# Check RxJS version installed
npm list rxjs
```
