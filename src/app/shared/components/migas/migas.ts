import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter, map } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { MENU_POR_ROL } from '../../menu-por-rol';

/** Breadcrumbs: se arman con el menú del rol, así no se repiten las rutas. */
@Component({
  selector: 'app-migas',
  imports: [RouterLink, MatIconModule],
  template: `
    @if (actual(); as opcion) {
      <nav aria-label="Ubicación actual">
        <a routerLink="/">Inicio</a>
        <mat-icon aria-hidden="true">chevron_right</mat-icon>
        @if (opcion.grupo) {
          <span>{{ opcion.grupo }}</span>
          <mat-icon aria-hidden="true">chevron_right</mat-icon>
        }
        <span class="actual" aria-current="page">{{ opcion.etiqueta }}</span>
      </nav>
    }
  `,
  styles: `
    nav {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 0.8125rem;
      color: var(--sdg-texto-secundario);
    }

    a {
      color: inherit;
      text-decoration: none;

      &:hover {
        color: var(--sdg-azul-600);
        text-decoration: underline;
      }
    }

    mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--sdg-texto-tenue);
    }

    .actual {
      font-weight: 600;
      color: var(--sdg-texto);
    }
  `,
})
export class Migas {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      map((evento) => evento.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly actual = computed(() => {
    const rol = this.auth.usuario()?.rol;
    const url = this.url();
    return rol ? MENU_POR_ROL[rol].find((opcion) => url.startsWith(opcion.ruta)) : undefined;
  });
}
