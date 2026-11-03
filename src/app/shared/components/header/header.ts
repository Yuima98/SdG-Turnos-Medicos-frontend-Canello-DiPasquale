import { Component, computed, effect, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { NotificacionService } from '../../../core/services/notificacion';
import { ETIQUETA_ROL, Rol } from '../../../core/models/usuario.model';
import { Notificaciones } from '../notificaciones/notificaciones';

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
    { etiqueta: 'Mi agenda', ruta: '/medico/agenda' },
    { etiqueta: 'Turnos programados', ruta: '/medico/turnos' },
    { etiqueta: 'Historial clínico', ruta: '/medico/historial' },
  ],
  operador: [
    { etiqueta: 'Turnos', ruta: '/en-construccion' },
    { etiqueta: 'Pacientes', ruta: '/en-construccion' },
    { etiqueta: 'Mi perfil', ruta: '/en-construccion' },
  ],
  admin: [
    { etiqueta: 'Usuarios', ruta: '/admin/usuarios' },
    { etiqueta: 'Sedes', ruta: '/admin/sedes' },
    { etiqueta: 'Especialidades', ruta: '/admin/especialidades' },
    { etiqueta: 'Coberturas', ruta: '/admin/coberturas' },
    { etiqueta: 'Auditoría', ruta: '/admin/auditoria' },
    { etiqueta: 'Reportes', ruta: '/admin/reportes' },
    { etiqueta: 'Mi perfil', ruta: '/en-construccion' },
  ],
};

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    Notificaciones,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly auth = inject(Auth);
  private readonly notificaciones = inject(NotificacionService);
  private readonly router = inject(Router);

  protected readonly opcionesMenu = computed(() => {
    const rol = this.auth.usuario()?.rol;
    return rol ? MENU_POR_ROL[rol] : [];
  });

  protected readonly etiquetaRol = computed(() => {
    const rol = this.auth.usuario()?.rol;
    return rol ? ETIQUETA_ROL[rol] : '';
  });

  constructor() {
    effect(() => {
      if (this.auth.estaLogueado()) {
        this.notificaciones.refrescar();
      } else {
        this.notificaciones.limpiar();
      }
    });

    // Lo que generó otro usuario se ve la próxima vez que se navega: no hay tiempo real.
    this.router.events
      .pipe(
        filter((evento) => evento instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        if (this.auth.estaLogueado()) {
          this.notificaciones.refrescar();
        }
      });
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}
