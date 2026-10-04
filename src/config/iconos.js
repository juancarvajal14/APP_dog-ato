import {
  CalendarClock,
  Circle,
  ClipboardList,
  HeartPulse,
  IdCard,
  KeyRound,
  PawPrint,
  Shield,
  Stethoscope,
  UserCog,
  Users,
} from 'lucide-react'

// Nombre de icono guardado en la BD (modulo.icono) -> icono de lucide
export const iconos = {
  shield: Shield,
  'heart-pulse': HeartPulse,
  stethoscope: Stethoscope,
  'user-cog': UserCog,
  'id-card': IdCard,
  'key-round': KeyRound,
  users: Users,
  'paw-print': PawPrint,
  'calendar-clock': CalendarClock,
  'clipboard-list': ClipboardList,
}

export const nombresDeIconos = Object.keys(iconos)

export const iconoDe = (nombre) => iconos[nombre] ?? Circle
