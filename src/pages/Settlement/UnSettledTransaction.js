import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import ReactSelect, { components } from 'react-select'
import { BaseURL, CustomLoader, convertToRupiah, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers';
import axios from 'axios';
import encryptData from '../../function/encryptData';
import DataTable, { defaultThemes } from 'react-data-table-component';
import Pagination from 'react-js-pagination';
import { Col, Form, Row } from '@themesberg/react-bootstrap';
import * as XLSX from "xlsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function UnSettledTransaction() {

    const user_role = getRole();
    const history = useHistory()
    const [listBank, setListBank] = useState([])
    const [listEWallet, setListEWallet] = useState([])
    const [dataListPartner, setDataListPartner] = useState([])
    const [selectedBankSettlement, setSelectedBankSettlement] = useState([])
    const [selectedEWalletSettlement, setSelectedEWalletSettlement] = useState([])
    const [selectedPartnerSettlement, setSelectedPartnerSettlement] = useState([])
    const [transactionType, setTransactionType] = useState(0)
    const [totalSettlement, setTotalSettlement] = useState(0)
    const [listUnsettledTransaction, setListUnsettledTransaction] = useState([])
    const [pendingSettlement, setPendingSettlement] = useState(false)
    const [isLoadingExport, setIsLoadingExport] = useState(false)
    // const [totalPageSettlement, setTotalPageSettlement] = useState(0)
    // const [activePageSettlement, setActivePageSettlement] = useState(1)
    // const [pageNumberSettlement, setPageNumberSettlement] = useState({})

    function toDashboard() {
        history.push("/");
    }

    function handleChange(e) {
        if (Number(e.target.value) !== 105) {
            setSelectedEWalletSettlement([])
            setTransactionType(e.target.value)
        } else {
            setSelectedBankSettlement([])
            setTransactionType(e.target.value)
        }
    }

    function resetButtonHandle() {
        setSelectedBankSettlement([])
        setSelectedEWalletSettlement([])
        setSelectedPartnerSettlement([])
        setTransactionType(0)
    }

    async function unsettledTransactionList(partnerName, fiturId, bankCode, eWalletCode) {
        try {
            setPendingSettlement(true)
            let paymentCode = ""
            if (bankCode.length !== 0 && eWalletCode.length === 0) {
                paymentCode = bankCode[0].value
            } else if (bankCode.length === 0 && eWalletCode.length !== 0) {
                paymentCode = eWalletCode[0].value
            } else {
                paymentCode = ""
            }
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "partner_id": "${partnerName.length !== 0 ? partnerName[0].value : ""}", "fitur_id": ${fiturId}, "payment_code": "${paymentCode}" }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listUnsettled = await axios.post(BaseURL + "/Settlement/GetUnsettledTransaction", { data: dataParams }, { headers: headers })
            // console.log(listUnsettled, "data settlement");
            if (listUnsettled.status === 200 && listUnsettled.data.response_code === 200 && listUnsettled.data.response_new_token === null) {
                let totalUnsettled = 0
                listUnsettled.data.response_data.results.forEach(item => totalUnsettled = totalUnsettled + item.settle_amount)
                listUnsettled.data.response_data.results = listUnsettled.data.response_data.results.map((obj, idx) => ({ ...obj, number: idx + 1 }));
                setListUnsettledTransaction(listUnsettled.data.response_data.results)
                setTotalSettlement(totalUnsettled)
                setPendingSettlement(false)
            } else if (listUnsettled.status === 200 && listUnsettled.data.response_code === 200 && listUnsettled.data.response_new_token !== null) {
                setUserSession(listUnsettled.data.response_new_token)
                let totalUnsettled = 0
                listUnsettled.data.response_data.results.forEach(item => totalUnsettled = totalUnsettled + item.settle_amount)
                listUnsettled.data.response_data.results = listUnsettled.data.response_data.results.map((obj, idx) => ({ ...obj, number: idx + 1 }));
                setListUnsettledTransaction(listUnsettled.data.response_data.results)
                setTotalSettlement(totalUnsettled)
                setPendingSettlement(false)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function ExportReportUnsettledTransactionHandler(partnerName, fiturId, bankCode, eWalletCode) {
        try {
            setIsLoadingExport(true)
            let paymentCode = ""
            if (bankCode.length !== 0 && eWalletCode.length === 0) {
                paymentCode = bankCode[0].value
            } else if (bankCode.length === 0 && eWalletCode.length !== 0) {
                paymentCode = eWalletCode[0].value
            } else {
                paymentCode = ""
            }
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "partner_id": "${partnerName.length !== 0 ? partnerName[0].value : ""}", "fitur_id": ${fiturId}, "payment_code": "${paymentCode}" }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listUnsettled = await axios.post(BaseURL + "/Settlement/GetUnsettledTransaction", { data: dataParams }, { headers: headers })
            // console.log(listUnsettled, "data settlement");
            if (listUnsettled.status === 200 && listUnsettled.data.response_code === 200 && listUnsettled.data.response_new_token === null) {
                const data = listUnsettled.data.response_data.results
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ No: i + 1, "Waktu": new Date(data[i].settle_date).toLocaleString("en-GB"), "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].payment_type, "Nominal Settlement": data[i].settle_amount, "Nominal Transaksi": data[i].sum_trx, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].fee_partner, "PPN atas Jasa Layanan": data[i].fee_partner_tax, "Reimbursement by VA": data[i].fee_payment_type })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Report UnSettled Transaction.xlsx");
                setIsLoadingExport(false)
            } else if (listUnsettled.status === 200 && listUnsettled.data.response_code === 200 && listUnsettled.data.response_new_token !== null) {
                setUserSession(listUnsettled.data.response_new_token)
                const data = listUnsettled.data.response_data.results
                let dataExcel = []
                for (let i = 0; i < data.length; i++) {
                    dataExcel.push({ No: i + 1, "Waktu": new Date(data[i].settle_date).toLocaleString("en-GB"), "Nama Partner": data[i].mpartner_name, "Jenis Transaksi": data[i].payment_type, "Nominal Settlement": data[i].settle_amount, "Nominal Transaksi": data[i].sum_trx, "Total Transaksi": data[i].total_trx, "Jasa Layanan": data[i].fee_partner, "PPN atas Jasa Layanan": data[i].fee_partner_tax, "Reimbursement by VA": data[i].fee_payment_type })
                }
                let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                let workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                XLSX.writeFile(workBook, "Report UnSettled Transaction.xlsx");
                setIsLoadingExport(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getBankNameHandler() {
        try {
            const auth = 'Bearer ' + getToken();
            const dataParams = encryptData(`{"fitur_id":"100"}`)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const listBankName = await axios.post(BaseURL + "/Home/BankGetList", {data: dataParams}, { headers: headers });
            if (listBankName.status === 200 && listBankName.data.response_code === 200 && listBankName.data.response_new_token.length === 0) {
                let newArr = []
                listBankName.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.mbank_code
                    obj.label = e.mbank_name
                    newArr.push(obj)
                })
                setListBank(newArr)
            } else if (listBankName.status === 200 && listBankName.data.response_code === 200 && listBankName.data.response_new_token.length !== 0) {
                setUserSession(listBankName.data.response_new_token)
                let newArr = []
                listBankName.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.mbank_code
                    obj.label = e.mbank_name
                    newArr.push(obj)
                })
                setListBank(newArr)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function getListEWallet() {
        try {
            const auth = 'Bearer ' + getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const dataListEmoney = await axios.post(BaseURL + "/Home/GetLisEwallet", {data: ""}, {headers: headers})
            // console.log(dataListEmoney, 'dataListEmoney');
            if (dataListEmoney.status === 200 && dataListEmoney.data.response_code === 200 && dataListEmoney.data.response_new_token.length === 0) {
                let newArr = []
                dataListEmoney.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.mewallet_code
                    obj.label = e.mewallet_name
                    newArr.push(obj)
                })
                setListEWallet(newArr)
            } else if (dataListEmoney.status === 200 && dataListEmoney.data.response_code === 200 && dataListEmoney.data.response_new_token.length !== 0) {
                setUserSession(dataListEmoney.data.response_new_token)
                let newArr = []
                dataListEmoney.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.mewallet_code
                    obj.label = e.mewallet_name
                    newArr.push(obj)
                })
                setListEWallet(newArr)
            }

        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getListPartner() {
        try {
            const auth = 'Bearer ' + getToken();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
            const listPartner = await axios.post(BaseURL + "/Partner/ListPartner", {data: ""}, {headers: headers})
            if (listPartner.status === 200 && listPartner.data.response_code === 200 && listPartner.data.response_new_token.length === 0) {
                let newArr = []
                listPartner.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.partner_id
                    obj.label = e.nama_perusahaan
                    newArr.push(obj)
                })
                setDataListPartner(newArr)
            } else if (listPartner.status === 200 && listPartner.data.response_code === 200 && listPartner.data.response_new_token.length !== 0) {
                setUserSession(listPartner.data.response_new_token)
                let newArr = []
                listPartner.data.response_data.forEach(e => {
                    let obj = {}
                    obj.value = e.partner_id
                    obj.label = e.nama_perusahaan
                    newArr.push(obj)
                })
                setDataListPartner(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    useEffect(() => {
        if (user_role === "100" || user_role === "101") {
            getListPartner()
            getListEWallet()
            getBankNameHandler()
            unsettledTransactionList(selectedPartnerSettlement, transactionType, selectedBankSettlement, selectedEWalletSettlement)
        } else {
            history.push("/404");
        }
        
    }, [])

    const columnsSettl = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px",
        },
        {
            name: 'Waktu',
            selector: row => new Date(row.settle_date).toLocaleString("en-GB").split(",")[0],
            width: "150px",
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "224px",
            wrap: true,
        },
        {
            name: 'Jenis Transaksi',
            selector: row => row.payment_type,
            width: "224px",
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.settle_amount),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.sum_trx),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Total Transaksi',
            selector: row => row.total_trx,
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Jasa Layanan',
            selector: row => convertToRupiah(row.fee_partner, true, 2),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'PPN atas Jasa Layanan',
            selector: row => convertToRupiah(row.fee_partner_tax, true, 2),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
        {
            name: 'Reimbursement by VA',
            selector: row => convertToRupiah(row.fee_payment_type),
            width: "224px",
            style: { display: "flex", flexDirection: "row", justifyContent: "flex-end", }
        },
    ];

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const customStylesSelectedOption = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: "none",
            color: "black"
        })
    }

    const customStylesSettlement = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
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
                },
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
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Unsettled Transaction</span>
            <div className='head-title'>
                <h2 className="h5 mb-1 mt-4" style={{fontWeight: 700, fontSize: 18, fontFamily: "Exo", color: "#383838"}}>Unsettled Transaction</h2>
            </div>
            <div className='main-content'>
                <div className='riwayat-settlement-div mt-3 mb-4'>
                    <div className='base-content mt-3'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontSize: 16, fontFamily: "Exo", color: "#383838"}}>Filter</span>
                        <Row className='mt-4'>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span className='me-3'>Nama Partner</span>
                                <div className="dropdown dropSaldoPartner">
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
                                </div>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center">
                                <span>Jenis Transaksi</span>
                                <Form.Select name='transactionType' className='input-text-riwayat ms-3' style={{ display: "inline" }} value={transactionType} onChange={(e) => handleChange(e)}>
                                    <option defaultValue disabled value={0}>Pilih Jenis Transaksi</option>
                                    <option value={100}>Virtual Account</option>
                                    <option value={105}>E-Money</option>
                                </Form.Select>
                            </Col>
                            {
                                Number(transactionType) === 105 ?
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span className="me-2">Nama eWallet</span>
                                    <div className="dropdown dropSaldoPartner">
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={listEWallet}
                                            value={selectedEWalletSettlement}
                                            onChange={(selected) => setSelectedEWalletSettlement([selected])}
                                            placeholder="Pilih Nama eWallet"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                </Col> :
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span className="me-2">Nama Bank</span>
                                    <div className="dropdown dropSaldoPartner">
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={listBank}
                                            value={selectedBankSettlement}
                                            onChange={(selected) => setSelectedBankSettlement([selected])}
                                            placeholder="Pilih Nama Bank"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                </Col>
                            }
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => unsettledTransactionList(selectedPartnerSettlement, transactionType, selectedBankSettlement, selectedEWalletSettlement)}
                                            className={selectedBankSettlement.length === 0 && selectedEWalletSettlement.length === 0 && selectedPartnerSettlement.length === 0 && transactionType === 0 ? "btn-ez" : "btn-ez-on"}
                                            disabled={selectedBankSettlement.length === 0 && selectedEWalletSettlement.length === 0 && selectedPartnerSettlement.length === 0 && transactionType === 0}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => resetButtonHandle()}
                                            className={selectedBankSettlement.length === 0 && selectedEWalletSettlement.length === 0 && selectedPartnerSettlement.length === 0 && transactionType === 0 ? "btn-ez-reset" : "btn-reset"}
                                            disabled={selectedBankSettlement.length === 0 && selectedEWalletSettlement.length === 0 && selectedPartnerSettlement.length === 0 && transactionType === 0}
                                        >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <div className='settlement-amount'>
                            <div className="card-information mt-3" style={{border: '1px solid #EBEBEB'}}>
                                <p className="p-info">Total Settlement</p>
                                <p className="p-amount">{convertToRupiah(totalSettlement)}</p>
                            </div>
                        </div>
                        {
                            listUnsettledTransaction.length !== 0 &&
                                <div className='d-flex justify-content-end' style={{ marginBottom: -15 }}>
                                    {
                                        !isLoadingExport ?
                                            <Link to={"#"} style={{ marginRight: 15 }} onClick={() => ExportReportUnsettledTransactionHandler(selectedPartnerSettlement, transactionType, selectedBankSettlement, selectedEWalletSettlement)} className="export-span">Export</Link>
                                        :
                                            <>Loading... <FontAwesomeIcon icon={faSpinner} spin /></>
                                    }
                                </div>
                        }
                        <div className="div-table mt-4 pb-4">
                            <DataTable
                                columns={columnsSettl}
                                data={listUnsettledTransaction}
                                customStyles={customStylesSettlement}
                                progressPending={pendingSettlement}
                                progressComponent={<CustomLoader />}
                                pagination
                                dense
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
        </div>
    )
}

export default UnSettledTransaction