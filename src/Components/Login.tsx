function Login() {
  return (
    <div className="min-h-screen bg-auto-primary flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-cyan-300/10 to-blue-500/20"></div>
      
      <div className="relative bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-2xl max-w-md w-full p-8 mx-4">
        {/* Header con icono */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-auto-primary mb-2">
            Bienvenido
          </h2>
          <p className="text-auto-secondary text-sm">
            Inicia sesión para acceder a tu cuenta
          </p>
        </div>

        <form className="space-y-6">
          {/* Campo Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-auto-primary"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-auto-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                className="block w-full pl-10 pr-3 py-3 border border-auto rounded-xl bg-auto-tertiary/50 text-auto-primary placeholder:text-auto-tertiary focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-auto-tertiary/70 transition-all duration-200"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-auto-primary"
            >
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-auto-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                className="block w-full pl-10 pr-3 py-3 border border-auto rounded-xl bg-auto-tertiary/50 text-auto-primary placeholder:text-auto-tertiary focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-auto-tertiary/70 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Opciones adicionales */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-auto text-sky-600 focus:ring-sky-500 focus:ring-2" />
              <span className="ml-2 text-auto-secondary">Recordarme</span>
            </label>
            <a href="#" className="text-sky-600 hover:text-sky-500 font-medium transition-colors duration-200">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Footer del formulario */}
        <div className="mt-8 text-center">
          <p className="text-auto-secondary text-sm">
            ¿No tienes una cuenta?{' '}
            <a href="#" className="text-sky-600 hover:text-sky-500 font-medium transition-colors duration-200">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
