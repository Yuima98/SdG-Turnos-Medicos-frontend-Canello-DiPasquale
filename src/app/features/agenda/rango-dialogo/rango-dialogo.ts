import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, forkJoin, startWith } from 'rxjs';
import { Medico, RangoAgenda, RangoRequest } from '../../../core/models/agenda.model';
import { Sede } from '../../../core/models/sede.model';
import { AgendaService } from '../../../core/services/agenda';
import { Avisos } from '../../../core/services/avisos';
import { MedicoService } from '../../../core/services/medico';
import { SedeService } from '../../../core/services/sede';
import { aFechaIso, desdeFechaIso } from '../../../core/utils/fechas';

export interface DatosRangoDialogo {
  /** Sin médico, el formulario pide elegirlo del listado (Nueva agenda del operador). */
  idMedico: number | null;
  fecha: Date;
  idSede: number | null;
  sedeFija: boolean;
  rango?: RangoAgenda;
}

function salidaPosterior(grupo: AbstractControl): ValidationErrors | null {
  const entrada: string = grupo.get('horaEntrada')?.value;
  const salida: string = grupo.get('horaSalida')?.value;
  return entrada && salida && salida <= entrada ? { salidaAnterior: true } : null;
}

@Component({
  selector: 'app-rango-dialogo',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './rango-dialogo.html',
})
export class RangoDialogo {
  protected readonly datos = inject<DatosRangoDialogo>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RangoDialogo>);
  private readonly fb = inject(FormBuilder);
  private readonly agendaService = inject(AgendaService);
  private readonly medicoService = inject(MedicoService);
  private readonly sedeService = inject(SedeService);
  private readonly avisos = inject(Avisos);

  protected readonly hoy = new Date();
  protected readonly guardando = signal(false);
  protected readonly medicos = signal<Medico[]>([]);
  protected readonly sedes = signal<Sede[]>([]);

  protected readonly form = this.fb.group(
    {
      idMedico: [this.datos.idMedico, Validators.required],
      fecha: [
        this.datos.rango ? desdeFechaIso(this.datos.rango.fecha) : this.datos.fecha,
        Validators.required,
      ],
      horaEntrada: [this.datos.rango?.hora_entrada ?? '', Validators.required],
      horaSalida: [this.datos.rango?.hora_salida ?? '', Validators.required],
      idEspecialidad: [this.datos.rango?.id_especialidad ?? null, Validators.required],
      idSede: [
        {
          value: this.datos.rango?.id_sede ?? this.datos.idSede,
          disabled: this.datos.sedeFija,
        },
        Validators.required,
      ],
    },
    { validators: salidaPosterior },
  );

  private readonly idMedico = toSignal(
    this.form.controls.idMedico.valueChanges.pipe(startWith(this.datos.idMedico)),
    { requireSync: true },
  );

  protected readonly especialidades = computed(() => {
    return this.medicos().find((medico) => medico.id === this.idMedico())?.especialidades ?? [];
  });

  constructor() {
    forkJoin({ medicos: this.medicoService.listar(), sedes: this.sedeService.listar() }).subscribe({
      next: ({ medicos, sedes }) => {
        this.medicos.set(medicos);
        this.sedes.set(sedes);
      },
      error: (error: unknown) => this.avisos.error(error, 'No se pudieron cargar las opciones.'),
    });

    this.form.controls.idMedico.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.controls.idEspecialidad.reset());
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const solicitud: RangoRequest = {
      hora_entrada: valores.horaEntrada!,
      hora_salida: valores.horaSalida!,
      fecha: aFechaIso(valores.fecha!),
      id_medico: valores.idMedico!,
      id_especialidad: valores.idEspecialidad!,
      id_sede: valores.idSede!,
    };

    const { rango } = this.datos;
    const operacion: Observable<unknown> = rango
      ? this.agendaService.modificar(rango.id, solicitud)
      : this.agendaService.crear(solicitud);

    this.guardando.set(true);
    operacion.subscribe({
      next: () => this.dialogRef.close(true),
      error: (error: unknown) => {
        this.guardando.set(false);
        this.avisos.error(error, 'No se pudo guardar el rango horario.');
      },
    });
  }
}
