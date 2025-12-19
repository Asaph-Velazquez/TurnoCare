use std::process::{Command, Child, Stdio};
use std::sync::Mutex;
use std::fs::OpenOptions;
use tauri::Manager;

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

struct BackendServer(Mutex<Option<Child>>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      
      // Obtener directorio de recursos
      let resource_dir = app.path().resource_dir().ok();
      
      // Crear log en el directorio temporal del usuario para debug
      let log_path = std::env::temp_dir().join("turnocare-backend.log");
      let log_file = OpenOptions::new()
        .create(true)
        .write(true)
        .append(true)
        .open(&log_path)
        .ok();
      
      let mut log_msg = format!("\n=== INICIO DE TURNOCARE ===\n");
      
      if let Some(res_dir) = resource_dir {
        log_msg.push_str(&format!("📁 Resource directory: {:?}\n", res_dir));
        
        // Buscar el backend en _up_/Backend (estructura del bundle)
        let backend_base = res_dir.join("_up_").join("Backend");
        let backend_path = backend_base.join("src").join("start.js");
        
        log_msg.push_str(&format!("🔍 Buscando: {:?}\n", backend_path));
        log_msg.push_str(&format!("   Existe? {}\n", backend_path.exists()));
        
        // Si no existe start.js, usar index.js (desarrollo)
        let (backend_path, backend_dir) = if backend_path.exists() {
          log_msg.push_str("✅ Usando start.js (producción)\n");
          (backend_path.clone(), backend_base)
        } else {
          let alt_base = res_dir.join("Backend");
          let alt_path = alt_base.join("src").join("index.js");
          log_msg.push_str(&format!("⚠️  start.js no existe, buscando: {:?}\n", alt_path));
          log_msg.push_str(&format!("   Existe? {}\n", alt_path.exists()));
          (alt_path, alt_base)
        };
        
        if backend_path.exists() {
          log_msg.push_str(&format!("🚀 Iniciando servidor backend desde: {:?}\n", backend_path));
          log_msg.push_str(&format!("📂 Working directory: {:?}\n", backend_dir));
          
          // Crear archivos para stdout y stderr del backend
          let stdout_log = res_dir.join("backend-stdout.log");
          let stderr_log = res_dir.join("backend-stderr.log");
          
          let stdout_file = OpenOptions::new()
            .create(true)
            .write(true)
            .truncate(true)
            .open(&stdout_log)
            .ok();
          
          let stderr_file = OpenOptions::new()
            .create(true)
            .write(true)
            .truncate(true)
            .open(&stderr_log)
            .ok();
          
          let mut cmd = Command::new("node");
          cmd.arg(&backend_path)
             .current_dir(&backend_dir);
          
          // Redirigir stdout y stderr a archivos
          if let Some(stdout) = stdout_file {
            cmd.stdout(Stdio::from(stdout));
          }
          if let Some(stderr) = stderr_file {
            cmd.stderr(Stdio::from(stderr));
          }
          
          // En Windows, ocultar la ventana de consola del proceso Node.js
          #[cfg(target_os = "windows")]
          {
            const CREATE_NO_WINDOW: u32 = 0x08000000;
            cmd.creation_flags(CREATE_NO_WINDOW);
          }
          
          match cmd.spawn() {
              Ok(child) => {
                log_msg.push_str(&format!("✅ Servidor backend iniciado (PID: {})\n", child.id()));
                app.manage(BackendServer(Mutex::new(Some(child))));
              },
              Err(e) => {
                log_msg.push_str(&format!("❌ Error al iniciar backend: {}\n", e));
                log_msg.push_str("   Asegúrate de tener Node.js instalado y en el PATH\n");
              }
            }
        } else {
          if cfg!(debug_assertions) {
            log_msg.push_str("🔧 Modo desarrollo: Inicia el backend manualmente con:\n");
            log_msg.push_str("   cd Backend && node src/index.js\n");
          } else {
            log_msg.push_str(&format!("❌ Backend no encontrado en: {:?}\n", backend_path));
          }
        }
        
        // Escribir log
        if let Some(mut file) = log_file {
          use std::io::Write;
          let _ = file.write_all(log_msg.as_bytes());
        }
      }
      
      Ok(())
    })
    .on_window_event(|window, event| {
      if let tauri::WindowEvent::Destroyed = event {
        // Detener el servidor backend al cerrar
        if let Some(server) = window.app_handle().try_state::<BackendServer>() {
          if let Ok(mut child_opt) = server.0.lock() {
            if let Some(mut child) = child_opt.take() {
              println!("🛑 Deteniendo servidor backend...");
              let _ = child.kill();
            }
          }
        }
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
