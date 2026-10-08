import { useEffect, useState } from 'react';
import {
  getProductos,
  crearProducto,
  editarProducto,
  eliminarProducto,
} from '../services/productoService';
import { getCategorias } from '../services/categoriaService';

const FORM_INICIAL = {
  nombre: '',
  marca: '',
  costoUnitario: '',
  stockActual: 0,
  stockMinimo: 0,
  tamano: 'MID_TOWER',
  formato: 'ATX',
  materialChasis: 'ACERO',
  panel: 'VIDRIO_TEMPLADO',
  categoriaId: '',
};

const nombresTamanos = {
  FULL_TOWER: 'Full Tower',
  MID_TOWER: 'Mid Tower',
  MINI_TOWER: 'Mini Tower',
};

const nombresMateriales = {
  ACERO: 'Acero',
  ALUMINIO: 'Aluminio',
};

const nombresPaneles = {
  VIDRIO_TEMPLADO: 'Vidrio templado',
  ACRILICO: 'Acrílico',
  MALLADO: 'Mallado',
};

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError('');
      const [productosData, categoriasData] = await Promise.all([
        getProductos(),
        getCategorias(),
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'No se pudieron cargar los datos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarDatos();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMensaje('');

    try {
      const productoData = {
        nombre: form.nombre.trim(),
        marca: form.marca.trim(),
        costoUnitario: Number(form.costoUnitario),
        stockActual: Number(form.stockActual),
        stockMinimo: Number(form.stockMinimo),
        tamano: form.tamano,
        formato: form.formato,
        materialChasis: form.materialChasis,
        panel: form.panel,
        categoriaId: form.categoriaId || null,
      };

      if (editandoId) {
        await editarProducto(editandoId, productoData);
        setMensaje('Producto actualizado correctamente.');
      } else {
        await crearProducto(productoData);
        setMensaje('Producto creado correctamente.');
      }

      setForm(FORM_INICIAL);
      setEditandoId(null);
      setProductos(await getProductos());
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'No se pudo guardar el producto.');
    }
  };

  const comenzarEdicion = (producto) => {
    setEditandoId(producto.id);
    setForm({
      nombre: producto.nombre || '',
      marca: producto.marca || '',
      costoUnitario: producto.costoUnitario || '',
      stockActual: producto.stockActual ?? 0,
      stockMinimo: producto.stockMinimo ?? 0,
      tamano: producto.tamano || 'MID_TOWER',
      formato: producto.formato || 'ATX',
      materialChasis: producto.materialChasis || 'ACERO',
      panel: producto.panel || 'VIDRIO_TEMPLADO',
      categoriaId: producto.categoriaId || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(FORM_INICIAL);
    setError('');
    setMensaje('');
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este producto?')) return;

    try {
      setError('');
      setMensaje('');
      await eliminarProducto(id);
      setProductos((prev) => prev.filter((producto) => producto.id !== id));
      setMensaje('Producto eliminado correctamente.');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'No se pudo eliminar el producto.');
    }
  };

  return (
    <main className="min-h-[calc(100vh-60px)] bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de productos</h1>
        <p className="mt-2 mb-6 text-gray-600">
          Creá, modificá y eliminá los productos disponibles en GraffiArt.
        </p>

        {error && <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">{error}</div>}
        {mensaje && <div className="mb-5 rounded-lg bg-green-100 p-4 text-green-700">{mensaje}</div>}

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-bold text-gray-800">
            {editandoId ? 'Editar producto' : 'Crear producto'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: GraffiArt Gamer X"
                  className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={form.marca}
                  onChange={handleChange}
                  required
                  placeholder="Ej: GraffiArt"
                  className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Costo unitario</label>
                <input
                  type="number"
                  name="costoUnitario"
                  value={form.costoUnitario}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Stock actual</label>
                <input
                  type="number"
                  name="stockActual"
                  value={form.stockActual}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Stock mínimo</label>
                <input
                  type="number"
                  name="stockMinimo"
                  value={form.stockMinimo}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Categoría</label>
              <select
                name="categoriaId"
                value={form.categoriaId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 outline-none focus:border-blue-500"
              >
                <option value="">Sin categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Tamaño</label>
                <select name="tamano" value={form.tamano} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 bg-white p-2.5">
                  <option value="FULL_TOWER">Full Tower</option>
                  <option value="MID_TOWER">Mid Tower</option>
                  <option value="MINI_TOWER">Mini Tower</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Formato</label>
                <select name="formato" value={form.formato} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 bg-white p-2.5">
                  <option value="ATX">ATX</option>
                  <option value="MICRO_ATX">Micro ATX</option>
                  <option value="ITX">ITX</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Material del chasis</label>
                <select name="materialChasis" value={form.materialChasis} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 bg-white p-2.5">
                  <option value="ACERO">Acero</option>
                  <option value="ALUMINIO">Aluminio</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de panel</label>
                <select name="panel" value={form.panel} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 bg-white p-2.5">
                  <option value="VIDRIO_TEMPLADO">Vidrio templado</option>
                  <option value="ACRILICO">Acrílico</option>
                  <option value="MALLADO">Mallado</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700">
                {editandoId ? 'Guardar cambios' : 'Crear producto'}
              </button>
              {editandoId && (
                <button type="button" onClick={cancelarEdicion} className="rounded-lg bg-gray-300 px-5 py-2.5 font-medium text-gray-800 hover:bg-gray-400">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl bg-white shadow">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800">Productos registrados</h2>
          </div>

          {cargando ? (
            <div className="p-6 text-center text-gray-500">Cargando productos...</div>
          ) : productos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Todavía no hay productos registrados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 text-left text-sm text-white">
                    <th className="p-3">Producto</th>
                    <th className="p-3">Marca</th>
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Costo</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Características</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{producto.nombre}</td>
                      <td className="p-3 text-gray-600">{producto.marca}</td>
                      <td className="p-3 text-gray-600">{producto.categoria?.nombre || 'Sin categoría'}</td>
                      <td className="p-3 text-gray-600">${Number(producto.costoUnitario).toFixed(2)}</td>
                      <td className="p-3 text-gray-600">{producto.stockActual}</td>
                      <td className="p-3 text-sm text-gray-600">
                        <div>{nombresTamanos[producto.tamano] || producto.tamano}</div>
                        <div>{producto.formato}</div>
                        <div>{nombresMateriales[producto.materialChasis] || producto.materialChasis}</div>
                        <div>{nombresPaneles[producto.panel] || producto.panel}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-3">
                          <button type="button" onClick={() => comenzarEdicion(producto)} className="text-blue-600 hover:text-blue-800">
                            Editar
                          </button>
                          <button type="button" onClick={() => eliminar(producto.id)} className="text-red-600 hover:text-red-800">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
