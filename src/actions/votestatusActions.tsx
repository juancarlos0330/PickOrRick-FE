import { GET_PAK_STATUS, GET_VOTE_STATUS, SET_USERS } from "./constants";
import config from "../config/config";
import axios from "axios";
import jwt_decode from "jwt-decode";

export const getCurrentStatus = () => (dispatch: any) => {
  axios
    .get(config.server + "/api/pots/status")
    .then((res) => {
      dispatch({
        type: GET_VOTE_STATUS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const emailVerifyFunc =
  (email: any, flags: any) => async (dispatch: any) => {
    await axios
      .post(config.server + "/api/verifies/send-mail", {
        useremail: email,
        pakflag: flags,
      })
      .then((res) => {
        localStorage.setItem("pakflag", flags ? "pick" : "rick");

        dispatch({
          type: GET_PAK_STATUS,
          payload: flags ? "pick" : "rick",
        });

        console.log("Code sent success!");
      })
      .catch((err) => {
        localStorage.removeItem("pakflag");
        console.log(err);
      });
  };

export const emailConfirmFunc = (params: any) => (dispatch: any) => {
  axios
    .post(config.server + "/api/verifies/confirm", params)
    .then((res) => {
      if (res.data.msg === "success") {
        localStorage.setItem("jwtToken", res.data.token);
        const decoded = jwt_decode(res.data.token);

        dispatch({
          type: SET_USERS,
          payload: decoded,
        });

        localStorage.setItem("pakflag", params.pakflag);

        dispatch({
          type: GET_PAK_STATUS,
          payload: params.pakflag,
        });

        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    })
    .catch((err) => {
      window.location.href = "/";
    });
};
