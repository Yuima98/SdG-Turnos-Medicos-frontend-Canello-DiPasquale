import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Sede } from '../../../core/models/sede.model';
import { Turno } from '../../../core/models/turno.model';
import { Avisos } from '../../../core/services/avisos';
import { SedeService } from '../../../core/services/sede';
import { TurnoService } from '../../../core/services/turno';
import { Carga } from '../../../core/utils/carga';
import { aFechaIso, calcularEdad } from '../../../core/utils/fechas';
import { Confirmacion } from '../../../shared/components/confirmacion/confirmacion';
import { EstadoLista } from '../../../shared/components/estado-lista/estado-lista';
import { AtencionDialogo } from './atencion-dialogo';

@Component({
  selector: 'app-turnos-programados',
  imports: [
    DatePipe,
    EstadoLista,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './turnos-programados.html',
  styleUrl: './turnos-programados.scss',
})
export class TurnosProgramados {
  private readonly turnoService = inject(TurnoService);
  private readonly sedeService = inject(SedeService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmacion = inject(Confirmacion);
  private readonly avisos = inject(Avisos);

  protected readonly columnas = ['hora', 'paciente', 'edad', 'sede', 'estado', 'acciones'];
  protected readonly lista = new Carga<Turno[]>([]);
  protected readonly sedes = signal<Sede[]>([]);
  protected readonly fecha = signal(new Date());
  protected readonly idSede = signal<number | null>(null);
  protected readonly desplegado = signal<number | null>(null);
  protected readonly edad = calcularEdad;

  constructor() {
    this.sedeService.listar().subscribe({
      next: (sedes) => this.sedes.set(sedes),
      error: (error: unknown) => this.avisos.error(error, 'No se pudieron cargar las sedes.'),
    });
    this.cargar();
  }

  cargar(): void {
    this.lista.ejecutar(this.turnoService.listar({ fecha: aFechaIso(this.fecha()), id_sede: this.idSede() }));
  }

  cambiarFecha(fecha: Date | null): void {
    if (fecha) {
      this.fecha.set(fecha);
      this.cargar();
    }
  }

  cambiarSede(idSede: number | null): void {
    this.idSede.set(idSede);
    this.cargar();
  }

  alternarDetalle(turno: Turno): void {
    this.desplegado.update((actual) => (actual === turno.id ? null : turno.id));
  }

  atender(turno: Turno, evento: Event): void {
    evento.stopPropagation();
    this.dialog
      .open(AtencionDialogo, { data: turno, width: '520px' })
      .afterClosed()
      .subscribe((atendido) => {
        if (atendido) {
          this.avisos.exito('El turno quedó atendido y el historial clínico registrado.');
          this.cargar();
        }
      });
  }

  cancelar(turno: Turno, evento: Event): void {
    evento.stopPropagation();
    this.confirmacion
      .pedir(
        'Cancelar turno',
        `¿Está seguro de cancelar el turno de las ${turno.hora} de ${turno.paciente_nombre} ${turno.paciente_apellido}?`,
        'Sí, cancelar turno',
      )
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
