import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, forkJoin } from 'rxjs';
import { Cobertura } from '../../../core/models/cobertura.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { UsuarioGestion, UsuarioRequest } from '../../../core/models/gestion.model';
import { ETIQUETA_ROL, Rol } from '../../../core/models/usuario.model';
import { Sede } from '../../../core/models/sede.model';
import { Avisos } from '../../../core/services/avisos';
import { CoberturaService } from '../../../core/services/cobertura';
import { EspecialidadService } from '../../../core/services/especialidad';
import { SedeService } from '../../../core/services/sede';
import { UsuarioService } from '../../../core/services/usuario';
import { aFechaIso, desdeFechaIso } from '../../../core/utils/fechas';
import {
  PATRON_DNI,
  VALIDADORES_EMAIL,
  VALIDADORES_NOMBRE,
  VALIDADORES_TELEFONO,
} from '../../../core/utils/validaciones';

const ROLES_ALTA: Rol[] = ['operador', 'medico', 'admin'];

@Component({
  selector: 'app-usuario-dialogo',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './usuario-dialogo.html',
})
export class UsuarioDialogo {
  protected readonly usuario = inject<UsuarioGestion | null>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UsuarioDialogo>);
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly sedeService = inject(SedeService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly coberturaService = inject(CoberturaService);
  private readonly avisos = inject(Avisos);

  protected readonly etiquetaRol = ETIQUETA_ROL;
  protected readonly rolesAlta = ROLES_ALTA;
  protected readonly maxFechaNacimiento = new Date();

  protected readonly sedes = signal<Sede[]>([]);
  protected readonly especialidades = signal<Especialidad[]>([]);
  protected readonly coberturas = signal<Cobertura[]>([]);
  protected readonly guardando = signal(false);
  protected readonly rol = signal<Rol>(this.usuario?.rol ?? 'operador');

  protected readonly form = this.fb.nonNullable.group({
    rol: [this.rol(), Validators.required],
    nombre: [this.usuario?.nombre ?? '', VALIDADORES_NOMBRE],
    apellido: [this.usuario?.apellido ?? '', VALIDADORES_NOMBRE],
    dni: [this.usuario?.dni ?? '', [Validators.required, Validators.pattern(PATRON_DNI)]],
    email: [this.usuario?.email ?? '', VALIDADORES_EMAIL],
    telefono: [this.usuario?.telefono ?? '', VALIDADORES_TELEFONO],
    fechaNacimiento: this.fb.control<Date | null>(
      this.usuario ? desdeFechaIso(this.usuario.fecha_nacimiento) : null,
      Validators.required,
    ),
    password: ['', this.usuario ? Validators.minLength(6) : [Validators.required, Validators.minLength(6)]],
    id_sede: this.fb.control<number | null>(this.usuario?.id_sede ?? null),
    especialidades: this.fb.nonNullable.control<number[]>(
      this.usuario?.especialidades.map((e) => e.id) ?? [],
    ),
    id_cobertura: this.fb.control<number | null>(this.usuario?.id_cobertura ?? null),
  });

  constructor() {
    if (this.usuario) {
      this.form.controls.rol.disable();
    }

    forkJoin({
      sedes: this.sedeService.listar(),
      especialidades: this.especialidadService.listar(),
      coberturas: this.coberturaService.listar(),
    }).subscribe({
      next: ({ sedes, especialidades, coberturas }) => {
        this.sedes.set(sedes);
        this.especialidades.set(especialidades);
        this.coberturas.set(coberturas);
      },
      error: (error: unknown) => this.avisos.error(error, 'No se pudieron cargar las opciones.'),
    });

    this.form.controls.rol.valueChanges.pipe(takeUntilDestroyed()).subscribe((rol) => {
      this.rol.set(rol);
      this.aplicarReglasDelRol();
    });
    this.aplicarReglasDelRol();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fechaNacimiento, password, rol, id_sede, especialidades, id_cobertura, ...datos } =
      this.form.getRawValue();
    const solicitud: UsuarioRequest = {
      ...datos,
      fecha_nacimiento: aFechaIso(fechaNacimiento!),
      id_sede: this.tieneSede() ? id_sede : null,
      id_cobertura: rol === 'paciente' ? id_cobertura : null,
      especialidades: rol === 'medico' ? especialidades : [],
      ...(password ? { password } : {}),
      ...(this.usuario ? {} : { rol }),
    };

    const operacion: Observable<unknown> = this.usuario
      ? this.usuarioService.modificar(this.usuario.id, solicitud)
      : this.usuarioService.crear(solicitud);

    this.guardando.set(true);
    operacion.subscribe({
      next: () => this.dialogRef.close(true),
      error: (error: unknown) => {
        this.guardando.set(false);
        this.avisos.error(error, 'No se pudo guardar el usuario.');
      },
    });
  }

  protected tieneSede(): boolean {
    return this.rol() === 'operador' || this.rol() === 'medico';
  }

  private aplicarReglasDelRol(): void {
    const { id_sede, especialidades, id_cobertura } = this.form.controls;
    const rol = this.rol();

    id_sede.setValidators(this.tieneSede() ? Validators.required : null);
    especialidades.setValidators(rol === 'medico' ? Validators.required : null);
    id_cobertura.setValidators(rol === 'paciente' ? Validators.required : null);

    id_sede.updateValueAndValidity();
    especialidades.updateValueAndValidity();
    id_cobertura.updateValueAndValidity();
  }
}
