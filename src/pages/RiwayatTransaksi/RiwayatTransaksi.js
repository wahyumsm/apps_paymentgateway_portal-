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

function RiwayatTransaksi() {

    const history = useHistory()
    const access_token = getToken();
    const user_role = getRole();
    const [dataListPartner, setDataListPartner] = useState([])
    const [dataListAgenFromPartner, setDataListAgenFromPartner] = useState([])
    const [dataRiwayatDanaMasuk, setDataRiwayatDanaMasuk] = useState([])
    const [dataRiwayatSettlement, setDataRiwayatSettlement] = useState([])
    const [totalSettlement, setTotalSettlement] = useState([])
    const [stateDanaMasuk, setStateDanaMasuk] = useState(null)
    const [stateSettlement, setStateSettlement] = useState(null)
    const [dateRangeDanaMasuk, setDateRangeDanaMasuk] = useState([])
    const [dateRangeSettlement, setDateRangeSettlement] = useState([])
    const [showDateDanaMasuk, setShowDateDanaMasuk] = useState("none")
    const [showDateSettlement, setShowDateSettlement] = useState("none")
    const [inputHandle, setInputHandle] = useState({
        idTransaksiDanaMasuk: "",
        idTransaksiSettlement: "",
        namaPartnerDanaMasuk: "",
        namaPartnerSettlement: "",
        namaAgenDanaMasuk: "",
        statusDanaMasuk: [],
        statusSettlement: [],
        periodeDanaMasuk: 0,
        periodeSettlement: 0,
        fiturDanaMasuk: 0,
        fiturSettlement: 0
    })
    const [pendingTransfer, setPendingTransfer] = useState(true)
    const [pendingSettlement, setPendingSettlement] = useState(true)
    const [detailTransferDana, setDetailTransferDana] = useState({})
    const [showModalDetailTransferDana, setShowModalDetailTransferDana] = useState(false)
    const [activePageDanaMasuk, setActivePageDanaMasuk] = useState(1)
    const [activePageSettlement, setActivePageSettlement] = useState(1)
    const [pageNumberDanaMasuk, setPageNumberDanaMasuk] = useState({})
    const [totalPageDanaMasuk, setTotalPageDanaMasuk] = useState(0)
    const [pageNumberSettlement, setPageNumberSettlement] = useState({})
    const [totalPageSettlement, setTotalPageSettlement] = useState(0)
    const [isFilterDanaMasuk, setIsFilterDanaMasuk] = useState(false)
    const [isFilterSettlement, setIsFilterSettlement] = useState(false)

    async function getListAgenFromPartner(pertnerId) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"partner_id": "${pertnerId}"}`);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const listAgenFromPartner = await axios.post(BaseURL + "/Partner/GetListAgen", {data: dataParams}, {headers: headers})
            if (listAgenFromPartner.status === 200 && listAgenFromPartner.data.response_code === 200 && listAgenFromPartner.data.response_new_token.length === 0) {
                setDataListAgenFromPartner(listAgenFromPartner.data.response_data)
            } else if (listAgenFromPartner.status === 200 && listAgenFromPartner.data.response_code === 200 && listAgenFromPartner.data.response_new_token.length !== 0) {
                setUserSession(listAgenFromPartner.data.response_new_token)
                setDataListAgenFromPartner(listAgenFromPartner.data.response_data)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
    }
    }

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    function handleChangeNamaPartner(e) {
        getListAgenFromPartner(e.target.value)
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

    function handlePageChangeDanaMasuk(page) {
        if (isFilterDanaMasuk) {
            setActivePageDanaMasuk(page)
            filterRiwayatDanaMasuk(page, inputHandle.statusDanaMasuk, inputHandle.idTransaksiDanaMasuk, inputHandle.namaPartnerDanaMasuk, inputHandle.namaAgenDanaMasuk, inputHandle.periodeDanaMasuk, dateRangeDanaMasuk, 0, inputHandle.fiturDanaMasuk)
        } else {
            setActivePageDanaMasuk(page)
            riwayatDanaMasuk(page)
        }
    }

    function handlePageChangeSettlement(page) {
        if (isFilterSettlement) {
            setActivePageSettlement(page)
            filterSettlement(page, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, inputHandle.namaPartnerSettlement, inputHandle.periodeSettlement, dateRangeSettlement, 0, inputHandle.fiturSettlement)
        } else {
            setActivePageSettlement(page)
            riwayatSettlement(page)
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
                setDataListPartner(listPartner.data.response_data)
            } else if (listPartner.status === 200 && listPartner.data.response_code === 200 && listPartner.data.response_new_token.length !== 0) {
                setUserSession(listPartner.data.response_new_token)
                setDataListPartner(listPartner.data.response_data)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function riwayatDanaMasuk(currentPage) {
        // dateId :
        // 0 -> all
        // 2 -> hari ini
        // 3 -> kemarin
        // 4 -> minggu ini
        // 5 -> bulan ini
        // 6 -> bulan lalu
        // 7 -> pilih tanggal
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : 0, "partnerID":"", "subPartnerID":"", "dateID": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10, "fitur_id": 0}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataRiwayatDanaMasuk = await axios.post(BaseURL + "/Home/GetListHistoryTransfer", {data: dataParams}, { headers: headers });
            if (dataRiwayatDanaMasuk.status === 200 && dataRiwayatDanaMasuk.data.response_code === 200 && dataRiwayatDanaMasuk.data.response_new_token.length === 0) {
                dataRiwayatDanaMasuk.data.response_data.results = dataRiwayatDanaMasuk.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberDanaMasuk(dataRiwayatDanaMasuk.data.response_data)
                setTotalPageDanaMasuk(dataRiwayatDanaMasuk.data.response_data.max_page)
                setDataRiwayatDanaMasuk(dataRiwayatDanaMasuk.data.response_data.results)
                setPendingTransfer(false)
            } else if (dataRiwayatDanaMasuk.status === 200 && dataRiwayatDanaMasuk.data.response_code === 200 && dataRiwayatDanaMasuk.data.response_new_token.length !== 0) {
                setUserSession(dataRiwayatDanaMasuk.data.response_new_token)
                dataRiwayatDanaMasuk.data.response_data.results = dataRiwayatDanaMasuk.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberDanaMasuk(dataRiwayatDanaMasuk.data.response_data)
                setTotalPageDanaMasuk(dataRiwayatDanaMasuk.data.response_data.max_page)
                setDataRiwayatDanaMasuk(dataRiwayatDanaMasuk.data.response_data.results)
                setPendingTransfer(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
    }
    }

    async function riwayatSettlement(currentPage) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "partnerID":"", "subPartnerID":"", "dateID": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10, "fitur_id": 0}`)
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

    function pickDateDanaMasuk(item) {
        setStateDanaMasuk(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeDanaMasuk(item)
        }
    }

    function pickDateSettlement(item) {
        setStateSettlement(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeSettlement(item)
        }
    }

    async function filterRiwayatDanaMasuk(page, statusId, transId, partnerId, subPartnerId, dateId, periode, rowPerPage, fiturDanaMasuk) {
        try {
            setPendingTransfer(true)
            setIsFilterDanaMasuk(true)
            setActivePageDanaMasuk(page)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : ${(transId.length !== 0) ? transId : 0}, "partnerID":"${(partnerId.length !== 0) ? partnerId : ""}", "subPartnerID": "${(subPartnerId.length !== 0) ? subPartnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "fitur_id": ${fiturDanaMasuk}}`)
            // console.log(dataParams, 'ini data params filter');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const filterRiwayatDanaMasuk = await axios.post(BaseURL + "/Home/GetListHistoryTransfer", {data: dataParams}, { headers: headers });
            if (filterRiwayatDanaMasuk.status === 200 && filterRiwayatDanaMasuk.data.response_code === 200 && filterRiwayatDanaMasuk.data.response_new_token.length === 0) {
                filterRiwayatDanaMasuk.data.response_data.results = filterRiwayatDanaMasuk.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberDanaMasuk(filterRiwayatDanaMasuk.data.response_data)
                setTotalPageDanaMasuk(filterRiwayatDanaMasuk.data.response_data.max_page)
                setDataRiwayatDanaMasuk(filterRiwayatDanaMasuk.data.response_data.results)
                setPendingTransfer(false)
            } else if (filterRiwayatDanaMasuk.status === 200 && filterRiwayatDanaMasuk.data.response_code === 200 && filterRiwayatDanaMasuk.data.response_new_token.length !== 0) {
                setUserSession(filterRiwayatDanaMasuk.data.response_new_token)
                filterRiwayatDanaMasuk.data.response_data.results = filterRiwayatDanaMasuk.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberDanaMasuk(filterRiwayatDanaMasuk.data.response_data)
                setTotalPageDanaMasuk(filterRiwayatDanaMasuk.data.response_data.max_page)
                setDataRiwayatDanaMasuk(filterRiwayatDanaMasuk.data.response_data.results)
                setPendingTransfer(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
    }
    }

    async function filterSettlement(page, statusId, transId, partnerId, dateId, periode, rowPerPage, fiturSettlement) {
        try {
            setPendingSettlement(true)
            setIsFilterSettlement(true)
            setActivePageSettlement(page)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "partnerID":"${(partnerId.length !== 0) ? partnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "fitur_id": ${fiturSettlement}}`)
            // console.log(dataParams, 'ini data params filter');
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

    function resetButtonHandle(param) {
        if (param === "Dana Masuk") {
            setInputHandle({
                ...inputHandle,
                idTransaksiDanaMasuk: "",
                namaPartnerDanaMasuk: "",
                namaAgenDanaMasuk: "",
                statusDanaMasuk: [],
                periodeDanaMasuk: 0,
                fiturDanaMasuk: 0
            })
            setStateDanaMasuk(null)
            setDateRangeDanaMasuk([])
            setShowDateDanaMasuk("none")
        } else {
            setInputHandle({
                ...inputHandle,
                idTransaksiSettlement: "",
                namaPartnerSettlement: "",
                statusSettlement: [],
                periodeSettlement: 0,
                fiturSettlement: 0
            })
            setStateSettlement(null)
            setDateRangeSettlement([])
            setShowDateSettlement("none")
        }
    }

    useEffect(() => {
        if (!access_token) {
            // RouteTo("/login")
            history.push('/login');
        }
        if (user_role === "102") {
            history.push('/404');
        }
        listPartner()
        riwayatDanaMasuk(activePageDanaMasuk)
        riwayatSettlement(activePageSettlement)
    }, [access_token, user_role])

    async function detailListTransferHandler(partnerId) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"tvatrans_trx_id": "${partnerId}"}`);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const detailListTransfer = await axios.post(BaseURL + "/Report/GetTransferReportDetail", {data: dataParams}, { headers: headers });
            if (detailListTransfer.status === 200 && detailListTransfer.data.response_code === 200 && detailListTransfer.data.response_new_token.length === 0) {
                setDetailTransferDana(detailListTransfer.data.response_data)
                setShowModalDetailTransferDana(true)
            } else if (detailListTransfer.status === 200 && detailListTransfer.data.response_code === 200 && detailListTransfer.data.response_new_token.length !== 0) {
                setUserSession(detailListTransfer.data.response_new_token)
                setDetailTransferDana(detailListTransfer.data.response_data)
                setShowModalDetailTransferDana(true)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }
    
    const columns = [
        {
            name: 'No',
            selector: row => row.number,
            width: "70px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tvatrans_trx_id,
            width: "120px",
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
        // sortable: true
        },
        {
            name: 'Waktu',
            selector: row => row.tvatrans_crtdt_format,
            // sortable: true,          
            width: "143px",
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            // sortable: true
            width: "150px",
        },
        {
            name: 'Nama Agen',
            selector: row => row.mpartnerdtl_sub_name,
            // sortable: true,
            // width: "175px"
            width: "150px",
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.mfitur_desc,
            // sortable: true,
            // width: "175px"
            width: "150px",
        },
        {
            name: 'No VA',
            selector: row => row.tvatrans_va_number,
            // sortable: true,
            width: "173px"
        },
        {
            name: 'Jumlah Diterima',
            selector: row => row.tvatrans_amount,
            // width: "130px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ convertToRupiah(row.tvatrans_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name,
            width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.tvatrans_status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.tvatrans_status_id === 1 || row.tvatrans_status_id === 7,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                {
                    when: row => row.tvatrans_status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.tvatrans_status_id === 3 || row.tvatrans_status_id === 5 || row.tvatrans_status_id === 6 || row.tvatrans_status_id === 8 || row.tvatrans_status_id === 9 || row.tvatrans_status_id === 10 || row.tvatrans_status_id === 11 || row.tvatrans_status_id === 12 || row.tvatrans_status_id === 13 || row.tvatrans_status_id === 14 || row.tvatrans_status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
    ];

    const columnsSettl = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
            // style: { justifyContent: "center", }
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tvasettl_code,
            // sortable: true
            width: "224px",
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}`}>{row.tvasettl_code}</Link>
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
        },
        {
            name: 'Waktu',
            selector: row => row.tvasettl_crtdt_format,
            // style: { justifyContent: "center", },
            width: "150px",
            // sortable: true,
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.mfitur_desc,
            width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.tvasettl_amount),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Total Transaksi',
            selector: row => row.total_trx,
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Layanan',
            selector: row => convertToRupiah(row.total_partner_fee),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'PPN atas Jasa Layanan',
            selector: row => convertToRupiah(row.total_fee_tax),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Reimbursement by VA',
            selector: row => convertToRupiah(row.total_fee_bank),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Settlement',
            selector: row => convertToRupiah(row.tvasettl_fee),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name,
            width: "140px",
            // sortable: true,
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

    const customStylesDanaMasuk = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'flex-start',
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

    function ExportReportTransferDanaMasukHandler(isFilter, statusId, transId, partnerId, subPartnerId, dateId, periode) {
        if (isFilter) {
            async function dataExportFilter(statusId, transId, partnerId, subPartnerId, dateId, periode) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : ${(transId.length !== 0) ? transId : 0}, "partnerID":"${(partnerId.length !== 0) ? partnerId : ""}", "subPartnerID": "${(subPartnerId.length !== 0) ? subPartnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Home/GetListHistoryTransfer", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvatrans_trx_id, Waktu: data[i].tvatrans_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nama Agen": data[i].mpartnerdtl_sub_name, "No VA": data[i].tvatrans_va_number, "Total Akhir": data[i].tvatrans_amount, Status: data[i].mstatus_name })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi Dana Masuk.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvatrans_trx_id, Waktu: data[i].tvatrans_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nama Agen": data[i].mpartnerdtl_sub_name, "No VA": data[i].tvatrans_va_number, "Total Akhir": data[i].tvatrans_amount, Status: data[i].mstatus_name })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi Dana Masuk.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(statusId, transId, partnerId, subPartnerId, dateId, periode)
        } else {
            async function dataExportDanaMasuk() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : 0, "partnerID":"", "subPartnerID":"", "dateID": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportDanaMasuk = await axios.post(BaseURL + "/Home/GetListHistoryTransfer", {data: dataParams}, { headers: headers });
                    if (dataExportDanaMasuk.status === 200 && dataExportDanaMasuk.data.response_code === 200 && dataExportDanaMasuk.data.response_new_token.length === 0) {
                        const data = dataExportDanaMasuk.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvatrans_trx_id, Waktu: data[i].tvatrans_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nama Agen": data[i].mpartnerdtl_sub_name, "No VA": data[i].tvatrans_va_number, "Total Akhir": data[i].tvatrans_amount, Status: data[i].mstatus_name })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi Dana Masuk.xlsx");
                    } else if (dataExportDanaMasuk.status === 200 && dataExportDanaMasuk.data.response_code === 200 && dataExportDanaMasuk.data.response_new_token.length !== 0) {
                        setUserSession(dataExportDanaMasuk.data.response_new_token)
                        const data = dataExportDanaMasuk.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvatrans_trx_id, Waktu: data[i].tvatrans_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nama Agen": data[i].mpartnerdtl_sub_name, "No VA": data[i].tvatrans_va_number, "Total Akhir": data[i].tvatrans_amount, Status: data[i].mstatus_name })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi Dana Masuk.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportDanaMasuk()
        }
    }

    function ExportReportSettlementHandler(isFilter, statusId, transId, partnerId, dateId, periode) {
        if (isFilter) {
            async function dataExportFilter(statusId, transId, partnerId, dateId, periode) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "partnerID":"${(partnerId.length !== 0) ? partnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Home/GetListHistorySettlement", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nominal Settlement": data[i].tvasettl_amount, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].total_partner_fee, "PPN atas Jasa Layanan": data[i].total_fee_tax, "Reimbursement by VA": data[i].total_fee_bank, "Jasa Settlement": data[i].tvasettl_fee, Status: data[i].mstatus_name_ind })
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
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nominal Settlement": data[i].tvasettl_amount, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].total_partner_fee, "PPN atas Jasa Layanan": data[i].total_fee_tax, "Reimbursement by VA": data[i].total_fee_bank, "Jasa Settlement": data[i].tvasettl_fee, Status: data[i].mstatus_name_ind })
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
            dataExportFilter(statusId, transId, partnerId, dateId, periode)
        } else {
            async function dataExportSettlement() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "partnerID":"", "subPartnerID":"", "dateID": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportSettlement = await axios.post(BaseURL + "/Home/GetListHistorySettlement", {data: dataParams}, { headers: headers });
                    if (dataExportSettlement.status === 200 && dataExportSettlement.data.response_code === 200 && dataExportSettlement.data.response_new_token.length === 0) {
                        const data = dataExportSettlement.data.response_data.results.list_data
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nominal Settlement": data[i].tvasettl_amount, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].total_partner_fee, "PPN atas Jasa Layanan": data[i].total_fee_tax, "Reimbursement by VA": data[i].total_fee_bank, "Jasa Settlement": data[i].tvasettl_fee, Status: data[i].mstatus_name_ind })
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
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvasettl_code, Waktu: data[i].tvasettl_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nominal Settlement": data[i].tvasettl_amount, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].total_partner_fee, "PPN atas Jasa Layanan": data[i].total_fee_tax, "Reimbursement by VA": data[i].total_fee_bank, "Jasa Settlement": data[i].tvasettl_fee, Status: data[i].mstatus_name_ind })
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

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          {/* <div>Loading...</div> */}
        </div>
    );

  return (
    <div className="content-page mt-6">
        <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Riwayat Transaksi</span>
        <div className='head-title'>
            <h2 className="h5 mb-3 mt-4">Riwayat Transaksi</h2>
        </div>
        <div className='main-content'>
            <div className='riwayat-dana-masuk-div mt-4'>
                <span className='mt-4' style={{fontWeight: 600}}>Riwayat Dana Masuk</span>
                <div className='base-content mt-3'>
                    <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span>ID Transaksi</span>
                            <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiDanaMasuk} name="idTransaksiDanaMasuk" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                            {/* <input type='text'className='input-text-riwayat me-2' placeholder='Masukkan ID Transaksi'/>            */}
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span>Nama Partner</span>
                            <Form.Select name='namaPartnerDanaMasuk' className="input-text-riwayat ms-3" value={inputHandle.namaPartnerDanaMasuk} onChange={(e) => handleChangeNamaPartner(e)}>
                                <option defaultChecked disabled value="">Pilih Nama Partner</option>
                                {
                                    dataListPartner.map((item, index) => {
                                        return (
                                            <option key={index} value={item.partner_id}>{item.nama_perusahaan}</option>
                                        )
                                    })
                                }
                            </Form.Select>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span className="me-2">Nama Agen</span>
                            <Form.Select name='namaAgenDanaMasuk' style={{ display: "inline" }} className="input-text-riwayat ms-4" value={inputHandle.namaAgenDanaMasuk} onChange={(e) => handleChange(e)}>
                                <option defaultChecked disabled value="">Pilih Nama Agen</option>
                                {
                                    dataListAgenFromPartner.map((item, index) => {
                                        return (
                                            <option key={index} value={item.agen_id}>{item.agen_name}</option>
                                        )
                                    })
                                }
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span style={{ marginRight: 41 }}>Status</span>
                            <Form.Select name="statusDanaMasuk" className='input-text-riwayat ms-3' style={{ display: "inline" }} value={inputHandle.statusDanaMasuk} onChange={(e) => handleChange(e)}>
                                <option defaultChecked disabled value="">Pilih Status</option>
                                <option value={2}>Success</option>
                                <option value={1}>In Progress</option>
                                {/* <option value={3}>Refund</option> */}
                                {/* <option value={4}>Canceled</option> */}
                                <option value={7}>Waiting for Payment</option>
                                {/* <option value={8}>Paid</option> */}
                                <option value={9}>Expired</option>
                                {/* <option value={10}>Withdraw</option> */}
                                {/* <option value={11}>Idle</option> */}
                                {/* <option value={15}>Expected Success</option> */}
                            </Form.Select>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateDanaMasuk === "none") ? "33%" : "33%" }}>
                            <span style={{ marginRight: 40 }}>Periode*</span>
                            <Form.Select name='periodeDanaMasuk' className="input-text-riwayat ms-3" value={inputHandle.periodeDanaMasuk} onChange={(e) => handleChangePeriodeTransfer(e)}>
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
                            <span>Jenis Transaksi</span>
                            <Form.Select name='fiturDanaMasuk' className='input-text-riwayat ms-3' style={{ display: "inline" }} value={inputHandle.fiturDanaMasuk} onChange={(e) => handleChange(e)}>
                                <option defaultValue value={0}>Pilih Jenis Transaksi</option>
                                <option value={104}>Payment Link</option>
                                <option value={100}>Virtual Account</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}></Col>
                        <Col xs={4} className="mt-3">
                            <div style={{ display: showDateDanaMasuk }}>
                                <DateRangePicker 
                                    onChange={pickDateDanaMasuk}
                                    value={stateDanaMasuk}
                                    clearIcon={null}
                                    // calendarIcon={null}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={3}>
                            <Row>
                                <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                    <button
                                        onClick={() => filterRiwayatDanaMasuk(1, inputHandle.statusDanaMasuk, inputHandle.idTransaksiDanaMasuk, inputHandle.namaPartnerDanaMasuk, inputHandle.namaAgenDanaMasuk, inputHandle.periodeDanaMasuk, dateRangeDanaMasuk, 0, inputHandle.fiturDanaMasuk)}
                                        className={(inputHandle.periodeDanaMasuk !== 0 || dateRangeDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.idTransaksiDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.statusDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.namaAgenDanaMasuk.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                        disabled={inputHandle.periodeDanaMasuk === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.idTransaksiDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.statusDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.namaAgenDanaMasuk.length === 0}
                                    >
                                        Terapkan
                                    </button>
                                </Col>
                                <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                    <button
                                        onClick={() => resetButtonHandle("Dana Masuk")}
                                        className={(inputHandle.periodeDanaMasuk || dateRangeDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.idTransaksiDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.statusDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.namaAgenDanaMasuk.length !== 0) ? "btn-reset" : "btn-ez"}
                                        disabled={inputHandle.periodeDanaMasuk === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.idTransaksiDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.statusDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.namaAgenDanaMasuk.length === 0}
                                    >
                                        Atur Ulang
                                    </button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {
                        dataRiwayatDanaMasuk.length !== 0 &&
                        <div style={{ marginBottom: 30 }}>
                            <Link onClick={() => ExportReportTransferDanaMasukHandler(isFilterDanaMasuk, inputHandle.statusDanaMasuk, inputHandle.idTransaksiDanaMasuk, inputHandle.namaPartnerDanaMasuk, inputHandle.namaAgenDanaMasuk, inputHandle.periodeDanaMasuk, dateRangeDanaMasuk)} className="export-span">Export</Link>
                        </div>
                    }
                    <div className="div-table mt-4 pb-4">
                        <DataTable
                            columns={columns}
                            data={dataRiwayatDanaMasuk}
                            customStyles={customStylesDanaMasuk}
                            highlightOnHover
                            progressPending={pendingTransfer}
                            progressComponent={<CustomLoader />}
                            // pagination
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
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
            </div>
            <div className='riwayat-settlement-div mt-5'>
                <span className='mt-4' style={{fontWeight: 600}}>Riwayat Settlement</span>
                <div className='base-content mt-3'>
                    <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span>ID Transaksi</span>
                            <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiSettlement} name="idTransaksiSettlement" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span>Nama Partner</span>
                            <Form.Select name='namaPartnerSettlement' className="input-text-riwayat ms-3" value={inputHandle.namaPartnerSettlement} onChange={(e) => handleChange(e)}>
                                <option defaultChecked disabled value="">Pilih Nama Partner</option>
                                {
                                    dataListPartner.map((item, index) => {
                                        return (
                                            <option key={index} value={item.partner_id}>{item.nama_perusahaan}</option>
                                        )
                                    })
                                }
                            </Form.Select>
                            {/* <input onChange={(e) => handleChange(e)} value={inputHandle.namaPartnerSettlement} name="namaPartnerSettlement" type='text'className='input-text-riwayat me-2' placeholder='Masukkan ID Transaksi'/> */}
                            {/* <input type='text'className='input-text-riwayat' placeholder='Masukkan Nama Partner'/> */}
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span>Status</span>
                            <Form.Select name="statusSettlement" className='input-text-riwayat ms-3' style={{ display: "inline" }} value={inputHandle.statusSettlement} onChange={(e) => handleChange(e)}>
                                <option defaultChecked disabled value="">Pilih Status</option>
                                <option value={2}>Success</option>
                                <option value={1}>In Progress</option>
                                {/* <option value={3}>Refund</option> */}
                                {/* <option value={4}>Canceled</option> */}
                                <option value={7}>Waiting for Payment</option>
                                {/* <option value={8}>Paid</option> */}
                                <option value={9}>Expired</option>
                                {/* <option value={10}>Withdraw</option> */}
                                {/* <option value={11}>Idle</option> */}
                                {/* <option value={15}>Expected Success</option> */}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: (showDateSettlement === "none") ? "33.2%" : "33.2%" }}>
                            <span style={{ marginRight: 26 }}>Periode*</span>
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
                        <Col xs={4} style={{ display: showDateSettlement }}>
                            <div>
                                <DateRangePicker 
                                    onChange={pickDateSettlement}
                                    value={stateSettlement}
                                    clearIcon={null}
                                    // calendarIcon={null}
                                />
                            </div>
                        </Col>
                        <Col xs={4}>
                            <span>Jenis Transaksi</span>
                            <Form.Select name='fiturSettlement' className='input-text-riwayat ms-3' style={{ display: "inline" }} value={inputHandle.fiturSettlement} onChange={(e) => handleChange(e)}>
                                <option defaultValue value={0}>Pilih Jenis Transaksi</option>
                                <option value={104}>Payment Link</option>
                                <option value={100}>Virtual Account</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={3}>
                            <Row>
                                <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                    <button
                                        onClick={() => filterSettlement(1, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, inputHandle.namaPartnerSettlement, inputHandle.periodeSettlement, dateRangeSettlement, 0, inputHandle.fiturSettlement)}
                                        className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                        disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0}
                                    >
                                        Terapkan
                                    </button>
                                </Col>
                                <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                    <button
                                        onClick={() => resetButtonHandle("Settlement")}
                                        className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0) ? "btn-reset" : "btn-ez"}
                                        disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0}
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
                            <Link to={"#"} onClick={() => ExportReportSettlementHandler(isFilterSettlement, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, inputHandle.namaPartnerSettlement, inputHandle.periodeSettlement, dateRangeSettlement, 0)} className="export-span">Export</Link>
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
                            // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                            // pagination
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
                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                            <Col>{detailTransferDana.mpartnerdtl_partner_id}</Col>
                            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 4, maxWidth: 175, width: "100%", height: 32, fontWeight: 400,
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
                            <Col style={{ display: "flex", justifyContent: "end" }}>{detailTransferDana.tvatrans_sub_partner_id}</Col>
                        </Row>
                        <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>
                            <Col>Nama Partner</Col>
                            <Col style={{ display: "flex", justifyContent: "end" }}>ID Partner</Col>
                        </Row>
                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                            <Col>{detailTransferDana.mpartner_name}</Col>
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
                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                            <Col style={{ fontWeight: 400 }}>Biaya VA</Col>
                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_bank_fee)}</Col>
                        </Row>
                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                            <Col style={{ fontWeight: 400 }}>Biaya Partner</Col>
                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_partner_fee)}</Col>
                        </Row>
                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                            <Col style={{ fontWeight: 400 }}>Biaya Settlement</Col>
                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_partner_fee)}</Col>
                        </Row>
                        <center>
                            <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, padding: "0px 24px", border: "1px dashed #EBEBEB" }} />
                        </center>
                        <Row style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 700, marginTop: 12 }}>
                            <Col>Total</Col>
                            <Col style={{ display: "flex", justifyContent: "end" }}>{convertToRupiah((detailTransferDana.tvatrans_amount + detailTransferDana.tvatrans_bank_fee + detailTransferDana.tvatrans_partner_fee))}</Col>
                        </Row>
                    </Container>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                    <Button variant="primary" onClick={() => setShowModalDetailTransferDana(false)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Kembali</Button>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default RiwayatTransaksi