import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import button from "@material-ui/core/Button";

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

export class Profile extends Component {
  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading
      }
    } = this.props;
    return <div></div>;
  }
}

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Profile));
