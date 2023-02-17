import React from 'react'
import { useHistory } from 'react-router-dom'
import { BaseURL, convertDateAndTimeInfoDanSaldo, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import SubAccountComponent from '../../components/SubAccountComponent'
import { Col, Form, Image, Modal, Row } from '@themesberg/react-bootstrap'
import iconMata from "../../assets/icon/toggle_mata_icon.svg"
import DataTable from 'react-data-table-component'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg";
import { useState } from 'react'
// import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { DateRangePicker } from 'rsuite'
import encryptData from '../../function/encryptData'
import axios from 'axios'
import { useEffect } from 'react'
import triangleInfo from "../../assets/icon/triangle-info.svg"
import InfiniteScroll from 'react-infinite-scroll-component'
import Pagination from 'react-js-pagination'

const InfoSaldoDanMutasi = () => {
    const history = useHistory()
    const user_role = getRole()
    const [showSaldoSubAcc, setShowSaldoSubAcc] = useState(false)
    const [listAkunPartner, setListAkunPartner] = useState([])
    const [dataAkun, setDataAkun] = useState([])
    const [listMutasi, setListMutasi] = useState([])
    const [pageMutasi, setPageMutasi] = useState({})
    const [pendingMutasi, setPendingMutasi] = useState(true)
    const [pendingSaldo, setPendingSaldo] = useState(true)
    const [dataMutasi, setDataMutasi] = useState([])
    const [pageNumberMutasi, setPageNumberMutasi] = useState({})
    const [activePageMutasi, setActivePageMutasi] = useState(1)
    const [totalPageMutasi, setTotalPageMutasi] = useState(0)
    const [isFilterMutasi, setIsFilterMutasi] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const [dateRangeInfoMutasi, setDateRangeInfoMutasi] = useState([])
    const [showDateInfoMutasi, setShowDateInfoMutasi] = useState("none")
    const [stateInfoMutasi, setStateInfoMutasi] = useState(null)
    const [orderId, setOrderId] = useState(0);
    const [orderField, setOrderField] = useState("");
    const [inputMutasi, setInputMutasi] = useState({
        idTrans: "",
        idReff: "",
        idReffTrans: "",
        paymentType: 0,
        partnerName: ""
    })
    console.log(activePageMutasi, 'activePageMutasi');
    console.log(dataMutasi, 'dataMutasi');
    console.log(pageNumberMutasi, 'pageNumberMutasi');
    console.log(totalPageMutasi, 'totalPageMutasi');
    console.log(dateRangeInfoMutasi, 'dateRangeInfoMutasi');
    console.log(showDateInfoMutasi, 'showDateInfoMutasi');
    console.log(stateInfoMutasi, 'stateInfoMutasi');

    async function getListRiwayatMutasi(currentPage) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"", "toffshorebank_code":"", "trans_type": 0, "partner_name":"", "date_from":"2022-12-20", "date_to":"2022-12-26", "period":7, "page":${(currentPage < 1) ? 1 : currentPage}, "row_per_page":10, "order": 0, "order_field": "id_referensi", "id_referensi": "", "id_referensi_transaksi": ""}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listDataMutasi = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
            console.log(listDataMutasi, "ini data riwayat");
            if (listDataMutasi.data.response_code === 200 && listDataMutasi.status === 200 && listDataMutasi.data.response_new_token.length === 0) {
                listDataMutasi.data.response_data.results = listDataMutasi.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
                setDataMutasi(listDataMutasi.data.response_data.results)
                setPageNumberMutasi(listDataMutasi.data.response_data)
                setTotalPageMutasi(listDataMutasi.data.response_data.max_page)
            } else if (listDataMutasi.data.response_code === 200 && listDataMutasi.status === 200 && listDataMutasi.data.response_new_token.length !== 0) {
                setUserSession(listDataMutasi.data.response_new_token)
                listDataMutasi.data.response_data.results = listDataMutasi.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
                setDataMutasi(listDataMutasi.data.response_data.results)
                setPageNumberMutasi(listDataMutasi.data.response_data)
                setTotalPageMutasi(listDataMutasi.data.response_data.max_page)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    async function filterListRiwayatMutasi(idTrans, paymentType, partnerName, periode, dateId, page, rowPerPage, orderId, orderField, idReff, idReffTrans) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"", "toffshorebank_code":"${idTrans.length !== 0 ? idTrans : ""}", "trans_type": ${paymentType}, "partner_name":"${partnerName.length !== 0 ? partnerName : ""}", "date_from":"${periode.length !== 0 ? periode[0] : ""}", "date_to":"${periode.length !== 0 ? periode[1] : ""}", "period": ${dateId}, "page":${(page !== 0) ? page : 1}, "row_per_page": ${rowPerPage !== 0 ? rowPerPage : 10}, "order": ${orderId}, "order_field": "${orderField}", "id_referensi": "${idReff}", "id_referensi_transaksi": "${idReffTrans}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listDataMutasi = await axios.post(BaseURL + "/SubAccount/HistoryPartnerSubAccount", { data: dataParams }, { headers: headers })
            console.log(listDataMutasi, "ini data riwayat");
            if (listDataMutasi.data.response_code === 200 && listDataMutasi.status === 200 && listDataMutasi.data.response_new_token.length === 0) {
                listDataMutasi.data.response_data.results = listDataMutasi.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
                setDataMutasi(listDataMutasi.data.response_data.results)
                setPageNumberMutasi(listDataMutasi.data.response_data)
                setTotalPageMutasi(listDataMutasi.data.response_data.max_page)
            } else if (listDataMutasi.data.response_code === 200 && listDataMutasi.status === 200 && listDataMutasi.data.response_new_token.length !== 0) {
                setUserSession(listDataMutasi.data.response_new_token)
                listDataMutasi.data.response_data.results = listDataMutasi.data.response_data.results.map((obj, id) => ({ ...obj, number: id + 1 }));
                setDataMutasi(listDataMutasi.data.response_data.results)
                setPageNumberMutasi(listDataMutasi.data.response_data)
                setTotalPageMutasi(listDataMutasi.data.response_data.max_page)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    function handlePageChangeRiwayatMutasi(page) {
        if (isFilterMutasi) {
            setActivePageMutasi(page);
            filterListRiwayatMutasi()
        } else {
            setActivePageMutasi(page);
            getListRiwayatMutasi(page);
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
        console.log(item, "item");
        setStateInfoMutasi(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA').split("").join(""))
          setDateRangeInfoMutasi(item)
        }
    }

    function handleChangeMutasi(e) {
        setInputMutasi({
            ...inputMutasi,
            [e.target.name] : e.target.value
        })
    }
    
    async function fetchMoreData() {
        getListMutasi(inputHandle.akunPartner, pageMutasi.next_record, pageMutasi.matched_record)
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
                console.log('masuk log error');
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
    console.log(inputHandle.akunPartner, "partner id ");
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
        getListMutasi(listAkun.partner_id)
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
            // listPartnerAkun.data.response_data = listPartnerAkun.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setListAkunPartner(listPartnerAkun.data.response_data)
            if (listPartnerAkun.data.response_data.length !== 0) {
                setInputHandle({
                    ...inputHandle,
                    akunPartner: listPartnerAkun.data.response_data[0].partner_id,
                    nomorAkun: listPartnerAkun.data.response_data[0].account_number,
                    namaAkun: listPartnerAkun.data.response_data[0].account_name,
                })
                getListMutasi(listPartnerAkun.data.response_data[0].partner_id, pageMutasi.next_record, pageMutasi.matched_record)
            }
          } else if (listPartnerAkun.status === 200 && listPartnerAkun.data.response_code === 200 && listPartnerAkun.data.response_new_token.length !== 0) {
            setUserSession(listPartnerAkun.data.response_new_token)
            // listPartnerAkun.data.response_data = listPartnerAkun.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setListAkunPartner(listPartnerAkun.data.response_data)
            if (listPartnerAkun.data.response_data.length !== 0) {
                setInputHandle({
                    ...inputHandle,
                    akunPartner: listPartnerAkun.data.response_data[0].partner_id,
                    nomorAkun: listPartnerAkun.data.response_data[0].account_number,
                    namaAkun: listPartnerAkun.data.response_data[0].account_name,
                })
            }
          }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function getInfoSaldo(partnerId) {
        try {
            setPendingSaldo(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"partner_dtl_id":"${partnerId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataAkunPartner = await axios.post(BaseURL + "/SubAccount/GetBalancePartner", { data: dataParams }, { headers: headers })
            console.log(dataAkunPartner, "data akun partner")
            if (dataAkunPartner.status === 200 && dataAkunPartner.data.response_code === 200 && dataAkunPartner.data.response_new_token.length === 0) {
                setDataAkun(dataAkunPartner.data.response_data)
                setPendingSaldo(false)
            } else if (dataAkunPartner.status === 200 && dataAkunPartner.data.response_code === 200 && dataAkunPartner.data.response_new_token.length !== 0) {
                setUserSession(dataAkunPartner.data.response_new_token)
                setDataAkun(dataAkunPartner.data.response_data)
                setPendingSaldo(false)
            }
        } catch (error) {
          console.log(error)
            // RouteTo(errorCatch(error.response.status))
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
            console.log(mutasiList, "DATA MUTASI LIST")
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
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            if (error.response.status === 400 && error.response.data.response_code === 400) {
                console.log('masuk log error');
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
            console.log(mutasiListFilter, "DATA MUTASI LIST FILTER")
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
          console.log(error)
            // RouteTo(errorCatch(error.response.status))
            if (error.response.status === 400 && error.response.data.response_code === 400) {
                console.log('masuk log error');
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
        setStateInfoMutasi(null)
        setDateRangeInfoMutasi([])
        setShowDateInfoMutasi("none")
    }

    function toSeeSaldo () {
        setShowSaldoSubAcc(true)
        getInfoSaldo(inputHandle.akunPartner)
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
        getListRiwayatMutasi(activePageMutasi)
        // userDetails()
        getAkunPartner()
    }, [])
    console.log(listMutasi, 'listMutasi');

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
                            <div className='d-flex justify-content-start align-items-center mt-2' style={{ cursor: "pointer" }} onClick={toSeeSaldo}>
                                <img src={iconMata} alt="mata" />
                                <div className='ms-2' style={{ fontFamily: 'Exo', fontWeight: 700, fontSize: 16, color: "#077E86", textDecoration: "underline" }}>Klik Untuk Lihat Saldo</div>
                            </div>
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
                                <div>ID Referensi</div>
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
                                    name="idReff"
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
                                    name="fiturTransaksi"
                                    value={inputHandle.paymentType}
                                    onChange={(e) => handleChangeMutasi(e)}
                                    className="input-text-sub"
                                    placeholder='Pilih Jenis Transaksi'
                                >
                                    <option value={0}>Pilih Jenis Transaksi</option>
                                    <option value={1}>Transaksi Masuk ( cr )</option>
                                    <option value={2}>Transaksi Keluar ( db )</option>
                                </Form.Select>
                            </Col> 
                            <Col
                                xs={4}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <div>Periode</div>
                                <Form.Select
                                    name="periodeInfoMutasi"
                                    className="input-text-sub"
                                    value={inputDataMutasi.periodeInfoMutasi}
                                    onChange={(e) => handleChangePeriodeMutasi(e)}
                                >
                                    <option defaultChecked disabled value={0}>Pilih Periode</option>
                                    <option value={1}>Hari Ini</option>
                                    <option value={2}>Kemarin</option>
                                    <option value={3}>7 Hari Terakhir</option>
                                    <option value={7}>Pilih Range Tanggal</option>
                                </Form.Select>
                            </Col>
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
                                            className={(inputDataMutasi.periodeInfoMutasi !== 0 || dateRangeInfoMutasi.length !== 0) ? 'btn-ez-on' : 'btn-noez-transfer'}
                                            disabled={inputDataMutasi.periodeInfoMutasi === 0}
                                            onClick={() => filterListRiwayatMutasi(inputMutasi.idTrans, inputMutasi.paymentType, inputMutasi.partnerName, dateRangeInfoMutasi, inputDataMutasi.periodeInfoMutasi, 1, 10, orderId, orderField, inputMutasi.idReff, inputMutasi.idReffTrans)}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button 
                                            className={(inputDataMutasi.periodeInfoMutasi !== 0 || dateRangeInfoMutasi.length !== 0) ? 'btn-reset' : 'btn-ez-reset'}
                                            disabled={inputDataMutasi.periodeInfoMutasi === 0}
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
                                        <table className='table mt-3'>
                                            <thead style={{ borderStyle: "hidden", fontWeight: 600 }}>
                                                <tr>
                                                    <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>No</th>
                                                    <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>ID Transaksi</th>
                                                    <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>ID Referensi Bank</th>
                                                    <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>ID Referensi Transaksi</th>
                                                    <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>Waktu</th>
                                                    <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>Jenis Transaksi</th>
                                                    <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>Rekening Tujuan</th>
                                                    <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>Nominal</th>
                                                    <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>Deskripsi</th>
                                                    <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838" }}>Keterangan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-group-divider">
                                                {
                                                    dataMutasi.map((item, idx) => (
                                                        <tr key={idx} style={{ borderStyle: "hidden" }}>
                                                            <td style={{ textAlign: "center", padding: "0.75rem 1rem" }}>{ idx+1 }</td>
                                                            <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_code }</td>
                                                            <td style={{ padding: "0.75rem 1rem" }}>{ item.id_referensi }</td>
                                                            <td style={{ textAlign: "center", padding: "0.75rem 1rem" }}>{ item.id_referensi_transaksi === null ? '-' : item.id_referensi_transaksi }</td>
                                                            <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_crtdt }</td>
                                                            <td style={{ padding: "0.75rem 1rem" }}>{ item.moffshorebank_type_name }</td>
                                                            <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_account }</td>
                                                            <td style={{ padding: "0.75rem 1rem" }}>{ item.offshore_amount }</td>
                                                            <td style={{ padding: "0.75rem 1rem" }}>{ item.toffshorebank_desc }</td>
                                                            <td style={{ padding: "0.75rem 1rem" }}>{ item.keterangan === null ? "-" : item.keterangan }</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    ) : (
                                        <>
                                            <table className='table mt-3'>
                                                <thead style={{ borderStyle: "hidden", fontWeight: 600, }}>
                                                    <tr>
                                                        <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>No</th>
                                                        <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>ID Transaksi</th>
                                                        <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>ID Referensi Bank</th>
                                                        <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>ID Referensi Transaksi</th>
                                                        <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Waktu</th>
                                                        <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Jenis Transaksi</th>
                                                        <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Rekening Tujuan</th>
                                                        <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Nominal</th>
                                                        <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Deskripsi</th>
                                                        <th style={{ background: "#F3F4F5", fontFamily: "Exo", fontSize: 14, color: "#383838"  }}>Keterangan</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            <div className='text-center' style={{ color: '#393939' }}>Tidak ada data</div>
                                        </>
                                    )
                                }
                            </div>

                            <div id="scrollableDiv" style={{ height: 490, overflow: "auto" }} className='fixed-header-table'>
                                {/* <InfiniteScroll
                                    dataLength={listMutasi.length}
                                    next={fetchMoreData}
                                    hasMore={pageMutasi.next_record === "Y" ? true : false}
                                    loader={<div style={{ textAlign: 'center' }}><CustomLoader /></div>}
                                    scrollableTarget="scrollableDiv"
                                >
                                    {
                                        pendingMutasi ?
                                        <div className='d-flex justify-content-center'><CustomLoader /></div> :
                                        <div id='table-body' >
                                            {
                                                dataMutasi.length !== 0 ? (
                                                    <table className='table mt-3'>
                                                        <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>ID Transaksi</th>
                                                                <th>ID Referensi Bank</th>
                                                                <th>ID Referensi Transaksi</th>
                                                                <th>Waktu</th>
                                                                <th>Jenis Transaksi</th>
                                                                <th>Rekening Tujuan</th>
                                                                <th>Nominal</th>
                                                                <th>Deskripsi</th>
                                                                <th>Keterangan</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                dataMutasi.map((item, idx) => (
                                                                    <tr key={idx} classNamems="ms-2">
                                                                        <td>{ idx+1 }</td>
                                                                        <td>{ item.toffshorebank_code }</td>
                                                                        <td>{ item.id_referensi }</td>
                                                                        <td>{ item.id_referensi_transaksi === null ? '-' : item.id_referensi_transaksi }</td>
                                                                        <td>{ item.toffshorebank_crtdt }</td>
                                                                        <td>{ item.moffshorebank_type_name }</td>
                                                                        <td>{ item.toffshorebank_account }</td>
                                                                        <td>{ item.offshore_amount }</td>
                                                                        <td>{ item.toffshorebank_desc }</td>
                                                                        <td>{ item.keterangan === null ? "-" : item.keterangan }</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <>
                                                        <table className='table mt-3'>
                                                            <thead>
                                                                <tr>
                                                                    <th>No</th>
                                                                    <th>ID Referensi</th>
                                                                    <th>Waktu</th>
                                                                    <th>Nominal</th>
                                                                    <th>Keterangan</th>
                                                                </tr>
                                                            </thead>
                                                        </table>
                                                        <div className='text-center' style={{ color: errMsg.length !== 0 && '#B9121B' }}>{errMsg.length === 0 ? "Tidak ada data" : `${errMsg} - Please Contact Your Admin`}</div>
                                                        <div className='text-center' style={{ color: errMsg.length !== 0 && '#B9121B' }}>Tidak ada data</div>
                                                    </>
                                                )
                                            }
                                        </div>
                                    }
                                </InfiniteScroll> */}
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