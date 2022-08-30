import { Button, Col, Form, Modal, Row } from '@themesberg/react-bootstrap'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import encryptData from '../../function/encryptData';
import { BaseURL, convertDateTimeStamp, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';

function ReNotifyVA() {

    const access_token = getToken()
    const user_role = getRole()
    const history = useHistory()
    const [noVA, setNoVA] = useState("")
    const [dataVirtualAccount, setDataVirtualAccount] = useState({})
    const [showModalSubmit, setShowModalSubmit] = useState(false)

    async function searchVA(noVA) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"virtual_account": "${noVA}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataVA = await axios.post(BaseURL + "/HelpDesk/GetReNotifyVA", { data: dataParams }, { headers: headers })
            if (dataVA.status === 200 && dataVA.data.response_code === 200 && dataVA.data.response_new_token === null) {
                setDataVirtualAccount(dataVA.data.response_data.results)
            } else if (dataVA.status === 200 && dataVA.data.response_code === 200 && dataVA.data.response_new_token !== null) {
                setUserSession(dataVA.data.response_new_token)
                setDataVirtualAccount(dataVA.data.response_data.results)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    function handleChange(e) {
        setNoVA(e.target.value)
    }

    async function submitReNotify(noVA) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"virtual_account": "${noVA}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const submittedReNotify = await axios.post(BaseURL + "/HelpDesk/SubmitReNotifyVA", { data: dataParams }, { headers: headers })
            if (submittedReNotify.status === 200 && submittedReNotify.data.response_code === 200 && submittedReNotify.data.response_new_token === null) {
                alert(submittedReNotify.data.response_data.results.Message)
                setShowModalSubmit(false)
                window.location.reload()
            } else if (submittedReNotify.status === 200 && submittedReNotify.data.response_code === 200 && submittedReNotify.data.response_new_token !== null) {
                setUserSession(submittedReNotify.data.response_new_token)
                alert(submittedReNotify.data.response_data.results.Message)
                setShowModalSubmit(false)
                window.location.reload()
            }
        } catch (error) {
            // console.log(error);
            if (error.response.status === 400 && error.response.data.response_code === 400) {
                alert(error.response.data.response_message)
            }
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        if (!access_token) {
            history.push("/login")
        }
        if (user_role === "102") {
            history.push("/404")
        }
    }, [access_token, user_role])
    

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Re-Notify Virtual Account</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4">Re-Notify Virtual Account</h2>
            </div>
            <div className='main-content'>
                <div className='base-content mt-3 mb-3'>
                    <Row className='mb-4'>
                        <Col xs={5} className="d-flex justify-content-start align-items-center">
                            <span className='me-3' style={{ width: "20%" }}>No VA*</span>
                            <Form.Control
                                name='noVA'
                                onChange={handleChange}
                                placeholder="Nomor Virtual Account"
                                type='text'
                                style={{ width: "50%", height: 40, marginTop: '-7px', marginLeft: 'unset', marginRight: 10 }}
                            />
                            <button
                                onClick={() => searchVA(noVA)}
                                className={(noVA.length === 0) ? 'btn-off' : 'add-button'}
                                style={{ maxWidth: 'max-content', padding: 7, height: 40, marginTop: -6 }}
                                disabled={(noVA.length === 0) ? true : false}
                            >
                                Cari
                            </button>
                        </Col>
                    </Row>
                    <div className='base-content' style={{ width:"100%", padding: 50 }}>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    No Virtual Account
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={dataVirtualAccount.tvatrans_va_number}
                                    disabled
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Partner Name
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={dataVirtualAccount.mpartner_name}
                                    disabled
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Sub-Partner
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={dataVirtualAccount.mpartnerdtl_sub_name}
                                    disabled
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Nama Bank
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={dataVirtualAccount.mbank_name}
                                    disabled
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Amount
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={(dataVirtualAccount.tvatrans_amount !== undefined) ? convertToRupiah(dataVirtualAccount.tvatrans_amount) : null}
                                    disabled
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Waktu
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={(dataVirtualAccount.trans_date !== undefined) ? convertDateTimeStamp(dataVirtualAccount.trans_date) : null}
                                    disabled
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Notes
                                </span>
                            </Col>
                            {
                                dataVirtualAccount.notes !== undefined &&
                                <Col xs={10}>
                                    <Form.Control
                                        value={dataVirtualAccount.notes}
                                        disabled
                                        type='text'
                                        style={{ background: (dataVirtualAccount.is_warning) ? "#FDEAEA" : "rgba(7, 126, 134, 0.08)", color: "#077E86", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                        />
                                </Col>
                            }
                        </Row>
                    </div>
                    <div style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                        <button
                            onClick={() => setShowModalSubmit(true)}
                            className={(dataVirtualAccount.is_success === undefined || dataVirtualAccount.is_success !== false) ? "btn-off mt-3 mb-3" : 'add-button mt-3 mb-3'}
                            style={{ maxWidth: 'max-content', padding: 7, height: 40, }}
                        >
                            Submit Re-Notify
                        </button>
                    </div>
                </div>
            </div>
            <Modal
                size="lg"
                centered
                show={showModalSubmit}
                onHide={() => setShowModalSubmit(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
            >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }} className="text-center">Apakah Kamu yakin ingin menyimpan perubahan ini?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }} className="text-center">Pastikan transaksi tersebut telah berhasil.</p>
                    </div>
                    <p>
                        
                    </p>                
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalSubmit(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB" }} className="mx-2">Tidak</Button>
                        <Button onClick={() => submitReNotify(noVA)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ReNotifyVA