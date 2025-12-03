-- =====================================
-- INSERTS ACTUALIZADOS PARA TURNO CARE
-- Base de datos PostgreSQL con Prisma
-- Fecha: 5 de Noviembre, 2025
-- =====================================

-- =====================================
-- LIMPIEZA DE DATOS EXISTENTES
-- =====================================
-- IMPORTANTE: Esto eliminará todos los datos existentes
-- Comentar estas líneas si quieres agregar datos sin eliminar los existentes

-- Eliminar datos de tablas dependientes primero (orden inverso de dependencias)
TRUNCATE TABLE paciente_medicamento CASCADE;
TRUNCATE TABLE paciente_insumo CASCADE;
TRUNCATE TABLE registromedico CASCADE;
TRUNCATE TABLE inventariomedicamentos CASCADE;
TRUNCATE TABLE medicamentos CASCADE;
TRUNCATE TABLE insumo CASCADE;
TRUNCATE TABLE enfermero_capacitacion CASCADE;
TRUNCATE TABLE capacitacion CASCADE;
TRUNCATE TABLE paciente CASCADE;
TRUNCATE TABLE urgencias CASCADE;
TRUNCATE TABLE enfermero CASCADE;
TRUNCATE TABLE turno CASCADE;
TRUNCATE TABLE servicio CASCADE;
TRUNCATE TABLE hospital CASCADE;

-- Reiniciar secuencias de autoincremento
-- Usando SETVAL para reiniciar las secuencias de forma segura
SELECT setval(pg_get_serial_sequence('hospital', 'hospitalId'), 1, false);
SELECT setval(pg_get_serial_sequence('turno', 'turnoId'), 1, false);
SELECT setval(pg_get_serial_sequence('servicio', 'servicioId'), 1, false);
SELECT setval(pg_get_serial_sequence('enfermero', 'enfermeroId'), 1, false);
SELECT setval(pg_get_serial_sequence('paciente', 'pacienteId'), 1, false);
SELECT setval(pg_get_serial_sequence('registromedico', 'registroId'), 1, false);
SELECT setval(pg_get_serial_sequence('medicamentos', 'medicamentoId'), 1, false);
SELECT setval(pg_get_serial_sequence('inventariomedicamentos', 'inventarioId'), 1, false);
SELECT setval(pg_get_serial_sequence('insumo', 'insumoId'), 1, false);
SELECT setval(pg_get_serial_sequence('capacitacion', 'capacitacionId'), 1, false);

-- =====================================
-- 1. HOSPITALES
-- =====================================
-- IMPORTANTE: Los IDs se generan automáticamente
-- hospitalId 1, 2, 3, 4
INSERT INTO hospital (nombre, direccion, telefono) VALUES
('Hospital General San José', 'Av. Principal 123, Ciudad de México', '+52-55-1234-5678'),
('Clínica Santa María', 'Calle Reforma 456, Guadalajara', '+52-33-2345-6789'),
('Hospital Universitario Central', 'Blvd. Universidad 789, Monterrey', '+52-81-3456-7890'),
('Centro Médico Nacional', 'Zona Rosa 321, Ciudad de México', '+52-55-4567-8901');

-- =====================================
-- 2. TURNOS
-- =====================================
-- IMPORTANTE: Los IDs se generan automáticamente
-- turnoId 1 = Matutino, 2 = Vespertino, 3 = Nocturno, 4 = Jornada Completa
INSERT INTO turno (nombre, "horaInicio", "horaFin") VALUES
('Matutino', '08:00:00', '16:00:00'),
('Vespertino', '16:00:00', '00:00:00'),
('Nocturno', '00:00:00', '08:00:00'),
('Jornada Completa', '08:00:00', '20:00:00');

-- =====================================
-- 3. SERVICIOS
-- =====================================
-- IMPORTANTE: Los IDs se generan automáticamente
-- servicioId 1-10 en orden de inserción
INSERT INTO servicio (nombre, descripcion, "capacidadMaxima", "personalAsignado", "hospitalId") VALUES
('Urgencias', 'Servicio de emergencias médicas 24/7', 50, 8, 1),
('Pediatría', 'Atención médica especializada para niños', 30, 5, 1),
('Cardiología', 'Tratamiento de enfermedades cardiovasculares', 25, 4, 1),
('Neurología', 'Diagnóstico y tratamiento de trastornos neurológicos', 20, 4, 2),
('Ginecología', 'Atención médica para la salud femenina', 35, 4, 2),
('Traumatología', 'Tratamiento de lesiones y fracturas', 40, 5, 3),
('Medicina Interna', 'Atención médica general para adultos', 45, 5, 3),
('UCI', 'Unidad de Cuidados Intensivos', 15, 6, 4),
('Oncología', 'Tratamiento de cáncer y tumores', 20, 4, 4),
('Psiquiatría', 'Salud mental y trastornos psiquiátricos', 25, 3, 1);

-- =====================================
-- 4. URGENCIAS (Triaje)
-- =====================================
INSERT INTO urgencias ("nivelTriaje", "tiempoEsperaPromedio", "servicioId") VALUES
('Crítico', 5, 1);

-- =====================================
-- 5. ENFERMEROS
-- =====================================
-- IMPORTANTE: Los IDs se generan automáticamente (autoincrement)
-- El primer enfermero tendrá enfermeroId = 1, el segundo = 2, etc.
INSERT INTO enfermero (nombre, "apellidoPaterno", "apellidoMaterno", "numeroEmpleado", especialidad, "esCoordinador", "turnoAsignadoId", "servicioActualId", "habitacionAsignada") VALUES
-- Coordinadores (IDs: 1, 2, 3)
('Ana', 'García', 'Martínez', 'ENF001', 'Coordinación General', TRUE, 1, 1, NULL),
('Carlos', 'López', 'Hernández', 'ENF002', 'Coordinación UCI', TRUE, 2, 8, NULL),
('María Elena', 'Rodríguez', 'Silva', 'ENF003', 'Coordinación Pediatría', TRUE, 1, 2, NULL),

