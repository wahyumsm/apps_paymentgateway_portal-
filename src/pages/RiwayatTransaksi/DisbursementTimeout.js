import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { useHistory } from 'react-router';
import { BaseURL, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import { Col, Form, Image, Row, Toast } from '@themesberg/react-bootstrap';
import ReactSelect, { components } from 'react-select';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DataTable, { defaultThemes } from 'react-data-table-component';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import axios from 'axios';
import encryptData from '../../function/encryptData';
import Pagination from 'react-js-pagination';
import * as XLSX from "xlsx"
import { Link } from 'react-router-dom';
import $ from 'jquery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import Checklist from '../../assets/icon/checklist_icon.svg'
import noteIconRed from "../../assets/icon/note_icon_red.svg";

const DisbursementTimeout = () => {
    registerPlugin(FilePondPluginFileEncode)
    const history = useHistory()
    const user_role = getRole();
    const [files, setFiles] = useState([])
    const [dataFromExcel, setDataFromExcel] = useState([])
    const [labelExcel, setLabelExcel] = useState(`<div class='py-4 mb-2 style-label-drag-drop text-center'>Pilih atau letakkan file Excel kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
        <div className='pb-4'>
            <span class="filepond--label-action">
                Upload File
            </span>
        </div>`
    )
    const [dataListPartner, setDataListPartner] = useState([])
    const [selectedPartnerDisbursement, setSelectedPartnerDisbursement] = useState([])
    const [dataDisbursementTimeout, setDataDisbursementTimeout] = useState([])
    const [pendingDisbursementTimeout, setPendingDisbursementTimeout] = useState(true)
    const [activePageDisbursementTimeout, setActivePageDisbursementTimeout] = useState(1)
    const [pageNumberDisbursementTimeout, setPageNumberDisbursementTimeout] = useState({})
    const [totalPageDisbursementTimeout, setTotalPageDisbursementTimeout] = useState(0)
    const [isFilterDisburseTimeout, setIsFilterDisburseTimeout] = useState(false)
    const [isDisbursementManual, setIsDisbursementManual] = useState(true)

    const [stateDateDisbursementTimeout, setStateDisbursementTimeout] = useState(null)
    const [dateRangeDisbursementTimeout, setDateRangeDisbursementTimeout] = useState([])
    const [showDateDisbursementTimeout, setShowDateDisbursementTimeout] = useState("none")

    const [showModalStatusRefundDsiburse, setShowModalStatusRefundDsiburse] = useState(false)

    const [inputHandleTimeout, setInputHandleTimeout] = useState({
        transID: "",
        periodeDisburseTimeout: 0,
        partnerTransId: "",
        reffNo: "",
    })


    const [inputPartnerTransId, setInputPartnerTransId] = useState("")
    const [dataRefundDisburse, setDataRefundDisburse] = useState([])
    const [saveDataRefundDisburse, setSaveDataRefundDisburse] = useState([])
    const [errorFound, setErrorFound] = useState([])

    console.log(saveDataRefundDisburse, "saveDataRefundDisburse");

    function toDashboard() {
        history.push("/");
    }

    function pickDateDisbursementTimeout(item) {
        setStateDisbursementTimeout(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeDisbursementTimeout(item)
        }
    }

    function handleChangePeriodeDisburseTimeout(e) {
        
        if (e.target.value === "7") {
            setShowDateDisbursementTimeout("")
            setInputHandleTimeout({
                ...inputHandleTimeout,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateDisbursementTimeout("none")
            setInputHandleTimeout({
                ...inputHandleTimeout,
                [e.target.name] : e.target.value
            })
        }
    }

    function handlePageChangeDisbursement(page) {
        if (isFilterDisburseTimeout) {
            setActivePageDisbursementTimeout(page)
            filterDisbursementTimeout(inputHandleTimeout.transID, selectedPartnerDisbursement.length !== 0 ? selectedPartnerDisbursement[0].value : "", inputHandleTimeout.periodeDisburseTimeout, dateRangeDisbursementTimeout, inputHandleTimeout.partnerTransId, inputHandleTimeout.reffNo, page, 10)
        } else {
            setActivePageDisbursementTimeout(page)
            disbursementTimeoutReport(page)
        }
    }

    function handleChange(e) {
        setInputPartnerTransId(e.target.value)
    }

    function saveNewDataRefund (number, partnerTransId) {
        const newData = {
            number : number,
            partnerTransId : partnerTransId
        }
        setDataRefundDisburse([...dataRefundDisburse, newData])
        setInputPartnerTransId("")
    }

    function resetButtonHandle() {
        disbursementTimeoutReport(activePageDisbursementTimeout)
        setInputHandleTimeout({
            ...inputHandleTimeout,
            transID: "",
            periodeDisburseTimeout: 0,
            partnerTransId: "",
            reffNo: ""
        })
        setSelectedPartnerDisbursement([])
        setStateDisbursementTimeout(null)
        setDateRangeDisbursementTimeout([])
        setShowDateDisbursementTimeout("none")
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

    async function disbursementTimeoutReport(currentPage) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"transID" : "", "sub_partner_id":"", "dateID": 2, "date_from": "", "date_to": "", "partner_trans_id":"", "partner_reference_no": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataDisburseTimeout = await axios.post(BaseURL + "/Report/HistoryTimeoutDisburse", {data: dataParams}, { headers: headers });
            if (dataDisburseTimeout.status === 200 && dataDisburseTimeout.data.response_code === 200 && dataDisburseTimeout.data.response_new_token.length === 0) {
                dataDisburseTimeout.data.response_data.results = dataDisburseTimeout.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberDisbursementTimeout(dataDisburseTimeout.data.response_data)
                setTotalPageDisbursementTimeout(dataDisburseTimeout.data.response_data.max_page)
                setDataDisbursementTimeout(dataDisburseTimeout.data.response_data.results)
                setPendingDisbursementTimeout(false)
            } else if (dataDisburseTimeout.status === 200 && dataDisburseTimeout.data.response_code === 200 && dataDisburseTimeout.data.response_new_token.length !== 0) {
                setUserSession(dataDisburseTimeout.data.response_new_token)
                dataDisburseTimeout.data.response_data.results = dataDisburseTimeout.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}))
                setPageNumberDisbursementTimeout(dataDisburseTimeout.data.response_data)
                setTotalPageDisbursementTimeout(dataDisburseTimeout.data.response_data.max_page)
                setDataDisbursementTimeout(dataDisburseTimeout.data.response_data.results)
                setPendingDisbursementTimeout(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterDisbursementTimeout(transId, subPartnerId, dateId, periode, partnerTransId, reffNo, page, rowPerPage) {
        try {
            setPendingDisbursementTimeout(true)
            setIsFilterDisburseTimeout(true)
            setActivePageDisbursementTimeout(page)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"transID" : "${transId}", "sub_partner_id":"${subPartnerId}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "partner_trans_id":"${partnerTransId}", "partner_reference_no": "${reffNo}", "page": ${(page < 1) ? 1 : page}, "row_per_page": ${rowPerPage}}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataDisburseTimeout = await axios.post(BaseURL + "/Report/HistoryTimeoutDisburse", {data: dataParams}, { headers: headers });
            if (dataDisburseTimeout.status === 200 && dataDisburseTimeout.data.response_code === 200 && dataDisburseTimeout.data.response_new_token.length === 0) {
                dataDisburseTimeout.data.response_data.results = dataDisburseTimeout.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberDisbursementTimeout(dataDisburseTimeout.data.response_data)
                setTotalPageDisbursementTimeout(dataDisburseTimeout.data.response_data.max_page)
                setDataDisbursementTimeout(dataDisburseTimeout.data.response_data.results)
                // setTotalDisbursement(dataDisburseTimeout.data.response_data.results.total_settlement)
                setPendingDisbursementTimeout(false)
            } else if (dataDisburseTimeout.status === 200 && dataDisburseTimeout.data.response_code === 200 && dataDisburseTimeout.data.response_new_token.length !== 0) {
                setUserSession(dataDisburseTimeout.data.response_new_token)
                dataDisburseTimeout.data.response_data.results = dataDisburseTimeout.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberDisbursementTimeout(dataDisburseTimeout.data.response_data)
                setTotalPageDisbursementTimeout(dataDisburseTimeout.data.response_data.max_page)
                setDataDisbursementTimeout(dataDisburseTimeout.data.response_data.results)
                // setTotalDisbursement(dataDisburseTimeout.data.response_data.results.total_settlement)
                setPendingDisbursementTimeout(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function exportDisburseTimeoutReport (isFilter, transId, subPartnerId, dateId, periode, partnerTransId, reffNo) {
        if (isFilter) {
            async function dataExportFilter(transId, subPartnerId, dateId, periode, partnerTransId, reffNo) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"transID" : "${(transId.length !== 0) ? transId : ""}", "sub_partner_id":"${subPartnerId}", "dateID": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "partner_trans_id":"${partnerTransId === undefined ? "" : partnerTransId}", "partner_reference_no":"${(reffNo.length !== 0) ? reffNo : ""}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Report/HistoryTimeoutDisburse", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ "No": i + 1, "ID Transaksi": data[i].transID, "Waktu": data[i].processDate, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].partnerName, "Nominal": data[i].amount, "Biaya": data[i].fee, "Biaya Bank": data[i].feeBank, "Total Biaya": data[i].totalAmount, "Tujuan": data[i].payment_type, "Cabang": data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, "Catatan": data[i].notes === null ? "-" : data[i].notes, "Reference No": data[i].partner_reference_no === "" ? "-" : data[i].partner_reference_no, "Status": data[i].status })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Disbursement Timeout.xlsx");
                    }
                } catch (error) {
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(transId, subPartnerId, dateId, periode, partnerTransId, reffNo)
        } else {
            async function dataExportNonFilter() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"transID" : "", "sub_partner_id": "", "dateID": 2, "date_from": "", "date_to": "", "partner_trans_id": "", "partner_reference_no": "", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Report/HistoryTimeoutDisburse", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token.length === 0) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ "No": i + 1, "ID Transaksi": data[i].transID, "Waktu": data[i].processDate, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].partnerName, "Nominal": data[i].amount, "Biaya": data[i].fee, "Biaya Bank": data[i].feeBank, "Total Biaya": data[i].totalAmount, "Tujuan": data[i].payment_type, "Cabang": data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, "Catatan": data[i].notes === null ? "-" : data[i].notes, "Reference No": data[i].partner_reference_no === "" ? "-" : data[i].partner_reference_no, "Status": data[i].status })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Disbursement Timeout.xlsx");
                    }
                } catch (error) {
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportNonFilter()
        }
    }

    async function refundDataDisbursement(isDisburseManual, partnerTransIdManual, partnerTransIdBulk) {
        try {
            let partnerTransId
            if (isDisburseManual) {
                partnerTransId = partnerTransIdManual.map(a => a.partnerTransId)
            } else {
                partnerTransId = partnerTransIdBulk.map(a => a[`Partner Trans ID`])
            }
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"partner_trans_id": ${JSON.stringify(partnerTransId)}}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataDisburseTimeout = await axios.post(BaseURL + "/Report/RefundTransactionDisburse", {data: dataParams}, { headers: headers });
            if (dataDisburseTimeout.status === 200 && dataDisburseTimeout.data.response_code === 200 && dataDisburseTimeout.data.response_new_token.length === 0) {
                setSaveDataRefundDisburse(dataDisburseTimeout.data.response_data.results)
                setDataFromExcel([])
                setDataRefundDisburse([])
                setLabelExcel(
                    `<div class='py-4 mb-2 style-label-drag-drop text-center'>Pilih atau letakkan file Excel kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                    <div className='pb-4'>
                        <span class="filepond--label-action">
                            Upload File
                        </span>
                    </div>`
                )
                setShowModalStatusRefundDsiburse(true)
                setTimeout(() => {
                    setShowModalStatusRefundDsiburse(false)
                }, 10000);
            } else if (dataDisburseTimeout.status === 200 && dataDisburseTimeout.data.response_code === 200 && dataDisburseTimeout.data.response_new_token.length !== 0) {
                setUserSession(dataDisburseTimeout.data.response_new_token)
                setSaveDataRefundDisburse(dataDisburseTimeout.data.response_data.results)
                setDataFromExcel([])
                setDataRefundDisburse([])
                setLabelExcel(
                    `<div class='py-4 mb-2 style-label-drag-drop text-center'>Pilih atau letakkan file Excel kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                    <div className='pb-4'>
                        <span class="filepond--label-action">
                            Upload File
                        </span>
                    </div>`
                )
                setShowModalStatusRefundDsiburse(true)
                setTimeout(() => {
                    setShowModalStatusRefundDsiburse(false)
                }, 10000);
            }
        } catch (error) {
            history.push(errorCatch(error.response.status))
        }
    }

    async function fileCsv (value) {
        try {
            if (value.length === 0) {
                setDataFromExcel([])
            } else if (value.length !== 0 && value[0].file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                setDataFromExcel([])
                setErrorFound([])
                setLabelExcel("")
                setLabelExcel(`<div class='pt-1 pb-2 style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />File yang digunakan harus berformat Excel</div>
                        <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                        <div className='pb-4'>
                            <span class="filepond--label-action">
                                Ganti File
                            </span>
                        </div>`
                )
            } else if (value.length !== 0 && value[0].file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                const pond = await value[0].getFileEncodeBase64String()
                if (pond !== undefined) {
                    const wb = XLSX.read(pond, {type: "base64"})
                    const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
                    let dataTemp = XLSX.utils.sheet_to_json(ws); // generate objects
                    console.log(wb, 'wb');
                    console.log(ws, Object.keys(ws), 'ws');
                    if (wb.SheetNames.length !== 1) {
                        setDataFromExcel([])
                        setErrorFound([])
                        setTimeout(() => {
                            setLabelExcel("")
                            setLabelExcel(
                                `<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>Jumlah Sheet pada file Excel lebih dari 1. Harap tinjau kembali file anda agar sesuai dengan template.</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        Ganti File
                                    </span>
                                </div>`
                            )
                        }, 2500);
                    } else if (ws.A1 === undefined) {
                        setDataFromExcel([])
                        setErrorFound([])
                        setTimeout(() => {
                            setLabelExcel("")
                            setLabelExcel(
                                `<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>Konten pada tabel tidak sesuai dengan template Disbursement Bulk <br/> Ezeelink. Harap download dan menggunakan template yang disediakan <br/> untuk mempermudah pengecekkan data disbursement.</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        Ganti File
                                    </span>
                                </div>`
                            )
                        }, 2500);
                    } else if (ws.A1.h.trim() !== "Partner Trans ID") {
                        setDataFromExcel([])
                        setErrorFound([])
                        setTimeout(() => {
                            setLabelExcel("")
                            setLabelExcel(
                                `<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>Konten pada tabel tidak sesuai dengan template Disbursement Bulk <br/> Ezeelink. Harap download dan menggunakan template yang disediakan <br/> untuk mempermudah pengecekkan data disbursement.</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        Ganti File
                                    </span>
                                </div>`
                            )
                        }, 2500);
                    } else if (dataTemp.length === 0) {
                        setDataFromExcel([])
                        setErrorFound([])
                        setTimeout(() => {
                            setLabelExcel("")
                            setLabelExcel(
                                `<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>Data pada file masih kosong. Harap tinjau kembali data pada file anda.</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        Ganti File
                                    </span>
                                </div>`
                            )
                        }, 2500);
                    } else {
                        let data = []
                        dataTemp = dataTemp.map((obj, idx) => ({...obj, no: idx + 1}))
                        dataTemp.forEach(el => {
                            let obj = {}
                            Object.keys(el).forEach(e => {
                                obj[(e.trim())] = String(el[e])
                            })
                            data.push(obj)
                        })
                        setDataFromExcel([])
                        setTimeout(() => {
                            setLabelExcel("")
                            setLabelExcel(`<div class='mt-2 style-label-drag-drop-filename'>${value[0].file.name}</div>
                            <div class='py-4 style-label-drag-drop'>Pilih atau letakkan file Excel kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                            <div className='pb-4'>
                                <span class="filepond--label-action">
                                    Ganti File
                                </span>
                            </div>`)
                        }, 2000)
        
                        setTimeout(() => {
                            setDataFromExcel(data)
                        }, 2500)
                    }
                }
            }
        } catch (e) {
            // console.log(e, "e");
        }
    }

    function exportDataRefundDisburse () {
        try {
            let dataExcel = []
            for (let i = 0; i < saveDataRefundDisburse.length; i++) {
                dataExcel.push({ "No": i + 1, "Partner Trans ID": saveDataRefundDisburse[i].partner_trans_id, "Status": saveDataRefundDisburse[i].error_message})
            }
            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, "Refund Disbursement.xlsx");
        } catch (error) {
            history.push(errorCatch(error.response.status))
        }
    }

    const columnDisburseTimeout = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.transID,
            width: "160px",
            wrap: true
        },
        {
            name: 'Waktu',
            selector: row => row.processDate,
            width: "170px"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            width: "200px",
            wrap: true
        },
        {
            name: 'Nama Partner',
            selector: row => row.partnerName,
            width: "140px",
            wrap: true
        },
        {
            name: 'Nominal',
            selector: row => row.amount,
            width: "150px"
        },
        {
            name: 'Biaya',
            selector: row => row.fee,
        },
        {
            name: 'Biaya Bank',
            selector: row => row.feeBank,
            width: "130px"
        },
        {
            name: 'Total Biaya',
            selector: row => row.totalAmount,
            width: "130px"
        },
        {
            name: 'Tujuan',
            selector: row => row.payment_type,
            width: "100px"
        },
        {
            name: 'Cabang',
            selector: row => row.branch_name === null ? "-" : row.branch_name,
            width: "120px",
            wrap: true
        },
        {
            name: 'Nomor Rekening Tujuan',
            selector: row => row.tdishburse_acc_num,
            width: "220px",
            wrap: true
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.tdishburse_acc_name === null ? "-" : row.tdishburse_acc_name,
            width: "220px",
            wrap: true
        },
        {
            name: 'Catatan',
            selector: row => row.notes === null ? "-" : row.notes,
            width: "100px",
            wrap: true
        },
        {
            name: 'Reference No',
            selector: row => (row.partner_reference_no === null) ? "-" : (row.partner_reference_no.length === 0 ) ? "-" : row.partner_reference_no,
            width: "150px",
            wrap: true
        },
        {
            name: 'Status',
            selector: row => row.status,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "unset", margin: "6px 0px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.statusID === 1,
                    style: { background: "rgba(247, 148, 33, 0.08)", color: "#F79421" }
                },
                {
                    when: row => row.statusID === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.statusID === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C" }
                }
            ]
        },

    ]

    console.log(dataDisbursementTimeout, "dataDisbursementTimeout");

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

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
        </div>
    );

    const customStylesDisbursement = {
        headCells: {
            style: {
                // width: 'max-content',
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

    useEffect(() => {
      listPartner()
      if (user_role !== "102") {
          disbursementTimeoutReport(activePageDisbursementTimeout)
      }
      
    }, [])

    function disbursementTabs(isTabs){
        setIsDisbursementManual(isTabs)
        if(!isTabs) {
            $('#detailakuntab').removeClass('menu-detail-akun-hr-active')
            $('#detailakunspan').removeClass('menu-detail-akun-span-active')
            $('#konfigurasitab').addClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').addClass('menu-detail-akun-span-active')
        } else {
            $('#konfigurasitab').removeClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').removeClass('menu-detail-akun-span-active')
            $('#detailakuntab').addClass('menu-detail-akun-hr-active')
            $('#detailakunspan').addClass('menu-detail-akun-span-active')
        }
    }

    function pindahHalaman (param) {
        if (param === "manual") {
            disbursementTabs(true)
            setDataFromExcel([])
            setLabelExcel(`<div class='py-4 mb-2 style-label-drag-drop text-center'>Pilih atau letakkan file Excel kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                <div className='pb-4'>
                    <span class="filepond--label-action">
                        Upload File
                    </span>
                </div>`
            )
        } else {
            disbursementTabs(false)
            setDataRefundDisburse([])
            setInputPartnerTransId("")
        }
    }

    return (
        <>
            {
                showModalStatusRefundDsiburse &&
                <div style={{ position: "fixed", zIndex: 999, width: "80%" }} className="d-flex justify-content-center align-items-center mt-4 ms-5">
                    <Toast style={{ width: "900px", backgroundColor: "#383838" }} position="bottom-center" className="text-center">
                        <Toast.Body className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Anda Telah Melakukan Refund Disbursement. </Toast.Body>
                    </Toast>
                </div>
            }
            <div className="main-content mt-5" style={{ padding: "37px 27px" }}>
                <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda</span>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Disbursement Timeout</span>
                <div className='head-title'>
                    <h2 className="h5 mb-3 mt-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>{(user_role === "102") ? "Riwayat Disbursement" : "Disbursement Timeout"}</h2>
                </div>
                <div className='main-content mt-2'>
                    <div className='base-content mt-3'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                        <Row className='mt-4'>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span className='me-3'>ID Transaksi</span>
                                <input type='text'className='input-text-report' placeholder='Masukkan ID Transaksi'/>
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
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center" style={{  width: (showDateDisbursementTimeout === "none") ? "33.2%" : "33.2%" }}>
                                <span style={{ marginRight: 26 }}>Periode <span style={{ color: "red" }}>*</span></span>
                                <Form.Select name='periodeDisburseTimeout' className="input-text-ez" value={inputHandleTimeout.periodeDisburseTimeout} onChange={(e) => handleChangePeriodeDisburseTimeout(e)}>
                                    <option defaultChecked disabled value={0}>Pilih Periode</option> 
                                    <option value={2}>Hari Ini</option>
                                    <option value={3}>Kemarin</option>
                                    <option value={4}>7 Hari Terakhir</option>
                                    <option value={5}>Bulan Ini</option>
                                    <option value={6}>Bulan Kemarin</option>
                                    <option value={7}>Pilih Range Tanggal</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span>Partner Trans ID</span>
                                <input type='text'className='input-text-report ms-2' placeholder='Masukkan Partner Trans ID'/>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span className='me-2'>Reference No</span>
                                <input type='text'className='input-text-report' placeholder='Masukkan Reference No'/>
                            </Col>
                            <Col xs={4} style={{ display: showDateDisbursementTimeout }}>
                                <div className='text-end me-4'>
                                    <DateRangePicker 
                                        onChange={pickDateDisbursementTimeout}
                                        value={stateDateDisbursementTimeout}
                                        clearIcon={null}
                                        // calendarIcon={null}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => filterDisbursementTimeout(inputHandleTimeout.transID, selectedPartnerDisbursement.length !== 0 ? selectedPartnerDisbursement[0].value : "", inputHandleTimeout.periodeDisburseTimeout, dateRangeDisbursementTimeout, inputHandleTimeout.partnerTransId, inputHandleTimeout.reffNo, 1, 10)}
                                            className={(inputHandleTimeout.periodeDisburseTimeout || dateRangeDisbursementTimeout.length !== 0 || (dateRangeDisbursementTimeout.length !== 0 && selectedPartnerDisbursement.length !== 0) || (dateRangeDisbursementTimeout.length !== 0 && inputHandleTimeout.transID.length !== 0) || (dateRangeDisbursementTimeout.length !== 0 && inputHandleTimeout.partnerTransId.length !== 0) || (dateRangeDisbursementTimeout.length !== 0 && inputHandleTimeout.reffNo)) ? 'btn-ez-on' : 'btn-ez'}
                                            disabled={inputHandleTimeout.periodeDisburseTimeout === 0|| (inputHandleTimeout.periodeDisburseTimeout === 0 && inputHandleTimeout.transID.length === 0) || (inputHandleTimeout.periodeDisburseTimeout === 0 && selectedPartnerDisbursement.length === 0) || (inputHandleTimeout.periodeDisburseTimeout === 0 && inputHandleTimeout.partnerTransId.length === 0) || (inputHandleTimeout.periodeDisburseTimeout === 0 && inputHandleTimeout.reffNo.length === 0)}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => resetButtonHandle()}
                                            className={(inputHandleTimeout.periodeDisburseTimeout || dateRangeDisbursementTimeout.length !== 0 || (dateRangeDisbursementTimeout.length !== 0 && selectedPartnerDisbursement.length !== 0) || (dateRangeDisbursementTimeout.length !== 0 && inputHandleTimeout.transID.length !== 0) || (dateRangeDisbursementTimeout.length !== 0 && inputHandleTimeout.partnerTransId.length !== 0) || (dateRangeDisbursementTimeout.length !== 0 && inputHandleTimeout.reffNo)) ? 'btn-reset' : 'btn-ez-reset'}
                                            disabled={inputHandleTimeout.periodeDisburseTimeout === 0|| (inputHandleTimeout.periodeDisburseTimeout === 0 && inputHandleTimeout.transID.length === 0) || (inputHandleTimeout.periodeDisburseTimeout === 0 && selectedPartnerDisbursement.length === 0) || (inputHandleTimeout.periodeDisburseTimeout === 0 && inputHandleTimeout.partnerTransId.length === 0) || (inputHandleTimeout.periodeDisburseTimeout === 0 && inputHandleTimeout.reffNo.length === 0)}
                                        >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {
                            dataDisbursementTimeout.length !== 0 &&
                            <div style={{ marginBottom: 30 }}>
                                <Link to={"#"} onClick={() => exportDisburseTimeoutReport(isFilterDisburseTimeout, inputHandleTimeout.transID, selectedPartnerDisbursement.length !== 0 ? selectedPartnerDisbursement[0].value : "", inputHandleTimeout.periodeDisburseTimeout, dateRangeDisbursementTimeout, inputHandleTimeout.partnerTransId, inputHandleTimeout.reffNo)} className="export-span">Export</Link>
                            </div>
                        }

                        <div className="div-table mt-4 pb-4">
                            <DataTable
                                    columns={columnDisburseTimeout}
                                    data={dataDisbursementTimeout}
                                    customStyles={customStylesDisbursement}
                                    progressPending={pendingDisbursementTimeout}
                                    progressComponent={<CustomLoader />}
                                    // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                                    // pagination
                                />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                            <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageDisbursementTimeout}</div>
                                <Pagination
                                    activePage={activePageDisbursementTimeout}
                                    itemsCountPerPage={pageNumberDisbursementTimeout.row_per_page}
                                    totalItemsCount={(pageNumberDisbursementTimeout.row_per_page*pageNumberDisbursementTimeout.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeDisbursement}
                                />
                            </div>
                    </div>
                </div>

                <div className='head-title'>
                    <h2 className="h5 mb-3 mt-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>Refund Disbursement</h2>
                </div>

                <div className='detail-akun-menu mt-2' style={{display: 'flex', height: 33}}>
                    <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => pindahHalaman("manual")} id="detailakuntab">
                        <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">Disbursement Manual</span>
                    </div>
                    <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("bulk")} id="konfigurasitab">
                        <span className='menu-detail-akun-span' id="konfigurasispan">Disbursement Bulk</span>
                    </div>
                </div>

                {
                    isDisbursementManual ? (
                        <>
                            <div id='disbursement-manual' className='main-content'>
                                <hr className='hr-style' style={{marginTop: -2}}/>
                                <div className='base-content mt-3'>
                                    <div>
                                        <Row className='align-items-center' style={{ fontSize: 14 }}>
                                            <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                                Partner Trans ID
                                            </Col>
                                            <Col xs={10}>
                                                <Form.Control 
                                                    placeholder='Masukkan Partner Trans ID'
                                                    type='text'
                                                    className='input-text-user'
                                                    name='inpurPartnerTransId'
                                                    value={inputPartnerTransId}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className='mt-3'>
                                            <Col xs={2}></Col>
                                            <Col>
                                                <button
                                                    onClick={() => saveNewDataRefund(dataRefundDisburse.length + 1, inputPartnerTransId)}
                                                    className={inputPartnerTransId.length !== 0 ? 'btn-ez-disbursement' : 'btn-disbursement-reset'}
                                                    disabled={inputPartnerTransId.length === 0}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                        style={{ marginRight: 10 }}
                                                    />{" "}
                                                    Tambah Data Refund
                                                </button>
                                            </Col>
                                        </Row>
                                        {
                                            dataRefundDisburse.length !== 0 ?
                                            <div className='scroll-confirm' style={{ overflowX: 'auto' }}>
                                                <table
                                                    className="table mt-5"
                                                    id="tableInvoice"
                                                    hover
                                                >
                                                    <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                        <tr className='ms-3' >
                                                            <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo', width: "15%" }}>No</th>
                                                            <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Partner Trans ID</th>
                                                            <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            dataRefundDisburse.map((item) => {
                                                                return (
                                                                    <tr>
                                                                        <td className='ps-3'>{item.number}</td>
                                                                        <td className='ps-3'>{item.partnerTransId}</td>
                                                                        <td className='ps-3'>{`Pending`}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div> : 
                                            saveDataRefundDisburse.length !== 0 ?
                                            <>
                                                <div style={{ marginBottom: 30 }}>
                                                    <Link to={"#"} onClick={() => exportDataRefundDisburse()} className="export-span">Export</Link>
                                                </div>
                                                <div className='scroll-confirm mt-3' style={{  maxWidth: 'auto'  }}>
                                                    <table
                                                        className="table mt-5"
                                                        id="tableInvoice"
                                                        hover
                                                    >
                                                        <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                            <tr className='ms-3' >
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo', width: "15%" }}>No</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Partner Trans ID</th>
                                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                saveDataRefundDisburse.map((item, idx) => {
                                                                    return (
                                                                        <tr>
                                                                            <td className='ps-3'>{idx+1}</td>
                                                                            <td className='ps-3'>{item.partner_trans_id}</td>
                                                                            <td className='ps-3'>{item.error_message}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </> :
                                            <div className='scroll-confirm' style={{ overflowX: 'auto' }}>
                                                <table
                                                    className="table mt-5"
                                                    id="tableInvoice"
                                                    hover
                                                >
                                                    <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                        <tr className='ms-3' >
                                                            <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo', width: "15%" }}>No</th>
                                                            <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Partner Trans ID</th>
                                                            <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Status</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                                <div className='text-center pb-3'>Belum ada data</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div id='disbursement-bulk'>
                                <hr className='hr-style' style={{marginTop: -2}}/>
                                <div className='base-content'>
                                    <div className='mt-3 position-relative' style={{ marginBottom: 100 }}>
                                        <FilePond
                                            className='dragdrop'
                                            files={files}
                                            onupdatefiles={(value) => fileCsv(value)}
                                            server="/api"
                                            name="files"
                                            labelIdle={labelExcel}
                                        />
                                    </div>

                                    {
                                        dataFromExcel.length !== 0 ?
                                        <div className='scroll-confirm' style={{ overflowX: 'auto', maxWidth: 'auto' }}>
                                            <table
                                                className="table mt-1"
                                                id="tableInvoice"
                                                hover
                                            >
                                                <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                    <tr className='ms-3' >
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo', width: "15%" }}>No</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Partner Trans ID</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        dataFromExcel.map((item) => {
                                                            return (
                                                                <tr>
                                                                    <td className='ps-3'>{item.no}</td>
                                                                    <td className='ps-3'>{item["Partner Trans ID"]}</td>
                                                                    <td className='ps-3'>{`Pending`}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div> :
                                        saveDataRefundDisburse.length !== 0 ?
                                        <>
                                            <div style={{ marginBottom: 30 }}>
                                                <Link to={"#"} onClick={() => exportDataRefundDisburse()} className="export-span">Export</Link>
                                            </div>
                                            <div className='scroll-confirm' style={{  maxWidth: 'auto'  }}>
                                                <table
                                                    className="table mt-5"
                                                    id="tableInvoice"
                                                    hover
                                                >
                                                    <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                        <tr className='ms-3' >
                                                            <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo', width: "15%" }}>No</th>
                                                            <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Partner Trans ID</th>
                                                            <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            saveDataRefundDisburse.map((item, idx) => {
                                                                return (
                                                                    <tr>
                                                                        <td className='ps-3'>{idx+1}</td>
                                                                        <td className='ps-3'>{item.partner_trans_id}</td>
                                                                        <td className='ps-3'>{item.error_message}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </> :
                                        <div className='scroll-confirm' style={{ overflowX: 'auto', maxWidth: 'auto' }}>
                                            <table
                                                className="table mt-5"
                                                id="tableInvoice"
                                                hover
                                            >
                                                <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                    <tr className='ms-3' >
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo', width: "15%" }}>No</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Partner Trans ID</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Status</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            <div className='text-center pb-3'>Belum ada data</div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </>
                    )
                }
                
                <div className="d-flex justify-content-end align-items-center mt-2">
                    <button
                        // onClick={() => createDataDisburseExcel(dataDisburse, isDisbursementManual)}
                        className={(dataFromExcel.length !== 0 || dataRefundDisburse.length !== 0) ? 'btn-ez-transfer' : 'btn-noez-transfer'}
                        disabled={isDisbursementManual ? dataRefundDisburse.length === 0 : dataFromExcel.length === 0}
                        style={{ width: '25%' }}
                        onClick={() => refundDataDisbursement(isDisbursementManual, dataRefundDisburse, dataFromExcel)}
                    >
                        Lakukan Refund Disbursement
                    </button>
                </div>
            </div>
        </>
    )
}

export default DisbursementTimeout