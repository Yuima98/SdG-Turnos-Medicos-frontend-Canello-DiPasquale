# SDG Turnos Médicos — Frontend

Frontend de la clínica virtual, construido con Angular y Angular Material. Consume la API de turnos médicos del repositorio [SdG-Turnos-Medicos-Canello-DiPasquale](https://github.com/Yuima98/SdG-Turnos-Medicos-Canello-DiPasquale) y cubre los cuatro roles: administrador, médico, operador y paciente.

## Versiones utilizadas

| Herramienta | Versión |
| --- | --- |
| Node.js | 24.11.0 (Angular 21 requiere `^20.19.0`, `^22.12.0` o `^24.0.0`) |
| npm | 11.6.1 |
| Angular CLI | 21.2.26 |
| Angular | 21.2.25 |
| Angular Material | 21.2.14 |
| TypeScript | 5.9 |
| Librería de gráficos | Chart.js 4.6.1 |
| Base de datos | MySQL o MariaDB (probado con MariaDB 10.4 de XAMPP) |

## Levantar el sistema desde cero

Se necesitan los dos repositorios, Node.js y un servidor MySQL o MariaDB corriendo. Los comandos de la base se ejecutan desde CMD o Git Bash, porque PowerShell no admite la redirección con `<`.

### 1. Base de datos

Parado en la carpeta del backend:

```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS clinica_bdd; CREATE DATABASE clinica_bdd"
mysql -u root -p clinica_bdd < clinica_bdd.sql
mysql -u root -p clinica_bdd < datos_demo.sql
```

- `clinica_bdd.sql` crea las tablas. Si ya tenían la base de una entrega anterior hay que recrearla, porque cambiaron los tipos de los ids, la nota del turno y se agregaron restricciones `UNIQUE`.
- `datos_demo.sql` carga los datos de prueba: tres sedes, tres médicos entre los que Ana Lopez atiende en dos sedes, y turnos confirmados, cancelados y atendidos. Las fechas son relativas al día en que se ejecuta, así que conviene correrlo de nuevo antes de la defensa. Se puede repetir las veces que haga falta.

En XAMPP, `mysql` está en `C:\xampp\mysql\bin\mysql.exe` y el usuario `root` no tiene contraseña por defecto (en ese caso, sacar el `-p`).

### 2. Backend

```bash
git clone https://github.com/Yuima98/SdG-Turnos-Medicos-Canello-DiPasquale
cd SdG-Turnos-Medicos-Canello-DiPasquale
git checkout entrega-frontend
npm install
```

Crear un archivo `.env` en la raíz, tomando como base `.env.example`:

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto de la API | `3000` |
| `DB_HOST` | Host de la base | `localhost` |
| `DB_USER` | Usuario de la base | `root` |
| `DB_PASSWORD` | Contraseña de la base | |
| `DB_NAME` | Nombre de la base | `clinica_bdd` |
| `JWT_SECRET` | Clave para firmar los tokens | un texto largo y aleatorio |
| `CORS_ORIGIN` | Origen permitido (opcional) | `http://localhost:4200` |

Levantar la API y comprobar que responde:

```bash
npm run dev
curl http://localhost:3000/health
```

### 3. Frontend

```bash
git clone https://github.com/Yuima98/SdG-Turnos-Medicos-frontend-Canello-DiPasquale
cd SdG-Turnos-Medicos-frontend-Canello-DiPasquale
git checkout entrega-frontend
npm install
npx ng serve
```

Abrir `http://localhost:4200/`. La URL de la API se configura una sola vez, en la clave `apiUrl` de `src/environments/environment.ts` y `src/environments/environment.development.ts`. Por defecto es `http://localhost:3000`.

## Usuarios de prueba

Todos usan la contraseña `Password123!` y se ingresa con el DNI.

| Rol | Usuario | DNI | Sede | Para probar |
| --- | --- | --- | --- | --- |
| Administrador | Marcos Gomez | `18222333` | — | Catálogos, usuarios, auditoría y reportes |
| Médico | Ana Lopez | `20111222` | Centro | Atiende en Centro y Norte: Traumatología y Cardiología |
| Médico | Carla Ruiz | `25333444` | Norte | Pediatría |
| Médico | Pablo Diaz | `27444555` | Centro | Dermatología |
| Operador | Juan Perez | `15200548` | Centro | Agenda y turnos de Sede Centro |
| Operador | Lucia Sosa | `30555666` | Norte | Agenda y turnos de Sede Norte |
| Paciente | Franco Friggeri | `36000960` | — | Turnos en los tres estados, con historial clínico |
| Paciente | Sofia Martinez | `38666777` | — | Cobertura OSDE |
| Paciente | Tomas Romero | `40777888` | — | Cobertura Swiss Medical |

## Funcionalidades por rol

- **Administrador:** sedes, especialidades y coberturas; usuarios; auditoría; reportes.
- **Médico:** agenda propia en una o más sedes; turnos programados con atención e historial; consulta del historial de los turnos que atendió.
- **Operador:** agenda y turnos de su sede, con consulta de las demás; alta de pacientes; asignación de turnos.
- **Paciente:** nuevo turno paso a paso; mis turnos con historial clínico; mis datos personales.
- **Todos:** notificaciones en la campana del encabezado.

## Decisiones de diseño

- **Acceso a la API:** toda llamada pasa por el servicio `Api`, que arma la URL y desempaqueta el campo `datos` de la respuesta uniforme. Ninguna otra parte del código conoce la URL base.
- **Sesión y errores:** el interceptor agrega el token, corta las solicitudes que tardan más de 15 segundos y, ante un 401, cierra la sesión y lleva al login. La sesión se recupera antes de activar las rutas, para que los guards funcionen al recargar o al escribir una URL a mano.
- **Listados:** `Carga` guarda el dato, el indicador de carga y el error de cada pedido, y `EstadoLista` los muestra de la misma forma en todas las pantallas, con un botón para reintentar.
- **Reutilización:** `PacienteForm` se usa en el registro y en el alta del operador; `NuevoTurno`, en el paciente y en el operador con la sede fija; `AgendaRangos` y `RangoDialogo`, en el médico y en el operador; `Catalogo`, en sedes, especialidades y coberturas.
- **Duración del turno:** 30 minutos, definida en el backend. El alta de turno y la consulta de horarios libres aplican las mismas reglas, por lo que nunca se ofrece un horario que después se rechazaría.
- **Reservas simultáneas:** el alta bloquea al médico en una transacción y la base impide dos turnos confirmados en el mismo horario. Si alguien gana la reserva, el otro recibe un 409 y vuelve a elegir horario.
- **Carga diferida:** las pantallas de cada rol, el login, el registro y el panel de inicio se descargan al entrar a ellos, y así el build de producción respeta el presupuesto configurado.
- **Identidad visual:** colores, radios y sombras son variables CSS definidas en `src/styles/_tokens.scss`, y Angular Material se personaliza solo con su API de `overrides` en `src/styles/_material.scss`. Los íconos son Material Symbols.
- **Panel de inicio:** cada rol ve indicadores calculados con los servicios existentes. No hay datos de ejemplo ni endpoints propios del panel.
- **Orden de columnas:** `mat-sort` se usa en los listados que llegan completos al navegador. Usuarios y auditoría se paginan en el servidor, que no ofrece orden, y ordenar solo la página visible sería engañoso.

## Cambios en el backend para este frontend

Están en la rama `entrega-frontend` del backend y documentados en la colección de Postman (`testing/`).

- **Conexión:** CORS habilitado y `GET /auth/perfil` disponible para todos los roles, con nombres de sede y cobertura.
- **Base de datos:** ids `int` (con `tinyint`, auditoría y notificaciones se detenían en 127 registros), `nota` de hasta 255 caracteres y usuarios de ejemplo con contraseña real.
- **Listados con sesión:** `GET /medicos` nuevo, y lectura de `/sedes` y `/especialidades` para cualquier usuario con sesión.
- **Agenda:** el listado incluye nombres; el operador solo modifica su sede (403); se valida hora de salida posterior a la de entrada, especialidad propia del médico y rangos no superpuestos; no se elimina un rango con turnos confirmados ni se lo modifica dejándolos afuera (409).
- **Disponibilidad:** `GET /agenda/disponibilidad/fechas` y `GET /agenda/disponibilidad/horarios` para paciente y operador.
- **Turnos:** `GET /turno` devuelve nombres, datos del paciente e historial para el propio paciente, con filtros de sede, médico y estado. El médico cancela sus propios turnos en cualquier sede y el operador solo asigna en la suya. `PATCH /turno/:id/atender` acepta el historial y lo guarda en la misma transacción. Las notificaciones muestran las fechas como día/mes/año y también avisan al médico.
- **Pacientes:** `GET /pacientes?q=` para buscar por DNI o apellido, `POST /pacientes` para el alta por operador y `PUT /pacientes/mis-datos`, que solo modifica email, contraseña, teléfono y cobertura.
- **Usuarios:** `GET`, `POST` y `PUT /usuarios` para el administrador, con paginación, filtros y especialidades del médico.
- **Auditoría:** listado paginado con el nombre del usuario. Se registran además los usuarios y la agenda.
- **Bajas:** no se elimina una especialidad usada en la agenda ni una cobertura con turnos.

## Estructura de carpetas

```
src/styles/              # Variables de identidad visual, tema de Material y estructura común
src/app/
├── core/               # Lógica transversal (una sola instancia en toda la app)
│   ├── guards/          # Control de acceso por rol
│   ├── interceptors/    # Token, tiempo máximo y sesión vencida
│   ├── models/          # Interfaces de la API
│   ├── services/        # Acceso a la API y avisos
│   └── utils/           # Fechas, validaciones y estado de carga
├── shared/
│   └── components/      # Componentes reutilizables (header, formularios, diálogos...)
└── features/            # Pantallas por funcionalidad y rol
    ├── admin/  agenda/  auth/  home/
    └── medico/  operador/  paciente/  turnos/
```

## Otros comandos

```bash
ng build        # Compila para producción en dist/
ng test         # Corre los tests unitarios
```
