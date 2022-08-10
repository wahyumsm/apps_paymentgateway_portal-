import React from "react";
import { Row, Col, Form, Image } from '@themesberg/react-bootstrap'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import Pagination from "react-js-pagination";
import { invoiceItems } from "../../data/tables";
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import DataTable from 'react-data-table-component';

function RiwayatTopup() {

    const columns = [
        {
            name: 'No',
            selector: row => row.id,
            // width: "70px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.item,
            // width: "120px",
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
        // sortable: true
        },
        {
            name: 'Nominal',
            selector: row => row.description,
            // sortable: true,          
            // width: "143px",
        },
        {
            name: 'Tanggal',
            selector: row => row.price,
            // sortable: true
            // width: "150px",
        },
        {
            name: 'Status',
            selector: row => row.quantity,
            // width: "150px",
            // sortable: true,
            // style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            // conditionalCellStyles: [
            //     {
            //         when: row => row.tvatrans_status_id === 2,
            //         style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", paddingLeft: "unset" }
            //     },
            //     {
            //         when: row => row.tvatrans_status_id === 1 || row.tvatrans_status_id === 7,
            //         style: { background: "#FEF4E9", color: "#F79421", paddingLeft: "unset" }
            //     },
            //     {
            //         when: row => row.tvatrans_status_id === 4 || row.tvatrans_status_id === 9,
            //         style: { background: "#FDEAEA", color: "#EE2E2C", paddingLeft: "unset" }
            //     },
            //     {
            //         when: row => row.tvatrans_status_id === 3 || row.tvatrans_status_id === 5 || row.tvatrans_status_id === 6 || row.tvatrans_status_id === 8 || row.tvatrans_status_id === 10 || row.tvatrans_status_id === 11 || row.tvatrans_status_id === 12 || row.tvatrans_status_id === 13 || row.tvatrans_status_id === 14 || row.tvatrans_status_id === 15,
            //         style: { background: "#F0F0F0", color: "#888888", paddingLeft: "unset" }
            //     }
            // ],
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
                // justifyContent: 'center',
            },
        },
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          {/* <div>Loading...</div> */}
        </div>
    );
    return (
        <div className="main-content mt-5 " style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Riwayat Top Up</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4">Riwayat Top Up</h2>
            </div>
            <div className="main-content">
                <div className="riwayat-dana-masuk-div mt-4">
                    <div className="base-content mt-3">
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                        <Row className='mt-4'>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span>ID Transaksi</span>
                                <input  type='text'className='input-text-ez' placeholder='Masukkan ID Transaksi'/>
                                {/* <input type='text'className='input-text-ez me-2' placeholder='Masukkan ID Transaksi'/>            */}
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span>Periode</span>
                                <Form.Select name='periodeDanaMasuk' className="input-text-ez" >
                                    <option defaultChecked>Pilih Periode</option>
                                    <option value={2}>Hari Ini</option>
                                    <option value={3}>Kemarin</option>
                                    <option value={4}>7 Hari Terakhir</option>
                                    <option value={5}>Bulan Ini</option>
                                    <option value={6}>Bulan Kemarin</option>
                                    <option value={7}>Pilih Range Tanggal</option>
                                </Form.Select>
                                {/* <div style={{ display: showDateDanaMasuk }}>
                                    <DateRangePicker 
                                        // onChange={pickDateDanaMasuk}
                                        // value={stateDanaMasuk}
                                        // clearIcon={null}
                                        // calendarIcon={null}
                                    />
                                </div> */}
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span>Status</span>
                                <Form.Select name="statusDanaMasuk" className='input-text-ez ' style={{ display: "inline" }} >
                                    <option>Pilih Status</option>
                                    <option value={1}>Menunggu Pembayaran</option>
                                    <option value={2}>Berhasil</option>
                                    <option value={3}>Expired</option>
                                </Form.Select>
                            </Col>                        
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={3}>
                                <Row>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            // onClick={() => filterRiwayatDanaMasuk(1, inputHandle.statusDanaMasuk, inputHandle.idTransaksiDanaMasuk, inputHandle.namaPartnerDanaMasuk, inputHandle.namaAgenDanaMasuk, inputHandle.periodeDanaMasuk, dateRangeDanaMasuk, 0)}
                                            // className={(inputHandle.periodeDanaMasuk || dateRangeDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.idTransaksiDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.statusDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.namaAgenDanaMasuk.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                            // disabled={inputHandle.periodeDanaMasuk === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.idTransaksiDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.statusDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.namaAgenDanaMasuk.length === 0}
                                            className="btn-ez-on"
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            // onClick={() => resetButtonHandle("Dana Masuk")}
                                            // className={(inputHandle.periodeDanaMasuk || dateRangeDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.idTransaksiDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.statusDanaMasuk.length !== 0 || dateRangeDanaMasuk.length !== 0 && inputHandle.namaAgenDanaMasuk.length !== 0) ? "btn-ez-on" : "btn-ez"}
                                            // disabled={inputHandle.periodeDanaMasuk === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.idTransaksiDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.statusDanaMasuk.length === 0 || inputHandle.periodeDanaMasuk === 0 && inputHandle.namaAgenDanaMasuk.length === 0}
                                            className="btn-ez-on"
                                        >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <div className="div-table mt-4 pb-4">
                            <DataTable
                                columns={columns}
                                data={invoiceItems}
                                customStyles={customStyles}
                                highlightOnHover
                                // progressPending={pendingTransfer}
                                progressComponent={<CustomLoader />}
                                // pagination
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: 10</div>
                            <Pagination
                                // activePage={activePageDanaMasuk}
                                // itemsCountPerPage={pageNumberDanaMasuk.row_per_page}
                                // totalItemsCount={(pageNumberDanaMasuk.row_per_page*pageNumberDanaMasuk.max_page)}
                                pageRangeDisplayed={5}
                                itemClass="page-item"
                                linkClass="page-link"
                                // onChange={handlePageChangeDanaMasuk}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RiwayatTopup