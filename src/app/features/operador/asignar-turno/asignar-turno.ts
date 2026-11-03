import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Paciente } from '../../../core/models/turno.model';
import { Auth } from '../../../core/services/auth';
import { BuscadorPacientes } from '../../../shared/components/buscador-pacientes/buscador-pacientes';
import { NuevoTurno } from '../../turnos/nuevo-turno/nuevo-turno';

@Component({
  selector: 'app-asignar-turno',
  imports: [BuscadorPacientes, MatButtonModule, NuevoTurno],
  template: `
    <section class="pagina">
      <div class="pagina-encabezado">
        <h1>Asignar turno</h1>
        @if (paciente()) {
          <button mat-stroked-button (click)="paciente.set(null)">Elegir otro paciente</button>
        }
      </div>

      @if (paciente(); as seleccionado) {
        <p>
          Paciente: <strong>{{ seleccionado.apellido }}, {{ seleccionado.nombre }}</strong>
          — DNI {{ seleccionado.dni }}
        </p>
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
