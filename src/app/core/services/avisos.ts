import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/** Texto para mostrar al usuario a partir de un error de la API. */
export function mensajeDeError(error: unknown, alternativo = 'Ocurrió un error inesperado.'): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Intentá de nuevo en unos minutos.';
    }
    const estado: unknown = error.error?.estado;
    if (typeof estado === 'string' && estado) {
      return estado.charAt(0).toUpperCase() + estado.slice(1) + '.';
    }
  }
  return alternativo;
}

const POSICION: MatSnackBarConfig = { horizontalPosition: 'end', verticalPosition: 'top' };

@Injectable({
  providedIn: 'root',
})
export class Avisos {
  private readonly snackBar = inject(MatSnackBar);

  exito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { ...POSICION, duration: 4000, panelClass: 'aviso-exito' });
  }

  error(error: unknown, alternativo?: string): void {
    this.snackBar.open(mensajeDeError(error, alternativo), 'Cerrar', {
      ...POSICION,
      duration: 7000,
      panelClass: 'aviso-error',
    });
  }

  informar(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { ...POSICION, duration: 7000 });
  }
}
