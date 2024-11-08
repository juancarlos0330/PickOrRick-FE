import { SET_ADMIN } from "../actions/constants";
import isEmpty from "../validation/is-empty";

const initialState = {
  isAuthenticated: false,
  admin: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case SET_ADMIN:
      return {
        isAuthenticated: !isEmpty(action.payload),
        admin: action.payload,
      };
    default:
      return state;
  }
}
