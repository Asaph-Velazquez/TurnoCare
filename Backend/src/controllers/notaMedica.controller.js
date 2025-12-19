const { prisma } = require("../db");

const { buildMedicalNotePDF } = require("../libs/pdfKit");

//generacion de notamedica
const generateMedicalNote = async (req, resp) => {
    
    const {
        pacienteId,
        enfermeroId,
        observaciones,
        medicamentos,
        insumos,
        // Campos adicionales opcionales para el PDF
        nombrePaciente,
        nombreEnfermeroAlta,
        nombreEnfermeroAsignado,
        servicio,
        nombreHospital,
        habitacion,
        cama
    } = req.body;

    // Validar campos requeridos - signosVitales es opcional
    if (!pacienteId || !enfermeroId || !observaciones) {
        return resp.status(400).json({ 
            success: false, 
            error: 'Faltan campos requeridos (pacienteId, enfermeroId, observaciones)',
            detalles: {
                pacienteId: !!pacienteId,
                enfermeroId: !!enfermeroId,
                observaciones: !!observaciones
            }
        });
    }

    // Convertir IDs a números
    const pacienteIdNum = parseInt(pacienteId);
    const enfermeroIdNum = parseInt(enfermeroId);

    if (isNaN(pacienteIdNum) || isNaN(enfermeroIdNum)) {
        return resp.status(400).json({ 
            success: false, 
            error: 'IDs inválidos',
            detalles: {
                pacienteId: { original: pacienteId, convertido: pacienteIdNum },
                enfermeroId: { original: enfermeroId, convertido: enfermeroIdNum }
            }
        });
    }

    //comprobar que el paciente existe
    let paciente;
    try {
        paciente = await prisma.paciente.findUnique({
            where: { pacienteId: pacienteIdNum }
        });
    } catch (err) {
        return resp.status(500).json({ success: false, error: 'Error del servidor al buscar paciente' });
    }

    if (!paciente) {
        return resp.status(404).json({ success: false, error: `Paciente con ID ${pacienteIdNum} no encontrado` });
    }

    //comprobar que el enfermero existe
    let enfermero;
    try {
        enfermero = await prisma.enfermero.findUnique({
            where: { enfermeroId: enfermeroIdNum }
        });
    } catch (err) {
        return resp.status(500).json({ success: false, error: 'Error del servidor al buscar enfermero' });
    }

    if (!enfermero) {
        return resp.status(404).json({ success: false, error: `Enfermero con ID ${enfermeroIdNum} no encontrado` });
    }

    try {
        // Crear el registro médico
        const registroMedico = await prisma.registroMedico.create({
            data: {
                pacienteId: pacienteIdNum,
                enfermeroId: enfermeroIdNum,
                observaciones,
                signosVitales: req.body.signosVitales || {}, // Opcional, usar objeto vacío si no se proporciona
                fechaHora: new Date(),
            }
        });


        // Si se enviaron medicamentos, asignarlos al paciente
        if (medicamentos && Array.isArray(medicamentos) && medicamentos.length > 0) {
            for (const med of medicamentos) {
                
                // Buscar el medicamento existente en el inventario
                const medicamentoExistente = await prisma.medicamento.findFirst({
                    where: { nombre: med.nombre }
                });

                if (medicamentoExistente) {
                    
                    // Crear o actualizar la asignación en PacienteMedicamento
                    const asignacion = await prisma.pacienteMedicamento.upsert({
                        where: {
                            pacienteId_medicamentoId: {
                                pacienteId: pacienteIdNum,
                                medicamentoId: medicamentoExistente.medicamentoId
                            }
                        },
                        update: {
                            cantidadAsignada: parseInt(med.cantidad) || 1,
                            dosis: med.dosis || null,
                            frecuencia: med.frecuencia || null,
                            asignadoEn: new Date()
                        },
                        create: {
                            pacienteId: pacienteIdNum,
                            medicamentoId: medicamentoExistente.medicamentoId,
                            cantidadAsignada: parseInt(med.cantidad) || 1,
                            dosis: med.dosis || null,
                            frecuencia: med.frecuencia || null
                        }
                    });
                } else {
                }
            }
        }

        // Si se enviaron insumos, asignarlos al paciente
        if (insumos && Array.isArray(insumos) && insumos.length > 0) {
            for (const ins of insumos) {
                
                // Buscar el insumo existente en el inventario
                const insumoExistente = await prisma.insumo.findFirst({
                    where: { nombre: ins.nombre }
                });

                if (insumoExistente) {
                    
                    // Crear o actualizar la asignación en PacienteInsumo
                    const asignacion = await prisma.pacienteInsumo.upsert({
                        where: {
                            pacienteId_insumoId: {
                                pacienteId: pacienteIdNum,
                                insumoId: insumoExistente.insumoId
                            }
                        },
                        update: {
                            cantidad: parseInt(ins.cantidad) || 1,
                            asignadoEn: new Date()
                        },
                        create: {
                            pacienteId: pacienteIdNum,
                            insumoId: insumoExistente.insumoId,
                            cantidad: parseInt(ins.cantidad) || 1
                        }
                    });
                } else {
                }
            }
        }

        resp.json({ 
            success: true, 
            message: 'Nota médica generada exitosamente',
            data: {
                registroId: registroMedico.registroId,
                paciente: nombrePaciente || `${paciente.nombre} ${paciente.apellidop} ${paciente.apellidom}`,
                enfermero: nombreEnfermeroAsignado || `${enfermero.nombre} ${enfermero.apellidoPaterno}`,
                servicio,
                hospital: nombreHospital
            }
        });
    } catch (err) {
        return resp.status(500).json({ success: false, error: err.message, detalles: err.stack });
    }
};

