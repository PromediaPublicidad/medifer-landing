import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldAtlas from "world-atlas/countries-110m.json";

const WIDTH = 720;
const HEIGHT = 470;
const projection = geoMercator().center([-73, -11]).scale(560).translate([WIDTH / 2, HEIGHT / 2 + 20]);
const path = geoPath(projection);
const atlas = worldAtlas as unknown as { objects: { countries: unknown } };
const countries = feature(worldAtlas as never, atlas.objects.countries as never) as unknown as { features: Array<{ id?: string | number; geometry: unknown }> };
const PANAMA: [number, number] = [-80.1, 8.5];
const DESTINATIONS: Array<[number, number]> = [[-100, 26], [-91, 16], [-70, 17], [-61, 7], [-54, -15], [-70, -31]];

function routePath(from: [number, number], to: [number, number], bend: number) {
  const control: [number, number] = [from[0] + (to[0] - from[0]) * 0.52, from[1] + (to[1] - from[1]) * bend];
  const start = projection(from) ?? [0, 0];
  const end = projection(to) ?? [0, 0];
  const middle = projection(control) ?? [0, 0];
  return `M ${start[0]} ${start[1]} Q ${middle[0]} ${middle[1]} ${end[0]} ${end[1]}`;
}

export default function RegionalMap({ label }: { label: string }) {
  const panamaPoint = projection(PANAMA) ?? [0, 0];
  return <div className="regional-map" aria-label="Panamá como hub marítimo, aéreo y terrestre">
    <div className="map-heading"><span>LATINOAMÉRICA</span><small>Conexiones desde Panamá</small></div>
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby="map-title map-description">
      <title id="map-title">Panamá, hub regional de MEDIFER</title>
      <desc id="map-description">Mapa geográfico de Latinoamérica con Panamá como hub marítimo, aéreo y terrestre y conexiones hacia distintos mercados.</desc>
      <defs><marker id="route-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
      <g className="map-countries">{countries.features.map((country, index) => { const d = path(country as never); return d ? <path key={`${country.id ?? "country"}-${index}`} d={d} className="map-country" /> : null; })}</g>
      <g className="map-routes" aria-hidden="true">{DESTINATIONS.map((destination, index) => <g key={`${destination.join("-")}`}><path className="map-route" d={routePath(PANAMA, destination, index % 2 === 0 ? 18 : -18)} /><circle className="route-endpoint" cx={(projection(destination) ?? [0, 0])[0]} cy={(projection(destination) ?? [0, 0])[1]} r="3.5" /></g>)}</g>
      <g className="map-hub"><path className="hub-leader" d={`M ${panamaPoint[0]} ${panamaPoint[1]} L 205 112`} /><rect x="38" y="82" width="167" height="62" rx="7" /><circle className="hub-badge" cx="55" cy="103" r="9" /><text x="75" y="107">Panamá</text><text className="map-label" x="75" y="127">{label}</text><circle className="hub-ring" cx={panamaPoint[0]} cy={panamaPoint[1]} r="17" /><circle className="hub-core" cx={panamaPoint[0]} cy={panamaPoint[1]} r="6" /></g>
    </svg>
    <div className="map-key"><span><i className="key-dot key-dot-main" />Panamá</span><span><i className="key-route" />Conexiones regionales</span></div>
  </div>;
}
