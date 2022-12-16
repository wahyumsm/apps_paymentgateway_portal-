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

const InfoSaldoDanMutasi = () => {
    const history = useHistory()
    const user_role = getRole()
    const [showSaldoSubAcc, setShowSaldoSubAcc] = useState(false)
    const [listAkunPartner, setListAkunPartner] = useState([])
    const [dataAkun, setDataAkun] = useState([])
    const [listMutasi, setListMutasi] = useState([])
    const [pageMutasi, setPageMutasi] = useState({})
    const [userId, setUserId] = useState([])
    const [pendingMutasi, setPendingMutasi] = useState(true)
    const [pendingSaldo, setPendingSaldo] = useState(true)
    const fetchMoreData = () => {
        setTimeout(() => {
            if (pageMutasi.next_record !== "N") {
                setListMutasi(listMutasi.concat(listMutasi))
            }
        },1000)
    }

    console.log(listMutasi, 'listMutasi');

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
    const [dateRangeInfoMutasi, setDateRangeInfoMutasi] = useState([])
    const [showDateInfoMutasi, setShowDateInfoMutasi] = useState("none")
    const [stateInfoMutasi, setStateInfoMutasi] = useState(null)

    function handleChange(e, listAkun) {
        listAkun = listAkun.find(item => item.partner_id === e.target.value)
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.value,
            nomorAkun: listAkun.account_number,
            namaAkun: listAkun.account_name,
        });
    }

    function loadFunc (page) {
        console.log(page, "data load")
    }

    function toDashboard() {
        history.push("/");
    }

    function toLaporan() {
        history.push("/laporan");
    }

    const columns = [
        {
            name: 'No',
            selector: row => row.number,
            width: '60px'
        },
        {
            name: 'ID Referensi',
            selector: row => row.Id_referensi,
        },
        {
            name: 'Waktu',
            selector: row => row.waktu,
        },
        {
            name: 'Nominal',
            selector: row => row.debit_credit === "D" ? '- ' + convertToRupiah(Number(row.nominal.replace(",", ".")), true, 2) : '+ ' + convertToRupiah(Number(row.nominal.replace(",", ".")), true, 2),
            conditionalCellStyles: [
                {
                    when: row => row.debit_credit === "D",
                    style: { color: "#B9121B" }
                },
                {
                    when: row => row.debit_credit === "C",
                    style: { color: "#077E86" }
                }
            ]
        },
        {
            name: 'Keterangan',
            selector: row => row.keterangan,
        },
    ]

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
            setInputHandle({
                ...inputHandle,
                akunPartner: listPartnerAkun.data.response_data[0].partner_id,
                nomorAkun: listPartnerAkun.data.response_data[0].account_number,
                namaAkun: listPartnerAkun.data.response_data[0].account_name,
            })
          } else if (listPartnerAkun.status === 200 && listPartnerAkun.data.response_code === 200 && listPartnerAkun.data.response_new_token.length !== 0) {
            setUserSession(listPartnerAkun.data.response_new_token)
            // listPartnerAkun.data.response_data = listPartnerAkun.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setListAkunPartner(listPartnerAkun.data.response_data)
            setInputHandle({
                ...inputHandle,
                akunPartner: listPartnerAkun.data.response_data[0].partner_id,
                nomorAkun: listPartnerAkun.data.response_data[0].account_number,
                namaAkun: listPartnerAkun.data.response_data[0].account_name,
            })
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

    async function getListMutasi(partnerId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"subpartner_id":"${partnerId}", "start_date":"20220403", "end_date":"20220410", "date_id":7, "page":{"max_record":"10", "next_record":"N", "matched_record":"0"}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const mutasiList = await axios.post(BaseURL + "/SubAccount/GetAccountStatement", { data: dataParams }, { headers: headers })
            console.log(mutasiList, "DATA MUTASI LIST")
            if (mutasiList.status === 200 && mutasiList.data.response_code === 200 && mutasiList.data.response_new_token.length === 0) {
                mutasiList.data.response_data.data.forEach((obj, idx) => {
                    obj.number = idx + 1
                    let year = obj.waktu.slice(0, 4)
                    let month = obj.waktu.slice(4, 6)
                    let day = obj.waktu.slice(6, 8)
                    obj.waktu = `${day}/${month}/${year}`
                });
                setListMutasi(mutasiList.data.response_data.data)
                setPageMutasi(mutasiList.data.response_data.pages)
                setPendingMutasi(false)
            } else if (mutasiList.status === 200 && mutasiList.data.response_code === 200 && mutasiList.data.response_new_token.length !== 0) {
                mutasiList.data.response_data.data.forEach((obj, idx) => {
                    obj.number = idx + 1
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
            history.push(errorCatch(error.response.status))
            setPendingMutasi(false)
            
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
            history.push(errorCatch(error.response.status))
        }
    }

    async function userDetails() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const userDetail = await axios.post(BaseURL + "/Account/GetUserProfile", { data: "" }, { headers: headers })
            console.log(userDetail, 'ini user detal funct');
            if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length === 0) {
                setUserId(userDetail.data.response_data.muser_partnerdtl_id)
                getListMutasi(userDetail.data.response_data.muser_partnerdtl_id)
            } else if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length !== 0) {
                setUserSession(userDetail.data.response_new_token)
                setUserId(userDetail.data.response_data.muser_partnerdtl_id)
                getListMutasi(userDetail.data.response_data.muser_partnerdtl_id)
            }
        } catch (error) {
            // console.log(error);
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

    function pickDateInfoMutasi(item) {
        console.log(item, "item");
        setStateInfoMutasi(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA').split("-").join(""))
          setDateRangeInfoMutasi(item)
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
        userDetails()
        getAkunPartner()
    }, [])
    

    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> Laporan</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Sub Account Bank &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;Info Saldo & Mutasi</span> 
            <div className="head-title">
                <div className="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>Info Saldo & Mutasi</div>
            </div>
            {/* <SubAccountComponent/> */}
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
                    <Col xs={4} className='d-flex justify-content-center align-items-center' >
                        <div style={{ display: showDateInfoMutasi }}>
                            <DateRangePicker
                                value={stateInfoMutasi}
                                ranges={column}
                                onChange={(e) => pickDateInfoMutasi(e)}
                                character=' - '
                                cleanable={true}
                                placement='bottomStart'
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
                    {/* <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span>Jenis Transaksi</span>
                        <Form.Select name='fiturDanaMasuk' className='input-text-ez' style={{ display: "inline" }}>
                            <option defaultValue value={0}>Semua</option>
                            <option value={1}>Transaksi Masuk ( cr )</option>
                            <option value={2}>Transaksi Keluar ( db )</option>
                        </Form.Select>
                    </Col> */}
                </Row>
                <Row className='mt-3'>
                    <Col xs={5}>
                        <Row>
                            <Col xs={6} style={{ width: "unset" }}>
                                <button 
                                    className='btn-ez-on'
                                    onClick={() => filterGetListMutasi(userId, dateRangeInfoMutasi, inputDataMutasi.periodeInfoMutasi, pageMutasi.next_record, pageMutasi.matched_record)}
                                >
                                    Terapkan
                                </button>
                            </Col>
                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                <button 
                                    className='btn-reset'
                                    onClick={() => resetButtonHandle()}
                                >
                                    Atur Ulang
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="div-table table-transfer mt-4 pb-4">
                    <DataTable
                        columns={columns}
                        data={listMutasi}
                        customStyles={customStyles}
                        progressPending={pendingMutasi}
                        progressComponent={<CustomLoader />}
                        persistTableHead
                        fixedHeader={true}
                        fixedHeaderScrollHeight="500px"
                        // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                    />
                </div>
            </div>
            <div id="scrollableDiv" style={{ height: 300, overflow: "auto" }}>
                <InfiniteScroll
                    dataLength={listMutasi.length}
                    next={fetchMoreData}
                    hasMore={pageMutasi.next_record === "Y" ? true : false}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="scrollableDiv"
                >
                    {listMutasi.map((item, idx) => (
                        <div style={style} key={idx}>
                            div - #{item.nominal}
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
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