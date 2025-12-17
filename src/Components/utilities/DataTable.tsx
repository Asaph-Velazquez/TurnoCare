import { useState } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onSearch?: (term: string) => void;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchPlaceholder = "Buscar...",
  emptyMessage = "No hay datos disponibles",
  onSearch,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Filtrado local si no se proporciona onSearch
  const extractPrimitives = (value: any): string[] => {
    if (value === null || value === undefined) return [];
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return [String(value)];
    if (Array.isArray(value)) return value.flatMap((v) => extractPrimitives(v));
    if (typeof value === "object") return Object.values(value).flatMap((v) => extractPrimitives(v));
    return [];
  };

  const filteredData = onSearch
    ? data
    : data.filter((item) => {
        const tokens = extractPrimitives(item).join(" ").toLowerCase();
        return tokens.includes(searchTerm.toLowerCase());
      });

  return (
    <div className="bg-auto-secondary backdrop-blur-sm border border-auto rounded-3xl shadow-lg">
      {/* Barra de búsqueda */}
      <div className="p-6 border-b border-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-auto-tertiary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-auto rounded-xl bg-auto-tertiary/50 text-auto-primary placeholder:text-auto-tertiary focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-16 h-16 text-auto-tertiary mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-auto-tertiary text-lg">{emptyMessage}</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-auto">
            <thead className="bg-auto-tertiary/30">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-left text-xs font-semibold text-auto-primary uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-auto/50">
              {filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-auto-tertiary/20 transition-colors duration-150"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-auto-primary"
                    >
                      {column.render
                        ? column.render(item)
                        : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer con contador */}
      {!loading && filteredData.length > 0 && (
        <div className="px-6 py-4 bg-auto-tertiary/20 border-t border-auto">
          <p className="text-sm text-auto-secondary">
            Mostrando <span className="font-semibold text-auto-primary">{filteredData.length}</span> de{" "}
            <span className="font-semibold text-auto-primary">{data.length}</span> registros
          </p>
        </div>
      )}
    </div>
  );
}

export default DataTable;

