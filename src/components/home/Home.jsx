import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Header } from "../header/index";
import { Footer } from "../footer/index";
import { SignIn } from "../SignIn/index";
import { SignUp } from "../SignUp/index";

//material-ui
import Grid from "@material-ui/core/Grid";

import home_bg from "./home_bg.svg";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    textAlign: "center"
  },

  container: {
    backgroundImage: `url(${home_bg})`
  }
}));

const Home = ({ history }) => {
  const classes = useStyles();

  const auth = useSelector(state => state.firebaseReducer.auth);
  console.log("Home", auth);
  if (!auth.isEmpty && auth.uid) {
    history.push("/dashboard");
  }

  return (
    <div className={classes.container}>
      <Header />
      <Fragment className={classes.center}>
        <Grid container spacing={1}>
          <Grid item md={6}>
            <SignIn />
          </Grid>
          <Grid item md={6}>
            <SignUp />
          </Grid>
        </Grid>

        <Footer />
      </Fragment>
    </div>
  );
};

export default Home;
