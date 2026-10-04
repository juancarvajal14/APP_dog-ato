import { Construction } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { MascotasTab } from '../features/mascotas/MascotasTab'
import { PropietariosTab } from '../features/propietarios/PropietariosTab'
import { CitasTab } from '../features/citas/CitasTab'
import { HistorialTab } from '../features/historial/HistorialTab'
import { VeterinariosTab } from '../features/veterinarios/VeterinariosTab'
import { RolesTab } from '../features/seguridad/RolesTab'
import { PerfilesTab } from '../features/seguridad/PerfilesTab'
import { ModulosTab } from '../features/seguridad/ModulosTab'

// Qué módulos EXISTEN, cuáles se ven y con qué permisos lo decide la base de datos (/auth/me).
// Aquí solo se asocia el "codigo" de cada módulo con el componente que dibuja su pantalla.
export { iconoDe } from './iconos'

function EnConstruccion() {
  return (
    <EmptyState
      icono={Construction}
      titulo="Módulo en construcción"
      descripcion="Esta pantalla estará disponible en una próxima fase del proyecto."
    />
  )
}

const pantallas = {
  CLI_PROPIETARIOS: PropietariosTab,
  CLI_MASCOTAS: MascotasTab,
  CLI_CITAS: CitasTab,
  CLI_HISTORIAL: HistorialTab,
  SEG_VETERINARIOS: VeterinariosTab,
  SEG_ROLES: RolesTab,
  SEG_PERFILES: PerfilesTab,
  SEG_MODULOS: ModulosTab,
}

export const pantallaDe = (codigo) => pantallas[codigo] ?? EnConstruccion

// Aplana el árbol del menú en la lista de opciones que abren una pantalla.
export const opcionesDelMenu = (menu) => menu.flatMap((nodo) => (nodo.ruta ? [nodo] : nodo.hijos))
