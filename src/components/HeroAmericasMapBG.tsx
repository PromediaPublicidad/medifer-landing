import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const PANAMA: [number, number] = [-79.5, 8.6];

function quadCurve(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
  bend = 0.22
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const vx = x2 - x1;
  const vy = y2 - y1;
  const len = Math.hypot(vx, vy) || 1;
  const nx = -vy / len;
  const ny = vx / len;
  const cx = mx + nx * bend * len;
  const cy = my + ny * bend * len;
  return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;
}

type Palette = {
  // tierras y contorno
  land1: string;
  land2: string;
  landStroke: string;

  // halo volumétrico
  haloInner: string;
  haloMid: string;

  // rutas y glow
  routeBack: string;     // color del blur “debajo”
  routeMain1: string;    // gradiente inicio
  routeMain2: string;    // gradiente fin

  // flecha
  arrow1: string;
  arrow2: string;

  // hub Panamá + etiqueta
  hubOuter: string;
  hubInner: string;
  labelFill: string;
  labelStroke: string;
};

// Paletas propuestas
const PALETTES: Record<
  "brandTeal" | "oceanContrast" | "indigoDeep" | "mintGlass",
  Palette
> = {
  // La base actual (ligeramente refinada)
  brandTeal: {
    land1: "#21c0c2",
    land2: "#0aa2a6",
    landStroke: "rgba(255,255,255,0.35)",
    haloInner: "rgba(255,255,255,0.12)",
    haloMid: "rgba(255,255,255,0.06)",
    routeBack: "#8be7ff",
    routeMain1: "#ffffff",
    routeMain2: "#dff7ff",
    arrow1: "#0574bb",
    arrow2: "#00b2b7",
    hubOuter: "rgba(255,255,255,0.85)",
    hubInner: "#43e7ff",
    labelFill: "#e6fbff",
    labelStroke: "rgba(0,0,0,0.25)",
  },
  // Más contraste y definición, ideal sobre gradiente azul/teal
  oceanContrast: {
    land1: "#4cc9f0",
    land2: "#2bb1da",
    landStroke: "rgba(255,255,255,0.55)",
    haloInner: "rgba(255,255,255,0.16)",
    haloMid: "rgba(255,255,255,0.07)",
    routeBack: "#79f2ff",
    routeMain1: "#ffffff",
    routeMain2: "#c8f4ff",
    arrow1: "#0ea5e9",
    arrow2: "#22d3ee",
    hubOuter: "rgba(255,255,255,0.95)",
    hubInner: "#58f0ff",
    labelFill: "#ffffff",
    labelStroke: "rgba(0,0,0,0.32)",
  },
  // Sobria/pro (más cercana a branding corporativo “deep”)
  indigoDeep: {
    land1: "#3b82f6",
    land2: "#2563eb",
    landStroke: "rgba(255,255,255,0.45)",
    haloInner: "rgba(255,255,255,0.14)",
    haloMid: "rgba(255,255,255,0.06)",
    routeBack: "#a5b4fc",
    routeMain1: "#ffffff",
    routeMain2: "#dbeafe",
    arrow1: "#4338ca",
    arrow2: "#06b6d4",
    hubOuter: "rgba(255,255,255,0.92)",
    hubInner: "#60a5fa",
    labelFill: "#eef2ff",
    labelStroke: "rgba(0,0,0,0.28)",
  },
  // Muy limpio / pharma (alto contraste suave)
  mintGlass: {
    land1: "#34d399",
    land2: "#10b981",
    landStroke: "rgba(255,255,255,0.55)",
    haloInner: "rgba(255,255,255,0.18)",
    haloMid: "rgba(255,255,255,0.08)",
    routeBack: "#99f6e4",
    routeMain1: "#ffffff",
    routeMain2: "#e7fff7",
    arrow1: "#059669",
    arrow2: "#14b8a6",
    hubOuter: "rgba(255,255,255,0.95)",
    hubInner: "#99f6e4",
    labelFill: "#f0fdf4",
    labelStroke: "rgba(0,0,0,0.28)",
  },
};

type Props = {
  /** Desplazamiento vertical desde el centro del hero (px) para que no toque el header */
  offsetY?: number;
  /** Paleta de color */
  palette?: keyof typeof PALETTES;
};

