import { useCallback, useEffect, useState } from 'react'

const SIN_DATOS = []

// Carga una lista desde el API al montar. `cargador` debe ser una función estable (las de src/api/recursos.js).
export function useRecurso(cargador) {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  const recargar = useCallback(async () => {
    try {
      setDatos(await cargador())
      setError('')
    } catch (falla) {
      setError(falla.message)
    } finally {
      setCargando(false)
    }
  }, [cargador])

  useEffect(() => {
    recargar()
  }, [recargar])

  return { datos: datos ?? SIN_DATOS, cargando, error, recargar }
}
