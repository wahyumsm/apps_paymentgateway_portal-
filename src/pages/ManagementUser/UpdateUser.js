import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "@themesberg/react-bootstrap";
import { BaseURL, errorCatch, getRole, getToken, setUserSession } from "../../function/helpers";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import encryptData from "../../function/encryptData";

function UpdateUser() {
    const history = useHistory();
    const access_token = getToken();
    const user_role = getRole()
    const { muserId } = useParams();
    const [listRole, setListRole] = useState([]);
    const [listPartner, setListPartner] = useState([]);
    const [listAgen, setListAgen] = useState([]);
    const [inputHandle, setInputHandle] = useState({
        idUser: muserId,
        nameUser: "",
        emailUser: "",
        roleUser: 0,
        isActive: false,
        roleName: "",
        namaPerusahaan: "",
        partnerId: "",
        agenId: "",
    });

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.value,
        });
    }

    function handleChangeToPartner (e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : parseInt(e.target.value)
        })
    }

    function handleChangeToAgen(e) {
        getListAgen(e.target.value)
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    async function getDetailUser(muserId) {
        try {
            const auth = "Bearer " + getToken();
            const dataParams = encryptData(`{"muser_id":"${muserId}"}`);
            // console.log(dataParams, "ini data param");
            const headers = {
                "Content-Type": "application/json",
                Authorization: auth,
            };
            const detailUser = await axios.post(
                BaseURL + "/Account/DetailUserAccess",
                { data: dataParams },
                { headers: headers }
            );
            if (
                detailUser.status === 200 &&
                detailUser.data.response_code === 200 &&
                detailUser.data.response_new_token.length === 0
            ) {
                const dataDetail = detailUser.data.response_data
                setInputHandle({nameUser: dataDetail.name, emailUser: dataDetail.email, roleUser: dataDetail.role_id, isActive: dataDetail.is_active, roleName: dataDetail.role_name, partnerId: dataDetail.partner_id, namaPerusahaan: dataDetail.nama_perusahaan})
                if (dataDetail.role_id === 102 || dataDetail.role_id === 103) {
                    getListAgen(dataDetail.partner_id)
                }
            } else if (
                detailUser.status === 200 &&
                detailUser.data.response_code === 200 &&
                detailUser.data.response_new_token.length !== 0
            ) {
                const dataDetail = detailUser.data.response_data
                setUserSession(detailUser.data.response_new_token);
                setInputHandle({nameUser: dataDetail.name, emailUser: dataDetail.email, roleUser: dataDetail.role_id, isActive: dataDetail.is_active, roleName: dataDetail.role_name, partnerId: dataDetail.partner_id, namaPerusahaan: dataDetail.nama_perusahaan})
                getListAgen(dataDetail.partner_id)
            }
        } catch (error) {
            console.log(error);
            history.push(errorCatch(error.response.status));
        }
    }        

        async function editUserHandle(idUser, nameUser, emailUser, roleUser, isActive, partnerId, agenId) {
            try {
                const auth = "Bearer " + getToken()
                const dataParams = encryptData(`{"muser_id":"${idUser}", "name": "${nameUser}", "email": "${emailUser}", "role": "${roleUser}", "is_active": "${isActive}", "partnerdtl_id":"${(inputHandle.roleUser === 102) ? partnerId : (inputHandle.roleUser === 103 ) ? agenId : ""}"}`)
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': auth
                }
                const editUser = await axios.post(BaseURL + "/Account/UpdateUser", { data: dataParams }, { headers: headers })
                if (editUser.status === 200 && editUser.data.response_code === 200 && editUser.data.response_new_token.length === 0) {
                    history.push("/managementuser")
                } else if (editUser.status === 200 && editUser.data.response_code === 200 && editUser.data.response_new_token.length !== 0) {
                    setUserSession(editUser.data.response_new_token)
                    history.push("/managementuser")
                }

                alert("Edit Data User Management Berhasil")
            } catch (error) {
                console.log(error)
                history.push(errorCatch(error.response.status))
            }
        }

        async function getMenuRole() {
            try {
                const auth = "Bearer " + getToken();
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: auth,
                };
                const listRole = await axios.post(
                    BaseURL + "/Account/GetAccessRole",
                    { data: "" },
                    { headers: headers }
                );
                // console.log(listRole, "ini role");
                if (listRole.status === 200 && listRole.data.response_code === 200 && listRole.data.response_new_token.length === 0) {
                    setListRole(listRole.data.response_data);
                } else if (listRole.status === 200 && listRole.data.response_code === 200 && listRole.data.response_new_token.length !== 0) {
                    setUserSession(listRole.data.response_new_token)
                    setListRole(listRole.data.response_data)
                }
            } catch (error) {
                console.log(error);
                history.push(errorCatch(error.response.status))
            }
        }

        async function getListPartner() {
            try {
                const auth = "Bearer " + getToken();
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: auth,
                };
                const listPartner = await axios.post(
                    BaseURL + "/Partner/ListPartner",
                    { data: "" },
                    { headers: headers }
                );
                // console.log(listPartner, "ini partner di user");
                if (
                    listPartner.status === 200 &&
                    listPartner.data.response_code === 200 &&
                    listPartner.data.response_new_token.length === 0
                ) {
                    setListPartner(listPartner.data.response_data);
                } else if (
                    listPartner.status === 200 &&
                    listPartner.data.response_code === 200 &&
                    listPartner.data.response_new_token.length !== 0
                ) {
                    setUserSession(listPartner.data.response_new_token);
                    setListPartner(listPartner.data.response_data);
                }
            } catch (error) {
                history.push(errorCatch(error.response.status))
            }
        }

        async function getListAgen(partnerId) {
            try {
                // console.log(partnerId, "ini partner id di function list agen");
                const auth = 'Bearer ' + getToken();
                const dataParams = encryptData(`{"partner_id": "${partnerId}"}`);
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': auth
                }
                const listAgen = await axios.post(BaseURL + "/Partner/GetListAgen", {data: dataParams}, {headers: headers})
                if (listAgen.status === 200 && listAgen.data.response_code === 200 && listAgen.data.response_new_token.length === 0) {
                    setListAgen(listAgen.data.response_data)
                } else if (listAgen.status === 200 && listAgen.data.response_code === 200 && listAgen.data.response_new_token.length !== 0) {
                    setUserSession(listAgen.data.response_new_token)
                    setListAgen(listAgen.data.response_data)
                }
            } catch (error) {
                history.push(errorCatch(error.response.status))
            }
        }
        useEffect(() => {
            if (!access_token) {
                history.push("/login");
            }
            if (user_role === "102") {
                history.push('/404');
            }
            getDetailUser(muserId);
            getMenuRole();
            getListPartner();
        }, [access_token, muserId, user_role]);

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
                        <span className="mt-4" style={{ fontWeight: 600 }}>
                            Data User
                        </span>
                        <Row className="my-3">
                            <Col xs={12} className="mt-2">
                                <h6>Nama</h6>
                                <input
                                    name="nameUser"
                                    type="text"
                                    className="input-text-user"
                                    onChange={handleChange}
                                    value={inputHandle.nameUser}
                                    placeholder="Input nama"
                                />
                            </Col>
                            <Col xs={12} className="mt-2">
                                <h6>Email</h6>
                                <input
                                    name="emailUser"
                                    type="text"
                                    className="input-text-user"
                                    onChange={handleChange}
                                    value={inputHandle.emailUser}
                                    placeholder="Input email"
                                />
                            </Col>
                            <Col xs={12} className="mt-2">
                                <h6>Role</h6>
                                <Form.Select
                                    name="roleUser"
                                    className="input-text-user"
                                    onChange={(e)=>handleChangeToPartner(e)}
                                    value={
                                        inputHandle.roleUser
                                    }
                                    style={{ display: "inline" }}
                                >
                                    {listRole.map((data, idx) => {
                                        return (
                                            <option key={idx} value={data.role_id}>
                                                {data.role_name}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                            </Col>
                            <Col
                                xs={12}
                                className="mt-2"
                                style={{ display: inputHandle.roleUser === 102 ? "" : (inputHandle.roleUser === 103)  ? "" : "none" }}
                            >
                                <h6>Partner</h6>
                                <Form.Select
                                    name="partnerId"
                                    className="input-text-user"
                                    style={{ display: "inline" }}
                                    onChange={(e) => handleChangeToAgen(e)}                                    
                                    value={inputHandle.partnerId}
                                >
                                    {listPartner.map((data, idx) => {
                                        return (
                                            <option key={idx} value={data.partner_id}>
                                                {data.nama_perusahaan}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                            </Col>
                            <Col
                                xs={12}
                                className="mt-2"
                                style={{ display: inputHandle.partnerId !== undefined && inputHandle.roleUser === 103 ? "" : "none" }}
                            >
                                <h6>Agen</h6>
                                <Form.Select
                                    name="agenId"
                                    className="input-text-user"
                                    style={{ display: "inline" }}
                                    value={inputHandle.agenId}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Agen</option>
                                    {listAgen.map((data, idx) => {
                                        return (
                                            <option key={idx} value={data.agen_id}>
                                                {data.agen_name}
                                            </option>
                                        );
                                    })}
                                </Form.Select>
                            </Col>
                            <Col xs={12} className="mt-2 mb-5">
                                <h6>Status</h6>
                                <Form.Select
                                    className="input-text-user"
                                    style={{ display: "inline" }}
                                    onChange={handleChange}
                                    value={(inputHandle.isActive)}
                                    name="isActive"
                                >
                                    <option value={true}>Aktif</option>
                                    <option value={false}>Tidak Aktif</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </div>
                    <div
                        className="mb-5 mt-3"
                        style={{ display: "flex", justifyContent: "end" }}
                    >
                        <button
                            onClick={goBack}
                            className="mx-2"
                            style={{
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 900,
                                alignItems: "center",
                                padding: "12px 24px",
                                gap: 8,
                                width: 136,
                                height: 45,
                                background: "#FFFFFF",
                                color: "#888888",
                                border: "0.6px solid #EBEBEB",
                                borderRadius: 6,
                            }}
                        >
                            Batal
                        </button>
                        <button
                            onClick={() =>
                                editUserHandle(
                                    muserId,
                                    inputHandle.nameUser,
                                    inputHandle.emailUser,
                                    inputHandle.roleUser,
                                    inputHandle.isActive,
                                    inputHandle.partnerId,
                                    inputHandle.agenId
                                )
                            }
                            style={{
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 900,
                                alignItems: "center",
                                padding: "12px 24px",
                                gap: 8,
                                width: 136,
                                height: 45,
                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                border: "0.6px solid #2C1919",
                                borderRadius: 6,
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </>
        );
    
}
export default UpdateUser;
