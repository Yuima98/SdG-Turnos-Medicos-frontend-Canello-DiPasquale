import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export interface DatosIndicador {
  etiqueta: string;
  valor: number;
  sufijo?: string;
  icono: string;
  detalle?: string;
}

/** Tarjeta de indicador: el número manda y el ícono solo identifica el dato. */
@Component({
  selector: 'app-indicador',
  imports: [DecimalPipe, MatCardModule, MatIconModule],
  template: `
    <mat-card appearance="outlined" class="indicador">
      <span class="indicador-icono"><mat-icon aria-hidden="true">{{ datos().icono }}</mat-icon></span>
      <div>
        <p class="indicador-etiqueta">{{ datos().etiqueta }}</p>
        <p class="indicador-valor">{{ datos().valor | number: '1.0-2' }}{{ datos().sufijo }}</p>
        @if (datos().detalle) {
          <p class="indicador-detalle">{{ datos().detalle }}</p>
        }
      </div>
    </mat-card>
  `,
  styles: `
    :host {
      display: block;
    }

    .indicador {
      flex-direction: row;
      align-items: flex-start;
      gap: 14px;
      height: 100%;
      padding: 18px;
      box-sizing: border-box;
      box-shadow: var(--sdg-sombra-1);
    }

    .indicador-icono {
      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: var(--sdg-radio-s);
      background: var(--sdg-verde-100);
      color: var(--sdg-verde-600);
    }

    p {
      margin: 0;
    }

    .indicador-etiqueta {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--sdg-texto-secundario);
    }

    .indicador-valor {
      font-size: 1.875rem;
      font-weight: 700;
      line-height: 2.5rem;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      color: var(--sdg-petroleo-800);
    }

    .indicador-detalle {
      font-size: 0.75rem;
      color: var(--sdg-texto-secundario);
    }

    @media (max-width: 1199.98px) {
      .indicador {
        flex-direction: column;
        gap: 8px;
        padding: 14px;
      }

      .indicador-valor {
        font-size: 1.5rem;
        line-height: 2rem;
      }
    }
  `,
})
export class Indicador {
  readonly datos = input.required<DatosIndicador>();
}
