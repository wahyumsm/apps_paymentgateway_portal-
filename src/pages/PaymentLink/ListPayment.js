import React from "react";
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faCog, faEye, faClone} from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form, Image } from '@themesberg/react-bootstrap'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DataTable from "react-data-table-component";
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { agenLists } from "../../data/tables";
import { useHistory } from "react-router-dom";
import { when } from "jquery";

function ListPayment() {
    const history = useHistory()

    function detailPaymentHandler(paymentId) {
        history.push(`/detailpayment/${paymentId}`)
    }

    const columnPayment = [
        {
            name: 'Payment ID',
            selector: row => row.id
        },
        {
            name: 'ID Referensi',
            selector: row => row.noHp
        },
        {
            name: 'Tanggal Pembuatan',
            selector: row => row.noRekening
        },
        {
            name: 'Status',
            selector: row => row.status
        },
        {
            name: 'Aksi',
            selector: row => <div className="d-flex justify-content-center align-items-center"><FontAwesomeIcon icon={faEye} onClick={() => detailPaymentHandler(row.id)} className="me-2" style={{cursor: "pointer"}} /><FontAwesomeIcon icon={faClone} className="mx-2" style={{cursor: "pointer", display: row.status === 'Aktif' ? "" : ""}} /></div>,
            
        }
    ]

    function toAddPayment () {
        history.push("/addpayment")
    }

    function toCustomDesign () {
        history.push("/custom-design-payment")
    }

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                paddingRight: 'none'
                
            },
        },
    };

    function toDashboard () {
        history.push("/")
    }

    function toListPay () {
        history.push("/listpayment")
    }

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
            <div>Loading...</div>
        </div>
    );
    return (
        <div className='main-content mt-5' style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{cursor: "pointer"}}  onClick={() => toDashboard()}>Beranda</span>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;<span style={{cursor: "pointer"}} onClick={() => toListPay()}>Payment Link</span></span>
            <div className="head-title">
                <h2 className="h4 mt-4 mb-5" style={{fontFamily: "Exo", fontWeight: 700, fontSize: 18, color: "#383838"}}>Payment Link</h2>
            </div>
            <div style={{ display: "flex", justifyContent: "end", marginTop: -88, paddingBottom: 24 }}>
                <button style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 230, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }} onClick={() => toAddPayment()}>
                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Buat Payment Link
                </button>
                <button className="mx-3 px-3" style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, alignItems: "center", border: "1px solid #077E86", gap: 8, borderRadius: 6 }} onClick={() => toCustomDesign()}>
                    <FontAwesomeIcon icon={faCog} style={{ color: "#077E86" }} />
                </button> 
            </div>
            <div className="base-content mt-3">
                <span className="font-weight-bold mb-4" style={{fontWeight: 600}}>Filter</span>
                <Row className='mt-4'>
                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                        <div>Payment ID</div>
                        <input type='text'className='input-text-ez' placeholder='Masukkan Payment ID'/>                        
                    </Col>
                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                        <div>ID Referensi</div>
                        <input type='text'className='input-text-ez' placeholder='Masukkan ID Referensi'/>                        
                    </Col>
                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                        <div>Tanggal pembuatan</div>
                        <DateRangePicker 
                            className="me-5"
                            clearIcon={null}
                        />
                    </Col>                    
                </Row>
                <Row className='mt-3'>
                    <Col xs={4} className="d-flex justify-content-start align-items-center">
                        <span>Status</span>
                        <Form.Select className='input-text-ez me-4' style={{ display: "inline" }}>
                            <option>Pilih Status</option>
                            <option value={2}>Berhasil</option>
                            <option value={1}>In Progress</option>
                            {/* <option value={3}>Refund</option> */}
                            {/* <option value={4}>Canceled</option> */}
                            <option value={7}>Menunggu Pembayaran</option>
                            {/* <option value={8}>Paid</option> */}
                            <option value={9}>Kadaluwarsa</option>
                            {/* <option value={10}>Withdraw</option> */}
                            {/* <option value={11}>Idle</option> */}
                            {/* <option value={15}>Expected Success</option> */}
                        </Form.Select>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col xs={3}>
                        <Row>
                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                <button className="btn-ez-on">
                                    Terapkan
                                </button>
                            </Col>
                            <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                <button className="btn-ez-on">
                                    Atur Ulang
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="div-table mt-4 pb-4">
                    <DataTable
                        columns={columnPayment}
                        data={agenLists}
                        customStyles={customStyles}
                        // progressPending={pendingSettlement}
                        progressComponent={<CustomLoader />}
                        // dense
                        // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                        // pagination
                    />
                </div>
            </div>     
        </div>
    )
}

export default ListPayment