-- Enfermeros de Urgencias (IDs: 4, 5, 6, 7, 8)
('Luis', 'Pérez', 'González', 'ENF004', 'Urgencias', FALSE, 1, 1, '101'),
('Carmen', 'Martínez', 'López', 'ENF005', 'Urgencias', FALSE, 2, 1, '102'),
('Roberto', 'Sánchez', 'Ruiz', 'ENF006', 'Urgencias', FALSE, 3, 1, '103'),
('Patricia', 'Torres', 'Mendoza', 'ENF007', 'Urgencias', FALSE, 1, 1, '104'),
('Jorge', 'Ramírez', 'Castro', 'ENF008', 'Urgencias', FALSE, 2, 1, '105'),

-- Enfermeros de Pediatría (IDs: 9, 10, 11, 12)
('Lucía', 'Morales', 'Vega', 'ENF009', 'Pediatría', FALSE, 1, 2, '201'),
('Manuel', 'Jiménez', 'Flores', 'ENF010', 'Pediatría', FALSE, 2, 2, '202'),
('Diana', 'Vargas', 'Ochoa', 'ENF011', 'Pediatría', FALSE, 3, 2, '203'),
('Fernando', 'Castillo', 'Romero', 'ENF012', 'Pediatría', FALSE, 1, 2, '204'),

-- Enfermeros de Cardiología (IDs: 13, 14, 15)
('Sofía', 'Herrera', 'Delgado', 'ENF013', 'Cardiología', FALSE, 1, 3, '301'),
('Miguel', 'Aguilar', 'Santos', 'ENF014', 'Cardiología', FALSE, 2, 3, '302'),
('Alejandra', 'Cruz', 'Moreno', 'ENF015', 'Cardiología', FALSE, 3, 3, '303'),

-- Enfermeros de Neurología (IDs: 16, 17, 18)
('Antonio', 'Reyes', 'Guerrero', 'ENF016', 'Neurología', FALSE, 1, 4, '401'),
('Gabriela', 'Mendoza', 'Ríos', 'ENF017', 'Neurología', FALSE, 2, 4, '402'),
('Raúl', 'Ortega', 'Campos', 'ENF018', 'Neurología', FALSE, 3, 4, '403'),

-- Enfermeros de Ginecología (IDs: 19, 20, 21)
('Isabel', 'Valencia', 'Herrera', 'ENF019', 'Ginecología', FALSE, 1, 5, '501'),
('Alberto', 'Gutiérrez', 'Peña', 'ENF020', 'Ginecología', FALSE, 2, 5, '502'),
('Claudia', 'Ruiz', 'Montoya', 'ENF021', 'Ginecología', FALSE, 3, 5, '503'),

-- Enfermeros de Traumatología (IDs: 22, 23, 24, 25)
('Eduardo', 'Silva', 'Navarro', 'ENF022', 'Traumatología', FALSE, 1, 6, '601'),
('Verónica', 'Ramos', 'Aguilera', 'ENF023', 'Traumatología', FALSE, 2, 6, '602'),
('Osvaldo', 'Medina', 'Torres', 'ENF024', 'Traumatología', FALSE, 3, 6, '603'),
('Mónica', 'Campos', 'Villareal', 'ENF025', 'Traumatología', FALSE, 1, 6, '604'),

-- Enfermeros de Medicina Interna (IDs: 26, 27, 28, 29)
('Ricardo', 'León', 'Espinoza', 'ENF026', 'Medicina Interna', FALSE, 1, 7, '701'),
('Natalia', 'Paredes', 'Álvarez', 'ENF027', 'Medicina Interna', FALSE, 2, 7, '702'),
('Humberto', 'Vázquez', 'Jiménez', 'ENF028', 'Medicina Interna', FALSE, 3, 7, '703'),
('Adriana', 'Domínguez', 'Luna', 'ENF029', 'Medicina Interna', FALSE, 1, 7, '704'),

-- Enfermeros de UCI (IDs: 30, 31, 32, 33)
('Sergio', 'Contreras', 'Soto', 'ENF030', 'Cuidados Intensivos', FALSE, 1, 8, '801'),
('Leticia', 'Moreno', 'Cabrera', 'ENF031', 'Cuidados Intensivos', FALSE, 2, 8, '802'),
('Arturo', 'Sandoval', 'Prieto', 'ENF032', 'Cuidados Intensivos', FALSE, 3, 8, '803'),
('Rosa', 'Guerrero', 'Valdez', 'ENF033', 'Cuidados Intensivos', FALSE, 4, 8, '804'),

-- Enfermeros de Oncología (IDs: 34, 35, 36)
('Felipe', 'Acosta', 'Mendoza', 'ENF034', 'Oncología', FALSE, 1, 9, '901'),
('Beatriz', 'Figueroa', 'Ramos', 'ENF035', 'Oncología', FALSE, 2, 9, '902'),
('Ignacio', 'Cervantes', 'Rivas', 'ENF036', 'Oncología', FALSE, 3, 9, '903'),

-- Enfermeros de Psiquiatría (IDs: 37, 38, 39)
('Esperanza', 'Maldonado', 'Cruz', 'ENF037', 'Psiquiatría', FALSE, 1, 10, '1001'),
('Rodrigo', 'Esquivel', 'Morales', 'ENF038', 'Psiquiatría', FALSE, 2, 10, '1002'),
('Mariana', 'Ibarra', 'Solís', 'ENF039', 'Psiquiatría', FALSE, 3, 10, '1003'),

