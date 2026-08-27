import { useState, useEffect } from 'react';
import { getMateriales, crearMaterial, editarMaterial, eliminarMaterial } from '../services/materialService';

const CATEGORIAS = ['MDF', 'MELAMINA', 'METAL', 'VIDRIO', 'ACERO', 'ACCESORIO', 'OTRO'];
const UNIDADES = ['UNIDAD', 'KG', 'M', 'M2', 'CM', 'LATA', 'BOLSA'];

const FORM_VACIO = {
  nombre: '', codigo: '', categoria: 'MDF', unidadMedida: 'UNIDAD',
  stockActual: 0, stockMinimo: 0, costoUnitario: '', descripcion: '',
};

export default function Inventario() {
  const [materiales, setMateriales] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  const cargarMateriales = async () => {
    try {
      const data = await getMateriales();
      setMateriales(data);
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    }
  };

  useEffect(() => { cargarMateriales(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      stockActual: Number(form.stockActual),
      stockMinimo: Number(form.stockMinimo),
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
    } catch (err) {
      setError(editandoId ? 'Error al editar el material.' : 'Error al crear el material. Revisá que el código no esté repetido.');
    }
  };

  const handleEditarClick = (material) => {
    setEditandoId(material.id);
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
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que querés eliminar este material?')) return;
    await eliminarMaterial(id);
    if (editandoId === id) handleCancelarEdicion();
    cargarMateriales();
  };

    return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Inventario</h1>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} required className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select name="categoria" value={form.categoria} onChange={handleChange} className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="unidadMedida" value={form.unidadMedida} onChange={handleChange} className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <input name="stockActual" type="number" placeholder="Stock actual" value={form.stockActual} onChange={handleChange} className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="stockMinimo" type="number" placeholder="Stock mínimo" value={form.stockMinimo} onChange={handleChange} className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="costoUnitario" type="number" step="0.01" placeholder="Costo unitario" value={form.costoUnitario} onChange={handleChange} className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />

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