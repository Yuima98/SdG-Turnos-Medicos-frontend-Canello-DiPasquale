import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { EnConstruccion } from './features/en-construccion/en-construccion';
import { MiPerfil } from './features/paciente/mi-perfil/mi-perfil';
import { AccesoDenegado } from './features/acceso-denegado/acceso-denegado';
import { NoEncontrada } from './features/no-encontrada/no-encontrada';
import { rolGuard } from './core/guards/rol-guard';

const seccionesComunes: Routes = [
  { path: 'mi-perfil', component: MiPerfil },
  { path: 'en-construccion', component: EnConstruccion },
];

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  { path: 'paciente', canActivate: [rolGuard], data: { roles: ['paciente'] }, children: seccionesComunes },
  { path: 'medico', canActivate: [rolGuard], data: { roles: ['medico'] }, children: seccionesComunes },
  { path: 'operador', canActivate: [rolGuard], data: { roles: ['operador'] }, children: seccionesComunes },
  { path: 'admin', canActivate: [rolGuard], data: { roles: ['admin'] }, children: seccionesComunes },

  { path: 'acceso-denegado', component: AccesoDenegado },
  { path: '**', component: NoEncontrada },
];