type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

declare namespace mapit {
  interface Marker {
    id: number | null;
    type: string;
    points: mapit.point[];
    edit: boolean;
  }
}

declare namespace mapit {
  interface Point extends google.maps.LatLngLiteral {
    marker: mapit.MarkerOptions;
  }
}

declare namespace mapit {
  interface MarkerOptions {
    enabled: boolean;
    options?: google.maps.MarkerOptions;
  }
}

declare namespace mapit {
  interface MarkersProps {
    markers: Marker[];
    map: google.maps.Map;
  }
}

declare namespace mapit {
  interface MarkerAdderProps {
    addMarker: (marker: mapit.Marker) => void;
    marker?: mapit.Marker;
  }
}

declare namespace mapit {
  interface stylers {
    color?: string;
    weight?: number;
    visibility?: string;
  }

  interface style {
    featureType?: mapit.feature;
    elementType?: mapit.element;
    stylers: stylers[];
  }

  namespace json {
    interface feature {
      feature: mapit.feature;
      name: string;
      children?: feature[];
    }
    interface element {
      element: mapit.element;
      name: string;
      children?: element[];
    }

    interface styler {
      style: "color" | "visibility" | "weight";
    }

    interface styles {
      features: feature[];
      elements: element[];
      stylers: styler[];
    }
  }
}

namespace mapit {
  type element =
    | "all"
    | "geometry"
    | "geometry.fill"
    | "geometry.stroke"
    | "labels"
    | "labels.icon"
    | "labels.text"
    | "labels.text.fill"
    | "labels.text.stroke";

  type feature =
    | "all"
    | "administrative"
    | "administrative.country"
    | "administrative.land_parcel"
    | "administrative.locality"
    | "administrative.neighborhood"
    | "administrative.province"
    | "landscape"
    | "landscape.man_made"
    | "landscape.natural"
    | "landscape.natural.landcover"
    | "landscape.natural.terrain"
    | "poi"
    | "poi.attraction"
    | "poi.business"
    | "poi.government"
    | "poi.medical"
    | "poi.park"
    | "poi.place_of_worship"
    | "poi.school"
    | "poi.sports_complex"
    | "road"
    | "road.arterial"
    | "road.highway"
    | "road.highway.controlled_access"
    | "road.local"
    | "transit"
    | "transit.line"
    | "transit.station"
    | "transit.station.airport"
    | "transit.station.bus"
    | "transit.station.rail"
    | "water";
}