export const usuariosIniciales = [
  { id: 1, documento: '1020304050', email: 'camilo.carvajal@dogato.com', password: 'admin123', rol: 'administrador', activo: true },
  { id: 2, documento: '1122334455', email: 'andres.gomez@dogato.com', password: 'vet123', rol: 'veterinario', activo: true },
  { id: 3, documento: '1099887766', email: 'laura.martinez@dogato.com', password: 'vet123', rol: 'veterinario', activo: true },
  { id: 4, documento: '1055667788', email: 'diego.salazar@dogato.com', password: 'vet123', rol: 'veterinario', activo: false },
]

export const veterinariosIniciales = [
  {
    id: 1,
    documento: '1020304050',
    nombre: 'Camilo',
    apellido: 'Carvajal',
    telefono: '3001234567',
    email: 'camilo.carvajal@dogato.com',
    direccion: 'Cra 43A #5-15, Medellín',
  },
  {
    id: 2,
    documento: '1122334455',
    nombre: 'Andrés',
    apellido: 'Gómez',
    telefono: '3012345678',
    email: 'andres.gomez@dogato.com',
    direccion: 'Calle 30 #65-10, Medellín',
  },
  {
    id: 3,
    documento: '1099887766',
    nombre: 'Laura',
    apellido: 'Martínez',
    telefono: '3023456789',
    email: 'laura.martinez@dogato.com',
    direccion: 'Cra 70 #44-20, Medellín',
  },
  {
    id: 4,
    documento: '1055667788',
    nombre: 'Diego',
    apellido: 'Salazar',
    telefono: '3034567890',
    email: 'diego.salazar@dogato.com',
    direccion: 'Calle 12 Sur #28-40, Envigado',
  },
]

export const propietariosIniciales = [
  { id: 1, nombre: 'Mariana', apellido: 'Ortiz', documento: '43267891', telefono: '3101112233', email: 'mariana.ortiz@gmail.com', direccion: 'Cra 25 #33-12, Medellín' },
  { id: 2, nombre: 'Felipe', apellido: 'Vargas', documento: '71234567', telefono: '3112223344', email: 'felipe.vargas@gmail.com', direccion: 'Calle 50 #20-30, Itagüí' },
  { id: 3, nombre: 'Daniela', apellido: 'Cardona', documento: '1035678912', telefono: '3123334455', email: 'daniela.cardona@gmail.com', direccion: 'Cra 80 #12-05, Medellín' },
  { id: 4, nombre: 'Santiago', apellido: 'Zuluaga', documento: '98765432', telefono: '3134445566', email: 'santiago.zuluaga@gmail.com', direccion: 'Calle 44 #70-18, Medellín' },
  { id: 5, nombre: 'Valentina', apellido: 'Ríos', documento: '1128976543', telefono: '3145556677', email: 'valentina.rios@gmail.com', direccion: 'Cra 15 #8-90, Sabaneta' },
  { id: 6, nombre: 'Juan Pablo', apellido: 'Correa', documento: '79456123', telefono: '3156667788', email: 'juanpablo.correa@gmail.com', direccion: 'Calle 33 #76-40, Medellín' },
]

export const mascotasIniciales = [
  { id: 1, nombre: 'Rocco', especie: 'Perro', raza: 'Labrador', sexo: 'macho', fecha_nacimiento: '2021-04-12', propietario_id: 1 },
  { id: 2, nombre: 'Luna', especie: 'Gato', raza: 'Siamés', sexo: 'hembra', fecha_nacimiento: '2022-08-03', propietario_id: 1 },
  { id: 3, nombre: 'Max', especie: 'Perro', raza: 'Bulldog Francés', sexo: 'macho', fecha_nacimiento: '2020-01-22', propietario_id: 2 },
  { id: 4, nombre: 'Nala', especie: 'Gato', raza: 'Común Europeo', sexo: 'hembra', fecha_nacimiento: '2023-02-14', propietario_id: 3 },
  { id: 5, nombre: 'Toby', especie: 'Perro', raza: 'Beagle', sexo: 'macho', fecha_nacimiento: '2019-11-30', propietario_id: 3 },
  { id: 6, nombre: 'Coco', especie: 'Conejo', raza: 'Holandés', sexo: 'hembra', fecha_nacimiento: '2023-06-10', propietario_id: 4 },
  { id: 7, nombre: 'Simón', especie: 'Perro', raza: 'Golden Retriever', sexo: 'macho', fecha_nacimiento: '2022-03-05', propietario_id: 5 },
  { id: 8, nombre: 'Mia', especie: 'Gato', raza: 'Persa', sexo: 'hembra', fecha_nacimiento: '2021-09-18', propietario_id: 5 },
  { id: 9, nombre: 'Zeus', especie: 'Perro', raza: 'Pastor Alemán', sexo: 'macho', fecha_nacimiento: '2020-07-25', propietario_id: 6 },
  { id: 10, nombre: 'Kiwi', especie: 'Ave', raza: 'Periquito Australiano', sexo: 'hembra', fecha_nacimiento: '2023-10-01', propietario_id: 6 },
]

