# Angular Update Assistant

Guía para actualizar proyectos Angular de manera segura y consistente.

## Contexto del Proyecto

- **Framework**: Angular
- **Archivos clave**: 
  - `package.json` - Dependencias del proyecto
  - `angular.json` - Configuración de build y serve
  - `tsconfig.json` - Configuración de TypeScript
  - `CHANGELOG.md` - Registro de cambios

## Tipos de Actualización

### 1. Actualización de Parche (Patch)
Cuando el usuario solicita actualizar al **último parche** de la versión actual (ej: 20.3.x → 20.3.y):
- Solo actualiza el número de parche
- Mantiene la versión mayor y menor
- Riesgo bajo, generalmente solo correcciones de bugs

### 2. Actualización de Versión Menor (Minor)
Cuando el usuario solicita actualizar a una **versión menor** (ej: 20.1.x → 20.3.x):
- Actualiza la versión menor dentro de la misma versión mayor
- Puede incluir nuevas características retrocompatibles
- Riesgo moderado

### 3. Actualización de Versión Mayor (Major)
Cuando el usuario solicita actualizar a una **nueva versión mayor** (ej: 19.x → 20.x):
- Cambio significativo de versión
- Puede incluir breaking changes
- Requiere revisión de guía de migración oficial
- Riesgo alto - verificar compatibilidad de dependencias

## Procedimiento de Actualización

### Paso 1: Investigar Versiones Disponibles
```bash
# Obtener versiones disponibles de Angular
npm view @angular/core@{VERSION_MAJOR} version --json

# Obtener versiones de paquetes relacionados
npm view @angular/cli@{VERSION_MAJOR} version --json
npm view @angular/build@{VERSION_MAJOR} version --json
npm view typescript@{TS_MAJOR} version --json
```

### Paso 2: Identificar la Versión Actual
Leer el archivo `package.json` para identificar:
- Versión actual de `@angular/core`
- Versión actual de `@angular/cli`
- Versión de TypeScript
- Otras dependencias de Angular

### Paso 3: Limpieza del Entorno
```bash
# Eliminar dependencias antiguas
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
```

### Paso 4: Actualizar package.json
Actualizar las siguientes dependencias según la versión objetivo:

**Dependencies:**
- `@angular/animations`
- `@angular/common`
- `@angular/compiler`
- `@angular/core`
- `@angular/forms`
- `@angular/platform-browser`
- `@angular/platform-browser-dynamic`
- `@angular/router`
- `@angular/service-worker` (si aplica)
- `rxjs` - Verificar compatibilidad
- `zone.js` - Verificar compatibilidad con la versión de Angular
- `tslib`

**DevDependencies:**
- `@angular/build` (reemplaza a `@angular-devkit/build-angular` en Angular 18+)
- `@angular/cli`
- `@angular/compiler-cli`
- `typescript` - Verificar versión compatible

### Paso 5: Actualizar angular.json (si es necesario)
Para Angular 18+, los builders cambiaron de namespace:

| Anterior | Nuevo (Angular 18+) |
|----------|---------------------|
| `@angular-devkit/build-angular:application` | `@angular/build:application` |
| `@angular-devkit/build-angular:dev-server` | `@angular/build:dev-server` |
| `@angular-devkit/build-angular:extract-i18n` | `@angular/build:extract-i18n` |
| `@angular-devkit/build-angular:karma` | `@angular/build:karma` |

### Paso 6: Instalar Dependencias
```bash
npm install
```

### Paso 7: Verificar Instalación
```bash
npx ng version
```

### Paso 8: Probar la Aplicación
```bash
ng serve
```

### Paso 9: Documentar Cambios
Actualizar `CHANGELOG.md` con:
- Versión nueva del proyecto
- Fecha de actualización
- Lista de dependencias actualizadas
- Cualquier cambio de configuración realizado

## Compatibilidad de Versiones

### Angular 21.x
- TypeScript: >=5.9 <6.0
- zone.js: ~0.15.x o ~0.16.x
- RxJS: ~7.8.x
- Node.js: 20.x o 22.x o 24.x
- ngx-translate: v17.x (usa `provideTranslateService()` + `provideTranslateHttpLoader()`)
- **NO usar `experimentalDecorators`** en tsconfig.json (decoradores TC39 estándar)

### Angular 20.x
- TypeScript: ~5.8.x
- zone.js: ~0.15.x
- RxJS: ~7.8.x
- Node.js: 20.x o 22.x

### Angular 19.x
- TypeScript: ~5.6.x o ~5.7.x
- zone.js: ~0.15.x
- RxJS: ~7.8.x
- Node.js: 18.x, 20.x o 22.x

### Angular 18.x
- TypeScript: ~5.4.x o ~5.5.x
- zone.js: ~0.14.x o ~0.15.x
- RxJS: ~7.8.x
- Node.js: 18.x o 20.x

## Resolución de Problemas Comunes

### Error: peer dependency conflict
Si hay conflictos de dependencias peer:
1. Verificar la versión correcta de `zone.js` para la versión de Angular
2. No usar `--force` o `--legacy-peer-deps` sin entender el problema
3. Ajustar las versiones según la documentación oficial

### Error: Builder not found
Si aparece error de builder no encontrado:
1. Verificar que `angular.json` use los builders correctos
2. Para Angular 18+, usar `@angular/build` en lugar de `@angular-devkit/build-angular`

### Error: TypeScript version mismatch
1. Verificar la versión de TypeScript compatible con la versión de Angular
2. Actualizar `typescript` en devDependencies

## Checklist Final

- [ ] Verificar versiones disponibles con npm view
- [ ] Hacer backup o commit antes de actualizar
- [ ] Eliminar node_modules y package-lock.json
- [ ] Actualizar package.json con versiones correctas
- [ ] Actualizar angular.json si hay cambios de builders
- [ ] Ejecutar npm install
- [ ] Verificar con ng version
- [ ] Probar con ng serve
- [ ] Verificar que no hay vulnerabilidades (npm audit)
- [ ] Actualizar CHANGELOG.md
- [ ] Commit de los cambios
