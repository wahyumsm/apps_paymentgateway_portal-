import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "@themesberg/react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  BaseURL,
  errorCatch,
  getToken,
  RouteTo,
  setUserSession,
} from "../../function/helpers";

function AddUser() {
  const history = useHistory();
  const access_token = getToken();
  const auth = "Bearer " + getToken();

  const [inputHandle, setInputHandle] = useState({
    userName: "",
    name: "",
    password: "",
    role: 0,
    isActive: false,
    partnerId: "",
  });
  const [listRole, setListRole] = useState([]);

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
      if (listRole.data.response_code === 200 && listRole.status === 200) {
        setListRole(listRole.data.response_data);
        console.log(listRole.data.response_data);
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
    getListRole();
  }, []);
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
              <Form.Label style={{ fontFamily: "Nunito" }}>Username</Form.Label>
              <Form.Control
                name="userName"
                onChange={handleChange}
                value={inputHandle.userName}
                type="text"
                placeholder="Masukkan Username"
                style={{ width: "100%", height: 40 }}
              />
            </Form.Group>
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
              <Form.Label style={{ fontFamily: "Nunito" }}>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Masukkan Password"
                style={{ width: "100%", height: 40 }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontFamily: "Nunito" }}>
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleChange}
                value={inputHandle.password}
                placeholder="Ulangi Password untuk User ini"
                style={{ width: "100%", height: 40 }}
              />
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
            <Form.Check label="Active Status" id="statusId" />
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
        <button className="add-button">Save</button>
      </div>
    </div>
  );
}
export default AddUser;
