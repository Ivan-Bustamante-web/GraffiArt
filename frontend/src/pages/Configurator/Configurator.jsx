import ConfiguratorOptions from "../../components/ConfiguratorOptions/ConfiguratorOptions";
import ConfiguratorPreview from "../../components/ConfiguratorPreview/ConfiguratorPreview";
import ConfiguratorSummary from "../../components/ConfiguratorSummary/ConfiguratorSummary";
import MainContainer from "../../components/MainContainer/MainContainer";
import SavedDesigns from "../../components/SavedDesigns/SavedDesigns";
import {
  CABINET_BASE,
  CATEGORIAS_CONFIGURABLES,
  PRECIO_BASE,
} from "../../constants/CONFIGURATOR";
import useConfigurador from "../../hooks/useConfigurador";

// Página del configurador: el usuario arma su gabinete eligiendo opciones y ve el dibujo y el precio.
const Configurator = () => {
  const { seleccion, seleccionar, ubicar, cargarDiseno } = useConfigurador();

  return (
    <MainContainer
      title={CABINET_BASE.nombre}
      subtitle={CABINET_BASE.descripcionCorta}
      width="xl"
    >
      <div className="flex flex-col gap-6 pb-20 md:flex-row">
        <ConfiguratorPreview seleccion={seleccion} />
        <ConfiguratorOptions
          categorias={CATEGORIAS_CONFIGURABLES}
          seleccion={seleccion}
          onSeleccionar={seleccionar}
          onUbicar={ubicar}
        />
      </div>

      <SavedDesigns seleccion={seleccion} onLoadDesign={cargarDiseno} />

      <ConfiguratorSummary
        precioBase={PRECIO_BASE}
        categorias={CATEGORIAS_CONFIGURABLES}
        seleccion={seleccion}
      />
    </MainContainer>
  );
};

export default Configurator;
