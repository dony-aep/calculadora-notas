---
name: angular-best-practices
description: Expert guidance for TypeScript and Angular 20+ development. Use this skill when writing Angular components, services, templates, or state management code. Provides best practices for standalone components, signals, reactive patterns, and modern Angular conventions.
---

# Angular & TypeScript Best Practices

You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular 19+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images
  - `NgOptimizedImage` does not work for inline base64 images

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Example: Modern Angular Component

```typescript
import { Component, ChangeDetectionStrategy, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <div>{{ displayName() }}</div>
      <button (click)="onAction()">Action</button>
    }
  `
})
export class ExampleComponent {
  // Inputs using input() function
  name = input.required<string>();
  visible = input(true);
  
  // Outputs using output() function
  actionClicked = output<void>();
  
  // Computed signals for derived state
  displayName = computed(() => `Hello, ${this.name()}`);
  isVisible = computed(() => this.visible() && this.name().length > 0);
  
  // Service injection
  private someService = inject(SomeService);
  
  onAction() {
    this.actionClicked.emit();
  }
}
```
