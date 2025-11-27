const PDFDocument = require("pdfkit");

function buildMedicalNotePDF(notaData, dataCallback, endCallback) {
    try {
        const doc = new PDFDocument({ margin: 50 });

        doc.on("data", dataCallback);
        doc.on("end", endCallback);
        doc.on("error", (err) => {
            console.error("Error en PDFDocument:", err);
        });

    // ==============================
    // ENCABEZADO
    // ==============================
    doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .text("HOSPITAL GENERAL - Nota Médica", { align: "center" });

    doc.moveDown();
    doc
        .fontSize(12)
        .font("Helvetica")
        .text(`Fecha y hora: ${new Date(notaData.fechaHora).toLocaleString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, { align: "right" });

    doc.moveDown();

    doc
        .strokeColor("#4A90E2")
        .lineWidth(2)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();

    doc.moveDown(2);

    // ==============================
    // DATOS DEL PACIENTE
    // ==============================
    doc.fontSize(16).font("Helvetica-Bold").text("Datos del Paciente");
    doc.moveDown(0.5);

    const paciente = notaData.paciente || {};

    doc.fontSize(12).font("Helvetica");
    doc.text(`Nombre: ${paciente.nombre || 'N/A'} ${paciente.apellidop || ''} ${paciente.apellidom || ''}`);
    doc.text(`Número de expediente: ${paciente.numeroExpediente || 'N/A'}`);
    doc.text(`Edad: ${paciente.edad || 'N/A'}`);
    doc.text(`Habitación/Cama: ${paciente.numeroHabitacion || 'N/A'} / ${paciente.numeroCama || 'N/A'}`);

    doc.moveDown();

    // ==============================
    // DATOS DEL ENFERMERO
    // ==============================
    doc.fontSize(16).font("Helvetica-Bold").text("Datos del Enfermero");
    doc.moveDown(0.5);

    const enfermero = notaData.enfermero || {};

    doc.fontSize(12).font("Helvetica");
    doc.text(`Nombre: ${enfermero.nombre || 'N/A'} ${enfermero.apellidoPaterno || ''} ${enfermero.apellidoMaterno || ''}`);
    doc.text(`Número de empleado: ${enfermero.numeroEmpleado || 'N/A'}`);
    doc.text(`Turno asignado: ${enfermero.turno?.nombre || "No registrado"}`);
    doc.text(`Servicio: ${enfermero.servicio?.nombre || "No asignado"}`);

    doc.moveDown();

    // ==============================
    // OBSERVACIONES
    // ==============================
    doc.fontSize(16).font("Helvetica-Bold").text("Observaciones Clínicas");
    doc.moveDown(0.5);

    doc.fontSize(12).font("Helvetica");
    doc.text(notaData.observaciones || "Sin observaciones registradas", { align: "justify" });

    doc.moveDown(1.5);

    // ==============================
    // MEDICAMENTOS PRESCRITOS
    // ==============================
    const medicamentos = notaData.paciente?.medicamentos || [];
    if (medicamentos.length > 0) {
        doc.fontSize(16).font("Helvetica-Bold").text("Medicamentos Prescritos");
        doc.moveDown(0.5);

        doc.fontSize(12).font("Helvetica");

        medicamentos.forEach((medAsignado) => {
            const med = medAsignado.medicamento;
            doc.text(`- ${med.nombre}`);
            doc.fontSize(10).fillColor("#555");
            doc.text(`  Cantidad: ${medAsignado.cantidadAsignada || 'N/A'} | Dosis: ${medAsignado.dosis || 'N/A'} | Frecuencia: ${medAsignado.frecuencia || 'N/A'}`);
            doc.fontSize(12).fillColor("#000");
            doc.moveDown(0.3);
        });

        doc.moveDown();
    }

    // ==============================
    // INSUMOS UTILIZADOS
    // ==============================
    const insumos = notaData.paciente?.insumos || [];
    if (insumos.length > 0) {
        doc.fontSize(16).font("Helvetica-Bold").text("Insumos Utilizados");
        doc.moveDown(0.5);

        doc.fontSize(12).font("Helvetica");

        insumos.forEach((insAsignado) => {
            const ins = insAsignado.insumo;
            doc.text(`- ${ins.nombre}`);
            doc.fontSize(10).fillColor("#555");
            doc.text(`  Cantidad: ${insAsignado.cantidad || 'N/A'}`);
            doc.fontSize(12).fillColor("#000");
            doc.moveDown(0.3);
        });

        doc.moveDown();
    }

    // ==============================
    // PIE DE PÁGINA
    // ==============================
    doc.moveDown(2);
    doc
        .fontSize(10)
        .fillColor("#555")
        .text("Esta nota médica ha sido generada automáticamente por el sistema TurnoCare.", {
            align: "center",
        });

    doc.end();
    } catch (err) {
        console.error("Error generando PDF:", err);
        throw err;
    }
}

module.exports = { buildMedicalNotePDF };
