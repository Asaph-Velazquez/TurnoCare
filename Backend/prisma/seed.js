const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  // Limpiar datos existentes
  await prisma.pacienteMedicamento.deleteMany({});
  await prisma.pacienteInsumo.deleteMany({});
  await prisma.registroMedico.deleteMany({});
  await prisma.inventarioMedicamentos.deleteMany({});
  await prisma.medicamento.deleteMany({});
  await prisma.insumo.deleteMany({});
  await prisma.enfermeroCapacitacion.deleteMany({});
  await prisma.capacitacion.deleteMany({});
  await prisma.paciente.deleteMany({});
  await prisma.urgencias.deleteMany({});
  await prisma.enfermero.deleteMany({});
  await prisma.turno.deleteMany({});
  await prisma.servicio.deleteMany({});
  await prisma.hospital.deleteMany({});

  // 1. HOSPITALES
  await prisma.hospital.createMany({
    data: [
      { nombre: 'Hospital General San José', direccion: 'Av. Principal 123, Ciudad de México', telefono: '+52-55-1234-5678' },
      { nombre: 'Clínica Santa María', direccion: 'Calle Reforma 456, Guadalajara', telefono: '+52-33-2345-6789' },
      { nombre: 'Hospital Universitario Central', direccion: 'Blvd. Universidad 789, Monterrey', telefono: '+52-81-3456-7890' },
      { nombre: 'Centro Médico Nacional', direccion: 'Zona Rosa 321, Ciudad de México', telefono: '+52-55-4567-8901' }
    ]
  });

  // 2. TURNOS
  await prisma.turno.createMany({
    data: [
      { nombre: 'Matutino', horaInicio: new Date('1970-01-01T08:00:00'), horaFin: new Date('1970-01-01T16:00:00') },
      { nombre: 'Vespertino', horaInicio: new Date('1970-01-01T16:00:00'), horaFin: new Date('1970-01-01T00:00:00') },
      { nombre: 'Nocturno', horaInicio: new Date('1970-01-01T00:00:00'), horaFin: new Date('1970-01-01T08:00:00') },
      { nombre: 'Jornada Completa', horaInicio: new Date('1970-01-01T08:00:00'), horaFin: new Date('1970-01-01T20:00:00') }
    ]
  });

  // 3. SERVICIOS
  await prisma.servicio.createMany({
    data: [
      { nombre: 'Urgencias', descripcion: 'Servicio de emergencias médicas 24/7', capacidadMaxima: 50, personalAsignado: 8, hospitalId: 1 },
      { nombre: 'Pediatría', descripcion: 'Atención médica especializada para niños', capacidadMaxima: 30, personalAsignado: 5, hospitalId: 1 },
      { nombre: 'Cardiología', descripcion: 'Tratamiento de enfermedades cardiovasculares', capacidadMaxima: 25, personalAsignado: 4, hospitalId: 1 },
      { nombre: 'Neurología', descripcion: 'Diagnóstico y tratamiento de trastornos neurológicos', capacidadMaxima: 20, personalAsignado: 4, hospitalId: 2 },
      { nombre: 'Ginecología', descripcion: 'Atención médica para la salud femenina', capacidadMaxima: 35, personalAsignado: 4, hospitalId: 2 },
      { nombre: 'Traumatología', descripcion: 'Tratamiento de lesiones y fracturas', capacidadMaxima: 40, personalAsignado: 5, hospitalId: 3 },
      { nombre: 'Medicina Interna', descripcion: 'Atención médica general para adultos', capacidadMaxima: 45, personalAsignado: 5, hospitalId: 3 },
      { nombre: 'UCI', descripcion: 'Unidad de Cuidados Intensivos', capacidadMaxima: 15, personalAsignado: 6, hospitalId: 4 },
      { nombre: 'Oncología', descripcion: 'Tratamiento de cáncer y tumores', capacidadMaxima: 20, personalAsignado: 4, hospitalId: 4 },
      { nombre: 'Psiquiatría', descripcion: 'Salud mental y trastornos psiquiátricos', capacidadMaxima: 25, personalAsignado: 3, hospitalId: 1 }
    ]
  });

  // 4. URGENCIAS
  await prisma.urgencias.create({
    data: { nivelTriaje: 'Crítico', tiempoEsperaPromedio: 5, servicioId: 1 }
  });

  // 5. ENFERMEROS
  const enfermeros = [
    // Coordinadores
    { nombre: 'Ana', apellidoPaterno: 'García', apellidoMaterno: 'Martínez', numeroEmpleado: 'ENF001', especialidad: 'Coordinación General', esCoordinador: true, turnoAsignadoId: 1, servicioActualId: 1 },
    { nombre: 'Carlos', apellidoPaterno: 'López', apellidoMaterno: 'Hernández', numeroEmpleado: 'ENF002', especialidad: 'Coordinación UCI', esCoordinador: true, turnoAsignadoId: 2, servicioActualId: 8 },
    { nombre: 'María Elena', apellidoPaterno: 'Rodríguez', apellidoMaterno: 'Silva', numeroEmpleado: 'ENF003', especialidad: 'Coordinación Pediatría', esCoordinador: true, turnoAsignadoId: 1, servicioActualId: 2 },
    // Urgencias
    { nombre: 'Luis', apellidoPaterno: 'Pérez', apellidoMaterno: 'González', numeroEmpleado: 'ENF004', especialidad: 'Urgencias', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 1, habitacionAsignada: '101' },
    { nombre: 'Carmen', apellidoPaterno: 'Martínez', apellidoMaterno: 'López', numeroEmpleado: 'ENF005', especialidad: 'Urgencias', esCoordinador: false, turnoAsignadoId: 2, servicioActualId: 1, habitacionAsignada: '102' },
    { nombre: 'Roberto', apellidoPaterno: 'Sánchez', apellidoMaterno: 'Ruiz', numeroEmpleado: 'ENF006', especialidad: 'Urgencias', esCoordinador: false, turnoAsignadoId: 3, servicioActualId: 1, habitacionAsignada: '103' },
    { nombre: 'Patricia', apellidoPaterno: 'Torres', apellidoMaterno: 'Mendoza', numeroEmpleado: 'ENF007', especialidad: 'Urgencias', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 1, habitacionAsignada: '104' },
    { nombre: 'Jorge', apellidoPaterno: 'Ramírez', apellidoMaterno: 'Castro', numeroEmpleado: 'ENF008', especialidad: 'Urgencias', esCoordinador: false, turnoAsignadoId: 2, servicioActualId: 1, habitacionAsignada: '105' },
    // Pediatría
    { nombre: 'Lucía', apellidoPaterno: 'Morales', apellidoMaterno: 'Vega', numeroEmpleado: 'ENF009', especialidad: 'Pediatría', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 2, habitacionAsignada: '201' },
    { nombre: 'Manuel', apellidoPaterno: 'Jiménez', apellidoMaterno: 'Flores', numeroEmpleado: 'ENF010', especialidad: 'Pediatría', esCoordinador: false, turnoAsignadoId: 2, servicioActualId: 2, habitacionAsignada: '202' },
    { nombre: 'Diana', apellidoPaterno: 'Vargas', apellidoMaterno: 'Ochoa', numeroEmpleado: 'ENF011', especialidad: 'Pediatría', esCoordinador: false, turnoAsignadoId: 3, servicioActualId: 2, habitacionAsignada: '203' },
    { nombre: 'Fernando', apellidoPaterno: 'Castillo', apellidoMaterno: 'Romero', numeroEmpleado: 'ENF012', especialidad: 'Pediatría', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 2, habitacionAsignada: '204' },
    // Cardiología
    { nombre: 'Sofía', apellidoPaterno: 'Herrera', apellidoMaterno: 'Delgado', numeroEmpleado: 'ENF013', especialidad: 'Cardiología', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 3, habitacionAsignada: '301' },
    { nombre: 'Miguel', apellidoPaterno: 'Aguilar', apellidoMaterno: 'Santos', numeroEmpleado: 'ENF014', especialidad: 'Cardiología', esCoordinador: false, turnoAsignadoId: 2, servicioActualId: 3, habitacionAsignada: '302' },
    { nombre: 'Alejandra', apellidoPaterno: 'Cruz', apellidoMaterno: 'Moreno', numeroEmpleado: 'ENF015', especialidad: 'Cardiología', esCoordinador: false, turnoAsignadoId: 3, servicioActualId: 3, habitacionAsignada: '303' },
    // Neurología
    { nombre: 'Antonio', apellidoPaterno: 'Reyes', apellidoMaterno: 'Guerrero', numeroEmpleado: 'ENF016', especialidad: 'Neurología', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 4, habitacionAsignada: '401' },
    { nombre: 'Gabriela', apellidoPaterno: 'Mendoza', apellidoMaterno: 'Ríos', numeroEmpleado: 'ENF017', especialidad: 'Neurología', esCoordinador: false, turnoAsignadoId: 2, servicioActualId: 4, habitacionAsignada: '402' },
    { nombre: 'Raúl', apellidoPaterno: 'Ortega', apellidoMaterno: 'Campos', numeroEmpleado: 'ENF018', especialidad: 'Neurología', esCoordinador: false, turnoAsignadoId: 3, servicioActualId: 4, habitacionAsignada: '403' },
    // Ginecología
    { nombre: 'Isabel', apellidoPaterno: 'Valencia', apellidoMaterno: 'Herrera', numeroEmpleado: 'ENF019', especialidad: 'Ginecología', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 5, habitacionAsignada: '501' },
    { nombre: 'Alberto', apellidoPaterno: 'Gutiérrez', apellidoMaterno: 'Peña', numeroEmpleado: 'ENF020', especialidad: 'Ginecología', esCoordinador: false, turnoAsignadoId: 2, servicioActualId: 5, habitacionAsignada: '502' },
    { nombre: 'Claudia', apellidoPaterno: 'Ruiz', apellidoMaterno: 'Montoya', numeroEmpleado: 'ENF021', especialidad: 'Ginecología', esCoordinador: false, turnoAsignadoId: 3, servicioActualId: 5, habitacionAsignada: '503' },
    // Traumatología
    { nombre: 'Eduardo', apellidoPaterno: 'Silva', apellidoMaterno: 'Navarro', numeroEmpleado: 'ENF022', especialidad: 'Traumatología', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 6, habitacionAsignada: '601' },
    { nombre: 'Verónica', apellidoPaterno: 'Ramos', apellidoMaterno: 'Aguilera', numeroEmpleado: 'ENF023', especialidad: 'Traumatología', esCoordinador: false, turnoAsignadoId: 2, servicioActualId: 6, habitacionAsignada: '602' },
    { nombre: 'Osvaldo', apellidoPaterno: 'Medina', apellidoMaterno: 'Torres', numeroEmpleado: 'ENF024', especialidad: 'Traumatología', esCoordinador: false, turnoAsignadoId: 3, servicioActualId: 6, habitacionAsignada: '603' },
    { nombre: 'Mónica', apellidoPaterno: 'Campos', apellidoMaterno: 'Villareal', numeroEmpleado: 'ENF025', especialidad: 'Traumatología', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 6, habitacionAsignada: '604' },
    // Medicina Interna
    { nombre: 'Ricardo', apellidoPaterno: 'León', apellidoMaterno: 'Espinoza', numeroEmpleado: 'ENF026', especialidad: 'Medicina Interna', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 7, habitacionAsignada: '701' },
    { nombre: 'Natalia', apellidoPaterno: 'Paredes', apellidoMaterno: 'Álvarez', numeroEmpleado: 'ENF027', especialidad: 'Medicina Interna', esCoordinador: false, turnoAsignadoId: 2, servicioActualId: 7, habitacionAsignada: '702' },
    { nombre: 'Humberto', apellidoPaterno: 'Vázquez', apellidoMaterno: 'Jiménez', numeroEmpleado: 'ENF028', especialidad: 'Medicina Interna', esCoordinador: false, turnoAsignadoId: 3, servicioActualId: 7, habitacionAsignada: '703' },
    { nombre: 'Adriana', apellidoPaterno: 'Domínguez', apellidoMaterno: 'Luna', numeroEmpleado: 'ENF029', especialidad: 'Medicina Interna', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 7, habitacionAsignada: '704' },
    // UCI
    { nombre: 'Sergio', apellidoPaterno: 'Contreras', apellidoMaterno: 'Soto', numeroEmpleado: 'ENF030', especialidad: 'Cuidados Intensivos', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 8, habitacionAsignada: '801' },
    { nombre: 'Leticia', apellidoPaterno: 'Moreno', apellidoMaterno: 'Cabrera', numeroEmpleado: 'ENF031', especialidad: 'Cuidados Intensivos', esCoordinador: false, turnoAsignadoId: 2, servicioActualId: 8, habitacionAsignada: '802' },
    { nombre: 'Arturo', apellidoPaterno: 'Sandoval', apellidoMaterno: 'Prieto', numeroEmpleado: 'ENF032', especialidad: 'Cuidados Intensivos', esCoordinador: false, turnoAsignadoId: 3, servicioActualId: 8, habitacionAsignada: '803' },
    { nombre: 'Rosa', apellidoPaterno: 'Guerrero', apellidoMaterno: 'Valdez', numeroEmpleado: 'ENF033', especialidad: 'Cuidados Intensivos', esCoordinador: false, turnoAsignadoId: 4, servicioActualId: 8, habitacionAsignada: '804' },
    // Oncología
    { nombre: 'Felipe', apellidoPaterno: 'Acosta', apellidoMaterno: 'Mendoza', numeroEmpleado: 'ENF034', especialidad: 'Oncología', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 9, habitacionAsignada: '901' },
    { nombre: 'Beatriz', apellidoPaterno: 'Figueroa', apellidoMaterno: 'Ramos', numeroEmpleado: 'ENF035', especialidad: 'Oncología', esCoordinador: false, turnoAsignadoId: 2, servicioActualId: 9, habitacionAsignada: '902' },
    { nombre: 'Ignacio', apellidoPaterno: 'Cervantes', apellidoMaterno: 'Rivas', numeroEmpleado: 'ENF036', especialidad: 'Oncología', esCoordinador: false, turnoAsignadoId: 3, servicioActualId: 9, habitacionAsignada: '903' },
    // Psiquiatría
    { nombre: 'Esperanza', apellidoPaterno: 'Maldonado', apellidoMaterno: 'Cruz', numeroEmpleado: 'ENF037', especialidad: 'Psiquiatría', esCoordinador: false, turnoAsignadoId: 1, servicioActualId: 10, habitacionAsignada: '1001' },
    { nombre: 'Rodrigo', apellidoPaterno: 'Esquivel', apellidoMaterno: 'Morales', numeroEmpleado: 'ENF038', especialidad: 'Psiquiatría', esCoordinador: false, turnoAsignadoId: 2, servicioActualId: 10, habitacionAsignada: '1002' },
    { nombre: 'Mariana', apellidoPaterno: 'Ibarra', apellidoMaterno: 'Solís', numeroEmpleado: 'ENF039', especialidad: 'Psiquiatría', esCoordinador: false, turnoAsignadoId: 3, servicioActualId: 10, habitacionAsignada: '1003' },
    // Flotantes
    { nombre: 'David', apellidoPaterno: 'Galván', apellidoMaterno: 'Cortés', numeroEmpleado: 'ENF040', especialidad: 'Enfermería General', esCoordinador: false, turnoAsignadoId: 1 },
    { nombre: 'Paola', apellidoPaterno: 'Rojas', apellidoMaterno: 'Núñez', numeroEmpleado: 'ENF041', especialidad: 'Enfermería General', esCoordinador: false, turnoAsignadoId: 2 },
    { nombre: 'Emilio', apellidoPaterno: 'Salinas', apellidoMaterno: 'Vargas', numeroEmpleado: 'ENF042', especialidad: 'Enfermería General', esCoordinador: false, turnoAsignadoId: 3 },
    { nombre: 'Lidia', apellidoPaterno: 'Quintero', apellidoMaterno: 'Chávez', numeroEmpleado: 'ENF043', especialidad: 'Enfermería General', esCoordinador: false, turnoAsignadoId: 1 },
    { nombre: 'Tomás', apellidoPaterno: 'Velázquez', apellidoMaterno: 'Herrera', numeroEmpleado: 'ENF044', especialidad: 'Enfermería General', esCoordinador: false, turnoAsignadoId: 2 },
    { nombre: 'Silvia', apellidoPaterno: 'Pacheco', apellidoMaterno: 'Díaz', numeroEmpleado: 'ENF045', especialidad: 'Enfermería General', esCoordinador: false, turnoAsignadoId: 3 }
  ];

  for (const enf of enfermeros) {
    await prisma.enfermero.create({ data: enf });
  }

  // 6. PACIENTES
  const pacientes = [
    { numeroExpediente: 'PAC001', nombre: 'Daniel', apellidop: 'Maldonado', apellidom: 'Romero', edad: 20, numeroCama: '12', numeroHabitacion: '13', fechaIngreso: new Date('2025-10-22T12:22:00'), motivoConsulta: 'Dolor abdominal agudo', servicioId: 1 },
    { numeroExpediente: 'PAC002', nombre: 'María', apellidop: 'González', apellidom: 'Pérez', edad: 45, numeroCama: '13', numeroHabitacion: '13', fechaIngreso: new Date('2025-11-01T08:30:00'), motivoConsulta: 'Fractura de brazo por accidente', servicioId: 1 },
    { numeroExpediente: 'PAC003', nombre: 'Juan', apellidop: 'Martínez', apellidom: 'López', edad: 62, numeroCama: '14', numeroHabitacion: '14', fechaIngreso: new Date('2025-11-02T15:45:00'), motivoConsulta: 'Crisis hipertensiva', servicioId: 1 },
    { numeroExpediente: 'PAC004', nombre: 'Laura', apellidop: 'Ramírez', apellidom: 'Silva', edad: 28, numeroCama: '15', numeroHabitacion: '15', fechaIngreso: new Date('2025-11-03T22:10:00'), motivoConsulta: 'Intoxicación alimentaria', servicioId: 1 },
    // Pediatría
    { numeroExpediente: 'PAC005', nombre: 'Sofía', apellidop: 'Hernández', apellidom: 'García', edad: 8, numeroCama: '21', numeroHabitacion: '201', fechaIngreso: new Date('2025-10-28T10:00:00'), motivoConsulta: 'Fiebre alta y dolor de garganta', servicioId: 2 },
    { numeroExpediente: 'PAC006', nombre: 'Diego', apellidop: 'López', apellidom: 'Rodríguez', edad: 5, numeroCama: '22', numeroHabitacion: '201', fechaIngreso: new Date('2025-10-29T14:30:00'), motivoConsulta: 'Bronquitis aguda', servicioId: 2 },
    { numeroExpediente: 'PAC007', nombre: 'Valentina', apellidop: 'Torres', apellidom: 'Morales', edad: 12, numeroCama: '23', numeroHabitacion: '202', fechaIngreso: new Date('2025-10-30T09:15:00'), motivoConsulta: 'Asma no controlada', servicioId: 2 },
    { numeroExpediente: 'PAC008', nombre: 'Santiago', apellidop: 'Jiménez', apellidom: 'Cruz', edad: 3, numeroCama: '24', numeroHabitacion: '202', fechaIngreso: new Date('2025-11-01T16:20:00'), motivoConsulta: 'Gastroenteritis viral', servicioId: 2 },
    { numeroExpediente: 'PAC009', nombre: 'Isabella', apellidop: 'Ruiz', apellidom: 'Vega', edad: 10, numeroCama: '25', numeroHabitacion: '203', fechaIngreso: new Date('2025-11-02T11:00:00'), motivoConsulta: 'Apendicitis', servicioId: 2 },
    // Cardiología
    { numeroExpediente: 'PAC010', nombre: 'Roberto', apellidop: 'Sánchez', apellidom: 'Mendoza', edad: 68, numeroCama: '31', numeroHabitacion: '301', fechaIngreso: new Date('2025-10-25T07:30:00'), motivoConsulta: 'Infarto agudo de miocardio', servicioId: 3 },
    { numeroExpediente: 'PAC011', nombre: 'Carmen', apellidop: 'Vargas', apellidom: 'Flores', edad: 55, numeroCama: '32', numeroHabitacion: '301', fechaIngreso: new Date('2025-10-27T13:45:00'), motivoConsulta: 'Arritmia cardíaca', servicioId: 3 },
    { numeroExpediente: 'PAC012', nombre: 'Fernando', apellidop: 'Castro', apellidom: 'Herrera', edad: 72, numeroCama: '33', numeroHabitacion: '302', fechaIngreso: new Date('2025-10-29T09:00:00'), motivoConsulta: 'Insuficiencia cardíaca congestiva', servicioId: 3 },
    { numeroExpediente: 'PAC013', nombre: 'Patricia', apellidop: 'Reyes', apellidom: 'Delgado', edad: 61, numeroCama: '34', numeroHabitacion: '302', fechaIngreso: new Date('2025-11-01T10:30:00'), motivoConsulta: 'Angina de pecho', servicioId: 3 },
    // Más pacientes... (continuando con el patrón)
    { numeroExpediente: 'PAC030', nombre: 'Sergio', apellidop: 'Sandoval', apellidom: 'Cabrera', edad: 44, numeroCama: '81', numeroHabitacion: '801', fechaIngreso: new Date('2025-10-30T20:00:00'), motivoConsulta: 'Politraumatismo por accidente automovilístico', servicioId: 8 }
  ];

  for (const pac of pacientes) {
    await prisma.paciente.create({ data: pac });
  }

  // 7. CAPACITACIONES
  await prisma.capacitacion.createMany({
    data: [
      { titulo: 'Manejo Básico de RCP', descripcion: 'Reanimación cardiopulmonar básica y avanzada', fechaImparticion: new Date('2024-01-15T09:00:00'), duracion: 240, instructor: 'Dr. Fernando Campos' },
      { titulo: 'Protocolo de Sepsis', descripcion: 'Identificación temprana y manejo de sepsis', fechaImparticion: new Date('2024-03-20T10:00:00'), duracion: 180, instructor: 'Dra. Patricia Vega' },
      { titulo: 'Actualización en Ventilación Mecánica', descripcion: 'Modos ventilatorios y destete', fechaImparticion: new Date('2025-11-15T08:00:00'), duracion: 300, instructor: 'Dr. Ricardo Fuentes' }
    ]
  });

  // 8. MEDICAMENTOS
  await prisma.medicamento.createMany({
    data: [
      { nombre: 'Paracetamol 500mg', descripcion: 'Analgésico y antipirético', cantidadStock: 5000, lote: 'LOTE2025-001', fechaCaducidad: new Date('2026-12-31'), ubicacion: 'Almacén Central - Pasillo A1' },
      { nombre: 'Ibuprofeno 400mg', descripcion: 'Antiinflamatorio no esteroideo', cantidadStock: 3000, lote: 'LOTE2025-002', fechaCaducidad: new Date('2026-10-15'), ubicacion: 'Almacén Central - Pasillo A1' },
      { nombre: 'Amoxicilina 500mg', descripcion: 'Antibiótico de amplio espectro', cantidadStock: 2500, lote: 'LOTE2025-003', fechaCaducidad: new Date('2026-08-20'), ubicacion: 'Almacén Central - Pasillo A2' }
    ]
  });

  // 9. INSUMOS
  await prisma.insumo.createMany({
    data: [
      { nombre: 'Jeringas 5ml desechables', descripcion: 'Jeringas estériles de 5ml', categoria: 'Material descartable', cantidadDisponible: 10000, unidadMedida: 'Unidades', ubicacion: 'Almacén Central - Estante C1', responsableId: 1 },
      { nombre: 'Guantes de nitrilo M', descripcion: 'Guantes desechables talla M', categoria: 'Equipo de protección', cantidadDisponible: 20000, unidadMedida: 'Pares', ubicacion: 'Almacén Central - Estante D1', responsableId: 1 }
    ]
  });

  
  // Mostrar conteos
  const counts = {
    hospitales: await prisma.hospital.count(),
    turnos: await prisma.turno.count(),
    servicios: await prisma.servicio.count(),
    enfermeros: await prisma.enfermero.count(),
    pacientes: await prisma.paciente.count(),
    capacitaciones: await prisma.capacitacion.count(),
    medicamentos: await prisma.medicamento.count(),
    insumos: await prisma.insumo.count()
  };

  Object.entries(counts).forEach(([tabla, count]) => {
  });
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

