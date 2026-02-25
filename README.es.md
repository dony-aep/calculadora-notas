# Calculadora de Notas

> Aplicación web PWA para calcular notas académicas de la Universidad Americana (Colombia).

![CalNotas Preview](calnotas-preview.png)

## Descripción

La Calculadora de Notas permite a los estudiantes ingresar sus notas formativas y cognitivas para tres cortes diferentes. Basado en los porcentajes de evaluación establecidos por la universidad, la aplicación calculará automáticamente las notas definitivas y la nota definitiva total.

## Funcionalidades

### Calculadora Predeterminada
- **Ingreso de Notas:** Introduce tus notas formativas y cognitivas en los campos correspondientes.
- **Cálculo Automático:** Los resultados se calcularán automáticamente en tiempo real.
- **Ayuda en Línea:** Un botón de ayuda proporciona instrucciones sobre cómo usar la calculadora y un ejemplo de cálculo.
- **Restablecer:** Opción para restablecer todos los campos y resultados.

### Calculadora Personalizada
- **Campos Personalizables:** Añade tantos campos como necesites con nombres y porcentajes personalizados.
- **Porcentajes Flexibles:** Define tus propios porcentajes para cada campo.
- **Guardado Local:** Guarda tu configuración personalizada para uso futuro.
- **Validación de Porcentajes:** Asegura que los porcentajes sumen 100%.

### Características Generales
- **Cambio de Tema:** Alterna entre modo claro y oscuro según tu preferencia.
- **Idiomas:** Soporte para español e inglés con traducción en tiempo real.
- **Diseño Responsivo:** Adaptable a cualquier dispositivo (móvil, tablet, escritorio).
- **PWA:** Instalable como aplicación progresiva web.
- **Modo Offline:** Funciona sin conexión a internet.

## Acceso

Accede a la aplicación en: [https://calnotas.vercel.app/](https://calnotas.vercel.app/)

## Uso

1. **Elegir Calculadora:** Selecciona entre la calculadora predeterminada o personalizada.
2. **Calculadora Predeterminada:** Ingresa las notas formativas y cognitivas. Los resultados se muestran en tiempo real.
3. **Calculadora Personalizada:** Crea campos con nombres y porcentajes personalizados. Guarda tu configuración para uso futuro.
4. **Personalización:** Cambia entre modo claro/oscuro y selecciona tu idioma preferido (español/inglés).

## Sistema de Evaluación 2025

| Corte | Nota Formativa | Nota Cognitiva | Total |
|-------|---------------|----------------|-------|
| Corte 1 | 15% | 15% | 30% |
| Corte 2 | 15% | 15% | 30% |
| Corte 3 | 20% | 20% | 40% |

### Ejemplo

Para una Nota Formativa de 4.5 y una Nota Cognitiva de 3.0:

```
Corte 1: (4.5 × 0.15) + (3.0 × 0.15) = 1.13
Corte 2: (4.5 × 0.15) + (3.0 × 0.15) = 1.13
Corte 3: (4.5 × 0.20) + (3.0 × 0.20) = 1.50
Total:   1.13 + 1.13 + 1.50 = 3.76 ✓
```

La nota final debe ser ≥ 3.0 para aprobar.

## Stack Tecnológico

- **Framework:** Angular 21
- **Estilos:** CSS con variables (temas claro/oscuro)
- **i18n:** ngx-translate (español/inglés)
- **PWA:** Angular Service Worker
- **Despliegue:** Vercel

## Desarrollo

```bash
npm start          # Servidor de desarrollo en http://localhost:4200
npm run build      # Build de producción
npm test           # Tests
```

## Créditos

Desarrollado por [dony.](https://github.com/dony-aep)

## Licencia

[MIT](https://opensource.org/licenses/MIT)
