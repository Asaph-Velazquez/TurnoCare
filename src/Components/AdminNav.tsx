function AdminNav() {
  return (
    <div>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-auto" style={{backgroundColor: 'var(--nav-bg)'}}>
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                Turno Care
              </span>
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Inicio
              </a>
              <a
                href="#servicios"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Servicios
              </a>
              <a
                href="#doctores"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Doctores
              </a>
              <a
                href="#ubicacion"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Ubicación
              </a>
              <a
                href="#contacto"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Contacto
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default AdminNav;