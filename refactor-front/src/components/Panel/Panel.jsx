
const Panel = ({ children }) => {
  return (
    <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg">
      {children}
    </section>
  );
};

export default Panel;
