import { Marker, Polyline } from "@react-google-maps/api";
import CurveMarker from "./CurveMarker";

export default function Markers({ markers, map }: mapit.MarkersProps) {
  var i = 0;
  var arr = [<div key={"hello"}>hello</div>];
  const zoom = map.getZoom() as number;
  for (const marker of markers) {
    switch (marker.type) {
      case "CurveMarker":
        arr.push(<CurveMarker key={i++} pos1={marker.points[0]} pos2={marker.points[1]} map={map} zoom={zoom} />);
        for (const point of marker.points) {
          if (point.marker.enabled) {
            arr.push(<Marker key={i++} position={point} clickable={false} options={point.marker.options} />);
          }
        }
        break;
      case "PolyLine":
        arr.push(<Polyline key={i++} path={marker.points} />);
        for (const point of marker.points) {
          if (point.marker.enabled) {
            arr.push(<Marker key={i++} position={point} clickable={false} options={point.marker.options} />);
          }
        }
        break;
      case "Point":
        arr.push(
          <Marker key={i++} position={marker.points[0]} clickable={false} options={marker.points[0].marker.options} />
        );
        break;

      default:
        break;
    }
  }
  return <div>{...arr}</div>;
}
