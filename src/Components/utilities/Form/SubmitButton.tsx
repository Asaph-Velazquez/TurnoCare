
type Props = {
  label?: string;
  disabled?: boolean;
};

export default function SubmitButton({ label = "Guardar", disabled = false }: Props) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:opacity-60 transition`}
    >
      {label}
    </button>
  );
}

