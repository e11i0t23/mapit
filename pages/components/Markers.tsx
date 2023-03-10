import { Marker, Polyline, DirectionsRenderer } from "@react-google-maps/api";
import { useImmer } from "use-immer";
import CurveMarker from "./CurveMarker";
import { useEffect } from "react";
import { staticMapUrl } from "static-google-map";

export default function Markers({ markers, map, style, staticURL, setStaticURL }: mapit.MarkersProps) {
  var i = 0;

  const zoom = map === undefined ? 1 : (map.getZoom() as number);

  var [arr, setArr] = useImmer<JSX.Element[]>([]);

  useEffect(() => {
    setStaticURL((draft) => {
      draft.style = handleStyles(style);
    });
  }, [style]);

  useEffect(() => {
    setArr([]);
    setStaticURL((d) => {
      d.markers = [];
      d.paths = [];
    });
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
              setStaticURL((d) => {
                d.markers?.push({
                  color: `red`,
                  location: { lat: point.lat.toString(), lng: point.lng.toString() },
                });
              });
            }
          }
          break;
        case "PolyLine":
          setArr((d) => {
            d.push(<Polyline key={i++} path={marker.points} />);
          });
          setStaticURL((d) => {
            d.paths?.push({
              color: `${(marker.polyLineOptions?.strokeColor as string).replace("#", "0x")}${(
                ((marker.polyLineOptions?.strokeOpacity as number) * 255) /
                100
              ).toString(16)}`,
              weight: 2,
              points: marker.points.map((x, i) => `${x.lat},${x.lng}`),
            });
          });
          for (const point of marker.points) {
            if (point.marker.enabled) {
              setArr((d) => {
                d.push(<Marker key={i++} position={point} clickable={false} options={point.marker.options} />);
              });
              setStaticURL((d) => {
                d.markers?.push({
                  color: `red`,
                  location: { lat: point.lat.toString(), lng: point.lng.toString() },
                });
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
          setStaticURL((d) => {
            d.markers?.push({
              color: `red`,
              location: { lat: marker.points[0].lat.toString(), lng: marker.points[0].lng.toString() },
            });
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
                    key={i++}
                    options={{
                      directions: result,
                      draggable: true,
                      polylineOptions: marker.polyLineOptions,
                      suppressMarkers: true,
                    }}
                  />
                );
              });
              setStaticURL((d) => {
                d.paths?.push({
                  color: `${(marker.polyLineOptions?.strokeColor as string).replace("#", "0x")}${(
                    ((marker.polyLineOptions?.strokeOpacity as number) * 255) /
                    100
                  ).toString(16)}`,
                  weight: 2,
                  points: result?.routes[0].overview_path.map((x, i) => x.toUrlValue()) as string[],
                });
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
  }, [markers, map.getZoom()]);
  useEffect(() => {
    console.log(staticMapUrl(staticURL));
  }, [staticURL]);
  return <div>{...arr}</div>;
}

const handleStyles = (styles: google.maps.MapTypeStyle[]) => {
  var style = "";
  for (const s of styles) {
    style += `&style=feature:${s.featureType}|element:${s.elementType}`;
    s.stylers.forEach((x) => {
      if ("color" in x) style += `|color:${x.color}`;
      if ("weight" in x) style += `|weight:${x.weight}`;
      if ("visibility" in x) style += `|visibility:${x.visibility}`;
    });
  }

  return style.replaceAll("#", "0x").replaceAll("|", "%7C").replace("&style=", "");
};
