import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  GET_PAK_STATUS,
  GET_WALLET_STATUS,
  SET_ADMIN,
  SET_USERS,
} from "./actions/constants";
import configureStore from "./configureStore";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import { AppContainer } from "./components/A0_App/AppContainer";
import { logoutUser } from "./actions/authActions";
import { logoutAdmin } from "./actions/adminActions";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const store = configureStore();

// Check for token
if (localStorage.jwtToken) {
  // Decode token and get user info and exp
  const decoded: any = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch({ type: SET_USERS, payload: decoded });

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "/";
  }
}

if (localStorage.walletconnected) {
  store.dispatch({
    type: GET_WALLET_STATUS,
    payload: localStorage.walletconnected,
  });
}

if (localStorage.pakflag) {
  store.dispatch({
    type: GET_PAK_STATUS,
    payload: localStorage.pakflag,
  });
}

// Check for token
if (localStorage.adminToken) {
  // Decode token and get admin info and exp
  const decoded: any = jwt_decode(localStorage.adminToken);
  // Set user and isAuthenticated
  store.dispatch({ type: SET_ADMIN, payload: decoded });

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutAdmin());
    // Redirect to login
  }
}

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <AppContainer />
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
