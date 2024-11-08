import { SET_USERS } from "./constants";

// Log user out
export const logoutUser = () => (dispatch: any) => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Set current user to {} which will set isAuthenticated to false
  dispatch({
    type: SET_USERS,
    payload: {},
  });
};
