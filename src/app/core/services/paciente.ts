import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { IdCreado } from '../models/api.model';
import { RegistroRequest } from '../models/auth.model';
import { MisDatosRequest, Paciente, RegistroHistorial } from '../models/turno.model';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private readonly api = inject(Api);

  buscar(texto: string): Observable<Paciente[]> {
    return this.api.get<Paciente[]>('/pacientes', { q: texto });
  }

  crear(datos: RegistroRequest): Observable<IdCreado> {
    return this.api.post<IdCreado>('/pacientes', datos);
  }

  actualizarMisDatos(datos: MisDatosRequest): Observable<null> {
    return this.api.put('/pacientes/mis-datos', datos);
  }

  historial(idPaciente: number): Observable<RegistroHistorial[]> {
    return this.api.get<RegistroHistorial[]>(`/historial-clinico/paciente/${idPaciente}`);
  }
}
