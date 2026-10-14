import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Auth } from '../../../core/services/auth';
import { Rol } from '../../../core/models/usuario.model';

interface OpcionMenu {
  etiqueta: string;
  ruta: string;
}

const MENU_POR_ROL: Record<Rol, OpcionMenu[]> = {
  paciente: [
    { etiqueta: 'Mis turnos', ruta: '/en-construccion' },
    { etiqueta: 'Reservar turno', ruta: '/en-construccion' },
    { etiqueta: 'Mi perfil', ruta: '/en-construccion' },
  ],
  medico: [
    { etiqueta: 'Mi agenda', ruta: '/en-construccion' },
    { etiqueta: 'Mis turnos', ruta: '/en-construccion' },
    { etiqueta: 'Mi perfil', ruta: '/en-construccion' },
  ],
  operador: [
    { etiqueta: 'Turnos', ruta: '/en-construccion' },
    { etiqueta: 'Pacientes', ruta: '/en-construccion' },
    { etiqueta: 'Mi perfil', ruta: '/en-construccion' },
  ],
  admin: [
    { etiqueta: 'Usuarios', ruta: '/en-construccion' },
    { etiqueta: 'Coberturas', ruta: '/en-construccion' },
    { etiqueta: 'Reportes', ruta: '/en-construccion' },
    { etiqueta: 'Mi perfil', ruta: '/en-construccion' },
  ],
};

const ETIQUETA_ROL: Record<Rol, string> = {
  paciente: 'Paciente',
  medico: 'Médico',
  operador: 'Operador',
  admin: 'Administrador',
};

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly opcionesMenu = computed(() => {
    const rol = this.auth.usuario()?.rol;
    return rol ? MENU_POR_ROL[rol] : [];
  });

  protected readonly etiquetaRol = computed(() => {
    const rol = this.auth.usuario()?.rol;
    return rol ? ETIQUETA_ROL[rol] : '';
  });

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}
