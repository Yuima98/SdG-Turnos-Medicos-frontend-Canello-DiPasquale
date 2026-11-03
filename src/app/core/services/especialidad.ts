import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { IdCreado } from '../models/api.model';
import { Especialidad } from '../models/especialidad.model';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadService {
  private readonly api = inject(Api);

  listar(): Observable<Especialidad[]> {
    return this.api.get<Especialidad[]>('/especialidades');
  }

  crear(datos: Omit<Especialidad, 'id'>): Observable<IdCreado> {
    return this.api.post<IdCreado>('/especialidades', datos);
  }

  modificar(id: number, datos: Omit<Especialidad, 'id'>): Observable<null> {
    return this.api.put(`/especialidades/${id}`, datos);
  }

  eliminar(id: number): Observable<null> {
    return this.api.delete(`/especialidades/${id}`);
  }
}
