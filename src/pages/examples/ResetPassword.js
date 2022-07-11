
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../../routes";


export default () => {
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
                      <Form.Control required type="password" placeholder="Masukkan Kata Sandi Baru" />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="confirmPassword" className="mb-4">
                    <Form.Label>Konfirmasi Kata Sandi Baru</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control required type="password" placeholder="Konfirmasi Kata Sandi Baru" />
                    </InputGroup>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100" style={{ fontFamily: "Exo", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #383838;", color: "#2C1919" }}>
                    Ubah Kata Sandi
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
