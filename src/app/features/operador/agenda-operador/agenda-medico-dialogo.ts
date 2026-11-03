import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AgendaRangos } from '../../agenda/agenda-rangos/agenda-rangos';
import { MedicoEnAgenda } from './agenda-operador';

interface DatosDialogo {
  medico: MedicoEnAgenda;
  fecha: Date;
  idSede: number | null;
}

@Component({
  selector: 'app-agenda-medico-dialogo',
  imports: [DatePipe, AgendaRangos, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Agenda de {{ datos.medico.nombre }} — {{ datos.fecha | date: 'dd/MM/yyyy' }}</h2>
    <mat-dialog-content>
      <app-agenda-rangos
        [idMedico]="datos.medico.idMedico"
        [fecha]="datos.fecha"
        [idSede]="datos.idSede"
        [sedeFija]="true"
      />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
})
export class AgendaMedicoDialogo {
  protected readonly datos = inject<DatosDialogo>(MAT_DIALOG_DATA);
}
