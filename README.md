# 🏥 TurnoCare - Sistema de Gestión Hospitalaria

Sistema web para la administración de turnos y gestión hospitalaria desarrollado con React, TypeScript y Node.js.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Características](#características)
- [Contribución](#contribución)

## 🔧 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (viene incluido con Node.js)
- **Git** - [Descargar aquí](https://git-scm.com/)

### Verificar instalación:
```bash
node --version
npm --version
git --version
```

## 📥 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/Asaph-Velazquez/TurnoCare.git
cd TurnoCare
```

### 2. Instalar dependencias del Frontend
```bash
npm install
```

### 3. Instalar dependencias del Backend
```bash
cd Backend
npm install
cd ..
```

## ⚙️ Configuración

### Base de Datos
1. Instala **PostgreSQL** 
2. Crea una base de datos llamada `TurnoCare`
3. Configura las variables de entorno en el backend

### Variables de Entorno (Backend)
Crea un archivo `.env` en la carpeta `Backend/` con:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/TurnoCare"
PORT=5000
```

### Configurar Prisma (Base de Datos)
```bash
cd Backend
npx prisma generate
npx prisma db push
cd ..
```

## 🚀 Ejecución

### Ejecutar por separado (Recomendado para desarrollo)

#### Terminal 1 - Backend
```bash
cd Backend
npm start
# El servidor backend se ejecutará en http://localhost:5000
```

#### Terminal 2 - Frontend
```bash
npm run dev
# El frontend se ejecutará en http://localhost:5173
```

## 📁 Estructura del Proyecto

```
TurnoCare/
├── src/                    # Código fuente del frontend
│   ├── Components/         # Componentes React
│   │   ├── AdminHome.tsx   # Panel de administración
│   │   ├── Login.tsx       # Página de login
│   │   ├── UserNav.tsx     # Barra de navegación
│   │   └── Footer.tsx      # Pie de página
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Punto de entrada
│   └── App.css            # Estilos globales
├── Backend/               # Código del servidor
│   ├── index.js           # Servidor Express
│   ├── package.json       # Dependencias del backend
│   └── prisma/            # Configuración de base de datos
│       └── schema.prisma  # Esquema de la base de datos
├── public/                # Archivos estáticos
├── SQL/                   # Scripts SQL
├── package.json           # Dependencias del frontend
└── README.md             # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de UI
- **TypeScript** - Lenguaje tipado
- **Vite** - Herramienta de construcción
- **Tailwind CSS** - Framework CSS
- **React Router DOM** - Navegación
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **CORS** - Manejo de peticiones cross-origin

## ✨ Características

- 🔐 **Sistema de Login** para enfermeros
- 👥 **Gestión de Enfermeros** - CRUD completo
- 🏥 **Gestión de Hospital** - Configuración de departamentos
- 📋 **Gestión de Servicios** - Administración de servicios médicos
- 👤 **Gestión de Pacientes** - Información de pacientes
- 📱 **Diseño Responsive** - Compatible con móviles y desktop
- 🌙 **Modo Oscuro/Claro** - Adaptación automática al sistema

## 🔑 Datos de Prueba

Para probar el sistema, asegúrate de tener enfermeros registrados en tu base de datos `TurnoCare`. El login requiere:

- Número de Empleado (único)
- Nombre completo (nombre, apellido paterno, apellido materno)

Ejemplo de datos necesarios:
```
Número de Empleado: ENF014
Nombre: Miguel
Apellido Paterno: Aguilar
Apellido Materno: Santos
```

## 🚨 Solución de Problemas

### Error de conexión al backend
- Verifica que el backend esté ejecutándose en puerto 5000
- Revisa la consola del navegador para errores de CORS

### Error de base de datos
- Verifica la conexión a PostgreSQL
- Asegúrate de que la base de datos `TurnoCare` existe
- Ejecuta `npx prisma db push` en la carpeta Backend

### Errores de dependencias
```bash
# Limpia caché y reinstala
rm -rf node_modules package-lock.json
npm install

# Para el backend
cd Backend
rm -rf node_modules package-lock.json
npm install
```

## 👥 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📞 Contacto

- **Proyecto:** TurnoCare
- **Repositorio:** [https://github.com/Asaph-Velazquez/TurnoCare](https://github.com/Asaph-Velazquez/TurnoCare)


---

**¡Listo para usar! 🎉**

Si tienes problemas, contacta al equipo de desarrollo.
