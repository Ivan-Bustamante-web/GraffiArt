import { FORMATOS, PANELES, SPEC_LABELS, TAMANOS } from "../constants/CATALOGO";
import { MESSAGES } from "../constants/MESSAGES";

export const gabineteToProduct = (gabinete) => ({
  ...gabinete,
  name: gabinete.nombre,
  price: gabinete.costoUnitario,
  subtitle: `${MESSAGES.labels.brand}: ${gabinete.marca}`,
  specs: [
    { label: SPEC_LABELS.format, value: FORMATOS[gabinete.formato] ?? gabinete.formato },
    { label: SPEC_LABELS.size, value: TAMANOS[gabinete.tamano] ?? gabinete.tamano },
    { label: SPEC_LABELS.panel, value: PANELES[gabinete.panel] ?? gabinete.panel },
  ],
});
