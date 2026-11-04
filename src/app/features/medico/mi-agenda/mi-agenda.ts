import { Component, inject, signal } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../../../core/services/auth';
import { AgendaRangos } from '../../agenda/agenda-rangos/agenda-rangos';

@Component({
  selector: 'app-mi-agenda',
  imports: [AgendaRangos, MatDatepickerModule, MatFormFieldModule, MatInputModule],
  template: `
    <section class="pagina">
      <div class="pagina-encabezado">
        <div>
          <h1>Mi agenda</h1>
          <p>Cargá tus rangos horarios por sede.</p>
        </div>
      </div>

      <div class="panel">
        <div class="filtros">
          <mat-form-field appearance="outline" subscriptSizing="dynamic">
            <mat-label>Fecha</mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              [value]="fecha()"
              (dateChange)="cambiarFecha($event.value)"
            />
            <mat-datepicker-toggle matIconSuffix [for]="picker" />
            <mat-datepicker #picker />
          </mat-form-field>
        </div>

        @if (auth.usuario(); as usuario) {
          <app-agenda-rangos [idMedico]="usuario.id" [fecha]="fecha()" [idSede]="usuario.id_sede" />
        }
      </div>
    </section>
  `,
})
export class MiAgenda {
  protected readonly auth = inject(Auth);
  protected readonly fecha = signal(new Date());

  cambiarFecha(fecha: Date | null): void {
    if (fecha) {
      this.fecha.set(fecha);
    }
  }
}
