export default function PageHeader({ title, subtitle }) {
  return (
    <header className="border-b border-neutral-200 pb-5">
      <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
      <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
    </header>
  );
}