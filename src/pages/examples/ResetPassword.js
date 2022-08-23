
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../../routes";
import { getToken } from "../../function/helpers";
import encryptData from "../../function/encryptData";
import axios from "axios";
import noteIconRed from "../../assets/icon/note_icon_red.svg"

export default ({ location }) => {

  const validateSignature = location.search.split("=")[1].slice(0,(location.search.split("=")[1].length - 6))
  const validateEmail = location.search.split("=")[2]
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("")
  const [isErrorConfirmNewPass, setIsErrorConfirmNewPass] = useState(false)
  const [isNotValid, setIsNotValid] = useState(false)
  console.log(validateSignature, "ini validateSignature");
  console.log(validateEmail, "ini validateEmail");

  async function validateResetPassword(signature, email) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"email": "${email}", "signature": "${signature}"}`)
      const headers = {
        "Content-Type": "application/json",
        'Authorization': auth,
      };
      const validated = await axios.post("/Account/ValidateResetPassword", { data: dataParams }, { headers: headers })
      console.log(validated, "ini validated");
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    console.log(e.target.name, "ini name");
    if (e.target.name === "new-password") {
      setNewPassword(e.target.value)
    } else if (e.target.name === "new-password-confirmation") {
      setNewPasswordConfirmation(e.target.value)
    }
  }

  async function ResetNewPassword(email, signature, password, passwordConfirmation) {
    try {
      console.log(password, "ini password");
      console.log(passwordConfirmation, "ini passwordConfirmation");
      let validasi = 0
        const besarKecil = /[A-Za-z]/g;
        const numbers = /[0-9]/g;
        const spChar = /[/\W|_/g]/g;

        if (password !== passwordConfirmation) {
            setIsErrorConfirmNewPass(true)
            return
        } else {
            setIsErrorConfirmNewPass(false)
        }
        if (password.match(besarKecil) && password.length >= 8) {
            validasi += 1
        }
        if (password.match(numbers)) {
            validasi += 1
        }
        if (password.match(spChar)) {
            validasi += 1
        }
        console.log(validasi, "ini validasi");
        if (validasi <= 2) {
            setIsNotValid(true)
        } else {
          setIsNotValid(false)
          const auth = "Bearer " + getToken()
          const dataParams = encryptData(`{"email": "${email}", "signature": "${signature}", "password": "${password}"}`)
          console.log(dataParams, "ini dataParams reset password");
          const headers = {
            "Content-Type": "application/json",
            'Authorization': auth,
          };
          const resetPassword = await axios.post("/Account/ResetPassword", { data: dataParams }, { headers: headers })
          console.log(resetPassword, "ini resetPassword");
        }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    validateResetPassword(validateSignature, validateEmail)
  }, [validateSignature, validateEmail])
  

  return (
    <main>
      <section className="bg-soft d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center">
            {/* <p className="text-center">
              <Card.Link as={Link} to={Routes.Login.path} className="text-gray-700">
                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to sign in
              </Card.Link>
            </p> */}
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <h3 className="mb-4">Atur Ulang Kata Sandi</h3>
                <p className="mb-4" style={{ fontFamily: "Nunito" }}>Masukkan kata sandi kamu yang baru dan lakukan konfirmasi kata sandi baru</p>
                <Form>
                  {/* <Form.Group id="email" className="mb-4">
                    <Form.Label>Your Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="email" placeholder="example@company.com" />
                    </InputGroup>
                  </Form.Group> */}
                  <Form.Group id="password" className="mb-4">
                    <Form.Label>Kata Sandi Baru</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control required value={newPassword} onChange={handleChange} name="new-password" type="password" placeholder="Masukkan Kata Sandi Baru" />
                    </InputGroup>
                    {
                      (isNotValid) &&
                      <div className="col-12 form-grup mt-1" style={{ marginTop: 'unset' }}>
                        <label className="placeholders" style={{ color: 'rgb(238, 46, 44)', fontSize: 10, display: 'flex', marginLeft: 14 }}>Kata sandi minimal 8-20 karakter. 2 kombinasi antara huruf, angka, simbol.</label>
                      </div>
                    }
                  </Form.Group>
                  <Form.Group id="confirmPassword" className="mb-4">
                    <Form.Label>Konfirmasi Kata Sandi Baru</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control required value={newPasswordConfirmation} onChange={handleChange} name="new-password-confirmation" type="password" placeholder="Konfirmasi Kata Sandi Baru" />
                    </InputGroup>
                    {
                      isErrorConfirmNewPass &&
                      <div className="error-txt" style={{ display: 'flex', fontSize: 12, fontWeight: 600, marginTop: 10, marginLeft: 14, color: "rgb(238, 46, 44)" }}>
                        <img src={noteIconRed} className="me-2" />
                        Kata sandi tidak sama
                      </div>
                    }
                  </Form.Group>
                </Form>
                <Button onClick={() => ResetNewPassword(validateEmail, validateSignature, newPassword, newPasswordConfirmation)} variant="primary" type="submit" className="w-100" style={{ fontFamily: "Exo", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #383838;", color: "#2C1919" }}>
                  Ubah Kata Sandi
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
