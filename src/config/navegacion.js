import { CalendarClock, ClipboardList, PawPrint, Stethoscope, Users } from 'lucide-react'

export const pestanas = [
  { id: 'mascotas', etiqueta: 'Mascotas', icono: PawPrint, roles: ['veterinario', 'administrador'] },
  { id: 'propietarios', etiqueta: 'Propietarios', icono: Users, roles: ['veterinario', 'administrador'] },
  { id: 'citas', etiqueta: 'Citas', icono: CalendarClock, roles: ['veterinario', 'administrador'] },
  { id: 'historial', etiqueta: 'Historial clínico', icono: ClipboardList, roles: ['veterinario', 'administrador'] },
  { id: 'veterinarios', etiqueta: 'Veterinarios', icono: Stethoscope, roles: ['administrador'] },
]

export function pestanasParaRol(rol) {
  return pestanas.filter((pestana) => pestana.roles.includes(rol))
}
