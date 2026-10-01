import { geoCentroid, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldAtlas from "world-atlas/countries-110m.json";

const WIDTH = 720;
const HEIGHT = 470;
const projection = geoMercator().center([-50, 5]).scale(300).translate([WIDTH / 2, HEIGHT / 2]);
const path = geoPath(projection);
const atlas = worldAtlas as unknown as { objects: { countries: unknown } };
const countries = feature(worldAtlas as never, atlas.objects.countries as never) as unknown as { features: Array<{ id?: string | number; geometry: unknown }> };
const regionalCountries = countries.features.filter((country) => {
  const [longitude, latitude] = geoCentroid(country as never);
  const isAmericas = longitude > -125 && longitude < -30 && latitude > -60 && latitude < 65;
  const isWesternEurope = longitude >= -30 && longitude < 20 && latitude > 35 && latitude < 72;
  return isAmericas || isWesternEurope;
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

function routePath(from: [number, number], to: [number, number], bend: number) {
  const control: [number, number] = [from[0] + (to[0] - from[0]) * 0.52, from[1] + (to[1] - from[1]) * bend];
  const start = projection(from) ?? [0, 0];
  const end = projection(to) ?? [0, 0];
  const middle = projection(control) ?? [0, 0];
  return `M ${start[0]} ${start[1]} Q ${middle[0]} ${middle[1]} ${end[0]} ${end[1]}`;
}

export default function RegionalMap() {
  const panamaPoint = projection(PANAMA) ?? [0, 0];
  return <div className="regional-map" aria-label="Panamá como hub marítimo, aéreo y terrestre">
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby="map-title map-description">
      <title id="map-title">Panamá, hub regional de MEDIFER</title>
      <desc id="map-description">Mapa geográfico de Latinoamérica con Panamá como hub marítimo, aéreo y terrestre y conexiones hacia distintos mercados.</desc>
      <g className="map-countries">{regionalCountries.map((country, index) => { const d = path(country as never); return d ? <path key={`${country.id ?? "country"}-${index}`} d={d} className="map-country" /> : null; })}</g>
      <g className="map-routes" aria-hidden="true">{DESTINATIONS.map((destination, index) => <g key={`${destination.join("-")}`}><path className="map-route" d={routePath(PANAMA, destination, index % 2 === 0 ? 9 : -9)} /><circle className={`route-endpoint route-endpoint-${index}`} cx={(projection(destination) ?? [0, 0])[0]} cy={(projection(destination) ?? [0, 0])[1]} r="3.5" /></g>)}</g>
      <g className="map-hub"><circle className="hub-ring" cx={panamaPoint[0]} cy={panamaPoint[1]} r="17" /><circle className="hub-core" cx={panamaPoint[0]} cy={panamaPoint[1]} r="6" /><text className="hub-title" x={panamaPoint[0] + 25} y={panamaPoint[1] - 12}>Panamá - HUB for Latin América</text></g>
    </svg>
  </div>;
}
