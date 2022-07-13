import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from 'redux-thunk'
import userDetailReducer from "./Reducers/UserDetailReducer";
import userAccessMenuReducer from "./Reducers/UserAccessMenuReducer";

const reducers = combineReducers({
    userDetailReducer,
    userAccessMenuReducer,
})

const store = createStore(reducers, composeWithDevTools(applyMiddleware(ReduxThunk)));

export default store;