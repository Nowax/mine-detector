import React from "react";
import { compose } from "recompose";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withTheme } from "../Theme";
import { withAuthentication } from "../Session";
import { withFirebase } from "../Firebase";

import MapViewAlternative from "../MapViewAlternative";
import { bbox, circle, bboxPolygon, randomPoint, flip } from "@turf/turf";

const DEFAULT_RADIUS = 0.05;

class GeolocatioBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      center: null,
      field: null,
      radius: DEFAULT_RADIUS,
      mines: null,
      minesLocations: null
    };
  }

  generateField = (center, radius) => {
    const c = [center.coords.longitude, center.coords.latitude];
    console.log("center: " + c);
    console.log("radius: " + radius);
    var options = { steps: 16, units: "kilometers" };
    return bbox(circle(c, radius, options));
  };

  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      (center) => {
        console.log(center);
        this.setState({
          center: center,
          locations: [center],
          field: this.generateField(center, this.state.radius)
        });
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  handleSave = () => {
    this.state.locations.forEach((loc) => {
      this.props.firebase.setGeoJSON(loc);
    });
  };

  handleMines = (event) => {
    const val =
      event.target.value && event.target.value > 0 ? event.target.value : 0;
    if (this.state.field) {
      const points = randomPoint(val, { bbox: this.state.field });
      this.setState({
        mines: points,
        minesLocations: points.features.map((el) => [
          el.geometry.coordinates[1],
          el.geometry.coordinates[0]
        ])
      });
    }
  };

  handleRadius = (event) => {
    const val =
      event.target.value && event.target.value > 0
        ? (event.target.value * 1.0) / 1000
        : DEFAULT_RADIUS;

    if (this.state.center) {
      const f = this.generateField(this.state.center, val);
      const points = randomPoint(this.state.minesLocations.length, {
        bbox: f
      });

      this.setState({
        radius: val,
        field: f,
        mines: points,
        minesLocations: points
          ? points.features.map((el) => [
              el.geometry.coordinates[1],
              el.geometry.coordinates[0]
            ])
          : null
      });
    }
  };

  render() {
    return (
      <div>
        <br />
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={this.findCoordinates}
        >
          Get current location
        </Button>
        <br />
        <br />
        <TextField
          type="number"
          label="Radius (in meters)"
          variant="filled"
          inputProps={{ min: "0", max: "100000", step: "1" }}
          onChange={this.handleRadius}
          color="primary"
        />
        <br />
        <br />
        <TextField
          type="number"
          label="Number of mines"
          variant="filled"
          inputProps={{ min: "0", max: "500", step: "1" }}
          onChange={this.handleMines}
          color="primary"
        />
        <br />
        <br />
        <Button
          size="large"
          variant="contained"
          color="primary"
          disabled={!this.state.center}
          onClick={this.handleSave}
        >
          Save location
        </Button>
        <br />
        <br />
        {this.state.center ? (
          <MapViewAlternative
            longitude={this.state.center.coords.longitude}
            latitude={this.state.center.coords.latitude}
            bboxPoly={bboxPolygon(this.state.field).geometry.coordinates[0].map(
              (el) => [el[1], el[0]]
            )}
            mines={this.state.minesLocations}
          />
        ) : null}
        <br />
        <br />
      </div>
    );
  }
}

const Geolocation = compose(
  withAuthentication,
  withFirebase,
  withTheme
)(GeolocatioBase);

export default Geolocation;
