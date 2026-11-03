export type EstadoTurno = 'confirmado' | 'cancelado' | 'atendido';

export interface Turno {
  id: number;
  nota: string;
  fecha: string;
  hora: string;
  estado: EstadoTurno;
  id_paciente: number;
  paciente_nombre: string;
  paciente_apellido: string;
  paciente_dni: string;
  paciente_fecha_nacimiento: string;
  id_cobertura: number;
  cobertura: string;
  id_medico: number;
  medico_nombre: string;
  medico_apellido: string;
  id_especialidad: number;
  especialidad: string;
  id_sede: number;
  sede: string;
  diagnostico?: string | null;
  tratamiento?: string | null;
  observaciones?: string | null;
}

export interface FiltrosTurno {
  fecha?: string;
  id_sede?: number | null;
  id_medico?: number | null;
  estado?: EstadoTurno;
}

export interface TurnoRequest {
  id_agenda: number;
  hora: string;
  nota: string;
  dni_paciente?: string;
}

export interface AtencionRequest {
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
}

export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nacimiento: string;
  id_cobertura: number | null;
  cobertura: string | null;
}

export interface MisDatosRequest {
  email: string;
  telefono: string;
  id_cobertura: number;
  password?: string;
}

export interface RegistroHistorial {
  id: number;
  id_turno: number;
  diagnostico: string;
  tratamiento: string | null;
  observaciones: string | null;
  fecha_turno: string;
  hora_turno: string;
  medico_nombre: string;
  medico_apellido: string;
  especialidad: string;
  sede: string;
}
