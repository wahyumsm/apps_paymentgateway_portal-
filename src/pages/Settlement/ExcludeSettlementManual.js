import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import DataTable from 'react-data-table-component'
import { agenLists } from '../../data/tables'
import { useState } from 'react'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"

const SettlementAdminManual = () => {
    const history = useHistory()
    const [pendingListSettlement, setPendingListSettlement] = useState(false)
    function toProsesSettlement () {
        history.push("/Settlement/proses-settlement-manual")
    }

    const columnList = [
        {
            name: 'Partner',
            selector: row => row.namaAgen,
        },
        {
            name: 'Type',
            selector: row => row.status,
        },
        {
            name: 'Date',
            selector: row => row.noRekening,
        },
        {
            name: 'Create User',
            selector: row => row.email,
        },
        {
            name: 'Date User',
            selector: row => row.noHp,
        },
    ];

    const customStylesPartner = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                paddingRight: 'none',
                fontFamily: 'Exo'
                
            },
        },
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
        </div>
    );

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link style={{ cursor: "pointer" }} to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Exclude Settlement Manual</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4" style={{fontWeight: 700, fontSize: 18, fontFamily: "Exo", color: "#383838"}}>List History Settlement Manual</h2>
            </div>
            <div className='main-content'>
                <div className='riwayat-settlement-div mt-3 mb-4'>
                    <span >
                        <button
                            onClick={() => toProsesSettlement()}
                            style={{
                                fontFamily: "Exo",
                                fontSize: 16,
                                fontWeight: 700,
                                alignItems: "center",
                                padding: "0px 12px",
                                gap: 8,
                                width: 150,
                                height: 48,
                                background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)",
                                border: "0.6px solid #2C1919",
                                borderRadius: 6,
                              }}
                        >
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah
                        </button>
                    </span>
                    <div className='base-content mt-3'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontSize: 16, fontFamily: "Exo", color: "#383838"}}>Filter</span>
                        <Row className='mt-4'>
                            <Col xs={6} className="d-flex justify-content-start align-items-center" >
                                <span style={{ marginRight: 26 }}>Periode<span style={{ color: "red" }}>*</span></span>
                                <Form.Select name='periodeSettlement' className="input-text-riwayat ms-3" >
                                    <option defaultChecked value={0}>Pilih Periode</option>
                                    <option value={2}>Hari Ini</option>
                                    <option value={3}>Kemarin</option>
                                    <option value={4}>7 Hari Terakhir</option>
                                    <option value={5}>Bulan Ini</option>
                                    <option value={6}>Bulan Kemarin</option>
                                    <option value={7}>Pilih Range Tanggal</option>
                                </Form.Select>                            
                            </Col>
                        </Row>

                        <Row className='mt-4'>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            className='btn-ez-on'
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            className='btn-reset'
                                        >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <div className="div-table mt-4">
                            <DataTable
                                columns={columnList}
                                data={agenLists}
                                customStyles={customStylesPartner}
                                progressPending={pendingListSettlement}
                                progressComponent={<CustomLoader />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettlementAdminManual