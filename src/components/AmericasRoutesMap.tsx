// src/components/AmericasRoutesMap.tsx
import React, { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const WORLD_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Panamá (lng, lat)
const PANAMA: [number, number] = [-79.5167, 8.9833];

// Destinos más limpios (2–3 por región)
const DESTS_NORTH: Array<{ name: string; coord: [number, number] }> = [
  { name: "Miami", coord: [-80.1918, 25.7617] },
  { name: "Ciudad de México", coord: [-99.1332, 19.4326] },
];

const DESTS_SOUTH: Array<{ name: string; coord: [number, number] }> = [
  { name: "Bogotá", coord: [-74.0721, 4.711] },
  { name: "Lima", coord: [-77.0428, -12.0464] },
  { name: "Santiago", coord: [-70.6693, -33.4489] },
];

type ProjectionFn = (coord: [number, number]) => [number, number];

function quadCurve(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
  bend = 0.25
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

const AmericasRoutesMap: React.FC<{
  height?: number;
  className?: string;
  bendNorth?: number; // 0..0.5
  bendSouth?: number; // 0..0.5
}> = ({ height = 340, className = "", bendNorth = 0.22, bendSouth = 0.28 }) => {
  const projCfg = { scale: 400, center: [-78, 5] as [number, number] };

  const onlyAmericas = (geo: any): boolean => {
    const bbox: [number, number, number, number] =
      (geo?.bbox as any) || [-170, -60, -20, 75];
    const [minX, minY, maxX, maxY] = bbox;
    return maxX >= -170 && minX <= -20 && maxY >= -60 && minY <= 75;
  };

  const style = useMemo(
    () => ({
      css: `
        @keyframes dashFlow { to { stroke-dashoffset: -1000; } }
        @keyframes pulse {
          0% { transform: scale(1); opacity: .8; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .route {
          stroke-dasharray: 8 10;
          animation: dashFlow 4.5s linear infinite;
        }
        .label {
          font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
          font-size: 11px;
          fill: #64748b; /* slate-500 */
        }
        .muted {
          fill: #f8fafc;            /* slate-50 */
          stroke: #e2e8f0;          /* slate-200 */
          stroke-width: .6;
        }
      `,
    }),
    []
  );

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <style>{style.css}</style>

      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={projCfg}
        height={height}
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0574bb" />
          </marker>
          <marker id="arrowTeal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#009fa5" />
          </marker>
          <linearGradient id="gradNorth" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0574bb" />
            <stop offset="100%" stopColor="#009fa5" />
          </linearGradient>
          <linearGradient id="gradSouth" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#009fa5" />
            <stop offset="100%" stopColor="#0574bb" />
          </linearGradient>
        </defs>

        <Geographies geography={WORLD_URL}>
          {({
            geographies,
            projection,
          }: {
            geographies: any[];
            projection: ProjectionFn;
          }) => {
            const proj = projection as ProjectionFn;
            const [px, py] = proj(PANAMA);

            return (
              <>
                {/* Base muy neutra */}
                {geographies.filter(onlyAmericas).map((geo: any) => (
                  <Geography key={geo.rsmKey} geography={geo} className="muted" />
                ))}

                {/* NORTE: un solo grupo, mismo estilo */}
                <g fill="none" stroke="url(#gradNorth)" strokeWidth={3}>
                  {DESTS_NORTH.map((d, i) => {
                    const [dx, dy] = proj(d.coord);
                    const dPath = quadCurve([px, py], [dx, dy], bendNorth);
                    return (
                      <path
                        key={`N-${d.name}`}
                        d={dPath}
                        className="route"
                        markerEnd="url(#arrowBlue)"
                        opacity={0.95 - i * 0.08}
                      />
                    );
                  })}
                </g>

                {/* SUR */}
                <g fill="none" stroke="url(#gradSouth)" strokeWidth={3}>
                  {DESTS_SOUTH.map((d, i) => {
                    const [dx, dy] = proj(d.coord);
                    const dPath = quadCurve([px, py], [dx, dy], bendSouth);
                    return (
                      <path
                        key={`S-${d.name}`}
                        d={dPath}
                        className="route"
                        markerEnd="url(#arrowTeal)"
                        opacity={0.95 - i * 0.08}
                      />
                    );
                  })}
                </g>

                {/* Panamá con pulso */}
                <g transform={`translate(${px},${py})`}>
                  <circle r={3.5} fill="#009fa5" stroke="white" strokeWidth={1.2} />
                  <circle r={3.5} fill="#009fa5" style={{ transformOrigin: "center", animation: "pulse 1.8s ease-out infinite" }} opacity={0.5} />
                </g>
                <Marker coordinates={PANAMA}>
                  <text className="label" textAnchor="start" x={8} y={-8}>
                    Panamá
                  </text>
                </Marker>

                {/* Etiquetas de destino (discretas) */}
                {[...DESTS_NORTH, ...DESTS_SOUTH].map((d) => (
                  <Marker key={d.name} coordinates={d.coord}>
                    <circle r={2.2} fill="#0ea5e9" stroke="white" strokeWidth={0.8} />
                    <text className="label" textAnchor="start" x={6} y={-6}>
                      {d.name}
                    </text>
                  </Marker>
                ))}
              </>
            );
          }}
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default AmericasRoutesMap;