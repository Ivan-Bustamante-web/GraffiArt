const Container = ({ children }) => {
  return (
    <main className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-neutral-100 px-4 py-10">
      {children}
    </main>
  );
};

export default Container;
