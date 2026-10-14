import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cobertura } from '../models/cobertura.model';

@Injectable({
  providedIn: 'root',
})
export class CoberturaService {
  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Cobertura[]> {
    return this.http
      .get<{ datos: Cobertura[] }>(`${environment.apiUrl}/coberturas`)
      .pipe(map((respuesta) => respuesta.datos));
  }
}