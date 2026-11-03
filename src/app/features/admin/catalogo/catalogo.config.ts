import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { CoberturaService } from '../../../core/services/cobertura';
import { EspecialidadService } from '../../../core/services/especialidad';
import { SedeService } from '../../../core/services/sede';
import { PATRON_TELEFONO } from '../../../core/utils/validaciones';

export type FilaCatalogo = { id: number } & Record<string, string | number>;
export type DatosCatalogo = Record<string, string>;

export interface ServicioCatalogo {
  listar(): Observable<FilaCatalogo[]>;
  crear(datos: DatosCatalogo): Observable<unknown>;
  modificar(id: number, datos: DatosCatalogo): Observable<unknown>;
  eliminar(id: number): Observable<unknown>;
}

export interface CampoCatalogo {
  clave: string;
  etiqueta: string;
  maximo: number;
  patron?: RegExp;
  mensajePatron?: string;
}

/** Lo único que distingue a sedes, especialidades y coberturas: comparten pantalla y formulario. */
export interface ConfigCatalogo {
  titulo: string;
  entidad: string;
  articulo: string;
  servicio: Type<ServicioCatalogo>;
  campos: CampoCatalogo[];
}

export const CONFIG_SEDES: ConfigCatalogo = {
  titulo: 'Sedes',
  entidad: 'sede',
  articulo: 'la',
  servicio: SedeService,
  campos: [
    { clave: 'nombre', etiqueta: 'Nombre', maximo: 50 },
    { clave: 'direccion', etiqueta: 'Dirección', maximo: 100 },
    {
      clave: 'telefono',
      etiqueta: 'Teléfono',
      maximo: 15,
      patron: PATRON_TELEFONO,
      mensajePatron: 'Ingresá entre 6 y 10 números.',
    },
  ],
};

export const CONFIG_ESPECIALIDADES: ConfigCatalogo = {
  titulo: 'Especialidades',
  entidad: 'especialidad',
  articulo: 'la',
  servicio: EspecialidadService,
  campos: [{ clave: 'descripcion', etiqueta: 'Descripción', maximo: 30 }],
};

export const CONFIG_COBERTURAS: ConfigCatalogo = {
  titulo: 'Coberturas',
  entidad: 'cobertura',
  articulo: 'la',
  servicio: CoberturaService,
  campos: [{ clave: 'nombre', etiqueta: 'Nombre', maximo: 30 }],
};
