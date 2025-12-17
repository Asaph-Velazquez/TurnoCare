import React, { useState } from "react";

export interface UpdateCardProps<T> {
  items: T[];
  searchTerm: string;
  onClearSearch?: () => void;
  emptyMessage?: string;
  getKey?: (item: T) => string | number;
  renderInfo: (item: T) => React.ReactNode;
  buildForm: (item: T) => any;
  renderEditor: (
    form: any,
    onFieldChange: (key: string, value: any) => void,
    item: T
  ) => React.ReactNode;
  onSave: (item: T, form: any) => Promise<void> | void;
  saving?: boolean;
  updateLabel?: string;
  editButtonLabel?: string;
  cancelButtonLabel?: string;
}

function UpdateCard<T>({
  items,
  searchTerm,
  onClearSearch,
  emptyMessage = "No se encontraron elementos",
  getKey,
  renderInfo,
  buildForm,
  renderEditor,
  onSave,
  saving = false,
  updateLabel = "Guardar cambios",
  editButtonLabel = "Editar",
  cancelButtonLabel = "Cancelar",
}: UpdateCardProps<T>) {
  const [editingKey, setEditingKey] = useState<string | number | null>(null);
  const [form, setForm] = useState<any | null>(null);

  const startEdit = (item: T) => {
    const f = buildForm(item);
    const key = getKey ? getKey(item) : (item as any)?.id ?? (item as any)?.enfermeroId;
    setEditingKey(key ?? null);
    setForm(f ?? {});
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setForm(null);
  };

  const onFieldChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...(prev ?? {}), [key]: value }));
  };

  const handleSave = async (item: T) => {
    try {
      await onSave(item, form ?? {});
      cancelEdit();
    } catch (_e) {
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between px-2">
        <span className="text-sm text-auto-secondary font-semibold">
          {items.length} registro{items.length !== 1 ? "s" : ""} encontrado{items.length !== 1 ? "s" : ""}
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
            <p className="text-auto-primary font-semibold text-lg mb-2">{emptyMessage}</p>
            {searchTerm && (
              <p className="text-auto-secondary">No hay coincidencias para "{searchTerm}"</p>
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
          items.map((item, idx) => {
            const key = getKey ? getKey(item) : (item as any)?.id ?? (item as any)?.enfermeroId ?? idx;
            const isEditing = editingKey === key;
            return (
              <div
                key={key}
                className="bg-auto-primary border-2 border-auto rounded-xl p-5 hover:border-sky-400 hover:scale-[1.02] transition-all duration-200 hover:shadow-xl group"
              >
                {renderInfo(item)}

                {isEditing ? (
                  <div className="space-y-3 mt-2">
                    {renderEditor(form ?? {}, onFieldChange, item)}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSave(item)}
                        disabled={saving}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17 8V7a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H7a1 1 0 00-1 1v2H5a2 2 0 00-2 2v1h14z" />
                              <path fillRule="evenodd" d="M3 9h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V9zm4 2a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            {updateLabel}
                          </>
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={saving}
                        className="flex-1 bg-auto-secondary border-2 border-auto hover:border-auto/70 text-auto-primary font-bold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelButtonLabel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(item)}
                    className="w-full mt-2 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group-hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712z" />
                      <path d="M3 17.25V21h3.75L19.061 8.689l-3.712-3.712L3 17.25z" />
                    </svg>
                    {editButtonLabel}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default UpdateCard;

