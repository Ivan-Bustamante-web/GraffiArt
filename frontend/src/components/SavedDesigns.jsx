import { useEffect, useState } from 'react';
import { listarDisenos, crearDiseno, actualizarDiseno, eliminarDiseno } from '../services/disenoService';

function formatConfigSummary(configuracion) {
  if (!configuracion) return 'Sin configuración';

  const items = [];
  if (configuracion.tamano) items.push(`Tamaño: ${configuracion.tamano}`);
  if (configuracion.material) items.push(`Material: ${configuracion.material}`);
  if (configuracion.color) items.push(`Color: ${configuracion.color}`);
  if (configuracion.accesorios?.length) items.push(`Accesorios: ${configuracion.accesorios.length}`);

  return items.length ? items.join(' • ') : 'Configuración disponible';
}

export default function SavedDesigns({
  seleccion,
  onLoadDesign,
  compact = false,
  onAfterAction,
  title = 'Diseños guardados',
}) {
  const [disenos, setDisenos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cargarDisenos = async () => {
    try {
      const data = await listarDisenos();
      setDisenos(data);
    } catch (error) {
      console.error('No se pudieron cargar los diseños guardados', error);
      setError('No se pudieron cargar los diseños guardados. Iniciá sesión e intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDisenos();
  }, []);

  const guardarDiseno = async () => {
    if (!nombre.trim()) return;

    setGuardando(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        nombre: nombre.trim(),
        descripcion: 'Diseño personalizado guardado',
        configuracion: seleccion,
      };

      const nuevo = await crearDiseno(payload);
      setDisenos((prev) => [nuevo, ...prev]);
      setNombre('');
      setSuccess('Diseño guardado correctamente.');
      if (onAfterAction) onAfterAction();
    } catch (err) {
      const message = err.response?.data?.error || 'No se pudo guardar el diseño.';
      setError(message);
    } finally {
      setGuardando(false);
    }
  };

  const actualizarNombre = async (id, currentName) => {
    const nextName = window.prompt('Nuevo nombre del diseño', currentName);
    if (!nextName || !nextName.trim()) return;

    try {
      const actualizado = await actualizarDiseno(id, { nombre: nextName.trim() });
      setDisenos((prev) => prev.map((d) => (d.id === id ? actualizado : d)));
      setSuccess('Nombre actualizado.');
      if (onAfterAction) onAfterAction();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo renombrar el diseño.');
    }
  };

  const borrarDiseno = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este diseño?')) return;

    try {
      await eliminarDiseno(id);
      setDisenos((prev) => prev.filter((d) => d.id !== id));
      setSuccess('Diseño eliminado.');
      if (onAfterAction) onAfterAction();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo eliminar el diseño.');
    }
  };

  const contenido = (
    <>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {success && <p className="mb-3 text-sm text-green-600">{success}</p>}

      {!compact && (
        <div className="flex gap-2 mb-4">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del diseño"
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="button"
            onClick={guardarDiseno}
            disabled={guardando || !nombre.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Cargando diseños...</p>
      ) : disenos.length === 0 ? (
        <p className="text-sm text-gray-500">Todavía no tienes diseños guardados.</p>
      ) : (
        <ul className="space-y-3">
          {disenos.map((d) => (
            <li key={d.id} className="border rounded p-3 bg-neutral-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-neutral-900">{d.nombre}</div>
                  <div className="text-xs text-gray-500">{formatConfigSummary(d.configuracion)}</div>
                  <div className="text-[11px] text-gray-400 mt-1">{new Date(d.updatedAt).toLocaleString()}</div>
                </div>

                <div className="flex gap-2 md:ml-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onLoadDesign(d.configuracion)}
                    className="text-sm bg-blue-600 text-white rounded px-3 py-1.5"
                  >
                    Abrir
                  </button>
                  <button
                    type="button"
                    onClick={() => actualizarNombre(d.id, d.nombre)}
                    className="text-sm text-gray-700 border rounded px-2 py-1.5"
                  >
                    Renombrar
                  </button>
                  <button
                    type="button"
                    onClick={() => borrarDiseno(d.id)}
                    className="text-sm text-red-600 border border-red-200 rounded px-2 py-1.5"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return compact ? (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-neutral-900">{title}</h3>
      {contenido}
    </div>
  ) : (
    <div className="mt-8 border rounded-xl bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {contenido}
    </div>
  );
}
