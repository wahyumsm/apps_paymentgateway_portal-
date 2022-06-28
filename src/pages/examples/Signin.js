
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";

import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";
import encryptData from "../../function/encryptData";
import { authorization, BaseURL, setUserSession } from "../../function/helpers";


export default () => {

  const history = useHistory()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  async function signingInHandler(username, password) {
    // console.log('click login');
    try {
      const auth = authorization
      const dataParams = encryptData(`{"username" : '${username}', "password" : '${password}'}`)
      // console.log(dataParams);
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const dataLogin = await axios.post("/Account/Login", { data: dataParams }, { headers: headers })
      // console.log(dataLogin, 'ini data login');
      if (dataLogin.status === 200 && dataLogin.data.response_code === 200) {
        setUserSession(dataLogin.data.response_data.access_token)
        history.push("/")
        // window.location.reload()
      }
    } catch (error) {
      console.log(error);
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
            <img src={BgImage} alt="Signin" className="img-fluid" style={{ maxWidth: 980, maxHeight: 536, position: "absolute" }} />
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100" style={{ maxWidth: 440, maxHeight: 459, zIndex: 1, marginTop: 46, marginLeft: 88 }}>
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0" style={{ fontFamily: "Exo", fontSize: 24, fontWeight: 700 }}>Login ke Ezeelink Payment Gateway</h3>
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
                        <Form.Control onChange={e => setPassword(e.target.value)} required type="password" placeholder="Masukkan Kata Sandi" />
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
                  <Button onClick={() => signingInHandler(username, password)} style={{ fontFamily: "Exo", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #383838;", color: "#2C1919" }} variant="primary" type="submit" className="w-100">
                    Login
                  </Button>
                </Form>

                {/* <div className="mt-3 mb-4 text-center">
                  <span className="fw-normal">or login with</span>
                </div>
                <div className="d-flex justify-content-center my-4">
                  <Button variant="outline-light" className="btn-icon-only btn-pill text-facebook me-2">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </Button>
                  <Button variant="outline-light" className="btn-icon-only btn-pill text-twitter me-2">
                    <FontAwesomeIcon icon={faTwitter} />
                  </Button>
                  <Button variant="outline-light" className="btn-icon-only btn-pil text-dark">
                    <FontAwesomeIcon icon={faGithub} />
                  </Button>
                </div> */}
                <div className="d-flex justify-content-center align-items-center mt-4" style={{ fontFamily: "Exo" }}>
                  {/* <span className="fw-normal">
                    Not registered? */}
                    <Card.Link as={Link} to={Routes.ForgotPassword.path} className="fw-bold" style={{ textDecoration: "underline", color: "#077E86" }}>
                      {` Lupa Kata Sandi? `}
                    </Card.Link>
                  {/* </span> */}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
