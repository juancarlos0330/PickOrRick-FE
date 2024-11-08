import { GET_WALLET_STATUS } from "./constants";

// Log user out
export const saveWalletStatus = (status: any) => (dispatch: any) => {
  localStorage.setItem("walletconnected", status);

  // Set current user to {} which will set isAuthenticated to false
  dispatch({
    type: GET_WALLET_STATUS,
    payload: status,
  });
};
