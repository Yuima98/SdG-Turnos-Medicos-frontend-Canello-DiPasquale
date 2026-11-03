import { WritableSignal, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { mensajeDeError } from '../services/avisos';

/**
 * Estado de un dato que viene de la API: valor, indicador de carga y mensaje de error.
 * Una carga nueva descarta la anterior, así un filtro cambiado rápido no pisa el resultado.
 */
export class Carga<T> {
  readonly datos: WritableSignal<T>;
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  private suscripcion?: Subscription;

  constructor(private readonly valorInicial: T) {
    this.datos = signal(valorInicial);
  }

  ejecutar(origen: Observable<T>): void {
    this.suscripcion?.unsubscribe();
    this.cargando.set(true);
    this.error.set(null);

    this.suscripcion = origen.subscribe({
      next: (datos) => {
        this.datos.set(datos);
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        this.datos.set(this.valorInicial);
        this.error.set(mensajeDeError(error, 'No se pudieron cargar los datos.'));
        this.cargando.set(false);
      },
    });
  }
}
