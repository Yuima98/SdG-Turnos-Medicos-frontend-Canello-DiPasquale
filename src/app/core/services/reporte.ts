import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Api } from './api';
import {
  FiltrosReporte,
  RankingMedico,
  Reportes,
  TasaCancelacion,
  TurnosPorEspecialidad,
  TurnosPorSede,
} from '../models/gestion.model';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private readonly api = inject(Api);

  /** Pide los cuatro indicadores juntos para que todos respondan al mismo rango de fechas. */
  obtener(filtros: FiltrosReporte): Observable<Reportes> {
    const parametros = { ...filtros };
    return forkJoin({
      especialidades: this.api.get<TurnosPorEspecialidad[]>('/reportes/turnos-por-especialidad', parametros),
      sedes: this.api.get<TurnosPorSede[]>('/reportes/turnos-por-sede', parametros),
      ranking: this.api.get<RankingMedico[]>('/reportes/ranking-medicos', parametros),
      cancelacion: this.api.get<TasaCancelacion>('/reportes/tasa-cancelacion', parametros),
    });
  }
}
