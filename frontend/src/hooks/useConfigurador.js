import { useState } from "react";
import { useLocation } from "react-router";

const useConfigurador = () => {
  const location = useLocation();
  const [seleccion, setSeleccion] = useState(
    () => location.state?.configuracion ?? {},
  );

  const seleccionar = (categoriaId, opcionId, esMultiple) => {
    setSeleccion((prev) => {
      if (!esMultiple) return { ...prev, [categoriaId]: opcionId };

      const actuales = prev[categoriaId] || [];
      const yaEstaba = actuales.includes(opcionId);
      const nuevos = yaEstaba
        ? actuales.filter((id) => id !== opcionId)
        : [...actuales, opcionId];

      // si se deselecciona, limpiamos su ubicación
      const ubicaciones = { ...(prev.ubicaciones || {}) };
      if (yaEstaba) delete ubicaciones[opcionId];

      return { ...prev, [categoriaId]: nuevos, ubicaciones };
    });
  };

  const ubicar = (accesorioId, ubicacionId) => {
    setSeleccion((prev) => ({
      ...prev,
      ubicaciones: { ...(prev.ubicaciones || {}), [accesorioId]: ubicacionId },
    }));
  };

  const cargarDiseno = (configuracion) => setSeleccion(configuracion || {});

  return { seleccion, seleccionar, ubicar, cargarDiseno };
};

export default useConfigurador;
