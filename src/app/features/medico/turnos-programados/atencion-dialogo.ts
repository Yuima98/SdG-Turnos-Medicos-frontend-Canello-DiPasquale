import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Turno } from '../../../core/models/turno.model';
import { Avisos } from '../../../core/services/avisos';
import { TurnoService } from '../../../core/services/turno';
import { sinEspaciosVacios } from '../../../core/utils/validaciones';

@Component({
  selector: 'app-atencion-dialogo',
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Marcar como atendido</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content>
        <div class="paciente-activo">
          <mat-icon aria-hidden="true">person</mat-icon>
          <div>
            <strong>{{ turno.paciente_apellido }}, {{ turno.paciente_nombre }}</strong>
            <small>{{ turno.hora }} hs</small>
          </div>
        </div>
        <div class="formulario">
          <mat-form-field appearance="outline">
            <mat-label>Diagnóstico</mat-label>
            <textarea matInput formControlName="diagnostico" rows="2" maxlength="255"></textarea>
            <mat-error>El diagnóstico es obligatorio.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Tratamiento</mat-label>
            <textarea matInput formControlName="tratamiento" rows="2" maxlength="255"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Observaciones</mat-label>
            <textarea matInput formControlName="observaciones" rows="2" maxlength="255"></textarea>
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancelar</button>
        <button mat-flat-button type="submit" [disabled]="guardando()">Guardar</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class AtencionDialogo {
  protected readonly turno = inject<Turno>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AtencionDialogo>);
  private readonly fb = inject(FormBuilder);
  private readonly turnoService = inject(TurnoService);
  private readonly avisos = inject(Avisos);

  protected readonly guardando = signal(false);
  protected readonly form = this.fb.nonNullable.group({
    diagnostico: ['', [Validators.required, sinEspaciosVacios]],
    tratamiento: [''],
    observaciones: [''],
  });

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.turnoService.atender(this.turno.id, this.form.getRawValue()).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error: unknown) => {
        this.guardando.set(false);
        this.avisos.error(error, 'No se pudo registrar la atención.');
      },
    });
  }
}
