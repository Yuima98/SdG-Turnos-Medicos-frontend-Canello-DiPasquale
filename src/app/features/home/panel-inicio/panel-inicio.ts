import { DatePipe, formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable, forkJoin, map } from 'rxjs';
import { ETIQUETA_ACCION } from '../../../core/models/gestion.model';
import { EstadoTurno, Turno } from '../../../core/models/turno.model';
import { Rol, Usuario } from '../../../core/models/usuario.model';
import { AgendaService } from '../../../core/services/agenda';
import { AuditoriaService } from '../../../core/services/auditoria';
import { Auth } from '../../../core/services/auth';
import { MedicoService } from '../../../core/services/medico';
import { ReporteService } from '../../../core/services/reporte';
import { TurnoService } from '../../../core/services/turno';
import { UsuarioService } from '../../../core/services/usuario';
import { Carga } from '../../../core/utils/carga';
import { aFechaIso, momentoTurno } from '../../../core/utils/fechas';
import { EstadoLista } from '../../../shared/components/estado-lista/estado-lista';
import { EstadoTurnoEtiqueta } from '../../../shared/components/estado-turno/estado-turno';
import { DatosIndicador, Indicador } from '../../../shared/components/indicador/indicador';

const ITEMS_DE_ACTIVIDAD = 5;
const LOCALE = 'es-AR';

interface ItemActividad {
  clave: number;
  icono: string;
  titulo: string;
  detalle: string;
  momento: string;
  estado?: EstadoTurno;
}

interface DatosPanel {
  indicadores: DatosIndicador[];
  actividad: ItemActividad[];
}

const ACTIVIDAD_POR_ROL: Record<Rol, { titulo: string; vacio: string; ruta: string }> = {
  admin: {
    titulo: 'Actividad reciente',
    vacio: 'Todavía no hay actividad registrada.',
    ruta: '/admin/auditoria',
  },
  medico: { titulo: 'Turnos de hoy', vacio: 'No tenés turnos para hoy.', ruta: '/medico/turnos' },
  operador: {
    titulo: 'Turnos de hoy en tu sede',
    vacio: 'No hay turnos para hoy en tu sede.',
    ruta: '/operador/agenda',
  },
  paciente: {
    titulo: 'Próximos turnos',
    vacio: 'No tenés turnos próximos.',
    ruta: '/paciente/mis-turnos',
  },
};

function contar(turnos: Turno[], estado: EstadoTurno): number {
  return turnos.filter((turno) => turno.estado === estado).length;
}

