import { Component, computed, input } from '@angular/core';
import { EstadoTurno } from '../../../core/models/turno.model';
import { Etiqueta, TonoEtiqueta } from '../etiqueta/etiqueta';

const ESTILOS: Record<EstadoTurno, { tono: TonoEtiqueta; icono: string }> = {
  confirmado: { tono: 'info', icono: 'schedule' },
  atendido: { tono: 'exito', icono: 'check_circle' },
  cancelado: { tono: 'peligro', icono: 'cancel' },
};

@Component({
  selector: 'app-estado-turno',
  imports: [Etiqueta],
  template: `<app-etiqueta [tono]="estilo().tono" [icono]="estilo().icono">{{ estado() }}</app-etiqueta>`,
})
export class EstadoTurnoEtiqueta {
  readonly estado = input.required<EstadoTurno>();

  protected readonly estilo = computed(() => ESTILOS[this.estado()]);
}
