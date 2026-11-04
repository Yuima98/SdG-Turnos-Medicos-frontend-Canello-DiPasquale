import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs';
import { Reportes as DatosReportes } from '../../../core/models/gestion.model';
import { ReporteService } from '../../../core/services/reporte';
import { Carga } from '../../../core/utils/carga';
import { aFechaIso } from '../../../core/utils/fechas';
import { EstadoLista } from '../../../shared/components/estado-lista/estado-lista';
import { GraficoBarras } from '../../../shared/components/grafico-barras/grafico-barras';
import { DatosIndicador, Indicador } from '../../../shared/components/indicador/indicador';

@Component({
  selector: 'app-reportes',
  imports: [
    ReactiveFormsModule,
    EstadoLista,
    GraficoBarras,
    Indicador,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTableModule,
  ],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes {
  private readonly fb = inject(FormBuilder);
  private readonly reporteService = inject(ReporteService);

  protected readonly columnasRanking = ['posicion', 'medico', 'cantidad'];
  protected readonly reportes = new Carga<DatosReportes | null>(null);

  protected readonly filtros = this.fb.group({
    desde: [null as Date | null],
    hasta: [null as Date | null],
  });

  protected readonly indicadores = computed((): DatosIndicador[] => {
    const cancelacion = this.reportes.datos()?.cancelacion;
    if (!cancelacion) {
      return [];
    }
    const { total_turnos, turnos_cancelados, tasa_cancelacion } = cancelacion;
    return [
      { etiqueta: 'Turnos del período', valor: total_turnos, icono: 'calendar_month' },
      { etiqueta: 'Turnos cancelados', valor: turnos_cancelados, icono: 'event_busy' },
      {
        etiqueta: 'Tasa de cancelación',
        valor: tasa_cancelacion,
        sufijo: ' %',
        icono: 'percent',
        detalle: `${turnos_cancelados} cancelados de ${total_turnos} turnos`,
      },
    ];
  });

  protected readonly especialidades = computed(() => {
    const filas = this.reportes.datos()?.especialidades ?? [];
    return { etiquetas: filas.map((f) => f.descripcion), valores: filas.map((f) => f.cantidad_turnos) };
  });

  protected readonly sedes = computed(() => {
    const filas = this.reportes.datos()?.sedes ?? [];
    return { etiquetas: filas.map((f) => f.nombre), valores: filas.map((f) => f.cantidad_turnos) };
  });

  constructor() {
    // Se espera a tener el rango completo, o vacío, para no consultar con la fecha a medio elegir.
    this.filtros.valueChanges
      .pipe(
        filter(({ desde, hasta }) => Boolean(desde) === Boolean(hasta)),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.cargar());
    this.cargar();
  }

  cargar(): void {
    const { desde, hasta } = this.filtros.getRawValue();
    this.reportes.ejecutar(
      this.reporteService.obtener({
        fecha_desde: desde ? aFechaIso(desde) : null,
        fecha_hasta: hasta ? aFechaIso(hasta) : null,
      }),
    );
  }
}
