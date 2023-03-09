import { Marker, Polyline, DirectionsRenderer } from "@react-google-maps/api";
import { useImmer } from "use-immer";
import CurveMarker from "./CurveMarker";
import { useEffect } from "react";

export default function Markers({ markers, map }: mapit.MarkersProps) {
  if (map == undefined) return <div />;
  var i = 0;
  var [arr, setArr] = useImmer<JSX.Element[]>([]);
  const zoom = map.getZoom() as number;
  useEffect(() => {
    setArr([]);
    for (const marker of markers) {
      switch (marker.type) {
        case "CurveMarker":
          setArr((d) => {
            d.push(<CurveMarker key={i++} pos1={marker.points[0]} pos2={marker.points[1]} map={map} zoom={zoom} />);
          });
          for (const point of marker.points) {
            if (point.marker.enabled) {
              setArr((d) => {
                d.push(<Marker key={i++} position={point} clickable={false} options={point.marker.options} />);
              });
            }
          }
          break;
        case "PolyLine":
          setArr((d) => {
            d.push(<Polyline key={i++} path={marker.points} />);
          });
          for (const point of marker.points) {
            if (point.marker.enabled) {
              setArr((d) => {
                d.push(<Marker key={i++} position={point} clickable={false} options={point.marker.options} />);
              });
            }
          }
          break;
        case "Point":
          setArr((d) => {
            d.push(
              <Marker
                key={i++}
                position={marker.points[0]}
                clickable={false}
                options={marker.points[0].marker.options}
              />
            );
          });
          break;
        case "Route":
          console.log(marker.polyLineOptions);
          const directionsService = new google.maps.DirectionsService();
          const callback = (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
            if (status == "OK") {
              setArr((d) => {
                d.push(
                  <DirectionsRenderer
                    options={{
                      directions: result,
                      draggable: true,
                      polylineOptions: marker.polyLineOptions,
                      suppressMarkers: true,
                    }}
                  />
                );
              });
            }
          };
          directionsService.route(
            {
              destination: marker.points[0].search,
              origin: marker.points[1].search,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            callback
          );
          break;

        default:
          break;
      }
    }
  }, [markers]);

  return <div>{...arr}</div>;
}
