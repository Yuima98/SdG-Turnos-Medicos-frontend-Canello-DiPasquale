export type Rol = 'admin' | 'medico' | 'operador' | 'paciente';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  rol: Rol;
  id_sede: number | null;
  sede: string | null;
  id_cobertura: number | null;
  cobertura: string | null;
}
