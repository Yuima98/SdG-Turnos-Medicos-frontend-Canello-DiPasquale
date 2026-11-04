import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Paciente, RegistroHistorial } from '../../../core/models/turno.model';
import { PacienteService } from '../../../core/services/paciente';
import { Carga } from '../../../core/utils/carga';
import { BuscadorPacientes } from '../../../shared/components/buscador-pacientes/buscador-pacientes';
import { EstadoLista } from '../../../shared/components/estado-lista/estado-lista';

@Component({
  selector: 'app-historial',
  imports: [DatePipe, BuscadorPacientes, EstadoLista, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './historial.html',
  styleUrl: './historial.scss',
})
export class Historial {
  private readonly pacienteService = inject(PacienteService);

  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly registros = new Carga<RegistroHistorial[]>([]);

  seleccionar(paciente: Paciente): void {
    this.paciente.set(paciente);
    this.cargar();
  }

  cargar(): void {
    const paciente = this.paciente();
    if (paciente) {
      this.registros.ejecutar(this.pacienteService.historial(paciente.id));
    }
  }
}
