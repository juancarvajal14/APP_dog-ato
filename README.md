# DOG-ATO — Frontend

Mockup funcional del panel de gestión veterinaria DOG-ATO. React + Vite + Tailwind, con datos de prueba en memoria (sin backend real todavía).

## Cómo correrlo

```bash
npm install
npm run dev
```

## Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | camilo.carvajal@dogato.com | admin123 |
| Veterinario | andres.gomez@dogato.com | vet123 |

## Estructura

```
src/
  data/          datos de prueba (propietarios, mascotas, citas, historial, veterinarios)
  context/       AuthContext (sesión) y DataContext (estado de la app)
  components/    piezas de UI reutilizables (botones, modal, badges, tabla, etc)
  features/      cada pestaña del dashboard con su lógica y formularios
  pages/         LoginPage y DashboardPage
```

Todos los datos viven en memoria durante la sesión del navegador. Al recargar la página se reinician, salvo la sesión iniciada.
