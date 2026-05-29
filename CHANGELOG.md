# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.6.0] - 2026-05-28

### Added

- Grade prediction system for the default calculator: a panel appears automatically as grades are entered, showing the minimum uniform grade needed across all remaining empty fields to reach the passing score (3.0).
- Per-field prediction hint (`Sugerido: ≥ X.X` / `Suggested: ≥ X.X`) displayed under each empty input as a quick inline reference.
- Safety grade hint displayed contextually under the next relevant empty field when that single grade alone can guarantee a pass (assuming 0.0 in all subsequent fields).
- Grade prediction documentation added to the Help modal under the default calculator section, covering the prediction panel, per-field hints, and the safety grade hint.
- Global custom scrollbar styles aligned with the design system: 6px thumb using `--color-border`, `--color-primary` on hover, and transparent track; applies to the entire app.

### Changed

- Removed `border-left` accent from example blocks in the Help modal for a cleaner layout; `border-radius` updated to uniform `10px`.
- Safety grade prediction replicates the exact cut-level rounding (`toFixed(2)`) used by the main grade calculation to guarantee full consistency.

## [4.5.7] - 2026-05-28

### Security

- Resolved 6 vulnerabilities reported by `npm audit` (1 high, 5 moderate) by refreshing `package-lock.json` to patched transitive versions:
  - `tmp` < 0.2.6 (high) — Path Traversal via unsanitized prefix/postfix ([GHSA-ph9p-34f9-6g65](https://github.com/advisories/GHSA-ph9p-34f9-6g65)).
  - `ws` 8.0.0 - 8.20.0 (moderate) — Uninitialized memory disclosure ([GHSA-58qx-3vcg-4xpx](https://github.com/advisories/GHSA-58qx-3vcg-4xpx)).
  - `brace-expansion` 5.0.2 - 5.0.5 (moderate) — DoS via large numeric ranges ([GHSA-jxxr-4gwj-5jf2](https://github.com/advisories/GHSA-jxxr-4gwj-5jf2)).
  - `qs` 6.11.1 - 6.15.1 (moderate) — DoS in `qs.stringify` ([GHSA-q8mj-m7cp-5q26](https://github.com/advisories/GHSA-q8mj-m7cp-5q26)).
  - `engine.io` and `socket.io-adapter` (moderate) — transitive impact via `ws`.
- `npm audit` now reports 0 vulnerabilities.

## [4.5.6] - 2026-04-29

### Changed

- Updated website title to `CalNotas`.
- Removed web manifest integration from the web app.

### Removed

- PWA/Service Worker runtime setup from `app.config.ts`.
- Service worker build configuration from `angular.json`.
- `@angular/service-worker` dependency.
- `ngsw-config.json` and `src/manifest.webmanifest`.

## [4.5.5] - 2026-04-29

### Changed

- Updated app visual assets to the new branding set for web and mobile.
- Replaced the app-download preview image with the new mobile design preview asset.
- Restored landing preview image usage for README references (`calnotas-preview.png`).
- Updated PWA manifest icons to the new naming and asset set (`calnotas-icon-black-*`).

### Added

- New icon pack in `src/assets/icons` with 8 variants:
  - `calnotas-logo-black.png`, `calnotas-logo-white.png`
  - `calnotas-favicon-black-32.png`, `calnotas-favicon-white-32.png`
  - `calnotas-icon-black-192.png`, `calnotas-icon-white-192.png`
  - `calnotas-icon-black-512.png`, `calnotas-icon-white-512.png`

### Fixed

- Web favicon now updates dynamically at runtime based on browser color scheme (`prefers-color-scheme`), including live changes.
- Removed delayed theme visual transitions globally so appearance changes render instantly.

## [4.5.4] - 2026-04-29

### Fixed

- Repaired `AppComponent` unit tests by providing test-safe dependencies for routing and translation.
- Updated the outdated default spec assertion to validate the rendered footer component instead of a non-existent `h1` title.

### Security

- Resolved moderate vulnerabilities detected by `npm audit` through lockfile refresh (`package-lock.json`).
- `npm audit` now reports 0 vulnerabilities again.

## [4.5.3] - 2026-04-11

### Security

- Resolved open Dependabot alerts in development dependencies by refreshing `package-lock.json` to patched transitive versions.
- `npm audit` now reports 0 vulnerabilities.

### Updated

- Angular framework packages resolved to 21.2.8.
- Angular CLI resolved to 21.2.7.
- `@angular/build` resolved to 21.2.7.
- Security-relevant transitive updates include:
  - `vite` 7.3.2
  - `picomatch` 4.0.4
  - `hono` 4.12.12
  - `@hono/node-server` 1.19.13
  - `lodash` 4.18.1

## [4.5.2] - 2026-03-26

### Security

- **CRITICAL**: Fixed XSS vulnerability in i18n attribute bindings ([GHSA-g93w-mfhg-p222](https://github.com/advisories/GHSA-g93w-mfhg-p222)).

### Updated

- Angular: 21.2.0 → 21.2.6 (all @angular/* packages).
- Angular CLI: 21.2.0 → 21.2.4.
- @angular/build: 21.2.0 → 21.2.4.

### Notes

- Remaining 7 moderate/high vulnerabilities in `picomatch` are dev-only dependencies (inside @angular/cli) with no fix available upstream yet. These do NOT affect production builds or runtime code.

## [4.5.1] - 2026-03-02

### Updated

- Angular: 21.1.5 → 21.2.0 (all @angular/* packages).
- Angular CLI: 21.1.5 → 21.2.0.
- @angular/build: 21.1.5 → 21.2.0.

### Security

- Clean installation with 0 security vulnerabilities found.

## [4.5.0] - 2026-02-25

### Added

- Plus Jakarta Sans font via Google Fonts CDN.
- Monochrome color palette (white, black, and neutral grays only); color reserved for semantic actions (delete in red, pass/fail in green/red).
- Redesigned help modal with structured layout: header with close button, scrollable body, section icons (`calculate`/`tune`), example block with left border, info callout, and section divider.
- Redesigned app-download page with pill-shaped brand badge, bordered preview card, and horizontal action buttons layout.
- Dark mode divider CSS variable (`--color-divider`) for proper neutral separation in dark theme.

### Changed

- Neutralized all blue-tinted colors to pure grays in both light and dark themes (e.g., dark background from `#0c0c14` to `#0e0e0e`, text from `#e4e4ed` to `#e5e5e5`).
- Removed all glow `box-shadow` effects and `translateY` hover animations across every component.
- Simplified all hover transitions to `border-color 0.2s` only, with monochrome behavior.
- Changed root route from `/home` to `/` with backward-compatible redirect.
- Increased `anyComponentStyle` CSS budget from 6kB to 7kB.
- Translated README.md to English; added new Spanish README (`README.es.md`).

### Fixed

- Reset button icon stuck on "check" state after resetting fields in both calculators. Added `ChangeDetectorRef.markForCheck()` to properly trigger re-render with `OnPush` change detection after `setTimeout`.

## [4.4.0] - 2026-02-24

### Changed

- Migrated from Angular 20.3.16 to Angular 21.1.5 (latest stable).
- Updated Angular CLI from 20.3.14 to 21.1.5.
- Updated @angular/build from 20.3.14 to 21.1.5.
- Upgraded TypeScript from 5.8.3 to 5.9.3.
- Updated @ngx-translate/core from 16.0.4 to 17.0.0.
- Updated @ngx-translate/http-loader from 16.0.1 to 17.0.0.
- Migrated `app.config.ts` from `importProvidersFrom(TranslateModule.forRoot(...))` to `provideTranslateService()` + `provideTranslateHttpLoader()`.
- Updated `copilot-instructions.md` and `angular-update.prompt.md` to reflect Angular 21.
- Reformatted CHANGELOG.md to [Keep a Changelog](https://keepachangelog.com/) standard.

### Removed

- Removed `experimentalDecorators: true` from `tsconfig.json` (Angular 21 uses TC39 standard decorators).

### Security

- Clean installation with 0 security vulnerabilities found.

## [4.3.0] - 2026-01-22

### Added

- Download button linking to GitHub Releases (`/releases/latest`).
- GitHub icon from Simple Icons package.
- Dynamic icon color support for SVG icons (black in light mode, white in dark mode).
- `github-icon.svg` with `currentColor` fill support.

### Changed

- Replaced the in-app changelog section with a link to the CHANGELOG.md file on GitHub.
- Increased border-radius of app preview image from 20px to 30px.
- Increased component CSS budget from 4kB to 6kB to resolve build warnings.
- Hide download app button in footer when already on the app-download page.

### Removed

- Removed Gumroad and Google Drive download buttons.
- Removed static changelog items from translation files.
- Removed unused `gumroad-icon.svg` and `drive-icon.svg` assets.

### Security

- Fixed all npm security vulnerabilities (0 vulnerabilities).

## [4.2.1] - 2026-01-15

### Changed

- Updated Angular Core from 20.3.15 to 20.3.16.
- Updated Angular CLI from 20.3.13 to 20.3.14.
- Updated @angular/build from 20.3.13 to 20.3.14.

### Security

- 0 security vulnerabilities found.

## [4.2.0] - 2025-12-14

### Changed

- Migrated from Angular 19.1.0 to Angular 20.3.15 (latest stable patch).
- Updated Angular CLI from 19.1.0 to 20.3.13.
- Upgraded TypeScript from 5.7.x to 5.8.3.
- Updated RxJS from 7.8.0 to 7.8.2.
- Updated zone.js to 0.15.1.
- Replaced `@angular-devkit/build-angular` with the new `@angular/build` package.
- Updated all builders in `angular.json` to use the new `@angular/build` namespace.

### Security

- Performed a clean installation by removing `node_modules` and `package-lock.json`.
- Resolved all security vulnerabilities (0 vulnerabilities found after update).

## [4.1.2]

### Changed

- The final grade in the custom calculator is now only calculated and displayed when the total percentage equals 100%.

## [4.1.1]

### Added

- Percentage indicators next to each grade input for better clarity on how final grades are weighted.
- User alert that prevents saving a custom calculator if no fields have been created, with full i18n support.

### Changed

- Updated the custom calculator layout to display two fields per row on desktop.
- A single field in a row (e.g., the last in an odd-numbered list) automatically expands to full width.
- The "Minimum Passing Grade" input is now empty by default, using a placeholder to indicate the default value (3.0).

## [4.1.0]

### Added

- Full PWA support using the official `@angular/pwa` package.
- Angular Service Worker to replace the manual cache versioning system.
- `manifest.webmanifest` to define PWA metadata.
- `ngsw-config.json` to manage the caching strategy declaratively.
- Automatic cache updates on deployment without requiring user forced refresh.

## [4.0.1]

### Fixed

- Corrected the `og:image` and `twitter:image` metadata URLs in `index.html` to point to the correct image path in the `assets` folder.

## [4.0.0]

### Added

- Full support for English and Spanish using `ngx-translate`.
- Centralized `TranslationService` for language state and persistence.
- Dark/light mode toggle with theme persistence using `localStorage`.
- Backdrop-click functionality to close the help modal and language dropdown.
- Dynamic creation/deletion of fields in custom calculator with `localStorage` persistence.
- Floating controls with blur effects for theme, language, help, and navigation buttons.

### Changed

- Complete rebuild from static HTML/CSS/JS to Angular component-based architecture.
- Complete UI/UX redesign with modern look across all pages.
- Reorganized layout with fixed-position navigation controls.
- Enhanced responsive design for all devices.
- Overhauled custom calculator interface with per-field cards and dynamic field counter.
- Component-based architecture: `Home`, `DefaultCalculator`, `CustomCalculator`, `AppDownload`, `LayoutFooter`, `HelpModal`.
- Centralized state management for theme and footer visibility using Angular services.

## [3.1.2]

### Changed

- Changed Google Drive download link to folder path.
- Updated cache version to v13.

### Fixed

- Fixed file access for better usability.

## [3.1.1]

### Added

- Google Drive download button.
- Gumroad icon on existing download button.

### Changed

- Removed blur effect from help modal and overlay.
- Improved modal contrast and opacity to highlight information.
- Updated cache version to v12.

## [3.1.0]

### Added

- New button and section for downloading the APK version of the app.

## [3.0.1]

### Fixed

- Language selector tooltip not appearing after switching languages.
- Tooltip positioning on mobile devices to prevent menu overlap.
- Tooltip visibility state management when dropdown is open/closed.

### Changed

- Enhanced mobile responsive behavior for language controls.
- Updated service worker cache to v10.

## [3.0.0]

### Added

- New input field in custom calculator to define the minimum passing grade.
- Offline fallback for HTML pages.

### Changed

- Complete redesign of the website for a modern, responsive experience.
- Updated the default grade calculator to the 2025 grading system of Universidad Americana (Grades 1-4: 15% each, Grades 5-6: 20% each).
- Improved help modal to explain minimum passing grade field.
- Enhanced language support and tooltips for all main buttons.
- Upgraded service worker to cache-first strategy with automatic resource caching and old cache cleanup.
- General improvements in accessibility, translations, and UI consistency.

## [2.4.1]

### Changed

- Added new icon for the main page.
- Changed the path to the icons folder.
- Improved manifest.json with new icons path.
- Updated cache to version 8.

## [2.4.0]

### Added

- Tooltips for help, theme toggle, and language toggle buttons.
- Dark/light mode support for tooltips.
- Maskable icon support for better PWA integration.
- Back arrow icon animation on "Volver" button hover.
- Check icon animation on "Restablecer" button click.

### Changed

- Improved tooltip positioning per button (left/right side).
- Applied Poppins font family to tooltips.
- Adjusted z-index values for proper layering.
- Enhanced browser translation support with `notranslate` class and `translate="yes"` attributes.
- Improved button positioning for mobile devices.
- Updated manifest.json with dark theme background color.
- Enhanced service worker caching for better offline support.


