import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from 'redux-thunk'
import userDetailReducer from "./Reducers/UserDetailReducer";

const reducers = combineReducers({
    userDetailReducer
})

const store = createStore(reducers, composeWithDevTools(applyMiddleware(ReduxThunk)));

export default store;