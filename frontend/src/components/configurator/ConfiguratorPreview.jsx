// src/components/configurator/ConfiguratorPreview.jsx

// Por ahora es un placeholder visual. Más adelante (fuera de GA-12) acá
// va a ir el render real del gabinete según la selección del usuario
// (imagen dinámica, canvas, o modelo 3D — a definir).
function ConfiguratorPreview({ cabinet, seleccion }) {
  const cantidadSeleccionada = Object.keys(seleccion).length;

  return (
    <div className="flex-1 bg-white rounded-lg border border-neutral-200 flex flex-col items-center justify-center min-h-[320px] md:min-h-[480px]">
      <div className="w-40 h-40 rounded-md bg-neutral-100 border border-dashed border-neutral-300 flex items-center justify-center mb-4">
        <span className="text-xs text-neutral-400 text-center px-2">
          Vista previa de {cabinet.nombre}
        </span>
      </div>

      <p className="text-xs text-neutral-400">
        {cantidadSeleccionada === 0
          ? "Todavía no elegiste ninguna opción"
          : `${cantidadSeleccionada} categoría(s) configurada(s)`}
      </p>
    </div>
  );
}

export default ConfiguratorPreview;
