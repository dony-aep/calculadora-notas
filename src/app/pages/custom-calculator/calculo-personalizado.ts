export interface Campo {
  nombre: string;
  porcentaje: number | null;
  nota: number | null;
}

export interface CalculadoraPersonalizada {
  campos: Campo[];
  minimaAprobatoria: number | null;
}

export const NOTA_APROBATORIA_POR_DEFECTO = 3.0;
export const CLAVE_GUARDADO = 'calculadoraPersonalizada';

export interface Resultado {
  total: number | null;
  clave: string;
  params: Record<string, string>;
  color: string;
}

export function calcularResultado({ campos, minimaAprobatoria }: CalculadoraPersonalizada): Resultado {
  let notaTotal = 0;
  let porcentajeTotal = 0;
  for (const campo of campos) {
    const nota = campo.nota ?? 0;
    const porcentaje = campo.porcentaje ?? 0;
    if (nota >= 0 && porcentaje > 0) {
      notaTotal += (nota * porcentaje) / 100;
      porcentajeTotal += porcentaje;
    }
  }

  if (porcentajeTotal > 100) {
    return { total: null, clave: 'CUSTOM_CALCULATOR.ERROR_EXCEEDS_MSG', params: { value: porcentajeTotal.toFixed(1) }, color: 'var(--color-danger)' };
  }
  if (porcentajeTotal > 0 && porcentajeTotal < 100) {
    return { total: null, clave: 'CUSTOM_CALCULATOR.WARN_INCOMPLETE_MSG', params: { value: porcentajeTotal.toFixed(1) }, color: 'orange' };
  }
  if (porcentajeTotal === 100) {
    const aprueba = notaTotal >= (minimaAprobatoria ?? NOTA_APROBATORIA_POR_DEFECTO);
    return aprueba
      ? { total: notaTotal, clave: 'CUSTOM_CALCULATOR.PASS_MESSAGE', params: {}, color: 'var(--color-secondary)' }
      : { total: notaTotal, clave: 'CUSTOM_CALCULATOR.FAIL_MESSAGE', params: {}, color: 'var(--color-danger)' };
  }
  return { total: null, clave: '', params: {}, color: '' };
}

const esNumeroONulo = (valor: unknown): valor is number | null =>
  valor === null || (typeof valor === 'number' && Number.isFinite(valor));

function esCampo(valor: unknown): valor is Campo {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const { nombre, porcentaje, nota } = valor as Record<string, unknown>;
  return typeof nombre === 'string' && esNumeroONulo(porcentaje) && esNumeroONulo(nota);
}

// Lo guardado puede venir de otra versión de la app o estar editado a mano:
// se descarta lo que no tenga la forma de un Campo en vez de romper la página.
export function leerCamposGuardados(crudo: string | null): Campo[] {
  if (crudo === null) {
    return [];
  }
  let datos: unknown;
  try {
    datos = JSON.parse(crudo);
  } catch {
    return [];
  }
  return Array.isArray(datos)
    ? datos.filter(esCampo).map(({ nombre, porcentaje, nota }) => ({ nombre, porcentaje, nota }))
    : [];
}
