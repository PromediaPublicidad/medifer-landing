import { geoArea, geoCentroid, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldAtlas from "world-atlas/countries-110m.json";

const WIDTH = 720;
const HEIGHT = 470;
const projection = geoMercator().center([-38, 5]).scale(310).translate([WIDTH / 2, HEIGHT / 2]);
const path = geoPath(projection);
const atlas = worldAtlas as unknown as { objects: { countries: unknown } };
const countries = feature(worldAtlas as never, atlas.objects.countries as never) as unknown as { features: Array<{ id?: string | number; geometry: unknown }> };
const regionalCountries = countries.features.filter((country) => {
  const [longitude, latitude] = geoCentroid(country as never);
  const isAmericas = longitude > -125 && longitude < -30 && latitude > -60 && latitude < 65;
  const isWesternEurope = longitude >= -30 && longitude < 20 && latitude > 35 && latitude < 72;
  const isCaribbeanIslandBelt = longitude > -90 && longitude < -55 && latitude > 16;
  return (isAmericas || isWesternEurope) && !isCaribbeanIslandBelt && geoArea(country as never) > 0.001;
});
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
      </defs>
      <g className="map-countries">{regionalCountries.map((country, index) => { const d = path(country as never); const [longitude, latitude] = geoCentroid(country as never); const isEurope = longitude >= -30 && longitude < 20 && latitude > 35 && latitude < 72; return d ? <path key={`${country.id ?? "country"}-${index}`} d={d} className={`map-country${isEurope ? " map-country-europe" : ""}`} /> : null; })}</g>
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
    </svg>
  </div>;
}
