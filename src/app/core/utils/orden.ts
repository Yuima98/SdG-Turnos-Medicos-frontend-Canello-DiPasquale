import { Sort } from '@angular/material/sort';

export const SIN_ORDEN: Sort = { active: '', direction: '' };

/** Ordena en el navegador un listado ya cargado; sin dirección conserva el orden de la API. */
export function ordenar<T>(
  filas: readonly T[],
  orden: Sort,
  valor: (fila: T, columna: string) => string | number | null,
): T[] {
  if (!orden.direction) {
    return [...filas];
  }
  const signo = orden.direction === 'asc' ? 1 : -1;
  return [...filas].sort((a, b) => {
    const textoA = String(valor(a, orden.active) ?? '');
    const textoB = String(valor(b, orden.active) ?? '');
    return signo * textoA.localeCompare(textoB, 'es', { numeric: true });
  });
}
