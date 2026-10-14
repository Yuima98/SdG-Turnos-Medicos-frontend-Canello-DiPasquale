export type Rol = 'admin' | 'medico' | 'operador' | 'paciente';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fecha_nacimiento: string;
  telefono: string;
  rol: Rol;
  id_sede: number | null;
  id_cobertura: number | null;
}