export default function HeroAmericasMapBG({
  offsetY = 28,
  palette = "oceanContrast",
}: Props): JSX.Element {
  const P = PALETTES[palette];

  return (
    <div
      aria-hidden
      className="
        pointer-events-none absolute -translate-y-1/2
        w-[70vw] max-w-[1200px] min-w-[700px]
      "
      style={{
        top: `calc(50% + ${offsetY}px)`,
        right: "-6vw",
        aspectRatio: "16 / 9",
        zIndex: 0,
      }}
    >
      <style>{`
        @keyframes dashFlow { to { stroke-dashoffset: -900; } }
        .route-main {
          stroke-dasharray: 10 9;
          stroke-linecap: round;
          animation: dashFlow 5.2s linear infinite;
        }
      `}</style>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: PANAMA, scale: 480 }}
        width={1600}
        height={900}
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          {/* halo volumétrico */}
          <radialGradient id="bgHalo" cx="70%" cy="35%" r="75%">
            <stop offset="0%" stopColor={P.haloInner} />
            <stop offset="70%" stopColor={P.haloMid} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* relieve tierras */}
          <linearGradient id="landFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={P.land1} stopOpacity="0.35" />
            <stop offset="100%" stopColor={P.land2} stopOpacity="0.26" />
          </linearGradient>

          {/* trazo principal animado */}
          <linearGradient id="routeStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={P.routeMain1} stopOpacity={0.98} />
            <stop offset="100%" stopColor={P.routeMain2} stopOpacity={1} />
          </linearGradient>

          {/* glow de rutas */}
          <filter id="routeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* flecha */}
          <linearGradient id="arrowFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={P.arrow1} />
            <stop offset="100%" stopColor={P.arrow2} />
          </linearGradient>
          <marker
            id="arrowHead"
            viewBox="0 0 10 10"
            refX="7.6"
            refY="5"
            markerWidth="10"
            markerHeight="10"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="url(#arrowFill)" />
          </marker>
        </defs>

        {/* halo para sensación 3D */}
        <g transform="translate(450,120)">
          <circle cx={850} cy={320} r={650} fill="url(#bgHalo)" />
        </g>

        <Geographies geography={GEO_URL}>
          {({
            geographies,
            projection,
          }: {
            geographies: any[];
            projection: (coord: [number, number]) => [number, number];
          }) => {
            const proj = projection;
            const toXY = (lon: number, lat: number) => proj([lon, lat]) || [0, 0];

            const [px, py] = toXY(PANAMA[0], PANAMA[1]);
            const dests: Array<{ to: [number, number]; bend: number }> = [
              { to: toXY(-80.1918, 25.7617), bend: 0.20 }, // Miami
              { to: toXY(-99.1332, 19.4326), bend: 0.18 }, // CDMX
              { to: toXY(-74.0721, 4.7110), bend: 0.20 },  // Bogotá
              { to: toXY(-77.0428, -12.0464), bend: 0.25 },// Lima
              { to: toXY(-70.6693, -33.4489), bend: 0.28 },// Santiago
              { to: toXY(-58.3816, -34.6037), bend: 0.30 },// Buenos Aires
              { to: toXY(-55.72056,-8.1443), bend: 0.30 }, // Brasil
              { to: toXY( -66.0726, 7.0215), bend: 0.30 }, // Venezuela
              { to: toXY(-102.5596, 40.7240 ), bend: 0.30 }, // USA
              

            ];

            return (
              <>
                {/* continentes */}
                {geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="url(#landFill)"
                    stroke={P.landStroke}
                    strokeWidth={0.8}
                  />
                ))}

                {/* HUB Panamá + etiqueta */}
                <g>
                  <circle cx={px} cy={py} r={16} fill={P.hubOuter} />
                  <circle cx={px} cy={py} r={10} fill={P.hubInner} />
                  <text
                    x={px + 10}
                    y={py - 10}
                    fontSize={14}
                    fontWeight={700}
                    fill={P.labelFill}
                    stroke={P.labelStroke}
                    strokeWidth={1}
                    paintOrder="stroke"
                  >
                    Panamá
                  </text>
                </g>

                {/* rutas con glow + animación */}
                {dests.map(({ to, bend }, i) => {
                  const d = quadCurve([px, py], to, bend);
                  const opacity = 0.96 - i * 0.06;
                  return (
                    <g key={i}>
                      <path
                        d={d}
                        fill="none"
                        stroke={P.routeBack}
                        strokeWidth={7.5}
                        filter="url(#routeGlow)"
                        opacity={0.40}
                      />
                      <path
                        d={d}
                        className="route-main"
                        fill="none"
                        stroke="url(#routeStroke)"
                        strokeWidth={4}
                        markerEnd="url(#arrowHead)"
                        opacity={opacity}
                      />
                    </g>
                  );
                })}
              </>
            );
          }}
        </Geographies>
      </ComposableMap>
    </div>
  );
}