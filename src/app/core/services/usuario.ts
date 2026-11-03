import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { IdCreado, Pagina } from '../models/api.model';
import { FiltrosUsuario, UsuarioGestion, UsuarioRequest } from '../models/gestion.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly api = inject(Api);

  listar(filtros: FiltrosUsuario): Observable<Pagina<UsuarioGestion>> {
    return this.api.get<Pagina<UsuarioGestion>>('/usuarios', { ...filtros });
  }

  crear(datos: UsuarioRequest): Observable<IdCreado> {
    return this.api.post<IdCreado>('/usuarios', datos);
  }

  modificar(id: number, datos: UsuarioRequest): Observable<null> {
    return this.api.put(`/usuarios/${id}`, datos);
  }
}
