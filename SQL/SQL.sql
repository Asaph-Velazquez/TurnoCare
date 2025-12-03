-- EJECUTAR ESTE ARCHIVO PRIMERO (crea/actualiza el esquema)
-- Luego ejecuta Insert.sql para cargar datos

-- Tabla Hospital
CREATE TABLE IF NOT EXISTS Hospital (
    hospitalId SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    telefono VARCHAR(20)
);

-- Tabla Servicio
CREATE TABLE IF NOT EXISTS Servicio(
    servicioId SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    capacidadMaxima INTEGER,
    personalAsignado INTEGER DEFAULT 0,
    hospitalId INTEGER NOT NULL,
    CONSTRAINT fk_servicio_hospital FOREIGN KEY (hospitalId) 
        REFERENCES Hospital(hospitalId) ON DELETE CASCADE
);

-- Tabla Urgencias
CREATE TABLE IF NOT EXISTS Urgencias(
    urgenciaId SERIAL PRIMARY KEY,
    nivelTriaje VARCHAR(50),
    tiempoEsperaPromedio INTEGER,
    servicioId INTEGER NOT NULL UNIQUE,
    CONSTRAINT fk_urgencias_servicio FOREIGN KEY (servicioId) 
        REFERENCES Servicio(servicioId) ON DELETE CASCADE
);

-- Tabla Turno
CREATE TABLE IF NOT EXISTS Turno(
    turnoId SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    horaInicio TIME NOT NULL,
    horaFin TIME NOT NULL,
    fecha DATE
);

-- Tabla Enfermero
CREATE TABLE IF NOT EXISTS Enfermero(
    enfermeroId SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,            
    apellidoPaterno VARCHAR(100) NOT NULL,
    apellidoMaterno VARCHAR(100) NOT NULL,
    numeroEmpleado VARCHAR(20) UNIQUE NOT NULL,
    especialidad VARCHAR(100),
    esCoordinador BOOLEAN DEFAULT FALSE,
    turnoAsignadoId INTEGER,
    servicioActualId INTEGER,
    
    CONSTRAINT fk_enfermero_turno FOREIGN KEY (turnoAsignadoId) 
        REFERENCES Turno(turnoId) ON DELETE SET NULL,
    CONSTRAINT fk_enfermero_servicio FOREIGN KEY (servicioActualId) 
        REFERENCES Servicio(servicioId) ON DELETE SET NULL
);

-- Tabla Paciente
CREATE TABLE IF NOT EXISTS Paciente(
    pacienteId SERIAL PRIMARY KEY,
    apellido VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    numeroExpediente VARCHAR(20) UNIQUE NOT NULL,
    edad INTEGER,
    numeroCama VARCHAR(10),
    numeroHabitacion VARCHAR(10),
    fechaIngreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivoConsulta TEXT,
    servicioId INTEGER,
    CONSTRAINT fk_paciente_servicio FOREIGN KEY (servicioId) 
        REFERENCES Servicio(servicioId) ON DELETE SET NULL
);

-- Tabla RegistroMedico
CREATE TABLE IF NOT EXISTS RegistroMedico(
    registroId SERIAL PRIMARY KEY,
    pacienteId INTEGER NOT NULL,
    enfermeroId INTEGER NOT NULL,
    fechaHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    signosVitales JSONB,
    observaciones TEXT,
    CONSTRAINT fk_registro_paciente FOREIGN KEY (pacienteId) 
        REFERENCES Paciente(pacienteId) ON DELETE CASCADE,
    CONSTRAINT fk_registro_enfermero FOREIGN KEY (enfermeroId) 
        REFERENCES Enfermero(enfermeroId) ON DELETE RESTRICT
);

-- Tabla Medicamentos
CREATE TABLE IF NOT EXISTS Medicamentos (
    medicamentoId SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    dosis VARCHAR(50),
    viaAdministracion VARCHAR(50),
    frecuencia VARCHAR(50),
    fechaHoraAdministracion TIMESTAMP,
    enfermeroResponsable INTEGER NOT NULL,
    pacienteId INTEGER,
    CONSTRAINT fk_medicamento_enfermero FOREIGN KEY (enfermeroResponsable) 
        REFERENCES Enfermero(enfermeroId) ON DELETE RESTRICT,
    CONSTRAINT fk_medicamento_paciente FOREIGN KEY (pacienteId)
        REFERENCES Paciente(pacienteId) ON DELETE CASCADE
);

-- Tabla InventarioMedicamentos
CREATE TABLE IF NOT EXISTS InventarioMedicamentos(
    inventarioId SERIAL PRIMARY KEY,
    medicamentosDisponibles JSONB NOT NULL,
    ubicacionAlmacen TEXT,
    responsableId INTEGER NOT NULL,
    CONSTRAINT fk_inventario_responsable FOREIGN KEY (responsableId) 
        REFERENCES Enfermero(enfermeroId) ON DELETE RESTRICT
);

-- Tabla Capacitacion
CREATE TABLE IF NOT EXISTS Capacitacion(
    capacitacionId SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fechaImparticion TIMESTAMP,
    duracion INTEGER,
    instructor VARCHAR(100)
);

-- Tabla intermedia: Enfermero_Capacitacion (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS Enfermero_Capacitacion(
    enfermeroId INTEGER NOT NULL,
    capacitacionId INTEGER NOT NULL,
    asistio BOOLEAN DEFAULT FALSE,
    fechaInscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (enfermeroId, capacitacionId),

    CONSTRAINT fk_ec_enfermero FOREIGN KEY (enfermeroId) 
        REFERENCES Enfermero(enfermeroId) ON DELETE CASCADE,
    CONSTRAINT fk_ec_capacitacion FOREIGN KEY (capacitacionId) 
        REFERENCES Capacitacion(capacitacionId) ON DELETE CASCADE
);

-- Tabla Insumo (aseguramos su creación antes de paciente_insumo)
CREATE TABLE IF NOT EXISTS Insumo (
    insumoId SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    categoria VARCHAR(100),
    cantidadDisponible INTEGER DEFAULT 0,
    unidadMedida VARCHAR(50),
    ubicacion VARCHAR(120),
    responsableId INTEGER,
    actualizadoEn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_insumo_responsable FOREIGN KEY (responsableId)
        REFERENCES Enfermero(enfermeroId) ON DELETE SET NULL
);

-- Modificaciones en desarrollo (idempotentes)
ALTER TABLE Paciente DROP COLUMN IF EXISTS apellido;
ALTER TABLE Paciente ADD COLUMN IF NOT EXISTS apellidop varchar(50);
ALTER TABLE Paciente ADD COLUMN IF NOT EXISTS apellidom varchar(100);

--modificaciones de enfermero
ALTER TABLE enfermero ADD COLUMN IF NOT EXISTS habitacionAsignada varchar(100);

-- modificaciones de medicamentos para asociar a paciente
ALTER TABLE medicamentos ADD COLUMN IF NOT EXISTS pacienteId integer;
ALTER TABLE medicamentos ADD CONSTRAINT fk_medicamento_paciente FOREIGN KEY (pacienteId)
    REFERENCES paciente(pacienteId) ON DELETE CASCADE;