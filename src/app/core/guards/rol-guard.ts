import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { Auth } from '../services/auth';
import { Rol } from '../models/usuario.model';

export const rolGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const rolesPermitidos = route.data['roles'] as Rol[];

  return inject(Auth)
    .obtenerUsuario()
    .pipe(
      map((usuario) => {
        if (!usuario) return router.createUrlTree(['/login']);
        if (rolesPermitidos.includes(usuario.rol)) return true;
        return router.createUrlTree(['/acceso-denegado']);
      }),
    );
};