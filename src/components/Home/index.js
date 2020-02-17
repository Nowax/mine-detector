import React, { Component } from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";
import { AuthUserContext } from "../Session";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Indicator from "../Indicator";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { distance, point } from "@turf/turf";
import equal from "fast-deep-equal";
import { Button, withStyles } from "@material-ui/core";
import { withTheme } from "../Theme";

const POSITION_TEST = {
  coords: {
    longitude: 55,
    latitude: 17
  }
};

class HomePageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: null,
      distance: 0,
      sliderValue: 100,
      isOperational: false
    };
  }

  getLocation = () => {
    console.log("Registering for location updates");
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        this.calculateShortestDistance,
        (error) => {
          console.log(error.message);
          this.setState({
            isOperational: false
          });
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      this.setState({
        isOperational: false
      });
    }
  };

  calculateShortestDistance = (position) => {
    let shortest = null;
    let from = point([position.coords.longitude, position.coords.latitude]);
    var options = { units: "meters" };

    this.state.locations.forEach((l) => {
      let d = Math.floor(distance(from, l.location, options));
      if (!shortest || d < shortest) {
        shortest = d;
      }
    });

    if (shortest !== this.state.distance) {
      this.setState({
        distance: shortest,
        isOperational: true
      });
    } else {
      console.log("Same distance. Skipping...");
    }
  };

  componentDidMount() {
    this.props.firebase
      .getLatestMinefield()
      .then((locations) => {
        console.log("Data fetched from cloud:", locations);
        this.setState({
          locations: locations
        });
      })
      .catch((e) => {
        console.log("Failed to fetch data from cloud");
      });
  }

  componentDidUpdate(prevProps) {
    console.log("Component did update");
    if (!equal(this.props.locations, prevProps.locations)) {
      console.log("prevProps.locations");
      this.getLocation();
    }
  }

  handleSlider = (value) => {
    value = 100 - value;
    this.setState({
      sliderValue: value
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <AuthUserContext.Consumer>
        {(authUser) => (
          <div>
            {!!authUser && (
              <p style={{ paddingLeft: "15px" }}>
                Hello Opetator "{authUser.email}"". You can proceed with you
                configuration {<Link to={ROUTES.DASHBOARD}>here</Link>}.
              </p>
            )}
            <br />
            <div className={classes.centered}>
              <Button
                size="large"
                variant="contained"
                color="primary"
                disabled={!this.state.locations}
                onClick={this.getLocation}
              >
                Start detection
              </Button>
            </div>
            <br />
            <div className={classes.centered}>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={() => this.calculateShortestDistance(POSITION_TEST)}
              >
                Test{" "}
              </Button>
            </div>
            Distance: {this.state.distance}
            <br />
            Is operational: {this.state.isOperational ? "true" : "false"}
            <br />
            <Slider onChange={this.handleSlider} />
            Simulated distance: {this.state.sliderValue}
            <br />
            {this.state.isOperational ? (
              <Indicator distance={this.state.sliderValue} />
            ) : null}
          </div>
        )}
      </AuthUserContext.Consumer>
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

const HomePage = compose(
  withAuthentication,
  withFirebase,
  withTheme,
  withStyles(styles)
)(HomePageBase);

export default HomePage;
