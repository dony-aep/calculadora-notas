export const NOTA_APROBATORIA = 3.0;
export const NOTA_MAXIMA = 5;

export const CAMPOS = ['formativa1', 'cognitiva1', 'formativa2', 'cognitiva2', 'formativa3', 'cognitiva3'] as const;
export type CampoNota = (typeof CAMPOS)[number];
export type NotasUa = Record<CampoNota, number | null>;

export const NOTAS_VACIAS: NotasUa = {
  formativa1: null,
  cognitiva1: null,
  formativa2: null,
  cognitiva2: null,
  formativa3: null,
  cognitiva3: null
};

export const PORCENTAJES: Record<CampoNota, number> = {
  formativa1: 15,
  cognitiva1: 15,
  formativa2: 15,
  cognitiva2: 15,
  formativa3: 20,
  cognitiva3: 20
};

const CORTES: readonly (readonly [CampoNota, CampoNota])[] = [
  ['formativa1', 'cognitiva1'],
  ['formativa2', 'cognitiva2'],
  ['formativa3', 'cognitiva3']
];

export interface ResultadoCortes {
  definitivas: number[];
  total: number;
}

export type EstadoPrediccion = 'none' | 'guaranteed' | 'possible' | 'impossible' | 'complete';

export interface Prediccion {
  estado: EstadoPrediccion;
  notaMinima: number;
  camposVacios: number;
  notaSeguridad: number | null;
  campoSeguridad: CampoNota | null;
}

// Cada corte se redondea a dos decimales antes de sumar, como en la planilla
// de la universidad; el total no se redondea hasta mostrarse.
export function calcularCortes(notas: Record<CampoNota, number>): ResultadoCortes {
  const definitivas = CORTES.map(([formativa, cognitiva]) => parseFloat(
    (notas[formativa] * (PORCENTAJES[formativa] / 100) + notas[cognitiva] * (PORCENTAJES[cognitiva] / 100)).toFixed(2)
  ));
  return { definitivas, total: definitivas[0] + definitivas[1] + definitivas[2] };
}

export function rellenar(notas: NotasUa, relleno: number): Record<CampoNota, number> {
  return {
    formativa1: notas.formativa1 ?? relleno,
    cognitiva1: notas.cognitiva1 ?? relleno,
    formativa2: notas.formativa2 ?? relleno,
    cognitiva2: notas.cognitiva2 ?? relleno,
    formativa3: notas.formativa3 ?? relleno,
    cognitiva3: notas.cognitiva3 ?? relleno
  };
}

const aprueba = (notas: Record<CampoNota, number>) => calcularCortes(notas).total >= NOTA_APROBATORIA;

// Primera nota, en pasos de 0.1 hasta 5.0, con la que se cumple la condición.
function buscarNotaMinima(cumple: (nota: number) => boolean): number | null {
  for (let paso = 1; paso <= NOTA_MAXIMA * 10; paso++) {
    if (cumple(paso / 10)) {
      return paso / 10;
    }
  }
  return null;
}

export function calcularPrediccion(notas: NotasUa): Prediccion {
  const vacios = CAMPOS.filter(campo => notas[campo] === null);
  const sinPrediccion = { notaMinima: 0, camposVacios: vacios.length, notaSeguridad: null, campoSeguridad: null };

  if (vacios.length === CAMPOS.length) {
    return { estado: 'none', ...sinPrediccion };
  }
  if (vacios.length === 0) {
    return { estado: 'complete', ...sinPrediccion };
  }
  if (aprueba(rellenar(notas, 0))) {
    return { estado: 'guaranteed', ...sinPrediccion };
  }
  if (!aprueba(rellenar(notas, NOTA_MAXIMA))) {
    return { estado: 'impossible', ...sinPrediccion };
  }

  const notaMinima = buscarNotaMinima(nota => aprueba(rellenar(notas, nota))) ?? NOTA_MAXIMA;

  // Nota que asegura aprobar en el siguiente campo vacío por sí sola, con 0.0
  // en los demás vacíos. Con un solo vacío coincide con notaMinima.
  let notaSeguridad: number | null = null;
  let campoSeguridad: CampoNota | null = null;
  if (vacios.length >= 2) {
    const siguiente = vacios[0];
    notaSeguridad = buscarNotaMinima(nota => aprueba({ ...rellenar(notas, 0), [siguiente]: nota }));
    campoSeguridad = notaSeguridad === null ? null : siguiente;
  }

  return { estado: 'possible', notaMinima, camposVacios: vacios.length, notaSeguridad, campoSeguridad };
}
