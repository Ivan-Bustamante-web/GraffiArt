export default function Radio({ className = "", ...inputProps }) {
  return (
    <input
      type="radio"
      className={`h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-900 ${className}`}
      {...inputProps}
    />
  );
}