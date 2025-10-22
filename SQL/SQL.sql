-- Tabla Hospital
CREATE TABLE Hospital (
    hospitalId SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    telefono VARCHAR(20)
);

-- Tabla Servicio
CREATE TABLE Servicio(
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
CREATE TABLE Urgencias(
    urgenciaId SERIAL PRIMARY KEY,
    nivelTriaje VARCHAR(50),
    tiempoEsperaPromedio INTEGER,
    servicioId INTEGER NOT NULL UNIQUE,
    CONSTRAINT fk_urgencias_servicio FOREIGN KEY (servicioId) 
        REFERENCES Servicio(servicioId) ON DELETE CASCADE
);

-- Tabla Turno
CREATE TABLE Turno(
    turnoId SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    horaInicio TIME NOT NULL,
    horaFin TIME NOT NULL,
    fecha DATE
);

-- Tabla Enfermero
CREATE TABLE Enfermero(
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
CREATE TABLE Paciente(
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
CREATE TABLE RegistroMedico(
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
CREATE TABLE Medicamentos (
    medicamentoId SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    dosis VARCHAR(50),
    viaAdministracion VARCHAR(50),
    frecuencia VARCHAR(50),
    fechaHoraAdministracion TIMESTAMP,
    registroMedicoId INTEGER NOT NULL,
    enfermeroResponsable INTEGER NOT NULL,
    CONSTRAINT fk_medicamento_registro FOREIGN KEY (registroMedicoId) 
        REFERENCES RegistroMedico(registroId) ON DELETE CASCADE,
    CONSTRAINT fk_medicamento_enfermero FOREIGN KEY (enfermeroResponsable) 
        REFERENCES Enfermero(enfermeroId) ON DELETE RESTRICT
);

-- Tabla InventarioMedicamentos
CREATE TABLE InventarioMedicamentos(
    inventarioId SERIAL PRIMARY KEY,
    medicamentosDisponibles JSONB NOT NULL,
    ubicacionAlmacen TEXT,
    responsableId INTEGER NOT NULL,
    CONSTRAINT fk_inventario_responsable FOREIGN KEY (responsableId) 
        REFERENCES Enfermero(enfermeroId) ON DELETE RESTRICT
);

-- Tabla Capacitacion
CREATE TABLE Capacitacion(
    capacitacionId SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fechaImparticion TIMESTAMP,
    duracion INTEGER,
    instructor VARCHAR(100)
);

-- Tabla intermedia: Enfermero_Capacitacion (relación muchos a muchos)
CREATE TABLE Enfermero_Capacitacion(
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


-- Modificaciones en el ritmo de desarrollo
alter table paciente drop column apellido;
alter table paciente add column apellidop varchar(50);
alter table paciente add column apellidom varchar(100); 