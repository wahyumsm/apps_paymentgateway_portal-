import React from 'react'
import { Link } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import ReactSelect from 'react-select'
import DataTable, { defaultThemes } from 'react-data-table-component';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { agenLists } from '../../data/tables'

const RiwayatInvoice = () => {
    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.id,
        },
        {
            name: 'No Invoice',
            selector: row => row.IDAgen,
        },
        {
            name: 'Waktu',
            selector: row => row.noHp,
        },
        {
            name: 'Nama Partner',
            selector: row => row.namaAgen
        },
        {
            name: 'Tipe Invoice',
            selector: row => row.status
        },
    ];
    const customStylesDanaMasuk = {
        headCells: {
            style: {
                width: 'max-content',
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'flex-start',

            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: defaultThemes.default.divider.default,
            },
        },
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
          <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          <div>Loading...</div>
        </div>
    );
    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Riwayat Invoice</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Riwayat Invoice</h2>
            </div>
            <div className='base-content'>
                <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                <Row className='mt-4'>
                    <Col xs={4} className="d-flex justify-content-between align-items-center" >
                        <span >Periode <span style={{ color: "red" }}>*</span></span>
                        <Form.Select name='periodeDanaMasukAdmin' className="input-text-riwayat ms-3" >
                            <option defaultChecked disabled value={0}>Pilih Periode</option>
                            <option value={2}>Hari Ini</option>
                            <option value={3}>Kemarin</option>
                            <option value={4}>7 Hari Terakhir</option>
                            <option value={5}>Bulan Ini</option>
                            <option value={6}>Bulan Kemarin</option>
                            <option value={7}>Pilih Range Tanggal</option>
                        </Form.Select>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span >Nama Partner</span>
                        <div className="dropdown dropSaldoPartner" >
                            <ReactSelect
                                closeMenuOnSelect={true}
                                hideSelectedOptions={false}
                                // options={dataListPartner}
                                // value={selectedPartnerDanaMasukAdmin}
                                // onChange={(selected) => handleChangeNamaPartner(selected, 'danaMasuk')}
                                placeholder="Pilih Nama Partner"
                                components={{ Option }}
                                // styles={customStylesSelectedOption}
                            />
                        </div>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-between align-items-center">
                        <span>Tipe Invoice</span>
                        <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                            <option defaultValue disabled value={0}>Pilih Tipe Invoice</option>
                            <option value={1}>Bank</option>
                            <option value={2}>E-Wallet</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col xs={5}>
                        <Row>
                            <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                <button
                                    className='btn-ez-on'
                                >
                                    Terapkan
                                </button>
                            </Col>
                            <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                <button
                                    className='btn-reset'
                                >
                                    Atur Ulang
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="div-table mt-4 pb-4">
                    <DataTable
                        columns={columnsAdmin}
                        data={agenLists}
                        customStyles={customStylesDanaMasuk}
                        highlightOnHover
                        // progressPending={pendingTransferAdmin}
                        progressComponent={<CustomLoader />}
                        // pagination
                    />
                </div>
            </div>
        </div>
    )
}

export default RiwayatInvoice