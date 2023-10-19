import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import $ from 'jquery'
import noteInfo from "../../assets/icon/note_icon_grey_transparent_bg.svg"
import noteInfoRed from "../../assets/icon/note_icon_red_transparent_bg.svg"
import downloadIcon from "../../assets/icon/download_icon.svg"
import refreshIcon from "../../assets/icon/refresh_icon.svg"
import { Col, Image, Row } from '@themesberg/react-bootstrap'
import { BaseURL, convertToRupiah, errorCatch, getToken, setUserSession } from '../../function/helpers'
import encryptData from '../../function/encryptData'
import CurrencyInput from "react-currency-input-field";
import axios from 'axios'
import DataTable, { defaultThemes } from 'react-data-table-component'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import Pagination from 'react-js-pagination'

function CreateVAUSD() {

    const history = useHistory()
    const [isVAUSD, setIsVAUSD] = useState("createTab")
    const [isTabFile, setIsTabFile] = useState(1)
    const [dataVABaru, setDataVABaru] = useState(0)
    const [generatedVA, setGeneratedVA] = useState({})
    const [fileTabs, setFileTabs] = useState([])
    const [listVAUSD, setListVAUSD] = useState([])
    const [pendingVAUSD, setPendingVAUSD] = useState(false)
    const [stockVA, setStockVA] = useState({
        available_stock: {
            stock: 0,
            stock_will_run_out: false
        },
        unavailable_stock: {
            stock: 0,
            stock_will_run_out: false
        }
    })
    const [totalPageCreate, setTotalPageCreate] = useState(1)
    const [activePageCreate, setActivePageCreate] = useState(1)
    const [pageNumberCreate, setPageNumberCreate] = useState({})
    console.log(stockVA, 'stockVA');

    const dataForTable = [
        {
            tab_id: 1,
            tab_name: "EZVAUSD01",
            data: [
                {
                    member_code: 111,
                    member_name: "PT. Ezeelink Indonesia",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
                {
                    member_code: 222,
                    member_name: "PT. Ezeelink Indonesia",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
                {
                    member_code: 333,
                    member_name: "PT. Ezeelink Indonesia",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
                {
                    member_code: 444,
                    member_name: "PT. Ezeelink Indonesia",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
                {
                    member_code: 555,
                    member_name: "PT. Ezeelink Indonesia",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
            ]
        },
        {
            tab_id: 2,
            tab_name: "EZVAUSD02",
            data: [
                {
                    member_code: 666,
                    member_name: "PT. Ezeelink Indonesia 2",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
                {
                    member_code: 777,
                    member_name: "PT. Ezeelink Indonesia 2",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
                {
                    member_code: 888,
                    member_name: "PT. Ezeelink Indonesia 2",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
                {
                    member_code: 999,
                    member_name: "PT. Ezeelink Indonesia 2",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
                {
                    member_code: 101,
                    member_name: "PT. Ezeelink Indonesia 2",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
            ]
        },
        {
            tab_id: 3,
            tab_name: "EZVAUSD03",
            data: [
                {
                    member_code: 202,
                    member_name: "PT. Ezeelink Indonesia 3",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
                {
                    member_code: 303,
                    member_name: "PT. Ezeelink Indonesia 3",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
                {
                    member_code: 404,
                    member_name: "PT. Ezeelink Indonesia 3",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
                {
                    member_code: 505,
                    member_name: "PT. Ezeelink Indonesia 3",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
                {
                    member_code: 606,
                    member_name: "PT. Ezeelink Indonesia 3",
                    amount: 500000,
                    period: "2023-09-20",
                    status_name_ind: "Berhasil",
                    status_id: 2,
                },
            ]
        },
    ]

    const columns = [
        {
            name: 'Member Code',
            selector: row => row.tvatrans_trx_id,
            width: "150px",
        // sortable: true
        },
        {
            name: 'Member Name',
            selector: row => row.tvatrans_crtdt_format,
            // sortable: true,
            // width: "143px",
            wrap: true,
        },
        {
            name: 'Amount',
            selector: row => row.partner_transid,
            // sortable: true,
            wrap: true,
            width: "170px",
        },
        {
            name: 'Period',
            selector: row => row.mpartner_name,
            // sortable: true
            wrap: true,
            width: "150px",
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
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
                    when: row => row.tvatrans_status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.tvatrans_status_id === 3 || row.tvatrans_status_id === 5 || row.tvatrans_status_id === 6 || row.tvatrans_status_id === 8 || row.tvatrans_status_id === 9 || row.tvatrans_status_id === 10 || row.tvatrans_status_id === 11 || row.tvatrans_status_id === 12 || row.tvatrans_status_id === 13 || row.tvatrans_status_id === 14 || row.tvatrans_status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
    ];
    console.log(dataVABaru, 'dataVABaru');

    function handlePageChangeCreate(params) {

    }

    function handleChange(e) {
        setDataVABaru(e)
    }

    async function getVAUSD(fileId) {
        try {
            setPendingVAUSD(true)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"bulk_id": ${fileId}, "page": 1, "row_per_page": 20}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            // console.log(dataParams, 'dataParams');
            const dataListVAUSD = await axios.post(BaseURL + "/VirtualAccountUSD/GetVirtualAccountUSD", {data: dataParams}, {headers: headers})
            console.log(dataListVAUSD, 'dataListVAUSD');
            if (dataListVAUSD.status === 200 && dataListVAUSD.data.response_code === 200 && dataListVAUSD.data.response_new_token === null) {
                setListVAUSD(dataListVAUSD.data.response_data.results)
                setPendingVAUSD(false)
            } else if (dataListVAUSD.status === 200 && dataListVAUSD.data.response_code === 200 && dataListVAUSD.data.response_new_token !== null) {
                setUserSession(dataListVAUSD.data.response_new_token)
                setListVAUSD(dataListVAUSD.data.response_data.results)
                setPendingVAUSD(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getFileNameAndStockVA(newDataVA) {
        try {
            const auth = 'Bearer ' + getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const fileNameAndStockVa = await axios.post(BaseURL + "/VirtualAccountUSD/GetFileandStockforVAUSD", {data: ""}, {headers: headers})
            console.log(fileNameAndStockVa, 'fileNameAndStockVa');
            if (fileNameAndStockVa.status === 200 && fileNameAndStockVa.data.response_code === 200 && fileNameAndStockVa.data.response_new_token === null) {
                setFileTabs(fileNameAndStockVa.data.response_data.results.bulk)
                setIsTabFile(fileNameAndStockVa.data.response_data.results.bulk[0].id)
                getVAUSD(fileNameAndStockVa.data.response_data.results.bulk[0].id)
                setStockVA(fileNameAndStockVa.data.response_data.results.stock)
            } else if (fileNameAndStockVa.status === 200 && fileNameAndStockVa.data.response_code === 200 && fileNameAndStockVa.data.response_new_token !== null) {
                setUserSession(fileNameAndStockVa.data.response_new_token)
                setFileTabs(fileNameAndStockVa.data.response_data.results.bulk)
                setIsTabFile(fileNameAndStockVa.data.response_data.results.bulk[0].id)
                setStockVA(fileNameAndStockVa.data.response_data.results.stock)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function generateDataVABaru(dataVA) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"totalcollection": ${Number(dataVA)}}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            // console.log(dataParams, 'dataParams');
            const generateVA = await axios.post(BaseURL + "/VirtualAccountUSD/GenerateVirtualAccount", {data: dataParams}, {headers: headers})
            console.log(generateVA, 'generateVA');
            if (generateVA.status === 200 && generateVA.data.response_code === 200 && generateVA.data.response_new_token === null) {
                // setGeneratedVA(generateVA.data.response_data.results)
                getFileNameAndStockVA(generateVA.data.response_data.results)
            } else if (generateVA.status === 200 && generateVA.data.response_code === 200 && generateVA.data.response_new_token !== null) {
                setUserSession(generateVA.data.response_new_token)
                // setGeneratedVA(generateVA.data.response_data.results)
                getFileNameAndStockVA(generateVA.data.response_data.results)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        getFileNameAndStockVA()
    }, [])

    function pindahFileTab(fileId) {
        setIsTabFile(fileId)
        getVAUSD(fileId)
    }

    function pindahHalaman(param) {
        if (param === "create") {
            settlementManualTabs(100)
            // resetButtonHandle("eMoney")
        } else if (param === "update") {
            settlementManualTabs(101)
            // resetButtonHandle("eMoney")
        } else if (param === "riwayat") {
            settlementManualTabs(102)
            // resetButtonHandle("VA")
        }
    }

    function settlementManualTabs(isTabs){
        setIsVAUSD(isTabs)
        if (isTabs === 101) {
            $('#createTab').removeClass('menu-detail-akun-hr-active')
            $('#createSpan').removeClass('menu-detail-akun-span-active')
            $('#updateTab').addClass('menu-detail-akun-hr-active')
            $('#updateSpan').addClass('menu-detail-akun-span-active')
            $('#riwayatTab').removeClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').removeClass('menu-detail-akun-span-active')
        } else if (isTabs === 102) {
            $('#createTab').removeClass('menu-detail-akun-hr-active')
            $('#createSpan').removeClass('menu-detail-akun-span-active')
            $('#riwayatTab').addClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').addClass('menu-detail-akun-span-active')
            $('#updateTab').removeClass('menu-detail-akun-hr-active')
            $('#updateSpan').removeClass('menu-detail-akun-span-active')
        } else if (isTabs === 100) {
            $('#updateTab').removeClass('menu-detail-akun-hr-active')
            $('#updateSpan').removeClass('menu-detail-akun-span-active')
            $('#createTab').addClass('menu-detail-akun-hr-active')
            $('#createSpan').addClass('menu-detail-akun-span-active')
            $('#riwayatTab').removeClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').removeClass('menu-detail-akun-span-active')
        }
    }

    const columnsVAUSD = [
        {
            name: 'Member Code',
            selector: row => row.company_code,
            // width: "150px",
            wrap: true,
            // sortable: true
        },
        {
            name: 'Member Name',
            selector: row => row.member_name,
            // sortable: true,
            // width: "180px",
            wrap: true,
        },
        {
            name: 'Amount',
            selector: row => `USD ${row.amount_request}`,
            wrap: true,
            // width: "180px"
        },
        {
            name: 'Period',
            selector: row => row.period,
            // sortable: true,
            wrap: true,
            // width: "170px",
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            width: "150px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.status_id === 1 || row.status_id === 7,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                {
                    when: row => row.status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.status_id === 3 || row.status_id === 5 || row.status_id === 6 || row.status_id === 8 || row.status_id === 9 || row.status_id === 10 || row.status_id === 11 || row.status_id === 12 || row.status_id === 13 || row.status_id === 14 || row.status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
    ];

    const customStyles = {
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
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;VA USD  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Buat VA USD</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Virtual Account USD</h2>
            </div>
            <div className='base-content mt-3 pb-4'>
                <div className='detail-akun-menu' style={{fontFamily: "Exo", display: 'flex', height: 33}}>
                    <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => pindahHalaman("create")} id="createTab">
                        <span className='menu-detail-akun-span menu-detail-akun-span-active' id="createSpan">Buat VA Baru</span>
                    </div>
                    <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("update")} id="updateTab">
                        <span className='menu-detail-akun-span' id="updateSpan">Update VA</span>
                    </div>
                    <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("riwayat")} id="riwayatTab">
                        <span className='menu-detail-akun-span' id="riwayatSpan">Riwayat VA</span>
                    </div>
                </div>
                <hr className='hr-style mb-4' style={{marginTop: -2}}/>
                <span className='font-weight-bold mt-3' style={{fontFamily: "Exo", fontWeight: 700}}>Buat VA</span>
                <div className='d-flex justify-content-start align-items-center mt-3 mb-3' style={{ color: '#383838', padding: '14px 25px 14px 14px', fontSize: 14, fontStyle: 'italic', whiteSpace: 'normal', backgroundColor: 'rgba(255, 214, 0, 0.16)', borderRadius: 4 }}>
                    <div className='ms-2'>Virtual Account akan aktif selama <b>30 hari</b> setelah dibuat, dan akan aktif sejak tanggal <b>26/08/2023 - 24/09/2023</b></div>
                </div>
                <div className='my-4'>
                    <div style={{ fontSize: 14, fontWeight: 400, marginBottom: 10 }}>Jumlah data VA baru</div>
                    <CurrencyInput
                        className="input-text-ez"
                        value={dataVABaru}
                        onValueChange={(e) => handleChange(e)}
                        placeholder="0"
                        style={{ width: "9%", marginLeft: "unset", }}
                        allowDecimals={false}
                        allowNegativeValue={false}
                        // style={{
                        //     borderColor: alertFee ? "red" : ""
                        // }}
                        // groupSeparator={"."}
                        // decimalSeparator={','}
                        maxLength={4}
                        // prefix={biayaHandle.feeType === 0 || biayaHandle.feeType === 100 ? "Rp " : ""}
                        // suffix={biayaHandle.feeType === 0 || biayaHandle.feeType === 100 ? "" : "%"}
                    />
                    {/* <input
                        type="number"
                        className="input-text-ez"
                        onChange={handleChange}
                        value={Number(dataVABaru)}
                        name="dataVA"
                        // placeholder={"0"}
                        style={{ width: "9%", marginLeft: "unset", }}
                        // style={{ width: "100%", marginLeft: "unset", borderColor: alertMaksTransaksi ? "red" : "" }}
                        // onBlur={() => setEditMaksTransaksi(!editMaksTransaksi)}
                        min={0}
                        max={1000}
                        onKeyDown={(evt) => ["e", "E", "+", "-", ","].includes(evt.key) && evt.preventDefault()}
                    /> */}
                    <button
                        onClick={() => generateDataVABaru(dataVABaru)}
                        // className={dataFromUpload.length === 0 ? 'btn-noez-transfer' : 'btn-ez-transfer'} //untukcsv
                        className={'btn-ez-transfer'} //untuk excel
                        style={{ width: '18%', marginLeft: 10 }}
                    >
                        Generate Virtual Account
                    </button>
                </div>
                <hr className='hr-style mb-4' style={{marginTop: -2}}/>
                <div className='my-4'>
                    <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Daftar File & VA</div>
                    <Row>
                        <Col>
                            <Row className='d-flex justify-content-start'>
                                <Col xs={3} className="card-information mt-3" style={{border: '1px solid #EBEBEB', height: 'fit-content', padding: '12px 0px 12px 16px'}}>
                                    <div className='d-flex'> {/*noteInfoRed*/}
                                        <img src={stockVA.available_stock.stock_will_run_out ? noteInfoRed : noteInfo} width="20" height="20" alt="circle_info" />
                                        <span className="p-info" style={{ paddingLeft: 7, width: 110 }}>Total sisa stok VA Tersedia: </span>
                                        <span style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700, paddingRight: 10, marginTop: 5 }}>{convertToRupiah(stockVA.available_stock.stock, false)}</span>
                                    </div>
                                </Col>
                                <Col xs={3} className="card-information mt-3 ms-3" style={{border: '1px solid #EBEBEB', height: 'fit-content', padding: '12px 0px 12px 16px'}}>
                                    <div className='d-flex'>
                                        <img src={stockVA.unavailable_stock.stock_will_run_out ? noteInfoRed : noteInfo} width="20" height="20" alt="circle_info" />
                                        <span className="p-info" style={{ paddingLeft: 7, width: 110 }}>Total VA Belum Tersedia: </span>
                                        <span style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700, paddingRight: 10, marginTop: 5 }}>{convertToRupiah(stockVA.unavailable_stock.stock, false)}</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row className='d-flex justify-content-end'>
                                <Col xs={3} className="card-information mt-3" style={{border: '1px solid #077E86', height: 44, padding: '8px 24px'}}>
                                    <div className='d-flex'>
                                        <img src={downloadIcon} width="24" height="24" alt="download_icon" />
                                        <span style={{ paddingLeft: 7, fontFamily: 'Exo', fontSize: 18, fontWeight: 700, color: '#077E86' }}>Download File CSV</span>
                                    </div>
                                </Col>
                                <Col xs={3} className="card-information mt-3 ms-3" style={{border: '1px solid #077E86', height: 44, padding: '8px 24px'}}>
                                    <div className='d-flex'>
                                        <img src={refreshIcon} width="24" height="24" alt="refresh_icon" />
                                        <span className="p-info" style={{ paddingLeft: 7, fontFamily: 'Exo', fontSize: 18, fontWeight: 700, color: '#077E86' }}>Perbarui Data</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className='mt-4' style={{ width: "auto" }}>
                        <div className='detail-akun-menu filename-bar' style={{fontFamily: "Exo", display: 'flex', height: 33, overflowX : "scroll"}}>
                            {
                                fileTabs.length !== 0 &&
                                fileTabs.map(item => (
                                        <div key={item.id} className={`me-2 detail-akun-tabs ${isTabFile === item.id && "menu-detail-akun-hr-active"}`} onClick={() => pindahFileTab(item.id)} id={item.name}>
                                            <span className={`menu-detail-akun-span ${isTabFile === item.id && "menu-detail-akun-span-active"}`} id="createSpan">{item.name}</span>
                                        </div>
                                ))
                            }
                        </div>
                        <hr className='hr-style mb-4' style={{marginTop: -2}}/>
                        <div className="div-table mt-4 pb-4">
                            <DataTable
                                columns={columnsVAUSD}
                                data={listVAUSD}
                                customStyles={customStyles}
                                highlightOnHover
                                progressPending={pendingVAUSD}
                                progressComponent={<CustomLoader />}
                                // pagination
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                            <div style={{ marginRight: 10, marginTop: 10 }}>Total Halaman : {totalPageCreate}</div>
                            <Pagination
                                activePage={activePageCreate}
                                itemsCountPerPage={pageNumberCreate.row_per_page}
                                totalItemsCount={(pageNumberCreate.row_per_page*pageNumberCreate.max_page)}
                                pageRangeDisplayed={5}
                                itemClass="page-item"
                                linkClass="page-link"
                                onChange={handlePageChangeCreate}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateVAUSD