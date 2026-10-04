import { peticion } from './cliente'

export const login = (email, password) => peticion('/auth/login', { metodo: 'POST', cuerpo: { email, password } })

export const obtenerSesion = () => peticion('/auth/me')

export const logout = () => peticion('/auth/logout', { metodo: 'POST' })
