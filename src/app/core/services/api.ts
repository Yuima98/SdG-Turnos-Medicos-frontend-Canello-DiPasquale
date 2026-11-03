import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RespuestaApi } from '../models/api.model';

export type Filtros = Record<string, string | number | null | undefined>;

/** Único punto de acceso a la API: arma la URL y devuelve el contenido de `datos`. */
@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly http = inject(HttpClient);

  get<T>(ruta: string, filtros: Filtros = {}): Observable<T> {
    return this.http
      .get<RespuestaApi<T>>(this.url(ruta), { params: this.parametros(filtros) })
      .pipe(map((respuesta) => respuesta.datos));
  }

  post<T>(ruta: string, cuerpo: unknown): Observable<T> {
    return this.http
      .post<RespuestaApi<T>>(this.url(ruta), cuerpo)
      .pipe(map((respuesta) => respuesta.datos));
  }

  put<T = null>(ruta: string, cuerpo: unknown): Observable<T> {
    return this.http
      .put<RespuestaApi<T>>(this.url(ruta), cuerpo)
      .pipe(map((respuesta) => respuesta.datos));
  }

  patch<T = null>(ruta: string, cuerpo: unknown = {}): Observable<T> {
    return this.http
      .patch<RespuestaApi<T>>(this.url(ruta), cuerpo)
      .pipe(map((respuesta) => respuesta.datos));
  }

  delete<T = null>(ruta: string): Observable<T> {
    return this.http
      .delete<RespuestaApi<T>>(this.url(ruta))
      .pipe(map((respuesta) => respuesta.datos));
  }

  private url(ruta: string): string {
    return `${environment.apiUrl}${ruta}`;
  }

  private parametros(filtros: Filtros): HttpParams {
    return Object.entries(filtros).reduce((parametros, [clave, valor]) => {
      return valor === null || valor === undefined || valor === ''
        ? parametros
        : parametros.set(clave, valor);
    }, new HttpParams());
  }
}
