import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "@themesberg/react-bootstrap";
import { BaseURL, errorCatch, getRole, getToken, setUserSession } from "../../function/helpers";
import { Link, useHistory, useParams } from "react-router-dom";
import axios from "axios";
import encryptData from "../../function/encryptData";
import noteIconRed from "../../assets/icon/note_icon_red.svg"
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import ReactSelect, { components } from 'react-select';

function UpdateUser() {
    const history = useHistory();
    const access_token = getToken();
    const user_role = getRole()
    const { muserId } = useParams();
    const [listRole, setListRole] = useState([]);
    const [listPartner, setListPartner] = useState([]);
    const [listAgen, setListAgen] = useState([]);
    const [errorMsg, setErrorMsg] = useState("")
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

    const [selectedPartnerUpdateUser, setSelectedPartnerUpdateUser] = useState([])
    const [selectedAgenUpdateUser, setSelectedAgenUpdateUser] = useState([])

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const customStylesSelectedOption = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: "none",
            color: "black",
            width: 1020
        })
    }

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
        setSelectedPartnerUpdateUser([e])
        getListAgen(e.value)
        // setInputHandle({
        //     ...inputHandle,
        //     [e.target.name] : e.target.value
        // })
        setSelectedAgenUpdateUser([])
    }
    console.log(inputHandle.roleUser, "inputHandle.roleUser");
    
    const [dataGrupInQris, setDataGrupInQris] = useState([])
    const [selectedGrupName, setSelectedGrupName] = useState([])
  
    function handleChangeGrup(e) {
        // getBrandInQrisTransactionHandler(e.value)
        getBrandQris(e[0].value)
        setSelectedGrupName(e)
    }

    const [dataBrandInQris, setDataBrandInQris] = useState([])
    const [selectedBrandName, setSelectedBrandName] = useState([])
  
    function handleChangeBrand(e) {
      // getBrandInQrisTransactionHandler(e.value)
      getOutletQris(e[0].value)
      setSelectedBrandName(e)
    }

    const [dataStoreInQris, setDataStoreInQris] = useState([])
    const [selectedStoreName, setSelectedStoreName] = useState([])
  
    function handleChangeStore(e) {
      // getStoreInQrisTransactionHandler(e.value)
      setSelectedStoreName(e)
    }

    async function getGrupQrisHandler() {
        try {
            const auth = "Bearer " + access_token
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataGrupQris = await axios.post(BaseURL + "/QRIS/MasterGroup", { data: "" }, { headers: headers })
            // console.log(dataGrupQris, 'ini user detal funct');
            if (dataGrupQris.status === 200 && dataGrupQris.data.response_code === 200 && dataGrupQris.data.response_new_token === null) {
                let newArr = []
                dataGrupQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataGrupInQris(newArr)
            } else if (dataGrupQris.status === 200 && dataGrupQris.data.response_code === 200 && dataGrupQris.data.response_new_token !== null) {
                setUserSession(dataGrupQris.data.response_new_token)
                let newArr = []
                dataGrupQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataGrupInQris(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
      }
    
      async function getBrandQris(nouGrup) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"mmerchant_nou": ${nouGrup}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataBrandQris = await axios.post(BaseURL + "/QRIS/MasterBrand", { data: dataParams }, { headers: headers })
            // console.log(dataBrandQris, 'ini user detal funct');
            if (dataBrandQris.status === 200 && dataBrandQris.data.response_code === 200 && dataBrandQris.data.response_new_token === null) {
              let newArr = []
              dataBrandQris.data.response_data.results.forEach(e => {
                  let obj = {}
                  obj.value = e.nou
                  obj.label = e.name
                  newArr.push(obj)
              })
              setDataBrandInQris(newArr)
            } else if (dataBrandQris.status === 200 && dataBrandQris.data.response_code === 200 && dataBrandQris.data.response_new_token !== null) {
                setUserSession(dataBrandQris.data.response_new_token)
                let newArr = []
                dataBrandQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataBrandInQris(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
      }
    
      async function getOutletQris(nouBrand) {
          try {
              const auth = "Bearer " + access_token
              const dataParams = encryptData(`{"moutlet_nou": ${nouBrand}}`)
              const headers = {
                  'Content-Type':'application/json',
                  'Authorization' : auth
              }
              const dataOutletQris = await axios.post(BaseURL + "/QRIS/MasterOutlet", { data: dataParams }, { headers: headers })
              // console.log(dataOutletQris, 'ini user detal funct');
              if (dataOutletQris.status === 200 && dataOutletQris.data.response_code === 200 && dataOutletQris.data.response_new_token === null) {
                let newArr = []
                dataOutletQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataStoreInQris(newArr)
              } else if (dataOutletQris.status === 200 && dataOutletQris.data.response_code === 200 && dataOutletQris.data.response_new_token !== null) {
                setUserSession(dataOutletQris.data.response_new_token)
                let newArr = []
                dataOutletQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataStoreInQris(newArr)
              }
              // if (dataOutletQris.status === 200 && dataOutletQris.data.response_code === 200 && dataOutletQris.data.response_new_token === null) {
              //     setDataOutletInQris(dataOutletQris.data.response_data.results)
              // } else if (dataOutletQris.status === 200 && dataOutletQris.data.response_code === 200 && dataOutletQris.data.response_new_token !== null) {
              //     setUserSession(dataOutletQris.data.response_new_token)
              //     setDataOutletInQris(dataOutletQris.data.response_data.results)
              // }
          } catch (error) {
              // console.log(error);
              history.push(errorCatch(error.response.status))
          }
    }

    async function getDetailUser(muserId) {
        try {
            const auth = "Bearer " + getToken();
            const dataParams = encryptData(`{"muser_id":"${muserId}"}`);
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
                setInputHandle({nameUser: dataDetail.name, emailUser: dataDetail.email, roleUser: dataDetail.role_id, isActive: dataDetail.is_active, roleName: dataDetail.role_name, partnerId: dataDetail.partner_id, namaPerusahaan: dataDetail.nama_perusahaan, agenId: dataDetail.sub_partnerid})
                if (dataDetail.role_id === 102 || dataDetail.role_id === 104) {
                    getListPartner(dataDetail.partner_id);
                    getListAgen(dataDetail.partner_id, dataDetail.sub_partnerid)
                }
            } else if (
                detailUser.status === 200 &&
                detailUser.data.response_code === 200 &&
                detailUser.data.response_new_token.length !== 0
            ) {
                const dataDetail = detailUser.data.response_data
                setUserSession(detailUser.data.response_new_token);
                setInputHandle({nameUser: dataDetail.name, emailUser: dataDetail.email, roleUser: dataDetail.role_id, isActive: dataDetail.is_active, roleName: dataDetail.role_name, partnerId: dataDetail.partner_id, namaPerusahaan: dataDetail.nama_perusahaan, agenId: dataDetail.sub_partnerid})
                if (dataDetail.role_id === 102 || dataDetail.role_id === 104) {
                    getListPartner(dataDetail.partner_id);
                    getListAgen(dataDetail.partner_id, dataDetail.sub_partnerid)
                }
                
            }
        } catch (error) {
            // console.log(error);
            // history.push(errorCatch(error.response.status));
        }
    }        

        async function editUserHandle(idUser, nameUser, emailUser, roleUser, isActive, partnerId, agenId, grupNou, brandNou, outletNou) {
            try {
                const auth = "Bearer " + getToken()
                const dataParams = encryptData(`{"muser_id":"${idUser}", "name": "${nameUser}", "email": "${emailUser}", "role": "${roleUser}", "is_active": "${isActive}", "partnerdtl_id":"${(inputHandle.roleUser === 102) ? partnerId : (inputHandle.roleUser === 104 ) ? agenId : (inputHandle.roleUser === 106 ) ? grupNou : (inputHandle.roleUser === 107) ? brandNou : (inputHandle.roleUser === 108 ) ? outletNou : ""}"}`)
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': auth
                }
                const editUser = await axios.post(BaseURL + "/Account/UpdateUser", { data: dataParams }, { headers: headers })
                if (editUser.status === 200 && editUser.data.response_code === 200 && editUser.data.response_new_token.length === 0) {
                    alert("User Management Berhasil Diupdate")
                    history.push("/managementuser")
                } else if (editUser.status === 200 && editUser.data.response_code === 200 && editUser.data.response_new_token.length !== 0) {
                    setUserSession(editUser.data.response_new_token)
                    alert("User Management Berhasil Diupdate")
                    history.push("/managementuser")
                }
            } catch (error) {
                // console.log(error)
                setErrorMsg(error.response.data.response_message)
                if (error.response.data.response_message === "Failed") {
                    alert(error.response.data.response_message)
                }
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
                if (listRole.status === 200 && listRole.data.response_code === 200 && listRole.data.response_new_token.length === 0) {
                    setListRole(listRole.data.response_data);
                } else if (listRole.status === 200 && listRole.data.response_code === 200 && listRole.data.response_new_token.length !== 0) {
                    setUserSession(listRole.data.response_new_token)
                    setListRole(listRole.data.response_data)
                }
            } catch (error) {
                // console.log(error);
                history.push(errorCatch(error.response.status))
            }
        }

        async function getListPartner(partnerId) {
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
                if (
                    listPartner.status === 200 &&
                    listPartner.data.response_code === 200 &&
                    listPartner.data.response_new_token.length === 0
                ) {
                    let newArr = []
                    listPartner.data.response_data.forEach(e => {
                        let obj = {}
                        obj.value = e.partner_id
                        obj.label = e.nama_perusahaan
                        newArr.push(obj)
                    })
                    setListPartner(newArr)
                    setSelectedPartnerUpdateUser(newArr.find(e => e.value === partnerId))
                    // setListPartner(listPartner.data.response_data);
                } else if (
                    listPartner.status === 200 &&
                    listPartner.data.response_code === 200 &&
                    listPartner.data.response_new_token.length !== 0
                ) {
                    setUserSession(listPartner.data.response_new_token);
                    let newArr = []
                    listPartner.data.response_data.forEach(e => {
                        let obj = {}
                        obj.value = e.partner_id
                        obj.label = e.nama_perusahaan
                        newArr.push(obj)
                    })
                    setListPartner(newArr)
                    // setListPartner(listPartner.data.response_data);
                }
            } catch (error) {
                history.push(errorCatch(error.response.status))
            }
        }

        async function getListAgen(partnerId, subPartnerId) {
            try {
                const auth = 'Bearer ' + getToken();
                const dataParams = encryptData(`{"partner_id": "${partnerId}"}`);
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': auth
                }
                const listAgen = await axios.post(BaseURL + "/Partner/GetListAgen", {data: dataParams}, {headers: headers})
                if (listAgen.status === 200 && listAgen.data.response_code === 200 && listAgen.data.response_new_token.length === 0) {
                    let newArr = []
                    listAgen.data.response_data.forEach(e => {
                        let obj = {}
                        obj.value = e.agen_id
                        obj.label = e.agen_name
                        newArr.push(obj)
                        if (subPartnerId !== undefined && subPartnerId === e.agen_id) {
                            setSelectedAgenUpdateUser([{ value: e.agen_id, label: e.agen_name }])
                        }
                    })
                    setListAgen(newArr);
                    // setListAgen(listAgen.data.response_data)
                } else if (listAgen.status === 200 && listAgen.data.response_code === 200 && listAgen.data.response_new_token.length !== 0) {
                    setUserSession(listAgen.data.response_new_token)
                    let newArr = []
                    listAgen.data.response_data.forEach(e => {
                        let obj = {}
                        obj.value = e.agen_id
                        obj.label = e.agen_name
                        newArr.push(obj)
                        if (subPartnerId !== undefined && subPartnerId === e.agen_id) {
                            setSelectedAgenUpdateUser([{ value: e.agen_id, label: e.agen_name }])
                        }
                    })
                    setListAgen(newArr);
                    // setListAgen(listAgen.data.response_data)
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
            if (inputHandle.roleUser === 106 || inputHandle.roleUser === 107 || inputHandle.roleUser === 108) {
                getGrupQrisHandler()
            }
            // getListPartner();
        }, [access_token, muserId, user_role, inputHandle.roleUser]);

        const goBack = () => {
            window.history.back();
        };

        return (
            <>
                <div className="main-content mt-5" style={{ padding: "37px 27px 37px 27px" }}>
                    <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;<Link to={"/managementuser"}>Management User</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Edit User</span>
                    <div className="head-title">
                        <h2 className="h4 mt-3 mb-3">Edit User</h2>
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
                                {errorMsg === "Email sudah terdaftar" &&
                                    <span style={{ color: "#B9121B", fontSize: 12 }}>
                                        <img src={noteIconRed} className="me-2" />
                                        {errorMsg}
                                    </span>
                                }
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
                                style={{
                                    display:
                                      inputHandle.roleUser === 106 || inputHandle.roleUser === 107 || inputHandle.roleUser === 108
                                        ? ""
                                        : "none",
                                }}
                            >
                                <h6>Nama Grup</h6>
                                <div className="dropdown dropPartnerAddUser">
                                    <ReactSelect
                                    // isMulti
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    options={dataGrupInQris}
                                    // allowSelectAll={true}
                                    value={selectedGrupName}
                                    onChange={(selected) => handleChangeGrup([selected])}
                                    placeholder="--- Choose Grup Name ---"
                                    components={{ Option }}
                                    styles={customStylesSelectedOption}
                                />
                                </div>
                            </Col>
                            <Col
                                xs={12}
                                className="mt-2"
                                style={{
                                    display:
                                      inputHandle.roleUser === 107 || inputHandle.roleUser === 108
                                        ? ""
                                        : "none",
                                }}
                            >
                                <h6>Nama Brand</h6>
                                <div className="dropdown dropPartnerAddUser">
                                    <ReactSelect
                                        // isMulti
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        options={dataBrandInQris}
                                        // allowSelectAll={true}
                                        value={selectedBrandName}
                                        onChange={(selected) => handleChangeBrand([selected])}
                                        placeholder="--- Choose Brand Name ---"
                                        components={{ Option }}
                                        styles={customStylesSelectedOption}
                                    />
                                </div>
                            </Col>
                            <Col
                                xs={12}
                                className="mt-2"
                                style={{
                                    display:
                                      inputHandle.roleUser === 108
                                        ? ""
                                        : "none",
                                }}
                            >
                                <h6>Nama Outlet / Store</h6>
                                <div className="dropdown dropPartnerAddUser">
                                    <ReactSelect
                                        // isMulti
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        options={dataStoreInQris}
                                        // allowSelectAll={true}
                                        value={selectedStoreName}
                                        onChange={(selected) => handleChangeStore([selected])}
                                        placeholder="--- Choose Store Name ---"
                                        components={{ Option }}
                                        styles={customStylesSelectedOption}
                                    />
                                </div>
                            </Col>
                            <Col
                                xs={12}
                                className="mt-2"
                                style={{ display: inputHandle.roleUser === 102 ? "" : (inputHandle.roleUser === 104)  ? "" : "none" }}
                            >
                                <h6>Partner</h6>
                                <div className="dropdown dropPartnerAddUser">
                                    <ReactSelect
                                        // isMulti
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        options={listPartner}
                                        // allowSelectAll={true}
                                        value={selectedPartnerUpdateUser}
                                        onChange={(selected) => handleChangeToAgen(selected)}
                                        placeholder="Select Partner"
                                        components={{ Option }}
                                        styles={customStylesSelectedOption}
                                    />
                                </div>
                                {/* <Form.Select
                                    name="partnerId"
                                    className="input-text-user"
                                    style={{ display: "inline" }}
                                    onChange={(e) => handleChangeToAgen(e)}                                    
                                    value={inputHandle.partnerId}
                                >
                                    <option value="">Select Partner</option>
                                    {listPartner.map((data, idx) => {
                                        return (
                                            <option key={idx} value={data.partner_id}>
                                                {data.nama_perusahaan}
                                            </option>
                                        );
                                    })}
                                </Form.Select> */}
                            </Col>
                            <Col
                                xs={12}
                                className="mt-2"
                                style={{ display: (inputHandle.partnerId !== undefined && inputHandle.roleUser === 104) ? "" : (inputHandle.partnerId !== undefined && inputHandle.roleUser === 102) ? "" : "none" }}
                            >
                                <h6>Agen</h6>
                                <div className="dropdown dropPartnerAddUser">
                                    <ReactSelect
                                        // isMulti
                                        closeMenuOnSelect={true}
                                        hideSelectedOptions={false}
                                        options={listAgen}
                                        // allowSelectAll={true}
                                        value={selectedAgenUpdateUser}
                                        onChange={(selected) => setSelectedAgenUpdateUser([selected])}
                                        placeholder="Select Agen"
                                        components={{ Option }}
                                        styles={customStylesSelectedOption}
                                    />
                                </div>
                                {/* <Form.Select
                                    name="agenId"
                                    className="input-text-user"
                                    style={{ display: "inline" }}
                                    value={inputHandle.agenId}
                                    onChange={(e) => handleChange(e)}
                                >
                                    <option value="">Select Agen</option>
                                    {listAgen.map((data, idx) => {
                                        return (
                                            <option key={idx} value={data.agen_id}>
                                                {data.agen_name}
                                            </option>
                                        );
                                    })}
                                </Form.Select> */}
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
                                    inputHandle.agenId,
                                    selectedGrupName.length !== 0 ? selectedGrupName[0].value : "",
                                    selectedBrandName.length !== 0 ? selectedBrandName[0].value : "",
                                    selectedStoreName.length !== 0 ? selectedStoreName[0].value : ""
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
