import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { switchMap } from 'rxjs';
import { Cobertura } from '../../../core/models/cobertura.model';
import { Auth } from '../../../core/services/auth';
import { Avisos } from '../../../core/services/avisos';
import { CoberturaService } from '../../../core/services/cobertura';
import { PacienteService } from '../../../core/services/paciente';
import {
  VALIDADORES_EMAIL,
  VALIDADORES_TELEFONO,
  contrasenasIguales,
} from '../../../core/utils/validaciones';

@Component({
  selector: 'app-mis-datos',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './mis-datos.html',
  styleUrl: './mis-datos.scss',
})
export class MisDatos {
  private readonly fb = inject(FormBuilder);
  private readonly pacienteService = inject(PacienteService);
  private readonly coberturaService = inject(CoberturaService);
  private readonly avisos = inject(Avisos);
  protected readonly auth = inject(Auth);

  protected readonly coberturas = signal<Cobertura[]>([]);
  protected readonly guardando = signal(false);

  protected readonly form = this.fb.nonNullable.group(
    {
      email: [this.auth.usuario()?.email ?? '', VALIDADORES_EMAIL],
      telefono: [this.auth.usuario()?.telefono ?? '', VALIDADORES_TELEFONO],
      idCobertura: this.fb.control(this.auth.usuario()?.id_cobertura ?? null, Validators.required),
      password: ['', Validators.minLength(6)],
      repetirPassword: [''],
    },
    { validators: contrasenasIguales },
  );

  constructor() {
    this.coberturaService.listar().subscribe({
      next: (coberturas) => this.coberturas.set(coberturas),
      error: (error: unknown) => this.avisos.error(error, 'No se pudieron cargar las coberturas.'),
    });
  }

  guardar(directiva: FormGroupDirective): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, telefono, idCobertura, password } = this.form.getRawValue();

    this.guardando.set(true);
    this.pacienteService
      .actualizarMisDatos({
        email,
        telefono,
        id_cobertura: idCobertura!,
        ...(password ? { password } : {}),
      })
      .pipe(switchMap(() => this.auth.cargarPerfil()))
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.avisos.exito('Se actualizaron tus datos.');
          directiva.resetForm({ email, telefono, idCobertura, password: '', repetirPassword: '' });
        },
        error: (error: unknown) => {
          this.guardando.set(false);
          this.avisos.error(error, 'No se pudieron actualizar tus datos.');
        },
      });
  }
}
