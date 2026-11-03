import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { FiltrosMedico, Medico } from '../models/agenda.model';

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  private readonly api = inject(Api);

  listar(filtros: FiltrosMedico = {}): Observable<Medico[]> {
    return this.api.get<Medico[]>('/medicos', { ...filtros });
  }
}
