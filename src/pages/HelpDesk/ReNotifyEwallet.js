import React, { useState } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Link, useHistory } from 'react-router-dom'
import { Col, Form, Row } from '@themesberg/react-bootstrap'
import DataTable from 'react-data-table-component'
import { BaseURL, convertDateTimeStamp, convertToRupiah, errorCatch, getToken, setUserSession } from '../../function/helpers'
import encryptData from '../../function/encryptData'
import axios from 'axios'

const ReNotifyEwallet = () => {
    const history = useHistory()
    const [noEwallet, setNoEwallet] = useState("")
    const [dataEwallet, setDataEwallet] = useState({})
    const [dataHistoryNotify, setDataHistoryNotify] = useState({})

    function handleChange(e) {
        setNoEwallet(e.target.value)
    }

    async function searchEwallet(noEwallet) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"emoney_code": "${noEwallet}"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const getDataEwallet = await axios.post(BaseURL + "/HelpDesk/GetReNotifyEmoney", { data: dataParams }, { headers: headers })
            if (getDataEwallet.status === 200 && getDataEwallet.data.response_code === 200 && getDataEwallet.data.response_new_token === null) {
                getDataEwallet.data.response_data.results.history_notify = getDataEwallet.data.response_data.results.history_notify.map((obj, idx) => ({...obj, number: idx + 1}))
                setDataEwallet(getDataEwallet.data.response_data.results)
                setDataHistoryNotify(getDataEwallet.data.response_data.results.history_notify)
                // console.log(getDataEwallet.data.response_data.results.history_notify[0].request_data, 'response_data');
            } else if (getDataEwallet.status === 200 && getDataEwallet.data.response_code === 200 && getDataEwallet.data.response_new_token !== null) {
                getDataEwallet.data.response_data.results.history_notify = getDataEwallet.data.response_data.results.history_notify.map((obj, idx) => ({...obj, number: idx + 1}))
                setUserSession(getDataEwallet.data.response_new_token)
                setDataEwallet(getDataEwallet.data.response_data.results)
                setDataHistoryNotify(getDataEwallet.data.response_data.results.history_notify)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }
    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Re-Notify E-Wallet</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Re-Notify E-Wallet</h2>
            </div>
            <div className='main-content'>
                <div className='base-content mt-3 mb-3'>
                    <Row className='mb-4'>
                        <Col xs={5} className="d-flex justify-content-start align-items-center">
                            <span className='me-3' style={{ width: "30%" }}>Kode E-Wallet*</span>
                            <Form.Control
                                name='noEwallet'
                                onChange={handleChange}
                                placeholder="Nomor E-Wallet"
                                type='text'
                                style={{ width: "50%", height: 40, marginTop: '-7px', marginLeft: 'unset', marginRight: 10 }}
                            />
                            <button
                                onClick={() => searchEwallet(noEwallet)}
                                className={(noEwallet.length === 0) ? 'btn-off' : 'add-button'}
                                style={{ maxWidth: 'max-content', padding: 7, height: 40, marginTop: -6 }}
                                disabled={(noEwallet.length === 0) ? true : false}
                            >
                                Cari
                            </button>
                        </Col>
                    </Row>
                    <div className='base-content' style={{ width:"100%", padding: 50 }}>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Kode Transaksi
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={dataEwallet.tpayewallet_ref_id}
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
                                    value={dataEwallet.mpartner_name}
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
                                    value={dataEwallet.tpayewallet_subpartner_id}
                                    disabled
                                    type='text'
                                    style={{ width: "100%", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                    />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col xs={2} style={{ width: '14%', paddingRight: "unset" }}>
                                <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                    Nama E-Wallet
                                </span>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    value={dataEwallet.mewallet_name}
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
                                    value={(dataEwallet.tpayewallet_amount !== undefined) ? convertToRupiah(dataEwallet.tpayewallet_amount) : null}
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
                                    value={(dataEwallet.tpayewallet_crtdt !== undefined) ? convertDateTimeStamp(dataEwallet.tpayewallet_crtdt) : null}
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
                                    value={(dataEwallet.mstatus_name_ind !== undefined) ? dataEwallet.mstatus_name_ind : null}
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
                            {/* {
                                dataVirtualAccount.notes !== undefined &&
                                <Col xs={10}>
                                    <Form.Control
                                        value={dataVirtualAccount.notes}
                                        disabled
                                        type='text'
                                        style={{ background: (dataVirtualAccount.is_warning) ? "#FDEAEA" : "rgba(7, 126, 134, 0.08)", color: "#077E86", height: 40, marginTop: '-7px', marginLeft: 'unset' }}
                                        />
                                </Col>
                            } */}
                        </Row>
                    </div>

                    {/* <div className='base-content mt-4' style={{ width:"100%", padding: 50 }}>
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
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ReNotifyEwallet