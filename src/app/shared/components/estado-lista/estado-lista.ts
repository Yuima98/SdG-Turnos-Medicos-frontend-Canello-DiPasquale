import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/** Muestra carga, error o lista vacía; si hay datos, muestra el contenido proyectado. */
@Component({
  selector: 'app-estado-lista',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './estado-lista.html',
  styleUrl: './estado-lista.scss',
})
export class EstadoLista {
  readonly cargando = input.required<boolean>();
  readonly error = input<string | null>(null);
  readonly vacio = input(false);
  readonly mensajeVacio = input('No hay resultados.');
  readonly iconoVacio = input('inbox');

  readonly reintentar = output<void>();
}
