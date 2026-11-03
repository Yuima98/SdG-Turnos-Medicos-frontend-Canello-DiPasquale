import { Component, effect, inject, input, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RangoAgenda } from '../../../core/models/agenda.model';
import { AgendaService } from '../../../core/services/agenda';
import { Avisos } from '../../../core/services/avisos';
import { Carga } from '../../../core/utils/carga';
import { aFechaIso } from '../../../core/utils/fechas';
import { Confirmacion } from '../../../shared/components/confirmacion/confirmacion';
import { EstadoLista } from '../../../shared/components/estado-lista/estado-lista';
import { DatosRangoDialogo, RangoDialogo } from '../rango-dialogo/rango-dialogo';

/** Rangos horarios de un médico en una fecha, con alta, modificación y baja. */
@Component({
  selector: 'app-agenda-rangos',
  imports: [EstadoLista, MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule],
  templateUrl: './agenda-rangos.html',
})
export class AgendaRangos {
  private readonly agendaService = inject(AgendaService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmacion = inject(Confirmacion);
  private readonly avisos = inject(Avisos);

  readonly idMedico = input.required<number>();
  readonly fecha = input.required<Date>();
  readonly idSede = input<number | null>(null);
  /** El operador solo trabaja sobre su sede; el médico puede elegir cualquiera. */
  readonly sedeFija = input(false);

  protected readonly columnas = ['horario', 'especialidad', 'sede', 'acciones'];
  protected readonly lista = new Carga<RangoAgenda[]>([]);

  constructor() {
    effect(() => {
      this.idMedico();
      this.fecha();
      untracked(() => this.cargar());
    });
  }

  cargar(): void {
    this.lista.ejecutar(
      this.agendaService.listar({
        id_medico: this.idMedico(),
        fecha: aFechaIso(this.fecha()),
        id_sede: this.sedeFija() ? this.idSede() : null,
      }),
    );
  }

  abrirFormulario(rango?: RangoAgenda): void {
    const data: DatosRangoDialogo = {
      idMedico: this.idMedico(),
      fecha: this.fecha(),
      idSede: this.idSede(),
      sedeFija: this.sedeFija(),
      rango,
    };

    this.dialog
      .open(RangoDialogo, { data, width: '520px' })
      .afterClosed()
      .subscribe((guardado) => {
        if (guardado) {
          this.avisos.exito('Se guardó el rango horario.');
          this.cargar();
        }
      });
  }

  eliminar(rango: RangoAgenda): void {
    this.confirmacion
      .pedir(
        'Eliminar rango horario',
        `¿Está seguro de eliminar el rango de ${rango.hora_entrada} a ${rango.hora_salida}?`,
        'Sí, eliminar',
      )
      .subscribe((confirmado) => {
        if (!confirmado) {
          return;
        }
        this.agendaService.eliminar(rango.id).subscribe({
          next: () => {
            this.avisos.exito('Se eliminó el rango horario.');
            this.cargar();
          },
          error: (error: unknown) => this.avisos.error(error, 'No se pudo eliminar el rango horario.'),
        });
      });
  }
}
