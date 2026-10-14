import { Cobertura } from './cobertura.model';

export type Rol = 'admin' | 'medico' | 'operador' | 'paciente';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fechaNacimiento: string;
  cobertura?: Cobertura;
  rol: Rol;
}
