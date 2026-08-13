// src/pages/ConfiguratorPage.jsx
import { useState } from "react";
import ConfiguratorPreview from "../components/configurator/ConfiguratorPreview";
import ConfiguratorOptions from "../components/configurator/ConfiguratorOptions";
import ConfiguratorSummary from "../components/configurator/ConfiguratorSummary";
import { cabinetBase, categoriasConfigurables, precioBase } from "../data/cabinetsMock";

// Estado central de la selección del usuario.
// Forma: { [categoriaId]: opcionId | opcionId[] }
// Por ahora solo maneja el estado, sin lógica de negocio (eso es de otra tarea/sprint).
function ConfiguratorPage() {
  const [seleccion, setSeleccion] = useState({});

  const handleSeleccionar = (categoriaId, opcionId, esMultiple) => {
    setSeleccion((prev) => {
      if (!esMultiple) {
        return { ...prev, [categoriaId]: opcionId };
      }

      const actuales = prev[categoriaId] || [];
      const yaEstaba = actuales.includes(opcionId);
      const nuevos = yaEstaba
        ? actuales.filter((id) => id !== opcionId)
        : [...actuales, opcionId];

      return { ...prev, [categoriaId]: nuevos };
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <header className="px-6 py-5 border-b border-neutral-200 bg-white">
        <h1 className="text-xl font-semibold text-neutral-900">{cabinetBase.nombre}</h1>
        <p className="text-sm text-neutral-500">{cabinetBase.descripcionCorta}</p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 p-6">
        <ConfiguratorPreview cabinet={cabinetBase} seleccion={seleccion} />

        <ConfiguratorOptions
          categorias={categoriasConfigurables}
          seleccion={seleccion}
          onSeleccionar={handleSeleccionar}
        />
      </div>

      <ConfiguratorSummary
        precioBase={precioBase}
        categorias={categoriasConfigurables}
        seleccion={seleccion}
      />
    </div>
  );
}

export default ConfiguratorPage;