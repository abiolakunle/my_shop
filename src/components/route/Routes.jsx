import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { Home } from "../home/index";

const Routes = () => {
  return (
    <Router>
      <Route path="/" component={Home}></Route>
    </Router>
  );
};

export default Routes;
