import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { IdCreado } from '../models/api.model';
import { Cobertura } from '../models/cobertura.model';

@Injectable({
  providedIn: 'root',
})
export class CoberturaService {
  private readonly api = inject(Api);

  listar(): Observable<Cobertura[]> {
    return this.api.get<Cobertura[]>('/coberturas');
  }

  crear(datos: Omit<Cobertura, 'id'>): Observable<IdCreado> {
    return this.api.post<IdCreado>('/coberturas', datos);
  }

  modificar(id: number, datos: Omit<Cobertura, 'id'>): Observable<null> {
    return this.api.put(`/coberturas/${id}`, datos);
  }

  eliminar(id: number): Observable<null> {
    return this.api.delete(`/coberturas/${id}`);
  }
}