/** Panel de inicio: cada rol ve indicadores calculados con datos reales de la API. */
@Component({
  selector: 'app-panel-inicio',
  imports: [
    DatePipe,
    RouterLink,
    EstadoLista,
    EstadoTurnoEtiqueta,
    Indicador,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './panel-inicio.html',
  styleUrl: './panel-inicio.scss',
})
export class PanelInicio {
  private readonly agendaService = inject(AgendaService);
  private readonly auditoriaService = inject(AuditoriaService);
  private readonly medicoService = inject(MedicoService);
  private readonly reporteService = inject(ReporteService);
  private readonly turnoService = inject(TurnoService);
  private readonly usuarioService = inject(UsuarioService);

  protected readonly usuario = inject(Auth).usuario() as Usuario;
  protected readonly hoy = new Date();
  protected readonly actividad = ACTIVIDAD_POR_ROL[this.usuario.rol];
  protected readonly datos = new Carga<DatosPanel | null>(null);

  constructor() {
    this.cargar();
  }

  cargar(): void {
    const consultas: Record<Rol, () => Observable<DatosPanel>> = {
      admin: () => this.panelAdmin(),
      medico: () => this.panelMedico(),
      operador: () => this.panelOperador(),
      paciente: () => this.panelPaciente(),
    };
    this.datos.ejecutar(consultas[this.usuario.rol]());
  }

  private panelAdmin(): Observable<DatosPanel> {
    return forkJoin({
      reportes: this.reporteService.obtener({}),
      pacientes: this.usuarioService.listar({ rol: 'paciente', pagina: 1, limite: 1 }),
      medicos: this.medicoService.listar(),
      auditoria: this.auditoriaService.listar({ pagina: 1, limite: ITEMS_DE_ACTIVIDAD }),
    }).pipe(
      map(({ reportes, pacientes, medicos, auditoria }) => {
        const { total_turnos, turnos_cancelados, tasa_cancelacion } = reportes.cancelacion;
        return {
          indicadores: [
            { etiqueta: 'Turnos registrados', valor: total_turnos, icono: 'calendar_month' },
            { etiqueta: 'Pacientes registrados', valor: pacientes.total, icono: 'people' },
            { etiqueta: 'Médicos registrados', valor: medicos.length, icono: 'medical_services' },
            {
              etiqueta: 'Tasa de cancelación',
              valor: tasa_cancelacion,
              sufijo: ' %',
              icono: 'event_busy',
              detalle: `${turnos_cancelados} de ${total_turnos} turnos`,
            },
          ],
          actividad: auditoria.items.map((registro) => ({
            clave: registro.id,
            icono: ETIQUETA_ACCION[registro.accion].icono,
            titulo: `${ETIQUETA_ACCION[registro.accion].texto}: ${registro.entidad}`,
            detalle: `${registro.usuario_apellido}, ${registro.usuario_nombre}`,
            momento: formatDate(registro.fecha, 'dd/MM HH:mm', LOCALE),
          })),
        };
      }),
    );
  }

  private panelMedico(): Observable<DatosPanel> {
    return this.turnoService.listar({ fecha: aFechaIso(this.hoy) }).pipe(
      map((turnos) => ({
        indicadores: [
          { etiqueta: 'Turnos de hoy', valor: turnos.length, icono: 'calendar_month' },
          { etiqueta: 'Pendientes', valor: contar(turnos, 'confirmado'), icono: 'schedule' },
          { etiqueta: 'Atendidos', valor: contar(turnos, 'atendido'), icono: 'check_circle' },
          { etiqueta: 'Cancelados', valor: contar(turnos, 'cancelado'), icono: 'event_busy' },
        ],
        actividad: turnos.slice(0, ITEMS_DE_ACTIVIDAD).map((turno) => ({
          clave: turno.id,
          icono: 'person',
          titulo: `${turno.paciente_apellido}, ${turno.paciente_nombre}`,
          detalle: `${turno.especialidad} · ${turno.sede}`,
          momento: turno.hora,
          estado: turno.estado,
        })),
      })),
    );
  }

  private panelOperador(): Observable<DatosPanel> {
    const fecha = aFechaIso(this.hoy);
    const id_sede = this.usuario.id_sede;

    return forkJoin({
      turnos: this.turnoService.listar({ fecha, id_sede }),
      agenda: this.agendaService.listar({ fecha, id_sede }),
    }).pipe(
      map(({ turnos, agenda }) => ({
        indicadores: [
          { etiqueta: 'Turnos de hoy', valor: turnos.length, icono: 'calendar_month' },
          { etiqueta: 'Pendientes', valor: contar(turnos, 'confirmado'), icono: 'schedule' },
          { etiqueta: 'Atendidos', valor: contar(turnos, 'atendido'), icono: 'check_circle' },
          {
            etiqueta: 'Médicos con agenda hoy',
            valor: new Set(agenda.map((rango) => rango.id_medico)).size,
            icono: 'medical_services',
          },
        ],
        actividad: turnos.slice(0, ITEMS_DE_ACTIVIDAD).map((turno) => ({
          clave: turno.id,
          icono: 'person',
          titulo: `${turno.paciente_apellido}, ${turno.paciente_nombre}`,
          detalle: `${turno.medico_apellido}, ${turno.medico_nombre} · ${turno.especialidad}`,
          momento: turno.hora,
          estado: turno.estado,
        })),
      })),
    );
  }

  private panelPaciente(): Observable<DatosPanel> {
    return this.turnoService.listar().pipe(
      map((turnos) => {
        const ahora = Date.now();
        const proximos = turnos
          .filter((turno) => turno.estado === 'confirmado' && momentoTurno(turno) >= ahora)
          .sort((a, b) => momentoTurno(a) - momentoTurno(b));
        return {
          indicadores: [],
          actividad: proximos.slice(0, ITEMS_DE_ACTIVIDAD).map((turno) => ({
            clave: turno.id,
            icono: 'stethoscope',
            titulo: turno.especialidad,
            detalle: `${turno.medico_apellido}, ${turno.medico_nombre} · ${turno.sede}`,
            momento: `${formatDate(turno.fecha, 'dd/MM', LOCALE)} ${turno.hora}`,
          })),
        };
      }),
    );
  }
}
