import {
  CONFIGURATOR_TEXTS,
  UBICACIONES_GABINETE,
} from "../../constants/CONFIGURATOR";

// Botón redondeado para elegir una opción.
// Props:
//   label: texto de la opción
//   active: true si está elegida
//   onClick: qué hacer al tocarla
const OptionChip = ({ label, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
      }`}
    >
      {label}
    </button>
  );
};

// Círculo de color para elegir el color del gabinete.
// Props:
//   label: nombre del color
//   hex: código del color (por ejemplo #111111)
//   active: true si está elegido
//   onClick: qué hacer al tocarlo
const ColorSwatch = ({ label, hex, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`h-9 w-9 cursor-pointer rounded-full border-2 transition-all ${
        active ? "scale-110 border-neutral-900" : "border-neutral-300"
      }`}
      style={{ backgroundColor: hex }}
    />
  );
};

// Botones para elegir en qué parte del gabinete se coloca un accesorio.
// Props:
//   opcion: el accesorio y las ubicaciones donde puede ir
//   ubicacionActual: ubicación elegida hasta ahora
//   onUbicar: qué hacer al elegir una ubicación
const LocationSelector = ({ opcion, ubicacionActual, onUbicar }) => {
  const disponibles = UBICACIONES_GABINETE.filter((ubicacion) =>
    opcion.ubicacionesDisponibles?.includes(ubicacion.id),
  );
  if (!disponibles.length) return null;

  return (
    <div className="mt-2 ml-1 border-l-2 border-neutral-200 pl-3">
      <p className="mb-1 text-xs text-neutral-500">{CONFIGURATOR_TEXTS.location}</p>
      <div className="flex flex-wrap gap-1.5">
        {disponibles.map((ubicacion) => (
          <button
            key={ubicacion.id}
            type="button"
            onClick={() => onUbicar(opcion.id, ubicacion.id)}
            className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs transition-colors ${
              ubicacionActual === ubicacion.id
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-neutral-300 bg-white text-neutral-600 hover:border-blue-400"
            }`}
          >
            {ubicacion.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Un grupo de opciones del configurador (por ejemplo "Color" o "Accesorios").
// Props:
//   categoria: el grupo y sus opciones
//   valorSeleccionado: lo que el usuario eligió en este grupo
//   ubicaciones: dónde puso cada accesorio
//   onSeleccionar: qué hacer al elegir una opción
//   onUbicar: qué hacer al elegir una ubicación
const CategorySection = ({
  categoria,
  valorSeleccionado,
  ubicaciones,
  onSeleccionar,
  onUbicar,
}) => {
  const esMultiple = categoria.tipo === "seleccion-multiple";
  const esColor = categoria.tipo === "color";

  const estaActiva = (opcionId) =>
    esMultiple
      ? (valorSeleccionado || []).includes(opcionId)
      : valorSeleccionado === opcionId;

  return (
    <div className="border-b border-neutral-200 py-4 last:border-none">
      <h3 className="mb-3 text-sm font-medium text-neutral-900">
        {categoria.titulo}
      </h3>
      <div className={esColor ? "flex flex-wrap gap-2" : "flex flex-col items-start gap-2"}>
        {categoria.opciones.map((opcion) => {
          const activa = estaActiva(opcion.id);
          const handleClick = () =>
            onSeleccionar(categoria.id, opcion.id, esMultiple);

          return (
            <div key={opcion.id}>
              {esColor ? (
                <ColorSwatch
                  label={opcion.label}
                  hex={opcion.hex}
                  active={activa}
                  onClick={handleClick}
                />
              ) : (
                <OptionChip
                  label={opcion.label}
                  active={activa}
                  onClick={handleClick}
                />
              )}
              {esMultiple && activa && opcion.ubicacionesDisponibles && (
                <LocationSelector
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
};

// Panel lateral del configurador con todas las opciones para personalizar el gabinete.
// Props:
//   categorias: todos los grupos de opciones disponibles
//   seleccion: lo que el usuario eligió hasta ahora
//   onSeleccionar: qué hacer al elegir una opción
//   onUbicar: qué hacer al elegir dónde va un accesorio
const ConfiguratorOptions = ({
  categorias,
  seleccion,
  onSeleccionar,
  onUbicar,
}) => {
  return (
    <aside className="h-fit w-full rounded-xl border border-neutral-200 bg-white p-5 md:w-96">
      <h2 className="mb-1 text-base font-semibold text-neutral-900">
        {CONFIGURATOR_TEXTS.optionsTitle}
      </h2>
      <p className="mb-2 text-xs text-neutral-500">
        {CONFIGURATOR_TEXTS.optionsSubtitle}
      </p>
      {categorias.map((categoria) => (
        <CategorySection
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
};

export default ConfiguratorOptions;
