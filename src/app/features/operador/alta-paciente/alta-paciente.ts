import { Component, inject, signal, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RegistroRequest } from '../../../core/models/auth.model';
import { Avisos } from '../../../core/services/avisos';
import { PacienteService } from '../../../core/services/paciente';
import { PacienteForm } from '../../../shared/components/paciente-form/paciente-form';

@Component({
  selector: 'app-alta-paciente',
  imports: [MatCardModule, PacienteForm],
  template: `
    <section class="pagina">
      <div class="pagina-encabezado">
        <h1>Alta de paciente</h1>
      </div>
      <mat-card appearance="outlined" class="tarjeta-formulario">
        <mat-card-content>
          <app-paciente-form textoBoton="Dar de alta" [enviando]="enviando()" (guardar)="guardar($event)" />
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: `
    .tarjeta-formulario {
      max-width: 520px;
    }
  `,
})
export class AltaPaciente {
  private readonly pacienteService = inject(PacienteService);
  private readonly avisos = inject(Avisos);
  private readonly formulario = viewChild.required(PacienteForm);

  protected readonly enviando = signal(false);

  guardar(datos: RegistroRequest): void {
    this.enviando.set(true);
    this.pacienteService.crear(datos).subscribe({
      next: () => {
        this.enviando.set(false);
        this.avisos.exito('Se dio de alta el paciente.');
        this.formulario().limpiar();
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.avisos.error(error, 'No se pudo dar de alta el paciente.');
      },
    });
  }
}
