import React from "react";

export interface DeleteCardProps<T> {
  items: T[];
  loading: boolean;
  onDelete: (item: T) => void;
  renderInfo: (item: T) => React.ReactNode;
  searchTerm: string;
  onClearSearch?: () => void;
  emptyMessage?: string;
  deleteLabel?: string;
}

function DeleteCard<T extends { [key: string]: any }>({
  items,
  loading,
  onDelete,
  renderInfo,
  searchTerm,
  onClearSearch,
  emptyMessage = "No se encontraron elementos",
  deleteLabel = "Eliminar",
}: DeleteCardProps<T>) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between px-2">
        <span className="text-sm text-auto-secondary font-semibold">
          {items.length} registro{items.length !== 1 ? 's' : ''} encontrado{items.length !== 1 ? 's' : ''}
        </span>
        {onClearSearch && searchTerm && (
          <button
            onClick={onClearSearch}
            className="text-sm text-sky-500 hover:text-sky-600 font-semibold flex items-center gap-1 transition-colors"
          >
            Limpiar búsqueda
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
        {items.length === 0 ? (
          <div className="text-center py-16 bg-auto-primary rounded-xl border-2 border-dashed border-auto col-span-2">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-auto-primary font-semibold text-lg mb-2">
              {emptyMessage}
            </p>
            {searchTerm && (
              <p className="text-auto-secondary">
                No hay coincidencias para "{searchTerm}"
              </p>
            )}
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="mt-4 text-sm text-sky-500 hover:text-sky-600 font-semibold flex items-center gap-1 transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id || item.enfermeroId || item.hospitalId || idx}
              className="bg-auto-primary border-2 border-auto rounded-xl p-5 hover:border-sky-400 hover:scale-[1.02] transition-all duration-200 hover:shadow-xl group"
            >
              {renderInfo(item)}
              <button
                onClick={() => onDelete(item)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group-hover:scale-105 mt-4"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deleteLabel}
                  </>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DeleteCard;

