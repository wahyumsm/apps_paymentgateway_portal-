
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faAngleLeft, faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";

import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";
import encryptData from "../../function/encryptData";
import { authorization, BaseURL, errorCatch, RouteTo, setRoleSession, setUserSession } from "../../function/helpers";
import { GetUserDetail } from "../../redux/ActionCreators/UserDetailAction";


export default () => {

  const history = useHistory()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const passwordInputType = showPassword ? "text" : "password";
  const passwordIconColor = showPassword ? "#262B40" : "";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function userDetail(token) {
    try {
      const auth = "Bearer " + token
      const headers = {
          'Content-Type':'application/json',
          'Authorization' : auth
      }
      const userDetail = await axios.post(BaseURL + "/Account/GetUserProfile", { data: "" }, { headers: headers })
      // console.log(userDetail.data, "userDetail di login");
      if (userDetail.status === 200 && userDetail.data.response_code === 200) {
        setRoleSession(userDetail.data.response_data.muser_role_id)
        if (userDetail.data.response_data.muser_role_id === 102) {
          history.push("/laporan")
        } else {
          history.push("/")
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function signingInHandler(username, password) {
    try {
      const auth = authorization
      const dataParams = encryptData(`{"username" : '${username}', "password" : '${password}'}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const dataLogin = await axios.post(BaseURL + "/Account/Login", { data: dataParams }, { headers: headers })
      // console.log(dataLogin.data, "dataLogin di login");
      if (dataLogin.status === 200 && dataLogin.data.response_code === 200) {
        setUserSession(dataLogin.data.response_data.access_token)
        userDetail(dataLogin.data.response_data.access_token)
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.response_message)
      }
      // RouteTo(errorCatch(error.response.status))
      // history.push(errorCatch(error.response.status))
    }
  }

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5" style={{ marginTop: 90 }}>
        <Container style={{ paddingLeft: "unset" }}>
          {/* <p className="text-center">
            <Card.Link as={Link} to={Routes.DashboardOverview.path} className="text-gray-700">
              <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage
            </Card.Link>
          </p> */}
          <Row className="justify-content-center form-bg-image">
            <img src={BgImage} alt="Login" className="img-fluid" style={{ maxWidth: 980, maxHeight: 536, position: "absolute" }} />
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100" style={{ maxWidth: 440, maxHeight: 459, zIndex: 1, marginTop: 46, marginLeft: 88 }}>
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0" style={{ fontFamily: "Exo", fontSize: 24, fontWeight: 700 }}>Login ke Ezeelink Payment Gateway</h3>
                  {
                    errorMessage.length !== 0 &&
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#B9121B" }}>{ errorMessage }</span>
                  }
                </div>
                <Form className="mt-4">
                  <Form.Group style={{ fontFamily: "Nunito" }} id="email" className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <Form.Control onChange={e => setUsername(e.target.value)} autoFocus required type="email" placeholder="Masukkan Email" />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group style={{ fontFamily: "Nunito" }} id="password" className="mb-4">
                      <Form.Label>Kata Sandi</Form.Label>
                      <InputGroup>
                        <Form.Control onChange={e => setPassword(e.target.value)} required type={passwordInputType} placeholder="Masukkan Kata Sandi" />
                        <InputGroup.Text onClick={togglePasswordVisibility} className="pass-log">
                          <FontAwesomeIcon color={passwordIconColor} icon={faEye} />
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                    {/* <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check type="checkbox">
                        <FormCheck.Input id="defaultCheck5" className="me-2" />
                        <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Remember me</FormCheck.Label>
                      </Form.Check>
                      <Card.Link className="small text-end">Lost password?</Card.Link>
                    </div> */}
                  </Form.Group>
                </Form>
                <Button onClick={() => signingInHandler(username, password)} style={{ fontFamily: "Exo", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #383838;", color: "#2C1919" }} variant="primary" type="submit" className="w-100">
                  Login
                </Button>
                <div style={{ display: 'none' }}>
                  <div className="d-flex justify-content-center align-items-center mt-4" style={{ fontFamily: "Exo" }}>
                    <Card.Link as={Link} to={Routes.ForgotPassword.path} className="fw-bold" style={{ textDecoration: "underline", color: "#077E86" }}>
                      {` Lupa Kata Sandi? `}
                    </Card.Link>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
