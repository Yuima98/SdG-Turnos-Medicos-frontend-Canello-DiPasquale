import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Avisos } from '../../../core/services/avisos';
import { sinEspaciosVacios } from '../../../core/utils/validaciones';
import { CampoCatalogo, ConfigCatalogo, DatosCatalogo, FilaCatalogo, ServicioCatalogo } from './catalogo.config';

interface DatosDialogo {
  config: ConfigCatalogo;
  servicio: ServicioCatalogo;
  fila?: FilaCatalogo;
}

@Component({
  selector: 'app-catalogo-dialogo',
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ datos.fila ? 'Modificar' : 'Nueva' }} {{ datos.config.entidad }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content>
        <div class="formulario">
          @for (campo of datos.config.campos; track campo.clave) {
            <mat-form-field appearance="outline">
              <mat-label>{{ campo.etiqueta }}</mat-label>
              <input matInput [formControlName]="campo.clave" [maxlength]="campo.maximo" />
              @if (form.controls[campo.clave].hasError('required')) {
                <mat-error>Este campo es obligatorio.</mat-error>
              } @else if (form.controls[campo.clave].hasError('pattern')) {
                <mat-error>{{ campo.mensajePatron }}</mat-error>
              }
            </mat-form-field>
          }
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancelar</button>
        <button mat-flat-button type="submit" [disabled]="guardando()">Guardar</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class CatalogoDialogo {
  protected readonly datos = inject<DatosDialogo>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CatalogoDialogo>);
  private readonly avisos = inject(Avisos);

  protected readonly guardando = signal(false);
  protected readonly form = new FormGroup(
    Object.fromEntries(this.datos.config.campos.map((campo) => [campo.clave, this.crearControl(campo)])),
  );

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fila, servicio } = this.datos;
    const valores = this.form.getRawValue() as DatosCatalogo;
    const operacion = fila ? servicio.modificar(fila.id, valores) : servicio.crear(valores);

    this.guardando.set(true);
    operacion.subscribe({
      next: () => this.dialogRef.close(true),
      error: (error: unknown) => {
        this.guardando.set(false);
        this.avisos.error(error, 'No se pudieron guardar los cambios.');
      },
    });
  }

  private crearControl(campo: CampoCatalogo): FormControl<string> {
    const validadores: ValidatorFn[] = [Validators.required, sinEspaciosVacios];
    if (campo.patron) {
      validadores.push(Validators.pattern(campo.patron));
    }
    const valor = this.datos.fila ? String(this.datos.fila[campo.clave]) : '';
    return new FormControl(valor, { nonNullable: true, validators: validadores });
  }
}
