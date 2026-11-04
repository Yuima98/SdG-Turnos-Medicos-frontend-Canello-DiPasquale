import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../core/services/auth';
import { MENU_POR_ROL } from '../../shared/menu-por-rol';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly auth = inject(Auth);

  protected readonly accesos = computed(() => {
    const rol = this.auth.usuario()?.rol;
    return rol ? MENU_POR_ROL[rol] : [];
  });
}
