import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { debounceTime } from 'rxjs';
import { Pagina } from '../../../core/models/api.model';
import { ETIQUETA_ACCION, RegistroAuditoria } from '../../../core/models/gestion.model';
import { AuditoriaService } from '../../../core/services/auditoria';
import { Carga } from '../../../core/utils/carga';
import { aFechaIso } from '../../../core/utils/fechas';
import { EstadoLista } from '../../../shared/components/estado-lista/estado-lista';
import { Etiqueta } from '../../../shared/components/etiqueta/etiqueta';

@Component({
  selector: 'app-auditoria',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    EstadoLista,
    Etiqueta,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './auditoria.html',
})
export class Auditoria {
  private readonly fb = inject(FormBuilder);
  private readonly auditoriaService = inject(AuditoriaService);

  protected readonly etiquetaAccion = ETIQUETA_ACCION;
  protected readonly entidades = ['usuario', 'sede', 'especialidad', 'cobertura', 'agenda'];
  protected readonly columnas = ['fecha', 'usuario', 'accion', 'entidad', 'detalle'];

  protected readonly lista = new Carga<Pagina<RegistroAuditoria>>({ items: [], total: 0, pagina: 1, limite: 10 });
  protected readonly pagina = signal(1);
  protected readonly limite = signal(10);

  protected readonly filtros = this.fb.group({
    usuario: [''],
    entidad: [null as string | null],
    desde: [null as Date | null],
    hasta: [null as Date | null],
  });

  constructor() {
    this.filtros.valueChanges.pipe(debounceTime(300), takeUntilDestroyed()).subscribe(() => {
      this.pagina.set(1);
      this.cargar();
    });
    this.cargar();
  }

  protected asAccion(accion: string): RegistroAuditoria['accion'] {
    return accion as RegistroAuditoria['accion'];
  }

  cargar(): void {
    const { usuario, entidad, desde, hasta } = this.filtros.getRawValue();
    this.lista.ejecutar(
      this.auditoriaService.listar({
        usuario: usuario ?? '',
        entidad,
        fecha_desde: desde ? aFechaIso(desde) : null,
        fecha_hasta: hasta ? aFechaIso(hasta) : null,
        pagina: this.pagina(),
        limite: this.limite(),
      }),
    );
  }

  cambiarPagina(evento: PageEvent): void {
    this.pagina.set(evento.pageIndex + 1);
    this.limite.set(evento.pageSize);
    this.cargar();
  }
}
