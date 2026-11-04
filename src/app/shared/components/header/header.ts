import { Component, computed, effect, inject, input, output } from '@angular/core';
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
import { ETIQUETA_ROL } from '../../../core/models/usuario.model';
import { Logo } from '../logo/logo';
import { Migas } from '../migas/migas';
import { Notificaciones } from '../notificaciones/notificaciones';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    Logo,
    Migas,
    Notificaciones,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly auth = inject(Auth);
  private readonly notificaciones = inject(NotificacionService);
  private readonly router = inject(Router);

  /** Con la barra lateral abierta, la marca ya está a la vista y no se repite. */
  readonly marcaEnSidebar = input(false);
  readonly alternarMenu = output<void>();

  protected readonly iniciales = computed(() => {
    const usuario = this.auth.usuario();
    return usuario ? `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase() : '';
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
