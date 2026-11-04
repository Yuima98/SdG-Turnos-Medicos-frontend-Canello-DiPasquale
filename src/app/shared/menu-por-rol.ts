import { Rol } from '../core/models/usuario.model';

export interface OpcionMenu {
  etiqueta: string;
  descripcion: string;
  ruta: string;
  icono: string;
  /** Sección de la barra lateral a la que pertenece, si el rol tiene varias. */
  grupo?: string;
}

export const MENU_POR_ROL: Record<Rol, OpcionMenu[]> = {
  paciente: [
    {
      etiqueta: 'Nuevo turno',
      descripcion: 'Elegí especialidad, médico y horario.',
      ruta: '/paciente/nuevo-turno',
      icono: 'calendar_add_on',
    },
    {
      etiqueta: 'Mis turnos',
      descripcion: 'Consultá, cancelá y mirá tu historial.',
      ruta: '/paciente/mis-turnos',
      icono: 'calendar_month',
    },
    {
      etiqueta: 'Mis datos personales',
      descripcion: 'Actualizá tu contacto y cobertura.',
      ruta: '/paciente/mis-datos',
      icono: 'badge',
    },
  ],
  medico: [
    {
      etiqueta: 'Mi agenda',
      descripcion: 'Cargá tus rangos horarios por sede.',
      ruta: '/medico/agenda',
      icono: 'event_available',
    },
    {
      etiqueta: 'Turnos programados',
      descripcion: 'Atendé a tus pacientes del día.',
      ruta: '/medico/turnos',
      icono: 'calendar_month',
    },
    {
      etiqueta: 'Historial clínico',
      descripcion: 'Buscá un paciente y consultá sus registros.',
      ruta: '/medico/historial',
      icono: 'medical_information',
    },
  ],
  operador: [
    {
      etiqueta: 'Agenda y turnos',
      descripcion: 'Mirá la agenda de cada sede por día.',
      ruta: '/operador/agenda',
      icono: 'event_available',
    },
    {
      etiqueta: 'Asignar turno',
      descripcion: 'Buscá al paciente y dale un turno.',
      ruta: '/operador/asignar-turno',
      icono: 'calendar_add_on',
    },
    {
      etiqueta: 'Alta de paciente',
      descripcion: 'Registrá un paciente nuevo.',
      ruta: '/operador/alta-paciente',
      icono: 'person_add',
    },
  ],
  admin: [
    {
      etiqueta: 'Sedes',
      descripcion: 'Administrá las sedes de la clínica.',
      ruta: '/admin/sedes',
      icono: 'location_on',
      grupo: 'Catálogos',
    },
    {
      etiqueta: 'Especialidades',
      descripcion: 'Definí las especialidades médicas.',
      ruta: '/admin/especialidades',
      icono: 'category',
      grupo: 'Catálogos',
    },
    {
      etiqueta: 'Coberturas',
      descripcion: 'Gestioná las obras sociales.',
      ruta: '/admin/coberturas',
      icono: 'health_and_safety',
      grupo: 'Catálogos',
    },
    {
      etiqueta: 'Usuarios',
      descripcion: 'Creá y editá usuarios de todos los roles.',
      ruta: '/admin/usuarios',
      icono: 'manage_accounts',
      grupo: 'Administración',
    },
    {
      etiqueta: 'Auditoría',
      descripcion: 'Revisá las acciones sensibles.',
      ruta: '/admin/auditoria',
      icono: 'fact_check',
      grupo: 'Administración',
    },
    {
      etiqueta: 'Reportes',
      descripcion: 'Seguí los indicadores de la clínica.',
      ruta: '/admin/reportes',
      icono: 'bar_chart',
      grupo: 'Administración',
    },
  ],
};
