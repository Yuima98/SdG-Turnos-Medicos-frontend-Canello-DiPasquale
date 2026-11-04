import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export type TonoEtiqueta = 'neutro' | 'info' | 'exito' | 'alerta' | 'peligro';

/** Etiqueta de estado: el color siempre va junto al texto, nunca solo. */
@Component({
  selector: 'app-etiqueta',
  imports: [MatChipsModule, MatIconModule],
  template: `
    <mat-chip-set>
      <mat-chip [class]="'etiqueta tono-' + tono()" disableRipple>
        @if (icono()) {
          <mat-icon matChipAvatar aria-hidden="true">{{ icono() }}</mat-icon>
        }
        <ng-content />
      </mat-chip>
    </mat-chip-set>
  `,
  styleUrl: './etiqueta.scss',
})
export class Etiqueta {
  readonly tono = input<TonoEtiqueta>('neutro');
  readonly icono = input<string>();
}
