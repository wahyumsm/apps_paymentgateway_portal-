import React, { useEffect, useState } from "react"
import { Row, Col, Form } from '@themesberg/react-bootstrap'
import { errorCatch, getToken, setUserSession } from "../../function/helpers";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import encryptData from "../../function/encryptData";

function UpdateUser() {
    const history = useHistory();
    const access_token = getToken();
    const { muserId } = useParams()
    const [listRole, setListRole] = useState([])
    const [listPartner, setListPartner] = useState([])
    const [detailUser, setDetailUser] = useState([])
    const [inputHandle, setInputHandle] = useState({
        
    })

    async function getDetailUser(muserId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"muser_id":"${muserId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const detailUser = await axios.post("/Account/DetailUserAccess", { data: dataParams }, { headers: headers })
            console.log(detailUser, 'ini detail user manage');
            if (detailUser.status === 200 && detailUser.data.response_code === 200 && detailUser.data.response_new_token.length === 0) {
                // console.log(detailAgen.data.response_data, 'ini detail agen');
                if (detailUser.data.response_data.mpartner_is_active === true) {
                    detailUser.data.response_data = {
                        ...detailUser.data.response_data,
                        isActive: "Aktif"
                    }
                } else {
                    detailUser.data.response_data = {
                        ...detailUser.data.response_data,
                        isActive: "Tidak Aktif"
                    }
                }
                setDetailUser(detailUser.data.response_data)
            } else {
                setUserSession(detailUser.data.response_new_token)
                if (detailUser.data.response_data.mpartner_is_active === true) {
                    detailUser.data.response_data = {
                        ...detailUser.data.response_data,
                        isActive: "Aktif"
                    }
                } else {
                    detailUser.data.response_data = {
                        ...detailUser.data.response_data,
                        isActive: "Tidak Aktif"
                    }
                }
                setDetailUser(detailUser.data.response_data)
            }
        } catch (error) {
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function getMenuRole() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const listRole = await axios.post("/Account/GetAccessRole", { data: "" }, { headers: headers })
            console.log(listRole, "ini role")
            if (listRole.status === 200 && listRole.data.response_code === 200) {
                setListRole(listRole.data.response_data)
            }
        } catch (error) {
            console.log(error)
            //   history.push(errorCatch(error.response.status))
        }
    }

    async function getListPartner() {
        try {
            const auth = "Bearer " + getToken()
            console.log(auth)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const listPartner = await axios.post("/Partner/ListPartner", { data: "" }, { headers: headers })
            console.log(listPartner, 'ini partner di user')
            if (listPartner.status === 200 && listPartner.data.response_code === 200 && listPartner.data.response_new_token.length === 0) {
                setListPartner(listPartner.data.response_data)
            } else {
                setUserSession(listPartner.data.response_new_token);
                setListPartner(listPartner.data.response_data);
            }
        } catch (error) {
            // history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        getDetailUser(muserId)
        getMenuRole()
        getListPartner()
    }, [access_token, muserId])

    const goBack = () => {
        window.history.back();
    };

    return (
        <>
            <div className="main-content" style={{ padding: "37px 27px 37px 27px" }}>
                <div className="head-title">
                    <h2 className="h4 mt-5">Edit User</h2>
                </div>
                <div className="base-content">
                    <span className="mt-4" style={{ fontWeight: 600 }}>Data User</span>
                    <Row className="my-3">
                        <Col xs={12} className="mt-2">
                            <h6>Nama</h6>
                            <input type="text" className="input-text-user" defaultValue={(detailUser.name)} placeholder="Input nama" />
                        </Col>
                        <Col xs={12} className="mt-2">
                            <h6>Email</h6>
                            <input type="text" className="input-text-user" placeholder="Input email" />
                        </Col>
                        <Col xs={12} className="mt-2">
                            <h6>Password</h6>
                            <input type="text" className="input-text-user" placeholder="Input password" />
                        </Col>
                        <Col xs={12} className="mt-2">
                            <h6>Role</h6>
                            <Form.Select name="statusDanaMasuk" className='input-text-user' style={{ display: "inline" }} >
                                <option value="">Select Role</option>
                                {listRole.map((data, idx) => {
                                    return (
                                        <option defaultValue value={data.role_id}>{data.role_name}</option>
                                    )
                                })}
                            </Form.Select>
                        </Col>
                        <Col xs={12} className="mt-2">
                            <h6>ID Partner</h6>
                            <Form.Select className="input-text-user" style={{ display: "inline" }} >
                                <option value="">Select Partner</option>
                                {listPartner.map((data, idx) => {
                                    return (
                                        <option value={data.id}>{data.partner_id}</option>
                                    )
                                })}
                            </Form.Select>
                        </Col>
                        <Col xs={12} className="mt-2 mb-5">
                            <h6>Status</h6>
                            <Form.Select className="input-text-user" style={{ display: "inline" }} >
                                <option value="">Select Status</option>
                                <option value={1}>Aktif</option>
                                <option value={2}>Tidak Aktif</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </div>
                <div className='mb-5 mt-3' style={{ display: "flex", justifyContent: "end" }}>
                    <button onClick={goBack} className='mx-2' style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "#FFFFFF", color: "#888888", border: "0.6px solid #EBEBEB", borderRadius: 6 }}>
                        Batal
                    </button>
                    <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                        Submit
                    </button>
                </div>
            </div>
        </>
    )
}
export default UpdateUser