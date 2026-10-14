import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../../core/services/auth';
import { CoberturaService } from '../../../core/services/cobertura';
import { Cobertura } from '../../../core/models/cobertura.model';

@Component({
  selector: 'app-registro',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly coberturaService = inject(CoberturaService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly enviando = signal(false);
  protected readonly coberturas = signal<Cobertura[]>([]);
  protected readonly maxFechaNacimiento = new Date();

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fechaNacimiento: this.fb.control<Date | null>(null, Validators.required),
    coberturaId: this.fb.control<number | null>(null, Validators.required),
  });

  constructor() {
    this.coberturaService.listar().subscribe({
      next: (coberturas) => this.coberturas.set(coberturas),
      error: () =>
        this.snackBar.open('No se pudieron cargar las coberturas.', 'Cerrar', { duration: 5000 }),
    });
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();

    this.enviando.set(true);
    this.auth
      .registrar({
        nombre: valores.nombre,
        apellido: valores.apellido,
        dni: valores.dni,
        email: valores.email,
        password: valores.password,
        fechaNacimiento: this.aFechaIso(valores.fechaNacimiento!),
        coberturaId: valores.coberturaId!,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.snackBar.open('Registro exitoso. Ya podés iniciar sesión.', 'Cerrar', {
            duration: 5000,
          });
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.enviando.set(false);
          const mensaje = error.error?.estado ?? 'No se pudo completar el registro.';          this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
        },
      });
  }

  private aFechaIso(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }
}
