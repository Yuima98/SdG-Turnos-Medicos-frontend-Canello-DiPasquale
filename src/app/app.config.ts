import {
  ApplicationConfig,
  LOCALE_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { catchError, of } from 'rxjs';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { Auth } from './core/services/auth';
import { Avisos } from './core/services/avisos';
import { FORMATOS_FECHA, FechaAdapter } from './core/utils/fechas';
import { Paginador } from './core/utils/paginador';

registerLocaleData(localeEsAr);

/** Recupera la sesión antes de activar las rutas, para que los guards conozcan al usuario. */
function restaurarSesion() {
  const auth = inject(Auth);
  const avisos = inject(Avisos);

  if (!auth.obtenerToken()) {
    return of(null);
  }
  return auth.cargarPerfil().pipe(
    catchError((error: unknown) => {
      avisos.error(error, 'No se pudo recuperar la sesión.');
      return of(null);
    }),
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNativeDateAdapter(FORMATOS_FECHA),
    { provide: DateAdapter, useClass: FechaAdapter },
    { provide: MatPaginatorIntl, useClass: Paginador },
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
    { provide: LOCALE_ID, useValue: 'es-AR' },
    provideAppInitializer(restaurarSesion),
  ],
};
