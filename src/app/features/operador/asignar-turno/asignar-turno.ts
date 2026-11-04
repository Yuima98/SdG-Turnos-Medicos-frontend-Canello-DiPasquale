import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Paciente } from '../../../core/models/turno.model';
import { Auth } from '../../../core/services/auth';
import { BuscadorPacientes } from '../../../shared/components/buscador-pacientes/buscador-pacientes';
import { NuevoTurno } from '../../turnos/nuevo-turno/nuevo-turno';

@Component({
  selector: 'app-asignar-turno',
  imports: [BuscadorPacientes, MatButtonModule, MatIconModule, NuevoTurno],
  template: `
    <section class="pagina">
      <div class="pagina-encabezado">
        <div>
          <h1>Asignar turno</h1>
          <p>Buscá al paciente y dale un turno.</p>
        </div>
        @if (paciente()) {
          <button mat-stroked-button (click)="paciente.set(null)">
            <mat-icon>person_search</mat-icon>
            Elegir otro paciente
          </button>
        }
      </div>

      @if (paciente(); as seleccionado) {
        <div class="paciente-activo">
          <mat-icon aria-hidden="true">person</mat-icon>
          <div>
            <strong>{{ seleccionado.apellido }}, {{ seleccionado.nombre }}</strong>
            <small>DNI {{ seleccionado.dni }}</small>
          </div>
        </div>
        <app-nuevo-turno [paciente]="seleccionado" [idSedeFija]="idSede" (creado)="paciente.set(null)" />
      } @else {
        <app-buscador-pacientes (seleccion)="paciente.set($event)" />
      }
    </section>
  `,
})
export class AsignarTurno {
  protected readonly idSede = inject(Auth).usuario()?.id_sede ?? null;
  protected readonly paciente = signal<Paciente | null>(null);
}
