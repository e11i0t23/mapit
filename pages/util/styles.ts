const styleOptions: mapit.json.styles = {
  features: [
    { feature: "all", name: "All" },
    {
      feature: "administrative",
      name: "Administrative",
      children: [
        { feature: "administrative.country", name: "Country" },
        { feature: "administrative.land_parcel", name: "Land Parcel" },
        { feature: "administrative.locality", name: "Locality" },
        { feature: "administrative.neighborhood", name: "Neighborhood" },
        { feature: "administrative.province", name: "Province" },
      ],
    },
    {
      feature: "landscape",
      name: "Landscape",
      children: [
        { feature: "landscape.man_made", name: "Man Made" },
        {
          feature: "landscape.natural",
          name: "Natural",
          children: [
            { feature: "landscape.natural.landcover", name: "Landcover" },
            { feature: "landscape.natural.terrain", name: "Terrain" },
          ],
        },
      ],
    },
    {
      feature: "poi",
      name: "Points of Interest",
      children: [
        { feature: "poi.attraction", name: "Attraction" },
        { feature: "poi.business", name: "Business" },
        { feature: "poi.government", name: "Government" },
        { feature: "poi.medical", name: "Medical" },
        { feature: "poi.park", name: "Park" },
        { feature: "poi.place_of_worship", name: "Place of Worship" },
        { feature: "poi.school", name: "School" },
        { feature: "poi.sports_complex", name: "Sports Complex" },
      ],
    },
    {
      feature: "road",
      name: "Road",
      children: [
        {
          feature: "road.highway",
          name: "Highway",
          children: [{ feature: "road.highway.controlled_access", name: "Controlled Access" }],
        },
        { feature: "road.arterial", name: "Arterial" },
        { feature: "road.local", name: "Local" },
      ],
    },
    {
      feature: "transit",
      name: "Transit",
      children: [
        { feature: "transit.line", name: "Line" },
        {
          feature: "transit.station",
          name: "Station",
          children: [
            { feature: "transit.station.airport", name: "Airport" },
            { feature: "transit.station.bus", name: "Bus" },
            { feature: "transit.station.rail", name: "Rail" },
          ],
        },
      ],
    },
    {
      feature: "water",
      name: "Water",
    },
  ],
  elements: [
    { element: "all", name: "All" },
    {
      element: "geometry",
      name: "Geometry",
      children: [
        { element: "geometry.fill", name: "Fill" },
        { element: "geometry.stroke", name: "Stroke" },
      ],
    },
    {
      element: "labels",
      name: "Labels",
      children: [
        { element: "labels.icon", name: "Icon" },
        {
          element: "labels.text",
          name: "Text",
          children: [
            { element: "labels.text.fill", name: "Fill" },
            { element: "labels.text.stroke", name: "Stroke" },
          ],
        },
      ],
    },
  ],
  stylers: [{ style: "color" }, { style: "visibility" }, { style: "weight" }],
};

export default styleOptions;
