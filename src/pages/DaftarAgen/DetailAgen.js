import React, { useEffect, useState } from 'react'
import { Col, Row, Form } from '@themesberg/react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import { BaseURL, errorCatch, getRole, getToken, language, RouteTo, setUserSession } from '../../function/helpers';
import axios from 'axios';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import alertIcon from "../../assets/icon/alert_icon.svg";
import { eng } from '../../components/Language';

function DetailAgen() {

    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
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
            const detailAgen = await axios.post(BaseURL + "/Agen/EditAgen", { data: dataParams }, { headers: headers })
            if (detailAgen.status === 200 && detailAgen.data.response_code === 200 && detailAgen.data.response_new_token.length === 0) {
                setDetailAgen(detailAgen.data.response_data)
            } else if (detailAgen.status === 200 && detailAgen.data.response_code === 200 && detailAgen.data.response_new_token.length !== 0) {
                setUserSession(detailAgen.data.response_new_token)
                setDetailAgen(detailAgen.data.response_data)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function editAgen(agenId) {
        // RouteTo(`/editagen/${agenId}`)
        history.push(`/editagen/${agenId}`)
    }

    function toDashboard() {
        history.push("/");
    }

    function toLaporan() {
        history.push("/laporan");
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        getDetailAgen(agenId)
    }, [agenId])

    function editAgen(agenId) {
        history.push(`/editagen/${agenId}`)
    }

    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px" }}>
            <span className='breadcrumbs-span'>{user_role === "102"? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}>{language === null ? eng.laporan : language.laporan}</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}>Beranda</span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;<Link to={"/daftaragen"}>{language === null ? eng.daftarAgen : language.daftarAgen}</Link> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;{language === null ? eng.detailAgen : language.detailAgen}</span>
            <div className="head-title">
                <div className="mt-4 mb-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>{language === null ? eng.detailAgen : language.detailAgen}</div>
                {/* <h5 style={{ fontFamily: "Exo" }}>Detail Agen</h5> */}
            </div>
            <div className='base-content' style={{ width:"100%", padding: 50 }}>
                <div>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                {language === null ? eng.status : language.status}
                            </span>
                        </Col>
                        <Col xs={2}>
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label={(detailAgen.status === true) ? (language === null ? eng.aktif : language.aktif) : (language === null ? eng.tidakAktif : language.tidakAktif)}
                                checked={detailAgen.status}
                            />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                {language === null ? eng.idAgen : language.idAgen}
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
                                {language === null ? eng.namaAgen : language.namaAgen}
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
                                {language === null ? eng.emailAgen : language.emailAgen}
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
                                {language === null ? eng.noHpAgen : language.noHpAgen}
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
                                {language === null ? eng.namaBank : language.namaBank}
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
                                {language === null ? eng.noRek : language.noRek}
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
                                {language === null ? eng.namaPemilikRek : language.namaPemilikRek}
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
                    {/* <Row className='mt-2'>
                        <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                            <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                Nominal Top up
                            </span>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                value={(detailAgen.nominal_topup === null ? 0 : detailAgen.nominal_topup)}
                                type='text'
                                disabled
                                style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                            />
                        </Col>
                    </Row> */}
                </div>
            </div>
            <div className="head-title">
                <div className="mt-4 mb-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>{language === null ? eng.rekSubAkun : language.rekSubAkun}</div>
            </div>
            {
                detailAgen.subaccount_acc_number !== null ?
                (
                    <div className='base-content' style={{ width:"100%", padding: 50 }}>
                        <div>
                            <Row className='mb-4'>
                                <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                    <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                        {language === null ? eng.namaBank : language.namaBank}
                                    </span>
                                </Col>
                                <Col xs={9}>
                                    <Form.Control
                                        value={detailAgen.subaccount_bank_name}
                                        type='text'
                                        disabled
                                        style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                        />
                                </Col>
                            </Row>
                            <Row className='mb-4'>
                                <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                    <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                        {language === null ? eng.noRek : language.noRek}
                                    </span>
                                </Col>
                                <Col xs={9}>
                                    <Form.Control
                                        name='akunBank'
                                        value={detailAgen.subaccount_acc_number}
                                        type='text'
                                        disabled
                                        style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                        />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={3} style={{ width: '14%', paddingRight: "unset" }}>
                                    <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                        {language === null ? eng.namaPemilikRek : language.namaPemilikRek}
                                    </span>
                                </Col>
                                <Col xs={9}>
                                    <Form.Control
                                        value={detailAgen.subaccount_acc_name}
                                        type='text'
                                        disabled
                                        style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                        />
                                </Col>
                            </Row>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            width:"100%",
                            fontSize: "14px",
                            background: "rgba(255, 214, 0, 0.16)",
                            borderRadius: "4px",
                            fontStyle: "italic",
                            padding: "12px",
                            gap: 10,
                        }}
                        className="text-start my-1"
                    >
                        <span className="mx-2">
                            <img src={alertIcon} alt="alert" />
                        </span>
                        {language === null ? eng.silahkanHubungiAdmin : language.silahkanHubungiAdmin}
                    </div>
                )
            }
            {
                user_role === "102" ?
                <div style={{ display: "flex", justifyContent: "end", marginTop: 16}}>
                    <button onClick={() => editAgen(agenId)} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 136, height: 45, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                        {language === null ? eng.edit : language.edit}
                    </button>
                </div> : ""
            }
        </div>
    )
}

export default DetailAgen