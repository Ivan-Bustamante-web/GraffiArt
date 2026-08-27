import { useState, useEffect } from 'react';
import { getMateriales, crearMaterial, eliminarMaterial } from '../services/materialService';

const CATEGORIAS = ['MDF', 'MELAMINA', 'METAL', 'VIDRIO', 'ACERO', 'ACCESORIO', 'OTRO'];
const UNIDADES = ['UNIDAD', 'KG', 'M', 'M2', 'CM', 'LATA', 'BOLSA'];

export default function Inventario() {
  const [materiales, setMateriales] = useState([]);
  const [form, setForm] = useState({
    nombre: '', codigo: '', categoria: 'MDF', unidadMedida: 'UNIDAD',
    stockActual: 0, stockMinimo: 0, costoUnitario: '', descripcion: '',
  });
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
    try {
      await crearMaterial({
        ...form,
        stockActual: Number(form.stockActual),
        stockMinimo: Number(form.stockMinimo),
        costoUnitario: form.costoUnitario ? Number(form.costoUnitario) : null,
      });
      setForm({ nombre: '', codigo: '', categoria: 'MDF', unidadMedida: 'UNIDAD', stockActual: 0, stockMinimo: 0, costoUnitario: '', descripcion: '' });
      cargarMateriales();
    } catch (err) {
      setError('Error al crear el material. Revisá que el código no esté repetido.');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que querés eliminar este material?')) return;
    await eliminarMaterial(id);
    cargarMateriales();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Inventario</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-8 bg-gray-100 p-4 rounded">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="border p-2 rounded" />
        <input name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} required className="border p-2 rounded" />
        <select name="categoria" value={form.categoria} onChange={handleChange} className="border p-2 rounded">
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="unidadMedida" value={form.unidadMedida} onChange={handleChange} className="border p-2 rounded">
          {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <input name="stockActual" type="number" placeholder="Stock actual" value={form.stockActual} onChange={handleChange} className="border p-2 rounded" />
        <input name="stockMinimo" type="number" placeholder="Stock mínimo" value={form.stockMinimo} onChange={handleChange} className="border p-2 rounded" />
        <input name="costoUnitario" type="number" step="0.01" placeholder="Costo unitario" value={form.costoUnitario} onChange={handleChange} className="border p-2 rounded" />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="border p-2 rounded" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Agregar material</button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Código</th>
            <th className="p-2 text-left">Categoría</th>
            <th className="p-2 text-left">Stock</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materiales.map((m) => (
            <tr key={m.id} className="border-b">
              <td className="p-2">{m.nombre}</td>
              <td className="p-2">{m.codigo}</td>
              <td className="p-2">{m.categoria}</td>
              <td className="p-2">{m.stockActual} {m.unidadMedida}</td>
              <td className="p-2">
                <button onClick={() => handleEliminar(m.id)} className="text-red-600 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}