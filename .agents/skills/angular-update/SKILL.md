---
name: angular-update
description: >
  Skill for updating and maintaining Angular frontend projects, optimized for Windows (PowerShell).
  Use when the user wants to: audit an Angular project, update versions (patch, minor, or major),
  clean workspace artifacts (node_modules, dist, .angular), migrate between Angular versions,
  document changes in CHANGELOG.md, or troubleshoot Angular CLI and build issues.
  Trigger on: Angular version update, ng update, Angular migration, update Angular, clean Angular,
  limpieza Angular, actualizar Angular, version Angular, actualizar dependencias Angular,
  CHANGELOG Angular, registrar cambios Angular, actualizar proyecto Angular, parche Angular,
  subir version Angular, Angular dependency audit, Angular build error.
  Always use proactively when Angular is mentioned alongside: update, upgrade, clean, audit,
  version, migrate, patch, or changelog.
---

# Angular Update

A skill for safely auditing, updating, cleaning, and documenting changes in Angular frontend
projects. Commands and paths are written for Windows (PowerShell) as the primary environment,
with Linux/macOS equivalents noted where relevant.

---

## Workflow Overview

```
1. UNDERSTAND   ->  Read project files and detect current state
2. INVESTIGATE  ->  Query available versions with npm view
3. AUDIT        ->  Check outdated deps, vulnerabilities, risks
4. PLAN         ->  Choose update type: patch / minor / major
5. CLEAN        ->  Remove stale artifacts safely
6. UPDATE       ->  Edit package.json, angular.json, run npm install
7. VERIFY       ->  Confirm ng version, build, and tests pass
8. CHANGELOG    ->  Document all changes in CHANGELOG.md
```

Always follow this order. Never jump to clean or update without first reading the project state.

---

## Step 1 — Understand the Project State

Read these files before taking any action. All paths assume the project root as working directory.

```powershell
# Angular workspace configuration
Get-Content angular.json

# Dependencies and current declared versions
Get-Content package.json

# Lock file — actual installed versions (first 60 lines)
Get-Content package-lock.json | Select-Object -First 60

# TypeScript configuration
Get-Content tsconfig.json

# Existing changelog (if present)
if (Test-Path CHANGELOG.md) { Get-Content CHANGELOG.md } else { Write-Host "No CHANGELOG.md found" }

# Check artifacts on disk
if (Test-Path node_modules) { Write-Host "node_modules present" } else { Write-Host "node_modules not installed" }
if (Test-Path dist)         { Write-Host "dist folder exists" }     else { Write-Host "No dist folder" }
if (Test-Path .angular)     { Write-Host ".angular cache exists" }  else { Write-Host "No .angular cache" }
```

Key information to extract:

| Item              | Source          | Why It Matters                              |
|-------------------|-----------------|---------------------------------------------|
| Angular Core      | package.json    | Current framework version                   |
| Angular CLI       | package.json    | Build tooling version                       |
| TypeScript        | package.json    | TS compatibility check (range, not just major) |
| zone.js           | package.json    | Is it present? Zoneless default in v21      |
| Builder namespace | angular.json    | Changed in Angular 18+                      |
| Test builder      | angular.json    | Changed in Angular 21 (Vitest default)      |
| Node.js           | node --version  | Exact patch version matters (e.g. 20.19.0) |
| Nx present?       | nx.json exists? | Changes the update strategy                 |

---

## Step 2 — Investigate Available Versions

Before editing any file, query npm to confirm what versions exist for the target.
Replace {VERSION_MAJOR} with the target number (e.g. 21):

```powershell
npm view @angular/core@{VERSION_MAJOR} version --json
npm view @angular/cli@{VERSION_MAJOR} version --json
npm view @angular/build@{VERSION_MAJOR} version --json
npm view "typescript@>=5.9.0 <6.0.0" version --json   # adjust range per target version
npm view zone.js version --json
```

If the user has not specified a target version, use web search to confirm the current latest stable
release. As of March 2026, the latest stable version is Angular 21.2.0.

---

## Step 3 — Audit Dependencies

```powershell
# All outdated packages
npm outdated

# Installed Angular packages
npm list @angular/core @angular/cli @angular/common @angular/router

# Security vulnerabilities
npm audit --audit-level=moderate

# All @angular/* packages installed
npm list | Select-String "@angular"
```

Classify outdated packages:

- Patch (e.g., 21.0.0 -> 21.0.5): bug fixes only, low risk
- Minor (e.g., 21.0.x -> 21.2.x): new features, backward compatible, moderate risk
- Major (e.g., 20.x -> 21.x): potential breaking changes, high risk — review migration guide

---

## Step 4 — Plan the Update Strategy

### Update Types

Patch or Minor — edit package.json directly, then reinstall.
Do not use ng update for patch/minor; it is only reliable for major migrations.

Major — one version at a time. Never skip:
```
15 -> 16 -> 17 -> 18 -> 19 -> 20 -> 21
```

