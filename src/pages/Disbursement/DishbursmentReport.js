import React, { useEffect, useState } from 'react'
import { Col, Row, Form, Image} from '@themesberg/react-bootstrap';
import DataTable, { defaultThemes } from 'react-data-table-component';
import { BaseURL, convertSimpleTimeStamp, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import encryptData from '../../function/encryptData';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import * as XLSX from "xlsx"
import Pagination from "react-js-pagination";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"

function DisbursementReport() {

    const history = useHistory()
    const access_token = getToken();
    const user_role = getRole();
    const [dataListPartner, setDataListPartner] = useState([])
    const [dataDisbursement, setDataDisbursement] = useState([])
    // const [totalSettlement, setTotalDisbursement] = useState([])
    const [stateDateDisbursement, setStateDisbursement] = useState(null)
    const [dateRangeDisbursement, setDateRangeDisbursement] = useState([])
    const [showDateDisbursement, setShowDateDisbursement] = useState("none")
    const [inputHandle, setInputHandle] = useState({
        idTransaksiDisbursement: "",
        namaPartnerDisbursement: "",
        statusDisbursement: [],
        periodeDisbursement: 0,
        partnerTransId: ""
    })
    const [pendingDisbursement, setPendingDisbursement] = useState(true)
    const [activePageDisbursement, setActivePageDisbursement] = useState(1)
    const [pageNumberDisbursement, setPageNumberDisbursement] = useState({})
    const [totalPageDisbursement, setTotalPageDisbursement] = useState(0)
    const [isFilterDisbursement, setIsFilterDisbursement] = useState(false)

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    function handleChangeNamaPartner(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeDisbursement(e) {
        
        if (e.target.value === "7") {
            setShowDateDisbursement("")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateDisbursement("none")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        }
    }

    function handlePageChangeDisbursement(page) {
        if (isFilterDisbursement) {
            setActivePageDisbursement(page)
            filterDisbursement(page, inputHandle.statusDisbursement, inputHandle.idTransaksiDisbursement, inputHandle.namaPartnerDisbursement, inputHandle.periodeDisbursement, dateRangeDisbursement, inputHandle.partnerTransId, 0)
        } else {
            setActivePageDisbursement(page)
            disbursementReport(page)
        }
    }

    function toDashboard() {
        history.push("/");
    }

    function toLaporan() {
        history.push("/laporan");
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

    // dateId :
    // 0 -> all
    // 2 -> hari ini
    // 3 -> kemarin
    // 4 -> minggu ini
    // 5 -> bulan ini
    // 6 -> bulan lalu
    // 7 -> pilih tanggal

    async function disbursementReport(currentPage, userRole) {
        try {
            if (userRole !== "102") {
                const auth = 'Bearer ' + getToken();
                const dataParams = encryptData(`{"statusID": [1,2,4], "transID" : "", "sub_partner_id":"", "dateID": 2, "date_from": "", "date_to": "", "partner_trans_id":"", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': auth
                }
                const dataDisbursement = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                if (dataDisbursement.status === 200 && dataDisbursement.data.response_code === 200 && dataDisbursement.data.response_new_token === null) {
                    dataDisbursement.data.response_data.results = dataDisbursement.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                    setPageNumberDisbursement(dataDisbursement.data.response_data)
                    setTotalPageDisbursement(dataDisbursement.data.response_data.max_page)
                    setDataDisbursement(dataDisbursement.data.response_data.results)
                    // setTotalDisbursement(dataDisbursement.data.response_data)
                    setPendingDisbursement(false)
                } else if (dataDisbursement.status === 200 && dataDisbursement.data.response_code === 200 && dataDisbursement.data.response_new_token !== null) {
                    setUserSession(dataDisbursement.data.response_new_token)
                    dataDisbursement.data.response_data.results = dataDisbursement.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                    setPageNumberDisbursement(dataDisbursement.data.response_data)
                    setTotalPageDisbursement(dataDisbursement.data.response_data.max_page)
                    setDataDisbursement(dataDisbursement.data.response_data.results)
                    // setTotalDisbursement(dataDisbursement.data.response_data)
                    setPendingDisbursement(false)
                }
            } else {
                const auth = 'Bearer ' + getToken();
                const dataParams = encryptData(`{"statusID": [1,2,4], "transID" : "", "dateID": 2, "date_from": "", "date_to": "", "partner_trans_id":"", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': auth
                }
                const dataDisbursement = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                if (dataDisbursement.status === 200 && dataDisbursement.data.response_code === 200 && dataDisbursement.data.response_new_token === null) {
                    dataDisbursement.data.response_data.results = dataDisbursement.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                    setPageNumberDisbursement(dataDisbursement.data.response_data)
                    setTotalPageDisbursement(dataDisbursement.data.response_data.max_page)
                    setDataDisbursement(dataDisbursement.data.response_data.results)
                    // setTotalDisbursement(dataDisbursement.data.response_data)
                    setPendingDisbursement(false)
                } else if (dataDisbursement.status === 200 && dataDisbursement.data.response_code === 200 && dataDisbursement.data.response_new_token !== null) {
                    setUserSession(dataDisbursement.data.response_new_token)
                    dataDisbursement.data.response_data.results = dataDisbursement.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                    setPageNumberDisbursement(dataDisbursement.data.response_data)
                    setTotalPageDisbursement(dataDisbursement.data.response_data.max_page)
                    setDataDisbursement(dataDisbursement.data.response_data.results)
                    // setTotalDisbursement(dataDisbursement.data.response_data)
                    setPendingDisbursement(false)
                }
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function pickDateDisbursement(item) {
        setStateDisbursement(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeDisbursement(item)
        }
    }

    async function filterDisbursement(page, statusId, transId, partnerId, dateId, periode, partnerTransId, rowPerPage) {
        try {
            setPendingDisbursement(true)
            setIsFilterDisbursement(true)
            setActivePageDisbursement(page)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,4]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "sub_partner_id":"${(partnerId.length !== 0) ? partnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "partner_trans_id":"${partnerTransId}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const filterDisbursement = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
            if (filterDisbursement.status === 200 && filterDisbursement.data.response_code === 200 && filterDisbursement.data.response_new_token === null) {
                filterDisbursement.data.response_data.results = filterDisbursement.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberDisbursement(filterDisbursement.data.response_data)
                setTotalPageDisbursement(filterDisbursement.data.response_data.max_page)
                setDataDisbursement(filterDisbursement.data.response_data.results)
                // setTotalDisbursement(filterDisbursement.data.response_data.results.total_settlement)
                setPendingDisbursement(false)
            } else if (filterDisbursement.status === 200 && filterDisbursement.data.response_code === 200 && filterDisbursement.data.response_new_token !== null) {
                setUserSession(filterDisbursement.data.response_new_token)
                filterDisbursement.data.response_data.results = filterDisbursement.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberDisbursement(filterDisbursement.data.response_data)
                setTotalPageDisbursement(filterDisbursement.data.response_data.max_page)
                setDataDisbursement(filterDisbursement.data.response_data.results)
                // setTotalDisbursement(filterDisbursement.data.response_data.results.total_settlement)
                setPendingDisbursement(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function resetButtonHandle() {
        setInputHandle({
            ...inputHandle,
            idTransaksiDisbursement: "",
            namaPartnerDisbursement: "",
            statusDisbursement: [],
            periodeDisbursement: 0,
            partnerTransId: ""
        })
        setStateDisbursement(null)
        setDateRangeDisbursement([])
        setShowDateDisbursement("none")
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        if (user_role !== "102") {
            listPartner()
        }
        disbursementReport(activePageDisbursement, user_role)
    }, [access_token, user_role])

    const columnsDisbursement = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tdishburse_code,
            // sortable: true
            width: "200px",
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}`}>{row.tvasettl_code}</Link>
        },
        {
            name: 'Waktu',
            selector: row => convertSimpleTimeStamp(row.tdishburse_crtdt),
            width: "150px",
            // sortable: true,
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            width: "238px",
            // sortable: true,
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "224px",
            // sortable: true,
        },
        {
            name: 'Nominal Disbursement',
            selector: row => convertToRupiah(row.tdishburse_amount),
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Fee Disbursement',
            selector: row => convertToRupiah(row.tdishburse_fee),
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Fee Tax',
            selector: row => convertToRupiah(row.tdishburse_fee_tax),
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Total Disbursement',
            selector: row => convertToRupiah(row.tdishburse_total_amount),
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Tipe Pembayaran',
            selector: row => row.payment_type,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Nomor Akun',
            selector: row => row.tdishburse_acc_num,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            width: "140px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.tdishburse_status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.tdishburse_status_id === 1 || row.tdishburse_status_id === 7,
                    style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
                },
                {
                    when: row => row.tdishburse_status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                },
                {
                    when: row => row.tdishburse_status_id === 3 || row.tdishburse_status_id === 5 || row.tdishburse_status_id === 6 || row.tdishburse_status_id === 8 || row.tdishburse_status_id === 9 || row.tdishburse_status_id === 10 || row.tdishburse_status_id === 11 || row.tdishburse_status_id === 12 || row.tdishburse_status_id === 13 || row.tdishburse_status_id === 14 || row.tdishburse_status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                }
            ],
        },
    ];

    const columnsDisbursementPartner = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tdishburse_code,
            // sortable: true
            width: "200px",
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}`}>{row.tvasettl_code}</Link>
        },
        {
            name: 'Waktu',
            selector: row => convertSimpleTimeStamp(row.tdishburse_crtdt),
            // width: "150px",
            // sortable: true,
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            width: "170px",
            // sortable: true,
        },
        {
            name: 'Nominal Disbursement',
            selector: row => convertToRupiah(row.tdishburse_amount),
            // sortable: true,
            // width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Total Disbursement',
            selector: row => convertToRupiah(row.tdishburse_total_amount),
            // sortable: true,
            // width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Tipe Pembayaran',
            selector: row => row.payment_type,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Nomor Akun',
            selector: row => row.tdishburse_acc_num,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            minWidth: "140px",
            maxWidth: "195px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.tdishburse_status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.tdishburse_status_id === 1 || row.tdishburse_status_id === 7,
                    style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
                },
                {
                    when: row => row.tdishburse_status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                },
                {
                    when: row => row.tdishburse_status_id === 3 || row.tdishburse_status_id === 5 || row.tdishburse_status_id === 6 || row.tdishburse_status_id === 8 || row.tdishburse_status_id === 9 || row.tdishburse_status_id === 10 || row.tdishburse_status_id === 11 || row.tdishburse_status_id === 12 || row.tdishburse_status_id === 13 || row.tdishburse_status_id === 14 || row.tdishburse_status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                }
            ],
        },
    ];
    
    const customStylesDisbursement = {
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

    function ExportReportDisbursementHandler(isFilter, userRole, statusId, transId, partnerId, dateId, periode, partnerTransId) {
        if (isFilter === true && userRole === "102") {
            async function dataExportFilter(statusId, transId, partnerId, dateId, periode, partnerTransId) {
                try {
                    // console.log(partnerTransId, "partner trans filter");
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,4]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "partner_trans_id":"${partnerTransId}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nominal Disbursement": data[i].tdishburse_amount, "Total Disbursement": data[i].tdishburse_total_amount, "Tipe Pembayaran": data[i].payment_type, "Nomor Akun": data[i].tdishburse_acc_num, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Disbursement Report.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token !== null) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nominal Disbursement": data[i].tdishburse_amount, "Total Disbursement": data[i].tdishburse_total_amount, "Tipe Pembayaran": data[i].payment_type, "Nomor Akun": data[i].tdishburse_acc_num, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Disbursement Report.xlsx");
                    }
                } catch (error) {
                    // console.log(error)
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(statusId, transId, partnerId, dateId, periode, partnerTransId)
        } else if (isFilter === true && userRole !== "102") {
            async function dataExportFilter(statusId, transId, partnerId, dateId, periode, partnerTransId) {
                try {
                    // console.log(partnerTransId, "partner trans filter");
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,4]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "partner_trans_id":"${partnerTransId}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nominal Disbursement": data[i].tdishburse_amount, "Fee Disbursement": data[i].tdishburse_fee, "Fee Tax": data[i].tdishburse_fee_tax, "Total Disbursement": data[i].tdishburse_total_amount, "Tipe Pembayaran": data[i].payment_type, "Nomor Akun": data[i].tdishburse_acc_num, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Disbursement Report.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token !== null) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nominal Disbursement": data[i].tdishburse_amount, "Fee Disbursement": data[i].tdishburse_fee, "Fee Tax": data[i].tdishburse_fee_tax, "Total Disbursement": data[i].tdishburse_total_amount, "Tipe Pembayaran": data[i].payment_type, "Nomor Akun": data[i].tdishburse_acc_num, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Disbursement Report.xlsx");
                    }
                } catch (error) {
                    // console.log(error)
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(statusId, transId, partnerId, dateId, periode, partnerTransId)
        } else if (isFilter === false && userRole === "102") {
            async function dataExportDisbursement() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [1,2,4], "transID" : "", "dateID": 2, "date_from": "", "date_to": "", "partner_trans_id":"", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportDisbursement = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    if (dataExportDisbursement.status === 200 && dataExportDisbursement.data.response_code === 200 && dataExportDisbursement.data.response_new_token === null) {
                        const data = dataExportDisbursement.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nominal Disbursement": data[i].tdishburse_amount, "Total Disbursement": data[i].tdishburse_total_amount, "Tipe Pembayaran": data[i].payment_type, "Nomor Akun": data[i].tdishburse_acc_num, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Disbursement Report.xlsx");
                    } else if (dataExportDisbursement.status === 200 && dataExportDisbursement.data.response_code === 200 && dataExportDisbursement.data.response_new_token !== null) {
                        setUserSession(dataExportDisbursement.data.response_new_token)
                        const data = dataExportDisbursement.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nominal Disbursement": data[i].tdishburse_amount, "Total Disbursement": data[i].tdishburse_total_amount, "Tipe Pembayaran": data[i].payment_type, "Nomor Akun": data[i].tdishburse_acc_num, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Disbursement Report.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportDisbursement()
        } else if (isFilter === false && userRole !== "102") {
            async function dataExportDisbursement() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [1,2,4], "transID" : "", "dateID": 2, "date_from": "", "date_to": "", "partner_trans_id":"", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportDisbursement = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    if (dataExportDisbursement.status === 200 && dataExportDisbursement.data.response_code === 200 && dataExportDisbursement.data.response_new_token === null) {
                        const data = dataExportDisbursement.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nominal Disbursement": data[i].tdishburse_amount, "Total Disbursement": data[i].tdishburse_total_amount, "Tipe Pembayaran": data[i].payment_type, "Nomor Akun": data[i].tdishburse_acc_num, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Disbursement Report.xlsx");
                    } else if (dataExportDisbursement.status === 200 && dataExportDisbursement.data.response_code === 200 && dataExportDisbursement.data.response_new_token !== null) {
                        setUserSession(dataExportDisbursement.data.response_new_token)
                        const data = dataExportDisbursement.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nominal Disbursement": data[i].tdishburse_amount, "Total Disbursement": data[i].tdishburse_total_amount, "Tipe Pembayaran": data[i].payment_type, "Nomor Akun": data[i].tdishburse_acc_num, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Disbursement Report.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportDisbursement()
        } else if (isFilter === false && userRole !== "102") {
            async function dataExportDisbursement() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [1,2,4], "transID" : "", "sub_partner_id":"", "dateID": 2, "date_from": "", "date_to": "", "partner_trans_id":"", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportDisbursement = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    if (dataExportDisbursement.status === 200 && dataExportDisbursement.data.response_code === 200 && dataExportDisbursement.data.response_new_token === null) {
                        const data = dataExportDisbursement.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nominal Disbursement": data[i].tdishburse_amount, "Fee Disbursement": data[i].tdishburse_fee, "Fee Tax": data[i].tdishburse_fee_tax, "Total Disbursement": data[i].tdishburse_total_amount, "Tipe Pembayaran": data[i].payment_type, "Nomor Akun": data[i].tdishburse_acc_num, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Disbursement Report.xlsx");
                    } else if (dataExportDisbursement.status === 200 && dataExportDisbursement.data.response_code === 200 && dataExportDisbursement.data.response_new_token !== null) {
                        setUserSession(dataExportDisbursement.data.response_new_token)
                        const data = dataExportDisbursement.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nominal Disbursement": data[i].tdishburse_amount, "Fee Disbursement": data[i].tdishburse_fee, "Fee Tax": data[i].tdishburse_fee_tax, "Total Disbursement": data[i].tdishburse_total_amount, "Tipe Pembayaran": data[i].payment_type, "Nomor Akun": data[i].tdishburse_acc_num, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Disbursement Report.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportDisbursement()
        }
    }

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
        </div>
    );

    // console.log(showDateDisbursement, 'ini show date range');
    // console.log(stateDateDisbursement, 'ini state disburs');
    // console.log(dateRangeDisbursement, 'ini data date range');

    return (
        <div className="main-content mt-5" style={{ padding: "37px 27px" }}>
            <span className='breadcrumbs-span'>{(user_role === "102") ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> Laporan</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Disbursement Report</span> 
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4">Disbursement Report</h2>
            </div>
            <div className='main-content'>
                <div className='riwayat-settlement-div mt-2'>
                    <span className='mt-4' style={{fontWeight: 600}}>Disbursement Report</span>
                    <div className='base-content mt-3'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                        {
                            user_role !== "102" ?
                            <>
                                <Row className='mt-4'>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span>ID Transaksi</span>
                                        <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiDisbursement} name="idTransaksiDisbursement" type='text'className='input-text-ez' placeholder='Masukkan ID Transaksi'/>
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span>Nama Partner</span>
                                        <Form.Select name='namaPartnerDisbursement' className="input-text-ez" value={inputHandle.namaPartnerDisbursement} onChange={(e) => handleChange(e)} style={{ marginLeft: 35 }}>
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
                                        <span>Status</span>
                                        <Form.Select name="statusDisbursement" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.statusDisbursement} onChange={(e) => handleChange(e)}>
                                            <option defaultChecked disabled value="">Pilih Status</option>
                                            <option value={2}>Berhasil</option>
                                            <option value={1}>In Progress</option>
                                            <option value={4}>Gagal</option>
                                            {/* <option value={7}>Menunggu Pembayaran</option> */}
                                            {/* <option value={9}>Kadaluwarsa</option> */}
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{  width: (showDateDisbursement === "none") ? "33.2%" : "33.2%" }}>
                                        <span style={{ marginRight: 26 }}>Periode*</span>
                                        <Form.Select name='periodeDisbursement' className="input-text-ez" value={inputHandle.periodeDisbursement} onChange={(e) => handleChangePeriodeDisbursement(e)}>
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
                                        <span>Partner Trans ID</span>
                                        <input onChange={(e) => handleChange(e)} value={inputHandle.partnerTransId} name="partnerTransId" type='text'className='input-text-ez' placeholder='Masukkan Partner Trans ID'/>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col xs={3} style={{ display: showDateDisbursement }} className="text-end ms-5">
                                        <div >
                                            <DateRangePicker 
                                                onChange={pickDateDisbursement}
                                                value={stateDateDisbursement}
                                                clearIcon={null}
                                                // calendarIcon={null}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </> :
                            <>
                                <Row className='mt-4'>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span>ID Transaksi</span>
                                        <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiDisbursement} name="idTransaksiDisbursement" type='text'className='input-text-ez me-2' placeholder='Masukkan ID Transaksi'/>
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{  width: "34%" }}>
                                        <span style={{ marginRight: 26 }}>Periode*</span>
                                        <Form.Select name='periodeDisbursement' className="input-text-ez me-4" value={inputHandle.periodeDisbursement} onChange={(e) => handleChangePeriodeDisbursement(e)}>
                                            <option defaultChecked disabled value={0}>Pilih Periode</option>
                                            <option value={2}>Hari Ini</option>
                                            <option value={3}>Kemarin</option>
                                            <option value={4}>7 Hari Terakhir</option>
                                            <option value={5}>Bulan Ini</option>
                                            <option value={6}>Bulan Kemarin</option>
                                            <option value={7}>Pilih Range Tanggal</option>
                                        </Form.Select>
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: "30%"}}>
                                        <span>Status</span>
                                        <Form.Select name="statusDisbursement" className='input-text-ez me-4' style={{ display: "inline" }} value={inputHandle.statusDisbursement} onChange={(e) => handleChange(e)}>
                                            <option defaultChecked disabled value="">Pilih Status</option>
                                            <option value={2}>Berhasil</option>
                                            <option value={1}>In Progress</option>
                                            <option value={4}>Gagal</option>
                                            {/* <option value={7}>Menunggu Pembayaran</option> */}
                                            {/* <option value={9}>Kadaluwarsa</option> */}
                                        </Form.Select>
                                    </Col>
                                    
                                </Row>
                                <Row className='mt-3'>
                                    <Col xs={4} className='d-flex justify-content-center align-items-center'>
                                        <span>Partner Trans ID</span>
                                        <input onChange={(e) => handleChange(e)} value={inputHandle.partnerTransId} name="partnerTransId" type='text'className='input-text-ez' placeholder='Masukkan Partner Trans ID'/>
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-center align-items-center" >
                                        <div style={{ display: showDateDisbursement}}>
                                            <DateRangePicker 
                                                onChange={pickDateDisbursement}
                                                value={stateDateDisbursement}
                                                clearIcon={null}
                                                // calendarIcon={null}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        }
                        <Row className='mt-4'>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => filterDisbursement(1, inputHandle.statusDisbursement, inputHandle.idTransaksiDisbursement, inputHandle.namaPartnerDisbursement, inputHandle.periodeDisbursement, dateRangeDisbursement, inputHandle.partnerTransId, 0)}
                                            className={(inputHandle.periodeDisbursement || dateRangeDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.idTransaksiDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.statusDisbursement.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                            disabled={inputHandle.periodeDisbursement === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.idTransaksiDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.statusDisbursement.length === 0}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => resetButtonHandle()}
                                            className={(inputHandle.periodeDisbursement || dateRangeDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.idTransaksiDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.statusDisbursement.length !== 0) ? "btn-reset" : "btn-ez"}
                                            disabled={inputHandle.periodeDisbursement === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.idTransaksiDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.statusDisbursement.length === 0}
                                        >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {
                            dataDisbursement.length !== 0 &&
                            <div style={{ marginBottom: 30 }}>
                                <Link to={"#"} onClick={() => ExportReportDisbursementHandler(isFilterDisbursement, user_role, inputHandle.statusDisbursement, inputHandle.idTransaksiDisbursement, inputHandle.namaPartnerDisbursement, inputHandle.periodeDisbursement, dateRangeDisbursement, inputHandle.partnerTransId)} className="export-span">Export</Link>
                            </div>
                        }
                        <div className="div-table mt-4 pb-4">
                            <DataTable
                                columns={(user_role !== "102") ? columnsDisbursement : columnsDisbursementPartner}
                                data={dataDisbursement}
                                customStyles={customStylesDisbursement}
                                progressPending={pendingDisbursement}
                                progressComponent={<CustomLoader />}
                                dense
                                // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                                // pagination
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageDisbursement}</div>
                            <Pagination
                                activePage={activePageDisbursement}
                                itemsCountPerPage={pageNumberDisbursement.row_per_page}
                                totalItemsCount={(pageNumberDisbursement.row_per_page*pageNumberDisbursement.max_page)}
                                pageRangeDisplayed={5}
                                itemClass="page-item"
                                linkClass="page-link"
                                onChange={handlePageChangeDisbursement}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisbursementReport