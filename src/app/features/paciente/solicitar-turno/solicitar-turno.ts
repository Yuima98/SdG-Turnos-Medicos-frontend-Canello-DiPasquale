import { Component } from '@angular/core';
import { NuevoTurno } from '../../turnos/nuevo-turno/nuevo-turno';

@Component({
  selector: 'app-solicitar-turno',
  imports: [NuevoTurno],
  template: `
    <section class="pagina">
      <div class="pagina-encabezado">
        <div>
          <h1>Nuevo turno</h1>
          <p>Elegí especialidad, médico y horario.</p>
        </div>
      </div>
      <app-nuevo-turno />
    </section>
  `,
})
export class SolicitarTurno {}
