import { FETCH_GETUSERDETAIL } from "../ActionType/ActionTypes";
import axios from "axios";
import { BaseURL, getToken } from "../../function/helpers";

export const getUserDetail = (url) => {
    return async (dispatch) => {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const userDetail = await axios.post(BaseURL + url, { data: "" }, { headers: headers })
            // console.log(userDetail, "userDetail");
            dispatch({
                type: FETCH_GETUSERDETAIL,
                payload: {
                    userDetail: userDetail.data.response_data
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}