-- Enfermeros flotantes (IDs: 40, 41, 42, 43, 44, 45)
('David', 'Galván', 'Cortés', 'ENF040', 'Enfermería General', FALSE, 1, NULL, NULL),
('Paola', 'Rojas', 'Núñez', 'ENF041', 'Enfermería General', FALSE, 2, NULL, NULL),
('Emilio', 'Salinas', 'Vargas', 'ENF042', 'Enfermería General', FALSE, 3, NULL, NULL),
('Lidia', 'Quintero', 'Chávez', 'ENF043', 'Enfermería General', FALSE, 1, NULL, NULL),
('Tomás', 'Velázquez', 'Herrera', 'ENF044', 'Enfermería General', FALSE, 2, NULL, NULL),
('Silvia', 'Pacheco', 'Díaz', 'ENF045', 'Enfermería General', FALSE, 3, NULL, NULL);

-- =====================================
-- 6. PACIENTES
-- =====================================
INSERT INTO paciente ("numeroExpediente", nombre, apellidop, apellidom, edad, "numeroCama", "numeroHabitacion", "fechaIngreso", "motivoConsulta", "servicioId") VALUES
-- Pacientes de Urgencias
('PAC001', 'Daniel', 'Maldonado', 'Romero', 20, '12', '13', '2025-10-22 12:22:00', 'Dolor abdominal agudo', 1),
('PAC002', 'María', 'González', 'Pérez', 45, '13', '13', '2025-11-01 08:30:00', 'Fractura de brazo por accidente', 1),
('PAC003', 'Juan', 'Martínez', 'López', 62, '14', '14', '2025-11-02 15:45:00', 'Crisis hipertensiva', 1),
('PAC004', 'Laura', 'Ramírez', 'Silva', 28, '15', '15', '2025-11-03 22:10:00', 'Intoxicación alimentaria', 1),

-- Pacientes de Pediatría
('PAC005', 'Sofía', 'Hernández', 'García', 8, '21', '201', '2025-10-28 10:00:00', 'Fiebre alta y dolor de garganta', 2),
('PAC006', 'Diego', 'López', 'Rodríguez', 5, '22', '201', '2025-10-29 14:30:00', 'Bronquitis aguda', 2),
('PAC007', 'Valentina', 'Torres', 'Morales', 12, '23', '202', '2025-10-30 09:15:00', 'Asma no controlada', 2),
('PAC008', 'Santiago', 'Jiménez', 'Cruz', 3, '24', '202', '2025-11-01 16:20:00', 'Gastroenteritis viral', 2),
('PAC009', 'Isabella', 'Ruiz', 'Vega', 10, '25', '203', '2025-11-02 11:00:00', 'Apendicitis', 2),

-- Pacientes de Cardiología
('PAC010', 'Roberto', 'Sánchez', 'Mendoza', 68, '31', '301', '2025-10-25 07:30:00', 'Infarto agudo de miocardio', 3),
('PAC011', 'Carmen', 'Vargas', 'Flores', 55, '32', '301', '2025-10-27 13:45:00', 'Arritmia cardíaca', 3),
('PAC012', 'Fernando', 'Castro', 'Herrera', 72, '33', '302', '2025-10-29 09:00:00', 'Insuficiencia cardíaca congestiva', 3),
('PAC013', 'Patricia', 'Reyes', 'Delgado', 61, '34', '302', '2025-11-01 10:30:00', 'Angina de pecho', 3),

-- Pacientes de Neurología
('PAC014', 'Miguel', 'Ortega', 'Santos', 48, '41', '401', '2025-10-26 14:00:00', 'Accidente cerebrovascular', 4),
('PAC015', 'Ana', 'Mendoza', 'Aguilar', 53, '42', '401', '2025-10-28 08:15:00', 'Crisis epiléptica', 4),
('PAC016', 'Jorge', 'Cruz', 'Ríos', 65, '43', '402', '2025-10-30 11:30:00', 'Parkinson avanzado', 4),
('PAC017', 'Rosa', 'Valencia', 'Campos', 42, '44', '402', '2025-11-02 16:45:00', 'Migraña crónica severa', 4),

-- Pacientes de Ginecología
('PAC018', 'Gabriela', 'Gutiérrez', 'Herrera', 32, '51', '501', '2025-10-27 09:30:00', 'Control prenatal - embarazo de 28 semanas', 5),
('PAC019', 'Claudia', 'Ruiz', 'Peña', 29, '52', '501', '2025-10-29 13:00:00', 'Amenorrea y dolor pélvico', 5),
('PAC020', 'Elena', 'Silva', 'Montoya', 38, '53', '502', '2025-11-01 10:15:00', 'Parto en labor', 5),
('PAC021', 'Mónica', 'Ramos', 'Navarro', 45, '54', '502', '2025-11-03 14:30:00', 'Quiste ovárico', 5),

-- Pacientes de Traumatología
('PAC022', 'Alberto', 'Medina', 'Aguilera', 35, '61', '601', '2025-10-28 15:20:00', 'Fractura de tibia y peroné', 6),
('PAC023', 'Verónica', 'Campos', 'Torres', 27, '62', '601', '2025-10-30 08:40:00', 'Esguince de tobillo grado III', 6),
('PAC024', 'Osvaldo', 'León', 'Villareal', 52, '63', '602', '2025-11-01 12:00:00', 'Luxación de hombro', 6),
('PAC025', 'Natalia', 'Contreras', 'Espinoza', 41, '64', '602', '2025-11-02 09:30:00', 'Fractura de cadera', 6),

