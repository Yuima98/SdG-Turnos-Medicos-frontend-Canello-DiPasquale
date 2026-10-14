# SDG Turnos Médicos — Frontend

Frontend de la clínica virtual, construido con Angular y Angular Material. Consume la API de turnos médicos (registro, login, perfil, coberturas, etc.).

## Versiones utilizadas

- **Node.js**: v24.11.0
- **npm**: 11.6.1
- **Angular CLI**: 21.2.26
- **Angular**: 21.2.0
- **Angular Material**: 21.2.14
- **TypeScript**: 5.9.2

Angular 21 requiere Node `^20.19.0`, `^22.12.0` o `^24.0.0`.

## Instalación

1. Instalar dependencias:

```bash
   npm install
```

   Si falla con `Cannot read properties of null (reading 'edgesOut')`, usar `npm install --legacy-peer-deps`.

2. Configurar la URL base del backend en `src/environments/environment.ts` y `src/environments/environment.development.ts` (clave `apiUrl`). Por defecto apunta a `http://localhost:3000`.

3. Asegurarse de que el backend tenga CORS habilitado para `http://localhost:4200`.

## Levantar el proyecto

```bash
ng serve
```

Luego abrir `http://localhost:4200/` en el navegador. La app se recarga automáticamente al modificar el código fuente.

## Estructura de carpetas

```
src/app/
├── core/               # Lógica transversal (una sola instancia en toda la app)
│   ├── guards/          # Guards de sesión y de rol
│   ├── interceptors/    # Interceptor de autenticación (adjunta el token)
│   ├── models/          # Interfaces/tipos (Usuario, Cobertura, etc.)
│   └── services/        # Servicios de acceso a la API (Auth, Coberturas, etc.)
├── shared/
│   └── components/      # Componentes reutilizables (header, footer, etc.)
└── features/             # Pantallas por funcionalidad/rol (auth, admin, medico, paciente, ...)
```

La URL base de la API se define una única vez, en `src/environments/environment.ts` (producción) y `src/environments/environment.development.ts` (desarrollo), y se consume desde ahí en los servicios — no se repite hardcodeada en cada uno.

## Build

```bash
ng build
```

Los artefactos de build quedan en `dist/`.

## Tests unitarios

```bash
ng test
```