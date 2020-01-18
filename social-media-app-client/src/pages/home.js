import React from "react";
import axios from "axios";
import Scream from "../components/Scream";
import Profile from "../components/Profile";

// Material UI
import Grid from "@material-ui/core/Grid";

class home extends React.Component {
  state = {
    screams: null
  };
  componentDidMount() {
    axios
      .get("/screams")
      .then((res) => {
        this.setState({
          screams: res.data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    let recentScreamsMarkup = this.state.screams ? (
      this.state.screams.map((scream) => (
        <Scream key={scream.screamId} scream={scream} />
      ))
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile></Profile>
        </Grid>
      </Grid>
    );
  }
}

export default home;
