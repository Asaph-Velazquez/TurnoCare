const { prisma } = require("../dbPostgres");

const { buildMedicalNotePDF } = require("../libs/pdfKit");

//generacion de notamedica
const generateMedicalNote = async (req, resp) => {
    console.log('=== Datos recibidos en nota médica ===');
    console.log('Body completo:', JSON.stringify(req.body, null, 2));
    
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
        console.error('Campos faltantes:', { pacienteId, enfermeroId, observaciones: !!observaciones });
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
        console.error('IDs inválidos:', { pacienteId, enfermeroId, pacienteIdNum, enfermeroIdNum });
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
        console.error('Error buscando paciente:', err);
        return resp.status(500).json({ success: false, error: 'Error del servidor al buscar paciente' });
    }

    if (!paciente) {
        console.error('Paciente no encontrado con ID:', pacienteIdNum);
        return resp.status(404).json({ success: false, error: `Paciente con ID ${pacienteIdNum} no encontrado` });
    }

    //comprobar que el enfermero existe
    let enfermero;
    try {
        enfermero = await prisma.enfermero.findUnique({
            where: { enfermeroId: enfermeroIdNum }
        });
    } catch (err) {
        console.error('Error buscando enfermero:', err);
        return resp.status(500).json({ success: false, error: 'Error del servidor al buscar enfermero' });
    }

    if (!enfermero) {
        console.error('Enfermero no encontrado con ID:', enfermeroIdNum);
        return resp.status(404).json({ success: false, error: `Enfermero con ID ${enfermeroIdNum} no encontrado` });
    }

    try {
        // Crear el registro médico
        console.log('Creando registro médico con:', { pacienteIdNum, enfermeroIdNum, observaciones });
        const registroMedico = await prisma.registroMedico.create({
            data: {
                pacienteId: pacienteIdNum,
                enfermeroId: enfermeroIdNum,
                observaciones,
                signosVitales: req.body.signosVitales || {}, // Opcional, usar objeto vacío si no se proporciona
                fechaHora: new Date(),
            }
        });

        console.log('Registro médico creado:', registroMedico.registroId);

        // Si se enviaron medicamentos, asignarlos al paciente
        if (medicamentos && Array.isArray(medicamentos) && medicamentos.length > 0) {
            console.log(`\n=== Asignando ${medicamentos.length} medicamentos al paciente ===`);
            for (const med of medicamentos) {
                console.log(`Buscando medicamento: ${med.nombre}`);
                
                // Buscar el medicamento existente en el inventario
                const medicamentoExistente = await prisma.medicamento.findFirst({
                    where: { nombre: med.nombre }
                });

                if (medicamentoExistente) {
                    console.log(`✓ Medicamento encontrado en inventario: ${medicamentoExistente.nombre} (ID: ${medicamentoExistente.medicamentoId})`);
                    console.log(`  Asignando al paciente ${pacienteIdNum} - Cantidad: ${med.cantidad}, Dosis: ${med.dosis}, Frecuencia: ${med.frecuencia}`);
                    
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
                    console.log(`✓ Asignación creada en tabla paciente_medicamento (ID: ${asignacion.pacienteMedicamentoId})`);
                } else {
                    console.warn(`✗ ADVERTENCIA: Medicamento "${med.nombre}" NO encontrado en inventario - NO se asignó`);
                }
            }
        }

        // Si se enviaron insumos, asignarlos al paciente
        if (insumos && Array.isArray(insumos) && insumos.length > 0) {
            console.log(`\n=== Asignando ${insumos.length} insumos al paciente ===`);
            for (const ins of insumos) {
                console.log(`Buscando insumo: ${ins.nombre}`);
                
                // Buscar el insumo existente en el inventario
                const insumoExistente = await prisma.insumo.findFirst({
                    where: { nombre: ins.nombre }
                });

                if (insumoExistente) {
                    console.log(`✓ Insumo encontrado en inventario: ${insumoExistente.nombre} (ID: ${insumoExistente.insumoId})`);
                    console.log(`  Asignando al paciente ${pacienteIdNum} - Cantidad: ${ins.cantidad}`);
                    
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
                    console.log(`✓ Asignación creada en tabla paciente_insumo (ID: ${asignacion.pacienteInsumoId})`);
                } else {
                    console.warn(`✗ ADVERTENCIA: Insumo "${ins.nombre}" NO encontrado en inventario - NO se asignó`);
                }
            }
        }

        console.log('\n=== Nota médica generada exitosamente ===\n');
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
        console.error('Error generando nota médica:', err);
        console.error('Stack:', err.stack);
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
        console.error('Error obteniendo notas médicas del paciente:', err);
        resp.status(500).json({ success: false, error: err.message });
    }
};

const downloadMedicalNotePDF = async (req, resp) => {
    const { registroId } = req.params;

    try {
        console.log(`Generando PDF para registro ID: ${registroId}`);
        
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
            console.error(`Nota médica no encontrada: ${registroId}`);
            return resp.status(404).json({ success: false, error: "Nota médica no encontrada" });
        }

        console.log('Nota encontrada, generando PDF...');
        console.log('Paciente:', nota.paciente?.nombre);
        console.log('Enfermero:', nota.enfermero?.nombre);
        console.log('Medicamentos:', nota.paciente?.medicamentos?.length || 0);
        console.log('Insumos:', nota.paciente?.insumos?.length || 0);

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
                console.log('PDF generado exitosamente');
                resp.end();
            }
        );

    } catch (err) {
        console.error("Error generando PDF:", err);
        console.error("Stack trace:", err.stack);
        resp.status(500).json({ success: false, error: err.message });
    }
};


module.exports = {
    generateMedicalNote,
    getMedicalNotesByPaciente,
    downloadMedicalNotePDF
};