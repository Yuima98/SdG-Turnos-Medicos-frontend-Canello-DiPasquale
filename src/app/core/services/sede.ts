import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { IdCreado } from '../models/api.model';
import { Sede } from '../models/sede.model';

@Injectable({
  providedIn: 'root',
})
export class SedeService {
  private readonly api = inject(Api);

  listar(): Observable<Sede[]> {
    return this.api.get<Sede[]>('/sedes');
  }

  crear(datos: Omit<Sede, 'id'>): Observable<IdCreado> {
    return this.api.post<IdCreado>('/sedes', datos);
  }

  modificar(id: number, datos: Omit<Sede, 'id'>): Observable<null> {
    return this.api.put(`/sedes/${id}`, datos);
  }

  eliminar(id: number): Observable<null> {
    return this.api.delete(`/sedes/${id}`);
  }
}
