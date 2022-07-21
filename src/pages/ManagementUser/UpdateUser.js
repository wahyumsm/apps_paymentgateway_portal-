import React, { useEffect, useState } from "react"
import { Row, Col, Form } from '@themesberg/react-bootstrap'
import { errorCatch, getToken, setUserSession } from "../../function/helpers";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import encryptData from "../../function/encryptData";
import ro from "date-fns/esm/locale/ro/index.js";

function UpdateUser() {
    const history = useHistory();
    const access_token = getToken();
    const { muserId } = useParams()
    const [listRole, setListRole] = useState([])
    const [listPartner, setListPartner] = useState([])
    const [editUser, setEditUser] = useState([])
    const [detailUser, setDetailUser] = useState([])
    const [isChecked, setIsChecked] = useState([])
    const [inputHandle, setInputHandle] = useState({
        id: muserId,
        namaUser: detailUser.name,
        emailUser: detailUser.email,
        roleUser: 0,
        isActive: detailUser.is_active,
        partner: "",
    })
    const roleeee = [{ role_id: detailUser.role_id, role_name: detailUser.role_name }]
    const newArrayObj = listRole.map(obj => roleeee.find(o => o.role_id === obj.role_id) || obj)

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.value,
        });
    }

    function handleActiveStatus(e) {
        setIsChecked(!isChecked)
    }

    async function getDetailUser(muserId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"muser_id":"${muserId}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const detailUser = await axios.post("/Account/DetailUserAccess", { data: dataParams }, { headers: headers })
            console.log(detailUser, 'ini detail user manage');
            if (detailUser.status === 200 && detailUser.data.response_code === 200 && detailUser.data.response_new_token.length === 0) {
                // console.log(detailAgen.data.response_data, 'ini detail agen');
                setDetailUser(detailUser.data.response_data)
            } else {
                setUserSession(detailUser.data.response_new_token)
                setDetailUser(detailUser.data.response_data)
            }
        } catch (error) {
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function editUserHandle(id, namaUser, emailUser, roleUser, isActive) {
        try {
            if (namaUser === undefined) {
                namaUser = detailUser.name
            }
            if (emailUser === undefined) {
                emailUser = detailUser.email
            }
            if (roleUser === undefined) {
                roleUser = detailUser.role_id
            }
            if (isActive === undefined) {
                isActive = detailUser.is_active
            }
            // if (partner === "") {
            //     partner = ""
            // }
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"muser_id":"${id}", "name": "${namaUser}", "email": "${emailUser}", "role": "${roleUser}", "is_active": "${isActive}"}`)
            // console.log(dataParams, 'ini data params');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const editUser = await axios.post("/Account/UpdateUser", { data: dataParams }, { headers: headers })
            console.log(editUser, 'ini edit user management');
            if (editUser.status === 200 && editUser.data.response_code === 200 && editUser.data.response_new_token.length === 0) {
                // RouteTo('/daftarpartner')
                history.push("/managementuser")
                // alert("Edit Data Partner Berhasil Ditambahkan")
            } else {
                setUserSession(editUser.data.response_new_token)
                history.push("/managementuser")
            }

            alert("Edit Data Partner Berhasil")
        } catch (error) {
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            // history.push(errorCatch(error.response.status))
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
        if (inputHandle.roleUser == 102) {
            getListPartner()
        }
        getDetailUser(muserId)
        getMenuRole()
    }, [access_token, muserId, inputHandle.roleUser])

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
                            <input name="nameUser" type="text" className="input-text-user" onChange={handleChange} defaultValue={(detailUser.name)} placeholder="Input nama" />
                        </Col>
                        <Col xs={12} className="mt-2">
                            <h6>Email</h6>
                            <input name="emailUser" type="text" className="input-text-user" onChange={handleChange} defaultValue={(detailUser.email)} placeholder="Input email" />
                        </Col>
                        <Col xs={12} className="mt-2"> 
                            <h6>Role</h6>
                            <Form.Select name="roleUser" className='input-text-user' onChange={handleChange} value={(inputHandle.roleUser == 0 ? detailUser.role_id : inputHandle.roleUser)} style={{ display: "inline" }} >
                                {newArrayObj.map((data, idx) => {
                                    return (
                                        <option key={idx} value={data.role_id}>{data.role_name}</option>
                                    )
                                })
                                }
                            </Form.Select>
                        </Col>
                        <Col xs={12} className="mt-2" style={{ display: inputHandle.roleUser == 102 ? "" : "none" }}>
                            <h6>Partner</h6>
                            <Form.Select name="" className="input-text-user" style={{ display: "inline" }} >
                                <option value="">Select Partner</option>
                                {listPartner.map((data, idx) => {
                                    return (
                                        <option key={idx} value={data.id}>{data.nama_perusahaan}</option>
                                    )
                                })}
                            </Form.Select>
                        </Col>
                        <Col xs={12} className="mt-2 mb-5">
                            <h6>Status</h6>
                            <Form.Select name="isActive" className="input-text-user" style={{ display: "inline" }} onChange={handleChange} value={(inputHandle.isActive ? detailUser.is_active : inputHandle.isActive)} >
                                <option value="">Select Status</option>
                                <option value={true}>Aktif</option>
                                <option value={false}>Tidak Aktif</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </div>
                <div className='mb-5 mt-3' style={{ display: "flex", justifyContent: "end" }}>
                    <button onClick={goBack} className='mx-2' style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "#FFFFFF", color: "#888888", border: "0.6px solid #EBEBEB", borderRadius: 6 }}>
                        Batal
                    </button>
                    <button onClick={() => editUserHandle(inputHandle.id, inputHandle.namaUser, inputHandle.emailUser, inputHandle.roleUser, inputHandle.isActive)} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                        Submit
                    </button>
                </div>
            </div>
        </>
    )
}
export default UpdateUser