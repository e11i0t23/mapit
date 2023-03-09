import { Draft } from "immer";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const blankPoint: mapit.Point = {
  lat: 0,
  lng: 0,
  search: "",
  marker: { enabled: true, options: { label: null, icon: null } },
};

export default function MarkersAdder({ addMarker, marker }: mapit.MarkerAdderProps) {
  const [newMarker, setMarker] = useImmer<mapit.Marker>({
    id: null,
    type: "Point",
    points: [blankPoint],
    edit: false,
    polyLineOptions: undefined,
  });

  useEffect(() => {
    if (marker !== undefined) {
      setMarker(marker);
    }
  }, [marker]);

  function onSubmit() {
    setMarker((draft: Draft<mapit.Marker>) => {
      draft.edit = false;
    });
    addMarker(newMarker);
    setMarker({ id: null, type: "Point", points: [blankPoint], edit: false, polyLineOptions: undefined });
  }

  function updateType(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log("uuuuu");
    const type = e.target.value as mapit.MarkerType;
    let len = 0;
    switch (type) {
      case "Point":
        len = 1;
        break;
      case "CurveMarker":
        len = 2;
        break;
      case "PolyLine":
        len = 2;
        break;
      case "Route":
        len = 2;
        break;
    }
    setMarker((draft) => {
      draft.type = type;
      if (type === "PolyLine" || type === "Route") {
        if (draft.polyLineOptions === undefined) draft.polyLineOptions = { strokeColor: "#007bff", strokeOpacity: 50 };
      } else draft.polyLineOptions = undefined;
      if (newMarker.points.length > len) {
        draft.points.splice(1);
      } else if (newMarker.points.length < len) {
        for (let i = 0; i < len - newMarker.points.length; i++) {
          draft.points.push(blankPoint);
        }
      }
    });
  }

  return (
    <div>
      <select className="form-select" aria-label="Default select example" value={newMarker.type} onChange={updateType}>
        <option value="Point">Point</option>
        <option value="CurveMarker">Arc</option>
        <option value="PolyLine">PolyLine</option>
        <option value="Route">Route</option>
      </select>
      <div></div>
      <div style={{ maxHeight: "22vh", overflow: "hidden", overflowY: "scroll", textAlign: "center" }}>
        {Array.apply(0, Array(newMarker.points.length)).map(function (x, i) {
          return (
            <form key={i}>
              {newMarker.type === "Route" ? (
                <div className="input-group input-group-sm">
                  <span className="input-group-text">Place:</span>
                  <input
                    type="text"
                    className="form-control"
                    value={newMarker.points[i].search}
                    onChange={(e) =>
                      setMarker((draft: Draft<mapit.Marker>) => {
                        draft.points[i].search = e.target.value;
                      })
                    }
                  />
                </div>
              ) : (
                <div className="input-group input-group-sm">
                  <span className="input-group-text">Lat:</span>
                  <input
                    type="number"
                    className="form-control"
                    value={newMarker.points[i].lat}
                    onChange={(e) =>
                      setMarker((draft: Draft<mapit.Marker>) => {
                        draft.points[i].lat = parseFloat(e.target.value);
                      })
                    }
                  />
                  <span className="input-group-text">Long:</span>
                  <input
                    type="number"
                    className="form-control"
                    value={newMarker.points[i].lng}
                    onChange={(e) =>
                      setMarker((draft: Draft<mapit.Marker>) => {
                        draft.points[i].lng = parseFloat(e.target.value);
                      })
                    }
                  />
                </div>
              )}
              {(newMarker.type == "CurveMarker" || newMarker.type == "PolyLine") && (
                <div className="form-check form-switch">
                  <label className="form-check-label">
                    Show Points at end of Line:
                    <input
                      className="form-check-input"
                      style={{ float: "none", marginLeft: "5px" }}
                      type="checkbox"
                      role="switch"
                      checked={newMarker.points[i].marker.enabled}
                      onChange={(e) => {
                        console.log();
                        setMarker((draft: Draft<mapit.Marker>) => {
                          draft.points[i].marker.enabled = e.target.checked;
                        });
                      }}
                    />
                  </label>
                </div>
              )}
              {newMarker.type !== "Route" && (
                <div className="input-group input-group-sm">
                  <span className="input-group-text">Label:</span>
                  <div className="input-group-text">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={newMarker.points[i].marker.options.label !== null}
                      role="switch"
                      onChange={(e) => {
                        setMarker((draft: Draft<mapit.Marker>) => {
                          draft.points[i].marker.options.label = e.target.checked
                            ? { color: "#ffffff", text: "" }
                            : null;
                        });
                      }}
                    />
                  </div>
                  {newMarker.points[i].marker.options.label !== null && (
                    <>
                      <input
                        className="form-control"
                        type="text"
                        value={newMarker.points[i].marker.options.label.text}
                        onChange={(e) => {
                          setMarker((draft: Draft<mapit.Marker>) => {
                            draft.points[i].marker.options.label.text = e.target.value;
                          });
                        }}
                      />
                      <input
                        className="form-control-sm me-0"
                        type="color"
                        style={{ width: "31px", height: "31px" }}
                        value={newMarker.points[i].marker.options.label.color}
                        onChange={(e) => {
                          setMarker((draft: Draft<mapit.Marker>) => {
                            draft.points[i].marker.options.label.color = e.target.value;
                          });
                        }}
                      />
                      <div className="input-group input-group-sm">
                        <div className="input-group-text">
                          <span>Icon:</span>
                          <input
                            className="form-check-input mt-0"
                            type="checkbox"
                            role="switch"
                            checked={newMarker.points[i].marker.options.icon === null}
                            onChange={(e) => {
                              setMarker((draft: Draft<mapit.Marker>) => {
                                draft.points[i].marker.options.icon = e.target.checked
                                  ? undefined
                                  : { path: google.maps.SymbolPath.CIRCLE, scale: 0 };
                              });
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </form>
          );
        })}
        {(newMarker.type === "PolyLine" || newMarker.type === "Route") && (
          <form>
            <div className="input-group input-group-sm">
              <span className="input-group-text">Color:</span>
              <input
                className="form-control"
                type="color"
                value={newMarker.polyLineOptions?.strokeColor as string}
                onChange={(e) => {
                  setMarker((draft) => {
                    if (draft.polyLineOptions !== undefined)
                      draft.polyLineOptions = { ...draft.polyLineOptions, strokeColor: e.target.value };
                  });
                }}
              />
              <span className="input-group-text">Opacity</span>
              <input
                className="form-control"
                type="number"
                value={newMarker.polyLineOptions?.strokeOpacity as number}
                onChange={(e) => {
                  setMarker((draft) => {
                    if (draft.polyLineOptions !== undefined)
                      draft.polyLineOptions = { ...draft.polyLineOptions, strokeOpacity: parseInt(e.target.value) };
                  });
                }}
              />
            </div>
          </form>
        )}
      </div>
      {newMarker.type == "PolyLine" && (
        <button
          className="btn btn-primary"
          onClick={(e) =>
            setMarker((draft) => {
              draft.points.push(blankPoint);
            })
          }
        >
          Add Point
        </button>
      )}
      <button className="btn btn-primary" onClick={onSubmit}>
        {newMarker.edit ? "Save" : "Add"}
      </button>
    </div>
  );
}
