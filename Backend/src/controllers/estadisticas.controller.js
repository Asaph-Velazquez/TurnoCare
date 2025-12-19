const { prisma } = require("../db");

// Obtener estadísticas de medicamentos por servicio
const getMedicamentosPorServicio = async (req, resp) => {
  const { servicioId } = req.params;

  try {
    // Obtener todos los pacientes del servicio con sus medicamentos asignados
    const pacientes = await prisma.paciente.findMany({
      where: { servicioId: servicioId ? Number(servicioId) : undefined },
      include: {
        servicio: true,
        medicamentosAsignados: {
          include: {
            medicamento: true
          }
        }
      }
    });

    // Agrupar medicamentos por servicio
    const medicamentosPorServicio = {};

    pacientes.forEach(paciente => {
      if (!paciente.servicio) return;

      const servicioNombre = paciente.servicio.nombre;
      
      if (!medicamentosPorServicio[servicioNombre]) {
        medicamentosPorServicio[servicioNombre] = {
          servicioId: paciente.servicioId,
          servicioNombre,
          medicamentos: {},
          totalPacientes: 0
        };
      }

      medicamentosPorServicio[servicioNombre].totalPacientes++;

      paciente.medicamentosAsignados.forEach(asig => {
        const medId = asig.medicamento.medicamentoId;
        const medNombre = asig.medicamento.nombre;

        if (!medicamentosPorServicio[servicioNombre].medicamentos[medId]) {
          medicamentosPorServicio[servicioNombre].medicamentos[medId] = {
            medicamentoId: medId,
            nombre: medNombre,
            cantidadTotal: 0,
            pacientesUsando: 0,
            stockDisponible: asig.medicamento.cantidadStock
          };
        }

        medicamentosPorServicio[servicioNombre].medicamentos[medId].cantidadTotal += asig.cantidadAsignada;
        medicamentosPorServicio[servicioNombre].medicamentos[medId].pacientesUsando++;
      });
    });

    // Convertir objeto a array
    const resultado = Object.values(medicamentosPorServicio).map(servicio => ({
      ...servicio,
      medicamentos: Object.values(servicio.medicamentos)
    }));

    resp.json({ success: true, data: resultado });
  } catch (err) {resp.status(500).json({ error: "Error al obtener medicamentos por servicio" });
  }
};

// Obtener estadísticas de insumos por servicio
const getInsumosPorServicio = async (req, resp) => {
  const { servicioId } = req.params;

  try {
    // Obtener todos los pacientes del servicio con sus insumos asignados
    const pacientes = await prisma.paciente.findMany({
      where: { servicioId: servicioId ? Number(servicioId) : undefined },
      include: {
        servicio: true,
        insumosAsignados: {
          include: {
            insumo: true
          }
        }
      }
    });

    // Agrupar insumos por servicio
    const insumosPorServicio = {};

    pacientes.forEach(paciente => {
      if (!paciente.servicio) return;

      const servicioNombre = paciente.servicio.nombre;
      
      if (!insumosPorServicio[servicioNombre]) {
        insumosPorServicio[servicioNombre] = {
          servicioId: paciente.servicioId,
          servicioNombre,
          insumos: {},
          totalPacientes: 0
        };
      }

      insumosPorServicio[servicioNombre].totalPacientes++;

      paciente.insumosAsignados.forEach(asig => {
        const insId = asig.insumo.insumoId;
        const insNombre = asig.insumo.nombre;

        if (!insumosPorServicio[servicioNombre].insumos[insId]) {
          insumosPorServicio[servicioNombre].insumos[insId] = {
            insumoId: insId,
            nombre: insNombre,
            cantidadTotal: 0,
            pacientesUsando: 0,
            disponible: asig.insumo.cantidadDisponible
          };
        }

        insumosPorServicio[servicioNombre].insumos[insId].cantidadTotal += asig.cantidad;
        insumosPorServicio[servicioNombre].insumos[insId].pacientesUsando++;
      });
    });

    // Convertir objeto a array
    const resultado = Object.values(insumosPorServicio).map(servicio => ({
      ...servicio,
      insumos: Object.values(servicio.insumos)
    }));

    resp.json({ success: true, data: resultado });
  } catch (err) {resp.status(500).json({ error: "Error al obtener insumos por servicio" });
  }
};

// Obtener resumen general de inventario por servicio
const getResumenInventarioPorServicio = async (req, resp) => {
  try {
    const servicios = await prisma.servicio.findMany({
      include: {
        pacientes: {
          include: {
            medicamentosAsignados: {
              include: { medicamento: true }
            },
            insumosAsignados: {
              include: { insumo: true }
            }
          }
        }
      }
    });

    const resumen = servicios.map(servicio => {
      const totalMedicamentosUsados = servicio.pacientes.reduce((sum, pac) => 
        sum + pac.medicamentosAsignados.reduce((mSum, m) => mSum + m.cantidadAsignada, 0), 0
      );

      const totalInsumosUsados = servicio.pacientes.reduce((sum, pac) => 
        sum + pac.insumosAsignados.reduce((iSum, i) => iSum + i.cantidad, 0), 0
      );

      const medicamentosUnicos = new Set(
        servicio.pacientes.flatMap(pac => 
          pac.medicamentosAsignados.map(m => m.medicamentoId)
        )
      ).size;

      const insumosUnicos = new Set(
        servicio.pacientes.flatMap(pac => 
          pac.insumosAsignados.map(i => i.insumoId)
        )
      ).size;

      return {
        servicioId: servicio.servicioId,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        totalPacientes: servicio.pacientes.length,
        totalMedicamentosUsados,
        totalInsumosUsados,
        medicamentosUnicos,
        insumosUnicos
      };
    });

    resp.json({ success: true, data: resumen });
  } catch (err) {resp.status(500).json({ error: "Error al obtener resumen de inventario" });
  }
};

module.exports = {
  getMedicamentosPorServicio,
  getInsumosPorServicio,
  getResumenInventarioPorServicio
};


