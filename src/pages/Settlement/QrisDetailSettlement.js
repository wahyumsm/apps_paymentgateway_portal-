import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import DataTable, { defaultThemes } from 'react-data-table-component';
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, language, setUserSession, CustomLoader } from '../../function/helpers';
import { Link, useHistory, useParams } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import axios from 'axios';
import * as XLSX from "xlsx"
import Pagination from "react-js-pagination";
import { eng } from '../../components/Language';

function QrisDetailSettlement() {

    const access_token = getToken();
    const user_role = getRole();
    const history = useHistory()
    const { settlementCode, merchantId, brandId, outletId } = useParams();
    const [dataQRISDetailSettlement, setDataQRISDetailSettlement] = useState([])
    const [totalPageQRISDetailSettlement, setTotalPageQRISDetailSettlement] = useState(0)
    const [activePageQRISDetailSettlement, setActivePageQRISDetailSettlement] = useState(1)
    const [pageNumberQRISDetailSettlement, setPageNumberQRISDetailSettlement] = useState({})
    const [pendingSettlementQRISDetailSettlement, setPendingSettlementQRISDetailSettlement] = useState(false)

    function handlePageChangeDetailSettlement(page) {
        setActivePageQRISDetailSettlement(page)
        getDetailSettlement(page, settlementCode, merchantId, brandId, outletId, language === null ? 'EN' : language.flagName)
    }

    async function getDetailSettlement(currentPage, codeSettlement, idMerchant, idBrand, idOutlet, lang) {
        try {
            setPendingSettlementQRISDetailSettlement(true)
            const auth = 'Bearer ' + access_token;
            const dataParams = encryptData(`{ "settl_id": "${codeSettlement}", "merchant_nou": ${idMerchant}, "brand_nou": ${idBrand}, "store_nou": ${idOutlet}, "page": ${currentPage}, "row_per_page": 10 }`);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept-Language' : user_role === "102" ? lang : "ID"
            }
            const detailsettlement = await axios.post(BaseURL + "/QRIS/TransactionReportByID", { data: dataParams }, { headers: headers })
            // console.log(detailsettlement, 'detailsettlement');
            if (detailsettlement.status === 200 && detailsettlement.data.response_code === 200 && detailsettlement.data.response_new_token === null) {
                // detailsettlement.data.response_data.results = detailsettlement.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberQRISDetailSettlement(detailsettlement.data.response_data)
                setTotalPageQRISDetailSettlement(detailsettlement.data.response_data.max_page)
                setDataQRISDetailSettlement(detailsettlement.data.response_data.results)
                setPendingSettlementQRISDetailSettlement(false)
            } else if (detailsettlement.status === 200 && detailsettlement.data.response_code === 200 && detailsettlement.data.response_new_token !== null) {
                setUserSession(detailsettlement.data.response_new_token)
                // detailsettlement.data.response_data.results = detailsettlement.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberQRISDetailSettlement(detailsettlement.data.response_data)
                setTotalPageQRISDetailSettlement(detailsettlement.data.response_data.max_page)
                setDataQRISDetailSettlement(detailsettlement.data.response_data.results)
                setPendingSettlementQRISDetailSettlement(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function ExportReportDetailSettlementHandler(codeSettlement, idMerchant, idBrand, idOutlet, lang) {
        try {
            const auth = 'Bearer ' + access_token;
            const dataParams = encryptData(`{ "settl_id": "${codeSettlement}", "merchant_nou": ${idMerchant}, "brand_nou": ${idBrand}, "store_nou": ${idOutlet}, "page": 1, "row_per_page": 1000000 }`);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Accept-Language' : user_role === "102" ? lang : "ID"
            }
            const detailsettlement = await axios.post(BaseURL + "/QRIS/TransactionReportByID", { data: dataParams }, { headers: headers })
            // console.log(detailsettlement, 'detailsettlement');
            if (detailsettlement.status === 200 && detailsettlement.data.response_code === 200 && detailsettlement.data.response_new_token === null) {
                const data = detailsettlement.data.response_data.results
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "No. Referensi": data[i].reference_label !== null ? data[i].reference_label : "-", RRN: data[i].RRN !== null ? data[i].RRN : "-", "Channel Pembayaran": data[i].paymenttype_name !== null ? data[i].paymenttype_name : "-", "Waktu Generate QR": data[i].generate_qris_date !== null ? data[i].generate_qris_date : "-", "Waktu Pembayaran": data[i].trans_date, "Nama Grup": data[i].merchant_name !== null ? data[i].merchant_name : "-", "Nama Brand": data[i].outlet_name !== null ? data[i].outlet_name : "-", "Nama Outlet": data[i].store_name !== null ? data[i].store_name : "-", "Nama Kasir": data[i].cashier_name !== null ? data[i].cashier_name : "-", "ID Kasir": data[i].mterminal_name !== null ? data[i].mterminal_name : "-", "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, "Status": data[i].status_name })
                    // dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "No. Referensi": data[i].reference_label, RRN: data[i].RRN, "Waktu": data[i].trans_date, "Nama Grup": data[i].merchant_name, "Nama Brand": data[i].outlet_name, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, "Status": data[i].status_name })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Riwayat Details Settlement QRIS.xlsx");
            } else if (detailsettlement.status === 200 && detailsettlement.data.response_code === 200 && detailsettlement.data.response_new_token !== null) {
                setUserSession(detailsettlement.data.response_new_token)
                const data = detailsettlement.data.response_data.results
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "No. Referensi": data[i].reference_label !== null ? data[i].reference_label : "-", RRN: data[i].RRN !== null ? data[i].RRN : "-", "Channel Pembayaran": data[i].paymenttype_name !== null ? data[i].paymenttype_name : "-", "Waktu Generate QR": data[i].generate_qris_date !== null ? data[i].generate_qris_date : "-", "Waktu Pembayaran": data[i].trans_date, "Nama Grup": data[i].merchant_name !== null ? data[i].merchant_name : "-", "Nama Brand": data[i].outlet_name !== null ? data[i].outlet_name : "-", "Nama Outlet": data[i].store_name !== null ? data[i].store_name : "-", "Nama Kasir": data[i].cashier_name !== null ? data[i].cashier_name : "-", "ID Kasir": data[i].mterminal_name !== null ? data[i].mterminal_name : "-", "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, "Status": data[i].status_name })
                    // dataExcel.push({ No: i + 1, "ID Transaksi": data[i].transaction_code, "No. Referensi": data[i].reference_label, RRN: data[i].RRN, "Waktu": data[i].trans_date, "Nama Grup": data[i].merchant_name, "Nama Brand": data[i].outlet_name, "Nama Outlet": data[i].store_name, "Nama Kasir": data[i].cashier_name, "ID Kasir": data[i].mterminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].MDR, "Pendapatan": data[i].net_amount, "Status": data[i].status_name })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Riwayat Details Settlement QRIS.xlsx");
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        getDetailSettlement(activePageQRISDetailSettlement, settlementCode, merchantId, brandId, outletId, language === null ? 'EN' : language.flagName)
    }, [])

    const columnsSettl = [
        {
            name: 'No',
            selector: row => row.No,
            wrap: true,
            width: "60px",
            // style: { justifyContent: "center", }
        },
        {
            name: 'ID Transaksi',
            selector: row => row.transaction_code,
            width: "170px",
            wrap: true
        },
        {
            name: 'No. Referensi',
            selector: row => row.reference_label !== null ? row.reference_label : "-",
            wrap: true,
            width: "150px"
        },
        {
            name: 'RRN',
            selector: row => row.RRN !== null ? row.RRN : "-",
            width: "150px"
        },
        {
            name: 'Channel Pembayaran',
            selector: row => row.paymenttype_name !== null ? row.paymenttype_name : "-",
            width: "200px"
        },
        {
            name: 'Waktu Generate QR',
            selector: row => row.generate_qris_date !== null ? row.generate_qris_date : "-",
            width: "200px"
        },
        {
            name: 'Waktu Pembayaran',
            selector: row => row.trans_date,
            width: "200px"
        },
        // {
        //     name: 'Jenis Usaha',
        //     selector: row => row.business_type,
        //     width: "150px"
        // },
        {
            name: 'Nama Grup',
            selector: row => row.merchant_name !== null ? row.merchant_name : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.outlet_name !== null ? row.outlet_name : "-",
            wrap: true,
            width: "200px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.store_name !== null ? row.store_name : "-",
            wrap: true,
            width: "150px"
        },
        {
            name: 'Nama Kasir',
            selector: row => row.cashier_name !== null ? row.cashier_name : "-",
            wrap: true,
            width: "200px"
        },
        {
            name: 'ID Kasir',
            selector: row => row.mterminal_name !== null ? row.mterminal_name : "-",
            width: "100px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.amount, true, 2),
            width: "180px"
        },
        {
            name: 'Potongan MDR',
            selector: row => convertToRupiah(row.MDR, true, 2),
            width: "150px"
        },
        {
            name: 'Pendapatan',
            selector: row => convertToRupiah(row.net_amount, true, 2),
            width: "150px"
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            style: { display: "flex", justifyContent: "center", alignItem: "center", padding: "6px 10px", margin: "6px 20px", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 9 || row.status_id === 5 || row.status_id === 3,
                    style: { background: "#FEF4E9", color: "#F79421"}
                },
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86"}
                },
                {
                    when: row => row.status_id === 7 || row.status_id === 6 || row.status_id === 4,
                    style: { background: "#FDEAEA", color: "#EE2E2C"}
                },
            ]
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

    return (
        <div className="content-page mt-6">
            {
                user_role === '102' ?
                <span className='breadcrumbs-span'>Settlement &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;<Link to={"/settlement/settlement-qris"}>QRIS</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;{language === null ? eng.detailSettlement : language.detailSettlement}</span> :
                <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;<Link to={"/settlement/settlement-qris"}>Settlement QRIS</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Detail Settlement QRIS</span>
            }
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4" style={{fontWeight: 700, fontSize: 18, fontFamily: "Exo", color: "#383838"}}>{user_role === "102" ? (language === null ? eng.detailSettlement : language.detailSettlement) : `Detail Settlement`}</h2>
            </div>
            <div className='main-content'>
                <div className='riwayat-dana-masuk-div mt-4'>
                    <div className='base-content mt-3'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>{user_role === "102" ? (language === null ? eng.detailSettlement : language.detailSettlement) : `Detail Settlement`}</span>
                        {
                            dataQRISDetailSettlement.length !== 0 &&
                            <div style={{ marginBottom: 30 }}>
                                <Link onClick={() => ExportReportDetailSettlementHandler(settlementCode, merchantId, brandId, outletId, language === null ? 'EN' : language.flagName)} className="export-span">{user_role === "102" ? (language === null ? eng.export : language.export) : "Export"}</Link>
                            </div>
                        }
                        <div className="div-table mt-4 pb-4">
                            <DataTable
                                columns={columnsSettl}
                                data={dataQRISDetailSettlement}
                                customStyles={customStyles}
                                progressPending={pendingSettlementQRISDetailSettlement}
                                progressComponent={<CustomLoader />}
                                dense
                                noDataComponent={language === null ? eng.tidakAdaData : language.tidakAdaData}
                                // pagination
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                        <div style={{ marginRight: 10, marginTop: 10 }}>{user_role === "102" ? (language === null ? eng.totalHalaman : language.totalHalaman) : "Total Page"} : {totalPageQRISDetailSettlement}</div>
                            <Pagination
                                activePage={activePageQRISDetailSettlement}
                                itemsCountPerPage={pageNumberQRISDetailSettlement.row_per_page}
                                totalItemsCount={(pageNumberQRISDetailSettlement.row_per_page*pageNumberQRISDetailSettlement.max_page)}
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

export default QrisDetailSettlement