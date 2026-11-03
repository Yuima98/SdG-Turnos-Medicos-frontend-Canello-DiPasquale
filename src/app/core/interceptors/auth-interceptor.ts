import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TimeoutError, catchError, throwError, timeout } from 'rxjs';
import { Auth } from '../services/auth';
import { Avisos } from '../services/avisos';

const TIEMPO_MAXIMO_MS = 15000;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const avisos = inject(Avisos);
  const router = inject(Router);
  const token = auth.obtenerToken();

  const solicitud = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(solicitud).pipe(
    timeout(TIEMPO_MAXIMO_MS),
    catchError((error: unknown) => {
      if (error instanceof TimeoutError) {
        return throwError(() => new HttpErrorResponse({ status: 0, url: req.url }));
      }
      const sesionVencida = error instanceof HttpErrorResponse && error.status === 401;
      if (sesionVencida && token && !req.url.endsWith('/auth/login')) {
        auth.cerrarSesion();
        avisos.informar('Tu sesión venció. Ingresá nuevamente.');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
