import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldAtlas from "world-atlas/countries-110m.json";

type MapLabels = { panama: string; venezuela: string; ecuador: string };
const WIDTH = 720;
const HEIGHT = 470;
const projection = geoMercator().center([-73, -11]).scale(560).translate([WIDTH / 2, HEIGHT / 2 + 20]);
const path = geoPath(projection);
const atlas = worldAtlas as unknown as { objects: { countries: unknown } };
const countries = feature(worldAtlas as never, atlas.objects.countries as never) as unknown as { features: Array<{ id?: string | number; geometry: unknown }> };
const highlightedCountries = new Set(["218", "591", "862"]);
const markerData = [
  { key: "panama", coordinates: [-80.1, 8.5] as [number, number], box: { x: 48, y: 72, w: 176 }, primary: true },
  { key: "venezuela", coordinates: [-66.2, 7.1] as [number, number], box: { x: 496, y: 116, w: 176 }, primary: false },
  { key: "ecuador", coordinates: [-78.4, -1.4] as [number, number], box: { x: 360, y: 292, w: 160 }, primary: false },
] as const;

export default function RegionalMap({ labels }: { labels: MapLabels }) {
  const textByKey = { panama: ["Panamá", labels.panama], venezuela: ["Venezuela", labels.venezuela], ecuador: ["Ecuador", labels.ecuador] } as const;
  return <div className="regional-map" aria-label="Panamá, Venezuela y Ecuador">
    <div className="map-heading"><span>LATINOAMÉRICA</span><small>Presencia actual</small></div>
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby="map-title map-description">
      <title id="map-title">Presencia regional de MEDIFER</title>
      <desc id="map-description">Mapa geográfico de Latinoamérica con Panamá como sede regional y presencia en Venezuela y Ecuador.</desc>
      <g className="map-countries">{countries.features.map((country, index) => { const id = String(country.id ?? ""); const d = path(country as never); return d ? <path key={`${id}-${index}`} d={d} className={highlightedCountries.has(id) ? "map-country is-highlighted" : "map-country"} /> : null; })}</g>
      {markerData.map((marker) => { const point = projection(marker.coordinates) ?? [0, 0]; const [label, status] = textByKey[marker.key]; const lineEndX = marker.box.x > point[0] ? marker.box.x : marker.box.x + marker.box.w; const lineEndY = marker.box.y + 28; return <g className={`map-connector ${marker.primary ? "is-primary" : ""}`} key={marker.key}>
        <path d={`M ${point[0]} ${point[1]} L ${lineEndX} ${lineEndY}`} /><rect x={marker.box.x} y={marker.box.y} width={marker.box.w} height="57" rx="7" /><circle cx={marker.box.x + 16} cy={marker.box.y + 18} r={marker.primary ? 8 : 6} /><text x={marker.box.x + 34} y={marker.box.y + 22}>{label}</text><text className="map-label" x={marker.box.x + 34} y={marker.box.y + 41}>{status}</text><circle className="map-marker-ring" cx={point[0]} cy={point[1]} r={marker.primary ? 15 : 10} /><circle className="map-marker-core" cx={point[0]} cy={point[1]} r={marker.primary ? 5 : 4} />
      </g>; })}
    </svg>
    <div className="map-key"><span><i className="key-dot key-dot-main" />Sede regional</span><span><i className="key-dot" />Presencia regional</span></div>
  </div>;
}
