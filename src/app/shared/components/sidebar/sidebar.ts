import { Component, computed, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Auth } from '../../../core/services/auth';
import { MENU_POR_ROL, OpcionMenu } from '../../menu-por-rol';
import { Logo } from '../logo/logo';

interface GrupoMenu {
  titulo?: string;
  opciones: OpcionMenu[];
}

/** Navegación lateral: muestra los módulos del rol de la sesión. */
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatListModule, Logo],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly auth = inject(Auth);

  readonly navegacion = output<void>();

  protected readonly grupos = computed(() => {
    const rol = this.auth.usuario()?.rol;
    const grupos: GrupoMenu[] = [];
    for (const opcion of rol ? MENU_POR_ROL[rol] : []) {
      const ultimo = grupos.at(-1);
      if (ultimo && ultimo.titulo === opcion.grupo) {
        ultimo.opciones.push(opcion);
      } else {
        grupos.push({ titulo: opcion.grupo, opciones: [opcion] });
      }
    }
    return grupos;
  });
}
