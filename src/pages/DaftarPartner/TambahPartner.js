import React, { useEffect, useState } from 'react'
import { Col, Row, Form } from '@themesberg/react-bootstrap';
import { useHistory } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import { BaseURL, convertToRupiah, getToken } from '../../function/helpers';
import axios from 'axios';

function TambahPartner() {
    const [addPartner, setAddPartner] = useState({})
    const history = useHistory()
    const access_token = getToken()
    const [inputHandle, setInputHandle] = useState({
        namaPerusahaan: "",
        emailPerusahaan: "",
        phoneNumber: "",
        alamat: "",
        noNpwp: "",
        namaNpwp: "",
        nama: "",
        noHp:"",
        active: 1,
        bankName: 1,
        akunBank: "",
        rekeningOwner: "",
        fee: 0,
        settlementFee: 0,
    })

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    async function tambahPartner(namaPerusahaan, emailPerusahaan, phoneNumber, alamat, noNpwp, namaNpwp, nama, noHp, active, bankName, akunBank, rekeningOwner, fee, settlementFee) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"mpartner_name": "${namaPerusahaan}", "mpartner_email": "${emailPerusahaan}", "mpartner_telp": "${phoneNumber}", "mpartner_address": "${alamat}", "mpartner_npwp": "${noNpwp}", "mpartner_npwp_name": "${namaNpwp}", "mpartner_direktur": "${nama}", "mpartner_direktur_telp": "${noHp}", "mpartner_is_active": ${active}, "bank_id": ${bankName}, "bank_account_number": "${akunBank}", "bank_account_name": "${rekeningOwner}", "mpartner_fee": ${fee}, "mpartnerdtl_settlement_fee": ${settlementFee}}`)
            // console.log(dataParams, 'ini data params');
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const addPartner = await axios.post("/Partner/SavePartner", { data: dataParams }, { headers: headers })
            console.log(addPartner, 'ini add partner');
            if(addPartner.status === 200 && addPartner.data.response_code === 200) {
                // setAddPartner(addPartner.data.response_data)
                history.push("/daftarpartner")
            }          
            
            alert("Partner Baru Berhasil Ditambahkan")
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
    }, [access_token, history])
    

    return (
        <div className='main-content' style={{ padding: "37px 27px" }}>
            <div className="head-title">
                <h4 className="mt-5 mb-4" style={{ fontFamily: "Exo" }}>Tambah Partner</h4>
                <h5 style={{ fontFamily: "Exo" }}>Profil Perusahaan</h5>
            </div>
            <div className='base-content' style={{ width:"100%", padding: 50 }}>
                <div>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Perusahaan*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='namaPerusahaan'
                                onChange={handleChange}
                                placeholder="Masukkan Nama Perusahaan"
                                type='text'
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Email Perusahaan*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='emailPerusahaan'
                                onChange={handleChange}
                                placeholder="Masukkan Email Perusahaan"
                                type='text'
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nomor Telepon*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='phoneNumber'
                                onChange={handleChange}
                                placeholder="Masukkan Nomor Telepon"
                                type='text'
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Alamat*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='alamat'
                                onChange={handleChange}
                                placeholder="Masukkan Alamat"
                                type='text'
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="head-title">
                <h5 className="mt-5 mb-4" style={{ fontFamily: "Exo" }}>Detail NPWP</h5>
            </div>
            <div className='base-content' style={{ width:"93%", padding: 50 }}>
                <div>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No NPWP*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='noNpwp'
                                onChange={handleChange}
                                placeholder="Masukkan Nomor NPWP"
                                type='text'
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama NPWP*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='namaNpwp'
                                onChange={handleChange}
                                placeholder="Masukkan Nama NPWP"
                                type='text'
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="head-title">
                <h5 className="mt-5 mb-4" style={{ fontFamily: "Exo" }}>Profil Direktur Perusahaan</h5>
            </div>
            <div className='base-content' style={{ width:"93%", padding: 50 }}>
                <div>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Direktur*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='nama'
                                onChange={handleChange}
                                placeholder="Masukkan Nama Direktur"
                                type='text'
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No Hp Direktur*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='noHp'
                                onChange={handleChange}
                                placeholder="Masukkan No HP Direktur"
                                type='text'
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="head-title">
                <h5 className="mt-5 mb-4" style={{ fontFamily: "Exo" }}>Rekening</h5>
            </div>
            <div className='base-content' style={{ width:"93%", padding: 50 }}>
                <div>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Bank*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='bankName'
                                onChange={handleChange}
                                placeholder="BCA"
                                type='text'
                                disabled
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No. Rekening*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='akunBank'
                                onChange={handleChange}
                                placeholder="Masukkan Nomor Rekening"
                                type='text'
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Pemilik Rekening*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='rekeningOwner'
                                onChange={handleChange}
                                placeholder="Masukkan Nama Pemilik Rekening"
                                type='text'
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="head-title">
                <h5 className="mt-5 mb-4" style={{ fontFamily: "Exo" }}>Biaya</h5>
            </div>
            <div className='base-content' style={{ width:"93%", padding: 50 }}>
                <div>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Fee*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='fee'
                                onChange={handleChange}
                                placeholder="Rp."
                                // value={convertToRupiah(inputHandle.fee)}
                                type='number'
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Settlement Fee*
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='settlementFee'
                                onChange={handleChange}
                                placeholder="Rp."
                                type='text'
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "end", marginTop: 16, marginRight: 83 }}>
                <button onClick={() => tambahPartner(inputHandle.namaPerusahaan, inputHandle.emailPerusahaan, inputHandle.phoneNumber, inputHandle.alamat, inputHandle.noNpwp, inputHandle.namaNpwp, inputHandle.nama, inputHandle.noHp, inputHandle.active, inputHandle.bankName, inputHandle.akunBank, inputHandle.rekeningOwner, inputHandle.fee, inputHandle.settlementFee)} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                    Tambahkan
                </button>
            </div>
        </div>
    )
}

export default TambahPartner