import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { EnConstruccion } from './features/en-construccion/en-construccion';
import { MiPerfil } from './features/paciente/mi-perfil/mi-perfil';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'mi-perfil', component: MiPerfil },
  { path: 'en-construccion', component: EnConstruccion },
];
