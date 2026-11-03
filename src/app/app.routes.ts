import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { EnConstruccion } from './features/en-construccion/en-construccion';
import { invitadoGuard, rolGuard } from './core/guards/auth-guard';
import { Catalogo } from './features/admin/catalogo/catalogo';
import { Usuarios } from './features/admin/usuarios/usuarios';
import { Auditoria } from './features/admin/auditoria/auditoria';
import { Reportes } from './features/admin/reportes/reportes';
import { MiAgenda } from './features/medico/mi-agenda/mi-agenda';
import { TurnosProgramados } from './features/medico/turnos-programados/turnos-programados';
import {
  CONFIG_COBERTURAS,
  CONFIG_ESPECIALIDADES,
  CONFIG_SEDES,
} from './features/admin/catalogo/catalogo.config';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login, canActivate: [invitadoGuard] },
  { path: 'registro', component: Registro, canActivate: [invitadoGuard] },
  { path: 'en-construccion', component: EnConstruccion },
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
    ],
  },
  { path: '**', redirectTo: '' },
];
