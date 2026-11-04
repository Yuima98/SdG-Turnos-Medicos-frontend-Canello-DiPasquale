import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Turno } from '../../../core/models/turno.model';
import { Avisos } from '../../../core/services/avisos';
import { TurnoService } from '../../../core/services/turno';
import { Carga } from '../../../core/utils/carga';
import { momentoTurno } from '../../../core/utils/fechas';
import { Confirmacion } from '../../../shared/components/confirmacion/confirmacion';
import { EstadoLista } from '../../../shared/components/estado-lista/estado-lista';
import { EstadoTurnoEtiqueta } from '../../../shared/components/estado-turno/estado-turno';

@Component({
  selector: 'app-mis-turnos',
  imports: [DatePipe, RouterLink, EstadoLista, EstadoTurnoEtiqueta, MatButtonModule, MatExpansionModule, MatIconModule],
  templateUrl: './mis-turnos.html',
  styleUrl: './mis-turnos.scss',
})
export class MisTurnos {
  private readonly turnoService = inject(TurnoService);
  private readonly confirmacion = inject(Confirmacion);
  private readonly avisos = inject(Avisos);

  protected readonly lista = new Carga<Turno[]>([]);

  /** Primero los que vienen, del más cercano al más lejano; después los pasados, del más reciente al más antiguo. */
  protected readonly turnos = computed(() => {
    const ahora = Date.now();
    const turnos = this.lista.datos();
    const proximos = turnos.filter((t) => momentoTurno(t) >= ahora).sort((a, b) => momentoTurno(a) - momentoTurno(b));
    const pasados = turnos.filter((t) => momentoTurno(t) < ahora).sort((a, b) => momentoTurno(b) - momentoTurno(a));
    return [...proximos, ...pasados];
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.lista.ejecutar(this.turnoService.listar());
  }

  cancelar(turno: Turno): void {
    this.confirmacion
      .pedir('Cancelar turno', `¿Está seguro de cancelar el turno de las ${turno.hora} con ${turno.medico_nombre} ${turno.medico_apellido}?`, 'Sí, cancelar turno')
      .subscribe((confirmado) => {
        if (!confirmado) {
          return;
        }
        this.turnoService.cancelar(turno.id).subscribe({
          next: () => {
            this.avisos.exito('Se canceló el turno.');
            this.cargar();
          },
          error: (error: unknown) => this.avisos.error(error, 'No se pudo cancelar el turno.'),
        });
      });
  }
}
