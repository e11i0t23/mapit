import { Marker } from "@react-google-maps/api";

export default function CurveMarker({ pos1, pos2, map, zoom }) {
  if (!map || map == null || map.getProjection() == undefined) return <div />;
  var curvature = 0.2;
  const p1 = map.getProjection().fromLatLngToPoint(pos1),
    p2 = map.getProjection().fromLatLngToPoint(pos2);

  // Calculating the arc.
  const e = new google.maps.Point(p2.x - p1.x, p2.y - p1.y), // endpoint
    m = new google.maps.Point(e.x / 2, e.y / 2), // midpoint
    o = new google.maps.Point(e.y, -e.x), // orthogonal
    c = new google.maps.Point(m.x + curvature * o.x, m.y + curvature * o.y); //curve control point

  const pathDef = "M 0,0 " + "q " + c.x + "," + c.y + " " + e.x + "," + e.y;

  const scale = 1 / Math.pow(2, -zoom);

  const symbol = {
    path: pathDef,
    scale: scale,
    strokeWeight: 1.5,
    fillColor: "none",
  };

  return <Marker position={pos1} clickable={false} icon={symbol} zIndex={0} />;
}
