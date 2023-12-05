/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import $ from 'jquery'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import noteInfo from "../../assets/icon/note_icon.svg"
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, language, setUserSession } from '../../function/helpers'
import { Button, Col, Form, FormControl, Modal, OverlayTrigger, Row, Toast, Tooltip } from '@themesberg/react-bootstrap'
import chevron from "../../assets/icon/chevron_down_icon.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
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
import daftarBankInggris from '../../assets/files/List of Disbursement Destination Banks - PT. Ezeelink Indonesia.xlsx'
import daftarBankChina from '../../assets/files/支付银行清单- PT Ezeelink Indonesia.xlsx'
import templateBulkXLSX from '../../assets/files/Template Bulk Disbursement PT. Ezeelink Indonesia.xlsx'
import templateBulkXLSXInggris from '../../assets/files/Bulk Disbursement Template PT. Ezeelink Indonesia.xlsx'
import templateBulkXLSXChina from '../../assets/files/Bulk Disbursement Template PT. Ezeelink Indonesia - Mandarin.xlsx'
import templateBulkCSV from '../../assets/files/Template Bulk Disbursement PT. Ezeelink Indonesia.csv'
import arrowDown from "../../assets/img/icons/arrow_down.svg";
import CurrencyInput from 'react-currency-input-field'
import { eng, ind } from '../../components/Language'

registerPlugin(FilePondPluginFileEncode)