-- Pacientes de Medicina Interna
('PAC026', 'Ricardo', 'Paredes', 'Álvarez', 58, '71', '701', '2025-10-29 10:45:00', 'Diabetes mellitus descompensada', 7),
('PAC027', 'Adriana', 'Vázquez', 'Jiménez', 63, '72', '701', '2025-10-31 14:15:00', 'Neumonía bacteriana', 7),
('PAC028', 'Humberto', 'Domínguez', 'Luna', 70, '73', '702', '2025-11-02 08:00:00', 'Insuficiencia renal crónica', 7),
('PAC029', 'Leticia', 'Moreno', 'Soto', 56, '74', '702', '2025-11-03 11:20:00', 'Hipertensión arterial severa', 7),

-- Pacientes de UCI
('PAC030', 'Sergio', 'Sandoval', 'Cabrera', 44, '81', '801', '2025-10-30 20:00:00', 'Politraumatismo por accidente automovilístico', 8),
('PAC031', 'Rosa', 'Guerrero', 'Prieto', 59, '82', '801', '2025-11-01 02:30:00', 'Sepsis severa', 8),
('PAC032', 'Arturo', 'Acosta', 'Valdez', 67, '83', '802', '2025-11-02 05:45:00', 'Paro cardiorrespiratorio recuperado', 8),
('PAC033', 'Beatriz', 'Figueroa', 'Mendoza', 51, '84', '802', '2025-11-03 18:15:00', 'Insuficiencia respiratoria aguda', 8),

-- Pacientes de Oncología
('PAC034', 'Felipe', 'Cervantes', 'Ramos', 47, '91', '901', '2025-10-27 09:00:00', 'Cáncer de pulmón - quimioterapia', 9),
('PAC035', 'Esperanza', 'Maldonado', 'Rivas', 54, '92', '901', '2025-10-29 12:30:00', 'Cáncer de mama metastásico', 9),
('PAC036', 'Ignacio', 'Esquivel', 'Cruz', 62, '93', '902', '2025-11-01 08:45:00', 'Linfoma no Hodgkin', 9),
('PAC037', 'Mariana', 'Ibarra', 'Morales', 49, '94', '902', '2025-11-03 10:00:00', 'Cáncer colorrectal', 9),

-- Pacientes de Psiquiatría
('PAC038', 'David', 'Galván', 'Solís', 31, '101', '1001', '2025-10-28 16:30:00', 'Trastorno depresivo mayor', 10),
('PAC039', 'Paola', 'Rojas', 'Cortés', 26, '102', '1001', '2025-10-30 10:15:00', 'Trastorno de ansiedad generalizada', 10),
('PAC040', 'Emilio', 'Salinas', 'Núñez', 39, '103', '1002', '2025-11-01 14:45:00', 'Trastorno bipolar - fase maníaca', 10),
('PAC041', 'Lidia', 'Quintero', 'Vargas', 44, '104', '1002', '2025-11-02 09:00:00', 'Esquizofrenia paranoide', 10);

-- =====================================
-- 7. CAPACITACIONES
-- =====================================
INSERT INTO capacitacion (titulo, descripcion, "fechaImparticion", duracion, instructor) VALUES

-- CAPACITACIONES PASADAS (2024-2025)
('Manejo Básico de RCP', 'Reanimación cardiopulmonar básica y avanzada', '2024-01-15 09:00:00', 240, 'Dr. Fernando Campos'),
('Protocolo de Sepsis', 'Identificación temprana y manejo de sepsis', '2024-03-20 10:00:00', 180, 'Dra. Patricia Vega'),
('Administración Segura de Medicamentos', 'Prevención de errores en medicación', '2024-05-10 08:30:00', 210, 'Lic. Andrea Moreno'),
('Control de Infecciones Nosocomiales', 'Prevención y control de infecciones hospitalarias', '2024-07-18 11:00:00', 180, 'Dr. Roberto Sánchez'),
('Cuidados Paliativos Básicos', 'Atención integral al paciente terminal', '2024-09-25 14:00:00', 240, 'Dra. Elena Campos'),
('Atención al Paciente Diabético', 'Manejo de diabetes y complicaciones', '2024-11-08 09:30:00', 210, 'Dr. Luis Hernández'),
('Urgencias Pediátricas', 'Manejo de emergencias en población infantil', '2025-01-12 08:00:00', 300, 'Dra. Carmen Vega'),
('Cuidados Intensivos Avanzados', 'Manejo del paciente crítico en UCI', '2025-03-22 07:30:00', 360, 'Dr. Alejandro Ruiz'),
('Manejo de Heridas y Curaciones', 'Técnicas modernas de curación', '2025-05-14 10:00:00', 180, 'Lic. Mónica Torres'),
('Farmacología Clínica', 'Actualización en medicamentos esenciales', '2025-07-19 09:00:00', 240, 'Quím. Farm. Laura Díaz'),
('Ética en Enfermería', 'Dilemas éticos y toma de decisiones', '2025-09-05 16:00:00', 180, 'Lic. Rosa Guerrero'),
('Prevención de Caídas Hospitalarias', 'Protocolos de seguridad del paciente', '2025-11-10 11:00:00', 150, 'Lic. Teresa Aguilar'),

-- CAPACITACIONES EN CURSO (Noviembre-Diciembre 2025)
('Actualización en Ventilación Mecánica', 'Modos ventilatorios y destete', '2025-11-15 08:00:00', 300, 'Dr. Ricardo Fuentes'),
('Manejo de Paciente COVID-19', 'Protocolos actualizados de atención', '2025-11-20 10:30:00', 240, 'Dr. Martín Castañeda'),
('Nutrición Enteral y Parenteral', 'Soporte nutricional especializado', '2025-11-28 09:00:00', 210, 'Lic. Adriana Vázquez'),
('Comunicación Efectiva con Pacientes', 'Habilidades blandas en enfermería', '2025-12-05 14:00:00', 180, 'Psic. Esperanza Maldonado'),
('Manejo de Urgencias Cardiovasculares', 'Infarto agudo y arritmias', '2025-12-10 08:30:00', 270, 'Dr. Miguel Aguilar'),
('Bioseguridad y Manejo de Residuos', 'Normas de bioseguridad hospitalaria', '2025-12-18 10:00:00', 180, 'Lic. Andrés Valdez'),

