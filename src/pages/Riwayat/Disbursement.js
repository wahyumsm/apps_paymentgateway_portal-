import React, { useEffect, useState } from 'react'
import { Col, Row, Form, Image, Modal, Button, Toast} from '@themesberg/react-bootstrap';
import DataTable, { defaultThemes } from 'react-data-table-component';
import { BaseURL, convertSimpleTimeStamp, convertToRupiah, errorCatch, getRole, getToken, language, setUserSession } from '../../function/helpers';
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
import { eng } from '../../components/Language';
import $ from 'jquery'
import { sum } from 'lodash'
import noteIconRed from "../../assets/icon/note_icon_red.svg";
import Checklist from '../../assets/icon/checklist_icon.svg'
import ChecklistError from '../../assets/icon/note_icon_white.svg'

function Disbursement() {

    const history = useHistory()
    const access_token = getToken();
    const user_role = getRole();
    const [dataListPartner, setDataListPartner] = useState([])
    const [dataDisbursement, setDataDisbursement] = useState([])
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
        referenceNo: "",
        keteranganDisbursement: ""
    })
    const [pendingDisbursement, setPendingDisbursement] = useState(true)
    const [activePageDisbursement, setActivePageDisbursement] = useState(1)
    const [pageNumberDisbursement, setPageNumberDisbursement] = useState({})
    const [totalPageDisbursement, setTotalPageDisbursement] = useState(1)
    const [isFilterDisbursement, setIsFilterDisbursement] = useState(false)
    const [listDisburseChannel, setListDisburseChannel] = useState([])
    const currentDate = new Date().toISOString().split('T')[0]
    const yesterdayDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
    const firstDayThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0]
    const lastDayThisMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1).toISOString().split('T')[0]
    const firstDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 2).toISOString().split('T')[0]
    const lastDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth()).toISOString().split('T')[0]

    const [selectedPartnerDisbursement, setSelectedPartnerDisbursement] = useState([])
    const [selectedPaymentDisbursement, setSelectedPaymentDisbursement] = useState([])

    const [isDisbursementReportTabs, setIsDisbursementReportTabs] = useState(true)

    const [perbaikanDataDisbursement, setPerbaikanDataDisbursement] = useState([])
    const [dataPerbaikanModal, setDataPerbaikanModal] = useState([])
    const [dataForUpload, setDataForUpload] = useState([])
    const [loadingPerbaikanData, setLoadingPerbaikanData] = useState(true)
    const [isChecklist, setIsChecklist] = useState({})
    const [showModalKonfirmasiPerbaikanData, setShowModalKonfirmasiPerbaikanData] = useState(false)
    const [allFee, setAllFee] = useState(0)
    const [allNominal, setAllNominal] = useState(0)
    const [allTotalNominal, setAllTotalNominal] = useState(0)
    const [isCheckedConfirm, setIsCheckedConfirm] = useState(false)
    const [getBalance, setGetBalance] = useState(0)
    const [totalHoldBalance, setTotalHoldBalance] = useState(0)
    const [showModalStatusDisburse, setShowModalStatusDisburse] = useState(false)
    const [responMsg, setResponMsg] = useState(0)
    const [errorDisbursementPerbaikanData, setErrorDisbursementPerbaikanData] = useState(false)
    console.log(perbaikanDataDisbursement, 'perbaikanDataDisbursement');
    console.log(isChecklist, 'isChecklist');

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
            fontFamily: "Nunito"
        }),
        control: (provided, state) => ({
            ...provided,
            border: "1px solid #E0E0E0",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "Nunito",
            height: "40px",
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
                [e.target.name] : e.target.value.split(",")
            })
        }
    }

    function handlePageChangeDisbursement(page) {
        if (isFilterDisbursement) {
            setActivePageDisbursement(page)
            filterDisbursement(user_role, page, inputHandle.statusDisbursement, inputHandle.idTransaksiDisbursement, selectedPaymentDisbursement.length !== 0 ? selectedPaymentDisbursement[0].value : "", selectedPartnerDisbursement.length !== 0 ? selectedPartnerDisbursement[0].value : "", inputHandle.periodeDisbursement, dateRangeDisbursement, inputHandle.partnerTransId, inputHandle.referenceNo, 0, language === null ? 'EN' : language.flagName, inputHandle.keteranganDisbursement)
        } else {
            setActivePageDisbursement(page)
            disbursementReport(currentDate, page, user_role, language === null ? 'EN' : language.flagName)
        }
    }

    function toDashboard() {
        history.push("/");
    }

    function toLaporan() {
        history.push("/riwayat-transaksi/va-dan-paylink");
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

    async function sendDataDisbursePerbaikanData(data) {
        try {
            const auth = "Bearer " + getToken()
            var formData = new FormData()
            formData.append('file_excel', data, 'perbaikan_data_disbursement.xlsx')
            formData.append('file_excel', data, 'perbaikan_data_disbursement_origin.xlsx')
            formData.append('file_ID', 3)
            const headers = {
                'Content-Type':'multipart/form-data',
                'Authorization' : auth
            }
            const perbaikanDataDisburse = await axios.post(BaseURL + "/Partner/UploadDisbursementFile", formData, {headers: headers})
            console.log(perbaikanDataDisburse, 'perbaikanDataDisburse');
            if (perbaikanDataDisburse.data.response_code === 200 && perbaikanDataDisburse.status === 200 && perbaikanDataDisburse.data.response_new_token.length === 0) {
                setShowModalKonfirmasiPerbaikanData(false)
                setIsChecklist({})
                setIsCheckedConfirm(false)
                setDataForUpload([])
                setAllNominal(0)
                setAllFee(0)
                setShowModalStatusDisburse(true)
                setResponMsg(perbaikanDataDisburse.data.response_data.status_id)
                disbursementPerbaikanData(1)
                setTimeout(() => {
                    setShowModalStatusDisburse(false)
                }, 5000);
            } else if (perbaikanDataDisburse.data.response_code === 200 && perbaikanDataDisburse.status === 200 && perbaikanDataDisburse.data.response_new_token.length !== 0) {
                setUserSession(perbaikanDataDisburse.data.response_new_token)
                setShowModalKonfirmasiPerbaikanData(false)
                setIsChecklist({})
                setIsCheckedConfirm(false)
                setDataForUpload([])
                setAllNominal(0)
                setAllFee(0)
                setShowModalStatusDisburse(true)
                setResponMsg(perbaikanDataDisburse.data.response_data.status_id)
                disbursementPerbaikanData(1)
                setTimeout(() => {
                    setShowModalStatusDisburse(false)
                }, 5000);
            }
        } catch (error) {
            console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    function batalConfirm() {
        setIsCheckedConfirm(false)
        setShowModalKonfirmasiPerbaikanData(false)
    }

    function createDataForModal(dataFromAPI, dataChecklist) {
        console.log(dataFromAPI, 'dataFromAPI');
        console.log(dataChecklist, 'dataChecklist');
        let isUncheck = 0
        delete dataChecklist.dataDiperbaikiAll
        for (const key in dataChecklist) {
            dataChecklist[key] === false && isUncheck ++
        }
        console.log(isUncheck, 'isUncheck');
        console.log(Object.keys(dataChecklist).length, 'Object.keys(dataChecklist).length');
        console.log(Object.keys(dataChecklist).length === isUncheck, 'Object.keys(dataChecklist).length === isUncheck');
        if (Object.keys(dataChecklist).length === 0 || Object.keys(dataChecklist).length === isUncheck) {
            setErrorDisbursementPerbaikanData(true)
            setTimeout(() => {
                setErrorDisbursementPerbaikanData(false)
            }, 5000);
        } else {
            setErrorDisbursementPerbaikanData(false)
            let idTrue = []
            let dataExcel = []
            let allFee = 0
            let allNominal = 0
            let allTotalNominal = 0
            for (const key in dataChecklist) {
                if (key !== "dataDiperbaikiAll" && dataChecklist[key]) {
                    idTrue.push(key.split('baiki')[1])
                }
            }
            let filteredData = dataFromAPI.filter(item => item.similarity > 50 && idTrue.includes(String(item.invalid_account_id)));
            filteredData = filteredData.map((item, id) => {
                allFee += (item.tdishburse_fee + item.tdishburse_fee_bank + item.tdishburse_fee_tax)
                allNominal += item.tdishburse_amount
                allTotalNominal += item.tdishburse_total_amount
                dataExcel.push({"bank_code": item.bank_code, "branch_name": item.branch_name, "account_number": item.acc_number, "account_name": item.nama_submit, "amount": item.tdishburse_amount, "email": item.email, "description": item.notes, "save_account_number": false, invalid_account_id: item.invalid_account_id})
                return {...item, number: id + 1}
            })
            let workSheet = XLSX.utils.json_to_sheet(dataExcel)
            let workBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            // XLSX.writeFile(workBook, "Disbursement Report.xlsx");
            const convertFile = XLSX.write(workBook, {bookType: "xlsx", type: "array"})
            var data = new Blob([new Uint8Array(convertFile)], { type: "application/octet-stream"})
            console.log(filteredData, 'filteredData');
            console.log(idTrue, 'idTrue');
            console.log(dataExcel, 'dataExcel');
            console.log(data, 'data');
            console.log(allFee, 'allFee');
            console.log(allNominal, 'allNominal');
            console.log(allTotalNominal, 'allTotalNominal');
            setDataPerbaikanModal(filteredData)
            setDataForUpload(data)
            setAllFee(allFee)
            setAllNominal(allNominal)
            setAllTotalNominal(allTotalNominal)
            setShowModalKonfirmasiPerbaikanData(true)
        }
    }

    function handleCheckPerbaikanDataAll(e, dataFromAPI) {
        console.log(e.target.name, 'e.target.name');
        console.log(e.target.checked, 'e.target.checked');
        console.log(dataFromAPI, 'dataFromAPI');
        let checkAll = {
            dataDiperbaikiAll: true
        }
        if (e.target.checked) {
            dataFromAPI.forEach(item => {
                if (item.similarity > 50) {
                    // checkAll.push({[`diperbaiki${item.invalid_account_id}`]: true})
                    checkAll[`dataDiperbaiki${item.invalid_account_id}`] = true
                }
            })
            setIsChecklist(checkAll)
        } else {
            setIsChecklist({
                dataDiperbaikiAll: false
            })
        }
        console.log(checkAll, 'checkAll');
    }

    function handleCheckPerbaikanData(e, dataIsChecklist, dataFromAPI) {
        console.log(e.target.name, 'e.target.name');
        console.log(e.target.checked, 'e.target.checked');
        if (e.target.checked) {
            let isTrue = 0
            for (const key in dataIsChecklist) {
                if (key !== "dataDiperbaikiAll" && dataIsChecklist[key]) {
                    isTrue ++
                }
            }
            const filteredDataFromAPI = dataFromAPI.filter(item => item.similarity > 50)
            console.log(isTrue, 'isTrue');
            console.log(filteredDataFromAPI, 'filteredDataFromAPI');
            if (filteredDataFromAPI.length !== (isTrue + 1)) {
                setIsChecklist({
                    ...isChecklist,
                    [e.target.name]: e.target.checked
                })
            } else {
                setIsChecklist({
                    ...isChecklist,
                    dataDiperbaikiAll: true,
                    [e.target.name]: e.target.checked
                })
            }
        } else {
            console.log('masuk false');
            // let isFalse = 0
            // for (const key in dataIsChecklist) {
            //     dataIsChecklist[key] === false && isFalse ++
            // }
            // console.log(Object.keys(dataIsChecklist).length, 'Object.keys(dataIsChecklist).length');
            // console.log(isFalse + 2, 'isFalse');
            // if (Object.keys(dataIsChecklist).length !== (isFalse + 2)) {
            //     console.log('masuk false tidak sama');
            //     setIsChecklist({
            //         ...isChecklist,
            //         [e.target.name]: e.target.checked
            //     })
            // } else {
            //     console.log('masuk false sama');
            // }
            setIsChecklist({
                ...isChecklist,
                dataDiperbaikiAll: false,
                [e.target.name]: e.target.checked
            })
        }
    }

    async function getBalanceHandle () {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getBalance = await axios.post(BaseURL + "/Partner/GetBalance", { data: "" }, { headers: headers })
            if (getBalance.data.response_code === 200 && getBalance.status === 200 && getBalance.data.response_new_token.length === 0) {
                setGetBalance(getBalance.data.response_data.balance)
                setTotalHoldBalance(getBalance.data.response_data.hold_balance)
            } else if (getBalance.data.response_code === 200 && getBalance.status === 200 && getBalance.data.response_new_token.length !== 0) {
                setUserSession(getBalance.data.response_new_token)
                setGetBalance(getBalance.data.response_data.balance)
                setTotalHoldBalance(getBalance.data.response_data.hold_balance)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function disbursementPerbaikanData(page) {
        try {
            setLoadingPerbaikanData(false)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"page": ${(page < 1) ? 1 : page}, "row_per_page": 10}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth,
            }
            const getDataPerbaikan = await axios.post(BaseURL + "/Report/DisbursementInvalidAccountList", {data: dataParams}, {headers: headers})
            console.log(getDataPerbaikan, 'getDataPerbaikan');
            // console.log(getDataPerbaikan1, 'getDataPerbaikan1');
            if (getDataPerbaikan.status === 200 && getDataPerbaikan.data.response_code === 200 && getDataPerbaikan.data.response_new_token === null) {
                getDataPerbaikan.data.response_data.results.list_invalid_data = getDataPerbaikan.data.response_data.results.list_invalid_data.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPerbaikanDataDisbursement(getDataPerbaikan.data.response_data.results)
                setLoadingPerbaikanData(false)
            } else if (getDataPerbaikan.status === 200 && getDataPerbaikan.data.response_code === 200 && getDataPerbaikan.data.response_new_token !== null) {
                setUserSession(getDataPerbaikan.data.response_new_token)
                getDataPerbaikan.data.response_data.results.list_invalid_data = getDataPerbaikan.data.response_data.results.list_invalid_data.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPerbaikanDataDisbursement(getDataPerbaikan.data.response_data.results)
                setLoadingPerbaikanData(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function exportDisbursementPerbaikanData(page) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"page": ${(page < 1) ? 1 : page}, "row_per_page": 10}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth,
            }
            const getDataPerbaikan = await axios.post(BaseURL + "/Report/DisbursementInvalidAccountList", {data: dataParams}, {headers: headers})
            console.log(getDataPerbaikan, 'getDataPerbaikan');
            // console.log(getDataPerbaikan1, 'getDataPerbaikan1');
            if (getDataPerbaikan.status === 200 && getDataPerbaikan.data.response_code === 200 && getDataPerbaikan.data.response_new_token === null) {
                const data = getDataPerbaikan.data.response_data.results.list_invalid_data
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ No: i + 1, "File Referensi": data[i].file_referensi.length !== 0 ? data[i].file_referensi : "-", "Nama disubmit": data[i].nama_submit, "Nama di Bank": data[i].nama_dibank, "% Kecocokan Nama": data[i].similarity, "Tujuan Transfer": data[i].bank_name, "No. Rekening": data[i].acc_number })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Data Perbaikan Disbursement.xlsx");
            } else if (getDataPerbaikan.status === 200 && getDataPerbaikan.data.response_code === 200 && getDataPerbaikan.data.response_new_token !== null) {
                setUserSession(getDataPerbaikan.data.response_new_token)
                const data = getDataPerbaikan.data.response_data.results.list_data
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ No: i + 1, "File Referensi": data[i].file_referensi.length !== 0 ? data[i].file_referensi : "-", "Nama disubmit": data[i].nama_submit, "Nama di Bank": data[i].nama_dibank, "% Kecocokan Nama": data[i].similarity, "Tujuan Transfer": data[i].bank_name, "No. Rekening": data[i].acc_number })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Data Perbaikan Disbursement.xlsx");
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

    async function disbursementReport(dateNow, currentPage, userRole, lang) {
        try {
            if (userRole !== "102") {
                const auth = 'Bearer ' + getToken();
                const dataParams = encryptData(`{"statusID": [1,2,4,19], "transID" : "", "sub_partner_id":"", "date_from": "${dateNow}", "date_to": "${dateNow}", "partner_trans_id":"", "payment_code":"", "reference_no": "", "keterangan": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': auth,
                    'Accept-Language' : "ID",
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
                const dataParams = encryptData(`{"statusID": [1,2,4,19], "transID" : "", "date_from": "${dateNow}", "date_to": "${dateNow}", "partner_trans_id":"", "payment_code":"", "reference_no": "", "keterangan": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': auth,
                    'Accept-Language' : lang,
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

    async function filterDisbursement(user_role, page, statusId, transId, paymentCode, partnerId, dateRange, periode, partnerTransId, reffNo, rowPerPage, lang, keterangan) {
        try {
            setPendingDisbursement(true)
            setIsFilterDisbursement(true)
            setActivePageDisbursement(page)
            const auth = 'Bearer ' + getToken();
            const dataParamsAdmin = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,4,19]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "payment_code":"${(paymentCode.length !== 0) ? paymentCode : ""}", "sub_partner_id":"${(partnerId.length !== 0) ? partnerId : ""}", "date_from": "${(dateRange.length !== 0) ? (typeof(dateRange) === 'object' ? dateRange[0] : periode[0]) : ""}", "date_to": "${(dateRange.length !== 0) ? (typeof(dateRange) === 'object' ? dateRange[1] : periode[1]) : ""}", "partner_trans_id":"${partnerTransId}", "reference_no": "${reffNo}", "keterangan": "${keterangan}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const dataParamsPertner = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,4,19]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "payment_code":"${(paymentCode.length !== 0) ? paymentCode : ""}", "date_from": "${(dateRange.length !== 0) ? (typeof(dateRange) === 'object' ? dateRange[0] : periode[0]) : ""}", "date_to": "${(dateRange.length !== 0) ? (typeof(dateRange) === 'object' ? dateRange[1] : periode[1]) : ""}", "partner_trans_id":"${partnerTransId}", "reference_no": "${reffNo}", "keterangan": "${keterangan}", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept-Language' : user_role === "102" ? lang : "ID",
            }
            const filterDisbursement = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: user_role !== "102" ? dataParamsAdmin : dataParamsPertner}, { headers: headers });
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
            referenceNo: "",
            keteranganDisbursement: ""
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
            listDisburseChannelHandler()
        }
        disbursementReport(currentDate, activePageDisbursement, user_role, language === null ? 'EN' : language.flagName)
        // disbursementPerbaikanData(1)
        // getBalanceHandle()
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
            name: 'Keterangan',
            selector: row => (row.tdishburse_message === null || row.tdishburse_message.length === 0) ? "-" : row.tdishburse_message,
            // sortable: true,
            wrap: true,
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
                    when: row => row.tdishburse_status_id === 1 || row.tdishburse_status_id === 7 || row.tdishburse_status_id === 19,
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
            name: language === null ? eng.no : language.no,
            selector: row => row.number,
            maxWidth: 'fit-content !important'
        },
        {
            name: language === null ? eng.idTransaksi : language.idTransaksi,
            selector: row => row.tdishburse_code,
            // sortable: true
            wrap: true,
            width: "200px",
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}`}>{row.tvasettl_code}</Link>
        },
        {
            name: language === null ? eng.waktu : language.waktu,
            selector: row => convertSimpleTimeStamp(row.tdishburse_crtdt),
            wrap: true,
            width: "165px",
            // sortable: true,
        },
        {
            name: language === null ? eng.partnerTransId : language.partnerTransId,
            selector: row => row.partner_trans_id,
            wrap: true,
            width: "170px",
            // sortable: true,
        },
        {
            name: language === null ? eng.nominalDisburse : language.nominalDisburse,
            selector: row => convertToRupiah(row.tdishburse_amount),
            // sortable: true,
            width: language === null ? "205px" : language.flagName === "CN" ? "100px" : "205px",
            style: { display: "flex", justifyContent: "flex-end", }
        },
        {
            name: language === null ? eng.totalDisburse : language.totalDisburse,
            selector: row => convertToRupiah(row.tdishburse_total_amount),
            // sortable: true,
            width: language === null ? "180px" : language.flagName === "CN" ? "100px" : "180px",
            style: { display: "flex", justifyContent: "flex-end", }
        },
        {
            name: language === null ? eng.tujuanDisburse : language.tujuanDisburse,
            selector: row => row.payment_type,
            // sortable: true,
            width: "224px",
        },
        {
            name: language === null ? eng.cabang : language.cabang,
            selector: row => (row.branch_name === null || row.branch_name.length === 0) ? "-" : row.branch_name,
            // sortable: true,
            width: "170px",
        },
        {
            name: language === null ? eng.nomorRekTujuan : language.nomorRekTujuan,
            selector: row => row.tdishburse_acc_num,
            // sortable: true,
            width: language === null ? "224px" : language.flagName === "ID" ? "224px" : "250px",
        },
        {
            name: language === null ? eng.namaPemilikRek : language.namaPemilikRek,
            selector: row => row.tdishburse_acc_name,
            // sortable: true,
            width: language === null ? "224px" : language.flagName === "ID" ? "224px" : "250px",
        },
        {
            name: language === null ? eng.catatan : language.catatan,
            selector: row => (row.notes === null || row.notes.length === 0) ? "-" : row.notes,
            // sortable: true,
            width: "224px",
        },
        {
            name: language === null ? eng.status : language.status,
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
                    when: row => row.tdishburse_status_id === 1 || row.tdishburse_status_id === 7 || row.tdishburse_status_id === 19,
                    style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
                },
                {
                    when: row => row.tdishburse_status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
                },
                {
                    when: row => row.tdishburse_status_id === 3 || row.tdishburse_status_id === 5 || row.tdishburse_status_id === 6 || row.tdishburse_status_id === 8 || row.tdishburse_status_id === 9 || row.tdishburse_status_id === 10 || row.tdishburse_status_id === 11 || row.tdishburse_status_id === 12 || row.tdishburse_status_id === 13 || row.tdishburse_status_id === 14 || row.tdishburse_status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" } //tdishburse_message
                }
            ],
        },
        {
            name: 'Keterangan',
            selector: row => row.tdishburse_message.length === 0 ? "-" : row.tdishburse_message,
            // sortable: true,
            width: "280px",
        },
    ];

    const columnsDisbursementPerbaikan = [
        {
            name: 'No',
            selector: row => row.number,
            width: "5%",
            maxWidth: 'fit-content !important'
        },
        {
            name: 'File Referensi',
            selector: row => row.file_referensi !== null ? row.file_referensi : "-",
            // sortable: true
            width: "300px",
            wrap: true
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}`}>{row.tvasettl_code}</Link>
        },
        {
            name: 'Nama disubmit',
            selector: row => row.nama_submit,
            width: "150px",
            // sortable: true,
        },
        {
            name: 'Nama di Bank',
            selector: row => row.nama_dibank,
            width: "200px",
            // sortable: true,
        },
        {
            name: '% Kecocokan Nama',
            selector: row => `${row.similarity} %`,
            width: "224px",
            wrap: true,
            // style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
            // sortable: true,
        },
        {
            name: 'Tujuan Transfer',
            selector: row => row.bank_name,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'No. Rekening',
            selector: row => row.acc_number,
            // sortable: true,
            width: "224px",
            // style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Diperbaiki',
            selector: row => row.diperbaiki,
            width: "140px",
            cell: (row) =>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox1"
                        name={'dataDiperbaiki' + row.invalid_account_id}
                        value={row.invalid_account_id}
                        checked={isChecklist[`dataDiperbaiki${row.invalid_account_id}`] !== undefined ? isChecklist[`dataDiperbaiki${row.invalid_account_id}`] : false}
                        onChange={(e) => handleCheckPerbaikanData(e, isChecklist, perbaikanDataDisbursement.list_invalid_data)}
                        disabled={row.similarity < 50}
                    />
                </div>,
            // sortable: true,
        },
    ];

    const columnsDisbursementPerbaikanModal = [
        {
            name: 'No',
            selector: row => row.number,
            width: "5%",
            maxWidth: 'fit-content !important'
        },
        {
            name: 'File Referensi',
            selector: row => row.file_referensi !== null ? row.file_referensi : "-",
            // sortable: true
            width: "300px",
            wrap: true
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}`}>{row.tvasettl_code}</Link>
        },
        {
            name: 'Nama disubmit',
            selector: row => row.nama_submit,
            width: "150px",
            // sortable: true,
        },
        {
            name: 'Nama di Bank',
            selector: row => row.nama_dibank,
            width: "200px",
            // sortable: true,
        },
        {
            name: '% Kecocokan Nama',
            selector: row => `${row.similarity} %`,
            width: "224px",
            wrap: true,
            // style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
            // sortable: true,
        },
        {
            name: 'Tujuan Transfer',
            selector: row => row.bank_name,
            // sortable: true,
            width: "224px",
        },
        {
            name: 'No. Rekening',
            selector: row => row.acc_number,
            // sortable: true,
            width: "224px",
            // style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
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

    const customStylesDisbursementPerbaikan = {
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
    };

    function ExportReportDisbursementHandler(isFilter, userRole, statusId, paymentCode, transId, partnerId, dateRange, periode, partnerTransId, referenceNo, keterangan, lang) {
        // console.log(partnerTransId, 'partnerTransId');
        // console.log(dateRange, 'dateRange');
        console.log('masuk export disbursement');
        if (isFilter === true && userRole === "102") {
            async function dataExportFilter(statusId, transId, paymentCode, keterangan, dateRange, periode, partnerTransId) {
                try {
                    console.log("partner export filter");
                    // console.log(dateRange, 'dateRange 2');
                    // console.log(partnerTransId, "partner trans filter");
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,4,19]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "date_from": "${(dateRange.length !== 0) ? (typeof(dateRange) === 'object' ? dateRange[0] : periode[0]) : ""}", "date_to": "${(dateRange.length !== 0) ? (typeof(dateRange) === 'object' ? dateRange[1] : periode[1]) : ""}", "partner_trans_id":"${partnerTransId === undefined ? "" : partnerTransId}", "payment_code":"${(paymentCode.length !== 0) ? paymentCode : ""}", "reference_no": "", "keterangan": "${keterangan}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth,
                        'Accept-Language' : lang,
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    // console.log(dataExportFilter, 'dataExportFilter');
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].tdishburse_code, [language === null ? eng.waktu : language.waktu]: convertSimpleTimeStamp(data[i].tdishburse_crtdt), [language === null ? eng.partnerTransId : language.partnerTransId]: data[i].partner_trans_id, [language === null ? eng.nominalDisburse : language.nominalDisburse]: data[i].tdishburse_amount, [language === null ? eng.totalDisburse : language.totalDisburse]: data[i].tdishburse_total_amount, [language === null ? eng.tujuanDisburse : language.tujuanDisburse]: data[i].payment_type, [language === null ? eng.cabang : language.cabang]: data[i].branch_name === null ? "-" : data[i].branch_name, [language === null ? eng.nomorRekTujuan : language.nomorRekTujuan]: data[i].tdishburse_acc_num, [language === null ? eng.namaPemilikRek : language.namaPemilikRek]: data[i].tdishburse_acc_name, [language === null ? eng.catatan : language.catatan]: data[i].notes === null ? "-" : data[i].notes, [language === null ? eng.status : language.status]: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.laporanDisbursementExcel : language.laporanDisbursementExcel}.xlsx`);
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token !== null) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].tdishburse_code, [language === null ? eng.waktu : language.waktu]: convertSimpleTimeStamp(data[i].tdishburse_crtdt), [language === null ? eng.partnerTransId : language.partnerTransId]: data[i].partner_trans_id, [language === null ? eng.nominalDisburse : language.nominalDisburse]: data[i].tdishburse_amount, [language === null ? eng.totalDisburse : language.totalDisburse]: data[i].tdishburse_total_amount, [language === null ? eng.tujuanDisburse : language.tujuanDisburse]: data[i].payment_type, [language === null ? eng.cabang : language.cabang]: data[i].branch_name === null ? "-" : data[i].branch_name, [language === null ? eng.nomorRekTujuan : language.nomorRekTujuan]: data[i].tdishburse_acc_num, [language === null ? eng.namaPemilikRek : language.namaPemilikRek]: data[i].tdishburse_acc_name, [language === null ? eng.catatan : language.catatan]: data[i].notes === null ? "-" : data[i].notes, [language === null ? eng.status : language.status]: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.laporanDisbursementExcel : language.laporanDisbursementExcel}.xlsx`);
                    }
                } catch (error) {
                    // console.log(error)
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(statusId, transId, paymentCode, keterangan, dateRange, periode, partnerTransId)
        } else if (isFilter === true && userRole !== "102") {
            async function dataExportFilter(statusId, transId, paymentCode, partnerId, dateRange, periode, partnerTransId, referenceNo, keterangan) {
                try {
                    // console.log(partnerTransId, "partner trans filter");
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [${(statusId.length !== 0) ? statusId : [1,2,4,19]}], "transID" : "${(transId.length !== 0) ? transId : ""}", "payment_code":"${(paymentCode.length !== 0) ? paymentCode : ""}", "sub_partner_id":"${(partnerId.length !== 0) ? partnerId : ""}", "date_from": "${(dateRange.length !== 0) ? (typeof(dateRange) === 'object' ? dateRange[0] : periode[0]) : ""}", "date_to": "${(dateRange.length !== 0) ? (typeof(dateRange) === 'object' ? dateRange[1] : periode[1]) : ""}", "partner_trans_id":"${partnerTransId}", reference_no: "${referenceNo}", "keterangan": "${keterangan}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth,
                        'Accept-Language' : "ID",
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ "No": i + 1, "ID Transaksi": data[i].tdishburse_code, "Waktu": convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nominal Disbursement": data[i].tdishburse_amount, "Fee Disbursement": data[i].tdishburse_fee, "Fee Tax": data[i].tdishburse_fee_tax, "Fee Bank": data[i].tdishburse_fee_bank, "Total Disbursement": data[i].tdishburse_total_amount, "Tujuan Disbursement": data[i].payment_type, Cabang: data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, Catatan: data[i].notes === null ? "-" : data[i].notes, "Reference No": data[i].reference_no === "" ? "-" : data[i].reference_no, Keterangan: data[i].tdishburse_message === null || data[i].tdishburse_message.length === 0 ? "-" : data[i].tdishburse_message, "Status": data[i].mstatus_name_ind })
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
                            dataExcel.push({ "No": i + 1, "ID Transaksi": data[i].tdishburse_code, "Waktu": convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nominal Disbursement": data[i].tdishburse_amount, "Fee Disbursement": data[i].tdishburse_fee, "Fee Tax": data[i].tdishburse_fee_tax, "Fee Bank": data[i].tdishburse_fee_bank, "Total Disbursement": data[i].tdishburse_total_amount, "Tujuan Disbursement": data[i].payment_type, Cabang: data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, Catatan: data[i].notes === null ? "-" : data[i].notes, "Reference No": data[i].reference_no === "" ? "-" : data[i].reference_no, Keterangan: data[i].tdishburse_message === null || data[i].tdishburse_message.length === 0 ? "-" : data[i].tdishburse_message, "Status": data[i].mstatus_name_ind })
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
            dataExportFilter(statusId, transId, paymentCode, partnerId, dateRange, periode, partnerTransId, referenceNo, keterangan)
        } else if (isFilter === false && userRole === "102") {
            async function dataExportDisbursement() {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"statusID": [1,2,4,19], "transID" : "", "payment_code": "", "date_from": "${currentDate}", "date_to": "${currentDate}", "partner_trans_id":"", "reference_no":"", "keterangan": "", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth,
                        'Accept-Language' : lang,
                    }
                    const dataExportDisbursement = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    if (dataExportDisbursement.status === 200 && dataExportDisbursement.data.response_code === 200 && dataExportDisbursement.data.response_new_token === null) {
                        const data = dataExportDisbursement.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].tdishburse_code, [language === null ? eng.waktu : language.waktu]: convertSimpleTimeStamp(data[i].tdishburse_crtdt), [language === null ? eng.partnerTransId : language.partnerTransId]: data[i].partner_trans_id, [language === null ? eng.nominalDisburse : language.nominalDisburse]: data[i].tdishburse_amount, [language === null ? eng.totalDisburse : language.totalDisburse]: data[i].tdishburse_total_amount, [language === null ? eng.tujuanDisburse : language.tujuanDisburse]: data[i].payment_type, [language === null ? eng.cabang : language.cabang]: data[i].branch_name === null ? "-" : data[i].branch_name, [language === null ? eng.nomorRekTujuan : language.nomorRekTujuan]: data[i].tdishburse_acc_num, [language === null ? eng.namaPemilikRek : language.namaPemilikRek]: data[i].tdishburse_acc_name, [language === null ? eng.catatan : language.catatan]: data[i].notes === null ? "-" : data[i].notes, [language === null ? eng.status : language.status]: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.laporanDisbursementExcel : language.laporanDisbursementExcel}.xlsx`);
                    } else if (dataExportDisbursement.status === 200 && dataExportDisbursement.data.response_code === 200 && dataExportDisbursement.data.response_new_token !== null) {
                        setUserSession(dataExportDisbursement.data.response_new_token)
                        const data = dataExportDisbursement.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].tdishburse_code, [language === null ? eng.waktu : language.waktu]: convertSimpleTimeStamp(data[i].tdishburse_crtdt), [language === null ? eng.partnerTransId : language.partnerTransId]: data[i].partner_trans_id, [language === null ? eng.nominalDisburse : language.nominalDisburse]: data[i].tdishburse_amount, [language === null ? eng.totalDisburse : language.totalDisburse]: data[i].tdishburse_total_amount, [language === null ? eng.tujuanDisburse : language.tujuanDisburse]: data[i].payment_type, [language === null ? eng.cabang : language.cabang]: data[i].branch_name === null ? "-" : data[i].branch_name, [language === null ? eng.nomorRekTujuan : language.nomorRekTujuan]: data[i].tdishburse_acc_num, [language === null ? eng.namaPemilikRek : language.namaPemilikRek]: data[i].tdishburse_acc_name, [language === null ? eng.catatan : language.catatan]: data[i].notes === null ? "-" : data[i].notes, [language === null ? eng.status : language.status]: data[i].mstatus_name_ind })
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.laporanDisbursementExcel : language.laporanDisbursementExcel}.xlsx`);
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
                    const dataParams = encryptData(`{"statusID": [1,2,4,19], "transID" : "", "sub_partner_id":"", "payment_code": "", "date_from": "${currentDate}", "date_to": "${currentDate}", "partner_trans_id":"", "reference_no":"", "keterangan": "", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth,
                        'Accept-Language' : "ID",
                    }
                    const dataExportDisbursement = await axios.post(BaseURL + "/Report/GetDisbursementList", {data: dataParams}, { headers: headers });
                    if (dataExportDisbursement.status === 200 && dataExportDisbursement.data.response_code === 200 && dataExportDisbursement.data.response_new_token === null) {
                        const data = dataExportDisbursement.data.response_data.results
                        let dataExcel = []
                        for (let i = 0; i < data.length; i++) {
                            dataExcel.push({ "No": i + 1, "ID Transaksi": data[i].tdishburse_code, "Waktu": convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nominal Disbursement": data[i].tdishburse_amount, "Fee Disbursement": data[i].tdishburse_fee, "Fee Tax": data[i].tdishburse_fee_tax, "Fee Bank": data[i].tdishburse_fee_bank, "Total Disbursement": data[i].tdishburse_total_amount, "Tujuan Disbursement": data[i].payment_type, Cabang: data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, Catatan: data[i].notes === null ? "-" : data[i].notes, "Reference No": data[i].reference_no === "" ? "-" : data[i].reference_no, Keterangan: data[i].tdishburse_message === null || data[i].tdishburse_message.length === 0 ? "-" : data[i].tdishburse_message, "Status": data[i].mstatus_name_ind })
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
                            dataExcel.push({ "No": i + 1, "ID Transaksi": data[i].tdishburse_code, "Waktu": convertSimpleTimeStamp(data[i].tdishburse_crtdt), "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nominal Disbursement": data[i].tdishburse_amount, "Fee Disbursement": data[i].tdishburse_fee, "Fee Tax": data[i].tdishburse_fee_tax, "Fee Bank": data[i].tdishburse_fee_bank, "Total Disbursement": data[i].tdishburse_total_amount, "Tujuan Disbursement": data[i].payment_type, Cabang: data[i].branch_name === null ? "-" : data[i].branch_name, "Nomor Rekening Tujuan": data[i].tdishburse_acc_num, "Nama Pemilik Rekening": data[i].tdishburse_acc_name, Catatan: data[i].notes === null ? "-" : data[i].notes, "Reference No": data[i].reference_no === "" ? "-" : data[i].reference_no, Keterangan: data[i].tdishburse_message === null || data[i].tdishburse_message.length === 0 ? "-" : data[i].tdishburse_message, "Status": data[i].mstatus_name_ind })
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

    function pindahHalaman(params) {
        setIsChecklist({})
        resetButtonHandle()
        if (params === "riwayat") {
            disbursementReport(currentDate, activePageDisbursement, user_role, language === null ? 'EN' : language.flagName)
            disbursementTabs(true)
        } else {
            disbursementPerbaikanData(1)
            getBalanceHandle()
            disbursementTabs(false)
        }
    }

    function disbursementTabs(isTabs){
        setIsDisbursementReportTabs(isTabs)
        if(!isTabs){
            $('#detailakuntab').removeClass('menu-detail-akun-hr-active')
            $('#detailakunspan').removeClass('menu-detail-akun-span-active')
            $('#konfigurasitab').addClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').addClass('menu-detail-akun-span-active')
        }else{
            $('#konfigurasitab').removeClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').removeClass('menu-detail-akun-span-active')
            $('#detailakuntab').addClass('menu-detail-akun-hr-active')
            $('#detailakunspan').addClass('menu-detail-akun-span-active')
        }
    }

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
        </div>
    );

    return (
        <div className="main-content mt-5" style={{ padding: "37px 27px" }}>
            {
                showModalStatusDisburse && (responMsg !== 0 && responMsg === 2) &&
                <div style={{ position: "fixed", zIndex: 999, width: "80%" }} className="d-flex justify-content-center align-items-center mt-4 ms-5">
                    <Toast style={{ width: "900px", backgroundColor: "#077E86" }} position="bottom-center" className="text-center">
                        <Toast.Body className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Disbursement Berhasil.</Toast.Body>
                    </Toast>
                </div>
            }
            {
                errorDisbursementPerbaikanData &&
                <div style={{ position: "fixed", zIndex: 999, width: "80%" }} className="d-flex justify-content-center align-items-center mt-4 ms-5">
                    <Toast style={{ width: "900px", backgroundColor: "#B9121B" }} position="bottom-center" className="text-center">
                        <Toast.Body className="text-center text-white"><span className="mx-2"><img src={ChecklistError} alt="checklist" /></span>Wajib Pilih Data Disbursement</Toast.Body>
                    </Toast>
                </div>
            }
            <span className='breadcrumbs-span'>{(user_role === "102") ? <><span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> {language === null ? eng.laporan : language.laporan}</span>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;{language === null ? eng.disbursement : language.disbursement}</> : <><span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda</span>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Disbursement Report</>}</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>{(user_role === "102") ? (language === null ? eng.laporanDisbursementExcel : language.laporanDisbursementExcel) : "Disbursement Report"}</h2>
            </div>
            <div className='main-content'>
                <div className='mt-2'>
                    {
                        (user_role !== "102") ?
                        <span className='mt-4' style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600}}>{"Disbursement Report"}</span> :
                        <>
                            <div className='detail-akun-menu mt-4' style={{display: 'flex', height: 33}}>
                                <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => pindahHalaman("riwayat")} id="detailakuntab">
                                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">{(language === null ? eng.riwayatDisburse : language.riwayatDisburse)}</span>
                                </div>
                                <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("perbaikan")} id="konfigurasitab">
                                    <span className='menu-detail-akun-span' id="konfigurasispan">{"Perbaikan Data"}</span>
                                </div>
                            </div>
                            <hr className="hr-style" style={{ marginTop: -2 }} />
                        </>
                    }
                    {
                        isDisbursementReportTabs ?
                            <div className='base-content mt-3'>
                                <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>{user_role !== "102" ? "Filter" : (language === null ? eng.filter : language.filter)}</span>
                                {
                                    user_role !== "102" ?
                                    <>
                                        <Row className='mt-4'>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                                <span>ID Transaksi</span>
                                                <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiDisbursement} name="idTransaksiDisbursement" type='text'className='input-text-report' placeholder='Masukkan ID Transaksi'/>
                                            </Col>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                                <span className='me-4'>Nama Partner</span>
                                                <div className="dropdown dropDisbursePartner" style={{ width: "12rem" }}>
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
                                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                                <span className='me-5'>Status</span>
                                                <Form.Select name="statusDisbursement" className='input-text-ez' style={{ display: "inline" }} value={inputHandle.statusDisbursement} onChange={(e) => handleChange(e)}>
                                                    <option defaultChecked disabled value="">Pilih Status</option>
                                                    <option value={2}>Berhasil</option>
                                                    <option value={1}>Dalam Proses</option>
                                                    <option value={19}>Diproses Bank</option>
                                                    <option value={4}>Gagal</option>
                                                    {/* <option value={9}>Kadaluwarsa</option> */}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                        <Row className='mt-4'>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center" style={{  width: (showDateDisbursement === "none") ? "33.2%" : "33.2%" }}>
                                                <span style={{ marginRight: 26 }}>Periode <span style={{ color: "red" }}>*</span></span>
                                                <Form.Select name='periodeDisbursement' className="input-text-ez" value={inputHandle.periodeDisbursement} onChange={(e) => handleChangePeriodeDisbursement(e)}>
                                                    <option defaultChecked disabled value={0}>Pilih Periode</option>
                                                    <option value={([`${currentDate}`, `${currentDate}`])}>Hari Ini</option>
                                                    <option value={([`${yesterdayDate}`, `${yesterdayDate}`])}>Kemarin</option>
                                                    <option value={([`${sevenDaysAgo}`, `${yesterdayDate}`])}>7 Hari Terakhir</option>
                                                    <option value={([`${firstDayThisMonth}`, `${lastDayThisMonth}`])}>Bulan Ini</option>
                                                    <option value={([`${firstDayLastMonth}`, `${lastDayLastMonth}`])}>Bulan Kemarin</option>
                                                    <option value={7}>Pilih Range Tanggal</option>
                                                </Form.Select>
                                            </Col>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                                <span>Partner Trans ID</span>
                                                <input onChange={(e) => handleChange(e)} value={inputHandle.partnerTransId} name="partnerTransId" type='text'className='input-text-report ms-2' placeholder='Masukkan Partner Trans ID'/>
                                            </Col>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: "33%"}}>
                                                <span>Tipe Pembayaran</span>
                                                <div className="dropdown dropDisbursePartner ms-3" style={{ width: "12rem" }}>
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
                                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                                <span>Reference No</span>
                                                <input onChange={(e) => handleChange(e)} value={inputHandle.referenceNo} name="referenceNo" type='text'className='input-text-report' placeholder='Masukkan Reference No'/>
                                            </Col>
                                        </Row>
                                    </> :
                                    <>
                                        <Row className='mt-4'>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                                <span className={language !== null ? (language.flagName === "CN" ? 'me-5' : 'me-4') : 'me-4'}>{language === null ? eng.idTransaksi : language.idTransaksi}</span>
                                                <input onChange={(e) => handleChange(e)} value={inputHandle.idTransaksiDisbursement} name="idTransaksiDisbursement" type='text'className={language !== null ? (language.flagName === "CN" ? 'input-text-report ms-5' : 'input-text-report ') : 'input-text-report '} placeholder={language === null ? eng.placeholderIdTrans : language.placeholderIdTrans}/>
                                            </Col>
                                            <Col xs={4} className='d-flex justify-content-between align-items-center'>
                                                <span style={{ marginLeft: 7 }}>{language === null ? eng.partnerTransId : language.partnerTransId}</span>
                                                <input onChange={(e) => handleChange(e)} value={inputHandle.partnerTransId} name="partnerTransId" type='text'className='input-text-report' placeholder={language === null ? eng.placeholderPartnerTransId : language.placeholderPartnerTransId}/>
                                            </Col>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: "30%"}}>
                                                <span>{language === null ? eng.status : language.status}</span>
                                                <Form.Select name="statusDisbursement" className='input-text-ez me-4' style={{ display: "inline" }} value={inputHandle.statusDisbursement} onChange={(e) => handleChange(e)}>
                                                    <option defaultChecked disabled value="">{language === null ? eng.placeholderStatus : language.placeholderStatus}</option>
                                                    <option value={2}>{language === null ? eng.berhasil : language.berhasil}</option>
                                                    <option value={1}>{language === null ? eng.dalamProses : language.dalamProses}</option>
                                                    <option value={19}>{language === null ? eng.diprosesBank : language.diprosesBank}</option>
                                                    <option value={4}>{language === null ? eng.gagal : language.gagal}</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                        <Row className='mt-3'>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center" style={{  width: "34%" }}>
                                                <span style={{ marginRight: 26 }}>{language === null ? eng.periode : language.periode} <span style={{ color: "red" }}>*</span></span>
                                                <Form.Select name='periodeDisbursement' className="input-text-ez me-2" value={inputHandle.periodeDisbursement} onChange={(e) => handleChangePeriodeDisbursement(e)}>
                                                    <option defaultChecked disabled value={0}>{language === null ? eng.pilihPeriode : language.pilihPeriode}</option>
                                                    <option value={([`${currentDate}`, `${currentDate}`])}>{language === null ? eng.hariIni : language.hariIni}</option>
                                                    <option value={([`${yesterdayDate}`, `${yesterdayDate}`])}>{language === null ? eng.kemarin : language.kemarin}</option>
                                                    <option value={([`${sevenDaysAgo}`, `${yesterdayDate}`])}>{language === null ? eng.tujuhHariTerakhir : language.tujuhHariTerakhir}</option>
                                                    <option value={([`${firstDayThisMonth}`, `${lastDayThisMonth}`])}>{language === null ? eng.bulanIni : language.bulanIni}</option>
                                                    <option value={([`${firstDayLastMonth}`, `${lastDayLastMonth}`])}>{language === null ? eng.bulanKemarin : language.bulanKemarin}</option>
                                                    <option value={7}>{language === null ? eng.pilihRangeTanggal : language.pilihRangeTanggal}</option>
                                                </Form.Select>
                                            </Col>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center" style={{  width: "34%" }}>
                                                <span>Keterangan</span>
                                                <Form.Select name='keteranganDisbursement' className="input-text-ez" style={{ marginRight: 20 }} value={inputHandle.keteranganDisbursement} onChange={(e) => handleChange(e)}>
                                                    <option defaultChecked disabled value={""}>Pilih Keterangan</option>
                                                    <option value={"Kesalahan Nomor Rekening"}>Kesalahan Nomor Rekening</option>
                                                    <option value={"Kesalahan Nama Pemilik Rekening"}>Kesalahan Nama Pemilik Rekening</option>
                                                    <option value={"Transaksi Refund"}>Transaksi Refund</option>
                                                    <option value={"Kesalahan Pihak Ketiga"}>Kesalahan Pihak Ketiga</option>
                                                    <option value={"Nominal Tidak Sesuai"}>Nominal Tidak Sesuai</option>
                                                    <option value={"Berhasil"}>Berhasil</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={4} className="d-flex justify-content-end align-items-center" >
                                                <div style={{ display: showDateDisbursement}} className='mt-3'>
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
                                            <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                <button
                                                    onClick={() => filterDisbursement(user_role, 1, inputHandle.statusDisbursement, inputHandle.idTransaksiDisbursement, selectedPaymentDisbursement.length !== 0 ? selectedPaymentDisbursement[0].value : "", selectedPartnerDisbursement.length !== 0 ? selectedPartnerDisbursement[0].value : "", inputHandle.periodeDisbursement, dateRangeDisbursement, inputHandle.partnerTransId, inputHandle.referenceNo, 0, language === null ? 'EN' : language.flagName, inputHandle.keteranganDisbursement)}
                                                    className={(inputHandle.periodeDisbursement || dateRangeDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.idTransaksiDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.statusDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.referenceNo.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                                    disabled={inputHandle.periodeDisbursement === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.idTransaksiDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.statusDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.referenceNo.length === 0}
                                                >
                                                    {user_role !== "102" ? "Terapkan" : (language === null ? eng.terapkan : language.terapkan)}
                                                </button>
                                            </Col>
                                            <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                <button
                                                    onClick={() => resetButtonHandle()}
                                                    className={(inputHandle.periodeDisbursement || dateRangeDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.idTransaksiDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.statusDisbursement.length !== 0 || dateRangeDisbursement.length !== 0 && inputHandle.referenceNo.length !== 0) ? "btn-reset" : "btn-ez-reset"}
                                                    disabled={inputHandle.periodeDisbursement === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.idTransaksiDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.statusDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.referenceNo.length === 0}
                                                >
                                                    {user_role !== "102" ? "Atur Ulang" : (language === null ? eng.aturUlang : language.aturUlang)}
                                                </button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {
                                    user_role === "102" ? (
                                        <div className='d-flex justify-content-start align-items-center mt-3 mb-2' style={{ color: '#383838', padding: '12px 12px 12px 12px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'normal', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }}>
                                            <img src={noteInfo} width="25" height="25" alt="circle_info" />
                                            <div className='ms-2'>{
                                                (language === null || language.flagName === "EN") ? <>Your Disbursement transaction status will be updated every <b>20 minutes</b>. Please check this page periodically for transaction status updates.</> :
                                                language.flagName === "ID" ? <>Status transaksi Disbursement Anda akan diperbaharui setiap <b>20 menit</b> sekali. Harap periksa laman ini secara berkala untuk pembaharuan status transaksi.</> :
                                                <>您的付款交易状态将每 <b>20</b> 分钟更新一次。 请定期查看此页面以获取交易状态更新。</>
                                            }</div>
                                        </div>
                                    ) : ""
                                }
                                {
                                    dataDisbursement.length !== 0 &&
                                    <div style={{ marginBottom: 30 }}>
                                        <Link to={"#"} onClick={() => ExportReportDisbursementHandler(isFilterDisbursement, user_role, inputHandle.statusDisbursement, selectedPaymentDisbursement.length !== 0 ? selectedPaymentDisbursement[0].value : "", inputHandle.idTransaksiDisbursement, selectedPartnerDisbursement.length !== 0 ? selectedPartnerDisbursement[0].value : "", inputHandle.periodeDisbursement, dateRangeDisbursement, inputHandle.partnerTransId, inputHandle.referenceNo, inputHandle.keteranganDisbursement, language === null ? 'EN' : language.flagName)} className="export-span">{user_role !== "102" ? "Ekspor" : (language === null ? eng.export : language.export)}</Link>
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
                                        noDataComponent={<div style={{ marginBottom: 10 }}>{user_role !== "102" ? "Tidak ada data" : (language === null ? eng.tidakAdaData : language.tidakAdaData)}</div>}
                                        // pagination
                                    />
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>{user_role !== "102" ? "Total Halaman" : (language === null ? eng.totalHalaman : language.totalHalaman)} : {totalPageDisbursement}</div>
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
                        :
                        <div className='base-content mt-3 py-5'>
                            <div style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }} className='d-flex justify-content-start align-items-center'>
                                <div style={{ marginTop: -40 }}>
                                    <img src={noteInfo} width="25" height="25" alt="circle_info" style={{ marginRight: 20 }} />
                                </div>
                                <Row>
                                    <div>
                                        <span>&#x2022; Daftar disbursement yang tampil adalah data disbursement <b>gagal</b> karena <b>kesalahan nama pemilik rekening</b>.</span>
                                    </div>
                                    <div>
                                        <span>&#x2022; <b>Persentase kecocokan nama di bawah 50% tidak bisa diperbaiki</b></span>
                                    </div>
                                    <div>
                                        <span>&#x2022; Data yang tidak dilakukan Disbursement ulang akan <b>dihapus setiap jam 12 malam</b></span>
                                    </div>
                                </Row>
                            </div>
                            <div className='mt-4'>
                                <Row>
                                    <Col style={{ textAlign: 'start' }}>
                                        <div className='mb-4'>
                                            Total Disbursement: <b>{perbaikanDataDisbursement.total_data}</b>, Bisa di Disburse: <span style={{ color: '#077E86', fontWeight: 700 }}>{perbaikanDataDisbursement.total_fixed}</span>, Tidak Bisa di Disburse: <span style={{ color: '#B9121B', fontWeight: 700 }}>{perbaikanDataDisbursement.total_unfixed}</span>
                                        </div>
                                    </Col>
                                    <Col style={{ textAlign: 'end' }}>
                                        <span onClick={() => exportDisbursementPerbaikanData(1)} className="me-4" style={{ cursor: 'pointer', color: '#077E86', fontWeight: 700, textDecoration: 'underline' }}>Export</span>
                                        <span style={{ fontWeight: 600, marginRight: 10 }}>Pilih Semua</span>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="inlineCheckbox1"
                                            name={'dataDiperbaikiAll'}
                                            value={isChecklist.dataDiperbaikiAll !== undefined ? isChecklist.dataDiperbaikiAll : false}
                                            checked={isChecklist.dataDiperbaikiAll !== undefined ? isChecklist.dataDiperbaikiAll : false}
                                            onChange={(e) => handleCheckPerbaikanDataAll(e, perbaikanDataDisbursement.list_invalid_data)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div className="div-table mt-4 pb-4">
                                <DataTable
                                    columns={columnsDisbursementPerbaikan}
                                    data={perbaikanDataDisbursement.list_invalid_data}
                                    customStyles={customStylesDisbursementPerbaikan}
                                    progressPending={loadingPerbaikanData}
                                    progressComponent={<CustomLoader />}
                                    dense
                                    noDataComponent={<div style={{ marginBottom: 10 }}>{"Tidak ada data"}</div>}
                                    pagination
                                />
                            </div>
                            <div className="d-flex justify-content-end align-items-center my-4">
                                <button
                                    className='btn-ez-transfer'
                                    // className={Object.keys(isChecklist).length === 0 || isChecklist.dataDiperbaikiAll === false || (isChecklist.dataDiperbaikiAll === true && Object.keys(isChecklist).length === 1) || perbaikanDataDisbursement.list_invalid_data.length === 0 ? 'btn-noez-transfer' : 'btn-ez-transfer'}
                                    // disabled={Object.keys(isChecklist).length === 0 || isChecklist.dataDiperbaikiAll === false || (isChecklist.dataDiperbaikiAll === true && Object.keys(isChecklist).length === 1) || perbaikanDataDisbursement.list_invalid_data.length === 0}
                                    // disabled={dataFromUploadExcel.length === 0} //untuk excel
                                    style={{ width: '25%' }}
                                    onClick={() => createDataForModal(perbaikanDataDisbursement.list_invalid_data, isChecklist)}
                                    // onClick={() => createDataDisburseExcel(dataFromUploadExcel, isDisbursementManual, dataOriginFromUpload)} //untuk excel
                                >
                                    Lakukan Disbursement
                                </button>
                            </div>
                            {/*Modal Konfirmasi Disbursement*/}
                            <Modal className="confirm-disburse-modal" size="lg" centered show={showModalKonfirmasiPerbaikanData} onHide={batalConfirm}>
                                <Modal.Header className="border-0">
                                    <Button
                                        className="position-absolute top-0 end-0 m-3"
                                        variant="close"
                                        aria-label="Close"
                                        onClick={batalConfirm}
                                    />

                                </Modal.Header>
                                <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                                    {language === null ? eng.konfirmasiDisburse : language.konfirmasiDisburse}
                                </Modal.Title>
                                <Modal.Body className='mx-2'>
                                    <div style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }} className='d-flex justify-content-center align-items-center'>
                                        <img src={noteInfo} width="25" height="25" alt="circle_info" style={{ marginRight: 10 }} />
                                        <span>{language === null ? eng.descKonfirmasiDisburse : language.descKonfirmasiDisburse}</span>
                                    </div>
                                    <div>
                                        <div className='mt-3' style={{ fontFamily: 'Source Sans Pro', fontSize: 16, color: '#383838', fontWeight: 600 }}>{language === null ? eng.tujuanDisburse : language.tujuanDisburse}</div>
                                        <div className="table-disburse-confirm pt-3">
                                            <DataTable
                                                // columns={columnsBulk} //untuk csv
                                                columns={columnsDisbursementPerbaikanModal} //untuk excel
                                                // data={dataFromUpload} //untuk csv
                                                data={dataPerbaikanModal} //untuk excel
                                                customStyles={customStylesDisbursementPerbaikan}
                                                noDataComponent={<div style={{ marginBottom: 10 }}>{language === null ? eng.belumAdaDataDisburse : language.belumAdaDataDisburse}</div>}
                                                pagination
                                                highlightOnHover
                                                fixedHeader
                                                fixedHeaderScrollHeight='300px'
                                                // progressComponent={<CustomLoader />}
                                                // subHeaderComponent={subHeaderComponentMemo}
                                            />
                                        </div>
                                        <div className='sub-base-content-disburse mt-3'>
                                            <div className='d-flex justify-content-between align-items-center mt-1'>
                                                <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>{language === null ? eng.totalDisburse : language.totalDisburse}</div>
                                                <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(allNominal, true, 2)}</div>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center mt-2'>
                                                <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>{language === null ? eng.totalFeeDisbursePlusTax : language.totalFeeDisbursePlusTax}</div>
                                                <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(allFee, true, 2)}</div>
                                            </div>
                                            <div className='mt-2' style={{ border: "1px dashed #C4C4C4" }}></div>
                                            <div className='d-flex justify-content-between align-items-center mt-3' style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>
                                                <div>{language === null ? eng.totalDisbursePlusFee : language.totalDisbursePlusFee}</div>
                                                <div>{convertToRupiah(allTotalNominal, true, 2)}</div>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center mt-3'>
                                            <div style={{ fontFamily: 'Nunito' }}>
                                                <div style={{ fontSize: 14, color: '#383838' }}>{language === null ? eng.sisaSaldoTersedia : language.sisaSaldoTersedia}</div>
                                                <div style={{ fontSize: 12, color: '#888888' }}>{language === null ? eng.descTerhitung : language.descTerhitung}</div>
                                            </div>
                                            {
                                                Number(((getBalance) - (totalHoldBalance)) - (allTotalNominal)) < 0  ?
                                                <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B", width: 250 }} className='text-end'>
                                                    <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                    {language === null ? eng.saldoTidakCukup : language.saldoTidakCukup}
                                                </div> :
                                                <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah((((getBalance) - (totalHoldBalance)) - (allTotalNominal)), true, 2)}</div>
                                            }
                                        </div>
                                        <div className='mb-3 mt-3'>
                                            <Form.Check
                                                className='form-confirm'
                                                label={language === null ? eng.sayaBertanggungJawab : language.sayaBertanggungJawab}
                                                id="statusId"
                                                onChange={() => setIsCheckedConfirm(!isCheckedConfirm)}
                                                checked={isCheckedConfirm}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end align-items-center mt-3">
                                        <button
                                            onClick={batalConfirm}
                                            style={{
                                                fontFamily: "Exo",
                                                fontSize: 16,
                                                fontWeight: 900,
                                                alignItems: "center",
                                                gap: 8,
                                                width: 136,
                                                height: 40,
                                                background: "#FFFFFF",
                                                color: "#888888",
                                                border: "0.6px solid #EBEBEB",
                                                borderRadius: 6,
                                            }}
                                        >
                                            {language === null ? eng.batal : language.batal}
                                        </button>
                                        <button
                                            onClick={() => sendDataDisbursePerbaikanData(dataForUpload)}
                                            className={isCheckedConfirm === true ? 'btn-ez-transfer ms-3' : 'btn-noez-transfer ms-3'}
                                            disabled={isCheckedConfirm === false}
                                            style={{ width: '25%' }}
                                        >
                                            {language === null ? eng.lakukanDisburse : language.lakukanDisburse}
                                        </button>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Disbursement