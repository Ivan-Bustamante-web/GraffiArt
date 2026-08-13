// src/data/cabinetsMock.js
//
// Datos de ejemplo mientras GA-11 (catálogo real de gabinetes) no esté listo.
// La idea es que ConfiguratorOptions consuma esta misma forma de datos
// sin importar si vienen de acá o de una API más adelante.

export const cabinetBase = {
  id: "gabinete-pc-01",
  nombre: "Gabinete ATX Mid Tower",
  descripcionCorta: "Torre personalizable para tu PC",
};

// Cada categoría es una sección dentro del panel de opciones (GA-12).
// "tipo" sirve para que el componente sepa cómo renderizar cada categoría
// (swatches de color, botones de tamaño, cards de material, etc).
export const categoriasConfigurables = [
  {
    id: "tamano",
    titulo: "Tamaño",
    tipo: "seleccion-simple",
    opciones: [
      { id: "mini-itx", label: "Mini-ITX", precioAdicional: 0 },
      { id: "micro-atx", label: "Micro-ATX", precioAdicional: 5000 },
      { id: "atx", label: "ATX Full Tower", precioAdicional: 12000 },
    ],
  },
  {
    id: "material",
    titulo: "Material",
    tipo: "seleccion-simple",
    opciones: [
      { id: "acero", label: "Acero", precioAdicional: 0 },
      { id: "acero-vidrio", label: "Acero + panel de vidrio templado", precioAdicional: 8000 },
      { id: "aluminio", label: "Aluminio", precioAdicional: 14000 },
    ],
  },
  {
    id: "color",
    titulo: "Color",
    tipo: "color",
    opciones: [
      { id: "negro", label: "Negro", hex: "#111111", precioAdicional: 0 },
      { id: "blanco", label: "Blanco", hex: "#F2F2F2", precioAdicional: 0 },
      { id: "gris", label: "Gris grafito", hex: "#4A4A4A", precioAdicional: 1500 },
    ],
  },
  {
    id: "accesorios",
    titulo: "Accesorios",
    tipo: "seleccion-multiple",
    opciones: [
      { id: "ventiladores-rgb", label: "Ventiladores RGB (x3)", precioAdicional: 7500 },
      { id: "filtro-polvo", label: "Filtros anti-polvo", precioAdicional: 2000 },
      { id: "controlador-rgb", label: "Controlador RGB", precioAdicional: 3500 },
    ],
  },
];

export const precioBase = 35000;