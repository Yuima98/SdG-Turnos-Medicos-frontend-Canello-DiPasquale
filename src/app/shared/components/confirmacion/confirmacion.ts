import { Component, Injectable, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, map } from 'rxjs';

interface DatosConfirmacion {
  titulo: string;
  mensaje: string;
  accion: string;
}

@Component({
  selector: 'app-confirmacion-dialogo',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ datos.titulo }}</h2>
    <mat-dialog-content class="confirmacion">
      <mat-icon aria-hidden="true">warning</mat-icon>
      <p>{{ datos.mensaje }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">No, volver</button>
      <button mat-flat-button class="boton-peligro" [mat-dialog-close]="true">{{ datos.accion }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .confirmacion {
      display: flex;
      gap: 12px;
    }

    mat-icon {
      flex: none;
      color: var(--sdg-peligro);
    }

    p {
      margin: 0;
    }
  `,
})
export class ConfirmacionDialogo {
  protected readonly datos = inject<DatosConfirmacion>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root',
})
export class Confirmacion {
  private readonly dialog = inject(MatDialog);

  pedir(titulo: string, mensaje: string, accion = 'Sí, confirmar'): Observable<boolean> {
    return this.dialog
      .open(ConfirmacionDialogo, { data: { titulo, mensaje, accion }, width: '420px' })
      .afterClosed()
      .pipe(map((respuesta) => respuesta === true));
  }
}
