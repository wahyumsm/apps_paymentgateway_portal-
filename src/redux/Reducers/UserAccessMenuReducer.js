import { FETCH_GETUSERACCESSMENU } from "../ActionType/ActionTypes";

const initialState = {
    userAccessMenu: []
}

const userAccessMenuReducer = (state = initialState, action) => {
    if (action.type === FETCH_GETUSERACCESSMENU) {
        return {
            ...state,
            userAccessMenu: action.payload.userAccessMenu
        }
    } else {
        return state
    }
}

export default userAccessMenuReducer;