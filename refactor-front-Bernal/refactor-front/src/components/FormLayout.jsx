export default function FormLayout({ children, className = "" }) {
  return (
    <main
      className={`flex-1 px-4 py-10 ${className}`}
    >
      {children}
    </main>
  );
}