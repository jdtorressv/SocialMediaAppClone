import React from "react";
import PropTypes from "prop-types";
import AppIcon from "../images/icon.jpg";
import axios from "axios";
import { Link } from "react-router-dom";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
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
};

class login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false,
      errors: {}
    };
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    axios
      .post("/login", userData)
      .then((res) => {
        console.log(res.data);
        this.setState({
          loading: false
        });
        this.props.history.push("/"); // Redirects us to the home page if we reach here
      })
      .catch((err) => {
        this.setState({
          errors: err.response.data.errors,
          loading: false
        });
      });
  };
  render() {
    const { classes } = this.props;
    const { errors, loading } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt="monkey" className={classes.image} />
          <Typography variant="h2" className={classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            ></TextField>
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            ></TextField>
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              className={classes.button}
            >
              Log In
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              Don't have an account? Sign up <Link to="/signup">here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(login);