-- CAPACITACIONES FUTURAS (2026-2027)
('Actualización en IA Clínica', 'Uso de herramientas de IA para apoyo diagnóstico', '2026-01-10 09:00:00', 180, 'Dr. Martín Castañeda'),
('Seguridad del Paciente 2.0', 'Nuevos protocolos de seguridad y reporte de eventos', '2026-02-05 11:00:00', 240, 'Lic. Teresa Aguilar'),
('Telemedicina en Urgencias', 'Implementación y flujo de atención remota', '2026-03-20 08:30:00', 210, 'Dra. Paula Núñez'),
('Ventilación No Invasiva Avanzada', 'Estrategias y monitoreo en VNI', '2026-04-12 07:45:00', 300, 'Dr. Ricardo Fuentes'),
('Manejo de Paciente Politraumatizado', 'Abordaje integral y coordinado en trauma', '2026-05-09 08:00:00', 360, 'Dr. Esteban Rosales'),
('Farmacovigilancia Hospitalaria', 'Detección y registro de eventos adversos', '2026-06-01 10:15:00', 180, 'Quím. Farm. Laura Díaz'),
('Cuidados Paliativos Multidisciplinarios', 'Intervenciones de enfermería en etapa terminal', '2026-07-18 14:00:00', 240, 'Dra. Elena Campos'),
('Control de Infecciones en UCI', 'Prevención de IAAS y auditorías internas', '2026-08-03 09:30:00', 210, 'Lic. Andrés Valdez'),
('RCP Pediátrico Actualizado', 'Nuevas guías y simulación de escenarios', '2026-09-21 08:00:00', 240, 'Dra. Carmen Vega'),
('Manejo Integral de Sepsis', 'Detección temprana y bundle terapéutico', '2026-10-10 07:30:00', 300, 'Dr. Alejandro Ruiz'),
('Ética y Bioética Clínica', 'Casos prácticos y toma de decisiones', '2026-11-02 16:00:00', 180, 'Lic. Rosa Guerrero'),
('Nutrición Clínica en UCI', 'Soporte nutricional y seguimiento', '2026-12-14 09:00:00', 210, 'Lic. Adriana Vázquez'),
('Atención de Paciente Oncológico Crítico', 'Complicaciones y cuidados específicos', '2027-01-05 08:00:00', 300, 'Dr. Felipe Acosta'),
('Salud Mental en Personal de Salud', 'Prevención del burnout y primeros auxilios psicológicos', '2027-02-18 10:00:00', 180, 'Psic. Esperanza Maldonado'),
('Ultrasonido Básico en Urgencias', 'FAST y evaluaciones a pie de cama', '2027-03-12 08:30:00', 240, 'Dr. Miguel Aguilar');

-- =====================================
-- 8. ASIGNACIÓN DE CAPACITACIONES
-- =====================================
INSERT INTO enfermero_capacitacion ("enfermeroId", "capacitacionId", asistio) VALUES
-- Coordinadores asisten a múltiples capacitaciones (pasadas)
(1, 1, TRUE), (1, 2, TRUE), (1, 3, TRUE), (1, 4, TRUE), (1, 5, TRUE), (1, 6, TRUE),
(2, 1, TRUE), (2, 2, TRUE), (2, 3, TRUE), (2, 8, TRUE), (2, 10, TRUE),
(3, 1, TRUE), (3, 6, TRUE), (3, 7, TRUE), (3, 9, TRUE),

-- Enfermeros de Urgencias (capacitaciones pasadas y en curso)
(4, 1, TRUE), (4, 2, TRUE), (4, 3, TRUE), (4, 13, TRUE), (4, 14, TRUE),
(5, 1, TRUE), (5, 2, TRUE), (5, 4, TRUE), (5, 15, TRUE),
(6, 1, TRUE), (6, 3, TRUE), (6, 11, TRUE), (6, 16, TRUE),
(7, 1, TRUE), (7, 2, TRUE), (7, 17, TRUE),
(8, 1, TRUE), (8, 4, TRUE), (8, 14, FALSE),

-- Enfermeros de Pediatría (pasadas y en curso)
(9, 1, TRUE), (9, 7, TRUE), (9, 9, TRUE), (9, 13, TRUE),
(10, 1, TRUE), (10, 7, TRUE), (10, 3, TRUE), (10, 16, TRUE),
(11, 7, TRUE), (11, 9, TRUE), (11, 15, TRUE),
(12, 1, TRUE), (12, 7, TRUE), (12, 17, TRUE),

-- Enfermeros de Cardiología (pasadas y en curso)
(13, 1, TRUE), (13, 2, TRUE), (13, 6, TRUE), (13, 17, TRUE),
(14, 1, TRUE), (14, 2, TRUE), (14, 10, TRUE), (14, 14, TRUE),
(15, 1, TRUE), (15, 3, TRUE), (15, 6, TRUE),

-- Enfermeros de Neurología (pasadas y en curso)
(16, 1, TRUE), (16, 2, TRUE), (16, 4, TRUE), (16, 13, TRUE),
(17, 1, TRUE), (17, 5, TRUE), (17, 11, TRUE),
(18, 1, TRUE), (18, 2, TRUE), (18, 16, TRUE),

