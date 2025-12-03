-- CreateTable
CREATE TABLE "hospital" (
    "hospitalId" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "direccion" VARCHAR(150),
    "telefono" VARCHAR(20),

    CONSTRAINT "hospital_pkey" PRIMARY KEY ("hospitalId")
);

-- CreateTable
CREATE TABLE "servicio" (
    "servicioId" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "capacidadMaxima" INTEGER,
    "personalAsignado" INTEGER NOT NULL DEFAULT 0,
    "hospitalId" INTEGER NOT NULL,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("servicioId")
);

-- CreateTable
CREATE TABLE "urgencias" (
    "urgenciaId" SERIAL NOT NULL,
    "nivelTriaje" VARCHAR(50),
    "tiempoEsperaPromedio" INTEGER,
    "servicioId" INTEGER NOT NULL,

    CONSTRAINT "urgencias_pkey" PRIMARY KEY ("urgenciaId")
);

-- CreateTable
CREATE TABLE "turno" (
    "turnoId" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "horaInicio" TIME NOT NULL,
    "horaFin" TIME NOT NULL,

    CONSTRAINT "turno_pkey" PRIMARY KEY ("turnoId")
);

-- CreateTable
CREATE TABLE "enfermero" (
    "enfermeroId" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellidoPaterno" VARCHAR(100) NOT NULL,
    "apellidoMaterno" VARCHAR(100) NOT NULL,
    "numeroEmpleado" VARCHAR(20) NOT NULL,
    "especialidad" VARCHAR(100),
    "esCoordinador" BOOLEAN NOT NULL DEFAULT false,
    "habitacionAsignada" VARCHAR(100),
    "habitacionesAsignadas" VARCHAR(255),
    "turnoAsignadoId" INTEGER,
    "servicioActualId" INTEGER,

    CONSTRAINT "enfermero_pkey" PRIMARY KEY ("enfermeroId")
);

-- CreateTable
CREATE TABLE "paciente" (
    "pacienteId" SERIAL NOT NULL,
    "apellidop" VARCHAR(50) NOT NULL,
    "apellidom" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "numeroExpediente" VARCHAR(20) NOT NULL,
    "edad" INTEGER,
    "numeroCama" VARCHAR(10),
    "numeroHabitacion" VARCHAR(10),
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivoConsulta" TEXT,
    "servicioId" INTEGER,

    CONSTRAINT "paciente_pkey" PRIMARY KEY ("pacienteId")
);

-- CreateTable
CREATE TABLE "registromedico" (
    "registroId" SERIAL NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "enfermeroId" INTEGER NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signosVitales" JSONB,
    "observaciones" TEXT,

    CONSTRAINT "registromedico_pkey" PRIMARY KEY ("registroId")
);

-- CreateTable
CREATE TABLE "medicamentos" (
    "medicamentoId" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "cantidadStock" INTEGER NOT NULL DEFAULT 0,
    "lote" VARCHAR(50),
    "fechaCaducidad" TIMESTAMP(3),
    "ubicacion" VARCHAR(100),
    "actualizadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registroMedicoId" INTEGER,

    CONSTRAINT "medicamentos_pkey" PRIMARY KEY ("medicamentoId")
);

-- CreateTable
CREATE TABLE "paciente_insumo" (
    "pacienteInsumoId" SERIAL NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "insumoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "asignadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paciente_insumo_pkey" PRIMARY KEY ("pacienteInsumoId")
);

-- CreateTable
CREATE TABLE "paciente_medicamento" (
    "pacienteMedicamentoId" SERIAL NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "medicamentoId" INTEGER NOT NULL,
    "cantidadAsignada" INTEGER NOT NULL,
    "dosis" TEXT,
    "frecuencia" TEXT,
    "viaAdministracion" TEXT,
    "asignadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paciente_medicamento_pkey" PRIMARY KEY ("pacienteMedicamentoId")
);

-- CreateTable
CREATE TABLE "inventariomedicamentos" (
    "inventarioId" SERIAL NOT NULL,
    "medicamentosDisponibles" JSONB NOT NULL,
    "ubicacionAlmacen" TEXT,
    "responsableId" INTEGER NOT NULL,

    CONSTRAINT "inventariomedicamentos_pkey" PRIMARY KEY ("inventarioId")
);

-- CreateTable
CREATE TABLE "insumo" (
    "insumoId" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "categoria" VARCHAR(100),
    "cantidadDisponible" INTEGER NOT NULL DEFAULT 0,
    "unidadMedida" VARCHAR(50),
    "ubicacion" VARCHAR(120),
    "responsableId" INTEGER,
    "actualizadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insumo_pkey" PRIMARY KEY ("insumoId")
);

-- CreateTable
CREATE TABLE "capacitacion" (
    "capacitacionId" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "fechaImparticion" TIMESTAMP(3),
    "duracion" INTEGER,
    "instructor" VARCHAR(100),

    CONSTRAINT "capacitacion_pkey" PRIMARY KEY ("capacitacionId")
);

-- CreateTable
CREATE TABLE "enfermero_capacitacion" (
    "enfermeroId" INTEGER NOT NULL,
    "capacitacionId" INTEGER NOT NULL,
    "asistio" BOOLEAN NOT NULL DEFAULT false,
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enfermero_capacitacion_pkey" PRIMARY KEY ("enfermeroId","capacitacionId")
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

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospital"("hospitalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urgencias" ADD CONSTRAINT "urgencias_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicio"("servicioId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enfermero" ADD CONSTRAINT "enfermero_turnoAsignadoId_fkey" FOREIGN KEY ("turnoAsignadoId") REFERENCES "turno"("turnoId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enfermero" ADD CONSTRAINT "enfermero_servicioActualId_fkey" FOREIGN KEY ("servicioActualId") REFERENCES "servicio"("servicioId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paciente" ADD CONSTRAINT "paciente_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicio"("servicioId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registromedico" ADD CONSTRAINT "registromedico_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("pacienteId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registromedico" ADD CONSTRAINT "registromedico_enfermeroId_fkey" FOREIGN KEY ("enfermeroId") REFERENCES "enfermero"("enfermeroId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicamentos" ADD CONSTRAINT "medicamentos_registroMedicoId_fkey" FOREIGN KEY ("registroMedicoId") REFERENCES "registromedico"("registroId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paciente_insumo" ADD CONSTRAINT "paciente_insumo_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("pacienteId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paciente_insumo" ADD CONSTRAINT "paciente_insumo_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "insumo"("insumoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paciente_medicamento" ADD CONSTRAINT "paciente_medicamento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("pacienteId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paciente_medicamento" ADD CONSTRAINT "paciente_medicamento_medicamentoId_fkey" FOREIGN KEY ("medicamentoId") REFERENCES "medicamentos"("medicamentoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventariomedicamentos" ADD CONSTRAINT "inventariomedicamentos_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "enfermero"("enfermeroId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insumo" ADD CONSTRAINT "insumo_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "enfermero"("enfermeroId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enfermero_capacitacion" ADD CONSTRAINT "enfermero_capacitacion_enfermeroId_fkey" FOREIGN KEY ("enfermeroId") REFERENCES "enfermero"("enfermeroId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enfermero_capacitacion" ADD CONSTRAINT "enfermero_capacitacion_capacitacionId_fkey" FOREIGN KEY ("capacitacionId") REFERENCES "capacitacion"("capacitacionId") ON DELETE CASCADE ON UPDATE CASCADE;
