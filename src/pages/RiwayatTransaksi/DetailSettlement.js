import React, { useEffect, useState } from 'react'
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
// import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DataTable, { defaultThemes } from 'react-data-table-component';
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { useHistory, useParams } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import axios from 'axios';

function DetailSettlement() {

    const access_token = getToken();
    const user_role = getRole();
    const history = useHistory()
    const { settlementId } = useParams();
    const [dataSettlement, setDataSettlement] = useState([])
    const [pendingSettlement, setPendingSettlement] = useState(false)
    // const [inputHandle, setInputHandle] = useState({
    //     idTransaksiSettlement: "",
    //     namaPartnerSettlement: "",
    //     statusSettlement: [],
    //     periodeSettlement: 0,
    // })

    async function getDetailSettlement(settlementId) {
        // console.log(settlementId, 'ini params in function');
        try {
            setPendingSettlement(true)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{ "tvasettl_id": ${settlementId}, "page":1, "row_per_page":10 }`);
            // console.log(dataParams, 'ini data params');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const detailsettlement = await axios.post("/Report/GetSettlementTransactionByID", { data: dataParams }, { headers: headers })
            // console.log(detailsettlement, 'ini data settlement');
            if (detailsettlement.status === 200 && detailsettlement.data.response_code === 200 && detailsettlement.data.response_new_token.length === 0) {
                detailsettlement.data.response_data = detailsettlement.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                setDataSettlement(detailsettlement.data.response_data)
                setPendingSettlement(false)
            } else if (detailsettlement.status === 200 && detailsettlement.data.response_code === 200 && detailsettlement.data.response_new_token.length !== 0) {
                detailsettlement.data.response_data = detailsettlement.data.response_data.map((obj, id) => ({ ...obj, number: id + 1 }));
                setUserSession(detailsettlement.data.response_new_token)
                setDataSettlement(detailsettlement.data.response_data)
                setPendingSettlement(false)
            }
        } catch (error) {
            console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    // function handleChange(e) {
    //     setInputHandle({
    //         ...inputHandle,
    //         [e.target.name]: e.target.value
    //     })
    // }

    // function handleChangePeriodeSettlement(e) {
        
    // }

    // function pickDateSettlement(params) {
        
    // }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        if (user_role === "102") {
            history.push('/404');
        }
        getDetailSettlement(settlementId)
    }, [settlementId])
    
    async function ExportReportDetailSettlementHandler(params) {
        try {
            
        } catch (error) {
            console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }
    
    const columnsSettl = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
            // style: { justifyContent: "center", }
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tvatrans_trx_id,
            // sortable: true
            width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
        },
        {
            name: 'Waktu',
            selector: row => row.tvatrans_crtdt_format,
            // style: { justifyContent: "center", },
            width: "150px",
            // sortable: true,
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.tvatrans_amount),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Fee Transaksi',
            selector: row => convertToRupiah(row.tvatrans_partner_fee),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Fee Tax Transaksi',
            selector: row => convertToRupiah(row.tvatrans_fee_tax),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Fee Bank',
            selector: row => convertToRupiah(row.tvatrans_bank_fee),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            width: "155px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.tvatrans_status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.tvatrans_status_id === 1 || row.tvatrans_status_id === 7,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                {
                    when: row => row.tvatrans_status_id === 4 || row.tvatrans_status_id === 9,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.tvatrans_status_id === 3 || row.tvatrans_status_id === 5 || row.tvatrans_status_id === 6 || row.tvatrans_status_id === 8 || row.tvatrans_status_id === 10 || row.tvatrans_status_id === 11 || row.tvatrans_status_id === 12 || row.tvatrans_status_id === 13 || row.tvatrans_status_id === 14 || row.tvatrans_status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                paddingRight: '0px',
                marginRight: '0px',
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
                    borderleftStyle: 'solid',
                    borderleftWidth: '1px',
                    borderleftColor: defaultThemes.default.divider.default,
                },
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: defaultThemes.default.divider.default,
                borderleftStyle: 'solid',
                borderleftWidth: '1px',
                borderleftColor: defaultThemes.default.divider.default,
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: defaultThemes.default.divider.default,
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
        <span className='breadcrumbs-span'>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Detail Settlement</span>
        <div className='head-title'>
            <h2 className="h5 mb-3 mt-4">Detail Settlement</h2>
        </div>
        {
            dataSettlement.length !== 0 &&  
            <div style={{ marginBottom: 30 }}>
                {/* <Link onClick={() => ExportReportDetailSettlementHandler(inputHandle.statusDanaMasuk, inputHandle.idTransaksiDanaMasuk, inputHandle.namaPartnerDanaMasuk, inputHandle.namaAgenDanaMasuk, inputHandle.periodeDanaMasuk, dateRangeDanaMasuk)} className="export-span">Export</Link> */}
            </div>
        }
        <div className='main-content'>
            <div className='riwayat-dana-masuk-div mt-4'>
                <div className='base-content mt-3'>
                    <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Detail Settlement</span>
                    <div className="div-table mt-4 pb-4">
                        <DataTable
                            columns={columnsSettl}
                            data={dataSettlement}
                            customStyles={customStyles}
                            progressPending={pendingSettlement}
                            progressComponent={<CustomLoader />}
                            dense
                            // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                            // pagination
                        />
                    </div>
                    {/* <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                    <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageSettlement}</div>
                        <Pagination
                            activePage={activePageSettlement}
                            itemsCountPerPage={pageNumberSettlement.row_per_page}
                            totalItemsCount={(pageNumberSettlement.row_per_page*pageNumberSettlement.max_page)}
                            pageRangeDisplayed={5}
                            itemClass="page-item"
                            linkClass="page-link"
                            onChange={handlePageChangeSettlement}
                        />
                    </div> */}
                </div>
            </div>
        </div>
        {/* <Modal centered show={showModalDetailTransferDana} onHide={() => setShowModalDetailTransferDana(false)} style={{ borderRadius: 8 }}>
            <Modal.Body style={{ maxWidth: 468, width: "100%", padding: "0px 24px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                    <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }}>Detail Transaksi</p>
                </div>
                <div>
                    <Container style={{ paddingLeft: "unset", paddingRight: "unset" }}>
                        <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400 }}>
                            <Col>ID Transaksi</Col>
                            <Col style={{ display: "flex", justifyContent: "end" }}>Status</Col>
                        </Row>
                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                            <Col>{detailTransferDana.mpartnerdtl_partner_id}</Col>
                            <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 4, maxWidth: 160, width: "100%", height: 32, background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }}>{detailTransferDana.mstatus_name}</Col>
                            <br />
                        </Row>
                        <div style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: -10 }}>{detailTransferDana.tvatrans_crtdt}</div>
                        <center>
                            <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                        </center>
                        <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, }}>Detail Pengiriman</div>
                        <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>
                            <Col>Nama Agen</Col>
                            <Col style={{ display: "flex", justifyContent: "end" }}>ID Agen</Col>
                        </Row>
                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                            <Col>{detailTransferDana.mpartnerdtl_sub_name}</Col>
                            <Col style={{ display: "flex", justifyContent: "end" }}>{detailTransferDana.tvatrans_sub_partner_id}</Col>
                        </Row>
                        <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>
                            <Col>Nama Partner</Col>
                            <Col style={{ display: "flex", justifyContent: "end" }}>ID Partner</Col>
                        </Row>
                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                            <Col>{detailTransferDana.mpartner_name}</Col>
                            <Col style={{ display: "flex", justifyContent: "end" }}>{detailTransferDana.mpartnerdtl_partner_id}</Col>
                        </Row>
                        <div style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>No VA</div>
                        <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>{detailTransferDana.tvatrans_va_number}</div>
                        <center>
                            <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                        </center>
                        <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, }}>Rincian Dana</div>
                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                            <Col style={{ fontWeight: 400 }}>Jumlah Dana Diterima</Col>
                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_amount)}</Col>
                        </Row>
                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                            <Col style={{ fontWeight: 400 }}>Biaya VA</Col>
                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_bank_fee)}</Col>
                        </Row>
                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                            <Col style={{ fontWeight: 400 }}>Biaya Partner</Col>
                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(detailTransferDana.tvatrans_partner_fee)}</Col>
                        </Row>
                        <center>
                            <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, padding: "0px 24px", border: "1px dashed #EBEBEB" }} />
                        </center>
                        <Row style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 700, marginTop: 12 }}>
                            <Col>Total</Col>
                            <Col style={{ display: "flex", justifyContent: "end" }}>{convertToRupiah((detailTransferDana.tvatrans_amount + detailTransferDana.tvatrans_bank_fee + detailTransferDana.tvatrans_partner_fee))}</Col>
                        </Row>
                    </Container>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                    <Button variant="primary" onClick={() => setShowModalDetailTransferDana(false)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Kembali</Button>
                </div>
            </Modal.Body>
        </Modal> */}
    </div>
    )
}

export default DetailSettlement