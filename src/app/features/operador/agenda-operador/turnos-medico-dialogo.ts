import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Turno } from '../../../core/models/turno.model';
import { Avisos } from '../../../core/services/avisos';
import { TurnoService } from '../../../core/services/turno';
import { Carga } from '../../../core/utils/carga';
import { aFechaIso } from '../../../core/utils/fechas';
import { Confirmacion } from '../../../shared/components/confirmacion/confirmacion';
import { EstadoLista } from '../../../shared/components/estado-lista/estado-lista';
import { MedicoEnAgenda } from './agenda-operador';

interface DatosDialogo {
  medico: MedicoEnAgenda;
  fecha: Date;
}

@Component({
  selector: 'app-turnos-medico-dialogo',
  imports: [DatePipe, EstadoLista, MatButtonModule, MatDialogModule, MatTableModule],
  template: `
    <h2 mat-dialog-title>Turnos de {{ datos.medico.nombre }} — {{ datos.fecha | date: 'dd/MM/yyyy' }}</h2>
    <mat-dialog-content>
      <app-estado-lista
        [cargando]="lista.cargando()"
        [error]="lista.error()"
        [vacio]="lista.datos().length === 0"
        mensajeVacio="No hay turnos confirmados para esta fecha."
        (reintentar)="cargar()"
      >
        <table mat-table [dataSource]="lista.datos()" class="tabla">
          <ng-container matColumnDef="hora">
            <th mat-header-cell *matHeaderCellDef>Hora</th>
            <td mat-cell *matCellDef="let turno">{{ turno.hora }}</td>
          </ng-container>
          <ng-container matColumnDef="paciente">
            <th mat-header-cell *matHeaderCellDef>Paciente</th>
            <td mat-cell *matCellDef="let turno">{{ turno.paciente_apellido }}, {{ turno.paciente_nombre }}</td>
          </ng-container>
          <ng-container matColumnDef="especialidad">
            <th mat-header-cell *matHeaderCellDef>Especialidad</th>
            <td mat-cell *matCellDef="let turno">{{ turno.especialidad }}</td>
          </ng-container>
          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let turno">
              <button mat-stroked-button (click)="cancelar(turno)">Cancelar turno</button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columnas"></tr>
          <tr mat-row *matRowDef="let fila; columns: columnas"></tr>
        </table>
      </app-estado-lista>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
})
export class TurnosMedicoDialogo {
  protected readonly datos = inject<DatosDialogo>(MAT_DIALOG_DATA);
  private readonly turnoService = inject(TurnoService);
  private readonly confirmacion = inject(Confirmacion);
  private readonly avisos = inject(Avisos);

  protected readonly columnas = ['hora', 'paciente', 'especialidad', 'acciones'];
  protected readonly lista = new Carga<Turno[]>([]);

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.lista.ejecutar(
      this.turnoService.listar({
        fecha: aFechaIso(this.datos.fecha),
        id_medico: this.datos.medico.idMedico,
        estado: 'confirmado',
      }),
    );
  }

  cancelar(turno: Turno): void {
    this.confirmacion
      .pedir(
        'Cancelar turno',
        `¿Está seguro de cancelar el turno de las ${turno.hora} de ${turno.paciente_nombre} ${turno.paciente_apellido}?`,
        'Sí, cancelar turno',
      )
      .subscribe((confirmado) => {
        if (!confirmado) {
          return;
        }
        this.turnoService.cancelar(turno.id).subscribe({
          next: () => {
            this.avisos.exito('Se canceló el turno.');
            this.cargar();
          },
          error: (error: unknown) => this.avisos.error(error, 'No se pudo cancelar el turno.'),
        });
      });
  }
}
