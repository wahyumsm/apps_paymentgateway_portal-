import { Button, Col, Form, Image, Modal, Row } from '@themesberg/react-bootstrap'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import encryptData from '../../function/encryptData';
import { BaseURL, convertDateTimeStamp, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import DataTable from 'react-data-table-component';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import JSONPretty from 'react-json-pretty';

function ReNotifyVA() {

    const access_token = getToken()
    const user_role = getRole()
    const history = useHistory()
    const [noVA, setNoVA] = useState("")
    const [dataVirtualAccount, setDataVirtualAccount] = useState({})
    const [dataHistoryNotify, setDataHistoryNotify] = useState({})
    const [getDetailNotification, setDetailNotification] = useState({})
    const [showModalSubmit, setShowModalSubmit] = useState(false)
    const [showModalDataNotify, setShowModalDataNotify] = useState(false)
    var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

    function getDetailNotif (id) {
        setShowModalDataNotify(true)
        const findData = dataHistoryNotify.find(item => item.number === id)
        // console.log(findData, "findData");
        setDetailNotification(findData)
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
                <div className='text-center p-1' onClick={() => getDetailNotif(row.number)} style={{ cursor: "pointer", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #383838", borderRadius: 6, fontFamily: "Exo", color: "#2C1919", fontWeight: 700, fontSize: 14, width: 152 }}>
                    Lihat Detail
                </div>
            )
        },
    ]

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
                dataVA.data.response_data.results.history_notify = dataVA.data.response_data.results.history_notify.map((obj, idx) => ({...obj, number: idx + 1}))
                setDataVirtualAccount(dataVA.data.response_data.results)
                setDataHistoryNotify(dataVA.data.response_data.results.history_notify)
                // console.log(dataVA.data.response_data.results.history_notify[0].request_data, 'response_data');
            } else if (dataVA.status === 200 && dataVA.data.response_code === 200 && dataVA.data.response_new_token !== null) {
                dataVA.data.response_data.results.history_notify = dataVA.data.response_data.results.history_notify.map((obj, idx) => ({...obj, number: idx + 1}))
                setUserSession(dataVA.data.response_new_token)
                setDataVirtualAccount(dataVA.data.response_data.results)
                setDataHistoryNotify(dataVA.data.response_data.results.history_notify)
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

    async function resendNotify(noVA) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"virtual_account": "${noVA}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const resendedNotify = await axios.post(BaseURL + "/HelpDesk/ReSendNotificationVA", { data: dataParams }, { headers: headers })
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
        if (!access_token) {
            history.push("/login")
        }
        // if (user_role === "102") {
        //     history.push("/404")
        // }
    }, [access_token, user_role])
    

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Re-Notify Virtual Account</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Re-Notify Virtual Account</h2>
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
                                    Status
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={(dataVirtualAccount.mstatus_name_ind !== undefined) ? dataVirtualAccount.mstatus_name_ind : null}
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

                    <div className='base-content mt-4' style={{ width:"100%", padding: 50 }}>
                        <div className="pb-2" style={{ fontFamily: "Exo", fontWeight: 700, fontSize: 16, color: "#383838" }}>Tabel Notifikasi</div>
                        <div className="div-table">
                            <DataTable
                                columns={columns}
                                data={dataHistoryNotify}
                                customStyles={customStyles}
                                // pagination
                                highlightOnHover
                                progressComponent={<CustomLoader />}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                        <button
                            onClick={() => resendNotify(noVA)}
                            className={(dataVirtualAccount.is_success === undefined || dataVirtualAccount.is_success === false) ? "btn-off mt-3 mb-3 me-2" : 'add-button mt-3 mb-3 me-2'}
                            style={{ maxWidth: 'max-content', padding: 7, height: 40, }}
                            disabled={dataVirtualAccount.is_success === undefined || dataVirtualAccount.is_success === false}
                        >
                            Resend Notification
                        </button>
                        <button
                            onClick={() => setShowModalSubmit(true)}
                            className={(dataVirtualAccount.is_success === undefined || dataVirtualAccount.is_success !== false) ? "btn-off mt-3 mb-3" : 'add-button mt-3 mb-3'}
                            style={{ maxWidth: 'max-content', padding: 7, height: 40, }}
                            disabled={dataVirtualAccount.is_success === undefined || dataVirtualAccount.is_success !== false}
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

            <Modal
                size="lg"
                centered
                show={showModalDataNotify}
                onHide={() => setShowModalDataNotify(false)}
                style={{ display: "flex", borderRadius: 8, justifyContent: "center" }}
            >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>
                        <div className='pb-3'>Request Data</div>
                        <div className='p-3' style={{ fontFamily: "Nunito", fontSize: 16, border: "1px solid #EBEBEB", borderRadius: 6 }}><JSONPretty id="json-pretty" data={getDetailNotification.request_data}></JSONPretty></div>
                    </div>
                    <hr />
                    <div style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>
                        <div className='pb-3'>Response Data</div>
                        {
                            isHTML(getDetailNotification.response_data) !== true ? (
                                <div className='p-3' style={{ fontFamily: "Nunito", fontSize: 16, border: "1px solid #EBEBEB", borderRadius: 6 }}><JSONPretty id="json-pretty" data={getDetailNotification.response_data}></JSONPretty></div>
                            ) : (
                                <div style={{ fontFamily: "Nunito", fontSize: 16 }} dangerouslySetInnerHTML={{ __html: getDetailNotification.response_data }} />
                            )
                        }
                    </div>   
                    <hr />           
                    <div className="d-flex justify-content-center my-3">
                        <Button onClick={() => setShowModalDataNotify(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;", borderColor: "#EBEBEB" }} className="mx-2">OKE</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ReNotifyVA