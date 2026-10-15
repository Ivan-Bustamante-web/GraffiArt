import Input from "./Input";

const LABEL_CLASS = "block text-left text-xs font-semibold text-neutral-700";

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
