import { Especialidad } from './especialidad.model';
import { Rol, Usuario } from './usuario.model';

export interface UsuarioGestion extends Usuario {
  especialidades: Especialidad[];
}

export interface FiltrosUsuario {
  nombre?: string;
  apellido?: string;
  rol?: Rol | null;
  id_sede?: number | null;
  pagina: number;
  limite: number;
}

export interface UsuarioRequest {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  password?: string;
  rol?: Rol;
  id_sede?: number | null;
  id_cobertura?: number | null;
  especialidades?: number[];
}

export interface RegistroAuditoria {
  id: number;
  id_usuario: number;
  usuario_nombre: string;
  usuario_apellido: string;
  accion: 'ALTA' | 'BAJA' | 'MODIFICACION';
  entidad: string;
  id_entidad: number | null;
  detalle: string | null;
  fecha: string;
}

export interface FiltrosAuditoria {
  usuario?: string;
  entidad?: string | null;
  fecha_desde?: string | null;
  fecha_hasta?: string | null;
  pagina: number;
  limite: number;
}

export interface FiltrosReporte {
  fecha_desde?: string | null;
  fecha_hasta?: string | null;
}

export interface TurnosPorEspecialidad {
  id_especialidad: number;
  descripcion: string;
  cantidad_turnos: number;
}

export interface TurnosPorSede {
  id_sede: number;
  nombre: string;
  cantidad_turnos: number;
}

export interface RankingMedico {
  id_medico: number;
  nombre: string;
  apellido: string;
  cantidad_turnos_atendidos: number;
}

export interface TasaCancelacion {
  total_turnos: number;
  turnos_cancelados: number;
  tasa_cancelacion: number;
}

export interface Reportes {
  especialidades: TurnosPorEspecialidad[];
  sedes: TurnosPorSede[];
  ranking: RankingMedico[];
  cancelacion: TasaCancelacion;
}
