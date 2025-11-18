const { prisma } = require("../dbPostgres");

const { buildMedicalNotePDF } = require("../libs/pdfKit");

//generacion de notamedica
const generateMedicalNote = async (req, resp) => {
    const {
        pacienteId,
        enfermeroId,
        signosVitales,
        observaciones,
        medicamentos
    } = req.body;

    if (!pacienteId || !enfermeroId || !observaciones || !signosVitales) {
        return resp.status(400).json({ success: false, error: 'Faltan campos requeridos' });
    }

    //comprobar que el paciente existe
    let paciente;
    try {
        paciente = await prisma.paciente.findUnique({
            where: { pacienteId }
        });
    } catch (err) {
        console.error('Error buscando paciente:', err);
        return resp.status(500).json({ success: false, error: 'Error del servidor' });
    }

    if (!paciente) {
        return resp.status(404).json({ success: false, error: 'Paciente no encontrado' });
    }

    //comprobar que el enfermero existe
    let enfermero;
    try {
        enfermero = await prisma.enfermero.findUnique({
            where: { enfermeroId }
        });
    } catch (err) {
        console.error('Error buscando enfermero:', err);
        return resp.status(500).json({ success: false, error: 'Error del servidor' });
    }

    if (!enfermero) {
        return resp.status(404).json({ success: false, error: 'Enfermero no encontrado' });
    }


    try {
        await prisma.registroMedico.create({
            data: {
                pacienteId,
                enfermeroId,
                observaciones,
                signosVitales,
                fechaHora: new Date(),

                medicamentos: {
                    create: medicamentos
                }
            }
        });
    } catch (err) {
        console.error('Error generando nota médica:', err);
        return resp.status(500).json({ success: false, error: err.message });
    }

    resp.json({ success: true, message: 'Nota médica generada' });
};

const downloadMedicalNotePDF = async (req, resp) => {
    const { registroId } = req.params;

    try {
        const nota = await prisma.registroMedico.findUnique({
            where: { registroId: 1 },
            include: {
                paciente: true,
                enfermero: {
                    include: {
                        turno: true,        // <--- ESTE ES EL CORRECTO
                        servicio: true,
                        registrosMedicos: true,
                        inventarios: true,
                        insumos: true,
                        capacitaciones: true
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
            () => resp.end()
        );

    } catch (err) {
        console.error("Error generando PDF:", err);
        resp.status(500).json({ success: false, error: err.message });
    }
};


module.exports = {
    generateMedicalNote,
    downloadMedicalNotePDF
};