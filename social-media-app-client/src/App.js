import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import jwtDecode from "jwt-decode";
import axios from "axios";

//Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED, SET_UNAUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

// Components
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute";

// Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

const myTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#339c9dc",
      main: "#00bcd4",
      dark: "#008394",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff"
    }
  },
  typography: {
    useNextVariants: true
  },
  form: {
    textAlign: "center"
  },
  pageTitle: {
    margin: "10px"
  },
  image: {
    margin: "20px"
  },
  button: {
    margin: "10px",
    position: "relative"
  },
  textField: {
    margin: "10px"
  },
  customError: {
    color: "red",
    fontSize: "0.8rem"
  },
  progress: {
    position: "absolute"
  }
});

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser);
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData);
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={myTheme}>
        <Provider store={store}>
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute exact path="/login" component={login} />
                <AuthRoute exact path="/signup" component={signup} />
              </Switch>
            </div>
          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
