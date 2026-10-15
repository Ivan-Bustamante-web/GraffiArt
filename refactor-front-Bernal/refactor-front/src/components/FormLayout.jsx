export default function FormLayout({ children, className = "" }) {
  return (
    <main
      className={`min-h-[calc(100vh-53px)] px-4 py-10 ${className}`}
    >
      {children}
    </main>
  );
}