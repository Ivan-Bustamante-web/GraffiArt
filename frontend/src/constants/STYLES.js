export const FIELD_LABEL_CLASS = "block text-left text-xs font-semibold text-neutral-700";
export const FIELD_INPUT_CLASS =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";

export const FEEDBACK_STYLES = {
  success: {
    role: "status",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: "✓",
    iconClassName: "text-emerald-600",
  },
  error: {
    role: "alert",
    className: "border-red-200 bg-red-50 text-red-800",
    icon: "⚠",
    iconClassName: "text-red-600",
  },
  warning: {
    role: "status",
    className: "border-amber-300 bg-amber-50 text-amber-900 shadow-sm",
    icon: "⚡",
    iconClassName: "text-amber-800",
  },
};

export const BUTTON_VARIANTS = {
  primary:
    "mt-2 w-full cursor-pointer rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50",
  text: "cursor-pointer text-xs text-blue-600 hover:text-blue-800 hover:underline",
  mutedText:
    "mt-1 cursor-pointer text-xs text-neutral-500 underline hover:text-neutral-900",
  verify:
    "w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50",
  secondary:
    "cursor-pointer rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 disabled:opacity-50",
  compact:
    "cursor-pointer rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50",
  outlineDanger:
    "cursor-pointer rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50",
  linkEdit: "cursor-pointer text-sm text-blue-600 hover:text-blue-800 hover:underline",
  linkDelete: "cursor-pointer text-sm text-red-600 hover:text-red-800 hover:underline",
  passwordToggle:
    "absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-xs text-neutral-400 hover:text-neutral-700",
};

export const CONTAINER_WIDTHS = {
  sm: "max-w-md",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
};

export const QUANTITY_BUTTON_CLASS =
  "cursor-pointer px-2 font-bold text-neutral-600 hover:text-neutral-900";
