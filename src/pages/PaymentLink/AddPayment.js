import React, { useCallback, useEffect, useState } from "react";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import { Row, Col, Modal, Button } from "@themesberg/react-bootstrap";
import noteIconRed from "../../assets/icon/note_icon_red.svg";
import checklistCircle from "../../assets/img/icons/checklist_circle.svg";
import CopyIcon from "../../assets/icon/iconcopy_icon.svg";
import check from "../../assets/icon/checklistpayment_icon.svg";
import calendar from "../../assets/icon/calendar_icon.svg";
import $ from "jquery";
import { useHistory } from "react-router-dom";
import {
  BaseURL,
  convertTimeDigit,
  errorCatch,
  getRole,
  getToken,
  setUserSession,
  isNotEnableButton,
  language
} from "../../function/helpers";
import axios from "axios";
import encryptData from "../../function/encryptData";
import time from "../../assets/icon/time_icon.svg";
import Buttons from "../../components/Button";
import { useRef } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import CurrencyInput from "react-currency-input-field";
import { eng, ind } from "../../components/Language";

function AddPayment() {

  const [showModal, setShowModal] = useState(false);
  const [showModalBatal, setShowModalBatal] = useState(false);
  const [showModalFeeMethod, setShowModalFeeMethod] = useState(false);
  const [showModalExit, setShowModalExit] = useState(false)
  const [showAlert, setShowAlert] = useState(false);
  const [save, setSave] = useState(false);
  const history = useHistory();
  const access_token = getToken();
  const user_role = getRole()
  const [paymentType, setPaymentType] = useState([]);
  const [addPaylink, setAddPaylink] = useState({});
  const [choosenPaymentCode, setChoosenPaymentCode] = useState([]);
  const [choosenPaymentIcon, setChoosenPaymentIcon] = useState([])
  const [checked, setChecked] = useState("1");
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const date = new Date();
  const minutes = date.getMinutes();
  const minutesDefault = minutes + 5 >= 60 ? minutes + 5 - 60 : minutes + 5;
  const hour = date.getHours();
  const hourDefault = minutes + 5 >= 60 ? hour + 1 : hour;
  var nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  const [inputHourHandle, setInputHourHandle] = useState(hourDefault);
  const [inputMinuteHandle, setInputMinuteHandle] = useState(minutesDefault);
  const [dateDay, setDateDay] = useState({
    day: 0,
    month: 0,
    year: 0,
  });

  const [isNotCompleteData, setNotCompleteData] = useState({
    nominal: false,
    refId: false,
    minNominal: false
  });

  const [inputHandle, setInputHandle] = useState({
    nominal: "",
    refId: "",
    expDate: "",
    useLimit: 1,
    typePayment: 0,
    desc: "",
    paymentId:
      date.getFullYear().toString() +
      convertTimeDigit(date.getMonth() + 1).toString() +
      convertTimeDigit(date.getDate()).toString() +
      hour.toString() +
      minutes.toString() +
      date.getSeconds().toString() +
      date.getMilliseconds().toString(),
  });

  function handleSetDay() {
    if (
      inputHourHandle < hour ||
      (inputHourHandle == hour && inputMinuteHandle <= minutes)
    ) {
      setDateDay({
        day: nextDay.getDate(),
        month: nextDay.getMonth() + 1,
        year: nextDay.getFullYear(),
      });
    } else
      setDateDay({
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });
  }

  const handleOnChangeCheckBox = (e) => {
    setChecked(e.target.value);
    if (e.target.value === "2") {
      setShowModalFeeMethod(true)
      setChoosenPaymentCode([])
    } else {
      setChoosenPaymentIcon([])
      setChoosenPaymentCode([])
    }
  };

  const handleChoosenPaymentCode = useCallback(
    (e, payCode, payIcon, payName) => {
      if (e.target.checked) {
        setShowAlert(false);
        setChoosenPaymentCode((value) => [...value, payCode]);
        setChoosenPaymentIcon((item) => [...item, {payIcon, payName}])
      } else {
        setChoosenPaymentCode((value) => value.filter((it) => it !== payCode));
        setChoosenPaymentIcon((item) => item.filter((val) => val.payIcon !== payIcon))
      }
    },
    [setChoosenPaymentCode]
  );

  const stringChoosenPayCode =
    choosenPaymentCode.toString() == "" ? "0" : choosenPaymentCode.toString();

  function onSaveChoosenPayment() {
    stringChoosenPayCode != ""
      ? setShowModalFeeMethod(false)
      : setShowAlert(true);
  }

  const showCheckboxes = () => {
    if (!expanded) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  async function paymentTypeHandler() {
    try {
      const auth = "Bearer " + getToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const getPaymentType = await axios.post(BaseURL +
        "/PaymentLink/GetListPaymentType",
        { data: "" },
        { headers: headers }
      );
      // console.log(getPaymentType, "typepayment");
      if (
        getPaymentType.data.response_code === 200 &&
        getPaymentType.status === 200 &&
        getPaymentType.data.response_new_token.length === 0
      ) {
        setPaymentType(getPaymentType.data.response_data);
      } else if (
        getPaymentType.data.response_code === 200 &&
        getPaymentType.status === 200 &&
        getPaymentType.data.response_new_token.length !== 0
      ) {
        setUserSession(getPaymentType.data.response_new_token);
        setPaymentType(getPaymentType.data.response_data);
      }
    } catch (error) {
      // console.log(error);
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status));
    }
  }

  async function addPaylinkHandler(
    paymentId,
    refId,
    nominal,
    expDate,
    useLimit,
    stringChoosenPayCode,
    desc
  ) {
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(
        `{"tpaylink_code": "${paymentId}", "tpaylink_ref_id": "${refId}", "tpaylink_amount": ${nominal}, "tpaylink_exp_date": "${expDate}", "tpaylink_use_limit": ${useLimit}, "tpaylink_mpaytype_id": "${stringChoosenPayCode}", "tpaylink_desc": "${desc}"}`
      );
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const addPaymentLink = await axios.post(BaseURL +
        "/PaymentLink/PaymentLinkCreate",
        { data: dataParams },
        { headers: headers }
      );
      if (
        addPaymentLink.data.response_code === 200 &&
        addPaymentLink.status === 200 &&
        addPaymentLink.data.response_new_token.length === 0
      ) {
        setAddPaylink(addPaymentLink.data.response_data);
        setShowModal(true);
      } else if (
        addPaymentLink.data.response_code === 200 &&
        addPaymentLink.status === 200 &&
        addPaymentLink.data.response_new_token.length !== 0
      ) {
        setUserSession(addPaymentLink.data.response_new_token);
        setAddPaylink(addPaymentLink.data.response_data);
        setShowModal(true);
      }
    } catch (error) {
      // console.log(error);
      if (error.response.status === 400) {
        alert(error.response.data.response_message)
      }
      // RouteTo(errorCatch(error.response.status))
      history.push(errorCatch(error.response.status));
    }
  }

  function handleChange(e) {
    e.preventDefault();
    if (e.target.name === "useLimit") {
      if (e.target.value < 1 && e.target.value !== "") {
        e.target.value = 1
      }
    }
    setInputHandle({
      ...inputHandle,
      [e.target.name]: e.target.value,
    });
    setNotCompleteData({
      // nominal: false,
      refId: false
    });
  }

  function handleChangeNominal(e) {
    setInputHandle({
      ...inputHandle,
      nominal: e
    })
    setNotCompleteData({
      nominal: false,
    });
  }

  const goToTop = (amount) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    var a = date.getMinutes()
    var b = date.getHours()
    setNotCompleteData({
      nominal: inputHandle.nominal === null,
      refId: inputHandle.refId === "",
      minNominal: amount < 10000
    });
  };

  function toCancel() {
    setShowModalFeeMethod(false)
    setChecked("1")
    setChoosenPaymentIcon([])
    setChoosenPaymentCode([0])
  }

  useEffect(() => {
    if (!access_token) {
      history.push("/login");
    }
    paymentTypeHandler();
    handleSetDay();
  }, [inputHourHandle, inputMinuteHandle]);

  $("textarea").keyup(function () {
    var characterCount = $(this).val().length,
      current = $("#current");
    current.text(characterCount);
  });

  const onCopy = React.useCallback(() => {
    setCopied(true);
  }, [])

  const onClick = useCallback(({target: {innerText}}) => {
    // console.log(`Clicked on "${innerText}"!`);
    setSave(true)
  }, [])

  const closeModal = () => {
    setShowModal(false);
    setSave(false);
    window.location.reload();
  };

  function toLaporan() {
    history.push("/riwayat-transaksi/va-dan-paylink");
  }

  function toDashboard() {
    history.push("/");
  }

  function ModalEditHandler() {
    setShowModalExit(true)
  }

  function toListPay() {
    history.push("/listpayment");
  }

  // const dateNow =
  // console.log();

  return (
    <div
      className="main-content mt-5"
      style={{ padding: "37px 27px 37px 27px" }}
    >
      <span className="breadcrumbs-span">
        {user_role === "102" ?
          <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}>
            {language === null ? eng.laporan : language.laporan}
          </span> :
          <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}>
            Beranda
          </span>
        }{" "}
        &nbsp;
        <img alt="" src={breadcrumbsIcon} /> &nbsp;
        <span style={{ cursor: "pointer" }} onClick={() => ModalEditHandler()}>
          {language === null ? eng.paymentLink : language.paymentLink}
        </span>{" "}
        &nbsp;
        <img alt="" src={breadcrumbsIcon} /> &nbsp;{language === null ? eng.buatPaymentLink : language.buatPaymentLink}
      </span>
      <div className="head-title">
        <h2
          className="h4 my-4"
          style={{
            fontFamily: "Exo",
            fontWeight: 700,
            fontSize: 18,
            color: "#383838",
          }}
        >
          {language === null ? eng.buatPaymentLink : language.buatPaymentLink}
        </h2>
      </div>
      <div className="base-content-beranda">
        <Row>
          <Col xs={12}>
            <div className="my-1">
              {language === null ? eng.nominal : language.nominal} <span style={{ color: "red" }}>*</span>
            </div>
            <CurrencyInput
              className={
                (isNotCompleteData.nominal === true || isNotCompleteData.minNominal === true)
                  ? "form-control is-invalid"
                  : "input-text-user"
              }
              value={inputHandle.nominal === undefined ? 0 : inputHandle.nominal}
              onValueChange={(e) => handleChangeNominal(e)}
              placeholder={language === null ? eng.placeholderNominalTagihan : language.placeholderNominalTagihan}
              groupSeparator={"."}
              decimalSeparator={','}
              allowDecimals={false}
            />
            {/* <input
              type="number"
              name="nominal"
              min={10000}
              onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
              onChange={handleChange}
              className={
                (isNotCompleteData.nominal === true || isNotCompleteData.minNominal === true)
                  ? "form-control is-invalid"
                  : "input-text-user"
              }
              placeholder="Masukkan Nominal Tagihan"
              value={inputHandle.nominal}
              required
            /> */}
            {
              isNotCompleteData.minNominal &&
              <div className="my-1" style={{ fontSize: "12px", color: "#B9121B" }}>

              </div>
            }
            <div className="my-1" style={{ fontSize: "12px" }}>
              *{language === null ? eng.biayaAdminPaymentLink : language.biayaAdminPaymentLink}
            </div>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs={6}>
            <div className="my-1">{language === null ? eng.paymentId : language.paymentId}</div>
            <input
              name="paymentId"
              className="input-text-user"
              disabled
              value={inputHandle.paymentId}
            />
          </Col>
          <Col xs={6}>
            <div className="my-1">
              {language === null ? eng.idRef : language.idRef}<span style={{ color: "red" }}>*</span>
            </div>
            <input
              name="refId"
              className={
                isNotCompleteData.refId == true
                  ? "form-control is-invalid"
                  : "input-text-user"
              }
              placeholder={language === null ? eng.placeholderIdRef : language.placeholderIdRef}
              value={inputHandle.refId}
              onChange={handleChange}
            />
            <div className="my-1" style={{ fontSize: "12px" }}>
              {language === null ? eng.catatanIdRef : language.catatanIdRef}
            </div>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs={6}>
            <div>{language === null ? eng.tanggal : language.tanggal}</div>
            <div className="position-relative d-flex justify-content-between align-items-center ">
              <input
                className="input-text-user"
                disabled
                value={
                  convertTimeDigit(dateDay.day) +
                  "/" +
                  convertTimeDigit(dateDay.month) +
                  "/" +
                  dateDay.year
                }
              />
              <div
                className="position-absolute right-1"
                style={{ cursor: "unset" }}
              >
                <img src={calendar} alt="calendar" />
              </div>
            </div>
          </Col>
          <Col xs={6} className="position-relative">
            <div>
              {language === null ? eng.aturWaktu : language.aturWaktu}<span style={{ color: "red" }}>*</span>
            </div>
            <div className="position-relative d-flex justify-content-between align-items-center" onClick={showCheckboxes}>
              <input
                className={(isNotEnableButton(inputMinuteHandle, inputHourHandle, dateDay.day) === false) ? "input-text-user" : "form-control is-invalid" }
                placeholder="Silahkan atur waktu"
                value={
                  convertTimeDigit(inputHourHandle) +
                  ":" +
                  convertTimeDigit(inputMinuteHandle)
                }
              />
              {(isNotEnableButton(inputMinuteHandle, inputHourHandle, dateDay.day) === true) ? "" : <div
                  className="position-absolute right-1"
                  style={{ cursor: "pointer" }}
                >
                  <img src={time} alt="time" />
                </div>

              }
            </div>
            {expanded ? (
              <div
                className="right-2 border-black-0 border border-solid position-absolute bg-white mx-1 pt-4"
                style={{ borderRadius: 8, height: "10rem", width: "10rem" }}
                onBlur={() => setExpanded(!expanded)}
              >
                <Buttons
                  v1={inputHourHandle}
                  v2={inputMinuteHandle}
                  onSetHour={setInputHourHandle}
                  onSetMinute={setInputMinuteHandle}
                />
              </div>
            ) : ""}
            {/* <TimePicker
                hour={hour}
                minute={minute}
                period={period}
                setHour={setHour}
                setMinute={setMinute}
                setPeriod={setPeriod}
            /> */}

            {inputHourHandle == hour &&
            inputMinuteHandle > minutes &&
            inputMinuteHandle < minutes + 5 ? (
              <div style={{ color: "#B9121B", fontSize: 12 }}>
                <img src={noteIconRed} className="me-2" />
                {language === null ? eng.masaKadaluarsa : language.masaKadaluarsa}
              </div>
            ) : (
              <div className="my-1" style={{ fontSize: "12px" }}>
                {language === null ? eng.kadaluwarsa : language.kadaluwarsa} : {convertTimeDigit(dateDay.day)} -{" "}
                {convertTimeDigit(dateDay.month)} - {dateDay.year}{" "}
                {convertTimeDigit(inputHourHandle)}:
                {convertTimeDigit(inputMinuteHandle)}
              </div>
            )}
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs={12}>
            <div className="my-1">{language === null ? eng.batasPemakaian : language.batasPemakaian}</div>
            <input
              onChange={handleChange}
              name="useLimit"
              type="number"
              onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
              min={1}
              step={1}
              className="input-text-user"
              value={inputHandle.useLimit}
            />
            <div className="my-1" style={{ fontSize: "12px" }}>
              {language === null ? eng.catatanBatasPemakaian : language.catatanBatasPemakaian}
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs={12}>
            <div className="my-1">{language === null ? eng.metodePembayaran : language.metodePembayaran}</div>
            {paymentType.length !== 0 ?
              <div className="d-flex justify-content-start align-items-center">
                <div className="form-check me-2">
                  <input
                    onChange={handleOnChangeCheckBox}
                    value="1"
                    className="form-check-input"
                    type="radio"
                    name="typePayment"
                    id="typePayment"
                    checked={checked === "1" && true}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="typePayment"
                    style={{ fontWeight: 400, fontSize: "14px" }}
                  >
                    {language === null ? eng.semuaMetodePembayaran : language.semuaMetodePembayaran}
                  </label>
                </div>
                <div className="form-check ms-2">
                  <input
                    onChange={handleOnChangeCheckBox}
                    value="2"
                    className="form-check-input"
                    type="radio"
                    name="typePayment"
                    id="typePayment"
                    checked={checked === "2"}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="typePayment"
                    style={{ fontWeight: 400, fontSize: "14px" }}
                  >
                    {language === null ? eng.aturBeberapa : language.aturBeberapa}
                  </label>
                </div>
              </div> :
              <div style={{ color: "#B9121B", fontSize: 12 }}>
                <img src={noteIconRed} className="me-2" />
                {language === null ? eng.silahkanHubCs : language.silahkanHubCs}
              </div>
            }
            {/* <div className="d-flex flex-row justify-content-start align-items-center my-2"> */}
              {choosenPaymentIcon.length === 0 ?
                <div className="d-flex flex-row justify-content-start align-items-center my-2">
                  {paymentType.map((item, idx) => {
                    return (
                      <div key={idx} className="mx-2">
                        {item.mpaytype_icon !== "" ? (
                          <img
                            src={item.mpaytype_icon}
                            alt={item.mpaytype_name}
                            width={96}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}
                </div> :
                <div className="d-flex flex-row justify-content-start align-items-center my-2">
                  {choosenPaymentIcon.map((item, idx) => {
                    return (
                      <div key={idx} className="mx-2">
                        {item.payIcon !== "" ? (
                          <img
                            src={item.payIcon}
                            alt={item.payName}
                            width={96}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    )
                  })}
                </div>
              }
            {/* </div> */}
          </Col>
        </Row>
        <Row className="mt-3 mb-5">
          <Col xs={12}>
            <div className="my-1">{language === null ? eng.deskripsi : language.deskripsi}</div>
            <textarea
              name="desc"
              value={inputHandle.desc}
              onChange={handleChange}
              placeholder={language === null ? eng.placeholderDeskripsi : language.placeholderDeskripsi}
              className="input-text-area"
              style={{ padding: 10, fontSize: "14px" }}
              maxLength={150}
            />
            <div id="the-count" className="text-end">
              <span id="current">0</span>
              <span id="maximum"> / 150</span>
            </div>
          </Col>
        </Row>
      </div>
      <div
        className="mb-5 mt-3"
        style={{ display: "flex", justifyContent: "end" }}
      >
        <button
          onClick={() =>
            inputHandle.refId === "" || inputHandle.refId.length === 0 || inputHandle.nominal === null || inputHandle.nominal < 10000 || isNotEnableButton(inputMinuteHandle, inputHourHandle, dateDay.day)
              ? goToTop(inputHandle.nominal)
              : addPaylinkHandler(
                  inputHandle.paymentId,
                  inputHandle.refId,
                  parseInt(inputHandle.nominal),
                  (
                    dateDay.year +
                    "-" +
                    convertTimeDigit(dateDay.month) +
                    "-" +
                    convertTimeDigit(dateDay.day) +
                    " " +
                    convertTimeDigit(inputHourHandle) +
                    ":" +
                    convertTimeDigit(inputMinuteHandle)
                  ).toString(),
                  inputHandle.useLimit,
                  stringChoosenPayCode,
                  inputHandle.desc
                )
          }
          style={{
            fontFamily: "Exo",
            fontSize: 16,
            fontWeight: 900,
            alignItems: "center",
            padding: "12px 24px",
            gap: 8,
            width: 250,
            height: 45,
            background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
            border: "0.6px solid #2C1919",
            borderRadius: 6,
          }}
        >
          {language === null ? eng.buatPaymentLink : language.buatPaymentLink}
        </button>
      </div>
      <Modal
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
        style={{ borderRadius: 8 }}
      >
        <Modal.Body
          style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 24,
              marginBottom: 12,
            }}
          >
            <img src={checklistCircle} alt="logo" />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 12,
              padding: "0px 12px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "Exo",
                fontSize: 20,
                fontWeight: 700,
                marginBottom: "unset",
              }}
            >
              {language === null ? eng.selamatPaymentLinkBerhasilDibuat : language.selamatPaymentLinkBerhasilDibuat}
            </p>
          </div>
          <Row>
            <Col xs={12}>
              <div className="my-1">{language === null ? eng.paymentLink : language.paymentLink}</div>
              <input
                // id="copied"
                // ref={textAreaRef}
                className="input-text-user"
                placeholder="Masukkan Nominal Tagihan"
                value={addPaylink.payment_link}
                // onChange={copyHandler}
                disabled
              />
            </Col>
          </Row>
          {save ? (
            <div
              className="my-3"
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Button
                variant="primary"
                style={{
                  fontFamily: "Exo",
                  color: "#FFFFFF",
                  background: "#492E20",
                  maxHeight: 45,
                  width: 500,
                  height: "100%",
                }}
              >
                <span>
                  <img src={check} alt="copy" className="me-2" />
                </span>
                {language === null ? eng.linkTersalin : language.linkTersalin}
              </Button>
            </div>
          ) : (
            <div
              className="my-3"
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <CopyToClipboard onCopy={onCopy} text={addPaylink.payment_link}>
                <Button
                  onClick={onClick}
                  variant="primary"
                  style={{
                    fontFamily: "Exo",
                    color: "black",
                    background:
                      "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                    maxHeight: 45,
                    width: 500,
                    height: "100%",
                  }}
                >
                  <span>
                    <img src={CopyIcon} alt="copy" className="me-2" />
                  </span>
                  {language === null ? eng.salinLink : language.salinLink}
                </Button>
              </CopyToClipboard>
            </div>
          )}
          <div className="my-2" style={{ fontSize: 14, textAlign: "center" }}>
            {language === null ? eng.silahkanSalinLink : language.silahkanSalinLink}
          </div>
          <div
            className="my-3 mt-3"
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Button
              variant="primary"
              onClick={() => closeModal()}
              style={{
                fontFamily: "Exo",
                color: "#888888",
                background: "unset",
                maxWidth: 125,
                maxHeight: 45,
                width: "100%",
                height: "100%",
                border: "1px solid #EBEBEB",
              }}
            >
              {language === null ? eng.tutup : language.tutup}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        size="lg"
        centered
        show={showModalBatal}
        onHide={() => setShowModalBatal(false)}
        style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
      >
        <Modal.Body style={{ width: "100%", padding: "12px 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 24,
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontFamily: "Exo",
                fontSize: 20,
                fontWeight: 700,
                marginBottom: "unset",
              }}
              className="text-center"
            >
              {language === null ? eng.yakinInginKeluar : language.yakinInginKeluar}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 12,
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontFamily: "Nunito",
                fontSize: 14,
                fontWeight: 400,
                marginBottom: "unset",
              }}
              className="text-center"
            >
              {language === null ? eng.seluruhPerubahan : language.seluruhPerubahan}
            </p>
          </div>
          <div className="d-flex justify-content-center mb-3">
            <Button
              onClick={() => setShowModalBatal(false)}
              style={{
                fontFamily: "Exo",
                color: "#888888",
                background: "#FFFFFF",
                maxWidth: 125,
                maxHeight: 45,
                width: "100%",
                height: "100%",
                border: "1px solid #EBEBEB;",
                borderColor: "#EBEBEB",
              }}
              className="mx-2"
            >
              {language === null ? eng.tidak : language.tidak}
            </Button>
            <Button
              onClick={() => setShowModalBatal(false)}
              style={{
                fontFamily: "Exo",
                color: "black",
                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                maxWidth: 125,
                maxHeight: 45,
                width: "100%",
                height: "100%",
              }}
            >
                {language === null ? eng.keluar : language.keluar}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        size="lg"
        centered
        show={showModalFeeMethod}
        onHide={() => setShowModalFeeMethod(false)}
        style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
      >
        <Modal.Body style={{ width: "100%", padding: "12px 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 24,
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontFamily: "Exo",
                fontSize: 20,
                fontWeight: 700,
                marginBottom: "unset",
                color: "#393939",
              }}
              className="text-center"
            >
              {language === null ? eng.aturMetodePembayaran : language.aturMetodePembayaran}
            </p>
          </div>
          <div
            style={{ display: "flex", justifyContent: "start", marginTop: 20 }}
          >
            <p
              style={{
                fontFamily: "Exo",
                fontSize: 16,
                fontWeight: 700,
                marginBottom: "unset",
                color: "#393939",
              }}
              className="text-center"
            >
              {language === null ? eng.virtualAccount : language.virtualAccount}
            </p>
          </div>
          <div className="form-check ">
            {paymentType.map((item, idx) => {
              return (
                <div key={idx} className="my-2 align-items-center">
                  {item.mpaytype_icon !== "" ? (
                    <>
                      <input
                        key={idx}
                        className="form-check-input mt-4"
                        type="checkbox"
                        id="flexCheckDefault"
                        onChange={(e) =>
                          handleChoosenPaymentCode(e, item.mpaytype_id, item.mpaytype_icon, item.mpaytype_name)
                        }
                      />
                      <label
                        className="form-check-label ms-2"
                        for="flexCheckDefault"
                      >
                        <img
                          className="mt-2"
                          src={item.mpaytype_icon}
                          style={{ width: 120 }}
                        />
                      </label>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
          {showAlert
            ? true && (
                <div
                  style={{ color: "#B9121B", fontSize: 12 }}
                  className="mb-2"
                >
                  <img src={noteIconRed} className="me-2" />
                  {language === null ? eng.metodePembayaranHarusDipilih : language.metodePembayaranHarusDipilih}
                </div>
              )
            : ""}
          <div className="d-flex justify-content-center mb-3">
            <Button
              onClick={() => toCancel()}
              style={{
                fontFamily: "Exo",
                color: "#888888",
                background: "#FFFFFF",
                maxWidth: 125,
                maxHeight: 45,
                width: "100%",
                height: "100%",
                border: "1px solid #EBEBEB;",
                borderColor: "#EBEBEB",
              }}
              className="mx-2"
            >
              {language === null ? eng.batal : language.batal}
            </Button>
            <Button
              onClick={onSaveChoosenPayment}
              style={{
                fontFamily: "Exo",
                color: "black",
                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                maxWidth: 125,
                maxHeight: 45,
                width: "100%",
                height: "100%",
              }}
            >
              {language === null ? eng.simpan : language.simpan}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
          size="lg"
          centered
          show={showModalExit}
          onHide={() => setShowModalExit(false)}
          style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
      >
          <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                  <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }} className="text-center">{language === null ? eng.yakinInginKeluar : language.yakinInginKeluar}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                  <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }} className="text-center">{language === null ? eng.seluruhPerubahan : language.seluruhPerubahan}</p>
              </div>
              <p>

              </p>
              <div className="d-flex justify-content-center mb-3">
                  <Button onClick={() => setShowModalExit(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB" }} className="mx-2">{language === null ? eng.tidak : language.tidak}</Button>
                  <Button onClick={() => toListPay()} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>{language === null ? eng.ya : language.ya}</Button>
              </div>
          </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddPayment;
