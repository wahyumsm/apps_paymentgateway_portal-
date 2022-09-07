import React, { useEffect, useState } from "react";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCog,
  faEye,
  faClone,
} from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form, Image } from "@themesberg/react-bootstrap";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import DataTable from "react-data-table-component";
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg";
import { useHistory } from "react-router-dom";
import { errorCatch, getToken, setUserSession } from "../../function/helpers";
import encryptData from "../../function/encryptData";
import axios from "axios";
import Pagination from "react-js-pagination";
import { pageVisits } from "../../data/tables";

function ListPayment() {
  const history = useHistory();
  const access_token = getToken();
  const [listPaylink, setListPaylink] = useState({});
  const [showDatePaylink, setShowDatePaylink] = useState("none");
  const [statePaylink, setStatePaylink] = useState(null);
  const [dateRangePaylink, setDateRangePaylink] = useState([]);
  const [activePagePaylink, setActivePagePaylink] = useState(1);
  const [pageNumberPaylink, setPageNumberPaylink] = useState({});
  const [totalPagePaylink, setTotalPagePaylink] = useState(0);
  const [pendingPaylink, setPendingPaylink] = useState(false);
  const [isFilterPaylink, setIsFilterPaylink] = useState(false);
  const [inputHandle, setInputHandle] = useState({
    paymentId: "",
    refId: "",
    periodePaylink: 0,
    statusPaylink: "",
    rowPerPage: 10
  });

  function handleChange(e) {
    setInputHandle({
      ...inputHandle,
      [e.target.name]: e.target.value,
    });
  }

  function handlePageChangePaylink(page) {
    // console.log(page, 'ini di handle change page');
    if (isFilterPaylink) {
      setActivePagePaylink(page);
      filterPaymentLinkHandler(
        inputHandle.paymentId,
        inputHandle.refId,
        dateRangePaylink,
        inputHandle.periodePaylink,
        1,
        inputHandle.rowPerPage,
        0,
        "",
        inputHandle.statusPaylink
      );
    } else {
      setActivePagePaylink(page);
      getListPaymentLink(page, inputHandle.rowPerPage);
    }
  }

  function handleChangeEntries(e) {
    console.log(e.target.name, "ini name");
    console.log(e.target.value, "ini value");
    setInputHandle({
      ...inputHandle,
      [e.target.name]: e.target.value,
    });
    if (isFilterPaylink) {
      filterPaymentLinkHandler(
        inputHandle.paymentId,
        inputHandle.refId,
        dateRangePaylink,
        inputHandle.periodePaylink,
        1,
        e.target.value,
        0,
        "",
        inputHandle.statusPaylink
      );
    } else {
      getListPaymentLink(1, e.target.value);
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

  function sortHandle(
    rows,
    selector,
    direction,
    paymentId,
    refId,
    dateRangePaylink,
    periodePaylink,
    statusPaylink
  ) {
    console.log(rows, "ini rows");
    console.log(direction, "ini direction");
    console.log(String(selector).slice(11), "ini selector");
    // async function sorted(
    //   selector,
    //   direction,
    //   paymentId,
    //   refId,
    //   dateRangePaylink,
    //   periodePaylink,
    //   statusPaylink
    // ) {
      
    // }
    // sorted(
    //   selector,
    //   direction,
    //   paymentId,
    //   refId,
    //   dateRangePaylink,
    //   periodePaylink,
    //   statusPaylink
    // );
    return rows.sort(async (a, b) => {
      console.log(selector(a), "ini a");
      console.log(selector(b), "ini b");
      console.log(inputHandle.paymentId, ";ini payment id");
      try {
        const auth = "Bearer " + getToken();
        const dataParams = encryptData(
          `{"payment_code":"${
            paymentId.length !== 0 ? paymentId : ""
          }", "ref_id": "${refId.length !== 0 ? refId : ""}", "date_from": "${
            dateRangePaylink.length !== 0 ? dateRangePaylink[0] : ""
          }", "date_to":"${
            dateRangePaylink.length !== 0 ? dateRangePaylink[1] : ""
          }", "dateID": ${periodePaylink}, "page": ${1}, "row_per_page": 10, "order_id": ${
            direction === "desc" ? 0 : 1
          }, "order_field": "${String(selector).slice(11)}", "statusID": [${
            statusPaylink.length !== 0 ? statusPaylink : ["2,7,9,16,17,18"]
          }] }`
        );
        const headers = {
          "Content-Type": "application/json",
          Authorization: auth,
        };
        console.log(dataParams);
        const sortedData = await axios.post(
          "/PaymentLink/PayametListGetOrder",
          { data: dataParams },
          { headers: headers }
        );
        console.log(sortedData, "ini sorted data");
        if (
          sortedData.status === 200 &&
          sortedData.data.response_code === 200 &&
          sortedData.data.response_new_token.length === 0
        ) {
          // setPageNumberPaylink(sortedData.data.response_data);
          // setTotalPagePaylink(sortedData.data.response_data.max_page);
          // setListPaylink(sortedData.data.response_data.results);
          // return;
          // setPending(false)
        } else if (
          sortedData.status === 200 &&
          sortedData.data.response_code === 200 &&
          sortedData.data.response_new_token.length !== 0
        ) {
          // setUserSession(sortedData.data.response_new_token);
          // setPageNumberPaylink(sortedData.data.response_data);
          // setTotalPagePaylink(sortedData.data.response_data.max_page);
          // setListPaylink(sortedData.data.response_data.results);
          // return;
          // setPending(false)
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  const columnPayment = [
    {
      name: "Payment ID",
      selector: (row) => row.tpaylink_code,
      sortable: true,
    },
    {
      name: "ID Referensi",
      selector: (row) => row.tpaylink_ref_id,
    },
    {
      name: "Tanggal Pembuatan",
      selector: (row) => row.tpaylink_crtdt,
      cell: (row) => (
        <div>
          {row.tpaylink_crtdt.slice(0, 10).replace(/-/g, "/") +
            ", " +
            row.tpaylink_crtdt.slice(11, 16)}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.mstatus_name,
      sortable: true,
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItem: "center",
        padding: "6px 0px",
        margin: "6px",
        width: "100%",
        borderRadius: 4,
      },
      conditionalCellStyles: [
        {
          when: (row) => row.tvatrans_status_id === 2,
          style: {
            background: "rgba(7, 126, 134, 0.08)",
            color: "#077E86",
            paddingLeft: "unset",
          },
        },
        {
          when: (row) =>
            row.tvatrans_status_id === 7 || row.tvatrans_status_id === 16,
          style: {
            background: "rgba(185, 18, 27, 0.08)",
            color: "#B9121B",
            paddingLeft: "unset",
          },
        },
        {
          when: (row) => row.tvatrans_status_id === 17,
          style: {
            background: "#EBF8EC",
            color: "#3DB54A",
            paddingLeft: "unset",
          },
        },
        {
          when: (row) => row.tvatrans_status_id === 18,
          style: {
            background: "#F0F0F0",
            color: "#888888;",
            paddingLeft: "unset",
          },
        },
      ],
    },
    {
      name: "Aksi",
      selector: (row) => (
        <div className="d-flex justify-content-center align-items-center">
          <FontAwesomeIcon
            icon={faEye}
            onClick={() => detailPaymentHandler(row.tpaylink_id)}
            className="me-2"
            style={{ cursor: "pointer" }}
          />
          <FontAwesomeIcon
            icon={faClone}
            className="mx-2"
            style={{
              cursor: "pointer",
              display: row.tvatrans_status_id === 17 ? "" : "none",
            }}
          />
        </div>
      ),
    },
  ];

  const columnDummy = [
    {
      name: "Payment ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "ID Referensi",
      selector: (row) => row.views,
    },
    {
      name: "Tanggal Pembuatan",
      selector: (row) => row.returnValue,
      // cell: (row) => (
      //   <div>
      //     {row.tpaylink_crtdt.slice(0, 10).replace(/-/g, "/") +
      //       ", " +
      //       row.tpaylink_crtdt.slice(11, 16)}
      //   </div>
      // ),
      // sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.bounceRate,
      // sortable: true,
      // style: {
      //   display: "flex",
      //   flexDirection: "row",
      //   justifyContent: "center",
      //   alignItem: "center",
      //   padding: "6px 0px",
      //   margin: "6px",
      //   width: "100%",
      //   borderRadius: 4,
      // },
      // conditionalCellStyles: [
      //   {
      //     when: (row) => row.tvatrans_status_id === 2,
      //     style: {
      //       background: "rgba(7, 126, 134, 0.08)",
      //       color: "#077E86",
      //       paddingLeft: "unset",
      //     },
      //   },
      //   {
      //     when: (row) =>
      //       row.tvatrans_status_id === 7 || row.tvatrans_status_id === 16,
      //     style: {
      //       background: "rgba(185, 18, 27, 0.08)",
      //       color: "#B9121B",
      //       paddingLeft: "unset",
      //     },
      //   },
      //   {
      //     when: (row) => row.tvatrans_status_id === 17,
      //     style: {
      //       background: "#EBF8EC",
      //       color: "#3DB54A",
      //       paddingLeft: "unset",
      //     },
      //   },
      //   {
      //     when: (row) => row.tvatrans_status_id === 18,
      //     style: {
      //       background: "#F0F0F0",
      //       color: "#888888;",
      //       paddingLeft: "unset",
      //     },
      //   },
      // ],
    },
    {
      name: "Aksi",
      selector: (row) => row.pageName
      // selector: (row) => (
      //   <div className="d-flex justify-content-center align-items-center">
      //     <FontAwesomeIcon
      //       icon={faEye}
      //       onClick={() => detailPaymentHandler(row.tpaylink_id)}
      //       className="me-2"
      //       style={{ cursor: "pointer" }}
      //     />
      //     <FontAwesomeIcon
      //       icon={faClone}
      //       className="mx-2"
      //       style={{
      //         cursor: "pointer",
      //         display: row.tvatrans_status_id === 17 ? "" : "none",
      //       }}
      //     />
      //   </div>
      // ),
    },
  ];

  async function getListPaymentLink(page, rowPerPage) {
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(
        `{"payment_code":"", "date_from": "", "date_to":"", "dateID": 1, "page": ${
          page !== 0 ? page : 1
        }, "row_per_page": ${rowPerPage !== 0 ? rowPerPage : 10}, "order_id": 0, "order_field": "mstatus_name", "statusID": ["2,7,9,16,17,18"] }`
      );
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listPaylink = await axios.post(
        "/PaymentLink/PayametListGetOrder",
        { data: dataParams },
        { headers: headers }
      );
      console.log(listPaylink, "ini data list paylink");
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
      console.log(error);
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
      const filterPaylink = await axios.post(
        "/PaymentLink/PayametListGetOrder",
        { data: dataParams },
        { headers: headers }
      );
      console.log(filterPaylink, "ini data list paylink filter");
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
      console.log(error);
      history.push(errorCatch(error.response.status));
    }
  }

  console.log(inputHandle.rowPerPage, "ini row per page");

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

  function toDashboard() {
    history.push("/");
  }

  function toListPay() {
    history.push("/listpayment");
  }

  useEffect(() => {
    if (!access_token) {
      // RouteTo("/login")
      history.push("/login");
    }
    getListPaymentLink(activePagePaylink, inputHandle.rowPerPage);
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
        <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}>
          Beranda
        </span>{" "}
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
        <span className="font-weight-bold mb-4" style={{ fontWeight: 600 }}>
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
              className="input-text-ez"
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
              className="input-text-ez"
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
              <option defaultValue>Pilih Periode</option>
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
              <option defaultValue>Pilih Status</option>
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
          <Col xs={3}>
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
                      0,
                      "",
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
            style={{ display: "inline", width: "7%" }}
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
        <div className="div-table mt-4 pb-4">
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
        </div>
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
