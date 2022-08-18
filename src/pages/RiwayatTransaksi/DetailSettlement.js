import React, { useEffect, useState } from 'react'
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import DataTable, { defaultThemes } from 'react-data-table-component';
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { Link, useHistory, useParams } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import axios from 'axios';
import * as XLSX from "xlsx"

function DetailSettlement() {

    const access_token = getToken();
    const user_role = getRole();
    const history = useHistory()
    const { settlementId } = useParams();
    const [dataSettlement, setDataSettlement] = useState([])
    const [pendingSettlement, setPendingSettlement] = useState(false)

    async function getDetailSettlement(settlementId) {
        try {
            setPendingSettlement(true)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{ "tvasettl_id": ${settlementId}, "page":1, "row_per_page":10 }`);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const detailsettlement = await axios.post(BaseURL + "/Report/GetSettlementTransactionByID", { data: dataParams }, { headers: headers })
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

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        if (user_role === "102") {
            history.push('/404');
        }
        getDetailSettlement(settlementId)
    }, [settlementId])
    
    function ExportReportDetailSettlementHandler(dataSettlement) {
        const data = dataSettlement
        let dataExcel = []
        for (let i = 0; i < data.length; i++) {
            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvatrans_trx_id, Waktu: data[i].tvatrans_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nominal Settlement": data[i].tvatrans_amount, "Fee Transaksi": data[i].tvatrans_partner_fee, "Fee Tax Transaksi": data[i].tvatrans_fee_tax, "Fee Bank": data[i].tvatrans_bank_fee, Status: data[i].mstatus_name_ind })
        }
        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
        let workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
        XLSX.writeFile(workBook, "Detail Settlement.xlsx");
    }
    
    
    const columnsSettl = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tvatrans_trx_id,
            // sortable: true
            width: "224px",
        },
        {
            name: 'Waktu',
            selector: row => row.tvatrans_crtdt_format,
            width: "150px",
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "224px",
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.tvatrans_amount),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Fee Transaksi',
            selector: row => convertToRupiah(row.tvatrans_partner_fee),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Fee Tax Transaksi',
            selector: row => convertToRupiah(row.tvatrans_fee_tax),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Fee Bank',
            selector: row => convertToRupiah(row.tvatrans_bank_fee),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name_ind,
            width: "155px",
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
        <div className='main-content'>
            <div className='riwayat-dana-masuk-div mt-4'>
                <div className='base-content mt-3'>
                    <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Detail Settlement</span>
                    {
                        dataSettlement.length !== 0 &&  
                        <div style={{ marginBottom: 30 }}>
                            <Link onClick={() => ExportReportDetailSettlementHandler(dataSettlement)} className="export-span">Export</Link>
                        </div>
                    }
                    <div className="div-table mt-4 pb-4">
                        <DataTable
                            columns={columnsSettl}
                            data={dataSettlement}
                            customStyles={customStyles}
                            progressPending={pendingSettlement}
                            progressComponent={<CustomLoader />}
                            dense
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default DetailSettlement