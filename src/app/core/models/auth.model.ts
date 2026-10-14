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
  fechaNacimiento: string;
  coberturaId: number;
}

export interface LoginResponse {
  token: string;
}
