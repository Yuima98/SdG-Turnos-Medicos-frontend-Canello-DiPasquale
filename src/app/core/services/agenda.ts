import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { IdCreado } from '../models/api.model';
import {
  FiltrosAgenda,
  FiltrosDisponibilidad,
  HorarioLibre,
  RangoAgenda,
  RangoRequest,
} from '../models/agenda.model';

@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  private readonly api = inject(Api);

  listar(filtros: FiltrosAgenda): Observable<RangoAgenda[]> {
    return this.api.get<RangoAgenda[]>('/agenda', { ...filtros });
  }

  crear(datos: RangoRequest): Observable<IdCreado> {
    return this.api.post<IdCreado>('/agenda', datos);
  }

  modificar(id: number, datos: RangoRequest): Observable<null> {
    return this.api.put(`/agenda/${id}`, datos);
  }

  eliminar(id: number): Observable<null> {
    return this.api.delete(`/agenda/${id}`);
  }

  fechasDisponibles(filtros: FiltrosDisponibilidad): Observable<string[]> {
    return this.api.get<string[]>('/agenda/disponibilidad/fechas', { ...filtros });
  }

  horariosDisponibles(filtros: FiltrosDisponibilidad, fecha: string): Observable<HorarioLibre[]> {
    return this.api.get<HorarioLibre[]>('/agenda/disponibilidad/horarios', { ...filtros, fecha });
  }
}
