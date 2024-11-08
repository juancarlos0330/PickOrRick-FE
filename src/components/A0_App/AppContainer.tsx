import { App } from "./App";
import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";

export const AppContainer = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};
