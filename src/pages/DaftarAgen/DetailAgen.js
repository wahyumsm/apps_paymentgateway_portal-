import React, { useEffect, useState } from 'react'
import { Col, Row, Form } from '@themesberg/react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import { BaseURL, convertToCurrency, errorCatch, getToken, RouteTo, setUserSession } from '../../function/helpers';
import axios from 'axios';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"

function DetailAgen() {

    const history = useHistory()
    const access_token = getToken()
    const { agenId } = useParams()
    const [detailAgen, setDetailAgen] = useState([])

    async function getDetailAgen(agenId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"agen_id":"${agenId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const detailAgen = await axios.post("/Agen/EditAgen", { data: dataParams }, { headers: headers })
            // console.log(detailAgen, "ini detail agen");
            if (detailAgen.status === 200 && detailAgen.data.response_code === 200 && detailAgen.data.response_new_token.length === 0) {
                setDetailAgen(detailAgen.data.response_data)
            } else if (detailAgen.status === 200 && detailAgen.data.response_code === 200 && detailAgen.data.response_new_token.length !== 0) {
                setUserSession(detailAgen.data.response_new_token)
                setDetailAgen(detailAgen.data.response_data)
            }
        } catch (error) {
            console.log(error)
            // RouteTo(errorCatch(error.response.status))
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
            // window.location.reload();
        }
        getDetailAgen(agenId)
    }, [agenId])

    function editAgen(agenId) {
        // RouteTo(`/editagen/${agenId}`)
        history.push(`/editagen/${agenId}`)
    }
    
    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px" }}>
            <span className='breadcrumbs-span'>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Daftar Agen &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;Detail Agen</span>
            <div className="head-title">
                <h4 className="mt-4 mb-4" style={{ fontFamily: "Exo" }}>Detail Agen</h4>
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
                                label={(detailAgen.status === true) ? "Aktif" : "Tidak Aktif"}
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
                        <Col xs={9}>
                            <Form.Control
                                value={detailAgen.agen_id}
                                type='text'
                                disabled
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Agen
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                value={detailAgen.agen_name}
                                type='text'
                                disabled
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Email Agen
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                value={detailAgen.agen_email}
                                type='text'
                                disabled
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No Hp Agen
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                value={detailAgen.agen_mobile}
                                type='text'
                                disabled
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Bank
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                value={detailAgen.agen_bank}
                                type='text'
                                disabled
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                No Rekening
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                name='akunBank'
                                value={detailAgen.agen_bank_number}
                                type='text'
                                disabled
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nama Pemilik Rekening
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                value={detailAgen.agen_bank_name}
                                type='text'
                                disabled
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nominal Top up
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                value={convertToCurrency(detailAgen.nominal_topup === null ? 0 : detailAgen.nominal_topup)}
                                type='text'
                                disabled
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "end", marginTop: 16, marginRight: 83 }}>
                <button onClick={() => editAgen(agenId)} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                    Edit
                </button>
            </div>
        </div>
    )
}

export default DetailAgen