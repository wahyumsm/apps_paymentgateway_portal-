import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "@themesberg/react-bootstrap";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import {
  BaseURL,
  errorCatch,
  getRole,
  getToken,
  RouteTo,
  setUserSession,
} from "../../function/helpers";
import encryptData from "../../function/encryptData";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import noteIconRed from "../../assets/icon/note_icon_red.svg"
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import ReactSelect, { components } from 'react-select';

function AddUser() {
  const history = useHistory();
  const access_token = getToken();  
  const user_role = getRole()
  const auth = "Bearer " + getToken();

  const [inputHandle, setInputHandle] = useState({
    name: "",
    email: "",
    password: "",
    role: 0,
    partnerId: "",
    agenId: "",
  });
  const [listRole, setListRole] = useState([]);
  const [dataListPartner, setDataListPartner] = useState([]);
  const [addUser, setAddUser] = useState([]);
  const [dataListAgenFromPartner, setDataListAgenFromPartner] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputType = showPassword ? "text" : "password";
  const [isChecked, setIsChecked] = useState(false);
  const passwordIconColor = showPassword ? "#262B40" : "";
  const [errorMsg, setErrorMsg] = useState("")
  const [selectedPartnerAddUser, setSelectedPartnerAddUser] = useState([])
  const [selectedAgenAddUser, setSelectedAgenAddUser] = useState([])

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleOnChangeCheckBox = () => {
    setIsChecked(!isChecked);
  };

  function handleChange(e) {
    setInputHandle({
      ...inputHandle,
      [e.target.name]: e.target.value,
    });
  }

  async function getListRole() {
    const headers = {
      "Content-Type": "application/json",
      Authorization: auth,
    };
    try {
      const listRole = await axios.post(
        BaseURL + "/Account/GetAccessRole",
        { data: "" },
        { headers: headers }
      );
      if (listRole.data.response_code === 200 && listRole.status === 200 && listRole.data.response_new_token.length === 0) {
        setListRole(listRole.data.response_data);
      } else if (listRole.data.response_code === 200 && listRole.status === 200 && listRole.data.response_new_token.length !== 0) {
        setUserSession(listRole.data.response_new_token)
        setListRole(listRole.data.response_data);
      }
    } catch (e) {
      history.push(errorCatch(e.response.status));
      // console.log(e);
    }
  }

  async function getListPartner() {
    try {
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
        setDataListPartner(newArr)
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
        setDataListPartner(newArr)
      }
    } catch (e) {
      // console.log(e);
      history.push(errorCatch(e.response.status));
    }
  }

  async function getListAgen(partnerId) {
    try {
      const dataParams = encryptData(`{"partner_id": "${partnerId}"}`);
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listAgenFromPartner = await axios.post(
        BaseURL + "/Partner/GetListAgen",
        { data: dataParams },
        { headers: headers }
      );
      if (
        listAgenFromPartner.status === 200 &&
        listAgenFromPartner.data.response_code === 200 &&
        listAgenFromPartner.data.response_new_token.length === 0
      ) {
        let newArr = []
        listAgenFromPartner.data.response_data.forEach(e => {
            let obj = {}
            obj.value = e.agen_id
            obj.label = e.agen_name
            newArr.push(obj)
        })
        setDataListAgenFromPartner(newArr);
      } else if (
        listAgenFromPartner.status === 200 &&
        listAgenFromPartner.data.response_code === 200 &&
        listAgenFromPartner.data.response_new_token.length !== 0
      ) {
        setUserSession(listAgenFromPartner.data.response_new_token);
        let newArr = []
        listAgenFromPartner.data.response_data.forEach(e => {
            let obj = {}
            obj.value = e.agen_id
            obj.label = e.agen_name
            newArr.push(obj)
        })
        setDataListAgenFromPartner(newArr);
      }
    } catch (e) {
      // console.log(e);
      history.push(errorCatch(e.response.status));
    }
  }

  const [dataGrupInQris, setDataGrupInQris] = useState([])
  const [selectedGrupName, setSelectedGrupName] = useState([])

  function handleChangeGrup(e) {
    // getBrandInQrisTransactionHandler(e.value)
    getBrandQris(e[0].value)
    setSelectedGrupName(e)
  }

  console.log(selectedGrupName, "selectedGrupName");

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

  async function sendAddUser(
    name,
    email,
    password,
    role,
    isActive,
    partnerId,
    agenId,
    grupNou,
    brandNou,
    storeNou
  ) {
    try {
      const dataParams = encryptData(
        `{"name": "${name}", "email": "${email}", "password": "${password}", "role": ${role}, "is_active": "${isActive}", "partnerdtl_id": "${role === "102" ? partnerId : role === "104" ? agenId : role === "106" ? grupNou : role === "107" ? brandNou : role === "108" ? storeNou : ""}"}`
      );
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const addUser = await axios.post(
        BaseURL + "/Account/AddUser",
        { data: dataParams },
        { headers: headers }
      );
      if (addUser.data.response_code === 200 && addUser.status === 200 && addUser.data.response_new_token.length === 0) {
        setAddUser(addUser.data.response_data);
        alert("Data User Management Berhasil Ditambahkan")
        history.push("/managementuser")
      } else if (addUser.data.response_code === 200 && addUser.status === 200 && addUser.data.response_new_token.length !== 0) {
        setUserSession(addUser.data.response_new_token)
        setAddUser(addUser.data.response_data);
        alert("Data User Management Berhasil Ditambahkan")
        history.push("/managementuser")
      }
      
    } catch (e) {      
      // console.log(e);
      setErrorMsg(e.response.data.response_message)
      if (e.response.data.response_message === "Failed") {
        alert(e.response.data.response_message)
      }
      history.push(errorCatch(e.response.status));
    }
  }
  useEffect(() => {
    if (!access_token) {
      history.push("/login");
    }
    if (user_role === "102") {
      history.push('/404');
    }
    if (inputHandle.role === "102" || inputHandle.role === "104") {
      getListPartner();
    }
    getListRole();
    if (inputHandle.role === "104" && selectedPartnerAddUser.length !== 0) {
      getListAgen(selectedPartnerAddUser[0].value);
    }
    if (inputHandle.role === "106" || inputHandle.role === "107" || inputHandle.role === "108") {
      getGrupQrisHandler()
    }
  }, [access_token, inputHandle.role, selectedPartnerAddUser, user_role]);

  return (
    <div className="main-content mt-5" style={{ padding: "37px 27px" }}>
      <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;<Link to={"/managementuser"}>Management User</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Tambah Data User</span>
      <div className="d-flex mt-3">
        <h3 className="text-black">Tambah Data</h3>
        <small className="my-2 py-1 mx-2">User</small>
      </div>
      <h5 className="mt-3">Data User</h5>
      <div className="base-content" style={{ width: "93%", padding: 50 }}>
        <div className="search-bar mb-5">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: "Nunito" }}>
                Nama Lengkap
              </Form.Label>
              <Form.Control
                name="name"
                type="text"
                onChange={handleChange}
                value={inputHandle.name}
                placeholder="Masukkan Nama Lengkap"
                style={{ width: "100%", height: 40 }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: "Nunito" }}>Email</Form.Label>
              <Form.Control
                name="email"
                onChange={handleChange}
                value={inputHandle.email}
                type="email"
                placeholder="Masukkan Email"
                style={{ width: "100%", height: 40 }}
              />
              {errorMsg === "Email sudah terdaftar" &&
                <span style={{ color: "#B9121B", fontSize: 12 }}>
                  <img src={noteIconRed} className="me-2" />
                  {errorMsg}
                </span>
              }
            </Form.Group>            
            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: "Nunito" }}>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type={passwordInputType}
                  name="password"
                  onChange={handleChange}
                  value={inputHandle.password}
                  placeholder="Masukkan Password"
                  style={{ width: "90%", height: 40 }}
                />
                <InputGroup.Text
                  onClick={togglePasswordVisibility}
                  className="pass-log"
                >
                  <FontAwesomeIcon color={passwordIconColor} icon={faEye} />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: "Nunito" }}>
                Role Group
              </Form.Label>
              <Form.Select
                name="role"
                onChange={handleChange}
                value={inputHandle.role}
              >
                <option defaultValue>--- Choose Role Group ---</option>
                {listRole.map((item, index) => {
                  return (
                    <option key={index} value={item.role_id}>
                      {item.role_name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group
              className="mb-3"
              style={{
                display:
                  inputHandle.role === "106" || inputHandle.role === "107" || inputHandle.role === "108"
                    ? ""
                    : "none",
              }}
            >
              <Form.Label style={{ fontFamily: "Nunito" }}>Nama Grup</Form.Label>
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
              {/* <Form.Select
                name="partnerId"
                onChange={handleChange}
                value={inputHandle.partnerId}
              >
                <option defaultValue>--- Choose Partner ---</option>
                {listPartner.map((item, index) => {
                  return (
                    <option key={index} value={item.partner_id}>
                      {item.nama_perusahaan}
                    </option>
                  );
                })}
              </Form.Select> */}
            </Form.Group>

            <Form.Group
              className="mb-3"
              style={{
                display:
                  inputHandle.role === "107" || inputHandle.role === "108"
                    ? ""
                    : "none",
              }}
            >
              <Form.Label style={{ fontFamily: "Nunito" }}>Nama Brand</Form.Label>
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
              {/* <Form.Select
                name="partnerId"
                onChange={handleChange}
                value={inputHandle.partnerId}
              >
                <option defaultValue>--- Choose Partner ---</option>
                {listPartner.map((item, index) => {
                  return (
                    <option key={index} value={item.partner_id}>
                      {item.nama_perusahaan}
                    </option>
                  );
                })}
              </Form.Select> */}
            </Form.Group>

            <Form.Group
              className="mb-3"
              style={{
                display:
                  inputHandle.role === "108"
                    ? ""
                    : "none",
              }}
            >
              <Form.Label style={{ fontFamily: "Nunito" }}>Nama Outlet / Store</Form.Label>
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
              {/* <Form.Select
                name="partnerId"
                onChange={handleChange}
                value={inputHandle.partnerId}
              >
                <option defaultValue>--- Choose Partner ---</option>
                {listPartner.map((item, index) => {
                  return (
                    <option key={index} value={item.partner_id}>
                      {item.nama_perusahaan}
                    </option>
                  );
                })}
              </Form.Select> */}
            </Form.Group>

            <Form.Group
              className="mb-3"
              style={{
                display:
                  inputHandle.role === "102" || inputHandle.role === "104"
                    ? ""
                    : "none",
              }}
            >
              <Form.Label style={{ fontFamily: "Nunito" }}>Partner</Form.Label>
              <div className="dropdown dropPartnerAddUser">
                <ReactSelect
                  // isMulti
                  closeMenuOnSelect={true}
                  hideSelectedOptions={false}
                  options={dataListPartner}
                  // allowSelectAll={true}
                  value={selectedPartnerAddUser}
                  onChange={(selected) => setSelectedPartnerAddUser([selected])}
                  placeholder="--- Choose Partner ---"
                  components={{ Option }}
                  styles={customStylesSelectedOption}
                />
              </div>
              {/* <Form.Select
                name="partnerId"
                onChange={handleChange}
                value={inputHandle.partnerId}
              >
                <option defaultValue>--- Choose Partner ---</option>
                {listPartner.map((item, index) => {
                  return (
                    <option key={index} value={item.partner_id}>
                      {item.nama_perusahaan}
                    </option>
                  );
                })}
              </Form.Select> */}
            </Form.Group>
            <Form.Group
              className="mb-3"
              style={{
                display:
                  inputHandle.role === "104" && selectedPartnerAddUser.length !== 0
                    ? ""
                    : "none",
              }}
            >
              <Form.Label style={{ fontFamily: "Nunito" }}>Agen</Form.Label>
              <div className="dropdown dropPartnerAddUser">
                <ReactSelect
                  // isMulti
                  closeMenuOnSelect={true}
                  hideSelectedOptions={false}
                  options={dataListAgenFromPartner}
                  // allowSelectAll={true}
                  value={selectedAgenAddUser}
                  onChange={(selected) => setSelectedAgenAddUser([selected])}
                  placeholder="--- Choose Agen ---"
                  components={{ Option }}
                  styles={customStylesSelectedOption}
                />
              </div>
              {/* <Form.Select
                name="agenId"
                onChange={handleChange}
                value={inputHandle.agenId}
              >
                <option defaultValue>--- Choose Agen ---</option>
                {dataListAgenFromPartner.map((item, index) => {
                  return (
                    <option key={index} value={item.agen_id}>
                      {item.agen_name}
                    </option>
                  );
                })}
              </Form.Select> */}
            </Form.Group>
            <Form.Check
              label="Active Status"
              id="statusId"
              onChange={handleOnChangeCheckBox}
              checked={isChecked}
            />
          </Form>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginTop: 16,
          marginRight: 83,
        }}
      >
        <button
          onClick={() =>
            sendAddUser(
              inputHandle.name,
              inputHandle.email,
              inputHandle.password,
              inputHandle.role,
              isChecked,
              selectedPartnerAddUser.length !== 0 ? selectedPartnerAddUser[0].value : "",
              selectedAgenAddUser.length !== 0 ? selectedAgenAddUser[0].value : "",
              selectedGrupName.length !== 0 ? selectedGrupName[0].value : "",
              selectedBrandName.length !== 0 ? selectedBrandName[0].value : "",
              selectedStoreName.length !== 0 ? selectedStoreName[0].value : ""
            )
          }
          className={
            inputHandle.name.length === 0 ||
              inputHandle.email.length === 0 ||
              inputHandle.password.length === 0 ||
              inputHandle.role.length === 0
              ? "btn-off"
              : "add-button"
          }
          disabled={
            inputHandle.name.length === 0 ||
              inputHandle.email.length === 0 ||
              inputHandle.password.length === 0 ||
              inputHandle.role.length === 0
          }
          style={{
            cursor: (inputHandle.name.length !== 0 &&
              inputHandle.email.length !== 0 &&
              inputHandle.password.length !== 0 &&
              inputHandle.role.length !== 0) ? "pointer" : "unset"
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
export default AddUser;
