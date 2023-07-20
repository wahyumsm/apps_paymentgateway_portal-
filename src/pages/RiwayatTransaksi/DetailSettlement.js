import React, { useEffect, useState } from 'react'
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
// import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DataTable, { defaultThemes } from 'react-data-table-component';
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { Link, useHistory, useParams } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import axios from 'axios';
import * as XLSX from "xlsx"
import Pagination from "react-js-pagination";

function DetailSettlement() {

    const access_token = getToken();
    const user_role = getRole();
    const history = useHistory()
    const { settlementId, bankCode, settlementType, eWalletCode } = useParams();
    const [dataSettlement, setDataSettlement] = useState([])
    const [pendingSettlement, setPendingSettlement] = useState(false)
    const [totalPageDetailSettlement, setTotalPageDetailSettlement] = useState(0)
    const [activePageDetailSettlement, setActivePageDetailSettlement] = useState(1)
    const [pageNumberDetailSettlement, setPageNumberDetailSettlement] = useState({})
    // const [inputHandle, setInputHandle] = useState({
    //     idTransaksiSettlement: "",
    //     namaPartnerSettlement: "",
    //     statusSettlement: [],
    //     periodeSettlement: 0,
    // })

    async function getDetailSettlement(settlementId, currentPage, codeBank, typeSettlement, codeEWallet) {
        try {
            setPendingSettlement(true)
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{ "settlement_id": ${settlementId}, "settlement_type": ${typeSettlement}, "bank_code": "${codeBank === '0' ? "" : codeBank}", "ewallet_code": "${codeEWallet.length === 0 ? "" : codeEWallet}", "page": ${(currentPage === undefined || currentPage < 1) ? 1 : currentPage}, "row_per_page": 10 }`);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const detailsettlement = await axios.post(BaseURL + "/Report/GetSettlementTransactionByID", { data: dataParams }, { headers: headers })
            // console.log(detailsettlement, 'detailsettlement');
            if (detailsettlement.status === 200 && detailsettlement.data.response_code === 200 && detailsettlement.data.response_new_token.length === 0) {
                detailsettlement.data.response_data.results = detailsettlement.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberDetailSettlement(detailsettlement.data.response_data)
                setTotalPageDetailSettlement(detailsettlement.data.response_data.max_page)
                setDataSettlement(detailsettlement.data.response_data.results)
                setPendingSettlement(false)
            } else if (detailsettlement.status === 200 && detailsettlement.data.response_code === 200 && detailsettlement.data.response_new_token.length !== 0) {
                detailsettlement.data.response_data.results = detailsettlement.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setUserSession(detailsettlement.data.response_new_token)
                setPageNumberDetailSettlement(detailsettlement.data.response_data)
                setTotalPageDetailSettlement(detailsettlement.data.response_data.max_page)
                setDataSettlement(detailsettlement.data.response_data.results)
                setPendingSettlement(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function handlePageChangeDetailSettlement(page) {
        setActivePageDetailSettlement(page)
        getDetailSettlement(settlementId, page, bankCode, settlementType, eWalletCode)
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        // if (user_role === "102") {
        //     history.push('/404');
        // }
        getDetailSettlement(settlementId, 1, bankCode, settlementType, eWalletCode)
    }, [settlementId])
    
    async function ExportReportDetailSettlementHandler(settlementId, userRole, codeBank, typeSettlement, codeEWallet) {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{ "settlement_id": ${settlementId}, "settlement_type": ${typeSettlement}, "bank_code": "${codeBank === '0' ? "" : codeBank}", "ewallet_code": "${codeEWallet.length === 0 ? "" : codeEWallet}", "page": 1, "row_per_page": 1000000 }`);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataDetailSettlement = await axios.post(BaseURL + "/Report/GetSettlementTransactionByID", { data: dataParams }, { headers: headers })
            if (dataDetailSettlement.status === 200 && dataDetailSettlement.data.response_code === 200 && dataDetailSettlement.data.response_new_token.length === 0) {
                const data = dataDetailSettlement.data.response_data.results
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    if (userRole === '102') {
                        if (Number(settlementType) === 105) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvatrans_trx_id, Waktu: data[i].tvatrans_crtdt_format, "Partner Trans ID": data[i].partner_trans_id, "Channel eWallet": data[i].mbank_name, "Nominal Settlement": data[i].tvatrans_amount, Status: data[i].mstatus_name_ind })
                        } else {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvatrans_trx_id, Waktu: data[i].tvatrans_crtdt_format, "Partner Trans ID": data[i].partner_trans_id, "Nama Bank": data[i].mbank_name, "No VA": data[i].tvatrans_va_number, "Nominal Settlement": data[i].tvatrans_amount, Status: data[i].mstatus_name_ind })
                        }
                    } else {
                        if (Number(settlementType) === 105) {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvatrans_trx_id, Waktu: data[i].tvatrans_crtdt_format, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Channel eWallet": data[i].mbank_name, "Nominal Transaksi": data[i].tvatrans_amount, Status: data[i].mstatus_name_ind })
                        } else {
                            dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvatrans_trx_id, Waktu: data[i].tvatrans_crtdt_format, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nama Bank": data[i].mbank_name, "No VA": data[i].tvatrans_va_number, "Nominal Settlement": data[i].tvatrans_amount, "Jasa Layanan": data[i].tvatrans_partner_fee, "PPN atas Jasa Layanan": data[i].tvatrans_fee_tax, "Reimbursement by VA": data[i].tvatrans_bank_fee, Status: data[i].mstatus_name_ind })
                        }
                    }
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Detail Settlement.xlsx");
            } else if (dataDetailSettlement.status === 200 && dataDetailSettlement.data.response_code === 200 && dataDetailSettlement.data.response_new_token.length !== 0) {
                setUserSession(dataDetailSettlement.data.response_new_token)
                const data = dataDetailSettlement.data.response_data.results
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    if (userRole === '102') {
                        dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvatrans_trx_id, Waktu: data[i].tvatrans_crtdt_format, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nama Bank": data[i].mbank_name, "No VA": data[i].tvatrans_va_number, "Nominal Settlement": data[i].tvatrans_amount, Status: data[i].mstatus_name_ind })
                    } else {
                        dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tvatrans_trx_id, Waktu: data[i].tvatrans_crtdt_format, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].mpartner_name, "Nama Bank": data[i].mbank_name, "No VA": data[i].tvatrans_va_number, "Nominal Settlement": data[i].tvatrans_amount, "Jasa Layanan": data[i].tvatrans_partner_fee, "PPN atas Jasa Layanan": data[i].tvatrans_fee_tax, "Reimbursement by VA": data[i].tvatrans_bank_fee, Status: data[i].mstatus_name_ind })
                    }
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Detail Settlement.xlsx");
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }
    
    const columnsSettlEWallet = [
        {
            name: 'No',
            selector: row => row.number,
            width: "3%",
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tvatrans_trx_id,
            width: "120px",
            wrap: true,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
            // sortable: true
        },
        {
            name: 'Waktu',
            selector: row => row.tvatrans_crtdt_format,
            // sortable: true,          
            width: "120px",
            wrap: true
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            // sortable: true,          
            wrap: true,
            width: "150px",
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            // sortable: true
            wrap: true,
            width: "150px",
        },
        {
            name: 'Channel eWallet',
            selector: row => row.mbank_name,
            // sortable: true,
            // width: "175px"
            style: { display: "flex", flexDirection: "row", justifyContent: "center", },
            width: "160px",
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.tvatrans_amount),
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", },
            width: "173px"
        },
        {
            name: 'Biaya eWallet',
            selector: row => convertToRupiah(row.tvatrans_partner_fee),
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", },
            width: "140px"
        },
        {
            name: 'Biaya Pajak',
            selector: row => convertToRupiah(row.tvatrans_fee_tax),
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", },
            // width: "173px"
        },
        {
            name: 'Total Biaya',
            selector: row => convertToRupiah(row.tvatrans_amount - (row.tvatrans_partner_fee + row.tvatrans_fee_tax)),
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", },
            width: "173px"
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
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Nama Bank',
            selector: row => row.mbank_name,
            width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'No VA',
            selector: row => row.tvatrans_va_number,
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
            name: 'Jasa Layanan',
            selector: row => convertToRupiah(row.tvatrans_partner_fee),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'PPN atas Jasa Layanan',
            selector: row => convertToRupiah(row.tvatrans_fee_tax),
            // sortable: true,
            width: "224px",
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "0px 16px" }}>{ convertToRupiah(row.tvasettl_amount) }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Reimbursement by VA',
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
    
    const columnsSettlPartnerEWallet = [
        {
            name: 'No',
            selector: row => row.number,
            width: "5%",
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tvatrans_trx_id,
            width: "120px",
            wrap: true,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
            // sortable: true
        },
        {
            name: 'Waktu',
            selector: row => row.tvatrans_crtdt_format,
            // sortable: true,          
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-start", },
            width: "120px",
            wrap: true
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            // sortable: true,          
            wrap: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-start"},
            // width: "150px",
        },
        {
            name: 'Channel eWallet',
            selector: row => row.mbank_name,
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", },
            // width: "175px"
            width: "160px",
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.tvatrans_amount),
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", },
            width: "173px"
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

    const columnsSettlPartner = [
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
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'Nama Bank',
            selector: row => row.mbank_name,
            width: "224px",
            // style: { backgroundColor: 'rgba(187, 204, 221, 1)', }
            // sortable: true,
        },
        {
            name: 'No VA',
            selector: row => row.tvatrans_va_number,
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
                // '&:not(:last-of-type)': {
                //     borderRightStyle: 'solid',
                //     borderRightWidth: '1px',
                //     borderRightColor: defaultThemes.default.divider.default,
                // },
            },
        },
        // cells: {
        //     style: {
        //         '&:not(:last-of-type)': {
        //             borderRightStyle: 'solid',
        //             borderRightWidth: '1px',
        //             borderRightColor: defaultThemes.default.divider.default,
        //             borderleftStyle: 'solid',
        //             borderleftWidth: '1px',
        //             borderleftColor: defaultThemes.default.divider.default,
        //         },
        //     },
        // },
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
            {
                user_role === '102' ?
                <span className='breadcrumbs-span'><Link to={"/Settlement/riwayat-settlement"}>Riwayat Settlement</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Detail Settlement</span> :
                <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;<Link to={"/Settlement/riwayat-settlement"}>Settlement</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Detail Settlement</span>
            }
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
                            <Link onClick={() => ExportReportDetailSettlementHandler(settlementId, user_role, bankCode, settlementType, eWalletCode)} className="export-span">Export</Link>
                        </div>
                    }
                    <div className="div-table mt-4 pb-4">
                        <DataTable
                            columns={(user_role === '102') ? (Number(settlementType) === 105 ? columnsSettlPartnerEWallet : columnsSettlPartner) : (Number(settlementType) === 105 ? columnsSettlEWallet : columnsSettl)}
                            data={dataSettlement}
                            customStyles={customStyles}
                            progressPending={pendingSettlement}
                            progressComponent={<CustomLoader />}
                            dense
                            // noDataComponent={<div style={{ marginBottom: 10 }}>No Data</div>}
                            // pagination
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                    <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageDetailSettlement}</div>
                        <Pagination
                            activePage={activePageDetailSettlement}
                            itemsCountPerPage={pageNumberDetailSettlement.row_per_page}
                            totalItemsCount={(pageNumberDetailSettlement.row_per_page*pageNumberDetailSettlement.max_page)}
                            pageRangeDisplayed={5}
                            itemClass="page-item"
                            linkClass="page-link"
                            onChange={handlePageChangeDetailSettlement}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default DetailSettlement