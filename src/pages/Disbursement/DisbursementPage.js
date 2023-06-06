import React, { useEffect, useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import $ from 'jquery'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import noteInfo from "../../assets/icon/note_icon.svg"
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import { Button, Col, Form, FormControl, Modal, OverlayTrigger, Row, Toast, Tooltip } from '@themesberg/react-bootstrap'
import chevron from "../../assets/icon/chevron_down_icon.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCircle } from "@fortawesome/free-solid-svg-icons";
import edit from "../../assets/icon/edit_icon.svg";
import deleted from "../../assets/icon/delete_icon.svg";
import noteIconGrey from "../../assets/icon/note_icon_grey.svg";
import noteIconRed from "../../assets/icon/note_icon_red.svg";
import saveIcon from "../../assets/icon/save_icon.svg";
import triangleAlertIcon from "../../assets/icon/alert_icon.svg";
import DataTable from 'react-data-table-component'
import axios from 'axios'
import FilterSubAccount from '../../components/FilterSubAccount'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import validator from "validator";
import 'filepond/dist/filepond.min.css'
import Pagination from 'react-js-pagination'
import search from "../../assets/icon/search_icon.svg"

import { sum } from 'lodash'
import * as XLSX from "xlsx"
import Checklist from '../../assets/icon/checklist_icon.svg'
import NoteIconWhite from "../../assets/icon/note_icon_white.svg"
import encryptData from '../../function/encryptData'
import daftarBank from '../../assets/files/Daftar Bank Tujuan Disbursement-PT. Ezeelink Indonesia.xlsx'
import templateBulkXLSX from '../../assets/files/Template Bulk Disbursement PT. Ezeelink Indonesia.xlsx'
import templateBulkCSV from '../../assets/files/Template Bulk Disbursement PT. Ezeelink Indonesia.csv'
import arrowDown from "../../assets/img/icons/arrow_down.svg";
import CurrencyInput from 'react-currency-input-field'

registerPlugin(FilePondPluginFileEncode)

function DisbursementPage() {

    const user_role = getRole()
    const [isDisbursementManual, setisDisbursementManual] = useState(true)
    const history = useHistory()
    const [listBank, setListBank] = useState([])
    const [showBank, setShowBank] = useState(false)
    const [rekeningList, setRekeningList] = useState([])
    const [feeBank, setFeeBank] = useState([])
    const [getBalance, setGetBalance] = useState({})
    const [dataDisburse, setDataDisburse] = useState([])
    const [editTabelDisburse, setEditTabelDisburse] = useState(false)
    const [editNominal, setEditNominal] = useState(false)
    const [numbering, setNumbering] = useState(0)
    const [allNominal, setAllNominal] = useState([])
    const [allFee, setAllFee] = useState([])
    const [isChecked, setIsChecked] = useState(false)
    const [isCheckedConfirm, setIsCheckedConfirm] = useState(false)
    const [responMsg, setResponMsg] = useState(0)
    const [errMsgEmail, setErrMsgEmail] = useState(false)
    const [dataExcelDisburse, setDataExcelDisburse] = useState({})
    const [dataExcelOriginDisburse, setDataExcelOriginDisburse] = useState({})
    const [isManual, setIsManual] = useState((sessionStorage.getItem('disbursement') !== 'manual' || sessionStorage.getItem('disbursement') === null) ? true : false)
    const [isBulk, setIsBulk] = useState((sessionStorage.getItem('disbursement') !== 'bulk' || sessionStorage.getItem('disbursement') === null) ? false : true)
    const [showStatusTransfer, setShowStatusTransfer] = useState(false)
    const [showDaftarRekening, setShowDaftarRekening] = useState(false)
    const [tab, setTab] = useState("")
    const [showModalConfirm, setShowModalConfirm] = useState(false)
    const [showModalPindahHalaman, setShowModalPindahHalaman] = useState(false)
    const [showModalPanduan, setShowModalPanduan] = useState(false)
    const [showModalDuplikasi, setShowModalDuplikasi] = useState(false)
    const [duplicateData, setDuplicateData] = useState([])
    const [showModalStatusDisburse, setShowModalStatusDisburse] = useState(false)
    const [filterTextBank, setFilterTextBank] = useState('')
    const [filterTextRekening, setFilterTextRekening] = useState('')
    const [labelUpload, setLabelUpload] = useState(`<div class='py-4 mb-2 style-label-drag-drop text-center'>Pilih atau letakkan file Excel kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
    <div className='pb-4'>
        <span class="filepond--label-action">
            Upload File
        </span>
    </div>`)
    const [files, setFiles] = useState([])
    const [dataFromUpload, setDataFromUpload] = useState([])
    const [dataOriginFromUpload, setDataOriginFromUpload] = useState([])
    const [dataFromUploadExcel, setDataFromUploadExcel] = useState([])
    const [errorFound, setErrorFound] = useState([])
    const [errorLoadPagination, setErrorLoadPagination] = useState([])
    const [errorFoundPagination, setErrorFoundPagination] = useState([])
    const [showModalErrorList, setShowModalErrorList] = useState(false)
    const [activePageErrorList, setActivePageErrorList] = useState(1)
    const [alertSaldo, setAlertSaldo] = useState(false)
    const [alertNotValid, setAlertNotValid] = useState(false)
    const [alertMinSaldo, setAlertMinSaldo] = useState(false)
    const [balanceDetail, setBalanceDetail] = useState([])
    const [sisaSaldoAlokasiPerBank, setSisaSaldoAlokasiPerBank] = useState({
        bca: 0,
        danamon: 0,
        bifast: 0
    })
    const [showDetailBalance, setShowDetailBalance] = useState({
        bca: false,
        danamon: false,
        otherBank: false,
        dana: false
    })
    const [totalHoldBalance, setTotalHoldBalance] = useState(0)

    function handleShowDetailBalance(codeBank) {
        if (codeBank === "014") {
            setShowDetailBalance({
                ...showDetailBalance,
                bca: !showDetailBalance.bca
            })
        } else if (codeBank === "011") {
            setShowDetailBalance({
                ...showDetailBalance,
                danamon: !showDetailBalance.danamon
            })
        } else if (codeBank === "DANA") {
            setShowDetailBalance({
                ...showDetailBalance,
                dana: !showDetailBalance.dana
            })
        } else {
            setShowDetailBalance({
                ...showDetailBalance,
                otherBank: !showDetailBalance.otherBank
            })
        }
    }
    
    async function fileCSV(newValue, bankLists, listBallanceBank, bankFee) {
        if (errorFound.length !== 0) {
            setErrorFound([])
        }
        
        if (listBallanceBank.length === 0) {
            setLabelUpload(`<div class='pt-1 pb-2 style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />Seluruh data Bank Tujuan tidak tersedia pada saat ini</div>
                <div class='pb-4 mt-1 style-label-drag-drop'>Silahkan coba upload ulang beberapa saat lagi. SIlahkan hubungi Admin untuk informasi lebih lanjut </div>
                <div className='pb-4'>
                    <span class="filepond--label-action">
                        oke
                    </span>
                </div>`)
        } else if (listBallanceBank.length !== 0) {
            const filteredBallanceBank = listBallanceBank.filter(item => item.mpaytype_mpaycat_id === 2)
            // console.log(filteredBallanceBank, 'filteredBallanceBank');
            if (filteredBallanceBank.length === 0) {
                setLabelUpload("")
                setLabelUpload(`<div class='pt-1 pb-2 style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />Seluruh data Bank Tujuan tidak tersedia pada saat ini</div>
                    <div class='pb-4 mt-1 style-label-drag-drop'>Silahkan coba upload ulang beberapa saat lagi. SIlahkan hubungi Admin untuk informasi lebih lanjut </div>
                    <div className='pb-4'>
                        <span class="filepond--label-action">
                            oke
                        </span>
                    </div>`)
            } else {
                if (newValue.length === 0) {
                    // setTimeout(() => {
                        // setDataFromUpload([]) //untuk csv
                        setDataFromUploadExcel([]) //untuk excel
                    // }, 500);
                // } else if (newValue.length !== 0 && newValue[0].file.type !== "text/csv") { //untuk csv
                } else if (newValue.length !== 0 && newValue[0].file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") { //untuk excel
                    // console.log('masuk wrong type');
                    // setDataFromUpload([]) //untuk csv
                    setDataFromUploadExcel([]) //untuk excel
                    setErrorFound([])
                    // setTimeout(() => {
                        setLabelUpload("")
                    // }, 2400);
                    // setTimeout(() => {
                        //untuk file csv
                        // setLabelUpload(`<div class='pt-1 pb-2 style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />File yang digunakan harus berformat Excel (*.csv)</div>
                        // <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                        // <div className='pb-4'>
                        //     <span class="filepond--label-action">
                        //         Ganti File
                        //     </span>
                        // </div>`)
                        //untuk file excel
                        setLabelUpload(`<div class='pt-1 pb-2 style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />File yang digunakan harus berformat Excel</div>
                        <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                        <div className='pb-4'>
                            <span class="filepond--label-action">
                                Ganti File
                            </span>
                        </div>`)
                    // }, 2500);
                } else if (newValue.length !== 0 && newValue[0].file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    const pond = await newValue[0].getFileEncodeBase64String()
                    if (pond !== undefined) {
                        const wb = XLSX.read(pond, {type: "base64"})
                        const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
                        let dataTemp = XLSX.utils.sheet_to_json(ws); // generate objects
                        if (wb.SheetNames.length !== 1) {
                            setDataFromUploadExcel([])
                            setErrorFound([])
                            setTimeout(() => {
                                setLabelUpload("")
                                setLabelUpload(`<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>Jumlah Sheet pada file Excel lebih dari 1. Harap tinjau kembali file anda agar sesuai dengan template.</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        Ganti File
                                    </span>
                                </div>`)
                            }, 2500);
                        } else if (ws.A1 === undefined || ws.B1 === undefined || ws.C1 === undefined || ws.D1 === undefined || ws.E1 === undefined || ws.F1 === undefined || ws.G1 === undefined || ws.H1 !== undefined) {
                            setDataFromUploadExcel([])
                            setErrorFound([])
                            setTimeout(() => {
                                setLabelUpload("")
                                setLabelUpload(`<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>Konten pada tabel tidak sesuai dengan template Disbursement Bulk <br/> Ezeelink. Harap download dan menggunakan template yang disediakan <br/> untuk mempermudah pengecekkan data disbursement.</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        Ganti File
                                    </span>
                                </div>`)
                            }, 2500);
                        } else if (ws.A1.h.trim() !== "Bank Tujuan*" || ws.B1.h.trim() !== "Cabang (Khusus Non-BCA)*" || ws.C1.h.trim() !== "No. Rekening Tujuan*" || ws.D1.h.trim() !== "Nama Pemilik Rekening*" || ws.E1.h.trim() !== "Nominal Disbursement*" || ws.F1.h.trim() !== "Email Penerima" || ws.G1.h.trim() !== "Catatan") {
                            setDataFromUploadExcel([])
                            setErrorFound([])
                            setTimeout(() => {
                                setLabelUpload("")
                                setLabelUpload(`<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>Konten pada tabel tidak sesuai dengan template Disbursement Bulk <br/> Ezeelink. Harap download dan menggunakan template yang disediakan <br/> untuk mempermudah pengecekkan data disbursement.</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        Ganti File
                                    </span>
                                </div>`)
                            }, 2500);
                        } else if (dataTemp.length === 0) {
                            setDataFromUploadExcel([])
                            setErrorFound([])
                            setTimeout(() => {
                                setLabelUpload("")
                                setLabelUpload(`<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>Data pada file masih kosong. Harap tinjau kembali data pada file anda.</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        Ganti File
                                    </span>
                                </div>`)
                            }, 2500);
                        } else {
                            setDataOriginFromUpload(dataTemp)
                            let data = []
                            dataTemp = dataTemp.map((obj, idx) => ({...obj, no: idx + 1}))
                            dataTemp.forEach(el => {
                                let obj = {}
                                Object.keys(el).forEach(e => {
                                    obj[(e.trim())] = el[e]
                                })
                                data.push(obj)
                            })
                            // console.log(pond, 'pond');
                            // console.log(wb, 'wb');
                            // console.log(ws, 'ws');
                            let totalNominalDisburse = 0
                            let totalFeeDisburse = 0
                            let totalFeeDisburseArr = []
                            let sameNumberData = []
                            let errData = []
                            let resultArray = []
                            let sisaSaldoAlokasiPerBankTemp = {
                                bca: 0,
                                danamon: 0,
                                bifast: 0
                            }
                            // console.log(data, 'data');
                            data.map(el => {
                                //check duplicate data
                                if(resultArray.find((object, idx) => {
                                    if(object["No. Rekening Tujuan*"] === el["No. Rekening Tujuan*"] && object["Nominal Disbursement*"] === el["Nominal Disbursement*"]) {
                                        //if the object exists iterate times
                                        object.times++;
                                        sameNumberData.push(object.no)
                                        sameNumberData.push(el.no)
                                        return true;
                                        //if it does not return false
                                    } else {
                                        return false;
                                    }
                                })){
                                } else {
                                    //if the object does not exists push it to the resulting array and set the times count to 1
                                    el.times = 1;
                                    resultArray.push(el);
                                }
                            })
                            // console.log(data, 'data2');
                            data = data.map((el, idx) => {
                                let objErrData = {}
                                // console.log(el["Bank Tujuan*"], `el["Bank Tujuan*"]`);
                                const codeBank = el !== undefined && el["Bank Tujuan*"] !== undefined ? String(el["Bank Tujuan*"]).slice(0, 3) : undefined
                                const filteredListBank = bankLists.filter(item => item.is_enabled === true) //bank yg aktif
                                const sameBankName = filteredListBank.find(list => list.mbank_code === codeBank) //bank yg sama
                                // console.log(sameBankName, 'sameBankName');
                                // console.log(filteredListBank, 'filteredListBank');
                                // console.log(balanceBank, 'balanceBank');
                                // console.log(sameBankName, 'sameBankName');
                                //pengecekan code bank
                                if (el["Bank Tujuan*"] === undefined) {
                                    objErrData.no = idx + 2
                                    objErrData.keterangan = 'kolom Bank Tujuan : Wajib Diisi.'
                                    errData.push(objErrData)
                                    objErrData = {}
                                } else if (codeBank.length !== 3) { //kode bank tidak valid
                                    objErrData.no = idx + 2
                                    objErrData.keterangan = 'kolom Bank Tujuan : Bank Tujuan salah / tidak tersedia pada saat ini.'
                                    errData.push(objErrData)
                                    objErrData = {}
                                } else if (codeBank.toLowerCase() !== codeBank.toUpperCase()) { //kode bank tidak valid
                                    objErrData.no = idx + 2
                                    objErrData.keterangan = 'kolom Bank Tujuan : Bank Tujuan salah / tidak tersedia pada saat ini.'
                                    errData.push(objErrData)
                                    objErrData = {}
                                } else if (sameBankName === undefined) { //kode bank tidak valid
                                    objErrData.no = idx + 2
                                    objErrData.keterangan = 'kolom Bank Tujuan : Bank Tujuan salah / tidak tersedia pada saat ini.'
                                    errData.push(objErrData)
                                    objErrData = {}
                                } else { // kode bank valid
                                    // console.log(el["No. Rekening Tujuan*"], 'String(el["No. Rekening Tujuan*"])');
                                    //pengecekan nomer rekening bank
                                    if (el["No. Rekening Tujuan*"] === undefined) { //kolom nomor rekening kosong
                                        objErrData.no = idx + 2
                                        objErrData.keterangan = 'kolom Nomor Rekening : Wajib Diisi.'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    } else { //nomor rekening tidak valid
                                        if (String(el["No. Rekening Tujuan*"]).toLowerCase() !== String(el["No. Rekening Tujuan*"]).toUpperCase()) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = 'kolom Nomor Rekening : Tipe data salah.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (sameBankName.mbank_digit_acc !== 0 && (String(el["No. Rekening Tujuan*"]).replaceAll(' ', '').replaceAll('-', '').replaceAll('‘', '')).length !== sameBankName.mbank_digit_acc) { //jumlah nomer rekening tidak sesuai
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = 'kolom Nomor Rekening : Digit nomor rekening tidak sesuai dengan bank tujuan.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        }
                                    }
                                    // console.log(el["Nama Pemilik Rekening*"], 'el["Nama Pemilik Rekening*"]');
                                    //pengecekan nama pemilik rekening
                                    if (el["Nama Pemilik Rekening*"] === undefined) { // kolom nama kosong
                                        objErrData.no = idx + 2
                                        objErrData.keterangan = 'kolom Nama Pemilik Rekening : Wajib Diisi.'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
                                    // console.log(el["Email Penerima"], 'el["Email Penerima"]');
                                    //pengecekan email
                                    if (el["Email Penerima"] !== undefined && validator.isEmail(el["Email Penerima"]) === false) { //format email salah
                                        objErrData.no = idx + 2
                                        objErrData.keterangan = 'kolom Email Penerima : Tipe data salah.'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
                                    //pengecekan catatan
                                    if (el.Catatan !== undefined && el.Catatan.length > 25) { //catatan lebih dari 25 karakter
                                        objErrData.no = idx + 2
                                        objErrData.keterangan = 'kolom Catatan : Maks 25 karakter.'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
                                    if (sameBankName !== undefined) {
                                        return {
                                            ...el,
                                            "Bank Tujuan*": `${sameBankName.mbank_code} - ${sameBankName.mbank_name}`,
                                            "No. Rekening Tujuan*": String(el["No. Rekening Tujuan*"]).replaceAll(' ', '').replaceAll('-', '').replaceAll('‘', ''), //"Digit rekening tidak sesuai dengan bank tujuan."
                                            "Nama Pemilik Rekening*": el["Nama Pemilik Rekening*"] !== undefined ? el["Nama Pemilik Rekening*"].slice(0, 20) : undefined,
                                        }
                                    } else {
                                        return {
                                            ...el,
                                            "Bank Tujuan*": undefined,
                                        }
                                    }
                                }
                            })
    
                            // console.log(data, 'data3');
                            data = data.map((el, idx) => {
                                let objErrData = {}
                                const codeBank = el !== undefined && el["Bank Tujuan*"] !== undefined ? el["Bank Tujuan*"].slice(0, 3) : undefined
                                // console.log(el["Cabang (Khusus Non-BCA)*"], 'el["Cabang (Khusus Non-BCA)*"]');
                                //pengecekan cabang bank
                                if (codeBank !== "014" && codeBank !== undefined) { //selain bank BCA
                                    // console.log('masuk non bca');
                                    if (el["Cabang (Khusus Non-BCA)*"] === undefined) {
                                        objErrData.no = idx + 2
                                        objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Wajib Diisi.'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    } else {
                                        if (String(el["Cabang (Khusus Non-BCA)*"]).trim().length === 0) { //kolom cabang bank diisi spasi kosong
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (String(el["Cabang (Khusus Non-BCA)*"]).split('x').join(' ').trim().length === 0 || String(el["Cabang (Khusus Non-BCA)*"]).split('X').join(' ').trim().length === 0) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        // } else if (/[$-/:-?{-~!"^_`\[\]]/.test(String(el["Cabang (Khusus Non-BCA)*"]))) {
                                        } else if (String(el["Cabang (Khusus Non-BCA)*"]).split('.').join('').trim().length === 0 || String(el["Cabang (Khusus Non-BCA)*"]).split(',').join('').trim().length === 0) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (String(el["Cabang (Khusus Non-BCA)*"]).toLowerCase() === String(el["Cabang (Khusus Non-BCA)*"]).toUpperCase()) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (String(el["Cabang (Khusus Non-BCA)*"]).length < 4 && String(el["Cabang (Khusus Non-BCA)*"]).toLowerCase() !== String(el["Cabang (Khusus Non-BCA)*"]).toUpperCase()) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else {
                                            return {
                                                ...el,
                                                // "No*": idx + 2,
                                                "Bank Tujuan*": el["Bank Tujuan*"],
                                                "Cabang (Khusus Non-BCA)*": el["Cabang (Khusus Non-BCA)*"],
                                                "No. Rekening Tujuan*": el["No. Rekening Tujuan*"],
                                                "Nama Pemilik Rekening*": el["Nama Pemilik Rekening*"],
                                                "Nominal Disbursement*": el["Nominal Disbursement*"],
                                                "Email Penerima": el["Email Penerima"] === undefined ? "-" : el["Email Penerima"],
                                                "Catatan": el["Catatan"] === undefined ? "-" : el["Catatan"],
                                            }
                                        }
                                        return {
                                            ...el,
                                            // "No*": idx + 2,
                                            "Bank Tujuan*": el["Bank Tujuan*"],
                                            "Cabang (Khusus Non-BCA)*": String(el["Cabang (Khusus Non-BCA)*"]).trim(),
                                            "No. Rekening Tujuan*": el["No. Rekening Tujuan*"],
                                            "Nama Pemilik Rekening*": el["Nama Pemilik Rekening*"],
                                            "Nominal Disbursement*": el["Nominal Disbursement*"],
                                            "Email Penerima": el["Email Penerima"] === undefined ? "-" : el["Email Penerima"],
                                            "Catatan": el["Catatan"] === undefined ? "-" : el["Catatan"],
                                        }
                                    }
                                } else if (codeBank === "014" && codeBank !== undefined) {
                                    // console.log('masuk bca');
                                    if (el["Cabang (Khusus Non-BCA)*"] === undefined || String(el["Cabang (Khusus Non-BCA)*"]).trim().length === 0 || String(el["Cabang (Khusus Non-BCA)*"]).split('x').join(' ').trim().length === 0 || String(el["Cabang (Khusus Non-BCA)*"]).split('X').join(' ').trim().length === 0 || String(el["Cabang (Khusus Non-BCA)*"]).split('.').join('').trim().length === 0 || String(el["Cabang (Khusus Non-BCA)*"]).split(',').join('').trim().length === 0 || String(el["Cabang (Khusus Non-BCA)*"]).toLowerCase() === String(el["Cabang (Khusus Non-BCA)*"]).toUpperCase()) {
                                        // console.log('masuk kolom kosong');
                                        return {
                                            ...el,
                                            "Cabang (Khusus Non-BCA)*": '-'
                                        }
                                    } else {
                                        return {
                                            ...el,
                                            // "No*": idx + 2,
                                            "Bank Tujuan*": el["Bank Tujuan*"],
                                            "Cabang (Khusus Non-BCA)*": String(el["Cabang (Khusus Non-BCA)*"]).trim(),
                                            "No. Rekening Tujuan*": el["No. Rekening Tujuan*"],
                                            "Nama Pemilik Rekening*": el["Nama Pemilik Rekening*"],
                                            "Nominal Disbursement*": el["Nominal Disbursement*"],
                                            "Email Penerima": el["Email Penerima"] === undefined ? "-" : el["Email Penerima"],
                                            "Catatan": el["Catatan"] === undefined ? "-" : el["Catatan"],
                                        }
                                    }
                                }
                            })
    
                            // console.log(data, 'data4');
                            data = data.map((el, idx) => {
                                let objErrData = {}
                                if (el !== undefined) {
                                    const codeBank = el !== undefined && el["Bank Tujuan*"] !== undefined ? el["Bank Tujuan*"].slice(0, 3) : undefined
                                    const filteredListBank = bankLists.filter(item => item.is_enabled === true) //bank yg aktif
                                    const sameBankName = filteredListBank.find(list => list.mbank_code === codeBank) //bank yg sama
                                    // console.log(sameBankName, 'sameBankName');
                                    const balanceBank = filteredBallanceBank.find((item) => { //ballance bank
                                        // console.log(item.channel_id, "balance detail");
                                        if (codeBank === "014" || codeBank === "011") {
                                            return item.channel_id === codeBank
                                        } else {
                                            // el.bankCode = "BIF"
                                            return item.channel_id === "BIF"
                                        }
                                    })
                                    const resultBankFee = bankFee.find((item) => { //filter fee bank
                                        if (sameBankName.mbank_code === "014" || sameBankName.mbank_code === "011") {
                                            return item.mpaytype_bank_code === sameBankName.mbank_code
                                        } else {
                                            // sameBankName.mbank_code = "BIF"
                                            return item.mpaytype_bank_code === "BIF"
                                        }
                                        // if (sameBankName !== undefined) {
                                        // }
                                    })
                                    // console.log(resultBankFee, 'resultBankFee');
                                    if (resultBankFee !== undefined) {
                                        totalFeeDisburse += resultBankFee.fee_total
                                        totalFeeDisburseArr.push(resultBankFee.fee_total)
                                        // if (sameBankName !== undefined && bankFee.length !== 0) { //set total fee
                                        // }
                                        // console.log(el["Nominal Disbursement*"], 'el["Nominal Disbursement*"]');
                                        //pengecekan nominal disbursement
                                        if (el["Nominal Disbursement*"] === undefined || el["Nominal Disbursement*"] === '0') { //nominal kosong/nol
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = 'kolom Nominal Disbursement : Wajib Diisi.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else {
                                            if (typeof el["Nominal Disbursement*"] === 'string') {
                                                // console.log('masuk string');
                                                if (el["Nominal Disbursement*"].toLowerCase() !== el["Nominal Disbursement*"].toUpperCase()) {
                                                    // console.log('ada huruf');
                                                    objErrData.no = idx + 2
                                                    objErrData.keterangan = 'kolom Nominal Disbursement : Tipe data salah.'
                                                    errData.push(objErrData)
                                                    objErrData = {}
                                                } else if (el["Nominal Disbursement*"].toLowerCase() === el["Nominal Disbursement*"].toUpperCase()) {
                                                    // console.log('tidak ada huruf');
                                                    if (el["Nominal Disbursement*"].indexOf(',') !== -1 && (el["Nominal Disbursement*"][el["Nominal Disbursement*"].length - 4] === ',' || el["Nominal Disbursement*"][el["Nominal Disbursement*"].length - 1] === ',')) {
                                                        // console.log('masuk koma bener');
                                                        if (el["Nominal Disbursement*"].replaceAll(",", "").replaceAll(".", "").length < 5) {
                                                            objErrData.no = idx + 2
                                                            objErrData.keterangan = 'kolom Nominal Disbursement : Minimal Nominal Disbursement 10.000'
                                                            errData.push(objErrData)
                                                            objErrData = {}
                                                        } else {
                                                            // console.log('masuk plus nominal 1');
                                                            const nominalDisbursementNumber = Number(el["Nominal Disbursement*"].replaceAll(",", "").replaceAll(".", ""))
                                                            totalNominalDisburse += nominalDisbursementNumber
                                                            if (nominalDisbursementNumber <= balanceBank.mpartballchannel_balance) {
                                                                if (codeBank === '014') {
                                                                    if ((sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                        objErrData.no = idx + 2
                                                                        objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                                        errData.push(objErrData)
                                                                        objErrData = {}
                                                                        sisaSaldoAlokasiPerBankTemp = {
                                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                                            bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                        }
                                                                    } else {
                                                                        // console.log('masuk plus nominal 3');
                                                                        // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                        sisaSaldoAlokasiPerBankTemp = {
                                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                                            bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                        }
                                                                    }
                                                                } else if (codeBank === '011') {
                                                                    if ((sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                        objErrData.no = idx + 2
                                                                        objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                                        errData.push(objErrData)
                                                                        objErrData = {}
                                                                        sisaSaldoAlokasiPerBankTemp = {
                                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                                            danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                        }
                                                                    } else {
                                                                        // console.log('masuk plus nominal 4');
                                                                        // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                        sisaSaldoAlokasiPerBankTemp = {
                                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                                            danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                        }
                                                                    }
                                                                } else {
                                                                    if ((sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                        objErrData.no = idx + 2
                                                                        objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                                        errData.push(objErrData)
                                                                        objErrData = {}
                                                                        sisaSaldoAlokasiPerBankTemp = {
                                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                                            bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                        }
                                                                    } else {
                                                                        // console.log('masuk plus nominal 5');
                                                                        // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                        sisaSaldoAlokasiPerBankTemp = {
                                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                                            bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                        }
                                                                    }
                                                                }
                                                            } else if (nominalDisbursementNumber > (balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) {
                                                                if (codeBank === '014') {
                                                                    objErrData.no = idx + 2
                                                                    objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                                    errData.push(objErrData)
                                                                    objErrData = {}
                                                                    sisaSaldoAlokasiPerBankTemp = {
                                                                        ...sisaSaldoAlokasiPerBankTemp,
                                                                        bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    }
                                                                } else if (codeBank === '011') {
                                                                    objErrData.no = idx + 2
                                                                    objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                                    errData.push(objErrData)
                                                                    objErrData = {}
                                                                    sisaSaldoAlokasiPerBankTemp = {
                                                                        ...sisaSaldoAlokasiPerBankTemp,
                                                                        danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    }
                                                                } else {
                                                                    objErrData.no = idx + 2
                                                                    objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                                    errData.push(objErrData)
                                                                    objErrData = {}
                                                                    sisaSaldoAlokasiPerBankTemp = {
                                                                        ...sisaSaldoAlokasiPerBankTemp,
                                                                        bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    }
                                                                }
                                                            }
                                                            return {
                                                                ...el,
                                                                "Nominal Disbursement*": nominalDisbursementNumber
                                                            }
                                                        }
                                                    } else if (el["Nominal Disbursement*"].indexOf('.') !== -1 && (el["Nominal Disbursement*"][el["Nominal Disbursement*"].length - 4] === '.' || el["Nominal Disbursement*"][el["Nominal Disbursement*"].length - 1] === '.')) {
                                                        // console.log('masuk titik bener');
                                                        if (el["Nominal Disbursement*"].replaceAll(",", "").replaceAll(".", "").length < 5) {
                                                            objErrData.no = idx + 2
                                                            objErrData.keterangan = 'kolom Nominal Disbursement : Minimal Nominal Disbursement 10.000'
                                                            errData.push(objErrData)
                                                            objErrData = {}
                                                        } else {
                                                            // console.log('masuk plus nominal 2');
                                                            const nominalDisbursementNumber = Number(el["Nominal Disbursement*"].replaceAll(",", "").replaceAll(".", ""))
                                                            totalNominalDisburse += nominalDisbursementNumber
                                                            if (nominalDisbursementNumber <= balanceBank.mpartballchannel_balance) {
                                                                if (codeBank === '014') {
                                                                    if ((sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                        objErrData.no = idx + 2
                                                                        objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                                        errData.push(objErrData)
                                                                        objErrData = {}
                                                                        sisaSaldoAlokasiPerBankTemp = {
                                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                                            bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                        }
                                                                    } else {
                                                                        // console.log('masuk plus nominal 3');
                                                                        // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                        sisaSaldoAlokasiPerBankTemp = {
                                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                                            bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                        }
                                                                    }
                                                                } else if (codeBank === '011') {
                                                                    if ((sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                        objErrData.no = idx + 2
                                                                        objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                                        errData.push(objErrData)
                                                                        objErrData = {}
                                                                        sisaSaldoAlokasiPerBankTemp = {
                                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                                            danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                        }
                                                                    } else {
                                                                        // console.log('masuk plus nominal 4');
                                                                        // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                        sisaSaldoAlokasiPerBankTemp = {
                                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                                            danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                        }
                                                                    }
                                                                } else {
                                                                    if ((sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                        objErrData.no = idx + 2
                                                                        objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                                        errData.push(objErrData)
                                                                        objErrData = {}
                                                                        sisaSaldoAlokasiPerBankTemp = {
                                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                                            bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                        }
                                                                    } else {
                                                                        // console.log('masuk plus nominal 5');
                                                                        // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                        sisaSaldoAlokasiPerBankTemp = {
                                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                                            bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                        }
                                                                    }
                                                                }
                                                            } else if (nominalDisbursementNumber > (balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) {
                                                                if (codeBank === '014') {
                                                                    objErrData.no = idx + 2
                                                                    objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                                    errData.push(objErrData)
                                                                    objErrData = {}
                                                                    sisaSaldoAlokasiPerBankTemp = {
                                                                        ...sisaSaldoAlokasiPerBankTemp,
                                                                        bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    }
                                                                } else if (codeBank === '011') {
                                                                    objErrData.no = idx + 2
                                                                    objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                                    errData.push(objErrData)
                                                                    objErrData = {}
                                                                    sisaSaldoAlokasiPerBankTemp = {
                                                                        ...sisaSaldoAlokasiPerBankTemp,
                                                                        danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    }
                                                                } else {
                                                                    objErrData.no = idx + 2
                                                                    objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                                    errData.push(objErrData)
                                                                    objErrData = {}
                                                                    sisaSaldoAlokasiPerBankTemp = {
                                                                        ...sisaSaldoAlokasiPerBankTemp,
                                                                        bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    }
                                                                }
                                                            }
                                                            return {
                                                                ...el,
                                                                "Nominal Disbursement*": nominalDisbursementNumber
                                                            }
                                                        }
                                                    } else if ((el["Nominal Disbursement*"].indexOf(',') !== -1 && el["Nominal Disbursement*"][el["Nominal Disbursement*"].length - 3] === ',') || (el["Nominal Disbursement*"].indexOf(',') !== -1 && el["Nominal Disbursement*"][el["Nominal Disbursement*"].length - 2] === ',')) {
                                                        // console.log('masuk koma salah', el["Nominal Disbursement*"].split(",")[0]);
                                                        // console.log(el["Nominal Disbursement*"].split(","), 'nominal disbursement');
                                                        objErrData.no = idx + 2
                                                        objErrData.keterangan = 'kolom Nominal Disbursement : Tidak boleh mengandung decimal'
                                                        errData.push(objErrData)
                                                        objErrData = {}
                                                    } else if ((el["Nominal Disbursement*"].indexOf('.') !== -1 && el["Nominal Disbursement*"][el["Nominal Disbursement*"].length - 3] === '.') || (el["Nominal Disbursement*"].indexOf('.') !== -1 && el["Nominal Disbursement*"][el["Nominal Disbursement*"].length - 2] === '.')) {
                                                        objErrData.no = idx + 2
                                                        objErrData.keterangan = 'kolom Nominal Disbursement : Tidak boleh mengandung decimal'
                                                        errData.push(objErrData)
                                                        objErrData = {}
                                                    } else if (el["Nominal Disbursement*"].indexOf(',') === -1 || el["Nominal Disbursement*"].indexOf('.') === -1) {
                                                        const nominalDisbursementNumber = Number(el["Nominal Disbursement*"])
                                                        if (nominalDisbursementNumber <= balanceBank.mpartballchannel_balance) {
                                                            if (codeBank === '014') {
                                                                if ((sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                    objErrData.no = idx + 2
                                                                    objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                                    errData.push(objErrData)
                                                                    objErrData = {}
                                                                    sisaSaldoAlokasiPerBankTemp = {
                                                                        ...sisaSaldoAlokasiPerBankTemp,
                                                                        bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    }
                                                                } else {
                                                                    // console.log('masuk plus nominal 3');
                                                                    // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                    sisaSaldoAlokasiPerBankTemp = {
                                                                        ...sisaSaldoAlokasiPerBankTemp,
                                                                        bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    }
                                                                }
                                                            } else if (codeBank === '011') {
                                                                if ((sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                    objErrData.no = idx + 2
                                                                    objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                                    errData.push(objErrData)
                                                                    objErrData = {}
                                                                    sisaSaldoAlokasiPerBankTemp = {
                                                                        ...sisaSaldoAlokasiPerBankTemp,
                                                                        danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    }
                                                                } else {
                                                                    // console.log('masuk plus nominal 4');
                                                                    // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                    sisaSaldoAlokasiPerBankTemp = {
                                                                        ...sisaSaldoAlokasiPerBankTemp,
                                                                        danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    }
                                                                }
                                                            } else {
                                                                if ((sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                    objErrData.no = idx + 2
                                                                    objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                                    errData.push(objErrData)
                                                                    objErrData = {}
                                                                    sisaSaldoAlokasiPerBankTemp = {
                                                                        ...sisaSaldoAlokasiPerBankTemp,
                                                                        bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    }
                                                                } else {
                                                                    // console.log('masuk plus nominal 5');
                                                                    // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                    sisaSaldoAlokasiPerBankTemp = {
                                                                        ...sisaSaldoAlokasiPerBankTemp,
                                                                        bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    }
                                                                }
                                                            }
                                                        } else if (nominalDisbursementNumber > (balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) {
                                                            if (codeBank === '014') {
                                                                objErrData.no = idx + 2
                                                                objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                                errData.push(objErrData)
                                                                objErrData = {}
                                                                sisaSaldoAlokasiPerBankTemp = {
                                                                    ...sisaSaldoAlokasiPerBankTemp,
                                                                    bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                }
                                                            } else if (codeBank === '011') {
                                                                objErrData.no = idx + 2
                                                                objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                                errData.push(objErrData)
                                                                objErrData = {}
                                                                sisaSaldoAlokasiPerBankTemp = {
                                                                    ...sisaSaldoAlokasiPerBankTemp,
                                                                    danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                }
                                                            } else {
                                                                objErrData.no = idx + 2
                                                                objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                                errData.push(objErrData)
                                                                objErrData = {}
                                                                sisaSaldoAlokasiPerBankTemp = {
                                                                    ...sisaSaldoAlokasiPerBankTemp,
                                                                    bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                }
                                                            }
                                                        }
                                                        totalNominalDisburse += Number(el["Nominal Disbursement*"])
                                                        return {
                                                            ...el,
                                                            "Nominal Disbursement*": Number(el["Nominal Disbursement*"])
                                                        }
                                                    }
                                                } else if (el["Nominal Disbursement*"].length < 5) {
                                                    objErrData.no = idx + 2
                                                    objErrData.keterangan = 'kolom Nominal Disbursement : Minimal Nominal Disbursement 10.000'
                                                    errData.push(objErrData)
                                                    objErrData = {}
                                                }
                                            } else if (typeof el["Nominal Disbursement*"] === 'number') {
                                                // console.log('masuk number');
                                                if (el["Nominal Disbursement*"] < 10000) {
                                                    objErrData.no = idx + 2
                                                    objErrData.keterangan = 'kolom Nominal Disbursement : Minimal Nominal Disbursement 10.000'
                                                    errData.push(objErrData)
                                                    objErrData = {}
                                                } else if (el["Nominal Disbursement*"] <= balanceBank.mpartballchannel_balance) {
                                                    // console.log('masuk number1');
                                                    if (codeBank === '014') {
                                                        // console.log('masuk number1');
                                                        if ((sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total) < 0) {
                                                            objErrData.no = idx + 2
                                                            objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                            errData.push(objErrData)
                                                            objErrData = {}
                                                            sisaSaldoAlokasiPerBankTemp = {
                                                                ...sisaSaldoAlokasiPerBankTemp,
                                                                bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                            }
                                                        } else {
                                                            // console.log('masuk plus nominal 3');
                                                            totalNominalDisburse += el["Nominal Disbursement*"]
                                                            sisaSaldoAlokasiPerBankTemp = {
                                                                ...sisaSaldoAlokasiPerBankTemp,
                                                                bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                            }
                                                            return {
                                                                ...el,
                                                                "Nominal Disbursement*": el["Nominal Disbursement*"]
                                                            }
                                                        }
                                                    } else if (codeBank === '011') {
                                                        if ((sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total) < 0) {
                                                            objErrData.no = idx + 2
                                                            objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                            errData.push(objErrData)
                                                            objErrData = {}
                                                            sisaSaldoAlokasiPerBankTemp = {
                                                                ...sisaSaldoAlokasiPerBankTemp,
                                                                danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                            }
                                                        } else {
                                                            // console.log('masuk plus nominal 4');
                                                            totalNominalDisburse += el["Nominal Disbursement*"]
                                                            sisaSaldoAlokasiPerBankTemp = {
                                                                ...sisaSaldoAlokasiPerBankTemp,
                                                                danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                            }
                                                        }
                                                        return {
                                                            ...el,
                                                            "Nominal Disbursement*": el["Nominal Disbursement*"]
                                                        }
                                                    } else {
                                                        if ((sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total) < 0) {
                                                            objErrData.no = idx + 2
                                                            objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                            errData.push(objErrData)
                                                            objErrData = {}
                                                            sisaSaldoAlokasiPerBankTemp = {
                                                                ...sisaSaldoAlokasiPerBankTemp,
                                                                bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                            }
                                                        } else {
                                                            // console.log('masuk plus nominal 5');
                                                            totalNominalDisburse += el["Nominal Disbursement*"]
                                                            sisaSaldoAlokasiPerBankTemp = {
                                                                ...sisaSaldoAlokasiPerBankTemp,
                                                                bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                            }
                                                        }
                                                        return {
                                                            ...el,
                                                            "Nominal Disbursement*": el["Nominal Disbursement*"]
                                                        }
                                                    }
                                                } else if (el["Nominal Disbursement*"] > (balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) {
                                                    if (codeBank === '014') {
                                                        objErrData.no = idx + 2
                                                        objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                        errData.push(objErrData)
                                                        objErrData = {}
                                                        sisaSaldoAlokasiPerBankTemp = {
                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                            bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                        }
                                                    } else if (codeBank === '011') {
                                                        objErrData.no = idx + 2
                                                        objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                        errData.push(objErrData)
                                                        objErrData = {}
                                                        sisaSaldoAlokasiPerBankTemp = {
                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                            danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                        }
                                                    } else {
                                                        objErrData.no = idx + 2
                                                        objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                        errData.push(objErrData)
                                                        objErrData = {}
                                                        sisaSaldoAlokasiPerBankTemp = {
                                                            ...sisaSaldoAlokasiPerBankTemp,
                                                            bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            })
                            // console.log(data, 'data5');
                            // console.log(sameNumberData, 'sameNumberData');
                            // console.log(resultArray, 'resultArray');
                            // console.log(errData, 'errData');
                            // console.log(totalFeeDisburseArr, 'totalFeeDisburseArr');
                            // console.log(totalFeeDisburse, 'totalFeeDisburse');
                            // console.log(totalNominalDisburse, 'totalNominalDisburse');
                            setAllNominal([totalNominalDisburse])
                            setAllFee([totalFeeDisburse])
                            if (sameNumberData.length >= 1) {
                                setShowModalDuplikasi(true)
                                setDuplicateData(sameNumberData)
                            }
                            if (errData.length !== 0) {
                                setDataFromUploadExcel([])
                                setLabelUpload(`<div class='pb-4 style-label-drag-drop-error-list'>Pilih atau letakkan file Excel kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        Pilih File
                                    </span>
                                </div>`)
                                setTimeout(() => {
                                    setErrorFound(errData)
                                    setLabelUpload(`<div class='pb-4 style-label-drag-drop-error-list'>Pilih atau letakkan file Excel kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                    <div className='pb-4'>
                                        <span class="filepond--label-action">
                                            Ganti File
                                        </span>
                                    </div>`)
                                }, 2500);
                            } else {
                                setDataFromUploadExcel([])
                                setErrorFound([])
                                setTimeout(() => {
                                    setLabelUpload("")
                                    setLabelUpload(`<div class='mt-2 style-label-drag-drop-filename'>${newValue[0].file.name}</div>
                                    <div class='py-4 style-label-drag-drop'>Pilih atau letakkan file Excel kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                    <div className='pb-4'>
                                        <span class="filepond--label-action">
                                            Ganti File
                                        </span>
                                    </div>`)
                                }, 2500);
                                setTimeout(() => {
                                    // console.log(data, 'masuk usestate');
                                    setDataFromUploadExcel(data)
                                }, 2500);
                            }
                        }
                    }
                // } else if (newValue.length !== 0 && newValue[0].file.type === "text/csv") {
                // // } else {
                //     const pond = await newValue[0].getFileEncodeBase64String()
                //     //format file csv
                //     if (pond) {
                //         const decoded = Base64.decode(pond)
                //         // console.log(decoded, 'decodedd');
                //         // console.log(decoded.indexOf(';'));
                //         let headerCol = ''
                //         if (decoded.indexOf('|') === -1) {
                //             headerCol = decoded.split(';').slice(0, 8)
                //         } else {
                //             headerCol = decoded.split('|').slice(0, 8)
                //         }
                //         // console.log(headerCol, 'headerCol ""No*"');
                //         if ((headerCol[0] === '"No*' || headerCol[0] === "No*") && headerCol[1] === "Bank Tujuan*" && headerCol[2] === "Cabang (Khusus Non-BCA)*" && headerCol[3] === "No. Rekening Tujuan*" && headerCol[4] === "Nama Pemilik Rekening*" && headerCol[5] === "Nominal Disbursement*" && headerCol[6] === "Email Penerima" && (headerCol[7] === 'Catatan"\r\n"1' || headerCol[7] === "Catatan\r\n1")) {
                //             // console.log("ini bener");
                //             let newDcd = ''
                //             if (decoded.indexOf('|') === -1) {
                //                 newDcd = decoded.split(';').slice(8)
                //             } else {
                //                 newDcd = decoded.split('|').slice(8)
                //             }
                //             // const newDcd = decoded.split("|").slice(8)
                //             // console.log(newDcd, 'newDcd');
                //             // console.log(newDcd.length%7, 'newDcd');
                //             if (newDcd.length%7 !== 0) {
                //                 setErrorFound([])
                //                 setTimeout(() => {
                //                     setLabelUpload("")
                //                     setLabelUpload(`<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>Konten pada tabel tidak sesuai dengan template Disbursement Bulk <br/> Ezeelink. Harap download dan menggunakan template yang disediakan <br/> untuk mempermudah pengecekkan data disbursement.</div></div>
                //                     <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                //                     <div className='pb-4'>
                //                         <span class="filepond--label-action">
                //                             Ganti File
                //                         </span>
                //                     </div>`)
                //                 }, 2500);
                //             } else {
                //                 let totalNominalDisburse = 0
                //                 let totalFeeDisburse = 0
                //                 let totalFeeDisburseArr = []
                //                 let newArr = []
                //                 let obj = {}
                //                 const filteredListBank = bankLists.filter(item => item.is_enabled === true)
                //                 // console.log(filteredListBank, 'filteredListBank');
                //                 newDcd.forEach((el, idx) => {
                //                     if (idx === 0 || idx % 7 === 0) {
                //                         // console.log(el.slice(0,3), 'el.slice(0,3)');
                //                         if (el.length === 0) {
                //                             obj.bankCode = ""
                //                             obj.bankName = ""
                //                         } else {
                //                             if (el.slice(0, 3).toLowerCase() !== el.slice(0, 3).toUpperCase()) {
                //                                 obj.bankCode = "null"
                //                                 obj.bankName = "null"
                //                             } else {
                //                                 const sameBankName = filteredListBank.find(list => list.mbank_code === el.slice(0, 3))
                //                                 // console.log(bankLists, 'bankLists di bawah samebank');
                //                                 // console.log(sameBankName, 'sameBankName1');
                //                                 obj.bankCode = sameBankName !== undefined ? sameBankName.mbank_code : "undefined"
                //                                 obj.bankName = sameBankName !== undefined ? sameBankName.mbank_name : "undefined"
                //                                 // console.log(bankFee, 'bankFee');
                //                                 if (sameBankName !== undefined && bankFee.length !== 0) {
                //                                     // console.log(sameBankName, 'sameBankName2');
                //                                     const result = bankFee.find((item) => {
                //                                         if (sameBankName.mbank_code === "014" || sameBankName.mbank_code === "011") {
                //                                             return item.mpaytype_bank_code === sameBankName.mbank_code
                //                                         } else {
                //                                             // sameBankName.mbank_code = "BIF"
                //                                             return item.mpaytype_bank_code === "BIF"
                //                                         }
                //                                     })
                //                                     // console.log(result, 'result');
                //                                     if (result !== undefined) {
                //                                         totalFeeDisburse += result.fee_total
                //                                         totalFeeDisburseArr.push(result.fee_total)
                //                                     }
                //                                 }
                //                             }
                //                         }
                //                     } else if (idx === 1 || idx % 7 === 1) {
                //                         obj.cabangBank = el
                //                     } else if (idx === 2 || idx % 7 === 2) {
                //                         obj.noRekening = el
                //                     } else if (idx === 3 || idx % 7 === 3) {
                //                         obj.ownerName = el
                //                     } else if (idx === 4 || idx % 7 === 4) {
                //                         // console.log(el, 'nominal');
                //                         // console.log(el.indexOf(','), 'nominal');
                //                         if (el.indexOf(',') !== -1 || el.indexOf('.') !== -1) {
                //                             obj.nominalDisbursement = "decimal"
                //                         } else {
                //                             obj.nominalDisbursement = el
                //                             totalNominalDisburse += Number(el)
                //                         }
                //                     } else if (idx === 5 || idx % 7 === 5) {
                //                         obj.email = el
                //                     } else if (idx === 6 || idx % 7 === 6) {
                //                         obj.note = el.split('"\r')[0]
                //                     }
            
                //                     if (idx % 7 === 6) {
                //                         newArr.push(obj)
                //                         obj = {}
                //                     }
                //                 })
                //                 newArr = newArr.map((obj, i) => ({...obj, no: i + 1}) )
                //                 // console.log(newArr, 'newArr');
                //                 // console.log(totalFeeDisburse, 'totalFeeDisburse');
                //                 setAllNominal([totalNominalDisburse])
                //                 setAllFee([totalFeeDisburse])
                //                 // console.log(totalFeeDisburseArr, 'totalFeeDisburseArr');
                //                 let sameNumberData = []
                //                 let errData = []
                //                 const resultArray = [];

                //                 newArr.map(el => {
                //                     //for each item in arrayOfObjects check if the object exists in the resulting array
                //                     // const balanceBank = filteredBallanceBank.find((item) => {
                //                     //     // console.log(item.channel_id, "balance detail");
                //                     //     if (el.bankCode === "014" || el.bankCode === "011") {
                //                     //         return item.channel_id === el.bankCode
                //                     //     } else {
                //                     //         // el.bankCode = "BIF"
                //                     //         return item.channel_id === "BIF"
                //                     //     }
                //                     // })
                //                     if(resultArray.find(object => {
                //                         if(object.noRekening === el.noRekening && object.nominalDisbursement === el.nominalDisbursement) {
                //                             //if the object exists iterate times
                //                             object.times++;
                //                             sameNumberData.push(el.no)
                //                             return true;
                //                             //if it does not return false
                //                         } else {
                //                             return false;
                //                         }
                //                     })){
                //                     } else {
                //                         //if the object does not exists push it to the resulting array and set the times count to 1
                //                         el.times = 1;
                //                         resultArray.push(el);
                //                     }
                //                     // if (el.nominalDisbursement < balanceBank.mpartballchannel_balance || el.nominalDisbursement === balanceBank.mpartballchannel_balance) {
                //                     // }
                //                 })

                //                 // console.log(resultArray, 'resultArray')
                //                 // console.log(sameNumberData, 'sameNumberData')
                //                 if (sameNumberData.length >= 1) {
                //                     setShowModalDuplikasi(true)
                //                     setDuplicateData(sameNumberData)
                //                 }
                //                 let sisaSaldoAlokasiPerBankTemp = {
                //                     bca: 0,
                //                     danamon: 0,
                //                     bifast: 0
                //                 }
                //                 newArr = newArr.map(data => {
                //                     let objErrData = {}
                //                     const balanceBank = filteredBallanceBank.find((item) => {
                //                         // console.log(item.channel_id, "balance detail");
                //                         if (data.bankCode === "014" || data.bankCode === "011") {
                //                             return item.channel_id === data.bankCode
                //                         } else {
                //                             // el.bankCode = "BIF"
                //                             return item.channel_id === "BIF"
                //                         }
                //                     })
                //                     if (data.bankName.length === 0 && data.bankCode.length === 0) {
                //                         // console.log('masuk bank name kosong');
                //                         objErrData.no = data.no
                //                         // objErrData.data = data.bankName
                //                         objErrData.keterangan = 'kolom Bank Tujuan : Wajib Diisi.'
                //                         errData.push(objErrData)
                //                         objErrData = {}
                //                     } else {
                //                         if (data.bankName === "null" && data.bankCode === "null") {
                //                             objErrData.no = data.no
                //                             // objErrData.data = data.bankName
                //                             objErrData.keterangan = 'kolom Bank Tujuan : Kode Bank Wajib Diisi.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (data.bankName === "undefined" && data.bankCode === "undefined") {
                //                             objErrData.no = data.no
                //                             // objErrData.data = data.bankName
                //                             objErrData.keterangan = 'kolom Bank Tujuan : Bank Tujuan salah / tidak tersedia pada saat ini.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         }
                //                     }
            
                //                     if (data.noRekening.length === 0) {
                //                         objErrData.no = data.no
                //                         // objErrData.data = data.noRekening
                //                         objErrData.keterangan = 'kolom Nomor Rekening : Wajib Diisi.'
                //                         errData.push(objErrData)
                //                         objErrData = {}
                //                     }
            
                //                     if (data.noRekening.toLowerCase() !== data.noRekening.toUpperCase()) {
                //                         objErrData.no = data.no
                //                         // objErrData.data = data.noRekening
                //                         objErrData.keterangan = 'kolom Nomor Rekening : Tipe data salah.'
                //                         errData.push(objErrData)
                //                         objErrData = {}
                //                     }
            
                //                     if (data.ownerName.length === 0) {
                //                         objErrData.no = data.no
                //                         // objErrData.data = data.ownerName
                //                         objErrData.keterangan = 'kolom Nama Pemilik Rekening : Wajib Diisi.'
                //                         errData.push(objErrData)
                //                         objErrData = {}
                //                     }
            
                //                     // console.log(data.nominalDisbursement, 'nominal disbursement tipe data');
                //                     if (data.nominalDisbursement.length === 0 || data.nominalDisbursement === '0') {
                //                         // console.log('masuk nominal error1');
                //                         objErrData.no = data.no
                //                         // objErrData.data = data.noRekening
                //                         objErrData.keterangan = 'kolom Nominal Disbursement : Wajib Diisi.'
                //                         errData.push(objErrData)
                //                         objErrData = {}
                //                     } else {
                //                         const result = bankFee.find((item) => {
                //                             if (data.bankCode === "014" || data.bankCode === "011") {
                //                                 return item.mpaytype_bank_code === data.bankCode
                //                             } else {
                //                                 // sameBankName.mbank_code = "BIF"
                //                                 return item.mpaytype_bank_code === "BIF"
                //                             }
                //                         })
                //                         if (data.nominalDisbursement.toLowerCase() !== data.nominalDisbursement.toUpperCase()) {
                //                             objErrData.no = data.no
                //                             // objErrData.data = data.nominalDisbursement
                //                             objErrData.keterangan = `kolom Nominal Disbursement : ${data.nominalDisbursement === "decimal" ? 'Tidak boleh mengandung decimal' : 'Tipe data salah.'}`
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (data.nominalDisbursement.length < 5) {
                //                             // console.log('masuk nominal error2');
                //                             objErrData.no = data.no
                //                             // objErrData.data = data.noRekening
                //                             objErrData.keterangan = 'kolom Nominal Disbursement : Minimal Nominal Disbursement 10.000'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (Number(data.nominalDisbursement) < balanceBank.mpartballchannel_balance || Number(data.nominalDisbursement) === balanceBank.mpartballchannel_balance) {
                //                             // console.log(data, 'data.mbank_code error nominal');
                //                             // console.log(sisaSaldoAlokasiPerBankTemp, 'sisaSaldoAlokasiPerBankTemp');
                //                             // console.log(result, 'result untuk error nominal');
                //                             if (data.bankCode === '014') {
                //                                 if ((sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(data.nominalDisbursement) + result.fee_total) < 0) {
                //                                     // console.log('masuk if bca');
                //                                     objErrData.no = data.no
                //                                     // objErrData.data = data.noRekening
                //                                     objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup'
                //                                     errData.push(objErrData)
                //                                     objErrData = {}
                //                                     sisaSaldoAlokasiPerBankTemp = {
                //                                         ...sisaSaldoAlokasiPerBankTemp,
                //                                         bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(data.nominalDisbursement) + result.fee_total)
                //                                     }
                //                                 } else {
                //                                     // console.log('masuk else bca');
                //                                     sisaSaldoAlokasiPerBankTemp = {
                //                                         ...sisaSaldoAlokasiPerBankTemp,
                //                                         bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(data.nominalDisbursement) + result.fee_total)
                //                                     }
                //                                     // console.log(sisaSaldoAlokasiPerBankTemp, 'sisaSaldoAlokasiPerBankTemp bca');
                //                                     // setSisaSaldoAlokasiPerBank({
                //                                     //     ...sisaSaldoAlokasiPerBank,
                //                                     //     bca: (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance) - (Number(data.nominalDisbursement) + result.fee_total)
                //                                     // })
                //                                 }
                //                             } else if (data.bankCode === '011') {
                //                                 if ((sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(data.nominalDisbursement) + result.fee_total) < 0) {
                //                                     // console.log('masuk if danamon');
                //                                     objErrData.no = data.no
                //                                     // objErrData.data = data.noRekening
                //                                     objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup'
                //                                     errData.push(objErrData)
                //                                     objErrData = {}
                //                                     sisaSaldoAlokasiPerBankTemp = {
                //                                         ...sisaSaldoAlokasiPerBankTemp,
                //                                         danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(data.nominalDisbursement) + result.fee_total)
                //                                     }
                //                                 } else {
                //                                     // console.log('masuk else danamon');
                //                                     sisaSaldoAlokasiPerBankTemp = {
                //                                         ...sisaSaldoAlokasiPerBankTemp,
                //                                         danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(data.nominalDisbursement) + result.fee_total)
                //                                     }
                //                                     // console.log(sisaSaldoAlokasiPerBankTemp, 'sisaSaldoAlokasiPerBankTemp danamon');
                //                                     // setSisaSaldoAlokasiPerBank({
                //                                     //     ...sisaSaldoAlokasiPerBank,
                //                                     //     danamon: (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance) - (Number(data.nominalDisbursement) + result.fee_total)
                //                                     // })
                //                                 }
                //                             } else {
                //                                 // console.log((sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance), '(sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance)');
                //                                 if ((sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(data.nominalDisbursement) + result.fee_total) < 0) {
                //                                     // console.log('masuk otherbank minus');
                //                                     objErrData.no = data.no
                //                                     // objErrData.data = data.noRekening
                //                                     objErrData.keterangan = `Saldo pada rekening ${result.mpaytype_name} anda tidak cukup`
                //                                     errData.push(objErrData)
                //                                     objErrData = {}
                //                                     sisaSaldoAlokasiPerBankTemp = {
                //                                         ...sisaSaldoAlokasiPerBankTemp,
                //                                         bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(data.nominalDisbursement) + result.fee_total)
                //                                     }
                //                                 } else {
                //                                     // console.log('masuk otherbank non minus');
                //                                     sisaSaldoAlokasiPerBankTemp = {
                //                                         ...sisaSaldoAlokasiPerBankTemp,
                //                                         bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(data.nominalDisbursement) + result.fee_total)
                //                                     }
                //                                     // console.log(sisaSaldoAlokasiPerBankTemp, 'sisaSaldoAlokasiPerBankTemp other bank');
                //                                 }
                //                             }
                //                         } else if (Number(data.nominalDisbursement) > (balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) {
                //                             if (data.bankCode === '014') {
                //                                 objErrData.no = data.no
                //                                 // objErrData.data = data.noRekening
                //                                 objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup'
                //                                 errData.push(objErrData)
                //                                 objErrData = {}
                //                                 sisaSaldoAlokasiPerBankTemp = {
                //                                     ...sisaSaldoAlokasiPerBankTemp,
                //                                     bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(data.nominalDisbursement) + result.fee_total)
                //                                 }
                //                             } else if (data.bankCode === '011') {
                //                                 objErrData.no = data.no
                //                                 // objErrData.data = data.noRekening
                //                                 objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup'
                //                                 errData.push(objErrData)
                //                                 objErrData = {}
                //                                 sisaSaldoAlokasiPerBankTemp = {
                //                                     ...sisaSaldoAlokasiPerBankTemp,
                //                                     danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(data.nominalDisbursement) + result.fee_total)
                //                                 }
                //                             } else {
                //                                 objErrData.no = data.no
                //                                 // objErrData.data = data.noRekening
                //                                 objErrData.keterangan = `Saldo pada rekening ${result.mpaytype_name} anda tidak cukup`
                //                                 errData.push(objErrData)
                //                                 objErrData = {}
                //                                 sisaSaldoAlokasiPerBankTemp = {
                //                                     ...sisaSaldoAlokasiPerBankTemp,
                //                                     bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(data.nominalDisbursement) + result.fee_total)
                //                                 }
                //                             }
                //                         }
                //                     }
                //                     // console.log(filteredBallanceBank.find(found => found.channel_id === data.bankCode), 'filteredBallanceBank.find(found => found.mpartballchannel_balance)');
            
                //                     if (data.email.length !== 0 && validator.isEmail(data.email) === false) {
                //                         objErrData.no = data.no
                //                         // objErrData.data = data.email
                //                         objErrData.keterangan = 'kolom Email Penerima : Tipe data salah.'
                //                         errData.push(objErrData)
                //                         objErrData = {}
                //                     }
                                    
                //                     if (data.bankCode !== '014') {
                //                         if (data.cabangBank.length === 0) {
                //                             // console.log('masuk length 0', data.cabangBank, data.bankCode);
                //                             objErrData.no = data.no
                //                             objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Wajib Diisi.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (data.cabangBank.length !== 0 && data.cabangBank.trim().length === 0) {
                //                             // console.log('masuk spasi kosong', data.cabangBank, data.bankCode);
                //                             objErrData.no = data.no
                //                             objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (data.cabangBank.length !== 0 && (data.cabangBank.split('x').join(' ').trim().length === 0 || data.cabangBank.split('X').join(' ').trim().length === 0)) {
                //                             // console.log('masuk huruf x besar dan kecil', data.cabangBank, data.bankCode);
                //                             objErrData.no = data.no
                //                             objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (data.cabangBank.length !== 0 && /[$-/:-?{-~!"^_`\[\]]/.test(data.cabangBank)) {
                //                             // console.log('masuk tanda baca', data.cabangBank, data.bankCode);
                //                             objErrData.no = data.no
                //                             objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (data.cabangBank.length !== 0 && data.cabangBank.toLowerCase() === data.cabangBank.toUpperCase()) {
                //                             // console.log('masuk angka', data.cabangBank, data.bankCode);
                //                             objErrData.no = data.no
                //                             objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (data.cabangBank.length !== 0 && data.cabangBank.length < 4 && data.cabangBank.toLowerCase() !== data.cabangBank.toUpperCase()) {
                //                             // console.log('masuk kombinasi kurang dari 4 huruf', data.cabangBank, data.bankCode);
                //                             objErrData.no = data.no
                //                             objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else {
                //                             return {
                //                                 ...data,
                //                                 no: data.no,
                //                                 bankCode: data.bankCode,
                //                                 bankName: data.bankName,
                //                                 cabangBank: data.cabangBank.trim(),
                //                                 noRekening: data.noRekening,
                //                                 ownerName: data.ownerName,
                //                                 nominalDisbursement: data.nominalDisbursement,
                //                                 email: data.email,
                //                                 note: data.note
                //                             }
                //                         }
                //                     } else {
                //                         if (data.cabangBank.length === 0 || data.cabangBank.trim().length === 0 ||  (data.cabangBank.indexOf('x') >= 0 || data.cabangBank.indexOf('X') >= 0) || /[$-/:-?{-~!"^_`\[\]]/.test(data.cabangBank) || data.cabangBank.toLowerCase() === data.cabangBank.toUpperCase()) {
                //                             return {
                //                                 ...data, 
                //                                 cabangBank : '-'
                //                             }
                //                         } else {
                //                             return {
                //                                 ...data,
                //                                 no: data.no,
                //                                 bankCode: data.bankCode,
                //                                 bankName: data.bankName,
                //                                 cabangBank: data.cabangBank.trim(),
                //                                 noRekening: data.noRekening,
                //                                 ownerName: data.ownerName,
                //                                 nominalDisbursement: data.nominalDisbursement,
                //                                 email: data.email,
                //                                 note: data.note
                //                             }
                //                         }
                //                     }
                //                 })
                //                 // console.log(sameNumberData, 'sameNumberData');
                //                 // console.log(errData, 'errData');
                //                 // console.log(newArr, 'newArr');
                //                 if (errData.length !== 0) {
                //                     setLabelUpload(`<div class='pb-4 style-label-drag-drop-error-list'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                //                     <div className='pb-4'>
                //                         <span class="filepond--label-action">
                //                             Pilih File
                //                         </span>
                //                     </div>`)
                //                     setTimeout(() => {
                //                         setErrorFound(errData)
                //                         setLabelUpload(`<div class='pb-4 style-label-drag-drop-error-list'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                //                         <div className='pb-4'>
                //                             <span class="filepond--label-action">
                //                                 Ganti File
                //                             </span>
                //                         </div>`)
                //                     }, 2500);
                //                     // setTimeout(() => {
                //                     // }, 500);
                //                 } else {
                //                     setErrorFound([])
                //                     setTimeout(() => {
                //                         setLabelUpload("")
                //                         setLabelUpload(`<div class='mt-2 style-label-drag-drop-filename'>${newValue[0].file.name}</div>
                //                         <div class='py-4 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                //                         <div className='pb-4'>
                //                             <span class="filepond--label-action">
                //                                 Ganti File
                //                             </span>
                //                         </div>`)
                //                     }, 2500);
                //                     setTimeout(() => {
                //                         setDataFromUpload(newArr)
                //                     }, 2500);
                //                 }
                //             }
                //         } else {
                //             // console.log("ini salah");
                //             setErrorFound([])
                //             setTimeout(() => {
                //                 setLabelUpload("")
                //                 setLabelUpload(`<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>Konten pada tabel tidak sesuai dengan template Disbursement Bulk <br/> Ezeelink. Harap download dan menggunakan template yang disediakan <br/> untuk mempermudah pengecekkan data disbursement.</div></div>
                //                 <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                //                 <div className='pb-4'>
                //                     <span class="filepond--label-action">
                //                         Ganti File
                //                     </span>
                //                 </div>`)
                //             }, 2500);
                //         }
                //     }
                }
            }
        }
    }

    function openErrorListModal(errorList) {
        // console.log(errorList, 'errorList');
        let errorArr = []
        let arrKecil = []
        errorList.forEach((err, idx) => {
            // console.log(err);
            if ((idx+1)%10 === 0) {
                arrKecil.push(err)
                errorArr.push(arrKecil)
                arrKecil = []
            } else if (idx === errorList.length-1) {
                arrKecil.push(err)
                errorArr.push(arrKecil)
                arrKecil = []
            } else {
                arrKecil.push(err)
            }
        })
        // console.log(errorArr,'errorArr');
        setErrorFoundPagination(errorArr)
        setErrorLoadPagination(errorArr[0])
        setShowModalErrorList(true)
    }

    function handlePageChangeErrorList(page, errorList) {
        // console.log(page,'page');
        setActivePageErrorList(page)
        setErrorLoadPagination(errorList[page-1])
    }

    function closeModalError() {
        setShowModalErrorList(false)
        setActivePageErrorList(1)
    }

    function handleClickChangeFile(param) {
        // console.log('clicked1');
        $('.filepond--browser').trigger('click');
        if (param === "errorList") {
            setShowModalErrorList(false)
            setActivePageErrorList(1)
        } else if (param === "duplicateData") {
            setShowModalDuplikasi(false)
        }
        // console.log('clicked2');
    }

    // console.log(files, 'files upload');
    // console.log(dataFromUpload, 'dataFromUpload');
    // console.log(labelUpload, 'labelUpload');
    const filterItemsBank = listBank.filter(
        item => (item.mbank_name && item.mbank_name.toLowerCase().includes(filterTextBank.toLowerCase())) || (item.mbank_code && item.mbank_code.toLowerCase().includes(filterTextBank.toLowerCase()))
    )

    const filterItemsRekening = rekeningList.filter(
        item => (item.mbank_name && item.mbank_name.toLowerCase().includes(filterTextRekening.toLowerCase())) || (item.mbankaccountlist_name && item.mbankaccountlist_name.toLowerCase().includes(filterTextRekening.toLowerCase()))
    )

    const subHeaderComponentMemoBank = useMemo(() => {
        return (
            <FilterSubAccount filterText={filterTextBank} onFilter={e => setFilterTextBank(e.target.value)} title="Cari Data Bank :" placeholder="Masukkan Nama / Kode Bank" />
        );	}, [filterTextBank]
    );

    const subHeaderComponentMemoRekening = useMemo(() => {
        return (
            <FilterSubAccount filterText={filterTextRekening} onFilter={e => setFilterTextRekening(e.target.value)} title="Cari Data Bank :" placeholder="Masukkan Nama / Kode Bank" />
        );	}, [filterTextRekening]
    );

    const handleChangeCheckBox = () => {
        setIsChecked(!isChecked)
    }

    const handleChangeCheckBoxConfirm = () => {
        setIsCheckedConfirm(!isCheckedConfirm)
    }

    function tabDisbursement(tabDisbursement) {
        if (tabDisbursement === 'manual') {
            sessionStorage.setItem('disbursement', 'manual');
            setIsManual(true)
            setIsBulk(false)
        } else {
            sessionStorage.setItem('disbursement', 'bulk');
            setIsBulk(true)
            setIsManual(false)
        }
    }

    function batalIn (param) {
        if (param === "rekening") {
            setShowDaftarRekening(false)
            setFilterTextRekening('')
        } else {
            setShowBank(false)
            setFilterTextBank('')
        }
    }

    function batalConfirm () {
        setIsCheckedConfirm(false)
        setShowModalConfirm(false)
    }

    const [inputData, setInputData] = useState({
        bankName: "",
        bankCode: ""
    })

    const [inputRekening, setInputRekening] = useState({
        bankNameRek: "",
        bankNumberRek: ""
    })

    const [inputHandle, setInputHandle] = useState({
        bankCabang: "",
        nominal: "",
        emailPenerima: "",
        catatan: ""
    })

    const columns = [
        {
          name: "No",
          selector: (row) => row.number,
          width: "67px"
        },
        {
          name: "Bank Tujuan",
          selector: (row) => row.bankCodeTujuan + ` - ` + row.bankNameTujuan,
        },
        {
          name: "Cabang (Khusus Non-BCA)",
          selector: (row) => row.cabang,
        },
        {
          name: "No. Rekening Tujuan",
          selector: (row) => row.noRek,
        },
        {
          name: "Nama Pemilik Rekening",
          selector: (row) => row.nameRek,
        },
        {
          name: "Nominal Disbursement",
          selector: (row) => row.nominal,
        },
        {
          name: "Email Penerima",
          selector: (row) => row.emailPenerima,
        },
        {
          name: "Catatan",
          selector: (row) => row.catatan,
        },
        {
            name: "Aksi",
            //   selector: (row) => row.icon,
            width: "130px",
            cell: (row) => (
                <div className="d-flex justify-content-center align-items-center">
                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Edit</div></Tooltip>}>
                        <img
                            src={edit}
                            style={{ cursor: "pointer" }}
                            alt="icon edit"
                            onClick={() => editDataDisburse(row.number)}
                        />
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Delete</div></Tooltip>}>
                        <img
                            src={deleted}
                            style={{ cursor: "pointer" }}
                            className="ms-2"
                            alt="icon delete"
                            onClick={() => deleteDataDisburse(row.number)}
                        />
                    </OverlayTrigger>
                </div>
            ),
        },
    ];

    const columnsBank = [
        {
            name: 'No',
            selector: row => row.number,
            width: "80px",
            ignoreRowClick: true
        },
        {
            name: 'Nama Bank',
            selector: row => row.mbank_name,
        },
        {
            name: 'Kode Bank',
            selector: row => row.mbank_code,
        },
    ]

    const columnsRekening = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.mbank_name,
            width: "130px"
        },
        {
            name: 'Cabang (Khusus Non-BCA)',
            selector: row => (row.mbankaccountlist_bank_code === '014' && (row.mbankaccountlist_branch_name.length === 0 || row.mbankaccountlist_branch_name === "")) ? "-" : row.mbankaccountlist_branch_name,
            width: "280px"
        },
        {
            name: 'No Rekening',
            selector: row => row.mbankaccountlist_number,
            width: "150px"
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.mbankaccountlist_name,
        },
    ]

    const columnsBulk = [
        {
            name: 'No',
            selector: row => row.no,
            width: "67px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => `${row.bankCode} - ${row.bankName}`,
            width: "180px"
        },
        {
            name: 'Cabang (Khusus Non-BCA)',
            selector: row => row.cabangBank,
            width: "250px"
        },
        {
            name: 'No. Rekening Tujuan',
            selector: row => row.noRekening,
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.ownerName,
            width: '250px'
        },
        {
            name: 'Nominal Disbursement',
            selector: row => convertToRupiah(row.nominalDisbursement, true, 2),
            width: '250px'
        },
        {
            name: 'Email Penerima',
            selector: row => row.email,
            width: '250px'
        },
        {
            name: 'Catatan',
            selector: row => row.note,
            width: '250px'
        }
    ]

    const columnsBulkExcel = [
        {
            name: 'No',
            selector: row => row.no,
            width: "67px"
        },
        {
            name: 'Bank Tujuan*',
            selector: row => row["Bank Tujuan*"],
            width: "180px"
        },
        {
            name: 'Cabang (Khusus Non-BCA)*',
            selector: row => row["Cabang (Khusus Non-BCA)*"],
            width: "250px"
        },
        {
            name: 'No. Rekening Tujuan*',
            selector: row => row["No. Rekening Tujuan*"],
        },
        {
            name: 'Nama Pemilik Rekening*',
            selector: row => row["Nama Pemilik Rekening*"],
            width: '250px'
        },
        {
            name: 'Nominal Disbursement*',
            selector: row => convertToRupiah(row["Nominal Disbursement*"], true, 2),
            width: '250px'
        },
        {
            name: 'Email Penerima',
            selector: row => row["Email Penerima"],
            width: '250px'
        },
        {
            name: 'Catatan',
            selector: row => row.Catatan,
            width: '250px'
        }
    ]

    async function getBankList() {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"fitur_id" : 102}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const bankList = await axios.post(BaseURL + "/Home/BankGetList", { data: dataParams }, { headers: headers })
            if (bankList.status === 200 && bankList.data.response_code === 200 && bankList.data.response_new_token.length === 0) {
                bankList.data.response_data = bankList.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                setListBank(bankList.data.response_data)
            } else if (bankList.status === 200 && bankList.data.response_code === 200 && bankList.data.response_new_token.length !== 0) {
                setUserSession(bankList.data.response_new_token)
                bankList.data.response_data = bankList.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                setListBank(bankList.data.response_data)
            }
        } catch (error) {
            // console.log(error)
            // RouteTo(errorCatch(error.response.status))
            // history.push(errorCatch(error.response.status))
        }
    }

    async function getRekeningList() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listRekening = await axios.post(BaseURL + "/Partner/GetAccountList", { data: "" }, { headers: headers })
            if (listRekening.status === 200 && listRekening.data.response_code === 200 && listRekening.data.response_new_token.length === 0) {
                listRekening.data.response_data = listRekening.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                setRekeningList(listRekening.data.response_data)
            } else if (listRekening.status === 200 && listRekening.data.response_code === 200 && listRekening.data.response_new_token.length !== 0) {
                setUserSession(listRekening.data.response_new_token)
                listRekening.data.response_data = listRekening.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                setRekeningList(listRekening.data.response_data)
            }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function feeBankList() {
        try {
          const auth = "Bearer " + getToken()
          const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const listFeeBank = await axios.post(BaseURL + "/Partner/GetFeeDisbursement", { data: "" }, { headers: headers })
          if (listFeeBank.status === 200 && listFeeBank.data.response_code === 200 && listFeeBank.data.response_new_token.length === 0) {
            setFeeBank(listFeeBank.data.response_data)
          } else if (listFeeBank.status === 200 && listFeeBank.data.response_code === 200 && listFeeBank.data.response_new_token.length !== 0) {
            setUserSession(listFeeBank.data.response_new_token)
            setFeeBank(listFeeBank.data.response_data)
          }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
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
                const detailBalance = getBalance.data.response_data.balance_detail
                let total = 0
                let totalHoldBalance = 0
                detailBalance.forEach((item) => {
                    if (item.mpaytype_mpaycat_id === 2) {
                        total += item.mpartballchannel_balance
                    }
                    totalHoldBalance += item.hold_balance
                })
                setGetBalance(total)
                setBalanceDetail(getBalance.data.response_data.balance_detail)
                setTotalHoldBalance(totalHoldBalance)
            } else if (getBalance.data.response_code === 200 && getBalance.status === 200 && getBalance.data.response_new_token.length !== 0) {
                setUserSession(getBalance.data.response_new_token)
                const detailBalance = getBalance.data.response_data.balance_detail
                let total = 0
                let totalHoldBalance = 0
                detailBalance.forEach((item) => {
                    if (item.mpaytype_mpaycat_id === 2) {
                        total += item.mpartballchannel_balance
                    }
                    totalHoldBalance += item.hold_balance
                })
                setGetBalance(total)
                setBalanceDetail(getBalance.data.response_data.balance_detail)
                setTotalHoldBalance(totalHoldBalance)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
          }
    }

    const handleRowClicked = (row, enable) => {
        setAlertSaldo(false)
        filterItemsBank.forEach(item => {
            if (enable === true) {
                if (row === item.mbank_code) {
                    setInputData({
                        bankName: item.mbank_name,
                        bankCode: item.mbank_code
                    });
                    setShowBank(false)
                }
            } else {
                return
            }
        });
    };

    const handleRowClickedRekening = row => {
        setAlertSaldo(false)
        setAlertNotValid(false)
        setInputRekening({
            bankNameRek: row.mbankaccountlist_name,
            bankNumberRek: row.mbankaccountlist_number
        })
        setInputData({
            bankCode: row.mbankaccountlist_bank_code,
            bankName: row.mbank_name
        })
        setInputHandle({
            ...inputHandle,
            bankCabang: row.mbankaccountlist_branch_name,
            // nominal: Number(inputHandle.nominal),
            // emailPenerima: inputHandle.emailPenerima,
            // catatan: inputHandle.catatan
        })
        setShowDaftarRekening(false)
    };

    function handleChange(e) {
        if (e.target.name === "emailPenerima") {
            setErrMsgEmail(false)
        }
        // if (e.target.name === "nominal" && Number(e.target.value) >= 10000) {
        //     setAlertSaldo(false)
        //     setAlertMinSaldo(false)
        // } else if (e.target.name === "nominal" && Number(e.target.value) < 10000) {
        //     setAlertSaldo(false)
        //     setAlertMinSaldo(true)
        // }
        if (e.target.name === "bankCabang") {
            setAlertNotValid(false)
        }
        setInputHandle({
            ...inputHandle,
            [e.target.name] : (e.target.name === "nominal") ? Number(e.target.value).toString() : e.target.value
        })
    }

    function handleChangeNominal(e) {
        // console.log(e, "e");
        if (Number(e) >= 10000) {
            setAlertSaldo(false)
            setAlertMinSaldo(false)  
        } else {
            setAlertSaldo(false)
            setAlertMinSaldo(true)
        }

        setInputHandle({
            ...inputHandle,
            nominal: e
        })
    }
    
    // console.log(inputData.bankName,"bankName");
    // console.log(inputData.bankCode,"bankCode");
    // console.log(inputRekening.bankNameRek,"bankNameRek");
    // console.log(inputRekening.bankNumberRek,"bankNumberRek");
    // console.log(inputHandle.bankCabang,"bankCabang");
    // console.log(inputHandle.nominal,"nominal");
    // console.log(inputHandle.emailPenerima.length,"emailPenerima");
    // console.log(inputHandle.catatan,"catatan");
    // console.log(isChecked,"saveAcc");
    // console.log(dataDisburse,"dataDisburse");
    // console.log(allFee, "all fee");
    
    function handleChangeRek(e) {
        // if (e.target.name === 'bankNameRek' && e.target.value.length <= 20) {
        //     setAlertSaldo(false)
        //     setInputRekening({
        //         ...inputRekening,
        //         [e.target.name] : e.target.value
        //     })
        // } else if (e.target.name !== 'bankNameRek') {
        //     setAlertSaldo(false)
        //     setInputRekening({
        //         ...inputRekening,
        //         [e.target.name] : e.target.value
        //     })
        // }
        setAlertSaldo(false)
        setInputRekening({
            ...inputRekening,
            [e.target.name] : e.target.value
        })
    }

//    var sisa = ((getBalance) - (sum(allNominal) + sum(allFee)))
   
//    console.log(sisa, "sisa");

    function saveNewDisburse (
        number,
        bankNameTujuan,
        bankCodeTujuan,
        cabang,
        noRek,
        nameRek,
        nominal,
        emailPenerima,
        catatan,
        saveAcc
    ) {
        // console.log('onclick tambah');
        if (emailPenerima.length !== 0 && validator.isEmail(emailPenerima) === false) {
            setErrMsgEmail(true)
            return
        }

        if (bankCodeTujuan !== "014") {
            if ((cabang.length !== 0 && (cabang.trim().length === 0)) || (cabang.length !== 0 && (cabang.toLowerCase() === cabang.toUpperCase()))) {
                setAlertNotValid(true)
                return
            } else {
                setAlertNotValid(false)
                
            }
        } else {
            setAlertNotValid(false)
        }
        const balanceBank = balanceDetail.find((item) => {
            if (bankCodeTujuan === "014" || bankCodeTujuan === "011") {
                return item.channel_id === bankCodeTujuan
            } else {
                bankCodeTujuan = "BIF"
                return item.channel_id === bankCodeTujuan
            }
        })
        // console.log(nominal <= balanceBank.mpartballchannel_balance, 'masuk0');
        if (nominal <= balanceBank.mpartballchannel_balance) {
            // console.log('masuk1');
            setAlertSaldo(false)
            let sameFlag = 0
            dataDisburse.forEach((val) => {
                if (val.noRek === noRek && Number(val.nominal) === Number(nominal)) {
                    sameFlag++
                }
            })
            if (sameFlag === 0) {
                // console.log('masuk2');
                setShowModalDuplikasi(false)
                const result = feeBank.find((item) => {
                    if (bankCodeTujuan === "014" || bankCodeTujuan === "011") {
                        return item.mpaytype_bank_code === bankCodeTujuan
                    } else {
                        bankCodeTujuan = "BIF"
                        return item.mpaytype_bank_code === bankCodeTujuan
                    }
                })
                if (bankCodeTujuan === '014') {
                    // console.log('masuk3');
                    if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                        // console.log(sisaSaldoAlokasiPerBank.bca, 'sisaSaldoAlokasiPerBank.bca');
                        // console.log(balanceBank.mpartballchannel_balance, 'balanceBank.mpartballchannel_balance');
                        // console.log(balanceBank.hold_balance, 'balanceBank.hold_balance');
                        // console.log(Number(nominal) + result.fee_total, 'Number(nominal) + result.fee_total');
                        // console.log(Number(nominal), 'Number(nominal)');
                        // console.log(result.fee_total, 'result.fee_total');
                        setAlertSaldo(true)
                    } else {
                        const newData = {
                            number: number,
                            bankNameTujuan: bankNameTujuan,
                            bankCodeTujuan: inputData.bankCode,
                            cabang: (cabang.length === 0 || cabang === "") ? "-" : cabang,
                            noRek : noRek,
                            nameRek: nameRek,
                            nominal: Number(nominal),
                            emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                            catatan: catatan.length !== 0 ? catatan : "",
                            saveAcc: saveAcc,
                            feeTotal: result.fee_total
                        }
                        setSisaSaldoAlokasiPerBank({
                            ...sisaSaldoAlokasiPerBank,
                            bca: (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                        })
                        setAllFee([...allFee, result.fee_total])
                        setDataDisburse([...dataDisburse, newData])
                        setAllNominal([...allNominal, Number(nominal)])
                        setInputData({
                            bankName: "",
                            bankCode: "",
                        })
                        setInputRekening({
                            bankNameRek: "",
                            bankNumberRek: ""
                        })
                        setInputHandle({
                            bankCabang: "",
                            nominal: "",
                            emailPenerima: "",
                            catatan: ""
                        })
                        setAlertSaldo(false)
                        setIsChecked(false)
                    }
                } else if (bankCodeTujuan === '011') {
                    if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                        setAlertSaldo(true)
                    } else {
                        const newData = {
                            number: number,
                            bankNameTujuan: bankNameTujuan,
                            bankCodeTujuan: inputData.bankCode,
                            cabang: cabang,
                            noRek : noRek,
                            nameRek: nameRek,
                            nominal: Number(nominal),
                            emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                            catatan: catatan.length !== 0 ? catatan : "",
                            saveAcc: saveAcc,
                            feeTotal: result.fee_total
                        }
                        setSisaSaldoAlokasiPerBank({
                            ...sisaSaldoAlokasiPerBank,
                            danamon: (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                        })
                        setAllFee([...allFee, result.fee_total])
                        setDataDisburse([...dataDisburse, newData])
                        setAllNominal([...allNominal, Number(nominal)])
                        setInputData({
                            bankName: "",
                            bankCode: "",
                        })
                        setInputRekening({
                            bankNameRek: "",
                            bankNumberRek: ""
                        })
                        setInputHandle({
                            bankCabang: "",
                            nominal: "",
                            emailPenerima: "",
                            catatan: ""
                        })
                        setAlertSaldo(false)
                        setIsChecked(false)
                    }
                } else {
                    if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                        setAlertSaldo(true)
                    } else {
                        const newData = {
                            number: number,
                            bankNameTujuan: bankNameTujuan,
                            bankCodeTujuan: inputData.bankCode,
                            cabang: cabang,
                            noRek : noRek,
                            nameRek: nameRek,
                            nominal: Number(nominal),
                            emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                            catatan: catatan.length !== 0 ? catatan : "",
                            saveAcc: saveAcc,
                            feeTotal: result.fee_total
                        }
                        setSisaSaldoAlokasiPerBank({
                            ...sisaSaldoAlokasiPerBank,
                            bifast: (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                        })
                        setAllFee([...allFee, result.fee_total])
                        setDataDisburse([...dataDisburse, newData])
                        setAllNominal([...allNominal, Number(nominal)])
                        setInputData({
                            bankName: "",
                            bankCode: "",
                        })
                        setInputRekening({
                            bankNameRek: "",
                            bankNumberRek: ""
                        })
                        setInputHandle({
                            bankCabang: "",
                            nominal: "",
                            emailPenerima: "",
                            catatan: ""
                        })
                        setAlertSaldo(false)
                        setIsChecked(false)
                    }
                }
            } else {
                setShowModalDuplikasi(true)
            }
        } else {
            setAlertSaldo(true)
        }
    }

    function lanjutSaveNew (
        number,
        bankNameTujuan,
        bankCodeTujuan,
        cabang,
        noRek,
        nameRek,
        nominal,
        emailPenerima,
        catatan,
        saveAcc
    ) {
        if (bankCodeTujuan !== "014") {
            if ((cabang.length !== 0 && (cabang.trim().length === 0)) || (cabang.length !== 0 && (cabang.toLowerCase() === cabang.toUpperCase()))) {
                setAlertNotValid(true)
                return
            } else {
                setAlertNotValid(false)
                
            }
        } else {
            setAlertNotValid(false)
        }
        const balanceBank = balanceDetail.find((item) => {
            if (bankCodeTujuan === "014" || bankCodeTujuan === "011") {
                return item.channel_id === bankCodeTujuan
            } else {
                bankCodeTujuan = "BIF"
                return item.channel_id === bankCodeTujuan

            }
        })
        if (nominal <= balanceBank.mpartballchannel_balance) {
            setAlertSaldo(false)
            const result = feeBank.find((item) => {
                if (bankCodeTujuan === "014" || bankCodeTujuan === "011") {
                    return item.mpaytype_bank_code === bankCodeTujuan
                } else {
                    bankCodeTujuan = "BIF"
                    return item.mpaytype_bank_code === bankCodeTujuan
                }
            })
            if (bankCodeTujuan === '014') {
                if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                    setAlertSaldo(true)
                } else {
                    const newData = {
                        number: number,
                        bankNameTujuan: bankNameTujuan,
                        bankCodeTujuan: inputData.bankCode,
                        cabang: (cabang.length === 0 || cabang === "") ? "-" : cabang,
                        noRek : noRek,
                        nameRek: nameRek,
                        nominal: Number(nominal),
                        emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                        catatan: catatan.length !== 0 ? catatan : "",
                        saveAcc: saveAcc,
                        feeTotal: result.fee_total
                    }
                    setSisaSaldoAlokasiPerBank({
                        ...sisaSaldoAlokasiPerBank,
                        bca: (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                    })
                    setAllFee([...allFee, result.fee_total])
                    setDataDisburse([...dataDisburse, newData])
                    setAllNominal([...allNominal, Number(nominal)])
                    setInputData({
                        bankName: "",
                        bankCode: "",
                    })
                    setInputRekening({
                        bankNameRek: "",
                        bankNumberRek: ""
                    })
                    setInputHandle({
                        bankCabang: "",
                        nominal: "",
                        emailPenerima: "",
                        catatan: ""
                    })
                    setIsChecked(false)
                    setShowModalDuplikasi(false)
                }
            } else if (bankCodeTujuan === '011') {
                if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                    setAlertSaldo(true)
                } else {
                    const newData = {
                        number: number,
                        bankNameTujuan: bankNameTujuan,
                        bankCodeTujuan: inputData.bankCode,
                        cabang: cabang,
                        noRek : noRek,
                        nameRek: nameRek,
                        nominal: Number(nominal),
                        emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                        catatan: catatan.length !== 0 ? catatan : "",
                        saveAcc: saveAcc,
                        feeTotal: result.fee_total
                    }
                    setSisaSaldoAlokasiPerBank({
                        ...sisaSaldoAlokasiPerBank,
                        danamon: (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                    })
                    setAllFee([...allFee, result.fee_total])
                    setDataDisburse([...dataDisburse, newData])
                    setAllNominal([...allNominal, Number(nominal)])
                    setInputData({
                        bankName: "",
                        bankCode: "",
                    })
                    setInputRekening({
                        bankNameRek: "",
                        bankNumberRek: ""
                    })
                    setInputHandle({
                        bankCabang: "",
                        nominal: "",
                        emailPenerima: "",
                        catatan: ""
                    })
                    setIsChecked(false)
                    setShowModalDuplikasi(false)
                }
            } else {
                if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                    setAlertSaldo(true)
                } else {
                    const newData = {
                        number: number,
                        bankNameTujuan: bankNameTujuan,
                        bankCodeTujuan: inputData.bankCode,
                        cabang: cabang,
                        noRek : noRek,
                        nameRek: nameRek,
                        nominal: Number(nominal),
                        emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                        catatan: catatan.length !== 0 ? catatan : "",
                        saveAcc: saveAcc,
                        feeTotal: result.fee_total
                    }
                    setSisaSaldoAlokasiPerBank({
                        ...sisaSaldoAlokasiPerBank,
                        bifast: (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                    })
                    setAllFee([...allFee, result.fee_total])
                    setDataDisburse([...dataDisburse, newData])
                    setAllNominal([...allNominal, Number(nominal)])
                    setInputData({
                        bankName: "",
                        bankCode: "",
                    })
                    setInputRekening({
                        bankNameRek: "",
                        bankNumberRek: ""
                    })
                    setInputHandle({
                        bankCabang: "",
                        nominal: "",
                        emailPenerima: "",
                        catatan: ""
                    })
                    setIsChecked(false)
                    setShowModalDuplikasi(false)
                }
            }
            
        } else {
            setAlertSaldo(true)
        }
    }

    function editDataDisburse(numberId) {
        setEditTabelDisburse(true)
        const result = dataDisburse.find((item) => item.number === numberId);
        setInputData({
            bankName: result.bankNameTujuan,
            bankCode: result.bankCodeTujuan
        })
        setInputRekening({
            bankNameRek: result.nameRek,
            bankNumberRek: result.noRek
        })
        setInputHandle({
            bankCabang: result.cabang,
            nominal: Number(result.nominal),
            emailPenerima: result.emailPenerima,
            catatan: result.catatan
        })
        setNumbering(result.number)
        setIsChecked(result.saveAcc)
    }

    function saveEditDataDisburse(
        number,
        bankNameTujuan,
        bankCodeTujuan,
        cabang,
        noRek,
        nameRek,
        nominal,
        emailPenerima,
        catatan,
        saveAcc,
        dataDisburse
    ) {
        
        if (emailPenerima.length !== 0 && validator.isEmail(emailPenerima) === false) {
            setErrMsgEmail(true)
            return
        }
        if (bankCodeTujuan !== "014") {
            if ((cabang.length !== 0 && (cabang.trim().length === 0)) || (cabang.length !== 0 && (cabang.toLowerCase() === cabang.toUpperCase()))) {
                setAlertNotValid(true)
                return
            } else {
                setAlertNotValid(false)
                
            }
        } else {
            setAlertNotValid(false)
        }
        const balanceBank = balanceDetail.find((item) => {
            if (bankCodeTujuan === "014" || bankCodeTujuan === "011") {
                return item.channel_id === bankCodeTujuan
            } else {
                bankCodeTujuan = "BIF"
                return item.channel_id === bankCodeTujuan
            }
        })
        if (nominal <= balanceBank.mpartballchannel_balance) {
            setAlertSaldo(false)
            let sameFlag = 0
            const results = dataDisburse.filter(res => res.number !== number)
            results.forEach((val) => {
                if (val.noRek === noRek && Number(val.nominal) === Number(nominal)) {
                    sameFlag++
                }
            })
            if (sameFlag === 0) {
                setShowModalDuplikasi(false)
                const finding = dataDisburse.findIndex((object) => {
                    return object.number === number
                })
                const result = feeBank.find((item) => {
                    if (bankCodeTujuan === "014" || bankCodeTujuan === "011") {
                        return item.mpaytype_bank_code === bankCodeTujuan
                    } else {
                        bankCodeTujuan = "BIF"
                        return item.mpaytype_bank_code === bankCodeTujuan
                    }
                })
                const dataLama = dataDisburse.find((item) => item.number === number);
                
                if (dataLama.bankCodeTujuan === bankCodeTujuan || bankCodeTujuan === 'BIF') {
                    if (bankCodeTujuan === '014') {
                        if (Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                            setAlertSaldo(true)
                            return
                        } else {
                            setAlertSaldo(false)
                            setSisaSaldoAlokasiPerBank({
                                ...sisaSaldoAlokasiPerBank,
                                [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                            })
                        }
                    } else if (bankCodeTujuan === "011") {
                        if (Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                            setAlertSaldo(true)
                            return
                        } else {
                            setAlertSaldo(false)
                            setSisaSaldoAlokasiPerBank({
                                ...sisaSaldoAlokasiPerBank,
                                [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                            })
                        }
                    } else {
                        if (Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                            setAlertSaldo(true)
                            return
                        } else {
                            setAlertSaldo(false)
                            setSisaSaldoAlokasiPerBank({
                                ...sisaSaldoAlokasiPerBank,
                                [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                            })
                        }
                    }
                } else {
                    if (dataLama.bankCodeTujuan === '014') {
                        if (bankCodeTujuan === "011") {
                            if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                                setAlertSaldo(true)
                                return
                            } else {
                                setAlertSaldo(false)
                                setSisaSaldoAlokasiPerBank({
                                    ...sisaSaldoAlokasiPerBank,
                                    bca: sisaSaldoAlokasiPerBank.bca + (dataLama.nominal + dataLama.feeTotal),
                                    [(bankCodeTujuan === '011') ? 'danamon' : 'bifast']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total) 
                                })
                            }
                        } else {
                            if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                                setAlertSaldo(true)
                                return
                            } else {
                                setAlertSaldo(false)
                                setSisaSaldoAlokasiPerBank({
                                    ...sisaSaldoAlokasiPerBank,
                                    bca: sisaSaldoAlokasiPerBank.bca + (dataLama.nominal + dataLama.feeTotal),
                                    [(bankCodeTujuan === '011') ? 'danamon' : 'bifast']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance)) - (Number(nominal) + result.fee_total) 
                                })
                            }
                        }
                    } else if (dataLama.bankCodeTujuan === '011') {
                        if (bankCodeTujuan === "014") {
                            if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                                setAlertSaldo(true)
                                return
                            } else {
                                setAlertSaldo(false)
                                setSisaSaldoAlokasiPerBank({
                                    ...sisaSaldoAlokasiPerBank,
                                    danamon: sisaSaldoAlokasiPerBank.danamon + (dataLama.nominal + dataLama.feeTotal),
                                    [(bankCodeTujuan === '014') ? 'bca' : 'bifast']: ((bankCodeTujuan === '014') ? (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total) 
                                })
                            }
                        } else {
                            if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                                setAlertSaldo(true)
                                return
                            } else {
                                setAlertSaldo(false)
                                setSisaSaldoAlokasiPerBank({
                                    ...sisaSaldoAlokasiPerBank,
                                    danamon: sisaSaldoAlokasiPerBank.danamon + (dataLama.nominal + dataLama.feeTotal),
                                    [(bankCodeTujuan === '014') ? 'bca' : 'bifast']: ((bankCodeTujuan === '014') ? (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total) 
                                })
                            }
                        }
                    } else {
                        if (bankCodeTujuan === "014") {
                            if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                                setAlertSaldo(true)
                                return
                            } else {
                                setAlertSaldo(false)
                                setSisaSaldoAlokasiPerBank({
                                    ...sisaSaldoAlokasiPerBank,
                                    bifast: sisaSaldoAlokasiPerBank.bifast + (dataLama.nominal + dataLama.feeTotal),
                                    [(bankCodeTujuan === '011') ? 'danamon' : 'bca']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total) 
                                })
                            }
                        } else {
                            if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                                setAlertSaldo(true)
                                return
                            } else {
                                setAlertSaldo(false)
                                setSisaSaldoAlokasiPerBank({
                                    ...sisaSaldoAlokasiPerBank,
                                    bifast: sisaSaldoAlokasiPerBank.bifast + (dataLama.nominal + dataLama.feeTotal),
                                    [(bankCodeTujuan === '011') ? 'danamon' : 'bca']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total) 
                                })
                            }
                        }
                    }
                }

                if (finding >= 0) {
                    allNominal[finding] = Number(nominal)
                    allFee[finding] = result.fee_total
                }
                setAllFee([...allFee])
                const target = dataDisburse.find((item) => item.number === number)
                const source = {
                    number: number,
                    bankNameTujuan: bankNameTujuan,
                    bankCodeTujuan: inputData.bankCode,
                    cabang: (cabang.length === 0 || cabang === "") ? "-" : cabang,
                    noRek : noRek,
                    nameRek: nameRek,
                    nominal: Number(nominal),
                    emailPenerima: emailPenerima,
                    catatan: catatan,
                    saveAcc: saveAcc,
                    feeTotal: result.fee_total
                };
                Object.assign(target, source)
                setDataDisburse([...dataDisburse])
                setAllNominal([...allNominal])
                setEditTabelDisburse(false)
                setInputData({
                    bankName: "",
                    bankCode: "",
                })
                setInputRekening({
                    bankNameRek: "",
                    bankNumberRek: ""
                })
                setInputHandle({
                    bankCabang: "",
                    nominal: "",
                    emailPenerima: "",
                    catatan: ""
                })
                setNumbering(0)
                setIsChecked(false)
                
            } else {
                setShowModalDuplikasi(true)
            }
        } else {
            setAlertSaldo(true)
        }
        
        
    }

    function lanjutSaveEdit (
        number,
        bankNameTujuan,
        bankCodeTujuan,
        cabang,
        noRek,
        nameRek,
        nominal,
        emailPenerima,
        catatan,
        saveAcc,
    ) {
        if (emailPenerima.length !== 0 && validator.isEmail(emailPenerima) === false) {
            setErrMsgEmail(true)
            return
        }
        if (bankCodeTujuan !== "014") {
            if ((cabang.length !== 0 && (cabang.trim().length === 0)) || (cabang.length !== 0 && (cabang.toLowerCase() === cabang.toUpperCase()))) {
                setAlertNotValid(true)
                return
            } else {
                setAlertNotValid(false)
                
            }
        } else {
            setAlertNotValid(false)
        }
        const balanceBank = balanceDetail.find((item) => {
            if (bankCodeTujuan === "014" || bankCodeTujuan === "011") {
                return item.channel_id === bankCodeTujuan
            } else {
                bankCodeTujuan = "BIF"
                return item.channel_id === bankCodeTujuan
            }
        })
        if (nominal <= balanceBank.mpartballchannel_balance) {
            setAlertSaldo(false)

            const finding = dataDisburse.findIndex((object) => {
                return object.number === number
            })
            const result = feeBank.find((item) => {
                if (bankCodeTujuan === "014" || bankCodeTujuan === "011") {
                    return item.mpaytype_bank_code === bankCodeTujuan
                } else {
                    bankCodeTujuan = "BIF"
                    return item.mpaytype_bank_code === bankCodeTujuan
                }
            })
            const dataLama = dataDisburse.find((item) => item.number === number);


            if (dataLama.bankCodeTujuan === bankCodeTujuan || bankCodeTujuan === 'BIF') {
                if (bankCodeTujuan === '014') {
                    if (Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                        setAlertSaldo(true)
                        return
                    } else {
                        setAlertSaldo(false)
                        setSisaSaldoAlokasiPerBank({
                            ...sisaSaldoAlokasiPerBank,
                            [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                        })
                    }
                } else if (bankCodeTujuan === "011") {
                    if (Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                        setAlertSaldo(true)
                        return
                    } else {
                        setAlertSaldo(false)
                        setSisaSaldoAlokasiPerBank({
                            ...sisaSaldoAlokasiPerBank,
                            [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                        })
                    }
                } else {
                    if (Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                        setAlertSaldo(true)
                        return
                    } else {
                        setAlertSaldo(false)
                        setSisaSaldoAlokasiPerBank({
                            ...sisaSaldoAlokasiPerBank,
                            [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                        })
                    }
                }
            } else {
                if (dataLama.bankCodeTujuan === '014') {
                    if (bankCodeTujuan === "011") {
                        if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                            setAlertSaldo(true)
                            return
                        } else {
                            setAlertSaldo(false)
                            setSisaSaldoAlokasiPerBank({
                                ...sisaSaldoAlokasiPerBank,
                                bca: sisaSaldoAlokasiPerBank.bca + (dataLama.nominal + dataLama.feeTotal),
                                [(bankCodeTujuan === '011') ? 'danamon' : 'bifast']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance)) - (Number(nominal) + result.fee_total) 
                            })
                        }
                    } else {
                        if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                            setAlertSaldo(true)
                            return
                        } else {
                            setAlertSaldo(false)
                            setSisaSaldoAlokasiPerBank({
                                ...sisaSaldoAlokasiPerBank,
                                bca: sisaSaldoAlokasiPerBank.bca + (dataLama.nominal + dataLama.feeTotal),
                                [(bankCodeTujuan === '011') ? 'danamon' : 'bifast']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total) 
                            })
                        }
                    }
                } else if (dataLama.bankCodeTujuan === '011') {
                    if (bankCodeTujuan === "014") {
                        if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                            setAlertSaldo(true)
                            return
                        } else {
                            setAlertSaldo(false)
                            setSisaSaldoAlokasiPerBank({
                                ...sisaSaldoAlokasiPerBank,
                                danamon: sisaSaldoAlokasiPerBank.danamon + (dataLama.nominal + dataLama.feeTotal),
                                [(bankCodeTujuan === '014') ? 'bca' : 'bifast']: ((bankCodeTujuan === '014') ? (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total) 
                            })
                        }
                    } else {
                        if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                            setAlertSaldo(true)
                            return
                        } else {
                            setAlertSaldo(false)
                            setSisaSaldoAlokasiPerBank({
                                ...sisaSaldoAlokasiPerBank,
                                danamon: sisaSaldoAlokasiPerBank.danamon + (dataLama.nominal + dataLama.feeTotal),
                                [(bankCodeTujuan === '014') ? 'bca' : 'bifast']: ((bankCodeTujuan === '014') ? (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total) 
                            })
                        }
                    }
                } else {
                    if (bankCodeTujuan === "014") {
                        if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                            setAlertSaldo(true)
                            return
                        } else {
                            setAlertSaldo(false)
                            setSisaSaldoAlokasiPerBank({
                                ...sisaSaldoAlokasiPerBank,
                                bifast: sisaSaldoAlokasiPerBank.bifast + (dataLama.nominal + dataLama.feeTotal),
                                [(bankCodeTujuan === '011') ? 'danamon' : 'bca']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total) 
                            })
                        }
                    } else {
                        if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                            setAlertSaldo(true)
                            return
                        } else {
                            setAlertSaldo(false)
                            setSisaSaldoAlokasiPerBank({
                                ...sisaSaldoAlokasiPerBank,
                                bifast: sisaSaldoAlokasiPerBank.bifast + (dataLama.nominal + dataLama.feeTotal),
                                [(bankCodeTujuan === '011') ? 'danamon' : 'bca']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total) 
                            })
                        }
                    }
                }
            }

            if (finding) {
                allNominal[finding] = Number(nominal)
                allFee[finding] = result.fee_total
            }
            setAllFee([...allFee])
            const target = dataDisburse.find((item) => item.number === number)
            const source = {
                number: number,
                bankNameTujuan: bankNameTujuan,
                bankCodeTujuan: inputData.bankCode,
                cabang: (cabang.length === 0 || cabang === "") ? "-" : cabang,
                noRek : noRek,
                nameRek: nameRek,
                nominal: Number(nominal),
                emailPenerima: emailPenerima,
                catatan: catatan,
                saveAcc: saveAcc,
                feeTotal: result.fee_total
            };
            
            Object.assign(target, source)
            setDataDisburse([...dataDisburse])
            
            setAllNominal([...allNominal])
            setEditTabelDisburse(false)
            setInputData({
                bankName: "",
                bankCode: "",
            })
            setInputRekening({
                bankNameRek: "",
                bankNumberRek: ""
            })
            setInputHandle({
                bankCabang: "",
                nominal: "",
                emailPenerima: "",
                catatan: ""
            })
            setNumbering(0)
            setIsChecked(false)
            setShowModalDuplikasi(false)
        } else {
            setAlertSaldo(true)
        }
    }

    function batalEdit () {
        setEditTabelDisburse(false)
        setInputData({
            bankName: "",
            bankCode: "",
        })
        setInputRekening({
            bankNameRek: "",
            bankNumberRek: ""
        })
        setInputHandle({
            bankCabang: "",
            nominal: "",
            emailPenerima: "",
            catatan: ""
        })
        setNumbering(0)
        setIsChecked(false)
    }

    function deleteDataDisburse(numberId) {
        const result = dataDisburse.findIndex((item) => item.number === numberId);
        const dataLama = dataDisburse.find((item) => item.number === numberId);
        dataDisburse.splice(result, 1);
        setDataDisburse([...dataDisburse]);
        allFee.splice(result, 1)
        allNominal.splice(result, 1)
        setAllFee([...allFee])
        setAllNominal([...allNominal])
        setInputData({
            bankName: "",
            bankCode: ""
        })
        setInputRekening({
            bankNameRek: "",
            bankNumberRek: ""
        })
        setInputHandle({
            bankCabang: "",
            nominal: "",
            emailPenerima: "",
            catatan: ""
        })
        setSisaSaldoAlokasiPerBank({
            ...sisaSaldoAlokasiPerBank,
            [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal)
        })
    }

    function createDataDisburseExcel (dataDisburse, isDisburseManual, dataBulkOrigin) {
        // console.log(isDisburseManual, '!isDisbursementManual');
        // console.log(dataBulkOrigin, 'dataBulkOrigin');
        let dataExcel = []
        for (let i = 0; i < dataDisburse.length; i++) {
            // dataExcel.push({"bank_code": (isDisburseManual === true ? dataDisburse[i].bankCodeTujuan : dataDisburse[i].bankCode), "branch_name": (isDisburseManual === true ? dataDisburse[i].cabang : dataDisburse[i].cabangBank), "account_number": (isDisburseManual === true ? dataDisburse[i].noRek : dataDisburse[i].noRekening), "account_name": (isDisburseManual === true ? dataDisburse[i].nameRek : dataDisburse[i].ownerName), "amount": (isDisburseManual === true ? dataDisburse[i].nominal : dataDisburse[i].nominalDisbursement), "email": (isDisburseManual === true ? dataDisburse[i].emailPenerima : dataDisburse[i].email), "description": (isDisburseManual === true ? dataDisburse[i].catatan : dataDisburse[i].note), "save_account_number": (isDisburseManual === true ? dataDisburse[i].saveAcc : false)}) //untuk csv
            dataExcel.push({"bank_code": (isDisburseManual === true ? dataDisburse[i].bankCodeTujuan : dataDisburse[i]["Bank Tujuan*"].slice(0, 3)), "branch_name": (isDisburseManual === true ? dataDisburse[i].cabang : dataDisburse[i]["Cabang (Khusus Non-BCA)*"]), "account_number": (isDisburseManual === true ? dataDisburse[i].noRek : dataDisburse[i]["No. Rekening Tujuan*"]), "account_name": (isDisburseManual === true ? dataDisburse[i].nameRek : dataDisburse[i]["Nama Pemilik Rekening*"]), "amount": (isDisburseManual === true ? dataDisburse[i].nominal : dataDisburse[i]["Nominal Disbursement*"]), "email": (isDisburseManual === true ? dataDisburse[i].emailPenerima : dataDisburse[i]["Email Penerima"]), "description": (isDisburseManual === true ? dataDisburse[i].catatan : dataDisburse[i].Catatan), "save_account_number": (isDisburseManual === true ? dataDisburse[i].saveAcc : false)})
        }
        let workSheet = XLSX.utils.json_to_sheet(dataExcel)
        let workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
        // XLSX.writeFile(workBook, "Disbursement Report.xlsx");
        const convertFile = XLSX.write(workBook, {bookType: "xlsx", type: "array"})
        var data = new Blob([new Uint8Array(convertFile)], { type: "application/octet-stream"})
        // origin data bulk
        if (dataBulkOrigin !== undefined) {
            let workSheetOrigin = XLSX.utils.json_to_sheet(dataBulkOrigin)
            let workBookOrigin = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBookOrigin, workSheetOrigin, "Sheet1");
            // XLSX.writeFile(workBookOrigin, "Disbursement Report Origin.xlsx");
            const convertFileOrigin = XLSX.write(workBookOrigin, {bookType: "xlsx", type: "array"})
            var dataOriginBulk = new Blob([new Uint8Array(convertFileOrigin)], { type: "application/octet-stream"})
            setDataExcelOriginDisburse(dataOriginBulk)
        }
        // console.log(workBook, 'workBook');
        setDataExcelDisburse(data)
        setShowModalConfirm(true)
    }

    async function sendDataDisburse (data, dataOrigin, isDisburseManual) {
        try {
            const auth = "Bearer " + getToken()
            var formData = new FormData()
            formData.append('file_excel', data, 'file_data_karyawan.xlsx')
            
            // var formDataOrigin = new FormData()
            formData.append('file_excel', (isDisburseManual ? data : dataOrigin), 'file_data_karyawan_original_upload.xlsx')
            const headers = {
                'Content-Type':'multipart/form-data',
                'Authorization' : auth
            }
            // console.log(formData, 'formData');
            // console.log(formDataOrigin, 'formDataOrigin');
            const dataSendHandler = await axios.post(BaseURL + "/Partner/UploadDisbursementFile", formData, {headers: headers})
            // console.log(dataSendHandler, 'dataSendHandler');
            if (dataSendHandler.data.response_code === 200 && dataSendHandler.status === 200 && dataSendHandler.data.response_new_token.length === 0) {
                setShowModalConfirm(false)
                // history.push("/disbursement/disbursementpage")
                setDataDisburse([])
                setDataFromUploadExcel([])
                setAllNominal([])
                setAllFee([])
                setShowModalStatusDisburse(true)
                setResponMsg(dataSendHandler.data.response_data.status_id)
                setTimeout(() => {
                    setShowModalStatusDisburse(false)
                }, 10000);
            } else if (dataSendHandler.data.response_code === 200 && dataSendHandler.status === 200 && dataSendHandler.data.response_new_token.length !== 0) {
                sessionStorage(dataSendHandler.data.response_new_token)
                setShowModalConfirm(false)
                // history.push("/disbursement/disbursementpage")
                setDataDisburse([])
                setDataFromUploadExcel([])
                setAllNominal([])
                setAllFee([])
                setShowModalStatusDisburse(true)
                setResponMsg(dataSendHandler.data.response_data.status_id)
                setTimeout(() => {
                    setShowModalStatusDisburse(false)
                }, 10000);
            }
        } catch (e) {
            if (e.response.data.response_message === "Failed") {
                alert(e.response.data.response_message)
            }
            history.push(errorCatch(e.response.status));
        }
    }

    function toReportDisburse () {
        history.push('/Riwayat Transaksi/disbursement')
    }

    function pindahHalaman (param) {
        if (param === "manual") {
            if ((dataFromUpload.length !== 0 || dataFromUploadExcel.length !== 0) || errorFound.length !== 0 || labelUpload === `<div class='py-4 mb-2 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
            <div className='pb-4'>
                <span class="filepond--label-action">
                    Ganti File
                </span>
            </div>`) {
                setShowModalPindahHalaman(true)
                setTab(param)
            } else {
                disbursementTabs(true)
            }
        } else {
            if (inputData.bankName.length !== 0 || inputData.bankCode.length !== 0 || inputRekening.bankNameRek.length !== 0 || inputRekening.bankNumberRek.length !== 0 || inputHandle.bankCabang.length !== 0 || inputHandle.nominal.length !== 0 || isChecked === true || inputHandle.emailPenerima.length !== 0 || inputHandle.catatan.length !== 0 || dataDisburse.length !== 0 ) {
                setShowModalPindahHalaman(true)
                setTab(param)
            } else {
                disbursementTabs(false)
            }
        }
    }

    function PindahTab (param) {
        if (param === "bulk") {
            disbursementTabs(false)
            setShowModalPindahHalaman(false)
            setInputData({
                bankName: "",
                bankCode: ""
            })
            setInputRekening({
                bankNameRek: "",
                bankNumberRek: ""
            })
            setInputHandle({
                bankCabang: "",
                nominal: "",
                emailPenerima: "",
                catatan: ""
            })
            setDataDisburse([])
            setAllFee([])
            setAllNominal([])
            setIsChecked(false)
            setNumbering(0)
        } else {
            disbursementTabs(true)
            setShowModalPindahHalaman(false)
            setDataDisburse([])
            setAllFee([])
            setAllNominal([])
            setDataFromUpload([]) // untuk csv
            setDataFromUploadExcel([]) //untuk excel
            setErrorFound([])
            setLabelUpload(`<div class='py-4 mb-2 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
            <div className='pb-4'>
                <span class="filepond--label-action">
                    Upload File
                </span>
            </div>`)
        }
    }

    function disbursementTabs(isTabs){
        setisDisbursementManual(isTabs)
        if(!isTabs){
            $('#detailakuntab').removeClass('menu-detail-akun-hr-active')
            $('#detailakunspan').removeClass('menu-detail-akun-span-active')
            $('#konfigurasitab').addClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').addClass('menu-detail-akun-span-active')
            getBankList()
        }else{
            $('#konfigurasitab').removeClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').removeClass('menu-detail-akun-span-active')
            $('#detailakuntab').addClass('menu-detail-akun-hr-active')
            $('#detailakunspan').addClass('menu-detail-akun-span-active')
        }
    }

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "#F2F2F2",
                border: "12px",
                fontWeight: "bold",
                fontSize: "16px",
                maxWidth: "max-content"
            },
        },
        cells: {
            style: {
                cursor: 'pointer',
            }
        },
    };

    const conditionalRowStylesBulk = [
        {
            when: row => row.times >= 2 || row.times === undefined,
            style: { color: 'red' }
        }
    ]

    useEffect(() => {
        getBankList()
        getRekeningList()
        feeBankList()
        getBalanceHandle()
    }, [])

    return (
        <>  
            {
                showModalStatusDisburse && (responMsg !== 0 && responMsg === 2) &&
                <div style={{ position: "fixed", zIndex: 999, width: "80%" }} className="d-flex justify-content-center align-items-center mt-4 ms-5">
                    <Toast style={{ width: "900px", backgroundColor: "#383838" }} position="bottom-center" className="text-center">
                        <Toast.Body className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Disbursement Sedang Diproses. <span style={{ textDecoration: 'underline', cursor: "pointer" }} onClick={() => toReportDisburse()}>Lihat Riwayat Disbursement</span></Toast.Body>
                    </Toast>
                </div>
            }
            <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
                <span className='breadcrumbs-span'>{ user_role === "102" ? <Link style={{ cursor: "pointer" }} to={"/Riwayat Transaksi/va-dan-paylink"}> Laporan</Link> : <Link style={{ cursor: "pointer" }} to={"/"}>Beranda</Link> }  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Disbursement</span>
                <Row className='mt-1'>
                    {
                        balanceDetail !== 0 &&
                        balanceDetail.map(detail => {
                            return (
                                <Col lg={3}>
                                    <div className="card-information base-content-beranda mt-3" style={{ padding: ((detail.channel_id === "014" && showDetailBalance.bca === true) || (detail.channel_id === "011" && showDetailBalance.danamon === true) || (detail.channel_id === "BIF" && showDetailBalance.otherBank === true) || (detail.channel_id === "DANA" && showDetailBalance.dana === true)) ? '15px 27px' : '15px 27px 1px', height: 'fit-content' }}>
                                        <Row>
                                            <Col lg={12} className="p-info">{`Saldo ${detail.mpaytype_name} yang dapat digunakan`}</Col>
                                        </Row>
                                        <Row>
                                            <Col lg={8} className="p-amount my-3">
                                                {detail.hold_balance === 0 ? convertToRupiah(detail.mpartballchannel_balance, true) : convertToRupiah(detail.mpartballchannel_balance - detail.hold_balance, true)}
                                            </Col>
                                            <Col lg={4} onClick={() => handleShowDetailBalance(detail.channel_id)} style={{ textAlign: 'right' }}>
                                                <img src={arrowDown} alt="arrow_down" style={{ marginTop: 25 }} className={((detail.channel_id === "014" && showDetailBalance.bca === true) || (detail.channel_id === "011" && showDetailBalance.danamon === true) || (detail.channel_id === "BIF" && showDetailBalance.otherBank === true) || (detail.channel_id === "DANA" && showDetailBalance.dana === true)) ? 'arrow-down-detail-open pe-2' : 'arrow-down-detail pe-2'} />
                                            </Col>
                                        </Row>
                                        {
                                            ((detail.channel_id === "014" && showDetailBalance.bca === true) || (detail.channel_id === "011" && showDetailBalance.danamon === true) || (detail.channel_id === "BIF" && showDetailBalance.otherBank === true) || (detail.channel_id === "DANA" && showDetailBalance.dana === true)) &&
                                            <Row style={{ marginTop: -5 }}>
                                                <Col lg={2} className="d-flex justify-content-end">
                                                    <FontAwesomeIcon style={{ width: 5, marginRight: 5, marginTop: 3, color: "#888888" }} icon={faCircle} />
                                                </Col>
                                                <Col lg={10} style={{ padding: 0 }}>
                                                    <span style={{ color: "#888888", fontSize: 12, fontFamily: 'Nunito', fontWeight: 400 }}>Dalam proses disbursement {convertToRupiah(detail.hold_balance, true)}</span>
                                                </Col>
                                                <Col lg={2} className="d-flex justify-content-end">
                                                    <FontAwesomeIcon style={{ width: 5, marginRight: 5, marginTop: 3, color: "#888888" }} icon={faCircle} />
                                                </Col>
                                                <Col lg={10} style={{ padding: 0 }}>
                                                    <span style={{ color: "#888888", fontSize: 12, fontFamily: 'Nunito', fontWeight: 400 }}>Saldo awal {convertToRupiah(detail.mpartballchannel_balance, true)}</span>
                                                </Col>
                                            </Row>
                                        }
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
                <Row className='mt-4'>
                    <Col lg={3}>
                        <div className="card-information base-content-beranda" style={{ padding: '15px 27px 1px', borderLeft: '6px solid rgb(7, 126, 134)' }}>
                            <p className="p-info">Total saldo dalam proses Disbursement</p>
                            <p className="p-amount" style={{ marginBottom: 12 }}>{convertToRupiah(totalHoldBalance, true)}</p>
                        </div>
                    </Col>
                </Row>
                <div className='detail-akun-menu mt-5' style={{display: 'flex', height: 33}}>
                    <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => pindahHalaman("manual")} id="detailakuntab">
                        <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">Disbursement Manual</span>
                    </div>
                    <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("bulk")} id="konfigurasitab">
                        <span className='menu-detail-akun-span' id="konfigurasispan">Disbursement Bulk</span>
                    </div>
                </div>
                {
                    isDisbursementManual ?
                    <>
                        <div id='disbursement-manual'>
                            <hr className='hr-style' style={{marginTop: -2}}/>
                            <div className='base-content mb-4 pb-4'>
                                <div className='d-flex justify-content-start align-items-center' style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'normal', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }}>
                                    <img src={noteInfo} width="25" height="25" alt="circle_info" />
                                    <div className='ms-2'>Pastikan data tujuan Disbursement sudah benar, Ezeelink tidak bertanggung jawab atas kesalahan data yang dilakukan.</div>
                                </div>
                                <div className='pt-4'>
                                    <Row className='align-items-center' style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                            Pilih Bank Tujuan <span style={{ color: "red" }}>*</span>
                                        </Col>
                                        <Col xs={10} style={{ cursor: "pointer" }} className="position-relative d-flex justify-content-between align-items-center" onClick={() => setShowBank(true)}>
                                            <Form.Control
                                                placeholder="Pilih Bank"
                                                className='input-text-user'
                                                type='text'
                                                disabled
                                                name="bankName" 
                                                value={inputData.bankName}
                                                style={{ cursor: "pointer",  backgroundColor: "#FFFFFF" }}
                                            />
                                            <div className="position-absolute right-4" ><img src={chevron} alt="time" /></div>
                                        </Col>
                                    </Row>
                                    <Row className='mb-3 mt-1' style={{ padding: 'unset' }}>
                                        <Col xs={2}></Col>
                                        <Col xs={10}>
                                            <div style={{ fontFamily:'Nunito', fontSize: 12, color: "#888888"}} className='d-flex justify-content-start align-items-center'>
                                                <span className='me-1'><img src={noteIconGrey} alt='icon error' /></span>
                                                Transfer setelah jam 12 siang untuk bank tujuan selain BCA berpotensi diterima di hari berikutnya
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className={alertNotValid === true ? `mb-1 align-items-center` : `mb-4 align-items-center`} style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                            Cabang (Khusus Non-BCA) <span style={{ color: "red" }}>*</span>
                                        </Col>
                                        <Col xs={10}>
                                            <Form.Control
                                                placeholder="Masukkan Cabang Bank "
                                                type='text'
                                                className='input-text-user'
                                                name="bankCabang"
                                                value={inputHandle.bankCabang}
                                                onChange={(e) => handleChange(e)}
                                                onKeyDown={(evt) => ["+", "-", ".", ",", "_"].includes(evt.key) && evt.preventDefault()}
                                            />
                                        </Col>
                                    </Row>
                                    {
                                        alertNotValid === true ? (
                                            <Row className='mb-3 align-items-center'>
                                                <Col xs={2}></Col>
                                                <Col xs={10}>
                                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B"}} className='text-start'>
                                                        <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                        Data tidak valid
                                                    </div>
                                                </Col>
                                            </Row>
                                        ) : ""
                                    }
                                    <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                            No. Rekening Tujuan <span style={{ color: "red" }}>*</span>
                                        </Col>
                                        <Col xs={10}>
                                            <Form.Control
                                                placeholder="Masukan No. Rekening Tujuan"
                                                type='number'
                                                className='input-text-user'
                                                name="bankNumberRek"
                                                value={inputRekening.bankNumberRek}
                                                onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                                                onChange={(e) => handleChangeRek(e)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center' style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                            Nama Pemilik Rekening <span style={{ color: "red" }}>*</span>
                                        </Col>
                                        <Col xs={10}>
                                            <Form.Control
                                                placeholder="Masukan Nama Pemilik Rekening"
                                                type='text'
                                                className='input-text-user'
                                                name="bankNameRek"
                                                value={inputRekening.bankNameRek}
                                                onChange={(e) => handleChangeRek(e)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={2}></Col>
                                        <Col xs={10}>
                                            <div className='d-flex align-items-center justify-content-between'>
                                                <div className='mb-3'>
                                                    <Form.Check
                                                        label="Simpan ke Daftar Rekening"
                                                        id="statusId"
                                                        onChange={handleChangeCheckBox}
                                                        checked={isChecked}
                                                    />
                                                </div>
                                                <div className='mb-3'>
                                                    <button
                                                        style={{
                                                            fontFamily: "Exo",
                                                            fontSize: 14,
                                                            fontWeight: 700,
                                                            alignItems: "center",
                                                            height: 48,
                                                            color: "#077E86",
                                                            background: "unset",
                                                            border: "unset",
                                                            textDecoration: 'underline'
                                                        }}
                                                        onClick={() => setShowDaftarRekening(true)}
                                                    >
                                                        Lihat Daftar Rekening
                                                    </button>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center' style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>    
                                            Nominal Disbursement <span style={{ color: "red" }}>*</span>
                                        </Col>
                                        <Col xs={10}>
                                            <CurrencyInput
                                                className='input-text-user'
                                                value={inputHandle.nominal === undefined ? 0 : inputHandle.nominal}
                                                onValueChange={(e) => handleChangeNominal(e)}
                                                placeholder="Rp 0"
                                                groupSeparator={"."}
                                                decimalSeparator={','}
                                                prefix="Rp "
                                                allowDecimals={false}
                                            />

                                            {/* {
                                                editNominal ?
                                                <Form.Control
                                                    placeholder="Rp 0"
                                                    type='number'
                                                    className='input-text-user'
                                                    min={0}
                                                    name="nominal"
                                                    value={inputHandle.nominal === undefined ? 0 : inputHandle.nominal}
                                                    onChange={(e) => handleChange(e)}
                                                    onBlur={() => setEditNominal(!editNominal)}
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", ",", "."].includes(evt.key) && evt.preventDefault()}
                                                /> :
                                                <Form.Control
                                                    placeholder="Rp 0"
                                                    type='text'
                                                    className='input-text-user'
                                                    name="nominal"
                                                    value={inputHandle.nominal === undefined ? convertToRupiah(0, true, 0) : convertToRupiah(inputHandle.nominal, true)}
                                                    onChange={(e) => handleChange(e)}
                                                    onFocus={() => setEditNominal(!editNominal)}
                                                />
                                            } */}
                                        </Col>
                                    </Row>
                                    <Row className="mt-2 mb-3">
                                        <Col xs={2}></Col>
                                        <Col xs={10}>
                                            {
                                                alertSaldo === true ? (
                                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B"}} className='text-start'>
                                                        <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                        Saldo Alokasi di {(inputData.bankCode === '014') ? inputData.bankName : (inputData.bankCode === '011') ? inputData.bankName :  `"Other Bank"`} tidak cukup
                                                    </div>
                                                ) : 
                                                alertMinSaldo === true ? (
                                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B"}} className='text-start'>
                                                        <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                        Minimal disbursement Rp. 10.000
                                                    </div>
                                                ) : (
                                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#888888"}} className='text-start'>
                                                        <span className='me-1'><img src={noteInfo} alt='icon info' /></span>
                                                        Nominal Disbursement tidak boleh mengandung Decimal
                                                    </div>
                                                )
                                            }
                                        </Col>
                                    </Row>
                                    <Row className='mb-3 align-items-center' style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                            <span style={{ fontFamily: "Nunito" }}>
                                                Email Penerima
                                            </span>
                                        </Col>
                                        <Col xs={10}>
                                            <Form.Control
                                                placeholder="Masukkan Alamat Email Penerima"
                                                type='text'
                                                className='input-text-user'
                                                name="emailPenerima"
                                                value={inputHandle.emailPenerima}
                                                onChange={(e) => handleChange(e)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className='mb-3'>
                                        <Col xs={2}></Col>
                                        <Col xs={10}>
                                            {
                                                !errMsgEmail ? "" :
                                                <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B"}} className='text-start'>
                                                    <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                    Format email wajib memakai tanda ‘@’. Contoh: nama@mail.com
                                                </div>
                                            }
                                        </Col>
                                    </Row>
                                    <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                            <span style={{ fontFamily: "Nunito" }}>
                                                Catatan
                                            </span>
                                        </Col>
                                        <Col xs={10}>
                                            <textarea
                                                className='input-text-disburs'
                                                placeholder="Masukkan catatan bila perlu ( Maksimal 25 karakter )"
                                                style={{ width: "100%", padding: 10, borderColor: "#E0E0E0"}}
                                                name="catatan"
                                                value={inputHandle.catatan}
                                                onChange={(e) => handleChange(e)}
                                                maxLength={25}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={2}></Col>
                                        <Col>
                                            {
                                                editTabelDisburse === false ?
                                                <button
                                                    onClick={() => saveNewDisburse(
                                                        dataDisburse.length + 1,
                                                        inputData.bankName,
                                                        inputData.bankCode,
                                                        inputHandle.bankCabang,
                                                        inputRekening.bankNumberRek,
                                                        inputRekening.bankNameRek,
                                                        Number(inputHandle.nominal),
                                                        inputHandle.emailPenerima,
                                                        inputHandle.catatan,
                                                        isChecked
                                                    )}
                                                    className={
                                                        (inputData.bankName.length !== 0 && inputData.bankCode.length !== 0 && (inputData.bankCode === "014" ? (inputHandle.bankCabang.length === 0 || inputHandle.bankCabang.length !== 0) : inputHandle.bankCabang.length !== 0) && inputRekening.bankNameRek.length !== 0 && inputRekening.bankNumberRek.length !== 0 && Number(inputHandle.nominal) >= 10000 && dataDisburse.length < 10) ? 'btn-ez-disbursement' : 'btn-disbursement-reset'
                                                    }
                                                    disabled={
                                                        (inputData.bankName.length === 0 || inputData.bankCode.length === 0 || (inputData.bankCode !== "014" ? inputHandle.bankCabang.length === 0 : null) || inputRekening.bankNameRek.length === 0 || inputRekening.bankNumberRek.length === 0 || Number(inputHandle.nominal) < 10000 || dataDisburse.length >= 10)
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                        style={{ marginRight: 10 }}
                                                    />{" "}
                                                    Tambah Tujuan Disbursement
                                                </button>  :
                                                <div className='d-flex justify-content-start align-items-center'>
                                                    <div className='me-1'>
                                                        <button
                                                            onClick={() => batalEdit()}
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
                                                    <div className='ms-1'>
                                                        <button
                                                            // style={{
                                                            //     fontFamily: "Exo",
                                                            //     fontSize: 16,
                                                            //     fontWeight: 700,
                                                            //     alignItems: "center",
                                                            //     padding: "12px 24px",
                                                            //     gap: 8,
                                                            //     width: 136,
                                                            //     height: 45,
                                                            //     color: "#077E86",
                                                            //     background: "transparent",
                                                            //     border: "1px solid #077E86",
                                                            //     borderRadius: 6,
                                                            // }}
                                                            onClick={() => saveEditDataDisburse(
                                                                numbering,
                                                                inputData.bankName,
                                                                inputData.bankCode,
                                                                inputHandle.bankCabang,
                                                                inputRekening.bankNumberRek,
                                                                inputRekening.bankNameRek,
                                                                Number(inputHandle.nominal),
                                                                inputHandle.emailPenerima,
                                                                inputHandle.catatan,
                                                                isChecked,
                                                                dataDisburse
                                                            )}
                                                            className={
                                                                (inputData.bankName.length !== 0 && inputData.bankCode.length !== 0 && (inputData.bankCode === "014" ? (inputHandle.bankCabang.length === 0 || inputHandle.bankCabang.length !== 0) : inputHandle.bankCabang.length >= 4) && inputRekening.bankNameRek.length !== 0 && inputRekening.bankNumberRek.length !== 0 && Number(inputHandle.nominal) >= 10000 && dataDisburse.length <= 10) ? 'btn-edit-disbursement' : 'btn-editno-disbursement'
                                                            }
                                                            disabled={
                                                                (inputData.bankName.length === 0 || inputData.bankCode.length === 0 || (inputData.bankCode !== "014" ? inputHandle.bankCabang.length < 4 : null) || inputRekening.bankNameRek.length === 0 || inputRekening.bankNumberRek.length === 0 || Number(inputHandle.nominal) < 10000 || dataDisburse.length > 10)
                                                            }
                                                        >
                                                            Simpan
                                                        </button>
                                                    </div>  
                                                </div>
                                            }      
                                        </Col>
                                    </Row>
                                    {
                                        dataDisburse.length !== 0 ?
                                        <div className='scroll-confirm' style={{ overflowX: 'auto', maxWidth: 'max-content' }}>
                                            <table
                                                className="table mt-5"
                                                id="tableInvoice"
                                                hover
                                            >
                                                <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                    <tr 
                                                        className='ms-3'  
                                                    >
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Bank Tujuan</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Cabang (Khusus Non-BCA)</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No. Rekening Tujuan</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nama Pemilik Rekening</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nominal Disbursement</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Email Penerima</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Catatan</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        dataDisburse.map((item) => {
                                                            return (
                                                                <tr>
                                                                    <td className='ps-3'>
                                                                        {item.number}
                                                                    </td>
                                                                    <td className='ps-3'>
                                                                        {item.bankCodeTujuan + ` - ` + item.bankNameTujuan}
                                                                    </td>
                                                                    <td className='ps-3'>
                                                                        {item.cabang}
                                                                    </td>
                                                                    <td className='ps-3'>
                                                                        {item.noRek}
                                                                    </td>
                                                                    <td className='ps-3'>
                                                                        {item.nameRek}
                                                                    </td>
                                                                    <td className='ps-3'>
                                                                        {convertToRupiah(item.nominal, true, 0)}
                                                                    </td>
                                                                    <td className='ps-3'>
                                                                        {item.emailPenerima.length === 0 ? "-" : item.emailPenerima}
                                                                    </td>
                                                                    <td className='ps-3'>
                                                                        {item.catatan.length === 0 ? "-" : item.catatan}
                                                                    </td>
                                                                    <td className='ps-3'>
                                                                        <div className="d-flex justify-content-center align-items-center">
                                                                            <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Edit</div></Tooltip>}>
                                                                                <img
                                                                                    src={edit}
                                                                                    style={{ cursor: "pointer" }}
                                                                                    alt="icon edit"
                                                                                    onClick={() => editDataDisburse(item.number)}
                                                                                />
                                                                            </OverlayTrigger>
                                                                            <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Delete</div></Tooltip>}>
                                                                                <img
                                                                                    src={deleted}
                                                                                    style={{ cursor: "pointer" }}
                                                                                    className="ms-2"
                                                                                    alt="icon delete"
                                                                                    onClick={() => deleteDataDisburse(item.number)}
                                                                                />
                                                                            </OverlayTrigger>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div> :
                                        <div className='scroll-confirm' style={{ overflowX: 'auto', maxWidth: 'max-content' }}>
                                            <table
                                                className="table text-center mt-5"
                                                id="tableInvoice"
                                                hover
                                            >
                                                <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                    <tr 
                                                        
                                                    >
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Bank Tujuan</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Cabang (Khusus Non-BCA)</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No. Rekening Tujuan</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nama Pemilik Rekening</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nominal Disbursement</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Email Penerima</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Catatan</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Aksi</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            <div className='text-center pb-3'>Belum ada data tujuan Disbursement</div>
                                        </div>
                                    }
                                    
                                    <div className='sub-base-content-disburse mt-5'>
                                        <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>Ringkasan</div>
                                        <div className='d-flex justify-content-between align-items-center mt-3'>
                                            <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>Total Disbursement</div>
                                            <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(sum(allNominal), true, 2)}</div>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center mt-2'>
                                            <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>Total Fee Disbursement + Total Tax</div>
                                            <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(sum(allFee), true, 2)}</div>
                                        </div>
                                        <div className='mt-2' style={{ border: "1px dashed #C4C4C4" }}></div>
                                        <div className='d-flex justify-content-between align-items-center mt-3' style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>
                                            <div>Total Disbursement + Total Fee</div>
                                            <div>{convertToRupiah((sum(allNominal) + sum(allFee)), true, 2)}</div>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-between align-items-center mt-3'>
                                        <div style={{ fontFamily: 'Nunito' }}>
                                            <div style={{ fontSize: 14, color: '#383838' }}>Sisa Saldo Tersedia</div>
                                            <div style={{ fontSize: 12, color: '#888888' }}>(Terhitung setelah seluruh disbursement berhasil)</div>
                                        </div>
                                        {
                                            Number((getBalance) - (sum(allNominal) + sum(allFee))) < 0  ?
                                            <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B", width: 250 }} className='text-end'>
                                                <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                Saldo Anda tidak cukup, Topup saldo terlebih dahulu sebelum melakukan disbursement
                                            </div> :
                                            <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(Number((getBalance) - (sum(allNominal) + sum(allFee))), true, 2)}</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="d-flex justify-content-end align-items-center">
                            <button
                                onClick={() => createDataDisburseExcel(dataDisburse, isDisbursementManual)}
                                className={(dataDisburse.length !== 0 && Number((getBalance) - (sum(allNominal) + sum(allFee))) >= 0) ? 'btn-ez-transfer' : 'btn-noez-transfer'}
                                disabled={dataDisburse.length === 0 || Number((getBalance) - (sum(allNominal) + sum(allFee))) < 0}
                                style={{ width: '25%' }}
                            >
                                Lakukan Disbursement
                            </button>
                        </div>

                        {/*Modal Pilih Bank*/}
                        <Modal className="history-modal bank-list-subakun" size="xs" centered show={showBank} onHide={() => setShowBank(false)}>
                            <Modal.Header className="border-0">
                                <Button
                                    className="position-absolute top-0 end-0 m-3"
                                    variant="close"
                                    aria-label="Close"
                                    onClick={() => batalIn('bank')}
                                />
                                
                            </Modal.Header>
                            <Modal.Title className="mt-1 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                                Daftar Bank
                            </Modal.Title>
                            <Modal.Body>
                                <div className="div-table mt-3">
                                    <div style={{ fontFamily: 'Nunito', fontSize: 14}}>Cari Data Bank :</div>
                                    <div className="d-flex justify-content-between align-items-center position-relative mt-2 mb-3" style={{width: "100%"}}>
                                        <div className="position-absolute left-3 px-1"><img src={search} alt="search" /></div>
                                        <FormControl
                                            className="ps-5"
                                            id="search"
                                            type="text"
                                            placeholder='Masukkan Nama / Kode Bank'
                                            aria-label="Search Input"
                                            value={filterTextBank}
                                            onChange={e => setFilterTextBank(e.target.value)}
                                        />
                                    </div>
                                    <div className='scroll-disburse' style={{ overflowX: 'auto', maxWidth: 'max-content', height: 275 }}>
                                        <table
                                            className='table'
                                            id='tableInvoice'
                                            hover
                                            style={{ width: 455 }}
                                        >
                                            <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                <tr >
                                                    <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo', width: 10 }}>No</th>
                                                    <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo', width: 50 }}>Nama Bank</th>
                                                    <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo', width: 80 }}>Kode Bank</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filterItemsBank.map((item, index) => {
                                                        return (
                                                            <tr key={index} onClick={() => handleRowClicked(item.mbank_code, item.is_enabled)} style={{ cursor: item.is_enabled === true ? 'pointer' : 'not-allowed', backgroundColor: item.is_enabled === false ? '#EBEBEB' : '', color: item.is_enabled === false ? '#C4C4C4' : '' }}>
                                                                <td className='ps-3'>
                                                                    {item.number}
                                                                </td>
                                                                <td className='ps-3' style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                                                    {item.mbank_name}
                                                                </td>
                                                                <td className='ps-3'>
                                                                    {item.mbank_code}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className='text-center mt-2'>
                                    <button
                                        onClick={() => batalIn('bank')}
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
                            </Modal.Body>
                        </Modal>

                        {/*Modal Daftar Rekening*/}
                        <Modal className="disburse-modal" size="xl" centered show={showDaftarRekening} onHide={() => setShowDaftarRekening(false)}>
                            <Modal.Header className="border-0">
                                <Button
                                    className="position-absolute top-0 end-0 m-3"
                                    variant="close"
                                    aria-label="Close"
                                    onClick={() => batalIn('rekening')}
                                />
                                
                            </Modal.Header>
                            <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                                Daftar Rekening
                            </Modal.Title>
                            <Modal.Body>
                                <div className="div-table bank-list-subakun mt-3">
                                    <DataTable 
                                        columns={columnsRekening}
                                        data={filterItemsRekening}
                                        customStyles={customStyles}
                                        // progressComponent={<CustomLoader />}
                                        subHeader
                                        subHeaderComponent={subHeaderComponentMemoRekening}
                                        noDataComponent={<div className='mt-3'>No Data</div>}
                                        persistTableHead
                                        onRowClicked={handleRowClickedRekening}
                                        highlightOnHover
                                        fixedHeader={true}
                                        fixedHeaderScrollHeight="300px"
                                    />
                                </div>
                                <div className='text-center my-1'>
                                    <button
                                        onClick={() => batalIn('rekening')}
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
                            </Modal.Body>
                        </Modal>
                    </> :
                    <>
                        <div id='disbursement-bulk'>
                            <hr className='hr-style' style={{marginTop: -2}}/>
                            <div className='base-content'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div style={{ fontFamily: 'Nunito', fontSize: 14 }}>Perhatikan panduan pengisian template untuk menghindari kesalahan: <span onClick={() => setShowModalPanduan(true)} style={{ textDecoration: 'underline', fontFamily: 'Exo', fontWeight: 700, fontSize: 14, color: '#077E86', cursor: 'pointer' }}>Lihat Panduan</span></div>
                                    <div>
                                        <button
                                            style={{
                                                color: '#077E86',
                                                border: "1px solid #077E86",
                                                borderRadius: 6,
                                                gap: 8,
                                                padding: '10px 14px',
                                                backgroundColor: "#ffffff",
                                                fontFamily:"Exo",
                                                fontWeight: 700,
                                                fontSize: 14
                                            }}
                                        >
                                            <span className='me-2'><img src={saveIcon} alt="save icon"/></span>
                                            <a href={templateBulkXLSX} download style={{ color: '#077E86' }}>
                                                Download Template
                                            </a>
                                        </button>
                                    </div>
                                </div>
                                <div className='mt-3 position-relative' style={{ marginBottom: 100 }}>
                                    {
                                        errorFound.length !== 0 && errorFound.length > 1 ?
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                            <div style={{ color: '#B9121B', fontSize: 14, position: 'absolute', zIndex: 1, marginTop: 13 }}>
                                                <div className='d-flex justify-content-center'>
                                                    <div>
                                                        <img class="me-2" src={noteIconRed} width="20px" height="20px" />
                                                    </div>
                                                    <div>
                                                        <div>Kesalahan data yang perlu diperbaiki:</div>
                                                        <FontAwesomeIcon style={{ width: 5, marginTop: 3 }} icon={faCircle} /> {`Data pada baris ke ${errorFound[0].no} : ${errorFound[0].keterangan}`}
                                                        <div onClick={() => openErrorListModal(errorFound)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Lihat Semua</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> :
                                        errorFound.length !== 0 && errorFound.length === 1 ?
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                            <div style={{ color: '#B9121B', fontSize: 14, position: 'absolute', zIndex: 1, marginTop: 13 }}>
                                                <div className='d-flex justify-content-center'>
                                                    <div>
                                                        <img class="me-2" src={noteIconRed} width="20px" height="20px" />
                                                    </div>
                                                    <div>
                                                        <div>Kesalahan data yang perlu diperbaiki:</div>
                                                        <FontAwesomeIcon style={{ width: 5, marginTop: 3 }} icon={faCircle} /> {`Data pada baris ke ${errorFound[0].no} : ${errorFound[0].keterangan}`}
                                                        {/* <div onClick={() => openErrorListModal(errorFound)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Lihat Semua</div> */}
                                                    </div>
                                                </div>
                                                {/* <div>
                                                    <div style={{ marginLeft: -50 }}>
                                                        <img class="me-2" src={noteIconRed} width="20px" height="20px" />
                                                        Kesalahan data yang perlu diperbaiki:
                                                    </div>
                                                    <div style={{ marginLeft: 125 }}><FontAwesomeIcon style={{ width: 5, marginTop: 3 }} icon={faCircle} /> {`Data nomor ${errorFound[0].no} : ${errorFound[0].keterangan}`}</div>
                                                </div> */}
                                                {/* <div onClick={() => openErrorListModal(errorFound)} style={{ textDecoration: 'underline', marginLeft: -175, cursor: 'pointer' }}>Lihat Semua</div> */}
                                            </div>
                                        </div> : null
                                    }
                                    <FilePond
                                        className="dragdrop"
                                        files={files}
                                        onupdatefiles={(newFile) => fileCSV(newFile, listBank, balanceDetail, feeBank)}
                                        onaddfilestart={() => setErrorFound([])}
                                        // onaddfile={addFile}
                                        // allowMultiple={true}
                                        // maxFiles={3}
                                        server="/api"
                                        name="files"
                                        labelIdle={labelUpload}
                                    />
                                </div>
                                <div className="div-table pt-3 pb-5">
                                    <DataTable
                                        // columns={columnsBulk} //untuk csv
                                        columns={columnsBulkExcel} //untuk excel
                                        // data={dataFromUpload} //untuk csv
                                        data={dataFromUploadExcel} //untuk excel
                                        customStyles={customStyles}
                                        conditionalRowStyles={conditionalRowStylesBulk}
                                        noDataComponent={<div style={{ marginBottom: 10 }}>Belum ada data tujuan Disbursement</div>}
                                        pagination
                                        highlightOnHover
                                        // progressComponent={<CustomLoader />}
                                        // subHeaderComponent={subHeaderComponentMemo}
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-end align-items-center my-4">
                                <button 
                                    // className={dataFromUpload.length === 0 ? 'btn-noez-transfer' : 'btn-ez-transfer'} //untukcsv
                                    className={dataFromUploadExcel.length === 0 ? 'btn-noez-transfer' : 'btn-ez-transfer'} //untuk excel
                                    // disabled={dataFromUpload.length === 0} //untuk csv
                                    disabled={dataFromUploadExcel.length === 0} //untuk excel
                                    style={{ width: '25%' }}
                                    // onClick={() => createDataDisburseExcel(dataFromUpload, isDisbursementManual)} //untuk csv
                                    onClick={() => createDataDisburseExcel(dataFromUploadExcel, isDisbursementManual, dataOriginFromUpload)} //untuk excel
                                >
                                    Lakukan Disbursement
                                </button>
                            </div>
                    
                            {/* Modal Lihat Panduan */}
                            <Modal className="panduan-modal" size="xl" centered show={showModalPanduan} onHide={() => setShowModalPanduan(false)}>
                                <Modal.Header className="border-0">
                                    <Button
                                        className="position-absolute top-0 end-0 m-3"
                                        variant="close"
                                        aria-label="Close"
                                        onClick={() => setShowModalPanduan(false)}
                                    />
                                    
                                </Modal.Header>
                                <Modal.Title className='text-center mt-4' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                                    Panduan Pengisian Disbursement Bulk
                                </Modal.Title>
                                <Modal.Body className='px-4'>
                                    <div style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }} className='d-flex justify-content-center align-items-center'>
                                        <img src={noteInfo} width="25" height="25" alt="circle_info" style={{ marginRight: 10 }} />
                                        <span>Pastikan data tujuan Disbursement sudah benar, Ezeelink tidak bertanggung jawab atas kesalahan data yang dilakukan. dan tetap akan dikenakan biaya sesuai dengan Fee Disbursement yang ditetapkan.</span>
                                    </div>
                                    {/* untuk uload file csv */}
                                    {/* <table className='mt-3' style={{ color: '#383838', fontSize: 14, fontFamily: 'Nunito' }}>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>1.</td>
                                            <td style={{ padding: 0 }}>File yang diunggah wajib dalam format *.csv, dan tidak dapat menggunakan format lain.</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>2.</td>
                                            <td style={{ padding: 0 }}>File yang diunggah wajib menggunakan template file yang telah disediakan, tidak bisa membuat format sendiri.</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>3.</td>
                                            <td style={{ padding: 0 }}>Data perkolom <b>wajib</b> dipisahkan dengan tanda “|” (garis lurus). Dilarang menggunakan tanda baca lain sebagai pemisah data antar kolom. Dilarang menambahkan spasi setelah tanda garis lurus. Contoh penulisan : No|BTN|Gambir|51234678|Agatha|10000|agatha@mail.com|-</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>4.</td>
                                            <td style={{ padding: 0 }}>Dilarang mengubah atau menambahkan nama sheet, nama tabel, urutan tabel dan tipe data tabel. Mengubah nama file diperbolehkan sesuai kebutuhan</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>5.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> - Bank Tujuan diisi sesuai dengan daftar bank tujuan disbursement dan <b>wajib menyertakan kode bank.</b> Daftar bank dapat dilihat pada file berikut : <a href={daftarBank} download style={{ color:"#077E86", textDecoration: "underline" }}>Daftar Bank Tujuan</a></td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>6.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> khusus cabang tujuan bank selain BCA. Apabila bank yang dipilih adalah BCA maka dapat dikosongkan</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>7.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> - Nomor Rekening Tujuan diisi sesuai format rekening bank tujuan. Gunakan format angka dan harap perhatikan digit rekening</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>8.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> - Nama Pemilik Rekening wajib diisi dengan benar dan sesuai</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>9.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> - Nominal Disbursement diisi dalam format Rupiah. Jika nominal merupakan bilangan desimal, maka penulisan tanda koma diganti dengan tanda titik. Contoh: 5500,68 ditulis 5500.68</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>10.</td>
                                            <td style={{ padding: 0 }}>Email Penerima bersifat opsional dan dapat diisi untuk mengirim notifikasi berhasil Disburse. Apabila email tidak diisi, maka dapat dikosongkan</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>11.</td>
                                            <td style={{ padding: 0 }}>Catatan dapat diisi bila diperlukan dan bersifat opsional dan maksimal 25 karakter (termasuk spasi). Hanya diperbolehkan menggunakan karakter spesial berupa tanda @, &, dan #. Apabila catatan tidak diisi, maka dapat dikosongkan</td>
                                        </tr>
                                    </table> */}
                                    {/* untuk uload file xlsx */}
                                    <table className='mt-3' style={{ color: '#383838', fontSize: 14, fontFamily: 'Nunito' }}>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>1.</td>
                                            <td style={{ padding: 0 }}>File yang diunggah wajib dalam format excel, dan tidak dapat menggunakan format lain</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>2.</td>
                                            <td style={{ padding: 0 }}>File yang diunggah wajib menggunakan template file yang telah disediakan, tidak bisa membuat format sendiri</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>3.</td>
                                            <td style={{ padding: 0 }}>Dilarang mengubah atau menambahkan nama sheet, nama tabel, urutan tabel dan tipe data tabel. Mengubah nama file diperbolehkan sesuai kebutuhan</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>4.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> - Bank Tujuan diisi sesuai dengan daftar bank tujuan disbursement dan wajib menyertakan kode bank. Untuk kode bank dengan awalan 0,  harus ditulis dengan tanda petik 1 untuk meminimalisir kesalahan pada data excel (Contoh: ’014-BCA)Daftar bank dapat dilihat pada file berikut : <a href={daftarBank} download style={{ color:"#077E86", textDecoration: "underline" }}>Daftar Bank Tujuan</a></td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>5.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> khusus cabang tujuan bank selain BCA. Apabila bank yang dipilih adalah BCA maka dapat dikosongkan</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>6.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> - Nomor Rekening Tujuan diisi sesuai format rekening bank tujuan. Gunakan format angka dan harap perhatikan digit rekening. Untuk nomor rekening dengan angka 0 didepan, harus ditulis dengan tanda petik 1 untuk meminimalisir kesalahan pada data excel (Contoh: ’098765421)</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>7.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> - Nama Pemilik Rekening wajib diisi dengan benar dan sesuai </td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>8.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> - Nominal Disbursement diisi dalam format Rupiah. Nominal disbursement <strong>tidak boleh mengandung decimal</strong></td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>9.</td>
                                            <td style={{ padding: 0 }}>Email Penerima bersifat opsional dan dapat diisi untuk mengirim notifikasi berhasil Disburse. Apabila email tidak diisi, maka dapat dikosongkan</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>10.</td>
                                            <td style={{ padding: 0 }}>Catatan dapat diisi bila diperlukan dan bersifat opsional dan maksimal 25 karakter (termasuk spasi).</td>
                                        </tr>
                                    </table>
                                    <div className='text-center my-3'>
                                        <button
                                            onClick={() => setShowModalPanduan(false)}
                                            className='btn-ez-transfer'
                                            style={{ width: '25%' }}
                                        >
                                            Mengerti
                                        </button>
                                    </div>
                                </Modal.Body>
                            </Modal>
                    
                            {/* Modal Lihat list error */}
                            <Modal className="list-error-modal" size="xl" centered show={showModalErrorList} onHide={() => closeModalError()}>
                                <Modal.Header className="border-0">
                                    <Button
                                        className="position-absolute top-0 end-0 m-3"
                                        variant="close"
                                        aria-label="Close"
                                        onClick={() => closeModalError()}
                                    />
                                    
                                </Modal.Header>
                                <Modal.Title className='text-center mt-4' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                                    Kesalahan Data yang Perlu Diperbaiki
                                </Modal.Title>
                                <Modal.Body className='px-4'>
                                    <div style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }} className='d-flex justify-content-start align-items-center'>
                                        <img src={triangleAlertIcon} width="25" height="25" alt="circle_info" style={{ marginRight: 10 }} />
                                        <span>Harap perbaiki data terlebih dahulu sebelum mengupload ulang file. </span>
                                    </div>
                                    <div className='mt-3' style={{ maxWidth: 622, backgroundColor: 'rgba(185, 18, 27, 0.08)', width: 'auto', padding: '20px 20px 20px 30px', borderRadius: 4 }}>
                                        <div style={{ height: 'auto' }}>
                                            <table className='table-error-list-disburse' style={{ color: '#383838', fontSize: 14, fontFamily: 'Nunito' }}>
                                                {
                                                    errorLoadPagination.length !== 0 &&
                                                    errorLoadPagination.map((err, idx) => {
                                                        return(
                                                            <tr>
                                                                <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>{(activePageErrorList > 1) ? (idx + 1)+((activePageErrorList-1)*10) : idx + 1}. </td>
                                                                <td style={{ padding: 0 }}>Data pada baris ke <b>{`${err.no}`}</b>, {`${err.keterangan}`}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </table>
                                        </div>
                                        <div className="d-flex justify-content-center mt-3">
                                            <Pagination
                                                activePage={activePageErrorList}
                                                itemsCountPerPage={10}
                                                totalItemsCount={errorFound.length}
                                                pageRangeDisplayed={5}
                                                itemClass="page-item"
                                                linkClass="page-link"
                                                onChange={(e) => handlePageChangeErrorList(e, errorFoundPagination)}
                                            />
                                        </div>
                                    </div>
                                    <input onChange={(newFile) => fileCSV(newFile, listBank, balanceDetail, feeBank)} type='file' id='input-file' accept='text/csv' style={{ visibility: 'hidden' }} />
                                    <div type='file' className='text-center mb-2'>
                                        <button
                                            onClick={() => handleClickChangeFile("errorList")}
                                            className='btn-reset'
                                            style={{ width: '25%' }}
                                        >
                                            Ganti File
                                        </button>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </>
                }
            </div>
            <div>
                {/* Modal Pindah Halaman */}
                <Modal size="xs" centered show={showModalPindahHalaman} onHide={() => setShowModalPindahHalaman(false)}>
                    <Modal.Title className='text-center mt-4' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                        Yakin ingin pindah halaman?
                    </Modal.Title>
                    <Modal.Body >
                        <div className='text-center mt-3 px-4' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>Seluruh data yang telah diinput akan terhapus jika pindah halaman, masih ingin melanjutkan ?</div>
                        <div className='d-flex justify-content-center align-items-center mt-3'>
                            <div className='me-1'>
                                <button
                                    onClick={tab === "bulk" ? () => PindahTab("bulk") : () => PindahTab("manual")}
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
                                    Ya
                                </button>
                            </div>
                            <div className="ms-1">
                                <button
                                onClick={() => setShowModalPindahHalaman(false)}
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
                                    Tidak
                                </button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                {/*Modal Konfirmasi Disbursement*/}
                <Modal className="confirm-disburse-modal" size="lg" centered show={showModalConfirm} onHide={() => setShowModalConfirm(false)}>
                    <Modal.Header className="border-0">
                        <Button
                            className="position-absolute top-0 end-0 m-3"
                            variant="close"
                            aria-label="Close"
                            onClick={() => batalConfirm()}
                        />
                        
                    </Modal.Header>
                    <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                        Konfirmasi Disbursement
                    </Modal.Title>
                    <Modal.Body className='mx-2'>
                        <div style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }} className='d-flex justify-content-center align-items-center'>
                            <img src={noteInfo} width="25" height="25" alt="circle_info" style={{ marginRight: 10 }} />
                            <span>Harap pastikan seluruh data disbursement sudah benar. Kesalahan pada data dapat menyebabkan kegagalan disbursement dan tetap akan dikenakan biaya sesuai dengan Fee Disbursement yang ditetapkan.</span>
                        </div>
                        <div>
                            {/* <div className='mt-3' style={{ fontFamily: 'Source Sans Pro', fontSize: 14, color: '#888888' }}>Dari Rekening</div>
                            <div className='mt-1' style={{ fontFamily: 'Source Sans Pro', fontSize: 16, color: '#383838', fontWeight: 600 }}>2348-3492-0943</div> */}
                            <div className='mt-3' style={{ fontFamily: 'Source Sans Pro', fontSize: 16, color: '#383838', fontWeight: 600 }}>Tujuan Disbursement</div>
                            {
                                !isDisbursementManual ?
                                <div className="table-disburse-confirm pt-3">
                                    <DataTable
                                        // columns={columnsBulk} //untuk csv
                                        columns={columnsBulkExcel} //untuk excel
                                        // data={dataFromUpload} //untuk csv
                                        data={dataFromUploadExcel} //untuk excel
                                        customStyles={customStyles}
                                        conditionalRowStyles={conditionalRowStylesBulk}
                                        noDataComponent={<div style={{ marginBottom: 10 }}>Belum ada data tujuan Disbursement</div>}
                                        pagination
                                        highlightOnHover
                                        fixedHeader
                                        fixedHeaderScrollHeight='300px'
                                        // progressComponent={<CustomLoader />}
                                        // subHeaderComponent={subHeaderComponentMemo}
                                    />
                                </div> :
                                isDisbursementManual && dataDisburse.length !== 0 ?
                                <div className='scroll-confirm' style={{ overflowX: 'auto', maxWidth: 'max-content' }}>
                                    <table
                                        className="table mt-3"
                                        id="tableInvoice"
                                        hover
                                    >
                                        <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                            <tr 
                                                className='ms-3'  
                                            >
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Bank Tujuan</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Cabang (Khusus Non-BCA)</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No. Rekening Tujuan</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nama Pemilik Rekening</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nominal Disbursement</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Email Penerima</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Catatan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                dataDisburse.map((item) => {
                                                    return (
                                                        <tr>
                                                            <td className='ps-3'>
                                                                {(isDisbursementManual) ? item.number : item.no}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {(isDisbursementManual) ? item.bankCodeTujuan + ` - ` + item.bankNameTujuan : item.bankCode + ` - ` + item.bankName}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {(isDisbursementManual) ? item.cabang : item.cabangBank}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {(isDisbursementManual) ? item.noRek : item.noRekening}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {(isDisbursementManual) ? item.nameRek : item.ownerName}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {(isDisbursementManual) ? convertToRupiah(item.nominal, true, 2) : convertToRupiah(item.nominalDisbursement, true, 2)}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {(isDisbursementManual) ? (item.emailPenerima.length === 0 ? "-" : item.emailPenerima) : item.email}
                                                            </td>
                                                            <td className='ps-3'>
                                                                {(isDisbursementManual) ? (item.catatan.length === 0 ? "-" : item.catatan) : item.note}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div> :
                                <div className='scroll-confirm' style={{ overflowX: 'auto', maxWidth: 'max-content' }}>
                                    <table
                                        className="table text-center mt-5"
                                        id="tableInvoice"
                                        hover
                                    >
                                        <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                            <tr 
                                                
                                            >
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Bank Tujuan</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Cabang (Khusus Non-BCA)</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>No. Rekening Tujuan</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nama Pemilik Rekening</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Nominal Disbursement</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Email Penerima</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Catatan</th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div className='text-center pb-3'>Belum ada data tujuan Disbursement</div>
                                </div>
                            }
                            <div className='sub-base-content-disburse mt-3'>
                                <div className='d-flex justify-content-between align-items-center mt-1'>
                                    <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>Total Disbursement</div>
                                    <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(sum(allNominal), true, 2)}</div>
                                </div>
                                <div className='d-flex justify-content-between align-items-center mt-2'>
                                    <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>Total Fee Disbursement + Total Tax</div>
                                    <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(sum(allFee), true, 2)}</div>
                                </div>
                                <div className='mt-2' style={{ border: "1px dashed #C4C4C4" }}></div>
                                <div className='d-flex justify-content-between align-items-center mt-3' style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>
                                    <div>Total Disbursement + Total Fee</div>
                                    <div>{convertToRupiah((sum(allNominal) + sum(allFee)), true, 2)}</div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center mt-3'>
                                <div style={{ fontFamily: 'Nunito' }}>
                                    <div style={{ fontSize: 14, color: '#383838' }}>Sisa Saldo Tersedia</div>
                                    <div style={{ fontSize: 12, color: '#888888' }}>(Terhitung setelah seluruh disbursement berhasil)</div>
                                </div>
                                {
                                    Number((getBalance) - (sum(allNominal) + sum(allFee))) < 0  ?
                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B", width: 250 }} className='text-end'>
                                        <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                        Saldo Anda tidak cukup, Topup saldo terlebih dahulu sebelum melakukan disbursement
                                    </div> :
                                    <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(((getBalance) - (sum(allNominal) + sum(allFee))), true, 2)}</div>
                                }
                            </div>
                            <div className='mb-3 mt-3'>
                                <Form.Check
                                    className='form-confirm'
                                    label="Saya bertanggung jawab atas seluruh kebenaran maupun kesalahan data di atas"
                                    id="statusId"
                                    onChange={handleChangeCheckBoxConfirm}
                                    checked={isCheckedConfirm}
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center mt-3">
                            <button
                                onClick={() => batalConfirm()}
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
                                Batal
                            </button>
                            <button 
                                onClick={() => sendDataDisburse(dataExcelDisburse, dataExcelOriginDisburse, isDisbursementManual)}
                                className={isCheckedConfirm === true ? 'btn-ez-transfer ms-3' : 'btn-noez-transfer ms-3'}
                                disabled={isCheckedConfirm === false}
                                style={{ width: '25%' }}
                            >
                                Lakukan Disbursement
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* Modal Data Duplikasi */}
                <Modal size="xs" centered show={showModalDuplikasi} onHide={() => setShowModalDuplikasi(false)}>
                    <Modal.Title className='text-center mt-4' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                        Ditemukan Duplikasi Data, Ingin Tetap Melanjutkan?
                    </Modal.Title>
                    <Modal.Body >
                        {
                            duplicateData.length === 0 ?
                            <div className='text-center px-4' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>Data yang ingin Anda tambahkan sudah tersedia di tabel.</div> :
                            <div className='text-center px-4' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>Data pada baris ke <b style={{ wordBreak: 'break-word', color: 'red' }}>{duplicateData.join(", ")}</b> : Terindikasi data duplikasi</div>
                        }
                        <div className='d-flex justify-content-center align-items-center mt-3'>
                            {
                                isDisbursementManual ?
                                <>
                                    <div className='me-1'>
                                        <button
                                            onClick={editTabelDisburse === false ?
                                                () => lanjutSaveNew(
                                                    dataDisburse.length + 1,
                                                    inputData.bankName,
                                                    inputData.bankCode,
                                                    inputHandle.bankCabang,
                                                    inputRekening.bankNumberRek,
                                                    inputRekening.bankNameRek,
                                                    Number(inputHandle.nominal),
                                                    inputHandle.emailPenerima,
                                                    inputHandle.catatan,
                                                    isChecked
                                                ) :
                                                () => lanjutSaveEdit(
                                                    numbering,
                                                    inputData.bankName,
                                                    inputData.bankCode,
                                                    inputHandle.bankCabang,
                                                    inputRekening.bankNumberRek,
                                                    inputRekening.bankNameRek,
                                                    Number(inputHandle.nominal),
                                                    inputHandle.emailPenerima,
                                                    inputHandle.catatan,
                                                    isChecked
                                                )
                                            }
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
                                            Lanjutkan
                                        </button>
                                    </div>
                                    <div className="ms-1">
                                        <button
                                            onClick={() => setShowModalDuplikasi(false)}
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
                                            Perbaiki
                                        </button>
                                    </div>
                                </> :
                                <>
                                    <div className='me-1'>
                                        <button
                                            onClick={() => setShowModalDuplikasi(false)}
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
                                            Lanjutkan
                                        </button>
                                    </div>
                                    <div className="ms-1">
                                        <button
                                            onClick={() => handleClickChangeFile("duplicateData")}
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
                                            Perbaiki
                                        </button>
                                    </div>
                                </>
                            }
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}

export default DisbursementPage