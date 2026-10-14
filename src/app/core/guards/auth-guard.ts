import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  return inject(Auth)
    .obtenerUsuario()
    .pipe(map((usuario) => (usuario ? true : router.createUrlTree(['/login']))));
};