import React, { useEffect, useState } from "react";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCog,
  faEye,
  faClone,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form, Image, OverlayTrigger, Tooltip } from "@themesberg/react-bootstrap";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import DataTable from "react-data-table-component";
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg";
import { useHistory } from "react-router-dom";
import { BaseURL, errorCatch, getRole, getToken, setUserSession, styleStatusPaylink } from "../../function/helpers";
import encryptData from "../../function/encryptData";
import axios from "axios";
import Pagination from "react-js-pagination";
import { pageVisits } from "../../data/tables";
import CopyToClipboard from "react-copy-to-clipboard";
import { useCallback } from "react";

function ListPayment() {
  const history = useHistory();
  const access_token = getToken();
  const user_role = getRole()
  const [listPaylink, setListPaylink] = useState([]);
  const [showDatePaylink, setShowDatePaylink] = useState("none");
  const [statePaylink, setStatePaylink] = useState(null);
  const [dateRangePaylink, setDateRangePaylink] = useState([]);
  const [activePagePaylink, setActivePagePaylink] = useState(1);
  const [pageNumberPaylink, setPageNumberPaylink] = useState({});
  const [totalPagePaylink, setTotalPagePaylink] = useState(0);
  const [pendingPaylink, setPendingPaylink] = useState(false);
  const [isFilterPaylink, setIsFilterPaylink] = useState(false);
  const [orderField, setOrderField] = useState("tpaylink_crtdt");
  const [orderId, setOrderId] = useState(0);
  const [isClick, setIsClick] = useState(false)
  const [inputHandle, setInputHandle] = useState({
    paymentId: "",
    refId: "",
    periodePaylink: 0,
    statusPaylink: "",
    rowPerPage: 10,
  });

  function hoverHandler(e) {
    e.target.style.background = "#3DB54A";
    e.target.style.color = "#FFFFFF"
  }

  function normalHandler(e) {
    e.target.style.background = "#EBF8EC";
    e.target.style.color = "#3DB54A"
  }

  function clickHandler(e, id) {
    e.target.style.background = "red";
    e.target.style.color = "black"
    setIsClick(true)
    detailPaymentHandler(id)
  }

  const [payment, setPayment] = useState({
    isDesc: false,
    id: 1,
  });
  const [dates, setDates] = useState({
    isDesc: false,
    id: 1,
  });
  const [status, setStatus] = useState({
    isDesc: false,
    id: 1,
  });

  const showPayment = () => {
    if (!payment.isDesc) {
      setPayment({ isDesc: true, id: 0 });
    } else {
      setPayment({ isDesc: false, id: 1 });
    }
  };

  const showDate = () => {
    if (!dates.isDesc) {
      setDates({ isDesc: true, id: 0 });
    } else {
      setDates({ isDesc: false, id: 1 });
    }
  };

  const showStatus = () => {
    if (!status.isDesc) {
      setStatus({ isDesc: true, id: 0 });
    } else {
      setStatus({ isDesc: false, id: 1 });
    }
  };

  function handleChange(e) {
    setInputHandle({
      ...inputHandle,
      [e.target.name]: e.target.value,
    });
  }

  function handleClickSort(orderId, orderField, isFilterPaylink) {
    if (orderField === "tpaylink_code" && isFilterPaylink === false) {
      setOrderField("tpaylink_code");
      showPayment();
      setOrderId(orderId);
      setActivePagePaylink(1)
      getListPaymentLink(1, inputHandle.rowPerPage, orderId, orderField);
    } else if (orderField === "tpaylink_code" && isFilterPaylink === true) {
      setOrderField("tpaylink_code");
      showPayment();
      setOrderId(orderId);
      setActivePagePaylink(1)
      filterPaymentLinkHandler(
        inputHandle.paymentId,
        inputHandle.refId,
        dateRangePaylink,
        inputHandle.periodePaylink,
        1,
        inputHandle.rowPerPage,
        orderId,
        orderField,
        inputHandle.statusPaylink
      );
    } else if (orderField === "tpaylink_crtdt" && isFilterPaylink === false) {
      setOrderField("tpaylink_code");
      showDate();
      setOrderId(orderId);
      setActivePagePaylink(1)
      getListPaymentLink(1, inputHandle.rowPerPage, orderId, orderField);
    } else if (orderField === "tpaylink_crtdt" && isFilterPaylink === true) {
      setOrderField("tpaylink_code");
      showDate();
      setOrderId(orderId);
      setActivePagePaylink(1)
      filterPaymentLinkHandler(
        inputHandle.paymentId,
        inputHandle.refId,
        dateRangePaylink,
        inputHandle.periodePaylink,
        1,
        inputHandle.rowPerPage,
        orderId,
        orderField,
        inputHandle.statusPaylink
      );
    } else if (orderField === "mstatus_name" && isFilterPaylink === false) {
      setOrderField("mstatus_name");
      showStatus();
      setOrderId(orderId);
      setActivePagePaylink(1)
      getListPaymentLink(1, inputHandle.rowPerPage, orderId, orderField);
    } else if (orderField === "mstatus_name" && isFilterPaylink === true) {
      setOrderField("mstatus_name");
      showStatus();
      setOrderId(orderId);
      setActivePagePaylink(1)
      filterPaymentLinkHandler(
        inputHandle.paymentId,
        inputHandle.refId,
        dateRangePaylink,
        inputHandle.periodePaylink,
        1,
        inputHandle.rowPerPage,
        orderId,
        orderField,
        inputHandle.statusPaylink
      );
    }
  }

  function handlePageChangePaylink(page) {
    if (isFilterPaylink) {
      setActivePagePaylink(page);
      filterPaymentLinkHandler(
        inputHandle.paymentId,
        inputHandle.refId,
        dateRangePaylink,
        inputHandle.periodePaylink,
        page,
        inputHandle.rowPerPage,
        orderId,
        orderField,
        inputHandle.statusPaylink
      );
    } else {
      setActivePagePaylink(page);
      getListPaymentLink(page, inputHandle.rowPerPage, orderId, orderField);
    }
  }

  function handleChangeEntries(e) {
    // console.log(e.target.name, "ini name");
    // console.log(e.target.value, "ini value");
    setInputHandle({
      ...inputHandle,
      [e.target.name]: e.target.value,
    });
    if (isFilterPaylink === true) {
      filterPaymentLinkHandler(
        inputHandle.paymentId,
        inputHandle.refId,
        dateRangePaylink,
        inputHandle.periodePaylink,
        1,
        e.target.value,
        orderId,
        orderField,
        inputHandle.statusPaylink
      );
    } else {
      getListPaymentLink(1, e.target.value, orderId, orderField);
    }
  }

  function pickDatePaylink(item) {
    setStatePaylink(item);
    if (item !== null) {
      item = item.map((el) => el.toLocaleDateString("en-CA"));
      setDateRangePaylink(item);
    }
  }

  function detailPaymentHandler(paymentId) {
    history.push(`/detailpayment/${paymentId}`);
  }

  async function getListPaymentLink(page, rowPerPage, orderId, orderField) {
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(
        `{"payment_code":"", "date_from": "", "date_to":"", "dateID": 1, "page": ${
          page !== 0 ? page : 1
        }, "row_per_page": ${
          rowPerPage !== 0 ? rowPerPage : 10
        }, "order_id": ${orderId}, "order_field": "${orderField}", "statusID": ["2,7,9,16,17,18"] }`
      );
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listPaylink = await axios.post(BaseURL +
        "/PaymentLink/PaymentListGetOrder",
        { data: dataParams },
        { headers: headers }
      );
      // console.log(listPaylink, "ini data list paylink");
      if (
        listPaylink.status === 200 &&
        listPaylink.data.response_code === 200 &&
        listPaylink.data.response_new_token.length === 0
      ) {
        setPageNumberPaylink(listPaylink.data.response_data);
        setTotalPagePaylink(listPaylink.data.response_data.max_page);
        setListPaylink(listPaylink.data.response_data.results);
        setPendingPaylink(false);
      } else if (
        listPaylink.status === 200 &&
        listPaylink.data.response_code === 200 &&
        listPaylink.data.response_new_token.length !== 0
      ) {
        setUserSession(listPaylink.data.response_new_token);
        setPageNumberPaylink(listPaylink.data.response_data);
        setTotalPagePaylink(listPaylink.data.response_data.max_page);
        setListPaylink(listPaylink.data.response_data.results);
        setPendingPaylink(false);
      }
    } catch (error) {
      // console.log(error);
      history.push(errorCatch(error.response.status));
    }
  }

  async function filterPaymentLinkHandler(
    paymentId,
    refId,
    periode,
    dateID,
    page,
    rowPerPage,
    orderId,
    orderField,
    statusId
  ) {
    try {
      setPendingPaylink(true);
      setIsFilterPaylink(true);
      setActivePagePaylink(page);
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(
        `{"payment_code":"${
          paymentId.length !== 0 ? paymentId : ""
        }", "ref_id": "${refId.length !== 0 ? refId : ""}", "date_from": "${
          periode.length !== 0 ? periode[0] : ""
        }", "date_to":"${
          periode.length !== 0 ? periode[1] : ""
        }", "dateID": ${dateID}, "page": ${
          page !== 0 ? page : 1
        }, "row_per_page": ${
          rowPerPage !== 0 ? rowPerPage : 10
        }, "order_id": ${orderId}, "order_field": "${orderField}", "statusID": [${
          statusId.length !== 0 ? statusId : ["2,7,9,16,17,18"]
        }] }`
      );
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const filterPaylink = await axios.post(BaseURL +
        "/PaymentLink/PaymentListGetOrder",
        { data: dataParams },
        { headers: headers }
      );
      // console.log(filterPaylink, "ini data list paylink filter");
      if (
        filterPaylink.status === 200 &&
        filterPaylink.data.response_code === 200 &&
        filterPaylink.data.response_new_token.length === 0
      ) {
        setPageNumberPaylink(filterPaylink.data.response_data);
        setTotalPagePaylink(filterPaylink.data.response_data.max_page);
        setListPaylink(filterPaylink.data.response_data.results);
        setPendingPaylink(false);
      } else if (
        filterPaylink.status === 200 &&
        filterPaylink.data.response_code === 200 &&
        filterPaylink.data.response_new_token.length !== 0
      ) {
        setUserSession(filterPaylink.data.response_new_token);
        setPageNumberPaylink(filterPaylink.data.response_data);
        setTotalPagePaylink(filterPaylink.data.response_data.max_page);
        setListPaylink(filterPaylink.data.response_data.results);
        setPendingPaylink(false);
      }
    } catch (error) {
      // console.log(error);
      history.push(errorCatch(error.response.status));
    }
  }

  // console.log(inputHandle.rowPerPage, "ini row per page");

  function resetButtonHandle(param) {
    if (param === "Reset Filter") {
      setInputHandle({
        ...inputHandle,
        paymentId: "",
        refId: "",
        periodePaylink: 0,
        statusPaylink: "",
      });
      setStatePaylink(null);
      setDateRangePaylink([]);
      setShowDatePaylink("none");
    }
  }

  function toAddPayment() {
    history.push("/addpayment");
  }

  function toCustomDesign() {
    history.push("/custom-design-payment");
  }

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#F2F2F2",
        border: "12px",
        fontWeight: "bold",
        fontSize: "16px",
        paddingRight: "none",
      },
    },
  };

  function handleChangePeriodePaylink(e) {
    if (e.target.value === "7") {
      setShowDatePaylink("");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    } else {
      setShowDatePaylink("none");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    }
  }

  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
      setCopied(true);
  }, [])

  const onClick = useCallback(({target: {innerText}}) => {
      // console.log(`Clicked on "${innerText}"!`);
      alert("Copied!")
  }, [])

  function toDashboard() {
    history.push("/");
  }

  function toLaporan() {
    history.push("/laporan");
  }

  function toListPay() {
    history.push("/listpayment");
  }

  const copyLink = async (url) => {
    var copyText = url;
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(copyText);
    } else {
      document.execCommand("copy", true, copyText);
    }
    alert("Text copied");
  };

  // const handleMouseEnter = () => {
  //   setIsHover(true);
  // };
 
  // const handleMouseLeave = () => {
  //   setIsHover(false);
  // };

  useEffect(() => {
    if (!access_token) {
      // RouteTo("/login")
      history.push("/login");
    }
    getListPaymentLink(
      activePagePaylink,
      inputHandle.rowPerPage,
      orderId,
      orderField
    );
  }, [access_token]);

  const CustomLoader = () => (
    <div style={{ padding: "24px" }}>
      <Image
        className="loader-element animate__animated animate__jackInTheBox"
        src={loadingEzeelink}
        height={80}
      />
      <div>Loading...</div>
    </div>
  );

  return (
    <div
      className="main-content mt-5"
      style={{ padding: "37px 27px 37px 27px" }}
    >
      <span className="breadcrumbs-span">
        {user_role === "102" ?
          <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}>
            Laporan
          </span> :
          <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}>
            Beranda
          </span>
        }{" "}
        &nbsp;
        <img alt="" src={breadcrumbsIcon} /> &nbsp;
        <span style={{ cursor: "pointer" }} onClick={() => toListPay()}>
          Payment Link
        </span>
      </span>
      <div className="head-title">
        <h2
          className="h4 mt-4 mb-5"
          style={{
            fontFamily: "Exo",
            fontWeight: 700,
            fontSize: 18,
            color: "#383838",
          }}
        >
          Payment Link
        </h2>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginTop: -88,
          paddingBottom: 24,
        }}
      >
        <button
          style={{
            fontFamily: "Exo",
            fontSize: 16,
            fontWeight: 700,
            alignItems: "center",
            padding: "12px 24px",
            gap: 8,
            width: 230,
            height: 48,
            background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
            border: "0.6px solid #2C1919",
            borderRadius: 6,
          }}
          onClick={() => toAddPayment()}
        >
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Buat
          Payment Link
        </button>
        <button
          className="mx-3 px-3"
          style={{
            fontFamily: "Exo",
            fontSize: 20,
            fontWeight: 700,
            alignItems: "center",
            border: "1px solid #077E86",
            gap: 8,
            borderRadius: 6,
          }}
          onClick={() => toCustomDesign()}
        >
          <FontAwesomeIcon icon={faCog} style={{ color: "#077E86" }} />
        </button>
      </div>
      <div className="base-content mt-3">
        <span className="font-weight-bold mb-4" style={{ fontWeight: 700, fontFamily: "Exo", fontSize: 16 }}>
          Filter
        </span>
        <Row className="mt-4">
          <Col
            xs={4}
            className="d-flex justify-content-start align-items-center"
          >
            <div>Payment ID</div>
            <input
              onChange={(e) => handleChange(e)}
              value={inputHandle.paymentId}
              name="paymentId"
              type="text"
              className="input-text-edit"
              placeholder="Masukkan Payment ID"
            />
          </Col>
          <Col
            xs={4}
            className="d-flex justify-content-start align-items-center"
          >
            <div>ID Referensi</div>
            <input
              onChange={(e) => handleChange(e)}
              value={inputHandle.refId}
              name="refId"
              type="text"
              className="input-text-edit"
              placeholder="Masukkan ID Referensi"
            />
          </Col>
          <Col
            xs={4}
            className="d-flex justify-content-start align-items-center"
          >
            <div>Tanggal pembuatan</div>
            <Form.Select
              name="periodePaylink"
              className="input-text-ez"
              value={inputHandle.periodePaylink}
              onChange={(e) => handleChangePeriodePaylink(e)}
            >
              {inputHandle.periodePaylink === 0 && <option value={0}>Pilih Periode</option>}
              <option value={2}>Hari Ini</option>
              <option value={3}>Kemarin</option>
              <option value={4}>7 Hari Terakhir</option>
              <option value={5}>Bulan Ini</option>
              <option value={6}>Bulan Kemarin</option>
              <option value={7}>Pilih Range Tanggal</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={4}>
            <span>Status</span>
            <Form.Select
              name="statusPaylink"
              value={inputHandle.statusPaylink}
              onChange={(e) => handleChange(e)}
              className="input-text-ez ms-5"
              style={{ display: "inline" }}
            >
              {inputHandle.statusPaylink === "" && <option value={""}>Pilih Status</option>}
              <option value={"17"}>Active</option>
              <option value={"2"}>Success</option>
              <option value={"18"}>Settled</option>
              <option value={"16"}>Closed</option>
              <option value={"7"}>Waiting For Payment</option>
              <option value={"9"}>Expired</option>
            </Form.Select>
          </Col>
          <Col xs={4}></Col>
          <Col xs={4}>
            <span></span>
            <div className="ms-5 ps-2" style={{ display: showDatePaylink }}>
              <DateRangePicker
                onChange={pickDatePaylink}
                value={statePaylink}
                className="ms-5"
                clearIcon={null}
              />
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={5}>
            <Row>
              <Col xs={6} style={{ width: "unset" }}>
                <button
                  onClick={() =>
                    filterPaymentLinkHandler(
                      inputHandle.paymentId,
                      inputHandle.refId,
                      dateRangePaylink,
                      inputHandle.periodePaylink,
                      1,
                      inputHandle.rowPerPage,
                      orderId,
                      orderField,
                      inputHandle.statusPaylink
                    )
                  }
                  className={
                    inputHandle.periodePaylink ||
                    dateRangePaylink.length !== 0 ||
                    (dateRangePaylink.length !== 0 &&
                      inputHandle.paymentId.length !== 0) ||
                    (dateRangePaylink.length !== 0 &&
                      inputHandle.statusPaylink.length !== 0) ||
                    (dateRangePaylink.length !== 0 &&
                      inputHandle.refId.length !== 0)
                      ? "btn-ez-on"
                      : "btn-ez"
                  }
                  disabled={
                    inputHandle.periodePaylink === 0 ||
                    (inputHandle.periodePaylink === 0 &&
                      inputHandle.paymentId.length === 0) ||
                    (inputHandle.periodePaylink === 0 &&
                      inputHandle.statusPaylink.length === 0) ||
                    (inputHandle.periodePaylink === 0 &&
                      inputHandle.refId.length === 0)
                  }
                >
                  Terapkan
                </button>
              </Col>
              <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                <button
                  onClick={() => resetButtonHandle("Reset Filter")}
                  className={
                    inputHandle.periodePaylink ||
                    dateRangePaylink.length !== 0 ||
                    (dateRangePaylink.length !== 0 &&
                      inputHandle.paymentId.length !== 0) ||
                    (dateRangePaylink.length !== 0 &&
                      inputHandle.statusPaylink.length !== 0) ||
                    (dateRangePaylink.length !== 0 &&
                      inputHandle.refId.length !== 0)
                      ? "btn-reset"
                      : "btn-ez"
                  }
                  disabled={
                    inputHandle.periodePaylink === 0 ||
                    (inputHandle.periodePaylink === 0 &&
                      inputHandle.paymentId.length === 0) ||
                    (inputHandle.periodePaylink === 0 &&
                      inputHandle.statusPaylink.length === 0) ||
                    (inputHandle.periodePaylink === 0 &&
                      inputHandle.refId.length === 0)
                  }
                >
                  Atur Ulang
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="d-flex justify-content-start align-items-center mt-3">
          <div>Show</div>
          <Form.Select
            className="ms-3"
            style={{ display: "inline", width: "8.5%" }}
            value={inputHandle.rowPerPage}
            onChange={(e) => handleChangeEntries(e)}
            name="rowPerPage"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
          </Form.Select>
          <div className="ms-3">entries</div>
        </div>
        <div
          className="div-table"
          style={{
            paddingBottom: 20,
            marginBottom: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <table
            className="table table-bordered mt-3"
            id="tableInvoice"
            style={{ width: "100%" }}
            hover
          >
            <thead>
              <tr>
                {!payment.isDesc ? (
                  <th
                    onClick={() =>
                      handleClickSort(
                        payment.id,
                        "tpaylink_code",
                        isFilterPaylink
                      )
                    }
                    style={{ width: 155, background: "#F3F4F5", cursor: "pointer" }}
                    className="align-items-center"
                  >
                    Payment ID
                    <span>
                      <FontAwesomeIcon
                        icon={faSortUp}
                        size="lg"
                        className="ms-2"
                      />
                    </span>
                  </th>
                ) : (
                  <th
                    onClick={() =>
                      handleClickSort(
                        payment.id,
                        "tpaylink_code",
                        isFilterPaylink
                      )
                    }
                    style={{ width: 155, background: "#F3F4F5", cursor: "pointer" }}
                    className="align-items-center"
                  >
                    Payment ID
                    <span>
                      <FontAwesomeIcon
                        icon={faSortDown}
                        size="lg"
                        className="ms-2"
                      />
                    </span>
                  </th>
                )}
                <th style={{ background: "#F3F4F5" }}>ID Referensi</th>
                {!dates.isDesc ? (
                  <th
                    onClick={() =>
                      handleClickSort(
                        dates.id,
                        "tpaylink_crtdt",
                        isFilterPaylink
                      )
                    }
                    style={{ background: "#F3F4F5", cursor: "pointer" }}
                  >
                    Tanggal Pembuatan
                    <span>
                      <FontAwesomeIcon
                        icon={faSortUp}
                        size="lg"
                        className="ms-2"
                      />
                    </span>
                  </th>
                ) : (
                  <th
                    onClick={() =>
                      handleClickSort(
                        dates.id,
                        "tpaylink_crtdt",
                        isFilterPaylink
                      )
                    }
                    style={{ background: "#F3F4F5", cursor: "pointer" }}
                  >
                    Tanggal Pembuatan
                    <span>
                      <FontAwesomeIcon
                        icon={faSortDown}
                        size="lg"
                        className="ms-2"
                      />
                    </span>
                  </th>
                )}
                {!status.isDesc ? (
                  <th
                    onClick={() =>
                      handleClickSort(
                        status.id,
                        "mstatus_name",
                        isFilterPaylink
                      )
                    }
                    style={{ background: "#F3F4F5", cursor: "pointer" }}
                  >
                    Status
                    <span>
                      <FontAwesomeIcon
                        icon={faSortUp}
                        size="lg"
                        className="ms-2"
                      />
                    </span>
                  </th>
                ) : (
                  <th
                    onClick={() =>
                      handleClickSort(
                        status.id,
                        "mstatus_name",
                        isFilterPaylink
                      )
                    }
                    style={{ background: "#F3F4F5", cursor: "pointer" }}
                  >
                    Status
                    <span>
                      <FontAwesomeIcon
                        icon={faSortDown}
                        size="lg"
                        className="ms-2"
                      />
                    </span>
                  </th>
                )}
                <th style={{ background: "#F3F4F5" }}>Aksi</th>
              </tr>
            </thead>
            {!pendingPaylink ? (
              <tbody className="table-group-divider">
                {listPaylink !== 0 &&
                  listPaylink.map((item) => {
                    return (
                      <tr>
                        <td style={{ paddingLeft: 18, width: 155 }}>
                          {item.tpaylink_code}
                        </td>
                        <td style={{ paddingLeft: 18, width: 155 }}>
                          {item.tpaylink_ref_id}
                        </td>
                        <td style={{ paddingLeft: 16, width: 155 }}>
                          {item.tpaylink_crtdt.slice(0, 10).replace(/-/g, "/") +
                            ", " +
                            item.tpaylink_crtdt.slice(11, 16)}
                        </td>
                        <td
                          style={{
                            background:
                              (item.tvatrans_status_id === 2 &&
                                "rgba(7, 126, 134, 0.08)") ||
                              (item.tvatrans_status_id === 1 && "#EBF8EC") ||
                              (item.tvatrans_status_id === 7 &&
                                "rgba(247, 148, 33, 0.08)") ||
                              ((item.tvatrans_status_id === 9 ||
                                item.tvatrans_status_id === 16) &&
                                "rgba(185, 18, 27, 0.08)") ||
                              (item.tvatrans_status_id === 17 && isClick ? "red" : "#EBF8EC" ) ||
                              (item.tvatrans_status_id === 18 && "#F0F0F0"),
                            color:
                              (item.tvatrans_status_id === 2 && "#077E86") ||
                              (item.tvatrans_status_id === 1 && "#3DB54A") ||
                              (item.tvatrans_status_id === 7 && "#F79421") ||
                              ((item.tvatrans_status_id === 9 ||
                                item.tvatrans_status_id === 16) &&
                                "#B9121B") ||
                              (item.tvatrans_status_id === 17 && "#3DB54A") ||
                              (item.tvatrans_status_id === 18 && "#888888"),
                            textDecoration: (item.tvatrans_status_id === 17 ? "underline" : "unset" ),
                            cursor: (item.tvatrans_status_id === 17 ? "pointer" : "unset"),
                            margin: 6,
                            padding: "6px 0px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItem: "center",
                            borderRadius: 4,
                          }}
                          onMouseEnter={item.tvatrans_status_id === 17 ? hoverHandler : null}
                          onMouseLeave={item.tvatrans_status_id === 17 ? normalHandler : null}
                          className="ms-2"
                          onClick={(e) => item.mstatus_name === "Active" ? clickHandler(e, item.tpaylink_id) : "" }
                        >
                          {item.mstatus_name}
                        </td>
                        <td>
                          <div className=" ms-2 d-flex justify-content-start align-items-center">
                            <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Lihat Detail</div></Tooltip>}>
                              <FontAwesomeIcon
                                icon={faEye}
                                onClick={() =>
                                  detailPaymentHandler(item.tpaylink_id)
                                }
                                className="me-2"
                                style={{ cursor: "pointer" }}
                              />
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Salin Link</div></Tooltip>}>
                              <CopyToClipboard onCopy={onCopy} text={item.tpaylink_url}>
                                <FontAwesomeIcon
                                  icon={faClone}
                                  className="mx-2"
                                  onClick={onClick}
                                  style={{
                                    cursor: "pointer",
                                    display:
                                      item.tvatrans_status_id === 17 ? "" : "none",
                                  }}
                                />
                              </CopyToClipboard>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            ) : (
              <tbody>
                <CustomLoader />
              </tbody>
            )}
          </table>
        </div>
        {/* <div className="div-table mt-4 pb-4">
          <DataTable
            columns={columnPayment}
            data={listPaylink}
            customStyles={customStyles}
            sortFunction={(rows, selector, direction) =>
              sortHandle(
                rows,
                selector,
                direction,
                inputHandle.paymentId,
                inputHandle.refId,
                dateRangePaylink,
                inputHandle.periodePaylink,
                inputHandle.statusPaylink
              )
            }
            progressPending={pendingPaylink}
            progressComponent={<CustomLoader />}
            dense
          />
        </div> */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: -15,
            paddingTop: 12,
            borderTop: "groove",
          }}
        >
          <div style={{ marginRight: 10, marginTop: 10 }}>
            Total Page: {totalPagePaylink}
          </div>
          <Pagination
            activePage={activePagePaylink}
            itemsCountPerPage={pageNumberPaylink.row_per_page}
            totalItemsCount={
              pageNumberPaylink.row_per_page * pageNumberPaylink.max_page
            }
            pageRangeDisplayed={5}
            itemClass="page-item"
            linkClass="page-link"
            onChange={handlePageChangePaylink}
          />
        </div>
      </div>
    </div>
  );
}

export default ListPayment;
