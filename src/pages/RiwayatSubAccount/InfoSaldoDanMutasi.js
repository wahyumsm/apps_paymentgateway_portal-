import React from 'react'
import { useHistory } from 'react-router-dom'
import { BaseURL, convertDateAndTimeInfoDanSaldo, convertSimpleTimeStamp, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import SubAccountComponent from '../../components/SubAccountComponent'
import { Col, Form, Image, Modal, Row } from '@themesberg/react-bootstrap'
import iconMata from "../../assets/icon/toggle_mata_icon.svg"
import noteIconError from "../../assets/icon/note_icon_red.svg"
import DataTable from 'react-data-table-component'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg";
import { useState } from 'react'
// import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { DateRangePicker } from 'rsuite'
import encryptData from '../../function/encryptData'
import axios from 'axios'
import { useEffect } from 'react'
import triangleInfo from "../../assets/icon/triangle-info.svg"
import eyeIcon from "../../assets/icon/eye_icon.svg"
import InfiniteScroll from 'react-infinite-scroll-component'
import Pagination from 'react-js-pagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSortUp,
    faSortDown,
} from "@fortawesome/free-solid-svg-icons";

const InfoSaldoDanMutasi = () => {
    const history = useHistory()
    const user_role = getRole()
    const [showSaldoSubAcc, setShowSaldoSubAcc] = useState(false)
    const [loginToSaldo, setLoginToSaldo] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
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

    function handleChangeMutasi(e) {
        setInputMutasi({
            ...inputMutasi,
            [e.target.name] : e.target.value
        })
    }

    function handleClickSort (orderId, orderField, isFilter) {
        if (orderField === "toffshorebank_code" && isFilter === false) {
            setOrderField("toffshorebank_code");
            showIdTrans()
            setOrderId(orderId)
            setActivePageMutasi(1)
            getListRiwayatMutasi(inputHandle.akunPartner, 1, inputMutasi.rowPerPage, orderId, orderField)
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
                inputMutasi.idReffTrans
            )
        } else if (orderField === "id_referensi" && isFilter === false) {
            setOrderField("id_referensi");
            showIdReffBank()
            setOrderId(orderId)
            setActivePageMutasi(1)
            getListRiwayatMutasi(inputHandle.akunPartner, 1, inputMutasi.rowPerPage, orderId, orderField)
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
                inputMutasi.idReffTrans
            )
        } else if (orderField === "id_referensi_transaksi" && isFilter === false) {
            setOrderField("id_referensi_transaksi");
            showIdReffTrans()
            setOrderId(orderId)
            setActivePageMutasi(1)
            getListRiwayatMutasi(inputHandle.akunPartner, 1, inputMutasi.rowPerPage, orderId, orderField)
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
                inputMutasi.idReffTrans
            )
        } else if (orderField === "toffshorebank_crtdt" && isFilter === false) {
            setOrderField("toffshorebank_crtdt");
            showDates()
            setOrderId(orderId)
            setActivePageMutasi(1)
            getListRiwayatMutasi(inputHandle.akunPartner, 1, inputMutasi.rowPerPage, orderId, orderField)
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
                inputMutasi.idReffTrans
            )
        }
    }

    function handlePageChangeRiwayatMutasi(page) {
        if (isFilterMutasi) {
            setActivePageMutasi(page);
            filterListRiwayatMutasi(inputHandle.akunPartner, inputMutasi.idTrans, inputMutasi.paymentType, inputMutasi.partnerName, dateRangeInfoMutasi, inputDataMutasi.periodeInfoMutasi, page, inputMutasi.rowPerPage, orderId, orderField, inputMutasi.idReff, inputMutasi.idReffTrans)
        } else {
            setActivePageMutasi(page);
            getListRiwayatMutasi(inputHandle.akunPartner, page, inputMutasi.rowPerPage, orderId, orderField);
        }
    }

    async function getListRiwayatMutasi(partnerId, currentPage, rowPerPage, orderId, orderFieldId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"${partnerId}", "toffshorebank_code":"", "trans_type": 0, "partner_name":"", "date_from":"", "date_to":"", "period":2, "page":${(currentPage !== 0) ? currentPage : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}, "order": ${orderId}, "order_field": "${orderFieldId}", "id_referensi": "", "id_referensi_transaksi": ""}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
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

    async function filterListRiwayatMutasi(partnerId, idTrans, paymentType, partnerName, periode, dateId, page, rowPerPage, orderId, orderField, idReff, idReffTrans) {
        try {
            setPendingMutasi(true)
            setIsFilterMutasi(true)
            setActivePageMutasi(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"${partnerId}", "toffshorebank_code":"${idTrans.length !== 0 ? idTrans : ""}", "trans_type": ${paymentType}, "partner_name":"${partnerName.length !== 0 ? partnerName : ""}", "date_from":"${periode.length !== 0 ? periode[0] : ""}", "date_to":"${periode.length !== 0 ? periode[1] : ""}", "period": ${dateId}, "page":${(page !== 0) ? page : 1}, "row_per_page": ${rowPerPage !== 0 ? rowPerPage : 10}, "order": ${orderId}, "order_field": "${orderField}", "id_referensi": "${idReff.length !== 0 ? idReff : ""}", "id_referensi_transaksi": "${idReffTrans.length !== 0 ? idReffTrans : ""}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
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
        getListRiwayatMutasi(listAkun.partner_id, activePageMutasi, inputMutasi.rowPerPage, orderId, orderField)
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
        history.push("/laporan");
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
                getListRiwayatMutasi(listPartnerAkun.data.response_data[0].partner_id, activePageMutasi, inputMutasi.rowPerPage, orderId, orderField)
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
                getListRiwayatMutasi(listPartnerAkun.data.response_data[0].partner_id, activePageMutasi, inputMutasi.rowPerPage, orderId, orderField)
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

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
          <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          <div>Loading...</div>
        </div>
    );

    useEffect(() => {
        getAkunPartner()
        getListRiwayatMutasi(inputHandle.akunPartner, activePageMutasi, inputMutasi.rowPerPage, orderId, orderField)
        // userDetails()
    }, [])
    // console.log(listMutasi, 'listMutasi');

    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> Laporan</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Sub Account Bank &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;Info Saldo & Mutasi</span> 
            <div className="head-title">
                <div className="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>Info Saldo & Mutasi</div>
            </div>
            {
                listAkunPartner.length !== 0 ?
                <>
                    <div className='base-content-custom px-3 pt-4 pb-4' style={{ width: "38%" }}>
                        <div className="mb-3">Pilih Akun</div>
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
                            <div style={{ fontSize: 14, fontFamily: "Nunito", color: "#888888" }}>Saldo Rekening Sub Account</div>
                            {
                                (dataAkun.length === 0 || dataAkun === null) ? (
                                    <div className='d-flex justify-content-start align-items-center mt-2' style={{ cursor: "pointer" }} onClick={() => formPassword()}>
                                        <img src={iconMata} alt="mata" />
                                        <div className='ms-2' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 16, color: "#077E86", textDecoration: "underline" }}>Klik Untuk Lihat Saldo</div>
                                    </div>
                                ) : (
                                    <>
                                        <div className='mt-2' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 16, color: "#077E86" }}>{convertToRupiah(dataAkun.availablebalance, false, 2)}</div>
                                        <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 12, color: "#888888" }}>Diperbaharui pada : {convertSimpleTimeStamp(dataAkun.timestamp_request, 'saldoRek')}</div>
                                    </>
                                )
                            }
                            <div className='mt-3' style={{ border:"1px solid #C4C4C4", backgroundColor: "#C4C4C4" }} />
                            <div className='mt-3' style={{ fontSize: 12, fontFamily: "Nunito", color: "#888888" }}>No Rekening Sub Account : </div>
                            <div className='mt-2' style={{ fontSize: 12, fontFamily: "Nunito", color: "#383838" }}>{`${inputHandle.nomorAkun} a.n. ${inputHandle.namaAkun}`}</div>
                        </div>
                    </div>
                    <div className="head-title">
                        <div className="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>Mutasi Rekening Sub Account</div>
                    </div>
                    <div className="base-content mt-3">
                        <span className="font-weight-bold mb-4" style={{ fontWeight: 700, fontFamily: "Exo", fontSize: 16 }}>
                            Filter
                        </span>
                        <Row className="mt-4">
                            <Col
                                xs={4}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <div>ID Referensi Bank</div>
                                <input
                                    name="idReff"
                                    value={inputMutasi.idReff}
                                    onChange={(e) => handleChangeMutasi(e)}
                                    type="text"
                                    className="input-text-sub"
                                    placeholder="Masukkan ID Referensi"
                                />
                            </Col>
                            <Col
                                xs={4}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <div>ID Transaksi</div>
                                <input
                                    name="idTrans"
                                    value={inputMutasi.idTrans}
                                    onChange={(e) => handleChangeMutasi(e)}
                                    type="text"
                                    className="input-text-sub"
                                    placeholder="Masukkan ID Transaksi"
                                />
                            </Col>
                            <Col
                                xs={4}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <div>ID Referensi Transaksi</div>
                                <input
                                    name="idReffTrans"
                                    value={inputMutasi.idReffTrans}
                                    onChange={(e) => handleChangeMutasi(e)}
                                    type="text"
                                    className="input-text-sub"
                                    placeholder="Masukkan ID Referensi Transaksi"
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col
                                xs={4}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <div>Jenis Transaksi</div>
                                <Form.Select
                                    name="paymentType"
                                    value={inputMutasi.paymentType}
                                    onChange={(e) => handleChangeMutasi(e)}
                                    className="input-text-sub"
                                    placeholder='Pilih Jenis Transaksi'
                                >
                                    <option value={0}>Pilih Jenis Transaksi</option>
                                    <option value={1}>Transaksi Masuk ( cr )</option>
                                    <option value={2}>Transaksi Keluar ( db )</option>
                                    <option value={3}>Biaya Admin</option>
                                </Form.Select>
                            </Col> 
                            <Col
                                xs={4}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <div>Periode <span style={{ color: "red" }}>*</span></div>
                                <Form.Select
                                    name="periodeInfoMutasi"
                                    className="input-text-sub"
                                    value={inputDataMutasi.periodeInfoMutasi}
                                    onChange={(e) => handleChangePeriodeMutasi(e)}
                                >
                                    <option defaultChecked disabled value={0}>Pilih Periode</option>
                                    <option value={2}>Hari Ini</option>
                                    <option value={3}>Kemarin</option>
                                    <option value={4}>7 Hari Terakhir</option>
                                    <option value={7}>Pilih Range Tanggal</option>
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
                                    <Col xs={6} style={{ width: "unset" }}>
                                        <button 
                                            className={((inputDataMutasi.periodeInfoMutasi === "2") || (inputDataMutasi.periodeInfoMutasi === "3") || (inputDataMutasi.periodeInfoMutasi === "4") || (inputDataMutasi.periodeInfoMutasi !== 0 && (inputDataMutasi.periodeInfoMutasi === "7" && dateRangeInfoMutasi.length !== 0))) ? 'btn-ez-on' : 'btn-noez-transfer'}
                                            disabled={inputDataMutasi.periodeInfoMutasi === 0 || (inputDataMutasi.periodeInfoMutasi === "7" && dateRangeInfoMutasi.length === 0)}
                                            onClick={() => filterListRiwayatMutasi(inputHandle.akunPartner, inputMutasi.idTrans, inputMutasi.paymentType, inputMutasi.partnerName, dateRangeInfoMutasi, inputDataMutasi.periodeInfoMutasi, 1, 10, orderId, orderField, inputMutasi.idReff, inputMutasi.idReffTrans)}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button 
                                            className={(inputDataMutasi.periodeInfoMutasi !== 0) ? 'btn-reset' : 'btn-ez-reset'}
                                            disabled={(inputDataMutasi.periodeInfoMutasi === 0 )}
                                            onClick={() => resetButtonHandle()}
                                        >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <div className="div-table mt-4 pb-4" style={{ paddingBottom: 20, marginBottom: 20, display: "flex", justifyContent: "center" }}>
                            <div id="tableInvoice" style={{  overflowX: "auto" }} className=" table-bordered mt-3">
                                {
                                    dataMutasi.length !== 0 ? (
                                        <>
                                            <table className='table mt-3'>
                                                <thead style={{ borderStyle: "hidden", fontWeight: 600 }}>
                                                    <tr>
                                                        <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>No</th>
                                                        {!idTrans.isDesc ? <th onClick={() => handleClickSort(idTrans.id, "toffshorebank_code", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer" }}>ID Transaksi <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idTrans.id, "toffshorebank_code", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer" }}>ID Transaksi <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2'/></span></th>}
                                                        {!idReffBank.isDesc ? <th onClick={() => handleClickSort(idReffBank.id, "id_referensi", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Bank <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffBank.id, "id_referensi", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Bank <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                        {!idReffTrans.isDesc ? <th onClick={() => handleClickSort(idReffTrans.id, "id_referensi_transaksi", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Transaksi <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffTrans.id, "id_referensi_transaksi", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Transaksi <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                        {!dates.isDesc ? <th onClick={() => handleClickSort(dates.id, "toffshorebank_crtdt", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>Waktu <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(dates.id, "toffshorebank_crtdt", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>Waktu <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                        <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Jenis Transaksi</th>
                                                        <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Rekening Tujuan</th>
                                                        <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Nominal</th>
                                                        <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Deskripsi</th>
                                                        <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Keterangan</th>
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
                                                        <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>No</th>
                                                        {!idTrans.isDesc ? <th onClick={() => handleClickSort(idTrans.id, "toffshorebank_code", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer" }}>ID Transaksi <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idTrans.id, "toffshorebank_code", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer" }}>ID Transaksi <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2'/></span></th>}
                                                        {!idReffBank.isDesc ? <th onClick={() => handleClickSort(idReffBank.id, "id_referensi", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Bank <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffBank.id, "id_referensi", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Bank <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                        {!idReffTrans.isDesc ? <th onClick={() => handleClickSort(idReffTrans.id, "id_referensi_transaksi", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Transaksi <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(idReffTrans.id, "id_referensi_transaksi", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>ID Referensi Transaksi <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                        {!dates.isDesc ? <th onClick={() => handleClickSort(dates.id, "toffshorebank_crtdt", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>Waktu <span><FontAwesomeIcon icon={faSortUp} size="lg" className='ms-2' /></span></th> : <th onClick={() => handleClickSort(dates.id, "toffshorebank_crtdt", isFilterMutasi)} style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838", cursor: "pointer"  }}>Waktu <span><FontAwesomeIcon icon={faSortDown} size="lg" className='ms-2' /></span></th>}
                                                        <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Jenis Transaksi</th>
                                                        <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Rekening Tujuan</th>
                                                        <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Nominal</th>
                                                        <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Deskripsi</th>
                                                        <th style={{ textTransform: "none", background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Keterangan</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            {!pendingMutasi ? <div className='text-center pb-3' style={{ color: '#393939' }}>Tidak ada data</div> : <div className='text-center'><CustomLoader /></div>}
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
                                Total Page: {totalPageMutasi}
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

            <Modal className="saldo-sub-acc" size="xs" centered show={loginToSaldo} onHide={() => setLoginToSaldo(false)}>
                <Modal.Title className="mt-4 text-center px-3" style={{ fontFamily: 'Exo', fontSize: 24, fontWeight: 700 }}>
                    Masukkan Kata Sandi Login Anda 
                </Modal.Title>
                <Modal.Body >
                    <div className=' mt-2' style={{ padding: "0px 24px"}}>
                        <div style={{ fontSize: 14, fontFamily: "Nunito" }}>Kata Sandi</div>
                        <div className='d-flex justify-content-center align-items-center text-center mt-1 position-relative' >
                            <input value={inputPass.passwordRek} name="passwordRek" type={passwordInputType} onChange={handleChangePass} className='input-text-saldo-sub-acc' placeholder='Masukkan Kata Sandi' style={{width: "100%", borderColor: errMsg.length !== 0 ? "#B9121B" : "#C4C4C4"}} />
                            <img onClick={() => togglePassword()} src={eyeIcon} alt="eye icon" className='position-absolute right-0 me-2' style={{ cursor: "pointer" }} />
                        </div>
                    </div>
                    <div className='text-center'>
                        {
                            errMsg.length !== 0 ? (
                                <div className='d-flex justify-content-center align items-center mt-3'>
                                    <img src={noteIconError} alt="icon error" />
                                    <div style={{ color: "#B9121B", fontFamily: "Nunito", fontSize: 14 }} className='ms-2'>Kata Sandi Salah</div>
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
                            Lihat Saldo
                        </button>
                    </div>
                </Modal.Body>
            </Modal>


            <Modal className="history-modal" size="xs" centered show={showSaldoSubAcc} onHide={() => setShowSaldoSubAcc(false)}>
                <Modal.Title className="mt-4 text-center px-3" style={{ fontFamily: 'Exo', fontSize: 24, fontWeight: 700 }}>
                    Saldo Rekening Sub Account 
                </Modal.Title>
                <Modal.Body>
                    {
                        pendingSaldo === true ?
                        <div className='d-flex justify-content-center align-items-center'>
                            <CustomLoader/>
                        </div> :
                        <>
                            <div className='text-center' style={{ fontSize: 14, fontWeight: 400, color: "#383838", fontFamily: "Nunito" }}>Nominal Saldo Saat Ini</div>
                            <div className='text-center mt-2' style={{ fontSize: 12, fontWeight: 400, color: "#888888", fontFamily: "Nunito" }}>{convertDateAndTimeInfoDanSaldo(dataAkun.timestamp_request)}</div>
                            <div className='text-center mt-2' style={{color: "#077E86", fontSize: 20, fontFamily: "Exo", fontWeight: 700 }}>{convertToRupiah(dataAkun.availablebalance, true, 2)}</div>
                            <div className='text-center mt-3' style={{color: "#888888", fontSize: 12, fontFamily: "Nunito", fontWeight: 400 }}>No. Rekening: {dataAkun.account_number} a.n {dataAkun.account_name}</div>
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
                                    Oke
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