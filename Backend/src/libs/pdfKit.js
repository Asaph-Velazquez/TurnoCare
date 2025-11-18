const PDFDocument = require("pdfkit");

function buildMedicalNotePDF(notaData, dataCallback, endCallback) {
    const doc = new PDFDocument({ margin: 50 });

    doc.on("data", dataCallback);
    doc.on("end", endCallback);

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
        .text(`Fecha y hora: ${new Date().toLocaleString()}`, { align: "right" });

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

    const paciente = notaData.paciente;

    doc.fontSize(12).font("Helvetica");
    doc.text(`Nombre: ${paciente.nombre} ${paciente.apellidop} ${paciente.apellidom}`);
    doc.text(`Número de expediente: ${paciente.numeroExpediente}`);
    doc.text(`Edad: ${paciente.edad}`);
    doc.text(`Habitación/Cama: ${paciente.numeroHabitacion} / ${paciente.numeroCama}`);

    doc.moveDown();

    // ==============================
    // DATOS DEL ENFERMERO
    // ==============================
    doc.fontSize(16).font("Helvetica-Bold").text("Datos del Enfermero");
    doc.moveDown(0.5);

    const enfermero = notaData.enfermero;

    doc.fontSize(12).font("Helvetica");
    doc.text(`Nombre: ${enfermero.nombre} ${enfermero.apellidoPaterno} ${enfermero.apellidoMaterno}`);
    doc.text(`Número de empleado: ${enfermero.numeroEmpleado}`);
    doc.text(`Turno asignado: ${enfermero.turnoAsignado?.turnoNombre || "No registrado"}`);

    doc.moveDown();

    // ==============================
    // SIGNOS VITALES
    // ==============================
    doc.fontSize(16).font("Helvetica-Bold").text("Signos Vitales");
    doc.moveDown(0.5);

    doc.fontSize(12).font("Helvetica");
    const sv = notaData.signosVitales;

    doc.text(`- Frecuencia cardiaca: ${sv.frecuenciaCardiaca} lpm`);
    doc.text(`- Presión arterial: ${sv.presionArterial}`);
    doc.text(`- Temperatura: ${sv.temperatura} °C`);
    doc.text(`- Saturación O2: ${sv.saturacionOxigeno}%`);
    doc.text(`- Frecuencia respiratoria: ${sv.frecuenciaRespiratoria} rpm`);

    doc.moveDown();

    // ==============================
    // OBSERVACIONES
    // ==============================
    doc.fontSize(16).font("Helvetica-Bold").text("Observaciones");
    doc.moveDown(0.5);

    doc.fontSize(12).font("Helvetica");
    doc.text(notaData.observaciones, { align: "justify" });

    doc.moveDown();

    // ==============================
    // MEDICAMENTOS ADMINISTRADOS
    // ==============================
    if (notaData.medicamentos && notaData.medicamentos.length > 0) {
        doc.fontSize(16).font("Helvetica-Bold").text("Medicamentos Administrados");
        doc.moveDown(0.5);

        doc.fontSize(12).font("Helvetica");

        notaData.medicamentos.forEach((med) => {
            doc.text(`• ${med.nombre} (dosis: ${med.dosis}, vía: ${med.via})`);
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
}

module.exports = { buildMedicalNotePDF };
