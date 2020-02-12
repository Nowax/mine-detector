import React from "react";
import { compose } from "recompose";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withTheme } from "../Theme";
import { withAuthentication } from "../Session";
import { withFirebase } from "../Firebase";
import { withStyles } from "@material-ui/core/styles";

import MapViewAlternative from "../MapViewAlternative";
import { bbox, circle, bboxPolygon, randomPoint } from "@turf/turf";
import SaveModal from "../SaveModal";

const DEFAULT_RADIUS = 0.05;

class GeolocatioBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      center: null,
      field: null,
      radius: DEFAULT_RADIUS,
      mines: null,
      minesLocations: [1, 2, 3, 4, 5],
      isSaved: null
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
        const f = this.generateField(center, this.state.radius);
        const points = randomPoint(this.state.minesLocations.length, {
          bbox: f
        });
        this.setState({
          isSaved: null,
          center: center,
          field: f,
          mines: points,
          minesLocations: points
            ? points.features.map((el) => [
                el.geometry.coordinates[1],
                el.geometry.coordinates[0]
              ])
            : null
        });
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  handleSave = () => {
    this.props.firebase
      .saveGeoPoints(this.state.mines)
      .then(() => {
        this.props.firebase.getLatestMinefield();
        this.setState({
          isSaved: true,
          center: null
        });
      })
      .catch((e) => {
        console.error("Error saving mines: ", e);
        this.setState({
          isSaved: false,
          center: null
        });
      });
  };

  handleMines = (event) => {
    const val =
      event.target.value && event.target.value > 0 ? event.target.value : 0;
    if (this.state.field) {
      const points = randomPoint(val, { bbox: this.state.field });
      this.setState({
        isSaved: null,
        mines: points,
        minesLocations: points.features.map((el) => [
          el.geometry.coordinates[1],
          el.geometry.coordinates[0]
        ])
      });
    }
  };

  handleSide = (event) => {
    const val =
      event.target.value && event.target.value > 0
        ? (event.target.value * 0.5) / 1000
        : DEFAULT_RADIUS;

    if (this.state.center) {
      const f = this.generateField(this.state.center, val);
      const points = randomPoint(this.state.minesLocations.length, {
        bbox: f
      });

      this.setState({
        isSaved: null,
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
    const { classes } = this.props;

    return (
      <div>
        <br />
        <div className={classes.centered}>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={this.findCoordinates}
          >
            Get current location
          </Button>
        </div>
        <div className={classes.spaceAround}>
          <TextField
            type="number"
            id="standard-full-width"
            label="Side in meters"
            defaultValue={1000 * 2 * DEFAULT_RADIUS}
            margin="dense"
            inputProps={{
              min: "0",
              max: "100000",
              step: "1",
              style: { color: "#000000", background: "#ffffff", width: "130px" }
            }}
            InputLabelProps={{
              style: { color: "#ffffff" }
            }}
            onChange={this.handleSide}
            color="white"
            background-color="white"
          />
          <TextField
            type="number"
            id="standard-full-width"
            label="Number of mines"
            defaultValue={this.state.minesLocations.length}
            margin="dense"
            inputProps={{
              min: "0",
              max: "100000",
              step: "1",
              style: { color: "#000000", background: "#ffffff", width: "130px" }
            }}
            InputLabelProps={{
              style: { color: "#ffffff" }
            }}
            onChange={this.handleMines}
            color="primary"
          />
        </div>
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
        <div className={classes.centered}>
          <Button
            size="large"
            variant="contained"
            color="primary"
            disabled={!this.state.center}
            onClick={this.handleSave}
          >
            Save location
          </Button>
          {this.state.isSaved ? (
            <SaveModal isSaved={this.state.isSaved} mines={this.state.mines} />
          ) : null}
        </div>
      </div>
    );
  }
}

const styles = {
  spaceAround: {
    display: "flex",
    justifyContent: "space-around"
  },
  centered: {
    display: "flex",
    justifyContent: "center"
  },
  grow: {
    flex: 1,
    flexGrow: 1
  }
};

const Geolocation = compose(
  withAuthentication,
  withFirebase,
  withTheme,
  withStyles(styles)
)(GeolocatioBase);

export default Geolocation;
