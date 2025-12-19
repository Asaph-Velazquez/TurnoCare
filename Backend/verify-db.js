const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  const hospitales = await prisma.hospital.findMany();
  
  const enfermeros = await prisma.enfermero.count();
  
  const pacientes = await prisma.paciente.count();
  
  const medicamentos = await prisma.medicamento.count();
  
  
  await prisma.$disconnect();
}

verify().catch(console.error);

