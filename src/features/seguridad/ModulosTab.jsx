import { useState } from 'react'
import { cn } from '../../lib/cn'
import { CatalogoModulos } from './CatalogoModulos'
import { MatrizPermisos } from './MatrizPermisos'

const vistas = [
  { id: 'permisos', etiqueta: 'Permisos por perfil' },
  { id: 'modulos', etiqueta: 'Módulos del menú' },
]

export function ModulosTab() {
  const [vista, setVista] = useState('permisos')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {vistas.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setVista(v.id)}
            className={cn(
              'cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              vista === v.id ? 'bg-primary-600 text-white' : 'bg-white text-ink-soft hover:bg-sand/60',
            )}
          >
            {v.etiqueta}
          </button>
        ))}
      </div>

      {vista === 'permisos' ? <MatrizPermisos /> : <CatalogoModulos />}
    </div>
  )
}
