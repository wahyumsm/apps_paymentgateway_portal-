import React, { useEffect, useState } from "react";
import { Col, Row, Form, Modal, Button, Table, ButtonGroup, Breadcrumb, InputGroup, Dropdown, Container, Image } from '@themesberg/react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import 'chart.js/auto';
import DataTable from 'react-data-table-component';
// import { TransactionsTable } from "../components/Tables";
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, RouteTo, setUserSession } from "../function/helpers";
import axios from "axios";
import encryptData from "../function/encryptData";
import * as XLSX from "xlsx"
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import loadingEzeelink from "../assets/img/technologies/Double Ring-1s-303px.svg"
// import { addDays } from "date-fns";
// import "./Transactions.css";
import {Pie, Line} from 'react-chartjs-2'
import { max } from "date-fns";
import breadcrumbsIcon from "../assets/icon/breadcrumbs_icon.svg";
import { chartColors } from "../data/colors";
import { useDispatch, useSelector } from "react-redux";
import { GetUserDetail } from "../redux/ActionCreators/UserDetailAction";
import Pagination from "react-js-pagination";
import ReactSelect, { components } from 'react-select';

export default () => {

  const history = useHistory();
  const access_token = getToken();
  const user_role = getRole()
  const [partnerId, setPartnerId] = useState("")
  const [listAgen, setListAgen] = useState([])
  const [listTransferDana, setListTransferDana] = useState([])
  const [listBank, setListBank] = useState([])
  const [topTenTransferDana, setTopTenTransferDana] = useState([])
  const [dataChartTransfer, setDataChartTransfer] = useState([])
  const [listSettlement, setListSettlement] = useState([])
  const [stateDanaMasuk, setStateDanaMasuk] = useState(null)
  const [stateSettlement, setStateSettlement] = useState(null)
  const [dateRangeDanaMasuk, setDateRangeDanaMasuk] = useState([])
  const [dateRangeSettlement, setDateRangeSettlement] = useState([])
  const [showDateDanaMasuk, setShowDateDanaMasuk] = useState("none")
  const [showDateSettlement, setShowDateSettlement] = useState("none")
  const [inputHandle, setInputHandle] = useState({
    idTransaksiDanaMasuk: "",
    idTransaksiSettlement: "",
    // namaAgenDanaMasuk: "",
    // bankDanaMasuk: "",
    partnerTransIdDanaMasuk: "",
    statusDanaMasuk: [],
    statusSettlement: "",
    fiturSettlement: 0,
    fiturDanaMasuk: 0,
    periodeDanaMasuk: 0,
    periodeSettlement: 0
  })
  const [pendingTransfer, setPendingTransfer] = useState(true)
  const [pendingSettlement, setPendingSettlement] = useState(true)
  const [detailTransferDana, setDetailTransferDana] = useState({})
  const [showModalDetailTransferDana, setShowModalDetailTransferDana] = useState(false)
  const [activePageDanaMasuk, setActivePageDanaMasuk] = useState(1)
  const [pageNumberDanaMasuk, setPageNumberDanaMasuk] = useState({})
  const [totalPageDanaMasuk, setTotalPageDanaMasuk] = useState(0)
  const [isFilterDanaMasuk, setIsFilterDanaMasuk] = useState(false)
  const [activePageSettlement, setActivePageSettlement] = useState(1)
  const [pageNumberSettlement, setPageNumberSettlement] = useState({})
  const [totalPageSettlement, setTotalPageSettlement] = useState(0)
  const [isFilterSettlement, setIsFilterSettlement] = useState(false)
  const currentDate = new Date().toISOString().split('T')[0]
  const oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()).toISOString().split('T')[0]

  const [selectedAgenDanaMasuk, setSelectedAgenDanaMasuk] = useState([])
  const [selectedBankDanaMasuk, setSelectedBankDanaMasuk] = useState([])

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
          color: "black"
      })
  }

  function handleChange(e) {
    setInputHandle({
        ...inputHandle,
        [e.target.name] : e.target.value
    })
  }

  function handleChangePeriodeTransfer(e) {
    if (e.target.value === "7") {
        setShowDateDanaMasuk("")
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    } else {
        setShowDateDanaMasuk("none")
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }
  }

  function pickDateDanaMasuk(item) {
    setStateDanaMasuk(item)
    if (item !== null) {
      item = item.map(el => el.toLocaleDateString('en-CA'))
      setDateRangeDanaMasuk(item)
    }
  }

  function handleChangePeriodeSettlement(e) {
    if (e.target.value === "7") {
        setShowDateSettlement("")
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    } else {
        setShowDateSettlement("none")
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }
  }

  function pickDateSettlement(item) {
    setStateSettlement(item)
    if (item !== null) {
      item = item.map(el => el.toLocaleDateString('en-CA'))
      setDateRangeSettlement(item)
    }
  }

  function handlePageChangeDanaMasuk(page) {
    // console.log(page, 'ini di gandle change page');
    // console.log(isFilterDanaMasuk, 'ini isFilterDanaMasuk');
    if (isFilterDanaMasuk) {
        setActivePageDanaMasuk(page)
        filterTransferButtonHandle(page, partnerId, inputHandle.idTransaksiDanaMasuk, selectedAgenDanaMasuk.length !== 0 ? selectedAgenDanaMasuk[0].value : "", inputHandle.periodeDanaMasuk, dateRangeDanaMasuk, inputHandle.statusDanaMasuk, 0, inputHandle.partnerTransIdDanaMasuk, selectedBankDanaMasuk.length !== 0 ? selectedBankDanaMasuk[0].value : "", inputHandle.fiturDanaMasuk)
    } else {
        setActivePageDanaMasuk(page)
        getListTransferDana(partnerId, page)
    }
  }

  function handlePageChangeSettlement(page) {
    // console.log(page, 'ini di gandle change page');
    // console.log(isFilterDanaMasuk, 'ini isFilterDanaMasuk');
    if (isFilterSettlement) {
        setActivePageSettlement(page)
        filterSettlementButtonHandle(inputHandle.idTransaksiSettlement, dateRangeSettlement, inputHandle.periodeSettlement, page, 0, inputHandle.statusDanaMasuk, inputHandle.fiturDanaMasuk)
    } else {
        setActivePageSettlement(page)
        getSettlement(page, currentDate)
    }
  }

  function getColors(length) {
    let colors = [];

    for (let i = 0; i < length; i++) {
        colors.push(chartColors[i % (chartColors.length)]);
    }

    return colors;
  }

  async function getDataAgen(partnerId) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"partner_id":"${partnerId}"}`)
      // console.log(dataParams, 'ini data params list agen');
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const listAgen = await axios.post(BaseURL + "/Partner/GetListAgen", { data: dataParams }, { headers: headers })
      // console.log(listAgen, 'ini list agen');
      if (listAgen.status === 200 && listAgen.data.response_code == 200 && listAgen.data.response_new_token.length === 0) {
        let newArr = []
        listAgen.data.response_data.forEach(e => {
            let obj = {}
            obj.value = e.agen_id
            obj.label = e.agen_name
            newArr.push(obj)
        })
        setListAgen(newArr)
        // setListAgen(listAgen.data.response_data)
      } else if (listAgen.status === 200 && listAgen.data.response_code == 200 && listAgen.data.response_new_token.length !== 0) {
        setUserSession(listAgen.data.response_new_token)
        setListAgen(listAgen.data.response_data)
      }
    } catch (error) {
      // console.log(error);
      history.push(errorCatch(error.response.status))
    }
  }

  async function userDetails() {
    try {
      const auth = "Bearer " + access_token
      const headers = {
          'Content-Type':'application/json',
          'Authorization' : auth
      }
      const userDetail = await axios.post(BaseURL + "/Account/GetUserProfile", { data: "" }, { headers: headers })
      // console.log(userDetail, 'ini user detal funct');
      if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length === 0) {
        setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
        getListTransferDana(userDetail.data.response_data.muser_partnerdtl_id, 1)
        getDataAgen(userDetail.data.response_data.muser_partnerdtl_id)
      } else if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length !== 0) {
        setUserSession(userDetail.data.response_new_token)
        setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
        getListTransferDana(userDetail.data.response_data.muser_partnerdtl_id, 1)
        getDataAgen(userDetail.data.response_data.muser_partnerdtl_id)
      }
  } catch (error) {
      // console.log(error);
      history.push(errorCatch(error.response.status))
    }
  }
  
  async function getListTransferDana(partnerId, currentPage) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"partner_id": "${partnerId}", "date_from": "", "date_to": "", "period": 2, "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10, "transactionID": 0, "sub_partner_id": "", "statusID": [1,2,7,9], "partner_trans_id" :"", "bank_code": "", "fitur_id": 0}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const listTransferDana = await axios.post(BaseURL + "/report/transferreport", { data: dataParams }, { headers: headers })
      // console.log(listTransferDana, 'ini list dana masuk');
      if (listTransferDana.status === 200 && listTransferDana.data.response_code === 200 && listTransferDana.data.response_new_token === null) {
        listTransferDana.data.response_data.results.list = listTransferDana.data.response_data.results.list.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
        setPageNumberDanaMasuk(listTransferDana.data.response_data)
        setTotalPageDanaMasuk(listTransferDana.data.response_data.max_page)
        setListTransferDana(listTransferDana.data.response_data.results.list)
        setPendingTransfer(false)
      } else if (listTransferDana.status === 200 && listTransferDana.data.response_code === 200 && listTransferDana.data.response_new_token !== null) {
        setUserSession(listTransferDana.data.response_new_token)
        listTransferDana.data.response_data.results.list = listTransferDana.data.response_data.results.list.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
        setPageNumberDanaMasuk(listTransferDana.data.response_data)
        setTotalPageDanaMasuk(listTransferDana.data.response_data.max_page)
        setListTransferDana(listTransferDana.data.response_data.results.list)
        setPendingTransfer(false)
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function getBankNameHandler() {
    try {
        const auth = 'Bearer ' + getToken();
        const dataParams = encryptData(`{"fitur_id": 100}`)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': auth
        }
        const listBankName = await axios.post(BaseURL + "/Home/BankGetList", {data: dataParams}, { headers: headers });
        if (listBankName.status === 200 && listBankName.data.response_code === 200 && listBankName.data.response_new_token.length === 0) {
          let newArr = []
          listBankName.data.response_data.forEach(e => {
              let obj = {}
              obj.value = e.mbank_code
              obj.label = e.mbank_name
              newArr.push(obj)
          })
          setListBank(newArr)
        } else if (listBankName.status === 200 && listBankName.data.response_code === 200 && listBankName.data.response_new_token.length !== 0) {
          let newArr = []
          listBankName.data.response_data.forEach(e => {
              let obj = {}
              obj.value = e.mbank_code
              obj.label = e.mbank_name
              newArr.push(obj)
          })
          setListBank(newArr)
        }
    } catch (error) {
        // console.log(error)
        history.push(errorCatch(error.response.status))
    }
}

  const data = [
    {
      id: "LD624621",
      name: "PT Lawred Jaya Amanah",
      total: 100888950,
      percentage: 10
    },
    {
      id: "LD624621",
      name: "PT Zalfa",
      total: 100888949,
      percentage: 10
    },
    {
      id: "LD624621",
      name: "PT Lawred Jaya Amanah",
      total: 100888950,
      percentage: 10
    },
    {
      id: "LD624621",
      name: "PT Lawred Jaya Amanah",
      total: 100888950,
      percentage: 10
    },
    {
      id: "LD6246215",
      name: "PT Lawred Jaya Amanah5",
      total: 100888950,
      percentage: 10
    },
    {
      id: "LD6246216",
      name: "PT Lawred Jaya Amanah6",
      total: 100888950,
      percentage: 10
    },
    {
      id: "LD6246217",
      name: "PT Lawred Jaya Amanah7",
      total: 100888950,
      percentage: 10
    },
    {
      id: "LD624621",
      name: "PT Lawred Jaya Amanah",
      total: 100888950,
      percentage: 10
    },
    {
      id: "LD624621",
      name: "PT Lawred Jaya Amanah",
      total: 100888950,
      percentage: 10
    },
    {
      id: "LD624622",
      name: "Lainnya",
      total: 100888988,
      percentage: 10
    }
  ]

  const datas = data.map((obj, id) => ({ ...obj, color: getColors(id+1).slice(-1)}))

  async function getSettlement(currentPage, currentDate) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"tvasettl_code":"", "statusID": [], "date_from":"", "date_to":"", "period": 2, "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10, "fitur_id": 0}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const dataSettlement = await axios.post(BaseURL + "/report/GetSettlementFilter", { data: dataParams }, { headers: headers })
      // console.log(dataSettlement, "data settlement");
      if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length === 0) {
        dataSettlement.data.response_data.results = dataSettlement.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
        setPageNumberSettlement(dataSettlement.data.response_data)
        setTotalPageSettlement(dataSettlement.data.response_data.max_page)
        setListSettlement(dataSettlement.data.response_data.results)        
        setPendingSettlement(false)
      } else if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length !== 0) {
        setUserSession(dataSettlement.data.response_new_token)
        dataSettlement.data.response_data.results = dataSettlement.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
        setPageNumberSettlement(dataSettlement.data.response_data)
        setTotalPageSettlement(dataSettlement.data.response_data.max_page)
        setListSettlement(dataSettlement.data.response_data.results)
        setPendingSettlement(false)
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function getSettlementChart(oneMonthAgo, currentDate) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"tvasettl_code":"", "tvasettl_from":"${oneMonthAgo}", "tvasettl_to":"${currentDate}"}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const dataChartTransfer = await axios.post(BaseURL + "/Report/GetSettlementChart", { data: dataParams }, { headers: headers })
      if (dataChartTransfer.data.response_code === 200 && dataChartTransfer.status === 200 && dataChartTransfer.data.response_new_token.length === 0) {
        dataChartTransfer.data.response_data = dataChartTransfer.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
        setDataChartTransfer(dataChartTransfer.data.response_data)
      } else if (dataChartTransfer.data.response_code === 200 && dataChartTransfer.status === 200 && dataChartTransfer.data.response_new_token.length !== 0) {
        setUserSession(dataChartTransfer.data.response_new_token)
        dataChartTransfer.data.response_data = dataChartTransfer.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
        setDataChartTransfer(dataChartTransfer.data.response_data)
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function filterTransferButtonHandle(page, partnerId, idTransaksi, namaAgen, dateId, periode, status, rowPerPage, partnerTransId, bankName, fiturDanaMasuk) {
    try {
      setPendingTransfer(true)
      setIsFilterDanaMasuk(true)
      setActivePageDanaMasuk(page)
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"partner_id": "${partnerId}", "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "period": ${dateId}, "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "transactionID": ${(idTransaksi.length !== 0) ? idTransaksi : 0}, "sub_partner_id": "${(namaAgen.length !== 0) ? namaAgen : ""}", "statusID": [${(status.length !== 0) ? status : [1,2,7,9]}], "partner_trans_id": "${partnerTransId}", "bank_code":"${bankName}", "fitur_id": ${fiturDanaMasuk}}`)
      // const dataParam = encryptData(`{"start_time": "${(periode.length !== 0) ? periode[0] : ""}", "end_time": "${(periode.length !== 0) ? periode[1] : ""}", "sub_name": "${(namaAgen.length !== 0) ? namaAgen : ""}", "id": "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "status": "${(status.length !== 0) ? status : ""}"}`)
      // console.log(dataParams, "ini data params dana masuk filter");
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const filterTransferDana = await axios.post(BaseURL + "/report/transferreport", { data: dataParams }, { headers: headers })
      // console.log(filterTransferDana, "ini data filter transfer dana");
      if (filterTransferDana.status === 200 && filterTransferDana.data.response_code === 200 && filterTransferDana.data.response_new_token === null) {
        filterTransferDana.data.response_data.results.list = filterTransferDana.data.response_data.results.list.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
        setPageNumberDanaMasuk(filterTransferDana.data.response_data)
        setTotalPageDanaMasuk(filterTransferDana.data.response_data.max_page)
        setListTransferDana(filterTransferDana.data.response_data.results.list)
        setPendingTransfer(false)
      } else if (filterTransferDana.status === 200 && filterTransferDana.data.response_code === 200 && filterTransferDana.data.response_new_token !== null) {
        setUserSession(filterTransferDana.data.response_new_token)
        filterTransferDana.data.response_data.results.list = filterTransferDana.data.response_data.results.list.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
        setPageNumberDanaMasuk(filterTransferDana.data.response_data)
        setTotalPageDanaMasuk(filterTransferDana.data.response_data.max_page)
        setListTransferDana(filterTransferDana.data.response_data.results.list)
        setPendingTransfer(false)
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  async function filterSettlementButtonHandle(idTransaksi, periode, dateId, page, rowPerPage, status, fitur) {
    // console.log("ini filter settlement");
    try {
      setPendingSettlement(true)
      setIsFilterSettlement(true)
      setActivePageSettlement(page)
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"tvasettl_code": "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "statusID": [${(status.length !== 0) ? status : []}], "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to":"${(periode.length !== 0) ? periode[1] : ""}", "period": ${dateId}, "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "fitur_id":${fitur}}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const filterSettlement = await axios.post(BaseURL + "/report/GetSettlementFilter", { data: dataParams }, { headers: headers })
      if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length === 0) {
        filterSettlement.data.response_data.results = filterSettlement.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
        setListSettlement(filterSettlement.data.response_data.results)
        setTotalPageSettlement(filterSettlement.data.response_data.max_page)
        setPageNumberSettlement(filterSettlement.data.response_data)
        setPendingSettlement(false)
      } else if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length !== 0) {
        setUserSession(filterSettlement.data.response_new_token)
        filterSettlement.data.response_data.results = filterSettlement.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
        setListSettlement(filterSettlement.data.response_data.results)
        setTotalPageSettlement(filterSettlement.data.response_data.max_page)
        setPageNumberSettlement(filterSettlement.data.response_data)
        setPendingSettlement(false)
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
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
          fiturDanaMasuk: 0
      })
      setSelectedAgenDanaMasuk([])
      setSelectedBankDanaMasuk([])
      setStateDanaMasuk(null)
      setDateRangeDanaMasuk([])
      setShowDateDanaMasuk("none")
    } else {
      setInputHandle({
          ...inputHandle,
          idTransaksiSettlement: "",
          statusSettlement: [],
          periodeSettlement: 0, 
          fiturSettlement: 0
      })
      setStateSettlement(null)
      setDateRangeSettlement([])
      setShowDateSettlement("none")
    }
  }

  function toDashboard() {
    history.push("/");
  }

  function toLaporan() {
    history.push("/laporan");
  }

  useEffect(() => {
    if (!access_token) {
      history.push('/login');
    }
    userDetails()
    getSettlement(1, currentDate)
    getSettlementChart(oneMonthAgo, currentDate)
    getBankNameHandler()
  }, [access_token])

  async function detailListTransferHandler(trxId) {
    try {
      const auth = "Bearer " + getToken()
      const dataParams = encryptData(`{"tvatrans_trx_id":${trxId}}`)
      const headers = {
        'Content-Type':'application/json',
        'Authorization' : auth
      }
      const detailTransaksi = await axios.post(BaseURL + "/Report/GetTransferReportDetail", { data: dataParams }, { headers: headers })
      // console.log(detailTransaksi, 'ini detail');
      if (detailTransaksi.status === 200 && detailTransaksi.data.response_code === 200 && detailTransaksi.data.response_new_token.length === 0) {
        setDetailTransferDana(detailTransaksi.data.response_data)
        setShowModalDetailTransferDana(true)
      } else if (detailTransaksi.status === 200 && detailTransaksi.data.response_code === 200 && detailTransaksi.data.response_new_token.length !== 0) {
        setUserSession(detailTransaksi.data.response_new_token)
        setDetailTransferDana(detailTransaksi.data.response_data)
        setShowModalDetailTransferDana(true)
      }
    } catch (error) {
      // console.log(error)
      history.push(errorCatch(error.response.status))
    }
  }

  const columnstransferDana = [
    {
        name: 'No',
        selector: row => row.number,
        width: "67px"
    },
    {
        name: 'ID Transaksi',
        selector: row => row.id,
        cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.id)}>{row.id}</Link>
    },
    {
        name: 'Waktu',
        selector: row => row.created_at,
        width: "145px"
    },
    {
        name: 'Partner Trans ID',
        selector: row => row.partner_trx_id,
        wrap: true,
        width: "160px"
    },
    {
      name: 'Nama Agen',
      selector: row => row.name,
        wrap: true,
      style: { paddingRight: 'unset' },
      // width: "160px"
    },
    {
      name: 'Nama Bank',
      selector: row => row.bank_name,
        wrap: true,
      style: { paddingRight: 'unset' },
      // width: "145px"
    },
    {
      name: 'Jenis Transaksi',
      selector: row => row.fiturID,
      // sortable: true
      style: { display: "flex", flexDirection: "row", justifyContent: "center", paddingRight: 'unset', },
      // width: "145px"
    },
    {
        name: 'Total Akhir',
        selector: row => row.amount,
        cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItem: "center" }}>{ convertToRupiah(row.amount) }</div>,
        style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", },
        width: "145px"
      },
    {
        name: 'Status',
        selector: row => row.status,
        width: "150px",
        style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px 20px", width: "100%", borderRadius: 4 },
        conditionalCellStyles: [
          {
            when: row => row.status_id === "2",
            style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
          },
          {
            when: row => row.status_id === "1" || row.status_id === "7",
            style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
          },
          {
            when: row => row.status_id === "4" || row.status_id === "9",
            style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
          },
          {
            when: row => row.status_id === "3" || row.status_id === "5" || row.status_id === "6" || row.status_id === "8" || row.status_id === "10" || row.status_id === "11" || row.status_id === "12" || row.status_id === "13" || row.status_id === "14" || row.status_id === "15",
            style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
          }
        ],
    },
  ];

  const columnsSettlement = [
    {
        name: 'No',
        selector: row => row.number,
        width: "67px"
    },
    {
        name: 'ID Transaksi',
        selector: row => row.tvasettl_code,
        cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}/${'0'}`}>{row.tvasettl_code}</Link>,
        width: "251px"
    },
    {
        name: 'Waktu',
        selector: row => row.tvasettl_crtdt,
    },
    {
      name: 'Jenis Transaksi',
      selector: row => row.mfitur_desc,
      // sortable: true
    },
    {
        name: 'Jumlah',
        selector: row => row.tvasettl_amount,
        cell: row => <div style={{ padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>
    },
    {
        name: 'Status',
        selector: row => row.mstatus_name,
        width: "127px",
        style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: 6, margin: "6px 16px", width: "50%", borderRadius: 4 },
        conditionalCellStyles: [
          {
            when: row => row.tvasettl_status_id === 2,
            style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
          },
          {
            when: row => row.tvasettl_status_id === 1 || row.tvasettl_status_id === 7,
            style: { background: "#FEF4E9", color: "#F79421" }
          },
          {
            when: row => row.tvasettl_status_id === 4,
            style: { background: "#FDEAEA", color: "#EE2E2C" }
          },
          {
            when: row => row.tvasettl_status_id === 3 || row.tvasettl_status_id === 5 || row.tvasettl_status_id === 6 || row.tvasettl_status_id === 8 || row.tvasettl_status_id === 9 || row.tvasettl_status_id === 10 || row.tvasettl_status_id === 11 || row.tvasettl_status_id === 12 || row.tvasettl_status_id === 13 || row.tvasettl_status_id === 14 || row.tvasettl_status_id === 15,
            style: { background: "#F0F0F0", color: "#888888" }
          }
        ],
    },
  ];

  const customStyles = {
      headCells: {
          style: {
              backgroundColor: '#F2F2F2',
              border: '12px',
              fontWeight: 'bold',
              fontSize: '16px',
              display: 'flex',
              justifyContent: 'flex-start',
              width: '150px'
          },
      },
  };

  function exportReportTransferDanaMasukHandler(isFilter, partnerId, idTransaksi, namaAgen, dateId, periode, status, partnerTransId, bankName, fiturDanaMasuk) {
    if (isFilter) {
      async function exportFilterDanaMasuk(partnerId, idTransaksi, namaAgen, dateId, periode, status, partnerTransId, bankName, fiturDanaMasuk) {
        try {
          const auth = "Bearer " + getToken()
          const dataParams = encryptData(`{"partner_id": "${partnerId}", "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "period": ${dateId}, "page": 1, "row_per_page": 1000000, "transactionID": ${(idTransaksi.length !== 0) ? idTransaksi : 0}, "sub_partner_id": "${(namaAgen.length !== 0) ? namaAgen : ""}", "statusID": [${(status.length !== 0) ? status : [1,2,7,9]}], "partner_trans_id":"${partnerTransId}", "bank_code":"${bankName}", "fitur_id": ${fiturDanaMasuk}}`)
          // const dataParam = encryptData(`{"start_time": "${(periode.length !== 0) ? periode[0] : ""}", "end_time": "${(periode.length !== 0) ? periode[1] : ""}", "sub_name": "${(namaAgen.length !== 0) ? namaAgen : ""}", "id": "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "status": "${(status.length !== 0) ? status : ""}"}`)
          // console.log(dataParams, "ini data params dana masuk filter");
          const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const dataExportFilter = await axios.post(BaseURL + "/report/transferreport", { data: dataParams }, { headers: headers })
          // console.log(dataExportFilter, "ini data filter transfer dana");
          if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
            const data = dataExportFilter.data.response_data.results.list
            let dataExcel = []
            for (let i = 0; i < data.length; i++) {
                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].id, "Waktu": data[i].created_at, "Partner Trans ID": data[i].partner_trx_id, "Nama Agen": data[i].name, "Nama Bank": data[i].bank_name, "Jenis Transaksi": data[i].fiturID, "Total Akhir": data[i].amount, Status: data[i].status })
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Laporan Dana Masuk.xlsx");
          } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token !== null) {
            setUserSession(dataExportFilter.data.response_new_token)
            const data = dataExportFilter.data.response_data.results.list
            let dataExcel = []
            for (let i = 0; i < data.length; i++) {
                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].id, "Waktu": data[i].created_at, "Partner Trans ID": data[i].partner_trx_id, "Nama Agen": data[i].name, "Nama Bank": data[i].bank_name, "Jenis Transaksi": data[i].fiturID, "Total Akhir": data[i].amount, Status: data[i].status })
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Laporan Dana Masuk.xlsx");            
          }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
      }
      exportFilterDanaMasuk(partnerId, idTransaksi, namaAgen, dateId, periode, status, partnerTransId, bankName, fiturDanaMasuk)
    } else {
      async function exportGetListTransferDana(partnerId) {
        try {
          const auth = "Bearer " + getToken()
          const dataParams = encryptData(`{"partner_id": "${partnerId}", "date_from": "", "date_to": "", "period": 2, "page": 1, "row_per_page": 1000000, "transactionID": 0, "sub_partner_id": "", "statusID": [1,2,7,9], "partner_trans_id":"", "bank_code":"", "fitur_id": 0}`)
          const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const dataExportDefault = await axios.post(BaseURL + "/report/transferreport", { data: dataParams }, { headers: headers })
          // console.log(dataExportDefault, 'ini list');
          if (dataExportDefault.status === 200 && dataExportDefault.data.response_code === 200 && dataExportDefault.data.response_new_token === null) {
            const data = dataExportDefault.data.response_data.results.list
            let dataExcel = []
            for (let i = 0; i < data.length; i++) {
                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].id, "Waktu": data[i].created_at, "Partner Trans ID": data[i].partner_trx_id, "Nama Agen": data[i].name, "Nama Bank": data[i].bank_name, "Jenis Transaksi": data[i].fiturID, "Total Akhir": data[i].amount, Status: data[i].status })
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Laporan Dana Masuk.xlsx");            
            
          } else if (dataExportDefault.status === 200 && dataExportDefault.data.response_code === 200 && dataExportDefault.data.response_new_token !== null) {
            setUserSession(dataExportDefault.data.response_new_token)
            const data = dataExportDefault.data.response_data.results.list
            let dataExcel = []
            for (let i = 0; i < data.length; i++) {
                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].id, "Waktu": data[i].created_at, "Partner Trans ID": data[i].partner_trx_id, "Nama Agen": data[i].name, "Nama Bank": data[i].bank_name, "Jenis Transaksi": data[i].fiturID, "Total Akhir": data[i].amount, Status: data[i].status })
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Laporan Dana Masuk.xlsx");
            
          }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
      }
      exportGetListTransferDana(partnerId)
    }
  }

  function exportReportSettlementHandler(isFilter, idTransaksi, periode, dateId, status, fitur, oneMonthAgo, currentDate) {
    if (isFilter) {
      async function exportFilterSettlement(idTransaksi, periode, dateId, status, fitur) {
        try {
          const auth = "Bearer " + getToken()
          const dataParams = encryptData(`{"tvasettl_code": "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "statusID": [${(status.length !== 0) ? status : []}], "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to":"${(periode.length !== 0) ? periode[1] : ""}", "period": ${dateId}, "page": 1, "row_per_page": 1000000, "fitur_id":${fitur}}`)
          const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const dataExportFilter = await axios.post(BaseURL + "/report/GetSettlementFilter", { data: dataParams }, { headers: headers })
          if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
            const data = dataExportFilter.data.response_data.results = dataExportFilter.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
            let dataExcel = []
            for (let i = 0; i < data.length; i++) {
                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, "Waktu": data[i].tvasettl_crtdt, "Jenis Transaksi": data[i].mfitur_desc, "Jumlah": data[i].tvasettl_amount, Status: data[i].mstatus_name })
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Laporan Settlement.xlsx");
          } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {            
            setUserSession(dataExportFilter.data.response_new_token)
            const data = dataExportFilter.data.response_data.results = dataExportFilter.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
            let dataExcel = []
            for (let i = 0; i < data.length; i++) {
                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, "Waktu": data[i].tvasettl_crtdt, "Jenis Transaksi": data[i].mfitur_desc, "Jumlah": data[i].tvasettl_amount, Status: data[i].mstatus_name })
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Laporan Settlement.xlsx");
          }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
      }
      exportFilterSettlement(idTransaksi, periode, dateId, status, fitur)
    } else {
      async function exportGetSettlement(oneMonthAgo, currentDate) {
        try {
          const auth = "Bearer " + getToken()
          const dataParams = encryptData(`{"tvasettl_code":"", "statusID": [], "date_from":"${currentDate}", "date_to":"${currentDate}", "period": 2, "page": 1, "row_per_page": 1000000, "fitur_id": 0}`)
          const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const dataSettlement = await axios.post(BaseURL + "/report/GetSettlementFilter", { data: dataParams }, { headers: headers })
          // console.log(dataSettlement, "data settlement");
          if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length === 0) {
            const data = dataSettlement.data.response_data.results = dataSettlement.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
            let dataExcel = []
            for (let i = 0; i < data.length; i++) {
                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, "Waktu": data[i].tvasettl_crtdt, "Jenis Transaksi": data[i].mfitur_desc, "Jumlah": data[i].tvasettl_amount, Status: data[i].mstatus_name })
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Laporan Settlement.xlsx");
          } else if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length !== 0) {
            setUserSession(dataSettlement.data.response_new_token)
            const data = dataSettlement.data.response_data.results = dataSettlement.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
            let dataExcel = []
            for (let i = 0; i < data.length; i++) {
                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, "Waktu": data[i].tvasettl_crtdt, "Jenis Transaksi": data[i].mfitur_desc, "Jumlah": data[i].tvasettl_amount, Status: data[i].mstatus_name })
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Laporan Settlement.xlsx");
          }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
      }
      exportGetSettlement(oneMonthAgo, currentDate)
    }
  }

  const CustomLoader = () => (
    <div style={{ padding: '24px' }}>
      <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
      <div>Loading...</div>
    </div>
  );

  return (
    <>
      <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
        <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }} onClick={() => toLaporan()}>Laporan</span></span>
        <div className="head-title">
          <h2 className="h4 mt-4">Laporan</h2>
        </div>
        <h2 className="h5 mt-3">Dana Masuk</h2>
        <div className='base-content'>
          {/* <div className='dana-amount'>
              <div className="card-information mb-3" style={{border: '1px solid #EBEBEB', width: 250}}>
                  <p className="p-info">Detail Dana Masuk dari Agen</p>
                  <p className="p-amount">Rp. 49.700.000</p>
              </div>
          </div> */}
          {/* <Row>
            <Col xs={4}>
              <Pie
                id="myChart"
                className="mt-3 mb-3"
                data={{
                  labels: topTenTransferDana.map((item) => item.name),
                  // labels: data.map(o => o.name),
                  datasets: [{
                    label: "chart",
                    // data: data.map(o => o.total),
                    data: topTenTransferDana.map((item) => item.total),
                    fill: true,
                    backgroundColor: getColors(topTenTransferDana.length),
                    hoverBackgroundColor: getColors(topTenTransferDana.length),
                    hoverOffset: 4,
                  }]
                }}
                height={350}
                width={700}
                options= {{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      displayColors: false,                              
                    }
                  },
                  responsive: true,
                  scales: {
                    xAxes: {
                      grid: {
                        display: false,
                        drawBorder: false
                      },
                      beginAtZero: false,
                      ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45,
                        display: false
                      }
                    },
                    yAxes: {                        
                      grid: {
                        display: false,
                        drawBorder: false
                      },
                      beginAtZero: true,
                      ticks: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </Col>
            <Col xs={4} className="d-flex flex-column justify-content-start py-5 ps-5">
            <table className="report-pie-table">
              <thead></thead>
                <tbody>
                  {topTenTransferDana.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td><div className="circle-data" style={{backgroundColor: item.color}}></div></td>
                        <td>
                          <span className="p-info" style={{fontSize: 14}}>{item.name}</span><br/>
                          <span className="p-amount" style={{fontSize: 14}}>{convertToRupiah(item.total)} ( {item.percentage}% )</span>
                        </td>
                      </tr>
                    )
                  }).slice(0, 5)}
                </tbody>
              </table>
            </Col>
            <Col xs={4} className="d-flex flex-column justify-content-start py-5">
            <table className="report-pie-table">
              <thead></thead>
                <tbody>
                  {topTenTransferDana.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td><div className="circle-data" style={{backgroundColor: item.color}}></div></td>
                        <td>
                          <span className="p-info" style={{fontSize: 14}}>{item.name}</span><br/>
                          <span className="p-amount" style={{fontSize: 14}}>{convertToRupiah(item.total)} ( {item.percentage}% )</span>
                        </td>
                      </tr>
                    )
                  }).slice(5, 10)}
                </tbody>
              </table>
            </Col>
          </Row> */}
            <Row className='mt-4'>
            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                <Col xs={4} className="d-flex justify-content-start align-items-center">
                    <span className="pe-1">ID Transaksi</span>
                    <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiDanaMasuk} name="idTransaksiDanaMasuk" type='text'className='input-text-riwayat' style={{marginLeft: 31}} placeholder='Masukkan ID Transaksi'/>
                </Col>
                <Col xs={4} className="d-flex justify-content-start align-items-center">
                    <span className="pe-3">Nama Agen</span>
                    <div className="dropdown dropPartner">
                      <ReactSelect
                        // isMulti
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                        options={listAgen}
                        // allowSelectAll={true}
                        value={selectedAgenDanaMasuk}
                        onChange={(selected) => setSelectedAgenDanaMasuk([selected])}
                        placeholder="Pilih Nama Partner"
                        components={{ Option }}
                        styles={customStylesSelectedOption}
                      />
                    </div>
                    {/* <Form.Select name="namaAgenDanaMasuk" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.namaAgenDanaMasuk} onChange={(e) => handleChange(e)}>
                      <option defaultValue value="">Pilih Nama Agen</option>
                      {
                        listAgen.length !== 0 &&
                        listAgen.map((item, idx) => {
                          return (
                            <option key={idx} value={item.agen_id}>{ item.agen_name }</option>
                          )
                        })
                      }
                    </Form.Select> */}
                    {/* <input onChange={(e) => handleChange(e)} value={inputHandle.namaAgenDanaMasuk} name="namaAgenDanaMasuk" type='text'className='input-text-ez' placeholder='Masukkan Nama Agen'/> */}
                </Col>
                <Col xs={4} className="d-flex justify-content-start align-items-center">
                    <span className="pe-4">Status</span>
                    <Form.Select name="statusDanaMasuk" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.statusDanaMasuk} onChange={(e) => handleChange(e)}>
                      <option defaultChecked disabled value="">Pilih Status</option>
                      <option value={2}>Berhasil</option>
                      <option value={1}>Dalam Proses</option>
                      <option value={7}>Menunggu Pembayaran</option>
                      <option value={9}>Kadaluwarsa</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateDanaMasuk === "none") ? "33%" : "33%" }}>
                  <span className="me-3">Periode*</span>
                  <Form.Select name='periodeDanaMasuk' className="input-text-riwayat ms-5" value={inputHandle.periodeDanaMasuk} onChange={(e) => handleChangePeriodeTransfer(e)}>
                    <option defaultChecked disabled value={0}>Pilih Periode</option>
                    <option value={2}>Hari Ini</option>
                    <option value={3}>Kemarin</option>
                    <option value={4}>7 Hari Terakhir</option>
                    <option value={5}>Bulan Ini</option>
                    <option value={6}>Bulan Kemarin</option>
                    <option value={7}>Pilih Range Tanggal</option>
                  </Form.Select>                 
                </Col>
                <Col xs={4} className="d-flex justify-content-start align-items-center">
                    <span>Jenis Transaksi</span>
                    <Form.Select name='fiturDanaMasuk' onChange={(e) => handleChange(e)} value={inputHandle.fiturDanaMasuk} className='input-text-ez' style={{ display: "inline" }}>
                      <option defaultValue value={0}>Pilih Jenis Transaksi</option>
                      <option value={104}>Payment Link</option>
                      <option value={100}>Virtual Account</option>
                    </Form.Select>
                </Col>
                <Col xs={4} className="d-flex justify-content-start align-items-center">
                    <span className="me-2">Nama Bank</span>
                    <div className="dropdown dropPartner">
                      <ReactSelect
                        // isMulti
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                        options={listBank}
                        // allowSelectAll={true}
                        value={selectedBankDanaMasuk}
                        onChange={(selected) => setSelectedBankDanaMasuk([selected])}
                        placeholder="Pilih Nama Bank"
                        components={{ Option }}
                        styles={customStylesSelectedOption}
                      />
                    </div>
                    {/* <Form.Select name='bankDanaMasuk' className='input-text-riwayat ms-3' style={{ display: "inline" }} value={inputHandle.bankDanaMasuk} onChange={(e) => handleChange(e)}>
                        <option defaultValue value={""}>Pilih Nama Bank</option>
                        {
                            listBank.map((item, idx) => {
                                return (
                                    <option key={idx} value={item.mbank_code}>{item.mbank_name}</option>
                                )
                            })
                        }
                    </Form.Select> */}
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col xs={4} style={{ display: showDateDanaMasuk }}>
                    <DateRangePicker
                      onChange={pickDateDanaMasuk}
                      value={stateDanaMasuk}
                      clearIcon={null}
                    />
                </Col>
                <Col xs={4} className="d-flex justify-content-start align-items-center">
                    <span className="pe-2">Partner Trans ID</span>
                    <input onChange={(e) => handleChange(e)} value={inputHandle.partnerTransIdDanaMasuk} name="partnerTransIdDanaMasuk" type='text' className='input-text-riwayat ms-1' placeholder='Masukkan Partner Trans ID'/>
                </Col>           
                
            </Row>
            <Row className='mt-4'>
                <Col xs={5}>
                    <Row>
                        <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                            <button
                              onClick={() => filterTransferButtonHandle(1, partnerId, inputHandle.idTransaksiDanaMasuk, selectedAgenDanaMasuk.length !== 0 ? selectedAgenDanaMasuk[0].value : "", inputHandle.periodeDanaMasuk, dateRangeDanaMasuk, inputHandle.statusDanaMasuk, 0, inputHandle.partnerTransIdDanaMasuk, selectedBankDanaMasuk.length !== 0 ? selectedBankDanaMasuk[0].value : "", inputHandle.fiturDanaMasuk)}
                              // className={(dateRangeDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.idTransaksiDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.statusDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.namaAgenDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.fiturDanaMasuk.length !== 0) ? "btn-ez-on" : "btn-ez"}
                              // disabled={dateRangeDanaMasuk.length === 0 || dateRangeDanaMasuk.length === 0 && inputHandle.idTransaksiDanaMasuk.length === 0 || dateRangeDanaMasuk.length === 0 && inputHandle.statusDanaMasuk.length === 0 || dateRangeDanaMasuk.length === 0 && inputHandle.namaAgenDanaMasuk.length === 0 || dateRangeDanaMasuk.length === 0 && inputHandle.fiturDanaMasuk.length === 0}
                              // onClick={() => filterTransferButtonHandle(1, partnerId, inputHandle.idTransaksiDanaMasuk, inputHandle.namaAgenDanaMasuk, inputHandle.periodeDanaMasuk, dateRangeDanaMasuk, inputHandle.statusDanaMasuk, 0)}
                              className={(inputHandle.periodeDanaMasuk !== 0 || dateRangeDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.idTransaksiDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.statusDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && selectedAgenDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && selectedBankDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.fiturDanaMasuk.length !== 0) ? "btn-ez-on" : "btn-ez"}
                              disabled={inputHandle.periodeDanaMasuk === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.idTransaksiDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.statusDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && selectedAgenDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && selectedBankDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.fiturDanaMasuk.length === 0}
                            >
                              Terapkan
                            </button>
                        </Col>
                        <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                            <button
                              onClick={() => resetButtonHandle("Dana Masuk")}
                              className={(inputHandle.periodeDanaMasuk || dateRangeDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.idTransaksiDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.statusDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && selectedAgenDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && selectedBankDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.fiturDanaMasuk.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                              disabled={inputHandle.periodeDanaMasuk === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.idTransaksiDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.statusDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && selectedAgenDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && selectedBankDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.fiturDanaMasuk.length === 0}
                            >
                              Atur Ulang
                            </button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {
              // listTransferDana.length !== 0 &&
              listTransferDana.length !== 0 &&
              <div>
                <Link onClick={() => exportReportTransferDanaMasukHandler(isFilterDanaMasuk, partnerId, inputHandle.idTransaksiDanaMasuk, selectedAgenDanaMasuk.length !== 0 ? selectedAgenDanaMasuk[0].value : "", inputHandle.periodeDanaMasuk, dateRangeDanaMasuk, inputHandle.statusDanaMasuk, inputHandle.partnerTransIdDanaMasuk, selectedBankDanaMasuk.length !== 0 ? selectedBankDanaMasuk[0].value : "", inputHandle.fiturDanaMasuk)} className="export-span">Export</Link>
              </div>
            }
            <br/>
            <br/>
            <div className="div-table">
                <DataTable
                    columns={columnstransferDana}
                    data={listTransferDana}
                    customStyles={customStyles}
                    // pagination
                    highlightOnHover
                    progressPending={pendingTransfer}
                    progressComponent={<CustomLoader />}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
            <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageDanaMasuk}</div>
              <Pagination
                  activePage={activePageDanaMasuk}
                  itemsCountPerPage={pageNumberDanaMasuk.row_per_page}
                  totalItemsCount={(pageNumberDanaMasuk.row_per_page*pageNumberDanaMasuk.max_page)}
                  pageRangeDisplayed={5}
                  itemClass="page-item"
                  linkClass="page-link"
                  onChange={handlePageChangeDanaMasuk}
              />
            </div>
        </div>
        <h2 className="h5 mt-5">Settlement</h2>
        <div className='base-content'>
          <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Detail Settlement</span>
          {/* {dataChartTransfer.length > 0 ? */}
            {/* <Line
            className="mt-3 mb-3"
            data={{
              labels: dataChartTransfer.map(obj => obj.dates),
              datasets: [
                {
                  label: null,
                  fill: true,
                  // backgroundColor: gradient,
                  backgroundColor: "rgba(156, 67, 223, 0.38)",
                  borderColor: "#9C43DF",
                  pointBackgroundColor: "rgba(220, 220, 220, 1)",
                  pointBorderColor: "#9C43DF",
                  data: dataChartTransfer.map(obj => obj.nominal_day)
                },
              ],
            }}
            height={100}
            width={200}
            options= {{
              plugins: {
                legend: {
                  display: false
                },
              },
              responsive: true,
              scales: {
                xAxes: {
                  beginAtZero: false,
                  ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45
                  }
                },
                yAxes: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 2000
                  }
                }
              }
            }}
          /> */}
            {/* <Row>
              <Col xs={12}>
                <div className="div-chart">
                  <Chart type='line' data={data} />
                </div>
              </Col>
            </Row>             */}
            {/* <br/> */}
            <Row className='mt-4'>
              <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                <Col xs={4} className="d-flex justify-content-start align-items-center">
                    <span className="me-1">ID Transaksi</span>
                    <input name="idTransaksiSettlement" onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiSettlement} type='text'className='input-text-riwayat' style={{marginLeft: 31}} placeholder='Masukkan ID Transaksi'/>
                </Col>
                <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateDanaMasuk === "none") ? "33%" : "33%" }}>
                    <span >Periode*</span>
                    <Form.Select name='periodeSettlement' className="input-text-riwayat ms-3" value={inputHandle.periodeSettlement} onChange={(e) => handleChangePeriodeSettlement(e)}>
                      <option defaultChecked disabled value={0}>Pilih Periode</option>
                      <option value={2}>Hari Ini</option>
                      <option value={3}>Kemarin</option>
                      <option value={4}>7 Hari Terakhir</option>
                      <option value={5}>Bulan Ini</option>
                      <option value={6}>Bulan Kemarin</option>
                      <option value={7}>Pilih Range Tanggal</option>
                  </Form.Select>                    
                </Col>                
                <Col xs={4}>
                    <span>Status</span>
                    <Form.Select name="statusSettlement" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.statusSettlement} onChange={(e) => handleChange(e)}>
                      <option defaultChecked disabled value="">Pilih Status</option>
                      <option value={2}>Berhasil</option>
                      <option value={1}>Dalam Proses</option>
                      {/* <option value={3}>Pending</option> */}
                      <option value={4}>Gagal</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row className='mt-4'>
              <Col xs={4} className="d-flex justify-content-start align-items-center">
                <span>Jenis Transaksi</span>
                <Form.Select name="fiturSettlement" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.fiturSettlement} onChange={(e) => handleChange(e)}>
                  <option defaultValue value={0}>Pilih Jenis Transaksi</option>
                  <option value={104}>Payment Link</option>
                  <option value={100}>VA Partner</option>
                </Form.Select>
              </Col>
              <Col xs={4} style={{ display: showDateSettlement }}>
                <DateRangePicker
                  onChange={pickDateSettlement}
                  value={stateSettlement}
                  clearIcon={null}
                />
              </Col>
            </Row>
            <Row className='mt-4'>
                <Col xs={5}>
                    <Row>
                        <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                            <button
                              onClick={() => filterSettlementButtonHandle(inputHandle.idTransaksiSettlement, dateRangeSettlement, inputHandle.periodeSettlement, 1, 0, inputHandle.statusSettlement, inputHandle.fiturSettlement)}
                              className={(inputHandle.periodeSettlement !== 0 || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0) ? "btn-ez-on" : "btn-ez"}
                              disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0}
                            >
                              Terapkan
                            </button>
                        </Col>
                        <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                            <button
                              onClick={() => resetButtonHandle("Settlement")}
                              className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                              disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0}
                            >
                              Atur Ulang
                            </button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {
              listSettlement.length !== 0 &&
              <div>
                <Link onClick={() => exportReportSettlementHandler(isFilterSettlement, inputHandle.idTransaksiSettlement, dateRangeSettlement, inputHandle.periodeSettlement, inputHandle.statusSettlement, inputHandle.fiturSettlement, oneMonthAgo, currentDate)} className="export-span">Export</Link>
              </div>
            }
            <br/>
            <br/>
            <div className="div-table">
                <DataTable
                    columns={columnsSettlement}
                    data={listSettlement}
                    customStyles={customStyles}
                    progressPending={pendingSettlement}
                    progressComponent={<CustomLoader />}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
            <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageSettlement}</div>
              <Pagination
                  activePage={activePageSettlement}
                  itemsCountPerPage={pageNumberSettlement.row_per_page}
                  totalItemsCount={(pageNumberSettlement.row_per_page*pageNumberSettlement.max_page)}
                  pageRangeDisplayed={5}
                  itemClass="page-item"
                  linkClass="page-link"
                  onChange={handlePageChangeSettlement}
              />
            </div>
        </div>
      </div>
      <Modal centered show={showModalDetailTransferDana} onHide={() => setShowModalDetailTransferDana(false)} style={{ borderRadius: 8 }}>
        <Modal.Body style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
              <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>Detail Transaksi</p>
            </div>
            <div>
              <Container style={{ paddingLeft: "unset", paddingRight: "unset" }}>
                <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400 }}>
                  <Col>ID Transaksi</Col>
                  <Col style={{ display: "flex", justifyContent: "end" }}>Status</Col>
                </Row>
                <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                  <Col>{detailTransferDana.tvatrans_trx_id}</Col>
                  <Col
                    style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 4, maxWidth: 160, width: "100%", height: 32,
                      background: (detailTransferDana.tvatrans_status_id === 2) ? "rgba(7, 126, 134, 0.08)" : (detailTransferDana.tvatrans_status_id === 1 || detailTransferDana.tvatrans_status_id === 7) ? "#FEF4E9" : (detailTransferDana.tvatrans_status_id === 4) ? "#FDEAEA" : (detailTransferDana.tvatrans_status_id === 3 || detailTransferDana.tvatrans_status_id === 5 || detailTransferDana.tvatrans_status_id === 6 || detailTransferDana.tvatrans_status_id === 8 || detailTransferDana.tvatrans_status_id === 9 || detailTransferDana.tvatrans_status_id === 10 || detailTransferDana.tvatrans_status_id === 11 || detailTransferDana.tvatrans_status_id === 12 || detailTransferDana.tvatrans_status_id === 13 || detailTransferDana.tvatrans_status_id === 14 || detailTransferDana.tvatrans_status_id === 15) ? "#F0F0F0" : "",
                      color: (detailTransferDana.tvatrans_status_id === 2) ? "#077E86" : (detailTransferDana.tvatrans_status_id === 1 || detailTransferDana.tvatrans_status_id === 7) ? "#F79421" : (detailTransferDana.tvatrans_status_id === 4) ? "#EE2E2C" : (detailTransferDana.tvatrans_status_id === 3 || detailTransferDana.tvatrans_status_id === 5 || detailTransferDana.tvatrans_status_id === 6 || detailTransferDana.tvatrans_status_id === 8 || detailTransferDana.tvatrans_status_id === 9 || detailTransferDana.tvatrans_status_id === 10 || detailTransferDana.tvatrans_status_id === 11 || detailTransferDana.tvatrans_status_id === 12 || detailTransferDana.tvatrans_status_id === 13 || detailTransferDana.tvatrans_status_id === 14 || detailTransferDana.tvatrans_status_id === 15) ? "#888888" : "" }}
                  >
                    {detailTransferDana.mstatus_name}
                  </Col>
                  <br />
                </Row>
                <div style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: -10 }}>{detailTransferDana.tvatrans_crtdt}</div>
                <center>
                  <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                </center>
                <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, }}>Detail Pengiriman</div>
                <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>
                  <Col>Nama Agen</Col>
                  <Col style={{ display: "flex", justifyContent: "end" }}>ID Agen</Col>
                </Row>
                <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                  <Col>{detailTransferDana.mpartnerdtl_sub_name}</Col>
                  <Col style={{ display: "flex", justifyContent: "end" }}>{detailTransferDana.mpartnerdtl_partner_id}</Col>
                </Row>
                <div style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>No VA</div>
                <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>{detailTransferDana.tvatrans_va_number}</div>
                <center>
                  <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                </center>
                <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, }}>Rincian Dana</div>
                <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                  <Col style={{ fontWeight: 400 }}>Jumlah Dana Diterima</Col>
                  <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_amount)}</Col>
                </Row>
                {/* <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                  <Col style={{ fontWeight: 400 }}>{detailTransferDana.mfitur_name === "Payment Link" ? "Biaya Payment Link" : "Biaya VA"}</Col>
                  <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_bank_fee)}</Col>
                </Row>
                <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                  <Col style={{ fontWeight: 400 }}>Biaya Partner</Col>
                  <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_partner_fee)}</Col>
                </Row> */}
                <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                  <Col style={{ fontWeight: 400 }}>Biaya Layanan</Col>
                  <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_bank_fee + detailTransferDana.tvatrans_partner_fee)}</Col>
                </Row>
                {/* <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                  <Col style={{ fontWeight: 400 }}>Biaya Settlement</Col>
                  <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.mpartnerdtl_settlement_fee)}</Col>
                </Row> */}
                <center>
                  <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, padding: "0px 24px", border: "1px dashed #EBEBEB" }} />
                </center>
                <Row style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 700, marginTop: 12 }}>
                  <Col>Total</Col>
                  <Col style={{ display: "flex", justifyContent: "end" }}>{convertToRupiah((detailTransferDana.tvatrans_amount + detailTransferDana.tvatrans_bank_fee + detailTransferDana.tvatrans_partner_fee ))}</Col>
                </Row>
              </Container>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <Button variant="primary" onClick={() => setShowModalDetailTransferDana(false)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Oke</Button>
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
};