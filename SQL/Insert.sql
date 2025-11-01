-- =====================================
-- INSERTS PARA POBLAR LA BASE DE DATOS TURNO CARE
-- =====================================

-- Insertar Hospitales
INSERT INTO hospital ("hospitalId", nombre, direccion, telefono) VALUES
(1, 'Hospital General San José', 'Av. Principal 123, Ciudad de México', '+52-55-1234-5678'),
(2, 'Clínica Santa María', 'Calle Reforma 456, Guadalajara', '+52-33-2345-6789'),
(3, 'Hospital Universitario Central', 'Blvd. Universidad 789, Monterrey', '+52-81-3456-7890'),
(4, 'Centro Médico Nacional', 'Zona Rosa 321, Ciudad de México', '+52-55-4567-8901');

-- Insertar Turnos
INSERT INTO turno ("turnoId", nombre, "horaInicio", "horaFin", fecha) VALUES
(1, 'Matutino', '08:00:00', '19:00:00', '2025-10-08'),
(2, 'Nocturno', '19:00:00', '08:00:00', '2025-10-08'),
(3, 'Vespertino', '14:00:00', '22:00:00', '2025-10-08'),
(4, 'Madrugada', '22:00:00', '06:00:00', '2025-10-08');

-- Insertar Servicios (usando los hospitalId correctos)
INSERT INTO servicio ("servicioId", nombre, descripcion, "capacidadMaxima", "personalAsignado", "hospitalId") VALUES
(1, 'Urgencias', 'Servicio de emergencias médicas 24/7', 50, 5, 1),
(2, 'Pediatría', 'Atención médica especializada para niños', 30, 4, 1),
(3, 'Cardiología', 'Tratamiento de enfermedades cardiovasculares', 25, 3, 1),
(4, 'Neurología', 'Diagnóstico y tratamiento de trastornos neurológicos', 20, 3, 2),
(5, 'Ginecología', 'Atención médica para la salud femenina', 35, 3, 2),
(6, 'Traumatología', 'Tratamiento de lesiones y fracturas', 40, 4, 3),
(7, 'Medicina Interna', 'Atención médica general para adultos', 45, 4, 3),
(8, 'UCI', 'Unidad de Cuidados Intensivos', 15, 4, 4),
(9, 'Oncología', 'Tratamiento de cáncer y tumores', 20, 3, 4),
(10, 'Psiquiatría', 'Salud mental y trastornos psiquiátricos', 25, 3, 1);

-- Insertar Enfermeros
INSERT INTO enfermero (nombre, "apellidoPaterno", "apellidoMaterno", "numeroEmpleado", especialidad, "esCoordinador", "turnoAsignadoId", "servicioActualId", "habitacionAsignada") VALUES
-- Coordinadores
('Ana', 'García', 'Martínez', 'ENF001', 'Coordinación General', TRUE, 1, 1, NULL),
('Carlos', 'López', 'Hernández', 'ENF002', 'Coordinación UCI', TRUE, 2, 8, NULL),
('María Elena', 'Rodríguez', 'Silva', 'ENF003', 'Coordinación Pediatría', TRUE, 1, 2, NULL),


('Luis', 'Pérez', 'González', 'ENF004', 'Urgencias', FALSE, 1, 1, '101'),
('Carmen', 'Martínez', 'López', 'ENF005', 'Urgencias', FALSE, 2, 1, '102'),
('Roberto', 'Sánchez', 'Ruiz', 'ENF006', 'Urgencias', FALSE, 3, 1, '103'),
('Patricia', 'Torres', 'Mendoza', 'ENF007', 'Urgencias', FALSE, 1, 1, '104'),
('Jorge', 'Ramírez', 'Castro', 'ENF008', 'Urgencias', FALSE, 2, 1, '105'),


('Lucía', 'Morales', 'Vega', 'ENF009', 'Pediatría', FALSE, 1, 2, '201'),
('Manuel', 'Jiménez', 'Flores', 'ENF010', 'Pediatría', FALSE, 2, 2, '202'),
('Diana', 'Vargas', 'Ochoa', 'ENF011', 'Pediatría', FALSE, 3, 2, '203'),
('Fernando', 'Castillo', 'Romero', 'ENF012', 'Pediatría', FALSE, 1, 2, '204'),


('Sofía', 'Herrera', 'Delgado', 'ENF013', 'Cardiología', FALSE, 1, 3, '301'),
('Miguel', 'Aguilar', 'Santos', 'ENF014', 'Cardiología', FALSE, 2, 3, '302'),
('Alejandra', 'Cruz', 'Moreno', 'ENF015', 'Cardiología', FALSE, 3, 3, '303'),


('Antonio', 'Reyes', 'Guerrero', 'ENF016', 'Neurología', FALSE, 1, 4, '401'),
('Gabriela', 'Mendoza', 'Ríos', 'ENF017', 'Neurología', FALSE, 2, 4, '402'),
('Raúl', 'Ortega', 'Campos', 'ENF018', 'Neurología', FALSE, 3, 4, '403'),


('Isabel', 'Valencia', 'Herrera', 'ENF019', 'Ginecología', FALSE, 1, 5, '501'),
('Alberto', 'Gutiérrez', 'Peña', 'ENF020', 'Ginecología', FALSE, 2, 5, '502'),
('Claudia', 'Ruiz', 'Montoya', 'ENF021', 'Ginecología', FALSE, 3, 5, '503'),


('Eduardo', 'Silva', 'Navarro', 'ENF022', 'Traumatología', FALSE, 1, 6, '601'),
('Verónica', 'Ramos', 'Aguilera', 'ENF023', 'Traumatología', FALSE, 2, 6, '602'),
('Osvaldo', 'Medina', 'Torres', 'ENF024', 'Traumatología', FALSE, 3, 6, '603'),
('Mónica', 'Campos', 'Villareal', 'ENF025', 'Traumatología', FALSE, 1, 6, '604'),


('Ricardo', 'León', 'Espinoza', 'ENF026', 'Medicina Interna', FALSE, 1, 7, '701'),
('Natalia', 'Paredes', 'Álvarez', 'ENF027', 'Medicina Interna', FALSE, 2, 7, '702'),
('Humberto', 'Vázquez', 'Jiménez', 'ENF028', 'Medicina Interna', FALSE, 3, 7, '703'),
('Adriana', 'Domínguez', 'Luna', 'ENF029', 'Medicina Interna', FALSE, 1, 7, '704'),


('Sergio', 'Contreras', 'Soto', 'ENF030', 'Cuidados Intensivos', FALSE, 1, 8, '801'),
('Leticia', 'Moreno', 'Cabrera', 'ENF031', 'Cuidados Intensivos', FALSE, 2, 8, '802'),
('Arturo', 'Sandoval', 'Prieto', 'ENF032', 'Cuidados Intensivos', FALSE, 3, 8, '803'),
('Rosa', 'Guerrero', 'Valdez', 'ENF033', 'Cuidados Intensivos', FALSE, 4, 8, '804'),


('Felipe', 'Acosta', 'Mendoza', 'ENF034', 'Oncología', FALSE, 1, 9, '901'),
('Beatriz', 'Figueroa', 'Ramos', 'ENF035', 'Oncología', FALSE, 2, 9, '902'),
('Ignacio', 'Cervantes', 'Rivas', 'ENF036', 'Oncología', FALSE, 3, 9, '903'),


('Esperanza', 'Maldonado', 'Cruz', 'ENF037', 'Psiquiatría', FALSE, 1, 10, '1001'),
('Rodrigo', 'Esquivel', 'Morales', 'ENF038', 'Psiquiatría', FALSE, 2, 10, '1002'),
('Mariana', 'Ibarra', 'Solís', 'ENF039', 'Psiquiatría', FALSE, 3, 10, '1003'),

