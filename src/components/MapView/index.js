import React from "react";
import L from "leaflet";
import { circle } from "@turf/turf";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

import { withAuthentication } from "../Session";

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.myMap = null;
    this.defaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = this.defaultIcon;

    this.area = this.area.bind(this);
  }

  componentDidMount() {
    this.myMap = L.map("map").setView(
      [this.props.latitude, this.props.longitude],
      17
    );

    L.tileLayer(
      "https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png"
    ).addTo(this.myMap);

    L.marker(
      [this.props.latitude, this.props.longitude],
      this.defaultIcon
    ).addTo(this.myMap);

    // this.area();
  }

  componentDidUpdate() {
    this.myMap.setView([this.props.latitude, this.props.longitude], 17);
  }

  area() {
    var radius = 0.25;
    var options = {
      steps: 25,
      units: "kilometers",
      properties: { foo: "bar" }
    };
    var c = circle(
      [this.props.latitude, this.props.longitude],
      radius,
      options
    );
    console.log(c);
    L.geoJSON(c).addTo(this.myMap);
  }
  render() {
    return <div id="map" />;
  }
}

export default withAuthentication(MapView);
