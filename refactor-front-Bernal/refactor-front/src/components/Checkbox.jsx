export default function Checkbox({ className = "", ...inputProps }) {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 ${className}`}
      {...inputProps}
    />
  );
}