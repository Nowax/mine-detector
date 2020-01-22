import React from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";
import { AuthUserContext } from "../Session";
// import { keyframes } from "styled-components";

const HomePage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <div>
        <h2 style={{ paddingLeft: "15px" }}>
          Welcome on Mine Detector Web App
        </h2>
        {!!authUser && (
          <p style={{ paddingLeft: "15px" }}>
            Hello {authUser.email}. You can proceed{" "}
            {<Link to={ROUTES.DASHBOARD}>here</Link>}.
          </p>
        )}
        {!authUser && (
          <p style={{ paddingLeft: "15px" }}>
            To proceed, please {<Link to={ROUTES.SIGN_IN}>Sign In</Link>}
          </p>
        )}
        <div style={center}>
          <div style={indicator}>pulse</div>
        </div>
      </div>
    )}
  </AuthUserContext.Consumer>
);

const center = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: `translate("-50%", "-50%")`
};

// var pulse = keyframes`
//     0% {
//       box-shadow: 0 0 0 0 rgba(255,109,74,.7);
//     }
//     40% {
//       box-shadow: 0 0 0 50px rgba(255,109,74,.7);
//     }
//     80% {
//       box-shadow: 0 0 0 50px rgba(255,109,74,.7);
//     }
//     100% {
//       box-shadow: 0 0 0 0 rgba(255,109,74,.7);
//     }
// `;

const indicator = {
  width: "100px",
  height: "100px",
  background: "#ff6d4a",
  borderRadius: "50%",
  color: "#ffff",
  fontSize: "20px",
  textAlign: "center",
  lineHeight: "100px",
  fontFamily: "verdana",
  textTransform: "uppercase"
  // animation: `${pulse} 3s linear infinite`
};

export default withAuthentication(HomePage);
