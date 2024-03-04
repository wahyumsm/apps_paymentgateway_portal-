import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Link, useHistory } from 'react-router-dom'
import { Button, Col, Form, Image, Modal, Row } from '@themesberg/react-bootstrap'
import DataTable from 'react-data-table-component'
import { BaseURL, convertDateTimeStamp, convertToRupiah, errorCatch, getToken, setUserSession } from '../../function/helpers'
import encryptData from '../../function/encryptData'
import axios from 'axios'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import JSONPretty from 'react-json-pretty'

const ReNotifyQris = () => {
    const history = useHistory()
    const [noQris, setNoQris] = useState("")
    const [dataQris, setDataQris] = useState({})
    const [partnerId, setPartnerId] = useState("")
    const [dataHistoryNotifyQris, setDataHistoryNotifyQris] = useState({})
    const [getDetailNotificationQris, setGetDetailNotificationQris] = useState({})
    const [showModalDataNotifyQris, setShowModalDataNotifyQris] = useState(false)
    const [showModalSubmitQris, setShowModalSubmitQris] = useState(false)
    var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

    function handleChange(e) {
        setNoQris(e.target.value)
    }

    async function userDetails() {
        try {
          const auth = "Bearer " + getToken()
          const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const userDetail = await axios.post(BaseURL + "/Account/GetUserProfile", { data: "" }, { headers: headers })
          // console.log(userDetail, 'ini user detal funct');
          if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length === 0) {
            setPartnerId(userDetail.data.response_data.muser_username)
          } else if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length !== 0) {
            setUserSession(userDetail.data.response_new_token)
            setPartnerId(userDetail.data.response_data.muser_username)
          }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    async function searchQris(noQris) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"transaction_code": "${noQris}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const getDataQris = await axios.post(BaseURL + "/Helpdesk/GetReNotifyQRIS", { data: dataParams }, { headers: headers })
            if (getDataQris.status === 200 && getDataQris.data.response_code === 200 && getDataQris.data.response_new_token === null) {
                getDataQris.data.response_data.results.history_notify = getDataQris.data.response_data.results.history_notify.map((obj, idx) => ({...obj, number: idx + 1}))
                setDataQris(getDataQris.data.response_data.results)
                setDataHistoryNotifyQris(getDataQris.data.response_data.results.history_notify)
                // console.log(getDataQris.data.response_data.results.history_notify[0].request_data, 'response_data');
            } else if (getDataQris.status === 200 && getDataQris.data.response_code === 200 && getDataQris.data.response_new_token !== null) {
                getDataQris.data.response_data.results.history_notify = getDataQris.data.response_data.results.history_notify.map((obj, idx) => ({...obj, number: idx + 1}))
                setUserSession(getDataQris.data.response_new_token)
                setDataQris(getDataQris.data.response_data.results)
                setDataHistoryNotifyQris(getDataQris.data.response_data.results.history_notify)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    const [inputHandleRrn, setInputHandleRrn] = useState("")
    function handleChangeRrn (e) {
        setInputHandleRrn(e.target.value)
    }
    
    // console.log(dataQris.rrn, "dataQris.rrn");
    // console.log(dataQris.tpayewallet_pay_trans_id, "dataQris.tpayewallet_pay_trans_id");

    async function submitReNotify(noQris, rrn, partnerId) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"transaction_code": "${noQris}" "rrn": "${rrn}", "submited_user": "${partnerId}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            // console.log(dataParams, "dataParams");
            const submittedReNotify = await axios.post(BaseURL + "/Helpdesk/SubmitReNotifyQRIS", { data: dataParams }, { headers: headers })
            if (submittedReNotify.status === 200 && submittedReNotify.data.response_code === 200 && submittedReNotify.data.response_new_token === null) {
                alert(submittedReNotify.data.response_data.results.Message)
                setShowModalSubmitQris(false)
                window.location.reload()
            } else if (submittedReNotify.status === 200 && submittedReNotify.data.response_code === 200 && submittedReNotify.data.response_new_token !== null) {
                setUserSession(submittedReNotify.data.response_new_token)
                alert(submittedReNotify.data.response_data.results.Message)
                setShowModalSubmitQris(false)
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

    async function resendNotifyQris(noQris) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"transaction_code": "${noQris}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const resendedNotify = await axios.post(BaseURL + "/Helpdesk/ReSendNotificationQRIS", { data: dataParams }, { headers: headers })
            if (resendedNotify.status === 200 && resendedNotify.data.response_code === 200 && resendedNotify.data.response_new_token === null) {
                alert(resendedNotify.data.response_data.results.Message)
                window.location.reload()
            } else if (resendedNotify.status === 200 && resendedNotify.data.response_code === 200 && resendedNotify.data.response_new_token !== null) {
                setUserSession(resendedNotify.data.response_new_token)
                alert(resendedNotify.data.response_data.results.Message)
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

    function getDetailNotifQris (id) {
        setShowModalDataNotifyQris(true)
        const findData = dataHistoryNotifyQris.find(item => item.number === id)
        setGetDetailNotificationQris(findData)
    }

    const columns = [
        {
            name: "Waktu",
            selector: row => row.date,
            width: "200px"
        },
        {
            name: "URL",
            selector: row => row.url,
            wrap: true,
            width: "340px"
        },
        {
            name: "HTTP Status",
            selector: row => row.response_code,
            width: "150px"
        },
        {
            name: 'Aksi',
            width: "200px",
            cell: (row) => (
                <div className='text-center p-1' onClick={() => getDetailNotifQris(row.number)} style={{ cursor: "pointer", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #383838", borderRadius: 6, fontFamily: "Exo", color: "#2C1919", fontWeight: 700, fontSize: 14, width: 152 }}>
                    Lihat Detail
                </div>
            )
        },
    ]

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'flex-start',
                width: '150px'
            },
        },
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
          <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          <div>Loading...</div>
        </div>
    );

    useEffect(() => {
        userDetails()
    }, [])
    

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Re-Notify QRIS</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Re-Notify QRIS</h2>
            </div>
            <div className='main-content'>
                <div className='base-content mt-3 mb-3'>
                    <Row className='mb-4'>
                        <Col xs={5} className="d-flex justify-content-start align-items-center">
                            <span className='me-3' style={{ width: "30%" }}>Kode QRIS*</span>
                            <Form.Control
                                name='noQris'
                                onChange={handleChange}
                                placeholder="Nomor QRIS"
                                type='text'
                                style={{ width: "50%", height: 40, marginTop: '-7px', marginLeft: 'unset', marginRight: 10 }}
                            />
                            <button
                                onClick={() => searchQris(noQris)}
                                className={(noQris.length === 0) ? 'btn-off' : 'add-button'}
                                style={{ maxWidth: 'max-content', padding: 7, height: 40, marginTop: -6 }}
                                disabled={(noQris.length === 0) ? true : false}
                            >
                                Cari
                            </button>
                        </Col>
                    </Row>
                    <div className='base-content' style={{ width:"100%", padding: 50 }}>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    RRN
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={dataQris.rrn !== null ? dataQris.rrn : inputHandleRrn}
                                    onChange={(e) => handleChangeRrn(e)}
                                    disabled={dataQris.rrn !== null}
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Partner Trans ID
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={dataQris.tqristrans_partner_trans_id}
                                    disabled
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Kode Transaksi
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={dataQris.tqristrans_code}
                                    disabled
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Nama Partner
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={dataQris.mpartner_name}
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
                                    value={dataQris.tqristranscallbacklog_partner_id}
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
                                    value={(dataQris.tqristrans_amount !== undefined) ? convertToRupiah(dataQris.tqristrans_amount) : null}
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
                                    value={(dataQris.trans_date !== undefined) ? convertDateTimeStamp(dataQris.trans_date) : null}
                                    disabled
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Status
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={(dataQris.mstatus_name !== undefined) ? dataQris.mstatus_name : null}
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
                                dataQris.notes !== undefined &&
                                <Col xs={10}>
                                    <Form.Control
                                        value={dataQris.notes}
                                        disabled
                                        type='text'
                                        style={{ background: (dataQris.is_warning) ? "#FDEAEA" : "rgba(7, 126, 134, 0.08)", color: "#077E86", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                        />
                                </Col>
                            }
                        </Row>
                    </div>

                    <div className='base-content mt-4' style={{ width:"100%", padding: 50 }}>
                        <div className="pb-2" style={{ fontFamily: "Exo", fontWeight: 700, fontSize: 16, color: "#383838" }}>Tabel Notifikasi</div>
                        <div className="div-table">
                            <DataTable
                                columns={columns}
                                data={dataHistoryNotifyQris}
                                customStyles={customStyles}
                                // pagination
                                highlightOnHover
                                progressComponent={<CustomLoader />}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                        <button
                            onClick={() => resendNotifyQris(noQris)}
                            className={(dataQris.is_success === undefined || dataQris.is_success === false) ? "btn-off mt-3 mb-3 me-2" : 'add-button mt-3 mb-3 me-2'}
                            style={{ maxWidth: 'max-content', padding: 7, height: 40, }}
                            disabled={dataQris.is_success === undefined || dataQris.is_success === false}
                        >
                            Resend Notification
                        </button>
                        <button
                            onClick={() => setShowModalSubmitQris(true)}
                            className={(dataQris.is_success === undefined || dataQris.is_success !== false) ? "btn-off mt-3 mb-3" : 'add-button mt-3 mb-3'}
                            style={{ maxWidth: 'max-content', padding: 7, height: 40, }}
                            disabled={dataQris.is_success === undefined || dataQris.is_success !== false}
                        >
                            Submit Re-Notify
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                size="lg"
                centered
                show={showModalSubmitQris}
                onHide={() => setShowModalSubmitQris(false)}
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
                        <Button onClick={() => setShowModalSubmitQris(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB" }} className="mx-2">Tidak</Button>
                        <Button onClick={() => submitReNotify(noQris, dataQris.rrn !== null ? dataQris.rrn : inputHandleRrn, partnerId)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                size="lg"
                centered
                show={showModalDataNotifyQris}
                onHide={() => setShowModalDataNotifyQris(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
            >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>
                        <div className='pb-3'>Request Data</div>
                        <div className='p-3' style={{ fontFamily: "Nunito", fontSize: 16, border: "1px solid #EBEBEB", borderRadius: 6 }}><JSONPretty id="json-pretty" data={getDetailNotificationQris.request_data}></JSONPretty></div>
                    </div>
                    <hr />
                    <div style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>
                        <div className='pb-3'>Response Data</div>
                        {
                            isHTML(getDetailNotificationQris.response_data) !== true ? (
                                <div className='p-3' style={{ fontFamily: "Nunito", fontSize: 16, border: "1px solid #EBEBEB", borderRadius: 6 }}><JSONPretty id="json-pretty" data={getDetailNotificationQris.response_data}></JSONPretty></div>
                            ) : (
                                <div style={{ fontFamily: "Nunito", fontSize: 16 }} dangerouslySetInnerHTML={{ __html: getDetailNotificationQris.response_data }} />
                            )
                        }
                    </div>   
                    <hr />           
                    <div className="d-flex justify-content-center my-3">
                        <Button onClick={() => setShowModalDataNotifyQris(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB" }} className="mx-2">OKE</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ReNotifyQris