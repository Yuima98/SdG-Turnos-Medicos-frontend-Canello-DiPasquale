import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Auth } from '../../../core/services/auth';
import { Avisos } from '../../../core/services/avisos';
import { PATRON_DNI } from '../../../core/utils/validaciones';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly avisos = inject(Avisos);

  protected readonly enviando = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    dni: ['', [Validators.required, Validators.pattern(PATRON_DNI)]],
    password: ['', Validators.required],
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/']);
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.avisos.error(error, 'No se pudo iniciar sesión.');
      },
    });
  }
}
