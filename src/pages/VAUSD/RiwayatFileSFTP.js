import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Link, useHistory } from 'react-router-dom'
import { Col, Form, Row } from '@themesberg/react-bootstrap'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { BaseURL, CustomLoader, errorCatch, getToken, setUserSession } from '../../function/helpers';
import encryptData from '../../function/encryptData';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import DataTable, { defaultThemes } from 'react-data-table-component';
import downloadIcon from "../../assets/icon/download_icon.svg"

function RiwayatFileSFTP() {

    const history = useHistory()
    const [showDateSFTPAdmin, setShowDateSFTPAdmin] = useState("none")
    const [stateSFTPAdmin, setStateSFTPAdmin] = useState(null)
    const [dateRangeSFTPAdmin, setDateRangeSFTPAdmin] = useState([])
    const [inputHandleSFTPAdmin, setInputHandleSFTPAdmin] = useState({
        periodeSFTPAdmin: 0
    })
    const [listTransaksiSFTPAdmin, setListTransaksiSFTPAdmin] = useState([])
    const [pendingTransaksiSFTPAdmin, setPendingTransaksiSFTPAdmin] = useState(false)
    const [totalPageSFTPAdmin, setTotalPageSFTPAdmin] = useState(0)
    const [activePageSFTPAdmin, setActivePageSFTPAdmin] = useState(1)
    const [pageNumberSFTPAdmin, setPageNumberSFTPAdmin] = useState({})

    function pickDateSFTPAdmin(item) {
        setStateSFTPAdmin(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangeSFTPAdmin(item)
        }
    }

    function handleChangePeriodeSFTPAdmin(e) {
        if (e.target.value === "7") {
            setShowDateSFTPAdmin("")
            setInputHandleSFTPAdmin({
                ...inputHandleSFTPAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateSFTPAdmin("none")
            setDateRangeSFTPAdmin([])
            setInputHandleSFTPAdmin({
                ...inputHandleSFTPAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function resetButtonSFTPAdminHandle() {
        setShowDateSFTPAdmin("none")
        setStateSFTPAdmin(null)
        setDateRangeSFTPAdmin([])
        setInputHandleSFTPAdmin({
            periodeSFTPAdmin: 0
        })
    }

    function handlePageChangeSFTPAdmin(page) {
        setActivePageSFTPAdmin(page)
        getListTransaksiSFTPAdmin(page, inputHandleSFTPAdmin.periodeSFTPAdmin, dateRangeSFTPAdmin)
    }

    function downloadFileHandler(source) {
        window.open(source, '_blank')
        // const a = document.createElement("a");
        // a.href = source;
        // a.setAttribute(`download`, source);
        // a.click()
    }

    async function getListTransaksiSFTPAdmin(page, dateId, dateRange) {
        try {
            setPendingTransaksiSFTPAdmin(true)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "page" : ${page}, "row_per_page": 10, "date_from": "${Number(dateId) === 7 ? dateRange[0] : ""}", "date_to": "${Number(dateId) === 7 ? dateRange[1] : ""}", "period": ${Number(dateId) !== 0 ? Number(dateId) : 2} }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : "ID"
            }
            console.log(dataParams, 'dataParams');
            const dataListtransaksiSFTP = await axios.post(BaseURL + "/VirtualAccountUSD/GetRiwayatFileSFTP", {data: dataParams}, {headers: headers})
            console.log(dataListtransaksiSFTP, 'dataListtransaksiSFTP');
            if (dataListtransaksiSFTP.status === 200 && dataListtransaksiSFTP.data.response_code === 200 && dataListtransaksiSFTP.data.response_new_token === null) {
                dataListtransaksiSFTP.data.response_data.results = dataListtransaksiSFTP.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberSFTPAdmin(dataListtransaksiSFTP.data.response_data)
                setTotalPageSFTPAdmin(dataListtransaksiSFTP.data.response_data.max_page)
                setListTransaksiSFTPAdmin(dataListtransaksiSFTP.data.response_data.results)
                setPendingTransaksiSFTPAdmin(false)
            } else if (dataListtransaksiSFTP.status === 200 && dataListtransaksiSFTP.data.response_code === 200 && dataListtransaksiSFTP.data.response_new_token !== null) {
                setUserSession(dataListtransaksiSFTP.data.response_new_token)
                dataListtransaksiSFTP.data.response_data.results = dataListtransaksiSFTP.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}))
                setPageNumberSFTPAdmin(dataListtransaksiSFTP.data.response_data)
                setTotalPageSFTPAdmin(dataListtransaksiSFTP.data.response_data.max_page)
                setListTransaksiSFTPAdmin(dataListtransaksiSFTP.data.response_data.results)
                setPendingTransaksiSFTPAdmin(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        getListTransaksiSFTPAdmin(activePageSFTPAdmin, inputHandleSFTPAdmin.periodeSFTPAdmin, dateRangeSFTPAdmin)
    }, [])

    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "3%",
            wrap: true,
            maxWidth: 'fit-content !important'
        },
        {
            name: 'Nama File',
            selector: row => row.name,
            // width: "150px",
            // sortable: true
        },
        {
            name: 'Update Terakhir',
            selector: row => row.last_Updated,
            // sortable: true,
            // width: "180px",
            wrap: true,
        },
        {
            name: 'Aksi',
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86", fontSize: 14, fontWeight: 700 }} onClick={() => downloadFileHandler(row.source)}><img src={downloadIcon} width="24" height="24" alt="download_icon" />Download</Link>,
            wrap: true,
            width: "180px"
        },
    ];

    const customStylesTransaksiFileSFTP = {
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


    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;VA USD  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Riwayat File SFTP</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Riwayat File SFTP</h2>
            </div>
            <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Tabel Riwayat File SFTP</h2>
            <div className='base-content mt-3 pb-4'>
                <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                <Row className='mt-4'>
                    <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: "33%" }}>
                        <span style={{ marginRight: 25 }}>Periode <span style={{ color: "red" }}>*</span></span>
                        <Form.Select name='periodeSFTPAdmin' className="input-text-riwayat ms-3" value={inputHandleSFTPAdmin.periodeSFTPAdmin} onChange={(e) => handleChangePeriodeSFTPAdmin(e)}>
                            <option defaultChecked disabled value={0}>Pilih Periode</option>
                            <option value={2}>Hari Ini</option>
                            <option value={3}>Kemarin</option>
                            <option value={4}>7 Hari Terakhir</option>
                            <option value={5}>Bulan Ini</option>
                            <option value={6}>Bulan Kemarin</option>
                            <option value={7}>Pilih Range Tanggal</option>
                        </Form.Select>
                    </Col>
                    <Col xs={3} style={{ display: showDateSFTPAdmin }} className='text-start'>
                        <DateRangePicker
                            onChange={pickDateSFTPAdmin}
                            value={stateSFTPAdmin}
                            clearIcon={null}
                            // calendarIcon={null}
                        />
                    </Col>
                    <Col xs={5}>
                        <Row>
                            <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                <button
                                    onClick={() => getListTransaksiSFTPAdmin(1, inputHandleSFTPAdmin.periodeSFTPAdmin, dateRangeSFTPAdmin)}
                                    className={(inputHandleSFTPAdmin.periodeSFTPAdmin === 0 || (inputHandleSFTPAdmin.periodeSFTPAdmin === 7 && dateRangeSFTPAdmin.length === 0)) ? "btn-ez" : "btn-ez-on"}
                                    disabled={(inputHandleSFTPAdmin.periodeSFTPAdmin === 0 || (inputHandleSFTPAdmin.periodeSFTPAdmin === 7 && dateRangeSFTPAdmin.length === 0))}
                                >
                                    Terapkan
                                </button>
                            </Col>
                            <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                <button
                                    onClick={resetButtonSFTPAdminHandle}
                                    className={(inputHandleSFTPAdmin.periodeSFTPAdmin === 0 || (inputHandleSFTPAdmin.periodeSFTPAdmin === 7 && dateRangeSFTPAdmin.length === 0)) ? "btn-ez-reset" : "btn-reset"}
                                    disabled={(inputHandleSFTPAdmin.periodeSFTPAdmin === 0 || (inputHandleSFTPAdmin.periodeSFTPAdmin === 7 && dateRangeSFTPAdmin.length === 0))}
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
                        data={listTransaksiSFTPAdmin}
                        customStyles={customStylesTransaksiFileSFTP}
                        highlightOnHover
                        progressPending={pendingTransaksiSFTPAdmin}
                        progressComponent={<CustomLoader />}
                        // pagination
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                    <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageSFTPAdmin}</div>
                    <Pagination
                        activePage={activePageSFTPAdmin}
                        itemsCountPerPage={pageNumberSFTPAdmin.row_per_page}
                        totalItemsCount={(pageNumberSFTPAdmin.row_per_page*pageNumberSFTPAdmin.max_page)}
                        pageRangeDisplayed={5}
                        itemClass="page-item"
                        linkClass="page-link"
                        onChange={handlePageChangeSFTPAdmin}
                    />
                </div>
            </div>
        </div>
    )
}

export default RiwayatFileSFTP