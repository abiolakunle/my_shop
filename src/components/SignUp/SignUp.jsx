import React, { useState, useEffect, Fragment } from "react";
import { withRouter } from "react-router-dom";

//material-ui
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { useDispatch, useSelector } from "react-redux";

import { signUp } from "actions/authActions";
import { SnackBarContent } from "components/snackBar";
import Snackbar from "@material-ui/core/Snackbar";

import { useSnackbar } from "notistack";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: theme.spacing(2)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const SignUp = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { signingUp, signedUp, error, message } = useSelector(
    state => state.signUpReducer
  );

  const { enqueueSnackbar } = useSnackbar();
  console.log("history", history);
  if (signedUp) {
    history.push("/dashboard");
  }

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleFormChange = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
    //console.log(`${event.target.name} , ${event.target.value}`);
  };

  const handleSubmit = event => {
    event.preventDefault();
    dispatch(signUp(form));
  };

  const handleClose = () => {
    //error = false;
  };

  return (
    <Fragment>
      <Container component="main" maxWidth="xs">
        {/* {(error || (signedUp && !signingUp)) &&
          enqueueSnackbar(message, { variant: error ? "error" : "success" })} */}
        {/* {signedUp && <Redirect to={`/dashboard`} />} */}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={error || signedUp}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <SnackBarContent
            onClose={handleClose}
            variant={error ? "error" : "success"}
            message={message}
          />
        </Snackbar>

        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleFormChange}
                  value={form.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleFormChange}
                  value={form.password}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            {signingUp && (
              <Grid item xs={12} className={classes.center}>
                <CircularProgress color="secondary" />
              </Grid>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Container>
    </Fragment>
  );
};

export default withRouter(SignUp);
