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
import { agenLists } from '../../data/tables'
import axios from 'axios'
import FilterSubAccount from '../../components/FilterSubAccount'
import { Base64 } from 'js-base64'
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
import daftarBank from '../../assets/files/Daftar Bank Tujuan Disbursement - PT. Ezeelink Indonesia.xlsx'
import templateBulk from '../../assets/files/Template Bulk Disbursement PT. Ezeelink Indonesia.csv'

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
    const [isManual, setIsManual] = useState((sessionStorage.getItem('disbursement') !== 'manual' || sessionStorage.getItem('disbursement') === null) ? true : false)
    const [isBulk, setIsBulk] = useState((sessionStorage.getItem('disbursement') !== 'bulk' || sessionStorage.getItem('disbursement') === null) ? false : true)
    const [showStatusTransfer, setShowStatusTransfer] = useState(false)
    const [showDaftarRekening, setShowDaftarRekening] = useState(false)
    const [tab, setTab] = useState("")
    const [showModalConfirm, setShowModalConfirm] = useState(false)
    const [showModalPindahHalaman, setShowModalPindahHalaman] = useState(false)
    const [showModalPanduan, setShowModalPanduan] = useState(false)
    const [showModalDuplikasi, setShowModalDuplikasi] = useState(false)
    const [showModalStatusDisburse, setShowModalStatusDisburse] = useState(false)
    const [filterTextBank, setFilterTextBank] = useState('')
    const [filterTextRekening, setFilterTextRekening] = useState('')
    const [labelUpload, setLabelUpload] = useState(`<div class='py-4 mb-2 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
    <div className='pb-4'>
        <span class="filepond--label-action">
            Upload File
        </span>
    </div>`)
    const [files, setFiles] = useState([])
    const [dataFromUpload, setDataFromUpload] = useState([])
    const [errorFound, setErrorFound] = useState([])
    const [errorLoadPagination, setErrorLoadPagination] = useState([])
    const [errorFoundPagination, setErrorFoundPagination] = useState([])
    const [showModalErrorList, setShowModalErrorList] = useState(false)
    const [activePageErrorList, setActivePageErrorList] = useState(1)
    const [alertSaldo, setAlertSaldo] = useState(false)
    const [alertNotValid, setAlertNotValid] = useState(false)
    const [balanceDetail, setBalanceDetail] = useState([])
    const [sisaSaldoAlokasiPerBank, setSisaSaldoAlokasiPerBank] = useState({
        bca: 0,
        danamon: 0,
        bifast: 0
    })
    
    async function fileCSV(newValue, bankLists, listBankTujuan) {
        console.log(newValue, 'newValue');
        if (errorFound.length !== 0) {
            setErrorFound([])
        }
        
        if (listBankTujuan.length === 0) {
            setLabelUpload(`<div class='pt-1 pb-2 style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />Seluruh data Bank Tujuan tidak tersedia pada saat ini</div>
                <div class='pb-4 mt-1 style-label-drag-drop'>Silahkan coba upload ulang beberapa saat lagi. SIlahkan hubungi Admin untuk informasi lebih lanjut </div>
                <div className='pb-4'>
                    <span class="filepond--label-action">
                        oke
                    </span>
                </div>`)
        } else if (listBankTujuan.length !== 0) {
            const filteredBankTujuan = listBankTujuan.filter(item => item.mpaytype_mpaycat_id === 2)
            console.log(filteredBankTujuan, 'filteredBankTujuan');
            if (filteredBankTujuan.length === 0) {
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
                        setDataFromUpload([])
                    // }, 500);
                } else if (newValue.length !== 0 && newValue[0].file.type !== "text/csv") {
                    // console.log('masuk wrong type');
                    setErrorFound([])
                    // setTimeout(() => {
                        setLabelUpload("")
                    // }, 2400);
                    // setTimeout(() => {
                        setLabelUpload(`<div class='pt-1 pb-2 style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />Format file tidak sesuai. Pastikan format file dalam bentuk *.csv dan telah <br /> menggunakan template yang disediakan.</div>
                        <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                        <div className='pb-4'>
                            <span class="filepond--label-action">
                                Ganti File
                            </span>
                        </div>`)
                    // }, 2500);
                } else {
                    const pond = await newValue[0].getFileEncodeBase64String()
                    console.log(pond, 'pond');
                    if (pond) {
                        const decoded = Base64.decode(pond)
                        console.log(decoded, 'decodedd');
                        const headerCol = decoded.split('|').slice(0, 8)
                        // console.log(headerCol, 'headerCol');
                        if (headerCol[0] === "No*" && headerCol[1] === "Bank Tujuan*" && headerCol[2] === "Cabang (Khusus Non-BCA)*" && headerCol[3] === "No. Rekening Tujuan*" && headerCol[4] === "Nama Pemilik Rekening*" && headerCol[5] === "Nominal Disbursement*" && headerCol[6] === "Email Penerima" && headerCol[7] === "Catatan\r\n1") {
                            console.log("ini bener");
                            const newDcd = decoded.split("|").slice(8)
                            console.log(newDcd, 'newDcd');
                            console.log(newDcd.length%7, 'newDcd');
                            if (newDcd.length%7 !== 0) {
                                setErrorFound([])
                                setTimeout(() => {
                                    setLabelUpload("")
                                    setLabelUpload(`<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>Konten pada tabel tidak sesuai dengan template Disbursement Bulk <br/> Ezeelink. Harap download dan menggunakan template yang disediakan <br/> untuk mempermudah pengecekkan data disbursement.</div></div>
                                    <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                    <div className='pb-4'>
                                        <span class="filepond--label-action">
                                            Ganti File
                                        </span>
                                    </div>`)
                                }, 2500);
                            } else {
                                let totalNominalDisburse = 0
                                let totalFeeDisburse = 0
                                let newArr = []
                                let obj = {}
                                newDcd.forEach((el, idx) => {
                                    if (idx === 0 || idx % 7 === 0) {
                                        // console.log(el.slice(0,3), 'el.slice(0,3)');
                                        if (el.length === 0) {
                                            obj.bankCode = ""
                                            obj.bankName = ""
                                        } else {
                                            if (el.slice(0, 3).toLowerCase() !== el.slice(0, 3).toUpperCase()) {
                                                obj.bankCode = "null"
                                                obj.bankName = "null"
                                            } else {
                                                const sameBankName = bankLists.find(list => list.mbank_code === el.slice(0, 3))
                                                console.log(bankLists, 'bankLists di bawah samebank');
                                                console.log(sameBankName, 'sameBankName1');
                                                obj.bankCode = sameBankName !== undefined ? sameBankName.mbank_code : "undefined"
                                                obj.bankName = sameBankName !== undefined ? sameBankName.mbank_name : "undefined"
                                                console.log(feeBank, 'feeBank');
                                                if (sameBankName !== undefined && feeBank.length !== 0) {
                                                    console.log(sameBankName, 'sameBankName2');
                                                    const result = feeBank.find((item) => {
                                                        if (sameBankName.mbank_code === "014" || sameBankName.mbank_code === "011") {
                                                            return item.mpaytype_bank_code === sameBankName.mbank_code
                                                        } else {
                                                            // sameBankName.mbank_code = "BIF"
                                                            return item.mpaytype_bank_code === sameBankName.mbank_code
                                                        }
                                                    })
                                                    console.log(result, 'result');
                                                    if (result !== undefined) {
                                                        totalFeeDisburse += result.fee_total
                                                    }
                                                }
                                            }
                                        }
                                    } else if (idx === 1 || idx % 7 === 1) {
                                        obj.cabangBank = el
                                    } else if (idx === 2 || idx % 7 === 2) {
                                        obj.noRekening = el
                                    } else if (idx === 3 || idx % 7 === 3) {
                                        obj.ownerName = el
                                    } else if (idx === 4 || idx % 7 === 4) {
                                        console.log(el, 'nominal');
                                        console.log(el.indexOf(','), 'nominal');
                                        if (el.indexOf(',') !== -1) {
                                            // objErrData.no = data.no
                                            // // objErrData.data = data.noRekening
                                            // objErrData.keterangan = 'kolom Nominal Disbursement : Tipe data salah.'
                                            // errData.push(objErrData)
                                            // objErrData = {}
                                            obj.nominalDisbursement = "Tipe data salah."
                                        } else {
                                            obj.nominalDisbursement = el
                                            totalNominalDisburse += Number(el)
                                        }
                                    } else if (idx === 5 || idx % 7 === 5) {
                                        obj.email = el
                                    } else if (idx === 6 || idx % 7 === 6) {
                                        obj.note = el.split("\r")[0]
                                    }
            
                                    if (idx % 7 === 6) {
                                        newArr.push(obj)
                                        obj = {}
                                    }
                                })
                                newArr = newArr.map((obj, i) => ({...obj, no: i + 1}) )
                                // console.log(newArr, 'newArr');
                                // console.log(totalFeeDisburse, 'totalFeeDisburse');
                                setAllNominal([totalNominalDisburse])
                                setAllFee([totalFeeDisburse])
                                let errData = []
                                newArr = newArr.map(data => {
                                    console.log(data.nominalDisbursement, 'data.nominalDisbursement');
                                    console.log(data.nominalDisbursement.length, 'data.nominalDisbursement');
                                    let objErrData = {}
                                    if (data.bankName.length === 0 && data.bankCode.length === 0) {
                                        // console.log('masuk bank name kosong');
                                        objErrData.no = data.no
                                        // objErrData.data = data.bankName
                                        objErrData.keterangan = 'kolom Bank Tujuan : Wajib Diisi.'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    } else {
                                        if (data.bankName === "null" && data.bankCode === "null") {
                                            objErrData.no = data.no
                                            // objErrData.data = data.bankName
                                            objErrData.keterangan = 'kolom Bank Tujuan : Kode Bank Wajib Diisi.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (data.bankName === "undefined" && data.bankCode === "undefined") {
                                            objErrData.no = data.no
                                            // objErrData.data = data.bankName
                                            objErrData.keterangan = 'kolom Bank Tujuan : Bank Tujuan salah / tidak tersedia.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        }
                                    }
            
                                    if (data.noRekening.length === 0) {
                                        objErrData.no = data.no
                                        // objErrData.data = data.noRekening
                                        objErrData.keterangan = 'kolom Nomor Rekening : Wajib Diisi.'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
            
                                    if (data.noRekening.toLowerCase() !== data.noRekening.toUpperCase()) {
                                        objErrData.no = data.no
                                        // objErrData.data = data.noRekening
                                        objErrData.keterangan = 'kolom Nomor Rekening : Tipe data salah.'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
            
                                    if (data.ownerName.length === 0) {
                                        objErrData.no = data.no
                                        // objErrData.data = data.ownerName
                                        objErrData.keterangan = 'kolom Nama Pemilik Rekening : Wajib Diisi.'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
            
                                    if (data.nominalDisbursement.length === 0 || data.nominalDisbursement === '0') {
                                        console.log('masuk nominal error1');
                                        objErrData.no = data.no
                                        // objErrData.data = data.noRekening
                                        objErrData.keterangan = 'kolom Nominal Disbursement : Wajib Diisi.'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
                                    
                                    if (data.nominalDisbursement.length < 4) {
                                        console.log('masuk nominal error2');
                                        objErrData.no = data.no
                                        // objErrData.data = data.noRekening
                                        objErrData.keterangan = 'kolom Nominal Disbursement : Minimal Nominal Disbursement 10.000'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
            
                                    if (data.nominalDisbursement.toLowerCase() !== data.nominalDisbursement.toUpperCase()) {
                                        objErrData.no = data.no
                                        // objErrData.data = data.nominalDisbursement
                                        objErrData.keterangan = 'kolom Nominal Disbursement : Tipe data salah.'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
            
                                    if (validator.isEmail(data.email) === false) {
                                        objErrData.no = data.no
                                        // objErrData.data = data.email
                                        objErrData.keterangan = 'kolom Email Penerima : Tipe data salah.'
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
                                    
                                    if (data.bankCode !== '014') {
                                        if (data.cabangBank.length === 0) {
                                            // console.log('masuk length 0', data.cabangBank, data.bankCode);
                                            objErrData.no = data.no
                                            objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Wajib Diisi.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (data.cabangBank.length !== 0 && data.cabangBank.indexOf(' ') >= 0) {
                                            // console.log('masuk spasi kosong', data.cabangBank, data.bankCode);
                                            objErrData.no = data.no
                                            objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (data.cabangBank.length !== 0 && (data.cabangBank.indexOf('x') >= 0 || data.cabangBank.indexOf('X') >= 0)) {
                                            // console.log('masuk huruf x besar dan kecil', data.cabangBank, data.bankCode);
                                            objErrData.no = data.no
                                            objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (data.cabangBank.length !== 0 && /[$-/:-?{-~!"^_`\[\]]/.test(data.cabangBank)) {
                                            // console.log('masuk tanda baca', data.cabangBank, data.bankCode);
                                            objErrData.no = data.no
                                            objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (data.cabangBank.length !== 0 && data.cabangBank.toLowerCase() === data.cabangBank.toUpperCase()) {
                                            // console.log('masuk angka', data.cabangBank, data.bankCode);
                                            objErrData.no = data.no
                                            objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (data.cabangBank.length !== 0 && data.cabangBank.length < 4 && data.cabangBank.toLowerCase() !== data.cabangBank.toUpperCase()) {
                                            // console.log('masuk kombinasi kurang dari 4 huruf', data.cabangBank, data.bankCode);
                                            objErrData.no = data.no
                                            objErrData.keterangan = 'kolom Cabang (Khusus Non-BCA) : Cabang tidak tersedia.'
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else {
                                            return {
                                                ...data,
                                                no: data.no,
                                                bankCode: data.bankCode,
                                                bankName: data.bankName,
                                                cabangBank: data.cabangBank,
                                                noRekening: data.noRekening,
                                                ownerName: data.ownerName,
                                                nominalDisbursement: data.nominalDisbursement,
                                                email: data.email,
                                                note: data.note
                                            }
                                        }
                                        // console.log(data.cabangBank.indexOf(/[$-/:-?{-~!"^_`\[\]]/) >= 0, 'indexOf spasi kosong', data.cabangBank, data.bankCode);
                                        // console.log(/[$-/:-?{-~!"^_`\[\]]/.test(data.cabangBank), 'cek tanda baca', data.cabangBank, data.bankCode);
                                    } else {
                                        if (data.cabangBank.length === 0 || data.cabangBank.indexOf(' ') >= 0 ||  (data.cabangBank.indexOf('x') >= 0 || data.cabangBank.indexOf('X') >= 0) || /[$-/:-?{-~!"^_`\[\]]/.test(data.cabangBank) || data.cabangBank.toLowerCase() === data.cabangBank.toUpperCase()) {
                                            return {
                                                ...data, 
                                                cabangBank : ''
                                            }
                                        } else {
                                            return {
                                                ...data,
                                                no: data.no,
                                                bankCode: data.bankCode,
                                                bankName: data.bankName,
                                                cabangBank: data.cabangBank,
                                                noRekening: data.noRekening,
                                                ownerName: data.ownerName,
                                                nominalDisbursement: data.nominalDisbursement,
                                                email: data.email,
                                                note: data.note
                                            }
                                        }
                                    }
                                })
                                console.log(errData, 'errData');
                                console.log(newArr, 'newArr');
                                if (errData.length !== 0) {
                                    setLabelUpload(`<div class='pb-4 style-label-drag-drop-error-list'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                    <div className='pb-4'>
                                        <span class="filepond--label-action">
                                            Pilih File
                                        </span>
                                    </div>`)
                                    setTimeout(() => {
                                        setErrorFound(errData)
                                        setLabelUpload(`<div class='pb-4 style-label-drag-drop-error-list'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                        <div className='pb-4'>
                                            <span class="filepond--label-action">
                                                Ganti File
                                            </span>
                                        </div>`)
                                    }, 2500);
                                    // setTimeout(() => {
                                    // }, 500);
                                } else {
                                    setErrorFound([])
                                    setTimeout(() => {
                                        setLabelUpload("")
                                        setLabelUpload(`<div class='mt-2 style-label-drag-drop-filename'>${newValue[0].file.name}</div>
                                        <div class='py-4 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                        <div className='pb-4'>
                                            <span class="filepond--label-action">
                                                Ganti File
                                            </span>
                                        </div>`)
                                    }, 2500);
                                    setTimeout(() => {
                                        setDataFromUpload(newArr)
                                    }, 2500);
                                }
                            }
                        } else {
                            // console.log("ini salah");
                            setErrorFound([])
                            setTimeout(() => {
                                setLabelUpload("")
                                setLabelUpload(`<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>Konten pada tabel tidak sesuai dengan template Disbursement Bulk <br/> Ezeelink. Harap download dan menggunakan template yang disediakan <br/> untuk mempermudah pengecekkan data disbursement.</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br /> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        Ganti File
                                    </span>
                                </div>`)
                            }, 2500);
                        }
                    }
                }
            }
        }
    }

    function openErrorListModal(errorList) {
        console.log(errorList, 'errorList');
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
        console.log(errorArr,'errorArr');
        setErrorFoundPagination(errorArr)
        setErrorLoadPagination(errorArr[0])
        setShowModalErrorList(true)
    }

    function handlePageChangeErrorList(page, errorList) {
        console.log(page,'page');
        setActivePageErrorList(page)
        setErrorLoadPagination(errorList[page-1])
    }

    function closeModalError() {
        setShowModalErrorList(false)
        setActivePageErrorList(1)
    }

    function handleClickChangeFile() {
        console.log('clicked1');
        $('.filepond--browser').trigger('click');
        setShowModalErrorList(false)
        setActivePageErrorList(1)
        console.log('clicked2');
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

    const conditionalRowStyles = [
        {
            when: row => row.is_enabled === false,
            style: {
                '&:hover': {
                    cursor: 'unset',
                },
            },
        },
    ];

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

    // console.log(inputData.bankName,"bankName");
    // console.log(inputData.bankCode,"bankCode");
    // console.log(inputRekening.bankNameRek,"bankNameRek");
    // console.log(inputRekening.bankNumberRek,"bankNumberRek");
    // console.log(inputHandle.bankCabang,"bankCabang");
    console.log(inputHandle.nominal,"nominal");
    // console.log(inputHandle.emailPenerima.length,"emailPenerima");
    // console.log(inputHandle.catatan,"catatan");
    // console.log(isChecked,"saveAcc");
    console.log(dataDisburse,"dataDisburse");
    console.log(allFee, "all fee");

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
            selector: row => row.mbankaccountlist_branch_name,
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
            console.log(error)
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
                detailBalance.forEach((item) => {
                    if (item.mpaytype_mpaycat_id === 2) {
                        total += item.mpartballchannel_balance
                    }
                })
                setGetBalance(total)
                setBalanceDetail(getBalance.data.response_data.balance_detail)
            } else if (getBalance.data.response_code === 200 && getBalance.status === 200 && getBalance.data.response_new_token.length !== 0) {
                setUserSession(getBalance.data.response_new_token)
                const detailBalance = getBalance.data.response_data.balance_detail
                let total = 0
                detailBalance.forEach((item) => {
                    if (item.mpaytype_mpaycat_id === 2) {
                        total += item.mpartballchannel_balance
                    }
                })
                setGetBalance(total)
                setBalanceDetail(getBalance.data.response_data.balance_detail)
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
            bankCabang: row.mbankaccountlist_branch_name,
            nominal: inputHandle.nominal,
            emailPenerima: inputHandle.emailPenerima,
            catatan: inputHandle.catatan
        })
        setShowDaftarRekening(false)
    };

    function handleChange(e) {
        if (e.target.name === "emailPenerima") {
            setErrMsgEmail(false)
        }
        if (e.target.name === "nominal") {
            setAlertSaldo(false)
        }
        if (e.target.name === "bankCabang") {
            setAlertNotValid(false)
        }
        setInputHandle({
            ...inputHandle,
            [e.target.name] : (e.target.name === "nominal") ? Number(e.target.value).toString() : e.target.value
        })
    }

    function handleChangeRek(e) {
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
        if (emailPenerima.length !== 0 && validator.isEmail(emailPenerima) === false) {
            setErrMsgEmail(true)
            return
        }

        if (bankCodeTujuan !== "014") {
            if ((cabang.length !== 0 && (cabang.trim().length === 0)) || (cabang.length !== 0 && (cabang.toLowerCase() === cabang.toUpperCase()))) {
                console.log("masuk alert not valid");
                setAlertNotValid(true)
                return
            } else {
                console.log("masuk alert valid");
                setAlertNotValid(false)
                
            }
        } else {
            setAlertNotValid(false)
        }
        const balanceBank = balanceDetail.find((item) => {
            console.log(item.channel_id, "balance detail");
            if (bankCodeTujuan === "014" || bankCodeTujuan === "011") {
                return item.channel_id === bankCodeTujuan
            } else {
                bankCodeTujuan = "BIF"
                return item.channel_id === bankCodeTujuan
            }
        })
        if (nominal < balanceBank.mpartballchannel_balance || nominal === balanceBank.mpartballchannel_balance) {
            setAlertSaldo(false)
            let sameFlag = 0
            dataDisburse.forEach((val) => {
                if (val.noRek === noRek && Number(val.nominal) === Number(nominal)) {
                    sameFlag++
                }
            })
            console.log(sameFlag, "sameFlag");
            if (sameFlag === 0) {
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
                    if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance) - (Number(nominal) + result.fee_total) < 0) {
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
                            bca: (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance) - (Number(nominal) + result.fee_total)
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
                    if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance) - (Number(nominal) + result.fee_total) < 0) {
                        console.log('masuk alert');
                        setAlertSaldo(true)
                    } else {
                        console.log('masuk gak alert');
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
                            danamon: (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance) - (Number(nominal) + result.fee_total)
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
                    if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance) - (Number(nominal) + result.fee_total) < 0) {
                        console.log('masuk alert');
                        setAlertSaldo(true)
                    } else {
                        console.log('masuk gak alert');
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
                            bifast: (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance) - (Number(nominal) + result.fee_total)
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
    console.log(sisaSaldoAlokasiPerBank, 'sisaSaldoAlokasiPerBank');

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
                console.log("masuk alert not valid");
                setAlertNotValid(true)
                return
            } else {
                console.log("masuk alert valid");
                setAlertNotValid(false)
                
            }
        } else {
            setAlertNotValid(false)
        }
        const balanceBank = balanceDetail.find((item) => {
            console.log(item.channel_id, "balance detail");
            if (bankCodeTujuan === "014" || bankCodeTujuan === "011") {
                return item.channel_id === bankCodeTujuan
            } else {
                bankCodeTujuan = "BIF"
                return item.channel_id === bankCodeTujuan

            }
        })
        if (nominal < balanceBank.mpartballchannel_balance || nominal === balanceBank.mpartballchannel_balance) {
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
                if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance) - (Number(nominal) + result.fee_total) < 0) {
                    console.log('masuk alert');
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
                        bca: (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance) - (Number(nominal) + result.fee_total)
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
                if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance) - (Number(nominal) + result.fee_total) < 0) {
                    console.log('masuk alert');
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
                        danamon: (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance) - (Number(nominal) + result.fee_total)
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
                if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance) - (Number(nominal) + result.fee_total) < 0) {
                    console.log('masuk alert');
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
                        bifast: (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance) - (Number(nominal) + result.fee_total)
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
        console.log(result, "result");
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
                console.log("masuk alert not valid");
                setAlertNotValid(true)
                return
            } else {
                console.log("masuk alert valid");
                setAlertNotValid(false)
                
            }
        } else {
            setAlertNotValid(false)
        }
        const balanceBank = balanceDetail.find((item) => {
            // console.log(item.channel_id, "balance detail");
            if (bankCodeTujuan === "014" || bankCodeTujuan === "011") {
                return item.channel_id === bankCodeTujuan
            } else {
                bankCodeTujuan = "BIF"
                return item.channel_id === bankCodeTujuan
            }
        })
        if (nominal < balanceBank.mpartballchannel_balance || nominal === balanceBank.mpartballchannel_balance) {
            setAlertSaldo(false)
            let sameFlag = 0
            const results = dataDisburse.filter(res => res.number !== number)
            console.log(results, "results filter");
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
                console.log(dataLama.bankCodeTujuan, 'dataLama bankCodeTujuan');
                console.log(bankCodeTujuan, 'bankCodeTujuan');
                
                if (finding >= 0) {
                    allNominal[finding] = Number(nominal)
                    allFee[finding] = result.fee_total
                }
                if (dataLama.bankCodeTujuan === bankCodeTujuan || bankCodeTujuan === 'BIF') {
                    console.log("masuk 1");
                    // console.log('masuk sama codebank');
                    // console.log(sisaSaldoAlokasiPerBank.bca,'sisaSaldoAlokasiPerBank.bca');
                    // console.log(dataLama.nominal + dataLama.feeTotal,'dataLama.nominal + dataLama.feeTotal');
                    // console.log(nominal,'nominal');
                    // console.log(result.fee_total,'result.fee_total');
                    setSisaSaldoAlokasiPerBank({
                        ...sisaSaldoAlokasiPerBank,
                        [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                    })
                } else {
                    console.log("masuk 2");
                    if (dataLama.bankCodeTujuan === '014') {
                        console.log("masuk 1 sub");
                        setSisaSaldoAlokasiPerBank({
                            ...sisaSaldoAlokasiPerBank,
                            bca: sisaSaldoAlokasiPerBank.bca + (dataLama.nominal + dataLama.feeTotal),
                            [(bankCodeTujuan === '011') ? 'danamon' : 'bifast']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance)) - (Number(nominal) + result.fee_total) 
                        })
                    } else if (dataLama.bankCodeTujuan === '011') {
                        console.log("masuk 2 sub");
                        setSisaSaldoAlokasiPerBank({
                            ...sisaSaldoAlokasiPerBank,
                            danamon: sisaSaldoAlokasiPerBank.danamon + (dataLama.nominal + dataLama.feeTotal),
                            [(bankCodeTujuan === '014') ? 'bca' : 'bifast']: ((bankCodeTujuan === '014') ? (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance)) - (Number(nominal) + result.fee_total) 
                        })
                    } else {
                        console.log("masuk 3 sub");
                        setSisaSaldoAlokasiPerBank({
                            ...sisaSaldoAlokasiPerBank,
                            bifast: sisaSaldoAlokasiPerBank.bifast + (dataLama.nominal + dataLama.feeTotal),
                            [(bankCodeTujuan === '011') ? 'danamon' : 'bca']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance) : (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance)) - (Number(nominal) + result.fee_total) 
                        })
                    }
                }
                setAllFee([...allFee])
                const target = dataDisburse.find((item) => item.number === number)
                const source = {
                    number: number,
                    bankNameTujuan: bankNameTujuan,
                    bankCodeTujuan: inputData.bankCode,
                    cabang: cabang,
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
                console.log("masuk alert not valid");
                setAlertNotValid(true)
                return
            } else {
                console.log("masuk alert valid");
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
        if (nominal < balanceBank.mpartballchannel_balance || nominal === balanceBank.mpartballchannel_balance) {
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

            if (finding) {
                allNominal[finding] = Number(nominal)
                allFee[finding] = result.fee_total
            }

            if (dataLama.bankCodeTujuan === bankCodeTujuan || bankCodeTujuan === 'BIF') {
                console.log("masuk 1");
                // console.log('masuk sama codebank');
                // console.log(sisaSaldoAlokasiPerBank.bca,'sisaSaldoAlokasiPerBank.bca');
                // console.log(dataLama.nominal + dataLama.feeTotal,'dataLama.nominal + dataLama.feeTotal');
                // console.log(nominal,'nominal');
                // console.log(result.fee_total,'result.fee_total');
                setSisaSaldoAlokasiPerBank({
                    ...sisaSaldoAlokasiPerBank,
                    [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                })
            } else {
                if (dataLama.bankCodeTujuan === '014') {
                    console.log("masuk 1 sub");
                    setSisaSaldoAlokasiPerBank({
                        ...sisaSaldoAlokasiPerBank,
                        bca: sisaSaldoAlokasiPerBank.bca + (dataLama.nominal + dataLama.feeTotal),
                        [(bankCodeTujuan === '011') ? 'danamon' : 'bifast']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance)) - (Number(nominal) + result.fee_total) 
                    })
                } else if (dataLama.bankCodeTujuan === '011') {
                    console.log("masuk 2 sub");
                    setSisaSaldoAlokasiPerBank({
                        ...sisaSaldoAlokasiPerBank,
                        danamon: sisaSaldoAlokasiPerBank.danamon + (dataLama.nominal + dataLama.feeTotal),
                        [(bankCodeTujuan === '014') ? 'bca' : 'bifast']: ((bankCodeTujuan === '014') ? (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance)) - (Number(nominal) + result.fee_total) 
                    })
                } else {
                    console.log("masuk 3 sub");
                    setSisaSaldoAlokasiPerBank({
                        ...sisaSaldoAlokasiPerBank,
                        bifast: sisaSaldoAlokasiPerBank.bifast + (dataLama.nominal + dataLama.feeTotal),
                        [(bankCodeTujuan === '011') ? 'danamon' : 'bca']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance) : (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance)) - (Number(nominal) + result.fee_total) 
                    })
                }
            }
            setAllFee([...allFee])
            const target = dataDisburse.find((item) => item.number === number)
            const source = {
                number: number,
                bankNameTujuan: bankNameTujuan,
                bankCodeTujuan: inputData.bankCode,
                cabang: cabang,
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
        console.log(result, "delete result");
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
    }

    function createDataDisburseExcel (dataDisburse, isDisburseManual) {
        // console.log(isDisburseManual, '!isDisbursementManual');
        let dataExcel = []
        for (let i = 0; i < dataDisburse.length; i++) {
            dataExcel.push({"bank_code": (isDisburseManual === true ? dataDisburse[i].bankCodeTujuan : dataDisburse[i].bankCode), "branch_name": (isDisburseManual === true ? dataDisburse[i].cabang : dataDisburse[i].cabangBank), "account_number": (isDisburseManual === true ? dataDisburse[i].noRek : dataDisburse[i].noRekening), "account_name": (isDisburseManual === true ? dataDisburse[i].nameRek : dataDisburse[i].ownerName), "amount": (isDisburseManual === true ? dataDisburse[i].nominal : dataDisburse[i].nominalDisbursement), "email": (isDisburseManual === true ? dataDisburse[i].emailPenerima : dataDisburse[i].email), "description": (isDisburseManual === true ? dataDisburse[i].catatan : dataDisburse[i].note), "save_account_number": (isDisburseManual === true ? dataDisburse[i].saveAcc : false)})
        }
        let workSheet = XLSX.utils.json_to_sheet(dataExcel)
        let workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
        // XLSX.writeFile(workBook, "Disbursement Report.xlsx");
        const convertFile = XLSX.write(workBook, {bookType: "xlsx", type: "array"})
        var data = new Blob([new Uint8Array(convertFile)], { type: "application/octet-stream"})
        // console.log(workBook, 'workBook');
        setDataExcelDisburse(data)
        setShowModalConfirm(true)
    }

    async function sendDataDisburse (data) {
        try {
            
            const auth = "Bearer " + getToken()
            var formData = new FormData()
            formData.append('file_excel', data, 'file_data_karyawan.xlsx')
            const headers = {
                'Content-Type':'multipart/form-data',
                'Authorization' : auth
            }
            const dataSendHandler = await axios.post(BaseURL + "/Partner/UploadDisbursementFile", formData, {headers: headers})
            // console.log(dataSendHandler, 'dataSendHandler');
            if (dataSendHandler.data.response_code === 200 && dataSendHandler.status === 200 && dataSendHandler.data.response_new_token.length === 0) {
                setShowModalConfirm(false)
                // history.push("/disbursement/disbursementpage")
                setDataDisburse([])
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
        history.push('/disbursement/report')
    }

    function pindahHalaman (param) {
        if (param === "manual") {
            console.log("masuk 1");
            if (dataFromUpload.length !== 0 || errorFound.length !== 0 || labelUpload === `<div class='py-4 mb-2 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
            <div className='pb-4'>
                <span class="filepond--label-action">
                    Ganti File
                </span>
            </div>`) {
                setShowModalPindahHalaman(true)
                setTab(param)
            } else {
                console.log("masuk 2 sub");
                disbursementTabs(true)
            }
        } else {
            console.log("masuk 2");
            if (inputData.bankName.length !== 0 || inputData.bankCode.length !== 0 || inputRekening.bankNameRek.length !== 0 || inputRekening.bankNumberRek.length !== 0 || inputHandle.bankCabang.length !== 0 || inputHandle.nominal.length !== 0 || isChecked === true || inputHandle.emailPenerima.length !== 0 || inputHandle.catatan.length !== 0 || dataDisburse.length !== 0 ) {
                console.log("masuk 1 sub");
                setShowModalPindahHalaman(true)
                setTab(param)
            } else {
                console.log("masuk 2 sub");
                disbursementTabs(false)
            }
        }
    }

    function PindahTab (param) {
        if (param === "bulk") {
            console.log("masuk 1");
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
            console.log("masuk 2");
            disbursementTabs(true)
            setShowModalPindahHalaman(false)
            setDataFromUpload([])
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
                        <Toast.Body className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Disbursement Berhasil. <span style={{ textDecoration: 'underline', cursor: "pointer" }} onClick={() => toReportDisburse()}>Lihat Riwayat Disbursement</span></Toast.Body>
                    </Toast>
                </div>
            }
            <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
                <span className='breadcrumbs-span'>{ user_role === "102" ? <Link style={{ cursor: "pointer" }} to={"/laporan"}> Laporan</Link> : <Link style={{ cursor: "pointer" }} to={"/"}>Beranda</Link> }  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Disbursement</span>
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
                            <div className='base-content mb-4'>
                                <div className='d-flex justify-content-start align-items-center' style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'normal', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }}>
                                    <img src={noteInfo} width="25" height="25" alt="circle_info" />
                                    <div className='ms-2'>Pastikan data tujuan Disbursement sudah benar, kesalahan pada data akan berakibat gagalnya proses transaksi Disbursement.</div>
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
                                            {
                                                editNominal ?
                                                <Form.Control
                                                    placeholder="Rp 0"
                                                    type='number'
                                                    className='input-text-user'
                                                    name="nominal"
                                                    value={inputHandle.nominal === undefined ? 0 : inputHandle.nominal}
                                                    onChange={(e) => handleChange(e)}
                                                    onBlur={() => setEditNominal(!editNominal)}
                                                    onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                /> :
                                                <Form.Control
                                                    placeholder="Rp 0"
                                                    type='text'
                                                    className='input-text-user'
                                                    name="nominal"
                                                    value={inputHandle.nominal === undefined ? convertToRupiah(0, true, 0) : convertToRupiah(inputHandle.nominal, true, 2)}
                                                    onChange={(e) => handleChange(e)}
                                                    onFocus={() => setEditNominal(!editNominal)}
                                                />
                                            }
                                        </Col>
                                    </Row>
                                    <Row className="mt-2 mb-3">
                                        <Col xs={2}></Col>
                                        <Col xs={10}>
                                            {
                                                alertSaldo === true ? (
                                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B"}} className='text-start'>
                                                        <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                        Saldo pada Rekening {inputData.bankName} anda tidak cukup
                                                    </div>
                                                ) : (
                                                    ""
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
                                                placeholder="Masukkan Alamat Email Peneima"
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
                                                        inputHandle.nominal,
                                                        inputHandle.emailPenerima,
                                                        inputHandle.catatan,
                                                        isChecked
                                                    )}
                                                    className={
                                                        (inputData.bankName.length !== 0 && inputData.bankCode.length !== 0 && (inputData.bankCode === "014" ? (inputHandle.bankCabang.length === 0 || inputHandle.bankCabang.length !== 0) : inputHandle.bankCabang.length !== 0) && inputRekening.bankNameRek.length !== 0 && inputRekening.bankNumberRek.length !== 0 && inputHandle.nominal.length >= 5 && dataDisburse.length < 10) ? 'btn-ez-disbursement' : 'btn-disbursement-reset'
                                                    }
                                                    disabled={
                                                        (inputData.bankName.length === 0 || inputData.bankCode.length === 0 || (inputData.bankCode !== "014" ? inputHandle.bankCabang.length === 0 : null) || inputRekening.bankNameRek.length === 0 || inputRekening.bankNumberRek.length === 0 || inputHandle.nominal.length < 5 || dataDisburse.length >= 10)
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
                                                            style={{
                                                                fontFamily: "Exo",
                                                                fontSize: 16,
                                                                fontWeight: 700,
                                                                alignItems: "center",
                                                                padding: "12px 24px",
                                                                gap: 8,
                                                                width: 136,
                                                                height: 45,
                                                                color: "#077E86",
                                                                background: "transparent",
                                                                border: "1px solid #077E86",
                                                                borderRadius: 6,
                                                            }}
                                                            onClick={() => saveEditDataDisburse(
                                                                numbering,
                                                                inputData.bankName,
                                                                inputData.bankCode,
                                                                inputHandle.bankCabang,
                                                                inputRekening.bankNumberRek,
                                                                inputRekening.bankNameRek,
                                                                inputHandle.nominal,
                                                                inputHandle.emailPenerima,
                                                                inputHandle.catatan,
                                                                isChecked,
                                                                dataDisburse
                                                            )}
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
                                                                        {convertToRupiah(item.nominal, true, 2)}
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
                                            <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>Total Fee Disbursement</div>
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
                                    {/* <DataTable 
                                        columns={columnsBank}
                                        data={filterItemsBank}
                                        customStyles={customStyles}
                                        // progressComponent={<CustomLoader />}
                                        highlightOnHover
                                        subHeader
                                        subHeaderComponent={subHeaderComponentMemoBank}
                                        noDataComponent={<div className='mt-3'>No Data</div>}
                                        persistTableHead
                                        onRowClicked={handleRowClicked}
                                        fixedHeader={true}
                                        fixedHeaderScrollHeight="300px"
                                        conditionalRowStyles={conditionalRowStyles}
                                    /> */}
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
                                            <a href={templateBulk} download style={{ color: '#077E86' }}>
                                                Download Template
                                            </a>
                                        </button>
                                    </div>
                                </div>
                                <div className='text-center mt-3 position-relative' style={{ marginBottom: 100 }}>
                                    {
                                        errorFound.length !== 0 && errorFound.length > 1 ?
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}>
                                            <div style={{ color: '#B9121B', fontSize: 14, position: 'absolute', zIndex: 1, marginTop: 13 }}>
                                                <div>
                                                    <div style={{ marginLeft: -50 }}>
                                                        <img class="me-2" src={noteIconRed} width="20px" height="20px" />
                                                        Kesalahan data yang perlu diperbaiki:
                                                    </div>
                                                    <div><FontAwesomeIcon style={{ width: 5, marginTop: 3, marginLeft: 150 }} icon={faCircle} /> {`Data nomor ${errorFound[0].no} : ${errorFound[0].keterangan}`}</div>
                                                </div>
                                                <div onClick={() => openErrorListModal(errorFound)} style={{ textDecoration: 'underline', marginLeft: -175, cursor: 'pointer' }}>Lihat Semua</div>
                                            </div>
                                        </div> :
                                        errorFound.length !== 0 && errorFound.length === 1 ?
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}>
                                            <div style={{ color: '#B9121B', fontSize: 14, position: 'absolute', zIndex: 1, marginTop: 13 }}>
                                                <div>
                                                    <div style={{ marginLeft: -50 }}>
                                                        <img class="me-2" src={noteIconRed} width="20px" height="20px" />
                                                        Kesalahan data yang perlu diperbaiki:
                                                    </div>
                                                    <div><FontAwesomeIcon style={{ width: 5, marginTop: 3, marginLeft: 100 }} icon={faCircle} /> {`Data nomor ${errorFound[0].no} : ${errorFound[0].keterangan}`}</div>
                                                </div>
                                                {/* <div onClick={() => openErrorListModal(errorFound)} style={{ textDecoration: 'underline', marginLeft: -175, cursor: 'pointer' }}>Lihat Semua</div> */}
                                            </div>
                                        </div> : null
                                    }
                                    <FilePond
                                        className="dragdrop"
                                        files={files}
                                        onupdatefiles={(newFile) => fileCSV(newFile, listBank, balanceDetail)}
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
                                        columns={columnsBulk}
                                        data={dataFromUpload}
                                        customStyles={customStyles}
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
                                    className={dataFromUpload.length === 0 ? 'btn-noez-transfer' : 'btn-ez-transfer'}
                                    disabled={dataFromUpload.length === 0}
                                    style={{ width: '25%' }}
                                    onClick={() => createDataDisburseExcel(dataFromUpload, isDisbursementManual)}
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
                                        <span>Harap perhatikan panduan pengisian sebelum melakukan penginputan data pada template yang disediakan. Kesalahan penulisan data dapat menyebabkan gagalnya transaksi disbursement.</span>
                                    </div>
                                    <table className='mt-3' style={{ color: '#383838', fontSize: 14, fontFamily: 'Nunito' }}>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>1.</td>
                                            <td style={{ padding: 0 }}>File yang diunggah wajib dalam format *.csv, dan tidak dapat menggunakan format lain</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>2.</td>
                                            <td style={{ padding: 0 }}>File yang diunggah wajib menggunakan template file yang telah disediakan, tidak bisa membuat format sendiri</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>3.</td>
                                            <td style={{ padding: 0 }}>Data perkolom <b>wajib</b> dipisahkan dengan tanda “|” (garis lurus). Dilarang menggunakan tanda baca lain sebagai pemisah data antar kolom. Dilarang menambahkan spasi setelah tanda garis lurus. Contoh penulisan : No|BTN|Gambir|51234678|Agatha|10000|agatha@mail.com|-</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>4.</td>
                                            <td style={{ padding: 0 }}>Dilarang mengubah atau menambahkan nama sheet, nama tabel, urutan tabel dan tipe data tabel. Mengubah nama file diperbolehkan sesuai kebutuhan</td>
                                            {/* <td style={{ padding: 0 }}>Bank Tujuan diisi dengan menuliskan nama bank sesuai dengan daftar bank tujuan disbursement yang telah disediakan pada file berikut : <a href={daftarBank} download style={{ color:"#077E86", textDecoration: "underline" }}>Download File Daftar Bank Tujuan</a></td> */}
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>5.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> - Bank Tujuan diisi sesuai dengan daftar bank tujuan disbursement dan <b>wajib menyertakan kode bank</b>. Daftar bank dapat dilihat pada file berikut : <a href={daftarBank} download style={{ color:"#077E86", textDecoration: "underline" }}>Daftar Bank Tujuan</a></td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>6.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi khusus</b> cabang tujuan bank selain BCA. Apabila bank yang dipilih adalah BCA maka dapat dikosongkan</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>7.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> - Nomor Rekening Tujuan diisi sesuai format rekening bank tujuan. Gunakan format angka dan harap perhatikan digit rekening</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>8.</td>
                                            <td style={{ padding: 0 }}><b>Wajib Diisi</b> - Nama Pemilik Rekening wajib diisi dengan benar dan sesuai </td>
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
                                        <div style={{ height: 210 }}>
                                            <table className='table-error-list-disburse' style={{ color: '#383838', fontSize: 14, fontFamily: 'Nunito' }}>
                                                {
                                                    errorLoadPagination.length !== 0 &&
                                                    errorLoadPagination.map((err, idx) => {
                                                        return(
                                                            <tr>
                                                                <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>{(activePageErrorList > 1) ? (idx + 1)+((activePageErrorList-1)*10) : idx + 1}. </td>
                                                                <td style={{ padding: 0 }}>Data nomor <b>{`${err.no}`}</b>, {`${err.keterangan}`}</td>
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
                                    <input onChange={(newFile) => fileCSV(newFile, listBank, balanceDetail)} type='file' id='input-file' accept='text/csv' style={{ visibility: 'hidden' }} />
                                    <div type='file' className='text-center mb-2'>
                                        <button
                                            onClick={() => handleClickChangeFile()}
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
                                        columns={columnsBulk}
                                        data={dataFromUpload}
                                        customStyles={customStyles}
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
                                    <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>Total Fee Disbursement</div>
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
                                onClick={() => sendDataDisburse(dataExcelDisburse)}
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
                        <div className='text-center px-4' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>Data yang ingin Anda tambahkan sudah tersedia di tabel.</div>
                        <div className='d-flex justify-content-center align-items-center mt-3'>
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
                                            inputHandle.nominal,
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
                                            inputHandle.nominal,
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
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}

export default DisbursementPage