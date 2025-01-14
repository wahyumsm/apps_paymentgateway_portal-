import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Form } from '@themesberg/react-bootstrap'
import { BaseURL, errorCatch, getRole, getToken, setUserSession, CustomLoader } from '../../function/helpers'
import encryptData from '../../function/encryptData'
import axios from 'axios'
import Pagination from 'react-js-pagination'

const ProsesSettlementManual = () => {

    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const [dataListProsesSettlementManual, setDataListProsesSettlementManual] = useState([])
    const [pageNumberProsesSettlementManual, setPageNumberProsesSettlementManual] = useState({})
    const [totalPageProsesSettlementManual, setTotalPageProsesSettlementManual] = useState(0)
    const [activePageProsesSettlementManual, setActivePageProsesSettlementManual] = useState(1)
    const [pendingListSettlementManual, setPendingListSettlementManual] = useState(false)
    const currentDate = new Date().toISOString().split('T')[0]

    const [dataExclude, setDataExclude] = useState([])

    const selectItemPartner = useCallback ((e, id, typeId, number, listDataSettleManual, dataExc) => {
        let allData = []
        let obj = {}

        if (e.target.checked) {
            if (id === "") {
                listDataSettleManual.forEach(element => {
                    obj.subpartner_id = element.tvatrans_sub_partner_id
                    obj.mpaytype_id = element.mpaytype_id
                    obj.number = element.number
                    allData.push(obj)
                    obj = {}
                });
                setDataExclude(allData)
            } else {
                // console.log(e.target.checked, "e checked");
                obj.subpartner_id = id
                obj.mpaytype_id = typeId
                obj.number = number
                allData.push(obj)
                // console.log(dataExc, 'dataExc in funct');
                setDataExclude([...dataExc, obj])
            }
        } else {
            if (id === "") {
                setDataExclude([])
            } else {
                const deletedData = dataExc.filter(item => item.number !== number)
                // console.log(deletedData, 'deletedData');
                setDataExclude(deletedData)
            }
        }
        // console.log(allData, 'allData');


    }, [])

    function handlePageChangeGetListProsesSettleManual(page) {
        setActivePageProsesSettlementManual(page)
        getListSettleManualHandler(currentDate, page)
    }

    async function getListSettleManualHandler(date, page) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"partner_id": "", "date_from": "${date}", "date_to": "${date}", "page": ${page}, "row_per_page": 10}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const settlementManual = await axios.post(BaseURL + "/Settlement/GetSettlementDataList", {data: dataParams}, {headers: headers})
            if (settlementManual.data.response_code === 200 && settlementManual.status === 200 && settlementManual.data.response_new_token === null) {
                settlementManual.data.response_data.results = settlementManual.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1 }))
                setPageNumberProsesSettlementManual(settlementManual.data.response_data)
                setTotalPageProsesSettlementManual(settlementManual.data.response_data.max_page)
                setDataListProsesSettlementManual(settlementManual.data.response_data.results)
                setPendingListSettlementManual(false)
            } else if (settlementManual.data.response_code === 200 && settlementManual.status === 200 && settlementManual.data.response_new_token !== null) {
                setUserSession(settlementManual.data.response_new_token)
                settlementManual.data.response_data.results = settlementManual.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1 }))
                setPageNumberProsesSettlementManual(settlementManual.data.response_data)
                setTotalPageProsesSettlementManual(settlementManual.data.response_data.max_page)
                setDataListProsesSettlementManual(settlementManual.data.response_data.results)
                setPendingListSettlementManual(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function prosesSettlementManual(dataExcludeSettle) {
        try {
            setPendingListSettlementManual(true)
            let partnerId = []
            let payTypeId = []
            dataExcludeSettle.forEach((item) => {
                partnerId.push(item.subpartner_id)
                payTypeId.push(item.mpaytype_id)
            })
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"subpartner_id": ${JSON.stringify(partnerId)}, "mpaytype_id": ${JSON.stringify(payTypeId)}}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const settlementManual = await axios.post(BaseURL + "/Settlement/InsertManualSettlement", {data: dataParams}, {headers: headers})
            if (settlementManual.data.response_code === 200 && settlementManual.status === 200 && settlementManual.data.response_new_token === null) {
                if (settlementManual.data.response_data[0].error_id === "0001") {
                    alert(settlementManual.data.response_data[0].error_text)
                    setPendingListSettlementManual(false)
                    history.push("/settlement/exclude-settlement")
                } else {
                    setPendingListSettlementManual(false)
                    history.push("/settlement/exclude-settlement")
                }
            } else if (settlementManual.data.response_code === 200 && settlementManual.status === 200 && settlementManual.data.response_new_token !== null) {
                setUserSession(settlementManual.data.response_new_token)
                if (settlementManual.data.response_data[0].error_id === "0001") {
                    alert(settlementManual.data.response_data[0].error_text)
                    setPendingListSettlementManual(false)
                    history.push("/settlement/exclude-settlement")
                } else {
                    setPendingListSettlementManual(false)
                    history.push("/settlement/exclude-settlement")
                }
            }
        } catch (error) {
            // console.log(error);
            if (error.response.status === 500 && error.response.data.response_code === 400) {
                alert(error.response.data.response_message)
                setPendingListSettlementManual(false)
                history.push("/settlement/exclude-settlement")
            }
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        if (!access_token) {
            // RouteTo("/login")
            history.push('/login');
        }
        if (user_role !== "100") {
            history.push('/404');
        }
        getListSettleManualHandler(currentDate, activePageProsesSettlementManual)
    }, [access_token, user_role])


    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link style={{ cursor: "pointer" }} to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Exclude Settlement Manual</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4" style={{fontWeight: 700, fontSize: 18, fontFamily: "Exo", color: "#383838"}}>Exclude Settlement Manual</h2>
            </div>
            <div className='base-content mt-3'>
                <div className='div-table' style={{ overflowX: 'auto', maxWidth: 'inherit' }}>
                    <table
                        className="table"
                        id="tableInvoice"
                        hover
                    >
                        <thead style={{ backgroundColor: "#F2F2F2", color: "rgba(0,0,0,0.87)" }}>
                            <tr
                                className='ms-3'
                            >
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>
                                    <Form.Check
                                        type='checkbox'
                                        name={"all"}
                                        value={"all"}
                                        onChange={(e) => {
                                            selectItemPartner(e, "", 0, 0, dataListProsesSettlementManual, dataExclude)
                                        }}
                                        checked={
                                            dataListProsesSettlementManual.length === dataExclude.length ? true : dataExclude.includes(dataListProsesSettlementManual)
                                        }
                                    />
                                </th>
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Partner Name</th>
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Bank / E-Money</th>
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Count Trx</th>
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Amount Trx</th>
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Amount Fee</th>
                                <th style={{ fontWeight: "bold", fontSize: "14px", textTransform: 'unset', fontFamily: 'Exo' }}>Amount Settlement</th>
                            </tr>
                        </thead>
                        {
                            !pendingListSettlementManual && (
                                <tbody>
                                    {
                                        dataListProsesSettlementManual.map((item, idx) => {
                                            // console.log(dataListProsesSettlementManual.length === dataExclude.length, "dataListProsesSettlementManual.length === dataExclude.length");
                                            // console.log(dataExclude.map(items => items.number).includes(item.number), "dataExclude.map(items => items.number).includes(item.number)");
                                            return (
                                                <tr key={idx}>
                                                    <td className='ps-3'>
                                                        <Form.Check
                                                            type='checkbox'
                                                            name={item.mpartner_name}
                                                            value={`${item.tvatrans_sub_partner_id}`}
                                                            onChange={(e) => {
                                                                selectItemPartner(e, item.tvatrans_sub_partner_id, item.mpaytype_id, item.number, dataListProsesSettlementManual, dataExclude)
                                                            }}
                                                            checked={
                                                                dataListProsesSettlementManual.length === dataExclude.length ? true : (dataExclude.map(items => items.number).includes(item.number))
                                                            }
                                                            // checked={

                                                            // }
                                                        />
                                                    </td>
                                                    <td className='ps-3'>
                                                        {item.mpartner_name}
                                                    </td>
                                                    <td className='ps-3'>
                                                        {item.mbank_name}
                                                    </td>
                                                    <td className='ps-3'>
                                                        {item.total_trx}
                                                    </td>
                                                    <td className='ps-3'>
                                                        Rp. {item.sum_trx}
                                                    </td>
                                                    <td className='ps-3'>
                                                        Rp. {item.sum_fee}
                                                    </td>
                                                    <td className='ps-3'>
                                                        Rp. {item.sum_settlement}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            )
                        }
                    </table>
                    {pendingListSettlementManual && (<div className='text-center'><CustomLoader /></div>)}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                <div className='pb-4' style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageProsesSettlementManual}</div>
                    <Pagination
                        activePage={activePageProsesSettlementManual}
                        itemsCountPerPage={pageNumberProsesSettlementManual.row_per_page}
                        totalItemsCount={(pageNumberProsesSettlementManual.row_per_page*pageNumberProsesSettlementManual.max_page)}
                        pageRangeDisplayed={5}
                        itemClass="page-item"
                        linkClass="page-link"
                        onChange={handlePageChangeGetListProsesSettleManual}
                    />
                </div>
            </div>

            <div
                className="mb-5 mt-3"
                style={{ display: "flex", justifyContent: "end" }}
            >
                <button
                    onClick={() => prosesSettlementManual(dataExclude)}
                    className={dataExclude.length !== 0 ? 'proses-settle-manual' : 'proses-settle-manual-disabled'}
                    disabled={dataExclude.length === 0}
                >
                    Proses Settlement Manual
                </button>
            </div>
        </div>
    )
}

export default ProsesSettlementManual