import { peticion } from './cliente'

const enviar = (metodo, ruta, cuerpo) => peticion(ruta, { metodo, cuerpo })

// Propietarios
export const listarPropietarios = () => peticion('/propietarios')
export const crearPropietario = (datos) => enviar('POST', '/propietarios', datos)

// Mascotas
export const listarMascotas = () => peticion('/mascotas')
export const crearMascota = (datos) => enviar('POST', '/mascotas', datos)

// Citas e historial (el historial solo se crea al completar una cita)
export const listarCitas = () => peticion('/citas')
export const crearCita = (datos) => enviar('POST', '/citas', datos)
export const cancelarCita = (id) => enviar('POST', `/citas/${id}/cancelar`)
export const completarCita = (id, datos) => enviar('POST', `/citas/${id}/completar`, datos)
export const listarHistorial = () => peticion('/historial')

// Veterinarios
export const listarVeterinarios = () => peticion('/veterinarios')
export const crearVeterinario = (datos) => enviar('POST', '/veterinarios', datos)
export const cambiarEstadoVeterinario = (id, activo) => enviar('PATCH', `/veterinarios/${id}/estado`, { activo })

// Listas de apoyo para formularios
export const listarTiposDocumento = () => peticion('/catalogos/tipos-documento')
export const catalogoPropietarios = () => peticion('/catalogos/propietarios')
export const catalogoVeterinarios = () => peticion('/catalogos/veterinarios')
export const catalogoPerfilesVeterinario = () => peticion('/catalogos/perfiles-veterinario')

// Seguridad: roles, perfiles, módulos y matriz de permisos
export const listarRoles = () => peticion('/roles')
export const crearRol = (datos) => enviar('POST', '/roles', datos)
export const actualizarRol = (id, datos) => enviar('PUT', `/roles/${id}`, datos)
export const cambiarEstadoRol = (id, activo) => enviar('PATCH', `/roles/${id}/estado`, { activo })

export const listarPerfiles = () => peticion('/perfiles')
export const crearPerfil = (datos) => enviar('POST', '/perfiles', datos)
export const actualizarPerfil = (id, datos) => enviar('PUT', `/perfiles/${id}`, datos)
export const cambiarEstadoPerfil = (id, activo) => enviar('PATCH', `/perfiles/${id}/estado`, { activo })

export const listarModulos = () => peticion('/modulos')
export const crearModulo = (datos) => enviar('POST', '/modulos', datos)
export const actualizarModulo = (id, datos) => enviar('PUT', `/modulos/${id}`, datos)
export const cambiarEstadoModulo = (id, activo) => enviar('PATCH', `/modulos/${id}/estado`, { activo })

export const obtenerMatriz = (idPerfil) => peticion(`/perfiles/${idPerfil}/permisos`)
export const guardarMatriz = (idPerfil, asignaciones) => enviar('PUT', `/perfiles/${idPerfil}/permisos`, { asignaciones })
