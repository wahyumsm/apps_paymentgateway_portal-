import { FETCH_GETUSERACCESSMENU } from "../ActionType/ActionTypes";
import axios from "axios";
import { BaseURL, errorCatch, getToken } from "../../function/helpers";
import { useHistory } from "react-router-dom";

export const getUserAccessMenu = (url) => {
    return async (dispatch) => {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const userAccessMenu = await axios.post(url, { data: "" }, { headers: headers })
            dispatch({
                type: FETCH_GETUSERACCESSMENU,
                payload: {
                    userAccessMenu: userAccessMenu.data.response_data
                }
            })
        } catch (error) {
            console.log(error)
            const history = useHistory()
            history.push(errorCatch(error.response.status))
    }
    }
}