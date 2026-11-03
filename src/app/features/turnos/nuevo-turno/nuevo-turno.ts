import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { forkJoin, map } from 'rxjs';
import { FiltrosDisponibilidad, HorarioLibre, Medico } from '../../../core/models/agenda.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { Sede } from '../../../core/models/sede.model';
import { Paciente, TurnoRequest } from '../../../core/models/turno.model';
import { AgendaService } from '../../../core/services/agenda';
import { Auth } from '../../../core/services/auth';
import { Avisos } from '../../../core/services/avisos';
import { EspecialidadService } from '../../../core/services/especialidad';
import { MedicoService } from '../../../core/services/medico';
import { SedeService } from '../../../core/services/sede';
import { TurnoService } from '../../../core/services/turno';
import { Carga } from '../../../core/utils/carga';
import { aFechaIso } from '../../../core/utils/fechas';
import { sinEspaciosVacios } from '../../../core/utils/validaciones';
import { EstadoLista } from '../../../shared/components/estado-lista/estado-lista';

const PASO_HORARIO = 4;

/**
 * Solicitud de turno paso a paso. El paciente la usa para sí mismo; el operador
 * le indica el paciente elegido y la sede fija en la suya.
 */
@Component({
  selector: 'app-nuevo-turno',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    EstadoLista,
    MatButtonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatStepperModule,
  ],
  templateUrl: './nuevo-turno.html',
  styleUrl: './nuevo-turno.scss',
})
export class NuevoTurno implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly avisos = inject(Avisos);
  private readonly agendaService = inject(AgendaService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly medicoService = inject(MedicoService);
  private readonly sedeService = inject(SedeService);
  private readonly turnoService = inject(TurnoService);

  readonly paciente = input<Paciente | null>(null);
  readonly idSedeFija = input<number | null>(null);
  readonly creado = output<void>();

  private readonly stepper = viewChild.required(MatStepper);

  protected readonly hoy = new Date();
  protected readonly enviando = signal(false);
  protected readonly opciones = new Carga<{ especialidades: Especialidad[]; sedes: Sede[] }>({
    especialidades: [],
    sedes: [],
  });
  protected readonly medicos = new Carga<Medico[]>([]);
  protected readonly fechas = new Carga<string[]>([]);
  protected readonly horarios = new Carga<HorarioLibre[]>([]);

  protected readonly form = this.fb.group({
    idEspecialidad: [null as number | null, Validators.required],
    idSede: [null as number | null, Validators.required],
    idMedico: [null as number | null, Validators.required],
    fecha: [null as Date | null, Validators.required],
    horario: [null as HorarioLibre | null, Validators.required],
    nota: ['', [Validators.required, sinEspaciosVacios, Validators.maxLength(255)]],
  });

  private readonly valores = toSignal(this.form.valueChanges.pipe(map(() => this.form.getRawValue())), {
    initialValue: this.form.getRawValue(),
  });

  protected readonly filtroFechas = computed(() => {
    const disponibles = new Set(this.fechas.datos());
    return (fecha: Date | null) => fecha !== null && disponibles.has(aFechaIso(fecha));
  });

  protected readonly cobertura = computed(() => {
    return this.paciente()?.cobertura ?? this.auth.usuario()?.cobertura ?? '—';
  });

  protected readonly resumen = computed(() => {
    const { idEspecialidad, idSede, idMedico, fecha, horario } = this.valores();
    const { especialidades, sedes } = this.opciones.datos();
    const medico = this.medicos.datos().find((m) => m.id === idMedico);
    return {
      especialidad: especialidades.find((e) => e.id === idEspecialidad)?.descripcion,
      sede: sedes.find((s) => s.id === idSede)?.nombre,
      medico: medico ? `${medico.apellido}, ${medico.nombre}` : '',
      fecha,
      hora: horario?.hora,
    };
  });

  constructor() {
    const { idEspecialidad, idSede, idMedico, fecha, horario } = this.form.controls;

    idEspecialidad.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.cargarMedicos());
    idSede.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.cargarMedicos());
    idMedico.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.cargarFechas());
    fecha.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      horario.reset();
      this.cargarHorarios();
    });

    this.cargarOpciones();
  }

  ngOnInit(): void {
    const idSedeFija = this.idSedeFija();
    if (idSedeFija !== null) {
      this.form.controls.idSede.setValue(idSedeFija);
      this.form.controls.idSede.disable();
    }
  }

  cargarOpciones(): void {
    this.opciones.ejecutar(
      forkJoin({
        especialidades: this.especialidadService.listar(),
        sedes: this.sedeService.listar(),
      }),
    );
  }

  cargarMedicos(): void {
    const { idEspecialidad, idSede, idMedico } = this.form.getRawValue();

    if (idMedico !== null) {
      this.form.controls.idMedico.reset();
    }
    if (idEspecialidad === null || idSede === null) {
      this.medicos.datos.set([]);
      return;
    }
    this.medicos.ejecutar(
      this.medicoService.listar({ id_especialidad: idEspecialidad, id_sede: idSede, con_agenda: 1 }),
    );
  }

  cargarFechas(): void {
    this.form.controls.fecha.reset();

    const disponibilidad = this.disponibilidad();
    if (!disponibilidad) {
      this.fechas.datos.set([]);
      return;
    }
    this.fechas.ejecutar(this.agendaService.fechasDisponibles(disponibilidad));
  }

  cargarHorarios(): void {
    const disponibilidad = this.disponibilidad();
    const { fecha } = this.form.getRawValue();

    if (!disponibilidad || !fecha) {
      this.horarios.datos.set([]);
      return;
    }
    this.horarios.ejecutar(this.agendaService.horariosDisponibles(disponibilidad, aFechaIso(fecha)));
  }

  confirmar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { horario, nota } = this.form.getRawValue();
    const paciente = this.paciente();
    const solicitud: TurnoRequest = {
      id_agenda: horario!.id_agenda,
      hora: horario!.hora,
      nota: nota!.trim(),
      ...(paciente ? { dni_paciente: paciente.dni } : {}),
    };

    this.enviando.set(true);
    this.turnoService.crear(solicitud).subscribe({
      next: () => {
        this.enviando.set(false);
        this.avisos.exito('Turno confirmado.');
        this.creado.emit();
        if (!paciente) {
          this.router.navigate(['/paciente/mis-turnos']);
        }
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.avisos.error(error, 'No se pudo confirmar el turno.');
        this.volverAElegirHorario();
      },
    });
  }

  /** Por ejemplo, si el horario se ocupó mientras tanto. */
  private volverAElegirHorario(): void {
    this.form.controls.horario.reset();
    this.cargarHorarios();
    this.stepper().selectedIndex = PASO_HORARIO;
  }

  private disponibilidad(): FiltrosDisponibilidad | null {
    const { idMedico, idEspecialidad, idSede } = this.form.getRawValue();
    if (idMedico === null || idEspecialidad === null || idSede === null) {
      return null;
    }
    return { id_medico: idMedico, id_especialidad: idEspecialidad, id_sede: idSede };
  }
}
