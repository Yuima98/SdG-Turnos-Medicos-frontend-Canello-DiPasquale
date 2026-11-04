import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { map } from 'rxjs';
import { Auth } from './core/services/auth';
import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';
import { Sidebar } from './shared/components/sidebar/sidebar';

const PANTALLA_COMPACTA = '(max-width: 959.98px)';

@Component({
  selector: 'app-root',
  imports: [CdkScrollable, RouterOutlet, MatSidenavModule, Header, Footer, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly auth = inject(Auth);

  protected readonly compacto = toSignal(
    inject(BreakpointObserver)
      .observe(PANTALLA_COMPACTA)
      .pipe(map((estado) => estado.matches)),
    { initialValue: false },
  );

  /** En escritorio el menú acompaña al contenido; en pantallas chicas se abre por encima. */
  private readonly sidebarEscritorio = signal(true);
  protected readonly sidebarMovil = signal(false);

  protected readonly sidebarVisible = computed(() => {
    const abierta = this.compacto() ? this.sidebarMovil() : this.sidebarEscritorio();
    return this.auth.estaLogueado() && abierta;
  });

  protected alternarSidebar(): void {
    const sidebar = this.compacto() ? this.sidebarMovil : this.sidebarEscritorio;
    sidebar.update((abierta) => !abierta);
  }
}
