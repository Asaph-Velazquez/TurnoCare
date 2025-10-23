const { prisma } = require("../dbPostgres");

const registerService = async (req, resp) => {
    const {
        nombre,
        descripcion,
        capacidadmaxima, 
        personalasignado, 
        hospitalid, 
    } = req.body;

    // Basic validation: nombre and hospitalid are required; numeric fields should parse
    if (!nombre || hospitalid === undefined || hospitalid === null) {
        return resp.status(400).json({ error: "Nombre y ID de hospital son requeridos" });
    }

    const capacidadParsed = capacidadmaxima !== undefined && capacidadmaxima !== null && capacidadmaxima !== '' ? Number(capacidadmaxima) : null;
    const personalParsed = personalasignado !== undefined && personalasignado !== null && personalasignado !== '' ? Number(personalasignado) : 0;
    const hospitalParsed = Number(hospitalid);

    if (isNaN(hospitalParsed)) {
        return resp.status(400).json({ error: "hospitalid debe ser un número válido" });
    }

    try {
        const hospitalExists = await prisma.hospital.findUnique({ where: { hospitalId: hospitalParsed } });
        if (!hospitalExists) {
            return resp.status(400).json({ error: `Hospital con id ${hospitalParsed} no encontrado` });
        }

        const newService = await prisma.servicio.create({
            data: {
                nombre,
                descripcion: descripcion || null,
                capacidadMaxima: capacidadParsed,
                personalAsignado: personalParsed,
                hospitalId: hospitalParsed,
            },
        });
        resp.status(201).json(newService);
    } catch (error) {
        console.error("Error creating service:", error);
        resp.status(500).json({ error: "Error creating service" });
    }
};

const deleteService = async (req, resp) => {
    const { id } = req.params;

    try {
        const deletedService = await prisma.servicio.delete({
            where: { servicioId: parseInt(id) }
        });
        resp.status(200).json(deletedService);
    } catch (error) {
        console.error("Error deleting service:", error);
        resp.status(500).json({ error: "Error deleting service" });
    }
};

const updateService = async (req, resp) => {
    const { id } = req.params;
    const { 
        nombre,
        descripcion,
        capacidadmaxima,
        personalasignado,
        hospitalid
    } = req.body;

    const itExists = await prisma.servicio.findUnique({
        where: { servicioId: parseInt(id) },
    });

    if (!itExists) {
        return resp.status(404).json({ error: "Servicio no encontrado" });
    }

    const capacidadParsed = capacidadmaxima !== undefined && capacidadmaxima !== null && capacidadmaxima !== '' ? Number(capacidadmaxima) : null;
    const personalParsed = personalasignado !== undefined && personalasignado !== null && personalasignado !== '' ? Number(personalasignado) : 0;
    const hospitalParsed = hospitalid !== undefined && hospitalid !== null && hospitalid !== '' ? Number(hospitalid) : null;

    if (hospitalParsed !== null && isNaN(hospitalParsed)) {
        return resp.status(400).json({ error: "hospitalid debe ser un número válido" });
    }

    try {
        const updatedService = await prisma.servicio.update({
            where: { servicioId: parseInt(id) },
            data: {
                nombre: nombre !== undefined ? nombre : itExists.nombre,
                descripcion: descripcion !== undefined ? descripcion : itExists.descripcion,
                capacidadMaxima: capacidadParsed !== null ? capacidadParsed : itExists.capacidadMaxima,
                personalAsignado: personalParsed !== null ? personalParsed : itExists.personalAsignado,
                hospitalId: hospitalParsed !== null ? hospitalParsed : itExists.hospitalId,
            },
        });
        resp.status(200).json(updatedService);
    } catch (error) {
        console.error("Error updating service:", error);
        resp.status(500).json({ error: "Error updating service" });
    }
};

const listServices = async (req, resp) => {
    try {
        const services = await prisma.servicio.findMany({
            include: { hospital: true },
        });
        resp.status(200).json(services);
    } catch (error) {
        console.error("Error listing services:", error);
        resp.status(500).json({ error: "Error listing services" });
    }
};

module.exports = {

    registerService,
    deleteService,
    updateService,
    listServices
};