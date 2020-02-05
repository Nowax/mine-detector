import React from "react";

import { withAuthorization } from "../Session";
import Geolocation from "../Geolocation";

class DashboardPage extends React.Component {
  render() {
    return (
      <div>
        <Geolocation />
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(DashboardPage);
