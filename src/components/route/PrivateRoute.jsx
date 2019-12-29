import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

const PrivateRoute = ({ component, path, location }) => {
  const auth = useSelector(state => state.firebaseReducer.auth);
  const { enqueueSnackbar } = useSnackbar();

  //show message on attemp to visit private route
  if (location.pathname === path && auth.isEmpty) {
    enqueueSnackbar("You are logged out, please sign in.", {
      variant: "info",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right"
      }
    });
  }

  return (
    <div>
      {/* user is not isgned in */}
      {auth.isLoaded && auth.isEmpty && <Redirect to="/" />}
      {/* user is signed in */}
      {auth.isLoaded && auth.uid && <Route path={path} component={component} />}
    </div>
  );
};

export default PrivateRoute;
