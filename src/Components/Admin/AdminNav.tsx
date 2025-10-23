function AdminNav() {
  return (
    <div>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-auto" style={{backgroundColor: 'var(--nav-bg)'}}>
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <a href="/AdminHome">
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
                </a>
              </div>
              <a href="/AdminHome">
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                Turno Care
              </span>
              </a>
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/AdminHome"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Inicio
              </a>
              <a
                href="/Hospital"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Hospital
              </a>
              <a
                href="/Servicios"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Servicios
              </a>
              <a
                href="/Enfermero"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Enfermeros
              </a>
              <a
                href="/pacientes"
                className="text-auto-secondary hover:text-sky-600 transition-colors"
              >
                Pacientes
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default AdminNav;