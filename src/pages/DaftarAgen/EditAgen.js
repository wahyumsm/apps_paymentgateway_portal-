import React, { useEffect, useState } from 'react'
import { Col, Row, Form, InputGroup } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import { BaseURL, getToken } from '../../function/helpers';
import axios from 'axios';
import "./DetailAgen.css"

function EditAgen() {

    const history = useHistory()
    const access_token = getToken()
    const { agenId } = useParams()
    const [detailAgen, setDetailAgen] = useState([])
    const [inputHandle, setInputHandle] = useState({
        id:agenId,
        namaAgen: detailAgen.agen_name,
        emailAgen: detailAgen.agen_email,
        phoneNumber: detailAgen.agen_mobile,
        bankName: 1,
        akunBank: detailAgen.agen_bank_number,
        rekeningOwner: detailAgen.agen_bank_name,
        active: detailAgen.status
    })

    function handleChange(e) {
        if (e.target.name === "active") {
            setInputHandle({
                ...inputHandle,
                [e.target.name] : !inputHandle.active
            })
        } else {
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function getDetailAgen(agenId) {
        try {
            // const agen_id = "EDS2940181"
            // console.log(agenId, 'ini agen id di func');
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"agen_id":"${agenId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const detailAgen = await axios.post("/Agen/EditAgen", { data: dataParams }, { headers: headers })
            // console.log(detailAgen, 'ini detail agen');
            if (detailAgen.status === 200 && detailAgen.data.response_code === 200) {
                // console.log(detailAgen.data.response_data, 'ini detail agen');
                // (detailAgen.data.response_data.status === true) ? { ...detailAgen.data.response_data, isActive: "Aktif" } : { ...detailAgen.data.response_data, isActive: "Tidak Aktif" }
                if (detailAgen.data.response_data.status === true) {
                    detailAgen.data.response_data = {
                        ...detailAgen.data.response_data,
                        isActive: "Aktif"
                    }
                } else {
                    detailAgen.data.response_data = {
                        ...detailAgen.data.response_data,
                        isActive: "Tidak Aktif"
                    }
                }
                setDetailAgen(detailAgen.data.response_data)
            }
        } catch (error) {
            console.log(error)
            if (error.response.status === 401) {
                history.push('/sign-in')
            }
        }
    }

    async function updateDetailAgen(id, namaAgen, emailAgen, phoneNumber, bankName, akunBank, rekeningOwner, active) {
        try {
            if (namaAgen === undefined) {
                namaAgen = detailAgen.agen_name
            }
            if (emailAgen === undefined) {
                emailAgen = detailAgen.agen_email
            }
            if (phoneNumber === undefined) {
                phoneNumber = detailAgen.agen_mobile
            }
            if (akunBank === undefined) {
                akunBank = detailAgen.agen_bank_number
            }
            if (rekeningOwner === undefined) {
                rekeningOwner = detailAgen.agen_bank_name
            }
            if (active === undefined) {
                active = detailAgen.status
            }
            // console.log(agenId, 'ini agen id di func');
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"agen_id":"${id}", "agen_name":"${namaAgen}", "agen_email":"${emailAgen}", "agen_mobile":"${phoneNumber}", "agen_bank_id":"${bankName}", "agen_bank_number":"${akunBank}", "agen_bank_name":"${rekeningOwner}", "status":"${active}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const editAgen = await axios.post("/Agen/UpdateAgen", { data: dataParams }, { headers: headers })
            // console.log(detailAgen, 'ini detail agen');
            if (editAgen.status === 200 && editAgen.data.response_code === 200) {
                console.log(editAgen.data.response_data, 'ini update agen');
                history.push("/daftaragen")
            }
            alert("Edit Data Agen Berhasil")
        } catch (error) {
            console.log(error)
            // if (error.response.status === 401) {
            //     history.push('/sign-in')
            // }
        }
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/sign-in');
            // window.location.reload();
        }
        getDetailAgen(agenId)
    }, [access_token, agenId, getDetailAgen, history])
    
    const goBack = () => {
        window.history.back();
    };
    console.log(inputHandle.active, 'ini detail agen dari input handle');

    return (
        <div className='main-content' style={{ padding: "37px 27px" }}>
            <div className="head-title">
                <h4 className="mt-5 mb-4" style={{ fontFamily: "Exo" }}>Detail Agen</h4>
                {/* <h5 style={{ fontFamily: "Exo" }}>Detail Agen</h5> */}
            </div>
            <div className='base-content' style={{ width:"93%", padding: 50 }}>
                <div>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Status
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label={(inputHandle.active === undefined) ? detailAgen.isActive : (inputHandle.active === true) ? "Aktif" : "Tidak Aktif"}
                                checked={(inputHandle.active === undefined) ? detailAgen.status : inputHandle.active}
                                name="active"
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                ID Agen
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                name='nama'
                                value={detailAgen.agen_id}
                                // placeholder="Masukkan Nama Agen"
                                type='text'
                                disabled
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 870, height: 40, marginTop: '-7px' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Agen
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                name='namaAgen'
                                defaultValue={detailAgen.agen_name}
                                // placeholder="Masukkan Nama Agen"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 870, height: 40, marginTop: '-7px' }}
                                onChange={handleChange}
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
                                name='emailAgen'
                                defaultValue={detailAgen.agen_email}
                                // placeholder="Masukkan Email Agen"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 870, height: 40, marginTop: '-7px' }}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No Hp Agen
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                name='phoneNumber'
                                defaultValue={detailAgen.agen_mobile}
                                // placeholder="Masukkan No Hp Agen"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 870, height: 40, marginTop: '-7px' }}
                                onChange={handleChange}    
                            />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Bank
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                value={detailAgen.agen_bank_id}
                                placeholder="BCA (Bank Central Asia)"
                                type='text'
                                disabled
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 870, height: 40, marginTop: '-7px' }}
                            />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No Rekening
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                name='akunBank'
                                defaultValue={detailAgen.agen_bank_number}
                                // placeholder="Masukkan No Rekening"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 870, height: 40, marginTop: '-7px' }}
                                onChange={handleChange}    
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
                                defaultValue={detailAgen.agen_bank_name}
                                // placeholder="Masukkan Nama Pemilik Rekening"
                                type='text'
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 870, height: 40, marginTop: '-7px' }}
                                onChange={handleChange}    
                            />
                        </Col>
                    </Row>
                </div>
            </div>
            <div className='mb-5 mt-4 me-4 pe-5' style={{ display: "flex", justifyContent: "end"}}>
                <button onClick={goBack} className='mx-2' style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", gap: 8, width: 136, height: 45, background: "#FFFFFF", color:"#888888", border: "0.6px solid #EBEBEB", borderRadius: 6 }}>
                    Batal
                </button>
                <button onClick={() => updateDetailAgen(inputHandle.id, inputHandle.namaAgen, inputHandle.emailAgen, inputHandle.phoneNumber, inputHandle.bankName, inputHandle.akunBank, inputHandle.rekeningOwner, inputHandle.active)} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 900, alignItems: "center", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                    Simpan
                </button>
            </div>
        </div>
    )
}

export default EditAgen