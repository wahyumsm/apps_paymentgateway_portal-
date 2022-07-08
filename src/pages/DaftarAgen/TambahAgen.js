import React, { useEffect, useState } from 'react'
import { Col, Row, Form, InputGroup } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import { BaseURL, getToken } from '../../function/helpers';
import axios from 'axios';
import tambahAgenIcon from '../../assets/icon/tambahagen_icon.svg'

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
    })

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    async function tambahAgen(status, nama, email, mobileNumber, bankName, akunBank, rekeningOwner) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"agen_name": "${nama}", "agen_email": "${email}", "agen_mobile": "${mobileNumber}", "agen_bank_id": "${bankName}", "agen_bank_number": "${akunBank}", "agen_bank_name": "${rekeningOwner}", "status": ${status}}`)
            // console.log(dataParams, 'ini data params');
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const addAgen = await axios.post("/Agen/SaveAgen", { data: dataParams }, { headers: headers })            
            // console.log(addAgen, 'ini add agen');
            history.push("/daftaragen")
            alert("Agen Baru Berhasil Ditambahkan")
        } catch (error) {
            console.log(error)
            if (error.response.status === 401) {
                history.push('/sign-in')
            }
        }
    }

    useEffect(() => {
        if (!access_token) {
        history.push('/sign-in');
        // window.location.reload();
    }
    }, [])
    

    return (
        <div className='main-content' style={{ padding: "37px 27px" }}>
            <div className="head-title">
                <h4 className="mt-5 mb-4" style={{ fontFamily: "Exo" }}>Tambah Agen Baru</h4>
                <h5 style={{ fontFamily: "Exo" }}>Detail Agen</h5>
            </div>
            <div className='base-content' style={{ width:"93%", padding: 50 }}>
                <div>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Agen*
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                name='nama'
                                onChange={handleChange}
                                placeholder="Masukkan Nama Agen"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 917, height: 40, marginTop: '-7px' }}
                            />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Email Agen
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                name='email'
                                onChange={handleChange}
                                placeholder="Masukkan Email Agen"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 917, height: 40, marginTop: '-7px' }}
                            />                                                        
                        </Col>
                        {/* <Col xs={2}>
                            <Form.Control
                                name='mobileNumber'
                                onChange={handleChange}
                                placeholder="Masukkan No Hp Agen"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 917, height: 40, marginTop: '-7px', borderColor: '#B9121B' }}
                            />
                        </Col>
                        <div className='d-flex align-items-center mt-2 mx-5 px-5'><img src={tambahAgenIcon} alt="logo" className='ms-3 px-3' /><div style={{color: "#B9121B", fontSize: "14px"}}>No Hp sudah terdaftar menjadi agen</div></div> */}
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No Hp Agen*
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                name='mobileNumber'
                                onChange={handleChange}
                                placeholder="Masukkan No Hp Agen"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 917, height: 40, marginTop: '-7px'}}
                            />
                        </Col>
                        {/* <Col xs={2}>
                            <Form.Control
                                name='mobileNumber'
                                onChange={handleChange}
                                placeholder="Masukkan No Hp Agen"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 917, height: 40, marginTop: '-7px', borderColor: '#B9121B' }}
                            />
                        </Col>
                        <div className='d-flex align-items-center mt-2 mx-5 px-5'><img src={tambahAgenIcon} alt="logo" className='ms-3 px-3' /><div style={{color: "#B9121B", fontSize: "14px"}}>No Hp sudah terdaftar menjadi agen</div></div> */}
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Bank*
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                placeholder="BCA"
                                type='text'
                                disabled
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 917, height: 40, marginTop: '-7px' }}
                            />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No Rekening*
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                name='akunBank'
                                onChange={handleChange}
                                placeholder="Masukkan No Rekening"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 917, height: 40, marginTop: '-7px' }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Pemilik Rekening
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                name='rekeningOwner'
                                onChange={handleChange}
                                placeholder="Masukkan Nama Pemilik Rekening"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 917, height: 40, marginTop: '-7px' }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "end", marginTop: 16, marginRight: 83 }}>
                <button onClick={() => tambahAgen(1, inputHandle.nama, inputHandle.email, inputHandle.mobileNumber, 1, inputHandle.akunBank, inputHandle.rekeningOwner)} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                    Tambahkan
                </button>
            </div>
        </div>
    )
}

export default TambahAgen