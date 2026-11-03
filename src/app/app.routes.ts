import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { invitadoGuard, rolGuard } from './core/guards/auth-guard';
import {
  CONFIG_COBERTURAS,
  CONFIG_ESPECIALIDADES,
  CONFIG_SEDES,
} from './features/admin/catalogo/catalogo.config';

const catalogo = () => import('./features/admin/catalogo/catalogo').then((m) => m.Catalogo);

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login, canActivate: [invitadoGuard] },
  { path: 'registro', component: Registro, canActivate: [invitadoGuard] },
  {
    path: 'admin',
    canActivate: [rolGuard('admin')],
    children: [
      { path: 'sedes', loadComponent: catalogo, data: { config: CONFIG_SEDES } },
      { path: 'especialidades', loadComponent: catalogo, data: { config: CONFIG_ESPECIALIDADES } },
      { path: 'coberturas', loadComponent: catalogo, data: { config: CONFIG_COBERTURAS } },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/admin/usuarios/usuarios').then((m) => m.Usuarios),
      },
      {
        path: 'auditoria',
        loadComponent: () => import('./features/admin/auditoria/auditoria').then((m) => m.Auditoria),
      },
      {
        path: 'reportes',
        loadComponent: () => import('./features/admin/reportes/reportes').then((m) => m.Reportes),
      },
    ],
  },
  {
    path: 'medico',
    canActivate: [rolGuard('medico')],
    children: [
      {
        path: 'agenda',
        loadComponent: () => import('./features/medico/mi-agenda/mi-agenda').then((m) => m.MiAgenda),
      },
      {
        path: 'turnos',
        loadComponent: () =>
          import('./features/medico/turnos-programados/turnos-programados').then((m) => m.TurnosProgramados),
      },
      {
        path: 'historial',
        loadComponent: () => import('./features/medico/historial/historial').then((m) => m.Historial),
      },
    ],
  },
  {
    path: 'operador',
    canActivate: [rolGuard('operador')],
    children: [
      {
        path: 'agenda',
        loadComponent: () =>
          import('./features/operador/agenda-operador/agenda-operador').then((m) => m.AgendaOperador),
      },
      {
        path: 'alta-paciente',
        loadComponent: () =>
          import('./features/operador/alta-paciente/alta-paciente').then((m) => m.AltaPaciente),
      },
      {
        path: 'asignar-turno',
        loadComponent: () =>
          import('./features/operador/asignar-turno/asignar-turno').then((m) => m.AsignarTurno),
      },
    ],
  },
  {
    path: 'paciente',
    canActivate: [rolGuard('paciente')],
    children: [
      {
        path: 'nuevo-turno',
        loadComponent: () =>
          import('./features/paciente/solicitar-turno/solicitar-turno').then((m) => m.SolicitarTurno),
      },
      {
        path: 'mis-turnos',
        loadComponent: () => import('./features/paciente/mis-turnos/mis-turnos').then((m) => m.MisTurnos),
      },
      {
        path: 'mis-datos',
        loadComponent: () => import('./features/paciente/mis-datos/mis-datos').then((m) => m.MisDatos),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
