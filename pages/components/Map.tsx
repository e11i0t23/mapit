import styles from "@/styles/Home.module.css";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Draft } from "immer";
import { useCallback, useState, useRef, useEffect } from "react";

import MarkersAdder from "./MarkerAdder";
import Markers from "./Markers";
import Styles from "./Styles";

const containerStyle = {
  width: "73vw",
  height: "calc(100vh - 100px)",
};

export default function Map({
  options,
  setOptions,
  markers,
  setMarkers,
  menu,
  setMenu,
  staticURL,
  setStaticURL,
  optionsMemo,
}: mapit.mainProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const nextMarkerId = useRef<number>(1);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [projection, setProjection] = useState<boolean>(false);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    map.setOptions(options);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
    setProjection(false);
  }, []);

  const handleZoom = () => {
    let currentZoom = map?.getZoom();
    if (typeof currentZoom === "number" && currentZoom != options.zoom) {
      setOptions((draft: Draft<google.maps.MapOptions>) => {
        draft.zoom = typeof currentZoom === "number" ? currentZoom : 2;
      });

      setStaticURL((draft: Draft<Props>) => {
        draft.zoom = typeof currentZoom === "number" ? currentZoom : 2;
      });

      return true;
    }
    return false;
  };

  const addMarker = (marker: mapit.Marker) => {
    if (marker.id === null) {
      setMarkers((draft: Draft<mapit.Marker[]>) => {
        draft.push({
          ...marker,
          id: nextMarkerId.current++,
        });
      });
    } else
      setMarkers((draft: Draft<mapit.Marker[]>) => {
        const mark = draft.find((m) => m.id === marker.id);
        if (mark != undefined) {
          mark.type = marker.type;
          mark.points = marker.points;
          mark.edit = false;
          mark.polyLineOptions = marker.polyLineOptions;
        }
      });
  };

  const updateStatic = () => {
    setStaticURL((draft: Draft<Props>) => {
      const currentCenterURL = map?.getCenter()?.toUrlValue();
      if (typeof currentCenterURL !== "undefined") draft.center = currentCenterURL;
    });
  };

  return isLoaded ? (
    <div className="row">
      <div className={`col-3`}>
        <div className="row" style={{ height: "calc(100vh - 100px)", overflowY: "scroll" }}>
          {menu === "markers" && (
            <>
              <div style={{ height: "28vh" }}>
                <MarkersAdder addMarker={addMarker} />
              </div>
              <div className={styles.overflowmarker}>
                {markers.map((marker, i) => {
                  return (
                    <div key={i}>
                      <hr />
                      {marker.edit ? (
                        <MarkersAdder addMarker={addMarker} marker={marker} />
                      ) : (
                        <div>
                          {`Id: ${marker.id} `}
                          {`Type: ${marker.type} `}
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              setMarkers((draft: Draft<mapit.Marker[]>) => {
                                draft[i].edit = true;
                              });
                            }}
                          >
                            edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              setMarkers((draft: Draft<mapit.Marker[]>) => {
                                draft.splice(i, 1);
                              });
                            }}
                          >
                            Del
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {menu === "style" && <Styles options={options} setOptions={setOptions} />}
        </div>
      </div>
      <div className="col-9">
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onDragEnd={() => {
            setOptions((draft: Draft<google.maps.MapOptions>) => {
              draft.center = map?.getCenter()?.toJSON();
            });
            updateStatic();
          }}
          options={optionsMemo}
          onZoomChanged={handleZoom}
          onProjectionChanged={() => {
            setProjection(true);
          }}
        >
          {projection && map != null && (
            <div>
              <Markers
                markers={markers}
                map={map}
                style={options.styles as google.maps.MapTypeStyle[]}
                staticURL={staticURL}
                setStaticURL={setStaticURL}
              />
            </div>
          )}
        </GoogleMap>
      </div>
    </div>
  ) : (
    <></>
  );
}
