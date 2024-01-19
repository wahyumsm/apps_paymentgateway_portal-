import React, { useEffect, useState } from 'react'
import { BaseURL, CustomLoader, convertToRupiah, errorCatch, getRole, getToken, language, setUserSession } from '../../function/helpers'
import { eng } from '../../components/Language'
import { Col, Form, Modal, Row } from '@themesberg/react-bootstrap'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import CurrencyInput from 'react-currency-input-field'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import DataTable, { defaultThemes } from 'react-data-table-component';
import Pagination from 'react-js-pagination'
import encryptData from '../../function/encryptData'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import $ from 'jquery'
import ReactSelect, { components } from 'react-select';
import * as XLSX from "xlsx"
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import noteIconRed from "../../assets/icon/note_icon_red.svg";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginFileEncode, FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

function SettlementVAUSDPartner() {

    const history = useHistory()
    const user_role = getRole()
    const [isSettlementVAUSD, setIsSettlementVAUSD] = useState(100)
    const [listMerchant, setListMerchant] = useState([])
    const [selectedPengajuanMerchantVAUSDAdmin, setSelectedPengajuanMerchantVAUSDAdmin] = useState([])
    const [selectedRiwayatMerchantVAUSDAdmin, setSelectedRiwayatMerchantVAUSDAdmin] = useState([])

    async function getListMerchant() {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "partner_id": "" }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            // console.log(dataParams, 'dataParams');
            const dataListMerchant = await axios.post(BaseURL + "/VirtualAccountUSD/MerchantVAUSD", {data: dataParams}, {headers: headers})
            // console.log(dataListMerchant, "dataListMerchant");
            if (dataListMerchant.status === 200 && dataListMerchant.data.response_code === 200 && dataListMerchant.data.response_new_token === null) {
                let newArr = []
                dataListMerchant.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mpartner_id
                    obj.label = e.mpartner_name
                    newArr.push(obj)
                })
                setListMerchant(newArr)
            } else if (dataListMerchant.status === 200 && dataListMerchant.data.response_code === 200 && dataListMerchant.data.response_new_token !== null) {
                setUserSession(dataListMerchant.data.response_new_token)
                let newArr = []
                dataListMerchant.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mpartner_id
                    obj.label = e.mpartner_name
                    newArr.push(obj)
                })
                setListMerchant(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

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

    // ADMIN PENGAJUAN STATE MANAGEMENT

    const [listPengajuanSettlementVAUSDAdmin, setListPengajuanSettlementVAUSDAdmin] = useState([])
    const [pendingPengajuanSettlementVAUSDAdmin, setPendingPengajuanSettlementVAUSDAdmin] = useState(false)
    const [showDatePengajuanSettlementVAUSDAdmin, setShowDatePengajuanSettlementVAUSDAdmin] = useState("none")
    const [statePengajuanSettlementVAUSDAdmin, setStatePengajuanSettlementVAUSDAdmin] = useState(null)
    const [dateRangePengajuanSettlementVAUSDAdmin, setDateRangePengajuanSettlementVAUSDAdmin] = useState([])
    const [inputHandlePengajuanSettlementVAUSDAdmin, setInputHandlePengajuanSettlementVAUSDAdmin] = useState({
        periodePengajuanSettlementVAUSDAdmin: 0,
        idSettlementPengajuanSettlementVAUSDAdmin: "",
        namaMerchantPengajuanSettlementVAUSDAdmin: "",
    })
    const [totalPagePengajuanSettlementVAUSDAdmin, setTotalPagePengajuanSettlementVAUSDAdmin] = useState(0)
    const [activePagePengajuanSettlementVAUSDAdmin, setActivePagePengajuanSettlementVAUSDAdmin] = useState(1)
    const [pageNumberPengajuanSettlementVAUSDAdmin, setPageNumberPengajuanSettlementVAUSDAdmin] = useState({})

    const [showModalPengajuanSettlementVAUSDAdmin, setShowModalPengajuanSettlementVAUSDAdmin] = useState(false)
    const [dataModalPengajuanSettlementVAUSDAdmin, setDataModalPengajuanSettlementVAUSDAdmin] = useState({
        idSettlementModal: "",
        namaMerchantModal: "",
        currencyModal: "",
        totalSettleModal: 0,
        nomorReferensiBank: "",
    })
    const [files, setFiles] = useState([])
    const [labelUpload, setLabelUpload] = useState(`<div class='py-4 mb-2 style-label-drag-drop text-center'>Masukan foto bukti transfer :</div>
    <div className='pb-4'>
        <span class="filepond--label-action">
            Upload foto
        </span>
    </div>`)
    const [dataImageUploadPengajuanSettlementVAUSDAdmin, setDataImageUploadPengajuanSettlementVAUSDAdmin] = useState({})

    // ADMIN PENGAJUAN STATE MANAGEMENT END

    // ADMIN PENGAJUAN FUNCTION

    async function fileUpload(newValue) {
        if (newValue.lenght === 0) {
            setLabelUpload(`<div class='py-4 mb-2 style-label-drag-drop text-center'>Masukan foto bukti transfer :</div>
            <div className='pb-4'>
                <span class="filepond--label-action">
                    Upload foto
                </span>
            </div>`)
        } else if (newValue.length !== 0 && newValue[0].file.type === "image/jpeg" && newValue[0].file.size > 500000) {
            console.log('masuk file jpg oversize');
            setLabelUpload("")
            setLabelUpload(`<div class='py-4 mb-2 style-label-drag-drop text-center'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />Ukuran file melebihi kapasitas maksimal</div>
            <div className='pb-4'>
                <span class="filepond--label-action">
                    Upload foto ulang
                </span>
            </div>`)
        } else if (newValue.length !== 0 && newValue[0].file.type === "image/png" && newValue[0].file.size > 500000) {
            console.log('masuk png oversize');
            setLabelUpload("")
            setLabelUpload(`<div class='py-4 mb-2 style-label-drag-drop text-center'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />Ukuran file melebihi kapasitas maksimal</div>
            <div className='pb-4'>
                <span class="filepond--label-action">
                    Upload foto ulang
                </span>
            </div>`)
        } else if (newValue.length !== 0 && newValue[0].file.type === "application/pdf" && newValue[0].file.size > 500000) {
            console.log('masuk pdf oversize');
            setLabelUpload("")
            setLabelUpload(`<div class='py-4 mb-2 style-label-drag-drop text-center'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />Ukuran file melebihi kapasitas maksimal</div>
            <div className='pb-4'>
                <span class="filepond--label-action">
                    Upload foto ulang
                </span>
            </div>`)
        } else if ((newValue.length !== 0 && newValue[0].file.type !== "image/jpeg") && (newValue.length !== 0 && newValue[0].file.type !== "image/png") && (newValue.length !== 0 && newValue[0].file.type !== "application/pdf")) {
            console.log('masuk file salah jpg');
            setLabelUpload("")
            setLabelUpload(`<div class='py-4 mb-2 style-label-drag-drop text-center'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />File yang digunakan harus berformat .jpg, .png atau .pdf</div>
            <div className='pb-4'>
                <span class="filepond--label-action">
                    Upload foto ulang
                </span>
            </div>`)
        } else {
            console.log('masuk file bener');
            console.log(newValue, 'newValue');
            // var data = new Blob([newValue], {type: newValue[0].file.type})
            const response = await fetch(newValue);
            // here image is url/location of image
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', {type: newValue[0]?.file.type});
            // let img = new Image();
            // img.src = newValue;
            // let canvas = document.createElement('canvas');
            // img.onload = function() {
            //     canvas.width=img.width;
            //     canvas.height=img.height;
            //     canvas.getContext('2d').drawImage(img,0,0);
            //     canvas.toBlob(setLink,'image/png',1)
            // }
            console.log(file, 'file');
            setDataImageUploadPengajuanSettlementVAUSDAdmin(file)
            setFiles(newValue)
            // console.log(file, 'file');
        }
    }

    function handleChangePeriodePengajuanSettlementVAUSDAdmin(e) {
        if (e.target.value === "7") {
            setShowDatePengajuanSettlementVAUSDAdmin("")
            setInputHandlePengajuanSettlementVAUSDAdmin({
                ...inputHandlePengajuanSettlementVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDatePengajuanSettlementVAUSDAdmin("none")
            setDateRangePengajuanSettlementVAUSDAdmin([])
            setInputHandlePengajuanSettlementVAUSDAdmin({
                ...inputHandlePengajuanSettlementVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDatePengajuanSettlementVAUSDAdmin(item) {
        setStatePengajuanSettlementVAUSDAdmin(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangePengajuanSettlementVAUSDAdmin(item)
        }
    }

    function handlePageChangePengajuanSettlementVAUSDAdmin(page) {
        setActivePagePengajuanSettlementVAUSDAdmin(page)
        getListPengajuanSettlementVAUSDAdmin(page, inputHandlePengajuanSettlementVAUSDAdmin.idSettlementPengajuanSettlementVAUSDAdmin, selectedPengajuanMerchantVAUSDAdmin.lenght !== 0 ? selectedPengajuanMerchantVAUSDAdmin[0].value : "", inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin, dateRangePengajuanSettlementVAUSDAdmin)
    }

    function resetButtonPengajuanSettlementVAUSDAdminHandle() {
        setShowDatePengajuanSettlementVAUSDAdmin("none")
        setStatePengajuanSettlementVAUSDAdmin(null)
        setDateRangePengajuanSettlementVAUSDAdmin([])
        setInputHandlePengajuanSettlementVAUSDAdmin({
            periodePengajuanSettlementVAUSDAdmin: 0,
            idSettlementPengajuanSettlementVAUSDAdmin: "",
            namaMerchantPengajuanSettlementVAUSDAdmin: "",
        })
        setSelectedPengajuanMerchantVAUSDAdmin([])
        setSelectedRiwayatMerchantVAUSDAdmin([])
    }

    async function getListPengajuanSettlementVAUSDAdmin(page, idSettlement, namaMerchant, dateId, dateRange) {
        try {
            setPendingPengajuanSettlementVAUSDAdmin(true)
            setActivePagePengajuanSettlementVAUSDAdmin(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "code":"${idSettlement}", "date_from": "${Number(dateId) === 7 ? dateRange[0] : ""}", "date_to": "${Number(dateId) === 7 ? dateRange[1] : ""}", "page" : ${page}, "period": ${Number(dateId) !== 0 ? Number(dateId) : 2}, "partner_id": "${namaMerchant}", "row_per_page": 10 }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            // console.log(dataParams, 'dataParams API list data');
            const dataListPengajuanSettlementVAUSDAdmin = await axios.post(BaseURL + "/VirtualAccountUSD/GetWithdrawRequestforAdmin", {data: dataParams}, {headers: headers})
            // console.log(dataListPengajuanSettlementVAUSDAdmin, 'dataListPengajuanSettlementVAUSDAdmin');
            if (dataListPengajuanSettlementVAUSDAdmin.status === 200 && dataListPengajuanSettlementVAUSDAdmin.data.response_code === 200 && dataListPengajuanSettlementVAUSDAdmin.data.response_new_token === null) {
                setPageNumberPengajuanSettlementVAUSDAdmin(dataListPengajuanSettlementVAUSDAdmin.data.response_data)
                setTotalPagePengajuanSettlementVAUSDAdmin(dataListPengajuanSettlementVAUSDAdmin.data.response_data.max_page)
                setListPengajuanSettlementVAUSDAdmin(dataListPengajuanSettlementVAUSDAdmin.data.response_data.results)
                setPendingPengajuanSettlementVAUSDAdmin(false)
            } else if (dataListPengajuanSettlementVAUSDAdmin.status === 200 && dataListPengajuanSettlementVAUSDAdmin.data.response_code === 200 && dataListPengajuanSettlementVAUSDAdmin.data.response_new_token !== null) {
                setUserSession(dataListPengajuanSettlementVAUSDAdmin.data.response_new_token)
                setPageNumberPengajuanSettlementVAUSDAdmin(dataListPengajuanSettlementVAUSDAdmin.data.response_data)
                setTotalPagePengajuanSettlementVAUSDAdmin(dataListPengajuanSettlementVAUSDAdmin.data.response_data.max_page)
                setListPengajuanSettlementVAUSDAdmin(dataListPengajuanSettlementVAUSDAdmin.data.response_data.results)
                setPendingPengajuanSettlementVAUSDAdmin(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function uploadReceiptSettlement(idSettlement, image, newValue, noReferensiBank) {
        try {
            console.log(newValue, 'newValue');
            if (newValue.length === 0) {
                image = {}
            }
            console.log(image, 'image');
            const auth = "Bearer " + getToken()
            var formData = new FormData()
            formData.append("image", image)
            formData.append("code", idSettlement)
            formData.append("refno", noReferensiBank)
            const headers = {
                'Content-Type':'multipart/form-data',
                'Authorization' : auth,
            }
            console.log(formData, 'formData');
            const sendDataUpload = await axios.post(BaseURL + "/VirtualAccountUSD/UploadWithdrawReceipt", formData, {headers: headers})
            console.log(sendDataUpload, 'sendDataUpload');
            if (sendDataUpload.status === 200 && sendDataUpload.data.response_code === 200 && sendDataUpload.data.response_new_token === null) {
                setLabelUpload("")
                setFiles([])
                setDataImageUploadPengajuanSettlementVAUSDAdmin({})
                setDataModalPengajuanSettlementVAUSDAdmin({
                    ...dataModalPengajuanSettlementVAUSDAdmin,
                    idSettlementModal: "",
                    namaMerchantModal: "",
                    currencyModal: "",
                    totalSettleModal: 0,
                    nomorReferensiBank: "",
                })
                setLabelUpload(`<div class='py-4 mb-2 style-label-drag-drop text-center'>Masukan foto bukti transfer :</div>
                <div className='pb-4'>
                    <span class="filepond--label-action">
                        Upload foto
                    </span>
                </div>`)
                setShowModalPengajuanSettlementVAUSDAdmin(false)
            } else if (sendDataUpload.status === 200 && sendDataUpload.data.response_code === 200 && sendDataUpload.data.response_new_token !== null) {
                setUserSession(sendDataUpload.data.response_new_token)
                setLabelUpload("")
                setFiles([])
                setDataImageUploadPengajuanSettlementVAUSDAdmin({})
                setDataModalPengajuanSettlementVAUSDAdmin({
                    ...dataModalPengajuanSettlementVAUSDAdmin,
                    idSettlementModal: "",
                    namaMerchantModal: "",
                    currencyModal: "",
                    totalSettleModal: 0,
                    nomorReferensiBank: "",
                })
                setLabelUpload(`<div class='py-4 mb-2 style-label-drag-drop text-center'>Masukan foto bukti transfer :</div>
                <div className='pb-4'>
                    <span class="filepond--label-action">
                        Upload foto
                    </span>
                </div>`)
                setShowModalPengajuanSettlementVAUSDAdmin(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function exportReportPengajuanSettlementVAUSDAdminHandler(idSettlement, namaMerchant, dateId, dateRange) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "code":"${idSettlement}", "date_from": "${Number(dateId) === 7 ? dateRange[0] : ""}", "date_to": "${Number(dateId) === 7 ? dateRange[1] : ""}", "page" : 1, "period": ${Number(dateId) !== 0 ? Number(dateId) : 2}, "partner_id": "${namaMerchant}", "row_per_page": 1000000 }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            // console.log(dataParams, 'dataParams');
            const exportPengajuanSettlementVAUSDAdmin = await axios.post(BaseURL + "/VirtualAccountUSD/GetWithdrawRequestforAdmin", {data: dataParams}, {headers: headers})
            // console.log(exportPengajuanSettlementVAUSDAdmin, 'exportPengajuanSettlementVAUSDAdmin');
            if (exportPengajuanSettlementVAUSDAdmin.status === 200 && exportPengajuanSettlementVAUSDAdmin.data.response_code === 200 && exportPengajuanSettlementVAUSDAdmin.data.response_new_token === null) {
                const data = exportPengajuanSettlementVAUSDAdmin.data.response_data.results
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ "No": i + 1, "ID Settlement": data[i].code, "Nama merchant": data[i].partner_name, "Tanggal pengajuan": data[i].request_date !== undefined ? data[i].request_date : "-", "Bank Tujuan": data[i].destination_bank, "Nomor rekening": data[i].account_number, "Nama pemilik rekening": data[i].account_name, "Saldo merchant": data[i].balance_before, "Nominal pengajuan": data[i].request, "Biaya": data[i].fee, "Total settlement": data[i].total, "Sisa saldo": data[i].balance_after })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Report Pengajuan Settlement VA USD.xlsx");
            } else if (exportPengajuanSettlementVAUSDAdmin.status === 200 && exportPengajuanSettlementVAUSDAdmin.data.response_code === 200 && exportPengajuanSettlementVAUSDAdmin.data.response_new_token !== null) {
                setUserSession(exportPengajuanSettlementVAUSDAdmin.data.response_new_token)
                const data = exportPengajuanSettlementVAUSDAdmin.data.response_data.results
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ "No": i + 1, "ID Settlement": data[i].code, "Nama merchant": data[i].partner_name, "Tanggal pengajuan": data[i].request_date !== undefined ? data[i].request_date : "-", "Bank Tujuan": data[i].destination_bank, "Nomor rekening": data[i].account_number, "Nama pemilik rekening": data[i].account_name, "Saldo merchant": data[i].balance_before, "Nominal pengajuan": data[i].request, "Biaya": data[i].fee, "Total settlement": data[i].total, "Sisa saldo": data[i].balance_after })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Report Pengajuan Settlement VA USD.xlsx");
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    // ADMIN PENGAJUAN FUNCTION END

    // ADMIN RIWAYAT STATE MANAGEMENT

    const [listRiwayatSettlementVAUSDAdmin, setListRiwayatSettlementVAUSDAdmin] = useState([])
    const [pendingRiwayatSettlementVAUSDAdmin, setPendingRiwayatSettlementVAUSDAdmin] = useState(false)

    const [showDatePengajuanRiwayatSettlementVAUSDAdmin, setShowDatePengajuanRiwayatSettlementVAUSDAdmin] = useState("none")
    const [statePengajuanRiwayatSettlementVAUSDAdmin, setStatePengajuanRiwayatSettlementVAUSDAdmin] = useState(null)
    const [dateRangePengajuanRiwayatSettlementVAUSDAdmin, setDateRangePengajuanRiwayatSettlementVAUSDAdmin] = useState([])

    const [showDateTerimaRiwayatSettlementVAUSDAdmin, setShowDateTerimaRiwayatSettlementVAUSDAdmin] = useState("none")
    const [stateTerimaRiwayatSettlementVAUSDAdmin, setStateTerimaRiwayatSettlementVAUSDAdmin] = useState(null)
    const [dateRangeTerimaRiwayatSettlementVAUSDAdmin, setDateRangeTerimaRiwayatSettlementVAUSDAdmin] = useState([])

    const [inputHandleRiwayatSettlementVAUSDAdmin, setInputHandleRiwayatSettlementVAUSDAdmin] = useState({
        periodePengajuanRiwayatSettlementVAUSDAdmin: 0,
        periodeTerimaRiwayatSettlementVAUSDAdmin: 0,
        idSettlementRiwayatSettlementVAUSDAdmin: "",
        namaMerchantRiwayatSettlementVAUSDAdmin: "",
        statusRiwayatSettlementVAUSDAdmin: 0,
    })
    const [totalPageRiwayatSettlementVAUSDAdmin, setTotalPageRiwayatSettlementVAUSDAdmin] = useState(0)
    const [activePageRiwayatSettlementVAUSDAdmin, setActivePageRiwayatSettlementVAUSDAdmin] = useState(1)
    const [pageNumberRiwayatSettlementVAUSDAdmin, setPageNumberRiwayatSettlementVAUSDAdmin] = useState({})

    // ADMIN RIWAYAT STATE MANAGEMENT END

    // ADMIN RIWAYAT FUNCTION

    function handleChangePeriodePengajuanRiwayatSettlementVAUSDAdmin(e) {
        if (e.target.value === "7") {
            setShowDatePengajuanRiwayatSettlementVAUSDAdmin("")
            setInputHandleRiwayatSettlementVAUSDAdmin({
                ...inputHandleRiwayatSettlementVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDatePengajuanRiwayatSettlementVAUSDAdmin("none")
            setDateRangePengajuanRiwayatSettlementVAUSDAdmin([])
            setInputHandleRiwayatSettlementVAUSDAdmin({
                ...inputHandleRiwayatSettlementVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function handleChangePeriodeTerimaRiwayatSettlementVAUSDAdmin(e) {
        if (e.target.value === "7") {
            setShowDateTerimaRiwayatSettlementVAUSDAdmin("")
            setInputHandleRiwayatSettlementVAUSDAdmin({
                ...inputHandleRiwayatSettlementVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateTerimaRiwayatSettlementVAUSDAdmin("none")
            setDateRangeTerimaRiwayatSettlementVAUSDAdmin([])
            setInputHandleRiwayatSettlementVAUSDAdmin({
                ...inputHandleRiwayatSettlementVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDatePengajuanRiwayatSettlementVAUSDAdmin(item) {
        setStatePengajuanRiwayatSettlementVAUSDAdmin(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangePengajuanRiwayatSettlementVAUSDAdmin(item)
        }
    }

    function pickDateTerimaRiwayatSettlementVAUSDAdmin(item) {
        setStateTerimaRiwayatSettlementVAUSDAdmin(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangeTerimaRiwayatSettlementVAUSDAdmin(item)
        }
    }

    function handlePageChangeRiwayatSettlementVAUSDAdmin(page) {
        setActivePageRiwayatSettlementVAUSDAdmin(page)
        getListRiwayatSettlementVAUSDAdmin(page, inputHandleRiwayatSettlementVAUSDAdmin.idSettlementRiwayatSettlementVAUSDAdmin, selectedRiwayatMerchantVAUSDAdmin.length !== 0 ? selectedRiwayatMerchantVAUSDAdmin[0].value : "", inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin, dateRangePengajuanRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin, dateRangeTerimaRiwayatSettlementVAUSDAdmin)
    }

    function resetButtonRiwayatSettlementVAUSDAdminHandle() {
        setShowDatePengajuanRiwayatSettlementVAUSDAdmin("none")
        setStatePengajuanRiwayatSettlementVAUSDAdmin(null)
        setDateRangePengajuanRiwayatSettlementVAUSDAdmin([])
        setInputHandleRiwayatSettlementVAUSDAdmin({
            periodePengajuanRiwayatSettlementVAUSDAdmin: 0,
            periodeTerimaRiwayatSettlementVAUSDAdmin: 0,
            idSettlementRiwayatSettlementVAUSDAdmin: "",
            namaMerchantRiwayatSettlementVAUSDAdmin: "",
            statusRiwayatSettlementVAUSDAdmin: 0,
        })
        setSelectedPengajuanMerchantVAUSDAdmin([])
        setSelectedRiwayatMerchantVAUSDAdmin([])
    }

    async function getListRiwayatSettlementVAUSDAdmin(page, idSettlement, namaMerchant, dateIdPengajuan, dateRangePengajuan, dateIdRiwayat, dateRangeRiwayat) {
        try {
            setPendingRiwayatSettlementVAUSDAdmin(true)
            setActivePageRiwayatSettlementVAUSDAdmin(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "code": "${idSettlement}", "partner_id": "${namaMerchant}", "csv_status_id": "1,2,3", "page": ${page}, "row_per_page": 10, "date_from": "${Number(dateIdPengajuan) === 7 ? dateRangePengajuan[0] : ""}", "date_to": "${Number(dateIdPengajuan) === 7 ? dateRangePengajuan[1] : ""}", "period": ${Number(dateIdPengajuan) !== 0 ? Number(dateIdPengajuan) : 2}, "acc_date_from": "${Number(dateIdRiwayat) === 7 ? dateRangeRiwayat[0] : ""}", "acc_date_to": "${Number(dateIdRiwayat) === 7 ? dateRangeRiwayat[1] : ""}", "acc_period": ${Number(dateIdRiwayat) !== 0 ? Number(dateIdRiwayat) : 0} }`)
            // const dataParams = encryptData(`{ "code": "${idSettlement}", "username": "", "merchant_name": "${namaMerchant}", "page": ${page}, "row_per_page": 10, "date_from": "${Number(dateIdPengajuan) === 7 ? dateRangePengajuan[0] : ""}", "date_to": "${Number(dateIdPengajuan) === 7 ? dateRangePengajuan[1] : ""}", "period": ${Number(dateIdPengajuan) !== 0 ? Number(dateIdPengajuan) : 2} }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            // console.log(dataParams, 'dataParams');
            const dataListRiwayatSettlementVAUSDAdmin = await axios.post(BaseURL + "/VirtualAccountUSD/WithdrawHistory", {data: dataParams}, {headers: headers})
            // console.log(dataListRiwayatSettlementVAUSDAdmin, 'dataListRiwayatSettlementVAUSDAdmin');
            if (dataListRiwayatSettlementVAUSDAdmin.status === 200 && dataListRiwayatSettlementVAUSDAdmin.data.response_code === 200 && dataListRiwayatSettlementVAUSDAdmin.data.response_new_token === null) {
                setPageNumberRiwayatSettlementVAUSDAdmin(dataListRiwayatSettlementVAUSDAdmin.data.response_data)
                setTotalPageRiwayatSettlementVAUSDAdmin(dataListRiwayatSettlementVAUSDAdmin.data.response_data.max_page)
                setListRiwayatSettlementVAUSDAdmin(dataListRiwayatSettlementVAUSDAdmin.data.response_data.results)
                setPendingRiwayatSettlementVAUSDAdmin(false)
            } else if (dataListRiwayatSettlementVAUSDAdmin.status === 200 && dataListRiwayatSettlementVAUSDAdmin.data.response_code === 200 && dataListRiwayatSettlementVAUSDAdmin.data.response_new_token !== null) {
                setUserSession(dataListRiwayatSettlementVAUSDAdmin.data.response_new_token)
                setPageNumberRiwayatSettlementVAUSDAdmin(dataListRiwayatSettlementVAUSDAdmin.data.response_data)
                setTotalPageRiwayatSettlementVAUSDAdmin(dataListRiwayatSettlementVAUSDAdmin.data.response_data.max_page)
                setListRiwayatSettlementVAUSDAdmin(dataListRiwayatSettlementVAUSDAdmin.data.response_data.results)
                setPendingRiwayatSettlementVAUSDAdmin(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function exportReportRiwayatSettlementVAUSDAdminHandler(idSettlement, namaMerchant, dateIdPengajuan, dateRangePengajuan, dateIdRiwayat, dateRangeRiwayat) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "code": "${idSettlement}", "partner_id": "${namaMerchant}", "csv_status_id": "1,2,3", "page": 1, "row_per_page": 1000000, "date_from": "${Number(dateIdPengajuan) === 7 ? dateRangePengajuan[0] : ""}", "date_to": "${Number(dateIdPengajuan) === 7 ? dateRangePengajuan[1] : ""}", "period": ${Number(dateIdPengajuan) !== 0 ? Number(dateIdPengajuan) : 2}, "acc_date_from": "${Number(dateIdRiwayat) === 7 ? dateRangeRiwayat[0] : ""}", "acc_date_to": "${Number(dateIdRiwayat) === 7 ? dateRangeRiwayat[1] : ""}", "acc_period": ${Number(dateIdRiwayat) !== 0 ? Number(dateIdRiwayat) : 0} }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            // console.log(dataParams, 'dataParams');
            const exportDataRiwayatSettlementVAUSDAdmin = await axios.post(BaseURL + "/VirtualAccountUSD/WithdrawHistory", {data: dataParams}, {headers: headers})
            // console.log(exportDataRiwayatSettlementVAUSDAdmin, 'exportDataRiwayatSettlementVAUSDAdmin');
            if (exportDataRiwayatSettlementVAUSDAdmin.status === 200 && exportDataRiwayatSettlementVAUSDAdmin.data.response_code === 200 && exportDataRiwayatSettlementVAUSDAdmin.data.response_new_token === null) {
                const data = exportDataRiwayatSettlementVAUSDAdmin.data.response_data.results
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ "No": i + 1, "ID Settlement": data[i].code, "Nama merchant": data[i].partner_name, "Tanggal pengajuan": data[i].request_date !== undefined ? data[i].request_date : "-", "Tanggal terima": data[i].accept_date, "Bank Tujuan": data[i].destination_bank, "Nomor rekening": data[i].account_number, "Nama pemilik rekening": data[i].account_name, "Nominal pengajuan": data[i].request, "Biaya": data[i].fee, "Total settlement": data[i].total, "Status": data[i].status_name })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Report Riwayat Settlement VA USD.xlsx");
            } else if (exportDataRiwayatSettlementVAUSDAdmin.status === 200 && exportDataRiwayatSettlementVAUSDAdmin.data.response_code === 200 && exportDataRiwayatSettlementVAUSDAdmin.data.response_new_token !== null) {
                setUserSession(exportDataRiwayatSettlementVAUSDAdmin.data.response_new_token)
                const data = exportDataRiwayatSettlementVAUSDAdmin.data.response_data.results
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ "No": i + 1, "ID Settlement": data[i].code, "Nama merchant": data[i].partner_name, "Tanggal pengajuan": data[i].request_date !== undefined ? data[i].request_date : "-", "Tanggal terima": data[i].accept_date, "Bank Tujuan": data[i].destination_bank, "Nomor rekening": data[i].account_number, "Nama pemilik rekening": data[i].account_name, "Nominal pengajuan": data[i].request, "Biaya": data[i].fee, "Total settlement": data[i].total, "Status": data[i].status_name })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Report Riwayat Settlement VA USD.xlsx");
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    // ADMIN RIWAYAT FUNCTION END

    // PARTNER STATE MANAGEMENT

    const [listBank, setListBank] = useState([])
    const [selectedBankSettlementVAUSDPartner, setSelectedBankSettlementVAUSDPartner] = useState([])
    const [ballanceSettlementVAUSDPartner, setBallanceSettlementVAUSDPartner] = useState({})
    const [isCurrencySettlementVAUSDPartner, setIsCurrencySettlementVAUSDPartner] = useState("USD")
    const [nomorRekeningSettlementVAUSDPartner, setNomorRekeningSettlementVAUSDPartner] = useState("")
    const [namaPemilikRekeningSettlementVAUSDPartner, setNamaPemilikRekeningSettlementVAUSDPartner] = useState("")
    const [nominalPengajuanSettlementVAUSDPartner, setNominalPengajuanSettlementVAUSDPartner] = useState("0")
    const [totalSettlementVAUSDPartner, setTotalSettlementVAUSDPartner] = useState(0)
    const [sisaSaldoSettlementVAUSDPartner, setSisaSaldoSettlementVAUSDPartner] = useState(0)
    const [listSettlementVAUSDPartner, setListSettlementVAUSDPartner] = useState([])
    const [pendingSettlementVAUSDPartner, setPendingSettlementVAUSDPartner] = useState(false)
    const [isFilterSettlementVAUSDPartner, setIsFilterSettlementVAUSDPartner] = useState(false)
    const [inputHandleSettlementVAUSDPartner, setInputHandleSettlementVAUSDPartner] = useState({
        idSettlementVAUSDPartner: "",
        periodeRequestSettlementVAUSDPartner: 0,
        periodeTerimaSettlementVAUSDPartner: 0,
        statusSettlementVAUSDPartner: "",
    })
    const [showDateRequestSettlementVAUSDPartner, setShowDateRequestSettlementVAUSDPartner] = useState("none")
    const [stateRequestSettlementVAUSDPartner, setStateRequestSettlementVAUSDPartner] = useState(null)
    const [dateRangeRequestSettlementVAUSDPartner, setDateRangeRequestSettlementVAUSDPartner] = useState([])

    const [showDateTerimaSettlementVAUSDPartner, setShowDateTerimaSettlementVAUSDPartner] = useState("none")
    const [stateTerimaSettlementVAUSDPartner, setStateTerimaSettlementVAUSDPartner] = useState(null)
    const [dateRangeTerimaSettlementVAUSDPartner, setDateRangeTerimaSettlementVAUSDPartner] = useState([])

    const [totalPageSettlementVAUSDPartner, setTotalPageSettlementVAUSDPartner] = useState(0)
    const [activePageSettlementVAUSDPartner, setActivePageSettlementVAUSDPartner] = useState(1)
    const [pageNumberSettlementVAUSDPartner, setPageNumberSettlementVAUSDPartner] = useState({})

    const [showModalSettlementVAUSDPertner, setShowModalSettlementVAUSDPertner] = useState(false)
    const [WithdrawCodeSettlementVAUSDPartner, setWithdrawCodeSettlementVAUSDPartner] = useState("")

    // PARTNER STATE MANAGEMENT END

    // PARTNER FUNCTION

    function nominalPengajuanHandle(amount) {
        setNominalPengajuanSettlementVAUSDPartner(amount)
        setTotalSettlementVAUSDPartner(Number(amount !== undefined ? amount : 0) - Number(isCurrencySettlementVAUSDPartner !== "USD" ? ballanceSettlementVAUSDPartner?.IDR?.fee : ballanceSettlementVAUSDPartner?.USD?.fee))
        setSisaSaldoSettlementVAUSDPartner(Number(isCurrencySettlementVAUSDPartner !== "USD" ? ballanceSettlementVAUSDPartner?.IDR?.balance : ballanceSettlementVAUSDPartner?.USD?.balance) - (Number(amount !== undefined ? amount : 0)))
        // setSisaSaldoSettlementVAUSDPartner(Number(isCurrencySettlementVAUSDPartner !== "USD" ? ballanceSettlementVAUSDPartner?.IDR?.balance : ballanceSettlementVAUSDPartner?.USD?.balance) - (Number(amount !== undefined ? amount : 0) - Number(isCurrencySettlementVAUSDPartner !== "USD" ? ballanceSettlementVAUSDPartner?.IDR?.fee : ballanceSettlementVAUSDPartner?.USD?.fee)))
    }

    function pickDateVAUSDPartner(item, param) {
        if (param === "request") {
            setStateRequestSettlementVAUSDPartner(item)
            if (item !== null) {
                item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
                setDateRangeRequestSettlementVAUSDPartner(item)
            }
        } else {
            setStateTerimaSettlementVAUSDPartner(item)
            if (item !== null) {
                item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
                setDateRangeTerimaSettlementVAUSDPartner(item)
            }
        }
    }

    function handleChangePeriodeSettlementVAUSDPartner(e, param) {
        if (param === "request") {
            if (e.target.value === "7") {
                setShowDateRequestSettlementVAUSDPartner("")
                setInputHandleSettlementVAUSDPartner({
                    ...inputHandleSettlementVAUSDPartner,
                    [e.target.name] : e.target.value
                })
            } else {
                setShowDateRequestSettlementVAUSDPartner("none")
                setInputHandleSettlementVAUSDPartner({
                    ...inputHandleSettlementVAUSDPartner,
                    [e.target.name] : e.target.value
                })
            }
        } else if (param === "terima") {
            if (e.target.value === "7") {
                setShowDateTerimaSettlementVAUSDPartner("")
                setInputHandleSettlementVAUSDPartner({
                    ...inputHandleSettlementVAUSDPartner,
                    [e.target.name] : e.target.value
                })
            } else {
                setShowDateTerimaSettlementVAUSDPartner("none")
                setInputHandleSettlementVAUSDPartner({
                    ...inputHandleSettlementVAUSDPartner,
                    [e.target.name] : e.target.value
                })
            }
        }
    }

    function handleChangeSettlementVAUSDPartner(e) {
        setInputHandleSettlementVAUSDPartner({
            ...inputHandleSettlementVAUSDPartner,
            [e.target.name]: e.target.value
        })
    }

    function handlePageChangeSettlementVAUSDPartner(page) {
        setActivePageSettlementVAUSDPartner(page)
        getListSettlementRequestVAUSDPartner(page, inputHandleSettlementVAUSDPartner.idSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner, dateRangeRequestSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner, dateRangeTerimaSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.statusSettlementVAUSDPartner)
    }

    function resetButtonSettlementVAUSDPartnerHandle() {
        setInputHandleSettlementVAUSDPartner({
            idSettlementVAUSDPartner: "",
            periodeRequestSettlementVAUSDPartner: 0,
            periodeTerimaSettlementVAUSDPartner: 0,
            statusSettlementVAUSDPartner: "",
        })
        setIsFilterSettlementVAUSDPartner(false)
        setShowDateRequestSettlementVAUSDPartner("none")
        setStateRequestSettlementVAUSDPartner(null)
        setDateRangeRequestSettlementVAUSDPartner([])

        setShowDateTerimaSettlementVAUSDPartner("none")
        setStateTerimaSettlementVAUSDPartner(null)
        setDateRangeTerimaSettlementVAUSDPartner([])
    }

    async function getUserDataSettlementPartner(lang) {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type': 'application/json',
                'Authorization' : auth,
                // 'Accept-Language' : lang
            }
            const dataUserSettlement = await axios.post(BaseURL + "/VirtualAccountUSD/GetWithdrawConfiguration", {data: ""}, {headers: headers})
            // console.log(dataUserSettlement, 'dataUserSettlement');
            if (dataUserSettlement.status === 200 && dataUserSettlement.data.response_code === 200 && dataUserSettlement.data.response_new_token === null) {
                setBallanceSettlementVAUSDPartner(dataUserSettlement.data.response_data.results)
                setSisaSaldoSettlementVAUSDPartner(dataUserSettlement.data.response_data.results.USD.balance)
                let newArr = []
                dataUserSettlement.data.response_data.results.ListBank.forEach(e => {
                    if (e.bank_code !== "000" || e.bank_name !== "Default") {
                        let obj = {}
                        obj.value = e.bank_code
                        obj.label = e.bank_name
                        newArr.push(obj)
                    }
                })
                setListBank(newArr)
            } else if (dataUserSettlement.status === 200 && dataUserSettlement.data.response_code === 200 && dataUserSettlement.data.response_new_token !== null) {
                setUserSession(dataUserSettlement.data.response_new_token)
                setBallanceSettlementVAUSDPartner(dataUserSettlement.data.response_data.results)
                setSisaSaldoSettlementVAUSDPartner(dataUserSettlement.data.response_data.results.USD.balance)
                let newArr = []
                dataUserSettlement.data.response_data.results.ListBank.forEach(e => {
                    if (e.bank_code !== "000" || e.bank_name !== "Default") {
                        let obj = {}
                        obj.value = e.bank_code
                        obj.label = e.bank_name
                        newArr.push(obj)
                    }
                })
                setListBank(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getListSettlementRequestVAUSDPartner(page, idTransaksi, dateIdRequest, dateRangeRequest, dateIdTerima, dateRangeTerima, statusId) {
        try {
            setPendingSettlementVAUSDPartner(true)
            setActivePageSettlementVAUSDPartner(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "status": "${statusId.length !== 0 ? statusId : "1,2,3"}", "date_from_acc": "${Number(dateIdTerima) === 7 ? dateRangeTerima[0] : ""}", "date_from_trans": "${Number(dateIdRequest) === 7 ? dateRangeRequest[0] : ""}", "date_to_acc": "${Number(dateIdTerima) === 7 ? dateRangeTerima[1] : ""}", "date_to_trans": "${Number(dateIdRequest) === 7 ? dateRangeRequest[1] : ""}", "page" : ${page}, "period_acc": ${Number(dateIdTerima)}, "period_trans": ${Number(dateIdRequest) !== 0 ? Number(dateIdRequest) : 2}, "row_per_page": 10, "code": "${idTransaksi}" }`)
            // const dataParams = encryptData(`{ "code" : "${idTransaksi}", "partner_id": "", "csv_status_id": "${statusId.length !== 0 ? statusId : "2,3"}", "page": ${page}, "row_per_page": 10, "date_from": "${Number(dateIdRequest) === 7 ? dateRangeRequest[0] : ""}", "date_to": "${Number(dateIdRequest) === 7 ? dateRangeRequest[1] : ""}", "period": ${Number(dateIdRequest) !== 0 ? Number(dateIdRequest) : 2}, "acc_date_from": "${Number(dateIdTerima) === 7 ? dateRangeTerima[0] : ""}", "acc_date_to": "${Number(dateIdTerima) === 7 ? dateRangeTerima[1] : ""}", "acc_period": ${Number(dateIdTerima) !== 0 ? Number(dateIdTerima) : 2} }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                // 'Accept-Language' : "ID"
            }
            // console.log(dataParams, 'dataParams');
            const dataListSettlementRequest = await axios.post(BaseURL + "/VirtualAccountUSD/GetWithdrawalRequest", {data: dataParams}, {headers: headers})
            // console.log(dataListSettlementRequest, 'dataListSettlementRequest');
            if (dataListSettlementRequest.status === 200 && dataListSettlementRequest.data.response_code === 200 && dataListSettlementRequest.data.response_new_token === null) {
                dataListSettlementRequest.data.response_data.results = dataListSettlementRequest.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberSettlementVAUSDPartner(dataListSettlementRequest.data.response_data)
                setTotalPageSettlementVAUSDPartner(dataListSettlementRequest.data.response_data.max_page)
                setListSettlementVAUSDPartner(dataListSettlementRequest.data.response_data.results)
                setPendingSettlementVAUSDPartner(false)
            } else if (dataListSettlementRequest.status === 200 && dataListSettlementRequest.data.response_code === 200 && dataListSettlementRequest.data.response_new_token !== null) {
                setUserSession(dataListSettlementRequest.data.response_new_token)
                dataListSettlementRequest.data.response_data.results = dataListSettlementRequest.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberSettlementVAUSDPartner(dataListSettlementRequest.data.response_data)
                setTotalPageSettlementVAUSDPartner(dataListSettlementRequest.data.response_data.max_page)
                setListSettlementVAUSDPartner(dataListSettlementRequest.data.response_data.results)
                setPendingSettlementVAUSDPartner(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function ExportReportSettlementVAUSDPartnerHandler(idSettlement, dateIdRequest, dateRangeRequest, dateIdTerima, dateRangeTerima, statusId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "status": "${statusId.length !== 0 ? statusId : "1,2,3"}", "date_from_acc": "${Number(dateIdTerima) === 7 ? dateRangeTerima[0] : ""}", "date_from_trans": "${Number(dateIdRequest) === 7 ? dateRangeRequest[0] : ""}", "date_to_acc": "${Number(dateIdTerima) === 7 ? dateRangeTerima[1] : ""}", "date_to_trans": "${Number(dateIdRequest) === 7 ? dateRangeRequest[1] : ""}", "page" : 1, "period_acc": ${Number(dateIdTerima)}, "period_trans": ${Number(dateIdRequest) !== 0 ? Number(dateIdRequest) : 2}, "row_per_page": 1000000, "code": "${idSettlement}" }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                // 'Accept-Language' : "ID"
            }
            // console.log(dataParams, 'dataParams');
            const exportedDataListSettlementRequest = await axios.post(BaseURL + "/VirtualAccountUSD/GetWithdrawalRequest", {data: dataParams}, {headers: headers})
            // console.log(exportedDataListSettlementRequest, 'exportedDataListSettlementRequest');
            if (exportedDataListSettlementRequest.status === 200 && exportedDataListSettlementRequest.data.response_code === 200 && exportedDataListSettlementRequest.data.response_new_token === null) {
                const data = exportedDataListSettlementRequest.data.response_data.results
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ "No": i + 1, "ID Settlement": data[i].withdraw_code, "Tanggal pengajuan": data[i].withdraw_trans_date !== undefined ? data[i].withdraw_trans_date : "-", "Tanggal terima": data[i].withdraw_accept_date, "Bank Tujuan": data[i].bank_name, "Nomor rekening": data[i].acc_number, "Nama pemilik rekening": data[i].acc_name, "Nominal pengajuan": data[i].amount, "Biaya": data[i].settlement_fee, "Total settlement": data[i].total_amount, "Status": data[i].status_name })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Report Settlement VA USD.xlsx");
            } else if (exportedDataListSettlementRequest.status === 200 && exportedDataListSettlementRequest.data.response_code === 200 && exportedDataListSettlementRequest.data.response_new_token !== null) {
                setUserSession(exportedDataListSettlementRequest.data.response_new_token)
                const data = exportedDataListSettlementRequest.data.response_data.results
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ "No": i + 1, "ID Settlement": data[i].withdraw_code, "Tanggal pengajuan": data[i].withdraw_trans_date !== undefined ? data[i].withdraw_trans_date : "-", "Tanggal terima": data[i].withdraw_accept_date, "Bank Tujuan": data[i].bank_name, "Nomor rekening": data[i].acc_number, "Nama pemilik rekening": data[i].acc_name, "Nominal pengajuan": data[i].amount, "Biaya": data[i].settlement_fee, "Total settlement": data[i].total_amount, "Status": data[i].status_name })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Report Settlement VA USD.xlsx");
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function submitSettlementVAUSDPartner(accName, accNumber, currency, bankCode, amount) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "acc_name": "${accName}", "acc_number": "${accNumber}", "amount": "${amount}", "currency": "${currency}", "mbank_code": "${bankCode}" }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            // console.log(dataParams, 'dataParams');
            const submitedSettlement = await axios.post(BaseURL + "/VirtualAccountUSD/WithdrawalRequest", {data: dataParams}, {headers: headers})
            // console.log(submitedSettlement, 'submitedSettlement');
            if (submitedSettlement.status === 200 && submitedSettlement.data.response_code === 200 && submitedSettlement.data.response_new_token === null) {
                setSelectedBankSettlementVAUSDPartner([])
                setNomorRekeningSettlementVAUSDPartner("")
                setNamaPemilikRekeningSettlementVAUSDPartner("")
                setNominalPengajuanSettlementVAUSDPartner("0")
                setTimeout(() => {
                    getUserDataSettlementPartner()
                }, 5000);
            } else if (submitedSettlement.status === 200 && submitedSettlement.data.response_code === 200 && submitedSettlement.data.response_new_token !== null) {
                setUserSession(submitedSettlement.data.response_new_token)
                setSelectedBankSettlementVAUSDPartner([])
                setNomorRekeningSettlementVAUSDPartner("")
                setNamaPemilikRekeningSettlementVAUSDPartner("")
                setNominalPengajuanSettlementVAUSDPartner("0")
                setTimeout(() => {
                    getUserDataSettlementPartner()
                }, 5000);
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function acceptSettlementHandle(withDrawCode) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "withdraw_code": "${withDrawCode}" }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            // console.log(dataParams, 'dataParams');
            const acceptedSettlement = await axios.post(BaseURL + "/VirtualAccountUSD/WithdrawalAccepted", {data: dataParams}, {headers: headers})
            // console.log(acceptedSettlement, 'acceptedSettlement');
            if (acceptedSettlement.status === 200 && acceptedSettlement.data.response_code === 200 && acceptedSettlement.data.response_new_token === null) {
                getListSettlementRequestVAUSDPartner(activePageSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.idSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner, dateRangeRequestSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner, dateRangeTerimaSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.statusSettlementVAUSDPartner)
                setShowModalSettlementVAUSDPertner(false)
            } else if (acceptedSettlement.status === 200 && acceptedSettlement.data.response_code === 200 && acceptedSettlement.data.response_new_token !== null) {
                setUserSession(acceptedSettlement.data.response_new_token)
                getListSettlementRequestVAUSDPartner(activePageSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.idSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner, dateRangeRequestSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner, dateRangeTerimaSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.statusSettlementVAUSDPartner)
                setShowModalSettlementVAUSDPertner(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    // PARTNER FUNCTION END

    useEffect(() => {
        if (user_role !== "102") {
            getListMerchant()
            getListPengajuanSettlementVAUSDAdmin(activePagePengajuanSettlementVAUSDAdmin, inputHandlePengajuanSettlementVAUSDAdmin.idSettlementPengajuanSettlementVAUSDAdmin, selectedPengajuanMerchantVAUSDAdmin.length !== 0 ? selectedPengajuanMerchantVAUSDAdmin[0].value : "", inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin, dateRangePengajuanSettlementVAUSDAdmin)
        } else{
            getUserDataSettlementPartner(language === null ? 'EN' : language.flagName)
            getListSettlementRequestVAUSDPartner(activePageSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.idSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner, dateRangeRequestSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner, dateRangeTerimaSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.statusSettlementVAUSDPartner)
        }
    }, [])

    function pindahHalaman(param) {
        if (param === "pengajuan") {
            resetButtonPengajuanSettlementVAUSDAdminHandle()
            resetButtonRiwayatSettlementVAUSDAdminHandle()
            getListPengajuanSettlementVAUSDAdmin(activePagePengajuanSettlementVAUSDAdmin, inputHandlePengajuanSettlementVAUSDAdmin.idSettlementPengajuanSettlementVAUSDAdmin, selectedPengajuanMerchantVAUSDAdmin.length !== 0 ? selectedPengajuanMerchantVAUSDAdmin[0].value : "", inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin, dateRangePengajuanSettlementVAUSDAdmin)
            settlementVAUSDTabs(100)
        } else if (param === "riwayat") {
            resetButtonPengajuanSettlementVAUSDAdminHandle()
            resetButtonRiwayatSettlementVAUSDAdminHandle()
            getListRiwayatSettlementVAUSDAdmin(1, inputHandleRiwayatSettlementVAUSDAdmin.idSettlementRiwayatSettlementVAUSDAdmin, selectedRiwayatMerchantVAUSDAdmin.length !== 0 ? selectedRiwayatMerchantVAUSDAdmin[0].value : "", inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin, dateRangePengajuanRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin, dateRangeTerimaRiwayatSettlementVAUSDAdmin)
            settlementVAUSDTabs(101)
        }
    }

    function settlementVAUSDTabs(isTabs){
        setIsSettlementVAUSD(isTabs)
        if (isTabs === 100) {
            $('#riwayatTab').removeClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').removeClass('menu-detail-akun-span-active')
            $('#pengajuanTab').addClass('menu-detail-akun-hr-active')
            $('#pengajuanSpan').addClass('menu-detail-akun-span-active')
        } else if (isTabs === 101) {
            $('#pengajuanTab').removeClass('menu-detail-akun-hr-active')
            $('#pengajuanSpan').removeClass('menu-detail-akun-span-active')
            $('#riwayatTab').addClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').addClass('menu-detail-akun-span-active')
        }
    }

    const columnsPengajuanSettlementVAUSDAdmin = [
        {
            name: 'No',
            selector: row => row.No,
            width: "3%",
            wrap: true,
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Settlement',
            selector: row => row.code,
            width: "150px",
            wrap: true,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
            // sortable: true
        },
        {
            name: 'Nama merchant',
            selector: row => row.partner_name,
            // sortable: true,
            wrap: true,
            width: "170px",
        },
        {
            name: 'Tanggal pengajuan',
            selector: row => row.request_date !== undefined ? row.request_date : "-",
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        // {
        //     name: 'Tanggal terima',
        //     selector: row => row.accept_date,
        //     // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
        //     wrap: true,
        //     width: "180px"
        // },
        {
            name: 'Bank Tujuan',
            selector: row => row.destination_bank,
            // sortable: true,
            wrap: true,
            width: "170px",
        },
        {
            name: 'Nomor rekening',
            selector: row => row.account_number,
            // sortable: true,
            // width: "175px"
            wrap: true,
            width: "170px",
        },
        {
            name: 'Nama pemilik rekening',
            selector: row => row.account_name,
            // sortable: true,
            wrap: true,
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.request_amount, false, 2)}` }</div>,
            width: "220px",
        },
        {
            name: 'Saldo merchant',
            selector: row => row.balance_before,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `${row.currency} ${convertToRupiah(row.balance_before, false, 2)}` }</div>,
            width: "175px"
        },
        {
            name: 'Nominal pengajuan',
            selector: row => row.request,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `${row.currency} ${convertToRupiah(row.request, false, 2)}` }</div>,
            width: "200px"
        },
        {
            name: 'Biaya',
            selector: row => row.fee,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `${row.currency} ${convertToRupiah(row.fee, false, 2)}` }</div>,
            wrap: true,
            width: "150px"
        },
        {
            name: 'Total settlement',
            selector: row => row.total,
            width: "170px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `${row.currency} ${convertToRupiah(row.total, false, 2)}` }</div>,
            // style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Sisa saldo',
            selector: row => row.balance_after,
            width: "170px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `${row.currency} ${convertToRupiah(row.balance_after, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Konfirmasi settlement',
            // selector: row => row.settled_amount,
            width: "250px",
            // sortable: true
            cell: row => (
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center" }}>
                    <button
                        style={{
                            fontFamily: "Exo",
                            fontSize: 16,
                            fontWeight: 900,
                            alignItems: "center",
                            padding: "12px 24px",
                            gap: 8,
                            width: 136,
                            height: 45,
                            background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                            border: "0.6px solid #2C1919",
                            borderRadius: 6,
                        }}
                        onClick={() => {
                            setDataModalPengajuanSettlementVAUSDAdmin({
                                ...dataModalPengajuanSettlementVAUSDAdmin,
                                idSettlementModal: row.code,
                                namaMerchantModal: row.partner_name,
                                currencyModal: row.currency,
                                totalSettleModal: row.total
                            })
                            // dataModalPengajuanSettlementVAUSDAdmin.idSettlementModal(row.code);
                            // dataModalPengajuanSettlementVAUSDAdmin.namaMerchantModal(row.partner_name);
                            // dataModalPengajuanSettlementVAUSDAdmin.currencyModal(row.currency);
                            // dataModalPengajuanSettlementVAUSDAdmin.totalSettleModal(row.total);
                            setShowModalPengajuanSettlementVAUSDAdmin(true);}}
                    >
                        Settle
                    </button>
                </div>
            ),
            style: { display: "flex", flexDirection: "row", justifyContent: "center", }
        },
    ];

    const columnsRiwayatSettlementVAUSDAdmin = [
        {
            name: 'No',
            selector: row => row.No,
            width: "3%",
            wrap: true,
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Settlement',
            selector: row => row.code,
            width: "150px",
            wrap: true,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
            // sortable: true
        },
        {
            name: 'Nama merchant',
            selector: row => row.partner_name,
            // sortable: true,
            wrap: true,
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.request_amount, false, 2)}` }</div>,
            width: "200px",
        },
        {
            name: 'Tanggal pengajuan',
            selector: row => row.request_date !== undefined ? row.request_date : "-",
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Tanggal terima',
            selector: row => row.accept_date,
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.destination_bank,
            // sortable: true,
            wrap: true,
            width: "170px",
        },
        {
            name: 'Nomor rekening',
            selector: row => row.account_number,
            // sortable: true,
            // width: "175px"
            wrap: true,
            width: "175px",
        },
        {
            name: 'Nama pemilik rekening',
            selector: row => row.account_name,
            // sortable: true,
            wrap: true,
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.request_amount, false, 2)}` }</div>,
            width: "220px",
        },
        {
            name: 'Nominal pengajuan',
            selector: row => row.request,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `${row.currency} ${convertToRupiah(row.request, false, 2)}` }</div>,
            width: "200px"
        },
        {
            name: 'Biaya',
            selector: row => row.fee,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `${row.currency} ${convertToRupiah(row.fee, false, 2)}` }</div>,
            wrap: true,
            width: "170px"
        },
        {
            name: 'Total settlement',
            selector: row => row.total,
            width: "200px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `${row.currency} ${convertToRupiah(row.total, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            width: "170px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 3,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.status_id === 1 || row.status_id === 2,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
            ],
        },
    ];

    const columnsSettlementVAUSDPartner = [
        {
            name: 'No',
            selector: row => row.number,
            width: "3%",
            wrap: true,
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Settlement',
            selector: row => row.withdraw_code,
            width: "150px",
            wrap: true,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
            // sortable: true
        },
        {
            name: 'Tanggal pengajuan',
            selector: row => row.withdraw_trans_date !== undefined ? row.withdraw_trans_date : "-",
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Tanggal terima',
            selector: row => row.withdraw_accept_date,
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.bank_name,
            // sortable: true,
            wrap: true,
            width: "170px",
        },
        {
            name: 'Nomor rekening',
            selector: row => row.acc_number,
            // sortable: true,
            width: "175px",
            wrap: true,
            // width: "150px",
        },
        {
            name: 'Nama pemilik rekening',
            selector: row => row.acc_name,
            // sortable: true,
            wrap: true,
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.request_amount, false, 2)}` }</div>,
            width: "230px",
        },
        {
            name: 'Nominal pengajuan',
            selector: row => row.amount,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `${row.currency} ${convertToRupiah(row.amount, false, 2)}` }</div>,
            width: "200px"
        },
        {
            name: 'Biaya',
            selector: row => row.settlement_fee,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `${row.currency} ${convertToRupiah(row.settlement_fee, false, 2)}` }</div>,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Total settlement',
            selector: row => row.total_amount,
            width: "170px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `${row.currency} ${convertToRupiah(row.total_amount, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            width: "170px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 3,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.status_id === 1 || row.status_id === 2,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                // {
                //     when: row => row.status_id === 4 || row.status_id === 9 || row.status_id === 13,
                //     style: { background: "#FDEAEA", color: "#EE2E2C", }
                // },
                // {
                //     when: row => row.status_id === 3 || row.status_id === 5 || row.status_id === 6 || row.status_id === 8 || row.status_id === 10 || row.status_id === 14 || row.status_id === 15,
                //     style: { background: "#F0F0F0", color: "#888888", }
                // }
            ],
        },
        {
            name: 'Konfirmasi diterima',
            // selector: row => row.settled_amount,
            width: "190px",
            // sortable: true
            cell: row => (
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center" }}>
                    {
                        Number(row.status_id) === 2 &&
                        <button
                            className={"btn-ez-on"}
                            onClick={() => {setWithdrawCodeSettlementVAUSDPartner(row.withdraw_code); setShowModalSettlementVAUSDPertner(true)}}
                            // onClick={() => filterDisbursement(1, inputHandle.statusDisbursement, inputHandle.idTransaksiDisbursement, selectedPaymentDisbursement.length !== 0 ? selectedPaymentDisbursement[0].value : "", selectedPartnerDisbursement.length !== 0 ? selectedPartnerDisbursement[0].value : "", inputHandle.periodeDisbursement, dateRangeDisbursement, inputHandle.partnerTransId, inputHandle.referenceNo, 0, language === null ? 'EN' : language.flagName)}
                            // disabled={inputHandle.periodeDisbursement === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.idTransaksiDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.statusDisbursement.length === 0 || inputHandle.periodeDisbursement === 0 && inputHandle.referenceNo.length === 0}
                        >
                            Diterima
                        </button>
                    }
                </div>
            ),
            style: { display: "flex", flexDirection: "row", justifyContent: "center", }
        },
    ];

    const customStylesSettlementVAUSD = {
        headCells: {
            style: {
                width: 'max-content',
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

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Settlement</span>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; VA USD</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Settlement VA USD</h2>
            </div>
            {
                user_role !== "102" ?
                    <div className='base-content pb-4'>
                        <div className='detail-akun-menu' style={{fontFamily: "Exo", display: 'flex', height: 33}}>
                            <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => pindahHalaman("pengajuan")} id="pengajuanTab">
                                <span className='menu-detail-akun-span menu-detail-akun-span-active' id="pengajuanSpan">Pengajuan Settlement</span>
                            </div>
                            <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("riwayat")} id="riwayatTab">
                                <span className='menu-detail-akun-span' id="riwayatSpan">Riwayat Settlement</span>
                            </div>
                        </div>
                        <hr className='hr-style mb-4' style={{marginTop: -2}}/>
                        {
                            isSettlementVAUSD === 100 ?
                                <>
                                    <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                                    <Row className='mt-4'>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: (showDatePengajuanSettlementVAUSDAdmin === "none") ? "33%" : "33%" }}>
                                            <span className="me-3">Periode Pengajuan <span style={{ color: "red" }}>*</span></span>
                                            <Form.Select name='periodePengajuanSettlementVAUSDAdmin' className="input-text-riwayat ms-4" value={inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin} onChange={handleChangePeriodePengajuanSettlementVAUSDAdmin}>
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
                                            <span style={{ marginRight: 64 }}>ID Settlement</span>
                                            <input onChange={(e) => setInputHandlePengajuanSettlementVAUSDAdmin({ ...inputHandlePengajuanSettlementVAUSDAdmin, [e.target.name]: e.target.value })} value={inputHandlePengajuanSettlementVAUSDAdmin.idSettlementPengajuanSettlementVAUSDAdmin} name="idSettlementPengajuanSettlementVAUSDAdmin" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan ID Settlement'/>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                                            <span style={{ marginRight: 32 }}>Nama Merchant</span>
                                            <div className="dropdown dropDisbursePartner" style={{ width: "12rem" }}>
                                                <ReactSelect
                                                    // isMulti
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={listMerchant}
                                                    // allowSelectAll={true}
                                                    value={selectedPengajuanMerchantVAUSDAdmin}
                                                    onChange={(selected) => setSelectedPengajuanMerchantVAUSDAdmin([selected])}
                                                    placeholder="Pilih Nama Merchant"
                                                    components={{ Option }}
                                                    styles={customStylesSelectedOption}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={4} style={{ display: showDatePengajuanSettlementVAUSDAdmin }} className='text-end pe-3'>
                                            <DateRangePicker
                                                onChange={pickDatePengajuanSettlementVAUSDAdmin}
                                                value={statePengajuanSettlementVAUSDAdmin}
                                                clearIcon={null}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={5}>
                                            <Row>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        onClick={() => getListPengajuanSettlementVAUSDAdmin(1, inputHandlePengajuanSettlementVAUSDAdmin.idSettlementPengajuanSettlementVAUSDAdmin, selectedPengajuanMerchantVAUSDAdmin.lenght !== 0 ? selectedPengajuanMerchantVAUSDAdmin[0].value : "", inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin, dateRangePengajuanSettlementVAUSDAdmin)}
                                                        className={(inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 0 || (inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 7 && dateRangePengajuanSettlementVAUSDAdmin.length === 0)) ? "btn-ez" : "btn-ez-on"}
                                                        disabled={(inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 0 || (inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 7 && dateRangePengajuanSettlementVAUSDAdmin.length === 0))}
                                                    >
                                                        Terapkan
                                                    </button>
                                                </Col>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        onClick={resetButtonPengajuanSettlementVAUSDAdminHandle}
                                                        className={(inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 0 || (inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 7 && dateRangePengajuanSettlementVAUSDAdmin.length === 0)) ? "btn-ez-reset" : "btn-reset"}
                                                        disabled={(inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 0 || (inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 7 && dateRangePengajuanSettlementVAUSDAdmin.length === 0))}
                                                    >
                                                        Atur Ulang
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {
                                        listPengajuanSettlementVAUSDAdmin.length !== 0 &&
                                        <div style={{ marginBottom: 30 }}>
                                            <Link to={"#"} onClick={() => exportReportPengajuanSettlementVAUSDAdminHandler(inputHandlePengajuanSettlementVAUSDAdmin.idSettlementPengajuanSettlementVAUSDAdmin, selectedPengajuanMerchantVAUSDAdmin.lenght !== 0 ? selectedPengajuanMerchantVAUSDAdmin[0].value : "", inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin, dateRangePengajuanSettlementVAUSDAdmin)} className="export-span">Export</Link>
                                        </div>
                                    }
                                    <div className="div-table mt-4 pb-4">
                                        <DataTable
                                            columns={columnsPengajuanSettlementVAUSDAdmin}
                                            data={listPengajuanSettlementVAUSDAdmin}
                                            customStyles={customStylesSettlementVAUSD}
                                            noDataComponent={'Tidak ada data'}
                                            highlightOnHover
                                            progressPending={pendingPengajuanSettlementVAUSDAdmin}
                                            progressComponent={<CustomLoader />}
                                        />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Halaman : {totalPagePengajuanSettlementVAUSDAdmin}</div>
                                        <Pagination
                                            activePage={activePagePengajuanSettlementVAUSDAdmin}
                                            itemsCountPerPage={pageNumberPengajuanSettlementVAUSDAdmin.row_per_page}
                                            totalItemsCount={(pageNumberPengajuanSettlementVAUSDAdmin.row_per_page*pageNumberPengajuanSettlementVAUSDAdmin.max_page)}
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={handlePageChangePengajuanSettlementVAUSDAdmin}
                                        />
                                    </div>
                                    {/* Modal Lakukan Settlement data VA */}
                                    <Modal size="xs" className='py-3' centered show={showModalPengajuanSettlementVAUSDAdmin} onHide={() => setShowModalPengajuanSettlementVAUSDAdmin(false)}>
                                        <Modal.Title className='text-center mt-4 px-3' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                                            {`Lakukan Settlement ${dataModalPengajuanSettlementVAUSDAdmin.idSettlementModal} ke ${dataModalPengajuanSettlementVAUSDAdmin.namaMerchantModal} ?`}
                                        </Modal.Title>
                                        <Modal.Body >
                                            <div className='text-center px-2' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>
                                                {`Nominal Sebesar ${dataModalPengajuanSettlementVAUSDAdmin.currencyModal} ${dataModalPengajuanSettlementVAUSDAdmin.totalSettleModal} akan disettle kepada merchant dan mengurangi sisa saldo merchant`}
                                            </div>
                                            <div className='mt-3' style={{ fontSize: 14, fontWeight: 400 }}>
                                                Upload bukti transfer (maks: 500kb)
                                            </div>
                                            <div className='mt-2 position-relative' style={{ marginBottom: 75 }}>
                                                <FilePond
                                                    className="dragdropSettlementVAUSD"
                                                    files={files}
                                                    onupdatefiles={(newFile) => fileUpload(newFile)}
                                                    // onaddfile={addFile}
                                                    // allowMultiple={true}
                                                    // maxFiles={3}
                                                    server="/api"
                                                    name="files"
                                                    labelIdle={labelUpload}
                                                />
                                            </div>
                                            <div className='mt-2 position-relative'>
                                                Nomor referensi bank
                                            </div>
                                            <div>
                                                <input onChange={(e) => setDataModalPengajuanSettlementVAUSDAdmin({ ...dataModalPengajuanSettlementVAUSDAdmin, [e.target.name]: e.target.value})} value={dataModalPengajuanSettlementVAUSDAdmin.nomorReferensiBank} name="nomorReferensiBank" type='text' className='input-text-ez mt-1' style={{ width: "100%", marginLeft: "unset" }} placeholder='Masukkan nomor referensi bank'/>
                                            </div>
                                            <div className='d-flex justify-content-center align-items-center mt-3'>
                                                <div className='me-1'>
                                                    <button
                                                        onClick={() => setShowModalPengajuanSettlementVAUSDAdmin(false)}
                                                        style={{
                                                            fontFamily: "Exo",
                                                            fontSize: 16,
                                                            fontWeight: 900,
                                                            alignItems: "center",
                                                            padding: "12px 24px",
                                                            gap: 8,
                                                            width: 136,
                                                            height: 45,
                                                            background: "#FFFFFF",
                                                            color: "#888888",
                                                            border: "0.6px solid #EBEBEB",
                                                            borderRadius: 6,
                                                        }}
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                                <div className="ms-1">
                                                    <button
                                                        onClick={() => uploadReceiptSettlement(dataModalPengajuanSettlementVAUSDAdmin.idSettlementModal, dataImageUploadPengajuanSettlementVAUSDAdmin, files, dataModalPengajuanSettlementVAUSDAdmin.nomorReferensiBank)}
                                                        style={{
                                                            fontFamily: "Exo",
                                                            fontSize: 16,
                                                            fontWeight: 900,
                                                            alignItems: "center",
                                                            padding: "12px 24px",
                                                            gap: 8,
                                                            width: 136,
                                                            height: 45,
                                                            background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                                            border: "0.6px solid #2C1919",
                                                            borderRadius: 6,
                                                        }}
                                                    >
                                                        Settle
                                                    </button>
                                                </div>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                </>
                            :
                                <>
                                    <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                                    <Row className='mt-4'>
                                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                                            <span style={{ marginRight: 64 }}>ID Settlement</span>
                                            <input onChange={(e) => setInputHandleRiwayatSettlementVAUSDAdmin({ ...inputHandleRiwayatSettlementVAUSDAdmin, [e.target.name]: e.target.value })} value={inputHandleRiwayatSettlementVAUSDAdmin.idSettlementRiwayatSettlementVAUSDAdmin} name="idSettlementRiwayatSettlementVAUSDAdmin" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan ID Settlement'/>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                                            <span style={{ marginRight: 32 }}>Nama Merchant</span>
                                            <div className="dropdown dropDisbursePartner" style={{ width: "12rem" }}>
                                                <ReactSelect
                                                    // isMulti
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={listMerchant}
                                                    // allowSelectAll={true}
                                                    value={selectedRiwayatMerchantVAUSDAdmin}
                                                    onChange={(selected) => setSelectedRiwayatMerchantVAUSDAdmin([selected])}
                                                    placeholder="Pilih Nama Merchant"
                                                    components={{ Option }}
                                                    styles={customStylesSelectedOption}
                                                />
                                            </div>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                                            <span style={{ marginRight: 32 }}>Status</span>
                                            <Form.Select name="statusRiwayatSettlementVAUSDAdmin" className='input-text-riwayat ms-5' style={{ display: "inline" }} value={inputHandleRiwayatSettlementVAUSDAdmin.statusRiwayatSettlementVAUSDAdmin} onChange={(e) => setInputHandleRiwayatSettlementVAUSDAdmin({ ...inputHandleRiwayatSettlementVAUSDAdmin, [e.target.name]: e.target.value })}>
                                                <option defaultChecked disabled value={0}>Pilih Status</option>
                                                <option value={2}>Ditransfer</option>
                                                <option value={3}>Diterima</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: (showDatePengajuanRiwayatSettlementVAUSDAdmin === "none") ? "33%" : "33%" }}>
                                            <span className="me-3">Periode Pengajuan <span style={{ color: "red" }}>*</span></span>
                                            <Form.Select name='periodePengajuanRiwayatSettlementVAUSDAdmin' className="input-text-riwayat ms-4" value={inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin} onChange={handleChangePeriodePengajuanRiwayatSettlementVAUSDAdmin}>
                                                <option defaultChecked disabled value={0}>Pilih Periode</option>
                                                <option value={2}>Hari Ini</option>
                                                <option value={3}>Kemarin</option>
                                                <option value={4}>7 Hari Terakhir</option>
                                                <option value={5}>Bulan Ini</option>
                                                <option value={6}>Bulan Kemarin</option>
                                                <option value={7}>Pilih Range Tanggal</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: (showDateTerimaRiwayatSettlementVAUSDAdmin === "none") ? "33%" : "33%" }}>
                                            <span className="me-3">Periode Terima <span style={{ color: "red" }}>*</span></span>
                                            <Form.Select name='periodeTerimaRiwayatSettlementVAUSDAdmin' className="input-text-riwayat ms-4" value={inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin} onChange={handleChangePeriodeTerimaRiwayatSettlementVAUSDAdmin}>
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
                                        <Col xs={4} style={{ display: showDatePengajuanRiwayatSettlementVAUSDAdmin }} className='text-end pe-3'>
                                            <DateRangePicker
                                                onChange={pickDatePengajuanRiwayatSettlementVAUSDAdmin}
                                                value={statePengajuanRiwayatSettlementVAUSDAdmin}
                                                clearIcon={null}
                                            />
                                        </Col>
                                        <Col xs={4} style={{ display: showDateTerimaRiwayatSettlementVAUSDAdmin }} className='text-end pe-3'>
                                            <DateRangePicker
                                                onChange={pickDateTerimaRiwayatSettlementVAUSDAdmin}
                                                value={stateTerimaRiwayatSettlementVAUSDAdmin}
                                                clearIcon={null}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={5}>
                                            <Row>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        onClick={() => getListRiwayatSettlementVAUSDAdmin(1, inputHandleRiwayatSettlementVAUSDAdmin.idSettlementRiwayatSettlementVAUSDAdmin, selectedRiwayatMerchantVAUSDAdmin.length !== 0 ? selectedRiwayatMerchantVAUSDAdmin[0].value : "", inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin, dateRangePengajuanRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin, dateRangeTerimaRiwayatSettlementVAUSDAdmin)}
                                                        className={
                                                            ((inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length === 0)) && (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length !== 0))) ||
                                                            ((inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length !== 0)) && (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length === 0)))
                                                            // (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length === 0) ||
                                                            // inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length === 0))
                                                            ? "btn-ez" : "btn-ez-on"
                                                        }
                                                        disabled={
                                                            ((inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length === 0)) && (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length !== 0))) ||
                                                            ((inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length !== 0)) && (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length === 0)))
                                                            // (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length === 0) ||
                                                            // inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length === 0))
                                                        }
                                                    >
                                                        Terapkan
                                                    </button>
                                                </Col>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        onClick={resetButtonRiwayatSettlementVAUSDAdminHandle}
                                                        className={
                                                            ((inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length === 0)) && (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length !== 0))) ||
                                                            ((inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length !== 0)) && (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length === 0)))
                                                            // (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length === 0))
                                                            // ((inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeRequestSettlementVAUSDPartner.length !== 0)) && (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 7 && dateRangeTerimaSettlementVAUSDPartner.length === 0)))
                                                            ? "btn-ez-reset" : "btn-reset"
                                                        }
                                                        disabled={
                                                            ((inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length === 0)) && (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length !== 0))) ||
                                                            ((inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length !== 0)) && (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length === 0)))
                                                            // (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length === 0) ||
                                                            // inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length === 0))
                                                        }
                                                    >
                                                        Atur Ulang
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {
                                        listRiwayatSettlementVAUSDAdmin.length !== 0 &&
                                        <div style={{ marginBottom: 30 }}>
                                            <Link to={"#"} onClick={() => exportReportRiwayatSettlementVAUSDAdminHandler(inputHandleRiwayatSettlementVAUSDAdmin.idSettlementRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.namaMerchantRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin, dateRangePengajuanRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin, dateRangeTerimaRiwayatSettlementVAUSDAdmin)} className="export-span">{language === null ? eng.export : language.export}</Link>
                                        </div>
                                    }
                                    <div className="div-table mt-4 pb-4">
                                        <DataTable
                                            columns={columnsRiwayatSettlementVAUSDAdmin}
                                            data={listRiwayatSettlementVAUSDAdmin}
                                            customStyles={customStylesSettlementVAUSD}
                                            noDataComponent={'Tidak ada data'}
                                            highlightOnHover
                                            progressPending={pendingRiwayatSettlementVAUSDAdmin}
                                            progressComponent={<CustomLoader />}
                                        />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Halaman : {totalPageRiwayatSettlementVAUSDAdmin}</div>
                                        <Pagination
                                            activePage={activePageRiwayatSettlementVAUSDAdmin}
                                            itemsCountPerPage={pageNumberRiwayatSettlementVAUSDAdmin.row_per_page}
                                            totalItemsCount={(pageNumberRiwayatSettlementVAUSDAdmin.row_per_page*pageNumberRiwayatSettlementVAUSDAdmin.max_page)}
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={handlePageChangeRiwayatSettlementVAUSDAdmin}
                                        />
                                    </div>
                                </>
                        }
                    </div>
                :
                    <>
                        <div className='base-content pb-4'>
                            <div className='ms-3'>
                                <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Ajukan Settlement VA USD</span>
                                <Row className='d-flex justify-content-start'>
                                    <Col xs={3} className="card-information mt-3" style={{border: '1px solid #EBEBEB', height: 'fit-content', padding: '12px 0px 12px 16px'}}>
                                        <div className="p-info" style={{ width: "auto" }}>Jumlah Saldo</div>
                                        <div style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700, paddingRight: 20, marginTop: 5 }}>{`USD ${convertToRupiah(ballanceSettlementVAUSDPartner?.USD?.balance !== undefined ? ballanceSettlementVAUSDPartner?.USD?.balance : 0, false, 2)}`}</div>
                                        {
                                            isCurrencySettlementVAUSDPartner === "IDR" &&
                                            <div style={{ fontFamily: "Nunito", fontSize: 12, paddingRight: 20, marginTop: 5 }}>
                                            <span style={{ fontWeight: 400 }}>Konversi IDR: </span><span style={{ fontWeight: 600 }}>{`IDR ${convertToRupiah(ballanceSettlementVAUSDPartner?.IDR?.balance, false, 2)}`}</span>
                                            </div>
                                        }
                                    </Col>
                                </Row>
                            </div>
                            <table style={{ width: "100%", marginLeft: "unset" }} className="table-form mt-4">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td style={{ width: 200 }}>Mata Uang</td>
                                        <Row className='ms-1'>
                                            <Col xs={1}>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="inlineCheckbox1"
                                                        name={"USD"}
                                                        value={"USD"}
                                                        onChange={(e) => {
                                                            setIsCurrencySettlementVAUSDPartner(e.target.value);
                                                            setNominalPengajuanSettlementVAUSDPartner("0");
                                                            setSisaSaldoSettlementVAUSDPartner(ballanceSettlementVAUSDPartner?.USD?.balance !== undefined ? ballanceSettlementVAUSDPartner?.USD?.balance : 0);
                                                            setTotalSettlementVAUSDPartner(0)
                                                        }}
                                                        checked={isCurrencySettlementVAUSDPartner !== "USD" ? false : true}
                                                        // checked={edited === true ? fitur[0] : inputHandle.fiturs ? inputHandle.fiturs : 0}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        style={{ fontWeight: 400, fontSize: "14px" }}
                                                        for="inlineCheckbox1"
                                                    >
                                                        USD
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col xs={1}>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="inlineCheckbox1"
                                                        name={"IDR"}
                                                        value={"IDR"}
                                                        onChange={(e) => {
                                                            setIsCurrencySettlementVAUSDPartner(e.target.value);
                                                            setNominalPengajuanSettlementVAUSDPartner("0");
                                                            setSisaSaldoSettlementVAUSDPartner(ballanceSettlementVAUSDPartner?.IDR?.balance)
                                                            setTotalSettlementVAUSDPartner(0)
                                                        }}
                                                        checked={isCurrencySettlementVAUSDPartner !== "IDR" ? false : true}
                                                        // checked={edited === true ? fitur[0] : inputHandle.fiturs ? inputHandle.fiturs : 0}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        style={{ fontWeight: 400, fontSize: "14px" }}
                                                        for="inlineCheckbox1"
                                                    >
                                                        IDR
                                                    </label>
                                                </div>
                                            </Col>
                                        </Row>
                                    </tr>
                                    {
                                        isCurrencySettlementVAUSDPartner !== "USD" &&
                                        <tr>
                                            <td style={{ width: 200 }}></td>
                                            <Row className='ms-1'>
                                                <Col>
                                                    <div className="form-check form-check-inline" style={{ paddingLeft: "unset" }}>
                                                        <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 700, textDecorationLine: "underline", color: "var(--contoh-secondary-40-warna-utama, #077E86)", paddingRight: 20, marginTop: 5 }}>USD 1 = IDR {convertToRupiah(ballanceSettlementVAUSDPartner?.one_usd_to_idr, false, 2)}</div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </tr>
                                    }
                                    <br />
                                    <tr>
                                        <td>Bank Tujuan</td>
                                        <td>
                                            <div className="dropdown dropDisbursePartner" style={{ width: "100%" }}>
                                                <ReactSelect
                                                    // isMulti
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={listBank}
                                                    // allowSelectAll={true}
                                                    value={selectedBankSettlementVAUSDPartner}
                                                    onChange={(selected) => setSelectedBankSettlementVAUSDPartner([selected])}
                                                    placeholder="Pilih Nama Bank"
                                                    components={{ Option }}
                                                    styles={customStylesSelectedOption}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>Nomor Rekening</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input-text-ez"
                                                value={nomorRekeningSettlementVAUSDPartner}
                                                placeholder='Masukan no rekening'
                                                name="nomorRekeningSettlementVAUSDPartner"
                                                style={{ width: "100%", marginLeft: "unset" }}
                                                onChange={(e) => setNomorRekeningSettlementVAUSDPartner(e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>Nama Pemilik Rekening</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input-text-ez"
                                                value={namaPemilikRekeningSettlementVAUSDPartner}
                                                placeholder='Masukan nama pemilik rekening'
                                                name="namaPemilikRekeningSettlementVAUSDPartner"
                                                style={{ width: "100%", marginLeft: "unset" }}
                                                onChange={(e) => setNamaPemilikRekeningSettlementVAUSDPartner(e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>Nominal Pengajuan</td>
                                        <td>
                                            <CurrencyInput
                                                className="input-text-user"
                                                value={nominalPengajuanSettlementVAUSDPartner}
                                                onValueChange={(e) => nominalPengajuanHandle(e)}
                                                placeholder="0"
                                                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600, color: "#383838" }}
                                                groupSeparator={"."}
                                                decimalSeparator={','}
                                                prefix={`${isCurrencySettlementVAUSDPartner} `}
                                                // maxLength={biayaHandle.feeType === 101 ? 3 : false}
                                                // suffix={biayaHandle.feeType === 0 || biayaHandle.feeType === 100 ? "" : "%"}
                                            />
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>Biaya Settlement</td>
                                        <td>
                                            <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, color: "#B9121B" }}>- {isCurrencySettlementVAUSDPartner} {isCurrencySettlementVAUSDPartner !== "USD" ? convertToRupiah(ballanceSettlementVAUSDPartner?.IDR?.fee, false, 2) : ballanceSettlementVAUSDPartner?.USD?.fee}</div>
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>Total Settlement</td>
                                        <td>
                                            {/* <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 700 }}>{isCurrencySettlementVAUSDPartner} 0</div> */}
                                            <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 700 }}>{isCurrencySettlementVAUSDPartner} {convertToRupiah(totalSettlementVAUSDPartner, false, 2)}</div>
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>Sisa Saldo</td>
                                        <td>
                                            <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 700 }}>{isCurrencySettlementVAUSDPartner} {convertToRupiah(sisaSaldoSettlementVAUSDPartner, false, 2)}</div>
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>
                                            <button
                                                onClick={() => submitSettlementVAUSDPartner(namaPemilikRekeningSettlementVAUSDPartner, nomorRekeningSettlementVAUSDPartner, isCurrencySettlementVAUSDPartner, selectedBankSettlementVAUSDPartner[0].value, Number(nominalPengajuanSettlementVAUSDPartner !== undefined ? nominalPengajuanSettlementVAUSDPartner : 0))}
                                                className={(selectedBankSettlementVAUSDPartner.length === 0) || (nomorRekeningSettlementVAUSDPartner.length === 0) || (namaPemilikRekeningSettlementVAUSDPartner.length === 0) || (nominalPengajuanSettlementVAUSDPartner === undefined || Number(nominalPengajuanSettlementVAUSDPartner) === 0) ? 'btn-ez' : 'btn-ez-on'}
                                                disabled={(selectedBankSettlementVAUSDPartner.length === 0) || (nomorRekeningSettlementVAUSDPartner.length === 0) || (namaPemilikRekeningSettlementVAUSDPartner.length === 0) || (nominalPengajuanSettlementVAUSDPartner === undefined || Number(nominalPengajuanSettlementVAUSDPartner) === 0)}
                                                // disabled={(nominalPengajuanSettlementVAUSDPartner === undefined || Number(nominalPengajuanSettlementVAUSDPartner) === 0)}
                                            >
                                                Ajukan
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='base-content my-4 pb-5'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>{language === null ? eng.filter : language.filter}</span>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span style={{ marginRight: 64 }}>ID Transaksi</span>
                                    <input onChange={(e) => handleChangeSettlementVAUSDPartner(e)} value={inputHandleSettlementVAUSDPartner.idSettlementVAUSDPartner} name="idSettlementVAUSDPartner" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan ID Settlement'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: (showDateRequestSettlementVAUSDPartner === "none") ? "33%" : "33%" }}>
                                    <span className="me-3">Periode Request<span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periodeRequestSettlementVAUSDPartner' className="input-text-riwayat ms-5" value={inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner} onChange={(e) => handleChangePeriodeSettlementVAUSDPartner(e, "request")}>
                                        <option defaultChecked disabled value={0}>{language === null ? eng.pilihPeriode : language.pilihPeriode}</option>
                                        <option value={2}>{language === null ? eng.hariIni : language.hariIni}</option>
                                        <option value={3}>{language === null ? eng.kemarin : language.kemarin}</option>
                                        <option value={4}>{language === null ? eng.tujuhHariTerakhir : language.tujuhHariTerakhir}</option>
                                        <option value={5}>{language === null ? eng.bulanIni : language.bulanIni}</option>
                                        <option value={6}>{language === null ? eng.bulanKemarin : language.bulanKemarin}</option>
                                        <option value={7}>{language === null ? eng.pilihRangeTanggal : language.pilihRangeTanggal}</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span className='me-5'>Status</span>
                                        <Form.Select name="statusSettlementVAUSDPartner" className='input-text-ez' style={{ display: "inline" }} value={inputHandleSettlementVAUSDPartner.statusSettlementVAUSDPartner} onChange={(e) => handleChangeSettlementVAUSDPartner(e)}>
                                            <option defaultChecked disabled value="">Pilih Status</option>
                                            <option value={1}>Diminta</option>
                                            <option value={2}>Ditransfer</option>
                                            <option value={3}>Diterima</option>
                                            {/* <option value={7}>Menunggu Pembayaran</option> */}
                                            {/* <option value={9}>Kadaluwarsa</option> */}
                                        </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: (showDateTerimaSettlementVAUSDPartner === "none") ? "33%" : "33%" }}>
                                    <span className="me-3">Periode Terima<span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periodeTerimaSettlementVAUSDPartner' className="input-text-riwayat ms-5" value={inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner} onChange={(e) => handleChangePeriodeSettlementVAUSDPartner(e, "terima")}>
                                        <option defaultChecked disabled value={0}>{language === null ? eng.pilihPeriode : language.pilihPeriode}</option>
                                        <option value={2}>{language === null ? eng.hariIni : language.hariIni}</option>
                                        <option value={3}>{language === null ? eng.kemarin : language.kemarin}</option>
                                        <option value={4}>{language === null ? eng.tujuhHariTerakhir : language.tujuhHariTerakhir}</option>
                                        <option value={5}>{language === null ? eng.bulanIni : language.bulanIni}</option>
                                        <option value={6}>{language === null ? eng.bulanKemarin : language.bulanKemarin}</option>
                                        <option value={7}>{language === null ? eng.pilihRangeTanggal : language.pilihRangeTanggal}</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} style={{ display: showDateRequestSettlementVAUSDPartner }} className='text-start ps-5'>
                                    <DateRangePicker
                                        onChange={(page) => pickDateVAUSDPartner(page, "request")}
                                        value={stateRequestSettlementVAUSDPartner}
                                        clearIcon={null}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} style={{ display: showDateTerimaSettlementVAUSDPartner }} className='text-start ps-5'>
                                    <DateRangePicker
                                        onChange={(page) => pickDateVAUSDPartner(page, "terima")}
                                        value={stateTerimaSettlementVAUSDPartner}
                                        clearIcon={null}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => getListSettlementRequestVAUSDPartner(1, inputHandleSettlementVAUSDPartner.idSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner, dateRangeRequestSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner, dateRangeTerimaSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.statusSettlementVAUSDPartner)}
                                                className={((inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeRequestSettlementVAUSDPartner.length === 0)) && (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 7 && dateRangeTerimaSettlementVAUSDPartner.length !== 0))) || ((inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeRequestSettlementVAUSDPartner.length !== 0)) && (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 7 && dateRangeTerimaSettlementVAUSDPartner.length === 0))) ? "btn-ez" : "btn-ez-on"}
                                                disabled={((inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeRequestSettlementVAUSDPartner.length === 0)) && (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 7 && dateRangeTerimaSettlementVAUSDPartner.length !== 0))) || ((inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeRequestSettlementVAUSDPartner.length !== 0)) && (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 7 && dateRangeTerimaSettlementVAUSDPartner.length === 0)))}
                                            >
                                                {language === null ? eng.terapkan : language.terapkan}
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={resetButtonSettlementVAUSDPartnerHandle}
                                                className={((inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeRequestSettlementVAUSDPartner.length === 0)) && (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 7 && dateRangeTerimaSettlementVAUSDPartner.length !== 0))) || ((inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeRequestSettlementVAUSDPartner.length !== 0)) && (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 7 && dateRangeTerimaSettlementVAUSDPartner.length === 0))) ? "btn-ez-reset" : "btn-reset"}
                                                disabled={((inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeRequestSettlementVAUSDPartner.length === 0)) && (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 7 && dateRangeTerimaSettlementVAUSDPartner.length !== 0))) || ((inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeRequestSettlementVAUSDPartner.length !== 0)) && (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner === 7 && dateRangeTerimaSettlementVAUSDPartner.length === 0)))}
                                            >
                                                {language === null ? eng.aturUlang : language.aturUlang}
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {
                                listSettlementVAUSDPartner.length !== 0 &&
                                <div style={{ marginBottom: 30 }}>
                                    <Link to={"#"} onClick={() => ExportReportSettlementVAUSDPartnerHandler(inputHandleSettlementVAUSDPartner.idSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner, dateRangeRequestSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner, dateRangeTerimaSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.statusSettlementVAUSDPartner)} className="export-span">{language === null ? eng.export : language.export}</Link>
                                </div>
                            }
                            <div className="div-table pb-4 mt-4">
                                <DataTable
                                    columns={columnsSettlementVAUSDPartner}
                                    data={listSettlementVAUSDPartner}
                                    customStyles={customStylesSettlementVAUSD}
                                    noDataComponent={language === null ? eng.tidakAdaData : language.tidakAdaData}
                                    highlightOnHover
                                    progressPending={pendingSettlementVAUSDPartner}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>{language === null ? eng.totalHalaman : language.totalHalaman} : {totalPageSettlementVAUSDPartner}</div>
                                <Pagination
                                    activePage={activePageSettlementVAUSDPartner}
                                    itemsCountPerPage={pageNumberSettlementVAUSDPartner.row_per_page}
                                    totalItemsCount={(pageNumberSettlementVAUSDPartner.row_per_page*pageNumberSettlementVAUSDPartner.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeSettlementVAUSDPartner}
                                />
                            </div>
                        </div>
                        {/* Modal perbaharui data VA */}
                        <Modal size="xs" className='py-3' centered show={showModalSettlementVAUSDPertner} onHide={() => setShowModalSettlementVAUSDPertner(false)}>
                            <Modal.Title className='text-center mt-4 px-3' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                                Settlement Diterima?
                            </Modal.Title>
                            <Modal.Body >
                                <div className='text-center px-2' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>
                                    Apakah anda sudah yakin jika dana settlement telah berhasil diterima ?
                                </div>
                                <div className='d-flex justify-content-center align-items-center mt-3'>
                                    <div className='me-1'>
                                        <button
                                            onClick={() => setShowModalSettlementVAUSDPertner(false)}
                                            style={{
                                                fontFamily: "Exo",
                                                fontSize: 16,
                                                fontWeight: 900,
                                                alignItems: "center",
                                                padding: "12px 24px",
                                                gap: 8,
                                                width: 136,
                                                height: 45,
                                                background: "#FFFFFF",
                                                color: "#888888",
                                                border: "0.6px solid #EBEBEB",
                                                borderRadius: 6,
                                            }}
                                        >
                                            Tidak
                                        </button>
                                    </div>
                                    <div className="ms-1">
                                        <button
                                            onClick={() => acceptSettlementHandle(WithdrawCodeSettlementVAUSDPartner)}
                                            style={{
                                                fontFamily: "Exo",
                                                fontSize: 16,
                                                fontWeight: 900,
                                                alignItems: "center",
                                                padding: "12px 24px",
                                                gap: 8,
                                                width: 136,
                                                height: 45,
                                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                                border: "0.6px solid #2C1919",
                                                borderRadius: 6,
                                            }}
                                        >
                                            Diterima
                                        </button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </>
            }
        </div>
    )
}

export default SettlementVAUSDPartner