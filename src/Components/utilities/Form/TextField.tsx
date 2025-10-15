import React from "react";

type TextFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string | null;
};

export default function TextField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  error = null,
}: TextFieldProps) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-auto-primary mb-1">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full pl-4 pr-4 py-3 border rounded-xl bg-auto-tertiary/60 text-auto-primary placeholder:text-auto-tertiary focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
