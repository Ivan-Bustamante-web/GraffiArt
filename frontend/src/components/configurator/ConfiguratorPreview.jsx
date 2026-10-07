import { categoriasConfigurables, ubicacionesGabinete } from "../../data/cabinetsMock";

const COLORES = {
  negro: "#111111",
  blanco: "#F2F2F2",
  gris: "#4A4A4A",
};

const ZONAS = [
  { id: "superior",    label: "Superior",   style: { top: 0, left: "20%", width: "60%", height: "12%" } },
  { id: "frontal",     label: "Frontal",    style: { top: "12%", left: 0, width: "20%", height: "76%" } },
  { id: "lateral-izq", label: "Lat. Izq",  style: { top: "12%", left: "20%", width: "30%", height: "76%" } },
  { id: "lateral-der", label: "Lat. Der",  style: { top: "12%", left: "50%", width: "30%", height: "76%" } },
  { id: "trasero",     label: "Trasero",   style: { top: "12%", left: "80%", width: "20%", height: "76%" } },
];

function ConfiguratorPreview({ cabinet, seleccion }) {
  const accesoriosSeleccionados = seleccion.accesorios || [];
  const ubicaciones = seleccion.ubicaciones || {};
  const colorHex = COLORES[seleccion.color] || "#e5e5e5";

  const accesoriosPorUbicacion = {};
  accesoriosSeleccionados.forEach((accId) => {
    const ub = ubicaciones[accId];
    if (ub) {
      if (!accesoriosPorUbicacion[ub]) accesoriosPorUbicacion[ub] = [];
      const opcion = categoriasConfigurables
        .find((c) => c.id === "accesorios")
        ?.opciones.find((o) => o.id === accId);
      if (opcion) accesoriosPorUbicacion[ub].push(opcion.label);
    }
  });

  const zonasOcupadas = Object.keys(accesoriosPorUbicacion);

  return (
    <div className="flex-1 bg-white rounded-lg border border-neutral-200 flex flex-col items-center justify-center min-h-[320px] md:min-h-[480px] p-6 gap-6">
      <div className="relative w-64 h-48" style={{ background: colorHex, borderRadius: 8, border: "2px solid #d1d5db" }}>
        {ZONAS.map((zona) => {
          const ocupada = zonasOcupadas.includes(zona.id);
          return (
            <div
              key={zona.id}
              style={{
                position: "absolute",
                ...zona.style,
                border: ocupada ? "2px solid #2563eb" : "1px dashed #9ca3af",
                background: ocupada ? "rgba(37,99,235,0.15)" : "transparent",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 9, color: ocupada ? "#1d4ed8" : "#9ca3af", textAlign: "center", padding: 2 }}>
                {ocupada ? accesoriosPorUbicacion[zona.id].map(l => l.split(" ")[0]).join(", ") : zona.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-neutral-400 text-center">
        {accesoriosSeleccionados.length === 0
          ? "Seleccioná accesorios y asignales una ubicación"
          : `${accesoriosSeleccionados.length} accesorio(s) — ${zonasOcupadas.length} ubicado(s)`}
      </p>
    </div>
  );
}

export default ConfiguratorPreview;
