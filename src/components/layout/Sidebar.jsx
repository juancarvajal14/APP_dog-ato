import { LogOut, Zap, Database } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { iconoDe } from '../../config/modulos'
import { Avatar } from '../ui/Avatar'
import { BadgeRol } from '../ui/Badge'
import { Marca } from './Marca'
import { cn } from '../../lib/cn'

function OpcionMenu({ opcion, activa, onSeleccionar }) {
  const Icono = iconoDe(opcion.icono)
  return (
    <button
      type="button"
      onClick={() => onSeleccionar(opcion.codigo)}
      className={cn(
        'relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors',
        activa ? 'text-primary-700' : 'text-ink-soft hover:bg-cream-soft hover:text-ink',
      )}
    >
      {activa && (
        <motion.span
          layoutId="pestana-activa"
          className="absolute inset-0 rounded-xl bg-primary-50"
          transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
        />
      )}
      <Icono className="relative size-5" />
      <span className="relative">{opcion.nombre}</span>
    </button>
  )
}

export function Sidebar({ opcionActiva, onSeleccionar }) {
  const { sesion, cerrarSesion } = useAuth()
  const { usuario, menu, origenCredenciales } = sesion
  const rol = usuario.roles.includes('Administrador') ? 'administrador' : 'veterinario'

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sand bg-white">
      <div className="px-5 py-6">
        <Marca />
      </div>

      {/* El menú completo (carpetas y opciones) viene de la base de datos */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3">
        {menu.map((nodo) =>
          nodo.ruta ? (
            <OpcionMenu key={nodo.codigo} opcion={nodo} activa={opcionActiva === nodo.codigo} onSeleccionar={onSeleccionar} />
          ) : (
            <div key={nodo.codigo}>
              <p className="mb-1.5 px-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{nodo.nombre}</p>
              <div className="space-y-1">
                {nodo.hijos.map((hijo) => (
                  <OpcionMenu key={hijo.codigo} opcion={hijo} activa={opcionActiva === hijo.codigo} onSeleccionar={onSeleccionar} />
                ))}
              </div>
            </div>
          ),
        )}
      </nav>

      <div className="border-t border-sand p-4">
        <div className="flex items-center gap-3 rounded-xl bg-cream-soft/70 p-3">
          <Avatar nombre={usuario.nombres} apellido={usuario.apellidos} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              {usuario.nombres} {usuario.apellidos}
            </p>
            <div className="mt-0.5">
              <BadgeRol rol={rol} />
            </div>
          </div>
        </div>

        {origenCredenciales && (
          <p
            className="mt-2 flex items-center gap-1.5 px-1 text-xs text-ink-faint"
            title="De dónde se validaron tu correo y contraseña al iniciar sesión"
          >
            {origenCredenciales === 'redis' ? <Zap className="size-3.5 text-accent-dark" /> : <Database className="size-3.5" />}
            Credenciales validadas desde {origenCredenciales === 'redis' ? 'Redis' : 'PostgreSQL'}
          </p>
        )}

        <button
          type="button"
          onClick={cerrarSesion}
          className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-danger-soft hover:text-danger"
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
