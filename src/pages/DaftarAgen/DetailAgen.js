import React, { useEffect, useState } from 'react'
import { Col, Row, Form, InputGroup } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useLocation } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import { BaseURL, getToken } from '../../function/helpers';
import axios from 'axios';
import "./DetailAgen.css"

function DetailAgen() {

    const history = useHistory()
    const [detailAgen, setDetailAgen] = useState([])
    const agenId = useLocation().state.agenId
    // console.log(agenId, 'ini location');

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
            const detailAgen = await axios.post(BaseURL + "/Agen/EditAgen", { data: dataParams }, { headers: headers })
            // console.log(detailAgen, 'ini detail agen');
            if (detailAgen.status === 200 && detailAgen.data.response_code === 200) {
                // console.log(detailAgen.data.response_data, 'ini detail agen');
                setDetailAgen(detailAgen.data.response_data)
            }
        } catch (error) {
            console.log(error)
            if (error.response.status === 401) {
                history.push('/sign-in')
            }
        }
    }

    useEffect(() => {
        getDetailAgen(agenId)
    }, [agenId])
    

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
                                label="Aktif"
                                checked={detailAgen.status}
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
                                name='nama'
                                value={detailAgen.agen_name}
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
                                Email Agen
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                name='email'
                                value={detailAgen.agen_email}
                                // placeholder="Masukkan Email Agen"
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
                                No Hp Agen
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                name='mobileNumber'
                                value={detailAgen.agen_mobile}
                                // placeholder="Masukkan No Hp Agen"
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
                                Nama Bank
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Control
                                value={detailAgen.agen_bank}
                                // placeholder="BCA"
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
                                value={detailAgen.agen_bank_number}
                                // placeholder="Masukkan No Rekening"
                                type='text'
                                disabled
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 870, height: 40, marginTop: '-7px' }}
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
                                value={detailAgen.agen_bank_name}
                                // placeholder="Masukkan Nama Pemilik Rekening"
                                type='text'
                                disabled
                                // aria-label="Masukkan Nama Agen"
                                // aria-describedby="basic-addon2"
                                style={{ width: 870, height: 40, marginTop: '-7px' }}
                                />
                        </Col>
                    </Row>
                </div>
            </div>
            {/* <div style={{ display: "flex", justifyContent: "end", marginTop: 16, marginRight: 83 }}>
                <button disabled style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                    Edit
                </button>
            </div> */}
        </div>
    )
}

export default DetailAgen