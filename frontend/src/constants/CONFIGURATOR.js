export const CABINET_BASE = {
  id: "gabinete-pc-01",
  nombre: "Gabinete ATX Mid Tower",
  descripcionCorta: "Torre personalizable para tu PC",
};

export const UBICACIONES_GABINETE = [
  { id: "frontal",     label: "Panel frontal" },
  { id: "superior",   label: "Panel superior" },
  { id: "trasero",    label: "Panel trasero" },
  { id: "lateral-izq", label: "Lateral izquierdo" },
  { id: "lateral-der", label: "Lateral derecho" },
];

export const CATEGORIAS_CONFIGURABLES = [
  {
    id: "tamano",
    titulo: "Tamaño",
    tipo: "seleccion-simple",
    opciones: [
      { id: "mini-itx",  label: "Mini-ITX",      precioAdicional: 0 },
      { id: "micro-atx", label: "Micro-ATX",      precioAdicional: 5000 },
      { id: "atx",       label: "ATX Full Tower", precioAdicional: 12000 },
    ],
  },
  {
    id: "material",
    titulo: "Material",
    tipo: "seleccion-simple",
    opciones: [
      { id: "acero",        label: "Acero",                          precioAdicional: 0 },
      { id: "acero-vidrio", label: "Acero + panel de vidrio templado", precioAdicional: 8000 },
      { id: "aluminio",     label: "Aluminio",                       precioAdicional: 14000 },
    ],
  },
  {
    id: "color",
    titulo: "Color",
    tipo: "color",
    opciones: [
      { id: "negro", label: "Negro",        hex: "#111111", precioAdicional: 0 },
      { id: "blanco", label: "Blanco",      hex: "#F2F2F2", precioAdicional: 0 },
      { id: "gris",  label: "Gris grafito", hex: "#4A4A4A", precioAdicional: 1500 },
    ],
  },
  {
    id: "accesorios",
    titulo: "Accesorios",
    tipo: "seleccion-multiple",
    opciones: [
      {
        id: "ventiladores-rgb",
        label: "Ventiladores RGB (x3)",
        precioAdicional: 7500,
        ubicacionesDisponibles: ["frontal", "superior", "trasero"],
      },
      {
        id: "filtro-polvo",
        label: "Filtros anti-polvo",
        precioAdicional: 2000,
        ubicacionesDisponibles: ["frontal", "superior"],
      },
      {
        id: "controlador-rgb",
        label: "Controlador RGB",
        precioAdicional: 3500,
        ubicacionesDisponibles: ["frontal"],
      },
      {
        id: "panel-vidrio",
        label: "Panel lateral de vidrio",
        precioAdicional: 5000,
        ubicacionesDisponibles: ["lateral-izq", "lateral-der"],
      },
      {
        id: "tiras-led",
        label: "Tiras LED internas",
        precioAdicional: 2500,
        ubicacionesDisponibles: ["superior", "lateral-izq", "lateral-der"],
      },
    ],
  },
];

export const PRECIO_BASE = 35000;
export const COLORES_GABINETE = {
  negro: { base: "#1c1c1c", panel: "#252525", detalle: "#333", borde: "#444", texto: "#666" },
  blanco: { base: "#e8e8e8", panel: "#f2f2f2", detalle: "#ddd", borde: "#bbb", texto: "#aaa" },
  gris: { base: "#2e2e2e", panel: "#3a3a3a", detalle: "#444", borde: "#555", texto: "#777" },
};

export const ICONOS_ACCESORIOS = {
  "ventiladores-rgb": "",
  "filtro-polvo": "",
  "controlador-rgb": "",
  "panel-vidrio": "",
  "tiras-led": "",
};

export const CONFIGURATOR_TEXTS = {
  optionsTitle: "Personalizá tu gabinete",
  optionsSubtitle: "Elegí las opciones para armar tu diseño",
  location: "Ubicación:",
  previewEmpty: "Seleccioná accesorios para ver el preview",
  placed: "· ubicado",
  notPlaced: "· sin ubicar",
  estimatedPrice: "Precio estimado",
  consult: "Consultar diseño",
  noExtras: "Sin personalizaciones adicionales",
  salesEmail: "ventas@graffiart.com",
  mailSubject: "Consulta por gabinete personalizado",
  mailBody: (resumen, precio) =>
    `Hola, quiero consultar por un gabinete personalizado. Configuración: ${resumen}. Precio estimado: ${precio}.`,
};