-- Enfermeros de Ginecología (pasadas)
(19, 1, TRUE), (19, 3, TRUE), (19, 5, TRUE), (19, 9, TRUE),
(20, 1, TRUE), (20, 3, TRUE), (20, 11, TRUE),
(21, 1, TRUE), (21, 5, TRUE), (21, 10, TRUE),

-- Enfermeros de Traumatología (pasadas y en curso)
(22, 1, TRUE), (22, 2, TRUE), (22, 9, TRUE), (22, 15, TRUE),
(23, 1, TRUE), (23, 4, TRUE), (23, 9, TRUE),
(24, 1, TRUE), (24, 2, TRUE), (24, 3, TRUE),
(25, 1, TRUE), (25, 9, TRUE), (25, 16, TRUE),

-- Enfermeros de Medicina Interna (pasadas)
(26, 1, TRUE), (26, 2, TRUE), (26, 6, TRUE), (26, 10, TRUE),
(27, 1, TRUE), (27, 3, TRUE), (27, 4, TRUE), (27, 11, TRUE),
(28, 1, TRUE), (28, 2, TRUE), (28, 10, TRUE),
(29, 1, TRUE), (29, 6, TRUE), (29, 11, TRUE),

-- Enfermeros de UCI (pasadas y en curso)
(30, 1, TRUE), (30, 2, TRUE), (30, 4, TRUE), (30, 8, TRUE), (30, 13, TRUE), (30, 15, TRUE),
(31, 1, TRUE), (31, 2, TRUE), (31, 8, TRUE), (31, 13, TRUE), (31, 14, TRUE),
(32, 1, TRUE), (32, 2, TRUE), (32, 4, TRUE), (32, 8, TRUE), (32, 17, TRUE),
(33, 1, TRUE), (33, 8, TRUE), (33, 13, TRUE), (33, 15, TRUE),

-- Enfermeros de Oncología (pasadas y en curso)
(34, 1, TRUE), (34, 3, TRUE), (34, 5, TRUE), (34, 10, TRUE), (34, 16, TRUE),
(35, 1, TRUE), (35, 5, TRUE), (35, 3, TRUE), (35, 15, TRUE),
(36, 1, TRUE), (36, 5, TRUE), (36, 10, FALSE), (36, 14, TRUE),

-- Enfermeros de Psiquiatría (pasadas y en curso)
(37, 1, TRUE), (37, 5, TRUE), (37, 11, TRUE), (37, 16, TRUE),
(38, 1, TRUE), (38, 11, TRUE), (38, 5, TRUE),
(39, 1, TRUE), (39, 11, TRUE), (39, 3, TRUE),

-- Enfermeros flotantes (pasadas)
(40, 1, TRUE), (40, 3, TRUE), (40, 12, TRUE),
(41, 1, TRUE), (41, 3, TRUE), (41, 9, TRUE),
(42, 1, TRUE), (42, 2, TRUE), (42, 12, TRUE),
(43, 1, TRUE), (43, 3, TRUE), (43, 4, TRUE),
(44, 1, TRUE), (44, 12, TRUE),
(45, 1, TRUE), (45, 3, TRUE), (45, 11, TRUE);

-- =====================================
-- 9. MEDICAMENTOS
-- =====================================
INSERT INTO medicamentos (nombre, descripcion, "cantidadStock", lote, "fechaCaducidad", ubicacion, "actualizadoEn") VALUES
('Paracetamol 500mg', 'Analgésico y antipirético', 5000, 'LOTE2025-001', '2026-12-31', 'Almacén Central - Pasillo A1', '2025-11-05 08:00:00'),
('Ibuprofeno 400mg', 'Antiinflamatorio no esteroideo', 3000, 'LOTE2025-002', '2026-10-15', 'Almacén Central - Pasillo A1', '2025-11-05 08:00:00'),
('Amoxicilina 500mg', 'Antibiótico de amplio espectro', 2500, 'LOTE2025-003', '2026-08-20', 'Almacén Central - Pasillo A2', '2025-11-05 08:00:00'),
('Omeprazol 20mg', 'Inhibidor de la bomba de protones', 4000, 'LOTE2025-004', '2027-01-30', 'Almacén Central - Pasillo A2', '2025-11-05 08:00:00'),
('Metformina 850mg', 'Antidiabético oral', 3500, 'LOTE2025-005', '2026-11-25', 'Almacén Central - Pasillo A3', '2025-11-05 08:00:00'),
('Losartán 50mg', 'Antihipertensivo', 3200, 'LOTE2025-006', '2026-09-10', 'Almacén Central - Pasillo A3', '2025-11-05 08:00:00'),
('Atorvastatina 20mg', 'Hipolipemiante', 2800, 'LOTE2025-007', '2027-03-15', 'Almacén Central - Pasillo A4', '2025-11-05 08:00:00'),
('Diclofenaco 50mg', 'Antiinflamatorio', 2200, 'LOTE2025-008', '2026-07-22', 'Almacén Central - Pasillo A4', '2025-11-05 08:00:00'),
('Ranitidina 150mg', 'Antagonista H2', 1800, 'LOTE2025-009', '2026-06-30', 'Almacén Central - Pasillo B1', '2025-11-05 08:00:00'),
('Salbutamol Inhalador', 'Broncodilatador', 1500, 'LOTE2025-010', '2027-02-28', 'Almacén Central - Pasillo B1', '2025-11-05 08:00:00'),
('Insulina NPH', 'Insulina de acción intermedia', 800, 'LOTE2025-011', '2026-05-15', 'Refrigerador - UCI', '2025-11-05 08:00:00'),
('Morfina 10mg', 'Analgésico opioide', 500, 'LOTE2025-012', '2027-01-10', 'Almacén Controlado - Área Restringida', '2025-11-05 08:00:00'),
('Diazepam 10mg', 'Benzodiacepina', 1200, 'LOTE2025-013', '2026-12-05', 'Almacén Controlado - Área Restringida', '2025-11-05 08:00:00'),
('Ciprofloxacino 500mg', 'Antibiótico fluoroquinolona', 1600, 'LOTE2025-014', '2026-10-20', 'Almacén Central - Pasillo B2', '2025-11-05 08:00:00'),
('Warfarina 5mg', 'Anticoagulante oral', 900, 'LOTE2025-015', '2027-04-18', 'Almacén Central - Pasillo B2', '2025-11-05 08:00:00');

