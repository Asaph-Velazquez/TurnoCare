interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  details?: { label: string; value: string }[];
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  type?: "danger" | "warning";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  details,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
  type = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const bgColor = type === "danger" ? "from-red-500 to-red-600" : "from-yellow-500 to-yellow-600";
  const buttonColor = type === "danger" ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-auto-secondary rounded-2xl max-w-md w-full shadow-2xl border border-auto transform animate-scaleIn">
        <div className={`bg-gradient-to-br ${bgColor} p-4 rounded-t-2xl flex items-center gap-3`}>
          <div className="bg-white/20 p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        <div className="p-6">
          <p className="text-auto-primary mb-4 leading-relaxed">{message}</p>

          {details && details.length > 0 && (
            <div className="bg-auto-primary rounded-xl p-4 mb-4 border border-auto space-y-2">
              {details.map((detail, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-auto-secondary font-medium">{detail.label}:</span>
                  <span className="text-auto-primary font-semibold">{detail.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Esta acción no se puede deshacer</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-auto-tertiary hover:bg-auto-primary border border-auto text-auto-primary rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-3 ${buttonColor} text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{confirmLabel}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
