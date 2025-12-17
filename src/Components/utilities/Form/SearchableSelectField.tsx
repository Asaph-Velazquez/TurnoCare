import { useState, useRef, useEffect } from "react";

type Option = { value: string; label: string; searchText?: string };

type SearchableSelectFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  error?: string | null;
  placeholder?: string;
  emptyMessage?: string;
};

export default function SearchableSelectField({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  required = false, 
  error = null,
  placeholder = "Buscar...",
  emptyMessage = "No hay opciones disponibles"
}: SearchableSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrar opciones basadas en el término de búsqueda
  const filteredOptions = options.filter((opt) => {
    const searchText = opt.searchText || opt.label;
    return searchText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Obtener la opción seleccionada
  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      <label htmlFor={name} className="block text-sm font-medium text-auto-primary mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {/* Campo de visualización/búsqueda */}
        <div
          onClick={handleInputClick}
          className="block w-full pl-4 pr-10 py-3 border-2 border-auto rounded-xl bg-auto-primary text-auto-primary cursor-pointer hover:border-sky-500 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/20 transition-all duration-200"
        >
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent outline-none text-auto-primary placeholder-auto-secondary/70"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={selectedOption ? "text-auto-primary" : "text-auto-secondary/70"}>
              {selectedOption ? selectedOption.label : `Seleccionar ${label.toLowerCase()}...`}
            </span>
          )}
        </div>

        {/* Icono de flecha */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-auto-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown de opciones */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-auto-secondary border-2 border-auto rounded-xl shadow-2xl max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-auto-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-auto-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">{emptyMessage}</p>
              </div>
            ) : (
              <>
                {/* Opción para deseleccionar */}
                {!required && (
                  <div
                    onClick={() => handleSelect("")}
                    className="px-4 py-3 hover:bg-auto-tertiary/50 cursor-pointer transition-colors border-b border-auto text-auto-secondary italic"
                  >
                    Sin seleccionar
                  </div>
                )}
                
                {/* Opciones filtradas */}
                {filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-4 py-3 hover:bg-sky-500/10 cursor-pointer transition-colors ${
                      opt.value === value ? "bg-sky-500/20 font-semibold text-sky-600 dark:text-sky-400" : "text-auto-primary"
                    }`}
                  >
                    {opt.label}
                    {opt.value === value && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2 text-sky-600 dark:text-sky-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

