import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { RegistroRequest } from '../../../core/models/auth.model';
import { Auth } from '../../../core/services/auth';
import { Avisos } from '../../../core/services/avisos';
import { PacienteForm } from '../../../shared/components/paciente-form/paciente-form';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, MatCardModule, PacienteForm],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly avisos = inject(Avisos);

  protected readonly enviando = signal(false);

  registrar(datos: RegistroRequest): void {
    this.enviando.set(true);
    this.auth.registrar(datos).subscribe({
      next: () => {
        this.enviando.set(false);
        this.avisos.exito('Registro exitoso. Ya podés iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.avisos.error(error, 'No se pudo completar el registro.');
      },
    });
  }
}
