import { GET_STATUS_ADMIN } from "../actions/constants";

const initialState = {
  status: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_STATUS_ADMIN:
      return {
        status: action.payload,
      };
    default:
      return state;
  }
}
