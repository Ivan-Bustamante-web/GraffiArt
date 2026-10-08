import { useEffect, useState } from 'react';
import {
  getCategorias,
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
} from '../services/categoriaService';

const FORM_INICIAL = { nombre: '', descripcion: '' };

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarCategorias = async () => {
    try {
      setError('');
      setCategorias(await getCategorias());
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'No se pudieron cargar las categorías.');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarCategorias();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMensaje('');

    try {
      if (editandoId) {
        await editarCategoria(editandoId, form);
        setMensaje('Categoría actualizada correctamente.');
      } else {
        await crearCategoria(form);
        setMensaje('Categoría creada correctamente.');
      }

      setForm(FORM_INICIAL);
      setEditandoId(null);
      await cargarCategorias();
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'No se pudo guardar la categoría.');
    }
  };

  const editar = (categoria) => {
    setEditandoId(categoria.id);
    setForm({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar esta categoría?')) return;

    try {
      setError('');
      setMensaje('');
      await eliminarCategoria(id);
      await cargarCategorias();
      setMensaje('Categoría eliminada correctamente.');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'No se pudo eliminar la categoría.');
    }
  };

  const cancelar = () => {
    setEditandoId(null);
    setForm(FORM_INICIAL);
    setError('');
    setMensaje('');
  };

  return (
    <main className="min-h-[calc(100vh-60px)] bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">Gestión de categorías</h1>
        <p className="mb-6 text-gray-600">Administrá las categorías de los productos de GraffiArt.</p>

        {error && <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">{error}</div>}
        {mensaje && <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">{mensaje}</div>}

        <form onSubmit={handleSubmit} className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            {editandoId ? 'Editar categoría' : 'Crear categoría'}
          </h2>

          <div className="space-y-4">
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre de la categoría"
              required
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500"
            />

            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción"
              rows="3"
              className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500"
            />

            <div className="flex gap-3">
              <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700">
                {editandoId ? 'Guardar cambios' : 'Crear categoría'}
              </button>
              {editandoId && (
                <button type="button" onClick={cancelar} className="rounded-lg bg-gray-300 px-5 py-2.5 font-medium text-gray-800 hover:bg-gray-400">
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>

        <section className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-left text-white">
                <th className="p-3">Nombre</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Productos</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="border-b border-gray-200">
                  <td className="p-3 font-medium">{categoria.nombre}</td>
                  <td className="p-3">{categoria.descripcion || '-'}</td>
                  <td className="p-3">{categoria._count?.productos || 0}</td>
                  <td className="p-3">
                    <button onClick={() => editar(categoria)} className="mr-4 text-blue-600 hover:text-blue-800">Editar</button>
                    <button onClick={() => eliminar(categoria.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
