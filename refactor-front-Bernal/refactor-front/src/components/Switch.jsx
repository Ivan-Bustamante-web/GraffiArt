export default function Switch({ className = "", ...inputProps }) {
  return (
    <input
      type="checkbox"
      role="switch"
      className={`relative h-6 w-11 appearance-none rounded-full bg-neutral-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] checked:bg-neutral-900 checked:after:translate-x-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${className}`}
      {...inputProps}
    />
  );
}