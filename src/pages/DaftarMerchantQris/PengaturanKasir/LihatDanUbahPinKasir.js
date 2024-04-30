import { Button, Col, Form, Modal, Row, Toast } from '@themesberg/react-bootstrap'
import React, { useEffect, useState } from 'react'
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers'
import encryptData from '../../../function/encryptData'
import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import OtpInput from 'react-otp-input'
import Checklist from '../../../assets/icon/checklist_icon.svg'

const LihatDanUbahPinKasir = () => {
    const history = useHistory()
    const { kasirId, statusPage } = useParams()
    const [dataDetailKasir, setDataDetailKasir] = useState({})
    const [inputStatusKasir, setInputStatusKasir] = useState(false)
    const [pinKasir, setPinKasir] = useState("")
    const [isSecurePin, setIsSecurePin] = useState(true)
    const [showModalStatusUbahPin, setShowModalStatusUbahPin] = useState(false)
    const [showModalStatusKasir, setShowModalStatusKasir] = useState(false)
    const [showModalStatusKasirNonAktif, setShowModalStatusKasirNonAktif] = useState(false)
    const [showStatusTambahKasir, setShowStatusTambahKasir] = useState(false)

    function lihatDanUbahPin (kasirId, statusPage) {
        history.push(`/ubah-pin-kasir/${kasirId}/${statusPage}`)
    }

    const [inputHandleTambahKasir, setInputHandleTambahKasir] = useState({
        namaKasir: "",
        emailKasir: "",
        role: 0
    })

    function handleChangeTambahKasir (e) {
        setInputHandleTambahKasir({
            ...inputHandleTambahKasir,
            [e.target.name] : e.target.value
        })
    }

    function showModalHandler () {
        if (inputStatusKasir === true) {
            setShowModalStatusKasir(true)
        } else {
            setShowModalStatusKasirNonAktif(true)
        }
    }

    console.log(inputStatusKasir, "inputStatusKasir");

    function handleChangeStatus () {
        setInputStatusKasir(!inputStatusKasir);
        setShowModalStatusKasir(false)
        setShowModalStatusKasirNonAktif(false)
    }

    function handleChangeOtp (value) {
        setPinKasir(value)
    }

    async function getDataDetailKasir(kasirId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"user_qris_id": "${kasirId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataKasir = await axios.post(BaseURL + "/QRIS/GetUserQrisDetail", { data: dataParams }, { headers: headers })
            // console.log(dataKasir, 'ini user detal funct');
            if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token.length === 0) {
                setDataDetailKasir(dataKasir.data.response_data.results)
                setInputStatusKasir(dataKasir.data.response_data.results.user_qris_is_active)
                setPinKasir(dataKasir.data.response_data.results.user_qris_pin)
                setInputHandleTambahKasir({
                    namaKasir: dataKasir.data.response_data.results.user_qris_name,
                    emailKasir: dataKasir.data.response_data.results.user_qris_email,
                    role: dataKasir.data.response_data.results.user_role
                })
            } else if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token.length !== 0) {
                setUserSession(dataKasir.data.response_new_token)
                setDataDetailKasir(dataKasir.data.response_data.results)
                setInputStatusKasir(dataKasir.data.response_data.results.user_qris_is_active)
                setPinKasir(dataKasir.data.response_data.results.user_qris_pin)
                setInputHandleTambahKasir({
                    namaKasir: dataKasir.data.response_data.results.user_qris_name,
                    emailKasir: dataKasir.data.response_data.results.user_qris_email,
                    role: dataKasir.data.response_data.results.user_role
                })
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function addAndSaveDataKasirHandler(namaKasir, userId, storeNou, email, role, isActive, pin) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"name": "${namaKasir}", "user_id": ${userId}, "store_nou": ${storeNou}, "email": "${email}", "role" : ${role}, "is_active": ${isActive}, "pin": "${pin}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataKasir = await axios.post(BaseURL + "/QRIS/AddAndEditCashierData", { data: dataParams }, { headers: headers })
            // console.log(dataKasir, 'ini user detal funct');
            if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token === null) {
                setShowStatusTambahKasir(true)
                window.scrollTo(0,0)
                setPinKasir("")
                setInputStatusKasir(false)
                getDataDetailKasir(kasirId)
                setShowModalStatusUbahPin(false)
                setTimeout(() => {
                    setShowStatusTambahKasir(false)
                    history.push("/tambah-manual-data-kasir")
                }, 5000);
            } else if (dataKasir.status === 200 && dataKasir.data.response_code === 200 && dataKasir.data.response_new_token !== null) {
                setUserSession(dataKasir.data.response_new_token)
                setShowStatusTambahKasir(true)
                window.scrollTo(0,0)
                setPinKasir("")
                setInputStatusKasir(false)
                getDataDetailKasir(kasirId)
                setShowModalStatusUbahPin(false)
                setTimeout(() => {
                    setShowStatusTambahKasir(false)
                    history.push("/tambah-manual-data-kasir")
                }, 5000);
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        getDataDetailKasir(kasirId)
    }, [])
    
    return (
        <>
            <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            {
                    showStatusTambahKasir && (
                        <div className="align-items-center position-absolute" style={{ marginLeft: "6%" }}>
                            <Toast style={{width: "900px", backgroundColor: "#077E86"}} onClose={() => setShowStatusTambahKasir(false)} autohide>
                                <Toast.Body  className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Kasir berhasil ditambahkan</Toast.Body>
                            </Toast>
                        </div>
                    )
                }

                <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }} onClick={() => history.push("/")}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }} onClick={() => history.push("/daftar-merchant-qris/pengaturan-kasir")}>Pengaturan Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }} onClick={() => history.push("/daftar-merchant-qris/pengaturan-kasir")}>Daftar Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }} onClick={() => history.push("/tambah-manual-data-kasir")}>Info Kasir</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Ubah Pin Kasir</span></span>
                <div className="head-title"> 
                    <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Ubah Data Info Kasir</h2> 
                </div>
                <div className='base-content mt-3'>
                    <div className="nama-merchant-in-detail">{dataDetailKasir?.merchant_name}</div>
                    <Row className='mt-3'>
                        <Col xs={6} className='sub-title-detail-merchant'>Group</Col>
                        <Col xs={6} className='sub-title-detail-merchant'>Brand</Col>
                    </Row>
                    <Row className='mt-1'>
                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailKasir?.merchant_name}</Col>
                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailKasir?.brand_name === "" ? "-" : dataDetailKasir?.brand_name}</Col>
                    </Row>
                    <Row className='mt-3'>
                        <Col xs={6} className='sub-title-detail-merchant'>Role</Col>
                    </Row>
                    <Row className='mt-1 pb-4'>
                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailKasir?.user_role === 103 ? "Kepala Outlet" : "Kasir"}</Col>
                    </Row>
                </div>
                <div className='mt-3' style={{ fontFamily: "Exo", fontSize: 15, fontWeight: 600 }}>Tambah Kasir</div>
                <div className='sub-title-detail-merchant mt-1'>Ini adalah info yang digunakan untuk akses masuk ke QRIS Ezeelink</div>
                <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Aktifkan Kasir</div>
                <Form.Check 
                    type="switch"
                    id="custom-switch"
                    checked={
                        inputStatusKasir
                    }
                    name="active"
                    className='mt-2'
                    disabled={Number(statusPage) === 0}
                    onChange={() => showModalHandler()}
                />
                <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Nama Kasir</div>
                <input name="namaKasir" value={inputHandleTambahKasir.namaKasir} onChange={(e) => handleChangeTambahKasir(e)} type='text'className='input-text-user mt-2' placeholder='Masukkan Nama Kasir'/>
                <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Email Kasir</div>
                <input name="emailKasir" value={inputHandleTambahKasir.emailKasir} onChange={(e) => handleChangeTambahKasir(e)} type='text'className='input-text-user mt-2' placeholder='contoh : Farida@gmail.com'/>
                <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>Role</div>
                <Form.Select name='role' value={inputHandleTambahKasir.role} onChange={(e) => handleChangeTambahKasir(e)} className='input-text-user' style={{ display: "inline" }} >
                    <option defaultValue disabled value={0}>Pilih Role</option>
                    <option value={103}>Kepala Outlet</option>
                    <option value={104}>Kasir</option>
                </Form.Select>
                <div className='mt-2' style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>PIN Kasir</div>
                <OtpInput
                    isInputSecure={isSecurePin === true ? true : false}
                    isInputNum={true}
                    className='me-3 mt-2'
                    value={pinKasir}
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
                    <button className='btn-ez-transfer mt-4' onClick={() => lihatDanUbahPin(kasirId, 1)}>Ubah</button> :
                    <div className='d-flex justify-content-center align-items-center mt-4'>
                        <button className='btn-prev-info-usaha me-1' onClick={() => lihatDanUbahPin(kasirId, 0)}>Batal</button>
                        <button 
                            className={inputHandleTambahKasir.namaKasir.length !== 0 && inputHandleTambahKasir.emailKasir.length !== 0 && inputHandleTambahKasir.role !== 0 && pinKasir.length !== 0 && pinKasir.length === 6 ? 'btn-next-info-usaha ms-1' : 'btn-next-info-usaha-inactive ms-1'} 
                            disabled={inputHandleTambahKasir.namaKasir.length === 0 || inputHandleTambahKasir.emailKasir.length === 0 || inputHandleTambahKasir.role === 0 || pinKasir.length === 0 || (pinKasir.length !== 0 && pinKasir.length !== 6)}
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
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Yakin ingin ubah data kasir?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">Data kasir yang lama akan terhapus dan <b>diganti dengan yang baru</b>, masih ingin melanjutkan ?</p>
                    </div>             
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalStatusUbahPin(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Batal</Button>
                        <Button onClick={() => addAndSaveDataKasirHandler(inputHandleTambahKasir.namaKasir, kasirId, dataDetailKasir?.store_nou, inputHandleTambahKasir.emailKasir, inputHandleTambahKasir.role, inputStatusKasir ? 1 : 0, pinKasir)} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                centered
                show={showModalStatusKasir}
                onHide={() => setShowModalStatusKasir(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-daftar-settlement'
                >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Yakin ingin menonaktifkan kasir?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">Kasir <b>tidak dapat digunakan</b> setelah dinonaktifkan masih ingin melanjutkan ?</p>
                    </div>             
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalStatusKasir(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Batal</Button>
                        <Button onClick={() => handleChangeStatus()} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                centered
                show={showModalStatusKasirNonAktif}
                onHide={() => setShowModalStatusKasirNonAktif(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
                className='modal-daftar-settlement'
                >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 26, fontWeight: 700, marginBottom: "unset" }} className="text-center">Yakin ingin mengaktifkan kasir?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 15, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 400, marginBottom: "unset", color: "var(--palet-pengembangan-shades-hitam-62-grey, #888)" }} className="text-center">tanggal dinonaktifkan <b>{dataDetailKasir?.user_qris_last_inactive}</b>, masih ingin melanjutkan ?</p>
                    </div>             
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalStatusKasirNonAktif(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB",  fontWeight: 700 }} className="mx-2">Batal</Button>
                        <Button onClick={() => handleChangeStatus()} style={{ fontFamily: "Exo", color: "black", background: "var(--palet-gradient-gold, linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%))", maxHeight: 45, width: "100%", height: "100%", fontWeight: 700, border: "0.6px solid var(--palet-pengembangan-shades-hitam-80, #383838)" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default LihatDanUbahPinKasir