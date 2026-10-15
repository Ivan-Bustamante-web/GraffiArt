const INPUT_CLASS =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";

export default function Input({
  className,
  hasAction = false,
  ...inputProps
}) {
  const inputClassName =
    className ?? `${INPUT_CLASS}${hasAction ? " pr-10" : ""}`;

  return <input className={inputClassName} {...inputProps} />;
}