-- Enfermeros flotantes (sin servicio asignado específico)
('David', 'Galván', 'Cortés', 'ENF040', 'Enfermería General', FALSE, 1, NULL, NULL),
('Paola', 'Rojas', 'Núñez', 'ENF041', 'Enfermería General', FALSE, 2, NULL, NULL),
('Emilio', 'Salinas', 'Vargas', 'ENF042', 'Enfermería General', FALSE, 3, NULL, NULL),
('Lidia', 'Quintero', 'Chávez', 'ENF043', 'Enfermería General', FALSE, 1, NULL, NULL),
('Tomás', 'Velázquez', 'Herrera', 'ENF044', 'Enfermería General', FALSE, 2, NULL, NULL),
('Silvia', 'Pacheco', 'Díaz', 'ENF045', 'Enfermería General', FALSE, 3, NULL, NULL);

-- Insertar registros en Urgencias para servicios que lo requieren
INSERT INTO urgencias ("nivelTriaje", "tiempoEsperaPromedio", "servicioId") VALUES
('Crítico', 5, 1); -- Solo Urgencias tiene TRIAJE

-- Insertar Capacitaciones
INSERT INTO capacitacion (titulo, descripcion, "fechaImparticion", duracion, instructor) VALUES
('RCP Básico', 'Reanimación cardiopulmonar básica para personal de enfermería', '2025-10-15 09:00:00', 240, 'Dr. Fernando Castillo'),
('Manejo de Urgencias Pediátricas', 'Protocolos de atención en emergencias infantiles', '2025-10-20 14:00:00', 360, 'Dra. Carmen Vega'),
('Administración Segura de Medicamentos', 'Prevención de errores en medicación', '2025-10-25 10:00:00', 180, 'Lic. Patricia Morales'),
('Cuidados Intensivos Avanzados', 'Técnicas especializadas en UCI', '2025-11-01 08:00:00', 480, 'Dr. Luis García'),
('Protocolo de Bioseguridad', 'Medidas de seguridad y control de infecciones', '2025-11-05 16:00:00', 120, 'Lic. Ana Rodríguez');

-- Asignar algunas capacitaciones a enfermeros
INSERT INTO enfermero_capacitacion ("enfermeroId", "capacitacionId", asistio) VALUES
(1, 1, TRUE), (1, 3, TRUE), (1, 5, FALSE),
(2, 1, TRUE), (2, 4, TRUE),
(3, 1, TRUE), (3, 2, TRUE), (3, 5, TRUE),
(4, 1, TRUE), (4, 5, TRUE),
(5, 1, TRUE), (5, 5, FALSE),
(9, 2, TRUE), (9, 5, TRUE),
(10, 2, TRUE), (10, 5, TRUE),
(30, 4, TRUE), (30, 1, TRUE),
(31, 4, TRUE), (31, 1, TRUE),
(34, 3, TRUE), (34, 1, FALSE),
(37, 5, TRUE), (37, 1, TRUE);

-- =====================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================

-- Verificar que todos los datos se insertaron correctamente
SELECT 'Hospitales' as tabla, COUNT(*) as total FROM hospital
UNION ALL
SELECT 'Servicios' as tabla, COUNT(*) as total FROM servicio
UNION ALL
SELECT 'Turnos' as tabla, COUNT(*) as total FROM turno
UNION ALL
SELECT 'Enfermeros' as tabla, COUNT(*) as total FROM enfermero
UNION ALL
SELECT 'Urgencias' as tabla, COUNT(*) as total FROM urgencias
UNION ALL
SELECT 'Capacitaciones' as tabla, COUNT(*) as total FROM capacitacion
UNION ALL
SELECT 'Asignaciones Capacitación' as tabla, COUNT(*) as total FROM enfermero_capacitacion;