// Obtener todas las notas médicas de un paciente
const getMedicalNotesByPaciente = async (req, resp) => {
    const { pacienteId } = req.params;

    try {
        const pacienteIdNum = parseInt(pacienteId);
        
        if (isNaN(pacienteIdNum)) {
            return resp.status(400).json({ 
                success: false, 
                error: 'ID de paciente inválido' 
            });
        }

        const notas = await prisma.registroMedico.findMany({
            where: { pacienteId: pacienteIdNum },
            include: {
                enfermero: {
                    select: {
                        nombre: true,
                        apellidoPaterno: true,
                        apellidoMaterno: true
                    }
                }
            },
            orderBy: { fechaHora: 'desc' }
        });

        resp.json({ success: true, data: notas });
    } catch (err) {
        resp.status(500).json({ success: false, error: err.message });
    }
};

const downloadMedicalNotePDF = async (req, resp) => {
    const { registroId } = req.params;

    try {
        
        const nota = await prisma.registroMedico.findUnique({
            where: { registroId: parseInt(registroId) },
            include: {
                paciente: {
                    include: {
                        medicamentosAsignados: {
                            include: {
                                medicamento: true
                            }
                        },
                        insumosAsignados: {
                            include: {
                                insumo: true
                            }
                        }
                    }
                },
                enfermero: {
                    include: {
                        turno: true,
                        servicio: true
                    }
                }
            }
        });


        if (!nota) {
            return resp.status(404).json({ success: false, error: "Nota médica no encontrada" });
        }


        resp.setHeader("Content-Type", "application/pdf");
        resp.setHeader(
            "Content-Disposition",
            `attachment; filename=nota_medica_${registroId}.pdf`
        );

        // Crear PDF → EN STREAMING
        buildMedicalNotePDF(
            nota,
            chunk => resp.write(chunk),
            () => {
                resp.end();
            }
        );

    } catch (err) {
        resp.status(500).json({ success: false, error: err.message });
    }
};


module.exports = {
    generateMedicalNote,
    getMedicalNotesByPaciente,
    downloadMedicalNotePDF
};

