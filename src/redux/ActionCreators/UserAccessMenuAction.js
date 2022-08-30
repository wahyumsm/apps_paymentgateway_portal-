import { FETCH_GETUSERACCESSMENU } from "../ActionType/ActionTypes";
import axios from "axios";
import { BaseURL, getToken, setUserSession } from "../../function/helpers";

export const GetUserAccessMenu = (url) => {
    return async (dispatch) => {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const userAccessMenu = await axios.post(BaseURL + url, { data: "" }, { headers: headers })
            if (userAccessMenu.status === 200 && userAccessMenu.data.response_code === 200 && userAccessMenu.data.response_new_token.length === 0) {
                const accessMenu = []
                for (let i = 0; i < userAccessMenu.data.response_data.length; i++) {
                    const element = userAccessMenu.data.response_data[i];
                    if (element.id !== 19) {
                        accessMenu.push(element)
                    }
                }
                dispatch({
                    type: FETCH_GETUSERACCESSMENU,
                    payload: {
                        userAccessMenu: accessMenu
                    }
                })
            } else if (userAccessMenu.status === 200 && userAccessMenu.data.response_code === 200 && userAccessMenu.data.response_new_token.length !== 0) {
                setUserSession(userAccessMenu.data.response_new_token)
                const accessMenu = []
                for (let i = 0; i < userAccessMenu.data.response_data.length; i++) {
                    const element = userAccessMenu.data.response_data[i];
                    if (element.id !== 19) {
                        accessMenu.push(element)
                    }
                }
                dispatch({
                    type: FETCH_GETUSERACCESSMENU,
                    payload: {
                        userAccessMenu: accessMenu
                    }
                })
            }
        } catch (error) {
            // console.log(error)
        }
    }
}