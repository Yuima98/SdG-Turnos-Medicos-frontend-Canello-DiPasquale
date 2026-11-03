export interface LoginRequest {
  dni: string;
  password: string;
}

export interface RegistroRequest {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  password: string;
  fecha_nacimiento: string;
  telefono: string;
  id_cobertura: number;
}

export interface LoginResponse {
  token: string;
}
