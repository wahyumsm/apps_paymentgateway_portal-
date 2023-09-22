
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, Container, InputGroup, Modal } from '@themesberg/react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import validator from "validator";
import sendEmailIcon from "../../assets/img/illustrations/sendEmail.svg";
import { Routes } from "../../routes";
import { authorization, BaseURL, setUserSession } from "../../function/helpers";
import encryptData from "../../function/encryptData";
import axios from "axios";
import { ind } from "../../components/Language";

export default () => {

  const language = JSON.parse(sessionStorage.getItem('lang'))
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [showModal, setShowModal] = useState(false)

  function redirectToLogin() {
    setShowModal(false)
    history.push('/login')
  }

  async function sendEmail(e, emailLink) {
    try {
      e.preventDefault()
      if (validator.isEmail(emailLink)) {
        // console.log('email valid');
        const auth = authorization
        const dataParams = encryptData(`{"email": "${emailLink}"}`)
        const headers = {
          "Content-Type": "application/json",
          'Authorization': auth,
        };
        const emailSended = await axios.post(BaseURL + "/Account/ForgotPassword", { data: dataParams }, { headers: headers })
        // console.log(emailSended, "ini email sended");
        if (emailSended.status === 200 && emailSended.data.response_code === 200 && emailSended.data.response_new_token === null) {
          setShowModal(true)
        } else if (emailSended.status === 200 && emailSended.data.response_code === 200 && emailSended.data.response_new_token !== null) {
          setUserSession(emailSended.data.response_new_token)
          setShowModal(true)
        }
        // setShowModal(true)
      } else {
        // console.log('email invalid');
        alert(`${language === null ? ind.silahkanIsiAlamatEmail : language.silahkanIsiAlamatEmail}`)
      }
    } catch (error) {
      // console.log(error)
      if (error.response.status) {
        setShowModal(true)
      }
    }
  }

  return (
    <main>
      <section className="vh-lg-100 mt-4 mt-lg-0 bg-soft d-flex align-items-center">
        <Container>
          <Row className="justify-content-center">
            <p className="text-center">
              <Card.Link as={Link} to={Routes.Login.path} style={{ fontFamily: "Exo", color: "#077E86" }}>
                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> {language === null ? ind.kembaliKeLoginPage : language.kembaliKeLoginPage}
              </Card.Link>
            </p>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="signin-inner my-3 my-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <h3 style={{ marginBottom: 10, fontFamily: "Exo" }}>{language === null ? ind.lupaKataSandi : language.lupaKataSandi}</h3>
                <p className="mb-4" style={{ fontFamily: "Nunito" }}>{language === null ? ind.descKataSandi : language.descKataSandi}</p>
                <Form>
                  <div className="mb-4" style={{ fontFamily: "Nunito" }}>
                    <Form.Label htmlFor="email">{language === null ? ind.email : language.email}</Form.Label>
                    <InputGroup id="email">
                      <Form.Control required autoFocus type="email" onChange={e => setEmail(e.target.value)} placeholder={language === null ? ind.placeholderMasukkanEmail : language.placeholderMasukkanEmail} />
                    </InputGroup>
                  </div>
                  <Button variant="primary" onClick={(e) => sendEmail(e, email)} className="w-100" style={{ fontFamily: "Exo", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #383838;", color: "#2C1919" }}>
                    {language === null ? ind.kirimLink : language.kirimLink}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Modal centered show={showModal} onHide={() => setShowModal(false)} style={{ borderRadius: 8 }}>
        <Modal.Body style={{ maxWidth: 468, width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24, marginBottom: 12 }}>
            <img src={sendEmailIcon} alt="logo" />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>{language === null ? ind.linkBehasilDikirim : language.linkBehasilDikirim}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", textAlign: "center", marginBottom: 24 }}>
            <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }}>{language === null ? ind.periksaEmailDanIkutiInstruksi : language.periksaEmailDanIkutiInstruksi}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Button variant="primary" onClick={redirectToLogin} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>{language === null ? ind.oke : language.oke}</Button>
          </div>
        </Modal.Body>
      </Modal>
    </main>
  );
};
