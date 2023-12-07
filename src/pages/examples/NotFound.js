
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Card, Image, Button, Container } from '@themesberg/react-bootstrap';

import { Link, useHistory } from 'react-router-dom';

import { Routes } from "../../routes";
import NotFoundImage from "../../assets/img/illustrations/404.svg";
import { BaseURL, getRole, getToken, language } from "../../function/helpers";
import axios from "axios";


export default () => {

  const access_token = getToken()
  const user_role = getRole()
  const history = useHistory()

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
        // switch (dataUserAccessMenu.data.response_data[0].id) {
        //   case 10:
        //     history.push("/")
        //   break;
        //   case 11:
        //     history.push("/laporan")
        //   break;
        //   case 14:
        //     history.push("/daftaragen")
        //   break;
        //   case 15:
        //     history.push("/daftarpartner")
        //   break;
        //   case 16:
        //     history.push("/riwayattransaksi")
        //   break;
        //   case 17:
        //     history.push("/invoiceva")
        //   break;
        //   case 18:
        //     history.push("/managementuser")
        //   break;
        //   case 19:
        //     history.push("/HelpDesk/renotifyva")
        //   break;
        //   case 20:
        //     history.push("/listpayment")
        //   break;
        //   case 21:
        //     history.push("/disbursementreport")
        //   break;
        //   case 22:
        //     history.push("/riwayattopup")
        //   break;
        //   case 23:
        //     history.push("/invoicedisbursement")
        //   break;
        //   case 30:
        //     history.push("/Riwayat Transaksi/va-dan-paylink")
        //   break;
        // }
      }
    } catch (error) {
      // console.log(error);
      if (error.response.status === 401) {
        history.push("/login")
      }
    }
  }

  function toHome(token, role) {
    if (token === null || role === null) {
      history.push("/login")
    } else if (token !== null) {
      userAccessMenu("/Account/GetUserAccess", token, user_role === "100" ? "EN" : (language === null ? 'EN' : language.flagName))
    }
  }

  return (
    <main>
      <section className="vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <Row>
            <Col xs={12} className="text-center d-flex align-items-center justify-content-center">
              <div>
                <Card.Link onClick={() => toHome(access_token, user_role)}>
                  <Image src={NotFoundImage} className="img-fluid w-75" />
                </Card.Link>
                <h1 className="text-primary mt-5">
                  Page not <span className="fw-bolder">found</span>
                </h1>
                <p className="lead my-4">
                  Oops! Looks like you followed a bad link. If you think this is a
                  problem with us, please tell us.
            </p>
                <Button variant="primary" className="animate-hover" onClick={() => toHome(access_token, user_role)}>
                  <FontAwesomeIcon icon={faChevronLeft} className="animate-left-3 me-3 ms-2" />
                  Go back home
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