export const citasIniciales = [
  { id: 1, mascota_id: 1, veterinario_id: 2, fecha: '2026-08-20T09:00', motivo_consulta: 'Vacunación anual', estado: 'completada' },
  { id: 2, mascota_id: 3, veterinario_id: 3, fecha: '2026-08-22T11:30', motivo_consulta: 'Revisión de piel, se observa enrojecimiento', estado: 'completada' },
  { id: 3, mascota_id: 5, veterinario_id: 2, fecha: '2026-08-25T15:00', motivo_consulta: 'Chequeo general de rutina', estado: 'completada' },
  { id: 4, mascota_id: 7, veterinario_id: 3, fecha: '2026-08-28T10:00', motivo_consulta: 'Cojera en pata trasera derecha', estado: 'cancelada' },
  { id: 5, mascota_id: 9, veterinario_id: 2, fecha: '2026-09-01T08:30', motivo_consulta: 'Control post-operatorio', estado: 'completada' },
  { id: 6, mascota_id: 2, veterinario_id: 3, fecha: '2026-09-10T14:00', motivo_consulta: 'Baja de apetito hace 3 días', estado: 'pendiente' },
  { id: 7, mascota_id: 4, veterinario_id: 2, fecha: '2026-09-11T09:30', motivo_consulta: 'Primera consulta y esquema de vacunas', estado: 'pendiente' },
  { id: 8, mascota_id: 8, veterinario_id: 3, fecha: '2026-09-12T16:00', motivo_consulta: 'Control de peso', estado: 'pendiente' },
  { id: 9, mascota_id: 6, veterinario_id: 2, fecha: '2026-09-13T10:00', motivo_consulta: 'Revisión dental', estado: 'pendiente' },
  { id: 10, mascota_id: 10, veterinario_id: 3, fecha: '2026-09-15T11:00', motivo_consulta: 'Chequeo general', estado: 'pendiente' },
]

export const historialIniciales = [
  {
    id: 1,
    cita_id: 1,
    fecha: '2026-08-20T09:40',
    diagnostico: 'Paciente sano, sin hallazgos relevantes',
    tratamiento: 'Aplicación de refuerzo de vacuna polivalente',
    observaciones: 'Volver a vacunar en 12 meses. Se recomienda mantener desparasitación trimestral',
  },
  {
    id: 2,
    cita_id: 2,
    fecha: '2026-08-22T12:05',
    diagnostico: 'Dermatitis alérgica leve, posible reacción a alimento',
    tratamiento: 'Shampoo medicado cada 3 días por 2 semanas, antihistamínico oral',
    observaciones: 'Evaluar cambio de dieta si no hay mejoría en 15 días',
  },
  {
    id: 3,
    cita_id: 3,
    fecha: '2026-08-25T15:25',
    diagnostico: 'Sin alteraciones, signos vitales normales',
    tratamiento: 'No requiere tratamiento',
    observaciones: 'Continuar con controles semestrales',
  },
  {
    id: 4,
    cita_id: 5,
    fecha: '2026-09-01T09:00',
    diagnostico: 'Cicatrización adecuada de herida quirúrgica',
    tratamiento: 'Retiro de puntos, limpieza de la zona',
    observaciones: 'Evitar actividad física intensa por 5 días más',
  },
]
