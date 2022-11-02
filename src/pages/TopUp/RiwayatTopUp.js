import { Col, Form, Image, Row, Container,
    ListGroup,
    InputGroup,
    Modal,
    Button, Table, Toast } from '@themesberg/react-bootstrap'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Pagination from 'react-js-pagination'
import { Link, useHistory } from 'react-router-dom'
import { BaseURL, convertSimpleTimeStamp, convertDateTimeStamp, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import axios from 'axios'
import encryptData from '../../function/encryptData'
import Jam from '../../assets/icon/jam_icon.svg'
import Countdown from "react-countdown";
import CopyIcon from '../../assets/icon/carbon_copy.svg'
import noticeIcon from '../../assets/icon/notice_icon.svg'
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/DateRangePicker'
import Checklist from '../../assets/icon/checklist_icon.svg'
import * as XLSX from "xlsx"

function RiwayatTopUp() {

    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const [listRiwayat, setListRiwayat] = useState([])
    const [showDateRiwayatTopUp, setShowDateRiwayatTopUp] = useState("none")
    const [stateRiwayatTopup, setStateRiwayatTopup] = useState(null)
    const [dateRangeRiwayatTopUp, setDateRangeRiwayatTopUp] = useState([])
    const [pageNumberRiwayatTopUp, setPageNumberRiwayatTopUp] = useState(0)
    const [activePageRiwayatTopUp, setActivePageRiwayatTopUp] = useState(1)
    const [totalPageRiwayatTopUp, setTotalPageRiwayatTopUp] = useState(1)
    const [pendingTopup, setPendingTopup] = useState(true)
    const [detailTopUp, setDetailTopUp] = useState({})
    const [showModalKonfirmasiTopUp, setShowModalKonfirmasiTopUp] = useState(false)
    const [ countDown, setCountDown ] = useState(0)
    const [text, setText] = useState('');
    const [dataListPartner, setDataListPartner] = useState([])
    const [ topUpResult, setTopUpResult ] = useState({})
    const [showStatusTopup, setShowStatusTopup] = useState(false)
    const [inputHandle, setInputHandle] = useState({
        idTransaksiRiwayatTopUp: "",
        namaPartnerRiwayatTopUp: "",
        statusRiwayatTopUp: [],
        periodeRiwayatTopUp: 0,
    })
    const [isFilterTopUp, setIsFilterTopUp] = useState(false)

    const startColorNumber = (money) => {  
        if (money !== 0) {
          var diSliceAwal = String(money).slice(0, -3)
        }
        return new Intl.NumberFormat('id-ID', { style: 'decimal', currency: 'IDR', maximumFractionDigits: 2, currencyDisplay: "symbol"}).format(diSliceAwal).replace(/\B(?=(\d{4})+(?!\d))/g, ".") + "."
    }
    
    const endColorNumber = (money) => {
        var diSliceAkhir = String(money).slice(-3)
        return diSliceAkhir
    }

    const copyHandler = (event) => {
        setText(event.target.value);
      };
    
    const copyPrice = async () => {
        try {
            var copyText = document.getElementById('pricing').innerHTML.split("<")
            await navigator.clipboard.writeText(copyText[0]+copyText[1].slice(-3));
            alert('Text copied');
        } catch (error) {
            // console.log(error);
        }
    };
    
    const copyRek = async () => {
        try {
            var copyText = document.getElementById('noRek').innerHTML;
            await navigator.clipboard.writeText(copyText);
            alert('Text copied');
        } catch (error) {
            // console.log(error);
        }
    };

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

    async function listRiwayatTopUp (statusId, transaksiId, dateId, dateRange, currentPage, namaPartner, isFilter) {
        try {
            setPendingTopup(true)
            setIsFilterTopUp(isFilter)
            setActivePageRiwayatTopUp(currentPage)
            if (user_role === "102") {
                const auth = "Bearer " + getToken()
                const dataParams = encryptData(`{"statusID": [${(statusId !== undefined) ? statusId : [1,2,7,9]}], "transID" : "${(transaksiId !== undefined) ? transaksiId : ""}", "dateID": ${(dateId !== undefined) ? dateId : 2}, "date_from": "${(dateRange.length !== 0) ? dateRange[0] : ""}", "date_to": "${(dateRange.length !== 0) ? dateRange[1] : ""}", "page": ${(currentPage !== undefined) ? currentPage : 1}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const listRiwayat = await axios.post(BaseURL + "/partner/HistoryTopUpPartnerFilter", { data: dataParams }, { headers: headers })
                if (listRiwayat.data.response_code === 200 && listRiwayat.status === 200 && listRiwayat.data.response_new_token.length === 0) {
                    listRiwayat.data.response_data.results = listRiwayat.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                    setPageNumberRiwayatTopUp(listRiwayat.data.response_data)
                    setTotalPageRiwayatTopUp(listRiwayat.data.response_data.max_page)
                    setListRiwayat(listRiwayat.data.response_data.results)
                    setPendingTopup(false)
                } else if (listRiwayat.data.response_code === 200 && listRiwayat.status === 200 && listRiwayat.data.response_new_token.length !== 0) {
                    setUserSession(listRiwayat.data.response_new_token)
                    listRiwayat.data.response_data.results = listRiwayat.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                    setListRiwayat(listRiwayat.data.response_data.results)
                    setPendingTopup(false)
                }
            } else {
                const auth = "Bearer " + getToken()
                const dataParams = encryptData(`{"statusID": [${(statusId !== undefined) ? statusId : [1,2,7,9]}], "transID" : "${(transaksiId !== undefined) ? transaksiId : ""}", "sub_partner_id": "${(namaPartner !== undefined) ? namaPartner : ""}", "dateID": ${(dateId !== undefined) ? dateId : 2}, "date_from": "${(dateRange.length !== 0) ? dateRange[0] : ""}", "date_to": "${(dateRange.length !== 0) ? dateRange[1] : ""}", "page": ${(currentPage !== undefined) ? currentPage : 1}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const listRiwayat = await axios.post(BaseURL + "/partner/HistoryTopUpPartnerFilter", { data: dataParams }, { headers: headers })
                if (listRiwayat.data.response_code === 200 && listRiwayat.status === 200 && listRiwayat.data.response_new_token.length === 0) {
                    listRiwayat.data.response_data.results = listRiwayat.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                    setPageNumberRiwayatTopUp(listRiwayat.data.response_data)
                    setTotalPageRiwayatTopUp(listRiwayat.data.response_data.max_page)
                    setListRiwayat(listRiwayat.data.response_data.results)
                    setPendingTopup(false)
                } else if (listRiwayat.data.response_code === 200 && listRiwayat.status === 200 && listRiwayat.data.response_new_token.length !== 0) {
                    setUserSession(listRiwayat.data.response_new_token)
                    listRiwayat.data.response_data.results = listRiwayat.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                    setListRiwayat(listRiwayat.data.response_data.results)
                    setPendingTopup(false)
                }
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

    function pickDateRiwayatTopUp(item) {
        setStateRiwayatTopup(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeRiwayatTopUp(item)
        }
    }

    function handleChangePeriodeRiwayatTopUp(e) {
        if (e.target.value === "7") {
            setShowDateRiwayatTopUp("")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateRiwayatTopUp("none")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        }
    }

    function handlePageChangeTopUp(page) {
        setActivePageRiwayatTopUp(page)
        listRiwayatTopUp(inputHandle.statusRiwayatTopUp, inputHandle.idTransaksiRiwayatTopUp, (inputHandle.periodeRiwayatTopUp !== 0 ? inputHandle.periodeRiwayatTopUp : undefined), dateRangeRiwayatTopUp, page, inputHandle.namaPartnerRiwayatTopUp, isFilterTopUp)
    }

    function resetButtonHandle() {
        setInputHandle({
            ...inputHandle,
            idTransaksiRiwayatTopUp: "",
            statusRiwayatTopUp: [],
            periodeRiwayatTopUp: 0,
        })
        setStateRiwayatTopup(null)
        setDateRangeRiwayatTopUp([])
        setShowDateRiwayatTopUp("none")
    }

    async function detailTopUpHandler(idTransaksi) {
        try {
            const auth = "Bearer " + getToken()   
            const dataParams = encryptData(`{"tparttopup_code":"${idTransaksi}"}`)
            const headers = {
              "Content-Type": "application/json",
              'Authorization': auth,
            };
            const detailTopUp = await axios.post(BaseURL + "/Partner/HistoryTopUpPartnerDetail", { data: dataParams }, { headers: headers })
            if(detailTopUp.status === 200 && detailTopUp.data.response_code === 200 && detailTopUp.data.response_new_token.length === 0) {
              setDetailTopUp(detailTopUp.data.response_data)
              const timeStamps = new Date(detailTopUp.data.response_data.exp_date*1000).toLocaleString()
              const convertTimeStamps = new Date(timeStamps).getTime()
              const countDown = convertTimeStamps - Date.now()
              setCountDown(countDown)
              setShowModalKonfirmasiTopUp(true)
            } else if(detailTopUp.status === 200 && detailTopUp.data.response_code === 200 && detailTopUp.data.response_new_token.length !== 0) {
              setUserSession(detailTopUp.data.response_new_token)
              setDetailTopUp(detailTopUp.data.response_data)
              setShowModalKonfirmasiTopUp(true)
            }
          } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function topUpHandleConfirm() {
        try {
            const auth = "Bearer " + getToken()        
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const topUpResult = await axios.post(BaseURL + "/Partner/TopupConfirmation", { data: "" }, { headers: headers })
            if(topUpResult.status === 200 && topUpResult.data.response_code === 200 && topUpResult.data.response_new_token.length === 0) {
                setTopUpResult(topUpResult.data.response_data)
                setShowModalKonfirmasiTopUp(false)
                setShowStatusTopup(true)
                window.location.reload()
            } else if (topUpResult.status === 200 && topUpResult.data.response_code === 200 && topUpResult.data.response_new_token.length !== 0) {
                setUserSession(topUpResult.data.response_new_token)
                setTopUpResult(topUpResult.data.response_data)
                setShowModalKonfirmasiTopUp(false)
                setShowStatusTopup(true)
                window.location.reload()
            }
            } catch (error) {
                // console.log(error)
                history.push(errorCatch(error.response.status))
            }
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        if (user_role !== "102") {
            listPartner()
        }
        listRiwayatTopUp(undefined, undefined, undefined, [], undefined, undefined, false)
    }, [access_token, user_role])
    

    const columnsRiwayatTopUp = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
            style: { justifyContent: "center" }
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tparttopup_code,
            // sortable: true
            // width: "224px",
            style: { justifyContent: "center" }
        },
        {
            name: 'Nominal',
            selector: row => row.tparttopup_trf_amount_rp,
            style: { justifyContent: "center" },
            // width: "150px",
            // sortable: true,
        },
        {
            name: 'Tanggal',
            selector: row => row.tparttopup_crtdt_format,
            // width: "224px",
            style: { justifyContent: "center", },
            // sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            cell:  (row) => (row.tparttopup_status_id === 1 || row.tparttopup_status_id === 7) ? <Link style={{color: "#F79421"}} onClick={() => detailTopUpHandler(row.tparttopup_code)}>{row.mstatus_name_ind}</Link> : (row.tparttopup_status_id === 2) ? <div style={{color: "#077E86"}}>{row.mstatus_name_ind}</div> : (row.tparttopup_status_id === 4) ? <div style={{color: "#B9121B"}}>{row.mstatus_name_ind}</div> : (row.tparttopup_status_id === 3 || row.tparttopup_status_id === 5 || row.tparttopup_status_id === 6 || row.tparttopup_status_id === 8 || row.tparttopup_status_id === 9 || row.tparttopup_status_id === 10 || row.tparttopup_status_id === 11 || row.tparttopup_status_id === 12 || row.tparttopup_status_id === 13 || row.tparttopup_status_id === 14 || row.tparttopup_status_id === 15) && <div style={{color: "#888888"}}>{row.mstatus_name_ind}</div>, 
            // width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.tparttopup_status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", paddingLeft: "unset" }
                },
                {
                    when: row => row.tparttopup_status_id === 1 || row.tparttopup_status_id === 7, 
                    className: ['detailStatus'],
                    style: { cursor:"pointer", textDecoration: "underline", background: "rgba(247, 148, 33, 0.08)", paddingLeft: "unset", '&:hover': {cursor: 'pointer', backgroundColor: '#FFFFFF'},},
                    option: {'&:hover': {backgroundColor: "#FFFFFF"} }
                },
                {
                    when: row => row.tparttopup_status_id === 4,
                    style: { background: "rgba(185, 18, 27, 0.08)", paddingLeft: "unset" }
                },
                {
                    when: row => row.tparttopup_status_id === 3 || row.tparttopup_status_id === 5 || row.tparttopup_status_id === 6 || row.tparttopup_status_id === 8 || row.tparttopup_status_id === 9 || row.tparttopup_status_id === 10 || row.tparttopup_status_id === 11 || row.tparttopup_status_id === 12 || row.tparttopup_status_id === 13 || row.tparttopup_status_id === 14 || row.tparttopup_status_id === 15,
                    style: { background: "#F0F0F0", paddingLeft: "unset" }
                }
            ],
        },
    ];

    const columnsRiwayatTopUpAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
            style: { justifyContent: "center" }
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tparttopup_code,
            // sortable: true
            // width: "224px",
            style: { justifyContent: "center" }
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartnerdtl_sub_name,
            // sortable: true
            // width: "224px",
            style: { justifyContent: "center" }
        },
        {
            name: 'Nominal',
            selector: row => row.tparttopup_trf_amount_rp,
            style: { justifyContent: "flex-end" },
            // width: "150px",
            // sortable: true,
        },
        {
            name: 'Tanggal',
            selector: row => row.tparttopup_crtdt_format,
            // width: "224px",
            style: { justifyContent: "center", },
            // sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            cell:  (row) => (row.tparttopup_status_id === 1 || row.tparttopup_status_id === 7) ? <Link style={{color: "#F79421"}} onClick={() => detailTopUpHandler(row.tparttopup_code)}>{row.mstatus_name_ind}</Link> : (row.tparttopup_status_id === 2) ? <div style={{color: "#077E86"}}>{row.mstatus_name_ind}</div> : (row.tparttopup_status_id === 4) ? <div style={{color: "#B9121B"}}>{row.mstatus_name_ind}</div> : (row.tparttopup_status_id === 3 || row.tparttopup_status_id === 5 || row.tparttopup_status_id === 6 || row.tparttopup_status_id === 8 || row.tparttopup_status_id === 9 || row.tparttopup_status_id === 10 || row.tparttopup_status_id === 11 || row.tparttopup_status_id === 12 || row.tparttopup_status_id === 13 || row.tparttopup_status_id === 14 || row.tparttopup_status_id === 15) && <div style={{color: "#888888"}}>{row.mstatus_name_ind}</div>, 
            // width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.tparttopup_status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", paddingLeft: "unset" }
                },
                {
                    when: row => row.tparttopup_status_id === 1 || row.tparttopup_status_id === 7, 
                    className: ['detailStatus'],
                    style: { cursor:"pointer", textDecoration: "underline", background: "rgba(247, 148, 33, 0.08)", paddingLeft: "unset", '&:hover': {cursor: 'pointer', backgroundColor: '#FFFFFF'},},
                    option: {'&:hover': {backgroundColor: "#FFFFFF"} }
                },
                {
                    when: row => row.tparttopup_status_id === 4,
                    style: { background: "rgba(185, 18, 27, 0.08)", paddingLeft: "unset" }
                },
                {
                    when: row => row.tparttopup_status_id === 3 || row.tparttopup_status_id === 5 || row.tparttopup_status_id === 6 || row.tparttopup_status_id === 8 || row.tparttopup_status_id === 9 || row.tparttopup_status_id === 10 || row.tparttopup_status_id === 11 || row.tparttopup_status_id === 12 || row.tparttopup_status_id === 13 || row.tparttopup_status_id === 14 || row.tparttopup_status_id === 15,
                    style: { background: "#F0F0F0", paddingLeft: "unset" }
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
                justifyContent: 'center',
            },
        },
    };

    function ExportReportTopUpHandler(isFilter, userRole, statusId, transId, partnerId, dateId, periode) {
        if (isFilter === true && userRole === "102") {
            async function dataExportFilter(statusId, transId, dateId, periode) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/partner/HistoryTopUpPartnerFilter", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tparttopup_code, Nominal: data[i].tparttopup_trf_amount, Tanggal: data[i].tparttopup_crtdt_format, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Top Up Report.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tparttopup_code, Nominal: data[i].tparttopup_trf_amount, Tanggal: data[i].tparttopup_crtdt_format, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Top Up Report.xlsx");
                    }
                } catch (error) {
                    // console.log(error)
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(statusId, transId, dateId, periode)
        } else if (isFilter === true && userRole !== "102") {
            async function dataExportFilter(statusId, transId, partnerId, dateId, periode) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,7,9]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "sub_partner_id": "${(partnerId !== undefined) ? partnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/partner/HistoryTopUpPartnerFilter", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tparttopup_code, "Nama Partner": data[i].mpartnerdtl_sub_name, Nominal: data[i].tparttopup_trf_amount, Tanggal: data[i].tparttopup_crtdt_format, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Top Up Report.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length !== 0) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tparttopup_code, "Nama Partner": data[i].mpartnerdtl_sub_name, Nominal: data[i].tparttopup_trf_amount, Tanggal: data[i].tparttopup_crtdt_format, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Top Up Report.xlsx");
                    }
                } catch (error) {
                    // console.log(error)
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(statusId, transId, partnerId, dateId, periode)
        }else if (isFilter === false && userRole === "102") {
            async function dataExportTopUp() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "dateID": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportTopUp = await axios.post(BaseURL + "/partner/HistoryTopUpPartnerFilter", {data: dataParams}, { headers: headers });
                    if (dataExportTopUp.status === 200 && dataExportTopUp.data.response_code === 200 && dataExportTopUp.data.response_new_token === null) {
                        const data = dataExportTopUp.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tparttopup_code, Nominal: data[i].tparttopup_trf_amount, Tanggal: data[i].tparttopup_crtdt_format, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Top Up Report.xlsx");
                    } else if (dataExportTopUp.status === 200 && dataExportTopUp.data.response_code === 200 && dataExportTopUp.data.response_new_token !== null) {
                        setUserSession(dataExportTopUp.data.response_new_token)
                        const data = dataExportTopUp.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tparttopup_code, Nominal: data[i].tparttopup_trf_amount, Tanggal: data[i].tparttopup_crtdt_format, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Top Up Report.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportTopUp()
        } else if (isFilter === false && userRole !== "102") {
            async function dataExportTopUp() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [1,2,7,9], "transID" : "", "sub_partner_id": "", "dateID": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportTopUp = await axios.post(BaseURL + "/partner/HistoryTopUpPartnerFilter", {data: dataParams}, { headers: headers });
                    if (dataExportTopUp.status === 200 && dataExportTopUp.data.response_code === 200 && dataExportTopUp.data.response_new_token.length === 0) {
                        const data = dataExportTopUp.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tparttopup_code, "Nama Partner": data[i].mpartnerdtl_sub_name, Nominal: data[i].tparttopup_trf_amount, Tanggal: data[i].tparttopup_crtdt_format, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Top Up Report.xlsx");
                    } else if (dataExportTopUp.status === 200 && dataExportTopUp.data.response_code === 200 && dataExportTopUp.data.response_new_token.length !== 0) {
                        setUserSession(dataExportTopUp.data.response_new_token)
                        const data = dataExportTopUp.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tparttopup_code, "Nama Partner": data[i].mpartnerdtl_sub_name, Nominal: data[i].tparttopup_trf_amount, Tanggal: data[i].tparttopup_crtdt_format, Status: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Top Up Report.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportTopUp()
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
            <div className="content-page mt-6">
                <span className='breadcrumbs-span'>{(user_role === "102") ? "Beranda" : <Link to={"/"}>Beranda</Link>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Riwayat Top Up</span>
                <div className='main-content'>
                    <div className='riwayat-settlement-div mt-4'>
                        <span className='mt-4' style={{fontWeight: 600}}>Riwayat Top Up</span>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            {
                                user_role === "102" ?
                                <Row className='mt-4'>
                                    {/* untuk partner */}
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span>ID Transaksi</span>
                                        <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiRiwayatTopUp} name="idTransaksiRiwayatTopUp" type='text'className='input-text-ez me-2' placeholder='Masukkan ID Transaksi'/>
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: "34%" }}>
                                        <span className='me-4'>Periode*</span>
                                        <Form.Select name='periodeRiwayatTopUp' className="input-text-ez" value={(inputHandle.periodeRiwayatTopUp !== undefined) ? inputHandle.periodeRiwayatTopUp : 0} onChange={(e) => handleChangePeriodeRiwayatTopUp(e)}>
                                            <option defaultChecked disabled value={0}>Pilih Periode</option>
                                            <option value={2}>Hari Ini</option>
                                            <option value={3}>Kemarin</option>
                                            <option value={4}>7 Hari Terakhir</option>
                                            <option value={5}>Bulan Ini</option>
                                            <option value={6}>Bulan Kemarin</option>
                                            <option value={7}>Pilih Range Tanggal</option>
                                        </Form.Select>
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: "32%" }}>
                                        <span>Status</span>
                                        <Form.Select name="statusRiwayatTopUp" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.statusRiwayatTopUp} onChange={(e) => handleChange(e)}>
                                            <option defaultChecked disabled value="">Pilih Status</option>
                                            <option value={2}>Berhasil</option>
                                            <option value={1}>In Progress</option>
                                            <option value={7}>Menunggu Pembayaran</option>
                                            <option value={9}>Kadaluwarsa</option>
                                        </Form.Select>
                                    </Col>
                                    <Col xs={12} className="d-flex justify-content-center align-items-center mt-3" style={{ marginLeft: 33 }}>
                                        <div style={{ display: showDateRiwayatTopUp }}>
                                            <DateRangePicker 
                                                onChange={pickDateRiwayatTopUp}
                                                value={stateRiwayatTopup}
                                                clearIcon={null}
                                            />
                                        </div>
                                    </Col>
                                </Row> :
                                <>
                                    {/* untuk admin */}
                                    <Row className='mt-4'>
                                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                                            <span>ID Transaksi</span>
                                            <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiRiwayatTopUp} name="idTransaksiRiwayatTopUp" type='text'className='input-text-ez me-2' placeholder='Masukkan ID Transaksi'/>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                                            <span>Nama Partner</span>
                                            <Form.Select name='namaPartnerRiwayatTopUp' className="input-text-ez me-4" value={inputHandle.namaPartnerRiwayatTopUp} onChange={(e) => handleChange(e)}>
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
                                            <Form.Select name="statusRiwayatTopUp" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.statusRiwayatTopUp} onChange={(e) => handleChange(e)}>
                                                <option defaultChecked disabled value="">Pilih Status</option>
                                                <option value={2}>Berhasil</option>
                                                <option value={1}>In Progress</option>
                                                <option value={7}>Menunggu Pembayaran</option>
                                                <option value={9}>Kadaluwarsa</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: "33.4%" }}>
                                            <span className='me-4'>Periode*</span>
                                            <Form.Select name='periodeRiwayatTopUp' className="input-text-ez" value={(inputHandle.periodeRiwayatTopUp !== undefined) ? inputHandle.periodeRiwayatTopUp : 0} onChange={(e) => handleChangePeriodeRiwayatTopUp(e)}>
                                                <option defaultChecked disabled value={0}>Pilih Periode</option>
                                                <option value={2}>Hari Ini</option>
                                                <option value={3}>Kemarin</option>
                                                <option value={4}>7 Hari Terakhir</option>
                                                <option value={5}>Bulan Ini</option>
                                                <option value={6}>Bulan Kemarin</option>
                                                <option value={7}>Pilih Range Tanggal</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={1} className="d-flex justify-content-center align-items-center">
                                            <div style={{ display: showDateRiwayatTopUp }}>
                                                <DateRangePicker 
                                                    onChange={pickDateRiwayatTopUp}
                                                    value={stateRiwayatTopup}
                                                    clearIcon={null}
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
                                                onClick={() => listRiwayatTopUp(inputHandle.statusRiwayatTopUp, inputHandle.idTransaksiRiwayatTopUp, inputHandle.periodeRiwayatTopUp, dateRangeRiwayatTopUp, 1, inputHandle.namaPartnerRiwayatTopUp, true)}
                                                className={(inputHandle.periodeRiwayatTopUp !== 0 || (dateRangeRiwayatTopUp === undefined || dateRangeRiwayatTopUp.length !== 0) || ((dateRangeRiwayatTopUp === undefined || dateRangeRiwayatTopUp.length !== 0) && inputHandle.idTransaksiRiwayatTopUp !== 0) || ((dateRangeRiwayatTopUp === undefined || dateRangeRiwayatTopUp.length !== 0) && inputHandle.statusRiwayatTopUp !== 0)) ? "btn-ez-on" : "btn-ez"}
                                                disabled={inputHandle.periodeRiwayatTopUp === 0 || (inputHandle.periodeRiwayatTopUp === 0 && inputHandle.idTransaksiRiwayatTopUp.length === 0) || (inputHandle.periodeRiwayatTopUp === 0 && inputHandle.statusRiwayatTopUp === 0) || (inputHandle.periodeRiwayatTopUp === 0 && inputHandle.idTransaksiRiwayatTopUp.length === 0 && inputHandle.statusRiwayatTopUp === 0)}
                                            >
                                                Terapkan
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => resetButtonHandle()}
                                                className={(inputHandle.periodeRiwayatTopUp !== 0 || (dateRangeRiwayatTopUp === undefined || dateRangeRiwayatTopUp.length !== 0) || ((dateRangeRiwayatTopUp === undefined || dateRangeRiwayatTopUp.length !== 0) && inputHandle.idTransaksiRiwayatTopUp !== 0) || ((dateRangeRiwayatTopUp === undefined || dateRangeRiwayatTopUp.length !== 0) && inputHandle.statusRiwayatTopUp !== 0)) ? "btn-reset" : "btn-ez"}
                                                disabled={inputHandle.periodeRiwayatTopUp === 0 || (inputHandle.periodeRiwayatTopUp === 0 && inputHandle.idTransaksiRiwayatTopUp.length === 0) || (inputHandle.periodeRiwayatTopUp === 0 && inputHandle.statusRiwayatTopUp === 0) || (inputHandle.periodeRiwayatTopUp === 0 && inputHandle.idTransaksiRiwayatTopUp.length === 0 && inputHandle.statusRiwayatTopUp === 0)}
                                            >
                                                Atur Ulang
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {
                                listRiwayat.length !== 0 &&
                                <div style={{ marginBottom: 30 }}>
                                    <Link to={"#"} onClick={() => ExportReportTopUpHandler(isFilterTopUp, user_role, inputHandle.statusRiwayatTopUp, inputHandle.idTransaksiRiwayatTopUp, inputHandle.namaPartnerRiwayatTopUp, inputHandle.periodeRiwayatTopUp, dateRangeRiwayatTopUp, 0)} className="export-span">Export</Link>
                                </div>
                            }
                            <div className="div-table mt-4 pb-4">
                                {
                                    user_role === "102" ?
                                    <DataTable
                                        columns={columnsRiwayatTopUp}
                                        data={listRiwayat}
                                        customStyles={customStyles}
                                        progressPending={pendingTopup}
                                        progressComponent={<CustomLoader />}
                                    /> :
                                    <DataTable
                                        columns={columnsRiwayatTopUpAdmin}
                                        data={listRiwayat}
                                        customStyles={customStyles}
                                        progressPending={pendingTopup}
                                        progressComponent={<CustomLoader />}
                                    />
                                }
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                            <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageRiwayatTopUp}</div>
                                <Pagination
                                    activePage={activePageRiwayatTopUp}
                                    itemsCountPerPage={pageNumberRiwayatTopUp.row_per_page}
                                    totalItemsCount={(pageNumberRiwayatTopUp.row_per_page*pageNumberRiwayatTopUp.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeTopUp}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Modal centered show={showModalKonfirmasiTopUp} onHide={() => setShowModalKonfirmasiTopUp(false)} style={{ borderRadius: 8 }} className="confirm-modal">
                    <Modal.Header className="border-0">
                        <Col>
                        <Button
                            className="position-absolute top-0 end-0 m-3"
                            variant="close"
                            aria-label="Close"
                            onClick={() => setShowModalKonfirmasiTopUp(false)}
                        />
                        <Modal.Title className="text-center fw-extrabold mt-3 title-topup">
                            Selesaikan Proses Topup
                        </Modal.Title>
                        </Col>            
                    </Modal.Header>
                    <Modal.Body className="text-center" style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}>
                        <div className="text-center" style={{fontSize: "14px"}}>Selesaikan Pembayaran Dalam</div> 
                        <div className="text-center mt-2">
                            <img src={Jam} alt="jam" /><span className="mx-2 fw-bold" style={{color: "#077E86"}}><Countdown date={Date.now() + countDown} daysInHours={true} /></span>
                        </div>
                        <div style={{fontSize: "14px"}} className="d-flex justify-content-center align-items-center mt-2">
                            <div>Batas Akhir :</div>
                            <div className="mx-2 fw-bold">{(detailTopUp.exp_date !== undefined) ? convertDateTimeStamp(detailTopUp.exp_date) + " WIB" : null}</div>
                        </div>
                        <div className="mt-4" style={{border: "1px solid #EBEBEB", borderRadius: "8px", padding: "10px"}}>
                            <Table className='detailSave'>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>ID Transaksi</div>
                                <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>{detailTopUp.id_transaksi}</div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div className="d-flex flex-column text-left">
                                <div style={{padding:"unset"}}>Metode Pembayaran</div>
                                <div style={{padding:"unset"}} className="fw-bold mt-1">Tranfer Bank</div>
                                </div>
                                <div className="d-flex flex-column">
                                <div style={{padding:"unset"}} className="text-end"><img src={detailTopUp.metode_pembayaran} alt="bca" style={{width: "38px", height: "12px"}} /></div>
                                <div style={{padding:"unset"}} className="mt-1">{detailTopUp.tf_bank}</div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div className="d-flex flex-column text-left">
                                <div style={{padding:"unset"}}>No Rekening</div>
                                <div onChange={copyHandler} id="noRek" style={{padding:"unset"}} className="fw-bold mt-1">{detailTopUp.no_rek}</div>
                                </div>
                                <div className="d-flex flex-column mt-3">
                                <div onClick={copyRek} style={{padding:"unset", cursor: "pointer"}} className="fw-bold"><img src={CopyIcon} alt="copy" /><span className="ms-2" style={{color: "#077E86"}}>Salin</span></div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div className="d-flex flex-column text-left">
                                <div style={{padding:"unset"}}>Nominal Transfer</div>
                                <div onChange={copyHandler} id="pricing" style={{padding:"unset"}} className="fw-bold mt-1">{startColorNumber(detailTopUp.amount_transfer)}<span style={{color: "#DF9C43"}}>{endColorNumber(detailTopUp.amount_transfer)}</span></div>
                                </div>
                                <div className="d-flex flex-column mt-3">
                                <div onClick={copyPrice} style={{padding:"unset", cursor: "pointer"}} className="fw-bold"><img src={CopyIcon} alt="copy" /><span className="ms-2" style={{color: "#077E86"}}>Salin</span></div>
                                </div>
                            </div>
                            </Table>                
                        </div>
                        <Table style={{borderRadius: "8px", backgroundColor: "#FFFBE5", fontSize: "12px", padding: "10px"}} className="d-flex justify-content-center align-items-center mt-2">
                            <img src={noticeIcon} alt="notice" />
                            <div className="mx-2 text-left">Lakukan transfer sesuai dengan nominal yang tertera hingga <span style={{ fontWeight: 600 }}>3 digit terakhir.</span></div>
                        </Table>
                        <div className="mb-3" style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                            <Button onClick={() => topUpHandleConfirm()} variant="primary" style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: "100%", maxHeight: 45, width: "100%", height: "100%" }}>SAYA SUDAH TRANSFER</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
            {topUpResult.is_update === true &&
                <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
                    <Toast style={{width: "900px", backgroundColor: "#077E86"}} onClose={() => setShowStatusTopup(false)} show={true} className="text-center" position="bottom-center" delay={3000} autohide>
                    <Toast.Body  className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Top Up Saldo {convertToRupiah(inputHandle.amounts)} Berhasil</Toast.Body>
                    </Toast>
                </div>
            }
        </>
    )
}

export default RiwayatTopUp