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
import { authorization, BaseURL, getRole, language, setRoleSession, setUserSession } from "../../function/helpers";
import validator from "validator";
import $ from 'jquery'
import { chn, eng, ind } from "../../components/Language";

export default () => {

  const history = useHistory()
  const user_role = getRole()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [isTabLanguage, setIsTabLanguage] = useState("bahasa")
  const passwordInputType = showPassword ? "text" : "password";
  const passwordIconColor = showPassword ? "#262B40" : "";

  function tabLanguage (isTabs) {
    if (isTabs === "bahasa") {
      setIsTabLanguage("bahasa")
      if (sessionStorage.getItem('lang') === null) {
        sessionStorage.setItem('lang', JSON.stringify(ind));
      } else if (sessionStorage.getItem('lang') !== JSON.stringify(ind)) {
          sessionStorage.setItem('lang', JSON.stringify(ind));
      }
      $('#bahasaTab').addClass('menu-detail-language-hr-active')
      $('#inggrisTab').removeClass('menu-detail-language-hr-active')
      $('#mandarinTab').removeClass('menu-detail-language-hr-active')
    } else if (isTabs === "inggris") {
      setIsTabLanguage("inggris")
      sessionStorage.setItem('lang', JSON.stringify(eng));
      $('#bahasaTab').removeClass('menu-detail-language-hr-active')
      $('#inggrisTab').addClass('menu-detail-language-hr-active')
      $('#mandarinTab').removeClass('menu-detail-language-hr-active')
    } else if (isTabs === "mandarin") {
      setIsTabLanguage("mandarin")
      sessionStorage.setItem('lang', JSON.stringify(chn));
      $('#bahasaTab').removeClass('menu-detail-language-hr-active')
      $('#inggrisTab').removeClass('menu-detail-language-hr-active')
      $('#mandarinTab').addClass('menu-detail-language-hr-active')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function inaLang () {
    // sessionStorage.removeItem('lang');
    localStorage.setItem('lang', JSON.stringify(ind));
    // history.push("/Riwayat Transaksi/va-dan-paylink")
    // history.push(0)
    // setFlagLangCurrent('ind')
    window.location.reload();
  }

  function engLang () {
    if (localStorage.getItem('lang') === null) {
      localStorage.setItem('lang', JSON.stringify(eng));
      // history.push("/Riwayat Transaksi/va-dan-paylink")
      // history.push(0)
      // setFlagLangCurrent('eng')
      window.location.reload();
    } else if (localStorage.getItem('lang') !== JSON.stringify(eng)) {
        localStorage.setItem('lang', JSON.stringify(eng));
        // history.push("/Transaction Report/va-dan-paylink")
        // history.push(0)
        // setFlagLangCurrent('eng')
        window.location.reload();
    }
  }

  function chnLang () {
      localStorage.setItem('lang', JSON.stringify(chn));
      // history.push("/历史交易/va-dan-paylink")
      // history.push(0)
      // setFlagLangCurrent('chn')
      window.location.reload();
  }

  async function userAccessMenu(url, token, lang) {
    try {
      const auth = "Bearer " + token
        const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth,
            'Accept-Language' : lang
      }
      const dataUserAccessMenu = await axios.post(BaseURL + url, { data: "" }, { headers: headers })
      // console.log(dataUserAccessMenu, 'data access');
      if (dataUserAccessMenu.status === 200 && dataUserAccessMenu.data.response_code === 200) {
        if (dataUserAccessMenu.data.response_data[0].detail.length !== 0) {
          switch (dataUserAccessMenu.data.response_data[0].detail[0].id) {
            case 1101:
              history.push("/riwayat-transaksi/va-dan-paylink")
            break;
            case 1102:
              history.push("/riwayat-transaksi/disbursement")
            break;
            case 1103:
              history.push("/riwayat-transaksi/ewallet")
            break;
            case 1104:
              history.push("/riwayat-transaksi/direct-debit")
            break;
            case 1105:
              history.push("/riwayat-transaksi/sub-account")
            break;
            case 1106:
              history.push("/riwayat-transaksi/transaksi-qris")
            break;
            case 1108:
              history.push("/riwayat-transaksi/va-usd")
            break;
            case 1601:
              history.push("/Transaksi/va-dan-paylink")
            break;
            case 1602:
              history.push("/Transaksi/disbursement")
            break;
            case 1603:
              history.push("/Transaksi/ewallet")
            break;
            case 1604:
              history.push("/Transaksi/direct-debit")
            break;
            case 1605:
              history.push("/Transaksi/sub-account")
            break;
            case 1606:
              history.push("/Transaksi/disbursement-timeout")
            break;
            case 1607:
              history.push("/transaksi/transaksi-qris")
            break;
            case 1701:
              history.push("/settlement/riwayat-settlement")
            break;
            case 1702:
              history.push("/settlement/settlement-manual")
            break;
            case 1705:
              history.push("/settlement/settlement-manual")
            break;
            case 1901:
              history.push("/HelpDesk/renotifyva")
            break;
            case 2301:
              history.push("/Buat Invoice/disbursement")
            break;
            case 2302:
              history.push("/Buat Invoice/settlement")
            break;
            case 2401:
              history.push("/Sub Account Bank/info-saldo-dan-mutasi")
            break;
            case 2402:
              history.push("/Sub Account Bank/transfer")
            break;
            case 2403:
              history.push("/Sub Account Bank/riwayat-sub-account")
            break;
            case 2601:
              history.push("/Disbursement/disbursementpage")
            break;
            case 2602:
              history.push("/Disbursement/report")
            break;
          }
        } else {
          switch (dataUserAccessMenu.data.response_data[0].id) {
            case 10:
              history.push("/")
            break;
            case 11:
              history.push("/laporan")
            break;
            case 14:
              history.push("/daftaragen")
            break;
            case 15:
              history.push("/daftarpartner")
            break;
            case 16:
              history.push("/riwayattransaksi")
            break;
            case 17:
              history.push("/invoiceva")
            break;
            case 18:
              history.push("/managementuser")
            break;
            case 19:
              history.push("/HelpDesk/renotifyva")
            break;
            case 20:
              history.push("/listpayment")
            break;
            case 21:
              history.push("/disbursementreport")
            break;
            case 22:
              history.push("/riwayattopup")
            break;
            case 23:
              history.push("/invoicedisbursement")
            break;
            case 24:
              history.push("/transfer-sub-account")
            break;
            case 26:
              history.push("/disbursement")
            break;
            case 27:
              history.push("/riwayat-saldo-partner")
            break;
            case 28:
              history.push("/user-direct-debit")
            break;
            case 29:
              history.push("/riwayat-saldo-partner")
            break;
            case 31:
              history.push("/disbursement")
            break;
          }
        }
      }
    } catch (error) {
      // console.log(error);
    }
  }

  async function userDetail(token) {
    try {
      const auth = "Bearer " + token
      const headers = {
          'Content-Type':'application/json',
          'Authorization' : auth
      }
      const userDetail = await axios.post(BaseURL + "/Account/GetUserProfile", { data: "" }, { headers: headers })
      if (userDetail.status === 200 && userDetail.data.response_code === 200) {
        setRoleSession(userDetail.data.response_data.muser_role_id)
        userAccessMenu("/Account/GetUserAccess", token, user_role === "100" ? "EN" : (language === null ? 'EN' : language.flagName))
      }
    } catch (error) {
      // console.log(error)
    }
  }

  async function signingInHandler(e, username, password, lang) {
    try {
      e.preventDefault()
      if (username.length === 0 && password.length === 0) {
        setErrorMessage(language === null ? eng.silahkanMasukkanEmailAndPass : language.silahkanMasukkanEmailAndPass)
        return
      } else if (username.length !== 0 && validator.isEmail(username) === true && password.length === 0) {
        setErrorMessage(language === null ? eng.silahkanMasukkanPassword : language.silahkanMasukkanPassword)
        return
      } else if (username.length !== 0 && validator.isEmail(username) === false && password.length === 0) {
        setErrorMessage(language === null ? eng.formatEmailSalah : language.formatEmailSalah)
        return
      } else if (username.length === 0 && password.length !== 0) {
        setErrorMessage(language === null ? eng.silahkanMasukkanEmail : language.silahkanMasukkanEmail)
        return
      }
      const auth = authorization
      const dataParams = encryptData(`{"username" : "${username}", "password" : "${password}"}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth,
        'Accept-Language' : lang
      }
      const dataLogin = await axios.post(BaseURL + "/Account/Login", { data: dataParams }, { headers: headers })
      if (dataLogin.status === 200 && dataLogin.data.response_code === 200) {
        setUserSession(dataLogin.data.response_data.access_token)
        userDetail(dataLogin.data.response_data.access_token)
      }
    } catch (error) {
      // console.log(error);
      setErrorMessage(error.response.data.response_message)
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
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100" style={{ maxWidth: 440, maxHeight: 495, zIndex: 1, marginTop: 25, marginLeft: 88 }}>
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0" style={{ fontFamily: "Exo", fontSize: 24, fontWeight: 700 }}>{language === null ? eng.loginKeEezeelink : language.loginKeEezeelink }</h3>
                  {
                    errorMessage.length !== 0 &&
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#B9121B" }}>{ errorMessage }</span>
                  }
                </div>
                <Form className="mt-4">
                  <Form.Group style={{ fontFamily: "Nunito" }} id="email" className="mb-4">
                    <Form.Label>{language === null ? eng.email : language.email}</Form.Label>
                    <InputGroup>
                      <Form.Control onChange={e => setUsername(e.target.value)} autoFocus required type="email" placeholder={language === null ? eng.placeholderMasukkanEmail : language.placeholderMasukkanEmail} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group style={{ fontFamily: "Nunito" }} id="password" className="mb-4">
                      <Form.Label>{language === null ? eng.kataSandi : language.kataSandi}</Form.Label>
                      <InputGroup>
                        <Form.Control onChange={e => setPassword(e.target.value)} required type={passwordInputType} placeholder={language === null ? eng.placeholderKataSandi : language.placeholderKataSandi} />
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
                  <Button onClick={(e) => signingInHandler(e, username, password, language === null ? 'EN' : language.flagName)} style={{ fontFamily: "Exo", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #383838;", color: "#2C1919" }} variant="primary" type="submit" className="w-100">
                    {language === null ? eng.login : language.login}
                  </Button>
                </Form>
                <div>
                  <div className="d-flex justify-content-center align-items-center mt-4" style={{ fontFamily: "Exo" }}>
                    <Card.Link as={Link} to={Routes.ForgotPassword.path} className="fw-bold" style={{ textDecoration: "underline", color: "#077E86" }}>
                      {language === null ? eng.lupaKataSandi : language.lupaKataSandi}?
                    </Card.Link>
                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    <div style={{ fontFamily: "Exo", fontSize: 12 }}>{language === null ? eng.pilihBahasa : language.pilihBahasa} :</div>
                    <div className={language === null ? `detail-language-tabs mx-2` : language.flagName === "ID" ? `menu-detail-language-hr-active mx-2` : `detail-language-tabs mx-2 `} id="bahasaTab" onClick={() => inaLang()}>
                      {language === null ? eng.bahasa : language.bahasa}
                    </div>
                    <div style={{ border: "1px solid #EBEBEB", height: 18 }}></div>
                    <div className={language === null ? `menu-detail-language-hr-active mx-2` : language.flagName === "EN" ? `menu-detail-language-hr-active mx-2` : `detail-language-tabs mx-2 `} id="inggrisTab" onClick={() => engLang()}>
                      {language === null ? eng.inggris : language.inggris}
                    </div>
                    <div style={{ border: "1px solid #EBEBEB", height: 18 }}></div>
                    <div className={language === null ? `detail-language-tabs mx-2` : language.flagName === "CN" ? `menu-detail-language-hr-active mx-2` : `detail-language-tabs mx-2 `} id="mandarinTab" onClick={() => chnLang()}>
                      {language === null ? eng.china : language.china}
                    </div>
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
