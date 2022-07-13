import { FETCH_GETUSERDETAIL } from "../ActionType/ActionTypes";
import axios from "axios";
import { BaseURL, errorCatch, getToken } from "../../function/helpers";
import { useHistory } from "react-router-dom";

export const getUserDetail = (url) => {
    return async (dispatch) => {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const userDetail = await axios.post(url, { data: "" }, { headers: headers })
            // console.log(userDetail, "userDetail");
            dispatch({
                type: FETCH_GETUSERDETAIL,
                payload: {
                    userDetail: userDetail.data.response_data
                }
            })
        } catch (error) {
            console.log(error)
            const history = useHistory()
            history.push(errorCatch(error.response.status))
    }
    }
}