Always run a dry-run before executing a major update:

```powershell
npx ng update @angular/core@21 @angular/cli@21 --dry-run
npx ng update @angular/core@21 @angular/cli@21
```

### Dependencies to Update in package.json

Under dependencies:
- @angular/animations
- @angular/common
- @angular/compiler
- @angular/core
- @angular/forms
- @angular/platform-browser
- @angular/platform-browser-dynamic
- @angular/router
- @angular/service-worker (if present)
- rxjs (minimum ^7.4.0 for Angular 15+; latest stable is 7.8.x)
- zone.js (optional in v21 — see Zoneless note below)
- tslib

Under devDependencies:
- @angular/build (Angular 18+ — replaces @angular-devkit/build-angular)
- @angular/cli
- @angular/compiler-cli
- typescript (use the exact range per version — see references/angular-versions.md)

### Compatibility Ranges (summary)

Consult references/angular-versions.md for the full table. Key points:
- Node.js minimum versions matter by patch, not just major (e.g., 20.19.0, not just 20.x)
- TypeScript uses a range, not a single version (e.g., >=5.9.0 <6.0.0 for Angular 21)
- RxJS minimum is ^7.4.0 for all Angular versions from 15 onwards

### Builder Namespace (Angular 18+)

Update angular.json builders from the old namespace to the new one:

| Old (pre-18)                                 | New (18+)                        |
|----------------------------------------------|----------------------------------|
| @angular-devkit/build-angular:application    | @angular/build:application       |
| @angular-devkit/build-angular:dev-server     | @angular/build:dev-server        |
| @angular-devkit/build-angular:extract-i18n   | @angular/build:extract-i18n      |
| @angular-devkit/build-angular:karma          | @angular/build:karma             |

Also in package.json devDependencies: remove @angular-devkit/build-angular, add @angular/build.

### Test Runner (Angular 21)

In Angular 21, Vitest is the default test runner for new projects, replacing Karma/Jasmine.
Existing projects are not automatically migrated — choose one of:

Option A — Migrate to Vitest (recommended for new setup):
```powershell
npx ng generate @angular/build:vitest-test
```
This updates angular.json to use @angular/build:unit-test as the test builder.

Option B — Keep Karma (no change required):
Continue using @angular/build:karma. No change needed in existing projects.

Note: Jest and Web Test Runner support was deprecated in Angular 21.

### Zoneless (Angular 21)

In Angular 21, zoneless change detection is the default. Zone.js is no longer required.

If upgrading from v20 or earlier with Zone.js:
- Zone.js will still work but is now opt-in
- To keep using Zone.js: add provideZoneChangeDetection({ eventCoalescing: true }) explicitly
- To go fully zoneless: remove zone.js from package.json and from polyfills in angular.json

### tsconfig.json — Angular 21

Remove experimentalDecorators: true if present. Angular 21 uses TC39 standard decorators by
default, and this setting conflicts with that implementation.

### Third-Party Angular Packages (after core update)

```powershell
npx ng update @angular/material   # if used
npx ng update @angular/cdk        # if used
npx ng update @ngrx/store         # if used
```

### ngx-translate (Angular 17+ / v17 of the library)

For projects using ngx-translate, v17 is required for Angular 17-21.
The provider API changed significantly — update app.config.ts:

```typescript
// app.config.ts — ngx-translate v17 correct API
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'en',            // was defaultLanguage in v16
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
```

Key: the loader must be inside provideTranslateService(), not provided separately.

### Conflict Resolution

If npm install reports peer dependency conflicts:
1. Read the full error to identify the conflicting package.
2. Adjust its version to match the documented compatible range.
3. Do not use --force or --legacy-peer-deps without understanding the root cause.

Official references — always consult before a major update:
- https://update.angular.io/
- https://angular.dev/reference/versions
- https://github.com/angular/angular/blob/main/CHANGELOG.md

---

## Step 5 — Cleanup (Windows)

Run cleanup before installing new versions to avoid stale cache and module conflicts.

```powershell
# Remove installed packages and lock file
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Remove build artifacts
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Remove Angular build cache
Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue

# Remove TypeScript incremental build files
Get-ChildItem -Recurse -Filter "*.tsbuildinfo" | Remove-Item -Force

# Clear npm cache only if persistent cache issues are suspected
npm cache clean --force
```

Linux/macOS equivalent:
```bash
rm -rf node_modules package-lock.json dist .angular
find . -name "*.tsbuildinfo" -delete
```

Never delete: package.json, angular.json, tsconfig.json, or src/

Reinstall after cleanup:
```powershell
npm install
```

---

## Step 6 — Verify the Update

```powershell
# Confirm installed versions and exact Node.js / TS compatibility
npx ng version

# TypeScript compilation check (no output files)
npx tsc --noEmit

# Full production build
npx ng build

# Unit tests
# For projects using Karma:
npx ng test --watch=false
# For projects using Vitest (Angular 21+):
npx ng test

# Linter
npx ng lint

# Local dev server
npx ng serve
```

