import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Api } from './api';
import { Notificacion } from '../models/notificacion.model';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private readonly api = inject(Api);
  private readonly lista = signal<Notificacion[]>([]);

  readonly notificaciones = this.lista.asReadonly();
  readonly noLeidas = computed(() => this.lista().filter((n) => !n.leida).length);

  /** Si falla se conserva lo último conocido: el contador no debe interrumpir la pantalla actual. */
  refrescar(): void {
    this.api.get<Notificacion[]>('/notificaciones').subscribe({
      next: (notificaciones) => this.lista.set(notificaciones),
      error: () => undefined,
    });
  }

  marcarLeida(id: number): Observable<null> {
    return this.api.patch(`/notificaciones/${id}/leida`).pipe(
      tap(() => {
        this.lista.update((lista) => lista.map((n) => (n.id === id ? { ...n, leida: 1 } : n)));
      }),
    );
  }

  limpiar(): void {
    this.lista.set([]);
  }
}
