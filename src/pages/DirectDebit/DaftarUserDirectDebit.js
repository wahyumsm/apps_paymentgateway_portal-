import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import DataTable, { defaultThemes } from 'react-data-table-component'

function DaftarUserDirectDebit() {

    const [namaPartnerUserDirectDebit, setNamaPartnerUserDirectDebit] = useState("")
    const [namaUserDirectDebit, setNamaUserDirectDebit] = useState("")
    const [channelDirectDebit, setChannelDirectDebit] = useState(0)
    const [statusDirectDebit, setStatusDirectDebit] = useState(0)

    const data = [
        {
            no: 1,
            idUser: 13641368428,
            namaPartner: "PT. Darmawangsa",
            namaUser: "Agung Dermawan",
            noHP: "08123456789",
            channel: "OneKlik",
            isActive: true
        },{
            no: 2,
            idUser: 13641368428,
            namaPartner: "PT. Darmawangsa",
            namaUser: "Agung Dermawan",
            noHP: "08123456789",
            channel: "OneKlik",
            isActive: true
        },{
            no: 3,
            idUser: 13641368428,
            namaPartner: "PT. Darmawangsa",
            namaUser: "Agung Dermawan",
            noHP: "08123456789",
            channel: "OneKlik",
            isActive: false
        },{
            no: 4,
            idUser: 13641368428,
            namaPartner: "PT. Darmawangsa",
            namaUser: "Agung Dermawan",
            noHP: "08123456789",
            channel: "OneKlik",
            isActive: true
        },{
            no: 5,
            idUser: 13641368428,
            namaPartner: "PT. Darmawangsa",
            namaUser: "Agung Dermawan",
            noHP: "08123456789",
            channel: "OneKlik",
            isActive: false
        },{
            no: 6,
            idUser: 13641368428,
            namaPartner: "PT. Darmawangsa",
            namaUser: "Agung Dermawan",
            noHP: "08123456789",
            channel: "OneKlik",
            isActive: true
        },{
            no: 7,
            idUser: 13641368428,
            namaPartner: "PT. Darmawangsa",
            namaUser: "Agung Dermawan",
            noHP: "08123456789",
            channel: "OneKlik",
            isActive: true
        },{
            no: 8,
            idUser: 13641368428,
            namaPartner: "PT. Darmawangsa",
            namaUser: "Agung Dermawan",
            noHP: "08123456789",
            channel: "OneKlik",
            isActive: false
        },
    ]

    const columns = [
        {
            name: 'No',
            selector: row => row.no,
            width: "57px",
        },
        {
            name: 'ID User',
            selector: row => row.idUser,
            width: "224px",
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detailsettlement/${row.tvasettl_id}/${selectedBankSettlement.length === 0 ? '0' : selectedBankSettlement[0].value}`} >{row.tvasettl_code}</Link>
        },
        {
            name: 'Nama Partner',
            selector: row => row.namaPartner,
            width: "224px",
            wrap: true,
        },
        {
            name: 'Nama User',
            selector: row => row.namaUser,
            width: "224px",
        },
        {
            name: 'No Handphone',
            selector: row => row.noHP,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Channel Direct Debit',
            selector: row => row.channel,
            width: "224px",
            // style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Status',
            selector: row => row.isActive === true ? "Aktif" : "Tidak Aktif",
            width: "140px",
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.isActive === true,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
                },
                {
                    when: row => row.isActive === false,
                    style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
                }
            ],
        },
    ];
    
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'flex-start',
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                },
            },
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                },
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
        </div>
    );

    useEffect(() => {
        
    }, [])
    

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Daftar User Direct Debit</span>
            <div className='head-title'>
                <h2 className="h5 mb-1 mt-4">Daftar User Direct Debit</h2>
            </div>
            <div className='main-content'>
                <div className='base-content mt-3 mb-4'>
                    <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span className='me-1'>Nama Partner</span>
                            <input onChange={(e) => setNamaPartnerUserDirectDebit(e.target.value)} value={namaPartnerUserDirectDebit} name="namaPartnerUserDirectDebit" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan Nama Partner'/>
                            {/* <div className="dropdown dropSaldoPartner">
                                <ReactSelect
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    options={dataListPartner}
                                    value={selectedPartnerSettlement}
                                    onChange={(selected) => setSelectedPartnerSettlement([selected])}
                                    placeholder="Pilih Nama Partner"
                                    components={{ Option }}
                                    styles={customStylesSelectedOption}
                                />
                            </div> */}
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span className='me-3'>Nama User</span>
                            <input onChange={(e) => setNamaUserDirectDebit(e.target.value)} value={namaUserDirectDebit} name="namaUserDirectDebit" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan Nama User'/>
                            {/* <div className="dropdown dropSaldoPartner">
                                <ReactSelect
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    options={dataListPartner}
                                    value={selectedPartnerSettlement}
                                    onChange={(selected) => setSelectedPartnerSettlement([selected])}
                                    placeholder="Pilih Nama Partner"
                                    components={{ Option }}
                                    styles={customStylesSelectedOption}
                                />
                            </div> */}
                        </Col>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span className='me-3'>Channel</span>
                            <Form.Select name="channelDirectDebit" className='input-text-riwayat ms-5' style={{ display: "inline" }} value={channelDirectDebit} onChange={(e) => setChannelDirectDebit(e.target.value)}>
                                <option defaultChecked disabled value={0}>Pilih Status</option>
                                <option value={2}>OneKlik</option>
                            </Form.Select>
                            {/* <div className="dropdown dropSaldoPartner">
                                <ReactSelect
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    options={dataListPartner}
                                    value={selectedPartnerSettlement}
                                    onChange={(selected) => setSelectedPartnerSettlement([selected])}
                                    placeholder="Pilih Nama Partner"
                                    components={{ Option }}
                                    styles={customStylesSelectedOption}
                                />
                            </div> */}
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                            <span className='me-4'>Status</span>
                            <Form.Select name="statusDirectDebit" className='input-text-riwayat ms-5' style={{ display: "inline" }} value={statusDirectDebit} onChange={(e) => setStatusDirectDebit(e.target.value)}>
                                <option defaultChecked disabled value={0}>Pilih Status</option>
                                <option value={2}>Berhasil</option>
                                <option value={1}>Dalam Proses</option>
                                <option value={7}>Menunggu Pembayaran</option>
                                <option value={9}>Kadaluwarsa</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col xs={5}>
                            <Row>
                                <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                    <button
                                        className='btn-ez-on'
                                        // onClick={() => filterSettlement(1, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.periodeSettlement, dateRangeSettlement, 0, inputHandle.fiturSettlement, selectedBankSettlement.length !== 0 ? selectedBankSettlement[0].value : "")}
                                        // className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0 || dateRangeSettlement.length !== 0 && selectedBankSettlement[0].value !== undefined) ? "btn-ez-on" : "btn-ez"}
                                        // disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0 || inputHandle.periodeSettlement === 0 && selectedBankSettlement[0].value === undefined}
                                    >
                                        Terapkan
                                    </button>
                                </Col>
                                <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                    <button
                                        className='btn-reset'
                                        // onClick={() => resetButtonHandle("admin")}
                                        // className={(inputHandle.periodeSettlement || dateRangeSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.idTransaksiSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.statusSettlement.length !== 0 || dateRangeSettlement.length !== 0 && inputHandle.fiturSettlement.length !== 0 || dateRangeSettlement.length !== 0 && selectedBankSettlement[0].value !== undefined) ? "btn-reset" : "btn-ez-reset"}
                                        // disabled={inputHandle.periodeSettlement === 0 || inputHandle.periodeSettlement === 0 && inputHandle.idTransaksiSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.statusSettlement.length === 0 || inputHandle.periodeSettlement === 0 && inputHandle.fiturSettlement.length === 0 || inputHandle.periodeSettlement === 0 && selectedBankSettlement[0].value === undefined}
                                    >
                                        Atur Ulang
                                    </button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* {
                        dataRiwayatSettlement.length !== 0 &&
                        <div style={{ marginBottom: 30 }}>
                            <Link to={"#"} onClick={() => ExportReportSettlementHandler(isFilterSettlement, inputHandle.statusSettlement, inputHandle.idTransaksiSettlement, selectedPartnerSettlement.length !== 0 ? selectedPartnerSettlement[0].value : "", inputHandle.periodeSettlement, dateRangeSettlement, selectedBankSettlement.length !== 0 ? selectedBankSettlement[0].value : "")} className="export-span">Export</Link>
                        </div>
                    } */}
                    <div className="div-table mt-4 pb-4">
                        <DataTable
                            columns={columns}
                            data={data}
                            customStyles={customStyles}
                            // progressPending={pendingSettlement}
                            progressComponent={<CustomLoader />}
                            dense
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                    {/* <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageSettlement}</div> */}
                        {/* <Pagination
                            activePage={activePageSettlement}
                            itemsCountPerPage={pageNumberSettlement.row_per_page}
                            totalItemsCount={(pageNumberSettlement.row_per_page*pageNumberSettlement.max_page)}
                            pageRangeDisplayed={5}
                            itemClass="page-item"
                            linkClass="page-link"
                            onChange={handlePageChangeSettlement}
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DaftarUserDirectDebit