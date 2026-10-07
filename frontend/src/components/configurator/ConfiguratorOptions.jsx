import { ubicacionesGabinete } from "../../data/cabinetsMock";

function OpcionChip({ opcion, activa, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
        activa
          ? "bg-neutral-900 border-neutral-900 text-white"
          : "bg-white border-neutral-300 text-neutral-700 hover:border-neutral-500"
      }`}
    >
      {opcion.label}
    </button>
  );
}

function OpcionColor({ opcion, activa, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={opcion.label}
      className={`w-9 h-9 rounded-full border-2 transition-all ${
        activa ? "border-neutral-900 scale-110" : "border-neutral-300"
      }`}
      style={{ backgroundColor: opcion.hex }}
    />
  );
}

function UbicacionSelector({ opcion, ubicacionActual, onUbicar }) {
  const disponibles = ubicacionesGabinete.filter((u) =>
    opcion.ubicacionesDisponibles?.includes(u.id)
  );
  if (!disponibles.length) return null;

  return (
    <div className="mt-2 ml-1 pl-3 border-l-2 border-neutral-200">
      <p className="text-xs text-neutral-500 mb-1">Ubicación:</p>
      <div className="flex flex-wrap gap-1.5">
        {disponibles.map((ub) => (
          <button
            key={ub.id}
            type="button"
            onClick={() => onUbicar(opcion.id, ub.id)}
            className={`px-2.5 py-1 rounded-full border text-xs transition-colors ${
              ubicacionActual === ub.id
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-neutral-300 text-neutral-600 hover:border-blue-400"
            }`}
          >
            {ub.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CategoriaSection({ categoria, valorSeleccionado, ubicaciones, onSeleccionar, onUbicar }) {
  const esMultiple = categoria.tipo === "seleccion-multiple";
  const esColor = categoria.tipo === "color";

  const estaActiva = (opcionId) => {
    if (esMultiple) return (valorSeleccionado || []).includes(opcionId);
    return valorSeleccionado === opcionId;
  };

  return (
    <div className="py-4 border-b border-neutral-200 last:border-none">
      <h3 className="text-sm font-medium text-neutral-900 mb-3">{categoria.titulo}</h3>
      <div className={esColor ? "flex flex-wrap gap-2" : "flex flex-col gap-2"}>
        {categoria.opciones.map((opcion) => {
          const activa = estaActiva(opcion.id);
          const handleClick = () => onSeleccionar(categoria.id, opcion.id, esMultiple);

          return (
            <div key={opcion.id}>
              {esColor ? (
                <OpcionColor opcion={opcion} activa={activa} onClick={handleClick} />
              ) : (
                <OpcionChip opcion={opcion} activa={activa} onClick={handleClick} />
              )}
              {esMultiple && activa && opcion.ubicacionesDisponibles && (
                <UbicacionSelector
                  opcion={opcion}
                  ubicacionActual={ubicaciones?.[opcion.id]}
                  onUbicar={onUbicar}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConfiguratorOptions({ categorias, seleccion, onSeleccionar, onUbicar }) {
  return (
    <aside className="w-full md:w-96 bg-white rounded-lg border border-neutral-200 p-5 h-fit">
      <h2 className="text-base font-semibold text-neutral-900 mb-1">Personalizá tu gabinete</h2>
      <p className="text-xs text-neutral-500 mb-2">Elegí las opciones para armar tu diseño</p>
      {categorias.map((categoria) => (
        <CategoriaSection
          key={categoria.id}
          categoria={categoria}
          valorSeleccionado={seleccion[categoria.id]}
          ubicaciones={seleccion.ubicaciones}
          onSeleccionar={onSeleccionar}
          onUbicar={onUbicar}
        />
      ))}
    </aside>
  );
}

export default ConfiguratorOptions;