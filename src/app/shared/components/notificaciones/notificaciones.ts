import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Avisos } from '../../../core/services/avisos';
import { NotificacionService } from '../../../core/services/notificacion';

@Component({
  selector: 'app-notificaciones',
  imports: [DatePipe, MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './notificaciones.html',
})
export class Notificaciones {
  protected readonly servicio = inject(NotificacionService);
  private readonly avisos = inject(Avisos);

  marcarLeida(id: number): void {
    this.servicio.marcarLeida(id).subscribe({
      error: (error: unknown) => this.avisos.error(error, 'No se pudo marcar la notificación.'),
    });
  }
}
