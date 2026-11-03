import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Rol } from '../models/usuario.model';
import { Auth } from '../services/auth';

/** Permite el acceso solo a los roles indicados, también si se escribe la URL a mano. */
export function rolGuard(...roles: Rol[]): CanActivateFn {
  return () => {
    const usuario = inject(Auth).usuario();
    const router = inject(Router);

    if (!usuario) {
      return router.createUrlTree(['/login']);
    }
    return roles.includes(usuario.rol) ? true : router.createUrlTree(['/']);
  };
}

/** Login y registro solo tienen sentido sin sesión iniciada. */
export const invitadoGuard: CanActivateFn = () => {
  return inject(Auth).estaLogueado() ? inject(Router).createUrlTree(['/']) : true;
};
