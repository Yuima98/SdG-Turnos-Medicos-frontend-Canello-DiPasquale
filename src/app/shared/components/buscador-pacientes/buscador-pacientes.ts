import { Component, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Paciente } from '../../../core/models/turno.model';
import { PacienteService } from '../../../core/services/paciente';
import { Carga } from '../../../core/utils/carga';
import { SIN_ORDEN, ordenar } from '../../../core/utils/orden';
import { sinEspaciosVacios } from '../../../core/utils/validaciones';
import { EstadoLista } from '../estado-lista/estado-lista';

/** Búsqueda de pacientes por DNI o apellido: la usan el historial clínico y la asignación de turnos. */
@Component({
  selector: 'app-buscador-pacientes',
  imports: [
    ReactiveFormsModule,
    EstadoLista,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './buscador-pacientes.html',
})
export class BuscadorPacientes {
  private readonly fb = inject(FormBuilder);
  private readonly pacienteService = inject(PacienteService);

  readonly seleccion = output<Paciente>();

  protected readonly columnas = ['apellido', 'dni', 'cobertura', 'accion'];
  protected readonly resultados = new Carga<Paciente[]>([]);
  protected readonly busco = signal(false);
  protected readonly orden = signal(SIN_ORDEN);
  protected readonly filas = computed(() =>
    ordenar(this.resultados.datos(), this.orden(), (paciente, columna) => {
      if (columna === 'dni') {
        return paciente.dni;
      }
      return columna === 'cobertura' ? paciente.cobertura : `${paciente.apellido} ${paciente.nombre}`;
    }),
  );
  protected readonly form = this.fb.nonNullable.group({
    texto: ['', [Validators.required, sinEspaciosVacios]],
  });

  buscar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busco.set(true);
    this.resultados.ejecutar(this.pacienteService.buscar(this.form.getRawValue().texto.trim()));
  }
}