-- =====================================
-- 10. INSUMOS MÉDICOS
-- =====================================
INSERT INTO insumo (nombre, descripcion, categoria, "cantidadDisponible", "unidadMedida", ubicacion, "responsableId", "actualizadoEn") VALUES
('Jeringas 5ml desechables', 'Jeringas estériles de 5ml', 'Material descartable', 10000, 'Unidades', 'Almacén Central - Estante C1', 1, '2025-11-05 08:00:00'),
('Jeringas 10ml desechables', 'Jeringas estériles de 10ml', 'Material descartable', 8000, 'Unidades', 'Almacén Central - Estante C1', 1, '2025-11-05 08:00:00'),
('Agujas calibre 21G', 'Agujas hipodérmicas calibre 21', 'Material descartable', 15000, 'Unidades', 'Almacén Central - Estante C2', 1, '2025-11-05 08:00:00'),
('Agujas calibre 23G', 'Agujas hipodérmicas calibre 23', 'Material descartable', 12000, 'Unidades', 'Almacén Central - Estante C2', 1, '2025-11-05 08:00:00'),
('Guantes de nitrilo M', 'Guantes desechables talla M', 'Equipo de protección', 20000, 'Pares', 'Almacén Central - Estante D1', 1, '2025-11-05 08:00:00'),
('Guantes de nitrilo L', 'Guantes desechables talla L', 'Equipo de protección', 18000, 'Pares', 'Almacén Central - Estante D1', 1, '2025-11-05 08:00:00'),
('Gasas estériles 10x10', 'Gasas estériles para curaciones', 'Material de curación', 5000, 'Paquetes', 'Almacén Central - Estante D2', 1, '2025-11-05 08:00:00'),
('Vendas elásticas 10cm', 'Vendas elásticas de 10cm ancho', 'Material de curación', 3000, 'Rollos', 'Almacén Central - Estante D2', 1, '2025-11-05 08:00:00'),
('Catéter IV 18G', 'Catéter intravenoso calibre 18', 'Material de acceso vascular', 2500, 'Unidades', 'Almacén Central - Estante E1', 2, '2025-11-05 08:00:00'),
('Catéter IV 20G', 'Catéter intravenoso calibre 20', 'Material de acceso vascular', 3500, 'Unidades', 'Almacén Central - Estante E1', 2, '2025-11-05 08:00:00'),
('Suero fisiológico 500ml', 'Solución salina 0.9%', 'Soluciones', 4000, 'Bolsas', 'Almacén Central - Estante E2', 2, '2025-11-05 08:00:00'),
('Suero glucosado 5% 500ml', 'Solución dextrosa 5%', 'Soluciones', 3500, 'Bolsas', 'Almacén Central - Estante E2', 2, '2025-11-05 08:00:00'),
('Mascarillas quirúrgicas', 'Cubrebocas desechables 3 capas', 'Equipo de protección', 50000, 'Unidades', 'Almacén Central - Estante F1', 1, '2025-11-05 08:00:00'),
('Batas quirúrgicas', 'Batas estériles desechables', 'Equipo de protección', 2000, 'Unidades', 'Almacén Central - Estante F1', 1, '2025-11-05 08:00:00'),
('Termómetros digitales', 'Termómetros clínicos digitales', 'Equipo de diagnóstico', 500, 'Unidades', 'Farmacia - Vitrina A', 3, '2025-11-05 08:00:00'),
('Oxímetros de pulso', 'Medidor de saturación de oxígeno', 'Equipo de diagnóstico', 200, 'Unidades', 'Farmacia - Vitrina A', 3, '2025-11-05 08:00:00'),
('Equipos de venoclisis', 'Set completo para venoclisis', 'Material de acceso vascular', 5000, 'Unidades', 'Almacén Central - Estante E3', 2, '2025-11-05 08:00:00'),
('Sondas nasogástricas', 'Sondas NG de diferentes calibres', 'Material especializado', 800, 'Unidades', 'Almacén Central - Estante G1', 2, '2025-11-05 08:00:00'),
('Alcohol gel 500ml', 'Solución desinfectante para manos', 'Antisépticos', 1000, 'Frascos', 'Almacén Central - Estante F2', 1, '2025-11-05 08:00:00'),
('Solución antiséptica', 'Yodopovidona solución 120ml', 'Antisépticos', 2500, 'Frascos', 'Almacén Central - Estante F2', 1, '2025-11-05 08:00:00');

