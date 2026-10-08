import { useState, useEffect } from 'react';
import { getMateriales, crearMaterial, editarMaterial, eliminarMaterial } from '../services/materialService';

const CATEGORIAS = ['MDF', 'MELAMINA', 'METAL', 'VIDRIO', 'ACERO', 'ACCESORIO', 'OTRO'];
const UNIDADES = ['UNIDAD', 'KG', 'M', 'M2', 'CM', 'LATA', 'BOLSA'];

const FORM_VACIO = {
  nombre: '', codigo: '', categoria: 'MDF', unidadMedida: 'UNIDAD',
  stockActual: '', stockMinimo: '', costoUnitario: '', descripcion: '',
};

const INPUT_CLASS = 'w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500';
const LABEL_CLASS = 'block text-sm font-medium text-gray-700 mb-1';

export default function Inventario() {
  const [materiales, setMateriales] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const materialesBajoStock = materiales.filter(
    (material) => material.stockActual < material.stockMinimo,
  );

  const cargarMateriales = async () => {
    try {
      const data = await getMateriales();
      setMateriales(data);
    } catch {
      setError('No se pudo conectar con el servidor');
    }
  };

  useEffect(() => {
    let cancelado = false;
    getMateriales()
      .then((data) => { if (!cancelado) setMateriales(data); })
      .catch(() => { if (!cancelado) setError('No se pudo conectar con el servidor'); });
    return () => { cancelado = true; };
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stockActual = Number(form.stockActual);
    const stockMinimo = Number(form.stockMinimo);

    // El stock nunca puede ser 0 (ni negativo, ni con decimales)
    if (
      !Number.isInteger(stockActual) || stockActual < 1 ||
      !Number.isInteger(stockMinimo) || stockMinimo < 1
    ) {
      setError('El stock actual y el stock mínimo tienen que ser números enteros mayores a 0.');
      return;
    }

    const payload = {
      ...form,
      stockActual,
      stockMinimo,
      costoUnitario: form.costoUnitario ? Number(form.costoUnitario) : null,
    };

    try {
      if (editandoId) {
        await editarMaterial(editandoId, payload);
      } else {
        await crearMaterial(payload);
      }
      setForm(FORM_VACIO);
      setEditandoId(null);
      setError('');
      cargarMateriales();
    } catch (requestError) {
      const status = requestError.response?.status;
      if (status === 401 || status === 403) {
        setError('Necesitás iniciar sesión como administrador para modificar materiales.');
      } else {
        setError(editandoId ? 'Error al editar el material.' : 'Error al crear el material. Revisá que el código no esté repetido.');
      }
    }
  };

  const handleEditarClick = (material) => {
    setEditandoId(material.id);
    setError('');
    setForm({
      nombre: material.nombre,
      codigo: material.codigo,
      categoria: material.categoria,
      unidadMedida: material.unidadMedida,
      stockActual: material.stockActual,
      stockMinimo: material.stockMinimo,
      costoUnitario: material.costoUnitario ?? '',
      descripcion: material.descripcion ?? '',
    });
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setError('');
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que querés eliminar este material?')) return;
    try {
      await eliminarMaterial(id);
      if (editandoId === id) handleCancelarEdicion();
      cargarMateriales();
    } catch (requestError) {
      const status = requestError.response?.status;
      setError(
        status === 401 || status === 403
          ? 'Necesitás iniciar sesión como administrador para eliminar materiales.'
          : 'Error al eliminar el material.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Inventario</h1>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</p>
        )}

        {materialesBajoStock.length > 0 && (
          <section role="alert" className="bg-amber-50 border border-amber-300 text-amber-950 p-4 mb-6">
            <h2 className="font-semibold mb-2">Productos que requieren reposición</h2>
            <ul className="space-y-1 text-sm">
              {materialesBajoStock.map((material) => (
                <li key={material.id}>
                  <strong>{material.nombre}</strong>: stock actual {material.stockActual} {material.unidadMedida},
                  {' '}mínimo {material.stockMinimo} {material.unidadMedida}.
                </li>
              ))}
            </ul>
          </section>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className={INPUT_CLASS} />
          <input name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} required className={INPUT_CLASS} />
          <select name="categoria" value={form.categoria} onChange={handleChange} className={INPUT_CLASS}>
            {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="unidadMedida" value={form.unidadMedida} onChange={handleChange} className={INPUT_CLASS}>
            {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>

          <div>
            <label htmlFor="stockActual" className={LABEL_CLASS}>Cantidad de stock actual</label>
            <input
              id="stockActual"
              name="stockActual"
              type="number"
              min="1"
              step="1"
              placeholder="Ej: 10"
              value={form.stockActual}
              onChange={handleChange}
              required
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="stockMinimo" className={LABEL_CLASS}>Cantidad de stock mínimo</label>
            <input
              id="stockMinimo"
              name="stockMinimo"
              type="number"
              min="1"
              step="1"
              placeholder="Ej: 5"
              value={form.stockMinimo}
              onChange={handleChange}
              required
              className={INPUT_CLASS}
            />
          </div>

          <input name="costoUnitario" type="number" step="0.01" placeholder="Costo unitario" value={form.costoUnitario} onChange={handleChange} className={INPUT_CLASS} />
          <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className={INPUT_CLASS} />

          <div className="sm:col-span-2 flex gap-2 mt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors">
              {editandoId ? 'Guardar cambios' : 'Agregar material'}
            </button>
            {editandoId && (
              <button type="button" onClick={handleCancelarEdicion} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-medium hover:bg-gray-400 transition-colors">
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800 text-white text-sm">
                <th className="p-3">Nombre</th>
                <th className="p-3">Código</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materiales.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400">No hay materiales cargados todavía</td>
                </tr>
              )}
              {materiales.map((m) => (
                <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">{m.nombre}</td>
                  <td className="p-3 text-gray-500">{m.codigo}</td>
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{m.categoria}</span>
                  </td>
                  <td className="p-3">{m.stockActual} {m.unidadMedida}</td>
                  <td className="p-3 flex gap-3">
                    <button onClick={() => handleEditarClick(m)} className="text-blue-600 hover:underline text-sm">Editar</button>
                    <button onClick={() => handleEliminar(m.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}