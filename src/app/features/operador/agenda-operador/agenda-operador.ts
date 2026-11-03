import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RangoAgenda } from '../../../core/models/agenda.model';
import { Sede } from '../../../core/models/sede.model';
import { AgendaService } from '../../../core/services/agenda';
import { Auth } from '../../../core/services/auth';
import { Avisos } from '../../../core/services/avisos';
import { SedeService } from '../../../core/services/sede';
import { Carga } from '../../../core/utils/carga';
import { aFechaIso } from '../../../core/utils/fechas';
import { EstadoLista } from '../../../shared/components/estado-lista/estado-lista';
import { DatosRangoDialogo, RangoDialogo } from '../../agenda/rango-dialogo/rango-dialogo';
import { AgendaMedicoDialogo } from './agenda-medico-dialogo';
import { TurnosMedicoDialogo } from './turnos-medico-dialogo';

export interface MedicoEnAgenda {
  idMedico: number;
  nombre: string;
  especialidades: string[];
  horarios: string[];
}

@Component({
  selector: 'app-agenda-operador',
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
  templateUrl: './agenda-operador.html',
})
export class AgendaOperador {
  private readonly agendaService = inject(AgendaService);
  private readonly sedeService = inject(SedeService);
  private readonly dialog = inject(MatDialog);
  private readonly avisos = inject(Avisos);

  private readonly idSedePropia = inject(Auth).usuario()?.id_sede ?? null;

  protected readonly columnas = ['medico', 'especialidad', 'horario', 'acciones'];
  protected readonly lista = new Carga<RangoAgenda[]>([]);
  protected readonly sedes = signal<Sede[]>([]);
  protected readonly fecha = signal(new Date());
  protected readonly idSede = signal(this.idSedePropia);

  /** Las demás sedes se pueden consultar, pero no modificar. */
  protected readonly esSedePropia = computed(() => this.idSede() === this.idSedePropia);

  protected readonly medicos = computed(() => {
    const medicos = new Map<number, MedicoEnAgenda>();
    for (const rango of this.lista.datos()) {
      const medico = medicos.get(rango.id_medico) ?? {
        idMedico: rango.id_medico,
        nombre: `${rango.medico_apellido}, ${rango.medico_nombre}`,
        especialidades: [],
        horarios: [],
      };
      if (!medico.especialidades.includes(rango.especialidad)) {
        medico.especialidades.push(rango.especialidad);
      }
      medico.horarios.push(`${rango.hora_entrada} a ${rango.hora_salida}`);
      medicos.set(rango.id_medico, medico);
    }
    return [...medicos.values()];
  });

  constructor() {
    this.sedeService.listar().subscribe({
      next: (sedes) => this.sedes.set(sedes),
      error: (error: unknown) => this.avisos.error(error, 'No se pudieron cargar las sedes.'),
    });
    this.cargar();
  }

  cargar(): void {
    this.lista.ejecutar(this.agendaService.listar({ fecha: aFechaIso(this.fecha()), id_sede: this.idSede() }));
  }

  cambiarFecha(fecha: Date | null): void {
    if (fecha) {
      this.fecha.set(fecha);
      this.cargar();
    }
  }

  cambiarSede(idSede: number): void {
    this.idSede.set(idSede);
    this.cargar();
  }

  nuevaAgenda(): void {
    const data: DatosRangoDialogo = {
      idMedico: null,
      fecha: this.fecha(),
      idSede: this.idSedePropia,
      sedeFija: true,
    };

    this.dialog
      .open(RangoDialogo, { data, width: '520px' })
      .afterClosed()
      .subscribe((guardado) => {
        if (guardado) {
          this.avisos.exito('Se guardó la agenda.');
          this.cargar();
        }
      });
  }

  editarAgenda(medico: MedicoEnAgenda): void {
    this.dialog
      .open(AgendaMedicoDialogo, {
        data: { medico, fecha: this.fecha(), idSede: this.idSedePropia },
        width: '760px',
      })
      .afterClosed()
      .subscribe(() => this.cargar());
  }

  verTurnos(medico: MedicoEnAgenda): void {
    this.dialog.open(TurnosMedicoDialogo, {
      data: { medico, fecha: this.fecha() },
      width: '760px',
    });
  }
}
