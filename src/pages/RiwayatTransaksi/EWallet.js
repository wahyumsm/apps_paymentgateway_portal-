import React, { useEffect, useState } from 'react'
import { Col, Row, Button, Dropdown, ButtonGroup, InputGroup, Form, Image, Modal, Container} from '@themesberg/react-bootstrap';
import DataTable, { defaultThemes } from 'react-data-table-component';
// import { invoiceItems } from '../../data/tables';
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, RouteTo, setUserSession } from '../../function/helpers';
import encryptData from '../../function/encryptData';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import * as XLSX from "xlsx"
import Pagination from "react-js-pagination";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import ReactSelect, { components } from 'react-select';
import { ind } from '../../components/Language';
import { id } from 'date-fns/locale';

function EWallet() {
    const language = JSON.parse(sessionStorage.getItem('lang'))
    console.log(language, "language");
    const history = useHistory()
    const access_token = getToken();
    const user_role = getRole();
    const [dataListPartner, setDataListPartner] = useState([])
    const [dataRiwayatEWallet, setDataRiwayatEWallet] = useState([])
    const [dateRangeEWallet, setDateRangeEWallet] = useState([])
    const [showDateEWallet, setShowDateEWallet] = useState("none")
    const [pendingTransfer, setPendingTransfer] = useState(true)
    const [activePageEWallet, setActivePageEWallet] = useState(1)
    const [pageNumberEWallet, setPageNumberEWallet] = useState({})
    const [totalPageEWallet, setTotalPageEWallet] = useState(0)
    const [isFilterEWallet, setIsFilterEWallet] = useState(false)
    const [stateEWallet, setStateEWallet] = useState(null)
    const [inputHandle, setInputHandle] = useState({
        idTransaksiEWallet: "",
        statusEWallet: "",
        periodeEWallet: 0,
        channelEWallet: 0,
        partnerTransIdEWallet: "",
    })

    const [selectedPartnerEWallet, setSelectedPartnerEWallet] = useState([])
    const [selectedAgenEWallet, setSelectedAgenEWallet] = useState([])
    const [selectedBankEWallet, setSelectedBankEWallet] = useState([])

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    {/* <input
                        type='select'
                        checked={props.isSelected}
                        onChange={() => null}
                    />{" "} */}
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

    function handleChangeNamaPartner(e, jenisTransaksi) {
        if (jenisTransaksi === 'EWallet') {
            // getListAgenFromPartner(e.value)
            setSelectedPartnerEWallet([e])
        } else {
            // setSelectedPartnerSettlement([e])
        }
    }

    function handleChangePeriodeTransfer(e) {
        if (e.target.value === "7") {
            setShowDateEWallet("")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateEWallet("none")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        }
    }

    function handlePageChangeEWallet(page) {
        if (isFilterEWallet) {
            setActivePageEWallet(page)
            filterRiwayatEWallet(page, inputHandle.statusEWallet, inputHandle.idTransaksiEWallet, selectedPartnerEWallet.length !== 0 ? selectedPartnerEWallet[0].value : "", inputHandle.periodeEWallet, dateRangeEWallet, 0, inputHandle.partnerTransIdEWallet, inputHandle.channelEWallet)
        } else {
            setActivePageEWallet(page)
            transaksiEwallet(page)
        }
    }

    function pickDateEWallet(item) {
        setStateEWallet(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeEWallet(item)
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

    async function transaksiEwallet(currentPage) {
        try {
            const auth = 'Bearer ' + getToken();
            // const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : 0, "partnerID":"", "subPartnerID":"", "dateID": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10, "partner_transid": "", "bank_code": "", "fitur_id": 0}`)
            const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "sub_partner_id":"", "dateID": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10, "reference_no": "", "walletID": 0}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataRiwayatEWallet = await axios.post(BaseURL + "/Report/HistoryEmoney", {data: dataParams}, { headers: headers });
            // console.log(dataRiwayatEWallet, "dataRiwayatEWallet");
            if (dataRiwayatEWallet.status === 200 && dataRiwayatEWallet.data.response_code === 200 && dataRiwayatEWallet.data.response_new_token.length === 0) {
                dataRiwayatEWallet.data.response_data.results = dataRiwayatEWallet.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberEWallet(dataRiwayatEWallet.data.response_data)
                setTotalPageEWallet(dataRiwayatEWallet.data.response_data.max_page)
                setDataRiwayatEWallet(dataRiwayatEWallet.data.response_data.results)
                setPendingTransfer(false)
            } else if (dataRiwayatEWallet.status === 200 && dataRiwayatEWallet.data.response_code === 200 && dataRiwayatEWallet.data.response_new_token.length !== 0) {
                setUserSession(dataRiwayatEWallet.data.response_new_token)
                dataRiwayatEWallet.data.response_data.results = dataRiwayatEWallet.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberEWallet(dataRiwayatEWallet.data.response_data)
                setTotalPageEWallet(dataRiwayatEWallet.data.response_data.max_page)
                setDataRiwayatEWallet(dataRiwayatEWallet.data.response_data.results)
                setPendingTransfer(false)
            }
        } catch (error) {
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterRiwayatEWallet(page, statusId, transId, subPartnerId, dateId, periode, rowPerPage, partnerTransId, eWalletId) {
        try {
            setPendingTransfer(true)
            setIsFilterEWallet(true)
            setActivePageEWallet(page)
            const auth = 'Bearer ' + getToken();
            // const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : ${(transId.length !== 0) ? transId : 0}, "partnerID":"${(partnerId !== undefined) ? partnerId : ""}", "subPartnerID": "${(subPartnerId !== undefined) ? subPartnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10},  "partner_transid": "${partnerTransId}", "bank_code":"${bankEWallet !== undefined ? bankEWallet : ""}", "fitur_id": ${fiturEWallet}}`)
            const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "sub_partner_id":"${(subPartnerId !== undefined) ? subPartnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "reference_no": "${partnerTransId}", "walletID": ${eWalletId}}`)
            // console.log(dataParams, "filter dana masuk");
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const filterRiwayatEWallet = await axios.post(BaseURL + "/Report/HistoryEmoney", {data: dataParams}, { headers: headers });
            // console.log(filterRiwayatEWallet, "filterRiwayatEWallet");
            if (filterRiwayatEWallet.status === 200 && filterRiwayatEWallet.data.response_code === 200 && filterRiwayatEWallet.data.response_new_token.length === 0) {
                filterRiwayatEWallet.data.response_data.results = filterRiwayatEWallet.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberEWallet(filterRiwayatEWallet.data.response_data)
                setTotalPageEWallet(filterRiwayatEWallet.data.response_data.max_page)
                setDataRiwayatEWallet(filterRiwayatEWallet.data.response_data.results)
                setPendingTransfer(false)
            } else if (filterRiwayatEWallet.status === 200 && filterRiwayatEWallet.data.response_code === 200 && filterRiwayatEWallet.data.response_new_token.length !== 0) {
                setUserSession(filterRiwayatEWallet.data.response_new_token)
                filterRiwayatEWallet.data.response_data.results = filterRiwayatEWallet.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberEWallet(filterRiwayatEWallet.data.response_data)
                setTotalPageEWallet(filterRiwayatEWallet.data.response_data.max_page)
                setDataRiwayatEWallet(filterRiwayatEWallet.data.response_data.results)
                setPendingTransfer(false)
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
                idTransaksiEWallet: "",
                statusEWallet: "",
                periodeEWallet: 0,
                channelEWallet: 0,
                partnerTransIdEWallet: "",
            })
            setSelectedPartnerEWallet([])
            setSelectedAgenEWallet([])
            setSelectedBankEWallet([])
            setStateEWallet(null)
            setDateRangeEWallet([])
            setShowDateEWallet("none")
        }
    }

    function ExportReportTransferEWalletHandler(isFilter, statusId, transId, subPartnerId, dateId, periode, partnerTransId, eWalletId) {
        if (isFilter && user_role !== "102") {
            async function dataExportFilter(statusId, transId, subPartnerId, dateId, periode, eWalletId) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "sub_partner_id": "${(subPartnerId.length !== 0) ? subPartnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 1000000, "reference_no": "${partnerTransId}", "walletID": ${eWalletId}}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Report/HistoryEmoney", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transID, Waktu: data[i].processDate, "Partner Trans ID": data[i].referenceNumber, "Nama Partner": data[i].partnerName, "Channel eWallet": data[i].ewalletName, "Nominal Transaksi": data[i].amount, "Biaya eWallet": data[i].ewalletFee, "Biaya Pajak": data[i].feeTax, "Total Biaya": data[i].totalAmount, Status: data[i].status })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi eWallet.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transID, Waktu: data[i].processDate, "Partner Trans ID": data[i].referenceNumber, "Nama Partner": data[i].partnerName, "Channel eWallet": data[i].ewalletName, "Nominal Transaksi": data[i].amount, "Biaya eWallet": data[i].ewalletFee, "Biaya Pajak": data[i].feeTax, "Total Biaya": data[i].totalAmount, Status: data[i].status })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi eWallet.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(statusId, transId, subPartnerId, dateId, periode, eWalletId)
        } else if (isFilter === false && user_role !== "102") {
            async function dataExportEWallet() {
                try {
                    const auth = 'Bearer ' + getToken();
                    // const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : 0, "partnerID":"", "subPartnerID":"", "dateID": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000, "partner_transid":"", "bank_code": "", "fitur_id": 0}`)
                    const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "sub_partner_id":"", "dateID": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000, "reference_no": "", "walletID": 0}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportEWallet = await axios.post(BaseURL + "/Report/HistoryEmoney", {data: dataParams}, { headers: headers });
                    if (dataExportEWallet.status === 200 && dataExportEWallet.data.response_code === 200 && dataExportEWallet.data.response_new_token.length === 0) {
                        const data = dataExportEWallet.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transID, Waktu: data[i].processDate, "Partner Trans ID": data[i].referenceNumber, "Nama Partner": data[i].partnerName, "Channel eWallet": data[i].ewalletName, "Nominal Transaksi": data[i].amount, "Biaya eWallet": data[i].ewalletFee, "Biaya Pajak": data[i].feeTax, "Total Biaya": data[i].totalAmount, Status: data[i].status })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi eWallet.xlsx");
                    } else if (dataExportEWallet.status === 200 && dataExportEWallet.data.response_code === 200 && dataExportEWallet.data.response_new_token.length !== 0) {
                        setUserSession(dataExportEWallet.data.response_new_token)
                        const data = dataExportEWallet.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transID, Waktu: data[i].processDate, "Partner Trans ID": data[i].referenceNumber, "Nama Partner": data[i].partnerName, "Channel eWallet": data[i].ewalletName, "Nominal Transaksi": data[i].amount, "Biaya eWallet": data[i].ewalletFee, "Biaya Pajak": data[i].feeTax, "Total Biaya": data[i].totalAmount, Status: data[i].status })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi eWallet.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportEWallet()
        } else if (isFilter && user_role === "102") {
            async function dataExportFilter(statusId, transId, subPartnerId, dateId, periode, eWalletId) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "sub_partner_id": "${(subPartnerId.length !== 0) ? subPartnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 1000000, "reference_no": "${partnerTransId}", "walletID": ${eWalletId}}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Report/HistoryEmoney", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transID, Waktu: data[i].processDate, "Partner Trans ID": data[i].referenceNumber, "Channel eWallet": data[i].ewalletName, "Nominal Transaksi": data[i].amount, Status: data[i].status })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi eWallet.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transID, Waktu: data[i].processDate, "Partner Trans ID": data[i].referenceNumber, "Channel eWallet": data[i].ewalletName, "Nominal Transaksi": data[i].amount, Status: data[i].status })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi eWallet.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(statusId, transId, subPartnerId, dateId, periode, eWalletId)
        } else if (isFilter === false && user_role === "102") {
            async function dataExportEWallet() {
                try {
                    const auth = 'Bearer ' + getToken();
                    // const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : 0, "partnerID":"", "subPartnerID":"", "dateID": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000, "partner_transid":"", "bank_code": "", "fitur_id": 0}`)
                    const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "sub_partner_id":"", "dateID": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000, "reference_no": "", "walletID": 0}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportEWallet = await axios.post(BaseURL + "/Report/HistoryEmoney", {data: dataParams}, { headers: headers });
                    if (dataExportEWallet.status === 200 && dataExportEWallet.data.response_code === 200 && dataExportEWallet.data.response_new_token.length === 0) {
                        const data = dataExportEWallet.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transID, Waktu: data[i].processDate, "Partner Trans ID": data[i].referenceNumber, "Channel eWallet": data[i].ewalletName, "Nominal Transaksi": data[i].amount, Status: data[i].status })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi eWallet.xlsx");
                    } else if (dataExportEWallet.status === 200 && dataExportEWallet.data.response_code === 200 && dataExportEWallet.data.response_new_token.length !== 0) {
                        setUserSession(dataExportEWallet.data.response_new_token)
                        const data = dataExportEWallet.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transID, Waktu: data[i].processDate, "Partner Trans ID": data[i].referenceNumber, "Channel eWallet": data[i].ewalletName, "Nominal Transaksi": data[i].amount, Status: data[i].status })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi eWallet.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportEWallet()
        }
    }

    useEffect(() => {
        if (!access_token) {
            // RouteTo("/login")
            history.push('/login');
        }
        if (user_role !== "102" || user_role !== "104") {
            // history.push('/404');
            listPartner()
        }
        transaksiEwallet(activePageEWallet)
    }, [access_token, user_role])
    
    const columns = [
        {
            name: 'No',
            selector: row => row.number,
            width: "3%",
            wrap: true,
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Transaksi',
            selector: row => row.transID,
            // width: "150px",
            wrap: true,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
            // sortable: true
        },
        {
            name: 'Waktu',
            selector: row => row.processDate,
            // sortable: true,          
            width: "120px",
            wrap: true
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.referenceNumber,
            // sortable: true,          
            wrap: true,
            width: "190px",
        },
        {
            name: 'Nama Partner',
            selector: row => row.partnerName,
            // sortable: true
            wrap: true,
            width: "150px",
        },
        {
            name: 'Channel eWallet',
            selector: row => row.ewalletName,
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", },
            width: "160px",
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.amount, true, 2),
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", },
            width: "173px"
        },
        {
            name: 'Biaya eWallet',
            selector: row => convertToRupiah(row.ewalletFee, true, 2),
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", },
            width: "140px"
        },
        {
            name: 'Biaya Pajak',
            selector: row => convertToRupiah(row.feeTax, true, 2),
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", },
            width: "140px"
        },
        {
            name: 'Total Biaya',
            selector: row => convertToRupiah(row.totalAmount, true, 2),
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", },
            width: "173px"
        },
        {
            name: 'Status',
            selector: row => row.status,
            width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.statusID === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.statusID === 1 || row.statusID === 7,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                {
                    when: row => row.statusID === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.statusID === 3 || row.statusID === 5 || row.statusID === 6 || row.statusID === 8 || row.statusID === 9 || row.statusID === 10 || row.statusID === 11 || row.statusID === 12 || row.statusID === 13 || row.statusID === 14 || row.statusID === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
    ];
    const columnsPartner = [
        {
            name: language === null ? ind.no : language.no,
            selector: row => row.number,
            width: "5%",
            wrap: true,
            maxWidth: 'fit-content !important'
        },
        {
            name: language === null ? ind.idTransaksi : language.idTransaksi,
            selector: row => row.transID,
            width: "180px",
            wrap: true,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
            // sortable: true
        },
        {
            name: language === null ? ind.waktu : language.waktu,
            selector: row => row.processDate,
            // sortable: true,          
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-start", },
            width: "120px",
            wrap: true
        },
        {
            name: language === null ? ind.partnerTransId : language.partnerTransId,
            selector: row => row.referenceNumber,
            // sortable: true,          
            wrap: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-start"},
            // width: "150px",
        },
        {
            name: language === null ? ind.channelEwallet : language.channelEwallet,
            selector: row => row.ewalletName,
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", },
            // width: "175px"
            width: "160px",
        },
        {
            name: language === null ? ind.nominalTransaksi : language.nominalTransaksi,
            selector: row => convertToRupiah(row.amount, true, 2),
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", },
            width: "173px"
        },
        {
            name: language === null ? ind.status : language.status,
            selector: row => row.status,
            width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.statusID === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.statusID === 1 || row.statusID === 7,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                {
                    when: row => row.statusID === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.statusID === 3 || row.statusID === 5 || row.statusID === 6 || row.statusID === 8 || row.statusID === 9 || row.statusID === 10 || row.statusID === 11 || row.statusID === 12 || row.statusID === 13 || row.statusID === 14 || row.statusID === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
    ];

    const customStylesEWallet = {
        headCells: {
            style: {
                width: 'max-content',
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                // display: 'flex',
                // justifyContent: 'flex-start',
                // '&:not(:last-of-type)': {
                //     borderRightStyle: 'solid',
                //     borderRightWidth: '1px',
                //     borderRightColor: defaultThemes.default.divider.default,
                // },
            },
        },
        // cells: {
        //     style: {
        //         '&:not(:last-of-type)': {
        //             borderRightStyle: 'solid',
        //             borderRightWidth: '1px',
        //             borderRightColor: defaultThemes.default.divider.default,
        //         },
        //     },
        // },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: defaultThemes.default.divider.default,
            },
        },
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          {/* <div>Loading...</div> */}
        </div>
    );

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link to={"/"}>{user_role !== "102" ? "Beranda" : (language === null ? ind.laporan : language.laporan)}</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;{language === null ? ind.riwayat : language.riwayat}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;{language === null ? ind.collectionEwallet : language.collectionEwallet}</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>{language === null ? ind.riwayat : language.riwayat}</h2>
            </div>
            <div className='main-content'>
                <div className='riwayat-dana-masuk-div mt-4'>
                    <span className='mt-4' style={{fontWeight: 600}}>{language === null ? ind.collectionEwallet : language.collectionEwallet}</span>
                    <div className='base-content my-3'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>{language === null ? ind.filter : language.filter}</span>
                        <Row className='mt-4'>
                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                <span>{language === null ? ind.idTransaksi : language.idTransaksi}</span>
                                <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiEWallet} name="idTransaksiEWallet" type='text'className='input-text-riwayat' placeholder={language === null ? ind.placeholderIdTrans : language.placeholderIdTrans}/>
                            </Col>
                            {
                                user_role !== "102" ?
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <span className='me-3'>Nama Partner</span>
                                    <div className="dropdown dropSaldoPartner">
                                        <ReactSelect
                                            // isMulti
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataListPartner}
                                            // allowSelectAll={true}
                                            value={selectedPartnerEWallet}
                                            onChange={(selected) => handleChangeNamaPartner(selected, 'EWallet')}
                                            placeholder="Pilih Nama Partner"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                </Col> :
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <span>{language === null ? ind.channel : language.channel}</span>
                                    <Form.Select name='channelEWallet' className='input-text-riwayat' style={{ display: "inline" }} value={inputHandle.channelEWallet} onChange={(e) => handleChange(e)}>
                                        <option defaultValue value={0}>{language === null ? ind.channelEwallet : language.channelEwallet}</option>
                                        <option value={1}>DANA</option>
                                        <option value={2}>OVO</option>
                                        <option value={3}>GOPAY</option>
                                    </Form.Select>
                                </Col>
                            }
                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                <span>{language === null ? ind.partnerTransId : language.partnerTransId}</span>
                                <input onChange={(e) => handleChange(e)} value={inputHandle.partnerTransIdEWallet} name="partnerTransIdEWallet" type='text'className='input-text-riwayat ms-2' placeholder={language === null ? ind.placeholderPartnerTransId : language.placeholderPartnerTransId}/>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: (showDateEWallet === "none") ? "33%" : "33%" }}>
                                <span style={{ marginRight: 40 }}>{language === null ? ind.periode : language.periode}<span style={{ color: "red" }}>*</span></span>
                                <Form.Select name='periodeEWallet' className="input-text-riwayat ms-3" value={inputHandle.periodeEWallet} onChange={(e) => handleChangePeriodeTransfer(e)}>
                                    <option defaultChecked disabled value={0}>{language === null ? ind.pilihPeriode : language.pilihPeriode}</option>
                                    <option value={2}>{language === null ? ind.hariIni : language.hariIni}</option>
                                    <option value={3}>{language === null ? ind.kemarin : language.kemarin}</option>
                                    <option value={4}>{language === null ? ind.tujuhHariTerakhir : language.tujuhHariTerakhir}</option>
                                    <option value={5}>{language === null ? ind.bulanIni : language.bulanIni}</option>
                                    <option value={6}>{language === null ? ind.bulanKemarin : language.bulanKemarin}</option>
                                    <option value={7}>{language === null ? ind.pilihRangeTanggal : language.pilihRangeTanggal}</option>
                                </Form.Select>                            
                            </Col>
                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                <span style={{ marginRight: 41 }}>{language === null ? ind.status : language.status}</span>
                                <Form.Select name="statusEWallet" className='input-text-riwayat' style={{ display: "inline" }} value={inputHandle.statusEWallet} onChange={(e) => handleChange(e)}>
                                    <option defaultChecked disabled value="">{language === null ? ind.placeholderStatus : language.placeholderStatus}</option>
                                    <option value={2}>{language === null ? ind.berhasil : language.berhasil}</option>
                                    <option value={1}>{language === null ? ind.dalamProses : language.dalamProses}</option>
                                    <option value={7}>{language === null  ? ind.menungguPembayaran : language.menungguPembayaran}</option>
                                    <option value={9}>{language === null ? ind.kadaluwarsa : language.kadaluwarsa}</option>
                                </Form.Select>
                            </Col>
                            {
                                user_role !== "102" &&
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <span>Channel</span>
                                    <Form.Select name='channelEWallet' className='input-text-riwayat ms-3' style={{ display: "inline" }} value={inputHandle.channelEWallet} onChange={(e) => handleChange(e)}>
                                        <option defaultValue value={0}>Channel eWallet</option>
                                        <option value={1}>DANA</option>
                                        <option value={2}>OVO</option>
                                        <option value={3}>GOPAY</option>
                                    </Form.Select>
                                </Col>
                            }
                        </Row>
                        <Row className="mt-4">
                            <Col xs={4} style={{ display: showDateEWallet }} className='text-end'>
                                <DateRangePicker 
                                    onChange={pickDateEWallet}
                                    value={stateEWallet}
                                    clearIcon={null}
                                    // calendarIcon={null}
                                />
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => filterRiwayatEWallet(1, inputHandle.statusEWallet, inputHandle.idTransaksiEWallet, selectedPartnerEWallet.length !== 0 ? selectedPartnerEWallet[0].value : "", inputHandle.periodeEWallet, dateRangeEWallet, 0, inputHandle.partnerTransIdEWallet, inputHandle.channelEWallet)}
                                            className={(inputHandle.periodeEWallet !== 0 || dateRangeEWallet.length !== 0 || dateRangeEWallet.length !== 0 && inputHandle.idTransaksiEWallet.length !== 0 || dateRangeEWallet.length !== 0 && inputHandle.statusEWallet.length !== 0 || dateRangeEWallet.length !== 0 && selectedAgenEWallet[0].value !== undefined || dateRangeEWallet.length !== 0 && inputHandle.partnerTransIdEWallet.length !== 0 || dateRangeEWallet.length !== 0 && selectedBankEWallet[0].value !== undefined || dateRangeEWallet.length !== 0 && inputHandle.fiturEWallet.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                            disabled={inputHandle.periodeEWallet === 0 || inputHandle.periodeEWallet === 0 && inputHandle.idTransaksiEWallet.length === 0 || inputHandle.periodeEWallet === 0 && inputHandle.statusEWallet.length === 0 || inputHandle.periodeEWallet === 0 && selectedAgenEWallet[0].value === undefined || inputHandle.periodeEWallet === 0 && inputHandle.partnerTransIdEWallet.length === 0 | inputHandle.periodeEWallet === 0 && selectedBankEWallet[0].value === undefined || inputHandle.periodeEWallet === 0 && inputHandle.fiturEWallet.length === 0}
                                        >
                                            {language === null ? ind.terapkan : language.terapkan}
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => resetButtonHandle("Dana Masuk")}
                                            className={(inputHandle.periodeEWallet || dateRangeEWallet.length !== 0 || dateRangeEWallet.length !== 0 && inputHandle.idTransaksiEWallet.length !== 0 || dateRangeEWallet.length !== 0 && inputHandle.statusEWallet.length !== 0 || dateRangeEWallet.length !== 0 && selectedAgenEWallet[0].value !== undefined || dateRangeEWallet.length !== 0 && inputHandle.partnerTransIdEWallet.length !== 0 || dateRangeEWallet.length !== 0 && selectedBankEWallet[0].value !== undefined || dateRangeEWallet.length !== 0 && inputHandle.fiturEWallet.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                                            disabled={inputHandle.periodeEWallet === 0 || inputHandle.periodeEWallet === 0 && inputHandle.idTransaksiEWallet.length === 0 || inputHandle.periodeEWallet === 0 && inputHandle.statusEWallet.length === 0 || inputHandle.periodeEWallet === 0 && selectedAgenEWallet[0].value === undefined || inputHandle.periodeEWallet === 0 && inputHandle.partnerTransIdEWallet.length === 0 || inputHandle.periodeEWallet === 0 && selectedBankEWallet[0].value === undefined || inputHandle.periodeEWallet === 0 && inputHandle.fiturEWallet.length === 0}
                                        >
                                            {language === null ? ind.aturUlang : language.aturUlang}
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {
                            dataRiwayatEWallet.length !== 0 &&
                            <div style={{ marginBottom: 30 }}>
                                <Link onClick={() => ExportReportTransferEWalletHandler(isFilterEWallet, inputHandle.statusEWallet, inputHandle.idTransaksiEWallet, selectedPartnerEWallet.length !== 0 ? selectedPartnerEWallet[0].value : "", inputHandle.periodeEWallet, dateRangeEWallet, inputHandle.partnerTransIdEWallet, inputHandle.channelEWallet)} className="export-span">Export</Link>
                            </div>
                        }
                        <div className="div-table mt-4 pb-4">
                            <DataTable
                                columns={user_role !== "102" ? columns : columnsPartner}
                                data={dataRiwayatEWallet}
                                customStyles={customStylesEWallet}
                                highlightOnHover
                                progressPending={pendingTransfer}
                                progressComponent={<CustomLoader />}
                                noDataComponent={user_role === "102" && (language === null ? ind.tidakAdaData : language.tidakAdaData)}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageEWallet}</div>
                            <Pagination
                                activePage={activePageEWallet}
                                itemsCountPerPage={pageNumberEWallet.row_per_page}
                                totalItemsCount={(pageNumberEWallet.row_per_page*pageNumberEWallet.max_page)}
                                pageRangeDisplayed={5}
                                itemClass="page-item"
                                linkClass="page-link"
                                onChange={handlePageChangeEWallet}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EWallet