function DisbursementPage() {
    const user_role = getRole()
    const access_token = getToken()
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
    const [labelUpload, setLabelUpload] = useState(`<div class='py-4 mb-2 style-label-drag-drop text-center'>${language === null ? eng.letakkanFile : language.letakkanFile}</div>
    <div className='pb-4'>
        <span class="filepond--label-action">
            ${language === null ? eng.unggahFile : language.unggahFile}
        </span>
    </div>`)
    const [files, setFiles] = useState([])
    const [dataFromUpload, setDataFromUpload] = useState([])
    const [dataOriginFromUpload, setDataOriginFromUpload] = useState([])
    const [dataFromUploadExcel, setDataFromUploadExcel] = useState([])
    const [fileNameDisbursementBulk, setFileNameDisbursementBulk] = useState("")
    const [errorFound, setErrorFound] = useState([])
    const [errorLoadPagination, setErrorLoadPagination] = useState([])
    const [errorFoundPagination, setErrorFoundPagination] = useState([])
    const [showModalErrorList, setShowModalErrorList] = useState(false)
    const [activePageErrorList, setActivePageErrorList] = useState(1)
    const [alertSaldo, setAlertSaldo] = useState(false)
    const [alertNotValid, setAlertNotValid] = useState(false)
    const [alertMinSaldo, setAlertMinSaldo] = useState(false)
    const [alertMaxSaldo, setAlertMaxSaldo] = useState(false)
    const [alertBankTujuan, setAlertBankTujuan] = useState(false)
    const [minMaxDisbursement, setMinMaxDisbursement] = useState({
        minDisbursement: 0,
        maxDisbursement: 0
    })
    const [balanceDetail, setBalanceDetail] = useState([])
    const [sisaAllSaldoTempManual, setSisaAllSaldoTempManual] = useState(0)
    // const [sisaSaldoAlokasiPerBank, setSisaSaldoAlokasiPerBank] = useState({
    //     bca: 0,
    //     danamon: 0,
    //     bifast: 0
    // })
    const [showDetailBalance, setShowDetailBalance] = useState({
        bca: false,
        danamon: false,
        otherBank: false,
        dana: false
    })
    const [totalHoldBalance, setTotalHoldBalance] = useState(0)
    const [isLoadingDisburseMentConfirm, setIsLoadingDisburseMentConfirm] = useState(false)
    const [isDisableChecked, setIsDisableChecked] = useState(false)

    // console.log(dataDisburse, "dataDisburse");
    // console.log(minMaxDisbursement.minDisbursement, "minMaxDisbursement.minDisbursement");

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

    // console.log(((getBalance) - (totalHoldBalance)) - (sum(allNominal) + sum(allFee)), "((getBalance) - (totalHoldBalance)) - (sum(allNominal) + sum(allFee))");
    // console.log(getBalance, "getBalance");
    // console.log(totalHoldBalance, "totalHoldBalance");
    // console.log(sum(allNominal), "sum(allNominal)");
    // console.log(sum(sum(allFee)), "sum(sum(allFee))");

    async function fileCSV(newValue, bankLists, listBallanceBank, bankFee, allBalance, allHoldBalance) {
        if (errorFound.length !== 0) {
            setErrorFound([])
        }

        if (listBallanceBank.length === 0) {
            setLabelUpload(`<div class='pt-1 pb-2 style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />${language === null ? eng.seluruhDataBankTidakTersedia : language.seluruhDataBankTidakTersedia}</div>
                <div class='pb-4 mt-1 style-label-drag-drop'>${language === null ? eng.silahkanCobaUploadUlang : language.silahkanCobaUploadUlang} </div>
                <div className='pb-4'>
                    <span class="filepond--label-action">
                        ${language === null ? eng.oke : language.oke}
                    </span>
                </div>`)
        } else if (listBallanceBank.length !== 0) {
            const filteredBallanceBank = listBallanceBank.filter(item => item.mpaytype_mpaycat_id === 2)
            // console.log(filteredBallanceBank, 'filteredBallanceBank');
            if (filteredBallanceBank.length === 0) {
                setLabelUpload("")
                setLabelUpload(`<div class='pt-1 pb-2 style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />${language === null ? eng.seluruhDataBankTidakTersedia : language.seluruhDataBankTidakTersedia}</div>
                    <div class='pb-4 mt-1 style-label-drag-drop'>${language === null ? eng.silahkanCobaUploadUlang : language.silahkanCobaUploadUlang} </div>
                    <div className='pb-4'>
                        <span class="filepond--label-action">
                            ${language === null ? eng.oke : language.oke}
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
                        setLabelUpload(`<div class='pt-1 pb-2 style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" />${language === null ? eng.formatFileExcel : language.formatFileExcel}</div>
                        <div class='pb-4 mt-1 style-label-drag-drop'>${language === null ? eng.letakkanFile : language.letakkanFile}</div>
                        <div className='pb-4'>
                            <span class="filepond--label-action">
                                ${language === null ? eng.gantiFile : language.gantiFile}
                            </span>
                        </div>`)
                    // }, 2500);
                } else if (newValue.length !== 0 && newValue[0].file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    const pond = await newValue[0].getFileEncodeBase64String()
                    if (pond !== undefined) {
                        const wb = XLSX.read(pond, {type: "base64"})
                        const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
                        let dataTemp = XLSX.utils.sheet_to_json(ws); // generate objects
                        console.log(pond, "pond");
                        console.log(wb, "wb");
                        console.log(ws, "ws");
                        console.log(dataTemp, "dataTemp");
                        if (wb.SheetNames.length !== 1) {
                            setDataFromUploadExcel([])
                            setErrorFound([])
                            setTimeout(() => {
                                setLabelUpload("")
                                setLabelUpload(`<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>${language === null ? eng.jumlahSheetPadaFileExcel : language.jumlahSheetPadaFileExcel}</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>${language === null ? eng.letakkanFile : language.letakkanFile}</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        ${language === null ? eng.gantiFile : language.gantiFile}
                                    </span>
                                </div>`)
                            }, 2500);
                        } else if (ws.A1 === undefined || ws.B1 === undefined || ws.C1 === undefined || ws.D1 === undefined || ws.E1 === undefined || ws.F1 === undefined || ws.G1 === undefined || ws.H1 !== undefined) {
                            setDataFromUploadExcel([])
                            setErrorFound([])
                            setTimeout(() => {
                                setLabelUpload("")
                                setLabelUpload(`<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>${language === null ? eng.kontenTidakSesuai : language.kontenTidakSesuai}</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>${language === null ? eng.letakkanFile : language.letakkanFile}</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        ${language === null ? eng.gantiFile : language.gantiFile}
                                    </span>
                                </div>`)
                            }, 2500);
                        } else if (ws.A1.h.trim() !== (language === null ? eng.bankTujuanStar : language.bankTujuanStar) || ws.B1.h.trim() !== (language === null ? eng.cabangStar : language.cabangStar) || ws.C1.h.trim() !== (language === null ? eng.noRekTujuanStar : language.noRekTujuanStar) || ws.D1.h.trim() !== (language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar) || ws.E1.h.trim() !== (language === null ? eng.nominalDisburseStar : language.nominalDisburseStar) || ws.F1.h.trim() !== (language === null ? eng.emailPenerimaStarAlpabet : language.emailPenerimaStarAlpabet) || ws.G1.h.trim() !== (language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet)) {
                            setDataFromUploadExcel([])
                            setErrorFound([])
                            setTimeout(() => {
                                setLabelUpload("")
                                setLabelUpload(`<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>${language === null ? eng.kontenTidakSesuai : language.kontenTidakSesuai}</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>${language === null ? eng.letakkanFile : language.letakkanFile}</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        ${language === null ? eng.gantiFile : language.gantiFile}
                                    </span>
                                </div>`)
                            }, 2500);
                        } else if (dataTemp.length === 0) {
                            setDataFromUploadExcel([])
                            setErrorFound([])
                            setTimeout(() => {
                                setLabelUpload("")
                                setLabelUpload(`<div class='py-1 d-flex justify-content-center align-items-center style-label-drag-drop-error'><img class="me-2" src="${noteIconRed}" width="20px" height="20px" /><div>${language === null ? eng.dataPadaFileMasihKosong : language.dataPadaFileMasihKosong}</div></div>
                                <div class='pb-4 mt-1 style-label-drag-drop'>${language === null ? eng.letakkanFile : language.letakkanFile}</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        ${language === null ? eng.gantiFile : language.gantiFile}
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
                            // let sisaSaldoAlokasiPerBankTemp = {
                            //     // bca: 0,
                            //     danamon: 0,
                            //     bifast: 0
                            // }
                            let sisaAllSaldoTemp = 0
                            // console.log(data, 'data');
                            data.map(el => {
                                //check duplicate data
                                if(resultArray.find((object, idx) => {
                                    if(object[(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)] === el[(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)] && object[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)] === el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]) {
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
                            let regExp = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g;
                            // console.log(data, 'data2');
                            data = data.map((el, idx) => {
                                let objErrData = {}
                                // console.log(el["Bank Tujuan*"], `el["Bank Tujuan*"]`);
                                const codeBank = el !== undefined && el[(language === null ? eng.bankTujuanStar : language.bankTujuanStar)] !== undefined ? String(el[(language === null ? eng.bankTujuanStar : language.bankTujuanStar)]).slice(0, 3) : undefined
                                const filteredListBank = bankLists.filter(item => item.is_enabled === true) //bank yg aktif
                                const sameBankName = filteredListBank.find(list => list.mbank_code === codeBank) //bank yg sama
                                // console.log(sameBankName, 'sameBankName');
                                // console.log(filteredListBank, 'filteredListBank');
                                // console.log(balanceBank, 'balanceBank');
                                // console.log(sameBankName, 'sameBankName');
                                //pengecekan code bank
                                if (el[(language === null ? eng.bankTujuanStar : language.bankTujuanStar)] === undefined) {
                                    objErrData.no = idx + 2
                                    objErrData.keterangan = (language === null ? eng.kolomBankTujuanWajibDiisi : language.kolomBankTujuanWajibDiisi)
                                    errData.push(objErrData)
                                    objErrData = {}
                                } else if (codeBank.length !== 3) { //kode bank tidak valid
                                    objErrData.no = idx + 2
                                    objErrData.keterangan = (language === null ? eng.kolomBankTujuanSalah : language.kolomBankTujuanSalah)
                                    errData.push(objErrData)
                                    objErrData = {}
                                } else if (codeBank.toLowerCase() !== codeBank.toUpperCase()) { //kode bank tidak valid
                                    objErrData.no = idx + 2
                                    objErrData.keterangan = (language === null ? eng.kolomBankTujuanSalah : language.kolomBankTujuanSalah)
                                    errData.push(objErrData)
                                    objErrData = {}
                                } else if (sameBankName === undefined) { //kode bank tidak valid
                                    objErrData.no = idx + 2
                                    objErrData.keterangan = (language === null ? eng.kolomBankTujuanSalah : language.kolomBankTujuanSalah)
                                    errData.push(objErrData)
                                    objErrData = {}
                                } else { // kode bank valid
                                    // console.log(el["No. Rekening Tujuan*"], 'String(el["No. Rekening Tujuan*"])');
                                    //pengecekan nomer rekening bank
                                    if (el[(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)] === undefined) { //kolom nomor rekening kosong
                                        objErrData.no = idx + 2
                                        objErrData.keterangan = (language === null ? eng.kolomNoRekWajibDiisi : language.kolomNoRekWajibDiisi)
                                        errData.push(objErrData)
                                        objErrData = {}
                                    } else { //nomor rekening tidak valid
                                        if (String(el[(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)]).toLowerCase() !== String(el[(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)]).toUpperCase()) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = (language === null ? eng.kolomNomorRekTipeDataSalah : language.kolomNomorRekTipeDataSalah)
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (sameBankName.mbank_digit_acc !== 0 && (String(el[(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)]).replaceAll(' ', '').replaceAll('-', '').replaceAll('‘', '')).length !== sameBankName.mbank_digit_acc) { //jumlah nomer rekening tidak sesuai
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = (language === null ? eng.kolomNomorRekDigitNomorRek : language.kolomNomorRekDigitNomorRek)
                                            errData.push(objErrData)
                                            objErrData = {}
                                        }
                                    }
                                    // console.log(el["Nama Pemilik Rekening*"], 'el["Nama Pemilik Rekening*"]');
                                    //pengecekan nama pemilik rekening
                                    if (el[(language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar)] === undefined) { // kolom nama kosong
                                        objErrData.no = idx + 2
                                        objErrData.keterangan = (language === null ? eng.kolomNamaPemilikRekWajibDiisi : language.kolomNamaPemilikRekWajibDiisi)
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
                                    // console.log(el["Nama Pemilik Rekening*"], 'el["Nama Pemilik Rekening*"]');
                                    //pengecekan nama tidak boleh selain alphabet
                                    if (el[(language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar)] !== undefined) { // nama nya mandarin
                                        if (regExp.test(el[(language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar)])) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = `Nama Harus Alphabet`
                                            errData.push(objErrData)
                                            objErrData = {}
                                        }
                                    }
                                    // console.log(el["Email Penerima"], 'el["Email Penerima"]');
                                    //pengecekan email
                                    if (el[language === null ? eng.emailPenerimaStarAlpabet : language.emailPenerimaStarAlpabet] !== undefined && validator.isEmail(el[language === null ? eng.emailPenerimaStarAlpabet : language.emailPenerimaStarAlpabet]) === false) { //format email salah
                                        objErrData.no = idx + 2
                                        objErrData.keterangan = (language === null ? eng.kolomEmailPenerimaTipeDataSalah : language.kolomEmailPenerimaTipeDataSalah)
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
                                    // console.log(el["Email Penerima"], 'el["Email Penerima"]');
                                    //pengecekan email tidak boleh selain alphabet
                                    if (el[(language === null ? eng.emailPenerimaStarAlpabet : language.emailPenerimaStarAlpabet)] !== undefined) { // emailnya nya mandarin
                                        if (regExp.test(el[(language === null ? eng.emailPenerimaStarAlpabet : language.emailPenerimaStarAlpabet)])) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = `Email Harus Alphabet`
                                            errData.push(objErrData)
                                            objErrData = {}
                                        }
                                    }
                                    //pengecekan catatan
                                    if (el[language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet] !== undefined && el[language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet].length > 25) { //catatan lebih dari 25 karakter
                                        objErrData.no = idx + 2
                                        objErrData.keterangan = (language === null ? eng.kolomCatatanMaksKarakter : language.kolomCatatanMaksKarakter)
                                        errData.push(objErrData)
                                        objErrData = {}
                                    }
                                    //pengecekan catatan harus alphabet
                                    if (el[language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet] !== undefined && el[language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet].length <= 25) { //catatan lebih dari 25 karakter
                                        if (regExp.test(el[language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet])) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = `Catatan Harus Alphabet`
                                            errData.push(objErrData)
                                            objErrData = {}
                                        }
                                    }
                                    if (sameBankName !== undefined) {
                                        return {
                                            ...el,
                                            [(language === null ? eng.bankTujuanStar : language.bankTujuanStar)]: `${sameBankName.mbank_code} - ${sameBankName.mbank_name}`,
                                            [(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)]: String(el[(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)]).replaceAll(' ', '').replaceAll('-', '').replaceAll('‘', ''), //"Digit rekening tidak sesuai dengan bank tujuan."
                                            [(language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar)]: el[(language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar)] !== undefined ? el[(language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar)].slice(0, 20) : undefined,
                                        }
                                    } else {
                                        return {
                                            ...el,
                                            [(language === null ? eng.bankTujuanStar : language.bankTujuanStar)]: undefined,
                                        }
                                    }
                                }
                            })

                            // console.log(data, 'data3');
                            data = data.map((el, idx) => {
                                let objErrData = {}
                                const codeBank = el !== undefined && el[(language === null ? eng.bankTujuanStar : language.bankTujuanStar)] !== undefined ? el[(language === null ? eng.bankTujuanStar : language.bankTujuanStar)].slice(0, 3) : undefined
                                // console.log(el["Cabang*"], 'el["Cabang*"]');
                                //pengecekan cabang bank
                                if (codeBank !== undefined) { //selain bank BCA
                                    // console.log('masuk non bca');
                                    if (el[(language === null ? eng.cabangStar : language.cabangStar)] === undefined) {
                                        objErrData.no = idx + 2
                                        objErrData.keterangan = (language === null ? eng.kolomCabangWajibDiisi : language.kolomCabangWajibDiisi)
                                        errData.push(objErrData)
                                        objErrData = {}
                                    } else {
                                        //pengecekan cabang harus alphabet
                                        if (regExp.test(String(el[(language === null ? eng.cabangStar : language.cabangStar)]))) {
                                            // console.log("masuk sisnii");
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = `Cabang Harus Alphabet`
                                            errData.push(objErrData)
                                            objErrData = {}
                                        }
                                        if (String(el[(language === null ? eng.cabangStar : language.cabangStar)]).trim().length === 0) { //kolom cabang bank diisi spasi kosong
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = (language === null ? eng.kolomCabangTidakTersedia : language.kolomCabangTidakTersedia)
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (String(el[(language === null ? eng.cabangStar : language.cabangStar)]).split('x').join(' ').trim().length === 0 || String(el[(language === null ? eng.cabangStar : language.cabangStar)]).split('X').join(' ').trim().length === 0) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = (language === null ? eng.kolomCabangTidakTersedia : language.kolomCabangTidakTersedia)
                                            errData.push(objErrData)
                                            objErrData = {}
                                        // } else if (/[$-/:-?{-~!"^_`\[\]]/.test(String(el[(language === null ? eng.cabangStar : language.cabangStar)]))) {
                                        } else if (String(el[(language === null ? eng.cabangStar : language.cabangStar)]).split('.').join('').trim().length === 0 || String(el[(language === null ? eng.cabangStar : language.cabangStar)]).split(',').join('').trim().length === 0) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = (language === null ? eng.kolomCabangTidakTersedia : language.kolomCabangTidakTersedia)
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (String(el[(language === null ? eng.cabangStar : language.cabangStar)]).toLowerCase() === String(el[(language === null ? eng.cabangStar : language.cabangStar)]).toUpperCase()) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = (language === null ? eng.kolomCabangTidakTersedia : language.kolomCabangTidakTersedia)
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else if (String(el[(language === null ? eng.cabangStar : language.cabangStar)]).length < 4 && String(el[(language === null ? eng.cabangStar : language.cabangStar)]).toLowerCase() !== String(el[(language === null ? eng.cabangStar : language.cabangStar)]).toUpperCase()) {
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = (language === null ? eng.kolomCabangTidakTersedia : language.kolomCabangTidakTersedia)
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else {
                                            return {
                                                ...el,
                                                // "No*": idx + 2,
                                                [(language === null ? eng.bankTujuanStar : language.bankTujuanStar)]: el[(language === null ? eng.bankTujuanStar : language.bankTujuanStar)],
                                                [(language === null ? eng.cabangStar : language.cabangStar)]: el[(language === null ? eng.cabangStar : language.cabangStar)],
                                                [(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)]: el[(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)],
                                                [(language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar)]: el[(language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar)],
                                                [(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]: el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)],
                                                [(language === null ? eng.emailPenerimaStarAlpabet : language.emailPenerimaStarAlpabet)]: el[(language === null ? eng.emailPenerimaStarAlpabet : language.emailPenerimaStarAlpabet)] === undefined ? "-" : el[(language === null ? eng.emailPenerimaStarAlpabet : language.emailPenerimaStarAlpabet)],
                                                [(language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet)]: el[(language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet)] === undefined ? "-" : el[(language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet)],
                                            }
                                        }
                                        return {
                                            ...el,
                                            // "No*": idx + 2,
                                            [(language === null ? eng.bankTujuanStar : language.bankTujuanStar)]: el[(language === null ? eng.bankTujuanStar : language.bankTujuanStar)],
                                            [(language === null ? eng.cabangStar : language.cabangStar)]: String(el[(language === null ? eng.cabangStar : language.cabangStar)]).trim(),
                                            [(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)]: el[(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)],
                                            [(language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar)]: el[(language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar)],
                                            [(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]: el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)],
                                            [(language === null ? eng.emailPenerimaStarAlpabet : language.emailPenerimaStarAlpabet)]: el[(language === null ? eng.emailPenerimaStarAlpabet : language.emailPenerimaStarAlpabet)] === undefined ? "-" : el[(language === null ? eng.emailPenerimaStarAlpabet : language.emailPenerimaStarAlpabet)],
                                            [(language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet)]: el[(language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet)] === undefined ? "-" : el[(language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet)],
                                        }
                                    }
                                // } else if (codeBank === "014" && codeBank !== undefined) {
                                //     // console.log('masuk bca');
                                //     if (el["Cabang*"] === undefined || String(el["Cabang*"]).trim().length === 0 || String(el["Cabang*"]).split('x').join(' ').trim().length === 0 || String(el["Cabang*"]).split('X').join(' ').trim().length === 0 || String(el["Cabang*"]).split('.').join('').trim().length === 0 || String(el["Cabang*"]).split(',').join('').trim().length === 0 || String(el["Cabang*"]).toLowerCase() === String(el["Cabang*"]).toUpperCase()) {
                                //         // console.log('masuk kolom kosong');
                                //         return {
                                //             ...el,
                                //             "Cabang*": '-'
                                //         }
                                //     } else {
                                //         return {
                                //             ...el,
                                //             // "No*": idx + 2,
                                //             "Bank Tujuan*": el["Bank Tujuan*"],
                                //             "Cabang*": String(el["Cabang*"]).trim(),
                                //             "No. Rekening Tujuan*": el["No. Rekening Tujuan*"],
                                //             "Nama Pemilik Rekening*": el["Nama Pemilik Rekening*"],
                                //             "Nominal Disbursement*": el["Nominal Disbursement*"],
                                //             "Email Penerima": el["Email Penerima"] === undefined ? "-" : el["Email Penerima"],
                                //             "Catatan": el["Catatan"] === undefined ? "-" : el["Catatan"],
                                //         }
                                //     }
                                }
                            })

                            // console.log(data, 'data4');
                            data = data.map((el, idx) => {
                                let objErrData = {}
                                if (el !== undefined) {
                                    const codeBank = el !== undefined && el[(language === null ? eng.bankTujuanStar : language.bankTujuanStar)] !== undefined ? el[(language === null ? eng.bankTujuanStar : language.bankTujuanStar)].slice(0, 3) : undefined
                                    const filteredListBank = bankLists.filter(item => item.is_enabled === true) //bank yg aktif
                                    const sameBankName = filteredListBank.find(list => list.mbank_code === codeBank) //bank yg sama
                                    // console.log(sameBankName, 'sameBankName');
                                    const balanceBank = filteredBallanceBank.find((item) => { //ballance bank
                                        // console.log(item.channel_id, "balance detail");
                                        if (codeBank === "011") {
                                            return item.channel_id === codeBank
                                        } else {
                                            // el.bankCode = "BIF"
                                            return item.channel_id === "BIF"
                                        }
                                    })
                                    const resultBankFee = bankFee.find((item) => { //filter fee bank
                                        if (sameBankName.mbank_code === "011") {
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
                                        if (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)] === undefined || el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)] === '0') { //nominal kosong/nol
                                            objErrData.no = idx + 2
                                            objErrData.keterangan = (language === null ? eng.kolomNominalDisburseWajibDiisi : language.kolomNominalDisburseWajibDiisi)
                                            errData.push(objErrData)
                                            objErrData = {}
                                        } else {
                                            if (typeof el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)] === 'string') {
                                                // console.log('masuk string');
                                                if (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].toLowerCase() !== el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].toUpperCase()) {
                                                    // console.log('ada huruf');
                                                    objErrData.no = idx + 2
                                                    objErrData.keterangan = (language === null ? eng.kolomNominalDisburseTipeDataSalah : language.kolomNominalDisburseTipeDataSalah)
                                                    errData.push(objErrData)
                                                    objErrData = {}
                                                } else if (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].toLowerCase() === el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].toUpperCase()) {
                                                    // console.log('tidak ada huruf');
                                                    if (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].indexOf(',') !== -1 && (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)][el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].length - 4] === ',' || el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)][el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].length - 1] === ',')) {
                                                        // console.log('masuk koma bener');
                                                        if (Number(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].replaceAll(",", "").replaceAll(".", "")) < resultBankFee.mpartfitur_min_amount_trx) {
                                                            objErrData.no = idx + 2
                                                            objErrData.keterangan = `${language === null ? eng.kolomNominalDisburseMinNominal : language.kolomNominalDisburseMinNominal} ${convertToRupiah(resultBankFee.mpartfitur_min_amount_trx)}`
                                                            errData.push(objErrData)
                                                            objErrData = {}
                                                        } else if (Number(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].replaceAll(",", "").replaceAll(".", "")) > resultBankFee.mpartfitur_max_amount_trx) {
                                                            // console.log(Number(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].replaceAll(",", "").replaceAll(".", "")), 'Number(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].replaceAll(",", "").replaceAll(".", ""))');
                                                            // console.log(resultBankFee.mpartfitur_max_amount_trx, 'resultBankFee.mpartfitur_max_amount_trx');
                                                            objErrData.no = idx + 2
                                                            objErrData.keterangan = `${language === null ? eng.kolomNominalDisburseMaksNominal : language.kolomNominalDisburseMaksNominal} ${convertToRupiah(resultBankFee.mpartfitur_max_amount_trx)}`
                                                            errData.push(objErrData)
                                                            objErrData = {}
                                                        } else {
                                                            // console.log('masuk plus nominal 1');
                                                            const nominalDisbursementNumber = Number(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].replaceAll(",", "").replaceAll(".", ""))
                                                            totalNominalDisburse += nominalDisbursementNumber
                                                            if (nominalDisbursementNumber <= allBalance) {
                                                                // if (codeBank === '014') {
                                                                //     if ((sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                //         objErrData.no = idx + 2
                                                                //         objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                                //         errData.push(objErrData)
                                                                //         objErrData = {}
                                                                //         sisaSaldoAlokasiPerBankTemp = {
                                                                //             ...sisaSaldoAlokasiPerBankTemp,
                                                                //             bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //         }
                                                                //     } else {
                                                                //         // console.log('masuk plus nominal 3');
                                                                //         // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                //         sisaSaldoAlokasiPerBankTemp = {
                                                                //             ...sisaSaldoAlokasiPerBankTemp,
                                                                //             bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //         }
                                                                //     }
                                                                // } else
                                                                if ((sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                    objErrData.no = idx + 2
                                                                    objErrData.keterangan = (language === null ? eng.saldoAndaTidakCukup : language.saldoAndaTidakCukup)
                                                                    errData.push(objErrData)
                                                                    objErrData = {}
                                                                    // sisaSaldoAlokasiPerBankTemp = {
                                                                    //     ...sisaSaldoAlokasiPerBankTemp,
                                                                    //     danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    // }
                                                                    sisaAllSaldoTemp = (sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                } else {
                                                                    // console.log('masuk plus nominal 4');
                                                                    // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                    // sisaSaldoAlokasiPerBankTemp = {
                                                                    //     ...sisaSaldoAlokasiPerBankTemp,
                                                                    //     danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                    // }
                                                                    sisaAllSaldoTemp = (sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                }
                                                                // if (codeBank === '011') {
                                                                //     if ((sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                //         objErrData.no = idx + 2
                                                                //         objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                                //         errData.push(objErrData)
                                                                //         objErrData = {}
                                                                //         sisaSaldoAlokasiPerBankTemp = {
                                                                //             ...sisaSaldoAlokasiPerBankTemp,
                                                                //             danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //         }
                                                                //     } else {
                                                                //         // console.log('masuk plus nominal 4');
                                                                //         // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                //         sisaSaldoAlokasiPerBankTemp = {
                                                                //             ...sisaSaldoAlokasiPerBankTemp,
                                                                //             danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //         }
                                                                //     }
                                                                // } else {
                                                                //     if ((sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                //         objErrData.no = idx + 2
                                                                //         objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                                //         errData.push(objErrData)
                                                                //         objErrData = {}
                                                                //         sisaSaldoAlokasiPerBankTemp = {
                                                                //             ...sisaSaldoAlokasiPerBankTemp,
                                                                //             bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //         }
                                                                //     } else {
                                                                //         // console.log('masuk plus nominal 5');
                                                                //         // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                //         sisaSaldoAlokasiPerBankTemp = {
                                                                //             ...sisaSaldoAlokasiPerBankTemp,
                                                                //             bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //         }
                                                                //     }
                                                                // }
                                                            } else if (nominalDisbursementNumber > (allBalance - allHoldBalance)) {
                                                                // if (codeBank === '014') {
                                                                //     objErrData.no = idx + 2
                                                                //     objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                                //     errData.push(objErrData)
                                                                //     objErrData = {}
                                                                //     sisaSaldoAlokasiPerBankTemp = {
                                                                //         ...sisaSaldoAlokasiPerBankTemp,
                                                                //         bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //     }
                                                                // } else
                                                                objErrData.no = idx + 2
                                                                objErrData.keterangan = (language === null ? eng.saldoAndaTidakCukup : language.saldoAndaTidakCukup)
                                                                errData.push(objErrData)
                                                                objErrData = {}
                                                                sisaAllSaldoTemp = (sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                // if (codeBank === '011') {
                                                                //     objErrData.no = idx + 2
                                                                //     objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                                //     errData.push(objErrData)
                                                                //     objErrData = {}
                                                                //     sisaSaldoAlokasiPerBankTemp = {
                                                                //         ...sisaSaldoAlokasiPerBankTemp,
                                                                //         danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //     }
                                                                // } else {
                                                                //     objErrData.no = idx + 2
                                                                //     objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                                //     errData.push(objErrData)
                                                                //     objErrData = {}
                                                                //     sisaSaldoAlokasiPerBankTemp = {
                                                                //         ...sisaSaldoAlokasiPerBankTemp,
                                                                //         bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //     }
                                                                // }
                                                            }
                                                            return {
                                                                ...el,
                                                                [(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]: nominalDisbursementNumber
                                                            }
                                                        }
                                                    } else if (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].indexOf('.') !== -1 && (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)][el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].length - 4] === '.' || el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)][el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].length - 1] === '.')) {
                                                        // console.log('masuk titik bener');
                                                        if (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].replaceAll(",", "").replaceAll(".", "").length < 5) {
                                                            objErrData.no = idx + 2
                                                            objErrData.keterangan = (language === null ? eng.kolomNominalDisburseMinNominal : language.kolomNominalDisburseMinNominal)
                                                            errData.push(objErrData)
                                                            objErrData = {}
                                                        } else {
                                                            // console.log('masuk plus nominal 2');
                                                            const nominalDisbursementNumber = Number(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].replaceAll(",", "").replaceAll(".", ""))
                                                            totalNominalDisburse += nominalDisbursementNumber
                                                            if (nominalDisbursementNumber <= allBalance) {
                                                                // if (codeBank === '014') {
                                                                //     if ((sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                //         objErrData.no = idx + 2
                                                                //         objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                                //         errData.push(objErrData)
                                                                //         objErrData = {}
                                                                //         sisaSaldoAlokasiPerBankTemp = {
                                                                //             ...sisaSaldoAlokasiPerBankTemp,
                                                                //             bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //         }
                                                                //     } else {
                                                                //         // console.log('masuk plus nominal 3');
                                                                //         // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                //         sisaSaldoAlokasiPerBankTemp = {
                                                                //             ...sisaSaldoAlokasiPerBankTemp,
                                                                //             bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //         }
                                                                //     }
                                                                // } else
                                                                if ((sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                    objErrData.no = idx + 2
                                                                    objErrData.keterangan = (language === null ? eng.saldoAndaTidakCukup : language.saldoAndaTidakCukup)
                                                                    errData.push(objErrData)
                                                                    objErrData = {}
                                                                    sisaAllSaldoTemp = (sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                } else {
                                                                    // console.log('masuk plus nominal 4');
                                                                    // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                    sisaAllSaldoTemp = (sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                }
                                                                // if (codeBank === '011') {
                                                                //     if ((sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                //         objErrData.no = idx + 2
                                                                //         objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                                //         errData.push(objErrData)
                                                                //         objErrData = {}
                                                                //         sisaSaldoAlokasiPerBankTemp = {
                                                                //             ...sisaSaldoAlokasiPerBankTemp,
                                                                //             danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //         }
                                                                //     } else {
                                                                //         // console.log('masuk plus nominal 4');
                                                                //         // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                //         sisaSaldoAlokasiPerBankTemp = {
                                                                //             ...sisaSaldoAlokasiPerBankTemp,
                                                                //             danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //         }
                                                                //     }
                                                                // } else {
                                                                //     if ((sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                //         objErrData.no = idx + 2
                                                                //         objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                                //         errData.push(objErrData)
                                                                //         objErrData = {}
                                                                //         sisaSaldoAlokasiPerBankTemp = {
                                                                //             ...sisaSaldoAlokasiPerBankTemp,
                                                                //             bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //         }
                                                                //     } else {
                                                                //         // console.log('masuk plus nominal 5');
                                                                //         // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                //         sisaSaldoAlokasiPerBankTemp = {
                                                                //             ...sisaSaldoAlokasiPerBankTemp,
                                                                //             bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //         }
                                                                //     }
                                                                // }
                                                            } else if (nominalDisbursementNumber > (allBalance - allHoldBalance)) {
                                                                // if (codeBank === '014') {
                                                                //     objErrData.no = idx + 2
                                                                //     objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                                //     errData.push(objErrData)
                                                                //     objErrData = {}
                                                                //     sisaSaldoAlokasiPerBankTemp = {
                                                                //         ...sisaSaldoAlokasiPerBankTemp,
                                                                //         bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //     }
                                                                // } else
                                                                objErrData.no = idx + 2
                                                                objErrData.keterangan = (language === null ? eng.saldoAndaTidakCukup : language.saldoAndaTidakCukup)
                                                                errData.push(objErrData)
                                                                objErrData = {}
                                                                sisaAllSaldoTemp = (sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                // if (codeBank === '011') {
                                                                //     objErrData.no = idx + 2
                                                                //     objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                                //     errData.push(objErrData)
                                                                //     objErrData = {}
                                                                //     sisaSaldoAlokasiPerBankTemp = {
                                                                //         ...sisaSaldoAlokasiPerBankTemp,
                                                                //         danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //     }
                                                                // } else {
                                                                //     objErrData.no = idx + 2
                                                                //     objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                                //     errData.push(objErrData)
                                                                //     objErrData = {}
                                                                //     sisaSaldoAlokasiPerBankTemp = {
                                                                //         ...sisaSaldoAlokasiPerBankTemp,
                                                                //         bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                                //     }
                                                                // }
                                                            }
                                                            return {
                                                                ...el,
                                                                [(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]: nominalDisbursementNumber
                                                            }
                                                        }
                                                    } else if ((el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].indexOf(',') !== -1 && el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)][el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].length - 3] === ',') || (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].indexOf(',') !== -1 && el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)][el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].length - 2] === ',')) {
                                                        // console.log('masuk koma salah', el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].split(",")[0]);
                                                        // console.log(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].split(","), 'nominal disbursement');
                                                        objErrData.no = idx + 2
                                                        objErrData.keterangan = (language === null ? eng.kolomNominalDisburseTidakBolehDesimal : language.kolomNominalDisburseTidakBolehDesimal)
                                                        errData.push(objErrData)
                                                        objErrData = {}
                                                    } else if ((el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].indexOf('.') !== -1 && el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)][el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].length - 3] === '.') || (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].indexOf('.') !== -1 && el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)][el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].length - 2] === '.')) {
                                                        objErrData.no = idx + 2
                                                        objErrData.keterangan = (language === null ? eng.kolomNominalDisburseTidakBolehDesimal : language.kolomNominalDisburseTidakBolehDesimal)
                                                        errData.push(objErrData)
                                                        objErrData = {}
                                                    } else if (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].indexOf(',') === -1 || el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].indexOf('.') === -1) {
                                                        const nominalDisbursementNumber = Number(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)])
                                                        if (nominalDisbursementNumber <= allBalance) {
                                                            // if (codeBank === '014') {
                                                            //     if ((sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                            //         objErrData.no = idx + 2
                                                            //         objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                            //         errData.push(objErrData)
                                                            //         objErrData = {}
                                                            //         sisaSaldoAlokasiPerBankTemp = {
                                                            //             ...sisaSaldoAlokasiPerBankTemp,
                                                            //             bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                            //         }
                                                            //     } else {
                                                            //         // console.log('masuk plus nominal 3');
                                                            //         // totalNominalDisburse += el["Nominal Disbursement*"]
                                                            //         sisaSaldoAlokasiPerBankTemp = {
                                                            //             ...sisaSaldoAlokasiPerBankTemp,
                                                            //             bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                            //         }
                                                            //     }
                                                            // } else
                                                            if ((sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                                objErrData.no = idx + 2
                                                                objErrData.keterangan = (language === null ? eng.saldoAndaTidakCukup : language.saldoAndaTidakCukup)
                                                                errData.push(objErrData)
                                                                objErrData = {}
                                                                sisaAllSaldoTemp = (sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                            } else {
                                                                // console.log('masuk plus nominal 4');
                                                                // totalNominalDisburse += el["Nominal Disbursement*"]
                                                                sisaAllSaldoTemp = (sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                            }
                                                            // if (codeBank === '011') {
                                                            //     if ((sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                            //         objErrData.no = idx + 2
                                                            //         objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                            //         errData.push(objErrData)
                                                            //         objErrData = {}
                                                            //         sisaSaldoAlokasiPerBankTemp = {
                                                            //             ...sisaSaldoAlokasiPerBankTemp,
                                                            //             danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                            //         }
                                                            //     } else {
                                                            //         // console.log('masuk plus nominal 4');
                                                            //         // totalNominalDisburse += el["Nominal Disbursement*"]
                                                            //         sisaSaldoAlokasiPerBankTemp = {
                                                            //             ...sisaSaldoAlokasiPerBankTemp,
                                                            //             danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                            //         }
                                                            //     }
                                                            // } else {
                                                            //     if ((sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total) < 0) {
                                                            //         objErrData.no = idx + 2
                                                            //         objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                            //         errData.push(objErrData)
                                                            //         objErrData = {}
                                                            //         sisaSaldoAlokasiPerBankTemp = {
                                                            //             ...sisaSaldoAlokasiPerBankTemp,
                                                            //             bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                            //         }
                                                            //     } else {
                                                            //         // console.log('masuk plus nominal 5');
                                                            //         // totalNominalDisburse += el["Nominal Disbursement*"]
                                                            //         sisaSaldoAlokasiPerBankTemp = {
                                                            //             ...sisaSaldoAlokasiPerBankTemp,
                                                            //             bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                            //         }
                                                            //     }
                                                            // }
                                                        } else if (nominalDisbursementNumber > (allBalance - allHoldBalance)) {
                                                            // if (codeBank === '014') {
                                                            //     objErrData.no = idx + 2
                                                            //     objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                            //     errData.push(objErrData)
                                                            //     objErrData = {}
                                                            //     sisaSaldoAlokasiPerBankTemp = {
                                                            //         ...sisaSaldoAlokasiPerBankTemp,
                                                            //         bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                            //     }
                                                            // } else
                                                            objErrData.no = idx + 2
                                                            objErrData.keterangan = (language === null ? eng.saldoAndaTidakCukup : language.saldoAndaTidakCukup)
                                                            errData.push(objErrData)
                                                            objErrData = {}
                                                            sisaAllSaldoTemp = (sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                            // if (codeBank === '011') {
                                                            //     objErrData.no = idx + 2
                                                            //     objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                            //     errData.push(objErrData)
                                                            //     objErrData = {}
                                                            //     sisaSaldoAlokasiPerBankTemp = {
                                                            //         ...sisaSaldoAlokasiPerBankTemp,
                                                            //         danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                            //     }
                                                            // } else {
                                                            //     objErrData.no = idx + 2
                                                            //     objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                            //     errData.push(objErrData)
                                                            //     objErrData = {}
                                                            //     sisaSaldoAlokasiPerBankTemp = {
                                                            //         ...sisaSaldoAlokasiPerBankTemp,
                                                            //         bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                            //     }
                                                            // }
                                                        }
                                                        totalNominalDisburse += Number(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)])
                                                        return {
                                                            ...el,
                                                            [(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]: Number(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)])
                                                        }
                                                    }
                                                } else if (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)].length < 5) {
                                                    objErrData.no = idx + 2
                                                    objErrData.keterangan = (language === null ? eng.kolomNominalDisburseMinNominal : language.kolomNominalDisburseMinNominal)
                                                    errData.push(objErrData)
                                                    objErrData = {}
                                                }
                                            } else if (typeof el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)] === 'number') {
                                                // console.log('masuk number');
                                                const nominalDisbursementNumber = Number(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)])
                                                if ((String(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]).indexOf('.') !== -1 && String(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)])[String(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]).length - 3] === '.') || (String(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]).indexOf('.') !== -1 && String(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)])[String(el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]).length - 2] === '.')) {
                                                    objErrData.no = idx + 2
                                                    objErrData.keterangan = (language === null ? eng.kolomNominalDisburseTidakBolehDesimal : language.kolomNominalDisburseTidakBolehDesimal)
                                                    errData.push(objErrData)
                                                    objErrData = {}
                                                } else if (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)] < resultBankFee.mpartfitur_min_amount_trx) {
                                                    objErrData.no = idx + 2
                                                    objErrData.keterangan = `${language === null ? eng.kolomNominalDisburseMinNominal : language.kolomNominalDisburseMinNominal} ${convertToRupiah(resultBankFee.mpartfitur_min_amount_trx)}`
                                                    errData.push(objErrData)
                                                    objErrData = {}
                                                } else if (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)] > resultBankFee.mpartfitur_max_amount_trx) {
                                                    // console.log(el["Nominal Disbursement*"], 'el["Nominal Disbursement*"]');
                                                    // console.log(resultBankFee.mpartfitur_max_amount_trx, 'resultBankFee.mpartfitur_max_amount_trx');
                                                    objErrData.no = idx + 2
                                                    objErrData.keterangan = `${language === null ? eng.kolomNominalDisburseMaksNominal : language.kolomNominalDisburseMaksNominal} ${convertToRupiah(resultBankFee.mpartfitur_max_amount_trx)}`
                                                    errData.push(objErrData)
                                                    objErrData = {}
                                                } else if (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)] <= allBalance) {
                                                    // console.log('masuk number1');
                                                    // if (codeBank === '014') {
                                                    //     // console.log('masuk number1');
                                                    //     if ((sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total) < 0) {
                                                    //         objErrData.no = idx + 2
                                                    //         objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                    //         errData.push(objErrData)
                                                    //         objErrData = {}
                                                    //         sisaSaldoAlokasiPerBankTemp = {
                                                    //             ...sisaSaldoAlokasiPerBankTemp,
                                                    //             bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                    //         }
                                                    //     } else {
                                                    //         // console.log('masuk plus nominal 3');
                                                    //         totalNominalDisburse += el["Nominal Disbursement*"]
                                                    //         sisaSaldoAlokasiPerBankTemp = {
                                                    //             ...sisaSaldoAlokasiPerBankTemp,
                                                    //             bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                    //         }
                                                    //         return {
                                                    //             ...el,
                                                    //             "Nominal Disbursement*": el["Nominal Disbursement*"]
                                                    //         }
                                                    //     }
                                                    // } else
                                                    if ((sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)] + resultBankFee.fee_total) < 0) {
                                                        objErrData.no = idx + 2
                                                        objErrData.keterangan = (language === null ? eng.saldoAndaTidakCukup : language.saldoAndaTidakCukup)
                                                        errData.push(objErrData)
                                                        objErrData = {}
                                                        sisaAllSaldoTemp = (sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                    } else {
                                                        // console.log('masuk plus nominal 4');
                                                        totalNominalDisburse += el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]
                                                        sisaAllSaldoTemp = (sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                    }
                                                    return {
                                                        ...el,
                                                        [(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]: el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]
                                                    }
                                                    // if (codeBank === '011') {
                                                    //     if ((sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total) < 0) {
                                                    //         objErrData.no = idx + 2
                                                    //         objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                    //         errData.push(objErrData)
                                                    //         objErrData = {}
                                                    //         sisaSaldoAlokasiPerBankTemp = {
                                                    //             ...sisaSaldoAlokasiPerBankTemp,
                                                    //             danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                    //         }
                                                    //     } else {
                                                    //         // console.log('masuk plus nominal 4');
                                                    //         totalNominalDisburse += el["Nominal Disbursement*"]
                                                    //         sisaSaldoAlokasiPerBankTemp = {
                                                    //             ...sisaSaldoAlokasiPerBankTemp,
                                                    //             danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                    //         }
                                                    //     }
                                                    //     return {
                                                    //         ...el,
                                                    //         "Nominal Disbursement*": el["Nominal Disbursement*"]
                                                    //     }
                                                    // } else {
                                                    //     if ((sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total) < 0) {
                                                    //         objErrData.no = idx + 2
                                                    //         objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                    //         errData.push(objErrData)
                                                    //         objErrData = {}
                                                    //         sisaSaldoAlokasiPerBankTemp = {
                                                    //             ...sisaSaldoAlokasiPerBankTemp,
                                                    //             bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                    //         }
                                                    //     } else {
                                                    //         // console.log('masuk plus nominal 5');
                                                    //         totalNominalDisburse += el["Nominal Disbursement*"]
                                                    //         sisaSaldoAlokasiPerBankTemp = {
                                                    //             ...sisaSaldoAlokasiPerBankTemp,
                                                    //             bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                    //         }
                                                    //     }
                                                    //     return {
                                                    //         ...el,
                                                    //         "Nominal Disbursement*": el["Nominal Disbursement*"]
                                                    //     }
                                                    // }
                                                } else if (el[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)] > (allBalance - allHoldBalance)) {
                                                    // if (codeBank === '014') {
                                                    //     objErrData.no = idx + 2
                                                    //     objErrData.keterangan = 'Saldo pada rekening BCA anda tidak cukup.'
                                                    //     errData.push(objErrData)
                                                    //     objErrData = {}
                                                    //     sisaSaldoAlokasiPerBankTemp = {
                                                    //         ...sisaSaldoAlokasiPerBankTemp,
                                                    //         bca: (sisaSaldoAlokasiPerBankTemp.bca !== 0 ? sisaSaldoAlokasiPerBankTemp.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                    //     }
                                                    // } else
                                                    objErrData.no = idx + 2
                                                    objErrData.keterangan = (language === null ? eng.saldoAndaTidakCukup : language.saldoAndaTidakCukup)
                                                    errData.push(objErrData)
                                                    objErrData = {}
                                                    sisaAllSaldoTemp = (sisaAllSaldoTemp !== 0 ? sisaAllSaldoTemp : allBalance - allHoldBalance) - (nominalDisbursementNumber + resultBankFee.fee_total)
                                                    // if (codeBank === '011') {
                                                    //     objErrData.no = idx + 2
                                                    //     objErrData.keterangan = 'Saldo pada rekening Danamon anda tidak cukup.'
                                                    //     errData.push(objErrData)
                                                    //     objErrData = {}
                                                    //     sisaSaldoAlokasiPerBankTemp = {
                                                    //         ...sisaSaldoAlokasiPerBankTemp,
                                                    //         danamon: (sisaSaldoAlokasiPerBankTemp.danamon !== 0 ? sisaSaldoAlokasiPerBankTemp.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                    //     }
                                                    // } else {
                                                    //     objErrData.no = idx + 2
                                                    //     objErrData.keterangan = `Saldo pada rekening ${resultBankFee.mpaytype_name} anda tidak cukup.`
                                                    //     errData.push(objErrData)
                                                    //     objErrData = {}
                                                    //     sisaSaldoAlokasiPerBankTemp = {
                                                    //         ...sisaSaldoAlokasiPerBankTemp,
                                                    //         bifast: (sisaSaldoAlokasiPerBankTemp.bifast !== 0 ? sisaSaldoAlokasiPerBankTemp.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (el["Nominal Disbursement*"] + resultBankFee.fee_total)
                                                    //     }
                                                    // }
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
                                setLabelUpload(`<div class='pb-4 style-label-drag-drop-error-list'>${language === null ? eng.letakkanFile : language.letakkanFile}</div>
                                <div className='pb-4'>
                                    <span class="filepond--label-action">
                                        ${language === null ? eng.pilihFile : language.pilihFile}
                                    </span>
                                </div>`)
                                setTimeout(() => {
                                    setErrorFound(errData)
                                    setLabelUpload(`<div class='pb-4 style-label-drag-drop-error-list'>${language === null ? eng.letakkanFile : language.letakkanFile}</div>
                                    <div className='pb-4'>
                                        <span class="filepond--label-action">
                                            ${language === null ? eng.gantiFile : language.gantiFile}
                                        </span>
                                    </div>`)
                                }, 2500);
                            } else {
                                setDataFromUploadExcel([])
                                setErrorFound([])
                                setTimeout(() => {
                                    setLabelUpload("")
                                    setLabelUpload(`<div class='mt-2 style-label-drag-drop-filename'>${newValue[0].file.name}</div>
                                    <div class='py-4 style-label-drag-drop'>${language === null ? eng.letakkanFile : language.letakkanFile}</div>
                                    <div className='pb-4'>
                                        <span class="filepond--label-action">
                                            ${language === null ? eng.gantiFile : language.gantiFile}
                                        </span>
                                    </div>`)
                                }, 2500);
                                setTimeout(() => {
                                    // console.log(data, 'masuk usestate');
                                    setFileNameDisbursementBulk(newValue[0].file.name)
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
                //         if ((headerCol[0] === '"No*' || headerCol[0] === "No*") && headerCol[1] === "Bank Tujuan*" && headerCol[2] === "Cabang*" && headerCol[3] === "No. Rekening Tujuan*" && headerCol[4] === "Nama Pemilik Rekening*" && headerCol[5] === "Nominal Disbursement*" && headerCol[6] === "Email Penerima" && (headerCol[7] === 'Catatan"\r\n"1' || headerCol[7] === "Catatan\r\n1")) {
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
                //                             objErrData.keterangan = 'kolom Cabang : Wajib Diisi.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (data.cabangBank.length !== 0 && data.cabangBank.trim().length === 0) {
                //                             // console.log('masuk spasi kosong', data.cabangBank, data.bankCode);
                //                             objErrData.no = data.no
                //                             objErrData.keterangan = 'kolom Cabang : Cabang tidak tersedia.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (data.cabangBank.length !== 0 && (data.cabangBank.split('x').join(' ').trim().length === 0 || data.cabangBank.split('X').join(' ').trim().length === 0)) {
                //                             // console.log('masuk huruf x besar dan kecil', data.cabangBank, data.bankCode);
                //                             objErrData.no = data.no
                //                             objErrData.keterangan = 'kolom Cabang : Cabang tidak tersedia.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (data.cabangBank.length !== 0 && /[$-/:-?{-~!"^_`\[\]]/.test(data.cabangBank)) {
                //                             // console.log('masuk tanda baca', data.cabangBank, data.bankCode);
                //                             objErrData.no = data.no
                //                             objErrData.keterangan = 'kolom Cabang : Cabang tidak tersedia.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (data.cabangBank.length !== 0 && data.cabangBank.toLowerCase() === data.cabangBank.toUpperCase()) {
                //                             // console.log('masuk angka', data.cabangBank, data.bankCode);
                //                             objErrData.no = data.no
                //                             objErrData.keterangan = 'kolom Cabang : Cabang tidak tersedia.'
                //                             errData.push(objErrData)
                //                             objErrData = {}
                //                         } else if (data.cabangBank.length !== 0 && data.cabangBank.length < 4 && data.cabangBank.toLowerCase() !== data.cabangBank.toUpperCase()) {
                //                             // console.log('masuk kombinasi kurang dari 4 huruf', data.cabangBank, data.bankCode);
                //                             objErrData.no = data.no
                //                             objErrData.keterangan = 'kolom Cabang : Cabang tidak tersedia.'
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
            <FilterSubAccount filterText={filterTextRekening} onFilter={e => setFilterTextRekening(e.target.value)} title={`${language === null ? eng.cariDaftarBank : language.cariDaftarBank} `} placeholder={`${language === null ? eng.placeholderNamaKodeBank : language.placeholderNamaKodeBank}`}/>
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
          name: "Cabang",
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
            name: language === null ? eng.no : language.no,
            selector: row => row.number,
            width: "67px"
        },
        {
            name: language === null ? eng.bankTujuan : language.bankTujuan,
            selector: row => row.mbank_name,
            width: "130px"
        },
        {
            name: language === null ? eng.cabang : language.cabang,
            selector: row => (row.mbankaccountlist_bank_code === '014' && (row.mbankaccountlist_branch_name.length === 0 || row.mbankaccountlist_branch_name === "")) ? "-" : row.mbankaccountlist_branch_name,
            width: "280px"
        },
        {
            name: language === null ? eng.noRek : language.noRek,
            selector: row => row.mbankaccountlist_number,
            width: "150px"
        },
        {
            name: language === null ? eng.namaPemilikRek : language.namaPemilikRek,
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
            name: 'Cabang',
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
            name: language === null ? eng.no : language.no,
            selector: row => row.no,
            width: "67px"
        },
        {
            name: `${language === null ? eng.bankTujuan : language.bankTujuan}*`,
            selector: row => row[(language === null ? eng.bankTujuanStar : language.bankTujuanStar)],
            width: "180px"
        },
        {
            name: `${language === null ? eng.cabang : language.cabang}*`,
            selector: row => row[(language === null ? eng.cabangStar : language.cabangStar)],
            width: "250px"
        },
        {
            name: `${language === null ? eng.noRekTujuan : language.noRekTujuan}*`,
            selector: row => row[(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)],
        },
        {
            name: `${language === null ? eng.namaPemilikRek : language.namaPemilikRek}*`,
            selector: row => row[(language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar)],
            width: '250px'
        },
        {
            name: `${language === null ? eng.nominalDisburse : language.nominalDisburse}*`,
            selector: row => convertToRupiah(row[(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)], true, 2),
            width: '250px'
        },
        {
            name: `${language === null ? eng.emailPenerima : language.emailPenerima}`,
            selector: row => row[(language === null ? eng.emailPenerimaStarAlpabet : language.emailPenerimaStarAlpabet)],
            width: '250px'
        },
        {
            name: language === null ? eng.catatan : language.catatan,
            selector: row => row[(language === null ? eng.catatanStarAlpabet : language.catatanStarAlpabet)],
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
                setGetBalance(getBalance.data.response_data.balance)
                // setGetBalance(total)
                setBalanceDetail(getBalance.data.response_data.balance_detail)
                setTotalHoldBalance(getBalance.data.response_data.hold_balance)
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
                setGetBalance(getBalance.data.response_data.balance)
                // setGetBalance(total)
                setBalanceDetail(getBalance.data.response_data.balance_detail)
                setTotalHoldBalance(getBalance.data.response_data.hold_balance)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    const handleRowClicked = (row, enable) => {
        setAlertSaldo(false)
        setFilterTextBank('')
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

    function handleChangeNominal(e, bankFee, inputBank, bankList) {
        if (inputBank.bankName.length === 0 && inputBank.bankCode.length === 0) {
            setAlertSaldo(false)
            setAlertMinSaldo(false)
            setAlertMaxSaldo(false)
            setAlertBankTujuan(true)
        } else {
            bankFee.forEach(item => {
                if (inputBank.bankCode === "014" && item.mpaytype_bank_code === "014") {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(e) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                    } else if (Number(e) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                    }
                } else if (inputBank.bankCode === "011" && item.mpaytype_bank_code === "011") {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(e) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                    } else if (Number(e) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                    }
                } else if ((inputBank.bankCode !== "014" && inputBank.bankCode !== "011") && (item.mpaytype_bank_code !== "014" && item.mpaytype_bank_code !== "011")) {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(e) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                    } else if (Number(e) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                    }
                }
            })
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
        saveAcc,
        allBalance,
        allHoldBalance,
        bankFee
    ) {
        console.log(bankCodeTujuan, "bankCodeTujuan");
        let alertCount = 0
        if (bankNameTujuan.length === 0 && bankCodeTujuan.length === 0) {
            setAlertSaldo(false)
            setAlertMinSaldo(false)
            setAlertMaxSaldo(false)
            setAlertBankTujuan(true)
            alertCount++
        } else {
            bankFee.forEach(item => {
                if (bankCodeTujuan === "014" && item.mpaytype_bank_code === "014") {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(nominal) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount++
                    } else if (Number(nominal) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                        alertCount++
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount = 0
                    }
                } else if (bankCodeTujuan === "011" && item.mpaytype_bank_code === "011") {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(nominal) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount++
                    } else if (Number(nominal) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                        alertCount++
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount = 0
                    }
                } else if ((bankCodeTujuan !== "014" && bankCodeTujuan !== "011") && (item.mpaytype_bank_code !== "014" && item.mpaytype_bank_code !== "011")) {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(nominal) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount++
                    } else if (Number(nominal) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                        alertCount++
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount = 0
                    }
                }
            })
        }
        if (emailPenerima.length !== 0 && validator.isEmail(emailPenerima) === false) {
            setErrMsgEmail(true)
            alertCount++
            return
        }
        if ((cabang.length !== 0 && (cabang.trim().length === 0)) || (cabang.length !== 0 && (cabang.toLowerCase() === cabang.toUpperCase()))) {
            setAlertNotValid(true)
            alertCount++
            return
        } else {
            setAlertNotValid(false)
        }
        // if (bankCodeTujuan !== "014") {
        // } else {
        //     setAlertNotValid(false)
        // }
        // const balanceBank = balanceDetail.find((item) => {
        //     console.log(bankCodeTujuan, "bankCodeTujuan");
        //     console.log(item.channel_id, "item.channel_id");
        //     if (bankCodeTujuan === "011") {
        //         console.log("masuk balance 1");
        //         return item.channel_id === bankCodeTujuan
        //     } else {
        //         console.log("masuk balance 2");
        //         bankCodeTujuan = "BIF"
        //         return item.channel_id === bankCodeTujuan
        //     }
        // })
        // let sisaAllSaldoTemp = 0
        // console.log(nominal <= balanceBank.mpartballchannel_balance, 'masuk0');
        if (alertCount === 0) {
            if (nominal <= allBalance) {
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
                        console.log(bankCodeTujuan, "bankCodeTujuan");
                        console.log(item.mpaytype_bank_code, "item.mpaytype_bank_code");
                        if (bankCodeTujuan === item.mpaytype_bank_code) {
                            console.log("masuk 1");
                            return item.mpaytype_bank_code === bankCodeTujuan
                        } else {
                            console.log("masuk 2");
                            bankCodeTujuan = "BIF"
                            return item.mpaytype_bank_code === bankCodeTujuan
                        }
                        // if (bankCodeTujuan === "011") {
                        //     console.log("masuk 1");
                        //     return item.mpaytype_bank_code === bankCodeTujuan
                        // } else {
                        //     console.log("masuk 2");
                        //         bankCodeTujuan = "BIF"
                        //     return item.mpaytype_bank_code === bankCodeTujuan
                        // }
                    })
                    console.log(result, "result");
                    if ((sisaAllSaldoTempManual !== 0 ? sisaAllSaldoTempManual : allBalance - allHoldBalance) - (Number(nominal) + result.fee_total) < 0) {
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
                        setSisaAllSaldoTempManual((sisaAllSaldoTempManual !== 0 ? sisaAllSaldoTempManual : allBalance - allHoldBalance) - (Number(nominal) + result.fee_total))
                        // setSisaSaldoAlokasiPerBank({
                        //     ...sisaSaldoAlokasiPerBank,
                        //     danamon: (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                        // })
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
                    // if (bankCodeTujuan === '014') {
                    //     // console.log('masuk3');
                    //     if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                    //         // console.log(sisaSaldoAlokasiPerBank.bca, 'sisaSaldoAlokasiPerBank.bca');
                    //         // console.log(balanceBank.mpartballchannel_balance, 'balanceBank.mpartballchannel_balance');
                    //         // console.log(balanceBank.hold_balance, 'balanceBank.hold_balance');
                    //         // console.log(Number(nominal) + result.fee_total, 'Number(nominal) + result.fee_total');
                    //         // console.log(Number(nominal), 'Number(nominal)');
                    //         // console.log(result.fee_total, 'result.fee_total');
                    //         setAlertSaldo(true)
                    //     } else {
                    //         const newData = {
                    //             number: number,
                    //             bankNameTujuan: bankNameTujuan,
                    //             bankCodeTujuan: inputData.bankCode,
                    //             cabang: (cabang.length === 0 || cabang === "") ? "-" : cabang,
                    //             noRek : noRek,
                    //             nameRek: nameRek,
                    //             nominal: Number(nominal),
                    //             emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                    //             catatan: catatan.length !== 0 ? catatan : "",
                    //             saveAcc: saveAcc,
                    //             feeTotal: result.fee_total
                    //         }
                    //         setSisaSaldoAlokasiPerBank({
                    //             ...sisaSaldoAlokasiPerBank,
                    //             bca: (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                    //         })
                    //         setAllFee([...allFee, result.fee_total])
                    //         setDataDisburse([...dataDisburse, newData])
                    //         setAllNominal([...allNominal, Number(nominal)])
                    //         setInputData({
                    //             bankName: "",
                    //             bankCode: "",
                    //         })
                    //         setInputRekening({
                    //             bankNameRek: "",
                    //             bankNumberRek: ""
                    //         })
                    //         setInputHandle({
                    //             bankCabang: "",
                    //             nominal: "",
                    //             emailPenerima: "",
                    //             catatan: ""
                    //         })
                    //         setAlertSaldo(false)
                    //         setIsChecked(false)
                    //     }
                    // } else if (bankCodeTujuan === '011') {
                    //     if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                    //         setAlertSaldo(true)
                    //     } else {
                    //         const newData = {
                    //             number: number,
                    //             bankNameTujuan: bankNameTujuan,
                    //             bankCodeTujuan: inputData.bankCode,
                    //             cabang: cabang,
                    //             noRek : noRek,
                    //             nameRek: nameRek,
                    //             nominal: Number(nominal),
                    //             emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                    //             catatan: catatan.length !== 0 ? catatan : "",
                    //             saveAcc: saveAcc,
                    //             feeTotal: result.fee_total
                    //         }
                    //         setSisaSaldoAlokasiPerBank({
                    //             ...sisaSaldoAlokasiPerBank,
                    //             danamon: (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                    //         })
                    //         setAllFee([...allFee, result.fee_total])
                    //         setDataDisburse([...dataDisburse, newData])
                    //         setAllNominal([...allNominal, Number(nominal)])
                    //         setInputData({
                    //             bankName: "",
                    //             bankCode: "",
                    //         })
                    //         setInputRekening({
                    //             bankNameRek: "",
                    //             bankNumberRek: ""
                    //         })
                    //         setInputHandle({
                    //             bankCabang: "",
                    //             nominal: "",
                    //             emailPenerima: "",
                    //             catatan: ""
                    //         })
                    //         setAlertSaldo(false)
                    //         setIsChecked(false)
                    //     }
                    // } else {
                    //     if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                    //         setAlertSaldo(true)
                    //     } else {
                    //         const newData = {
                    //             number: number,
                    //             bankNameTujuan: bankNameTujuan,
                    //             bankCodeTujuan: inputData.bankCode,
                    //             cabang: cabang,
                    //             noRek : noRek,
                    //             nameRek: nameRek,
                    //             nominal: Number(nominal),
                    //             emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                    //             catatan: catatan.length !== 0 ? catatan : "",
                    //             saveAcc: saveAcc,
                    //             feeTotal: result.fee_total
                    //         }
                    //         setSisaSaldoAlokasiPerBank({
                    //             ...sisaSaldoAlokasiPerBank,
                    //             bifast: (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                    //         })
                    //         setAllFee([...allFee, result.fee_total])
                    //         setDataDisburse([...dataDisburse, newData])
                    //         setAllNominal([...allNominal, Number(nominal)])
                    //         setInputData({
                    //             bankName: "",
                    //             bankCode: "",
                    //         })
                    //         setInputRekening({
                    //             bankNameRek: "",
                    //             bankNumberRek: ""
                    //         })
                    //         setInputHandle({
                    //             bankCabang: "",
                    //             nominal: "",
                    //             emailPenerima: "",
                    //             catatan: ""
                    //         })
                    //         setAlertSaldo(false)
                    //         setIsChecked(false)
                    //     }
                    // }
                } else {
                    setShowModalDuplikasi(true)
                }
            } else {
                setAlertSaldo(true)
            }
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
        saveAcc,
        allBalance,
        allHoldBalance,
        bankFee
    ) {
        let alertCount = 0
        if (bankNameTujuan.length === 0 && bankCodeTujuan.length === 0) {
            setAlertSaldo(false)
            setAlertMinSaldo(false)
            setAlertMaxSaldo(false)
            setAlertBankTujuan(true)
            alertCount++
        } else {
            bankFee.forEach(item => {
                if (bankCodeTujuan === "014" && item.mpaytype_bank_code === "014") {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(nominal) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount++
                    } else if (Number(nominal) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                        alertCount++
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount = 0
                    }
                } else if (bankCodeTujuan === "011" && item.mpaytype_bank_code === "011") {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(nominal) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount++
                    } else if (Number(nominal) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                        alertCount++
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount = 0
                    }
                } else if ((bankCodeTujuan !== "014" && bankCodeTujuan !== "011") && (item.mpaytype_bank_code !== "014" && item.mpaytype_bank_code !== "011")) {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(nominal) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount++
                    } else if (Number(nominal) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                        alertCount++
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount = 0
                    }
                }
            })
        }
        if (emailPenerima.length !== 0 && validator.isEmail(emailPenerima) === false) {
            setErrMsgEmail(true)
            alertCount++
            return
        }
        if ((cabang.length !== 0 && (cabang.trim().length === 0)) || (cabang.length !== 0 && (cabang.toLowerCase() === cabang.toUpperCase()))) {
            setAlertNotValid(true)
            alertCount++
            return
        } else {
            setAlertNotValid(false)
        }
        // if (bankCodeTujuan !== "014") {
        // } else {
        //     setAlertNotValid(false)
        // }
        // const balanceBank = balanceDetail.find((item) => {
        //     if (bankCodeTujuan === "011") {
        //         return item.channel_id === bankCodeTujuan
        //     } else {
        //         bankCodeTujuan = "BIF"
        //         return item.channel_id === bankCodeTujuan

        //     }
        // })
        // let sisaAllSaldoTemp = 0
        if (alertCount === 0) {
            if (nominal <= allBalance) {
                setAlertSaldo(false)
                const result = feeBank.find((item) => {
                    if (bankCodeTujuan === item.mpaytype_bank_code) {
                        console.log("masuk 1");
                        return item.mpaytype_bank_code === bankCodeTujuan
                    } else {
                        console.log("masuk 2");
                        bankCodeTujuan = "BIF"
                        return item.mpaytype_bank_code === bankCodeTujuan
                    }
                    // if (bankCodeTujuan === "011") {
                    //     return item.mpaytype_bank_code === bankCodeTujuan
                    // } else {
                    //     bankCodeTujuan = "BIF"
                    //     return item.mpaytype_bank_code === bankCodeTujuan
                    // }
                })
                if ((sisaAllSaldoTempManual !== 0 ? sisaAllSaldoTempManual : allBalance - allHoldBalance) - (Number(nominal) + result.fee_total) < 0) {
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
                    setSisaAllSaldoTempManual((sisaAllSaldoTempManual !== 0 ? sisaAllSaldoTempManual : allBalance - allHoldBalance) - (Number(nominal) + result.fee_total))
                    // setSisaSaldoAlokasiPerBank({
                    //     ...sisaSaldoAlokasiPerBank,
                    //     danamon: (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                    // })
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
                // if (bankCodeTujuan === '014') {
                //     if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                //         setAlertSaldo(true)
                //     } else {
                //         const newData = {
                //             number: number,
                //             bankNameTujuan: bankNameTujuan,
                //             bankCodeTujuan: inputData.bankCode,
                //             cabang: (cabang.length === 0 || cabang === "") ? "-" : cabang,
                //             noRek : noRek,
                //             nameRek: nameRek,
                //             nominal: Number(nominal),
                //             emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                //             catatan: catatan.length !== 0 ? catatan : "",
                //             saveAcc: saveAcc,
                //             feeTotal: result.fee_total
                //         }
                //         setSisaSaldoAlokasiPerBank({
                //             ...sisaSaldoAlokasiPerBank,
                //             bca: (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                //         })
                //         setAllFee([...allFee, result.fee_total])
                //         setDataDisburse([...dataDisburse, newData])
                //         setAllNominal([...allNominal, Number(nominal)])
                //         setInputData({
                //             bankName: "",
                //             bankCode: "",
                //         })
                //         setInputRekening({
                //             bankNameRek: "",
                //             bankNumberRek: ""
                //         })
                //         setInputHandle({
                //             bankCabang: "",
                //             nominal: "",
                //             emailPenerima: "",
                //             catatan: ""
                //         })
                //         setIsChecked(false)
                //         setShowModalDuplikasi(false)
                //     }
                // } else if (bankCodeTujuan === '011') {
                //     if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                //         setAlertSaldo(true)
                //     } else {
                //         const newData = {
                //             number: number,
                //             bankNameTujuan: bankNameTujuan,
                //             bankCodeTujuan: inputData.bankCode,
                //             cabang: cabang,
                //             noRek : noRek,
                //             nameRek: nameRek,
                //             nominal: Number(nominal),
                //             emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                //             catatan: catatan.length !== 0 ? catatan : "",
                //             saveAcc: saveAcc,
                //             feeTotal: result.fee_total
                //         }
                //         setSisaSaldoAlokasiPerBank({
                //             ...sisaSaldoAlokasiPerBank,
                //             danamon: (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                //         })
                //         setAllFee([...allFee, result.fee_total])
                //         setDataDisburse([...dataDisburse, newData])
                //         setAllNominal([...allNominal, Number(nominal)])
                //         setInputData({
                //             bankName: "",
                //             bankCode: "",
                //         })
                //         setInputRekening({
                //             bankNameRek: "",
                //             bankNumberRek: ""
                //         })
                //         setInputHandle({
                //             bankCabang: "",
                //             nominal: "",
                //             emailPenerima: "",
                //             catatan: ""
                //         })
                //         setIsChecked(false)
                //         setShowModalDuplikasi(false)
                //     }
                // } else {
                //     if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                //         setAlertSaldo(true)
                //     } else {
                //         const newData = {
                //             number: number,
                //             bankNameTujuan: bankNameTujuan,
                //             bankCodeTujuan: inputData.bankCode,
                //             cabang: cabang,
                //             noRek : noRek,
                //             nameRek: nameRek,
                //             nominal: Number(nominal),
                //             emailPenerima: emailPenerima.length !== 0 ? emailPenerima : "",
                //             catatan: catatan.length !== 0 ? catatan : "",
                //             saveAcc: saveAcc,
                //             feeTotal: result.fee_total
                //         }
                //         setSisaSaldoAlokasiPerBank({
                //             ...sisaSaldoAlokasiPerBank,
                //             bifast: (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total)
                //         })
                //         setAllFee([...allFee, result.fee_total])
                //         setDataDisburse([...dataDisburse, newData])
                //         setAllNominal([...allNominal, Number(nominal)])
                //         setInputData({
                //             bankName: "",
                //             bankCode: "",
                //         })
                //         setInputRekening({
                //             bankNameRek: "",
                //             bankNumberRek: ""
                //         })
                //         setInputHandle({
                //             bankCabang: "",
                //             nominal: "",
                //             emailPenerima: "",
                //             catatan: ""
                //         })
                //         setIsChecked(false)
                //         setShowModalDuplikasi(false)
                //     }
                // }

            } else {
                setAlertSaldo(true)
            }
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
        dataDisburse,
        allBalance,
        allHoldBalance,
        bankFee
    ) {
        let alertCount = 0
        if (bankNameTujuan.length === 0 && bankCodeTujuan.length === 0) {
            setAlertSaldo(false)
            setAlertMinSaldo(false)
            setAlertMaxSaldo(false)
            setAlertBankTujuan(true)
            alertCount++
            // return
        } else {
            bankFee.forEach(item => {
                if (bankCodeTujuan === "014" && item.mpaytype_bank_code === "014") {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(nominal) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount++
                    } else if (Number(nominal) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                        alertCount++
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount = 0
                    }
                } else if (bankCodeTujuan === "011" && item.mpaytype_bank_code === "011") {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(nominal) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount++
                    } else if (Number(nominal) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                        alertCount++
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount = 0
                    }
                } else if ((bankCodeTujuan !== "014" && bankCodeTujuan !== "011") && (item.mpaytype_bank_code !== "014" && item.mpaytype_bank_code !== "011")) {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(nominal) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount++
                    } else if (Number(nominal) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                        alertCount++
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount = 0
                    }
                }
            })
        }
        if (emailPenerima.length !== 0 && validator.isEmail(emailPenerima) === false) {
            setErrMsgEmail(true)
            alertCount++
            return
        }
        if ((cabang.length !== 0 && (cabang.trim().length === 0)) || (cabang.length !== 0 && (cabang.toLowerCase() === cabang.toUpperCase()))) {
            setAlertNotValid(true)
            alertCount++
            return
        } else {
            setAlertNotValid(false)
        }
        // if (bankCodeTujuan !== "014") {
        // } else {
        //     setAlertNotValid(false)
        // }
        // const balanceBank = balanceDetail.find((item) => {
        //     if (bankCodeTujuan === "011") {
        //         return item.channel_id === bankCodeTujuan
        //     } else {
        //         bankCodeTujuan = "BIF"
        //         return item.channel_id === bankCodeTujuan
        //     }
        // })
        // let sisaAllSaldoTemp = 0
        if (alertCount === 0) {
            if (nominal <= allBalance) {
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
                        if (bankCodeTujuan === item.mpaytype_bank_code) {
                            console.log("masuk 1");
                            return item.mpaytype_bank_code === bankCodeTujuan
                        } else {
                            console.log("masuk 2");
                            bankCodeTujuan = "BIF"
                            return item.mpaytype_bank_code === bankCodeTujuan
                        }
                        // if (bankCodeTujuan === "011") {
                        //     return item.mpaytype_bank_code === bankCodeTujuan
                        // } else {
                        //     bankCodeTujuan = "BIF"
                        //     return item.mpaytype_bank_code === bankCodeTujuan
                        // }
                    })
                    const dataLama = dataDisburse.find((item) => item.number === number);
                    console.log(dataLama.bankCodeTujuan, "dataLama.bankCodeTujuan");
                    console.log(bankCodeTujuan, "bankCodeTujuan");
                    if (dataLama.bankCodeTujuan === bankCodeTujuan || bankCodeTujuan === 'BIF') {
                        if (Number(sisaAllSaldoTempManual) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                            console.log("masuk alert save edit 1");
                            setAlertSaldo(true)
                            return
                        } else {
                            console.log("masuk alert save edit 2");
                            setAlertSaldo(false)
                            setSisaAllSaldoTempManual(Number(sisaAllSaldoTempManual) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total))
                            // setSisaSaldoAlokasiPerBank({
                            //     ...sisaSaldoAlokasiPerBank,
                            //     [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                            // })
                        }
                        // if (bankCodeTujuan === '014') {
                        //     if (Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                        //         setAlertSaldo(true)
                        //         return
                        //     } else {
                        //         setAlertSaldo(false)
                        //         setSisaSaldoAlokasiPerBank({
                        //             ...sisaSaldoAlokasiPerBank,
                        //             [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                        //         })
                        //     }
                        // } else if (bankCodeTujuan === "011") {
                        //     if (Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                        //         setAlertSaldo(true)
                        //         return
                        //     } else {
                        //         setAlertSaldo(false)
                        //         setSisaSaldoAlokasiPerBank({
                        //             ...sisaSaldoAlokasiPerBank,
                        //             [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                        //         })
                        //     }
                        // } else {
                        //     if (Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                        //         setAlertSaldo(true)
                        //         return
                        //     } else {
                        //         setAlertSaldo(false)
                        //         setSisaSaldoAlokasiPerBank({
                        //             ...sisaSaldoAlokasiPerBank,
                        //             [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                        //         })
                        //     }
                        // }
                    } else {
                        console.log(sisaAllSaldoTempManual, "sisaAllSaldoTempManual");
                        console.log(allBalance, "allBalance");
                        console.log(allHoldBalance, "allHoldBalance");
                        console.log(nominal, "nominal");
                        console.log(result.fee_total, "result.fee_total");
                        if ((sisaAllSaldoTempManual !== 0 ? (sisaAllSaldoTempManual + Number(dataLama.nominal + dataLama.feeTotal)) : allBalance - allHoldBalance) - (Number(nominal) + result.fee_total) < 0) {
                            console.log("masuk alert save edit 1");
                            setAlertSaldo(true)
                            return
                        } else {
                            console.log("masuk alert save edit 2");
                            setAlertSaldo(false)
                            setSisaAllSaldoTempManual(Number(sisaAllSaldoTempManual) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total))
                            // setSisaSaldoAlokasiPerBank({
                            //     ...sisaSaldoAlokasiPerBank,
                            //     bca: sisaSaldoAlokasiPerBank.bca + (dataLama.nominal + dataLama.feeTotal),
                            //     [(bankCodeTujuan === '011') ? 'danamon' : 'bifast']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total)
                            // })
                        }
                        // if (dataLama.bankCodeTujuan === '014') {
                        //     if (bankCodeTujuan === "011") {
                        //         if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                        //             setAlertSaldo(true)
                        //             return
                        //         } else {
                        //             setAlertSaldo(false)
                        //             setSisaSaldoAlokasiPerBank({
                        //                 ...sisaSaldoAlokasiPerBank,
                        //                 bca: sisaSaldoAlokasiPerBank.bca + (dataLama.nominal + dataLama.feeTotal),
                        //                 [(bankCodeTujuan === '011') ? 'danamon' : 'bifast']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total)
                        //             })
                        //         }
                        //     } else {
                        //         if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                        //             setAlertSaldo(true)
                        //             return
                        //         } else {
                        //             setAlertSaldo(false)
                        //             setSisaSaldoAlokasiPerBank({
                        //                 ...sisaSaldoAlokasiPerBank,
                        //                 bca: sisaSaldoAlokasiPerBank.bca + (dataLama.nominal + dataLama.feeTotal),
                        //                 [(bankCodeTujuan === '011') ? 'danamon' : 'bifast']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance)) - (Number(nominal) + result.fee_total)
                        //             })
                        //         }
                        //     }
                        // } else if (dataLama.bankCodeTujuan === '011') {
                        //     if (bankCodeTujuan === "014") {
                        //         if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                        //             setAlertSaldo(true)
                        //             return
                        //         } else {
                        //             setAlertSaldo(false)
                        //             setSisaSaldoAlokasiPerBank({
                        //                 ...sisaSaldoAlokasiPerBank,
                        //                 danamon: sisaSaldoAlokasiPerBank.danamon + (dataLama.nominal + dataLama.feeTotal),
                        //                 [(bankCodeTujuan === '014') ? 'bca' : 'bifast']: ((bankCodeTujuan === '014') ? (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total)
                        //             })
                        //         }
                        //     } else {
                        //         if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                        //             setAlertSaldo(true)
                        //             return
                        //         } else {
                        //             setAlertSaldo(false)
                        //             setSisaSaldoAlokasiPerBank({
                        //                 ...sisaSaldoAlokasiPerBank,
                        //                 danamon: sisaSaldoAlokasiPerBank.danamon + (dataLama.nominal + dataLama.feeTotal),
                        //                 [(bankCodeTujuan === '014') ? 'bca' : 'bifast']: ((bankCodeTujuan === '014') ? (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total)
                        //             })
                        //         }
                        //     }
                        // } else {
                        //     if (bankCodeTujuan === "014") {
                        //         if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                        //             setAlertSaldo(true)
                        //             return
                        //         } else {
                        //             setAlertSaldo(false)
                        //             setSisaSaldoAlokasiPerBank({
                        //                 ...sisaSaldoAlokasiPerBank,
                        //                 bifast: sisaSaldoAlokasiPerBank.bifast + (dataLama.nominal + dataLama.feeTotal),
                        //                 [(bankCodeTujuan === '011') ? 'danamon' : 'bca']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total)
                        //             })
                        //         }
                        //     } else {
                        //         if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                        //             setAlertSaldo(true)
                        //             return
                        //         } else {
                        //             setAlertSaldo(false)
                        //             setSisaSaldoAlokasiPerBank({
                        //                 ...sisaSaldoAlokasiPerBank,
                        //                 bifast: sisaSaldoAlokasiPerBank.bifast + (dataLama.nominal + dataLama.feeTotal),
                        //                 [(bankCodeTujuan === '011') ? 'danamon' : 'bca']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total)
                        //             })
                        //         }
                        //     }
                        // }
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
        allBalance,
        allHoldBalance,
        bankFee
    ) {
        let alertCount = 0
        if (bankNameTujuan.length === 0 && bankCodeTujuan.length === 0) {
            setAlertSaldo(false)
            setAlertMinSaldo(false)
            setAlertMaxSaldo(false)
            setAlertBankTujuan(true)
            alertCount++
        } else {
            bankFee.forEach(item => {
                if (bankCodeTujuan === "014" && item.mpaytype_bank_code === "014") {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(nominal) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount++
                    } else if (Number(nominal) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                        alertCount++
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount = 0
                    }
                } else if (bankCodeTujuan === "011" && item.mpaytype_bank_code === "011") {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(nominal) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount++
                    } else if (Number(nominal) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                        alertCount++
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount = 0
                    }
                } else if ((bankCodeTujuan !== "014" && bankCodeTujuan !== "011") && (item.mpaytype_bank_code !== "014" && item.mpaytype_bank_code !== "011")) {
                    setMinMaxDisbursement({
                        ...minMaxDisbursement,
                        minDisbursement: item.mpartfitur_min_amount_trx,
                        maxDisbursement: item.mpartfitur_max_amount_trx
                    })
                    if (Number(nominal) < item.mpartfitur_min_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(true) // kena minimal nominal transaksi
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount++
                    } else if (Number(nominal) > item.mpartfitur_max_amount_trx) {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(true) // kena maksimal nominal transaksi
                        setAlertBankTujuan(false)
                        alertCount++
                    } else {
                        setAlertSaldo(false)
                        setAlertMinSaldo(false)
                        setAlertMaxSaldo(false)
                        setAlertBankTujuan(false)
                        alertCount = 0
                    }
                }
            })
        }
        if (emailPenerima.length !== 0 && validator.isEmail(emailPenerima) === false) {
            setErrMsgEmail(true)
            alertCount++
            return
        }
        if ((cabang.length !== 0 && (cabang.trim().length === 0)) || (cabang.length !== 0 && (cabang.toLowerCase() === cabang.toUpperCase()))) {
            setAlertNotValid(true)
            alertCount++
            return
        } else {
            setAlertNotValid(false)
        }
        // if (bankCodeTujuan !== "014") {
        // } else {
        //     setAlertNotValid(false)
        // }
        // const balanceBank = balanceDetail.find((item) => {
        //     if (bankCodeTujuan === "011") {
        //         return item.channel_id === bankCodeTujuan
        //     } else {
        //         bankCodeTujuan = "BIF"
        //         return item.channel_id === bankCodeTujuan
        //     }
        // })
        // let sisaAllSaldoTemp = 0
        if (alertCount === 0) {
            if (nominal <= allBalance) {
                setAlertSaldo(false)

                const finding = dataDisburse.findIndex((object) => {
                    return object.number === number
                })
                const result = feeBank.find((item) => {
                    if (bankCodeTujuan === item.mpaytype_bank_code) {
                        console.log("masuk 1");
                        return item.mpaytype_bank_code === bankCodeTujuan
                    } else {
                        console.log("masuk 2");
                        bankCodeTujuan = "BIF"
                        return item.mpaytype_bank_code === bankCodeTujuan
                    }
                    // if (bankCodeTujuan === "011") {
                    //     return item.mpaytype_bank_code === bankCodeTujuan
                    // } else {
                    //     bankCodeTujuan = "BIF"
                    //     return item.mpaytype_bank_code === bankCodeTujuan
                    // }
                })
                const dataLama = dataDisburse.find((item) => item.number === number);


                if (dataLama.bankCodeTujuan === bankCodeTujuan || bankCodeTujuan === 'BIF') {
                    if (Number(sisaAllSaldoTempManual) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                        setAlertSaldo(true)
                        return
                    } else {
                        setAlertSaldo(false)
                        setSisaAllSaldoTempManual(Number(sisaAllSaldoTempManual) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total))
                        // setSisaSaldoAlokasiPerBank({
                        //     ...sisaSaldoAlokasiPerBank,
                        //     [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                        // })
                    }
                    // if (bankCodeTujuan === '014') {
                    //     if (Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                    //         setAlertSaldo(true)
                    //         return
                    //     } else {
                    //         setAlertSaldo(false)
                    //         setSisaSaldoAlokasiPerBank({
                    //             ...sisaSaldoAlokasiPerBank,
                    //             [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                    //         })
                    //     }
                    // } else if (bankCodeTujuan === "011") {
                    //     if (Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                    //         setAlertSaldo(true)
                    //         return
                    //     } else {
                    //         setAlertSaldo(false)
                    //         setSisaSaldoAlokasiPerBank({
                    //             ...sisaSaldoAlokasiPerBank,
                    //             [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                    //         })
                    //     }
                    // } else {
                    //     if (Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) < 0) {
                    //         setAlertSaldo(true)
                    //         return
                    //     } else {
                    //         setAlertSaldo(false)
                    //         setSisaSaldoAlokasiPerBank({
                    //             ...sisaSaldoAlokasiPerBank,
                    //             [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total)
                    //         })
                    //     }
                    // }
                } else {
                    if ((sisaAllSaldoTempManual !== 0 ? (sisaAllSaldoTempManual + Number(dataLama.nominal + dataLama.feeTotal)) : allBalance - allHoldBalance) - (Number(nominal) + result.fee_total) < 0) {
                        setAlertSaldo(true)
                        return
                    } else {
                        setAlertSaldo(false)
                        setSisaAllSaldoTempManual(Number(sisaAllSaldoTempManual) + Number(dataLama.nominal + dataLama.feeTotal) - (Number(nominal) + result.fee_total))
                        // setSisaSaldoAlokasiPerBank({
                        //     ...sisaSaldoAlokasiPerBank,
                        //     bca: sisaSaldoAlokasiPerBank.bca + (dataLama.nominal + dataLama.feeTotal),
                        //     [(bankCodeTujuan === '011') ? 'danamon' : 'bifast']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total)
                        // })
                    }
                    // if (dataLama.bankCodeTujuan === '014') {
                    //     if (bankCodeTujuan === "011") {
                    //         if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                    //             setAlertSaldo(true)
                    //             return
                    //         } else {
                    //             setAlertSaldo(false)
                    //             setSisaSaldoAlokasiPerBank({
                    //                 ...sisaSaldoAlokasiPerBank,
                    //                 bca: sisaSaldoAlokasiPerBank.bca + (dataLama.nominal + dataLama.feeTotal),
                    //                 [(bankCodeTujuan === '011') ? 'danamon' : 'bifast']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance)) - (Number(nominal) + result.fee_total)
                    //             })
                    //         }
                    //     } else {
                    //         if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                    //             setAlertSaldo(true)
                    //             return
                    //         } else {
                    //             setAlertSaldo(false)
                    //             setSisaSaldoAlokasiPerBank({
                    //                 ...sisaSaldoAlokasiPerBank,
                    //                 bca: sisaSaldoAlokasiPerBank.bca + (dataLama.nominal + dataLama.feeTotal),
                    //                 [(bankCodeTujuan === '011') ? 'danamon' : 'bifast']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total)
                    //             })
                    //         }
                    //     }
                    // } else if (dataLama.bankCodeTujuan === '011') {
                    //     if (bankCodeTujuan === "014") {
                    //         if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                    //             setAlertSaldo(true)
                    //             return
                    //         } else {
                    //             setAlertSaldo(false)
                    //             setSisaSaldoAlokasiPerBank({
                    //                 ...sisaSaldoAlokasiPerBank,
                    //                 danamon: sisaSaldoAlokasiPerBank.danamon + (dataLama.nominal + dataLama.feeTotal),
                    //                 [(bankCodeTujuan === '014') ? 'bca' : 'bifast']: ((bankCodeTujuan === '014') ? (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total)
                    //             })
                    //         }
                    //     } else {
                    //         if ((sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                    //             setAlertSaldo(true)
                    //             return
                    //         } else {
                    //             setAlertSaldo(false)
                    //             setSisaSaldoAlokasiPerBank({
                    //                 ...sisaSaldoAlokasiPerBank,
                    //                 danamon: sisaSaldoAlokasiPerBank.danamon + (dataLama.nominal + dataLama.feeTotal),
                    //                 [(bankCodeTujuan === '014') ? 'bca' : 'bifast']: ((bankCodeTujuan === '014') ? (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bifast !== 0 ? sisaSaldoAlokasiPerBank.bifast : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total)
                    //             })
                    //         }
                    //     }
                    // } else {
                    //     if (bankCodeTujuan === "014") {
                    //         if ((sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                    //             setAlertSaldo(true)
                    //             return
                    //         } else {
                    //             setAlertSaldo(false)
                    //             setSisaSaldoAlokasiPerBank({
                    //                 ...sisaSaldoAlokasiPerBank,
                    //                 bifast: sisaSaldoAlokasiPerBank.bifast + (dataLama.nominal + dataLama.feeTotal),
                    //                 [(bankCodeTujuan === '011') ? 'danamon' : 'bca']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total)
                    //             })
                    //         }
                    //     } else {
                    //         if ((sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) - (Number(nominal) + result.fee_total) < 0) {
                    //             setAlertSaldo(true)
                    //             return
                    //         } else {
                    //             setAlertSaldo(false)
                    //             setSisaSaldoAlokasiPerBank({
                    //                 ...sisaSaldoAlokasiPerBank,
                    //                 bifast: sisaSaldoAlokasiPerBank.bifast + (dataLama.nominal + dataLama.feeTotal),
                    //                 [(bankCodeTujuan === '011') ? 'danamon' : 'bca']: ((bankCodeTujuan === '011') ? (sisaSaldoAlokasiPerBank.danamon !== 0 ? sisaSaldoAlokasiPerBank.danamon : balanceBank.mpartballchannel_balance - balanceBank.hold_balance) : (sisaSaldoAlokasiPerBank.bca !== 0 ? sisaSaldoAlokasiPerBank.bca : balanceBank.mpartballchannel_balance - balanceBank.hold_balance)) - (Number(nominal) + result.fee_total)
                    //             })
                    //         }
                    //     }
                    // }
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
        setSisaAllSaldoTempManual(Number(sisaAllSaldoTempManual) + Number(dataLama.nominal + dataLama.feeTotal))
        // setSisaSaldoAlokasiPerBank({
        //     ...sisaSaldoAlokasiPerBank,
        //     [(dataLama.bankCodeTujuan === '014') ? 'bca' : (dataLama.bankCodeTujuan === '011') ? 'danamon' : 'bifast']: (dataLama.bankCodeTujuan === '014') ? Number(sisaSaldoAlokasiPerBank.bca) + Number(dataLama.nominal + dataLama.feeTotal) : (dataLama.bankCodeTujuan === '011') ? Number(sisaSaldoAlokasiPerBank.danamon) + Number(dataLama.nominal + dataLama.feeTotal) : Number(sisaSaldoAlokasiPerBank.bifast) + Number(dataLama.nominal + dataLama.feeTotal)
        // })
    }

    function createDataDisburseExcel (dataDisburse, isDisburseManual, dataBulkOrigin) {
        // console.log(isDisburseManual, '!isDisbursementManual');
        // console.log(dataBulkOrigin, 'dataBulkOrigin');
        let dataExcel = []
        for (let i = 0; i < dataDisburse.length; i++) {
            // dataExcel.push({"bank_code": (isDisburseManual === true ? dataDisburse[i].bankCodeTujuan : dataDisburse[i].bankCode), "branch_name": (isDisburseManual === true ? dataDisburse[i].cabang : dataDisburse[i].cabangBank), "account_number": (isDisburseManual === true ? dataDisburse[i].noRek : dataDisburse[i].noRekening), "account_name": (isDisburseManual === true ? dataDisburse[i].nameRek : dataDisburse[i].ownerName), "amount": (isDisburseManual === true ? dataDisburse[i].nominal : dataDisburse[i].nominalDisbursement), "email": (isDisburseManual === true ? dataDisburse[i].emailPenerima : dataDisburse[i].email), "description": (isDisburseManual === true ? dataDisburse[i].catatan : dataDisburse[i].note), "save_account_number": (isDisburseManual === true ? dataDisburse[i].saveAcc : false)}) //untuk csv
            dataExcel.push({"bank_code": (isDisburseManual === true ? dataDisburse[i].bankCodeTujuan : dataDisburse[i][(language === null ? eng.bankTujuanStar : language.bankTujuanStar)].slice(0, 3)), "branch_name": (isDisburseManual === true ? dataDisburse[i].cabang : dataDisburse[i][(language === null ? eng.cabangStar : language.cabangStar)]), "account_number": (isDisburseManual === true ? dataDisburse[i].noRek : dataDisburse[i][(language === null ? eng.noRekTujuanStar : language.noRekTujuanStar)]), "account_name": (isDisburseManual === true ? dataDisburse[i].nameRek : dataDisburse[i][(language === null ? eng.namaPemilikRekStar : language.namaPemilikRekStar)]), "amount": (isDisburseManual === true ? dataDisburse[i].nominal : dataDisburse[i][(language === null ? eng.nominalDisburseStar : language.nominalDisburseStar)]), "email": (isDisburseManual === true ? dataDisburse[i].emailPenerima : dataDisburse[i][(language === null ? eng.emailPenerima : language.emailPenerima)]), "description": (isDisburseManual === true ? dataDisburse[i].catatan : dataDisburse[i][(language === null ? eng.catatan : language.catatan)]), "save_account_number": (isDisburseManual === true ? dataDisburse[i].saveAcc : false), invalid_account_id: 0})
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

    async function sendDataDisburse (data, dataOrigin, isDisburseManual, fileNameBulk) {
        try {
            // console.log(data, "data");
            // console.log(dataOrigin, "dataOrigin");
            setIsLoadingDisburseMentConfirm(true)
            setIsDisableChecked(true)
            setIsCheckedConfirm(false)
            const auth = "Bearer " + getToken()
            var formData = new FormData()
            formData.append('file_excel', data, isDisburseManual ? "--.xlsx" : fileNameBulk)
            formData.append('file_excel', (isDisburseManual ? data : dataOrigin),  isDisburseManual ? "--.xlsx" : `data_ori_${fileNameBulk}`)
            formData.append('file_ID', isDisburseManual ? 1 : 2)
            const headers = {
                'Content-Type':'multipart/form-data',
                'Authorization' : auth
            }
            const dataSendHandler = await axios.post(BaseURL + "/Partner/UploadDisbursementFile", formData, {headers: headers})
            // console.log(dataSendHandler, 'dataSendHandler');
            if (dataSendHandler.data.response_code === 200 && dataSendHandler.status === 200 && dataSendHandler.data.response_new_token.length === 0) {
                setShowModalConfirm(false)
                setDataDisburse([])
                setDataFromUploadExcel([])
                setAllNominal([])
                setAllFee([])
                setLabelUpload(`<div class='py-4 mb-2 style-label-drag-drop text-center'>${language === null ? eng.letakkanFile : language.letakkanFile}</div>
                <div className='pb-4'>
                    <span class="filepond--label-action">
                        ${language === null ? eng.unggahFile : language.unggahFile}
                    </span>
                </div>`)
                setIsLoadingDisburseMentConfirm(false)
                setShowModalStatusDisburse(true)
                setResponMsg(dataSendHandler.data.response_data.status_id)
                setIsLoadingDisburseMentConfirm(false)
                setIsDisableChecked(false)
                setTimeout(() => {
                    setShowModalStatusDisburse(false)
                }, 10000);
            } else if (dataSendHandler.data.response_code === 200 && dataSendHandler.status === 200 && dataSendHandler.data.response_new_token.length !== 0) {
                sessionStorage(dataSendHandler.data.response_new_token)
                setShowModalConfirm(false)
                setDataDisburse([])
                setDataFromUploadExcel([])
                setAllNominal([])
                setAllFee([])
                setLabelUpload(`<div class='py-4 mb-2 style-label-drag-drop text-center'>${language === null ? eng.letakkanFile : language.letakkanFile}</div>
                <div className='pb-4'>
                    <span class="filepond--label-action">
                        ${language === null ? eng.unggahFile : language.unggahFile}
                    </span>
                </div>`)
                setIsLoadingDisburseMentConfirm(false)
                setShowModalStatusDisburse(true)
                setResponMsg(dataSendHandler.data.response_data.status_id)
                setIsLoadingDisburseMentConfirm(false)
                setIsDisableChecked(false)
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
        // history.push(language === null ? '/Riwayat Transaksi/disbursement' : language.flagName === "ID" ? '/Riwayat Transaksi/disbursement' : language.flagName === "EN" ? '/Transaction Report/disbursement' : "/历史交易/disbursement")
        history.push('/riwayat-transaksi/disbursement')
    }

    function pindahHalaman (param) {
        if (param === "manual") {
            if ((dataFromUpload.length !== 0 || dataFromUploadExcel.length !== 0) || errorFound.length !== 0 || labelUpload === `<div class='py-4 mb-2 style-label-drag-drop'>Pilih atau letakkan file Excel (*.csv) kamu di sini. <br/> Pastikan file Excel sudah benar, file yang sudah di-upload dan di-disburse tidak bisa kamu batalkan.</div>
            <div className='pb-4'>
                <span class="filepond--label-action">
                    ${language === null ? eng.gantiFile : language.gantiFile}
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
            setLabelUpload(`<div class='py-4 mb-2 style-label-drag-drop'>${language === null ? eng.letakkanFileWithCsv : language.letakkanFileWithCsv}</div>
            <div className='pb-4'>
                <span class="filepond--label-action">
                    ${language === null ? eng.uploadFile : language.uploadFile}
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
        if (!access_token) {
            history.push('/login');
        }
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
                        <Toast.Body className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>{language === null ? eng.disburseSedangDiproses : language.disburseSedangDiproses} <span style={{ textDecoration: 'underline', cursor: "pointer" }} onClick={() => toReportDisburse()}>{language === null ? eng.lihatRiwayatDisburse : language.lihatRiwayatDisburse}</span></Toast.Body>
                    </Toast>
                </div>
            }
            <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
                <span className='breadcrumbs-span'>{ user_role === "102" ? <Link style={{ cursor: "pointer" }} to={"/riwayat-transaksi/va-dan-paylink"}> {language === null ? eng.laporan : language.laporan}</Link> : <Link style={{ cursor: "pointer" }} to={"/"}>Beranda</Link> }  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;{language === null ? eng.disbursement : language.disbursement}</span>
                {/* <Row className='mt-1'>
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
                </Row> */}
                <div className='detail-akun-menu mt-5' style={{display: 'flex', height: 33}}>
                    <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => pindahHalaman("manual")} id="detailakuntab">
                        <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">{language === null ? eng.disbursementManual : language.disbursementManual}</span>
                    </div>
                    <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("bulk")} id="konfigurasitab">
                        <span className='menu-detail-akun-span' id="konfigurasispan">{language === null ? eng.disbursementBulk : language.disbursementBulk}</span>
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
                                    <div className='ms-2'>{language === null ? eng.descManualDisburse : language.descManualDisburse}</div>
                                </div>
                                <div className='pt-4'>
                                    <Row className='align-items-center' style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                            {language === null ? eng.pilihBankTujuan : language.pilihBankTujuan} <span style={{ color: "red" }}>*</span>
                                        </Col>
                                        <Col xs={10} style={{ cursor: "pointer" }} className="position-relative d-flex justify-content-between align-items-center" onClick={() => setShowBank(true)}>
                                            <input
                                                placeholder={language === null ? eng.pilihBank : language.pilihBank}
                                                className='input-text-user'
                                                type='text'
                                                disabled
                                                name="bankName"
                                                value={inputData.bankName}
                                                style={{ cursor: "pointer",  backgroundColor: "#FFFFFF", display: "inline-block" }}
                                            />
                                            <div className="position-absolute right-0 left-0 top-0 bottom-0" ></div>
                                            <div className="position-absolute right-4" ><img src={chevron} alt="time" /></div>
                                        </Col>
                                    </Row>
                                    <Row className='mb-3 mt-1' style={{ padding: 'unset' }}>
                                        <Col xs={2}></Col>
                                        <Col xs={10}>
                                            <div style={{ fontFamily:'Nunito', fontSize: 12, color: "#888888"}} className='d-flex justify-content-start align-items-center'>
                                                <span className='me-1'><img src={noteIconGrey} alt='icon error' /></span>
                                                 {language === null ? eng.descBankTujuan : language.descBankTujuan}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className={alertNotValid === true ? `mb-1 align-items-center` : `mb-4 align-items-center`} style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                            {language === null ? eng.cabangKhususNonBca : language.cabangKhususNonBca} <span style={{ color: "red" }}>*</span>
                                        </Col>
                                        <Col xs={10}>
                                            <Form.Control
                                                placeholder={language === null ? eng.placeholderCabangBank : language.placeholderCabangBank}
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
                                                        {language === null ? eng.dataTidakValid : language.dataTidakValid}
                                                    </div>
                                                </Col>
                                            </Row>
                                        ) : ""
                                    }
                                    <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                            {language === null ? eng.noRekTujuan : language.noRekTujuan} <span style={{ color: "red" }}>*</span>
                                        </Col>
                                        <Col xs={10}>
                                            <Form.Control
                                                placeholder={language === null ? eng.placeholderNoRekTujuan : language.placeholderNoRekTujuan}
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
                                            {language === null ? eng.namaPemilikRek : language.namaPemilikRek} <span style={{ color: "red" }}>*</span>
                                        </Col>
                                        <Col xs={10}>
                                            <Form.Control
                                                placeholder={language === null ? eng.placeholderNamaPemilikRek : language.placeholderNamaPemilikRek}
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
                                                        label={language === null ? eng.simpanKeDaftarRek : language.simpanKeDaftarRek}
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
                                                        {language === null ? eng.lihatDaftarRek : language.lihatDaftarRek}
                                                    </button>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='align-items-center' style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                            {language === null ? eng.nominalDisburse : language.nominalDisburse} <span style={{ color: "red" }}>*</span>
                                        </Col>
                                        <Col xs={10}>
                                            <CurrencyInput
                                                className='input-text-user'
                                                value={inputHandle.nominal === undefined ? 0 : inputHandle.nominal}
                                                onValueChange={(e) => handleChangeNominal(e, feeBank, inputData, listBank)}
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
                                                        {/* Saldo Alokasi di {(inputData.bankCode === '014') ? inputData.bankName : (inputData.bankCode === '011') ? inputData.bankName :  `"Other Bank"`} tidak cukup */}
                                                        {language === null ? eng.saldoAndaTidakCukup : language.saldoAndaTidakCukup}
                                                    </div>
                                                ) :
                                                alertMinSaldo === true ? (
                                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B"}} className='text-start'>
                                                        <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                        {language === null ? eng.descMinimalDisburse : language.descMinimalDisburse} {convertToRupiah(minMaxDisbursement.minDisbursement)}
                                                    </div>
                                                ) :
                                                alertMaxSaldo === true ? (
                                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B"}} className='text-start'>
                                                        <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                        {language === null ? eng.maksimalDisburse : language.maksimalDisburse} {convertToRupiah(minMaxDisbursement.maxDisbursement)}
                                                    </div>
                                                ) :
                                                alertBankTujuan === true ? (
                                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B"}} className='text-start'>
                                                        <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                        {language === null ? eng.descPilihTujuanBank : language.descPilihTujuanBank}
                                                    </div>
                                                ) : (
                                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#888888"}} className='text-start'>
                                                        <span className='me-1'><img src={noteInfo} alt='icon info' /></span>
                                                        {language === null ? eng.descNominalDisburse : language.descNominalDisburse}
                                                    </div>
                                                )
                                            }
                                        </Col>
                                    </Row>
                                    <Row className='mb-3 align-items-center' style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                            <span style={{ fontFamily: "Nunito" }}>
                                                {language === null ? eng.emailPenerima : language.emailPenerima}
                                            </span>
                                        </Col>
                                        <Col xs={10}>
                                            <Form.Control
                                                placeholder={language === null ? eng.placeholderEmailPenerima : language.placeholderEmailPenerima}
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
                                                    {language === null ? eng.formatEmail : language.formatEmail}
                                                </div>
                                            }
                                        </Col>
                                    </Row>
                                    <Row className='mb-4 align-items-center' style={{ fontSize: 14 }}>
                                        <Col xs={2} style={{ fontFamily: 'Nunito' }}>
                                            <span style={{ fontFamily: "Nunito" }}>
                                                {language === null ? eng.catatan : language.catatan}
                                            </span>
                                        </Col>
                                        <Col xs={10}>
                                            <textarea
                                                className='input-text-disburs'
                                                placeholder={language === null ? eng.placeholderCatatan : language.placeholderCatatan}
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
                                                        isChecked,
                                                        getBalance,
                                                        totalHoldBalance,
                                                        feeBank
                                                    )}
                                                    className={
                                                        (inputData.bankName.length !== 0 && inputData.bankCode.length !== 0 && inputHandle.bankCabang.length !== 0 && inputRekening.bankNameRek.length !== 0 && inputRekening.bankNumberRek.length !== 0 && Number(inputHandle.nominal) !== 0 && Number(inputHandle.nominal) >= minMaxDisbursement.minDisbursement && Number(inputHandle.nominal) <= minMaxDisbursement.maxDisbursement && dataDisburse.length < 10) ? 'btn-ez-disbursement' : 'btn-disbursement-reset'
                                                    }
                                                    disabled={
                                                        (inputData.bankName.length === 0 || inputData.bankCode.length === 0 || inputHandle.bankCabang.length === 0 || inputRekening.bankNameRek.length === 0 || inputRekening.bankNumberRek.length === 0 || Number(inputHandle.nominal) === 0 || Number(inputHandle.nominal) < minMaxDisbursement.minDisbursement || Number(inputHandle.nominal) > minMaxDisbursement.maxDisbursement || dataDisburse.length >= 10)
                                                    }
                                                    style={{ width: "40%" }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                        style={{ marginRight: 10 }}
                                                    />{" "}
                                                    {language === null ? eng.tambahTujuanDisburse : language.tambahTujuanDisburse}
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
                                                            {language === null ? eng.batal : language.batal}
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
                                                                dataDisburse,
                                                                getBalance,
                                                                totalHoldBalance,
                                                                feeBank
                                                            )}
                                                            className={
                                                                (inputData.bankName.length !== 0 && inputData.bankCode.length !== 0 && inputHandle.bankCabang.length !== 0 && inputRekening.bankNameRek.length !== 0 && inputRekening.bankNumberRek.length !== 0 && Number(inputHandle.nominal) !== 0 && Number(inputHandle.nominal) >= minMaxDisbursement.minDisbursement && Number(inputHandle.nominal) <= minMaxDisbursement.maxDisbursement && dataDisburse.length <= 10) ? 'btn-edit-disbursement' : 'btn-editno-disbursement'
                                                            }
                                                            disabled={
                                                                (inputData.bankName.length === 0 || inputData.bankCode.length === 0 || inputHandle.bankCabang.length === 0 || inputRekening.bankNameRek.length === 0 || inputRekening.bankNumberRek.length === 0 || Number(inputHandle.nominal) === 0 || Number(inputHandle.nominal) < minMaxDisbursement.minDisbursement || Number(inputHandle.nominal) > minMaxDisbursement.maxDisbursement || dataDisburse.length > 10)
                                                            }
                                                        >
                                                            {language === null ? eng.simpan : language.simpan}
                                                        </button>
                                                    </div>
                                                </div>
                                            }
                                        </Col>
                                    </Row>
                                    {
                                        dataDisburse.length !== 0 ?
                                        <div className='scroll-confirm' style={{ overflowX: 'auto', maxWidth: 'inherit' }}>
                                            <table
                                                className="table mt-5"
                                                id="tableInvoice"
                                                hover
                                            >
                                                <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                    <tr
                                                        className='ms-3'
                                                    >
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.no : language.no}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.bankTujuan : language.bankTujuan}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.cabang : language.cabang}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.noRekTujuan : language.noRekTujuan}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.namaPemilikRek : language.namaPemilikRek}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.nominalDisburse : language.nominalDisburse}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.emailPenerima : language.emailPenerima}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.catatan : language.catatan}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.aksi : language.aksi}</th>
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
                                        <div className='scroll-confirm' style={{ overflowX: 'auto', maxWidth: 'inherit' }}>
                                            <table
                                                className="table text-center mt-5"
                                                id="tableInvoice"
                                                hover
                                            >
                                                <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                    <tr

                                                    >
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.no : language.no}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.bankTujuan : language.bankTujuan}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.cabang : language.cabang}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.noRekTujuan : language.noRekTujuan}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.namaPemilikRek : language.namaPemilikRek}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.nominalDisburse : language.nominalDisburse}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.emailPenerima : language.emailPenerima}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.catatan : language.catatan}</th>
                                                        <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.aksi : language.aksi}</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            <div className='text-center pb-3'>{language === null ? eng.belumAdaDataDisburse : language.belumAdaDataDisburse}</div>
                                        </div>
                                    }

                                    <div className='sub-base-content-disburse mt-5'>
                                        <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{language === null ? eng.ringkasan : language.ringkasan}</div>
                                        <div className='d-flex justify-content-between align-items-center mt-3'>
                                            <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>{language === null ? eng.totalDisburse : language.totalDisburse}</div>
                                            <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(sum(allNominal), true, 2)}</div>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center mt-2'>
                                            <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>{language === null ? eng.totalFeeDisbursePlusTax : language.totalFeeDisbursePlusTax}</div>
                                            <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(sum(allFee), true, 2)}</div>
                                        </div>
                                        <div className='mt-2' style={{ border: "1px dashed #C4C4C4" }}></div>
                                        <div className='d-flex justify-content-between align-items-center mt-3' style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>
                                            <div>{language === null ? eng.totalDisbursePlusFee : language.totalDisbursePlusFee}</div>
                                            <div>{convertToRupiah((sum(allNominal) + sum(allFee)), true, 2)}</div>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-between align-items-center mt-3'>
                                        <div style={{ fontFamily: 'Nunito' }}>
                                            <div style={{ fontSize: 14, color: '#383838' }}>{language === null ? eng.sisaSaldoTersedia : language.sisaSaldoTersedia}</div>
                                            <div style={{ fontSize: 12, color: '#888888' }}>{language === null ? eng.descTerhitung : language.descTerhitung}</div>
                                        </div>
                                        {
                                            Number(((getBalance) - (totalHoldBalance)) - (sum(allNominal) + sum(allFee))) < 0  ?
                                            <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B", width: 250 }} className='text-end'>
                                                <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                                Saldo Anda tidak cukup, Topup saldo terlebih dahulu sebelum melakukan disbursement
                                            </div> :
                                            <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(Number(((getBalance) - (totalHoldBalance)) - (sum(allNominal) + sum(allFee))), true, 2)}</div>
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
                                {language === null ? eng.lakukanDisburse : language.lakukanDisburse}
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
                                {language === null ? eng.daftarBank : language.daftarBank}
                            </Modal.Title>
                            <Modal.Body>
                                <div className="div-table mt-3">
                                    <div style={{ fontFamily: 'Nunito', fontSize: 14}}>{language === null ? eng.cariDaftarBank : language.cariDaftarBank}</div>
                                    <div className="d-flex justify-content-between align-items-center position-relative mt-2 mb-3" style={{width: "100%"}}>
                                        <div className="position-absolute left-3 px-1"><img src={search} alt="search" /></div>
                                        <FormControl
                                            className="ps-5"
                                            id="search"
                                            type="text"
                                            placeholder={language === null ? eng.placeholderDaftarBank : language.placeholderDaftarBank}
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
                                                    <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo', width: 10 }}>{language === null ? eng.no : language.no}</th>
                                                    <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo', width: 50 }}>{language === null ? eng.namaBank : language.namaBank}</th>
                                                    <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo', width: 80 }}>{language === null ? eng.kodeBank : language.kodeBank}</th>
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
                                        {language === null ? eng.batal : language.batal}
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
                                {language === null ? eng.daftarRekening : language.daftarRekening}
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
                                        noDataComponent={<div className='mt-3'>{language === null ? eng.tidakAdaData : language.tidakAdaData}</div>}
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
                                        {language === null ? eng.batal : language.batal}
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
                                    <div style={{ fontFamily: 'Nunito', fontSize: 14 }}>{language === null ? eng.descSubDisburseBulk : language.descSubDisburseBulk}<span onClick={() => setShowModalPanduan(true)} style={{ textDecoration: 'underline', fontFamily: 'Exo', fontWeight: 700, fontSize: 14, color: '#077E86', cursor: 'pointer' }}> {language === null ? eng.lihatPanduan : language.lihatPanduan}</span></div>
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
                                                fontSize: 14,
                                                width: "15rem"
                                            }}
                                        >
                                            <span className='me-2'><img src={saveIcon} alt="save icon"/></span>
                                            <a href={language === null ? templateBulkXLSX : (language.flagName === "ID" ? templateBulkXLSX : language.flagName === "EN" ? templateBulkXLSXInggris : templateBulkXLSXChina)} download style={{ color: '#077E86' }}>
                                                {language === null ? eng.unduhTemplate : language.unduhTemplate}
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
                                                        <div>{language === null ? eng.kesalahanDataPerluDiperbaiki : language.kesalahanDataPerluDiperbaiki} :</div>
                                                        <FontAwesomeIcon style={{ width: 5, marginTop: 3 }} icon={faCircle} /> {`${language === null ? eng.dataPadaBarisKe : language.dataPadaBarisKe} ${errorFound[0].no} ${language === null ? eng.barisKe : language.barisKe} : ${errorFound[0].keterangan}`}
                                                        <div onClick={() => openErrorListModal(errorFound)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{language === null ? eng.lihatSemua : language.lihatSemua}</div>
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
                                                        <div>{language === null ? eng.kesalahanDataPerluDiperbaiki : language.kesalahanDataPerluDiperbaiki} :</div>
                                                        <FontAwesomeIcon style={{ width: 5, marginTop: 3 }} icon={faCircle} /> {`${language === null ? eng.dataPadaBarisKe : language.dataPadaBarisKe} ${errorFound[0].no} ${language === null ? eng.barisKe : language.barisKe} : ${errorFound[0].keterangan}`}
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
                                        onupdatefiles={(newFile) => fileCSV(newFile, listBank, balanceDetail, feeBank, getBalance, totalHoldBalance)}
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
                                        noDataComponent={<div style={{ marginBottom: 10 }}>{language === null ? eng.belumAdaDataDisburse : language.belumAdaDataDisburse}</div>}
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
                                    {language === null ? eng.lakukanDisburse : language.lakukanDisburse}
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
                                    {language === null ? eng.panduanPengisianDisburseBulk : language.panduanPengisianDisburseBulk}
                                </Modal.Title>
                                <Modal.Body className='px-4'>
                                    <div style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }} className='d-flex justify-content-center align-items-center'>
                                        <img src={noteInfo} width="25" height="25" alt="circle_info" style={{ marginRight: 10 }} />
                                        <span>{language === null ? eng.descPanduanDisburseBulk : language.descPanduanDisburseBulk}</span>
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
                                            <td style={{ padding: 0 }}>{language === null ? eng.panduan1 : language.panduan1}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>2.</td>
                                            <td style={{ padding: 0 }}>{language === null ? eng.panduan2 : language.panduan2}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>3.</td>
                                            <td style={{ padding: 0 }}>{language === null ? eng.panduan3 : language.panduan3}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>4.</td>
                                            <td style={{ padding: 0 }}>{language === null ? eng.panduan4 : language.panduan4}<a href={language === null ? daftarBank : language.flagName === "ID" ? daftarBank : language.flagName === "EN" ? daftarBankInggris : daftarBankChina} download style={{ color:"#077E86", textDecoration: "underline" }}>{language === null ? eng.daftarBankTujuan : language.daftarBankTujuan}</a></td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>5.</td>
                                            <td style={{ padding: 0 }}>{language === null ? eng.panduan5 : language.panduan5}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>6.</td>
                                            <td style={{ padding: 0 }}>{language === null ? eng.panduan6 : language.panduan6}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>7.</td>
                                            <td style={{ padding: 0 }}>{language === null ? eng.panduan7 : language.panduan7}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>8.</td>
                                            <td style={{ padding: 0 }}>{language === null ? eng.panduan8 : language.panduan8}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>9.</td>
                                            <td style={{ padding: 0 }}>{language === null ? eng.panduan9 : language.panduan9}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>10.</td>
                                            <td style={{ padding: 0 }}>{language === null ? eng.panduan10 : language.panduan10}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginRight: 5, padding: 0 }}>11.</td>
                                            <td style={{ padding: 0 }}>{language === null ? eng.panduan11 : language.panduan11}</td>
                                        </tr>
                                    </table>
                                    <div className='text-center my-3'>
                                        <button
                                            onClick={() => setShowModalPanduan(false)}
                                            className='btn-ez-transfer'
                                            style={{ width: '25%' }}
                                        >
                                            {language === null ? eng.mengerti : language.mengerti}
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
                                    {language === null ? eng.kesalahanDataPerluDiperbaiki : language.kesalahanDataPerluDiperbaiki}
                                </Modal.Title>
                                <Modal.Body className='px-4'>
                                    <div style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }} className='d-flex justify-content-start align-items-center'>
                                        <img src={triangleAlertIcon} width="25" height="25" alt="circle_info" style={{ marginRight: 10 }} />
                                        <span>{language === null ? eng.harapPerbaikiData : language.harapPerbaikiData} </span>
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
                                                                <td style={{ padding: 0 }}>{language === null ? eng.dataPadaBarisKe : language.dataPadaBarisKe} <b>{`${err.no}`}</b> {language === null ? eng.barisKe : language.barisKe}, {`${err.keterangan}`}</td>
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
                                    <input onChange={(newFile) => fileCSV(newFile, listBank, balanceDetail, feeBank, getBalance, totalHoldBalance)} type='file' id='input-file' accept='text/csv' style={{ visibility: 'hidden' }} />
                                    <div type='file' className='text-center mb-2'>
                                        <button
                                            onClick={() => handleClickChangeFile("errorList")}
                                            className='btn-reset'
                                            style={{ width: '25%' }}
                                        >
                                            {language === null ? eng.gantiFile : language.gantiFile}
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
                        {language === null ? eng.yakinPindahHalaman : language.yakinPindahHalaman}
                    </Modal.Title>
                    <Modal.Body >
                        <div className='text-center mt-3 px-4' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>{language === null ? eng.seluruhDataDiinputAkanTerhapus : language.seluruhDataDiinputAkanTerhapus}</div>
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
                                    {language === null ? eng.ya : language.ya}
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
                                    {language === null ? eng.tidak : language.tidak}
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
                        {language === null ? eng.konfirmasiDisburse : language.konfirmasiDisburse}
                    </Modal.Title>
                    <Modal.Body className='mx-2'>
                        <div style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }} className='d-flex justify-content-center align-items-center'>
                            <img src={noteInfo} width="25" height="25" alt="circle_info" style={{ marginRight: 10 }} />
                            <span>{language === null ? eng.descKonfirmasiDisburse : language.descKonfirmasiDisburse}</span>
                        </div>
                        <div>
                            {/* <div className='mt-3' style={{ fontFamily: 'Source Sans Pro', fontSize: 14, color: '#888888' }}>Dari Rekening</div>
                            <div className='mt-1' style={{ fontFamily: 'Source Sans Pro', fontSize: 16, color: '#383838', fontWeight: 600 }}>2348-3492-0943</div> */}
                            <div className='mt-3' style={{ fontFamily: 'Source Sans Pro', fontSize: 16, color: '#383838', fontWeight: 600 }}>{language === null ? eng.tujuanDisburse : language.tujuanDisburse}</div>
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
                                        noDataComponent={<div style={{ marginBottom: 10 }}>{language === null ? eng.belumAdaDataDisburse : language.belumAdaDataDisburse}</div>}
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
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.no : language.no}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.bankTujuan : language.bankTujuan}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.cabang : language.cabang}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.noRekTujuan : language.noRekTujuan}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.namaPemilikRek : language.namaPemilikRek}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.nominalDisburse : language.nominalDisburse}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.emailPenerima : language.emailPenerima}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.catatan : language.catatan}</th>
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
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.no : language.no}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.bankTujuan : language.bankTujuan}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.cabang : language.cabang}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.noRekTujuan : language.noRekTujuan}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.namaPemilikRek : language.namaPemilikRek}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.nominalDisburse : language.nominalDisburse}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.emailPenerima : language.emailPenerima}</th>
                                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>{language === null ? eng.catatan : language.catatan}</th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div className='text-center pb-3'>{language === null ? eng.belumAdaDataDisburse : language.belumAdaDataDisburse}</div>
                                </div>
                            }
                            <div className='sub-base-content-disburse mt-3'>
                                <div className='d-flex justify-content-between align-items-center mt-1'>
                                    <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>{language === null ? eng.totalDisburse : language.totalDisburse}</div>
                                    <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(sum(allNominal), true, 2)}</div>
                                </div>
                                <div className='d-flex justify-content-between align-items-center mt-2'>
                                    <div style={{ fontFamily:'Nunito', fontSize: 14, color: "#383838" }}>{language === null ? eng.totalFeeDisbursePlusTax : language.totalFeeDisbursePlusTax}</div>
                                    <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah(sum(allFee), true, 2)}</div>
                                </div>
                                <div className='mt-2' style={{ border: "1px dashed #C4C4C4" }}></div>
                                <div className='d-flex justify-content-between align-items-center mt-3' style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>
                                    <div>{language === null ? eng.totalDisbursePlusFee : language.totalDisbursePlusFee}</div>
                                    <div>{convertToRupiah((sum(allNominal) + sum(allFee)), true, 2)}</div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center mt-3'>
                                <div style={{ fontFamily: 'Nunito' }}>
                                    <div style={{ fontSize: 14, color: '#383838' }}>{language === null ? eng.sisaSaldoTersedia : language.sisaSaldoTersedia}</div>
                                    <div style={{ fontSize: 12, color: '#888888' }}>{language === null ? eng.descTerhitung : language.descTerhitung}</div>
                                </div>
                                {
                                    Number(((getBalance) - (totalHoldBalance)) - (sum(allNominal) + sum(allFee))) < 0  ?
                                    <div style={{ fontFamily:'Open Sans', fontSize: 12, color: "#B9121B", width: 250 }} className='text-end'>
                                        <span className='me-1'><img src={noteIconRed} alt='icon error' /></span>
                                        {language === null ? eng.saldoTidakCukup : language.saldoTidakCukup}
                                    </div> :
                                    <div style={{ fontFamily:'Exo', fontWeight: 600, fontSize: 16, color: "#383838" }}>{convertToRupiah((((getBalance) - (totalHoldBalance)) - (sum(allNominal) + sum(allFee))), true, 2)}</div>
                                }
                            </div>
                            <div className='mb-3 mt-3'>
                                <Form.Check
                                    className='form-confirm'
                                    label={language === null ? eng.sayaBertanggungJawab : language.sayaBertanggungJawab}
                                    id="statusId"
                                    onChange={handleChangeCheckBoxConfirm}
                                    checked={isCheckedConfirm}
                                    disabled={isDisableChecked}
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
                                {language === null ? eng.batal : language.batal}
                            </button>
                            <button
                                onClick={() => sendDataDisburse(dataExcelDisburse, dataExcelOriginDisburse, isDisbursementManual, fileNameDisbursementBulk)}
                                className={isCheckedConfirm === true ? 'btn-ez-transfer ms-3' : 'btn-noez-transfer ms-3'}
                                disabled={isCheckedConfirm === false}
                                style={{ width: '25%' }}
                            >
                                {isLoadingDisburseMentConfirm ? (<>{(language === null ? eng.mohonTunggu : language.mohonTunggu)}... <FontAwesomeIcon icon={faSpinner} spin /></>) : (language === null ? eng.lakukanDisburse : language.lakukanDisburse)}
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* Modal Data Duplikasi */}
                <Modal size="xs" centered show={showModalDuplikasi} onHide={() => setShowModalDuplikasi(false)}>
                    <Modal.Title className='text-center mt-4' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 20, color: "#393939" }}>
                        {language === null ? eng.ditemukanDuplikasiData : language.ditemukanDuplikasiData}
                    </Modal.Title>
                    <Modal.Body >
                        {
                            duplicateData.length === 0 ?
                            <div className='text-center px-4' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>{language === null ? eng.dataInginDitambahkanTelahTersedia : language.dataInginDitambahkanTelahTersedia}</div> :
                            <div className='text-center px-4' style={{ fontFamily: 'Nunito', color: "#848484", fontSize: 14 }}>{language === null ? eng.dataPadaBarisKe : language.dataPadaBarisKe} <b style={{ wordBreak: 'break-word', color: 'red' }}>{duplicateData.join(", ")}</b> {language === null ? eng.barisKe : language.barisKe} : {language === null ? eng.terindikasiDataDuplikasi : language.terindikasiDataDuplikasi}</div>
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
                                                    isChecked,
                                                    getBalance,
                                                    totalHoldBalance,
                                                    feeBank
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
                                                    isChecked,
                                                    getBalance,
                                                    totalHoldBalance,
                                                    feeBank
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
                                            {language === null ? eng.lanjutkan : language.lanjutkan}
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
                                            {language === null ? eng.perbaiki : language.perbaiki}
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
                                            {language === null ? eng.lanjutkan : language.lanjutkan}
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
                                            {language === null ? eng.perbaiki : language.perbaiki}
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