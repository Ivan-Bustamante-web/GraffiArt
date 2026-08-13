// src/components/configurator/ConfiguratorOptions.jsx

// Renderiza cada categoría del catálogo (medidas, material, color, accesorios).
// El "tipo" de cada categoría define cómo se pintan sus opciones:
// - seleccion-simple / seleccion-multiple → botones tipo chip
// - color → swatches de color
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

function CategoriaSection({ categoria, valorSeleccionado, onSeleccionar }) {
  const esMultiple = categoria.tipo === "seleccion-multiple";
  const esColor = categoria.tipo === "color";

  const estaActiva = (opcionId) => {
    if (esMultiple) {
      return (valorSeleccionado || []).includes(opcionId);
    }
    return valorSeleccionado === opcionId;
  };

  return (
    <div className="py-4 border-b border-neutral-200 last:border-none">
      <h3 className="text-sm font-medium text-neutral-900 mb-3">{categoria.titulo}</h3>
      <div className="flex flex-wrap gap-2">
        {categoria.opciones.map((opcion) => {
          const activa = estaActiva(opcion.id);
          const handleClick = () => onSeleccionar(categoria.id, opcion.id, esMultiple);

          return esColor ? (
            <OpcionColor key={opcion.id} opcion={opcion} activa={activa} onClick={handleClick} />
          ) : (
            <OpcionChip key={opcion.id} opcion={opcion} activa={activa} onClick={handleClick} />
          );
        })}
      </div>
    </div>
  );
}

function ConfiguratorOptions({ categorias, seleccion, onSeleccionar }) {
  return (
    <aside className="w-full md:w-96 bg-white rounded-lg border border-neutral-200 p-5 h-fit">
      <h2 className="text-base font-semibold text-neutral-900 mb-1">Personalizá tu gabinete</h2>
      <p className="text-xs text-neutral-500 mb-2">Elegí las opciones para armar tu diseño</p>

      {categorias.map((categoria) => (
        <CategoriaSection
          key={categoria.id}
          categoria={categoria}
          valorSeleccionado={seleccion[categoria.id]}
          onSeleccionar={onSeleccionar}
        />
      ))}
    </aside>
  );
}

export default ConfiguratorOptions;
