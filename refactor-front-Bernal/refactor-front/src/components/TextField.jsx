const LABEL_CLASS = "block text-left text-xs font-semibold text-neutral-700";
const INPUT_CLASS =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";

export function Input({
  className,
  hasAction = false,
  ...inputProps
}) {
  const inputClassName =
    className ?? `${INPUT_CLASS}${hasAction ? " pr-10" : ""}`;

  return <input className={inputClassName} {...inputProps} />;
}

export default function AuthField({
  id,
  label,
  labelClassName = LABEL_CLASS,
  labelAction,
  inputAction,
  className,
  ...inputProps
}) {
  return (
    <div>
      <div className={labelAction ? "flex items-center justify-between" : undefined}>
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative mt-1">
        <Input
          id={id}
          className={className}
          hasAction={Boolean(inputAction)}
          {...inputProps}
        />
        {inputAction}
      </div>
    </div>
  );
}
