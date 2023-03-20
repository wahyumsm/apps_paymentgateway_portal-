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
import noteInfo from "../../assets/icon/note_icon.svg"
import ReactSelect, { components } from 'react-select';

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
        // namaPartnerDisbursement: "",
        statusDisbursement: [],
        periodeDisbursement: 0,
        partnerTransId: "",
        // paymentCode: "",
        referenceNo: ""
    })
    const [pendingDisbursement, setPendingDisbursement] = useState(true)
    const [activePageDisbursement, setActivePageDisbursement] = useState(1)
    const [pageNumberDisbursement, setPageNumberDisbursement] = useState({})
    const [totalPageDisbursement, setTotalPageDisbursement] = useState(0)
    const [isFilterDisbursement, setIsFilterDisbursement] = useState(false)
    const [listDisburseChannel, setListDisburseChannel] = useState([])

    const [selectedPartnerDisbursement, setSelectedPartnerDisbursement] = useState([])
    const [selectedPaymentDisbursement, setSelectedPaymentDisbursement] = useState([])

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
            filterDisbursement(page, inputHandle.statusDisbursement, inputHandle.idTransaksiDisbursement, selectedPaymentDisbursement.length !== 0 ? selectedPaymentDisbursement[0].value : "", selectedPartnerDisbursement.length !== 0 ? selectedPartnerDisbursement[0].value : "", inputHandle.periodeDisbursement, dateRangeDisbursement, inputHandle.partnerTransId, inputHandle.referenceNo, 0)
        } else {
            setActivePageDisbursement(page)
            disbursementReport(page, user_role)
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
                let newArr = []
                listPartner.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.partner_id
                    obj.label = e.nama_perusahaan
                    newArr.push(obj)
                })
                setDataListPartner(newArr)
                // setDataListPartner(listPartner.data.response_data)
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
                // setDataListPartner(listPartner.data.response_data)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function listDisburseChannelHandler() {
        try {
            const auth = 'Bearer ' + getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const listDisburse = await axios.post(BaseURL + "/Home/GetPaymentType", {data: ""}, {headers: headers})
            // console.log(listDisburse, "list disburse");
            if (listDisburse.status === 200 && listDisburse.data.response_code === 200 && listDisburse.data.response_new_token.length === 0) {
                let newArr = []
                listDisburse.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.payment_code
                    obj.label = e.payment_name
                    newArr.push(obj)
                })
                setListDisburseChannel(newArr)
                // setListDisburseChannel(listDisburse.data.response_data)
            } else if (listDisburse.status === 200 && listDisburse.data.response_code === 200 && listDisburse.data.response_new_token.length !== 0) {
                setUserSession(listDisburse.data.response_new_token)
                let newArr = []
                listDisburse.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.payment_code
                    obj.label = e.payment_name
                    newArr.push(obj)
                })
                setListDisburseChannel(newArr)
                // setListDisburseChannel(listDisburse.data.response_data)
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
                const dataParams = encryptData(`{"statusID": [1,2,4], "transID" : "", "sub_partner_id":"", "dateID": 2, "date_from": "", "date_to": "", "partner_trans_id":"", "payment_code":"", "reference_no": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
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
                const dataParams = encryptData(`{"statusID": [1,2,4], "transID" : "", "dateID": 2, "date_from": "", "date_to": "", "partner_trans_id":"", "payment_code":"", "reference_no": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
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

    async function filterDisbursement(page, statusId, transId, paymentCode, partnerId, dateId, periode, partnerTransId, reffNo, rowPerPage) {
        try {
            setPendingDisbursement(true)
            setIsFilterDisbursement(true)
            setActivePageDisbursement(page)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,4]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "payment_code":"${(paymentCode.length !== 0) ? paymentCode : ""}", "sub_partner_id":"${(partnerId.length !== 0) ? partnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "partner_trans_id":"${partnerTransId}", reference_no: "${reffNo}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
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
            // namaPartnerDisbursement: "",
            statusDisbursement: [],
            periodeDisbursement: 0,
            partnerTransId: "",
            // paymentCode: "",
            referenceNo: ""
        })
        setSelectedPartnerDisbursement([])
        setSelectedPaymentDisbursement([])
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
        listDisburseChannelHandler()
        disbursementReport(activePageDisbursement, user_role)
    }, [access_token, user_role])

    const columnsDisbursement = [
        {
            name: 'No',
            selector: row => row.number,
            width: "3%",
            maxWidth: 'fit-content !important'
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
            wrap: true,
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
            name: 'Fee Bank',
            selector: row => convertToRupiah(row.tdishburse_fee_bank),
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
            name: 'Tujuan Disbursement',
            selector: row => row.payment_type,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Cabang',
            selector: row => (row.branch_name === null || row.branch_name.length === 0) ? "-" : row.branch_name,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Nomor Rekening Tujuan',
            selector: row => row.tdishburse_acc_num,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.tdishburse_acc_name,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Catatan',
            selector: row => (row.notes === null || row.notes.length === 0) ? "-" : row.notes,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Reference No',
            selector: row => (row.reference_no === null || row.reference_no.length === 0) ? "-" : row.reference_no,
            // sortable: true,
            width: "260px",
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
            width: "3%",
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tdishburse_code,
            // sortable: true
            wrap: true,
            width: "200px",
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}`}>{row.tvasettl_code}</Link>
        },
        {
            name: 'Waktu',
            selector: row => convertSimpleTimeStamp(row.tdishburse_crtdt),
            wrap: true,
            width: "150px",
            // sortable: true,
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            wrap: true,
            width: "170px",
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
            name: 'Total Disbursement',
            selector: row => convertToRupiah(row.tdishburse_total_amount),
            // sortable: true,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Tujuan Disbursement',
            selector: row => row.payment_type,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Cabang',
            selector: row => (row.branch_name === null || row.branch_name.length === 0) ? "-" : row.branch_name,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Nomor Rekening Tujuan',
            selector: row => row.tdishburse_acc_num,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.tdishburse_acc_name,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'Catatan',
            selector: row => (row.notes === null || row.notes.length === 0) ? "-" : row.notes,
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
                    borderRightStyle: user_role !== "102" && 'solid',
                    borderRightWidth: user_role !== "102" && '1px',
                    borderRightColor: user_role !== "102" && defaultThemes.default.divider.default,
                },
            },
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: user_role !== "102" && 'solid',
                    borderRightWidth: user_role !== "102" && '1px',
                    borderRightColor: user_role !== "102" && defaultThemes.default.divider.default,
                },
            },
        },
        headRow: {
            style: {
                borderTopStyle: user_role !== "102" && 'solid',
                borderTopWidth: user_role !== "102" && '1px',
                borderTopColor: user_role !== "102" && defaultThemes.default.divider.default,
            },
        },
    };

    function ExportReportDisbursementHandler(isFilter, userRole, statusId, paymentCode, transId, partnerId, dateId, periode, partnerTransId, referenceNo) {
        // console.log(partnerTransId, 'partnerTransId');
        // console.log(dateId, 'dateId');
        if (isFilter === true && userRole === "102") {
            async function dataExportFilter(statusId, transId, paymentCode, partnerId, dateId, periode, partnerTransId) {
                try {
                    // console.log(dateId, 'dateId 2');
                    // console.log(partnerTransId, "partner trans filter");
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,4]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "partner_trans_id":"${partnerTransId === undefined ? "" : partnerTransId}", "payment_code":"${(paymentCode.length !== 0) ? paymentCode : ""}", "sub_partner_id":"${(partnerId.length !== 0) ? partnerId : ""}", "reference_no":"", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    // console.log(dataExportFilter, 'dataExportFilter');
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nominal Disbursement": data[i].tdishburse_amount, "Total Disbursement": data[i].tdishburse_total_amount, "Tujuan Disbursement": data[i].payment_type, Cabang: data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, Catatan: data[i].notes === null ? "-" : data[i].notes, Status: data[i].mstatus_name_ind })
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
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nominal Disbursement": data[i].tdishburse_amount, "Total Disbursement": data[i].tdishburse_total_amount, "Tujuan Disbursement": data[i].payment_type, Cabang: data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, Catatan: data[i].notes === null ? "-" : data[i].notes, Status: data[i].mstatus_name_ind })
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
            dataExportFilter(statusId, transId, paymentCode, partnerId, dateId, periode, partnerTransId)
        } else if (isFilter === true && userRole !== "102") {
            async function dataExportFilter(statusId, transId, paymentCode, partnerId, dateId, periode, partnerTransId, referenceNo) {
                try {
                    // console.log(partnerTransId, "partner trans filter");
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,4]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "payment_code":"${(paymentCode.length !== 0) ? paymentCode : ""}", "sub_partner_id":"${(partnerId.length !== 0) ? partnerId : ""}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "partner_trans_id":"${partnerTransId}", reference_no: "${referenceNo}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ "No": i + 1, "ID Transaksi": data[i].tdishburse_code, "Waktu": convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nominal Disbursement": data[i].tdishburse_amount, "Fee Disbursement": data[i].tdishburse_fee, "Fee Tax": data[i].tdishburse_fee_tax, "Fee Bank": data[i].tdishburse_fee_bank, "Total Disbursement": data[i].tdishburse_total_amount, "Tujuan Disbursement": data[i].payment_type, Cabang: data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, Catatan: data[i].notes === null ? "-" : data[i].notes, "Reference No": data[i].reference_no === "" ? "-" : data[i].reference_no, "Status": data[i].mstatus_name_ind })
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
                            dataExcel.push({ "No": i + 1, "ID Transaksi": data[i].tdishburse_code, "Waktu": convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nominal Disbursement": data[i].tdishburse_amount, "Fee Disbursement": data[i].tdishburse_fee, "Fee Tax": data[i].tdishburse_fee_tax, "Fee Bank": data[i].tdishburse_fee_bank, "Total Disbursement": data[i].tdishburse_total_amount, "Tujuan Disbursement": data[i].payment_type, Cabang: data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, Catatan: data[i].notes === null ? "-" : data[i].notes, "Reference No": data[i].reference_no === "" ? "-" : data[i].reference_no, "Status": data[i].mstatus_name_ind })
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
            dataExportFilter(statusId, transId, paymentCode, partnerId, dateId, periode, partnerTransId, referenceNo)
        } else if (isFilter === false && userRole === "102") {
            async function dataExportDisbursement() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [1,2,4], "transID" : "", "payment_code": "", "dateID": 2, "date_from": "", "date_to": "", "partner_trans_id":"", "reference_no":"", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportDisbursement = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    if (dataExportDisbursement.status === 200 && dataExportDisbursement.data.response_code === 200 && dataExportDisbursement.data.response_new_token === null) {
                        const data = dataExportDisbursement.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nominal Disbursement": data[i].tdishburse_amount, "Total Disbursement": data[i].tdishburse_total_amount, "Tujuan Disbursement": data[i].payment_type, Cabang: data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, Catatan: data[i].notes === null ? "-" : data[i].notes, Status: data[i].mstatus_name_ind })
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
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdishburse_code, Waktu: convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nominal Disbursement": data[i].tdishburse_amount, "Total Disbursement": data[i].tdishburse_total_amount, "Tujuan Disbursement": data[i].payment_type, Cabang: data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, Catatan: data[i].notes === null ? "-" : data[i].notes, Status: data[i].mstatus_name_ind })
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
                    const dataParams = encryptData(`{"statusID": [1,2,4], "transID" : "", "sub_partner_id":"", "payment_code": "", "dateID": 2, "date_from": "", "date_to": "", "partner_trans_id":"", "reference_no":"", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportDisbursement = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    if (dataExportDisbursement.status === 200 && dataExportDisbursement.data.response_code === 200 && dataExportDisbursement.data.response_new_token === null) {
                        const data = dataExportDisbursement.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ "No": i + 1, "ID Transaksi": data[i].tdishburse_code, "Waktu": convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nominal Disbursement": data[i].tdishburse_amount, "Fee Disbursement": data[i].tdishburse_fee, "Fee Tax": data[i].tdishburse_fee_tax, "Fee Bank": data[i].tdishburse_fee_bank, "Total Disbursement": data[i].tdishburse_total_amount, "Tujuan Disbursement": data[i].payment_type, Cabang: data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, Catatan: data[i].notes === null ? "-" : data[i].notes, "Reference No": data[i].reference_no === "" ? "-" : data[i].reference_no, "Status": data[i].mstatus_name_ind })
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
                            dataExcel.push({ "No": i + 1, "ID Transaksi": data[i].tdishburse_code, "Waktu": convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nominal Disbursement": data[i].tdishburse_amount, "Fee Disbursement": data[i].tdishburse_fee, "Fee Tax": data[i].tdishburse_fee_tax, "Fee Bank": data[i].tdishburse_fee_bank, "Total Disbursement": data[i].tdishburse_total_amount, "Tujuan Disbursement": data[i].payment_type, Cabang: data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, Catatan: data[i].notes === null ? "-" : data[i].notes, "Reference No": data[i].reference_no === "" ? "-" : data[i].reference_no, "Status": data[i].mstatus_name_ind })
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
            <span className='breadcrumbs-span'>{(user_role === "102") ? <><span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> Laporan</span>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Riwayat Disbursement</> : <><span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda</span>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Disbursement Report</>}</span> 
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4">{(user_role === "102") ? "Riwayat Disbursement" : "Disbursement Report"}</h2>
            </div>
            <div className='main-content'>
                <div className='mt-2'>
                    <span className='mt-4' style={{fontWeight: 600}}>{(user_role === "102") ? "Riwayat Disbursement" : "Disbursement Report"}</span>
                    <div className='base-content mt-3'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                        {
                            user_role !== "102" ?
                            <>
                                <Row className='mt-4'>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span>ID Transaksi</span>
                                        <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiDisbursement} name="idTransaksiDisbursement" type='text'className='input-text-report' placeholder='Masukkan ID Transaksi'/>
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span className='me-4'>Nama Partner</span>
                                        <div className="dropdown dropDisbursePartner">
                                            <ReactSelect
                                                // isMulti
                                                closeMenuOnSelect={true}
                                                hideSelectedOptions={false}
                                                options={dataListPartner}
                                                // allowSelectAll={true}
                                                value={selectedPartnerDisbursement}
                                                onChange={(selected) => setSelectedPartnerDisbursement([selected])}
                                                placeholder="Pilih Nama Partner"
                                                components={{ Option }}
                                                styles={customStylesSelectedOption}
                                            />
                                        </div>
                                        {/* <Form.Select name='namaPartnerDisbursement' className="input-text-ez" value={inputHandle.namaPartnerDisbursement} onChange={(e) => handleChange(e)} style={{ marginLeft: 35 }}>
                                            <option defaultChecked disabled value="">Pilih Nama Partner</option>
                                            {
                                                dataListPartner.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.partner_id}>{item.nama_perusahaan}</option>
                                                    )
                                                })
                                            }
                                        </Form.Select> */}
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span className='me-5'>Status</span>
                                        <Form.Select name="statusDisbursement" className='input-text-ez ms-5' style={{ display: "inline" }} value={inputHandle.statusDisbursement} onChange={(e) => handleChange(e)}>
                                            <option defaultChecked disabled value="">Pilih Status</option>
                                            <option value={2}>Berhasil</option>
                                            <option value={1}>Dalam Proses</option>
                                            <option value={4}>Gagal</option>
                                            {/* <option value={7}>Menunggu Pembayaran</option> */}
                                            {/* <option value={9}>Kadaluwarsa</option> */}
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{  width: (showDateDisbursement === "none") ? "33.2%" : "33.2%" }}>
                                        <span style={{ marginRight: 26 }}>Periode <span style={{ color: "red" }}>*</span></span>
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
                                        <input onChange={(e) => handleChange(e)} value={inputHandle.partnerTransId} name="partnerTransId" type='text'className='input-text-report ms-2' placeholder='Masukkan Partner Trans ID'/>
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: "33%"}}>
                                        <span>Tipe Pembayaran</span>
                                        <div className="dropdown dropDisbursePartner">
                                            <ReactSelect
                                                // isMulti
                                                closeMenuOnSelect={true}
                                                hideSelectedOptions={false}
                                                options={listDisburseChannel}
                                                // allowSelectAll={true}
                                                value={selectedPaymentDisbursement}
                                                onChange={(selected) => setSelectedPaymentDisbursement([selected])}
                                                placeholder="Pilih Pembayaran"
                                                components={{ Option }}
                                                styles={customStylesSelectedOption}
                                            />
                                        </div>
                                        {/* <Form.Select name="paymentCode" className='input-text-riwayat ' style={{ display: "inline" }} value={inputHandle.paymentCode} onChange={(e) => handleChange(e)}>
                                            <option defaultChecked disabled value="">Pilih Pembayaran</option>
                                            {
                                                listDisburseChannel.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.payment_code}>{item.payment_name}</option>
                                                    )
                                                })
                                            }
                                        </Form.Select> */}
                                    </Col>
                                </Row>
                                <Row className='mt-4' style={{ display: showDateDisbursement }}>
                                    <Col xs={4}>
                                        <div className='text-end me-4'>
                                            <DateRangePicker 
                                                onChange={pickDateDisbursement}
                                                value={stateDateDisbursement}
                                                clearIcon={null}
                                                // calendarIcon={null}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span>Reference No</span>
                                        <input onChange={(e) => handleChange(e)} value={inputHandle.referenceNo} name="referenceNo" type='text'className='input-text-report' placeholder='Masukkan Reference No'/>
                                    </Col>
                                </Row>
                            </> :
                            <>
                                <Row className='mt-4'>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                                        <span className='me-4'>ID Transaksi</span>
                                        <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiDisbursement} name="idTransaksiDisbursement" type='text'className='input-text-report' placeholder='Masukkan ID Transaksi'/>
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{  width: "34%" }}>
                                        <span style={{ marginRight: 26 }}>Periode <span style={{ color: "red" }}>*</span></span>
                                        <Form.Select name='periodeDisbursement' className="input-text-ez me-2" value={inputHandle.periodeDisbursement} onChange={(e) => handleChangePeriodeDisbursement(e)}>
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
                                            <option value={1}>Dalam Proses</option>
                                            <option value={4}>Gagal</option>
                                            {/* <option value={7}>Menunggu Pembayaran</option> */}
                                            {/* <option value={9}>Kadaluwarsa</option> */}
                                        </Form.Select>
                                    </Col>
                                    
                                </Row>
                                <Row className='mt-3'>
                                    <Col xs={4} className='d-flex justify-content-start align-items-center'>
                                        <span>Partner Trans ID</span>
                                        <input onChange={(e) => handleChange(e)} value={inputHandle.partnerTransId} name="partnerTransId" type='text'className='input-text-report' placeholder='Masukkan Partner Trans ID'/>
                                    </Col>
                                    <Col xs={4} className="d-flex justify-content-end align-items-center" >
                                        <div style={{ display: showDateDisbursement}} className='me-4'>
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
                                            onClick={() => filterDisbursement(1, inputHandle.statusDisbursement, inputHandle.idTransaksiDisbursement, selectedPaymentDisbursement.length !== 0 ? selectedPaymentDisbursement[0].value : "", selectedPartnerDisbursement.length !== 0 ? selectedPartnerDisbursement[0].value : "", inputHandle.periodeDisbursement, dateRangeDisbursement, inputHandle.partnerTransId, inputHandle.referenceNo, 0)}
                                            className={(inputHandle.periodeDisbursement || dateRangeDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.idTransaksiDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.statusDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.referenceNo.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                            disabled={inputHandle.periodeDisbursement === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.idTransaksiDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.statusDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.referenceNo.length === 0}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => resetButtonHandle()}
                                            className={(inputHandle.periodeDisbursement || dateRangeDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.idTransaksiDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.statusDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.referenceNo.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                                            disabled={inputHandle.periodeDisbursement === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.idTransaksiDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.statusDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.referenceNo.length === 0}
                                        >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {
                            user_role === "102" ? (
                                <div className='d-flex justify-content-start align-items-center mt-3 mb-2' style={{ color: '#383838', padding: '12px 12px 12px 12px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'normal', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }}>
                                    <img src={noteInfo} width="25" height="25" alt="circle_info" />
                                    <div className='ms-2'>Status transaksi Disbursement Anda akan diperbaharui setiap <b>20 menit</b> sekali. Harap periksa laman ini secara berkala untuk pembaharuan status transaksi.</div>
                                </div>
                            ) : ""
                        }
                        {
                            dataDisbursement.length !== 0 &&
                            <div style={{ marginBottom: 30 }}>
                                <Link to={"#"} onClick={() => ExportReportDisbursementHandler(isFilterDisbursement, user_role, inputHandle.statusDisbursement, selectedPaymentDisbursement.length !== 0 ? selectedPaymentDisbursement[0].value : "", inputHandle.idTransaksiDisbursement, selectedPartnerDisbursement.length !== 0 ? selectedPartnerDisbursement[0].value : "", inputHandle.periodeDisbursement, dateRangeDisbursement, inputHandle.partnerTransId, inputHandle.referenceNo)} className="export-span">Export</Link>
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