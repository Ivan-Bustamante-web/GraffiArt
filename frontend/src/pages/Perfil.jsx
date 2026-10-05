import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SavedDesigns from '../components/SavedDesigns';
import { getPerfil, updatePerfil } from '../services/usuarioService';

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('graffiart_token');

    if (!token) {
      navigate('/login');
      return;
    }

    const cargarPerfil = async () => {
      try {
        const data = await getPerfil();
        setUsuario(data);
        setForm({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          telefono: data.telefono || '',
        });
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar tu perfil');
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const data = await updatePerfil(form);
      setUsuario(data);
      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('graffiart_token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleOpenSavedDesign = (configuracion) => {
    navigate('/', { state: { configuracion } });
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando perfil...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Mi perfil</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="border border-red-300 text-red-600 rounded px-3 py-2 hover:bg-red-50"
        >
          Cerrar sesión
        </button>
      </div>

      {error && <p className="mb-4 text-red-600">{error}</p>}
      {success && <p className="mb-4 text-green-600">{success}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-8">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              value={usuario?.email || ''}
              disabled
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Apellido</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>

        <div className="bg-white rounded shadow p-4">
          <SavedDesigns
            compact
            title="Mis diseños guardados"
            seleccion={{}}
            onLoadDesign={handleOpenSavedDesign}
            onAfterAction={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
