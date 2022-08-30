import { FETCH_GETUSERDETAIL } from "../ActionType/ActionTypes";
import axios from "axios";
import { BaseURL, getToken, setUserSession } from "../../function/helpers";

export const GetUserDetail = (url) => {
    return async (dispatch) => {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const userDetail = await axios.post(BaseURL + url, { data: "" }, { headers: headers })
            if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length === 0) {
                dispatch({
                    type: FETCH_GETUSERDETAIL,
                    payload: {
                        userDetail: userDetail.data.response_data
                    }
                })
            } else if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length !== 0) {
                setUserSession(userDetail.data.response_new_token)
                dispatch({
                    type: FETCH_GETUSERDETAIL,
                    payload: {
                        userDetail: userDetail.data.response_data
                    }
                })
            }
        } catch (error) {
            // console.log(error)
        }
    }
}