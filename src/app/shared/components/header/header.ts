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
    { etiqueta: 'Mis turnos', ruta: '/paciente/en-construccion' },
    { etiqueta: 'Reservar turno', ruta: '/paciente/en-construccion' },
    { etiqueta: 'Mi perfil', ruta: '/paciente/mi-perfil' },
  ],
  medico: [
    { etiqueta: 'Mi agenda', ruta: '/medico/en-construccion' },
    { etiqueta: 'Mis turnos', ruta: '/medico/en-construccion' },
    { etiqueta: 'Mi perfil', ruta: '/medico/mi-perfil' },
  ],
  operador: [
    { etiqueta: 'Turnos', ruta: '/operador/en-construccion' },
    { etiqueta: 'Pacientes', ruta: '/operador/en-construccion' },
    { etiqueta: 'Mi perfil', ruta: '/operador/mi-perfil' },
  ],
  admin: [
    { etiqueta: 'Usuarios', ruta: '/admin/en-construccion' },
    { etiqueta: 'Coberturas', ruta: '/admin/en-construccion' },
    { etiqueta: 'Reportes', ruta: '/admin/en-construccion' },
    { etiqueta: 'Mi perfil', ruta: '/admin/mi-perfil' },
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
