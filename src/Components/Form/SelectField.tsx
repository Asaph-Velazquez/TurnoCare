import React from "react";

type Option = { value: string; label: string };

type SelectFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
  error?: string | null;
};

export default function SelectField({ label, name, value, onChange, options, required = false, error = null }: SelectFieldProps) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-auto-primary mb-1">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full pl-4 pr-4 py-3 border rounded-xl bg-auto-tertiary/60 text-auto-primary focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
      >
        <option value="">Seleccionar...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
