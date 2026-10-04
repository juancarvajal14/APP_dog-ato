import { Fragment, useCallback, useMemo, useState } from 'react'
import { IdCard, RotateCcw, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { guardarMatriz, listarPerfiles, obtenerMatriz } from '../../api/recursos'
import { useRecurso } from '../../lib/useRecurso'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Field'
import { EmptyState } from '../../components/ui/EmptyState'
import { AlertaError, AvisoExito, Cargando, ErrorCarga } from '../../components/ui/Estados'

const ETIQUETAS = { CREAR: 'Crear', LEER: 'Leer', ACTUALIZAR: 'Actualizar', ELIMINAR: 'Eliminar' }

const aMapa = (matriz) => Object.fromEntries(matriz.modulos.map((m) => [m.codigo, m.permisos]))
const firma = (mapa) => JSON.stringify(Object.keys(mapa).sort().map((k) => [k, [...mapa[k]].sort()]))

function Editor({ matriz, onGuardada }) {
  const { puede, actualizarSesion } = useAuth()
  const editable = puede('SEG_MODULOS', 'ACTUALIZAR')
  const inicial = useMemo(() => aMapa(matriz), [matriz])
  const [borrador, setBorrador] = useState(inicial)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')

  const cambios = firma(borrador) !== firma(inicial)

  const alternar = (codigo, permiso, marcado) => {
    setAviso('')
    setBorrador((actual) => {
      const conjunto = new Set(actual[codigo])
      if (marcado) {
        conjunto.add(permiso)
        conjunto.add('LEER') // sin LEER la opción no aparecería en el menú
      } else if (permiso === 'LEER') {
        conjunto.clear()
      } else {
        conjunto.delete(permiso)
      }
      return { ...actual, [codigo]: matriz.permisos_disponibles.filter((p) => conjunto.has(p)) }
    })
  }

  const guardar = async () => {
    setGuardando(true)
    setError('')
    setAviso('')
    try {
      const asignaciones = Object.fromEntries(Object.entries(borrador).filter(([, permisos]) => permisos.length > 0))
      const nueva = await guardarMatriz(matriz.id_perfil, asignaciones)
      onGuardada(nueva)
      actualizarSesion()
    } catch (falla) {
      setError(falla.message)
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-4">
      <AlertaError mensaje={error} onCerrar={() => setError('')} />
      <AvisoExito mensaje={aviso} onCerrar={() => setAviso('')} />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-soft/60 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-5 py-3">Opción del menú</th>
                {matriz.permisos_disponibles.map((p) => (
                  <th key={p} className="px-3 py-3 text-center">
                    {ETIQUETAS[p] ?? p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {matriz.modulos.map((modulo, i) => {
                const nuevaCarpeta = i === 0 || matriz.modulos[i - 1].carpeta !== modulo.carpeta
                return (
                  <Fragment key={modulo.codigo}>
                    {nuevaCarpeta && modulo.carpeta && (
                      <tr className="bg-cream-soft/40">
                        <td colSpan={matriz.permisos_disponibles.length + 1} className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                          {modulo.carpeta}
                        </td>
                      </tr>
                    )}
                    <tr className={modulo.activo ? undefined : 'opacity-60'}>
                      <td className="px-5 py-3 font-medium text-ink">
                        {modulo.nombre}
                        {!modulo.activo && <span className="ml-2 text-xs font-normal text-ink-faint">(módulo inactivo)</span>}
                      </td>
                      {matriz.permisos_disponibles.map((permiso) => (
                        <td key={permiso} className="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            className="size-4 cursor-pointer accent-primary-600 disabled:cursor-not-allowed"
                            checked={borrador[modulo.codigo].includes(permiso)}
                            disabled={!editable}
                            aria-label={`${ETIQUETAS[permiso] ?? permiso} en ${modulo.nombre}`}
                            onChange={(e) => alternar(modulo.codigo, permiso, e.target.checked)}
                          />
                        </td>
                      ))}
                    </tr>
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {editable && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-ink-faint">
            Marcar Crear, Actualizar o Eliminar activa también Leer. Los usuarios con este perfil verán el cambio al volver a
            iniciar sesión (sus sesiones abiertas se cierran al guardar).
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" disabled={!cambios || guardando} onClick={() => setBorrador(inicial)}>
              <RotateCcw className="size-4" />
              Descartar
            </Button>
            <Button disabled={!cambios} isLoading={guardando} onClick={guardar}>
              <Save className="size-4" />
              Guardar permisos
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function MatrizDePerfil({ idPerfil }) {
  const cargador = useCallback(() => obtenerMatriz(idPerfil), [idPerfil])
  const { datos, cargando, error, recargar } = useRecurso(cargador)
  const [guardada, setGuardada] = useState(null)
  const [version, setVersion] = useState(0)
  const [aviso, setAviso] = useState('')

  if (cargando) return <Cargando />
  if (error) return <ErrorCarga mensaje={error} onReintentar={recargar} />

  const matriz = guardada ?? datos
  return (
    <div className="space-y-4">
      <AvisoExito mensaje={aviso} onCerrar={() => setAviso('')} />
      <Editor
        key={version}
        matriz={matriz}
        onGuardada={(nueva) => {
          setGuardada(nueva)
          setVersion((v) => v + 1)
          setAviso('Permisos guardados. Los usuarios de este perfil deberán iniciar sesión de nuevo.')
        }}
      />
    </div>
  )
}

export function MatrizPermisos() {
  const { datos: perfiles, cargando, error, recargar } = useRecurso(listarPerfiles)
  const [seleccion, setSeleccion] = useState('')

  if (cargando) return <Cargando />
  if (error) return <ErrorCarga mensaje={error} onReintentar={recargar} />
  if (perfiles.length === 0) {
    return <EmptyState icono={IdCard} titulo="No hay perfiles" descripcion="Crea un perfil primero en la pantalla Perfiles." />
  }

  const idPerfil = Number(seleccion) || perfiles[0].id

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="perfil-matriz" className="text-sm font-semibold text-ink-soft">
          Perfil
        </label>
        <Select id="perfil-matriz" className="max-w-xs" value={idPerfil} onChange={(e) => setSeleccion(e.target.value)}>
          {perfiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} · {p.rol}
              {p.activo ? '' : ' (inactivo)'}
            </option>
          ))}
        </Select>
      </div>
      <MatrizDePerfil key={idPerfil} idPerfil={idPerfil} />
    </div>
  )
}
