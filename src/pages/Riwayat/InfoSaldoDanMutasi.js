import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { BaseURL, convertDateAndTimeInfoDanSaldo, convertSimpleTimeStamp, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import SubAccountComponent from '../../components/SubAccountComponent'
import { Button, Col, Form, Image, Modal, Row } from '@themesberg/react-bootstrap'
import iconMata from "../../assets/icon/toggle_mata_icon.svg"
import noteIconError from "../../assets/icon/note_icon_red.svg"
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg";
import { useState } from 'react'
import { DateRangePicker } from 'rsuite'
import encryptData from '../../function/encryptData'
import axios from 'axios'
import { useEffect } from 'react'
import triangleInfo from "../../assets/icon/triangle-info.svg"
import eyeIcon from "../../assets/icon/eye_icon.svg"
import Pagination from 'react-js-pagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSortUp,
    faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import transferFailed from "../../assets/icon/gagaltopup_icon.svg"
import * as XLSX from "xlsx"
import { eng } from '../../components/Language'

const InfoSaldoDanMutasi = () => {
    const language = JSON.parse(sessionStorage.getItem('lang'))
    const history = useHistory()
    const user_role = getRole()
    const access_token = getToken()
    const [showSaldoSubAcc, setShowSaldoSubAcc] = useState(false)
    const [loginToSaldo, setLoginToSaldo] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showErrSistem, setShowErrSistem] = useState(false)
    const [listAkunPartner, setListAkunPartner] = useState([])
    const [dataAkun, setDataAkun] = useState([])
    const [listMutasi, setListMutasi] = useState([])
    const [pageMutasi, setPageMutasi] = useState({})
    const [pendingMutasi, setPendingMutasi] = useState(false)
    const [pendingSaldo, setPendingSaldo] = useState(true)
    const [dataMutasi, setDataMutasi] = useState([])
    const [pageNumberMutasi, setPageNumberMutasi] = useState({})
    const [activePageMutasi, setActivePageMutasi] = useState(1)
    const [totalPageMutasi, setTotalPageMutasi] = useState(0)
    const [errMsg, setErrMsg] = useState("")
    const [dateRangeInfoMutasi, setDateRangeInfoMutasi] = useState([])
    const [showDateInfoMutasi, setShowDateInfoMutasi] = useState("none")
    const [stateInfoMutasi, setStateInfoMutasi] = useState(null)
    const [isFilterMutasi, setIsFilterMutasi] = useState(false)
    const [orderId, setOrderId] = useState(0);
    const [orderField, setOrderField] = useState("");
    const [inputMutasi, setInputMutasi] = useState({
        idTrans: "",
        idReff: "",
        idReffTrans: "",
        paymentType: 0,
        partnerName: "",
        rowPerPage: 10
    })
    const [inputPass, setInputPass] = useState({
        passwordRek: ""
    })
    const passwordInputType = showPassword ? "text" : "password";

    const [dateRangeRiwayatTranferAdmin, setDateRangeRiwayatTranferAdmin] = useState([])
    const [showDateRiwayatTranferAdmin, setShowDateRiwayatTransferAdmin] = useState("none")
    const [stateRiwayatTransferAdmin, setStateRiwayatTransferAdmin] = useState(null)
    const [dataRiwayatTransferAdmin, setDataRiwayatTransferAdmin] = useState([])
    const [pendingRiwayatTransferAdmin, setPendingRiwayatTransferAdmin] = useState(false)
    const [activePageRiwayatTransferAdmin, setActivePageRiwayatTransferAdmin] = useState(1)
    const [pageNumberRiwayatTransferAdmin, setPageNumberRiwayatTransferAdmin] = useState({})
    const [totalPageRiwayatTransferAdmin, setTotalPageRiwayatTransferAdmin] = useState(0)
    const [isFilterRiwayatTransferAdmin, setIsFilterRiwayatTransferAdmin] = useState(false)
    const [orderIdAdmin, setOrderIdAdmin] = useState(0);
    const [orderFieldAdmin, setOrderFieldAdmin] = useState("");
    const [inputHandleAdmin, setInputHandleAdmin] = useState({
        idReff: "",
        namaPartner: "",
        fiturTransaksi: 0,
        periodeRiwayatTransfer : 0,
        idTrans: "",
        idReffTrans: "",
        rowPerPage: 10
    })

    // console.log(activePageMutasi, 'activePageMutasi');
    // console.log(dataMutasi, 'dataMutasi');
    // console.log(pageNumberMutasi, 'pageNumberMutasi');
    // console.log(totalPageMutasi, 'totalPageMutasi');
    // console.log(stateInfoMutasi, 'stateInfoMutasi');
    // console.log(dateRangeInfoMutasi, 'dateRangeInfoMutasi');
    // const passwordIconColor = showPassword ? "#262B40" : "";
    // console.log(dateRangeInfoMutasi, 'dateRangeInfoMutasi');
    // console.log(showDateInfoMutasi, 'showDateInfoMutasi');
    // console.log(stateInfoMutasi, 'stateInfoMutasi');

    function handleChangePass (e) {
        setInputPass({
            ...inputPass,
            [e.target.name]: e.target.value,
        });
        setErrMsg("")
    }

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    /*SORT PARTNER */
      
    const [idTrans, setIdTrans] = useState({
          isDesc: false,
        id: 1
    })

    const [idReffBank, setIdReffBank] = useState({
        isDesc: false,
        id: 1
    })

    const [idReffTrans, setIdReffTrans] = useState({
        isDesc: false,
        id: 1
    })

    const [dates, setDates] = useState({
        isDesc: false,
        id: 1
    })

    const showIdTrans = () => {
        if (!idTrans.isDesc) {
          setIdTrans({ isDesc: true, id: 0 });
        } else {
            setIdTrans({ isDesc: false, id: 1 });
        }
    };

    const showIdReffBank = () => {
        if (!idReffBank.isDesc) {
          setIdReffBank({ isDesc: true, id: 0 });
        } else {
          setIdReffBank({ isDesc: false, id: 1 });
        }
    };

    const showIdReffTrans = () => {
        if (!idReffTrans.isDesc) {
            setIdReffTrans({ isDesc: true, id: 0 });
        } else {
          setIdReffTrans({ isDesc: false, id: 1 });
        }
    };

    const showDates = () => {
        if (!dates.isDesc) {
          setDates({ isDesc: true, id: 0 });
        } else {
          setDates({ isDesc: false, id: 1 });
        }
    };

    /*SORT PARTNER */

    /*SORT ADMIN */

    const [idTransAdmin, setIdTransAdmin] = useState({
        isDesc: false,
        id: 1
    })

    const [idReffBankAdmin, setIdReffBankAdmin] = useState({
        isDesc: false,
        id: 1
    })

    const [idReffTransAdmin, setIdReffTransAdmin] = useState({
        isDesc: false,
        id: 1
    })

    const [datesAdmin, setDatesAdmin] = useState({
        isDesc: false,
        id: 1
    })

    const showIdTransAdmin = () => {
        if (!idTransAdmin.isDesc) {
          setIdTransAdmin({ isDesc: true, id: 0 });
        } else {
          setIdTransAdmin({ isDesc: false, id: 1 });
        }
    };

    const showIdReffBankAdmin = () => {
        if (!idReffBankAdmin.isDesc) {
          setIdReffBankAdmin({ isDesc: true, id: 0 });
        } else {
          setIdReffBankAdmin({ isDesc: false, id: 1 });
        }
    };

    const showIdReffTransAdmin = () => {
        if (!idReffTransAdmin.isDesc) {
          setIdReffTransAdmin({ isDesc: true, id: 0 });
        } else {
          setIdReffTransAdmin({ isDesc: false, id: 1 });
        }
    };

    const showDatesAdmin = () => {
        if (!datesAdmin.isDesc) {
          setDatesAdmin({ isDesc: true, id: 0 });
        } else {
          setDatesAdmin({ isDesc: false, id: 1 });
        }
    };

    /*SORT ADMIN */

    function handleChangeMutasi(e) {
        setInputMutasi({
            ...inputMutasi,
            [e.target.name] : e.target.value
        })
    }

    function handleClickSort (orderId, orderField, isFilter, role) {
        if (role === "partner") {
            if (orderField === "toffshorebank_code" && isFilter === false) {
                setOrderField("toffshorebank_code");
                showIdTrans()
                setOrderId(orderId)
                setActivePageMutasi(1)
                getListRiwayatMutasi(inputHandle.akunPartner, 1, inputMutasi.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName)
            } else if (orderField === "toffshorebank_code" && isFilter === true) {
                setOrderField("toffshorebank_code");
                showIdTrans()
                setOrderId(orderId)
                setActivePageMutasi(1)
                filterListRiwayatMutasi(
                    inputHandle.akunPartner,
                    inputMutasi.idTrans,
                    inputMutasi.paymentType,
                    inputMutasi.partnerName,
                    dateRangeInfoMutasi,
                    inputDataMutasi.periodeInfoMutasi,
                    1,
                    inputMutasi.rowPerPage,
                    orderId,
                    orderField,
                    inputMutasi.idReff,
                    inputMutasi.idReffTrans,
                    language === null ? 'EN' : language.flagName
                )
            } else if (orderField === "id_referensi" && isFilter === false) {
                setOrderField("id_referensi");
                showIdReffBank()
                setOrderId(orderId)
                setActivePageMutasi(1)
                getListRiwayatMutasi(inputHandle.akunPartner, 1, inputMutasi.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName)
            } else if (orderField === "id_referensi" && isFilter === true) {
                setOrderField("id_referensi");
                showIdReffBank()
                setOrderId(orderId)
                setActivePageMutasi(1)
                filterListRiwayatMutasi(
                    inputHandle.akunPartner,
                    inputMutasi.idTrans,
                    inputMutasi.paymentType,
                    inputMutasi.partnerName,
                    dateRangeInfoMutasi,
                    inputDataMutasi.periodeInfoMutasi,
                    1,
                    inputMutasi.rowPerPage,
                    orderId,
                    orderField,
                    inputMutasi.idReff,
                    inputMutasi.idReffTrans,
                    language === null ? 'EN' : language.flagName
                )
            } else if (orderField === "id_referensi_transaksi" && isFilter === false) {
                setOrderField("id_referensi_transaksi");
                showIdReffTrans()
                setOrderId(orderId)
                setActivePageMutasi(1)
                getListRiwayatMutasi(inputHandle.akunPartner, 1, inputMutasi.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName)
            } else if (orderField === "id_referensi_transaksi" && isFilter === true) {
                setOrderField("id_referensi_transaksi");
                showIdReffTrans()
                setOrderId(orderId)
                setActivePageMutasi(1)
                filterListRiwayatMutasi(
                    inputHandle.akunPartner,
                    inputMutasi.idTrans,
                    inputMutasi.paymentType,
                    inputMutasi.partnerName,
                    dateRangeInfoMutasi,
                    inputDataMutasi.periodeInfoMutasi,
                    1,
                    inputMutasi.rowPerPage,
                    orderId,
                    orderField,
                    inputMutasi.idReff,
                    inputMutasi.idReffTrans,
                    language === null ? 'EN' : language.flagName
                )
            } else if (orderField === "toffshorebank_crtdt" && isFilter === false) {
                setOrderField("toffshorebank_crtdt");
                showDates()
                setOrderId(orderId)
                setActivePageMutasi(1)
                getListRiwayatMutasi(inputHandle.akunPartner, 1, inputMutasi.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName)
            } else if (orderField === "toffshorebank_crtdt" && isFilter === true) {
                setOrderField("toffshorebank_crtdt");
                showDates()
                setOrderId(orderId)
                setActivePageMutasi(1)
                filterListRiwayatMutasi(
                    inputHandle.akunPartner,
                    inputMutasi.idTrans,
                    inputMutasi.paymentType,
                    inputMutasi.partnerName,
                    dateRangeInfoMutasi,
                    inputDataMutasi.periodeInfoMutasi,
                    1,
                    inputMutasi.rowPerPage,
                    orderId,
                    orderField,
                    inputMutasi.idReff,
                    inputMutasi.idReffTrans,
                    language === null ? 'EN' : language.flagName
                )
            }
        } else if (role === "admin") {
            if (orderField === "toffshorebank_code" && isFilter === false) {
                // console.log("masuk idtrans dan nofilter");
                setOrderFieldAdmin("toffshorebank_code");
                showIdTransAdmin()
                setOrderIdAdmin(orderId)
                setActivePageRiwayatTransferAdmin(1)
                getListRiwayatTransferAdmin(1, inputHandleAdmin.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName)
            } else if (orderField === "toffshorebank_code" && isFilter === true) {
                setOrderFieldAdmin("toffshorebank_code");
                showIdTransAdmin()
                setOrderIdAdmin(orderId)
                setActivePageRiwayatTransferAdmin(1)
                filterListRiwayatTransaksiAdmin(
                    inputHandleAdmin.idTrans,
                    inputHandleAdmin.idReffTrans,
                    inputHandleAdmin.idReff,
                    orderId,
                    orderField,
                    inputHandleAdmin.fiturTransaksi,
                    inputHandleAdmin.namaPartner,
                    dateRangeRiwayatTranferAdmin,
                    inputHandleAdmin.periodeRiwayatTransfer,
                    1,
                    inputHandleAdmin.rowPerPage,
                    language === null ? 'EN' : language.flagName
                )
            } else if (orderField === "id_referensi" && isFilter === false) {
                setOrderFieldAdmin("id_referensi");
                showIdReffBankAdmin()
                setOrderIdAdmin(orderId)
                setActivePageRiwayatTransferAdmin(1)
                getListRiwayatTransferAdmin(1, inputHandleAdmin.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName)
            } else if (orderField === "id_referensi" && isFilter === true) {
                setOrderFieldAdmin("id_referensi");
                showIdReffBankAdmin()
                setOrderIdAdmin(orderId)
                setActivePageRiwayatTransferAdmin(1)
                filterListRiwayatTransaksiAdmin(
                    inputHandleAdmin.idTrans,
                    inputHandleAdmin.idReffTrans,
                    inputHandleAdmin.idReff,
                    orderId,
                    orderField,
                    inputHandleAdmin.fiturTransaksi,
                    inputHandleAdmin.namaPartner,
                    dateRangeRiwayatTranferAdmin,
                    inputHandleAdmin.periodeRiwayatTransfer,
                    1,
                    inputHandleAdmin.rowPerPage,
                    language === null ? 'EN' : language.flagName
                )
            } else if (orderField === "id_referensi_transaksi" && isFilter === false) {
                setOrderFieldAdmin("id_referensi_transaksi");
                showIdReffTransAdmin()
                setOrderIdAdmin(orderId)
                setActivePageRiwayatTransferAdmin(1)
                getListRiwayatTransferAdmin(1, inputHandleAdmin.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName)
            } else if (orderField === "id_referensi_transaksi" && isFilter === true) {

                setOrderFieldAdmin("id_referensi_transaksi");
                showIdReffTransAdmin()
                setOrderIdAdmin(orderId)
                setActivePageRiwayatTransferAdmin(1)
                filterListRiwayatTransaksiAdmin(
                    inputHandleAdmin.idTrans,
                    inputHandleAdmin.idReffTrans,
                    inputHandleAdmin.idReff,
                    orderId,
                    orderField,
                    inputHandleAdmin.fiturTransaksi,
                    inputHandleAdmin.namaPartner,
                    dateRangeRiwayatTranferAdmin,
                    inputHandleAdmin.periodeRiwayatTransfer,
                    1,
                    inputHandleAdmin.rowPerPage,
                    language === null ? 'EN' : language.flagName
                )
            } else if (orderField === "toffshorebank_crtdt" && isFilter === false) {
                setOrderFieldAdmin("toffshorebank_crtdt");
                showDatesAdmin()
                setOrderIdAdmin(orderId)
                setActivePageRiwayatTransferAdmin(1)
                getListRiwayatTransferAdmin(1, inputHandleAdmin.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName)
            } else if (orderField === "toffshorebank_crtdt" && isFilter === true) {
                setOrderFieldAdmin("toffshorebank_crtdt");
                showDatesAdmin()
                setOrderIdAdmin(orderId)
                setActivePageRiwayatTransferAdmin(1)
                filterListRiwayatTransaksiAdmin(
                    inputHandleAdmin.idTrans,
                    inputHandleAdmin.idReffTrans,
                    inputHandleAdmin.idReff,
                    orderId,
                    orderField,
                    inputHandleAdmin.fiturTransaksi,
                    inputHandleAdmin.namaPartner,
                    dateRangeRiwayatTranferAdmin,
                    inputHandleAdmin.periodeRiwayatTransfer,
                    1,
                    inputHandleAdmin.rowPerPage,
                    language === null ? 'EN' : language.flagName
                )
            }
        }
    }

    function handlePageChangeRiwayatMutasi(page) {
        if (isFilterMutasi) {
            setActivePageMutasi(page);
            filterListRiwayatMutasi(inputHandle.akunPartner, inputMutasi.idTrans, inputMutasi.paymentType, inputMutasi.partnerName, dateRangeInfoMutasi, inputDataMutasi.periodeInfoMutasi, page, inputMutasi.rowPerPage, orderId, orderField, inputMutasi.idReff, inputMutasi.idReffTrans, language === null ? 'EN' : language.flagName)
        } else {
            setActivePageMutasi(page);
            getListRiwayatMutasi(inputHandle.akunPartner, page, inputMutasi.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName);
        }
    }

    async function getListRiwayatMutasi(partnerId, currentPage, rowPerPage, orderId, orderFieldId, lang) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"${partnerId}", "toffshorebank_code":"", "trans_type": 0, "partner_name":"", "date_from":"", "date_to":"", "period":2, "page":${(currentPage !== 0) ? currentPage : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "order": ${orderId}, "order_field": "${orderFieldId}", "id_referensi": "", "id_referensi_transaksi": ""}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : lang
            }
            const listDataMutasi = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
            // console.log(listDataMutasi, "ini data riwayat");
            if (listDataMutasi.data.response_code === 200 && listDataMutasi.status === 200 && listDataMutasi.data.response_new_token.length === 0) {
                listDataMutasi.data.response_data.results = listDataMutasi.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1 }));
                setDataMutasi(listDataMutasi.data.response_data.results)
                setPageNumberMutasi(listDataMutasi.data.response_data)
                setTotalPageMutasi(listDataMutasi.data.response_data.max_page)
                setPendingMutasi(false)
            } else if (listDataMutasi.data.response_code === 200 && listDataMutasi.status === 200 && listDataMutasi.data.response_new_token.length !== 0) {
                setUserSession(listDataMutasi.data.response_new_token)
                listDataMutasi.data.response_data.results = listDataMutasi.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1 }));
                setDataMutasi(listDataMutasi.data.response_data.results)
                setPageNumberMutasi(listDataMutasi.data.response_data)
                setTotalPageMutasi(listDataMutasi.data.response_data.max_page)
                setPendingMutasi(false)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    async function filterListRiwayatMutasi(partnerId, idTrans, paymentType, partnerName, periode, dateId, page, rowPerPage, orderId, orderField, idReff, idReffTrans, lang) {
        try {
            setPendingMutasi(true)
            setIsFilterMutasi(true)
            setActivePageMutasi(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"${partnerId}", "toffshorebank_code":"${idTrans.length !== 0 ? idTrans : ""}", "trans_type": ${paymentType}, "partner_name":"${partnerName.length !== 0 ? partnerName : ""}", "date_from":"${periode.length !== 0 ? periode[0] : ""}", "date_to":"${periode.length !== 0 ? periode[1] : ""}", "period": ${dateId}, "page":${(page !== 0) ? page : 1}, "row_per_page": ${rowPerPage !== 0 ? rowPerPage : 10}, "order": ${orderId}, "order_field": "${orderField}", "id_referensi": "${idReff.length !== 0 ? idReff : ""}", "id_referensi_transaksi": "${idReffTrans.length !== 0 ? idReffTrans : ""}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : lang
            }
            const listDataMutasi = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
            // console.log(listDataMutasi, "ini data riwayat");
            if (listDataMutasi.data.response_code === 200 && listDataMutasi.status === 200 && listDataMutasi.data.response_new_token.length === 0) {
                listDataMutasi.data.response_data.results = listDataMutasi.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1 }));
                setDataMutasi(listDataMutasi.data.response_data.results)
                setPageNumberMutasi(listDataMutasi.data.response_data)
                setTotalPageMutasi(listDataMutasi.data.response_data.max_page)
                setPendingMutasi(false)
            } else if (listDataMutasi.data.response_code === 200 && listDataMutasi.status === 200 && listDataMutasi.data.response_new_token.length !== 0) {
                setUserSession(listDataMutasi.data.response_new_token)
                listDataMutasi.data.response_data.results = listDataMutasi.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1 }));
                setDataMutasi(listDataMutasi.data.response_data.results)
                setPageNumberMutasi(listDataMutasi.data.response_data)
                setTotalPageMutasi(listDataMutasi.data.response_data.max_page)
                setPendingMutasi(false)
            }
        } catch (error) {
        //   console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    function handleChangePeriodeMutasi (e) {
        if (e.target.value === "7") {
            setShowDateInfoMutasi("")
            setInputDataMutasi({
                ...inputDataMutasi,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateInfoMutasi("none")
            setInputDataMutasi({
                ...inputDataMutasi,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateInfoMutasi(item) {
        // console.log(item, "item");
        setStateInfoMutasi(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
          setDateRangeInfoMutasi(item)
        }
    }
    
    async function fetchMoreData() {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"${inputHandle.akunPartner}", "start_date":"", "end_date":"", "date_id":1, "page":{"max_record":"10", "next_record":"${pageMutasi.next_record !== undefined ? pageMutasi.next_record : "N"}", "matched_record":"${pageMutasi.matched_record !== undefined ? pageMutasi.matched_record : "0"}"}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const mutasiList = await axios.post(BaseURL + "/SubAccount/GetAccountStatement", { data: dataParams }, { headers: headers })
            if (mutasiList.status === 200 && mutasiList.data.response_code === 200 && mutasiList.data.response_new_token.length === 0) {
                mutasiList.data.response_data.data.forEach((obj, idx) => {
                    let year = obj.waktu.slice(0, 4)
                    let month = obj.waktu.slice(4, 6)
                    let day = obj.waktu.slice(6, 8)
                    obj.waktu = `${day}/${month}/${year}`
                });
                setListMutasi(listMutasi.concat(mutasiList.data.response_data.data))
                setPageMutasi(mutasiList.data.response_data.pages)
            } else if (mutasiList.status === 200 && mutasiList.data.response_code === 200 && mutasiList.data.response_new_token.length !== 0) {
                setUserSession(mutasiList.data.response_new_token)
                mutasiList.data.response_data.data.forEach((obj, idx) => {
                    let year = obj.waktu.slice(0, 4)
                    let month = obj.waktu.slice(4, 6)
                    let day = obj.waktu.slice(6, 8)
                    obj.waktu = `${day}/${month}/${year}`
                });
                setListMutasi(listMutasi.concat(mutasiList.data.response_data.data))
                setPageMutasi(mutasiList.data.response_data.pages)
            }
        } catch (error) {
            // console.log(error);
            if (error.response.status === 400 && error.response.data.response_code === 400) {
                setErrMsg(error.response.data.response_message)
                setPendingMutasi(false)
            }
            history.push(errorCatch(error.response.status))
        }
    }
    
    const style = {
        height: 30,
        border: "1px solid green",
        margin: 6,
        padding: 8
    };
    
    const [inputHandle, setInputHandle] = useState({
        akunPartner: "",
        nomorAkun: "",
        namaAkun: ""
    })
    // console.log(inputHandle.akunPartner, "partner id ");
    const [inputDataMutasi, setInputDataMutasi] = useState({
        periodeInfoMutasi: 0
    })
    
    const { allowedMaxDays, allowedRange, combine } = DateRangePicker;
    const currentDate = new Date().toISOString().split('T')[0]
    const oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate() + 1).toISOString().split('T')[0]
    const threeMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 3, new Date().getDate() + 1).toISOString().split('T')[0]
    const column = [
        {
            label: <><img src={triangleInfo} alt="triangle_info" style={{ marginRight: 3, marginTop: -6 }} /> Range Tanggal maksimal 7 hari dan periode mutasi paling lama 90 hari</>,
            style: {
                color: '#383838',
                width: 'max-content',
                padding: '14px 25px 14px 14px',
                fontSize: 13,
                fontStyle: 'italic',
                textAlign: 'left',
                whiteSpace: 'normal',
                backgroundColor: 'rgba(255, 214, 0, 0.16)',
                opacity: 'unset'
            },
            placement: 'bottom',
            
        },
    ]
    const Locale = {
        sunday: 'Min',
        monday: 'Sen',
        tuesday: 'Sel',
        wednesday: 'Rab',
        thursday: 'Kam',
        friday: 'Jum',
        saturday: 'Sab',
        ok: 'Terapkan',
    };

    function handleChange(e, listAkun) {
        listAkun = listAkun.find(item => item.partner_id === e.target.value)
        // console.log(listAkun.partner_id, "list akun");
        getListRiwayatMutasi(listAkun.partner_id, activePageMutasi, inputMutasi.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName)
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.value,
            akunPartner: listAkun.partner_id,
            nomorAkun: listAkun.account_number,
            namaAkun: listAkun.account_name,
        });
        setInputDataMutasi({
            periodeInfoMutasi: 0
        })
        setStateInfoMutasi(null)
        setDateRangeInfoMutasi([])
        setShowDateInfoMutasi("none")
        setDataAkun([])
    }

    function toDashboard() {
        history.push("/");
    }

    function toLaporan() {
        history.push("/riwayat-transaksi/va-dan-paylink");
    }

    async function getAkunPartner() {
        try {
          const auth = "Bearer " + getToken()
          const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const listPartnerAkun = await axios.post(BaseURL + "/SubAccount/GetAgenAccount", { data: "" }, { headers: headers })
          if (listPartnerAkun.status === 200 && listPartnerAkun.data.response_code === 200 && listPartnerAkun.data.response_new_token.length === 0) {
            listPartnerAkun.data.response_data = listPartnerAkun.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            // console.log(listAkunPartner, "list partner");
            setListAkunPartner(listPartnerAkun.data.response_data)
            if (listPartnerAkun.data.response_data.length !== 0) {
                setInputHandle({
                    ...inputHandle,
                    akunPartner: listPartnerAkun.data.response_data[0].partner_id,
                    nomorAkun: listPartnerAkun.data.response_data[0].account_number,
                    namaAkun: listPartnerAkun.data.response_data[0].account_name,
                })
                // getListMutasi(listPartnerAkun.data.response_data[0].partner_id, pageMutasi.next_record, pageMutasi.matched_record)
                getListRiwayatMutasi(listPartnerAkun.data.response_data[0].partner_id, activePageMutasi, inputMutasi.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName)
            }
          } else if (listPartnerAkun.status === 200 && listPartnerAkun.data.response_code === 200 && listPartnerAkun.data.response_new_token.length !== 0) {
            setUserSession(listPartnerAkun.data.response_new_token)
            listPartnerAkun.data.response_data = listPartnerAkun.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setListAkunPartner(listPartnerAkun.data.response_data)
            if (listPartnerAkun.data.response_data.length !== 0) {
                setInputHandle({
                    ...inputHandle,
                    akunPartner: listPartnerAkun.data.response_data[0].partner_id,
                    nomorAkun: listPartnerAkun.data.response_data[0].account_number,
                    namaAkun: listPartnerAkun.data.response_data[0].account_name,
                })
                getListRiwayatMutasi(listPartnerAkun.data.response_data[0].partner_id, activePageMutasi, inputMutasi.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName)
            }
          }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function getInfoSaldo(partnerId, password) {
        try {
            setPendingSaldo(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"partner_dtl_id":"${partnerId}", "password": "${password}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataAkunPartner = await axios.post(BaseURL + "/SubAccount/GetBalancePartner", { data: dataParams }, { headers: headers })
            // console.log(dataAkunPartner, "data akun partner")
            if (dataAkunPartner.status === 200 && dataAkunPartner.data.response_code === 200 && dataAkunPartner.data.response_new_token.length === 0) {
                setDataAkun(dataAkunPartner.data.response_data)
                setLoginToSaldo(false)
                setInputPass("")
                setPendingSaldo(false)
            } else if (dataAkunPartner.status === 200 && dataAkunPartner.data.response_code === 200 && dataAkunPartner.data.response_new_token.length !== 0) {
                setUserSession(dataAkunPartner.data.response_new_token)
                setDataAkun(dataAkunPartner.data.response_data)
                setLoginToSaldo(false)
                setInputPass("")
                setPendingSaldo(false)
            }
        } catch (error) {
            // console.log(error)
            // RouteTo(errorCatch(error.response.status))
            if (error.response.status === 400 && error.response.data.response_code === 400) {
                setErrMsg(error.response.data.response_message)
            } else if (error.response.status === 400 && error.response.data.response_code === 450) {
                setInputPass("")
                setLoginToSaldo(false)
                setShowErrSistem(true)
            }
            history.push(errorCatch(error.response.status))
        }
    }

    async function getListMutasi(partnerId, nextRecord, matchedRecord) {
        try {
            setPendingMutasi(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"${partnerId}", "start_date":"", "end_date":"", "date_id":1, "page":{"max_record":"10", "next_record":"${nextRecord !== undefined ? nextRecord : "N"}", "matched_record":"${matchedRecord !== undefined ? matchedRecord : "0"}"}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const mutasiList = await axios.post(BaseURL + "/SubAccount/GetAccountStatement", { data: dataParams }, { headers: headers })
            // console.log(mutasiList, "DATA MUTASI LIST")
            if (mutasiList.status === 200 && mutasiList.data.response_code === 200 && mutasiList.data.response_new_token.length === 0) {
                mutasiList.data.response_data.data.forEach((obj) => {
                    let year = obj.waktu.slice(0, 4)
                    let month = obj.waktu.slice(4, 6)
                    let day = obj.waktu.slice(6, 8)
                    obj.waktu = `${day}/${month}/${year}`
                });
                setListMutasi(mutasiList.data.response_data.data)
                setPageMutasi(mutasiList.data.response_data.pages)
                setPendingMutasi(false)
            } else if (mutasiList.status === 200 && mutasiList.data.response_code === 200 && mutasiList.data.response_new_token.length !== 0) {
                mutasiList.data.response_data.data.forEach((obj) => {
                    let year = obj.waktu.slice(0, 4)
                    let month = obj.waktu.slice(4, 6)
                    let day = obj.waktu.slice(6, 8)
                    obj.waktu = `${day}/${month}/${year}`
                });
                setUserSession(mutasiList.data.response_new_token)
                setListMutasi(mutasiList.data.response_data.data)
                setPageMutasi(mutasiList.data.response_data.pages)
                setPendingMutasi(false)
            }
        } catch (error) {
            // console.log(error)
            // RouteTo(errorCatch(error.response.status))
            if (error.response.status === 400 && error.response.data.response_code === 400) {
                setListMutasi([])
                setErrMsg(error.response.data.response_message)
                setPendingMutasi(false)
            }
            history.push(errorCatch(error.response.status))
            
        }
    }

    async function filterGetListMutasi(partnerId, periode, dateId, next, matchRecord) {
        try {
            setPendingMutasi(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"${partnerId}", "start_date":"${(periode.length !== 0) ? periode[0] : ""}", "end_date":"${(periode.length !== 0) ? periode[1] : ""}", "date_id":${dateId}, "page":{"max_record":"10", "next_record":"${next}", "matched_record":"${matchRecord}"}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const mutasiListFilter = await axios.post(BaseURL + "/SubAccount/GetAccountStatement", { data: dataParams }, { headers: headers })
            // console.log(mutasiListFilter, "DATA MUTASI LIST FILTER")
            if (mutasiListFilter.status === 200 && mutasiListFilter.data.response_code === 200 && mutasiListFilter.data.response_new_token.length === 0) {
                mutasiListFilter.data.response_data.data.forEach((obj, idx) => {
                    obj.number = idx + 1
                    let year = obj.waktu.slice(0, 4)
                    let month = obj.waktu.slice(4, 6)
                    let day = obj.waktu.slice(6, 8)
                    obj.waktu = `${day}/${month}/${year}`
                });
                setListMutasi(mutasiListFilter.data.response_data.data)
                setPageMutasi(mutasiListFilter.data.response_data.pages)
                setPendingMutasi(false)
            } else if (mutasiListFilter.status === 200 && mutasiListFilter.data.response_code === 200 && mutasiListFilter.data.response_new_token.length !== 0) {
                mutasiListFilter.data.response_data.data.forEach((obj, idx) => {
                    obj.number = idx + 1
                    let year = obj.waktu.slice(0, 4)
                    let month = obj.waktu.slice(4, 6)
                    let day = obj.waktu.slice(6, 8)
                    obj.waktu = `${day}/${month}/${year}`
                });
                setUserSession(mutasiListFilter.data.response_new_token)
                setListMutasi(mutasiListFilter.data.response_data.data)
                setPageMutasi(mutasiListFilter.data.response_data.pages)
                setPendingMutasi(false)
            }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            if (error.response.status === 400 && error.response.data.response_code === 400) {
                setListMutasi([])
                setErrMsg(error.response.data.response_message)
                setPendingMutasi(false)
            }
            history.push(errorCatch(error.response.status))
        }
    }

    function resetButtonHandle() {
        setInputDataMutasi({
            periodeInfoMutasi: 0
        })
        setInputMutasi({
            idTrans: "",
            idReff: "",
            idReffTrans: "",
            paymentType: 0,
            partnerName: "",
        })
        setStateInfoMutasi(null)
        setDateRangeInfoMutasi([])
        setShowDateInfoMutasi("none")
    }
    // console.log(inputDataMutasi.periodeInfoMutasi, 'inputDataMutasi.periodeInfoMutasi');
    
    function viewSaldo () {
        getInfoSaldo(inputHandle.akunPartner, inputPass.passwordRek)
        
    }

    function formPassword () {
        setLoginToSaldo(true)
    }

    function toSeeSaldo () {
        // setShowSaldoSubAcc(true)
        // getInfoSaldo(inputHandle.akunPartner)
    }

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                paddingRight: 'none'
                
            },
        },
    };

    /* PAGE ADMIN */

    function handleChangeAdmin(e) {
        setInputHandleAdmin({
            ...inputHandleAdmin,
            [e.target.name] : e.target.value
        })
    }

    function handlePageChangeRiwayatTransferAdmin(page) {
        if (isFilterRiwayatTransferAdmin) {
            setActivePageRiwayatTransferAdmin(page)
            filterListRiwayatTransaksiAdmin(inputHandleAdmin.idTrans, inputHandleAdmin.idReffTrans, inputHandleAdmin.idReff, orderIdAdmin, orderFieldAdmin, inputHandleAdmin.fiturTransaksi, inputHandleAdmin.namaPartner, dateRangeRiwayatTranferAdmin, inputHandleAdmin.periodeRiwayatTransfer, page, inputHandleAdmin.rowPerPage, language === null ? 'EN' : language.flagName)
        } else {
            setActivePageRiwayatTransferAdmin(page)
            getListRiwayatTransferAdmin(page, inputHandleAdmin.rowPerPage, orderIdAdmin, orderFieldAdmin, language === null ? 'EN' : language.flagName)
        }
    }

    function handleChangePeriodeTransfer (e) {
        if (e.target.value === "7") {
            setShowDateRiwayatTransferAdmin("")
            setInputHandleAdmin({
                ...inputHandleAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateRiwayatTransferAdmin("none")
            setInputHandleAdmin({
                ...inputHandleAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateRiwayatTransferAdmin(item) {
        setStateRiwayatTransferAdmin(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
          setDateRangeRiwayatTranferAdmin(item)
        }
    }

    async function getListRiwayatTransferAdmin(currentPage, rowPerPage, orderId, orderFieldId, lang) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"", "toffshorebank_code":"", "trans_type": 0, "partner_name":"", "date_from":"", "date_to":"", "period":2, "page":${(currentPage !== 0) ? currentPage : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "order": ${orderId}, "order_field": "${orderFieldId}", "id_referensi": "", "id_referensi_transaksi": ""}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : lang
            }
            const listDataRiwayat = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
            // console.log(listDataRiwayat, "ini data riwayat");
            if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length === 0) {
                listDataRiwayat.data.response_data.results = listDataRiwayat.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1 }));
                setPageNumberRiwayatTransferAdmin(listDataRiwayat.data.response_data)
                setTotalPageRiwayatTransferAdmin(listDataRiwayat.data.response_data.max_page)
                setDataRiwayatTransferAdmin(listDataRiwayat.data.response_data.results)
                setPendingRiwayatTransferAdmin(false)
            } else if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length !== 0) {
                setUserSession(listDataRiwayat.data.response_new_token)
                listDataRiwayat.data.response_data.results = listDataRiwayat.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1 }));
                setPageNumberRiwayatTransferAdmin(listDataRiwayat.data.response_data)
                setTotalPageRiwayatTransferAdmin(listDataRiwayat.data.response_data.max_page)
                setDataRiwayatTransferAdmin(listDataRiwayat.data.response_data.results)
                setPendingRiwayatTransferAdmin(false)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    async function filterListRiwayatTransaksiAdmin(idTrans, idReffTrans, idReff, orderId, orderField, transType, namaPartner, periode, dateID, page, rowPerPage, lang) {
        try {
            setPendingRiwayatTransferAdmin(true)
            setIsFilterRiwayatTransferAdmin(true)
            setActivePageRiwayatTransferAdmin(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"", "toffshorebank_code":"${idTrans.length !== 0 ? idTrans : ""}", "id_referensi_transaksi": "${idReffTrans.length !== 0 ? idReffTrans : ""}", "id_referensi":"${(idReff.length !== 0) ? idReff : ""}", "order": ${orderId}, "order_field": "${orderField}", "trans_type": ${transType !== 0 ? transType : 0}, "partner_name":"${namaPartner.length !== 0 ? namaPartner : ""}", "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to":"${(periode.length !== 0) ? periode[1] : ""}", "period": ${dateID}, "page":${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : lang
            }
            const listDataRiwayat = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
            // console.log(listDataRiwayat, "ini data riwayat");
            if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length === 0) {
                listDataRiwayat.data.response_data.results = listDataRiwayat.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1 }));
                setPageNumberRiwayatTransferAdmin(listDataRiwayat.data.response_data)
                setTotalPageRiwayatTransferAdmin(listDataRiwayat.data.response_data.max_page)
                setDataRiwayatTransferAdmin(listDataRiwayat.data.response_data.results)
                setPendingRiwayatTransferAdmin(false)
            } else if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length !== 0) {
                setUserSession(listDataRiwayat.data.response_new_token)
                listDataRiwayat.data.response_data.results = listDataRiwayat.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1 }));
                setPageNumberRiwayatTransferAdmin(listDataRiwayat.data.response_data)
                setTotalPageRiwayatTransferAdmin(listDataRiwayat.data.response_data.max_page)
                setDataRiwayatTransferAdmin(listDataRiwayat.data.response_data.results)
                setPendingRiwayatTransferAdmin(false)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    function ExportReportRiwayatTransfer (isFilter, partnerId, idTrans, idReffTrans, idReff, transType, namaPartner, orderId, orderField, periode, dateID, lang) {
        if (isFilter) {
            async function dataExportFilter(idTrans, idReffTrans, idReff, transType, namaPartner, orderId, orderField, periode, dateID) {
                try {
                    const auth = "Bearer " + getToken()
                    const dataParams = encryptData(`{"subpartner_id": "${user_role === "102" ? partnerId : ""}", "toffshorebank_code":"${idTrans.length !== 0 ? idTrans : ""}", "id_referensi_transaksi": "${idReffTrans.length !== 0 ? idReffTrans : ""}", "id_referensi":"${(idReff.length !== 0) ? idReff : ""}", "order": ${orderId}, "order_field": "${orderField}", "trans_type": ${transType !== 0 ? transType : 0}, "partner_name":"${namaPartner.length !== 0 ? namaPartner : ""}", "date_from":"${(periode.length !== 0) ? periode[0] : ""}", "date_to":"${(periode.length !== 0) ? periode[1] : ""}", "period": ${dateID}, "page":1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type':'application/json',
                        'Authorization' : auth,
                        'Accept-Language' : lang
                    }
                    const listDataRiwayat = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
                    // console.log(listDataRiwayat, "ini data riwayat");
                    if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length === 0) {
                        const data = listDataRiwayat.data.response_data.results;
                        let dataExcel = []
                        if (user_role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].toffshorebank_code, [language === null ? eng.idRefBank : language.idRefBank]: data[i].id_referensi, [language === null ? eng.idRefTrans : language.idRefTrans]: data[i].id_referensi_transaksi, [language === null ? eng.waktu : language.waktu]: data[i].toffshorebank_crtdt, [language === null ? eng.namaPartner : language.namaPartner]: data[i].mpartner_name, [language === null ? eng.jenisTransaksi : language.jenisTransaksi]: data[i].moffshorebank_type_name, [language === null ? eng.rekTujuan : language.rekTujuan]: data[i].toffshorebank_account, [language === null ? eng.nominal : language.nominal]: data[i].toffshorebank_amount, [language === null ? eng.deskripsi : language.deskripsi]: data[i].toffshorebank_desc, [language === null ? eng.keterangan : language.keterangan]: data[i].keterangan})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].toffshorebank_code, "ID Referensi Bank": data[i].id_referensi, "ID Referensi Transaksi": data[i].id_referensi_transaksi, "Waktu": data[i].toffshorebank_crtdt, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Tujuan": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Keterangan": data[i].toffshorebank_desc})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.riwayatTransaksiSubAkunExcel : language.riwayatTransaksiSubAkunExcel} .xlsx`);
                    } else if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length !== 0) {
                        setUserSession(listDataRiwayat.data.response_new_token)
                        const data = listDataRiwayat.data.response_data.results;
                        let dataExcel = []
                        if (user_role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].toffshorebank_code, [language === null ? eng.idRefBank : language.idRefBank]: data[i].id_referensi, [language === null ? eng.idRefTrans : language.idRefTrans]: data[i].id_referensi_transaksi, [language === null ? eng.waktu : language.waktu]: data[i].toffshorebank_crtdt, [language === null ? eng.namaPartner : language.namaPartner]: data[i].mpartner_name, [language === null ? eng.jenisTransaksi : language.jenisTransaksi]: data[i].moffshorebank_type_name, [language === null ? eng.rekTujuan : language.rekTujuan]: data[i].toffshorebank_account, [language === null ? eng.nominal : language.nominal]: data[i].toffshorebank_amount, [language === null ? eng.deskripsi : language.deskripsi]: data[i].toffshorebank_desc, [language === null ? eng.keterangan : language.keterangan]: data[i].keterangan})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].toffshorebank_code, "ID Referensi Bank": data[i].id_referensi, "ID Referensi Transaksi": data[i].id_referensi_transaksi, "Waktu": data[i].toffshorebank_crtdt, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Tujuan": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Keterangan": data[i].toffshorebank_desc})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.riwayatTransaksiSubAkunExcel : language.riwayatTransaksiSubAkunExcel} .xlsx`);
                    }
                } catch (error) {
                  // console.log(error)
                  history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(idTrans, idReffTrans, idReff, transType, namaPartner, orderId, orderField, periode, dateID)
        } else {
            async function dataDefault() {
                try {
                    const auth = "Bearer " + getToken()
                    const dataParams = encryptData(`{"subpartner_id": "${user_role === "102" ? partnerId : ""}", "toffshorebank_code":"", "trans_type": 0, "partner_name":"", "date_from":"", "date_to":"", "period":2, "page":1, "row_per_page": 1000000, "order": ${orderId}, "order_field": "${orderField}", "id_referensi": "", "id_referensi_transaksi": ""}`)
                    const headers = {
                        'Content-Type':'application/json',
                        'Authorization' : auth,
                        'Accept-Language' : lang
                    }
                    const listDataRiwayat = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
                    // console.log(listDataRiwayat, "ini data riwayat");
                    if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length === 0) {
                        const data = listDataRiwayat.data.response_data.results;
                        let dataExcel = []
                        if (user_role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].toffshorebank_code, [language === null ? eng.idRefBank : language.idRefBank]: data[i].id_referensi, [language === null ? eng.idRefTrans : language.idRefTrans]: data[i].id_referensi_transaksi, [language === null ? eng.waktu : language.waktu]: data[i].toffshorebank_crtdt, [language === null ? eng.namaPartner : language.namaPartner]: data[i].mpartner_name, [language === null ? eng.jenisTransaksi : language.jenisTransaksi]: data[i].moffshorebank_type_name, [language === null ? eng.rekTujuan : language.rekTujuan]: data[i].toffshorebank_account, [language === null ? eng.nominal : language.nominal]: data[i].toffshorebank_amount, [language === null ? eng.deskripsi : language.deskripsi]: data[i].toffshorebank_desc, [language === null ? eng.keterangan : language.keterangan]: data[i].keterangan})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Referensi": data[i].toffshorebank_code, "Waktu": data[i].toffshorebank_crtdt, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Sub Account": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Biaya Admin": data[i].toffshorebank_fee, "Keterangan": data[i].toffshorebank_desc})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.riwayatTransaksiSubAkunExcel : language.riwayatTransaksiSubAkunExcel} .xlsx`);
                    } else if (listDataRiwayat.data.response_code === 200 && listDataRiwayat.status === 200 && listDataRiwayat.data.response_new_token.length !== 0) {
                        const data = listDataRiwayat.data.response_data.results;
                        let dataExcel = []
                        if (user_role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].toffshorebank_code, [language === null ? eng.idRefBank : language.idRefBank]: data[i].id_referensi, [language === null ? eng.idRefTrans : language.idRefTrans]: data[i].id_referensi_transaksi, [language === null ? eng.waktu : language.waktu]: data[i].toffshorebank_crtdt, [language === null ? eng.namaPartner : language.namaPartner]: data[i].mpartner_name, [language === null ? eng.jenisTransaksi : language.jenisTransaksi]: data[i].moffshorebank_type_name, [language === null ? eng.rekTujuan : language.rekTujuan]: data[i].toffshorebank_account, [language === null ? eng.nominal : language.nominal]: data[i].toffshorebank_amount, [language === null ? eng.deskripsi : language.deskripsi]: data[i].toffshorebank_desc, [language === null ? eng.keterangan : language.keterangan]: data[i].keterangan})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Referensi": data[i].toffshorebank_code, "Waktu": data[i].toffshorebank_crtdt, "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].moffshorebank_type_name, "Rekening Sub Account": data[i].toffshorebank_account, "Nominal": data[i].toffshorebank_amount, "Biaya Admin": data[i].toffshorebank_fee, "Keterangan": data[i].toffshorebank_desc})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.riwayatTransaksiSubAkunExcel : language.riwayatTransaksiSubAkunExcel} .xlsx`);
                    }
                } catch (error) {
                  // console.log(error)
                  history.push(errorCatch(error.response.status))
                }
            }
            dataDefault()
        }
    }

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
          <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          <div>Loading...</div>
        </div>
    );

    console.log(listAkunPartner, "listAkunPartner");
    console.log(inputHandle.akunPartner, "inputHandle.akunPartner");

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        if (user_role === "102") {
            getAkunPartner()
            getListRiwayatMutasi(inputHandle.akunPartner, activePageMutasi, inputMutasi.rowPerPage, orderId, orderField, language === null ? 'EN' : language.flagName)
        } else if (user_role === "100") {
            getListRiwayatTransferAdmin(activePageRiwayatTransferAdmin, inputHandleAdmin.rowPerPage, orderIdAdmin, orderFieldAdmin, language === null ? 'EN' : language.flagName)
        }
        // userDetails()
    }, [])
    // console.log(listMutasi, 'listMutasi');

    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> {language === null ? eng.laporan : language.laporan}</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;{user_role === "102" ? (language === null ? eng.infoSaldoDanMutasi : language.infoSaldoDanMutasi) : "Sub Account bank"} &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;{user_role === "102" ? (language === null ? eng.infoSaldoDanMutasi : language.infoSaldoDanMutasi) : "Riwayat Transaksi Sub Account"}</span> 
            <div className="head-title">
                <div className="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>{user_role === "102" ? (language === null ? eng.infoSaldoDanMutasi : language.infoSaldoDanMutasi) : "Riwayat Transaksi Sub Account Partner"}</div>
            </div>
            {
                user_role === "102" ? (
                    <>
                        {
                            listAkunPartner.length !== 0 ?
                            <>
                                <div className='base-content-custom px-3 pt-4 pb-4' style={{ width: "38%" }}>
                                    <div className="mb-3">{language === null ? eng.pilihAkun : language.pilihAkun}</div>
                                    <Form.Select name='akunPartner' value={inputHandle.akunPartner} onChange={(e) => handleChange(e, listAkunPartner)}>
                                        {/* <option defaultChecked disabled value="">Pilih Status</option> */}
                                        {listAkunPartner.map((item, idx) => {
                                            return (
                                                <option key={idx} value={item.partner_id}>
                                                    {item.account_name} - {item.account_number}
                                                </option>
                                            )
                                        })}
                                    </Form.Select>
                                    <div className='p-3 mt-3' style={{ border: "1px solid #EBEBEB", borderRadius: 8 }}>
                                        <div style={{ fontSize: 14, fontFamily: "Nunito", color: "#888888" }}>{language === null ? eng.saldoRekSubAkun : language.saldoRekSubAkun}</div>
                                        {
                                            (dataAkun.length === 0 || dataAkun === null) ? (
                                                <div className='d-flex justify-content-start align-items-center mt-2' style={{ cursor: "pointer" }} onClick={() => formPassword()}>
                                                    <img src={iconMata} alt="mata" />
                                                    <div className='ms-2' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 16, color: "#077E86", textDecoration: "underline" }}>{language === null ? eng.klikUntukLihatSaldo : language.klikUntukLihatSaldo}</div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className='mt-2' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 16, color: "#077E86" }}>{convertToRupiah(dataAkun.availablebalance, false, 2)}</div>
                                                    <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 12, color: "#888888" }}>Diperbaharui pada : {convertSimpleTimeStamp(dataAkun.timestamp_request, 'saldoRek')}</div>
                                                </>
                                            )
                                        }
                                        <div className='mt-3' style={{ border:"1px solid #C4C4C4", backgroundColor: "#C4C4C4" }} />
                                        <div className='mt-3' style={{ fontSize: 12, fontFamily: "Nunito", color: "#888888" }}>{language === null ? eng.noRekSubAkun : language.noRekSubAkun} : </div>
                                        <div className='mt-2' style={{ fontSize: 12, fontFamily: "Nunito", color: "#383838" }}>{inputHandle.nomorAkun} {language === null ? eng.atasNama : language.atasNama} {inputHandle.namaAkun}</div>
                                    </div>
                                </div>
                                <div className="head-title">
                                    <div className="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>{language === null ? eng.mutasiRekSubAkun : language.mutasiRekSubAkun}</div>
                                </div>
                                <div className="base-content mt-3">
                                    <span className="font-weight-bold mb-4" style={{ fontWeight: 700, fontFamily: "Exo", fontSize: 16 }}>
                                        {language === null ? eng.filter : language.filter}
                                    </span>
                                    <Row className="mt-4">
                                        <Col
                                            xs={4}
                                            className="d-flex justify-content-between align-items-center"
                                        >
                                            <div>{language === null ? eng.idRefBank : language.idRefBank}</div>
                                            <input
                                                name="idReff"
                                                value={inputMutasi.idReff}
                                                onChange={(e) => handleChangeMutasi(e)}
                                                type="text"
                                                className="input-text-sub"
                                                placeholder={language === null ? eng.placeholderIdRefBank : language.placeholderIdRefBank}
                                            />
                                        </Col>
                                        <Col
                                            xs={4}
                                            className="d-flex justify-content-between align-items-center"
                                        >
                                            <div>{language === null ? eng.idTransaksi : language.idTransaksi}</div>
                                            <input
                                                name="idTrans"
                                                value={inputMutasi.idTrans}
                                                onChange={(e) => handleChangeMutasi(e)}
                                                type="text"
                                                className="input-text-sub"
                                                placeholder={language === null ? eng.placeholderIdTrans : language.placeholderIdTrans}
                                            />
                                        </Col>
                                        <Col
                                            xs={4}
                                            className="d-flex justify-content-between align-items-center"
                                        >
                                            <div>{language === null ? eng.idRefTrans : language.idRefTrans}</div>
                                            <input
                                                name="idReffTrans"
                                                value={inputMutasi.idReffTrans}
                                                onChange={(e) => handleChangeMutasi(e)}
                                                type="text"
                                                className="input-text-sub"
                                                placeholder={language === null ? eng.placeholderIdRefTrans : language.placeholderIdRefTrans}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col
                                            xs={4}
                                            className="d-flex justify-content-between align-items-center"
                                        >
                                            <div>{language === null ? eng.jenisTransaksi : language.jenisTransaksi}</div>
                                            <Form.Select
                                                name="paymentType"
                                                value={inputMutasi.paymentType}
                                                onChange={(e) => handleChangeMutasi(e)}
                                                className="input-text-sub"
                                                placeholder={language === null ? eng.placeholderJenisTransaksi : language.placeholderJenisTransaksi}
                                            >
                                                <option value={0}>{language === null ? eng.placeholderJenisTransaksi : language.placeholderJenisTransaksi}</option>
                                                <option value={1}>{language === null ? eng.transaksiMasuk : language.transaksiMasuk} ( cr )</option>
                                                <option value={2}>{language === null ? eng.transaksiKeluar : language.transaksiKeluar} ( db )</option>
                                                <option value={3}>{language === null ? eng.biayaAdmin : language.biayaAdmin}</option>
                                            </Form.Select>
                                        </Col> 
                                        <Col
                                            xs={4}
                                            className="d-flex justify-content-between align-items-center"
                                        >
                                            <div>{language === null ? eng.periode : language.periode} <span style={{ color: "red" }}>*</span></div>
                                            <Form.Select
                                                name="periodeInfoMutasi"
                                                className="input-text-sub"
                                                value={inputDataMutasi.periodeInfoMutasi}
                                                onChange={(e) => handleChangePeriodeMutasi(e)}
                                            >
                                                <option defaultChecked disabled value={0}>{language === null ? eng.pilihPeriode : language.pilihPeriode}</option>
                                                <option value={2}>{language === null ? eng.hariIni : language.hariIni}</option>
                                                <option value={3}>{language === null ? eng.kemarin : language.kemarin}</option>
                                                <option value={4}>{language === null ? eng.tujuhHariTerakhir : language.tujuhHariTerakhir}</option>
                                                <option value={7}>{language === null ? eng.pilihRangeTanggal : language.pilihRangeTanggal}</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row className='mt-3'>
                                        <Col xs={4}></Col>
                                        <Col xs={4} className='d-flex justify-content-end align-items-center' >
                                            <div style={{ display: showDateInfoMutasi }}>
                                                <DateRangePicker
                                                    value={stateInfoMutasi}
                                                    ranges={column}
                                                    onChange={(e) => pickDateInfoMutasi(e)}
                                                    character=' - '
                                                    cleanable={true}
                                                    placement='bottomEnd'
                                                    size='lg'
                                                    placeholder="Select Date Range" 
                                                    disabledDate={combine(allowedMaxDays(7), allowedRange(threeMonthAgo, currentDate))}
                                                    className='datePicker'
                                                    locale={Locale}
                                                    format="yyyy-MM-dd"
                                                    defaultCalendarValue={[new Date(`${oneMonthAgo}`), new Date(`${currentDate}`)]}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='mt-3'>
                                        <Col xs={5}>
                                            <Row>
                                                <Col xs={6} style={{ width: "40%" }}>
                                                    <button 
                                                        className={((inputDataMutasi.periodeInfoMutasi === "2") || (inputDataMutasi.periodeInfoMutasi === "3") || (inputDataMutasi.periodeInfoMutasi === "4") || (inputDataMutasi.periodeInfoMutasi !== 0 && (inputDataMutasi.periodeInfoMutasi === "7" && dateRangeInfoMutasi.length !== 0))) ? 'btn-ez-on' : 'btn-noez-transfer'}
                                                        disabled={inputDataMutasi.periodeInfoMutasi === 0 || (inputDataMutasi.periodeInfoMutasi === "7" && dateRangeInfoMutasi.length === 0)}
                                                        onClick={() => filterListRiwayatMutasi(inputHandle.akunPartner, inputMutasi.idTrans, inputMutasi.paymentType, inputMutasi.partnerName, dateRangeInfoMutasi, inputDataMutasi.periodeInfoMutasi, 1, 10, orderId, orderField, inputMutasi.idReff, inputMutasi.idReffTrans, language === null ? 'EN' : language.flagName)}
                                                    >
                                                        {language === null ? eng.terapkan : language.terapkan}
                                                    </button>
                                                </Col>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button 
                                                        className={(inputDataMutasi.periodeInfoMutasi !== 0) ? 'btn-reset' : 'btn-ez-reset'}
                                                        disabled={(inputDataMutasi.periodeInfoMutasi === 0 )}
                                                        onClick={() => resetButtonHandle()}
                                                    >
                                                        {language === null ? eng.aturUlang : language.aturUlang}
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {
                                        dataMutasi.length !== 0 && 
                                        <div className='mt-3 mb-5'>
                                            <Link to={"#"} onClick={() => ExportReportRiwayatTransfer(isFilterMutasi, inputHandle.akunPartner, inputMutasi.idTrans, inputMutasi.idReffTrans, inputMutasi.idReff, inputMutasi.paymentType, inputMutasi.partnerName, orderId, orderField, dateRangeInfoMutasi, inputDataMutasi.periodeInfoMutasi, language === null ? 'EN' : language.flagName)} className="export-span">{language === null ? eng.export : language.export}</Link>
                                        </div>
                                    }
                                    <div className="div-table mt-4 pb-4" style={{ paddingBottom: 20, marginBottom: 20}}>
                                        <div id="tableInvoice" style={{  overflowX: "auto" }} className=" table-bordered mt-3">
                                            {
                                                dataMutasi.length !== 0 ? (
                                                    <>
                                                        <table className='table mt-3'>
                                                            <thead style={{ borderStyle: "hidden", fontWeight: 600 }}>
                                                                <tr>
                                                                    <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>{language === null ? eng.no : language.no}</th>
                                                                    {!idTrans.isDesc ? <th onClick={() => handleClickSort(idTrans.id, "toffshorebank_code", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer" }}>{language === null ? eng.idTransaksi : language.idTransaksi} <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idTrans.id, "toffshorebank_code", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer" }}>{language === null ? eng.idTransaksi : language.idTransaksi} <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2'/></span></th>}
                                                                    {!idReffBank.isDesc ? <th onClick={() => handleClickSort(idReffBank.id, "id_referensi", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>{language === null ? eng.idRefBank : language.idRefBank} <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffBank.id, "id_referensi", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>{language === null ? eng.idRefBank : language.idRefBank} <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                                    {!idReffTrans.isDesc ? <th onClick={() => handleClickSort(idReffTrans.id, "id_referensi_transaksi", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>{language === null ? eng.idRefTrans : language.idRefTrans} <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffTrans.id, "id_referensi_transaksi", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>{language === null ? eng.idRefTrans : language.idRefTrans} <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                                    {!dates.isDesc ? <th onClick={() => handleClickSort(dates.id, "toffshorebank_crtdt", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>{language === null ? eng.waktu : language.waktu} <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(dates.id, "toffshorebank_crtdt", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>{language === null ? eng.waktu : language.waktu} <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                                    <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>{language === null ? eng.jenisTransaksi : language.jenisTransaksi}</th>
                                                                    <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>{language === null ? eng.rekTujuan : language.rekTujuan}</th>
                                                                    <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>{language === null ? eng.nominal : language.nominal}</th>
                                                                    <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>{language === null ? eng.deskripsi : language.deskripsi}</th>
                                                                    <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>{language === null ? eng.keterangan : language.keterangan}</th>
                                                                </tr>
                                                            </thead>
                                                            {
                                                                !pendingMutasi && (
                                                                    <tbody className="table-group-divider">
                                                                        {
                                                                            dataMutasi.map((item, idx) => (
                                                                                <tr key={idx} style={{ borderStyle: "hidden" }}>
                                                                                    <td style={{ textAlign: "center", padding: "0.75rem 1rem" }}>{ item.number }</td>
                                                                                    <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_code }</td>
                                                                                    <td style={{ padding: "0.75rem 1rem" }}>{ item.id_referensi }</td>
                                                                                    <td style={{ padding: "0.75rem 1rem" }}>{ item.id_referensi_transaksi.length === 0 ? `-` : item.id_referensi_transaksi }</td>
                                                                                    <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_crtdt_format }</td>
                                                                                    <td style={{ padding: "0.75rem 1rem" }}>{ item.moffshorebank_type_name }</td>
                                                                                    <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_account }</td>
                                                                                    <td style={{ padding: "0.75rem 1rem" }}>{ convertToRupiah(item.offshore_amount, true, 0) }</td>
                                                                                    <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_desc.length === 0 ? "-" : item.toffshorebank_desc }</td>
                                                                                    <td style={{ padding: "0.75rem 1rem" }}>{ item.keterangan.length === 0 ? "-" : item.keterangan }</td>
                                                                                </tr>
                                                                            ))
                                                                        }
                                                                    </tbody>
                                                                ) 
                                                            }
                                                        </table>
                                                        {pendingMutasi && (<div className='text-center'><CustomLoader /></div>)}
                                                    </>
                                                ) : (
                                                    <>
                                                        <table className='table mt-3'>
                                                            <thead style={{ borderStyle: "hidden", fontWeight: 600, }}>
                                                                <tr>
                                                                    <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>{language === null ? eng.no : language.no}</th>
                                                                    {!idTrans.isDesc ? <th onClick={() => handleClickSort(idTrans.id, "toffshorebank_code", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer" }}>{language === null ? eng.idTransaksi : language.idTransaksi} <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idTrans.id, "toffshorebank_code", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer" }}>{language === null ? eng.idTransaksi : language.idTransaksi} <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2'/></span></th>}
                                                                    {!idReffBank.isDesc ? <th onClick={() => handleClickSort(idReffBank.id, "id_referensi", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>{language === null ? eng.idRefBank : language.idRefBank} <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffBank.id, "id_referensi", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>{language === null ? eng.idRefBank : language.idRefBank} <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                                    {!idReffTrans.isDesc ? <th onClick={() => handleClickSort(idReffTrans.id, "id_referensi_transaksi", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>{language === null ? eng.idRefTrans : language.idRefTrans} <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffTrans.id, "id_referensi_transaksi", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>{language === null ? eng.idRefTrans : language.idRefTrans} <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                                    {!dates.isDesc ? <th onClick={() => handleClickSort(dates.id, "toffshorebank_crtdt", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>{language === null ? eng.waktu : language.waktu} <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(dates.id, "toffshorebank_crtdt", isFilterMutasi, "partner")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>{language === null ? eng.waktu : language.waktu} <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                                    <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>{language === null ? eng.jenisTransaksi : language.jenisTransaksi}</th>
                                                                    <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>{language === null ? eng.rekTujuan : language.rekTujuan}</th>
                                                                    <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>{language === null ? eng.nominal : language.nominal}</th>
                                                                    <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>{language === null ? eng.deskripsi : language.deskripsi}</th>
                                                                    <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>{language === null ? eng.keterangan : language.keterangan}</th>
                                                                </tr>
                                                            </thead>
                                                        </table>
                                                        {!pendingMutasi ? <div className='text-center pb-3' style={{ color: '#393939' }}>{language === null ? eng.tidakAdaData : language.tidakAdaData}</div> : <div className='text-center'><CustomLoader /></div>}
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            marginTop: -15,
                                            paddingTop: 12,
                                            borderTop: "groove",
                                        }}
                                    >
                                        <div style={{ marginRight: 10, marginTop: 10 }}>
                                            {language === null ? eng.totalHalaman : language.totalHalaman} : {totalPageMutasi}
                                        </div>
                                        <Pagination
                                            activePage={activePageMutasi}
                                            itemsCountPerPage={pageNumberMutasi.row_per_page}
                                            totalItemsCount={
                                                pageNumberMutasi.row_per_page * pageNumberMutasi.max_page
                                            }
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={handlePageChangeRiwayatMutasi}
                                        />
                                    </div>
                                </div>
                            </> :
                            <SubAccountComponent/>
                        }
                    </>
                ) : (
                    <div className="base-content mt-3">
                        <span className="font-weight-bold mb-4" style={{ fontWeight: 700, fontFamily: "Exo", fontSize: 16 }}>
                            Filter
                        </span>
                        <Row className="mt-4">
                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                <div>ID Transaksi</div>
                                <input
                                    name="idTrans"
                                    value={inputHandleAdmin.idTrans}
                                    onChange={(e) => handleChangeAdmin(e)}
                                    type="text"
                                    className="input-text-sub"
                                    placeholder="Masukkan ID Transaksi"
                                />
                            </Col>
                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                <div>ID Referensi Bank</div>
                                <input
                                    name="idReff"
                                    value={inputHandleAdmin.idReff}
                                    onChange={(e) => handleChangeAdmin(e)}
                                    type="text"
                                    className="input-text-sub"
                                    placeholder="Masukkan ID Referensi"
                                />
                            </Col>
                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                <div>ID Referensi Transaksi</div>
                                <input
                                    name="idReffTrans"
                                    value={inputHandleAdmin.idReffTrans}
                                    onChange={(e) => handleChangeAdmin(e)}
                                    type="text"
                                    className="input-text-sub"
                                    placeholder="Masukkan ID ref Transaksi"
                                />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                <div>Nama Partner</div>
                                <input
                                    name="namaPartner"
                                    value={inputHandleAdmin.namaPartner}
                                    onChange={(e) => handleChangeAdmin(e)}
                                    type="text"
                                    className="input-text-sub"
                                    placeholder="Masukkan Nama Agen"
                                />
                            </Col>
                            <Col
                                xs={4}
                                className="d-flex justify-content-between align-items-center"
                                style={{ width: (showDateRiwayatTranferAdmin === "none") ? "33%" : "33%" }}
                            >
                                <div>Periode <span style={{ color: "red" }}>*</span></div>
                                <Form.Select
                                    name="periodeRiwayatTransfer"
                                    className="input-text-sub"
                                    value={inputHandleAdmin.periodeRiwayatTransfer}
                                    onChange={(e) => handleChangePeriodeTransfer(e)}
                                >
                                    <option defaultChecked disabled value={0}>Pilih Periode</option>
                                    <option value={2}>Hari Ini</option>
                                    <option value={3}>Kemarin</option>
                                    <option value={4}>7 Hari Terakhir</option>
                                    <option value={7}>Pilih Range Tanggal</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={4}></Col>
                            <Col xs={4} className='d-flex justify-content-end align-items-center' >
                                <div style={{ display: showDateRiwayatTranferAdmin }}>
                                    <DateRangePicker 
                                        value={stateRiwayatTransferAdmin} 
                                        ranges={column} 
                                        onChange={(e) => pickDateRiwayatTransferAdmin(e)} 
                                        character=' - ' 
                                        cleanable={true} 
                                        placement={'bottomEnd'} 
                                        size='lg' 
                                        appearance="default" 
                                        placeholder="Select Date Range" 
                                        disabledDate={combine(allowedMaxDays(7), allowedRange(threeMonthAgo, currentDate))}  
                                        className='datePicker'
                                        locale={Locale}
                                        format="yyyy-MM-dd"
                                        defaultCalendarValue={[new Date(`${oneMonthAgo}`), new Date(`${currentDate}`)]}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={6} style={{ width: "unset" }}>
                                        <button 
                                            className={((inputHandleAdmin.periodeRiwayatTransfer === "2") || (inputHandleAdmin.periodeRiwayatTransfer === "3") || (inputHandleAdmin.periodeRiwayatTransfer === "4") || (inputHandleAdmin.periodeRiwayatTransfer !== 0 && dateRangeRiwayatTranferAdmin.length !== 0) ) ? "btn-ez-on" : "btn-ez"} 
                                            disabled={inputHandleAdmin.periodeRiwayatTransfer === 0 || ( inputHandleAdmin.periodeRiwayatTransfer === "7" && dateRangeRiwayatTranferAdmin.length === 0) } 
                                            onClick={() => filterListRiwayatTransaksiAdmin(inputHandleAdmin.idTrans, inputHandleAdmin.idReffTrans, inputHandleAdmin.idReff, orderIdAdmin, orderFieldAdmin, inputHandleAdmin.fiturTransaksi, inputHandleAdmin.namaPartner, dateRangeRiwayatTranferAdmin, inputHandleAdmin.periodeRiwayatTransfer, 1, inputHandleAdmin.rowPerPage, language === null ? 'EN' : language.flagName)}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button className={(inputHandleAdmin.periodeRiwayatTransfer !== 0 || dateRangeRiwayatTranferAdmin.length !== 0 || (dateRangeRiwayatTranferAdmin.length !== 0 && inputHandleAdmin.idReff.length !== 0) || (dateRangeRiwayatTranferAdmin.length !== 0 && inputHandleAdmin.namaPartner.length !== 0) || (dateRangeRiwayatTranferAdmin.length !== 0 && inputHandleAdmin.fiturTransaksi !== 0)) ? "btn-reset" : "btn-ez"} 
                                        disabled={inputHandleAdmin.periodeRiwayatTransfer === 0 || (inputHandleAdmin.periodeRiwayatTransfer === 0 && inputHandleAdmin.idReff.length === 0) || (inputHandleAdmin.periodeRiwayatTransfer === 0 && inputHandleAdmin.namaPartner.length === 0)|| (inputHandleAdmin.periodeRiwayatTransfer === 0 && inputHandleAdmin.fiturTransaksi === 0)} 
                                        onClick={() => resetButtonHandle()}
                                    >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {
                            dataRiwayatTransferAdmin.length !== 0 && 
                            <div className='mt-3 mb-5'>
                                <Link to={"#"} onClick={() => ExportReportRiwayatTransfer(isFilterRiwayatTransferAdmin, inputHandleAdmin.idTrans, inputHandleAdmin.idReffTrans, inputHandleAdmin.idReff, inputHandleAdmin.fiturTransaksi, inputHandleAdmin.namaPartner, orderIdAdmin, orderFieldAdmin, dateRangeRiwayatTranferAdmin, inputHandleAdmin.periodeRiwayatTransfer, language === null ? 'EN' : language.flagName)} className="export-span">Export</Link>
                            </div>
                        }
                        <div className="div-table mt-4 pb-4" id="tableInvoice" style={{  overflowX: "auto" }}>
                            {
                                dataRiwayatTransferAdmin.length !== 0 ? (
                                    <>
                                        <table className="table mt-3"  hover>
                                            <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)", borderStyle: "hidden" }}>
                                                <tr>
                                                    <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 60 }}>No</th>
                                                    {!idTransAdmin.isDesc ? <th onClick={() => handleClickSort(idTransAdmin.id, "toffshorebank_code", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer" }}>ID Transaksi <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idTransAdmin.id, "toffshorebank_code", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer" }}>ID Transaksi <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2'/></span></th>}
                                                    {!idReffBankAdmin.isDesc ? <th onClick={() => handleClickSort(idReffBankAdmin.id, "id_referensi", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Bank <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffBankAdmin.id, "id_referensi", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Bank <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                    {!idReffTransAdmin.isDesc ? <th onClick={() => handleClickSort(idReffTransAdmin.id, "id_referensi_transaksi", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Transaksi <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffTransAdmin.id, "id_referensi_transaksi", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Transaksi <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                    {!datesAdmin.isDesc ? <th onClick={() => handleClickSort(datesAdmin.id, "toffshorebank_crtdt", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>Waktu <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(datesAdmin.id, "toffshorebank_crtdt", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>Waktu <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                    <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 160 }}>Nama Partner</th>
                                                    <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 170 }}>Jenis Transaksi</th>
                                                    <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 200 }}>Rekening Tujuan</th>
                                                    <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo' }}>Nominal</th>
                                                    <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 135 }}>Keterangan</th>
                                                </tr>
                                            </thead>
                                            {
                                                !pendingRiwayatTransferAdmin && (
                                                    <tbody>
                                                        {
                                                            dataRiwayatTransferAdmin.map((item, idx) => {
                                                                return (
                                                                    <tr>
                                                                        <td style={{ textAlign: "center", padding: "0.75rem 1rem" }}>{ item.number }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_code }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.id_referensi }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.id_referensi_transaksi.length === 0 ? `-` : item.id_referensi_transaksi }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_crtdt_format }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.mpartner_name }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.moffshorebank_type_name }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_account }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ convertToRupiah(item.offshore_amount, true, 0) }</td>
                                                                        <td style={{ padding: "0.75rem 1rem" }}>{ item.keterangan.length === 0 ? "-" : item.keterangan }</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                )
                                            }
                                        </table> 
                                        {pendingRiwayatTransferAdmin && (<div className='text-center'><CustomLoader /></div>)}
                                    </>
                                    
                                ) : (
                                    <div id='table-body' style={{ overflowX: 'auto', maxWidth: 'max-content' }} className='scroll-confirm'>
                                        <>
                                            <table className="table text-start mt-4" id="tableInvoice" hover>
                                                <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                                                    <tr>
                                                        <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 60 }}>No</th>
                                                        {!idTransAdmin.isDesc ? <th onClick={() => handleClickSort(idTransAdmin.id, "toffshorebank_code", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer" }}>ID Transaksi <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idTransAdmin.id, "toffshorebank_code", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer" }}>ID Transaksi <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2'/></span></th>}
                                                        {!idReffBankAdmin.isDesc ? <th onClick={() => handleClickSort(idReffBankAdmin.id, "id_referensi", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Bank <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffBankAdmin.id, "id_referensi", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Bank <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                        {!idReffTransAdmin.isDesc ? <th onClick={() => handleClickSort(idReffTransAdmin.id, "id_referensi_transaksi", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Transaksi <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffTransAdmin.id, "id_referensi_transaksi", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Transaksi <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                        {!datesAdmin.isDesc ? <th onClick={() => handleClickSort(datesAdmin.id, "toffshorebank_crtdt", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>Waktu <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(datesAdmin.id, "toffshorebank_crtdt", isFilterRiwayatTransferAdmin, "admin")} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>Waktu <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                        <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 160 }}>Nama Partner</th>
                                                        <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 170 }}>Jenis Transaksi</th>
                                                        <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 200 }}>Rekening Tujuan</th>
                                                        <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo' }}>Nominal</th>
                                                        <th style={{ fontWeight: "bold", fontSize: 14, textTransform: 'none', fontFamily: 'Exo', width: 135 }}>Keterangan</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            {!pendingRiwayatTransferAdmin ? <div className='text-center pb-3' style={{ color: '#393939' }}>Tidak ada data </div> : <div className='text-center'><CustomLoader /></div>}
                                        </>
                                    </div>
                                )
                            }
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageRiwayatTransferAdmin}</div>
                            <Pagination
                                activePage={activePageRiwayatTransferAdmin}
                                itemsCountPerPage={pageNumberRiwayatTransferAdmin.row_per_page}
                                totalItemsCount={(pageNumberRiwayatTransferAdmin.row_per_page*pageNumberRiwayatTransferAdmin.max_page)}
                                pageRangeDisplayed={5}
                                itemClass="page-item"
                                linkClass="page-link"
                                onChange={handlePageChangeRiwayatTransferAdmin}
                            />
                        </div>
                    </div>
                )
            }

            <Modal className="saldo-sub-acc" size="xs" centered show={loginToSaldo} onHide={() => setLoginToSaldo(false)}>
                <Modal.Title className="mt-4 text-center px-3" style={{ fontFamily: 'Exo', fontSize: 24, fontWeight: 700 }}>
                    {language === null ? eng.masukkanKataSandiSub : language.masukkanKataSandiSub} 
                </Modal.Title>
                <Modal.Body >
                    <div className=' mt-2' style={{ padding: "0px 24px"}}>
                        <div style={{ fontSize: 14, fontFamily: "Nunito" }}>{language === null ? eng.kataSandi : language.kataSandi}</div>
                        <div className='d-flex justify-content-center align-items-center text-center mt-1 position-relative' >
                            <input value={inputPass.passwordRek} name="passwordRek" type={passwordInputType} onChange={handleChangePass} className='input-text-saldo-sub-acc' placeholder={language === null ? eng.placeholderKataSandi : language.placeholderKataSandi} style={{width: "100%", borderColor: errMsg.length !== 0 ? "#B9121B" : "#C4C4C4"}} />
                            <img onClick={() => togglePassword()} src={eyeIcon} alt="eye icon" className='position-absolute right-0 me-2' style={{ cursor: "pointer" }} />
                        </div>
                    </div>
                    <div className='text-center'>
                        {
                            errMsg.length !== 0 ? (
                                <div className='d-flex justify-content-center align items-center mt-3'>
                                    <img src={noteIconError} alt="icon error" />
                                    <div style={{ color: "#B9121B", fontFamily: "Nunito", fontSize: 14 }} className='ms-2'>{language === null ? eng.kataSandiSalah : language.kataSandiSalah}</div>
                                </div>
                            ) : ""
                        }
                    </div>
                    <div className='px-2 mt-4'>
                        <button
                        onClick={() => viewSaldo()}
                            className='d-flex justify-content-center align-items-center text-center mt-3 mb-2'
                            style={{
                                width: "100%",
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 700,
                                alignItems: "center",
                                padding: "12px 24px",
                                gap: 8,
                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                border: "0.6px solid #383838",
                                borderRadius: 6,
                            }}
                        >
                            {language === null ? eng.lihatSaldo : language.lihatSaldo}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal className="saldo-sub-acc" size="xs" centered show={showErrSistem} onHide={() => setShowErrSistem(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setShowErrSistem(false)}
                    />
                </Modal.Header>
                <Modal.Title className="mt-3 text-center px-3" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    <div><img src={transferFailed} alt="success transfer" /></div> 
                    <div className='mt-3'>{language === null ? eng.sistemSedangBermasalah : language.sistemSedangBermasalah}</div> 
                </Modal.Title>
                <Modal.Body >
                    <div className='text-center px-4' style={{ fontFamily: "Source Sans Pro", fontSize: 16, color: "#888888" }}>{language === null ? eng.descSistemBermasalah : language.descSistemBermasalah}</div>
                    <div className='px-4 mt-4'>
                        <button
                            onClick={() => setShowErrSistem(false)}
                            className='d-flex justify-content-center align-items-center text-center mt-3 mb-2'
                            style={{
                                width: "100%",
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 700,
                                alignItems: "center",
                                padding: "12px 24px",
                                gap: 8,
                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                border: "0.6px solid #383838",
                                borderRadius: 6,
                            }}
                        >
                            {language === null ? eng.oke : language.oke}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal className="history-modal" size="xs" centered show={showSaldoSubAcc} onHide={() => setShowSaldoSubAcc(false)}>
                <Modal.Title className="mt-4 text-center px-3" style={{ fontFamily: 'Exo', fontSize: 24, fontWeight: 700 }}>
                    {language === null ? eng.saldoRekSubAccount : language.saldoRekSubAccount}
                </Modal.Title>
                <Modal.Body>
                    {
                        pendingSaldo === true ?
                        <div className='d-flex justify-content-center align-items-center'>
                            <CustomLoader/>
                        </div> :
                        <>
                            <div className='text-center' style={{ fontSize: 14, fontWeight: 400, color: "#383838", fontFamily: "Nunito" }}>{language === null ? eng.nominalSaldoSaatIni : language.nominalSaldoSaatIni}</div>
                            <div className='text-center mt-2' style={{ fontSize: 12, fontWeight: 400, color: "#888888", fontFamily: "Nunito" }}>{convertDateAndTimeInfoDanSaldo(dataAkun.timestamp_request)}</div>
                            <div className='text-center mt-2' style={{color: "#077E86", fontSize: 20, fontFamily: "Exo", fontWeight: 700 }}>{convertToRupiah(dataAkun.availablebalance, true, 2)}</div>
                            <div className='text-center mt-3' style={{color: "#888888", fontSize: 12, fontFamily: "Nunito", fontWeight: 400 }}>{language === null ? eng.noRek : language.noRek}: {dataAkun.account_number} {language === null ? eng.atasNama : language.atasNama} {dataAkun.account_name}</div>
                            <div className='px-5'>
                                <button
                                    onClick={() => setShowSaldoSubAcc(false)}
                                    className='d-flex justify-content-center align-items-center text-center mt-3 mb-2'
                                    style={{
                                        width: "100%",
                                        fontFamily: "Exo",
                                        fontSize: 16,
                                        fontWeight: 700,
                                        alignItems: "center",
                                        padding: "12px 24px",
                                        gap: 8,
                                        background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                        border: "0.6px solid #383838",
                                        borderRadius: 6,
                                    }}
                                >
                                    {language === null ? eng.oke : language.oke}
                                </button>
                            </div>
                        </>
                    }
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default InfoSaldoDanMutasi