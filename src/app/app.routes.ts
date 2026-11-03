import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { invitadoGuard, rolGuard } from './core/guards/auth-guard';
import { Catalogo } from './features/admin/catalogo/catalogo';
import { Usuarios } from './features/admin/usuarios/usuarios';
import { Auditoria } from './features/admin/auditoria/auditoria';
import { Reportes } from './features/admin/reportes/reportes';
import { MiAgenda } from './features/medico/mi-agenda/mi-agenda';
import { TurnosProgramados } from './features/medico/turnos-programados/turnos-programados';
import { Historial } from './features/medico/historial/historial';
import { AgendaOperador } from './features/operador/agenda-operador/agenda-operador';
import { AltaPaciente } from './features/operador/alta-paciente/alta-paciente';
import { AsignarTurno } from './features/operador/asignar-turno/asignar-turno';
import { SolicitarTurno } from './features/paciente/solicitar-turno/solicitar-turno';
import { MisTurnos } from './features/paciente/mis-turnos/mis-turnos';
import {
  CONFIG_COBERTURAS,
  CONFIG_ESPECIALIDADES,
  CONFIG_SEDES,
} from './features/admin/catalogo/catalogo.config';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login, canActivate: [invitadoGuard] },
  { path: 'registro', component: Registro, canActivate: [invitadoGuard] },
  {
    path: 'admin',
    canActivate: [rolGuard('admin')],
    children: [
      { path: 'sedes', component: Catalogo, data: { config: CONFIG_SEDES } },
      { path: 'especialidades', component: Catalogo, data: { config: CONFIG_ESPECIALIDADES } },
      { path: 'coberturas', component: Catalogo, data: { config: CONFIG_COBERTURAS } },
      { path: 'usuarios', component: Usuarios },
      { path: 'auditoria', component: Auditoria },
      { path: 'reportes', component: Reportes },
    ],
  },
  {
    path: 'medico',
    canActivate: [rolGuard('medico')],
    children: [
      { path: 'agenda', component: MiAgenda },
      { path: 'turnos', component: TurnosProgramados },
      { path: 'historial', component: Historial },
    ],
  },
  {
    path: 'operador',
    canActivate: [rolGuard('operador')],
    children: [
      { path: 'agenda', component: AgendaOperador },
      { path: 'alta-paciente', component: AltaPaciente },
      { path: 'asignar-turno', component: AsignarTurno },
    ],
  },
  {
    path: 'paciente',
    canActivate: [rolGuard('paciente')],
    children: [
      { path: 'nuevo-turno', component: SolicitarTurno },
      { path: 'mis-turnos', component: MisTurnos },
    ],
  },
  { path: '**', redirectTo: '' },
];
