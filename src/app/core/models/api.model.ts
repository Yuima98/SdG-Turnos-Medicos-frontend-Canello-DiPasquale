export interface RespuestaApi<T> {
  codigo: number;
  estado: string;
  datos: T;
}

export interface Pagina<T> {
  items: T[];
  total: number;
  pagina: number;
  limite: number;
}

export interface IdCreado {
  id: number;
}
