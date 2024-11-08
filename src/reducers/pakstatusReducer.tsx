import { GET_PAK_STATUS } from "../actions/constants";

const initialState = {
  status: "",
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_PAK_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    default:
      return state;
  }
}
