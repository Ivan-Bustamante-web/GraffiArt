import { categoriasConfigurables } from "../../data/cabinetsMock";

const COLORES = {
  negro: { base: "#1c1c1c", panel: "#252525", detalle: "#333", borde: "#444", texto: "#666" },
  blanco: { base: "#e8e8e8", panel: "#f2f2f2", detalle: "#ddd", borde: "#bbb", texto: "#aaa" },
  gris:   { base: "#2e2e2e", panel: "#3a3a3a", detalle: "#444", borde: "#555", texto: "#777" },
};

const ICONOS = {
  "ventiladores-rgb": "🌀",
  "filtro-polvo":     "⬛",
  "controlador-rgb":  "💡",
  "panel-vidrio":     "🪟",
  "tiras-led":        "✨",
};

export default function ConfiguratorPreview({ cabinet, seleccion }) {
  const accesoriosSeleccionados = seleccion.accesorios || [];
  const ubicaciones = seleccion.ubicaciones || {};
  const c = COLORES[seleccion.color] || COLORES.negro;

  const opcionesAccesorios = categoriasConfigurables
    .find((cat) => cat.id === "accesorios")?.opciones || [];

  const enUbicacion = (ubId) =>
    accesoriosSeleccionados
      .filter((id) => ubicaciones[id] === ubId)
      .map((id) => opcionesAccesorios.find((o) => o.id === id))
      .filter(Boolean);

  const frontal  = enUbicacion("frontal");
  const superior = enUbicacion("superior");
  const latIzq   = enUbicacion("lateral-izq");
  const latDer   = enUbicacion("lateral-der");

  const tieneVidrio = accesoriosSeleccionados.includes("panel-vidrio");
  const tieneRGB    = accesoriosSeleccionados.includes("tiras-led") ||
                      accesoriosSeleccionados.includes("ventiladores-rgb");
  const rgbColor    = tieneRGB ? "#7c3aed" : "transparent";

  // ventilador SVG reutilizable
  const Ventilador = ({ cx, cy, r, color = "#3b82f6" }) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={c.panel} stroke={color} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={r * 0.25} fill={color} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * r * 0.28;
        const y1 = cy + Math.sin(rad) * r * 0.28;
        const x2 = cx + Math.cos(rad + 0.6) * r * 0.85;
        const y2 = cy + Math.sin(rad + 0.6) * r * 0.85;
        return (
          <path key={deg}
            d={`M${x1},${y1} Q${cx + Math.cos(rad + 0.3) * r * 0.6},${cy + Math.sin(rad + 0.3) * r * 0.6} ${x2},${y2}`}
            fill={color} opacity="0.7" />
        );
      })}
    </g>
  );

  return (
    <div className="flex-1 bg-neutral-100 rounded-xl border border-neutral-200 flex flex-col items-center justify-center min-h-[460px] p-6 gap-4">
      <svg viewBox="0 0 260 420" width="220" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {tieneRGB && (
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          )}
          <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c.detalle} />
            <stop offset="100%" stopColor={c.base} />
          </linearGradient>
        </defs>

        {/* ── cuerpo principal ── */}
        <rect x="20" y="10" width="220" height="400" rx="10"
          fill={c.base} stroke={c.borde} strokeWidth="2" />

        {/* ── panel frontal izquierdo (franja oscura) ── */}
        <rect x="20" y="10" width="55" height="400" rx="10"
          fill="url(#panelGrad)" stroke={c.borde} strokeWidth="1" />
        <rect x="55" y="10" width="10" height="400" fill={c.panel} />

        {/* ── LED strip superior ── */}
        {tieneRGB && (
          <rect x="21" y="11" width="218" height="5" rx="3"
            fill={rgbColor} filter="url(#glow)" opacity="0.9" />
        )}

        {/* ── LED strips laterales ── */}
        {tieneRGB && (
          <>
            <rect x="21" y="11" width="4" height="398" rx="2"
              fill={rgbColor} filter="url(#glow)" opacity="0.7" />
            <rect x="235" y="11" width="4" height="398" rx="2"
              fill="#2563eb" filter="url(#glow)" opacity="0.7" />
          </>
        )}

        {/* ── botón power ── */}
        <circle cx="47" cy="45" r="12"
          fill={tieneRGB ? rgbColor : c.detalle}
          stroke={c.borde} strokeWidth="1.5"
          filter={tieneRGB ? "url(#glow)" : ""} />
        <circle cx="47" cy="45" r="7" fill={c.base} />
        <path d="M47,39 L47,46" stroke={tieneRGB ? rgbColor : "#888"} strokeWidth="2" strokeLinecap="round" />
        <path d="M42,42 A7,7 0 1 1 52,42" fill="none"
          stroke={tieneRGB ? rgbColor : "#888"} strokeWidth="2" strokeLinecap="round" />

        {/* ── botón reset ── */}
        <circle cx="47" cy="72" r="5"
          fill={c.detalle} stroke={c.borde} strokeWidth="1" />

        {/* ── puertos USB ── */}
        <rect x="35" y="90" width="24" height="10" rx="2" fill="#111" stroke="#555" strokeWidth="0.5" />
        <rect x="35" y="104" width="24" height="10" rx="2" fill="#111" stroke="#555" strokeWidth="0.5" />
        <rect x="35" y="118" width="11" height="8" rx="1" fill="#1a237e" stroke="#3949ab" strokeWidth="0.5" />
        <rect x="48" y="118" width="11" height="8" rx="1" fill="#111" stroke="#555" strokeWidth="0.5" />

        {/* ── jack audio ── */}
        <circle cx="41" cy="138" r="4" fill="#111" stroke="#555" strokeWidth="0.5" />
        <circle cx="53" cy="138" r="4" fill="#111" stroke="#555" strokeWidth="0.5" />

        {/* ── panel de vidrio templado (ventana) ── */}
        {tieneVidrio ? (
          <rect x="70" y="30" width="175" height="360" rx="4"
            fill="rgba(147,197,253,0.08)" stroke="#93c5fd" strokeWidth="1.5" />
        ) : (
          <rect x="70" y="30" width="175" height="360" rx="4"
            fill={c.panel} stroke={c.detalle} strokeWidth="0.5" />
        )}

        {/* ── ventiladores frontales ── */}
        {frontal.length > 0 ? (
          <>
            <Ventilador cx="155" cy="120" r="38" color="#3b82f6" />
            {frontal.length > 1 && <Ventilador cx="155" cy="210" r="38" color="#3b82f6" />}
            {frontal.length > 2 && <Ventilador cx="155" cy="300" r="38" color="#3b82f6" />}
          </>
        ) : (
          /* rejilla de ventilación */
          <>
            {[80, 95, 110, 125, 140, 155, 170, 185, 200].map((y) => (
              <rect key={y} x="75" y={y} width="165" height="3" rx="1.5"
                fill={c.detalle} opacity="0.6" />
            ))}
          </>
        )}

        {/* ── ventiladores superiores ── */}
        {superior.length > 0 && (
          <>
            <rect x="70" y="10" width="175" height="25" rx="4"
              fill={c.panel} stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" />
            {[110, 155, 200].slice(0, superior.length).map((x) => (
              <g key={x}>
                <circle cx={x} cy="22" r="9" fill="none" stroke="#3b82f6" strokeWidth="1" />
                <circle cx={x} cy="22" r="3" fill="#3b82f6" />
              </g>
            ))}
          </>
        )}

        {/* ── ranuras drive bay ── */}
        <rect x="70" y="340" width="100" height="18" rx="2"
          fill={c.detalle} stroke={c.borde} strokeWidth="0.5" />
        <rect x="70" y="362" width="100" height="18" rx="2"
          fill={c.detalle} stroke={c.borde} strokeWidth="0.5" />

        {/* ── logo ── */}
        <text x="200" y="380" textAnchor="middle" fontSize="9"
          fill={c.texto} fontFamily="system-ui" fontWeight="bold" letterSpacing="2">
          GraffiArt
        </text>

        {/* ── indicadores laterales ── */}
        {latIzq.length > 0 && (
          <g>
            <rect x="22" y="220" width="30" height="60" rx="3"
              fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" />
            <text x="37" y="255" textAnchor="middle" fontSize="16">
              {ICONOS[latIzq[0].id]}
            </text>
          </g>
        )}
        {latDer.length > 0 && (
          <g>
            <rect x="208" y="220" width="30" height="60" rx="3"
              fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" />
            <text x="223" y="255" textAnchor="middle" fontSize="16">
              {ICONOS[latDer[0].id]}
            </text>
          </g>
        )}
      </svg>

      {/* ── chips de estado abajo ── */}
      <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
        {accesoriosSeleccionados.length === 0 ? (
          <span className="text-xs text-neutral-400">Seleccioná accesorios para ver el preview</span>
        ) : (
          accesoriosSeleccionados.map((id) => {
            const op = opcionesAccesorios.find((o) => o.id === id);
            const ub = ubicaciones[id];
            return (
              <span key={id} className={`text-xs px-2 py-0.5 rounded-full border ${
                ub
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-neutral-100 border-neutral-300 text-neutral-400"
              }`}>
                {ICONOS[id]} {op?.label} {ub ? `· ubicado` : "· sin ubicar"}
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}