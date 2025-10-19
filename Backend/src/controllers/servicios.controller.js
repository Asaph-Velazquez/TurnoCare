const { prisma } = require("../dbPostgres");

const registerService = async (req, resp) => {
    const { 
        nombre, 
        descripcion, 
        capacidadmaxima,
        personalasignado, 
        hospitalid 
    } = req.body;

    if (!nombre || !descripcion || !capacidadmaxima || !personalasignado || !hospitalid) {
        return resp.status(400).json({ error: "Todos los campos son requeridos" });
    }

    try {
        const newService = await prisma.servicio.create({
            data: {
                nombre,
                descripcion,
                capacidadmaxima,
                personalasignado,
                hospitalid
            }
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
            where: { servicioid: parseInt(id) }
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

    if (!nombre || !descripcion || !capacidadmaxima || !personalasignado || !hospitalid) {
        return resp.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const itExists = await prisma.servicio.findUnique({
        where: { servicioid: parseInt(id) }
    });

    if (!itExists) {
        return resp.status(404).json({ error: "Servicio no encontrado" });
    }

    try {
        const updatedService = await prisma.servicio.update({
            where: { servicioid: parseInt(id) },
            data: {
                nombre,
                descripcion,
                capacidadmaxima,
                personalasignado,
                hospitalid
            }
        });
        resp.status(200).json(updatedService);
    } catch (error) {
        console.error("Error updating service:", error);
        resp.status(500).json({ error: "Error updating service" });
    }
};

const listServices = async (req, resp) => {
    try {
        const services = await prisma.servicio.findMany();
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