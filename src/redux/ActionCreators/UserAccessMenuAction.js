import { FETCH_GETUSERACCESSMENU } from "../ActionType/ActionTypes";
import axios from "axios";
import { BaseURL, errorCatch, getRole, getToken, RouteTo, setUserSession } from "../../function/helpers";
import { useHistory } from "react-router-dom";


export const GetUserAccessMenu = (url, lang) => {

    const user_role = getRole()
    // const history = useHistory()
    return async (dispatch) => {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : user_role !== "102" ? "ID" : lang
            }
            const userAccessMenu = await axios.post(BaseURL + url, { data: "" }, { headers: headers })
            if (userAccessMenu.status === 200 && userAccessMenu.data.response_code === 200 && userAccessMenu.data.response_new_token.length === 0) {
                dispatch({
                    type: FETCH_GETUSERACCESSMENU,
                    payload: {
                        userAccessMenu: userAccessMenu.data.response_data
                    }
                })
            } else if (userAccessMenu.status === 200 && userAccessMenu.data.response_code === 200 && userAccessMenu.data.response_new_token.length !== 0) {
                setUserSession(userAccessMenu.data.response_new_token)
                dispatch({
                    type: FETCH_GETUSERACCESSMENU,
                    payload: {
                        userAccessMenu: userAccessMenu.data.response_data
                    }
                })
            }
        } catch (error) {
            // console.log(error)
            // history.push(errorCatch(error.response.status))
        }
    }
}