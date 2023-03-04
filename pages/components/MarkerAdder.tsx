import { useEffect } from "react";
import { useImmer } from "use-immer";

const blankPoint: mapit.Point = {
  lat: 0,
  lng: 0,
  marker: { enabled: true, options: { label: null, icon: undefined } },
};

export default function MarkersAdder({ addMarker, marker }: mapit.MarkerAdderProps) {
  const [newMarker, setMarker] = useImmer<mapit.Marker>({
    id: null,
    type: "Point",
    points: [blankPoint],
    edit: false,
  });

  useEffect(() => {
    if (marker != undefined) {
      setMarker(marker);
    }
  }, [marker]);

  function onSubmit() {
    setMarker((draft) => {
      draft.edit = false;
    });
    addMarker(newMarker);
    setMarker({ id: null, type: "Point", points: [blankPoint], edit: false });
  }

  function updateType(e) {
    const type = e.target.value;
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
    }
    setMarker((draft) => {
      draft.type = type;
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
      </select>
      <div></div>
      <div style={{ maxHeight: "22vh", overflow: "hidden", overflowY: "scroll", textAlign: "center" }}>
        {Array.apply(0, Array(newMarker.points.length)).map(function (x, i) {
          return (
            <>
              <form key={i}>
                <label className="form-check-label">
                  Latitude:
                  <input
                    type="number"
                    value={newMarker.points[i].lat}
                    onChange={(e) =>
                      setMarker((draft) => {
                        draft.points[i].lat = parseFloat(e.target.value);
                      })
                    }
                  />
                </label>
                <label className="form-check-label">
                  longditude:
                  <input
                    type="number"
                    value={newMarker.points[i].lng}
                    onChange={(e) =>
                      setMarker((draft) => {
                        draft.points[i].lng = parseFloat(e.target.value);
                      })
                    }
                  />
                </label>
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
                          setMarker((draft) => {
                            draft.points[i].marker.enabled = e.target.checked;
                          });
                        }}
                      />
                    </label>
                  </div>
                )}
                <div className="form-check form-switch">
                  <label className="form-check-label">
                    Label:
                    <input
                      className="form-check-input"
                      style={{ float: "none", marginLeft: "5px" }}
                      type="checkbox"
                      checked={newMarker.points[i].marker.options.label !== null}
                      role="switch"
                      onChange={(e) => {
                        setMarker((draft) => {
                          draft.points[i].marker.options.label = e.target.checked
                            ? { color: "#ffffff", text: "" }
                            : null;
                        });
                      }}
                    />
                    {newMarker.points[i].marker.options.label !== null && (
                      <>
                        <span>
                          <input
                            className="form-control"
                            type="text"
                            value={newMarker.points[i].marker.options.label.text}
                            onChange={(e) => {
                              setMarker((draft) => {
                                draft.points[i].marker.options.label.text = e.target.value;
                              });
                            }}
                          />
                          <input
                            className="form-control"
                            type="color"
                            style={{ width: "40px" }}
                            value={newMarker.points[i].marker.options.label.color}
                            onChange={(e) => {
                              setMarker((draft) => {
                                draft.points[i].marker.options.label.color = e.target.value;
                              });
                            }}
                          />
                        </span>
                      </>
                    )}
                  </label>
                </div>
                <div className="form-check form-switch">
                  <label className="form-check-label">
                    Icon:
                    <input
                      className="form-check-input"
                      style={{ float: "none", marginLeft: "5px" }}
                      type="checkbox"
                      role="switch"
                      checked={newMarker.points[i].marker.options.icon === undefined}
                      onChange={(e) => {
                        console.log();
                        setMarker((draft) => {
                          draft.points[i].marker.options.icon = e.target.checked
                            ? undefined
                            : { path: google.maps.SymbolPath.CIRCLE, scale: 0 };
                        });
                      }}
                    />
                  </label>
                </div>
              </form>
              <hr />
            </>
          );
        })}
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
