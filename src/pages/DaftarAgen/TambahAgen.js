import React, { useEffect, useState } from 'react'
import { Col, Row, Form, InputGroup, Modal, Button, Table } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import { BaseURL, convertFormatNumber, convertToRupiah, errorCatch, getRole, getToken, RouteTo, setUserSession } from '../../function/helpers';
import axios from 'axios';
import checklistCircle from '../../assets/img/icons/checklist_circle.svg';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import noteIconRed from "../../assets/icon/note_icon_red.svg"
import alertIcon from "../../assets/icon/alert_icon.svg";
import CurrencyInput from 'react-currency-input-field'

function TambahAgen() {

    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const [inputHandle, setInputHandle] = useState({
        nama: "",
        email: "",
        mobileNumber: "",
        bankName: "BCA",
        akunBank: "",
        rekeningOwner: "",
        status: "true",
        settlementFee: "",
        nominal: "",
    })
    const [showModal, setShowModal] = useState(false)
    const [detailNewAgen, setDetailNewAgen] = useState({})

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    function handleChangeNominal(e) {
        setInputHandle({
            ...inputHandle,
            settlementFee: e
        })
    }

    const [errorCode, setErrorCode] = useState(0)
    const [add, setAdd] = useState(false)

    async function tambahAgen(status, nama, email, mobileNumber, bankName, akunBank, rekeningOwner, settlementFee) {
        try {         
            const auth = "Bearer " + getToken()
            // const dataParams = encryptData(`{"agen_name": "${nama}", "agen_email": "${email}", "agen_mobile": "${mobileNumber}", "agen_bank_id": ${bankName}, "agen_bank_number": "${akunBank}", "agen_bank_name": "${rekeningOwner}", "status": ${status}, "settlement_fee": ${settlementFee}, "nominal": ${nominal}}`)
            const dataParams = encryptData(`{"agen_name": "${nama}", "agen_email": "${email}", "agen_mobile": "${mobileNumber}", "agen_bank_id": ${bankName}, "agen_bank_number": "${akunBank}", "agen_bank_name": "${rekeningOwner}", "status": ${status}, "settlement_fee": ${(settlementFee.length === 0 || settlementFee === undefined) ? 0 : Number(settlementFee.replaceAll(',', '.'))}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const addAgen = await axios.post(BaseURL + "/Agen/SaveAgen", { data: dataParams }, { headers: headers })
            if (addAgen.status === 200 && addAgen.data.response_code === 200 && addAgen.data.response_new_token.length === 0) {
                setDetailNewAgen(addAgen.data.response_data)
                setShowModal(true)
            } else if (addAgen.status === 200 && addAgen.data.response_code === 200 && addAgen.data.response_new_token.length !== 0) {
                setUserSession(addAgen.data.response_new_token)
                setDetailNewAgen(addAgen.data.response_data)
                setShowModal(true)
            }
        } catch (error) {
            history.push(errorCatch(error.response.status))
            setErrorCode(error.response.data.response_code)
        }
    }

    function successButtonHandle() {
        setShowModal(false)
        history.push("/daftaragen")
    }

    function toDashboard() {
        history.push("/");
    }
    
    function toLaporan() {
        history.push("/laporan");
    }

    function toDaftarAgen() {
        history.push("/daftaragen");
    }

    useEffect(() => {
        if (!access_token) {
        history.push('/login');
        }
    }, [])
    

    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px" }}>
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}>Laporan</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}>Beranda</span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;<span style={{ cursor: "pointer" }} onClick={() => toDaftarAgen()}>Daftar Agen</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Tambah Agen</span> </span>
            <div className="head-title">
                <h4 className="mt-4 mb-4" style={{ fontFamily: "Exo" }}>Tambah Agen Baru</h4>
                <h5 style={{ fontFamily: "Exo" }}>Detail Agen</h5>
            </div>
            <div className='base-content' style={{ width:"93%", padding: 50 }}>
                <div>
                    {/* <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Status
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label="Aktif"
                                // checked={detailAgen.status}
                                />
                        </Col>
                    </Row> */}
                    <Row className='mb-4'>
                        <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Agen <span style={{ color: "red" }}>*</span>
                            </span>
                        </Col>
                        <Col xs={10}>
                            <Form.Control
                                className='input-text-user'
                                name='nama'
                                onChange={handleChange}
                                placeholder="Masukkan Nama Agen"
                                type='text'
                                required
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: "100%", height: 40, marginTop: '-7px'}}
                            />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Email Agen <span style={{ color: "red" }}>*</span>
                            </span>
                        </Col>
                        <Col xs={10}>
                            <Form.Control
                                className='input-text-user'
                                name='email'
                                onChange={handleChange}
                                placeholder="Masukkan Email Agen"
                                type='email'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: "100%", height: 40, marginTop: '-7px', borderColor: errorCode === 101 ? "#B9121B" : "" }}
                            />                            
                            {errorCode === 101 &&
                                <span style={{ color: "#B9121B", fontSize: 12 }}>
                                    <img src={noteIconRed} className="me-2" />
                                    Email sudah terdaftar menjadi agen
                                </span>
                            }
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No Hp Agen <span style={{ color: "red" }}>*</span>
                            </span>
                        </Col>
                        <Col xs={10}>
                            <Form.Control
                                className='input-text-user'
                                name='mobileNumber'
                                onChange={handleChange}
                                placeholder="Masukkan No Hp Agen"
                                type='number'
                                onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                                required
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: "100%", height: 40, marginTop: '-7px', borderColor: errorCode === 102 ? "#B9121B" : "" }}
                            />                            
                            {errorCode === 102 && 
                                <span style={{ color: "#B9121B", fontSize: 12 }}>
                                    <img src={noteIconRed} className="me-2" />
                                    No Hp sudah terdaftar menjadi agen
                                </span>
                            }
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Bank <span style={{ color: "red" }}>*</span>
                            </span>
                        </Col>
                        <Col xs={10}>
                            <Form.Control
                                className='input-text-user'
                                name='bankName'
                                placeholder="BCA"
                                type='text'
                                disabled
                                required
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: "100%", height: 40, marginTop: '-7px' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-3'>
                        <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No Rekening <span style={{ color: "red" }}>*</span>
                            </span>
                        </Col>
                        <Col xs={10}>
                            <Form.Control
                                className='input-text-user'
                                name='akunBank'
                                onChange={handleChange}
                                placeholder="Masukkan No Rekening"
                                type='number'
                                onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                                required
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: "100%", height: 40, marginTop: '-7px' }}
                                />
                        </Col>
                    </Row>
                    <Row className='align-items-center mb-3'>
                        <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Pemilik Rekening <span style={{ color: "red" }}>*</span>
                            </span>
                        </Col>
                        <Col xs={10}>
                            <Form.Control
                                className='input-text-user'
                                name='rekeningOwner'
                                onChange={handleChange}
                                placeholder="Masukkan Nama Pemilik Rekening"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: "100%", height: 40, marginTop: '-7px' }}
                                />
                        </Col>
                    </Row>
                    <Row className='align-items-center'>
                        <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Settlement Fee
                            </span>
                        </Col>
                        <Col xs={10}>
                            <CurrencyInput
                                className='input-text-user'
                                placeholder="Masukkan Jumlah Settlement Fee"
                                defaultValue={inputHandle.settlementFee === undefined ? 0 : inputHandle.settlementFee}
                                onValueChange={(e) => handleChangeNominal(e)}
                                groupSeparator={"."}
                                decimalSeparator={','}
                            />

                            {/* {add ?
                                <Form.Control
                                    name='settlementFee'
                                    onChange={handleChange}
                                    placeholder="Masukkan Jumlah Settlement Fee"
                                    value={inputHandle.settlementFee}
                                    type='number'
                                    min={0}
                                    onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                    style={{ width: "100%", height: 40, marginTop: '-7px' }}
                                    onBlur={() => setAdd(!add)}
                                /> :
                                <Form.Control
                                    name='settlementFee'
                                    onChange={handleChange}
                                    value={convertToRupiah(inputHandle.settlementFee, false, 2)}
                                    placeholder="Masukkan Jumlah Settlement Fee"
                                    type='text'
                                    min={0}
                                    style={{ width: "100%", height: 40, marginTop: '-7px' }}
                                    onFocus={() => setAdd(!add)}
                                />
                            } */}
                        </Col>
                    </Row>
                    {/* <Row className='mt-4'>
                        <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nominal Top up
                            </span>
                        </Col>
                        <Col xs={10}>
                            {add ?
                                <Form.Control
                                    name='nominal'
                                    onChange={handleChange}
                                    placeholder="Masukkan Nominal Top up (Optional)"
                                    value={inputHandle.nominal}
                                    type='number'
                                    onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                                    style={{ width: "100%", height: 40, marginTop: '-7px' }}
                                    onBlur={() => setAdd(!add)}
                                /> :
                                <Form.Control
                                    name='nominal'
                                    onChange={handleChange}
                                    value={convertFormatNumber(inputHandle.nominal)}
                                    placeholder="Masukkan Nominal Top up (Optional)"
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px' }}
                                    onFocus={() => setAdd(!add)}
                                />
                            }
                        </Col>
                    </Row> */}
                </div>
            </div>
            <div className="head-title">
                <h5 className="mt-4 mb-4" style={{ fontFamily: "Exo" }}>Rekening Sub Account</h5>
            </div>
            <div
                style={{
                    width:"93%",
                    fontSize: "14px",
                    background: "rgba(255, 214, 0, 0.16)",
                    borderRadius: "4px",
                    fontStyle: "italic",
                    padding: "12px",
                    gap: 10,
                }}
                className="text-start my-2"
            >
                <span className="mx-2">
                    <img src={alertIcon} alt="alert" />
                </span>
                Silahkan hubungi Admin untuk menambahkan Sub Account pada agen
            </div>
            <div style={{ display: "flex", justifyContent: "end", marginTop: 16, marginRight: 83 }}>
                <button onClick={() => tambahAgen(1, inputHandle.nama, inputHandle.email, inputHandle.mobileNumber, 1, inputHandle.akunBank, inputHandle.rekeningOwner, inputHandle.settlementFee)} className={(inputHandle.nama.length === 0 || inputHandle.mobileNumber.length === 0 || inputHandle.akunBank.length === 0 || inputHandle.bankName.length === 0 || inputHandle.rekeningOwner.length === 0) ? "btn-off" : "add-button"} disabled={ inputHandle.nama.length === 0 || inputHandle.mobileNumber.length === 0 || inputHandle.akunBank.length === 0 || inputHandle.bankName.length === 0 || inputHandle.rekeningOwner.length === 0 }>
                    Tambahkan
                </button>
            </div>
            <Modal centered show={showModal} onHide={() => setShowModal(false)} style={{ borderRadius: 8 }}>
                <Modal.Body style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 24, marginBottom: 12 }}>
                        <img src={checklistCircle} alt="logo" />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>Agen Berhasil Ditambahkan</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", textAlign: "center", marginBottom: 24 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }}>Agen sudah aktif dan transaksi agen akan tercatat di dashboard Anda</p>
                    </div>
                    <center>
                        <div style={{ margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                    </center>
                    <div>
                        <p style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>Detail Agen</p>
                        <Table className='detailSave'>
                            <tr>
                                <td>Nama Agen</td>
                                <td style={{ fontWeight: 600 }}>: {detailNewAgen.agen_name}</td>
                            </tr>
                            <tr>
                                <td>Email Agen</td>
                                <td style={{ fontWeight: 600 }}>: {detailNewAgen.agen_email}</td>
                            </tr>
                            <tr>
                                <td>No Hp Agen</td>
                                <td style={{ fontWeight: 600 }}>: {detailNewAgen.agen_mobile}</td>
                            </tr>
                            <tr>
                                <td>Nama Bank</td>
                                <td style={{ fontWeight: 600 }}>: {detailNewAgen.agen_bank}</td>
                            </tr>
                            <tr>
                                <td>Nomor Rekening</td>
                                <td style={{ fontWeight: 600 }}>: {detailNewAgen.agen_bank_number}</td>
                            </tr>
                            <tr>
                                <td>Nama Pemilik Rekening</td>
                                <td style={{ fontWeight: 600 }}>: {detailNewAgen.agen_bank_name}</td>
                            </tr>
                            <tr>
                                <td>Settlement Fee</td>
                                <td style={{ fontWeight: 600 }}>: {convertToRupiah(detailNewAgen.settlement_fee, false, detailNewAgen.settlement_fee === 0 ? 0 : 2)}</td>
                            </tr>
                        </Table>
                        <p style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700 }}>ID Agen & Kode Unik</p>
                        <Table className='detailSave'>
                            <tr>
                                <td>ID Agen</td>
                                <td style={{ fontWeight: 600 }}>: {detailNewAgen.agen_id}</td>
                            </tr>
                        </Table>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                        <Button variant="primary" onClick={() => successButtonHandle()} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Oke</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default TambahAgen