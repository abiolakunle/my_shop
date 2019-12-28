import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { LinearProgress } from "@material-ui/core";

const PrivateRoute = ({ component: Component, path }) => {
  const selector = useSelector(state => state.firebaseReducer.auth);

  return (
    <div>
      {!selector.isLoaded && <LinearProgress color="secondary" />}
      {selector.isLoaded && !selector.uid && <Redirect to="/" />}
      {selector.uid && <Component />}
    </div>
  );
};

export default PrivateRoute;
