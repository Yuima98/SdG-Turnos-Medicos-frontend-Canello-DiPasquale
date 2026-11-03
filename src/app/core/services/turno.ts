import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Api } from './api';
import { NotificacionService } from './notificacion';
import { IdCreado } from '../models/api.model';
import { AtencionRequest, FiltrosTurno, Turno, TurnoRequest } from '../models/turno.model';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private readonly api = inject(Api);
  private readonly notificaciones = inject(NotificacionService);

  listar(filtros: FiltrosTurno = {}): Observable<Turno[]> {
    return this.api.get<Turno[]>('/turno', { ...filtros });
  }

  crear(datos: TurnoRequest): Observable<IdCreado> {
    return this.api.post<IdCreado>('/turno', datos).pipe(tap(() => this.notificaciones.refrescar()));
  }

  cancelar(id: number): Observable<null> {
    return this.api.patch(`/turno/${id}/cancelar`).pipe(tap(() => this.notificaciones.refrescar()));
  }

  atender(id: number, datos: AtencionRequest): Observable<null> {
    return this.api.patch(`/turno/${id}/atender`, datos).pipe(tap(() => this.notificaciones.refrescar()));
  }
}
