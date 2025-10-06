function UserHome() {
  return (
    <div className="min-h-screen bg-auto-primary">
      {/* HERO SECTION */}
      <section id="inicio" className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                Tu Salud, Nuestra Prioridad
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-auto-secondary mb-8 leading-relaxed">
              Agenda tu cita médica de forma rápida y segura. Atención de calidad cuando la necesites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
                Agendar Cita Ahora
              </button>
              <button className="border-2 border-sky-500 text-sky-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-sky-500 hover:text-white transition-all duration-300">
                Ver Mis Citas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AGENDAMIENTO RÁPIDO */}
      <section id="agendar" className="py-16 bg-auto-tertiary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-auto-primary mb-4">Agenda tu Cita en 3 Pasos</h2>
            <p className="text-xl text-auto-secondary">Proceso simple y rápido para tu comodidad</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-auto-secondary rounded-2xl p-8 shadow-lg">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Paso 1 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-auto-primary mb-2">Selecciona Especialidad</h3>
                  <p className="text-auto-secondary">Elige el tipo de consulta que necesitas</p>
                </div>

                {/* Paso 2 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-auto-primary mb-2">Elige Doctor y Fecha</h3>
                  <p className="text-auto-secondary">Selecciona tu médico preferido y horario</p>
                </div>

                {/* Paso 3 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-auto-primary mb-2">Confirma tu Cita</h3>
                  <p className="text-auto-secondary">Recibe confirmación por email y SMS</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <button className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300">
                  Comenzar Agendamiento
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS MÉDICOS */}
      <section id="servicios" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-auto-primary mb-4">Nuestros Servicios Médicos</h2>
            <p className="text-xl text-auto-secondary">Atención especializada para cuidar tu salud</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Medicina General */}
            <div className="bg-auto-secondary rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-auto-primary mb-3">Medicina General</h3>
              <p className="text-auto-secondary mb-4">Consulta médica general para diagnóstico y tratamiento de enfermedades comunes</p>
              <button className="text-sky-600 hover:text-sky-700 font-medium">Agendar Cita</button>
            </div>

            {/* Cardiología */}
            <div className="bg-auto-secondary rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-auto-primary mb-3">Cardiología</h3>
              <p className="text-auto-secondary mb-4">Especialistas en el cuidado del corazón y sistema cardiovascular</p>
              <button className="text-sky-600 hover:text-sky-700 font-medium">Agendar Cita</button>
            </div>

            {/* Pediatría */}
            <div className="bg-auto-secondary rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-auto-primary mb-3">Pediatría</h3>
              <p className="text-auto-secondary mb-4">Atención médica especializada para bebés, niños y adolescentes</p>
              <button className="text-sky-600 hover:text-sky-700 font-medium">Agendar Cita</button>
            </div>

            {/* Ginecología */}
            <div className="bg-auto-secondary rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-auto-primary mb-3">Ginecología</h3>
              <p className="text-auto-secondary mb-4">Cuidado integral de la salud femenina y reproductiva</p>
              <button className="text-sky-600 hover:text-sky-700 font-medium">Agendar Cita</button>
            </div>

            {/* Dermatología */}
            <div className="bg-auto-secondary rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-sky-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-auto-primary mb-3">Dermatología</h3>
              <p className="text-auto-secondary mb-4">Especialistas en el cuidado de la piel, cabello y uñas</p>
              <button className="text-sky-600 hover:text-sky-700 font-medium">Agendar Cita</button>
            </div>

            {/* Psicología */}
            <div className="bg-auto-secondary rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-auto-primary mb-3">Psicología</h3>
              <p className="text-auto-secondary mb-4">Atención psicológica y terapia para tu bienestar mental</p>
              <button className="text-sky-600 hover:text-sky-700 font-medium">Agendar Cita</button>
            </div>
          </div>
        </div>
      </section>

      {/* INFORMACIÓN DE CONTACTO */}
      <section id="contacto" className="py-16 bg-auto-tertiary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-auto-primary mb-4">Información de Contacto</h2>
            <p className="text-xl text-auto-secondary">Estamos aquí para ayudarte</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Ubicación */}
            <div className="bg-auto-secondary rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-auto-primary mb-3">Ubicación</h3>
              <p className="text-auto-secondary">Av. Principal 123<br />Centro Médico, Ciudad</p>
            </div>

            {/* Teléfono */}
            <div className="bg-auto-secondary rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-auto-primary mb-3">Teléfono</h3>
              <p className="text-auto-secondary">(555) 123-4567<br />Lunes a Viernes 8:00 - 18:00</p>
            </div>

            {/* Email */}
            <div className="bg-auto-secondary rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-auto-primary mb-3">Email</h3>
              <p className="text-auto-secondary">info@turnocare.com<br />citas@turnocare.com</p>
            </div>
          </div>

          {/* Horarios de Atención */}
          <div className="mt-12 text-center">
            <div className="bg-auto-secondary rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-auto-primary mb-6">Horarios de Atención</h3>
              <div className="grid md:grid-cols-2 gap-4 text-auto-secondary">
                <div>
                  <p className="font-semibold text-auto-primary">Lunes - Viernes</p>
                  <p>8:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold text-auto-primary">Sábados</p>
                  <p>9:00 AM - 2:00 PM</p>
                </div>
              </div>
              <p className="text-sm text-auto-tertiary mt-4">*Emergencias: 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default UserHome;
