
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, Container, InputGroup, Modal } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import sendEmailIcon from "../../assets/img/illustrations/sendEmail.svg";
import "./ForgotPassword.css"

import { Routes } from "../../routes";


export default () => {

  const [email, setEmail] = useState('')
  const [showModal, setShowModal] = useState(false)

  function sendEmail(emailLink) {
    if (emailLink.length > 0) {
      let isEmail = 0
      for (let i = 0; i < emailLink.length; i++) {
        const email = emailLink[i];
        if (email === "@") {
          isEmail++
        }
      }
      if (isEmail === 1) {
        setShowModal(true)
      } else if (isEmail < 1 || isEmail > 1) {
        alert('Silahkan isi alamat email anda')
      }
    } else {
      alert('Silahkan isi alamat email anda')
    }
  }

  return (
    <main>
      <section className="vh-lg-100 mt-4 mt-lg-0 bg-soft d-flex align-items-center">
        <Container>
          <Row className="justify-content-center">
            <p className="text-center">
              <Card.Link as={Link} to={Routes.Signin.path} style={{ fontFamily: "Exo", color: "#077E86" }}>
                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Kembali ke Login page
              </Card.Link>
            </p>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="signin-inner my-3 my-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <h3 style={{ marginBottom: 10, fontFamily: "Exo" }}>Lupa Kata Sandi</h3>
                <p className="mb-4" style={{ fontFamily: "Nunito" }}>Masukan email yang kamu daftarkan dibawah ini dan kami akan mengirim pesan email beserta link untuk reset kata sandi</p>
                <Form>
                  <div className="mb-4" style={{ fontFamily: "Nunito" }}>
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <InputGroup id="email">
                      <Form.Control required autoFocus type="email" onChange={e => setEmail(e.target.value)} placeholder="Masukkan Email" />
                    </InputGroup>
                  </div>
                  <Button variant="primary" onClick={() => sendEmail(email)} className="w-100" style={{ fontFamily: "Exo", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #383838;", color: "#2C1919" }}>
                    Kirim Link
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
            <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>Link Berhasil Dikirim ke Email</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", textAlign: "center", marginBottom: 24 }}>
            <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }}>Silahkan periksa email dan ikuti intruksi untuk mereset kata sandi Anda.</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Button variant="primary" onClick={() => setShowModal(false)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Oke</Button>
          </div>
        </Modal.Body>
      </Modal>
    </main>
  );
};
