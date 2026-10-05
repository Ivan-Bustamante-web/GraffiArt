import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ConfiguratorPreview from "../components/configurator/ConfiguratorPreview";
import ConfiguratorOptions from "../components/configurator/ConfiguratorOptions";
import ConfiguratorSummary from "../components/configurator/ConfiguratorSummary";
import SavedDesigns from "../components/SavedDesigns";
import { cabinetBase, categoriasConfigurables, precioBase } from "../data/cabinetsMock";

function ConfiguratorPage() {
  const location = useLocation();
  const [seleccion, setSeleccion] = useState({});

  useEffect(() => {
    const configuracion = location.state?.configuracion;
    if (configuracion) {
      setSeleccion(configuracion);
    }
  }, [location.state]);

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

  const handleLoadDesign = (configuracion) => {
    setSeleccion(configuracion || {});
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

      <div className="px-6">
        <SavedDesigns seleccion={seleccion} onLoadDesign={handleLoadDesign} />
      </div>
    </div>
  );
}

export default ConfiguratorPage;