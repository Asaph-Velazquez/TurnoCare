-- CreateTable
CREATE TABLE "hospital" (
    "hospitalId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT
);

-- CreateTable
CREATE TABLE "servicio" (
    "servicioId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "capacidadMaxima" INTEGER,
    "personalAsignado" INTEGER NOT NULL DEFAULT 0,
    "hospitalId" INTEGER NOT NULL,
    CONSTRAINT "servicio_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospital" ("hospitalId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "urgencias" (
    "urgenciaId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nivelTriaje" TEXT,
    "tiempoEsperaPromedio" INTEGER,
    "servicioId" INTEGER NOT NULL,
    CONSTRAINT "urgencias_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicio" ("servicioId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "turno" (
    "turnoId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "horaInicio" DATETIME NOT NULL,
    "horaFin" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "enfermero" (
    "enfermeroId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellidoPaterno" TEXT NOT NULL,
    "apellidoMaterno" TEXT NOT NULL,
    "numeroEmpleado" TEXT NOT NULL,
    "especialidad" TEXT,
    "esCoordinador" BOOLEAN NOT NULL DEFAULT false,
    "habitacionAsignada" TEXT,
    "habitacionesAsignadas" TEXT,
    "turnoAsignadoId" INTEGER,
    "servicioActualId" INTEGER,
    CONSTRAINT "enfermero_turnoAsignadoId_fkey" FOREIGN KEY ("turnoAsignadoId") REFERENCES "turno" ("turnoId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "enfermero_servicioActualId_fkey" FOREIGN KEY ("servicioActualId") REFERENCES "servicio" ("servicioId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "paciente" (
    "pacienteId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apellidop" TEXT NOT NULL,
    "apellidom" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "numeroExpediente" TEXT NOT NULL,
    "edad" INTEGER,
    "numeroCama" TEXT,
    "numeroHabitacion" TEXT,
    "fechaIngreso" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivoConsulta" TEXT,
    "servicioId" INTEGER,
    CONSTRAINT "paciente_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicio" ("servicioId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "registromedico" (
    "registroId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "enfermeroId" INTEGER NOT NULL,
    "fechaHora" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signosVitales" JSONB,
    "observaciones" TEXT,
    CONSTRAINT "registromedico_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente" ("pacienteId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "registromedico_enfermeroId_fkey" FOREIGN KEY ("enfermeroId") REFERENCES "enfermero" ("enfermeroId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "medicamentos" (
    "medicamentoId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "cantidadStock" INTEGER NOT NULL DEFAULT 0,
    "lote" TEXT,
    "fechaCaducidad" DATETIME,
    "ubicacion" TEXT,
    "actualizadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registroMedicoId" INTEGER,
    CONSTRAINT "medicamentos_registroMedicoId_fkey" FOREIGN KEY ("registroMedicoId") REFERENCES "registromedico" ("registroId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "paciente_insumo" (
    "pacienteInsumoId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "insumoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "asignadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "paciente_insumo_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente" ("pacienteId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "paciente_insumo_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "insumo" ("insumoId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "paciente_medicamento" (
    "pacienteMedicamentoId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pacienteId" INTEGER NOT NULL,
    "medicamentoId" INTEGER NOT NULL,
    "cantidadAsignada" INTEGER NOT NULL,
    "dosis" TEXT,
    "frecuencia" TEXT,
    "viaAdministracion" TEXT,
    "asignadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "paciente_medicamento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente" ("pacienteId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "paciente_medicamento_medicamentoId_fkey" FOREIGN KEY ("medicamentoId") REFERENCES "medicamentos" ("medicamentoId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inventariomedicamentos" (
    "inventarioId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "medicamentosDisponibles" JSONB NOT NULL,
    "ubicacionAlmacen" TEXT,
    "responsableId" INTEGER NOT NULL,
    CONSTRAINT "inventariomedicamentos_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "enfermero" ("enfermeroId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "insumo" (
    "insumoId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoria" TEXT,
    "cantidadDisponible" INTEGER NOT NULL DEFAULT 0,
    "unidadMedida" TEXT,
    "ubicacion" TEXT,
    "responsableId" INTEGER,
    "actualizadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "insumo_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "enfermero" ("enfermeroId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "capacitacion" (
    "capacitacionId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaImparticion" DATETIME,
    "duracion" INTEGER,
    "instructor" TEXT
);

-- CreateTable
CREATE TABLE "enfermero_capacitacion" (
    "enfermeroId" INTEGER NOT NULL,
    "capacitacionId" INTEGER NOT NULL,
    "asistio" BOOLEAN NOT NULL DEFAULT false,
    "fechaInscripcion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("enfermeroId", "capacitacionId"),
    CONSTRAINT "enfermero_capacitacion_enfermeroId_fkey" FOREIGN KEY ("enfermeroId") REFERENCES "enfermero" ("enfermeroId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "enfermero_capacitacion_capacitacionId_fkey" FOREIGN KEY ("capacitacionId") REFERENCES "capacitacion" ("capacitacionId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "urgencias_servicioId_key" ON "urgencias"("servicioId");

-- CreateIndex
CREATE UNIQUE INDEX "enfermero_numeroEmpleado_key" ON "enfermero"("numeroEmpleado");

-- CreateIndex
CREATE UNIQUE INDEX "paciente_numeroExpediente_key" ON "paciente"("numeroExpediente");

-- CreateIndex
CREATE UNIQUE INDEX "paciente_insumo_pacienteId_insumoId_key" ON "paciente_insumo"("pacienteId", "insumoId");

-- CreateIndex
CREATE UNIQUE INDEX "paciente_medicamento_pacienteId_medicamentoId_key" ON "paciente_medicamento"("pacienteId", "medicamentoId");
