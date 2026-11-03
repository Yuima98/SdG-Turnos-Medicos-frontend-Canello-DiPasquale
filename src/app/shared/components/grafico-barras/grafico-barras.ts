import { Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Tooltip,
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const COLOR_BARRA = '#005cbb';
const COLOR_TEXTO = '#44474e';
const COLOR_GRILLA = '#e1e2e8';
const ALTO_POR_BARRA_PX = 44;
const ALTO_EJE_PX = 32;

/** Barras horizontales de una sola serie: el título de la tarjeta dice qué se está midiendo. */
@Component({
  selector: 'app-grafico-barras',
  template: `
    <div [style.height.px]="etiquetas().length * alturaBarra + alturaEje" class="contenedor">
      <canvas #lienzo role="img" [attr.aria-label]="descripcion()"></canvas>
    </div>
  `,
  styles: `
    .contenedor {
      position: relative;
    }
  `,
})
export class GraficoBarras implements OnDestroy {
  readonly etiquetas = input.required<string[]>();
  readonly valores = input.required<number[]>();
  readonly descripcion = input.required<string>();

  protected readonly alturaBarra = ALTO_POR_BARRA_PX;
  protected readonly alturaEje = ALTO_EJE_PX;

  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');
  private grafico?: Chart<'bar'>;

  constructor() {
    effect(() => {
      const etiquetas = this.etiquetas();
      const valores = this.valores();
      const canvas = this.lienzo().nativeElement;

      this.grafico?.destroy();
      this.grafico = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: etiquetas,
          datasets: [
            {
              data: valores,
              backgroundColor: COLOR_BARRA,
              borderRadius: 4,
              borderSkipped: 'start',
              barThickness: 20,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { display: false },
            tooltip: { displayColors: false },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { precision: 0, color: COLOR_TEXTO },
              grid: { color: COLOR_GRILLA },
              border: { display: false },
            },
            y: {
              ticks: { color: COLOR_TEXTO },
              grid: { display: false },
            },
          },
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.grafico?.destroy();
  }
}
