import React, { useMemo } from "react";

/** ViewBox fijo para evitar deformaciones */
const VB_W = 1600;
const VB_H = 900;

/** Hub Panamá (aprox) en coords del viewBox */
const PAN = { x: 1125, y: 420 } as const;
type Pt = { x: number; y: number };

const DESTS: Record<
  "miami" | "mexico" | "bogota" | "lima" | "santiago" | "buenosAires",
  Pt
> = {
  miami: { x: 1205, y: 280 },
  mexico: { x: 1080, y: 320 },
  bogota: { x: 1160, y: 450 },
  lima: { x: 1105, y: 575 },
  santiago: { x: 1030, y: 740 },
  buenosAires: { x: 1180, y: 800 },
};

/** Bezier cúbica suave entre puntos */
function routePath(from: Pt, to: Pt, tension = 0.24) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const c1 = { x: from.x + dx * tension, y: from.y + dy * 0.06 };
  const c2 = { x: to.x - dx * tension, y: to.y - dy * 0.06 };
  return `M ${from.x},${from.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${to.x},${to.y}`;
}

type ArrowProps = { x: number; y: number; angle?: number; size?: number };
function ArrowHead({ x, y, angle = 0, size = 14 }: ArrowProps) {
  const s = size;
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      <path d={`M 0 0 L ${-s} ${s * 0.6} L ${-s} ${-s * 0.6} Z`} fill="url(#ahFill)" opacity={0.95} />
    </g>
  );
}

/** Fondo derecha del hero con “mapa 3D” y rutas desde Panamá */
export default function HeroRoutesBackground(): JSX.Element {
  const arrows = useMemo(() => {
    const compute = (to: Pt) => {
      const ang = (Math.atan2(to.y - PAN.y, to.x - PAN.x) * 180) / Math.PI;
      const k = 0.88; // flecha cerca del destino
      return { x: PAN.x + (to.x - PAN.x) * k, y: PAN.y + (to.y - PAN.y) * k, angle: ang };
    };
    return {
      miami: compute(DESTS.miami),
      mexico: compute(DESTS.mexico),
      bogota: compute(DESTS.bogota),
      lima: compute(DESTS.lima),
      santiago: compute(DESTS.santiago),
      buenosAires: compute(DESTS.buenosAires),
    };
  }, []);

  return (
    <div
      aria-hidden
      className="
        pointer-events-none absolute top-1/2 -translate-y-1/2
        w-[70vw] max-w-[1200px] min-w-[620px]
      "
      style={{
        aspectRatio: "16 / 9",
        right: "-6vw",         // empuja un poco a la izquierda
        zIndex: 0,
      }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          {/* halo volumétrico */}
          <radialGradient id="vg" cx="70%" cy="40%" r="75%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.13)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* “relieve” */}
          <linearGradient id="land" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0fb0b4" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#0aa2a6" stopOpacity="0.22" />
          </linearGradient>

          {/* rutas */}
          <linearGradient id="route" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#c6ecff" stopOpacity="0.95" />
          </linearGradient>

          {/* glow hub */}
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#3ed6ff" stopOpacity="0.32" />
          </radialGradient>

          {/* flecha */}
          <linearGradient id="ahFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0574bb" />
            <stop offset="100%" stopColor="#0fb0b4" />
          </linearGradient>

          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* halo */}
        <circle cx={1200} cy={360} r={650} fill="url(#vg)" />

        {/* formas “relieve” */}
        <g stroke="rgba(255,255,255,0.42)" strokeWidth={1} fill="url(#land)">
          <path
            d="M1200,110 C1350,100 1500,160 1570,230 1620,280 1640,340 1625,400
               1600,500 1550,560 1450,600 1380,630 1320,690 1300,760
               1285,810 1270,860 1250,900 1200,905 1180,865 1175,830
               1165,760 1145,720 1100,680 980,570 960,500 980,420
               990,370 980,320 1020,260 1060,200 1120,140 1200,110 Z"
            filter="url(#softShadow)"
            opacity={0.70}
          />
          <path
            d="M1130,400 C1160,420 1180,460 1185,500 1190,540 1180,585 1160,620
               1140,655 1125,690 1115,730 1108,760 1100,785 1092,810
               1084,830 1068,835 1058,820 1040,800 1035,780 1040,750
               1048,700 1068,650 1085,620 1100,595 1112,560 1116,530
               1120,500 1113,450 1105,430 1100,418 1108,406 1130,400 Z"
            opacity={0.72}
          />
        </g>

        {/* HUB Panamá */}
        <g>
          <circle cx={PAN.x} cy={PAN.y} r={18} fill="url(#hubGlow)" />
          <circle cx={PAN.x} cy={PAN.y} r={6} fill="#0ff" />
        </g>

        {/* Rutas engrosadas */}
        {[
          DESTS.miami,
          DESTS.mexico,
          DESTS.bogota,
          DESTS.lima,
          DESTS.santiago,
          DESTS.buenosAires,
        ].map((to, i) => (
          <path
            key={i}
            d={routePath(PAN, to, 0.26)}
            stroke="url(#route)"
            strokeWidth={6}
            strokeDasharray="12 14"
            strokeLinecap="round"
            fill="none"
            opacity={0.95}
          />
        ))}

        {/* Flechas finales */}
        <ArrowHead {...arrows.miami} />
        <ArrowHead {...arrows.mexico} />
        <ArrowHead {...arrows.bogota} />
        <ArrowHead {...arrows.lima} />
        <ArrowHead {...arrows.santiago} />
        <ArrowHead {...arrows.buenosAires} />
      </svg>
    </div>
  );
}