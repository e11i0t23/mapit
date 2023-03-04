import styles from "@/styles/Home.module.css";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState, useRef } from "react";
import { useImmer } from "use-immer";

import MarkersAdder from "./MarkerAdder";
import Markers from "./Markers";
import Styles from "./Styles";

const containerStyle = {
  width: "73vw",
  height: "98vh",
};

const center = {
  lat: 0,
  lng: 30,
};

export default function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "",
  });
  const nextMarkerId = useRef<number>(1);
  const [markers, setMarkers] = useImmer<mapit.Marker[]>([]);
  const [menu, setMenu] = useState<string>("style");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [projection, setProjection] = useState<boolean>(false);
  const [options, setOptions] = useImmer<google.maps.MapOptions>({
    zoom: 2,
    zoomControl: false,
    minZoom: 2,
    maxZoom: 16,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControlOptions: {
      position: 9,
    },
    styles: [],
  });

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
      setOptions((draft) => {
        draft.zoom = typeof currentZoom === "number" ? currentZoom : 2;
      });
      return true;
    }
    return false;
  };

  const addMarker = (marker: mapit.Marker) => {
    if (marker.id === null) {
      setMarkers((draft) => {
        draft.push({
          ...marker,
          id: nextMarkerId.current++,
        });
      });
    } else
      setMarkers((draft) => {
        const mark = draft.find((m) => m.id === marker.id);
        if (mark != undefined) {
          mark.type = marker.type;
          mark.points = marker.points;
          mark.edit = false;
        }
      });
  };

  return isLoaded ? (
    <div className="row">
      <div className={`col-3`}>
        <div className="row">
          <div className="btn-group" role="group">
            <button
              className="btn btn-primary"
              onClick={(e) => {
                setMenu("style");
              }}
            >
              Style
            </button>
            <button
              className="btn btn-primary"
              onClick={(e) => {
                setMenu("markers");
              }}
            >
              Markers
            </button>
            <button
              className="btn btn-primary"
              onClick={(e) => {
                setMenu("other");
              }}
            >
              Other
            </button>
          </div>
        </div>
        <div className="row">
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
                              setMarkers((draft) => {
                                draft[i].edit = true;
                              });
                            }}
                          >
                            edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              setMarkers((draft) => {
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
          center={center}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{ ...options }}
          zoom={options.zoom}
          onZoomChanged={handleZoom}
          onProjectionChanged={() => {
            setProjection(true);
          }}
        >
          {projection && map != null && (
            <div>
              <Markers markers={markers} map={map} />
            </div>
          )}
        </GoogleMap>
      </div>
    </div>
  ) : (
    <></>
  );
}
