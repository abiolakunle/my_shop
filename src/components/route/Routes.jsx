import React from "react";
import { useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Home } from "components/home/index";
import { Dashboard } from "components/dashboard/index";
import PrivateRoute from "./PrivateRoute";
import { LinearProgress } from "@material-ui/core";
import { withRouter } from "react-router-dom";

const RoutesWithRouter = withRouter(props => {
  return (
    <Switch>
      <Route exact path="/" component={Home} {...props} />
      <PrivateRoute path="/dashboard" component={Dashboard} {...props} />
    </Switch>
  );
});
const Routes = () => {
  const auth = useSelector(state => state.firebaseReducer.auth);
  return (
    <Router>
      {!auth.isLoaded && <LinearProgress color="secondary" />}
      {auth.isLoaded && <RoutesWithRouter />}
    </Router>
  );
};

export default Routes;