-- =====================================
-- 11. REGISTROS MÉDICOS DE EJEMPLO
-- =====================================
INSERT INTO registromedico ("pacienteId", "enfermeroId", "fechaHora", "signosVitales", observaciones) VALUES
(1, 4, '2025-10-22 13:00:00', '{"presionArterial": "120/80", "frecuenciaCardiaca": 78, "temperatura": 36.8, "saturacionOxigeno": 98}', 'Paciente estable, dolor controlado con analgésicos'),
(1, 4, '2025-10-22 20:00:00', '{"presionArterial": "118/78", "frecuenciaCardiaca": 75, "temperatura": 36.5, "saturacionOxigeno": 99}', 'Evolución favorable, sin complicaciones'),
(10, 13, '2025-10-25 14:30:00', '{"presionArterial": "140/95", "frecuenciaCardiaca": 92, "temperatura": 37.2, "saturacionOxigeno": 94}', 'Post-infarto, en observación continua'),
(10, 13, '2025-10-25 22:00:00', '{"presionArterial": "135/88", "frecuenciaCardiaca": 85, "temperatura": 36.9, "saturacionOxigeno": 96}', 'Mejoría gradual, signos vitales estabilizándose'),
(30, 30, '2025-10-31 02:00:00', '{"presionArterial": "100/60", "frecuenciaCardiaca": 110, "temperatura": 38.5, "saturacionOxigeno": 90}', 'Paciente crítico en UCI, ventilación mecánica asistida'),
(30, 30, '2025-10-31 08:00:00', '{"presionArterial": "105/65", "frecuenciaCardiaca": 105, "temperatura": 38.2, "saturacionOxigeno": 92}', 'Leve mejoría en parámetros respiratorios');

-- =====================================
-- 12. ASIGNACIÓN DE INSUMOS A PACIENTES
-- =====================================
INSERT INTO paciente_insumo ("pacienteId", "insumoId", cantidad, "asignadoEn") VALUES
-- Pacientes de Urgencias
(1, 1, 3, '2025-10-22 12:30:00'), -- Jeringas 5ml
(1, 3, 3, '2025-10-22 12:30:00'), -- Agujas 21G
(1, 5, 2, '2025-10-22 12:30:00'), -- Guantes M
(2, 7, 5, '2025-11-01 09:00:00'), -- Gasas estériles
(2, 8, 2, '2025-11-01 09:00:00'), -- Vendas elásticas

-- Pacientes UCI
(30, 9, 2, '2025-10-30 20:30:00'), -- Catéter IV 18G
(30, 11, 4, '2025-10-30 20:30:00'), -- Suero fisiológico
(30, 17, 2, '2025-10-30 20:30:00'), -- Equipos venoclisis
(31, 9, 1, '2025-11-01 03:00:00'), -- Catéter IV 18G
(31, 11, 6, '2025-11-01 03:00:00'), -- Suero fisiológico

-- Pacientes Pediatría
(5, 1, 2, '2025-10-28 10:30:00'), -- Jeringas 5ml
(5, 4, 2, '2025-10-28 10:30:00'), -- Agujas 23G (calibre menor para niños)
(6, 10, 1, '2025-10-29 15:00:00'), -- Catéter 20G
(6, 12, 2, '2025-10-29 15:00:00'); -- Suero glucosado

-- =====================================
-- 13. ASIGNACIÓN DE MEDICAMENTOS A PACIENTES
-- =====================================
INSERT INTO paciente_medicamento ("pacienteId", "medicamentoId", "cantidadAsignada", dosis, frecuencia, "viaAdministracion", "asignadoEn") VALUES
-- Daniel (PAC001) - Dolor abdominal
(1, 1, 6, '500mg', 'Cada 8 horas', 'Oral', '2025-10-22 12:30:00'),
(1, 4, 6, '20mg', 'Cada 12 horas', 'Oral', '2025-10-22 12:30:00'),

-- Roberto (PAC010) - Post-infarto
(10, 15, 30, '5mg', 'Una vez al día', 'Oral', '2025-10-25 08:00:00'),
(10, 7, 30, '20mg', 'Una vez al día', 'Oral', '2025-10-25 08:00:00'),
(10, 6, 60, '50mg', 'Cada 12 horas', 'Oral', '2025-10-25 08:00:00'),

-- Sofía (PAC005) - Pediatría
(5, 1, 20, '250mg', 'Cada 6 horas', 'Oral', '2025-10-28 10:30:00'),
(5, 3, 18, '250mg', 'Cada 8 horas', 'Oral', '2025-10-28 10:30:00'),

-- Sergio (PAC030) - UCI
(30, 3, 9, '1g', 'Cada 8 horas', 'IV', '2025-10-30 20:30:00'),
(30, 12, 5, '10mg', 'Según necesidad', 'IV', '2025-10-30 20:30:00'),

-- Ricardo (PAC026) - Diabetes descompensada
(26, 5, 60, '850mg', 'Cada 12 horas', 'Oral', '2025-10-29 11:00:00'),
(26, 11, 30, '20 UI', 'Una vez al día', 'Subcutánea', '2025-10-29 11:00:00');

-- =====================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================
SELECT 'Hospitales' as tabla, COUNT(*) as total FROM hospital
UNION ALL
SELECT 'Turnos' as tabla, COUNT(*) as total FROM turno
UNION ALL
SELECT 'Servicios' as tabla, COUNT(*) as total FROM servicio
UNION ALL
SELECT 'Enfermeros' as tabla, COUNT(*) as total FROM enfermero
UNION ALL
SELECT 'Pacientes' as tabla, COUNT(*) as total FROM paciente
UNION ALL
SELECT 'Capacitaciones' as tabla, COUNT(*) as total FROM capacitacion
UNION ALL
SELECT 'Enfermero-Capacitacion' as tabla, COUNT(*) as total FROM enfermero_capacitacion
UNION ALL
SELECT 'Medicamentos' as tabla, COUNT(*) as total FROM medicamentos
UNION ALL
SELECT 'Insumos' as tabla, COUNT(*) as total FROM insumo
UNION ALL
SELECT 'Inventario-Medicamentos' as tabla, COUNT(*) as total FROM inventariomedicamentos
UNION ALL
SELECT 'Registro-Medico' as tabla, COUNT(*) as total FROM registromedico
UNION ALL
SELECT 'Paciente-Insumo' as tabla, COUNT(*) as total FROM paciente_insumo
UNION ALL
SELECT 'Paciente-Medicamento' as tabla, COUNT(*) as total FROM paciente_medicamento;