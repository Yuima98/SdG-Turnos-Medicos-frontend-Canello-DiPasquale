import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Avisos } from '../../../core/services/avisos';
import { Carga } from '../../../core/utils/carga';
import { Confirmacion } from '../../../shared/components/confirmacion/confirmacion';
import { EstadoLista } from '../../../shared/components/estado-lista/estado-lista';
import { CatalogoDialogo } from './catalogo-dialogo';
import { ConfigCatalogo, FilaCatalogo } from './catalogo.config';

/** Pantalla de sedes, especialidades y coberturas: la ruta indica cuál mostrar. */
@Component({
  selector: 'app-catalogo',
  imports: [
    EstadoLista,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './catalogo.html',
})
export class Catalogo {
  private readonly dialog = inject(MatDialog);
  private readonly confirmacion = inject(Confirmacion);
  private readonly avisos = inject(Avisos);

  protected readonly config: ConfigCatalogo = inject(ActivatedRoute).snapshot.data['config'];
  private readonly servicio = inject(this.config.servicio);

  protected readonly columnas = [...this.config.campos.map((campo) => campo.clave), 'acciones'];
  protected readonly lista = new Carga<FilaCatalogo[]>([]);
  protected readonly filtro = signal('');

  protected readonly filas = computed(() => {
    const texto = this.filtro().trim().toLowerCase();
    return this.lista.datos().filter((fila) =>
      this.config.campos.some((campo) => String(fila[campo.clave]).toLowerCase().includes(texto)),
    );
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.lista.ejecutar(this.servicio.listar());
  }

  abrirFormulario(fila?: FilaCatalogo): void {
    this.dialog
      .open(CatalogoDialogo, { data: { config: this.config, servicio: this.servicio, fila } })
      .afterClosed()
      .subscribe((guardado) => {
        if (guardado) {
          this.avisos.exito(`Se guardó ${this.config.articulo} ${this.config.entidad}.`);
          this.cargar();
        }
      });
  }

  eliminar(fila: FilaCatalogo): void {
    const nombre = fila[this.config.campos[0].clave];
    const { articulo, entidad } = this.config;

    this.confirmacion
      .pedir(`Eliminar ${entidad}`, `¿Está seguro de eliminar ${articulo} ${entidad} "${nombre}"?`, 'Sí, eliminar')
      .subscribe((confirmado) => {
        if (!confirmado) {
          return;
        }
        this.servicio.eliminar(fila.id).subscribe({
          next: () => {
            this.avisos.exito(`Se eliminó ${articulo} ${entidad}.`);
            this.cargar();
          },
          error: (error: unknown) => this.avisos.error(error, `No se pudo eliminar ${articulo} ${entidad}.`),
        });
      });
  }
}
