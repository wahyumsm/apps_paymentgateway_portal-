import React, { useMemo } from 'react'
import SubAccountComponent from '../../components/SubAccountComponent'
import { useHistory } from 'react-router-dom'
import { BaseURL, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Button, Col, Form, FormControl, Image, Modal, Row } from '@themesberg/react-bootstrap'
import noteIconRed from "../../assets/icon/note_icon_red.svg";
import chevron from "../../assets/icon/chevron_down_icon.svg"
import { useState } from 'react'
import search from "../../assets/icon/search_icon.svg"
import DataTable from 'react-data-table-component'
import { agenLists} from '../../data/tables'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import noteIconGreen from "../../assets/icon/note_icon_green.svg"
import transferSuccess from "../../assets/icon/berhasiltopup_icon.svg"
import transferFailed from "../../assets/icon/gagaltopup_icon.svg"
import OtpInput from 'react-otp-input'
import axios from 'axios'
import { useEffect } from 'react'
import FilterSubAccount from '../../components/FilterSubAccount'
import Countdown from 'react-countdown'

const TransferSubAccount = () => {
    const history = useHistory()
    const user_role = getRole()
    const [showDaftarRekening, setShowDaftarRekening] = useState(false)
    const [showBank, setShowBank] = useState(false)
    const [showTransfer, setShowTransfer] = useState(false)
    const [showModalInputCode, setShowModalInputCode] = useState(false)
    const [toCountdown, setToCountdown] = useState(false)
    const [showTransferBerhasil, setShowTransferBerhasil] = useState(false)
    const [otp, setOtp] = useState('')
    const renderer = ({ hours, minutes, seconds }) => {  return <span>{seconds}</span>; }
    const [listBank, setListBank] = useState([])
    const [listRekening, setListRekening] = useState([])
    const [listAkunPartner, setListAkunPartner] = useState([])
    const [filterTextBank, setFilterTextBank] = useState('')
    const [filterTextRekening, setFilterTextRekening] = useState('')
    const filterItemsBank = listBank.filter(
        item => (item.mbank_name && item.mbank_name.toLowerCase().includes(filterTextBank.toLowerCase())) || (item.mbank_code && item.mbank_code.toLowerCase().includes(filterTextBank.toLowerCase()))
    )
    const filterItemsRekening = listRekening.filter(
        item => (item.moffshorebankacclist_name && item.moffshorebankacclist_name.toLowerCase().includes(filterTextRekening.toLowerCase())) || (item.moffshorebankacclist_number && item.moffshorebankacclist_number.toLowerCase().includes(filterTextRekening.toLowerCase()))
    )
    const [inputHandle, setInputHandle] = useState({
        akunPartner: ""
    })

    const [inputData, setInputData] = useState({
        bankName: "",
        bankCode: ""
    })

    const [inputDataRekening, setInputDataRekening] = useState({
        noRek: ""
    })

    const subHeaderComponentMemoBank = useMemo(() => {
        // const handleClear = () => {
        //     if (filterText) {
        //         setResetPaginationToggle(!resetPaginationToggle);
        //         setFilterText('');
        //     }
        // };
        return (
            <FilterSubAccount filterText={filterTextBank} onFilter={e => setFilterTextBank(e.target.value)} title="Cari Data Bank :" placeholder="Masukkan Nama / Kode Bank" />
        );	}, [filterTextBank]
    );

    const subHeaderComponentMemoRekening = useMemo(() => {
        // const handleClear = () => {
        //     if (filterText) {
        //         setResetPaginationToggle(!resetPaginationToggle);
        //         setFilterText('');
        //     }
        // };
        return (
            <FilterSubAccount filterText={filterTextRekening} onFilter={e => setFilterTextRekening(e.target.value)} title="Cari Data Bank :" placeholder="Masukkan Nama / No Rekening Bank" />
        );	}, [filterTextRekening]
    );

    const handleRowClicked = row => {
        filterItemsBank.map(item => {
            if (row.mbank_code === item.mbank_code) {
                setInputData({
                    bankName: row.mbank_name,
                    bankCode: row.mbank_code
                });
                setShowBank(false)
            }
        });
    };

    const handleRowClickedRekening = row => {
        console.log(row.moffshorebankacclist_number, "number in click");
        filterItemsRekening.map(item => {
            if (row.moffshorebankacclist_number === item.moffshorebankacclist_number) {
                setInputDataRekening({
                    noRek: row.moffshorebankacclist_number
                });
                setShowDaftarRekening(false)
            }
        });
    };

    function handleChangeRek(e) {
        setInputDataRekening({
            ...inputDataRekening,
            [e.target.name] : e.target.value
        })
    }

    function handleChange () {
        setOtp({otp})
    }

    function handleChangeTransfer(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.value,
        });
    }
    
    function completeTime() {
        setToCountdown(false)
    }

    function sendAgain() {
        setToCountdown(true)
    }

    const columnsBank = [
        {
            name: 'No',
            selector: row => row.number,
            width: "80px"
        },
        {
            name: 'Nama Bank',
            selector: row => row.mbank_name,
        },
        {
            name: 'Kode Bank',
            selector: row => row.mbank_code,
            width: "150px"
        },
    ]

    const columns = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.moffshorebankacclist_name,
        },
        {
            name: 'No Rekening',
            selector: row => row.moffshorebankacclist_number,
        },
        {
            name: 'Nama Bank',
            selector: row => row.mbank_name,
        },
    ]

    function toDashboard() {
        history.push("/");
    }
    
    function toLaporan() {
        history.push("/laporan");
    }

    function toInputCode () {
        setShowTransfer(false)
        setShowModalInputCode(true)
        setToCountdown(true)
    }

    function toTransfer () {
        setShowModalInputCode(false)
        setShowTransferBerhasil(true)
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

    async function getBankList() {
        try {
          const auth = "Bearer " + getToken()
          const headers = {
            'Content-Type':'application/json',
            'Authorization' : auth
          }
          const bankList = await axios.post(BaseURL + "/Home/BankGetList", { data: "" }, { headers: headers })
          if (bankList.status === 200 && bankList.data.response_code === 200 && bankList.data.response_new_token.length === 0) {
            bankList.data.response_data = bankList.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setListBank(bankList.data.response_data)
          } else if (bankList.status === 200 && bankList.data.response_code === 200 && bankList.data.response_new_token.length !== 0) {
            setUserSession(bankList.data.response_new_token)
            bankList.data.response_data = bankList.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
            setListBank(bankList.data.response_data)
          }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    async function getRekeningList() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const rekeningList = await axios.post(BaseURL + "/SubAccount/GetListAccount", { data: "" }, { headers: headers })
            console.log(rekeningList, 'list rekening');
            if (rekeningList.status === 200 && rekeningList.data.response_code === 200 && rekeningList.data.response_new_token.length === 0) {
                rekeningList.data.response_data = rekeningList.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                setListRekening(rekeningList.data.response_data)
            } else if (rekeningList.status === 200 && rekeningList.data.response_code === 200 && rekeningList.data.response_new_token.length !== 0) {
                setUserSession(rekeningList.data.response_new_token)
                rekeningList.data.response_data = rekeningList.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                setListRekening(rekeningList.data.response_data)
            }
        } catch (error) {
        //   console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: '600',
                fontSize: '14px',
                fontFamily: 'Exo'
            },
        },
        cells: {
            style: {
                cursor: 'pointer',
            }
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
        getBankList()
        getRekeningList()
    }, [])
    

    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> Laporan</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Sub Account Bank &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;Transfer</span> 
            <div className="head-title">
                <div className="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>Transfer</div>
            </div>
            {/* <SubAccountComponent/> */}
            <div className='base-content-custom px-3 pt-4 pb-4' style={{ width: "50%" }}>
                <div className="mb-3">Pilih Akun</div>
                <Form.Select name="akunPartner" value={inputHandle.akunPartner} onChange={(e) => handleChangeTransfer(e)}>
                    {listAkunPartner.map((item, idx) => {
                        return (
                            <option key={idx} value={item.partner_id}>
                                {item.account_name} - {item.account_number}
                            </option>
                        )
                    })}
                </Form.Select>
            </div>
            <div className="head-title">
                <div className="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>Rekening Tujuan</div>
            </div>
            <div className='base-content-custom px-3 pt-4 pb-4' >
                <Row className='mt-1 align-items-center'>
                    <Col xs={2} style={{ fontSize: 14, fontFamily: 'Nunito' }}>
                        Pilih Bank <span style={{ color: "red" }}>*</span>
                    </Col>
                    <Col xs={10} className="position-relative d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }} onClick={() => setShowBank(true)}>
                        <input style={{ cursor: "pointer", backgroundColor: "#FFFFFF" }} disabled name="bankName" value={inputData.bankName} className="input-text-user" placeholder='Pilih Bank Tujuan'/>
                        <div className="position-absolute right-4" ><img src={chevron} alt="time" /></div>
                    </Col>
                </Row>
                <Row className='mt-3 align-items-center'>
                    <Col xs={2} style={{ fontSize: 14, fontFamily: 'Nunito' }}>
                        Nomor Rekening Tujuan <span style={{ color: "red" }}>*</span>
                    </Col>
                    <Col xs={8}>
                        <input type='number' name='noRek' value={inputDataRekening.noRek} onChange={(e) => handleChangeRek(e)} className="input-text-user" placeholder='Masukkan No. Rekening Tujuan' onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}/>
                    </Col>
                    <Col xs={2} >
                        <button className='btn-ez-transfer'>
                            Periksa
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={2}></Col>
                    <Col xs={10}>
                        {/* <div style={{ color: "#B9121B", fontSize: 12 }} className="mt-2">
                            <img src={noteIconRed} className="me-2" alt="icon notice" />
                            Nomor Rekening Tidak Diketahui
                        </div>
                        <div style={{ color: "#3DB54A", fontSize: 12 }} className="mt-2">
                            <img src={noteIconGreen} className="me-2" alt="icon notice" />
                            Rekening Terkonfirmasi - Leslie Alexander
                        </div> */}
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='mt-2'>
                                <Form.Check
                                    label="Simpan ke Daftar Rekening"
                                    id="statusId"
                                />
                            </div>
                            <div className='mt-2'>
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
                <Row className='mt-3 align-items-center'>
                    <Col xs={2} style={{ fontSize: 14, fontFamily: 'Nunito' }}>
                        Nominal Transfer <span style={{ color: "red" }}>*</span>
                    </Col>
                    <Col xs={10}>
                        <input type='text' className="input-text-user" placeholder='Rp 0'/>
                    </Col>
                </Row>
                <Row className='mt-3 align-items-center'>
                    <Col xs={2} style={{ fontSize: 14, fontFamily: 'Nunito' }}>
                        Deskripsi
                    </Col>
                    <Col xs={10}>
                        <input type='text' className="input-text-user" placeholder='Masukkan Deskripsi'/>
                    </Col>
                </Row>
                <Row className='mt-3 align-items-center'>
                    <Col xs={2} style={{ fontSize: 14, fontFamily: 'Nunito' }}>
                        Biaya Transfer <span style={{ color: "red" }}>*</span>
                    </Col>
                    <Col xs={10}>
                        <input type='text' disabled className="input-text-user" placeholder='Rp 0'/>
                    </Col>
                </Row>
            </div>
            <div className="d-flex justify-content-end align-items-center mt-3" >
                <button className='btn-ez-transfer' style={{ width: '25%' }} onClick={() => setShowTransfer(true)}>
                    Tranfer Sekarang
                </button>
            </div>

            {/*Modal Pilih Bank*/}
            <Modal className="history-modal bank-list-subakun" size="xs" centered show={showBank} onHide={() => setShowBank(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setShowBank(false)}
                    />
                    
                </Modal.Header>
                <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    Daftar Bank
                </Modal.Title>
                <Modal.Body>
                    <div className="div-table mt-3">
                        <DataTable 
                            columns={columnsBank}
                            data={filterItemsBank}
                            customStyles={customStyles}
                            progressComponent={<CustomLoader />}
                            highlightOnHover
                            subHeader
                            subHeaderComponent={subHeaderComponentMemoBank}
                            persistTableHead
                            onRowClicked={handleRowClicked}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="300px"
                        />
                    </div>
                </Modal.Body>
            </Modal>

            {/*Modal Daftar Rekening*/}
            <Modal className="history-modal" size="xl" centered show={showDaftarRekening} onHide={() => setShowDaftarRekening(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setShowDaftarRekening(false)}
                    />
                    
                </Modal.Header>
                <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    Daftar Rekening
                </Modal.Title>
                <Modal.Body>
                    <div className="div-table bank-list-subakun mt-3">
                        <DataTable 
                            columns={columns}
                            data={filterItemsRekening}
                            customStyles={customStyles}
                            progressComponent={<CustomLoader />}
                            subHeader
                            subHeaderComponent={subHeaderComponentMemoRekening}
                            persistTableHead
                            onRowClicked={handleRowClickedRekening}
                            highlightOnHover
                            fixedHeader={true}
                            fixedHeaderScrollHeight="300px"
                        />
                    </div>
                </Modal.Body>
            </Modal>

            {/*Modal Transfer*/}
            <Modal className="history-modal" size="md" centered show={showTransfer} onHide={() => setShowTransfer(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setShowTransfer(false)}
                    />
                    
                </Modal.Header>
                <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    Konfirmasi Transfer
                </Modal.Title>
                <Modal.Body>
                    <div className='px-2 py-3' style={{ backgroundColor: "rgba(240, 240, 240, 0.38)" }}>
                        <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Dari Rekening</div>
                        <div className='mt-1' style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>2348-3492-0943</div>
                        <div className='mt-3' style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>Rekening Tujuan</div>
                        <div className='d-flex justify-content-between align-items-center mt-3'>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Nama Bank</div>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>No Rekening</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-1'>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>Bank BCA</div>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>2139-3459-3493</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-3'>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Nama Pemilik Rekening</div>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Nominal Transfer</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-1'>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>Leslie Alexander</div>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>Rp 1.000.000</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-3'>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Deskripsi</div>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Biaya Admin</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-1'>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>-</div>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>Rp 2.500</div>
                        </div>
                        <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Total</div>
                        <div className='mt-1' style={{ fontSize: 24, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>Rp 1.002.500</div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <button
                            onClick={() => setShowTransfer(false)}
                            className="mx-2"
                            style={{
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 900,
                                alignItems: "center",
                                padding: "0px 24px",
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
                        <button
                            onClick={() => toInputCode()}
                            className="mx-2"
                            style={{
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 900,
                                alignItems: "center",
                                padding: "0px 24px",
                                gap: 8,
                                width: 136,
                                height: 45,
                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                border: "0.6px solid #2C1919",
                                borderRadius: 6,
                            }}
                        >
                            Transfer
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/*Modal Input Code*/}
            <Modal className="history-modal" size="xs" centered show={showModalInputCode} onHide={() => setShowModalInputCode(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setShowModalInputCode(false)}
                    />
                </Modal.Header>
                <Modal.Title className="mt-2 text-center px-3" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    Konfirmasi OTP
                </Modal.Title>
                <Modal.Body>
                    <div className='text-center' style={{ fontSize: 16, fontWeight: 400, color: "#888888", fontFamily: "Source Sans Pro" }}>Kode Verifikasi udah dikirim via SMS ke nomor <b>08123456789</b> </div>
                    <div className='d-flex justify-content-center align-items-center mt-3'>
                        <OtpInput
                            isInputNum={true}
                            className='px-2'
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            inputStyle={{ border: "1px solid #EBEBEB", borderRadius: 8, backgroundColor: "#FFFFFF", gap: 12, width: "3rem", height:"3rem", fontSize: 20, fontFamily: "Exo", fontWeight: 700, color: "#393939" }}
                        />
                    </div>
                    {
                        toCountdown === true ? 
                            <div className='text-center mt-3' style={{color: "#393939", fontSize: 16, fontFamily: "Source Sans Pro" }}>Mohon tunggu dalam <b><Countdown date={Date.now() + 59000} renderer={renderer} onComplete={completeTime} /> detik</b> untuk kirim ulang</div> :
                            <div className='d-flex justify-content-center align-items-center mt-3'>
                                <div className="me-1" style={{ color: "#393939", fontFamily: "Nunito", fontSize: 16 }}>Tidak menerima kode OTP? </div>
                                <div onClick={sendAgain} className='ms-1' style={{ color: "#077E86", fontFamily: "Exo", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Kirim Ulang</div>
                            </div>
                    }
                    <div className='px-5'>
                        <button
                            onClick={() => toTransfer()}
                            className='d-flex justify-content-center align-items-center text-center mt-3 mb-2'
                            style={{
                                width: "100%",
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 700,
                                alignItems: "center",
                                padding: "12px 48px",
                                gap: 8,
                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                border: "0.6px solid #2C1919",
                                borderRadius: 6,
                            }}
                        >
                            Konfirmasi
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/*Modal Transfer Berhasil dan Gagal*/}
            <Modal className="history-modal" size="md" centered show={showTransferBerhasil} onHide={() => setShowTransferBerhasil(false)}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setShowTransferBerhasil(false)}
                    />
                    
                </Modal.Header>
                <Modal.Title className="mt-2 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    <div><img src={transferSuccess}  alt="success" /></div>
                    <div>Transfer Berhasil</div>
                </Modal.Title>
                <Modal.Body>
                    <div className='px-2 py-3' style={{ backgroundColor: "rgba(240, 240, 240, 0.38)" }}>
                        <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Dari Rekening</div>
                        <div className='mt-1' style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>2348-3492-0943</div>
                        <div className='mt-3' style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>Rekening Tujuan</div>
                        <div className='d-flex justify-content-between align-items-center mt-3'>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Nama Bank</div>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>No Rekening</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-1'>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>Bank BCA</div>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>2139-3459-3493</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-3'>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Nama Pemilik Rekening</div>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Nominal Transfer</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-1'>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>Leslie Alexander</div>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>Rp 1.000.000</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-3'>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Deskripsi</div>
                            <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Biaya Admin</div>
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-1'>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>-</div>
                            <div style={{ fontSize: 16, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>Rp 2.500</div>
                        </div>
                        <div style={{ fontSize: 14, color: "#888888", fontFamily: 'Source Sans Pro' }}>Total</div>
                        <div className='mt-1' style={{ fontSize: 24, color: "#383838", fontWeight: 600, fontFamily: 'Source Sans Pro' }}>Rp 1.002.500</div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <button
                            className="mx-2"
                            style={{
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 900,
                                alignItems: "center",
                                padding: "0px 12px",
                                gap: 8,
                                width: 208,
                                height: 45,
                                background: "#FFFFFF",
                                color: "#888888",
                                border: "0.6px solid #EBEBEB",
                                borderRadius: 6,
                            }}
                        >
                            Unduh Bukti Transfer
                        </button>
                        <button
                            className="mx-2"
                            style={{
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 900,
                                alignItems: "center",
                                padding: "0px 12px",
                                gap: 8,
                                width: 144,
                                height: 45,
                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                border: "0.6px solid #2C1919",
                                borderRadius: 6,
                            }}
                        >
                            Lihat Mutasi
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default TransferSubAccount