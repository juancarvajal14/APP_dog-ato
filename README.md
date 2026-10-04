# DOG-ATO — Frontend

Panel de gestión veterinaria DOG-ATO. React 19 + Vite + Tailwind 4. Consume el API de `API_dog-ato`: el login, el menú de
navegación, los permisos y todos los datos vienen del servidor (PostgreSQL + Redis); el navegador solo guarda el token de sesión.

## Cómo correrlo

Requisitos: el API encendido (ver el README de `API_dog-ato`), Node 20+.

```bash
npm install
cp .env.example .env.local     # VITE_API_URL=http://localhost:8000
npm run dev                    # http://localhost:5173
```

Otros scripts: `npm run build` (producción), `npm run lint`, `npm run preview`.

## Cuentas de desarrollo

| Perfil | Correo | Contraseña |
|---|---|---|
| Administrador | admin@veterinaria.com | Admin12345* |
| Veterinario | andres.gomez@dogato.com | Vet12345* |

## Cómo funciona el menú
El menú, los iconos y los botones visibles dependen de lo que responde `/auth/me` (módulos y permisos de la base de datos).
`src/config/modulos.jsx` solo asocia el **código** de cada módulo con la pantalla que lo dibuja; un módulo nuevo creado desde
«Módulos y permisos» sin pantalla programada muestra «Módulo en construcción».

## Estructura

```
src/
  api/          cliente HTTP con token Bearer y funciones por recurso
  config/       modulos.jsx (código de módulo → pantalla) e iconos.js
  context/      AuthContext (sesión, permisos con puede(modulo, permiso))
  components/   piezas de UI reutilizables (botones, modal, badges, estados de carga/error)
  features/     una carpeta por módulo: propietarios, mascotas, citas, historial, veterinarios, seguridad
  lib/          useRecurso (carga de listas), fechas y utilidades
  pages/        LoginPage y DashboardPage
```

## Despliegue (Vercel)
Definir la variable `VITE_API_URL` con la URL pública del API (sin barra final) y volver a desplegar si cambia.
Más detalles en `API_dog-ato/DESPLIEGUE.md`.
