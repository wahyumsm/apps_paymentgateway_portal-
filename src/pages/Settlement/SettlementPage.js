import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import React, { useEffect, useState } from 'react'
import Pagination from 'react-js-pagination';
import { Link, useHistory } from 'react-router-dom';
import ReactSelect, { components } from 'react-select'
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import * as XLSX from "xlsx"
import axios from 'axios';
import encryptData from '../../function/encryptData';
import DataTable, { defaultThemes } from 'react-data-table-component';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"

function SettlementPage() {

    const history = useHistory()
    const access_token = getToken();
    const user_role = getRole();
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
        history.push("/Riwayat Transaksi/va-dan-paylink");
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
        if (role !== "partner") {
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
        } else {
            if (e.target.value === "7") {
                setShowDateSettlementPartner("")
                setInputHandle({
                    ...inputHandle,
                    [e.target.name] : e.target.value
                })
            } else {
                setShowDateSettlementPartner("none")
                setInputHandle({
                    ...inputHandle,
                    [e.target.name] : e.target.value
                })
            }
        }
    }

    function handlePageChangeSettlement(page) {
        if (isFilterSettlement) {
            setActivePageSettlement(page)
            filterSettlement(page, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.periodeSettlement, dateRangeSettlement, 0, inputHandle.fiturSettlement, selectedBankSettlement.length !== 0 ? selectedBankSettlement[0].value : "", selectedEWalletSettlement.length !== 0 ? selectedEWalletSettlement[0].value : "")
        } else {
            setActivePageSettlement(page)
            riwayatSettlement(page)
        }
    }

    function handlePageChangeSettlementPartner(page) {
        if (isFilterSettlementPartner) {
            setActivePageSettlementPartner(page)
            filterSettlementPartner(inputHandle.idTransaksiSettlementPartner, dateRangeSettlementPartner, inputHandle.periodeSettlementPartner, page, 0, inputHandle.statusSettlementPartner, inputHandle.fiturSettlementPartner)
        } else {
            setActivePageSettlementPartner(page)
            riwayatSettlementPartner(page, currentDate)
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

    async function riwayatSettlementPartner(currentPage, currentDate) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "dateID": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10, "fitur_id": 0, "bank_code": ""}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
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

    async function filterSettlement(page, statusId, transId, partnerId, dateId, periode, rowPerPage, fiturSettlement, bankSettlement, eWalletSettlement) {
        try {
            setPendingSettlement(true)
            setIsFilterSettlement(true)
            setActivePageSettlement(page)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "partnerID":"${(partnerId !== undefined) ? partnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "fitur_id": ${fiturSettlement}, "bank_code": "${Number(fiturSettlement) === 105 ? (eWalletSettlement !== undefined ? eWalletSettlement : "") : (bankSettlement !== undefined ? bankSettlement : "")}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
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

    async function filterSettlementPartner(idTransaksi, periode, dateId, page, rowPerPage, status, fitur) {
        try {
            setPendingSettlementPartner(true)
            setIsFilterSettlementPartner(true)
            setActivePageSettlementPartner(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"statusID": [${(status.length !== 0) ? status : [1,2,7,9]}], "transID" : "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "fitur_id": ${fitur}, "bank_code": ""}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
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
            riwayatSettlement(activePageSettlement)
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
            riwayatSettlementPartner(activePageSettlementPartner, currentDate)
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
            riwayatSettlementPartner(activePageSettlementPartner, currentDate)
        } else {
            listPartner()
            riwayatSettlement(activePageSettlement)
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
            cell: (row) => <button className='btn-riwayat-settlement' onClick={() => resendEmailHandler(row.tvasettl_id, row.settlement_type)} >Send Email</button>
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tvasettl_code,
            width: "224px",
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}/${selectedBankSettlement.length === 0 ? '0' : selectedBankSettlement[0].value}/${row.settlement_type}/${selectedEWalletSettlement.length === 0 ? "0" : selectedEWalletSettlement[0].value}`} >{row.tvasettl_code}</Link>
        },
        {
            name: 'Waktu',
            selector: row => row.tvasettl_crtdt_format,
            width: "150px",
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "224px",
            wrap: true,
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.mfitur_desc,
            width: "224px",
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.tvasettl_amount),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Total Transaksi',
            selector: row => row.total_trx,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Layanan',
            selector: row => convertToRupiah(row.total_partner_fee),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'PPN atas Jasa Layanan',
            selector: row => convertToRupiah(row.total_fee_tax),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Reimbursement by VA',
            selector: row => convertToRupiah(row.total_fee_bank),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Settlement',
            selector: row => convertToRupiah(row.tvasettl_fee),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            width: "140px",
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.tvasettl_status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.tvasettl_status_id === 1 || row.tvasettl_status_id === 7,
                    style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
                },
                {
                    when: row => row.tvasettl_status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                },
                {
                    when: row => row.tvasettl_status_id === 3 || row.tvasettl_status_id === 5 || row.tvasettl_status_id === 6 || row.tvasettl_status_id === 8 || row.tvasettl_status_id === 9 || row.tvasettl_status_id === 10 || row.tvasettl_status_id === 11 || row.tvasettl_status_id === 12 || row.tvasettl_status_id === 13 || row.tvasettl_status_id === 14 || row.tvasettl_status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                }
            ],
        },
    ];

    const columnsSettlementPartner = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tvasettl_code,
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}/${'0'}/${row.settlement_type}/${'0'}`}>{row.tvasettl_code}</Link>,
            width: "251px"
        },
        {
            name: 'Waktu',
            selector: row => row.tvasettl_crtdt_format,
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
            selector: row => row.mstatus_name_ind,
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

    function ExportReportSettlementHandler(isFilter, statusId, transId, partnerId, dateId, periode, fiturSettlement, bankCode, eWalletSettlement) {
        if (isFilter) {
            async function dataExportFilter(statusId, transId, partnerId, dateId, periode, codeBank, fiturSettlement, eWalletSettlement) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "partnerID":"${(partnerId.length !== 0) ? partnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "fitur_id": ${fiturSettlement}, "bank_code": "${Number(fiturSettlement) === 105 ? (eWalletSettlement !== undefined ? eWalletSettlement : "") : (codeBank !== undefined ? codeBank : "")}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Home/GetListHistorySettlement", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt_format, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].mfitur_desc, "Nominal Settlement": data[i].tvasettl_amount, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].total_partner_fee, "PPN atas Jasa Layanan": data[i].total_fee_tax, "Reimbursement by VA": data[i].total_fee_bank, "Jasa Settlement": data[i].tvasettl_fee, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt_format, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].mfitur_desc, "Nominal Settlement": data[i].tvasettl_amount, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].total_partner_fee, "PPN atas Jasa Layanan": data[i].total_fee_tax, "Reimbursement by VA": data[i].total_fee_bank, "Jasa Settlement": data[i].tvasettl_fee, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement.xlsx");
                    }
                } catch (error) {
                    // console.log(error)
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(statusId, transId, partnerId, dateId, periode, bankCode, fiturSettlement, eWalletSettlement)
        } else {
            async function dataExportSettlement() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "partnerID":"", "subPartnerID":"", "dateID": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000, "fitur_id": 0, "bank_code": ""}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportSettlement = await axios.post(BaseURL + "/Home/GetListHistorySettlement", {data: dataParams}, { headers: headers });
                    if (dataExportSettlement.status === 200 && dataExportSettlement.data.response_code === 200 && dataExportSettlement.data.response_new_token.length === 0) {
                        const data = dataExportSettlement.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt_format, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].mfitur_desc, "Nominal Settlement": data[i].tvasettl_amount, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].total_partner_fee, "PPN atas Jasa Layanan": data[i].total_fee_tax, "Reimbursement by VA": data[i].total_fee_bank, "Jasa Settlement": data[i].tvasettl_fee, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement.xlsx");
                    } else if (dataExportSettlement.status === 200 && dataExportSettlement.data.response_code === 200 && dataExportSettlement.data.response_new_token.length !== 0) {
                        setUserSession(dataExportSettlement.data.response_new_token)
                        const data = dataExportSettlement.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt_format, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].mfitur_desc, "Nominal Settlement": data[i].tvasettl_amount, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].total_partner_fee, "PPN atas Jasa Layanan": data[i].total_fee_tax, "Reimbursement by VA": data[i].total_fee_bank, "Jasa Settlement": data[i].tvasettl_fee, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Settlement.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportSettlement()
        }
    }

    function ExportReportSettlementPartnerHandler(isFilter, idTransaksi, periode, dateId, status, fitur, oneMonthAgo, currentDate) {
        if (isFilter) {
            async function exportFilterSettlement(idTransaksi, periode, dateId, status, fitur) {
                try {
                    const auth = "Bearer " + getToken()
                    const dataParams = encryptData(`{"statusID": [${(status.length !== 0) ? status : [1,2,7,9]}], "transID" : "${(idTransaksi.length !== 0) ? idTransaksi : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 1000000, "fitur_id": ${fitur}, "bank_code": ""}`)
                    const headers = {
                        'Content-Type':'application/json',
                        'Authorization' : auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Home/GetListHistorySettlement", { data: dataParams }, { headers: headers })
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results.list_data = dataExportFilter.data.response_data.results.list_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, "Waktu": data[i].tvasettl_crtdt_format, "Jenis Transaksi": data[i].mfitur_desc, "Jumlah": data[i].tvasettl_amount, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Laporan Settlement.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {            
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results.list_data = dataExportFilter.data.response_data.results.list_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, "Waktu": data[i].tvasettl_crtdt_format, "Jenis Transaksi": data[i].mfitur_desc, "Jumlah": data[i].tvasettl_amount, Status: data[i].mstatus_name_ind })
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
                    const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "dateID": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000, "fitur_id": 0, "bank_code": ""}`)
                    const headers = {
                        'Content-Type':'application/json',
                        'Authorization' : auth
                    }
                    const dataSettlement = await axios.post(BaseURL + "/Home/GetListHistorySettlement", { data: dataParams }, { headers: headers })
                    // console.log(dataSettlement, "data settlement");
                    if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length === 0) {
                        const data = dataSettlement.data.response_data.results.list_data = dataSettlement.data.response_data.results.list_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, "Waktu": data[i].tvasettl_crtdt_format, "Jenis Transaksi": data[i].mfitur_desc, "Jumlah": data[i].tvasettl_amount, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Laporan Settlement.xlsx");
                    } else if (dataSettlement.status === 200 && dataSettlement.data.response_code === 200 && dataSettlement.data.response_new_token.length !== 0) {
                        setUserSession(dataSettlement.data.response_new_token)
                        const data = dataSettlement.data.response_data.results.list_data = dataSettlement.data.response_data.results.list_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, "Waktu": data[i].tvasettl_crtdt_format, "Jenis Transaksi": data[i].mfitur_desc, "Jumlah": data[i].tvasettl_amount, Status: data[i].mstatus_name_ind })
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
        </div>
    );

    // console.log(user_role, user_role !== "102" || user_role !== "104",'user_role' );

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> Laporan</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Settlement</span>
            <div className='head-title'>
                <h2 className="h5 mb-1 mt-4" style={{fontWeight: 700, fontSize: 18, fontFamily: "Exo", color: "#383838"}}>Settlement</h2>
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
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span>Status</span>
                                    <Form.Select name="statusSettlement" className='input-text-riwayat ms-5' style={{ display: "inline" }} value={inputHandle.statusSettlement} onChange={(e) => handleChange(e)}>
                                        <option defaultChecked disabled value="">Pilih Status</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={1}>Dalam Proses</option>
                                        <option value={7}>Menunggu Pembayaran</option>
                                        <option value={9}>Kadaluwarsa</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateSettlement === "none") ? "33.2%" : "33.2%" }}>
                                    <span style={{ marginRight: 26 }}>Periode<span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periodeSettlement' className="input-text-riwayat ms-3" value={inputHandle.periodeSettlement} onChange={(e) => handleChangePeriodeSettlement(e, "admin")}>
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
                                    <Form.Select name='fiturSettlement' className='input-text-riwayat ms-3' style={{ display: "inline" }} value={inputHandle.fiturSettlement} onChange={(e) => handleChange(e)}>
                                        <option defaultValue disabled value={0}>Pilih Jenis Transaksi</option>
                                        <option value={104}>Payment Link</option>
                                        <option value={100}>Virtual Account</option>
                                        <option value={107}>Direct Debit</option>
                                        <option value={105}>E-Money</option>
                                    </Form.Select>
                                </Col>
                                {
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
                                }
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
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => filterSettlement(1, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.periodeSettlement, dateRangeSettlement, 0, inputHandle.fiturSettlement, selectedBankSettlement.length !== 0 ? selectedBankSettlement[0].value : "", selectedEWalletSettlement.length !== 0 ? selectedEWalletSettlement[0].value : "")}
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
                                <div style={{ marginBottom: 30 }}>
                                    <Link to={"#"} onClick={() => ExportReportSettlementHandler(isFilterSettlement, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.periodeSettlement, dateRangeSettlement, inputHandle.fiturSettlement, selectedBankSettlement.length !== 0 ? selectedBankSettlement[0].value : "", selectedEWalletSettlement.length !== 0 ? selectedEWalletSettlement[0].value : "")} className="export-span">Export</Link>
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
                        <span className='mt-4' style={{fontWeight: 600, fontSize: 16, fontFamily: "Exo", color: "#383838"}}>Tabel Riwayat Settlement Partner</span>
                        <div className='base-content mt-3'>
                            <span className='mt-4' style={{fontWeight: 600, fontSize: 16, fontFamily: "Exo", color: "#383838"}}>Filter</span>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span className="me-1">ID Transaksi</span>
                                    <input name="idTransaksiSettlementPartner" onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiSettlementPartner} type='text'className='input-text-riwayat' style={{marginLeft: 31}} placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateSettlementPartner === "none") ? "33%" : "33%" }}>
                                    <span >Periode<span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periodeSettlementPartner' className="input-text-riwayat ms-3" value={inputHandle.periodeSettlementPartner} onChange={(e) => handleChangePeriodeSettlement(e, "partner")}>
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
                                    <Form.Select name="statusSettlementPartner" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.statusSettlementPartner} onChange={(e) => handleChange(e)}>
                                        <option defaultChecked disabled value="">Pilih Status</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={1}>Dalam Proses</option>
                                        <option value={4}>Gagal</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span>Jenis Transaksi</span>
                                    <Form.Select name="fiturSettlementPartner" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.fiturSettlementPartner} onChange={(e) => handleChange(e)}>
                                        <option defaultValue value={0}>Pilih Jenis Transaksi</option>
                                        <option value={104}>Payment Link</option>
                                        <option value={100}>VA Partner</option>
                                        <option value={107}>Direct Debit</option>
                                        <option value={105}>E-Money</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} style={{ display: showDateSettlementPartner }}>
                                    <DateRangePicker
                                        onChange={pickDateSettlementPartner}
                                        value={stateSettlementPartner}
                                        clearIcon={null}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => filterSettlementPartner(inputHandle.idTransaksiSettlementPartner, dateRangeSettlementPartner, inputHandle.periodeSettlementPartner, 1, 0, inputHandle.statusSettlementPartner, inputHandle.fiturSettlementPartner)}
                                                className={(inputHandle.periodeSettlementPartner !== 0 || dateRangeSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.idTransaksiSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.statusSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.fiturSettlementPartner.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                                disabled={inputHandle.periodeSettlementPartner === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.idTransaksiSettlementPartner.length === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.statusSettlementPartner.length === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.fiturSettlementPartner.length === 0}
                                            >
                                                Terapkan
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => resetButtonHandle("partner")}
                                                className={(inputHandle.periodeSettlementPartner || dateRangeSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.idTransaksiSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.statusSettlementPartner.length !== 0 || dateRangeSettlementPartner.length !== 0 && inputHandle.fiturSettlementPartner.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                                                disabled={inputHandle.periodeSettlementPartner === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.idTransaksiSettlementPartner.length === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.statusSettlementPartner.length === 0 || inputHandle.periodeSettlementPartner === 0 && inputHandle.fiturSettlementPartner.length === 0}
                                            >
                                                Atur Ulang
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {
                                dataRiwayatSettlementPartner.length !== 0 &&
                                    <div>
                                        <Link onClick={() => ExportReportSettlementPartnerHandler(isFilterSettlementPartner, inputHandle.idTransaksiSettlementPartner, dateRangeSettlementPartner, inputHandle.periodeSettlementPartner, inputHandle.statusSettlementPartner, inputHandle.fiturSettlementPartner, oneMonthAgo, currentDate)} className="export-span">Export</Link>
                                    </div>
                            }
                            <br/>
                            <br/>
                            <div className="div-table">
                                <DataTable
                                    columns={columnsSettlementPartner}
                                    data={dataRiwayatSettlementPartner}
                                    customStyles={customStylesPartner}
                                    progressPending={pendingSettlementPartner}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageSettlementPartner}</div>
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