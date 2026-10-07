export const cabinetBase = {
  id: "gabinete-pc-01",
  nombre: "Gabinete ATX Mid Tower",
  descripcionCorta: "Torre personalizable para tu PC",
};

export const ubicacionesGabinete = [
  { id: "frontal",     label: "Panel frontal" },
  { id: "superior",   label: "Panel superior" },
  { id: "trasero",    label: "Panel trasero" },
  { id: "lateral-izq", label: "Lateral izquierdo" },
  { id: "lateral-der", label: "Lateral derecho" },
];

export const categoriasConfigurables = [
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

export const precioBase = 35000;