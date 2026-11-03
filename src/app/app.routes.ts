import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { EnConstruccion } from './features/en-construccion/en-construccion';
import { invitadoGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login, canActivate: [invitadoGuard] },
  { path: 'registro', component: Registro, canActivate: [invitadoGuard] },
  { path: 'en-construccion', component: EnConstruccion },
  { path: '**', redirectTo: '' },
];
