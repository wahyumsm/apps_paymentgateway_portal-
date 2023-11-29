import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import React, { useEffect, useState } from 'react'
import Pagination from 'react-js-pagination';
import { Link, useHistory } from 'react-router-dom';
import ReactSelect, { components } from 'react-select'
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, language, setUserSession } from '../../function/helpers';
import * as XLSX from "xlsx"
import axios from 'axios';
import encryptData from '../../function/encryptData';
import DataTable, { defaultThemes } from 'react-data-table-component';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { eng, ind } from '../../components/Language';

function SettlementPage() {

    const history = useHistory()
    const access_token = getToken();
    const user_role = getRole();
    const [partnerId, setPartnerId] = useState("")
    const [dataListPartner, setDataListPartner] = useState([])
    const [listBank, setListBank] = useState([])
    const [listEWallet, setListEWallet] = useState([])
    const [dataRiwayatSettlement, setDataRiwayatSettlement] = useState([])
    const [dataRiwayatSettlementPartner, setDataRiwayatSettlementPartner] = useState([])
    const [totalSettlement, setTotalSettlement] = useState([])
    const [stateSettlement, setStateSettlement] = useState(null)
    const [stateSettlementPartner, setStateSettlementPartner] = useState(null)
    const [dateRangeSettlement, setDateRangeSettlement] = useState([])
    const [dateRangeSettlementPartner, setDateRangeSettlementPartner] = useState([])
    const [showDateSettlement, setShowDateSettlement] = useState("none")
    const [showDateSettlementPartner, setShowDateSettlementPartner] = useState("none")
    const [inputHandle, setInputHandle] = useState({
        idTransaksiSettlement: "",
        namaPartnerSettlement: "",
        statusSettlement: [],
        periodeSettlement: 0,
        bankSettlement: "",
        fiturSettlement: 0,
        idTransaksiSettlementPartner: "",
        periodeSettlementPartner: 0,
        statusSettlementPartner: [],
        fiturSettlementPartner: 0
    })
    const [pendingSettlement, setPendingSettlement] = useState(true)
    const [pendingSettlementPartner, setPendingSettlementPartner] = useState(true)
    const [activePageSettlement, setActivePageSettlement] = useState(1)
    const [activePageSettlementPartner, setActivePageSettlementPartner] = useState(1)
    const [pageNumberSettlement, setPageNumberSettlement] = useState({})
    const [pageNumberSettlementPartner, setPageNumberSettlementPartner] = useState({})
    const [totalPageSettlement, setTotalPageSettlement] = useState(0)
    const [totalPageSettlementPartner, setTotalPageSettlementPartner] = useState(0)
    const [isFilterSettlement, setIsFilterSettlement] = useState(false)
    const [isFilterSettlementPartner, setIsFilterSettlementPartner] = useState(false)
    const [selectedPartnerSettlement, setSelectedPartnerSettlement] = useState([])
    const [selectedBankSettlement, setSelectedBankSettlement] = useState([])
    const [selectedEWalletSettlement, setSelectedEWalletSettlement] = useState([])
    const currentDate = new Date().toISOString().split('T')[0]
    const yesterdayDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
    const firstDayThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0]
    const lastDayThisMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1).toISOString().split('T')[0]
    const firstDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 2).toISOString().split('T')[0]
    const lastDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth()).toISOString().split('T')[0]
    const oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()).toISOString().split('T')[0]
    const [alertSendEmail, setAlertSendEmail] = useState("")

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

    function toDashboard() {
        history.push("/");
    }

    function toLaporan() {
        history.push("/riwayat-transaksi/va-dan-paylink");
    }

    function handleChange(e) {
        if (e.target.name === 'fiturSettlement' && Number(e.target.value) === 105) {
            setSelectedBankSettlement([])
        } else if (e.target.name === 'fiturSettlement' && Number(e.target.value) !== 105) {
            setSelectedEWalletSettlement([])
        }
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeSettlement(e, role) {
        console.log(e.target.value, 'e.target.value');
        if (role !== "partner") {
            if (e.target.value === "7") {
                setShowDateSettlement("")
                setInputHandle({
                    ...inputHandle,
                    [e.target.name] : e.target.value
                })
            } else {
                setShowDateSettlement("none")
                setStateSettlement(null)
                setDateRangeSettlement([])
                setInputHandle({
                    ...inputHandle,
                    [e.target.name] : e.target.value.split(",")
                })
            }
        } else {
            if (e.target.value === "7") {
                setShowDateSettlementPartner("")
                setInputHandle({
                    ...inputHandle,
                    [e.target.name] : e.target.value
                })
            } else {
                setShowDateSettlementPartner("none")
                setStateSettlementPartner(null)
                setDateRangeSettlementPartner([])
                setInputHandle({
                    ...inputHandle,
                    [e.target.name] : e.target.value.split(",")
                })
            }
        }
    }

    function handlePageChangeSettlement(page) {
        if (isFilterSettlement) {
            setActivePageSettlement(page)
            // filterSettlement(page, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.periodeSettlement, dateRangeSettlement, 0, inputHandle.fiturSettlement, selectedBankSettlement.length !== 0 ? selectedBankSettlement[0].value : "", selectedEWalletSettlement.length !== 0 ? selectedEWalletSettlement[0].value : "")
            filterSettlementNew(selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.fiturSettlement, inputHandle.idTransaksiSettlement, inputHandle.periodeSettlement, dateRangeSettlement, page, 0)
        } else {
            setActivePageSettlement(page)
            // riwayatSettlement(page)
            riwayatSettlementNew(currentDate, page)
        }
    }

    function handlePageChangeSettlementPartner(page) {
        if (isFilterSettlementPartner) {
            setActivePageSettlementPartner(page)
            // filterSettlementPartner(inputHandle.idTransaksiSettlementPartner, dateRangeSettlementPartner, inputHandle.periodeSettlementPartner, page, 0, inputHandle.statusSettlementPartner, inputHandle.fiturSettlementPartner)
            filterSettlementPartnerNew(inputHandle.fiturSettlementPartner, inputHandle.idTransaksiSettlementPartner, inputHandle.periodeSettlementPartner, dateRangeSettlementPartner, partnerId, page, 0)
        } else {
            setActivePageSettlementPartner(page)
            // riwayatSettlementPartner(page, currentDate)
            riwayatSettlementPartnerNew(currentDate, page, partnerId)
        }
    }

    async function getListEWallet() {
        try {
            const auth = 'Bearer ' + getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataListEmoney = await axios.post(BaseURL + "/Home/GetLisEwallet", {data: ""}, {headers: headers})
            // console.log(dataListEmoney, 'dataListEmoney');
            if (dataListEmoney.status === 200 && dataListEmoney.data.response_code === 200 && dataListEmoney.data.response_new_token.length === 0) {
                let newArr = []
                dataListEmoney.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.mewallet_code
                    obj.label = e.mewallet_name
                    newArr.push(obj)
                })
                setListEWallet(newArr)
            } else if (dataListEmoney.status === 200 && dataListEmoney.data.response_code === 200 && dataListEmoney.data.response_new_token.length !== 0) {
                setUserSession(dataListEmoney.data.response_new_token)
                let newArr = []
                dataListEmoney.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.mewallet_code
                    obj.label = e.mewallet_name
                    newArr.push(obj)
                })
                setListEWallet(newArr)
            }

        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function listPartner() {
        try {
            const auth = 'Bearer ' + getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const listPartner = await axios.post(BaseURL + "/Partner/ListPartner", {data: ""}, {headers: headers})
            if (listPartner.status === 200 && listPartner.data.response_code === 200 && listPartner.data.response_new_token.length === 0) {
                let newArr = []
                listPartner.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.partner_id
                    obj.label = e.nama_perusahaan
                    newArr.push(obj)
                })
                setDataListPartner(newArr)
            } else if (listPartner.status === 200 && listPartner.data.response_code === 200 && listPartner.data.response_new_token.length !== 0) {
                setUserSession(listPartner.data.response_new_token)
                let newArr = []
                listPartner.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.partner_id
                    obj.label = e.nama_perusahaan
                    newArr.push(obj)
                })
                setDataListPartner(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function riwayatSettlement(currentPage) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "partnerID":"", "subPartnerID":"", "dateID": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10, "fitur_id": 0, "bank_code": ""}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataRiwayatSettlement = await axios.post(BaseURL + "/Home/GetListHistorySettlement", {data: dataParams}, { headers: headers });
            if (dataRiwayatSettlement.status === 200 && dataRiwayatSettlement.data.response_code === 200 && dataRiwayatSettlement.data.response_new_token.length === 0) {
                dataRiwayatSettlement.data.response_data.results.list_data = dataRiwayatSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberSettlement(dataRiwayatSettlement.data.response_data)
                setTotalPageSettlement(dataRiwayatSettlement.data.response_data.max_page)
                setDataRiwayatSettlement(dataRiwayatSettlement.data.response_data.results.list_data)
                setTotalSettlement(dataRiwayatSettlement.data.response_data.results.total_settlement)
                setPendingSettlement(false)
            } else if (dataRiwayatSettlement.status === 200 && dataRiwayatSettlement.data.response_code === 200 && dataRiwayatSettlement.data.response_new_token.length !== 0) {
                setUserSession(dataRiwayatSettlement.data.response_new_token)
                dataRiwayatSettlement.data.response_data.results.list_data = dataRiwayatSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberSettlement(dataRiwayatSettlement.data.response_data)
                setTotalPageSettlement(dataRiwayatSettlement.data.response_data.max_page)
                setDataRiwayatSettlement(dataRiwayatSettlement.data.response_data.results.list_data)
                setTotalSettlement(dataRiwayatSettlement.data.response_data.results.total_settlement)
                setPendingSettlement(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function riwayatSettlementPartner(currentPage, currentDate, lang) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "dateID": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10, "fitur_id": 0, "bank_code": ""}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : lang
            }
            const dataSettlement = await axios.post(BaseURL + "/Home/GetListHistorySettlement", { data: dataParams }, { headers: headers })
            // console.log(dataSettlement, "data settlement");
            if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length === 0) {
                dataSettlement.data.response_data.results.list_data = dataSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberSettlementPartner(dataSettlement.data.response_data)
                setTotalPageSettlementPartner(dataSettlement.data.response_data.max_page)
                setDataRiwayatSettlementPartner(dataSettlement.data.response_data.results.list_data)
                setPendingSettlementPartner(false)
            } else if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length !== 0) {
                setUserSession(dataSettlement.data.response_new_token)
                dataSettlement.data.response_data.results.list_data = dataSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberSettlementPartner(dataSettlement.data.response_data)
                setTotalPageSettlementPartner(dataSettlement.data.response_data.max_page)
                setDataRiwayatSettlementPartner(dataSettlement.data.response_data.results.list_data)
                setPendingSettlementPartner(false)
            }
        } catch (error) {
            // console.log(error)
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
            riwayatSettlementPartnerNew(currentDate, activePageSettlementPartner, userDetail.data.response_data.muser_partnerdtl_id)
          } else if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length !== 0) {
            setUserSession(userDetail.data.response_new_token)
            setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
            riwayatSettlementPartnerNew(currentDate, activePageSettlementPartner, userDetail.data.response_data.muser_partnerdtl_id)
          }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    async function riwayatSettlementNew(currentDate, currentPage) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id": "", "paytype_id": 0, "id_transaksi" : "", "Date_from": "${currentDate}", "Date_to": "${currentDate}", "page": ${(currentPage !== 0) ? currentPage : 1}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataSettlement = await axios.post(BaseURL + "/Home/GetSettlementLogList", { data: dataParams }, { headers: headers })
            // console.log(dataSettlement, "data settlement");
            if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length === 0) {
                dataSettlement.data.response_data.results.list_data = dataSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberSettlement(dataSettlement.data.response_data)
                setTotalPageSettlement(dataSettlement.data.response_data.max_page)
                setDataRiwayatSettlement(dataSettlement.data.response_data.results.list_data)
                setTotalSettlement(dataSettlement.data.response_data.results.total_settle_amount)
                setPendingSettlement(false)
            } else if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length !== 0) {
                setUserSession(dataSettlement.data.response_new_token)
                dataSettlement.data.response_data.results.list_data = dataSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberSettlement(dataSettlement.data.response_data)
                setTotalPageSettlement(dataSettlement.data.response_data.max_page)
                setDataRiwayatSettlement(dataSettlement.data.response_data.results.list_data)
                setTotalSettlement(dataSettlement.data.response_data.results.total_settle_amount)
                setPendingSettlement(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function riwayatSettlementPartnerNew(currentDate, currentPage, partnerId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id": "${partnerId}", "paytype_id": 0, "id_transaksi" : "", "Date_from": "${currentDate}", "Date_to": "${currentDate}", "page": ${(currentPage !== 0) ? currentPage : 1}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataSettlement = await axios.post(BaseURL + "/Home/GetSettlementLogList", { data: dataParams }, { headers: headers })
            // console.log(dataSettlement, "data settlement");
            if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length === 0) {
                dataSettlement.data.response_data.results.list_data = dataSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberSettlementPartner(dataSettlement.data.response_data)
                setTotalPageSettlementPartner(dataSettlement.data.response_data.max_page)
                setDataRiwayatSettlementPartner(dataSettlement.data.response_data.results.list_data)
                setPendingSettlementPartner(false)
            } else if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length !== 0) {
                setUserSession(dataSettlement.data.response_new_token)
                dataSettlement.data.response_data.results.list_data = dataSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberSettlementPartner(dataSettlement.data.response_data)
                setTotalPageSettlementPartner(dataSettlement.data.response_data.max_page)
                setDataRiwayatSettlementPartner(dataSettlement.data.response_data.results.list_data)
                setPendingSettlementPartner(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getBankNameHandler() {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"fitur_id":"100"}`)
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
                setUserSession(listBankName.data.response_new_token)
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

    function pickDateSettlement(item) {
        setStateSettlement(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeSettlement(item)
        }
    }

    function pickDateSettlementPartner(item) {
        setStateSettlementPartner(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeSettlementPartner(item)
        }
    }

    async function filterSettlement(page, statusId, transId, partnerId, dateId, periode, rowPerPage, fiturSettlement, bankSettlement, eWalletSettlement, lang) {
        try {
            setPendingSettlement(true)
            setIsFilterSettlement(true)
            setActivePageSettlement(page)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "partnerID":"${(partnerId !== undefined) ? partnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "fitur_id": ${fiturSettlement}, "bank_code": "${Number(fiturSettlement) === 105 ? (eWalletSettlement !== undefined ? eWalletSettlement : "") : (bankSettlement !== undefined ? bankSettlement : "")}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept-Language' : lang
            }
            const filterSettlement = await axios.post(BaseURL + "/Home/GetListHistorySettlement", {data: dataParams}, { headers: headers });
            if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length === 0) {
                filterSettlement.data.response_data.results.list_data = filterSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberSettlement(filterSettlement.data.response_data)
                setTotalPageSettlement(filterSettlement.data.response_data.max_page)
                setDataRiwayatSettlement(filterSettlement.data.response_data.results.list_data)
                setTotalSettlement(filterSettlement.data.response_data.results.total_settlement)
                setPendingSettlement(false)
            } else if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length !== 0) {
                setUserSession(filterSettlement.data.response_new_token)
                filterSettlement.data.response_data.results.list_data = filterSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberSettlement(filterSettlement.data.response_data)
                setTotalPageSettlement(filterSettlement.data.response_data.max_page)
                setDataRiwayatSettlement(filterSettlement.data.response_data.results.list_data)
                setTotalSettlement(filterSettlement.data.response_data.results.total_settlement)
                setPendingSettlement(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterSettlementPartner(idTransaksi, periode, dateId, page, rowPerPage, status, fitur, lang) {
        try {
            setPendingSettlementPartner(true)
            setIsFilterSettlementPartner(true)
            setActivePageSettlementPartner(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"statusID": [${(status.length !== 0) ? status : [1,2,7,9]}], "transID" : "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "fitur_id": ${fitur}, "bank_code": ""}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : lang
            }
            const filterSettlement = await axios.post(BaseURL + "/Home/GetListHistorySettlement", { data: dataParams }, { headers: headers })
            if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length === 0) {
                filterSettlement.data.response_data.results.list_data = filterSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
                setDataRiwayatSettlementPartner(filterSettlement.data.response_data.results.list_data)
                setTotalPageSettlementPartner(filterSettlement.data.response_data.max_page)
                setPageNumberSettlementPartner(filterSettlement.data.response_data)
                setPendingSettlementPartner(false)
            } else if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length !== 0) {
                setUserSession(filterSettlement.data.response_new_token)
                filterSettlement.data.response_data.results.list_data = filterSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
                setDataRiwayatSettlementPartner(filterSettlement.data.response_data.results.list_data)
                setTotalPageSettlementPartner(filterSettlement.data.response_data.max_page)
                setPageNumberSettlementPartner(filterSettlement.data.response_data)
                setPendingSettlementPartner(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterSettlementNew(namaPartner, fitur, idTransaksi, periode, dateRange, page, rowPerPage) {
        try {
            setPendingSettlement(true)
            setIsFilterSettlement(true)
            setActivePageSettlement(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id": "${namaPartner}", "paytype_id": ${fitur}, "id_transaksi" : "${(idTransaksi.length !== 0) ? idTransaksi : ""}","Date_from": "${(periode.length !== 0) ? (periode === "7" ? dateRange[0] : periode[0]) : ""}", "Date_to": "${(periode.length !== 0) ? periode === "7" ? dateRange[1] : periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const filterSettlement = await axios.post(BaseURL + "/Home/GetSettlementLogList", { data: dataParams }, { headers: headers })
            if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length === 0) {
                filterSettlement.data.response_data.results.list_data = filterSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
                setDataRiwayatSettlement(filterSettlement.data.response_data.results.list_data)
                setTotalPageSettlement(filterSettlement.data.response_data.max_page)
                setPageNumberSettlement(filterSettlement.data.response_data)
                setTotalSettlement(filterSettlement.data.response_data.results.total_settle_amount)
                setPendingSettlement(false)
            } else if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length !== 0) {
                setUserSession(filterSettlement.data.response_new_token)
                filterSettlement.data.response_data.results.list_data = filterSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
                setDataRiwayatSettlement(filterSettlement.data.response_data.results.list_data)
                setTotalPageSettlement(filterSettlement.data.response_data.max_page)
                setPageNumberSettlement(filterSettlement.data.response_data)
                setTotalSettlement(filterSettlement.data.response_data.results.total_settle_amount)
                setPendingSettlement(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterSettlementPartnerNew(fitur, idTransaksi, periode, dateRange, partnerId, page, rowPerPage) {
        try {
            setPendingSettlementPartner(true)
            setIsFilterSettlementPartner(true)
            setActivePageSettlementPartner(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id": "${partnerId}", "paytype_id": ${fitur}, "id_transaksi" : "${(idTransaksi.length !== 0) ? idTransaksi : ""}","Date_from": "${(periode.length !== 0) ? (periode === "7" ? dateRange[0] : periode[0]) : ""}", "Date_to": "${(periode.length !== 0) ? periode === "7" ? dateRange[1] : periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const filterSettlement = await axios.post(BaseURL + "/Home/GetSettlementLogList", { data: dataParams }, { headers: headers })
            if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length === 0) {
                filterSettlement.data.response_data.results.list_data = filterSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
                setDataRiwayatSettlementPartner(filterSettlement.data.response_data.results.list_data)
                setTotalPageSettlementPartner(filterSettlement.data.response_data.max_page)
                setPageNumberSettlementPartner(filterSettlement.data.response_data)
                setPendingSettlementPartner(false)
            } else if (filterSettlement.status === 200 && filterSettlement.data.response_code === 200 && filterSettlement.data.response_new_token.length !== 0) {
                setUserSession(filterSettlement.data.response_new_token)
                filterSettlement.data.response_data.results.list_data = filterSettlement.data.response_data.results.list_data.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
                setDataRiwayatSettlementPartner(filterSettlement.data.response_data.results.list_data)
                setTotalPageSettlementPartner(filterSettlement.data.response_data.max_page)
                setPageNumberSettlementPartner(filterSettlement.data.response_data)
                setPendingSettlementPartner(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function resendEmailHandler(settlementId, settlementTypeId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"settlement_id": ${settlementId}, "settlementtype_id" : ${settlementTypeId}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const responSendEmail = await axios.post(BaseURL + "/Settlement/ReSendEmailSettlement", { data: dataParams }, { headers: headers })
            // console.log(responSendEmail.data.response_data.results, "data settlement");
            if (responSendEmail.status === 200 && responSendEmail.data.response_code === 200 && responSendEmail.data.response_new_token === null) {
                alert(responSendEmail.data.response_data.results !== null ? responSendEmail.data.response_data.results : "Failed")
            } else if (responSendEmail.status === 200 && responSendEmail.data.response_code === 200 && responSendEmail.data.response_new_token !== null) {
                setUserSession(responSendEmail.data.response_new_token)
                alert(responSendEmail.data.response_data.results !== null ? responSendEmail.data.response_data.results : "Failed")
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function resetButtonHandle(role) {
        if (role === "admin") {
            // riwayatSettlement(activePageSettlement)
            riwayatSettlementNew(currentDate, activePageSettlement)
            setInputHandle({
                ...inputHandle,
                idTransaksiSettlement: "",
                namaPartnerSettlement: "",
                statusSettlement: [],
                periodeSettlement: 0,
                bankSettlement: "",
                fiturSettlement: 0
            })
            setSelectedPartnerSettlement([])
            setSelectedBankSettlement([])
            setSelectedEWalletSettlement([])
            setStateSettlement(null)
            setDateRangeSettlement([])
            setShowDateSettlement("none")
        } else {
            // riwayatSettlementPartner(activePageSettlementPartner, currentDate)
            riwayatSettlementPartnerNew(currentDate, activePageSettlementPartner, partnerId)
            setInputHandle({
                ...inputHandle,
                idTransaksiSettlementPartner: "",
                periodeSettlementPartner: 0,
                statusSettlementPartner: [],
                fiturSettlementPartner: 0
            })
            setStateSettlementPartner(null)
            setDateRangeSettlementPartner([])
            setShowDateSettlementPartner("none")
        }
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        if (user_role === "102" || user_role === "104") {
            // history.push('/404');
            // riwayatSettlementPartner(activePageSettlementPartner, currentDate)
            userDetails()
        } else {
            listPartner()
            // riwayatSettlement(activePageSettlement)
            riwayatSettlementNew(currentDate, activePageSettlement)
            getBankNameHandler()
            getListEWallet()
        }
    }, [access_token, user_role])

    const columnsSettl = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
        },
        {
            name: 'Send Email',
            width: "180px",
            cell: (row) => <button className='btn-riwayat-settlement' onClick={() => resendEmailHandler(row.tsettlelog_settlement_id, row.tsettlelog_settle_type)} >Send Email</button>
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tsettlelog_settlement_code,
            width: "224px",
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tsettlelog_settlement_id}/${row.tvatrans_bank_code === null ? "0" : row.tvatrans_bank_code}/${row.tsettlelog_settle_type}/${row.mewallet_code === null ? "0" : row.mewallet_code}`} >{row.tsettlelog_settlement_code}</Link>
        },
        {
            name: 'Waktu',
            selector: row => row.tsettlelog_date_format,
            width: "150px",
        },
        {
            name: 'Nama Partner',
            selector: row => row.tsettlelog_subpartner_name,
            width: "224px",
            wrap: true,
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.tsettlelog_paytype_name,
            width: "224px",
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.tsettlelog_amount_trx - row.tsettlelog_amount_fee),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Total Transaksi',
            selector: row => row.tsettlelog_count_trx,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Layanan',
            selector: row => convertToRupiah(row.tsettlelog_fee_partner, true, 2),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'PPN atas Jasa Layanan',
            selector: row => convertToRupiah(row.tsettlelog_fee_partner_tax, true, 2),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Reimbursement by VA',
            selector: row => convertToRupiah(row.tsettlelog_fee_payment),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Settlement',
            selector: row => convertToRupiah(row.tsettlelog_amount_settle),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Status',
            selector: row => row.tsettlelog_is_settle === true ? "Berhasil" : "Gagal",
            width: "140px",
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.tsettlelog_is_settle === true,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.tsettlelog_is_settle === false,
                    style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
                },
                // {
                //     when: row => row.tvasettl_status_id === 4,
                //     style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                // },
                // {
                //     when: row => row.tvasettl_status_id === 3 || row.tvasettl_status_id === 5 || row.tvasettl_status_id === 6 || row.tvasettl_status_id === 8 || row.tvasettl_status_id === 9 || row.tvasettl_status_id === 10 || row.tvasettl_status_id === 11 || row.tvasettl_status_id === 12 || row.tvasettl_status_id === 13 || row.tvasettl_status_id === 14 || row.tvasettl_status_id === 15,
                //     style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                // }
            ],
        },
    ];

    const columnsSettlementPartner = [
        {
            name: language === null ? eng.no : language.no,
            selector: row => row.number,
            width: "67px"
        },
        {
            name: language === null ? eng.idTransaksi : language.idTransaksi,
            selector: row => row.tsettlelog_settlement_code,
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tsettlelog_settlement_id}/${'0'}/${row.tsettlelog_settle_type}/${'0'}`}>{row.tsettlelog_settlement_code}</Link>,
            // selector: row => row.tvasettl_code,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}/${'0'}/${row.settlement_type}/${'0'}`}>{row.tvasettl_code}</Link>,
            // width: "251px"
        },
        {
            name: language === null ? eng.waktu : language.waktu,
            selector: row => row.tsettlelog_date_format,
            // selector: row => row.tvasettl_crtdt_format,
        },
        {
            name: language === null ? eng.jenisTransaksi : language.jenisTransaksi,
            selector: row => row.tsettlelog_paytype_name,
            // selector: row => row.mfitur_desc,
            // sortable: true
        },
        {
            name: language === null ? eng.jumlah : language.jumlah,
            selector: row => convertToRupiah(row.tsettlelog_amount_trx - row.tsettlelog_amount_fee),
            cell: row => <div style={{ padding: "0px 16px" }}>{ convertToRupiah(row.tsettlelog_amount_trx - row.tsettlelog_amount_fee) }</div>
            // selector: row => row.tvasettl_amount,
            // cell: row => <div style={{ padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>
        },
        {
            name: language === null ? eng.status : language.status,
            selector: row => row.tsettlelog_is_settle === true ? (language === null ? eng.berhasil : language.berhasil) : (language === null ? eng.gagal : language.gagal),
            // selector: row => row.mstatus_name_ind,
            width: "127px",
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: 6, margin: "6px 16px", width: "50%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.tsettlelog_is_settle === true,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.tsettlelog_is_settle === false,
                    style: { background: "#FEF4E9", color: "#F79421" }
                }
                // {
                //     when: row => row.tvasettl_status_id === 2,
                //     style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                // },
                // {
                //     when: row => row.tvasettl_status_id === 1 || row.tvasettl_status_id === 7,
                // },
                // {
                //     when: row => row.tvasettl_status_id === 4,
                //     style: { background: "#FDEAEA", color: "#EE2E2C" }
                // },
                // {
                //     when: row => row.tvasettl_status_id === 3 || row.tvasettl_status_id === 5 || row.tvasettl_status_id === 6 || row.tvasettl_status_id === 8 || row.tvasettl_status_id === 9 || row.tvasettl_status_id === 10 || row.tvasettl_status_id === 11 || row.tvasettl_status_id === 12 || row.tvasettl_status_id === 13 || row.tvasettl_status_id === 14 || row.tvasettl_status_id === 15,
                //     style: { background: "#F0F0F0", color: "#888888" }
                // }
            ],
        },
    ];

    const customStylesPartner = {
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

    const customStylesSettlement = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'flex-start',
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                },
            },
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                },
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: defaultThemes.default.divider.default,
            },
        },
    };

    function ExportReportSettlementHandler(isExport, isFilter, namaPartner, fitur, idTransaksi, periode, dateRange) {
        if (isFilter && isExport === "details") {
            async function dataExportFilter(namaPartner, fitur, idTransaksi, periode, dateRange) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"subpartner_id": "${namaPartner}", "paytype_id": ${fitur}, "id_transaksi" : "${(idTransaksi.length !== 0) ? idTransaksi : ""}","Date_from": "${(periode.length !== 0) ? (periode === "7" ? dateRange[0] : periode[0]) : ""}", "Date_to": "${(periode.length !== 0) ? periode === "7" ? dateRange[1] : periode[1] : ""}"}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth,
                        // 'Accept-Language' : lang
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Home/GetExportList", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi Settlement": data[i].tsettlelog_settlement_code, "Waktu Settlement": data[i].tsettlelog_date_format, "Nama Partner": data[i].tsettlelog_subpartner_name, "Jenis Transaksi": data[i].tsettlelog_paytype_name, "Nominal Settlement": data[i].tsettlelog_amount_trx - data[i].tsettlelog_amount_fee, "Total Transaksi": data[i].tsettlelog_count_trx, "Total Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner, false, 2), "Total PPN atas Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner_tax, false, 2), "Total Reimbursement by VA": data[i].tsettlelog_fee_payment, "Jasa Settlement": data[i].trx_fee_tax === null ? 0 : data[i].trx_fee_tax, "ID Transaksi": data[i].trx_id, "Waktu Transaksi": data[i].trx_date_format, "Partner Trans ID": data[i].trx_partner_trans_id, "Tipe Transaksi": data[i].trx_payment_name, "No VA": data[i].trx_va, "Nominal Transaksi": data[i].trx_amount, "Jasa Layanan": convertToRupiah(data[i].trx_fee, false, 2), "PPN atas Jasa Layanan": data[i].trx_amount_settle === null ? 0 : convertToRupiah(data[i].trx_amount_settle, false, 2), "Reimbursement by VA": data[i].trx_payment_fee, "Status": data[i].tsettlelog_is_settle === true ? "Berhasil" : "Gagal" })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement Details.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi Settlement": data[i].tsettlelog_settlement_code, "Waktu Settlement": data[i].tsettlelog_date_format, "Nama Partner": data[i].tsettlelog_subpartner_name, "Jenis Transaksi": data[i].tsettlelog_paytype_name, "Nominal Settlement": data[i].tsettlelog_amount_trx - data[i].tsettlelog_amount_fee, "Total Transaksi": data[i].tsettlelog_count_trx, "Total Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner, false, 2), "Total PPN atas Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner_tax, false, 2), "Total Reimbursement by VA": data[i].tsettlelog_fee_payment, "Jasa Settlement": data[i].trx_fee_tax === null ? 0 : data[i].trx_fee_tax, "ID Transaksi": data[i].trx_id, "Waktu Transaksi": data[i].trx_date_format, "Partner Trans ID": data[i].trx_partner_trans_id, "Tipe Transaksi": data[i].trx_payment_name, "No VA": data[i].trx_va, "Nominal Transaksi": data[i].trx_amount, "Jasa Layanan": convertToRupiah(data[i].trx_fee, false, 2), "PPN atas Jasa Layanan": data[i].trx_amount_settle === null ? 0 : convertToRupiah(data[i].trx_amount_settle, false, 2), "Reimbursement by VA": data[i].trx_payment_fee, "Status": data[i].tsettlelog_is_settle === true ? "Berhasil" : "Gagal" })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement Details.xlsx");
                    }
                } catch (error) {
                    // console.log(error)
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(namaPartner, fitur, idTransaksi, periode, dateRange)
        } else if (!isFilter && isExport === "details") {
            async function dataExportSettlement() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"subpartner_id": "", "paytype_id": 0, "id_transaksi" : "", "Date_from": "${currentDate}", "Date_to": "${currentDate}"}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth,
                        // 'Accept-Language' : lang
                    }
                    const dataExportSettlement = await axios.post(BaseURL + "/Home/GetExportList", {data: dataParams}, { headers: headers });
                    if (dataExportSettlement.status === 200 && dataExportSettlement.data.response_code === 200 && dataExportSettlement.data.response_new_token.length === 0) {
                        const data = dataExportSettlement.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi Settlement": data[i].tsettlelog_settlement_code, "Waktu Settlement": data[i].tsettlelog_date_format, "Nama Partner": data[i].tsettlelog_subpartner_name, "Jenis Transaksi": data[i].tsettlelog_paytype_name, "Nominal Settlement": data[i].tsettlelog_amount_trx - data[i].tsettlelog_amount_fee, "Total Transaksi": data[i].tsettlelog_count_trx, "Total Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner, false, 2), "Total PPN atas Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner_tax, false, 2), "Total Reimbursement by VA": data[i].tsettlelog_fee_payment, "Jasa Settlement": data[i].trx_fee_tax === null ? 0 : data[i].trx_fee_tax, "ID Transaksi": data[i].trx_id, "Waktu Transaksi": data[i].trx_date_format, "Partner Trans ID": data[i].trx_partner_trans_id, "Tipe Transaksi": data[i].trx_payment_name, "No VA": data[i].trx_va, "Nominal Transaksi": data[i].trx_amount, "Jasa Layanan": convertToRupiah(data[i].trx_fee, false, 2), "PPN atas Jasa Layanan": data[i].trx_amount_settle === null ? 0 : convertToRupiah(data[i].trx_amount_settle, false, 2), "Reimbursement by VA": data[i].trx_payment_fee, "Status": data[i].tsettlelog_is_settle === true ? "Berhasil" : "Gagal" })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement Details.xlsx");
                    } else if (dataExportSettlement.status === 200 && dataExportSettlement.data.response_code === 200 && dataExportSettlement.data.response_new_token.length !== 0) {
                        setUserSession(dataExportSettlement.data.response_new_token)
                        const data = dataExportSettlement.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi Settlement": data[i].tsettlelog_settlement_code, "Waktu Settlement": data[i].tsettlelog_date_format, "Nama Partner": data[i].tsettlelog_subpartner_name, "Jenis Transaksi": data[i].tsettlelog_paytype_name, "Nominal Settlement": data[i].tsettlelog_amount_trx - data[i].tsettlelog_amount_fee, "Total Transaksi": data[i].tsettlelog_count_trx, "Total Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner, false, 2), "Total PPN atas Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner_tax, false, 2), "Total Reimbursement by VA": data[i].tsettlelog_fee_payment, "Jasa Settlement": data[i].trx_fee_tax === null ? 0 : data[i].trx_fee_tax, "ID Transaksi": data[i].trx_id, "Waktu Transaksi": data[i].trx_date_format, "Partner Trans ID": data[i].trx_partner_trans_id, "Tipe Transaksi": data[i].trx_payment_name, "No VA": data[i].trx_va, "Nominal Transaksi": data[i].trx_amount, "Jasa Layanan": convertToRupiah(data[i].trx_fee, false, 2), "PPN atas Jasa Layanan": data[i].trx_amount_settle === null ? 0 : convertToRupiah(data[i].trx_amount_settle, false, 2), "Reimbursement by VA": data[i].trx_payment_fee, "Status": data[i].tsettlelog_is_settle === true ? "Berhasil" : "Gagal" })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement Details.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportSettlement()
        } else if (isFilter && isExport === "summary") {
            async function dataExportFilter(namaPartner, fitur, idTransaksi, periode, dateRange) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"subpartner_id": "${namaPartner}", "paytype_id": ${fitur}, "id_transaksi" : "${(idTransaksi.length !== 0) ? idTransaksi : ""}","Date_from": "${(periode.length !== 0) ? (periode === "7" ? dateRange[0] : periode[0]) : ""}", "Date_to": "${(periode.length !== 0) ? periode === "7" ? dateRange[1] : periode[1] : ""}"}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth,
                        // 'Accept-Language' : lang
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Home/GetExportPartnerList", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi Settlement": data[i].tsettlelog_settlement_code, "Waktu Settlement": data[i].tsettlelog_date_format, "Nama Partner": data[i].tsettlelog_subpartner_name, "Jenis Transaksi": data[i].tsettlelog_paytype_name, "Nominal Settlement": convertToRupiah(data[i].tsettlelog_amount_trx - data[i].tsettlelog_amount_fee, false), "Total Transaksi": data[i].tsettlelog_count_trx, "Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner, false, 2), "PPN atas Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner_tax, false, 2), "Reimbursement by VA": convertToRupiah(data[i].tsettlelog_fee_payment, false), "Jasa Settlement": data[i].tsettlelog_amount_settle === null ? 0 : convertToRupiah(data[i].tsettlelog_amount_settle, false), "Status": data[i].tsettlelog_is_settle === true ? "Berhasil" : "Gagal" })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement Summary.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi Settlement": data[i].tsettlelog_settlement_code, "Waktu Settlement": data[i].tsettlelog_date_format, "Nama Partner": data[i].tsettlelog_subpartner_name, "Jenis Transaksi": data[i].tsettlelog_paytype_name, "Nominal Settlement": convertToRupiah(data[i].tsettlelog_amount_trx - data[i].tsettlelog_amount_fee, false), "Total Transaksi": data[i].tsettlelog_count_trx, "Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner, false, 2), "PPN atas Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner_tax, false, 2), "Reimbursement by VA": convertToRupiah(data[i].tsettlelog_fee_payment, false), "Jasa Settlement": data[i].tsettlelog_amount_settle === null ? 0 : convertToRupiah(data[i].tsettlelog_amount_settle, false), "Status": data[i].tsettlelog_is_settle === true ? "Berhasil" : "Gagal" })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement Summary.xlsx");
                    }
                } catch (error) {
                    // console.log(error)
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(namaPartner, fitur, idTransaksi, periode, dateRange)
        } else if (!isFilter && isExport === "summary") {
            async function dataExportSettlement() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"subpartner_id": "", "paytype_id": 0, "id_transaksi" : "", "Date_from": "${currentDate}", "Date_to": "${currentDate}"}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth,
                        // 'Accept-Language' : lang
                    }
                    const dataExportSettlement = await axios.post(BaseURL + "/Home/GetExportPartnerList", {data: dataParams}, { headers: headers });
                    if (dataExportSettlement.status === 200 && dataExportSettlement.data.response_code === 200 && dataExportSettlement.data.response_new_token.length === 0) {
                        const data = dataExportSettlement.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi Settlement": data[i].tsettlelog_settlement_code, "Waktu Settlement": data[i].tsettlelog_date_format, "Nama Partner": data[i].tsettlelog_subpartner_name, "Jenis Transaksi": data[i].tsettlelog_paytype_name, "Nominal Settlement": convertToRupiah(data[i].tsettlelog_amount_trx - data[i].tsettlelog_amount_fee, false), "Total Transaksi": data[i].tsettlelog_count_trx, "Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner, false, 2), "PPN atas Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner_tax, false, 2), "Reimbursement by VA": convertToRupiah(data[i].tsettlelog_fee_payment, false), "Jasa Settlement": data[i].tsettlelog_amount_settle === null ? 0 : convertToRupiah(data[i].tsettlelog_amount_settle, false), "Status": data[i].tsettlelog_is_settle === true ? "Berhasil" : "Gagal" })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement Summary.xlsx");
                    } else if (dataExportSettlement.status === 200 && dataExportSettlement.data.response_code === 200 && dataExportSettlement.data.response_new_token.length !== 0) {
                        setUserSession(dataExportSettlement.data.response_new_token)
                        const data = dataExportSettlement.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi Settlement": data[i].tsettlelog_settlement_code, "Waktu Settlement": data[i].tsettlelog_date_format, "Nama Partner": data[i].tsettlelog_subpartner_name, "Jenis Transaksi": data[i].tsettlelog_paytype_name, "Nominal Settlement": convertToRupiah(data[i].tsettlelog_amount_trx - data[i].tsettlelog_amount_fee, false), "Total Transaksi": data[i].tsettlelog_count_trx, "Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner, false, 2), "PPN atas Jasa Layanan": convertToRupiah(data[i].tsettlelog_fee_partner_tax, false, 2), "Reimbursement by VA": convertToRupiah(data[i].tsettlelog_fee_payment, false), "Jasa Settlement": data[i].tsettlelog_amount_settle === null ? 0 : convertToRupiah(data[i].tsettlelog_amount_settle, false), "Status": data[i].tsettlelog_is_settle === true ? "Berhasil" : "Gagal" })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement Summary.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportSettlement()
        }
    }

    function ExportReportSettlementPartnerHandler(isFilter, fitur, idTransaksi, periode, dateRange, currentDate, partnerId) {
        if (isFilter) {
            async function exportFilterSettlement(idTransaksi, periode, dateRange, partnerId) {
                try {
                    const auth = "Bearer " + getToken()
                    // const dataParams = encryptData(`{"statusID": [${(status.length !== 0) ? status : [1,2,7,9]}], "transID" : "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 1000000, "fitur_id": ${fitur}, "bank_code": ""}`)
                    const dataParams = encryptData(`{"subpartner_id": "${partnerId}", "paytype_id": ${fitur}, "id_transaksi" : "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "Date_from": "${(periode.length !== 0) ? (periode === "7" ? dateRange[0] : periode[0]) : ""}", "Date_to": "${(periode.length !== 0) ? periode === "7" ? dateRange[1] : periode[1] : ""}"}`)
                    const headers = {
                        'Content-Type':'application/json',
                        'Authorization' : auth,
                        // 'Accept-Language' : lang
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Home/GetExportPartnerList", { data: dataParams }, { headers: headers })
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results.list_data = dataExportFilter.data.response_data.results.list_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].tsettlelog_settlement_code, [language === null ? eng.waktu : language.waktu]: data[i].tsettlelog_date_format, [language === null ? eng.jenisTransaksi : language.jenisTransaksi]: data[i].tsettlelog_paytype_name, [language === null ? eng.jumlah : language.jumlah]: data[i].tsettlelog_amount_trx - data[i].tsettlelog_amount_fee, [language === null ? eng.status : language.status]: data[i].tsettlelog_is_settle === true ? (language === null ? eng.berhasil : language.berhasil) : (language === null ? eng.gagal : language.gagal)})
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.laporanSettlement : language.laporanSettlement}.xlsx`);
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results.list_data = dataExportFilter.data.response_data.results.list_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].tsettlelog_settlement_code, [language === null ? eng.waktu : language.waktu]: data[i].tsettlelog_date_format, [language === null ? eng.jenisTransaksi : language.jenisTransaksi]: data[i].tsettlelog_paytype_name, [language === null ? eng.jumlah : language.jumlah]: data[i].tsettlelog_amount_trx - data[i].tsettlelog_amount_fee, [language === null ? eng.status : language.status]: data[i].tsettlelog_is_settle === true ? (language === null ? eng.berhasil : language.berhasil) : (language === null ? eng.gagal : language.gagal)})
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.laporanSettlement : language.laporanSettlement}.xlsx`);
                    }
                } catch (error) {
                    // console.log(error)
                    history.push(errorCatch(error.response.status))
                }
            }
            exportFilterSettlement(idTransaksi, periode, dateRange, partnerId)
        } else {
            async function exportGetSettlement(currentDate, partnerId) {
                try {
                    const auth = "Bearer " + getToken()
                    // const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "dateID": 2, "date_from": "", "date_to": "", "fitur_id": 0, "bank_code": ""}`)
                    const dataParams = encryptData(`{"subpartner_id": "${partnerId}", "paytype_id": 0, "id_transaksi" : "", "Date_from": "${currentDate}", "Date_to": "${currentDate}"}`)
                    const headers = {
                        'Content-Type':'application/json',
                        'Authorization' : auth,
                        // 'Accept-Language' : lang
                    }
                    const dataSettlement = await axios.post(BaseURL + "/Home/GetExportPartnerList", { data: dataParams }, { headers: headers })
                    // console.log(dataSettlement, "data settlement");
                    if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length === 0) {
                        const data = dataSettlement.data.response_data.results.list_data = dataSettlement.data.response_data.results.list_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].tsettlelog_settlement_code, [language === null ? eng.waktu : language.waktu]: data[i].tsettlelog_date_format, [language === null ? eng.jenisTransaksi : language.jenisTransaksi]: data[i].tsettlelog_paytype_name, [language === null ? eng.jumlah : language.jumlah]: data[i].tsettlelog_amount_trx - data[i].tsettlelog_amount_fee, [language === null ? eng.status : language.status]: data[i].tsettlelog_is_settle === true ? (language === null ? eng.berhasil : language.berhasil) : (language === null ? eng.gagal : language.gagal)})
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.laporanSettlement : language.laporanSettlement}.xlsx`);
                    } else if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length !== 0) {
                        setUserSession(dataSettlement.data.response_new_token)
                        const data = dataSettlement.data.response_data.results.list_data = dataSettlement.data.response_data.results.list_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].tsettlelog_settlement_code, [language === null ? eng.waktu : language.waktu]: data[i].tsettlelog_date_format, [language === null ? eng.jenisTransaksi : language.jenisTransaksi]: data[i].tsettlelog_paytype_name, [language === null ? eng.jumlah : language.jumlah]: data[i].tsettlelog_amount_trx - data[i].tsettlelog_amount_fee, [language === null ? eng.status : language.status]: data[i].tsettlelog_is_settle === true ? (language === null ? eng.berhasil : language.berhasil) : (language === null ? eng.gagal : language.gagal)})
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.laporanSettlement : language.laporanSettlement}.xlsx`);
                    }
                } catch (error) {
                    // console.log(error)
                    history.push(errorCatch(error.response.status))
                }
            }
            exportGetSettlement(currentDate, partnerId)
        }
    }

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
        </div>
    );

    // console.log(user_role, user_role !== "102" || user_role !== "104",'user_role' );

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> {language === null ? eng.laporan : language.laporan}</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;{user_role === "102" ? (language === null ? eng.settlement : language.settlement) : "Settlement"}</span>
            <div className='head-title'>
                <h2 className="h5 mb-1 mt-4" style={{fontWeight: 700, fontSize: 18, fontFamily: "Exo", color: "#383838"}}>{user_role === "102" ? (language === null ? eng.settlement : language.settlement) : "Settlement"}</h2>
            </div>
            <div className='main-content'>
                {
                    (user_role !== "102") ?
                    <div className='riwayat-settlement-div mt-3 mb-4'>
                        <span className='mt-4' style={{fontWeight: 600, fontSize: 16, fontFamily: "Exo", color: "#383838"}}>Tabel Riwayat Settlement Partner</span>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontSize: 16, fontFamily: "Exo", color: "#383838"}}>Filter</span>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span>ID Transaksi</span>
                                    <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiSettlement} name="idTransaksiSettlement" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span className='me-3'>Nama Partner</span>
                                    <div className="dropdown dropSaldoPartner">
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataListPartner}
                                            value={selectedPartnerSettlement}
                                            onChange={(selected) => setSelectedPartnerSettlement([selected])}
                                            placeholder="Pilih Nama Partner"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                </Col>
                                {/* <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span>Status</span>
                                    <Form.Select name="statusSettlement" className='input-text-riwayat ms-5' style={{ display: "inline" }} value={inputHandle.statusSettlement} onChange={(e) => handleChange(e)}>
                                        <option defaultChecked disabled value="">Pilih Status</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={1}>Dalam Proses</option>
                                        <option value={7}>Menunggu Pembayaran</option>
                                        <option value={9}>Kadaluwarsa</option>
                                    </Form.Select>
                                </Col> */}
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span>Jenis Transaksi</span>
                                    <Form.Select name='fiturSettlement' className='input-text-riwayat ms-3' style={{ display: "inline" }} value={inputHandle.fiturSettlement} onChange={(e) => handleChange(e)}>
                                        <option defaultValue disabled value={0}>Pilih Jenis Transaksi</option>
                                        <option value={104}>Payment Link</option>
                                        <option value={100}>Virtual Account</option>
                                        <option value={107}>Direct Debit</option>
                                        <option value={105}>E-Money</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateSettlement === "none") ? "33.2%" : "33.2%" }}>
                                    <span style={{ marginRight: 26 }}>Periode<span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periodeSettlement' className="input-text-riwayat ms-3" value={inputHandle.periodeSettlement} onChange={(e) => handleChangePeriodeSettlement(e, "admin")}>
                                        <option defaultChecked disabled value={0}>Pilih Periode</option>
                                        <option value={([`${currentDate}`, `${currentDate}`])}>Hari Ini</option>
                                        <option value={([`${yesterdayDate}`, `${yesterdayDate}`])}>Kemarin</option>
                                        <option value={([`${sevenDaysAgo}`, `${yesterdayDate}`])}>7 Hari Terakhir</option>
                                        <option value={([`${firstDayThisMonth}`, `${lastDayThisMonth}`])}>Bulan Ini</option>
                                        <option value={([`${firstDayLastMonth}`, `${lastDayLastMonth}`])}>Bulan Kemarin</option>
                                        <option value={7}>Pilih Range Tanggal</option>
                                    </Form.Select>
                                </Col>
                                {/* {
                                    Number(inputHandle.fiturSettlement) === 105 ?
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span className="me-2">Nama eWallet</span>
                                        <div className="dropdown dropSaldoPartner">
                                            <ReactSelect
                                                closeMenuOnSelect={true}
                                                hideSelectedOptions={false}
                                                options={listEWallet}
                                                value={selectedEWalletSettlement}
                                                onChange={(selected) => setSelectedEWalletSettlement([selected])}
                                                placeholder="Pilih Nama eWallet"
                                                components={{ Option }}
                                                styles={customStylesSelectedOption}
                                            />
                                        </div>
                                    </Col> :
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span className="me-2">Nama Bank</span>
                                        <div className="dropdown dropSaldoPartner">
                                            <ReactSelect
                                                closeMenuOnSelect={true}
                                                hideSelectedOptions={false}
                                                options={listBank}
                                                value={selectedBankSettlement}
                                                onChange={(selected) => setSelectedBankSettlement([selected])}
                                                placeholder="Pilih Nama Bank"
                                                components={{ Option }}
                                                styles={customStylesSelectedOption}
                                            />
                                        </div>
                                    </Col>
                                } */}
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} style={{ display: showDateSettlement }} className='text-end'>
                                    <div className='me-4' style={{ paddingRight: "0.5rem" }}>
                                        <DateRangePicker
                                            onChange={pickDateSettlement}
                                            value={stateSettlement}
                                            clearIcon={null}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                            <button
                                                // onClick={() => filterSettlement(1, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.periodeSettlement, dateRangeSettlement, 0, inputHandle.fiturSettlement, selectedBankSettlement.length !== 0 ? selectedBankSettlement[0].value : "", selectedEWalletSettlement.length !== 0 ? selectedEWalletSettlement[0].value : "")}
                                                onClick={() => filterSettlementNew(selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.fiturSettlement, inputHandle.idTransaksiSettlement, inputHandle.periodeSettlement, dateRangeSettlement, 1, 0)}
                                                className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0 || dateRangeSettlement.length !== 0 && selectedBankSettlement[0].value !== undefined) ? "btn-ez-on" : "btn-ez"}
                                                disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0 || inputHandle.periodeSettlement === 0 && selectedBankSettlement[0].value === undefined}
                                            >
                                                Terapkan
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => resetButtonHandle("admin")}
                                                className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0 || dateRangeSettlement.length !== 0 && selectedBankSettlement[0].value !== undefined) ? "btn-reset" : "btn-ez-reset"}
                                                disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0 || inputHandle.periodeSettlement === 0 && selectedBankSettlement[0].value === undefined}
                                            >
                                                Atur Ulang
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div className='settlement-amount'>
                                <div className="card-information mt-3" style={{border: '1px solid #EBEBEB'}}>
                                    <p className="p-info">Total Settlement</p>
                                    <p className="p-amount">{convertToRupiah(totalSettlement)}</p>
                                </div>
                            </div>
                            {
                                dataRiwayatSettlement.length !== 0 &&
                                    <div className='d-flex justify-content-end' style={{ marginBottom: -15 }}>
                                        <Link to={"#"} style={{ marginRight: 15 }} onClick={() => ExportReportSettlementHandler("summary", isFilterSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.fiturSettlement, inputHandle.idTransaksiSettlement, inputHandle.periodeSettlement, dateRangeSettlement)} className="export-span">Export Summary</Link>
                                        <Link to={"#"} onClick={() => ExportReportSettlementHandler("details", isFilterSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.fiturSettlement, inputHandle.idTransaksiSettlement, inputHandle.periodeSettlement, dateRangeSettlement)} className="export-span">Export Details</Link>
                                    </div>
                            }
                            <div className="div-table mt-4 pb-4">
                                <DataTable
                                    columns={columnsSettl}
                                    data={dataRiwayatSettlement}
                                    customStyles={customStylesSettlement}
                                    progressPending={pendingSettlement}
                                    progressComponent={<CustomLoader />}
                                    dense
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
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
                    </div> :
                    <div className='riwayat-settlement-div mt-3 mb-4'>
                        <span className='mt-4' style={{fontWeight: 600, fontSize: 16, fontFamily: "Exo", color: "#383838"}}>{language === null ? eng.tabelRiwayatSettlementPartner : language.tabelRiwayatSettlementPartner}</span>
                        <div className='base-content mt-3'>
                            <span className='mt-4' style={{fontWeight: 600, fontSize: 16, fontFamily: "Exo", color: "#383838"}}>{language === null ? eng.filter : language.filter}</span>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span className="me-1">{language === null ? eng.idTransaksi : language.idTransaksi}</span>
                                    <input name="idTransaksiSettlementPartner" onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiSettlementPartner} type='text'className='input-text-riwayat' style={{marginLeft: 31}} placeholder={language === null ? eng.placeholderIdTrans : language.placeholderIdTrans}/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateSettlementPartner === "none") ? "33%" : "33%" }}>
                                    <span >{language === null ? eng.periode : language.periode}<span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periodeSettlementPartner' className="input-text-riwayat ms-3" value={inputHandle.periodeSettlementPartner} onChange={(e) => handleChangePeriodeSettlement(e, "partner")}>
                                        <option defaultChecked disabled value={0}>{language === null ? eng.pilihPeriode : language.pilihPeriode}</option>
                                        <option value={([`${currentDate}`, `${currentDate}`])}>{language === null ? eng.hariIni : language.hariIni}</option>
                                        <option value={([`${yesterdayDate}`, `${yesterdayDate}`])}>{language === null ? eng.kemarin : language.kemarin}</option>
                                        <option value={([`${sevenDaysAgo}`, `${yesterdayDate}`])}>{language === null ? eng.tujuhHariTerakhir : language.tujuhHariTerakhir}</option>
                                        <option value={([`${firstDayThisMonth}`, `${lastDayThisMonth}`])}>{language === null ? eng.bulanIni : language.bulanIni}</option>
                                        <option value={([`${firstDayLastMonth}`, `${lastDayLastMonth}`])}>{language === null ? eng.bulanKemarin : language.bulanKemarin}</option>
                                        <option value={7}>{language === null ? eng.pilihRangeTanggal : language.pilihRangeTanggal}</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span>{language === null ? eng.jenisTransaksi : language.jenisTransaksi}</span>
                                    <Form.Select name="fiturSettlementPartner" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.fiturSettlementPartner} onChange={(e) => handleChange(e)}>
                                        <option defaultValue value={0}>{language === null ? eng.placeholderJenisTransaksi : language.placeholderJenisTransaksi}</option>
                                        <option value={104}>{language === null ? eng.paymentLink : language.paymentLink}</option>
                                        <option value={100}>{language === null ? eng.vapartner : language.vapartner}</option>
                                        <option value={107}>{language === null ? eng.directDebit : language.directDebit}</option>
                                        <option value={105}>{language === null ? eng.emoney : language.emoney}</option>
                                    </Form.Select>
                                </Col>
                                {/* <Col xs={4}>
                                    <span>Status</span>
                                    <Form.Select name="statusSettlementPartner" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.statusSettlementPartner} onChange={(e) => handleChange(e)}>
                                        <option defaultChecked disabled value="">Pilih Status</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={1}>Dalam Proses</option>
                                        <option value={4}>Gagal</option>
                                    </Form.Select>
                                </Col> */}
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} style={{ display: showDateSettlementPartner }}>
                                    <DateRangePicker
                                        onChange={pickDateSettlementPartner}
                                        value={stateSettlementPartner}
                                        clearIcon={null}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                // onClick={() => filterSettlementPartner(inputHandle.idTransaksiSettlementPartner, dateRangeSettlementPartner, inputHandle.periodeSettlementPartner, 1, 0, inputHandle.statusSettlementPartner, inputHandle.fiturSettlementPartner)}
                                                onClick={() => filterSettlementPartnerNew(inputHandle.fiturSettlementPartner, inputHandle.idTransaksiSettlementPartner, inputHandle.periodeSettlementPartner, dateRangeSettlementPartner, partnerId, 1, 0)}
                                                className={(inputHandle.periodeSettlementPartner !== 0 || dateRangeSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.idTransaksiSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.statusSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.fiturSettlementPartner.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                                disabled={inputHandle.periodeSettlementPartner === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.idTransaksiSettlementPartner.length === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.statusSettlementPartner.length === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.fiturSettlementPartner.length === 0}
                                            >
                                                {language === null ? eng.terapkan : language.terapkan}
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => resetButtonHandle("partner")}
                                                className={(inputHandle.periodeSettlementPartner || dateRangeSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.idTransaksiSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.statusSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.fiturSettlementPartner.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                                                disabled={inputHandle.periodeSettlementPartner === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.idTransaksiSettlementPartner.length === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.statusSettlementPartner.length === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.fiturSettlementPartner.length === 0}
                                            >
                                                {language === null ? eng.aturUlang : language.aturUlang}
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {
                                dataRiwayatSettlementPartner.length !== 0 &&
                                    <div>
                                        <Link onClick={() => ExportReportSettlementPartnerHandler(isFilterSettlementPartner, inputHandle.fiturSettlementPartner, inputHandle.idTransaksiSettlementPartner, inputHandle.periodeSettlementPartner, dateRangeSettlementPartner, currentDate, partnerId)} className="export-span">{language === null ? eng.export : language.export}</Link>
                                    </div>
                            }
                            <br/>
                            <br/>
                            <div className="div-table pb-4">
                                <DataTable
                                    columns={columnsSettlementPartner}
                                    data={dataRiwayatSettlementPartner}
                                    customStyles={customStylesPartner}
                                    progressPending={pendingSettlementPartner}
                                    progressComponent={<CustomLoader />}
                                    noDataComponent={language === null ? eng.tidakAdaData : language.tidakAdaData}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>{language === null ? eng.totalHalaman : language.totalHalaman} : {totalPageSettlementPartner}</div>
                                <Pagination
                                    activePage={activePageSettlementPartner}
                                    itemsCountPerPage={pageNumberSettlementPartner.row_per_page}
                                    totalItemsCount={(pageNumberSettlementPartner.row_per_page*pageNumberSettlementPartner.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeSettlementPartner}
                                />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default SettlementPage