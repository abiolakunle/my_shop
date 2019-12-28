import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Home } from "components/home/index";
import { Dashboard } from "components/dashboard/index";
import PrivateRoute from "./PrivateRoute";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
      </Switch>
    </Router>
  );
};

export default Routes;
