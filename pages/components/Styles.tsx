import styleOptions from "../../lib/styles";
import styles from "@/styles/Styles.module.css";

import { useEffect, useState } from "react";
import { useImmer, Updater } from "use-immer";
import { Draft } from "immer";

type visibility = "inherit" | "off" | "simplified" | "show";

const defaultForm: mapit.stylesForm = {
  colorEnable: false,
  color: "#4c4c4c",
  weightEnable: false,
  weight: 1,
  visibility: "inherit",
};

export default function Styles({ options, setOptions }: mapit.stylesProp) {
  const [feature, setFeature] = useState<mapit.feature>();
  const [element, setElement] = useState<mapit.element>();
  const [form, setForm] = useImmer<mapit.stylesForm>(defaultForm);

  const processFeatures = (x: mapit.json.feature | mapit.json.element, i: number) => {
    var feat = "feature" in x ? true : false;
    const value = "feature" in x ? x.feature : x.element;
    let arr = [
      <div key={`${value}.${i}`}>
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            feat ? setFeature(value as mapit.feature) : setElement(value as mapit.element);
          }}
          style={{ color: value == (feat ? feature : element) ? "red" : "blue" }}
        >
          {x.name}
        </a>
      </div>,
    ];
    if (x.children != undefined) {
      x.children.map(processFeatures).map((z, f) => {
        arr.push(
          <div className={styles.indent} key={`${value}.${i}.${f}`}>
            {z}
          </div>
        );
      });
      return arr;
    } else return arr;
  };

  // When feature is changed set selected elements to undefined
  useEffect(() => {
    setElement(undefined);
  }, [feature, setElement]);

  // When an element is selected we find see if settings for it already exist in our styles array and load the settings otherwise default values are used
  useEffect(() => {
    const exists = options.styles?.find((s) => s.featureType === feature && s.elementType === element);
    if (exists != undefined) {
      const color: mapit.stylers | undefined = exists.stylers.find((t: mapit.stylers) => t.color !== undefined);
      const visibility: mapit.stylers | undefined = exists.stylers.find(
        (t: mapit.stylers) => t.visibility !== undefined
      );
      const weight: mapit.stylers | undefined = exists.stylers.find((t: mapit.stylers) => t.weight !== undefined);
      setForm((draft) => {
        draft.colorEnable = color === undefined ? false : true;
        draft.color = color === undefined ? "#3c3c3c" : (color.color as string);
        draft.visibility = visibility === undefined ? "inherit" : (visibility.visibility as visibility);
        draft.weightEnable = weight === undefined ? false : true;
        draft.weight = weight === undefined ? 1 : (weight.weight as number);
      });
    } else setForm(defaultForm);
  }, [element, setForm]);

  // Handel updating our styles array when the form updates
  useEffect(() => {
    let item: mapit.style = {
      featureType: feature,
      elementType: element,
      stylers: [
        ...(form.colorEnable ? [{ color: form.color }] : []),
        ...(form.weightEnable ? [{ weight: form.weight }] : []),
        ...(form.visibility != "inherit" ? [{ visibility: form.visibility }] : []),
      ],
    };
    // Check a feature and element type are set
    if (item.featureType !== undefined && item.elementType !== undefined) {
      setOptions((draft: Draft<google.maps.MapOptions>) => {
        // Find out if we are updating a style, adding a new style, or if no stylers are set we remove the style object
        var exists = draft.styles?.find((s) => s.featureType === feature && s.elementType === element);
        if (exists !== undefined && item.stylers.length > 0) exists.stylers = item.stylers;
        else if (item.stylers.length > 0) draft.styles?.push(item);
        else
          draft.styles = options.styles?.filter(
            (o) => !(o.elementType == item.elementType && o.featureType == item.featureType)
          );
      });
    }
  }, [form, setForm, setOptions]);

  return (
    <>
      <div className="row">
        <div className="col-4">{styleOptions.features.map(processFeatures)}</div>
        <div className="col-4">{feature != undefined && styleOptions.elements.map(processFeatures)}</div>
        <div className="col-4">
          {element != undefined && (
            <>
              <label>
                Color:
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={form.colorEnable}
                  onChange={(e) => {
                    setForm((d) => {
                      d.colorEnable = e.target.checked;
                    });
                  }}
                />
                <input
                  className="form-control"
                  type="color"
                  value={form.color}
                  onChange={(e) => {
                    setForm((d) => {
                      d.color = e.target.value;
                      d.colorEnable = true;
                    });
                  }}
                />
              </label>
              <label>
                weight:
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={form.weightEnable}
                  onChange={(e) => {
                    setForm((d) => {
                      d.weightEnable = e.target.checked;
                    });
                  }}
                />
                <input
                  className="form-control"
                  type="range"
                  min={0}
                  max={8}
                  step={0.5}
                  value={form.weight}
                  onChange={(e) => {
                    setForm((d) => {
                      d.weight = parseInt(e.target.value);
                      d.weightEnable = true;
                    });
                  }}
                />
              </label>
              <div>
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="inherit"
                    name="visibilityRadio"
                    checked={form.visibility == "inherit"}
                    onChange={(e) => {
                      setForm((d) => {
                        d.visibility = "inherit";
                      });
                    }}
                  />
                  inherit
                </label>
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="off"
                    name="visibilityRadio"
                    checked={form.visibility == "off"}
                    onChange={(e) => {
                      setForm((d) => {
                        d.visibility = "off";
                      });
                    }}
                  />
                  hidden
                </label>
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="simplified"
                    name="visibilityRadio"
                    checked={form.visibility == "simplified"}
                    onChange={(e) => {
                      setForm((d) => {
                        d.visibility = "simplified";
                      });
                    }}
                  />
                  Simplified
                </label>
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="show"
                    name="visibilityRadio"
                    checked={form.visibility == "show"}
                    onChange={(e) => {
                      setForm((d) => {
                        d.visibility = "show";
                      });
                    }}
                  />
                  show
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
