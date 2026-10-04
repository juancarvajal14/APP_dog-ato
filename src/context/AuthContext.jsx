import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ErrorApi, configurarToken, registrarAlExpirarSesion } from '../api/cliente'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

// En el navegador solo se guarda el token (y de dónde salieron las credenciales, para mostrarlo).
// El menú, los permisos y los datos del usuario se piden al API en cada carga: viven en Redis/Postgres.
const CLAVE_SESION = 'dogato_sesion'

function leerGuardada() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION))
  } catch {
    return null
  }
}

function guardar(token, origen) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ token, origen }))
}

function olvidar() {
  localStorage.removeItem(CLAVE_SESION)
  configurarToken(null)
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    registrarAlExpirarSesion(() => {
      olvidar()
      setSesion(null)
    })

    const guardada = leerGuardada()
    if (!guardada?.token) {
      setCargando(false)
      return
    }

    configurarToken(guardada.token)
    authApi
      .obtenerSesion()
      .then((datos) => setSesion({ ...datos, origenCredenciales: guardada.origen ?? null }))
      .catch((error) => {
        // Solo se descarta la sesión si el API dijo que no es válida; si estaba apagado se reintenta al recargar.
        if (error instanceof ErrorApi && error.estado === 401) olvidar()
      })
      .finally(() => setCargando(false))
  }, [])

  const iniciarSesion = useCallback(async (email, password) => {
    try {
      const datos = await authApi.login(email, password)
      configurarToken(datos.access_token)
      guardar(datos.access_token, datos.origen_credenciales)
      setSesion({
        usuario: datos.usuario,
        menu: datos.menu,
        permisos: datos.permisos,
        origenCredenciales: datos.origen_credenciales,
      })
      return { ok: true }
    } catch (error) {
      return { ok: false, mensaje: error.message }
    }
  }, [])

  const cerrarSesion = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Aunque el API falle, el usuario sale de la aplicación igualmente.
    }
    olvidar()
    setSesion(null)
  }, [])

  // Vuelve a pedir al API el menú y los permisos (p. ej. después de editar la seguridad desde la interfaz).
  const actualizarSesion = useCallback(async () => {
    try {
      const datos = await authApi.obtenerSesion()
      setSesion((actual) => (actual ? { ...datos, origenCredenciales: actual.origenCredenciales } : actual))
    } catch {
      // Si el API responde 401 el cliente ya cierra la sesión; cualquier otro fallo se ignora aquí.
    }
  }, [])

  // ¿La sesión tiene este permiso (CREAR, LEER, ACTUALIZAR, ELIMINAR) sobre el módulo?
  const puede = useCallback(
    (codigoModulo, permiso) => Boolean(sesion?.permisos[codigoModulo]?.includes(permiso)),
    [sesion],
  )

  const value = useMemo(
    () => ({ sesion, cargando, iniciarSesion, cerrarSesion, actualizarSesion, puede }),
    [sesion, cargando, iniciarSesion, cerrarSesion, actualizarSesion, puede],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return contexto
}
