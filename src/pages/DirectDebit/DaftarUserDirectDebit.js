import { Button, Col, Form, Image, Modal, Row } from '@themesberg/react-bootstrap'
import React, { useCallback } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import noteIconGrey from "../../assets/icon/note_icon_grey.svg"
import copy from "../../assets/icon/iconcopy_icon.svg"
import DataTable, { defaultThemes } from 'react-data-table-component'
import CopyToClipboard from "react-copy-to-clipboard";

function DaftarUserDirectDebit() {

    const [namaPartnerUserDirectDebit, setNamaPartnerUserDirectDebit] = useState("")
    const [namaUserDirectDebit, setNamaUserDirectDebit] = useState("")
    const [channelDirectDebit, setChannelDirectDebit] = useState(0)
    const [statusDirectDebit, setStatusDirectDebit] = useState(0)
    const [showModalDaftarDirectDebit, setShowModalDaftarDirectDebit] = useState(false)
    const [copied, setCopied] = useState(false)

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
            width: "150px",
            cell: (row) => <Link style={{ textDecoration: "unset", color: "#077E86" }} onClick={() => setShowModalDaftarDirectDebit(true)} >{row.idUser}</Link>
        },
        {
            name: 'Nama Partner',
            selector: row => row.namaPartner,
            width: "150px",
            wrap: true,
        },
        {
            name: 'Nama User',
            selector: row => row.namaUser,
            width: "150px",
        },
        {
            name: 'No Handphone',
            selector: row => row.noHP,
            width: "150px",
        },
        {
            name: 'Channel Direct Debit',
            selector: row => row.channel,
            width: "200px",
            // style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Status',
            selector: row => row.isActive === true ? "Aktif" : "Tidak Aktif",
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

    const onCopy = React.useCallback(() => {
        setCopied(true);
    }, [])

    const onClick = useCallback(({target: {innerText}}) => {
        // console.log(`Clicked on "${innerText}"!`);
        alert("Copied!")
    }, [])

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
        </div>
    );

    useEffect(() => {
        
    }, [])
    

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Daftar User Direct Debit</span>
            <div className='head-title'>
                <h2 className="h5 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Daftar User Direct Debit</h2>
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
                            highlightOnHover
                            // progressPending={pendingSettlement}
                            progressComponent={<CustomLoader />}
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
            <Modal centered show={showModalDaftarDirectDebit} onHide={() => setShowModalDaftarDirectDebit(false)} style={{ borderRadius: 8 }}>
                <Modal.Header className="border-0">
                    <Button
                        className="position-absolute top-0 end-0 m-3"
                        variant="close"
                        aria-label="Close"
                        onClick={() => setShowModalDaftarDirectDebit(false)}
                    />
                </Modal.Header>
                <Modal.Title className="mt-1 text-center" style={{ fontFamily: 'Exo', fontSize: 20, fontWeight: 700 }}>
                    Detail ID User
                </Modal.Title>
                <center>
                    <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                </center>
                <Modal.Body className='mt-2' style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}>
                    <div className='d-flex justify-content-center align-items-center py-2 px-3' style={{ background: "rgba(255, 214, 0, 0.16)", borderRadius: 4, color: "#383838", fontFamily: "Nunito", fontSize: 14 }}>
                        <img src={noteIconGrey} alt="icon grey" />
                        <div className='ms-2' style={{ fontStyle: "italic" }}>
                            ID User adalah kode unik yang didapat dari Bank berupa kombinasi angka dan alphanumerik serta tidak dapat diubah oleh admin
                        </div>
                    </div>
                    <div className='text-justify p-3 mt-4' style={{ background: "#F0F0F0", borderRadius: 8, border: "1.4px solid #C4C4C4", color: "#383838", fontFamily: "Nunito", fontSize: 14, wordWrap: "break-word" }}>
                        765457899876545909876569098765456890987679876876567876789876567890987654345678909876543345678888888888888888900000000000000000000000000000087654322222222222123456788888888888888888888876543224778890907755323245678990998676565676767787889897755231334566878909000909090909
                    </div>
                    <div className='mt-4 pb-2' style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                        <CopyToClipboard onCopy={onCopy}>
                            <Button className='d-flex justify-content-center align-items-center' variant="primary" onClick={onClick} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxHeight: 45, width: "100%", height: "100%" }}>
                                <img src={copy} alt="copy" />
                                <div className='ms-2'>ID Tersalin</div>
                            </Button>
                        </CopyToClipboard>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DaftarUserDirectDebit