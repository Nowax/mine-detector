import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Map, TileLayer, Marker, Polygon } from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import { bbox, circle, bboxPolygon, point } from "@turf/turf";

import { withAuthentication } from "../Session";

class MapViewAlternative extends React.Component {
  constructor(props) {
    super(props);
    const turfPoint = point([this.props.longitude, this.props.latitude]);
    const bb = this.generateBbox(turfPoint, this.props.radius);

    this.state = {
      center: [this.props.latitude, this.props.longitude],
      markers: [[this.props.latitude, this.props.longitude]],
      radius: this.props.radius,
      bbox: bb,
      bboxPoly: bboxPolygon(bb).geometry.coordinates[0].map((el) => [
        el[1],
        el[0]
      ])
    };
  }

  generateBbox = (center, radius) => {
    var options = { steps: 16, units: "kilometers" };
    return bbox(circle(center, radius, options));
    // var points = turf.randomPoint(8, { bbox: bb });
    // L.geoJson(turf.bboxPolygon(bb)).addTo(map);
    // L.geoJson(points).addTo(map);
  };

  addMarker = (e) => {
    const { markers } = this.state;
    markers.pop();
    markers.push(e.latlng);
    this.setState({ markers });
  };

  componentDidUpdate() {
    if (
      this.state.center[0] !== this.props.latitude ||
      this.state.center[1] !== this.props.longitude ||
      this.state.radius !== this.props.radius
    ) {
      const turfPoint = point([this.props.longitude, this.props.latitude]);
      const bb = this.generateBbox(turfPoint, this.props.radius);
      this.setState({
        center: [this.props.latitude, this.props.longitude],
        radius: this.props.radius,
        markers: [[this.props.latitude, this.props.longitude]],
        bbox: bb,
        bboxPoly: bboxPolygon(bb).geometry.coordinates[0].map((el) => [
          el[1],
          el[0]
        ])
      });
    }
  }

  render() {
    let DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [24, 36],
      iconAnchor: [12, 36]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    return (
      <div>
        <Map
          center={this.state.center}
          onClick={this.addMarker}
          zoom={17}
          maxZoom={20}
          minZoom={1}
          style={{ width: "100%", height: "400px" }}
        >
          <TileLayer
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png"
          />
          {this.state.markers.map((position, idx) => (
            <Marker key={`marker-${idx}`} position={position} />
          ))}
          <Polygon positions={this.state.bboxPoly} />
        </Map>
      </div>
    );
  }
}

export default withAuthentication(MapViewAlternative);
