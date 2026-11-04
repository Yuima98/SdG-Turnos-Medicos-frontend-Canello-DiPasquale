import { Rol } from '../core/models/usuario.model';

export type Tono = 'azul' | 'verde' | 'naranja' | 'violeta' | 'rosa' | 'celeste';

export interface OpcionMenu {
  etiqueta: string;
  descripcion: string;
  ruta: string;
  icono: string;
  tono: Tono;
}

export const MENU_POR_ROL: Record<Rol, OpcionMenu[]> = {
  paciente: [
    {
      etiqueta: 'Nuevo turno',
      descripcion: 'Elegí especialidad, médico y horario.',
      ruta: '/paciente/nuevo-turno',
      icono: 'event_available',
      tono: 'azul',
    },
    {
      etiqueta: 'Mis turnos',
      descripcion: 'Consultá, cancelá y mirá tu historial.',
      ruta: '/paciente/mis-turnos',
      icono: 'calendar_month',
      tono: 'verde',
    },
    {
      etiqueta: 'Mis datos personales',
      descripcion: 'Actualizá tu contacto y cobertura.',
      ruta: '/paciente/mis-datos',
      icono: 'badge',
      tono: 'naranja',
    },
  ],
  medico: [
    {
      etiqueta: 'Mi agenda',
      descripcion: 'Cargá tus rangos horarios por sede.',
      ruta: '/medico/agenda',
      icono: 'edit_calendar',
      tono: 'azul',
    },
    {
      etiqueta: 'Turnos programados',
      descripcion: 'Atendé a tus pacientes del día.',
      ruta: '/medico/turnos',
      icono: 'stethoscope',
      tono: 'verde',
    },
    {
      etiqueta: 'Historial clínico',
      descripcion: 'Buscá un paciente y consultá sus registros.',
      ruta: '/medico/historial',
      icono: 'clinical_notes',
      tono: 'violeta',
    },
  ],
  operador: [
    {
      etiqueta: 'Agenda y turnos',
      descripcion: 'Mirá la agenda de cada sede por día.',
      ruta: '/operador/agenda',
      icono: 'calendar_month',
      tono: 'azul',
    },
    {
      etiqueta: 'Asignar turno',
      descripcion: 'Buscá al paciente y dale un turno.',
      ruta: '/operador/asignar-turno',
      icono: 'event_available',
      tono: 'verde',
    },
    {
      etiqueta: 'Alta de paciente',
      descripcion: 'Registrá un paciente nuevo.',
      ruta: '/operador/alta-paciente',
      icono: 'person_add',
      tono: 'naranja',
    },
  ],
  admin: [
    {
      etiqueta: 'Sedes',
      descripcion: 'Administrá las sedes de la clínica.',
      ruta: '/admin/sedes',
      icono: 'apartment',
      tono: 'azul',
    },
    {
      etiqueta: 'Especialidades',
      descripcion: 'Definí las especialidades médicas.',
      ruta: '/admin/especialidades',
      icono: 'medical_services',
      tono: 'verde',
    },
    {
      etiqueta: 'Coberturas',
      descripcion: 'Gestioná las obras sociales.',
      ruta: '/admin/coberturas',
      icono: 'health_and_safety',
      tono: 'celeste',
    },
    {
      etiqueta: 'Usuarios',
      descripcion: 'Creá y editá usuarios de todos los roles.',
      ruta: '/admin/usuarios',
      icono: 'group',
      tono: 'naranja',
    },
    {
      etiqueta: 'Auditoría',
      descripcion: 'Revisá las acciones sensibles.',
      ruta: '/admin/auditoria',
      icono: 'manage_search',
      tono: 'violeta',
    },
    {
      etiqueta: 'Reportes',
      descripcion: 'Seguí los indicadores de la clínica.',
      ruta: '/admin/reportes',
      icono: 'bar_chart',
      tono: 'rosa',
    },
  ],
};
