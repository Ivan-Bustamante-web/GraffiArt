import { Link } from 'react-router-dom';

export default function Admin() {
  return (
    <main className="min-h-[calc(100vh-60px)] bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800">Panel de administración</h1>
        <p className="mt-2 mb-8 text-gray-600">
          Administrá las categorías y productos de GraffiArt.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/admin/categorias"
            className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="mb-2 text-xl font-bold text-gray-800">Categorías</h2>
            <p className="text-gray-600">
              Crear, editar y eliminar categorías de productos.
            </p>
          </Link>

          <Link
            to="/admin/productos"
            className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="mb-2 text-xl font-bold text-gray-800">Productos</h2>
            <p className="text-gray-600">
              Crear, editar y eliminar los productos del catálogo.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