Common post-update issues:

| Issue                             | Likely Cause                     | Fix                                  |
|-----------------------------------|----------------------------------|--------------------------------------|
| Cannot find module '@angular/xxx' | Partial install                  | Delete node_modules, npm install     |
| TypeScript outside supported range | TS version mismatch             | Use exact range from angular-versions.md |
| NG0XXX runtime errors             | Breaking API change              | Consult migration guide              |
| Builder not found                 | Old builder namespace            | Update angular.json (see Step 4)     |
| Test runner issues after v21      | Karma/Vitest builder mismatch    | Choose one runner, update angular.json |
| Zone.js error in v21 project      | provideZoneChangeDetection missing | Add it explicitly if keeping Zone.js |
| BREAKING CHANGE in rxjs           | RxJS import path change          | See references/common-errors.md      |
| peer dependency conflict          | Version range mismatch           | Adjust versions, avoid --force       |
| experimentalDecorators conflict   | Legacy tsconfig option           | Remove from tsconfig.json (v21+)     |
| fallbackLang not recognized       | ngx-translate v16 API used       | Rename defaultLanguage to fallbackLang |

For detailed error solutions read: references/common-errors.md

---

## Step 7 — Document Changes in CHANGELOG.md

After every successful update, record what changed. If CHANGELOG.md does not exist, create it.
If it already exists, prepend the new entry below any existing [Unreleased] section.

```markdown
# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

## [PROJECT_VERSION] - YYYY-MM-DD

### Updated
- Angular: X.X.X -> Y.Y.Y
- Angular CLI: X.X.X -> Y.Y.Y
- TypeScript: X.X.X -> Y.Y.Y
- zone.js: X.X.X -> Y.Y.Y (or: removed — migrated to zoneless)
- rxjs: X.X.X -> Y.Y.Y (if changed)
- ngx-translate: X.X.X -> Y.Y.Y (if changed)

### Changed
- Updated angular.json builders to @angular/build namespace (if migrating to 18+)
- Removed experimentalDecorators from tsconfig.json (if migrating to 21+)
- Migrated ngx-translate provider to provideTranslateService with fallbackLang (if applicable)
- Migrated test runner from Karma to Vitest (if applicable)
- Removed zone.js — project is now zoneless (if applicable)
- (any other configuration changes)

### Fixed
- (security vulnerabilities resolved from npm audit, if any)

### Notes
- Migration guide followed: https://update.angular.io/?v=X.X-Y.Y
- (breaking changes handled, workarounds applied)
```

---

## Step 8 — Web Search for Up-to-Date Info

Use web search when:
- Confirming the latest Angular stable release
- Finding migration guides for specific major versions
- Debugging unknown errors after an update
- Verifying compatibility for versions newer than this skill's last update (March 2026)

Suggested queries:
```
Angular 21 migration guide
Angular update [version] breaking changes
ng update [package] error [message]
Angular [version] Node.js TypeScript compatibility site:angular.dev
ngx-translate Angular 21 compatibility
```

---

## Nx Workspace Special Handling

If nx.json exists, this is an Nx monorepo. Use Nx update tooling instead of ng update:

```powershell
npx nx --version
npx nx migrate latest
npx nx migrate --run-migrations
npm install
npx nx build <app-name>
```

Reference: https://nx.dev/recipes/tips-n-tricks/advanced-update

---

## Final Checklist

- [ ] Read angular.json, package.json, tsconfig.json, CHANGELOG.md
- [ ] Query available versions with npm view
- [ ] Commit or back up the project before any changes
- [ ] Remove node_modules, package-lock.json, dist, .angular (PowerShell Remove-Item)
- [ ] Update package.json with correct target versions and exact TypeScript range
- [ ] Update angular.json builders if upgrading to Angular 18+
- [ ] Decide on test runner if upgrading to Angular 21+ (Vitest or Karma)
- [ ] Remove experimentalDecorators from tsconfig.json if upgrading to Angular 21+
- [ ] Handle zone.js: keep with explicit provider, or remove for zoneless
- [ ] Update ngx-translate provider API if applicable (fallbackLang, loader inside config)
- [ ] Run npm install
- [ ] Run npx ng version to confirm installed versions and Node.js minimum is met
- [ ] Run npx ng build
- [ ] Run npx ng test
- [ ] Run npx ng serve
- [ ] Run npm audit to check for vulnerabilities
- [ ] Update CHANGELOG.md with all changes and date
- [ ] Commit the changes

---

## References

- Read references/angular-versions.md for verified version history, EOL dates, and compatibility tables
- Read references/common-errors.md for troubleshooting post-update errors
- Official Angular docs: https://angular.dev
- Official compatibility table: https://angular.dev/reference/versions
- Angular update tool: https://update.angular.io
- Keep a Changelog format: https://keepachangelog.com/
- ngx-translate v17 migration: https://ngx-translate.org/getting-started/migration-guide/
