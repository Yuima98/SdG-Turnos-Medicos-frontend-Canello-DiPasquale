import { Component, computed, effect, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { filter } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { NotificacionService } from '../../../core/services/notificacion';
import { ETIQUETA_ROL } from '../../../core/models/usuario.model';
import { MENU_POR_ROL } from '../../menu-por-rol';
import { Logo } from '../logo/logo';
import { Notificaciones } from '../notificaciones/notificaciones';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    Logo,
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
