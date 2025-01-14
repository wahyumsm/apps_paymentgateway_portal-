import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "@themesberg/react-bootstrap";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ReactSelect, { components } from "react-select";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import encryptData from "../../function/encryptData";
import * as XLSX from "xlsx";
import {
  BaseURL,
  convertToRupiah,
  errorCatch,
  getRole,
  getToken,
  language,
  setUserSession,
  CustomLoader,
} from "../../function/helpers";
import DataTable, { defaultThemes } from "react-data-table-component";
import Pagination from "react-js-pagination";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import { eng, ind } from "../../components/Language";

const VaDanPaymentLink = () => {
  const history = useHistory();
  const access_token = getToken();
  const user_role = getRole();
  const [partnerId, setPartnerId] = useState("");
  const [pendingTransfer, setPendingTransfer] = useState(true);
  const [pageNumberDanaMasuk, setPageNumberDanaMasuk] = useState({});
  const [totalPageDanaMasuk, setTotalPageDanaMasuk] = useState(0);
  const [listTransferDana, setListTransferDana] = useState([]);
  const [listAgen, setListAgen] = useState([]);
  const [listBank, setListBank] = useState([]);
  const [showDateDanaMasuk, setShowDateDanaMasuk] = useState("none");
  const [dateRangeDanaMasuk, setDateRangeDanaMasuk] = useState([]);
  const [stateDanaMasuk, setStateDanaMasuk] = useState(null);
  const [activePageDanaMasuk, setActivePageDanaMasuk] = useState(1);
  const [isFilterDanaMasuk, setIsFilterDanaMasuk] = useState(false);
  const [selectedAgenDanaMasuk, setSelectedAgenDanaMasuk] = useState([]);
  const [selectedBankDanaMasuk, setSelectedBankDanaMasuk] = useState([]);

  const [dataListPartner, setDataListPartner] = useState([]);
  const [dataListAgenFromPartner, setDataListAgenFromPartner] = useState([]);
  const [dataRiwayatDanaMasukAdmin, setDataRiwayatDanaMasukAdmin] = useState(
    []
  );
  const [pageNumberDanaMasukAdmin, setPageNumberDanaMasukAdmin] = useState({});
  const [totalPageDanaMasukAdmin, setTotalPageDanaMasukAdmin] = useState(0);
  const [activePageDanaMasukAdmin, setActivePageDanaMasukAdmin] = useState(1);
  const [showDateDanaMasukAdmin, setShowDateDanaMasukAdmin] = useState("none");
  const [isFilterDanaMasukAdmin, setIsFilterDanaMasukAdmin] = useState(false);
  const [stateDanaMasukAdmin, setStateDanaMasukAdmin] = useState(null);
  const [dateRangeDanaMasukAdmin, setDateRangeDanaMasukAdmin] = useState([]);
  const [pendingTransferAdmin, setPendingTransferAdmin] = useState(true);
  const [selectedPartnerDanaMasukAdmin, setSelectedPartnerDanaMasukAdmin] =
    useState([]);
  const [selectedAgenDanaMasukAdmin, setSelectedAgenDanaMasukAdmin] = useState(
    []
  );
  const [selectedBankDanaMasukAdmin, setSelectedBankDanaMasukAdmin] = useState(
    []
  );
  const [detailTransferDanaAdmin, setDetailTransferDanaAdmin] = useState({});
  const [
    showModalDetailTransferDanaAdmin,
    setShowModalDetailTransferDanaAdmin,
  ] = useState(false);

  const [inputHandle, setInputHandle] = useState({
    idTransaksiDanaMasuk: "",
    partnerTransIdDanaMasuk: "",
    statusDanaMasuk: [],
    fiturDanaMasuk: 0,
    periodeDanaMasuk: 0,
    tipePeriode: 0,
  });

  const [inputHandleAdmin, setInputHandleAdmin] = useState({
    idTransaksiDanaMasukAdmin: "",
    partnerTransIdDanaMasukAdmin: "",
    statusDanaMasukAdmin: [],
    fiturDanaMasukAdmin: 0,
    periodeDanaMasukAdmin: 0,
    tipePeriodeAdmin: 0,
  });

  const columnstransferDana = [
    {
      name: language === null ? eng.no : language.no,
      selector: (row) => row.number,
      wrap: true,
      width: "67px",
    },
    {
      name: language === null ? eng.idTransaksi : language.idTransaksi,
      selector: (row) => row.id,
      // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.id)}>{row.id}</Link>
    },
    {
      name: language === null ? eng.waktuTransaksi : language.waktuTransaksi,
      selector: (row) => row.created_at,
      width: "180px",
    },
    {
      name: language === null ? eng.waktuPembayaran : language.waktuPembayaran,
      selector: (row) =>
        row.tvatrans_process_date_format !== null
          ? row.tvatrans_process_date_format
          : "-",
      width: "180px",
    },
    {
      name: language === null ? eng.partnerTransId : language.partnerTransId,
      selector: (row) => row.partner_trx_id,
      wrap: true,
      width: "160px",
    },
    {
      name: language === null ? eng.namaAgen : language.namaAgen,
      selector: (row) => row.name,
      wrap: true,
      style: { paddingRight: "unset" },
      // width: "160px"
    },
    {
      name: language === null ? eng.namaBank : language.namaBank,
      selector: (row) => row.bank_name,
      wrap: true,
      style: { paddingRight: "unset" },
      // width: "145px"
    },
    {
      name: language === null ? eng.jenisTransaksi : language.jenisTransaksi,
      selector: (row) => row.fiturID,
      // sortable: true
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        paddingRight: "unset",
      },
      // width: "145px"
    },
    {
      name:
        language === null ? eng.nominalTransaksi : language.nominalTransaksi,
      selector: (row) => row.amount,
      cell: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItem: "center",
          }}
        >
          {convertToRupiah(row.amount)}
        </div>
      ),
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
      },
      width: "170px",
    },
    {
      name: language === null ? eng.biaya : language.biaya,
      selector: (row) => row.total_fee,
      cell: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItem: "center",
          }}
        >
          {convertToRupiah(row.total_fee)}
        </div>
      ),
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
      },
      // width: "130px"
    },
    {
      name: language === null ? eng.totalSettlement : language.totalSettlement,
      selector: (row) => row.total_settlement,
      cell: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItem: "center",
          }}
        >
          {convertToRupiah(row.total_settlement)}
        </div>
      ),
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
      },
      width: "170px",
    },
    {
      name: language === null ? eng.status : language.status,
      selector: (row) => row.status,
      width: "150px",
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItem: "center",
        padding: "6px 0px",
        margin: "6px 20px",
        width: "100%",
        borderRadius: 4,
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status_id === "2",
          style: {
            background: "rgba(7, 126, 134, 0.08)",
            color: "#077E86",
            paddingLeft: "unset",
          },
        },
        {
          when: (row) => row.status_id === "1" || row.status_id === "7",
          style: {
            background: "#FEF4E9",
            color: "#F79421",
            paddingLeft: "unset",
          },
        },
        {
          when: (row) => row.status_id === "4" || row.status_id === "9",
          style: {
            background: "#FDEAEA",
            color: "#EE2E2C",
            paddingLeft: "unset",
          },
        },
        {
          when: (row) =>
            row.status_id === "3" ||
            row.status_id === "5" ||
            row.status_id === "6" ||
            row.status_id === "8" ||
            row.status_id === "10" ||
            row.status_id === "11" ||
            row.status_id === "12" ||
            row.status_id === "13" ||
            row.status_id === "14" ||
            row.status_id === "15",
          style: {
            background: "#F0F0F0",
            color: "#888888",
            paddingLeft: "unset",
          },
        },
      ],
    },
  ];

  function handleChange(e) {
    setInputHandle({
      ...inputHandle,
      [e.target.name]: e.target.value,
    });
  }

  function handlePageChangeDanaMasuk(page) {
    // console.log(page, 'ini di gandle change page');
    // console.log(isFilterDanaMasuk, 'ini isFilterDanaMasuk');
    if (isFilterDanaMasuk) {
      setActivePageDanaMasuk(page);
      filterTransferButtonHandle(
        page,
        partnerId,
        inputHandle.idTransaksiDanaMasuk,
        selectedAgenDanaMasuk.length !== 0
          ? selectedAgenDanaMasuk[0].value
          : "",
        inputHandle.periodeDanaMasuk,
        dateRangeDanaMasuk,
        inputHandle.statusDanaMasuk,
        0,
        inputHandle.partnerTransIdDanaMasuk,
        selectedBankDanaMasuk.length !== 0
          ? selectedBankDanaMasuk[0].value
          : "",
        inputHandle.fiturDanaMasuk,
        language === null ? "EN" : language.flagName,
        inputHandle.tipePeriode
      );
    } else {
      setActivePageDanaMasuk(page);
      getListTransferDana(
        partnerId,
        page,
        language === null ? "EN" : language.flagName
      );
    }
  }

  function handleChangePeriodeTransfer(e) {
    if (e.target.value === "7") {
      setShowDateDanaMasuk("");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    } else {
      setShowDateDanaMasuk("none");
      setInputHandle({
        ...inputHandle,
        [e.target.name]: e.target.value,
      });
    }
  }

  function pickDateDanaMasuk(item) {
    setStateDanaMasuk(item);
    if (item !== null) {
      item = item.map((el) => el.toLocaleDateString("en-CA"));
      setDateRangeDanaMasuk(item);
    }
  }

  async function userDetails() {
    try {
      const auth = "Bearer " + access_token;
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const userDetail = await axios.post(
        BaseURL + "/Account/GetUserProfile",
        { data: "" },
        { headers: headers }
      );
      // console.log(userDetail, 'ini user detal funct');
      if (
        userDetail.status === 200 &&
        userDetail.data.response_code === 200 &&
        userDetail.data.response_new_token.length === 0
      ) {
        setPartnerId(userDetail.data.response_data.muser_partnerdtl_id);
        getListTransferDana(
          userDetail.data.response_data.muser_partnerdtl_id,
          1,
          language === null ? "EN" : language.flagName
        );
        getDataAgen(userDetail.data.response_data.muser_partnerdtl_id);
      } else if (
        userDetail.status === 200 &&
        userDetail.data.response_code === 200 &&
        userDetail.data.response_new_token.length !== 0
      ) {
        setUserSession(userDetail.data.response_new_token);
        setPartnerId(userDetail.data.response_data.muser_partnerdtl_id);
        getListTransferDana(
          userDetail.data.response_data.muser_partnerdtl_id,
          1,
          language === null ? "EN" : language.flagName
        );
        getDataAgen(userDetail.data.response_data.muser_partnerdtl_id);
      }
    } catch (error) {
      // console.log(error);
      history.push(errorCatch(error.response.status));
    }
  }

  async function getBankNameHandler() {
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(`{"fitur_id":"100"}`);
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listBankName = await axios.post(
        BaseURL + "/Home/BankGetList",
        { data: dataParams },
        { headers: headers }
      );
      if (
        listBankName.status === 200 &&
        listBankName.data.response_code === 200 &&
        listBankName.data.response_new_token.length === 0
      ) {
        let newArr = [];
        listBankName.data.response_data.forEach((e) => {
          let obj = {};
          obj.value = e.mbank_code;
          obj.label = e.mbank_name;
          newArr.push(obj);
        });
        setListBank(newArr);
      } else if (
        listBankName.status === 200 &&
        listBankName.data.response_code === 200 &&
        listBankName.data.response_new_token.length !== 0
      ) {
        let newArr = [];
        listBankName.data.response_data.forEach((e) => {
          let obj = {};
          obj.value = e.mbank_code;
          obj.label = e.mbank_name;
          newArr.push(obj);
        });
        setListBank(newArr);
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status));
    }
  }

  async function getDataAgen(partnerId) {
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(`{"partner_id":"${partnerId}"}`);
      // console.log(dataParams, 'ini data params list agen');
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listAgen = await axios.post(
        BaseURL + "/Partner/GetListAgen",
        { data: dataParams },
        { headers: headers }
      );
      // console.log(listAgen, 'ini list agen');
      if (
        listAgen.status === 200 &&
        listAgen.data.response_code === 200 &&
        listAgen.data.response_new_token.length === 0
      ) {
        let newArr = [];
        listAgen.data.response_data.forEach((e) => {
          let obj = {};
          obj.value = e.agen_id;
          obj.label = e.agen_name;
          newArr.push(obj);
        });
        setListAgen(newArr);
        // setListAgen(listAgen.data.response_data)
      } else if (
        listAgen.status === 200 &&
        listAgen.data.response_code == 200 &&
        listAgen.data.response_new_token.length !== 0
      ) {
        setUserSession(listAgen.data.response_new_token);
        let newArr = [];
        listAgen.data.response_data.forEach((e) => {
          let obj = {};
          obj.value = e.agen_id;
          obj.label = e.agen_name;
          newArr.push(obj);
        });
        setListAgen(newArr);
      }
    } catch (error) {
      // console.log(error);
      history.push(errorCatch(error.response.status));
    }
  }

  async function getListTransferDana(partnerId, currentPage, lang) {
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(
        `{"partner_id": "${partnerId}", "date_from": "", "date_to": "", "period": 2, "type_date_filter": 1, "page": ${
          currentPage < 1 ? 1 : currentPage
        }, "row_per_page": 10, "transaction_code": 0, "sub_partner_id": "", "statusID": [1,2,7,9], "partner_trans_id" :"", "bank_code": "", "fitur_id": 0}`
      );
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
        "Accept-Language": lang,
      };
      const listTransferDana = await axios.post(
        BaseURL + "/report/transferreport",
        { data: dataParams },
        { headers: headers }
      );
      //   console.log(listTransferDana, 'ini list dana masuk');
      if (
        listTransferDana.status === 200 &&
        listTransferDana.data.response_code === 200 &&
        listTransferDana.data.response_new_token === null
      ) {
        listTransferDana.data.response_data.results.list =
          listTransferDana.data.response_data.results.list.map((obj, idx) => ({
            ...obj,
            number:
              currentPage > 1 ? idx + 1 + (currentPage - 1) * 10 : idx + 1,
          }));
        setPageNumberDanaMasuk(listTransferDana.data.response_data);
        setTotalPageDanaMasuk(listTransferDana.data.response_data.max_page);
        setListTransferDana(listTransferDana.data.response_data.results.list);
        setPendingTransfer(false);
      } else if (
        listTransferDana.status === 200 &&
        listTransferDana.data.response_code === 200 &&
        listTransferDana.data.response_new_token !== null
      ) {
        setUserSession(listTransferDana.data.response_new_token);
        listTransferDana.data.response_data.results.list =
          listTransferDana.data.response_data.results.list.map((obj, idx) => ({
            ...obj,
            number:
              currentPage > 1 ? idx + 1 + (currentPage - 1) * 10 : idx + 1,
          }));
        setPageNumberDanaMasuk(listTransferDana.data.response_data);
        setTotalPageDanaMasuk(listTransferDana.data.response_data.max_page);
        setListTransferDana(listTransferDana.data.response_data.results.list);
        setPendingTransfer(false);
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status));
    }
  }

  async function filterTransferButtonHandle(
    page,
    partnerId,
    idTransaksi,
    namaAgen,
    dateId,
    periode,
    status,
    rowPerPage,
    partnerTransId,
    bankName,
    fiturDanaMasuk,
    lang,
    tipePeriode
  ) {
    try {
      // console.log(lang, "lang");
      setPendingTransfer(true);
      setIsFilterDanaMasuk(true);
      setActivePageDanaMasuk(page);
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(
        `{"partner_id": "${partnerId}", "date_from": "${
          periode.length !== 0 ? periode[0] : ""
        }", "date_to": "${
          periode.length !== 0 ? periode[1] : ""
        }", "period": ${dateId}, "type_date_filter": ${
          tipePeriode !== 0 ? tipePeriode : 1
        }, "page": ${page !== 0 ? page : 1}, "row_per_page": ${
          rowPerPage !== 0 ? rowPerPage : 10
        }, "transaction_code": ${
          idTransaksi.length !== 0 ? idTransaksi : 0
        }, "sub_partner_id": "${
          namaAgen.length !== 0 ? namaAgen : ""
        }", "statusID": [${
          status.length !== 0 ? status : [1, 2, 7, 9]
        }], "partner_trans_id": "${partnerTransId}", "bank_code":"${bankName}", "fitur_id": ${fiturDanaMasuk}}`
      );
      // const dataParam = encryptData(`{"start_time": "${(periode.length !== 0) ? periode[0] : ""}", "end_time": "${(periode.length !== 0) ? periode[1] : ""}", "sub_name": "${(namaAgen.length !== 0) ? namaAgen : ""}", "id": "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "status": "${(status.length !== 0) ? status : ""}"}`)
      //   console.log(dataParams, "ini data params dana masuk filter");
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
        "Accept-Language": lang,
      };
      const filterTransferDana = await axios.post(
        BaseURL + "/report/transferreport",
        { data: dataParams },
        { headers: headers }
      );
      // console.log(filterTransferDana, "ini data filter transfer dana");
      if (
        filterTransferDana.status === 200 &&
        filterTransferDana.data.response_code === 200 &&
        filterTransferDana.data.response_new_token === null
      ) {
        filterTransferDana.data.response_data.results.list =
          filterTransferDana.data.response_data.results.list.map(
            (obj, idx) => ({
              ...obj,
              number: page > 1 ? idx + 1 + (page - 1) * 10 : idx + 1,
            })
          );
        setPageNumberDanaMasuk(filterTransferDana.data.response_data);
        setTotalPageDanaMasuk(filterTransferDana.data.response_data.max_page);
        setListTransferDana(filterTransferDana.data.response_data.results.list);
        setPendingTransfer(false);
      } else if (
        filterTransferDana.status === 200 &&
        filterTransferDana.data.response_code === 200 &&
        filterTransferDana.data.response_new_token !== null
      ) {
        setUserSession(filterTransferDana.data.response_new_token);
        filterTransferDana.data.response_data.results.list =
          filterTransferDana.data.response_data.results.list.map(
            (obj, idx) => ({
              ...obj,
              number: page > 1 ? idx + 1 + (page - 1) * 10 : idx + 1,
            })
          );
        setPageNumberDanaMasuk(filterTransferDana.data.response_data);
        setTotalPageDanaMasuk(filterTransferDana.data.response_data.max_page);
        setListTransferDana(filterTransferDana.data.response_data.results.list);
        setPendingTransfer(false);
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status));
    }
  }

  function exportReportTransferDanaMasukHandler(
    isFilter,
    partnerId,
    idTransaksi,
    namaAgen,
    dateId,
    periode,
    status,
    partnerTransId,
    bankName,
    fiturDanaMasuk,
    lang,
    tipePeriode
  ) {
    if (isFilter) {
      async function exportFilterDanaMasuk(
        partnerId,
        idTransaksi,
        namaAgen,
        dateId,
        periode,
        status,
        partnerTransId,
        bankName,
        fiturDanaMasuk,
        lang,
        tipePeriode
      ) {
        try {
          const auth = "Bearer " + getToken();
          const dataParams = encryptData(
            `{"partner_id": "${partnerId}", "date_from": "${
              periode.length !== 0 ? periode[0] : ""
            }", "date_to": "${
              periode.length !== 0 ? periode[1] : ""
            }", "period": ${dateId}, "type_date_filter": ${
              tipePeriode !== 0 ? tipePeriode : 1
            }, "page": 1, "row_per_page": 1000000, "transaction_code": ${
              idTransaksi.length !== 0 ? idTransaksi : 0
            }, "sub_partner_id": "${
              namaAgen.length !== 0 ? namaAgen : ""
            }", "statusID": [${
              status.length !== 0 ? status : [1, 2, 7, 9]
            }], "partner_trans_id":"${partnerTransId}", "bank_code":"${bankName}", "fitur_id": ${fiturDanaMasuk}}`
          );
          // const dataParam = encryptData(`{"start_time": "${(periode.length !== 0) ? periode[0] : ""}", "end_time": "${(periode.length !== 0) ? periode[1] : ""}", "sub_name": "${(namaAgen.length !== 0) ? namaAgen : ""}", "id": "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "status": "${(status.length !== 0) ? status : ""}"}`)
          // console.log(dataParams, "ini data params dana masuk filter");
          const headers = {
            "Content-Type": "application/json",
            Authorization: auth,
            "Accept-Language": lang,
          };
          const dataExportFilter = await axios.post(
            BaseURL + "/report/transferreport",
            { data: dataParams },
            { headers: headers }
          );
          // console.log(dataExportFilter, "ini data filter transfer dana");
          if (
            dataExportFilter.status === 200 &&
            dataExportFilter.data.response_code === 200 &&
            dataExportFilter.data.response_new_token === null
          ) {
            const data = dataExportFilter.data.response_data.results.list;
            let dataExcel = [];
            for (let i = 0; i < data.length; i++) {
              dataExcel.push({
                [language === null ? eng.no : language.no]: i + 1,
                [language === null ? eng.idTransaksi : language.idTransaksi]:
                  data[i].id,
                [language === null
                  ? eng.waktuTransaksi
                  : language.waktuTransaksi]: data[i].created_at,
                [language === null
                  ? eng.waktuPembayaran
                  : language.waktuPembayaran]:
                  data[i].tvatrans_process_date_format !== null
                    ? data[i].tvatrans_process_date_format
                    : "-",
                [language === null
                  ? eng.partnerTransId
                  : language.partnerTransId]: data[i].partner_trx_id,
                [language === null ? eng.namaAgen : language.namaAgen]:
                  data[i].name,
                [language === null ? eng.namaBank : language.namaBank]:
                  data[i].bank_name,
                [language === null
                  ? eng.jenisTransaksi
                  : language.jenisTransaksi]: data[i].fiturID,
                [language === null
                  ? eng.nominalTransaksi
                  : language.nominalTransaksi]: data[i].amount,
                [language === null ? eng.biaya : language.biaya]:
                  data[i].total_fee,
                [language === null
                  ? eng.totalSettlement
                  : language.totalSettlement]: data[i].total_settlement,
                [language === null ? eng.status : language.status]:
                  data[i].status,
              });
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(
              workBook,
              `${
                language === null
                  ? eng.laporanDanaMasukExcel
                  : language.laporanDanaMasukExcel
              }.xlsx`
            );
          } else if (
            dataExportFilter.status === 200 &&
            dataExportFilter.data.response_code === 200 &&
            dataExportFilter.data.response_new_token !== null
          ) {
            setUserSession(dataExportFilter.data.response_new_token);
            const data = dataExportFilter.data.response_data.results.list;
            let dataExcel = [];
            for (let i = 0; i < data.length; i++) {
              dataExcel.push({
                [language === null ? eng.no : language.no]: i + 1,
                [language === null ? eng.idTransaksi : language.idTransaksi]:
                  data[i].id,
                [language === null
                  ? eng.waktuTransaksi
                  : language.waktuTransaksi]: data[i].created_at,
                [language === null
                  ? eng.waktuPembayaran
                  : language.waktuPembayaran]:
                  data[i].tvatrans_process_date_format !== null
                    ? data[i].tvatrans_process_date_format
                    : "-",
                [language === null
                  ? eng.partnerTransId
                  : language.partnerTransId]: data[i].partner_trx_id,
                [language === null ? eng.namaAgen : language.namaAgen]:
                  data[i].name,
                [language === null ? eng.namaBank : language.namaBank]:
                  data[i].bank_name,
                [language === null
                  ? eng.jenisTransaksi
                  : language.jenisTransaksi]: data[i].fiturID,
                [language === null
                  ? eng.nominalTransaksi
                  : language.nominalTransaksi]: data[i].amount,
                [language === null ? eng.biaya : language.biaya]:
                  data[i].total_fee,
                [language === null
                  ? eng.totalSettlement
                  : language.totalSettlement]: data[i].total_settlement,
                [language === null ? eng.status : language.status]:
                  data[i].status,
              });
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(
              workBook,
              `${
                language === null
                  ? eng.laporanDanaMasukExcel
                  : language.laporanDanaMasukExcel
              }.xlsx`
            );
          }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status));
        }
      }
      exportFilterDanaMasuk(
        partnerId,
        idTransaksi,
        namaAgen,
        dateId,
        periode,
        status,
        partnerTransId,
        bankName,
        fiturDanaMasuk,
        lang,
        tipePeriode
      );
    } else {
      async function exportGetListTransferDana(partnerId, lang) {
        try {
          const auth = "Bearer " + getToken();
          const dataParams = encryptData(
            `{"partner_id": "${partnerId}", "date_from": "", "date_to": "", "period": 2, "type_date_filter": 1, "page": 1, "row_per_page": 1000000, "transaction_code": 0, "sub_partner_id": "", "statusID": [1,2,7,9], "partner_trans_id":"", "bank_code":"", "fitur_id": 0}`
          );
          const headers = {
            "Content-Type": "application/json",
            Authorization: auth,
            "Accept-Language": lang,
          };
          const dataExportDefault = await axios.post(
            BaseURL + "/report/transferreport",
            { data: dataParams },
            { headers: headers }
          );
          // console.log(dataExportDefault, 'ini list');
          if (
            dataExportDefault.status === 200 &&
            dataExportDefault.data.response_code === 200 &&
            dataExportDefault.data.response_new_token === null
          ) {
            const data = dataExportDefault.data.response_data.results.list;
            let dataExcel = [];
            for (let i = 0; i < data.length; i++) {
              dataExcel.push({
                [language === null ? eng.no : language.no]: i + 1,
                [language === null ? eng.idTransaksi : language.idTransaksi]:
                  data[i].id,
                [language === null
                  ? eng.waktuTransaksi
                  : language.waktuTransaksi]: data[i].created_at,
                [language === null
                  ? eng.waktuPembayaran
                  : language.waktuPembayaran]:
                  data[i].tvatrans_process_date_format !== null
                    ? data[i].tvatrans_process_date_format
                    : "-",
                [language === null
                  ? eng.partnerTransId
                  : language.partnerTransId]: data[i].partner_trx_id,
                [language === null ? eng.namaAgen : language.namaAgen]:
                  data[i].name,
                [language === null ? eng.namaBank : language.namaBank]:
                  data[i].bank_name,
                [language === null
                  ? eng.jenisTransaksi
                  : language.jenisTransaksi]: data[i].fiturID,
                [language === null
                  ? eng.nominalTransaksi
                  : language.nominalTransaksi]: data[i].amount,
                [language === null ? eng.biaya : language.biaya]:
                  data[i].total_fee,
                [language === null
                  ? eng.totalSettlement
                  : language.totalSettlement]: data[i].total_settlement,
                [language === null ? eng.status : language.status]:
                  data[i].status,
              });
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(
              workBook,
              `${
                language === null
                  ? eng.laporanDanaMasukExcel
                  : language.laporanDanaMasukExcel
              }.xlsx`
            );
          } else if (
            dataExportDefault.status === 200 &&
            dataExportDefault.data.response_code === 200 &&
            dataExportDefault.data.response_new_token !== null
          ) {
            setUserSession(dataExportDefault.data.response_new_token);
            const data = dataExportDefault.data.response_data.results.list;
            let dataExcel = [];
            for (let i = 0; i < data.length; i++) {
              dataExcel.push({
                [language === null ? eng.no : language.no]: i + 1,
                [language === null ? eng.idTransaksi : language.idTransaksi]:
                  data[i].id,
                [language === null
                  ? eng.waktuTransaksi
                  : language.waktuTransaksi]: data[i].created_at,
                [language === null
                  ? eng.waktuPembayaran
                  : language.waktuPembayaran]:
                  data[i].tvatrans_process_date_format !== null
                    ? data[i].tvatrans_process_date_format
                    : "-",
                [language === null
                  ? eng.partnerTransId
                  : language.partnerTransId]: data[i].partner_trx_id,
                [language === null ? eng.namaAgen : language.namaAgen]:
                  data[i].name,
                [language === null ? eng.namaBank : language.namaBank]:
                  data[i].bank_name,
                [language === null
                  ? eng.jenisTransaksi
                  : language.jenisTransaksi]: data[i].fiturID,
                [language === null
                  ? eng.nominalTransaksi
                  : language.nominalTransaksi]: data[i].amount,
                [language === null ? eng.biaya : language.biaya]:
                  data[i].total_fee,
                [language === null
                  ? eng.totalSettlement
                  : language.totalSettlement]: data[i].total_settlement,
                [language === null ? eng.status : language.status]:
                  data[i].status,
              });
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(
              workBook,
              `${
                language === null
                  ? eng.laporanDanaMasukExcel
                  : language.laporanDanaMasukExcel
              }.xlsx`
            );
          }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status));
        }
      }
      exportGetListTransferDana(partnerId, lang);
    }
  }

  function resetButtonHandle(param) {
    if (param === "Dana Masuk") {
      setInputHandle({
        ...inputHandle,
        idTransaksiDanaMasuk: "",
        // namaAgenDanaMasuk: "",
        statusDanaMasuk: [],
        periodeDanaMasuk: 0,
        partnerTransIdDanaMasuk: "",
        // bankDanaMasuk: "",
        fiturDanaMasuk: 0,
        tipePeriode: 0,
      });
      setSelectedAgenDanaMasuk([]);
      setSelectedBankDanaMasuk([]);
      setStateDanaMasuk(null);
      setDateRangeDanaMasuk([]);
      setShowDateDanaMasuk("none");
    }
  }

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#F2F2F2",
        border: "12px",
        fontWeight: "bold",
        fontSize: "16px",
        display: "flex",
        justifyContent: "flex-start",
        width: "150px",
      },
    },
  };

  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  const customStylesSelectedOption = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "none",
      color: "#888888",
      fontSize: "14px",
      fontFamily: "Nunito",
    }),
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #E0E0E0",
      borderRadius: "8px",
      fontSize: "14px",
      fontFamily: "Nunito",
      height: "40px",
    }),
  };

  const columnsAdmin = [
    {
      name: "No",
      selector: (row) => row.number,
      width: "3%",
      wrap: true,
      maxWidth: "fit-content !important",
    },
    {
      name: "ID Transaksi",
      selector: (row) => row.transa,
      width: "150px",
      cell: (row) => (
        <Link
          style={{ textDecoration: "underline", color: "#077E86" }}
          onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}
        >
          {row.transaction_code}
        </Link>
      ),
      // sortable: true
    },
    {
      name: "Waktu Transaksi",
      selector: (row) => row.tvatrans_crtdt_format,
      // sortable: true,
      width: "180px",
      wrap: true,
    },
    {
      name: "Waktu Pembayaran",
      selector: (row) =>
        row.tvatrans_process_date_format !== null
          ? row.tvatrans_process_date_format
          : "-",
      wrap: true,
      width: "180px",
    },
    {
      name: "Partner Trans ID",
      selector: (row) => row.partner_transid,
      // sortable: true,
      wrap: true,
      width: "170px",
    },
    {
      name: "Nama Partner",
      selector: (row) => row.mpartner_name,
      // sortable: true
      wrap: true,
      width: "150px",
    },
    {
      name: "Nama Agen",
      selector: (row) => row.mpartnerdtl_sub_name,
      // sortable: true,
      // width: "175px"
      wrap: true,
      width: "150px",
    },
    {
      name: "Jenis Transaksi",
      selector: (row) => row.mfitur_desc,
      // sortable: true,
      // width: "175px"
      width: "150px",
    },
    {
      name: "Nama Bank",
      selector: (row) => row.mbank_name,
      // sortable: true,
      width: "175px",
      // width: "150px",
    },
    {
      name: "No VA",
      selector: (row) => row.tvatrans_va_number,
      // sortable: true,
      width: "173px",
    },
    {
      name: "Nominal Transaksi",
      selector: (row) => row.tvatrans_amount,
      width: "170px",
      // sortable: true
      cell: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            alignItem: "right",
          }}
        >
          {convertToRupiah(row.tvatrans_amount)}
        </div>
      ),
      style: { display: "flex", flexDirection: "row", justifyContent: "right" },
    },
    {
      name: "Jasa Layanan",
      selector: (row) => row.tvatrans_partner_fee,
      width: "130px",
      // sortable: true
      cell: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            alignItem: "right",
          }}
        >
          {convertToRupiah(row.tvatrans_partner_fee)}
        </div>
      ),
      style: { display: "flex", flexDirection: "row", justifyContent: "right" },
    },
    {
      name: "PPN atas Jasa Layanan",
      selector: (row) => row.tvatrans_fee_tax,
      width: "210px",
      // sortable: true
      cell: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            alignItem: "right",
          }}
        >
          {convertToRupiah(row.tvatrans_fee_tax)}
        </div>
      ),
      style: { display: "flex", flexDirection: "row", justifyContent: "right" },
    },
    {
      name: "Reibursement by VA",
      selector: (row) => row.tvatrans_bank_fee,
      width: "190px",
      // sortable: true
      cell: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            alignItem: "right",
          }}
        >
          {convertToRupiah(row.tvatrans_bank_fee)}
        </div>
      ),
      style: { display: "flex", flexDirection: "row", justifyContent: "right" },
    },
    {
      name: "Total Settlement",
      selector: (row) =>
        row.tvatrans_amount -
        row.tvatrans_partner_fee -
        row.tvatrans_fee_tax -
        row.tvatrans_bank_fee,
      width: "190px",
      // sortable: true
      cell: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            alignItem: "right",
          }}
        >
          {convertToRupiah(
            row.tvatrans_amount -
              row.tvatrans_partner_fee -
              row.tvatrans_fee_tax -
              row.tvatrans_bank_fee
          )}
        </div>
      ),
      style: { display: "flex", flexDirection: "row", justifyContent: "right" },
    },
    {
      name: "Status",
      selector: (row) => row.mstatus_name_ind,
      width: "150px",
      // sortable: true,
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
          style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" },
        },
        {
          when: (row) =>
            row.tvatrans_status_id === 1 || row.tvatrans_status_id === 7,
          style: { background: "#FEF4E9", color: "#F79421" },
        },
        {
          when: (row) => row.tvatrans_status_id === 4,
          style: { background: "#FDEAEA", color: "#EE2E2C" },
        },
        {
          when: (row) =>
            row.tvatrans_status_id === 3 ||
            row.tvatrans_status_id === 5 ||
            row.tvatrans_status_id === 6 ||
            row.tvatrans_status_id === 8 ||
            row.tvatrans_status_id === 9 ||
            row.tvatrans_status_id === 10 ||
            row.tvatrans_status_id === 11 ||
            row.tvatrans_status_id === 12 ||
            row.tvatrans_status_id === 13 ||
            row.tvatrans_status_id === 14 ||
            row.tvatrans_status_id === 15,
          style: { background: "#F0F0F0", color: "#888888" },
        },
      ],
    },
  ];

  function handleChangeAdmin(e) {
    setInputHandleAdmin({
      ...inputHandleAdmin,
      [e.target.name]: e.target.value,
    });
  }

  function handlePageChangeDanaMasukAdmin(page) {
    // console.log(isFilterDanaMasukAdmin, 'masuk');
    if (isFilterDanaMasukAdmin) {
      setActivePageDanaMasukAdmin(page);
      filterRiwayatDanaMasukAdmin(
        page,
        inputHandleAdmin.statusDanaMasukAdmin,
        inputHandleAdmin.idTransaksiDanaMasukAdmin,
        selectedPartnerDanaMasukAdmin.length !== 0
          ? selectedPartnerDanaMasukAdmin[0].value
          : "",
        selectedAgenDanaMasukAdmin.length !== 0
          ? selectedAgenDanaMasukAdmin[0].value
          : "",
        inputHandleAdmin.periodeDanaMasukAdmin,
        dateRangeDanaMasukAdmin,
        10,
        inputHandleAdmin.partnerTransIdDanaMasukAdmin,
        selectedBankDanaMasukAdmin.length !== 0
          ? selectedBankDanaMasukAdmin[0].value
          : "",
        inputHandleAdmin.fiturDanaMasukAdmin,
        inputHandleAdmin.tipePeriodeAdmin
      );
    } else {
      setActivePageDanaMasukAdmin(page);
      riwayatDanaMasukAdmin(page);
    }
  }

  function handleChangePeriodeTransferAdmin(e) {
    if (e.target.value === "7") {
      setShowDateDanaMasukAdmin("");
      setInputHandleAdmin({
        ...inputHandleAdmin,
        [e.target.name]: e.target.value,
      });
    } else {
      setShowDateDanaMasukAdmin("none");
      setDateRangeDanaMasukAdmin([]);
      setInputHandleAdmin({
        ...inputHandleAdmin,
        [e.target.name]: e.target.value,
      });
    }
  }

  function pickDateDanaMasukAdmin(item) {
    setStateDanaMasukAdmin(item);
    if (item !== null) {
      item = item.map((el) =>
        el.toLocaleDateString("fr-CA").split("").join("")
      );
      setDateRangeDanaMasukAdmin(item);
    }
  }

  function handleChangeNamaPartner(e, jenisTransaksi) {
    if (jenisTransaksi === "danaMasuk") {
      getListAgenFromPartner(e.value);
      setSelectedPartnerDanaMasukAdmin([e]);
    }
  }

  async function detailListTransferHandler(partnerId) {
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(`{"tvatrans_trx_id": "${partnerId}"}`);
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const detailListTransfer = await axios.post(
        BaseURL + "/Report/GetTransferReportDetail",
        { data: dataParams },
        { headers: headers }
      );
      if (
        detailListTransfer.status === 200 &&
        detailListTransfer.data.response_code === 200 &&
        detailListTransfer.data.response_new_token.length === 0
      ) {
        setDetailTransferDanaAdmin(detailListTransfer.data.response_data);
        setShowModalDetailTransferDanaAdmin(true);
      } else if (
        detailListTransfer.status === 200 &&
        detailListTransfer.data.response_code === 200 &&
        detailListTransfer.data.response_new_token.length !== 0
      ) {
        setUserSession(detailListTransfer.data.response_new_token);
        setDetailTransferDanaAdmin(detailListTransfer.data.response_data);
        setShowModalDetailTransferDanaAdmin(true);
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status));
    }
  }

  async function getListAgenFromPartner(pertnerId) {
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(`{"partner_id": "${pertnerId}"}`);
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listAgenFromPartner = await axios.post(
        BaseURL + "/Partner/GetListAgen",
        { data: dataParams },
        { headers: headers }
      );
      if (
        listAgenFromPartner.status === 200 &&
        listAgenFromPartner.data.response_code === 200 &&
        listAgenFromPartner.data.response_new_token.length === 0
      ) {
        let newArr = [];
        listAgenFromPartner.data.response_data.forEach((e) => {
          let obj = {};
          obj.value = e.agen_id;
          obj.label = e.agen_name;
          newArr.push(obj);
        });
        setDataListAgenFromPartner(newArr);
      } else if (
        listAgenFromPartner.status === 200 &&
        listAgenFromPartner.data.response_code === 200 &&
        listAgenFromPartner.data.response_new_token.length !== 0
      ) {
        setUserSession(listAgenFromPartner.data.response_new_token);
        let newArr = [];
        listAgenFromPartner.data.response_data.forEach((e) => {
          let obj = {};
          obj.value = e.agen_id;
          obj.label = e.agen_name;
          newArr.push(obj);
        });
        setDataListAgenFromPartner(newArr);
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status));
    }
  }

  async function listPartner() {
    try {
      const auth = "Bearer " + getToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const listPartner = await axios.post(
        BaseURL + "/Partner/ListPartner",
        { data: "" },
        { headers: headers }
      );
      if (
        listPartner.status === 200 &&
        listPartner.data.response_code === 200 &&
        listPartner.data.response_new_token.length === 0
      ) {
        let newArr = [];
        listPartner.data.response_data.forEach((e) => {
          let obj = {};
          obj.value = e.partner_id;
          obj.label = e.nama_perusahaan;
          newArr.push(obj);
        });
        setDataListPartner(newArr);
      } else if (
        listPartner.status === 200 &&
        listPartner.data.response_code === 200 &&
        listPartner.data.response_new_token.length !== 0
      ) {
        setUserSession(listPartner.data.response_new_token);
        let newArr = [];
        listPartner.data.response_data.forEach((e) => {
          let obj = {};
          obj.value = e.partner_id;
          obj.label = e.nama_perusahaan;
          newArr.push(obj);
        });
        setDataListPartner(newArr);
      }
    } catch (error) {
      // console.log(error);
      history.push(errorCatch(error.response.status));
    }
  }

  async function riwayatDanaMasukAdmin(currentPage) {
    // dateId :
    // 0 -> all
    // 2 -> hari ini
    // 3 -> kemarin
    // 4 -> minggu ini
    // 5 -> bulan ini
    // 6 -> bulan lalu
    // 7 -> pilih tanggal
    try {
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(
        `{"statusID": [1,2,7,9], "transID" : 0, "partnerID":"", "subPartnerID":"", "type_date_filter": 1, "dateID": 2, "date_from": "", "date_to": "", "page": ${
          currentPage < 1 ? 1 : currentPage
        }, "row_per_page": 10, "partner_transid": "", "bank_code": "", "fitur_id": 0}`
      );
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const dataRiwayatDanaMasuk = await axios.post(
        BaseURL + "/Home/GetListHistoryTransfer",
        { data: dataParams },
        { headers: headers }
      );
      if (
        dataRiwayatDanaMasuk.status === 200 &&
        dataRiwayatDanaMasuk.data.response_code === 200 &&
        dataRiwayatDanaMasuk.data.response_new_token.length === 0
      ) {
        dataRiwayatDanaMasuk.data.response_data.results =
          dataRiwayatDanaMasuk.data.response_data.results.map((obj, idx) => ({
            ...obj,
            number:
              currentPage > 1 ? idx + 1 + (currentPage - 1) * 10 : idx + 1,
          }));
        setPageNumberDanaMasukAdmin(dataRiwayatDanaMasuk.data.response_data);
        setTotalPageDanaMasukAdmin(
          dataRiwayatDanaMasuk.data.response_data.max_page
        );
        setDataRiwayatDanaMasukAdmin(
          dataRiwayatDanaMasuk.data.response_data.results
        );
        setPendingTransferAdmin(false);
      } else if (
        dataRiwayatDanaMasuk.status === 200 &&
        dataRiwayatDanaMasuk.data.response_code === 200 &&
        dataRiwayatDanaMasuk.data.response_new_token.length !== 0
      ) {
        setUserSession(dataRiwayatDanaMasuk.data.response_new_token);
        dataRiwayatDanaMasuk.data.response_data.results =
          dataRiwayatDanaMasuk.data.response_data.results.map((obj, idx) => ({
            ...obj,
            number:
              currentPage > 1 ? idx + 1 + (currentPage - 1) * 10 : idx + 1,
          }));
        setPageNumberDanaMasukAdmin(dataRiwayatDanaMasuk.data.response_data);
        setTotalPageDanaMasukAdmin(
          dataRiwayatDanaMasuk.data.response_data.max_page
        );
        setDataRiwayatDanaMasukAdmin(
          dataRiwayatDanaMasuk.data.response_data.results
        );
        setPendingTransferAdmin(false);
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status));
    }
  }

  async function filterRiwayatDanaMasukAdmin(
    page,
    statusId,
    transId,
    partnerId,
    subPartnerId,
    dateId,
    periode,
    rowPerPage,
    partnerTransId,
    bankDanaMasuk,
    fiturDanaMasuk,
    tipePeriode
  ) {
    try {
      setPendingTransferAdmin(true);
      setIsFilterDanaMasukAdmin(true);
      setActivePageDanaMasukAdmin(page);
      const auth = "Bearer " + getToken();
      const dataParams = encryptData(
        `{"statusID": [${
          statusId.length !== 0 ? statusId : [1, 2, 7, 9]
        }], "transaction_code" : "${transId.length !== 0 ? transId : "0"}", "partnerID":"${
          partnerId !== undefined ? partnerId : ""
        }", "subPartnerID": "${
          subPartnerId !== undefined ? subPartnerId : ""
        }", "type_date_filter": ${
          tipePeriode != 0 ? tipePeriode : 1
        }, "dateID": ${dateId}, "date_from": "${
          periode.length !== 0 ? periode[0] : ""
        }", "date_to": "${periode.length !== 0 ? periode[1] : ""}", "page": ${
          page !== 0 ? page : 1
        }, "row_per_page": ${
          rowPerPage !== 0 ? rowPerPage : 10
        },  "partner_transid": "${partnerTransId}", "bank_code":"${
          bankDanaMasuk !== undefined ? bankDanaMasuk : ""
        }", "fitur_id": ${fiturDanaMasuk}}`
      );
      // console.log(dataParams, "filter dana masuk");
      const headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      const filterRiwayatDanaMasuk = await axios.post(
        BaseURL + "/Home/GetListHistoryTransfer",
        { data: dataParams },
        { headers: headers }
      );
      if (
        filterRiwayatDanaMasuk.status === 200 &&
        filterRiwayatDanaMasuk.data.response_code === 200 &&
        filterRiwayatDanaMasuk.data.response_new_token.length === 0
      ) {
        filterRiwayatDanaMasuk.data.response_data.results =
          filterRiwayatDanaMasuk.data.response_data.results.map((obj, idx) => ({
            ...obj,
            number: page > 1 ? idx + 1 + (page - 1) * 10 : idx + 1,
          }));
        setPageNumberDanaMasukAdmin(filterRiwayatDanaMasuk.data.response_data);
        setTotalPageDanaMasukAdmin(
          filterRiwayatDanaMasuk.data.response_data.max_page
        );
        setDataRiwayatDanaMasukAdmin(
          filterRiwayatDanaMasuk.data.response_data.results
        );
        setPendingTransferAdmin(false);
      } else if (
        filterRiwayatDanaMasuk.status === 200 &&
        filterRiwayatDanaMasuk.data.response_code === 200 &&
        filterRiwayatDanaMasuk.data.response_new_token.length !== 0
      ) {
        setUserSession(filterRiwayatDanaMasuk.data.response_new_token);
        filterRiwayatDanaMasuk.data.response_data.results =
          filterRiwayatDanaMasuk.data.response_data.results.map((obj, idx) => ({
            ...obj,
            number: page > 1 ? idx + 1 + (page - 1) * 10 : idx + 1,
          }));
        setPageNumberDanaMasukAdmin(filterRiwayatDanaMasuk.data.response_data);
        setTotalPageDanaMasukAdmin(
          filterRiwayatDanaMasuk.data.response_data.max_page
        );
        setDataRiwayatDanaMasukAdmin(
          filterRiwayatDanaMasuk.data.response_data.results
        );
        setPendingTransferAdmin(false);
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status));
    }
  }

  function ExportReportTransferDanaMasukAdminHandler(
    isFilter,
    statusId,
    transId,
    partnerId,
    subPartnerId,
    dateId,
    periode,
    partnerTransId,
    bankName,
    fiturId,
    tipePeriode
  ) {
    if (isFilter) {
      async function dataExportFilter(
        statusId,
        transId,
        partnerId,
        subPartnerId,
        dateId,
        periode,
        bankName,
        fiturId,
        tipePeriode
      ) {
        try {
          const auth = "Bearer " + getToken();
          const dataParams = encryptData(
            `{"statusID": [${
              statusId.length !== 0 ? statusId : [1, 2, 7, 9]
            }], "transID" : ${
              transId.length !== 0 ? transId : 0
            }, "partnerID":"${
              partnerId.length !== 0 ? partnerId : ""
            }", "subPartnerID": "${
              subPartnerId.length !== 0 ? subPartnerId : ""
            }", "type_date_filter": ${
              tipePeriode != 0 ? tipePeriode : 1
            }, "dateID": ${dateId}, "date_from": "${
              periode.length !== 0 ? periode[0] : ""
            }", "date_to": "${
              periode.length !== 0 ? periode[1] : ""
            }", "page": 1, "row_per_page": 1000000, "partner_transid": "${partnerTransId}", "bank_code":"${bankName}", "fitur_id": ${fiturId}}`
          );
          const headers = {
            "Content-Type": "application/json",
            Authorization: auth,
          };
          const dataExportFilter = await axios.post(
            BaseURL + "/Home/GetListHistoryTransfer",
            { data: dataParams },
            { headers: headers }
          );
          if (
            dataExportFilter.status === 200 &&
            dataExportFilter.data.response_code === 200 &&
            dataExportFilter.data.response_new_token.length === 0
          ) {
            const data = dataExportFilter.data.response_data.results;
            let dataExcel = [];
            for (let i = 0; i < data.length; i++) {
              dataExcel.push({
                No: i + 1,
                "ID Transaksi": data[i].tvatrans_trx_id,
                "Waktu Transaksi": data[i].tvatrans_crtdt_format,
                "Waktu Pembayaran":
                  data[i].tvatrans_process_date_format !== null
                    ? data[i].tvatrans_process_date_format
                    : "-",
                "Partner Trans ID": data[i].partner_transid,
                "Nama Partner": data[i].mpartner_name,
                "Nama Agen": data[i].mpartnerdtl_sub_name,
                "Jenis Transaksi": data[i].mfitur_desc,
                "Nama Bank": data[i].mbank_name,
                "No VA": data[i].tvatrans_va_number,
                "Nominal Transaksi": data[i].tvatrans_amount,
                "Jasa Layanan": data[i].tvatrans_partner_fee,
                "PPN atas Jasa Layanan": data[i].tvatrans_fee_tax,
                "Reibursement by VA": data[i].tvatrans_bank_fee,
                "Total Settlement":
                  data[i].tvatrans_amount -
                  data[i].tvatrans_partner_fee -
                  data[i].tvatrans_fee_tax -
                  data[i].tvatrans_bank_fee,
                Status: data[i].mstatus_name_ind,
              });
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Riwayat Transaksi Dana Masuk.xlsx");
          } else if (
            dataExportFilter.status === 200 &&
            dataExportFilter.data.response_code === 200 &&
            dataExportFilter.data.response_new_token.length !== 0
          ) {
            setUserSession(dataExportFilter.data.response_new_token);
            const data = dataExportFilter.data.response_data.results;
            let dataExcel = [];
            for (let i = 0; i < data.length; i++) {
              dataExcel.push({
                No: i + 1,
                "ID Transaksi": data[i].tvatrans_trx_id,
                "Waktu Transaksi": data[i].tvatrans_crtdt_format,
                "Waktu Pembayaran":
                  data[i].tvatrans_process_date_format !== null
                    ? data[i].tvatrans_process_date_format
                    : "-",
                "Partner Trans ID": data[i].partner_transid,
                "Nama Partner": data[i].mpartner_name,
                "Nama Agen": data[i].mpartnerdtl_sub_name,
                "Jenis Transaksi": data[i].mfitur_desc,
                "Nama Bank": data[i].mbank_name,
                "No VA": data[i].tvatrans_va_number,
                "Nominal Transaksi": data[i].tvatrans_amount,
                "Jasa Layanan": data[i].tvatrans_partner_fee,
                "PPN atas Jasa Layanan": data[i].tvatrans_fee_tax,
                "Reibursement by VA": data[i].tvatrans_bank_fee,
                "Total Settlement":
                  data[i].tvatrans_amount -
                  data[i].tvatrans_partner_fee -
                  data[i].tvatrans_fee_tax -
                  data[i].tvatrans_bank_fee,
                Status: data[i].mstatus_name_ind,
              });
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Riwayat Transaksi Dana Masuk.xlsx");
          }
        } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status));
        }
      }
      dataExportFilter(
        statusId,
        transId,
        partnerId,
        subPartnerId,
        dateId,
        periode,
        bankName,
        fiturId,
        tipePeriode
      );
    } else {
      async function dataExportDanaMasuk() {
        try {
          const auth = "Bearer " + getToken();
          const dataParams = encryptData(
            `{"statusID": [1,2,7,9], "transID" : 0, "partnerID":"", "subPartnerID":"", "type_date_filter": 1, "dateID": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000, "partner_transid":"", "bank_code": "", "fitur_id": 0}`
          );
          const headers = {
            "Content-Type": "application/json",
            Authorization: auth,
          };
          const dataExportDanaMasuk = await axios.post(
            BaseURL + "/Home/GetListHistoryTransfer",
            { data: dataParams },
            { headers: headers }
          );
          if (
            dataExportDanaMasuk.status === 200 &&
            dataExportDanaMasuk.data.response_code === 200 &&
            dataExportDanaMasuk.data.response_new_token.length === 0
          ) {
            const data = dataExportDanaMasuk.data.response_data.results;
            let dataExcel = [];
            for (let i = 0; i < data.length; i++) {
              dataExcel.push({
                No: i + 1,
                "ID Transaksi": data[i].tvatrans_trx_id,
                "Waktu Transaksi": data[i].tvatrans_crtdt_format,
                "Waktu Pembayaran":
                  data[i].tvatrans_process_date_format !== null
                    ? data[i].tvatrans_process_date_format
                    : "-",
                "Partner Trans ID": data[i].partner_transid,
                "Nama Partner": data[i].mpartner_name,
                "Nama Agen": data[i].mpartnerdtl_sub_name,
                "Jenis Transaksi": data[i].mfitur_desc,
                "Nama Bank": data[i].mbank_name,
                "No VA": data[i].tvatrans_va_number,
                "Nominal Transaksi": data[i].tvatrans_amount,
                "Jasa Layanan": data[i].tvatrans_partner_fee,
                "PPN atas Jasa Layanan": data[i].tvatrans_fee_tax,
                "Reibursement by VA": data[i].tvatrans_bank_fee,
                "Total Settlement":
                  data[i].tvatrans_amount -
                  data[i].tvatrans_partner_fee -
                  data[i].tvatrans_fee_tax -
                  data[i].tvatrans_bank_fee,
                Status: data[i].mstatus_name_ind,
              });
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Riwayat Transaksi Dana Masuk.xlsx");
          } else if (
            dataExportDanaMasuk.status === 200 &&
            dataExportDanaMasuk.data.response_code === 200 &&
            dataExportDanaMasuk.data.response_new_token.length !== 0
          ) {
            setUserSession(dataExportDanaMasuk.data.response_new_token);
            const data = dataExportDanaMasuk.data.response_data.results;
            let dataExcel = [];
            for (let i = 0; i < data.length; i++) {
              dataExcel.push({
                No: i + 1,
                "ID Transaksi": data[i].transaction_code,
                "Waktu Transaksi": data[i].tvatrans_crtdt_format,
                "Waktu Pembayaran":
                  data[i].tvatrans_process_date_format !== null
                    ? data[i].tvatrans_process_date_format
                    : "-",
                "Partner Trans ID": data[i].partner_transid,
                "Nama Partner": data[i].mpartner_name,
                "Nama Agen": data[i].mpartnerdtl_sub_name,
                "Jenis Transaksi": data[i].mfitur_desc,
                "Nama Bank": data[i].mbank_name,
                "No VA": data[i].tvatrans_va_number,
                "Nominal Transaksi": data[i].tvatrans_amount,
                "Jasa Layanan": data[i].tvatrans_partner_fee,
                "PPN atas Jasa Layanan": data[i].tvatrans_fee_tax,
                "Reibursement by VA": data[i].tvatrans_bank_fee,
                "Total Settlement":
                  data[i].tvatrans_amount -
                  data[i].tvatrans_partner_fee -
                  data[i].tvatrans_fee_tax -
                  data[i].tvatrans_bank_fee,
                Status: data[i].mstatus_name_ind,
              });
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Riwayat Transaksi Dana Masuk.xlsx");
          }
        } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status));
        }
      }
      dataExportDanaMasuk();
    }
  }

  function resetButtonAdminHandle(param) {
    if (param === "Dana Masuk") {
      setInputHandleAdmin({
        ...inputHandleAdmin,
        idTransaksiDanaMasukAdmin: "",
        namaPartnerDanaMasukAdmin: "",
        statusDanaMasukAdmin: [],
        periodeDanaMasukAdmin: 0,
        partnerTransIdDanaMasukAdmin: "",
        fiturDanaMasukAdmin: 0,
        tipePeriodeAdmin: 0,
      });
      setSelectedPartnerDanaMasukAdmin([]);
      setSelectedAgenDanaMasukAdmin([]);
      setSelectedBankDanaMasukAdmin([]);
      setStateDanaMasukAdmin(null);
      setDateRangeDanaMasukAdmin([]);
      setShowDateDanaMasukAdmin("none");
    }
  }

  const customStylesDanaMasuk = {
    headCells: {
      style: {
        width: "max-content",
        backgroundColor: "#F2F2F2",
        border: "12px",
        fontWeight: "bold",
        fontSize: "16px",
        display: "flex",
        justifyContent: "flex-start",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: defaultThemes.default.divider.default,
      },
    },
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!access_token) {
      history.push("/login");
    }
    if (user_role === "102" || user_role === "104") {
      userDetails();
    } else {
      listPartner();
      riwayatDanaMasukAdmin(activePageDanaMasukAdmin);
    }
    getBankNameHandler();
  }, [access_token]);

  return (
    <div
      className="main-content mt-5"
      style={{ padding: "37px 27px 37px 27px" }}
    >
      {user_role === "102" ? (
        <>
          <span className="breadcrumbs-span">
            <span style={{ cursor: "pointer" }}>
              {language === null ? eng.laporan : language.laporan}
            </span>
          </span>
          <div className="head-title">
            <h2
              className="h4 mt-4"
              style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}
            >
              {language === null ? eng.laporan : language.laporan}
            </h2>
          </div>
          <h2
            className="h5 mt-3"
            style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}
          >
            {language === null ? eng.danaMasuk : language.danaMasuk}
          </h2>
          <div className="base-content">
            <span
              className="font-weight-bold mb-4"
              style={{ fontWeight: 600, fontFamily: "Exo", fontSize: 16 }}
            >
              {language === null ? eng.filter : language.filter}
            </span>
            <Row className="mt-4">
              <Col
                xs={4}
                className="d-flex justify-content-between align-items-center"
              >
                <span className="pe-1">
                  {language === null ? eng.idTransaksi : language.idTransaksi}
                </span>
                <input
                  onChange={(e) => handleChange(e)}
                  value={inputHandle.idTransaksiDanaMasuk}
                  name="idTransaksiDanaMasuk"
                  type="text"
                  className="input-text-riwayat"
                  style={{ marginLeft: 31 }}
                  placeholder={
                    language === null
                      ? eng.placeholderIdTrans
                      : language.placeholderIdTrans
                  }
                />
              </Col>
              <Col
                xs={4}
                className="d-flex justify-content-between align-items-center"
              >
                <span className="pe-3">
                  {language === null ? eng.namaAgen : language.namaAgen}
                </span>
                <div
                  className="dropdown dropVaAndPaylinkPartner"
                  style={{ width: "12rem" }}
                >
                  <ReactSelect
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={listAgen}
                    value={selectedAgenDanaMasuk}
                    onChange={(selected) =>
                      setSelectedAgenDanaMasuk([selected])
                    }
                    placeholder={
                      language === null
                        ? eng.placeholderNamaAgen
                        : language.placeholderNamaAgen
                    }
                    components={{ Option }}
                    styles={customStylesSelectedOption}
                  />
                </div>
              </Col>
              <Col
                xs={4}
                className="d-flex justify-content-between align-items-center"
              >
                <span className="pe-4">
                  {language === null ? eng.status : language.status}
                </span>
                <Form.Select
                  name="statusDanaMasuk"
                  className="input-text-ez"
                  style={{ display: "inline" }}
                  value={inputHandle.statusDanaMasuk}
                  onChange={(e) => handleChange(e)}
                >
                  <option defaultChecked disabled value="">
                    {language === null
                      ? eng.placeholderStatus
                      : language.placeholderStatus}
                  </option>
                  <option value={2}>
                    {language === null ? eng.berhasil : language.berhasil}
                  </option>
                  <option value={1}>
                    {language === null ? eng.dalamProses : language.dalamProses}
                  </option>
                  <option value={7}>
                    {language === null
                      ? eng.menungguPembayaran
                      : language.menungguPembayaran}
                  </option>
                  <option value={9}>
                    {language === null ? eng.kadaluwarsa : language.kadaluwarsa}
                  </option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col
                xs={4}
                className="d-flex justify-content-between align-items-center"
              >
                <span className="pe-2">
                  {language === null
                    ? eng.partnerTransId
                    : language.partnerTransId}
                </span>
                <input
                  onChange={(e) => handleChange(e)}
                  value={inputHandle.partnerTransIdDanaMasuk}
                  name="partnerTransIdDanaMasuk"
                  type="text"
                  className="input-text-riwayat ms-1"
                  placeholder={
                    language === null
                      ? eng.placeholderPartnerTransId
                      : language.placeholderPartnerTransId
                  }
                />
              </Col>
              <Col
                xs={4}
                className="d-flex justify-content-between align-items-center"
              >
                <span>
                  {language === null
                    ? eng.jenisTransaksi
                    : language.jenisTransaksi}
                </span>
                <Form.Select
                  name="fiturDanaMasuk"
                  onChange={(e) => handleChange(e)}
                  value={inputHandle.fiturDanaMasuk}
                  className="input-text-ez"
                  style={{ display: "inline" }}
                >
                  <option defaultValue disabled value={0}>
                    {language === null
                      ? eng.placeholderJenisTransaksi
                      : language.placeholderJenisTransaksi}
                  </option>
                  <option value={104}>
                    {language === null ? eng.paymentLink : language.paymentLink}
                  </option>
                  <option value={100}>
                    {language === null
                      ? eng.virtualAccount
                      : language.virtualAccount}
                  </option>
                </Form.Select>
              </Col>
              <Col
                xs={4}
                className="d-flex justify-content-between align-items-center"
              >
                <span className="me-2">
                  {language === null ? eng.namaBank : language.namaBank}
                </span>
                <div
                  className="dropdown dropVaAndPaylinkPartner"
                  style={{ width: "12rem" }}
                >
                  <ReactSelect
                    // isMulti
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={listBank}
                    // allowSelectAll={true}
                    value={selectedBankDanaMasuk}
                    onChange={(selected) =>
                      setSelectedBankDanaMasuk([selected])
                    }
                    placeholder={
                      language === null
                        ? eng.placeholderNamaBank
                        : language.placeholderNamaBank
                    }
                    components={{ Option }}
                    styles={customStylesSelectedOption}
                  />
                </div>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col
                xs={4}
                className="d-flex justify-content-between align-items-center"
              >
                <span className="me-2">
                  {language === null ? eng.tipePeriode : language.tipePeriode}
                </span>
                <Form.Select
                  name="tipePeriode"
                  className="input-text-riwayat ms-1"
                  style={{ display: "inline" }}
                  value={inputHandle.tipePeriode}
                  onChange={(e) => handleChange(e)}
                >
                  <option defaultValue disabled value={0}>
                    {language === null
                      ? eng.placeholderTipePeriode
                      : language.placeholderTipePeriode}
                  </option>
                  <option value={1}>
                    {language === null ? eng.periodeBuat : language.periodeBuat}
                  </option>
                  <option value={2}>
                    {language === null
                      ? eng.periodeProses
                      : language.periodeProses}
                  </option>
                </Form.Select>
              </Col>
              <Col
                xs={4}
                className="d-flex justify-content-between align-items-center"
                style={{ width: showDateDanaMasuk === "none" ? "33%" : "33%" }}
              >
                <span className="me-3">
                  {language === null ? eng.periode : language.periode}
                  <span style={{ color: "red" }}>*</span>
                </span>
                <Form.Select
                  name="periodeDanaMasuk"
                  className="input-text-riwayat ms-5"
                  value={inputHandle.periodeDanaMasuk}
                  onChange={(e) => handleChangePeriodeTransfer(e)}
                >
                  <option defaultChecked disabled value={0}>
                    {language === null
                      ? eng.pilihPeriode
                      : language.pilihPeriode}
                  </option>
                  <option value={2}>
                    {language === null ? eng.hariIni : language.hariIni}
                  </option>
                  <option value={3}>
                    {language === null ? eng.kemarin : language.kemarin}
                  </option>
                  <option value={4}>
                    {language === null
                      ? eng.tujuhHariTerakhir
                      : language.tujuhHariTerakhir}
                  </option>
                  <option value={5}>
                    {language === null ? eng.bulanIni : language.bulanIni}
                  </option>
                  <option value={6}>
                    {language === null
                      ? eng.bulanKemarin
                      : language.bulanKemarin}
                  </option>
                  <option value={7}>
                    {language === null
                      ? eng.pilihRangeTanggal
                      : language.pilihRangeTanggal}
                  </option>
                </Form.Select>
              </Col>
              <Col xs={4} style={{ display: showDateDanaMasuk }}>
                <DateRangePicker
                  onChange={pickDateDanaMasuk}
                  value={stateDanaMasuk}
                  clearIcon={null}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col xs={5}>
                <Row>
                  <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                    <button
                      onClick={() =>
                        filterTransferButtonHandle(
                          1,
                          partnerId,
                          inputHandle.idTransaksiDanaMasuk,
                          selectedAgenDanaMasuk.length !== 0
                            ? selectedAgenDanaMasuk[0].value
                            : "",
                          inputHandle.periodeDanaMasuk,
                          dateRangeDanaMasuk,
                          inputHandle.statusDanaMasuk,
                          0,
                          inputHandle.partnerTransIdDanaMasuk,
                          selectedBankDanaMasuk.length !== 0
                            ? selectedBankDanaMasuk[0].value
                            : "",
                          inputHandle.fiturDanaMasuk,
                          language === null ? "EN" : language.flagName,
                          inputHandle.tipePeriode
                        )
                      }
                      className={
                        inputHandle.periodeDanaMasuk !== 0 ||
                        dateRangeDanaMasuk.length !== 0 ||
                        (dateRangeDanaMasuk.length !== 0 &&
                          inputHandle.idTransaksiDanaMasuk.length !== 0) ||
                        (dateRangeDanaMasuk.length !== 0 &&
                          inputHandle.statusDanaMasuk.length !== 0) ||
                        (dateRangeDanaMasuk.length !== 0 &&
                          selectedAgenDanaMasuk.length !== 0) ||
                        (dateRangeDanaMasuk.length !== 0 &&
                          selectedBankDanaMasuk.length !== 0) ||
                        (dateRangeDanaMasuk.length !== 0 &&
                          inputHandle.fiturDanaMasuk.length !== 0)
                          ? "btn-ez-on"
                          : "btn-ez"
                      }
                      disabled={
                        inputHandle.periodeDanaMasuk === 0 ||
                        (inputHandle.periodeDanaMasuk === 0 &&
                          inputHandle.idTransaksiDanaMasuk.length === 0) ||
                        (inputHandle.periodeDanaMasuk === 0 &&
                          inputHandle.statusDanaMasuk.length === 0) ||
                        (inputHandle.periodeDanaMasuk === 0 &&
                          selectedAgenDanaMasuk.length === 0) ||
                        (inputHandle.periodeDanaMasuk === 0 &&
                          selectedBankDanaMasuk.length === 0) ||
                        (inputHandle.periodeDanaMasuk === 0 &&
                          inputHandle.fiturDanaMasuk.length === 0)
                      }
                    >
                      {language === null ? eng.terapkan : language.terapkan}
                    </button>
                  </Col>
                  <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                    <button
                      onClick={() => resetButtonHandle("Dana Masuk")}
                      className={
                        inputHandle.periodeDanaMasuk ||
                        dateRangeDanaMasuk.length !== 0 ||
                        (dateRangeDanaMasuk.length !== 0 &&
                          inputHandle.idTransaksiDanaMasuk.length !== 0) ||
                        (dateRangeDanaMasuk.length !== 0 &&
                          inputHandle.statusDanaMasuk.length !== 0) ||
                        (dateRangeDanaMasuk.length !== 0 &&
                          selectedAgenDanaMasuk.length !== 0) ||
                        (dateRangeDanaMasuk.length !== 0 &&
                          selectedBankDanaMasuk.length !== 0) ||
                        (dateRangeDanaMasuk.length !== 0 &&
                          inputHandle.fiturDanaMasuk.length !== 0)
                          ? "btn-reset"
                          : "btn-ez-reset"
                      }
                      disabled={
                        inputHandle.periodeDanaMasuk === 0 ||
                        (inputHandle.periodeDanaMasuk === 0 &&
                          inputHandle.idTransaksiDanaMasuk.length === 0) ||
                        (inputHandle.periodeDanaMasuk === 0 &&
                          inputHandle.statusDanaMasuk.length === 0) ||
                        (inputHandle.periodeDanaMasuk === 0 &&
                          selectedAgenDanaMasuk.length === 0) ||
                        (inputHandle.periodeDanaMasuk === 0 &&
                          selectedBankDanaMasuk.length === 0) ||
                        (inputHandle.periodeDanaMasuk === 0 &&
                          inputHandle.fiturDanaMasuk.length === 0)
                      }
                    >
                      {language === null ? eng.aturUlang : language.aturUlang}
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
            {
              // listTransferDana.length !== 0 &&
              listTransferDana.length !== 0 && (
                <div>
                  <Link
                    onClick={() =>
                      exportReportTransferDanaMasukHandler(
                        isFilterDanaMasuk,
                        partnerId,
                        inputHandle.idTransaksiDanaMasuk,
                        selectedAgenDanaMasuk.length !== 0
                          ? selectedAgenDanaMasuk[0].value
                          : "",
                        inputHandle.periodeDanaMasuk,
                        dateRangeDanaMasuk,
                        inputHandle.statusDanaMasuk,
                        inputHandle.partnerTransIdDanaMasuk,
                        selectedBankDanaMasuk.length !== 0
                          ? selectedBankDanaMasuk[0].value
                          : "",
                        inputHandle.fiturDanaMasuk,
                        language === null ? "EN" : language.flagName,
                        inputHandle.tipePeriode
                      )
                    }
                    className="export-span"
                  >
                    {language === null ? eng.export : language.export}
                  </Link>
                </div>
              )
            }
            <br />
            <br />
            <div className="div-table pb-4">
              <DataTable
                columns={columnstransferDana}
                data={listTransferDana}
                customStyles={customStyles}
                noDataComponent={
                  language === null ? eng.tidakAdaData : language.tidakAdaData
                }
                highlightOnHover
                progressPending={pendingTransfer}
                progressComponent={<CustomLoader />}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: 12,
                borderTop: "groove",
              }}
            >
              <div style={{ marginRight: 10, marginTop: 10 }}>
                {language === null ? eng.totalHalaman : language.totalHalaman} :{" "}
                {totalPageDanaMasuk}
              </div>
              <Pagination
                activePage={activePageDanaMasuk}
                itemsCountPerPage={pageNumberDanaMasuk.row_per_page}
                totalItemsCount={
                  pageNumberDanaMasuk.row_per_page *
                  pageNumberDanaMasuk.max_page
                }
                pageRangeDisplayed={5}
                itemClass="page-item"
                linkClass="page-link"
                onChange={handlePageChangeDanaMasuk}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <span className="breadcrumbs-span">
            <Link to={"/"}>Beranda</Link> &nbsp;
            <img alt="" src={breadcrumbsIcon} /> &nbsp;Riwayat Transaksi
          </span>
          <div className="head-title">
            <h2
              className="h4 mt-4"
              style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}
            >
              Riwayat Transaksi
            </h2>
          </div>
          <h2
            className="h5 mt-3"
            style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}
          >
            Riwayat Dana Masuk
          </h2>
          <div className="base-content mt-3">
            <span className="font-weight-bold mb-4" style={{ fontWeight: 600 }}>
              Filter
            </span>
            <Row className="mt-4">
              <Col
                xs={4}
                className="d-flex justify-content-start align-items-center"
              >
                <span>ID Transaksi</span>
                <input
                  onChange={(e) => handleChangeAdmin(e)}
                  value={inputHandleAdmin.idTransaksiDanaMasukAdmin}
                  name="idTransaksiDanaMasukAdmin"
                  type="text"
                  className="input-text-riwayat ms-3"
                  placeholder="Masukkan ID Transaksi"
                />
              </Col>
              <Col
                xs={4}
                className="d-flex justify-content-start align-items-center"
              >
                <span className="me-3">Nama Partner</span>
                <div
                  className="dropdown dropSaldoPartner"
                  style={{ width: "12rem" }}
                >
                  <ReactSelect
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={dataListPartner}
                    value={selectedPartnerDanaMasukAdmin}
                    onChange={(selected) =>
                      handleChangeNamaPartner(selected, "danaMasuk")
                    }
                    placeholder="Pilih Nama Partner"
                    components={{ Option }}
                    styles={customStylesSelectedOption}
                  />
                </div>
              </Col>
              <Col
                xs={4}
                className="d-flex justify-content-start align-items-center"
              >
                <span className="me-4">Nama Agen</span>
                <div
                  className="dropdown dropSaldoPartner"
                  style={{ width: "12rem" }}
                >
                  <ReactSelect
                    // isMulti
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={dataListAgenFromPartner}
                    // allowSelectAll={true}
                    value={selectedAgenDanaMasukAdmin}
                    onChange={(selected) =>
                      setSelectedAgenDanaMasukAdmin([selected])
                    }
                    placeholder="Pilih Nama Agen"
                    components={{ Option }}
                    styles={customStylesSelectedOption}
                  />
                </div>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col
                xs={4}
                className="d-flex justify-content-start align-items-center"
              >
                <span style={{ marginRight: 41 }}>Status</span>
                <Form.Select
                  name="statusDanaMasukAdmin"
                  className="input-text-riwayat ms-3"
                  style={{ display: "inline" }}
                  value={inputHandleAdmin.statusDanaMasukAdmin}
                  onChange={(e) => handleChangeAdmin(e)}
                >
                  <option defaultChecked disabled value="">
                    Pilih Status
                  </option>
                  <option value={2}>Berhasil</option>
                  <option value={1}>Dalam Proses</option>
                  <option value={7}>Menunggu Pembayaran</option>
                  <option value={9}>Kadaluwarsa</option>
                </Form.Select>
              </Col>
              <Col
                xs={4}
                className="d-flex justify-content-start align-items-center"
              >
                <span>Partner Trans ID</span>
                <input
                  onChange={(e) => handleChangeAdmin(e)}
                  value={inputHandleAdmin.partnerTransIdDanaMasukAdmin}
                  name="partnerTransIdDanaMasukAdmin"
                  type="text"
                  className="input-text-riwayat ms-2"
                  placeholder="Masukkan Partner Trans ID"
                />
              </Col>
              <Col
                xs={4}
                className="d-flex justify-content-start align-items-center"
              >
                <span>Tipe Periode</span>
                <Form.Select
                  name="tipePeriodeAdmin"
                  className="input-text-riwayat ms-4"
                  style={{ display: "inline" }}
                  value={inputHandleAdmin.tipePeriodeAdmin}
                  onChange={(e) => handleChangeAdmin(e)}
                >
                  <option defaultValue disabled value={0}>
                    Pilih Tipe Periode
                  </option>
                  <option value={1}>Periode Buat</option>
                  <option value={2}>Periode Proses</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col
                xs={4}
                className="d-flex justify-content-start align-items-center"
                style={{
                  width: showDateDanaMasukAdmin === "none" ? "33%" : "33%",
                }}
              >
                <span style={{ marginRight: 25 }}>
                  Periode<span style={{ color: "red" }}>*</span>
                </span>
                <Form.Select
                  name="periodeDanaMasukAdmin"
                  className="input-text-riwayat ms-3"
                  value={inputHandleAdmin.periodeDanaMasukAdmin}
                  onChange={(e) => handleChangePeriodeTransferAdmin(e)}
                >
                  <option defaultChecked disabled value={0}>
                    Pilih Periode
                  </option>
                  <option value={2}>Hari Ini</option>
                  <option value={3}>Kemarin</option>
                  <option value={4}>7 Hari Terakhir</option>
                  <option value={5}>Bulan Ini</option>
                  <option value={6}>Bulan Kemarin</option>
                  <option value={7}>Pilih Range Tanggal</option>
                </Form.Select>
              </Col>
              <Col
                xs={4}
                className="d-flex justify-content-start align-items-center"
              >
                <span className="me-4">Nama Bank</span>
                <div
                  className="dropdown dropSaldoPartner"
                  style={{ width: "12rem" }}
                >
                  <ReactSelect
                    // isMulti
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={listBank}
                    // allowSelectAll={true}
                    value={selectedBankDanaMasukAdmin}
                    onChange={(selected) =>
                      setSelectedBankDanaMasukAdmin([selected])
                    }
                    placeholder="Pilih Nama Bank"
                    components={{ Option }}
                    styles={customStylesSelectedOption}
                  />
                </div>
              </Col>
              <Col
                xs={4}
                className="d-flex justify-content-start align-items-center"
              >
                <span>Jenis Transaksi</span>
                <Form.Select
                  name="fiturDanaMasukAdmin"
                  className="input-text-riwayat ms-3"
                  style={{ display: "inline" }}
                  value={inputHandleAdmin.fiturDanaMasukAdmin}
                  onChange={(e) => handleChangeAdmin(e)}
                >
                  <option defaultValue disabled value={0}>
                    Pilih Jenis Transaksi
                  </option>
                  <option value={104}>Payment Link</option>
                  <option value={100}>Virtual Account</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col
                xs={4}
                style={{ display: showDateDanaMasukAdmin, marginLeft: 65 }}
                className="text-start ps-5"
              >
                <DateRangePicker
                  onChange={pickDateDanaMasukAdmin}
                  value={stateDanaMasukAdmin}
                  clearIcon={null}
                  // calendarIcon={null}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col xs={5}>
                <Row>
                  <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                    <button
                      onClick={() =>
                        filterRiwayatDanaMasukAdmin(
                          1,
                          inputHandleAdmin.statusDanaMasukAdmin,
                          inputHandleAdmin.idTransaksiDanaMasukAdmin,
                          selectedPartnerDanaMasukAdmin.length !== 0
                            ? selectedPartnerDanaMasukAdmin[0].value
                            : "",
                          selectedAgenDanaMasukAdmin.length !== 0
                            ? selectedAgenDanaMasukAdmin[0].value
                            : "",
                          inputHandleAdmin.periodeDanaMasukAdmin,
                          dateRangeDanaMasukAdmin,
                          10,
                          inputHandleAdmin.partnerTransIdDanaMasukAdmin,
                          selectedBankDanaMasukAdmin.length !== 0
                            ? selectedBankDanaMasukAdmin[0].value
                            : "",
                          inputHandleAdmin.fiturDanaMasukAdmin,
                          inputHandleAdmin.tipePeriodeAdmin
                        )
                      }
                      className={
                        inputHandleAdmin.periodeDanaMasukAdmin !== 0 ||
                        dateRangeDanaMasukAdmin.length !== 0 ||
                        (dateRangeDanaMasukAdmin.length !== 0 &&
                          inputHandleAdmin.idTransaksiDanaMasukAdmin.length !==
                            0) ||
                        (dateRangeDanaMasukAdmin.length !== 0 &&
                          inputHandleAdmin.statusDanaMasukAdmin.length !== 0) ||
                        (dateRangeDanaMasukAdmin.length !== 0 &&
                          selectedAgenDanaMasuk[0].value !== undefined) ||
                        (dateRangeDanaMasukAdmin.length !== 0 &&
                          inputHandleAdmin.partnerTransIdDanaMasukAdmin
                            .length !== 0) ||
                        (dateRangeDanaMasukAdmin.length !== 0 &&
                          selectedBankDanaMasukAdmin[0].value !== undefined) ||
                        (dateRangeDanaMasukAdmin.length !== 0 &&
                          inputHandleAdmin.fiturDanaMasukAdmin.length !== 0)
                          ? "btn-ez-on"
                          : "btn-ez"
                      }
                      disabled={
                        inputHandleAdmin.periodeDanaMasukAdmin === 0 ||
                        (inputHandleAdmin.periodeDanaMasukAdmin === 0 &&
                          inputHandleAdmin.idTransaksiDanaMasukAdmin.length ===
                            0) ||
                        (inputHandleAdmin.periodeDanaMasukAdmin === 0 &&
                          inputHandleAdmin.statusDanaMasukAdmin.length === 0) ||
                        (inputHandleAdmin.periodeDanaMasukAdmin === 0 &&
                          selectedAgenDanaMasuk[0].value === undefined) ||
                        (inputHandleAdmin.periodeDanaMasukAdmin === 0 &&
                          (inputHandleAdmin.partnerTransIdDanaMasukAdmin
                            .length ===
                            0) |
                            (inputHandleAdmin.periodeDanaMasukAdmin === 0) &&
                          selectedBankDanaMasukAdmin[0].value === undefined) ||
                        (inputHandleAdmin.periodeDanaMasukAdmin === 0 &&
                          inputHandleAdmin.fiturDanaMasukAdmin.length === 0)
                      }
                    >
                      Terapkan
                    </button>
                  </Col>
                  <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                    <button
                      onClick={() => resetButtonAdminHandle("Dana Masuk")}
                      className={
                        inputHandleAdmin.periodeDanaMasukAdmin ||
                        dateRangeDanaMasukAdmin.length !== 0 ||
                        (dateRangeDanaMasukAdmin.length !== 0 &&
                          inputHandleAdmin.idTransaksiDanaMasukAdmin.length !==
                            0) ||
                        (dateRangeDanaMasukAdmin.length !== 0 &&
                          inputHandleAdmin.statusDanaMasukAdmin.length !== 0) ||
                        (dateRangeDanaMasukAdmin.length !== 0 &&
                          selectedAgenDanaMasuk[0].value !== undefined) ||
                        (dateRangeDanaMasukAdmin.length !== 0 &&
                          inputHandleAdmin.partnerTransIdDanaMasukAdmin
                            .length !== 0) ||
                        (dateRangeDanaMasukAdmin.length !== 0 &&
                          selectedBankDanaMasukAdmin[0].value !== undefined) ||
                        (dateRangeDanaMasukAdmin.length !== 0 &&
                          inputHandleAdmin.fiturDanaMasukAdmin.length !== 0)
                          ? "btn-reset"
                          : "btn-ez-reset"
                      }
                      disabled={
                        inputHandleAdmin.periodeDanaMasukAdmin === 0 ||
                        (inputHandleAdmin.periodeDanaMasukAdmin === 0 &&
                          inputHandleAdmin.idTransaksiDanaMasukAdmin.length ===
                            0) ||
                        (inputHandleAdmin.periodeDanaMasukAdmin === 0 &&
                          inputHandleAdmin.statusDanaMasukAdmin.length === 0) ||
                        (inputHandleAdmin.periodeDanaMasukAdmin === 0 &&
                          selectedAgenDanaMasuk[0].value === undefined) ||
                        (inputHandleAdmin.periodeDanaMasukAdmin === 0 &&
                          inputHandleAdmin.partnerTransIdDanaMasukAdmin
                            .length === 0) ||
                        (inputHandleAdmin.periodeDanaMasukAdmin === 0 &&
                          selectedBankDanaMasukAdmin[0].value === undefined) ||
                        (inputHandleAdmin.periodeDanaMasukAdmin === 0 &&
                          inputHandleAdmin.fiturDanaMasukAdmin.length === 0)
                      }
                    >
                      Atur Ulang
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
            {dataRiwayatDanaMasukAdmin.length !== 0 && (
              <div style={{ marginBottom: 30 }}>
                <Link
                  onClick={() =>
                    ExportReportTransferDanaMasukAdminHandler(
                      isFilterDanaMasukAdmin,
                      inputHandleAdmin.statusDanaMasukAdmin,
                      inputHandleAdmin.idTransaksiDanaMasukAdmin,
                      selectedPartnerDanaMasukAdmin.length !== 0
                        ? selectedPartnerDanaMasukAdmin[0].value
                        : "",
                      selectedAgenDanaMasukAdmin.length !== 0
                        ? selectedAgenDanaMasukAdmin[0].value
                        : "",
                      inputHandleAdmin.periodeDanaMasukAdmin,
                      dateRangeDanaMasukAdmin,
                      inputHandleAdmin.partnerTransIdDanaMasukAdmin,
                      selectedBankDanaMasukAdmin.length !== 0
                        ? selectedBankDanaMasukAdmin[0].value
                        : "",
                      inputHandleAdmin.fiturDanaMasukAdmin,
                      inputHandleAdmin.tipePeriodeAdmin
                    )
                  }
                  className="export-span"
                >
                  Export
                </Link>
              </div>
            )}
            <div className="div-table mt-4 pb-4">
              <DataTable
                columns={columnsAdmin}
                data={dataRiwayatDanaMasukAdmin}
                customStyles={customStylesDanaMasuk}
                highlightOnHover
                progressPending={pendingTransferAdmin}
                progressComponent={<CustomLoader />}
                // pagination
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
                Total Page: {totalPageDanaMasukAdmin}
              </div>
              <Pagination
                activePage={activePageDanaMasukAdmin}
                itemsCountPerPage={pageNumberDanaMasukAdmin.row_per_page}
                totalItemsCount={
                  pageNumberDanaMasukAdmin.row_per_page *
                  pageNumberDanaMasukAdmin.max_page
                }
                pageRangeDisplayed={5}
                itemClass="page-item"
                linkClass="page-link"
                onChange={handlePageChangeDanaMasukAdmin}
              />
            </div>
          </div>
          <Modal
            centered
            show={showModalDetailTransferDanaAdmin}
            onHide={() => setShowModalDetailTransferDanaAdmin(false)}
            style={{ borderRadius: 8 }}
          >
            <Modal.Body
              style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 32,
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
                >
                  {/* ga boleh */}
                  Detail Transaksi
                </p>
              </div>
              <div>
                <Container
                  style={{ paddingLeft: "unset", paddingRight: "unset" }}
                >
                  <Row
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 12,
                      fontWeight: 400,
                    }}
                  >
                    <Col>ID Transaksi</Col>
                    <Col style={{ display: "flex", justifyContent: "end" }}>
                      Status
                    </Col>
                  </Row>
                  <Row
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    <Col>{detailTransferDanaAdmin.transaction_code}</Col>
                    <Col
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 4,
                        maxWidth: 175,
                        width: "100%",
                        height: 32,
                        fontWeight: 400,
                        background:
                          detailTransferDanaAdmin.tvatrans_status_id === 2
                            ? "rgba(7, 126, 134, 0.08)"
                            : detailTransferDanaAdmin.tvatrans_status_id ===
                                1 ||
                              detailTransferDanaAdmin.tvatrans_status_id === 7
                            ? "#FEF4E9"
                            : detailTransferDanaAdmin.tvatrans_status_id === 4
                            ? "#FDEAEA"
                            : detailTransferDanaAdmin.tvatrans_status_id ===
                                3 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                5 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                6 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                8 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                9 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                10 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                11 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                12 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                13 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                14 ||
                              detailTransferDanaAdmin.tvatrans_status_id === 15
                            ? "#F0F0F0"
                            : "",
                        color:
                          detailTransferDanaAdmin.tvatrans_status_id === 2
                            ? "#077E86"
                            : detailTransferDanaAdmin.tvatrans_status_id ===
                                1 ||
                              detailTransferDanaAdmin.tvatrans_status_id === 7
                            ? "#F79421"
                            : detailTransferDanaAdmin.tvatrans_status_id === 4
                            ? "#EE2E2C"
                            : detailTransferDanaAdmin.tvatrans_status_id ===
                                3 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                5 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                6 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                8 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                9 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                10 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                11 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                12 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                13 ||
                              detailTransferDanaAdmin.tvatrans_status_id ===
                                14 ||
                              detailTransferDanaAdmin.tvatrans_status_id === 15
                            ? "#888888"
                            : "",
                      }}
                    >
                      {detailTransferDanaAdmin.mstatus_name}
                    </Col>
                    <br />
                  </Row>
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 12,
                      fontWeight: 400,
                      marginTop: -10,
                    }}
                  >
                    {detailTransferDanaAdmin.tvatrans_crtdt}
                  </div>
                  <center>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "20px -15px 15px -15px",
                        width: 420,
                        height: 1,
                        padding: "0px 24px",
                        backgroundColor: "#EBEBEB",
                      }}
                    />
                  </center>
                  <div
                    style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}
                  >
                    Detail Pengiriman
                  </div>
                  <Row
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 12,
                      fontWeight: 400,
                      marginTop: 12,
                    }}
                  >
                    <Col>Nama Agen</Col>
                    <Col style={{ display: "flex", justifyContent: "end" }}>
                      ID Agen
                    </Col>
                  </Row>
                  <Row
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    <Col>{detailTransferDanaAdmin.mpartnerdtl_sub_name}</Col>
                    <Col style={{ display: "flex", justifyContent: "end" }}>
                      {detailTransferDanaAdmin.tvatrans_sub_partner_id}
                    </Col>
                  </Row>
                  <Row
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 12,
                      fontWeight: 400,
                      marginTop: 12,
                    }}
                  >
                    <Col>Nama Partner</Col>
                    <Col style={{ display: "flex", justifyContent: "end" }}>
                      ID Partner
                    </Col>
                  </Row>
                  <Row
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    <Col>{detailTransferDanaAdmin.mpartner_name}</Col>
                    <Col style={{ display: "flex", justifyContent: "end" }}>
                      {detailTransferDanaAdmin.mpartnerdtl_partner_id}
                    </Col>
                  </Row>
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 12,
                      fontWeight: 400,
                      marginTop: 12,
                    }}
                  >
                    No VA
                  </div>
                  <div
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {detailTransferDanaAdmin.tvatrans_va_number}
                  </div>
                  <center>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "20px -15px 15px -15px",
                        width: 420,
                        height: 1,
                        padding: "0px 24px",
                        backgroundColor: "#EBEBEB",
                      }}
                    />
                  </center>
                  <div
                    style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}
                  >
                    Rincian Dana
                  </div>
                  <Row
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 14,
                      fontWeight: 400,
                      marginTop: 12,
                    }}
                  >
                    <Col style={{ fontWeight: 400 }}>Jumlah Dana Diterima</Col>
                    <Col
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        fontWeight: 600,
                      }}
                    >
                      {convertToRupiah(detailTransferDanaAdmin.tvatrans_amount)}
                    </Col>
                  </Row>
                  <Row
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 14,
                      fontWeight: 400,
                      marginTop: 12,
                    }}
                  >
                    <Col style={{ fontWeight: 400 }}>
                      Biaya{" "}
                      {detailTransferDanaAdmin.mfitur_name === "Payment Link"
                        ? "Payment Link"
                        : "VA"}
                    </Col>
                    <Col
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        fontWeight: 600,
                      }}
                    >
                      {convertToRupiah(
                        detailTransferDanaAdmin.tvatrans_bank_fee
                      )}
                    </Col>
                  </Row>
                  <Row
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 14,
                      fontWeight: 400,
                      marginTop: 12,
                    }}
                  >
                    <Col style={{ fontWeight: 400 }}>Biaya Partner</Col>
                    <Col
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        fontWeight: 600,
                      }}
                    >
                      {convertToRupiah(
                        detailTransferDanaAdmin.tvatrans_partner_fee
                      )}
                    </Col>
                  </Row>
                  {/* <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                            <Col style={{ fontWeight: 400 }}>Biaya Settlement</Col>
                                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDanaAdmin.tvatrans_partner_fee)}</Col>
                                        </Row> */}
                  <center>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "20px -15px 15px -15px",
                        width: 420,
                        padding: "0px 24px",
                        border: "1px dashed #EBEBEB",
                      }}
                    />
                  </center>
                  <Row
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 16,
                      fontWeight: 700,
                      marginTop: 12,
                    }}
                  >
                    <Col>Total</Col>
                    <Col style={{ display: "flex", justifyContent: "end" }}>
                      {convertToRupiah(
                        detailTransferDanaAdmin.tvatrans_amount -
                          detailTransferDanaAdmin.tvatrans_bank_fee -
                          detailTransferDanaAdmin.tvatrans_partner_fee
                      )}
                    </Col>
                  </Row>
                </Container>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Button
                  variant="primary"
                  onClick={() => setShowModalDetailTransferDanaAdmin(false)}
                  style={{
                    fontFamily: "Exo",
                    color: "black",
                    background:
                      "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                    maxWidth: 125,
                    maxHeight: 45,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  Kembali
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
};

export default VaDanPaymentLink;
