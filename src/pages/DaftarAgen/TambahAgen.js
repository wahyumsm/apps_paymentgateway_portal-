import React, { useEffect, useState } from 'react'
import { Col, Row, Form, InputGroup, Modal, Button, Table } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import { BaseURL, errorCatch, getToken, RouteTo, setUserSession } from '../../function/helpers';
import axios from 'axios';
import checklistCircle from '../../assets/img/icons/checklist_circle.svg';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import "./TambahAgen.css";
import noteIconRed from "../../assets/icon/note_icon_red.svg"

function TambahAgen() {

    const history = useHistory()
    const access_token = getToken()
    const [inputHandle, setInputHandle] = useState({
        nama: "",
        email: "",
        mobileNumber: "",
        bankName: "BCA",
        akunBank: "",
        rekeningOwner: "",
        status: "true",
        settlementFee: 0,
    })
    const [showModal, setShowModal] = useState(false)
    const [detailNewAgen, setDetailNewAgen] = useState({})

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    const [errorCode, setErrorCode] = useState(0)


    async function tambahAgen(status, nama, email, mobileNumber, bankName, akunBank, rekeningOwner, settlementFee) {
        try {         

            // console.log(inputHandle.email.length)

            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"agen_name": "${nama}", "agen_email": "${email}", "agen_mobile": "${mobileNumber}", "agen_bank_id": ${bankName}, "agen_bank_number": "${akunBank}", "agen_bank_name": "${rekeningOwner}", "status": ${status}, "settlement_fee": ${settlementFee}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const addAgen = await axios.post(BaseURL + "/Agen/SaveAgen", { data: dataParams }, { headers: headers })
            // console.log(addAgen);
            if (addAgen.status === 200 && addAgen.data.response_code === 200 && addAgen.data.response_new_token.length === 0) {
                setDetailNewAgen(addAgen.data.response_data)
                setShowModal(true)
            } else {
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
        // RouteTo("/daftaragen")
        history.push("/daftaragen")
    }

    useEffect(() => {
        if (!access_token) {
            // RouteTo("/login")
        history.push('/login');
        // window.location.reload();
        }
    }, [])
    

    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px" }}>
            <span className='breadcrumbs-span'>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Daftar Agen &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;Tambah Agen</span>
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
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Agen*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
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
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Email Agen*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
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
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No Hp Agen*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='mobileNumber'
                                onChange={handleChange}
                                placeholder="Masukkan No Hp Agen"
                                type='number'
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
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Bank*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
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
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No Rekening*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='akunBank'
                                onChange={handleChange}
                                placeholder="Masukkan No Rekening"
                                type='number'
                                required
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: "100%", height: 40, marginTop: '-7px' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Pemilik Rekening
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
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
                    <Row>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Settlement Fee
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='settlementFee'
                                onChange={handleChange}
                                placeholder="Masukkan Nama Pemilik Rekening"
                                type='number'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: "100%", height: 40, marginTop: '-7px' }}
                                />
                        </Col>
                    </Row>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "end", marginTop: 16, marginRight: 83 }}>
                <button onClick={() => tambahAgen(1, inputHandle.nama, inputHandle.email, inputHandle.mobileNumber, 1, inputHandle.akunBank, inputHandle.rekeningOwner, inputHandle.settlementFee)} className={(inputHandle.nama.length === 0 || inputHandle.mobileNumber.length === 0 || inputHandle.akunBank.length === 0 || inputHandle.bankName.length === 0) ? "btn-off" : "add-button"} disabled={ inputHandle.nama.length === 0 || inputHandle.mobileNumber.length === 0 || inputHandle.akunBank.length === 0 || inputHandle.bankName.length === 0 }>
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