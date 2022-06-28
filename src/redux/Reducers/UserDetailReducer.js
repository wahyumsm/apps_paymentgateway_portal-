import { FETCH_GETUSERDETAIL } from "../ActionType/ActionTypes";

const initialState = {
    userDetail: {}
}

const userDetailReducer = (state = initialState, action) => {
    if (action.type === FETCH_GETUSERDETAIL) {
        return {
            ...state,
            userDetail: action.payload.userDetail
        }
    } else {
        return state
    }
}

export default userDetailReducer;