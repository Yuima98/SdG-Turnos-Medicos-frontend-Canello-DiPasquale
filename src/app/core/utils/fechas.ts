import { Injectable } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';
import { Turno } from '../models/turno.model';

/** Fecha local en el formato "YYYY-MM-DD" que usa la API. */
export function aFechaIso(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/** Interpreta "YYYY-MM-DD" como fecha local, sin corrimientos por zona horaria. */
export function desdeFechaIso(fecha: string): Date {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

/** Instante en que empieza un turno, para ordenarlo o compararlo con el momento actual. */
export function momentoTurno(turno: Turno): number {
  const [horas, minutos] = turno.hora.split(':').map(Number);
  const fecha = desdeFechaIso(turno.fecha);
  fecha.setHours(horas, minutos);
  return fecha.getTime();
}

export function calcularEdad(fechaNacimiento: string, referencia = new Date()): number {
  const nacimiento = desdeFechaIso(fechaNacimiento);
  const edad = referencia.getFullYear() - nacimiento.getFullYear();
  const yaCumplio =
    referencia.getMonth() > nacimiento.getMonth() ||
    (referencia.getMonth() === nacimiento.getMonth() && referencia.getDate() >= nacimiento.getDate());
  return yaCumplio ? edad : edad - 1;
}

export const FORMATOS_FECHA: MatDateFormats = {
  parse: { dateInput: null },
  display: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

/** Permite escribir las fechas a mano como día/mes/año. */
@Injectable()
export class FechaAdapter extends NativeDateAdapter {
  override parse(valor: unknown): Date | null {
    if (typeof valor === 'string') {
      const partes = valor.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (partes) {
        const [dia, mes, anio] = partes.slice(1).map(Number);
        const fecha = new Date(anio, mes - 1, dia);
        return fecha.getMonth() === mes - 1 ? fecha : this.invalid();
      }
    }
    return super.parse(valor);
  }
}
