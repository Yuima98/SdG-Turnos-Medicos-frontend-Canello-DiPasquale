import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { Pagina } from '../models/api.model';
import { FiltrosAuditoria, RegistroAuditoria } from '../models/gestion.model';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  private readonly api = inject(Api);

  listar(filtros: FiltrosAuditoria): Observable<Pagina<RegistroAuditoria>> {
    return this.api.get<Pagina<RegistroAuditoria>>('/auditoria', { ...filtros });
  }
}
