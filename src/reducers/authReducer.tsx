import { SET_USERS } from "../actions/constants";
import isEmpty from "../validation/is-empty";

const initialState = {
  isAuthenticated: false,
  user: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case SET_USERS:
      return {
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    default:
      return state;
  }
}
