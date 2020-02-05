import React from "react";
import { compose } from "recompose";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withTheme } from "../Theme";
import { withAuthentication } from "../Session";

import { withFirebase } from "../Firebase";
import MapViewAlternative from "../MapViewAlternative";

class GeolocatioBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      centerLocation: null,
      position: [],
      locations: [],
      radius: 0.05,
      numberOfMines: 10
    };

    this.handleSave = this.handleSave.bind(this);
    this.findCoordinates = this.findCoordinates.bind(this);
  }

  findCoordinates() {
    navigator.geolocation.getCurrentPosition(
      (centerLocation) => {
        console.log(centerLocation);
        this.setState({
          centerLocation: centerLocation,
          locations: [centerLocation]
        });
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  handleSave() {
    this.state.locations.forEach((loc) => {
      this.props.firebase.setGeoJSON(loc);
    });
  }

  handleRadius = (event) => {
    const val =
      event.target.value && event.target.value > 0 ? event.target.value : 1;
    console.log(val);
    this.setState({
      radius: (val * 1.0) / 1000
    });
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
        />{" "}
        <br />
        <br />
        <Button
          size="large"
          variant="contained"
          color="primary"
          disabled={!this.state.centerLocation}
          onClick={this.handleSave}
        >
          Save location
        </Button>
        <br />
        <br />
        {this.state.centerLocation ? (
          <MapViewAlternative
            longitude={this.state.centerLocation.coords.longitude}
            latitude={this.state.centerLocation.coords.latitude}
            radius={this.state.radius}
            numberOfMines={this.state.numberOfMines}
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
