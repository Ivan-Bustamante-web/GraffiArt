const VARIANT_CLASSES = {
  primary:
    "mt-2 w-full cursor-pointer rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50",
  text: "cursor-pointer text-xs text-blue-600 hover:text-blue-800 hover:underline",
  mutedText:
    "mt-1 cursor-pointer text-xs text-neutral-500 underline hover:text-neutral-900",
  verify:
    "w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50",
  passwordToggle:
    "absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-xs text-neutral-400 hover:text-neutral-700",
};

export default function Button({
  variant = "primary",
  type = "button",
  children,
  ...buttonProps
}) {
  return (
    <button
      type={type}
      className={VARIANT_CLASSES[variant]}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
