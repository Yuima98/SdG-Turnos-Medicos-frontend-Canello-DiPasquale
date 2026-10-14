import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegistroRequest } from '../models/auth.model';
import { Usuario } from '../models/usuario.model';

export const TOKEN_KEY = 'sdg_token';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly usuarioActual = signal<Usuario | null>(null);

  readonly usuario = this.usuarioActual.asReadonly();
  readonly estaLogueado = computed(() => this.usuarioActual() !== null);

  constructor(private readonly http: HttpClient) {
    if (this.obtenerToken()) {
      this.cargarPerfil().subscribe({
        error: () => this.cerrarSesion(),
      });
    }
  }

  registrar(datos: RegistroRequest): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/auth/registro`, datos);
  }

  login(credenciales: LoginRequest): Observable<Usuario> {
    return this.http
      .post<{ datos: LoginResponse }>(`${environment.apiUrl}/auth/login`, credenciales)
      .pipe(
        tap((respuesta) => localStorage.setItem(TOKEN_KEY, respuesta.datos.token)),
        switchMap(() => this.cargarPerfil()),
      );
  }

  cargarPerfil(): Observable<Usuario> {
    return this.http.get<{ datos: Usuario }>(`${environment.apiUrl}/auth/perfil`).pipe(
      map((respuesta) => respuesta.datos),
      tap((usuario) => this.usuarioActual.set(usuario)),
    );
  }

  cerrarSesion(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.usuarioActual.set(null);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
