import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Col, Image, Row } from '@themesberg/react-bootstrap'
import DataTable from 'react-data-table-component'
import { DateRangePicker } from 'rsuite'
import { isAfter } from 'date-fns'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import triangleInfo from "../../assets/icon/triangle-info.svg"
import { BaseURL, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import encryptData from '../../function/encryptData'
import axios from 'axios'
import Pagination from 'react-js-pagination'

const { afterToday } = DateRangePicker;

const SettlementAdminManual = () => {
    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const [pendingListSettlement, setPendingListSettlement] = useState(false)
    const [stateHistorySettlement, setStateHistorySettlement] = useState(null)
    const [dateRangeHistorySettlement, setDateRangeHistorySettlement] = useState([])
    const [dataListHistorySettleManual, setDataListHistorySettleManual] = useState([])
    const [pageNumberHistorySettleManual, setPageNumberHistorySettleManual] = useState({})
    const [totalPageHistorySettleManual, setTotalPageHistorySettleManual] = useState(0)
    const [activePageHistorySettleManual, setActivePageHistorySettleManual] = useState(1)
    const [isFilterListHistorySettle, setIsFilterListHistorySettle] = useState(false)
    const currentDate = new Date().toISOString().split('T')[0]
    const oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate() + 1).toISOString().split('T')[0]
    const Locale = {
        sunday: 'Min',
        monday: 'Sen',
        tuesday: 'Sel',
        wednesday: 'Rab',
        thursday: 'Kam',
        friday: 'Jum',
        saturday: 'Sab',
        ok: 'Terapkan',
    };
    const column = [
        {
            label: <><img src={triangleInfo} alt="triangle_info" style={{ marginRight: 3, marginTop: -6 }} /> Range Tanggal maksimal hari ini.</>,
            style: {
                color: '#383838',
                width: '30rem',
                padding: '14px 25px 14px 14px',
                fontSize: 13,
                fontStyle: 'italic',
                textAlign: 'left',
                whiteSpace: 'normal',
                backgroundColor: 'rgba(255, 214, 0, 0.16)',
                opacity: 'unset'
            },
            placement: 'bottom',

        },
    ]

    function pickDateHistorySettlement(item) {
        setStateHistorySettlement(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangeHistorySettlement(item)
        }
    }

    function handlePageChangeListHistorySettle(page) {
        if (isFilterListHistorySettle) {
            setActivePageHistorySettleManual(page)
            filterListHistorySettle(dateRangeHistorySettlement, page, 10)
        } else {
            setActivePageHistorySettleManual(page)
            listHistorySettleManualHandler(currentDate, page)
        }
    }

    function toProsesSettlement () {
        history.push("/Settlement/proses-settlement-manual")
    }

    const columnList = [
        {
            name: 'Partner',
            selector: row => row.mpartnerdtl_sub_name,
        },
        {
            name: 'Type',
            selector: row => row.mpaytype_name !== null ? row.mpaytype_name : "-",
        },
        {
            name: 'Date',
            selector: row => row.msettlmanual_crtdt,
        },
        {
            name: 'Create User',
            selector: row => row.muser_username,
        },
        {
            name: 'Date User',
            selector: row => row.settle_date,
        },
    ];

    async function listHistorySettleManualHandler(date, page) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"partner_id": "", "date_from": "", "date_to": "${date}", "page": ${page}, "row_per_page": 10}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const settlementManual = await axios.post(BaseURL + "/Settlement/GetHistorySettlementList", {data: dataParams}, {headers: headers})
            if (settlementManual.data.response_code === 200 && settlementManual.status === 200 && settlementManual.data.response_new_token === null) {
                settlementManual.data.response_data.results = settlementManual.data.response_data.results.map((obj) => ({...obj}))
                setPageNumberHistorySettleManual(settlementManual.data.response_data)
                setTotalPageHistorySettleManual(settlementManual.data.response_data.max_page)
                setDataListHistorySettleManual(settlementManual.data.response_data.results)
                setPendingListSettlement(false)
            } else if (settlementManual.data.response_code === 200 && settlementManual.status === 200 && settlementManual.data.response_new_token !== null) {
                setUserSession(settlementManual.data.response_new_token)
                settlementManual.data.response_data.results = settlementManual.data.response_data.results.map((obj) => ({...obj}))
                setPageNumberHistorySettleManual(settlementManual.data.response_data)
                setTotalPageHistorySettleManual(settlementManual.data.response_data.max_page)
                setDataListHistorySettleManual(settlementManual.data.response_data.results)
                setPendingListSettlement(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterListHistorySettle(periode, page, rowPerPage) {
        try {
            setPendingListSettlement(true)
            setIsFilterListHistorySettle(true)
            setActivePageHistorySettleManual(page)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"partner_id": "", "date_from": "${periode[0]}", "date_to": "${periode[1]}", "page": ${page}, "row_per_page": ${rowPerPage}}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const settlementManual = await axios.post(BaseURL + "/Settlement/GetHistorySettlementList", {data: dataParams}, {headers: headers})
            if (settlementManual.data.response_code === 200 && settlementManual.status === 200 && settlementManual.data.response_new_token === null) {
                settlementManual.data.response_data.results = settlementManual.data.response_data.results.map((obj) => ({...obj}))
                setPageNumberHistorySettleManual(settlementManual.data.response_data)
                setTotalPageHistorySettleManual(settlementManual.data.response_data.max_page)
                setDataListHistorySettleManual(settlementManual.data.response_data.results)
                setPendingListSettlement(false)
            } else if (settlementManual.data.response_code === 200 && settlementManual.status === 200 && settlementManual.data.response_new_token !== null) {
                setUserSession(settlementManual.data.response_new_token)
                settlementManual.data.response_data.results = settlementManual.data.response_data.results.map((obj) => ({...obj}))
                setPageNumberHistorySettleManual(settlementManual.data.response_data)
                setTotalPageHistorySettleManual(settlementManual.data.response_data.max_page)
                setDataListHistorySettleManual(settlementManual.data.response_data.results)
                setPendingListSettlement(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    function resetButtonHandle () {
        listHistorySettleManualHandler(currentDate, activePageHistorySettleManual)
        setDateRangeHistorySettlement([])
        setStateHistorySettlement(null)
    }

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

    useEffect(() => {
        if (!access_token) {
            // RouteTo("/login")
            history.push('/login');
        }
        if (user_role !== "100") {
            history.push('/404');
        }
        listHistorySettleManualHandler(currentDate, activePageHistorySettleManual)
    },[access_token, user_role])


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
                                <DateRangePicker
                                    value={stateHistorySettlement}
                                    ranges={column}
                                    onChange={(e) => pickDateHistorySettlement(e)}
                                    character=' - '
                                    cleanable={true}
                                    placement={'bottomStart'}
                                    size='lg'
                                    appearance="default"
                                    placeholder="Select Date Range"
                                    disabledDate={afterToday()}
                                    className='datePicker'
                                    locale={Locale}
                                    format="yyyy-MM-dd"
                                    style={{ width: "15rem" }}
                                    defaultCalendarValue={[new Date(`${oneMonthAgo}`), new Date(`${currentDate}`)]}
                                />
                            </Col>
                        </Row>

                        <Row className='mt-4'>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            className={dateRangeHistorySettlement.length !== 0 ? 'btn-ez-on' : 'btn-ez'}
                                            disabled={dateRangeHistorySettlement.length === 0}
                                            onClick={() => filterListHistorySettle(dateRangeHistorySettlement, activePageHistorySettleManual, 10)}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            className={dateRangeHistorySettlement.length !== 0 ? 'btn-reset' : 'btn-ez-reset'}
                                            disabled={dateRangeHistorySettlement.length === 0}
                                            onClick={() => resetButtonHandle()}
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
                                data={dataListHistorySettleManual}
                                customStyles={customStylesPartner}
                                progressPending={pendingListSettlement}
                                progressComponent={<CustomLoader />}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageHistorySettleManual}</div>
                            <Pagination
                                activePage={activePageHistorySettleManual}
                                itemsCountPerPage={pageNumberHistorySettleManual.row_per_page}
                                totalItemsCount={(pageNumberHistorySettleManual.row_per_page*pageNumberHistorySettleManual.max_page)}
                                pageRangeDisplayed={5}
                                itemClass="page-item"
                                linkClass="page-link"
                                onChange={handlePageChangeListHistorySettle}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettlementAdminManual