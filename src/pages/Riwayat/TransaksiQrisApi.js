import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { convertToRupiah, getRole } from '../../function/helpers'
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import ReactSelect from 'react-select'
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/DateRangePicker'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { agenLists } from '../../data/tables'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import Pagination from 'react-js-pagination'

const TransaksiQrisApi = () => {
    const user_role = getRole()

    const [dataTransactionQrisApiAdmin, setDataTransactionQrisApiAdmin] = useState([])
    const [showDateTransactionQrisApiAdmin, setShowDateTransactionQrisApiAdmin] = useState("none")
    const [dateRangeTransactionQrisApiAdmin, setDateRangeTransactionQrisApiAdmin] = useState([])
    const [stateTransactionQrisApiAdmin, setStateTransactionQrisApiAdmin] = useState(null)
    const [activePageTransactionQrisApiAdmin, setActivePageTransactionQrisApiAdmin] = useState(1)
    const [pageNumberTransactionQrisApiAdmin, setPageNumberTransactionQrisApiAdmin] = useState({})
    const [totalPageTransactionQrisApiAdmin, setTotalPageTransactionQrisApiAdmin] = useState(0)
    const [pendingTransactionQrisApiAdmin, setPendingTransactionQrisApiAdmin] = useState(true)
    const [isFilterTransactionQrisApiAdmin, setIsFilterTransactionQrisApiAdmin] = useState(false)

    const [dataTransactionQrisApiPartner, setDataTransactionQrisApiPartner] = useState([])
    const [showDateTransactionQrisApiPartner, setShowDateTransactionQrisApiPartner] = useState("none")
    const [dateRangeTransactionQrisApiPartner, setDateRangeTransactionQrisApiPartner] = useState([])
    const [stateTransactionQrisApiPartner, setStateTransactionQrisApiPartner] = useState(null)
    const [activePageTransactionQrisApiPartner, setActivePageTransactionQrisApiPartner] = useState(1)
    const [pageNumberTransactionQrisApiPartner, setPageNumberTransactionQrisApiPartner] = useState({})
    const [totalPageTransactionQrisApiPartner, setTotalPageTransactionQrisApiPartner] = useState(0)
    const [pendingTransactionQrisApiPartner, setPendingTransactionQrisApiPartner] = useState(true)
    const [isFilterTransactionQrisApiPartner, setIsFilterTransactionQrisApiPartner] = useState(false)

    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.transaction_code,
            width: "170px",
            wrap: "true"
        },
        {
            name: 'Waktu Request',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Waktu Bayar',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'RRN',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Tipe QR',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.outlet_name,
            width: "200px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.store_name,
            width: "150px"
        },
        {
            name: 'ID Kasir',
            selector: row => row.mterminal_name,
            width: "100px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.amount, true, 2),
            width: "180px"
        },
        {
            name: 'Potongan MDR',
            selector: row => convertToRupiah(row.MDR, true, 2),
            width: "150px"
        },
        {
            name: 'Pendapatan Ezee',
            selector: row => convertToRupiah(row.net_amount, true, 2),
            width: "150px"
        },
        {
            name: 'Pendapatan Partner',
            selector: row => convertToRupiah(row.net_amount, true, 2),
            width: "150px"
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            style: { display: "flex", justifyContent: "center", alignItem: "center", padding: "6px 10px", margin: "6px 20px", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 9 || row.status_id === 5 || row.status_id === 3,
                    style: { background: "#FEF4E9", color: "#F79421"}
                },
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86"}
                },
                {
                    when: row => row.status_id === 7 || row.status_id === 6 || row.status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C"}
                },
            ]
        },
    ];

    const columnsPartner = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.transaction_code,
            width: "170px",
            wrap: "true"
        },
        {
            name: 'Waktu Request',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Waktu Bayar',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'RRN',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Tipe QR',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.RRN,
            width: "150px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.outlet_name,
            width: "200px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.store_name,
            width: "150px"
        },
        {
            name: 'ID Kasir',
            selector: row => row.mterminal_name,
            width: "100px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.amount, true, 2),
            width: "180px"
        },
        {
            name: 'Potongan MDR',
            selector: row => convertToRupiah(row.MDR, true, 2),
            width: "150px"
        },
        {
            name: 'Pendapatan',
            selector: row => convertToRupiah(row.net_amount, true, 2),
            width: "150px"
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            style: { display: "flex", justifyContent: "center", alignItem: "center", padding: "6px 10px", margin: "6px 20px", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 9 || row.status_id === 5 || row.status_id === 3,
                    style: { background: "#FEF4E9", color: "#F79421"}
                },
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86"}
                },
                {
                    when: row => row.status_id === 7 || row.status_id === 6 || row.status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C"}
                },
            ]
        },
    ];

    const customStylesQris = {
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
            {
                user_role === "102" ? (
                    <>
                        <span className='breadcrumbs-span' style={{ cursor: "pointer" }}>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; <Link to={"/riwayat-transaksi/transaksi-qris"}>Transaksi</Link> &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS API</span>
                        <div className="head-title">
                            <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi QRIS API</h2>
                        </div>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            <Row className=''>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Transaksi</span>
                                    <input name="idTransaksi" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Periode</span>
                                    <Form.Select name='periode' className="input-text-riwayat ms-3">
                                        <option defaultChecked disabled value={0}>Pilih Periode</option>
                                        <option value={2}>Hari Ini</option>
                                        <option value={3}>Kemarin</option>
                                        <option value={4}>7 Hari Terakhir</option>
                                        <option value={5}>Bulan Ini</option>
                                        <option value={6}>Bulan Kemarin</option>
                                        <option value={7}>Pilih Range Tanggal</option>
                                    </Form.Select>
                                </Col>
                                <Col 
                                    xs={4} 
                                    className='text-end mt-4' 
                                    // style={{ display: showDateTransactionReportQris }}
                                >
                                    <DateRangePicker
                                        // onChange={pickDateTransactionReportQris}
                                        // value={stateTransactionReportQris}
                                        clearIcon={null}
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span className="me-4">RRN</span>
                                    <input name="rrn" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan RRN'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Partner Trans ID</span>
                                    <input name="idTransaksi" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan Partner Trans ID'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span >Nama Partner</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            // options={dataGrupInQris}
                                            // value={selectedGrupName}
                                            // onChange={(selected) => handleChange(selected)}
                                            placeholder="Pilih Grup"
                                            components={{ Option }}
                                            // styles={customStylesSelectedOption}
                                            // filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Brand</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            // options={dataBrandInQris}
                                            // value={selectedBrandName}
                                            // onChange={(selected) => handleChangeBrand(selected)}
                                            placeholder="Pilih Brand"
                                            components={{ Option }}
                                            // styles={customStylesSelectedOption}
                                            // filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Outlet</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            // options={dataOutletInQris}
                                            // value={selectedOutletName}
                                            // onChange={(selected) => handleChangeOutlet(selected)}
                                            placeholder="Pilih Outlet"
                                            components={{ Option }}
                                            // styles={customStylesSelectedOption}
                                            // filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Kasir</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            // options={dataIdKasirInQris}
                                            // value={selectedIdKasirName}
                                            // onChange={(selected) => handleChangeIdKasir(selected)}
                                            placeholder="Pilih Kasir"
                                            components={{ Option }}
                                            // styles={customStylesSelectedOption}
                                            // filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Status</span>
                                    <Form.Select name="statusQris" className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                        <option defaultChecked disabled value={0}>Pilih Status</option>
                                        <option value={3}>Dalam Proses</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={4}>Gagal</option>
                                        <option value={6}>Kadaluwarsa</option>
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
                            {/* {
                                dataTransactionReportQris.length !== 0 && (
                                    <div style={{ marginBottom: 30 }} className='mt-3'>
                                        <Link className="export-span" onClick={() => ExportReportTransactionReportQrisHandler(isFilterTransactionReportQris, inputHandleTransactionReportQrisAdmin.idTransaksi, inputHandleTransactionReportQrisAdmin.rrn, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), (selectedIdKasirName.length !== 0 ? selectedIdKasirName.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisAdmin.statusQris, inputHandleTransactionReportQrisAdmin.periode, dateRangeTransactionReportQris)}>Export</Link>
                                    </div>
                                )
                            } */}
                            <div className="div-table mt-5 pb-4">
                                <DataTable
                                    columns={columnsPartner}
                                    data={agenLists}
                                    customStyles={customStylesQris}
                                    highlightOnHover
                                    progressPending={pendingTransactionQrisApiPartner}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageTransactionQrisApiPartner}</div>
                                <Pagination
                                    activePage={activePageTransactionQrisApiPartner}
                                    itemsCountPerPage={pageNumberTransactionQrisApiPartner.row_per_page}
                                    totalItemsCount={(pageNumberTransactionQrisApiPartner.row_per_page*pageNumberTransactionQrisApiPartner.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    // onChange={handlePageChangeTransactionReportQris}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <span className='breadcrumbs-span' style={{ cursor: "pointer" }}>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; <Link to={"/riwayat-transaksi/transaksi-qris"}>Transaksi</Link> &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS API</span>
                        <div className="head-title">
                            <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi QRIS API</h2>
                        </div>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            <Row className=''>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Transaksi</span>
                                    <input name="idTransaksi" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Periode</span>
                                    <Form.Select name='periode' className="input-text-riwayat ms-3">
                                        <option defaultChecked disabled value={0}>Pilih Periode</option>
                                        <option value={2}>Hari Ini</option>
                                        <option value={3}>Kemarin</option>
                                        <option value={4}>7 Hari Terakhir</option>
                                        <option value={5}>Bulan Ini</option>
                                        <option value={6}>Bulan Kemarin</option>
                                        <option value={7}>Pilih Range Tanggal</option>
                                    </Form.Select>
                                </Col>
                                <Col 
                                    xs={4} 
                                    className='text-end mt-4' 
                                    // style={{ display: showDateTransactionReportQris }}
                                >
                                    <DateRangePicker
                                        // onChange={pickDateTransactionReportQris}
                                        // value={stateTransactionReportQris}
                                        clearIcon={null}
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span className="me-4">RRN</span>
                                    <input name="rrn" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan RRN'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Partner Trans ID</span>
                                    <input name="idTransaksi" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan Partner Trans ID'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span >Nama Partner</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            // options={dataGrupInQris}
                                            // value={selectedGrupName}
                                            // onChange={(selected) => handleChange(selected)}
                                            placeholder="Pilih Grup"
                                            components={{ Option }}
                                            // styles={customStylesSelectedOption}
                                            // filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Brand</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            // options={dataBrandInQris}
                                            // value={selectedBrandName}
                                            // onChange={(selected) => handleChangeBrand(selected)}
                                            placeholder="Pilih Brand"
                                            components={{ Option }}
                                            // styles={customStylesSelectedOption}
                                            // filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Outlet</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            // options={dataOutletInQris}
                                            // value={selectedOutletName}
                                            // onChange={(selected) => handleChangeOutlet(selected)}
                                            placeholder="Pilih Outlet"
                                            components={{ Option }}
                                            // styles={customStylesSelectedOption}
                                            // filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Kasir</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            // options={dataIdKasirInQris}
                                            // value={selectedIdKasirName}
                                            // onChange={(selected) => handleChangeIdKasir(selected)}
                                            placeholder="Pilih Kasir"
                                            components={{ Option }}
                                            // styles={customStylesSelectedOption}
                                            // filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Status</span>
                                    <Form.Select name="statusQris" className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                        <option defaultChecked disabled value={0}>Pilih Status</option>
                                        <option value={3}>Dalam Proses</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={4}>Gagal</option>
                                        <option value={6}>Kadaluwarsa</option>
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
                            {/* {
                                dataTransactionReportQris.length !== 0 && (
                                    <div style={{ marginBottom: 30 }} className='mt-3'>
                                        <Link className="export-span" onClick={() => ExportReportTransactionReportQrisHandler(isFilterTransactionReportQris, inputHandleTransactionReportQrisAdmin.idTransaksi, inputHandleTransactionReportQrisAdmin.rrn, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), (selectedIdKasirName.length !== 0 ? selectedIdKasirName.map((item, idx) => item.value) : 0), inputHandleTransactionReportQrisAdmin.statusQris, inputHandleTransactionReportQrisAdmin.periode, dateRangeTransactionReportQris)}>Export</Link>
                                    </div>
                                )
                            } */}
                            <div className="div-table mt-5 pb-4">
                                <DataTable
                                    columns={columnsAdmin}
                                    data={agenLists}
                                    customStyles={customStylesQris}
                                    highlightOnHover
                                    progressPending={pendingTransactionQrisApiAdmin}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageTransactionQrisApiAdmin}</div>
                                <Pagination
                                    activePage={activePageTransactionQrisApiAdmin}
                                    itemsCountPerPage={pageNumberTransactionQrisApiAdmin.row_per_page}
                                    totalItemsCount={(pageNumberTransactionQrisApiAdmin.row_per_page*pageNumberTransactionQrisApiAdmin.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    // onChange={handlePageChangeTransactionReportQris}
                                />
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default TransaksiQrisApi