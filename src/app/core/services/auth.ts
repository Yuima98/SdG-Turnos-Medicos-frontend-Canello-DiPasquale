import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { Api } from './api';
import { IdCreado } from '../models/api.model';
import { LoginRequest, LoginResponse, RegistroRequest } from '../models/auth.model';
import { Usuario } from '../models/usuario.model';

const TOKEN_KEY = 'sdg_token';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly api = inject(Api);
  private readonly usuarioActual = signal<Usuario | null>(null);

  readonly usuario = this.usuarioActual.asReadonly();
  readonly estaLogueado = computed(() => this.usuarioActual() !== null);

  registrar(datos: RegistroRequest): Observable<IdCreado> {
    return this.api.post<IdCreado>('/auth/registro', datos);
  }

  login(credenciales: LoginRequest): Observable<Usuario> {
    return this.api.post<LoginResponse>('/auth/login', credenciales).pipe(
      tap((respuesta) => localStorage.setItem(TOKEN_KEY, respuesta.token)),
      switchMap(() => this.cargarPerfil()),
    );
  }

  cargarPerfil(): Observable<Usuario> {
    return this.api.get<Usuario>('/auth/perfil').pipe(tap((usuario) => this.usuarioActual.set(usuario)));
  }

  cerrarSesion(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.usuarioActual.set(null);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
