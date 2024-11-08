import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import authReducer from "./reducers/authReducer";
import votestatusReducer from "./reducers/votestatusReducer";
import walletstatusReducer from "./reducers/walletstatusReducer";
import pakstatusReducer from "./reducers/pakstatusReducer";
import adminReducer from "./reducers/adminReducer";
import adminstatusReducer from "./reducers/adminstatusReducer";

const initialState = {};

const middleware = [thunk];

const rootReducer = combineReducers({
  auth: authReducer,
  votestatus: votestatusReducer,
  walletstatus: walletstatusReducer,
  pakstatus: pakstatusReducer,
  admin: adminReducer,
  adminstatus: adminstatusReducer,
});

const configureStore = () => {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware)
      // window.__REDUX_DEVTOOLS_EXTENSION__ &&
      // window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
};

export default configureStore;
