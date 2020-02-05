import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Image from "../../img/hex4.png";

const theme = createMuiTheme({
  // palette: {
  //   primary: {
  //     light: "#FFD073",
  //     main: "#FFAA00",
  //     dark: "#A66F00"
  //   },
  //   secondary: {
  //     light: "#33CCCC",
  //     main: "#009999",
  //     dark: "#006363"
  //   }
  // },
  palette: {
    primary: {
      light: "#50FAFF",
      main: "#3EDDE2",
      dark: "#006363"
    },
    secondary: {
      light: "#33CCCC",
      main: "#009999",
      dark: "#006363",
      contrastText: "#ffffff"
    }
  },
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          backgroundImage: `url(${Image})`
        }
      }
    }
  }
});

function withTheme(Component) {
  function WithTheme(props) {
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithTheme;
}

export default withTheme;
