import { createContext, useContext, useEffect, useState } from 'react'
import { useData } from './DataContext'

const AuthContext = createContext(null)

const CLAVE_SESION = 'dogato_sesion'

export function AuthProvider({ children }) {
  const { usuarios, veterinarios } = useData()
  const [sesion, setSesion] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const guardada = localStorage.getItem(CLAVE_SESION)
    if (guardada) {
      try {
        setSesion(JSON.parse(guardada))
      } catch {
        localStorage.removeItem(CLAVE_SESION)
      }
    }
    setCargando(false)
  }, [])

  const iniciarSesion = (email, password) => {
    const usuario = usuarios.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())

    if (!usuario || usuario.password !== password) {
      return { ok: false, mensaje: 'Correo o contraseña incorrectos' }
    }
    if (!usuario.activo) {
      return { ok: false, mensaje: 'Esta cuenta está inactiva. Contacta a un administrador' }
    }

    const perfil = veterinarios.find((v) => v.documento === usuario.documento)
    const datosSesion = {
      documento: usuario.documento,
      email: usuario.email,
      rol: usuario.rol,
      nombre: perfil?.nombre ?? '',
      apellido: perfil?.apellido ?? '',
    }
    setSesion(datosSesion)
    localStorage.setItem(CLAVE_SESION, JSON.stringify(datosSesion))
    return { ok: true }
  }

  const cerrarSesion = () => {
    setSesion(null)
    localStorage.removeItem(CLAVE_SESION)
  }

  return (
    <AuthContext.Provider value={{ sesion, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return contexto
}
