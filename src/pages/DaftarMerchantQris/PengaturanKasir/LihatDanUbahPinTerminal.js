import { Button, Col, Form, Modal, Row, Toast } from '@themesberg/react-bootstrap'
import React, { useEffect, useState } from 'react'
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers'
import encryptData from '../../../function/encryptData'
import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import OtpInput from 'react-otp-input'
import Checklist from '../../../assets/icon/checklist_icon.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const LihatDanUbahPinTerminal = () => {
    const history = useHistory()
    const { terminalId, statusPage } = useParams()
    const [dataDetailTerminal, setDataDetailTerminal] = useState({})
    const [inputStatusTerminal, setInputStatusTerminal] = useState(false)
    const [pinTerminalKasir, setPinTerminalKasir] = useState("")
    const [isSecurePin, setIsSecurePin] = useState(true)
    const [showModalStatusUbahPin, setShowModalStatusUbahPin] = useState(false)
    const [showModalStatusTerminal, setShowModalStatusTerminal] = useState(false)
    const [showModalStatusTerminalNonAktif, setShowModalStatusTerminalNonAktif] = useState(false)
    const [showStatusTambahTerminal, setShowStatusTambahTerminal] = useState(false)
    const [isLoadingTerminal, setIsLoadingTerminal] = useState(false)

    function lihatDanUbahPin (terminalId, statusPage) {
        if (Number(statusPage) === 0) {
            getDataDetailTerminal(terminalId)
            history.push(`/ubah-pin-terminal/${terminalId}/${statusPage}`)
        } else {
            history.push(`/ubah-pin-terminal/${terminalId}/${statusPage}`)
        }
    }

    function showModalHandler () {
        if (inputStatusTerminal === true) {
            setShowModalStatusTerminal(true)
        } else {
            setShowModalStatusTerminalNonAktif(true)
        }
    }

    console.log(inputStatusTerminal, "inputStatusTerminal");

    function handleChangeStatus () {
        setInputStatusTerminal(!inputStatusTerminal);
        setShowModalStatusTerminal(false)
        setShowModalStatusTerminalNonAktif(false)
    }

    function handleChangeOtp (value) {
        setPinTerminalKasir(value)
    }

    async function getDataDetailTerminal(terminalId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"terminal_id": "${terminalId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataTerminal = await axios.post(BaseURL + "/QRIS/GetTerminalQrisDetail", { data: dataParams }, { headers: headers })
            // console.log(dataTerminal, 'ini user detal funct');
            if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token.length === 0) {
                setDataDetailTerminal(dataTerminal.data.response_data.results)
                setInputStatusTerminal(dataTerminal.data.response_data.results.terminal_is_active)
                setPinTerminalKasir(dataTerminal.data.response_data.results.terminal_pin)
            } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token.length !== 0) {
                setUserSession(dataTerminal.data.response_new_token)
                setDataDetailTerminal(dataTerminal.data.response_data.results)
                setInputStatusTerminal(dataTerminal.data.response_data.results.terminal_is_active)
                setPinTerminalKasir(dataTerminal.data.response_data.results.terminal_pin)
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function addAndSaveDataTerminalHandler(terminalId, isActive, pin) {
        try {
            setIsLoadingTerminal(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"terminal_id": ${terminalId}, "is_active": ${isActive}, "pin": "${pin}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataTerminal = await axios.post(BaseURL + "/QRIS/AddAndEditTerminalData", { data: dataParams }, { headers: headers })
            // console.log(dataTerminal, 'ini user detal funct');
            if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token === null) {
                setShowStatusTambahTerminal(true)
                window.scrollTo(0,0)
                setPinTerminalKasir("")
                setInputStatusTerminal(false)
                getDataDetailTerminal(terminalId)
                setShowModalStatusUbahPin(false)
                setIsLoadingTerminal(false)
                setTimeout(() => {
                    setShowStatusTambahTerminal(false)
                    history.push("/tambah-manual-data-terminal")
                }, 1000);
            } else if (dataTerminal.status === 200 && dataTerminal.data.response_code === 200 && dataTerminal.data.response_new_token !== null) {
                setUserSession(dataTerminal.data.response_new_token)
                setShowStatusTambahTerminal(true)
                window.scrollTo(0,0)
                setPinTerminalKasir("")
                setInputStatusTerminal(false)
                getDataDetailTerminal(terminalId)
                setShowModalStatusUbahPin(false)
                setIsLoadingTerminal(false)
                setTimeout(() => {
                    setShowStatusTambahTerminal(false)
                    history.push("/tambah-manual-data-terminal")
                }, 1000);
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        getDataDetailTerminal(terminalId)
    }, [])
    
    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            {
                    showStatusTambahTerminal && (
                        <div className="align-items-center position-absolute" style={{ marginLeft: "6%" }}>
                            <Toast style={{width: "900px", backgroundColor: "#077E86"}} onClose={() => setShowStatusTambahTerminal(false)} autohide>
                                <Toast.Body  className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Terminal berhasil ditambahkan</Toast.Body>
                            </Toast>
                        </div>
                    )
                }

                <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }} onClick={() => history.push("/")}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }} onClick={() => history.push("/daftar-merchant-qris/pengaturan-kasir")}>Pengaturan Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }} onClick={() => history.push("/daftar-merchant-qris/pengaturan-kasir")}>Daftar Terminal</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }} onClick={() => history.push("/tambah-manual-data-terminal")}>Info Terminal</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Ubah Pin Terminal</span></span>
                <div className="head-title"> 
                    <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Ubah PIN Terminal</h2> 
                </div>
                <div className='base-content mt-3'>
                    <div className="nama-merchant-in-detail">{dataDetailTerminal?.store_name}</div>
                    <Row className='mt-3'>
                        <Col xs={6} className='sub-title-detail-merchant'>Group</Col>
                        <Col xs={6} className='sub-title-detail-merchant'>Brand</Col>
                    </Row>
                    <Row className='mt-1'>
                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailTerminal?.merchant_name}</Col>
                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailTerminal?.brand_name === "" ? "-" : dataDetailTerminal?.brand_name}</Col>
                    </Row>
                    <Row className='mt-3'>
                        <Col xs={6} className='sub-title-detail-merchant'>Terminal</Col>
                    </Row>
                    <Row className='mt-1 pb-4'>
                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailTerminal?.terminal_name}</Col>
                    </Row>
                </div>
                <div className='mt-3' style={{ fontFamily: "Exo", fontSize: 15, fontWeight: 600 }}>Tambah Terminal Kasir</div>
                <div className='sub-title-detail-merchant mt-1'>Terminal yang digunakan untuk transaksi dengan QRIS Ezeelink</div>
                <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Aktifkan Terminal</div>
                <Form.Check 
                    type="switch"
                    id="custom-switch"
                    checked={
                        inputStatusTerminal
                    }
                    name="active"
                    className='mt-2'
                    disabled={Number(statusPage) === 0}
                    onChange={() => showModalHandler()}
                />
                <div className='mt-2'>PIN Terminal Kasir</div>
                <OtpInput
                    isInputSecure={isSecurePin === true ? true : false}
                    isInputNum={true}
                    className='me-3 mt-2'
                    value={pinTerminalKasir}
                    onChange={(e) => handleChangeOtp(e)}
                    numInputs={6}
                    inputStyle={{ 
                        width: "100% ",
                        height: "4rem",
                        fontSize: "20px",
                        borderRadius: "8px",
                        border: "1px solid #EBEBEB",
                        fontFamily: isSecurePin ? "unset" : "Exo", 
                        fontWeight: isSecurePin ? "unset" : 700, 
                        backgroundColor: "#FFFFFF",
                    }}
                    isDisabled={Number(statusPage) === 0}
                />
                <div className='d-flex justify-content-between align-items-center mt-2'>
                    <div className='custom-style-desc-data-terminal'>PIN digunakan oleh kasir untuk masuk ke dalam terminal kasir</div>
                    <div className='lihat-pin-style' onClick={() => setIsSecurePin(!isSecurePin)} style={{ cursor: "pointer" }}>{isSecurePin ? "Lihat PIN" : "Sembunyikan PIN" }</div>
                </div>
                {
                    Number(statusPage) === 0 ?
                    <button className='btn-ez-transfer mt-4' onClick={() => lihatDanUbahPin(terminalId, 1)}>Ubah</button> :
                    <div className='d-flex justify-content-center align-items-center mt-4'>
                        <button className='btn-prev-info-usaha me-1' onClick={() => lihatDanUbahPin(terminalId, 0)}>Batal</button>
                        <button 
                            className={pinTerminalKasir.length !== 0 && pinTerminalKasir.length === 6 ? 'btn-next-info-usaha ms-1' : 'btn-next-info-usaha-inactive ms-1'} 
                            disabled={pinTerminalKasir.length === 0 || (pinTerminalKasir.length !== 0 && pinTerminalKasir.length !== 6)}
                            onClick={() => setShowModalStatusUbahPin(true)}
                        >
                            Simpan
                        </button>
                    </div>
                }
            </div>

            <Modal
                size="lg"
                centered
                show={showModalStatusUbahPin}
                onHide={() => setShowModalStatusUbahPin(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-daftar-settlement'
                >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Yakin ingin ubah PIN terminal kasir?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">PIN terminal kasir yang lama akan terhapus dan <b>diganti dengan yang baru</b>, masih ingin melanjutkan ?</p>
                    </div>             
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalStatusUbahPin(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Batal</Button>
                        <Button 
                            disabled={isLoadingTerminal}
                            onClick={() => addAndSaveDataTerminalHandler(terminalId, inputStatusTerminal ? 1 : 0, pinTerminalKasir)} 
                            style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}
                        >
                            {isLoadingTerminal ? (<>Mohon tunggu... <FontAwesomeIcon icon={faSpinner} spin /></>) : `Ya`}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                centered
                show={showModalStatusTerminal}
                onHide={() => setShowModalStatusTerminal(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-daftar-settlement'
                >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Yakin ingin menonaktifkan terminal?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">Terminal <b>tidak dapat digunakan</b> setelah dinonaktifkan masih ingin melanjutkan ?</p>
                    </div>             
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalStatusTerminal(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Batal</Button>
                        <Button onClick={() => handleChangeStatus()} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                centered
                show={showModalStatusTerminalNonAktif}
                onHide={() => setShowModalStatusTerminalNonAktif(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-daftar-settlement'
                >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Yakin ingin mengaktifkan terminal?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">tanggal dinonaktifkan <b>{dataDetailTerminal?.terminal_last_inactive}</b>, masih ingin melanjutkan ?</p>
                    </div>             
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalStatusTerminalNonAktif(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Batal</Button>
                        <Button onClick={() => handleChangeStatus()} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default LihatDanUbahPinTerminal