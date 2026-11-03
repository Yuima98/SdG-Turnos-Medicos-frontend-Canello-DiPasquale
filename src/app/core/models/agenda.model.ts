import { Especialidad } from './especialidad.model';

export interface RangoAgenda {
  id: number;
  hora_entrada: string;
  hora_salida: string;
  fecha: string;
  id_medico: number;
  medico_nombre: string;
  medico_apellido: string;
  id_especialidad: number;
  especialidad: string;
  id_sede: number;
  sede: string;
}

export interface RangoRequest {
  hora_entrada: string;
  hora_salida: string;
  fecha: string;
  id_medico: number;
  id_especialidad: number;
  id_sede: number;
}

export interface FiltrosAgenda {
  id_medico?: number | null;
  id_sede?: number | null;
  fecha?: string | null;
}

export interface FiltrosDisponibilidad {
  id_medico: number;
  id_especialidad: number;
  id_sede: number;
}

export interface HorarioLibre {
  hora: string;
  id_agenda: number;
}

export interface Medico {
  id: number;
  nombre: string;
  apellido: string;
  especialidades: Especialidad[];
}

export interface FiltrosMedico {
  id_especialidad?: number | null;
  id_sede?: number | null;
  con_agenda?: number;
}
