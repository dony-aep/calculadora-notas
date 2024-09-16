---

# Calculadora de Notas

Bienvenido al proyecto **Calculadora de Notas**. Esta aplicación web está diseñada para ayudar a los estudiantes de la Universidad Americana en Colombia a calcular sus notas de manera rápida y eficiente. La calculadora permite ingresar notas formativas y cognitivas para obtener una nota definitiva y una nota definitiva total.

## Descripción

La Calculadora de Notas permite a los estudiantes ingresar sus notas formativas y cognitivas para tres cortes diferentes. Basado en los porcentajes de evaluación establecidos por la universidad, la aplicación calculará automáticamente las notas definitivas y la nota definitiva total.

## Funcionalidades

- **Ingreso de Notas:** Introduce tus notas formativas y cognitivas en los campos correspondientes.
- **Cálculo Automático:** Los resultados se calcularán automáticamente en tiempo real.
- **Ayuda en Línea:** Un botón de ayuda proporciona instrucciones sobre cómo usar la calculadora y un ejemplo de cálculo.
- **Modo Oscuro:** Cambia entre el modo claro y oscuro.
- **Restablecer:** Opción para restablecer todos los campos y resultados.
- **Icono y Manifest:** Configuración para usar como Progressive Web App (PWA).

## Estructura del Proyecto

- **`index.html`**: Archivo principal HTML que contiene la estructura de la página.
- **`styles.css`**: Hoja de estilos CSS para la apariencia de la página.
- **`script.js`**: Archivo JavaScript que maneja la lógica de la calculadora y las interacciones.
- **`manifest.json`**: Archivo de configuración para la PWA.
- **`service-worker.js`**: Archivo de servicio para la funcionalidad offline de la PWA (no incluido en este README, pero mencionado en el código).

## Instalación

No se requiere instalación especial para el uso básico. Simplemente abre el archivo `index.html` en tu navegador para acceder a la calculadora.

## Uso

1. **Introducir Notas:**
   - Ingrese las notas formativas y cognitivas en los campos proporcionados.
   - La calculadora automáticamente calculará las notas definitivas para cada corte y la nota definitiva total.

2. **Ver Resultados:**
   - Los resultados se mostrarán en los campos correspondientes debajo de cada grupo de notas.

3. **Restablecer Datos:**
   - Haga clic en el botón "Restablecer" para limpiar todos los campos y resultados.

4. **Obtener Ayuda:**
   - Haga clic en el botón de ayuda (`?`) para ver instrucciones sobre cómo usar la calculadora.

5. **Cambiar Modo:**
   - Haga clic en el botón de modo oscuro para alternar entre el modo claro y oscuro.

## Ejemplo de Cálculo

- **Nota Formativa 1:** 4.5
- **Nota Cognitiva 1:** 3.0

**Nota Definitiva 1 (Corte 1):**
```
(4.5 * 0.09) + (3.0 * 0.21) = 0.405 + 0.63 = 1.035
```

**Nota Definitiva Total:**
```
Nota Definitiva 1 + Nota Definitiva 2 + Nota Definitiva 3
```

**Nota Final:** Asegúrate de que la nota final total sea mayor o igual a 3.0 para aprobar.

## Metadatos

- **Descripción:** Calculadora de Notas en línea para estudiantes de la Universidad Americana, Colombia.
- **Open Graph:** Configuración para compartir en redes sociales.
- **Twitter Card:** Configuración para compartir en Twitter.

## Créditos

Desarrollado por [dony](https://calnotas.vercel.app/). 

## Licencia

Este proyecto está licenciado bajo los términos de la [Licencia MIT](https://opensource.org/licenses/MIT).

---
