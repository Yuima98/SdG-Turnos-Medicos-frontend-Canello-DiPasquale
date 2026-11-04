import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RegistroRequest } from '../../../core/models/auth.model';
import { Cobertura } from '../../../core/models/cobertura.model';
import { Avisos } from '../../../core/services/avisos';
import { CoberturaService } from '../../../core/services/cobertura';
import { aFechaIso } from '../../../core/utils/fechas';
import {
  PATRON_DNI,
  VALIDADORES_EMAIL,
  VALIDADORES_NOMBRE,
  VALIDADORES_TELEFONO,
} from '../../../core/utils/validaciones';

/** Formulario de alta de paciente: lo usan el registro público y el operador. */
@Component({
  selector: 'app-paciente-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './paciente-form.html',
})
export class PacienteForm {
  private readonly fb = inject(FormBuilder);
  private readonly coberturaService = inject(CoberturaService);
  private readonly avisos = inject(Avisos);

  readonly textoBoton = input.required<string>();
  readonly enviando = input(false);
  readonly guardar = output<RegistroRequest>();

  private readonly directiva = viewChild.required(FormGroupDirective);

  protected readonly coberturas = signal<Cobertura[]>([]);
  protected readonly maxFechaNacimiento = new Date();

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', VALIDADORES_NOMBRE],
    apellido: ['', VALIDADORES_NOMBRE],
    dni: ['', [Validators.required, Validators.pattern(PATRON_DNI)]],
    email: ['', VALIDADORES_EMAIL],
    telefono: ['', VALIDADORES_TELEFONO],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fechaNacimiento: this.fb.control<Date | null>(null, Validators.required),
    coberturaId: this.fb.control<number | null>(null, Validators.required),
  });

  constructor() {
    this.coberturaService.listar().subscribe({
      next: (coberturas) => this.coberturas.set(coberturas),
      error: (error: unknown) => this.avisos.error(error, 'No se pudieron cargar las coberturas.'),
    });
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fechaNacimiento, coberturaId, ...datos } = this.form.getRawValue();
    this.guardar.emit({
      ...datos,
      fecha_nacimiento: aFechaIso(fechaNacimiento!),
      id_cobertura: coberturaId!,
    });
  }

  /** Deja el formulario vacío y sin errores para cargar otro paciente. */
  limpiar(): void {
    this.directiva().resetForm();
  }
}
