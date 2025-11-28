import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCoordinator?: boolean;
}

function ProtectedRoute({ children, requireCoordinator = false }: ProtectedRouteProps) {
  const user = localStorage.getItem("user");
  const esCoordinador = localStorage.getItem("esCoordinador") === "true";
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const adminRoutes = [
    "/AdminHome",
    "/Enfermero",
    "/RegistrarEnfermero",
    "/EliminarEnfermero",
    "/ActualizarEnfermero",
    "/Enfermeros/Detalles",
    "/Hospital",
    "/RegistrarHospital",
    "/ActualizarHospital",
    "/EliminarHospital",
    "/Servicios",
    "/RegistrarServicio",
    "/ListarServicios",
    "/ActualizarServicio",
    "/EliminarServicio",
    "/Medicamento",
    "/RegistrarMedicamento",
    "/ActualizarMedicamento",
    "/EliminarMedicamento",
    "/Insumos",
    "/RegistrarInsumo",
    "/ActualizarInsumo",
    "/EliminarInsumo",
    "/turnos/registrar",
    "/turnos/eliminar",
    "/turnos/actualizar",
    "/turnos/asignar-enfermero",
    "/turnos/listar"
  ];

  const nurseRoutes = [
    "/NoCoordinador/home",
    "/NoCoordinador/mis-pacientes",
    "/NoCoordinador/NotaMedicaForm"
  ];

  const isAdminRoute = adminRoutes.some(route => location.pathname.startsWith(route));
  const isNurseRoute = nurseRoutes.some(route => location.pathname.startsWith(route));

  if (isAdminRoute && !esCoordinador) {
    return <Navigate to="/NoCoordinador/home" replace />;
  }

  if (requireCoordinator && !esCoordinador) {
    return <Navigate to="/NoCoordinador/home" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
