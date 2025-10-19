export type Field = {
  name: string;
  label: string;
  type: "text" | "number" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
};

export const ServiceFields = {
  RegistrarServicio: [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "descripcion", label: "Descripción", type: "text", required: true },
    { name: "capacidadmaxima", label: "Capacidad Máxima", type: "number", required: true },
    { name: "personalasignado", label: "Personal Asignado", type: "number", required: true },
    { name: "hospitalid", label: "ID Hospital", type: "number", required: true },
  ] as Field[],

  ActualizarServicio: [
    { name: "id", label: "ID Servicio", type: "number", required: true },
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "descripcion", label: "Descripción", type: "text", required: true },
    { name: "capacidadmaxima", label: "Capacidad Máxima", type: "number", required: true },
    { name: "personalasignado", label: "Personal Asignado", type: "number", required: true },
    { name: "hospitalid", label: "ID Hospital", type: "number", required: true },
  ] as Field[],

  EliminarServicio: [
    { name: "id", label: "ID Servicio a eliminar", type: "number", required: true },
  ] as Field[],

  ListarServicios: [] as Field[],
};
