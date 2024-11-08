import { GET_VOTE_STATUS } from "../actions/constants";

const initialState = {
  msg: "",
  currentDate: "",
  curHour: 0,
  curMinute: 0,
  curSecond: 0,
  status: 0,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_VOTE_STATUS:
      return {
        ...state,
        msg: action.payload.msg,
        currentDate: action.payload.currentDate,
        curHour: action.payload.curHour,
        curMinute: action.payload.curMinute,
        curSecond: action.payload.curSecond,
        status: action.payload.status,
      };
    default:
      return state;
  }
}
