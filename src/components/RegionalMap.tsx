import { geoEquirectangular, geoPath } from "d3-geo";
import { merge } from "topojson-client";
import worldAtlas from "world-atlas/countries-110m.json";

const WIDTH = 720;
const HEIGHT = 500;
// Fixed Atlantic window: 125°W–40°E and 58°N–56°S.
// The northern archipelago is cropped, not filtered by country size.
const projection = geoEquirectangular()
  .center([-42.5, 1])
  .scale(240)
  .translate([WIDTH / 2, HEIGHT / 2])
  .clipExtent([[14.4, 11.2], [705.6, 488.8]]);
const path = geoPath(projection);
const atlas = worldAtlas as unknown as Parameters<typeof merge>[0];
// Merge shared borders so continents remain solid, including small countries.
const countryGeometry = atlas.objects.countries as { geometries: Extract<Parameters<typeof merge>[1], unknown[]> };
const landPath = path(merge(atlas, countryGeometry.geometries)) ?? "";
const PANAMA: [number, number] = [-80.1, 8.5];
const DESTINATIONS: Array<[number, number]> = [
  [-102, 23], // México
  [-90.5, 15.5], // Guatemala
  [-70.2, 18.9], // República Dominicana
  [-66.5, 7.8], // Venezuela, centered inland
  [-51, -10], // Brasil
  [-70.7, -33.5], // Chile
];
const EUROPE_DESTINATIONS: Array<[number, number]> = [
  [-3.7, 40.4], // España
  [2.3, 48.8], // Francia
];

function routePath(from: [number, number], to: [number, number], bend: number) {
  const start = projection(from) ?? [0, 0];
  const end = projection(to) ?? [0, 0];
  // Curve in screen coordinates so no geographic control point wraps at a pole.
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.hypot(dx, dy) || 1;
  const offset = Math.min(length * 0.3, 65) * Math.sign(bend);
  const middle = [(start[0] + end[0]) / 2 - dy / length * offset, (start[1] + end[1]) / 2 + dx / length * offset];
  return `M ${start[0]} ${start[1]} Q ${middle[0]} ${middle[1]} ${end[0]} ${end[1]}`;
}

export default function RegionalMap() {
  const panamaPoint = projection(PANAMA) ?? [0, 0];
  return <div className="regional-map" aria-label="Panamá como hub marítimo, aéreo y terrestre">
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby="map-title map-description">
      <title id="map-title">Panamá, hub regional de MEDIFER</title>
      <desc id="map-description">Mapa geográfico de Latinoamérica con Panamá como hub marítimo, aéreo y terrestre y conexiones hacia distintos mercados de la región y Europa.</desc>
      <defs>
        <filter id="route-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="hub-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="8" /></filter>
        <radialGradient id="map-fade-gradient" cx="50%" cy="50%" r="68%"><stop offset="0%" stopColor="#fff" /><stop offset="72%" stopColor="#fff" /><stop offset="100%" stopColor="#000" /></radialGradient>
        <mask id="map-fade-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={WIDTH} height={HEIGHT}><ellipse cx={WIDTH / 2} cy={HEIGHT / 2} rx="355" ry="245" fill="url(#map-fade-gradient)" /></mask>
      </defs>
      <g mask="url(#map-fade-mask)">
      <path className="map-country" d={landPath} />
      <g className="map-routes" aria-hidden="true">{DESTINATIONS.map((destination, index) => {
        const d = routePath(PANAMA, destination, index % 2 === 0 ? 1 : -1);
        const endpoint = projection(destination) ?? [0, 0];
        return <g key={destination.join("-")}>
          <path className="map-route-glow" d={d} />
          <path className="map-route" d={d} />
          <circle className="route-endpoint-glow" cx={endpoint[0]} cy={endpoint[1]} r="9" />
          <circle className="route-endpoint" cx={endpoint[0]} cy={endpoint[1]} r="3.5" />
        </g>;
      })}</g>
      <g className="map-routes map-routes-europe" aria-hidden="true">{EUROPE_DESTINATIONS.map((destination, index) => {
        const d = routePath(PANAMA, destination, index === 0 ? -1 : 1);
        const endpoint = projection(destination) ?? [0, 0];
        return <g key={`europe-${destination.join("-")}`}>
          <path className="map-route-glow map-route-europe" d={d} />
          <path className="map-route map-route-europe" d={d} />
          <circle className="route-endpoint-glow" cx={endpoint[0]} cy={endpoint[1]} r="9" />
          <circle className="route-endpoint" cx={endpoint[0]} cy={endpoint[1]} r="3.5" />
        </g>;
      })}</g>
      <g className="map-hub"><circle className="hub-glow" cx={panamaPoint[0]} cy={panamaPoint[1]} r="30" /><circle className="hub-ring" cx={panamaPoint[0]} cy={panamaPoint[1]} r="18" /><circle className="hub-core" cx={panamaPoint[0]} cy={panamaPoint[1]} r="6" /><text className="hub-title" x={panamaPoint[0] + 27} y={panamaPoint[1] - 13}>Panamá - Hub regional</text></g>
      </g>
    </svg>
  </div>;
}
