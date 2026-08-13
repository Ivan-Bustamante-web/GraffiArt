// src/components/configurator/ConfiguratorSummary.jsx

// Suma el precio base + el precioAdicional de cada opción seleccionada.
// Funciona tanto para selección simple (string) como múltiple (array de strings).
function calcularPrecioTotal(precioBase, categorias, seleccion) {
  let total = precioBase;

  categorias.forEach((categoria) => {
    const valor = seleccion[categoria.id];
    if (!valor) return;

    const idsSeleccionados = Array.isArray(valor) ? valor : [valor];

    idsSeleccionados.forEach((opcionId) => {
      const opcion = categoria.opciones.find((o) => o.id === opcionId);
      if (opcion) total += opcion.precioAdicional;
    });
  });

  return total;
}

function formatearPrecio(valor) {
  return valor.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

function ConfiguratorSummary({ precioBase, categorias, seleccion }) {
  const total = calcularPrecioTotal(precioBase, categorias, seleccion);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-neutral-500">Precio estimado</p>
        <p className="text-lg font-semibold text-neutral-900">{formatearPrecio(total)}</p>
      </div>

      <button
        type="button"
        className="px-5 py-2.5 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
      >
        Continuar
      </button>
    </div>
  );
}

export default ConfiguratorSummary;
