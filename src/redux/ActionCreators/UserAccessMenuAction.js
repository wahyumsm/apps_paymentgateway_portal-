import { FETCH_GETUSERACCESSMENU } from "../ActionType/ActionTypes";
import axios from "axios";
import { BaseURL, errorCatch, getToken, RouteTo, setUserSession } from "../../function/helpers";
import { useHistory } from "react-router-dom";


export const GetUserAccessMenu = (url) => {
    // const history = useHistory()
    return async (dispatch) => {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const userAccessMenu = await axios.post(BaseURL + url, { data: "" }, { headers: headers })
            if (userAccessMenu.status === 200 && userAccessMenu.data.response_code === 200 && userAccessMenu.data.response_new_token.length === 0) {
                dispatch({
                    type: FETCH_GETUSERACCESSMENU,
                    payload: {
                        userAccessMenu: userAccessMenu.data.response_data
                    }
                })
            } else {
                setUserSession(userAccessMenu.data.response_new_token)
                dispatch({
                    type: FETCH_GETUSERACCESSMENU,
                    payload: {
                        userAccessMenu: userAccessMenu.data.response_data
                    }
                })
            }
        } catch (error) {
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            // history.push(errorCatch(error.response.status))
        }
    }
}