import { formatPrice } from "../../utils/format";
import { CONFIGURATOR_TEXTS } from "../../constants/CONFIGURATOR";

const idsSeleccionados = (valor) =>
  Array.isArray(valor) ? valor : valor ? [valor] : [];

// Suma el precio base + el precioAdicional de cada opción seleccionada.
const calcularPrecioTotal = (precioBase, categorias, seleccion) => {
  return categorias.reduce((total, categoria) => {
    return idsSeleccionados(seleccion[categoria.id]).reduce((acc, opcionId) => {
      const opcion = categoria.opciones.find((o) => o.id === opcionId);
      return acc + (opcion?.precioAdicional ?? 0);
    }, total);
  }, precioBase);
};

// Barra fija abajo con el precio estimado y un botón para consultar el diseño por mail.
// Props:
//   precioBase: precio del gabinete sin extras
//   categorias: todas las opciones disponibles con su precio
//   seleccion: opciones que eligió el usuario
const ConfiguratorSummary = ({ precioBase, categorias, seleccion }) => {
  const total = calcularPrecioTotal(precioBase, categorias, seleccion);
  const detalle = categorias.flatMap((categoria) =>
    idsSeleccionados(seleccion[categoria.id])
      .map((id) => categoria.opciones.find((opcion) => opcion.id === id)?.label)
      .filter(Boolean),
  );
  const resumen = detalle.length
    ? detalle.join(", ")
    : CONFIGURATOR_TEXTS.noExtras;
  const mensaje = CONFIGURATOR_TEXTS.mailBody(resumen, formatPrice(total));
  const consultaUrl = `mailto:${CONFIGURATOR_TEXTS.salesEmail}?subject=${encodeURIComponent(CONFIGURATOR_TEXTS.mailSubject)}&body=${encodeURIComponent(mensaje)}`;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-10 flex items-center justify-between border-t border-neutral-200 bg-white px-6 py-4">
      <div>
        <p className="text-xs text-neutral-500">{CONFIGURATOR_TEXTS.estimatedPrice}</p>
        <p className="text-lg font-semibold text-neutral-900">{formatPrice(total)}</p>
      </div>
      <a
        href={consultaUrl}
        className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        {CONFIGURATOR_TEXTS.consult}
      </a>
    </div>
  );
};

export default ConfiguratorSummary;
