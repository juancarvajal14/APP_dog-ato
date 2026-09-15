import { createContext, useContext, useMemo, useState } from 'react'
import {
  usuariosIniciales,
  veterinariosIniciales,
  propietariosIniciales,
  mascotasIniciales,
  citasIniciales,
  historialIniciales,
} from '../data/mockData'

const DataContext = createContext(null)

let siguienteId = 1000

function nuevoId() {
  siguienteId += 1
  return siguienteId
}

export function DataProvider({ children }) {
  const [usuarios, setUsuarios] = useState(usuariosIniciales)
  const [veterinarios, setVeterinarios] = useState(veterinariosIniciales)
  const [propietarios, setPropietarios] = useState(propietariosIniciales)
  const [mascotas, setMascotas] = useState(mascotasIniciales)
  const [citas, setCitas] = useState(citasIniciales)
  const [historial, setHistorial] = useState(historialIniciales)

  const agregarPropietario = (datos) => {
    const propietario = { id: nuevoId(), ...datos }
    setPropietarios((actuales) => [...actuales, propietario])
    return propietario
  }

  const editarPropietario = (id, datos) => {
    setPropietarios((actuales) => actuales.map((p) => (p.id === id ? { ...p, ...datos, id } : p)))
  }

  const eliminarPropietario = (id) => {
    setPropietarios((actuales) => actuales.filter((p) => p.id !== id))
  }

  const agregarMascota = (datos) => {
    const mascota = { id: nuevoId(), ...datos }
    setMascotas((actuales) => [...actuales, mascota])
    return mascota
  }

  const editarMascota = (id, datos) => {
    setMascotas((actuales) => actuales.map((m) => (m.id === id ? { ...m, ...datos, id } : m)))
  }

  const eliminarMascota = (id) => {
    setMascotas((actuales) => actuales.filter((m) => m.id !== id))
  }

  const agregarCita = (datos) => {
    const cita = { id: nuevoId(), estado: 'pendiente', ...datos }
    setCitas((actuales) => [...actuales, cita])
    return cita
  }

  const editarCita = (id, datos) => {
    setCitas((actuales) => actuales.map((c) => (c.id === id ? { ...c, ...datos, id } : c)))
  }

  const eliminarCita = (id) => {
    setCitas((actuales) => actuales.filter((c) => c.id !== id))
  }

  const cancelarCita = (citaId) => {
    setCitas((actuales) => actuales.map((c) => (c.id === citaId ? { ...c, estado: 'cancelada' } : c)))
  }

  const completarCita = (citaId, datosHistorial) => {
    setCitas((actuales) => actuales.map((c) => (c.id === citaId ? { ...c, estado: 'completada' } : c)))
    const entrada = { id: nuevoId(), cita_id: citaId, fecha: new Date().toISOString(), ...datosHistorial }
    setHistorial((actuales) => [...actuales, entrada])
    return entrada
  }

  const agregarVeterinario = ({ documento, nombre, apellido, telefono, email, direccion, password, rol }) => {
    const veterinario = { id: nuevoId(), documento, nombre, apellido, telefono, email, direccion }
    const usuario = { id: nuevoId(), documento, email, password, rol, activo: true }
    setVeterinarios((actuales) => [...actuales, veterinario])
    setUsuarios((actuales) => [...actuales, usuario])
    return veterinario
  }

  const editarVeterinario = (documentoOriginal, { documento, nombre, apellido, telefono, email, direccion, password, rol }) => {
    setVeterinarios((actuales) =>
      actuales.map((v) =>
        v.documento === documentoOriginal ? { ...v, documento, nombre, apellido, telefono, email, direccion } : v,
      ),
    )
    setUsuarios((actuales) =>
      actuales.map((u) =>
        u.documento === documentoOriginal
          ? { ...u, documento, email, rol, ...(password ? { password } : {}) }
          : u,
      ),
    )
  }

  const cambiarEstadoVeterinario = (documento, activo) => {
    setUsuarios((actuales) => actuales.map((u) => (u.documento === documento ? { ...u, activo } : u)))
  }

  const eliminarVeterinario = (documento) => {
    setVeterinarios((actuales) => actuales.filter((v) => v.documento !== documento))
    setUsuarios((actuales) => actuales.filter((u) => u.documento !== documento))
  }

  const propietarioDe = (mascotaId) => {
    const mascota = mascotas.find((m) => m.id === mascotaId)
    if (!mascota) return null
    return propietarios.find((p) => p.id === mascota.propietario_id) ?? null
  }

  const mascotasDe = (propietarioId) => mascotas.filter((m) => m.propietario_id === propietarioId)

  const value = useMemo(
    () => ({
      usuarios,
      veterinarios,
      propietarios,
      mascotas,
      citas,
      historial,
      agregarPropietario,
      editarPropietario,
      eliminarPropietario,
      agregarMascota,
      editarMascota,
      eliminarMascota,
      agregarCita,
      editarCita,
      eliminarCita,
      cancelarCita,
      completarCita,
      agregarVeterinario,
      editarVeterinario,
      cambiarEstadoVeterinario,
      eliminarVeterinario,
      propietarioDe,
      mascotasDe,
    }),
    [usuarios, veterinarios, propietarios, mascotas, citas, historial],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const contexto = useContext(DataContext)
  if (!contexto) throw new Error('useData debe usarse dentro de DataProvider')
  return contexto
}
