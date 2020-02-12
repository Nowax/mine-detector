import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Map, TileLayer, Marker, Polygon } from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import equal from "fast-deep-equal";

import { withAuthentication } from "../Session";

class MapViewAlternative extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      center: [this.props.latitude, this.props.longitude],
      markers: this.props.mines,
      bboxPoly: this.props.bboxPoly
    };
  }

  componentDidUpdate(prevProps) {
    if (
      !equal(this.props.latitude, prevProps.latitude) ||
      !equal(this.props.longitude, prevProps.longitude) ||
      !equal(this.props.bboxPoly, prevProps.bboxPoly) ||
      !equal(this.props.mines, prevProps.mines)
    ) {
      console.log(this.props.mines);
      this.setState({
        center: [this.props.latitude, this.props.longitude],
        bboxPoly: this.props.bboxPoly,
        markers: this.props.mines
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
