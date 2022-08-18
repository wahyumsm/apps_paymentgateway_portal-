import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "@themesberg/react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
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
  const [listPartner, setDataListPartner] = useState([]);
  const [addUser, setAddUser] = useState([]);
  const [dataListAgenFromPartner, setDataListAgenFromPartner] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputType = showPassword ? "text" : "password";
  const [isChecked, setIsChecked] = useState(false);
  const passwordIconColor = showPassword ? "#262B40" : "";
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
        "/Account/GetAccessRole",
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
      console.log(e);
    }
  }

  async function getListPartner() {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listPartner = await axios.post(
        "/Partner/ListPartner",
        { data: "" },
        { headers: headers }
      );
      if (
        listPartner.status === 200 &&
        listPartner.data.response_code === 200 &&
        listPartner.data.response_new_token.length === 0
      ) {
        setDataListPartner(listPartner.data.response_data);
      } else if (
        listPartner.status === 200 &&
        listPartner.data.response_code === 200 &&
        listPartner.data.response_new_token.length !== 0
      ) {
        setUserSession(listPartner.data.response_new_token);
        setDataListPartner(listPartner.data.response_data);
      }
    } catch (e) {
      console.log(e);
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
        "/Partner/GetListAgen",
        { data: dataParams },
        { headers: headers }
      );
      if (
        listAgenFromPartner.status === 200 &&
        listAgenFromPartner.data.response_code === 200 &&
        listAgenFromPartner.data.response_new_token.length === 0
      ) {
        setDataListAgenFromPartner(listAgenFromPartner.data.response_data);
      } else if (
        listAgenFromPartner.status === 200 &&
        listAgenFromPartner.data.response_code === 200 &&
        listAgenFromPartner.data.response_new_token.length !== 0
      ) {
        setUserSession(listAgenFromPartner.data.response_new_token);
        setDataListAgenFromPartner(listAgenFromPartner.data.response_data);
      }
    } catch (e) {
      console.log(e);
      history.push(errorCatch(e.response.status));
    }
  }

  async function sendAddUser(
    name,
    email,
    password,
    role,
    isActive,
    partnerId,
    agenId
  ) {
    try {
      const dataParams = encryptData(
        `{"name": "${name}", "email": "${email}", "password": "${password}", "role": ${role}, "is_active": "${isActive}", "partnerdtl_id": "${role === "102" ? partnerId : role === "103" ? agenId : ""
        }"}`
      );
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const addUser = await axios.post(
        "/Account/AddUser",
        { data: dataParams },
        { headers: headers }
      );
      if (addUser.data.response_code === 200 && addUser.status === 200 && addUser.data.response_new_token.length === 0) {
        setAddUser(addUser.data.response_data);
      } else if (addUser.data.response_code === 200 && addUser.status === 200 && addUser.data.response_new_token.length !== 0) {
        
      }
    } catch (e) {
      history.push(errorCatch(e.response.status));
      console.log(e);
    }
  }
  useEffect(() => {
    if (!access_token) {
      // RouteTo("/login")
      history.push("/login");
    }
    if (user_role === "102") {
      history.push('/404');
    }
    if (inputHandle.role === "102" || inputHandle.role === "103") {
      getListPartner();
    }
    getListRole();
    if (inputHandle.role === "103" && inputHandle.partnerId !== "") {
      getListAgen(inputHandle.partnerId);
    }
  }, [access_token, inputHandle.role, inputHandle.partnerId, user_role]);

  return (
    <div className="main-content mt-5" style={{ padding: "37px 27px" }}>
      <div className="d-flex">
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
                  inputHandle.role === "102" || inputHandle.role === "103"
                    ? ""
                    : "none",
              }}
            >
              <Form.Label style={{ fontFamily: "Nunito" }}>Partner</Form.Label>
              <Form.Select
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
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="mb-3"
              style={{
                display:
                  inputHandle.role === "103" && inputHandle.partnerId !== ""
                    ? ""
                    : "none",
              }}
            >
              <Form.Label style={{ fontFamily: "Nunito" }}>Agen</Form.Label>
              <Form.Select
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
              </Form.Select>
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
              inputHandle.partnerId,
              inputHandle.agenId
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
          dis={
            inputHandle.name.length === 0 ||
              inputHandle.email.length === 0 ||
              inputHandle.password.length === 0 ||
              inputHandle.role.length === 0
              ? "btn-off"
              : "add-button"
          }
        >
          Save
        </button>
      </div>
    </div>
  );
}
export default AddUser;
