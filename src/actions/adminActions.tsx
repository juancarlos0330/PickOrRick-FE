import { SET_ADMIN, GET_STATUS_ADMIN } from "./constants";
import config from "../config/config";
import axios from "axios";
import jwt_decode from "jwt-decode";

// Admin Login
export const adminLogin = (params: any) => (dispatch: any) => {
  axios
    .post(config.server + "/api/admins/login", params)
    .then((res) => {
      localStorage.setItem("adminToken", res.data.token);
      const decoded = jwt_decode(res.data.token);

      dispatch({
        type: SET_ADMIN,
        payload: decoded,
      });

      window.location.href = "/admin/dashboard";
    })
    .catch((err) => {
      console.log(err);
      alert("Name or Password is not correct!");
    });
};

// Log admin out
export const logoutAdmin = () => (dispatch: any) => {
  // Remove token from localStorage
  localStorage.removeItem("adminToken");
  // Set current admin to {} which will set isAuthenticated to false
  dispatch({
    type: SET_ADMIN,
    payload: {},
  });
};

// Get user dashboard page status
export const getStatusForAdmin = () => (dispatch: any) => {
  axios
    .get(config.server + "/api/admins/getstatus")
    .then((res) => {
      dispatch({
        type: GET_STATUS_ADMIN,
        payload: res.data[0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Set user dashboard page status
export const setStatusForAdmin = (params: any) => (dispatch: any) => {
  axios
    .post(config.server + "/api/admins/setstatus", params)
    .then((res) => {
      dispatch(getStatusForAdmin());
    })
    .catch((err) => console.log(err));
};
