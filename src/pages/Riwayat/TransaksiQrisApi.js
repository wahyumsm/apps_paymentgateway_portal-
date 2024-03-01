import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { BaseURL, convertToRupiah, customFilter, errorCatch, getRole, getToken, language, setUserSession } from '../../function/helpers'
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import ReactSelect, { components } from 'react-select';
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/DateRangePicker'
import DataTable, { defaultThemes } from 'react-data-table-component'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import Pagination from 'react-js-pagination'
import encryptData from '../../function/encryptData'
import axios from 'axios'
import * as XLSX from "xlsx"
import { eng } from '../../components/Language';

const TransaksiQrisApi = () => {
    const user_role = getRole()
    const access_token = getToken();
    const history = useHistory()
    const [partnerId, setPartnerId] = useState("")
    const [dataGrupInQris, setDataGrupInQris] = useState([])
    const [dataBrandInQris, setDataBrandInQris] = useState([])
    const [dataOutletInQris, setDataOutletInQris] = useState([])
    const [dataIdKasirInQris, setDataIdKasirInQris] = useState([])

    async function userDetails() {
        try {
          const auth = "Bearer " + getToken()
          const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const userDetail = await axios.post(BaseURL + "/Account/GetUserProfile", { data: "" }, { headers: headers })
          // console.log(userDetail, 'ini user detal funct');
          if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length === 0) {
            setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
            getTransactionQrisApiReport(activePageTransactionQrisApiPartner, language === null ? 'EN' : language.flagName, userDetail.data.response_data.muser_partnerdtl_id)
            if (user_role === "102") {
                getBrandInQrisTransactionHandler(0)
            }
          } else if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length !== 0) {
            setUserSession(userDetail.data.response_new_token)
            setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
            getTransactionQrisApiReport(activePageTransactionQrisApiPartner, language === null ? 'EN' : language.flagName, userDetail.data.response_data.muser_partnerdtl_id)
            if (user_role === "102") {
                getBrandInQrisTransactionHandler(0)
            }
          }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    async function getGrupInQrisTransactionHandler() {
        try {
            const auth = "Bearer " + access_token
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataGrupQris = await axios.post(BaseURL + "/QRIS/MasterGroup", { data: "" }, { headers: headers })
            // console.log(dataGrupQris, 'ini user detal funct');
            if (dataGrupQris.status === 200 && dataGrupQris.data.response_code === 200 && dataGrupQris.data.response_new_token === null) {
                let newArr = []
                dataGrupQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataGrupInQris(newArr)
            } else if (dataGrupQris.status === 200 && dataGrupQris.data.response_code === 200 && dataGrupQris.data.response_new_token !== null) {
                setUserSession(dataGrupQris.data.response_new_token)
                let newArr = []
                dataGrupQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataGrupInQris(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getBrandInQrisTransactionHandler(nouGrup) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"mmerchant_nou": ${user_role === "102" ? 0 : nouGrup}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataBrandQris = await axios.post(BaseURL + "/QRIS/MasterBrand", { data: dataParams }, { headers: headers })
            // console.log(dataBrandQris, 'ini user detal funct');
            if (dataBrandQris.status === 200 && dataBrandQris.data.response_code === 200 && dataBrandQris.data.response_new_token === null) {
                let newArr = []
                dataBrandQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataBrandInQris(newArr)
            } else if (dataBrandQris.status === 200 && dataBrandQris.data.response_code === 200 && dataBrandQris.data.response_new_token !== null) {
                setUserSession(dataBrandQris.data.response_new_token)
                let newArr = []
                dataBrandQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataBrandInQris(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getOutletInQrisTransactionHandler(nouBrand) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"moutlet_nou": ${nouBrand}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataOutletQris = await axios.post(BaseURL + "/QRIS/MasterOutlet", { data: dataParams }, { headers: headers })
            // console.log(dataOutletQris, 'ini user detal funct');
            if (dataOutletQris.status === 200 && dataOutletQris.data.response_code === 200 && dataOutletQris.data.response_new_token === null) {
                let newArr = []
                dataOutletQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataOutletInQris(newArr)
            } else if (dataOutletQris.status === 200 && dataOutletQris.data.response_code === 200 && dataOutletQris.data.response_new_token !== null) {
                setUserSession(dataOutletQris.data.response_new_token)
                let newArr = []
                dataOutletQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataOutletInQris(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getIdKasirInQrisTransactionHandler(storeNou) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"mstore_nou": ${storeNou}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataIdKasirQris = await axios.post(BaseURL + "/QRIS/MasterCashier", { data: dataParams }, { headers: headers })
            // console.log(dataIdKasirQris, 'ini user detal funct');
            if (dataIdKasirQris.status === 200 && dataIdKasirQris.data.response_code === 200 && dataIdKasirQris.data.response_new_token === null) {
                let newArr = []
                dataIdKasirQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.id
                    obj.label = e.id
                    newArr.push(obj)
                })
                setDataIdKasirInQris(newArr)
            } else if (dataIdKasirQris.status === 200 && dataIdKasirQris.data.response_code === 200 && dataIdKasirQris.data.response_new_token !== null) {
                setUserSession(dataIdKasirQris.data.response_new_token)
                let newArr = []
                dataIdKasirQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.id
                    obj.label = e.id
                    newArr.push(obj)
                })
                setDataIdKasirInQris(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getTransactionQrisApiReport(currentPage, lang, partnerId) {
        try {
            if (user_role === "102") {
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"trans_id": "", "partner_trans_id": "", "sub_partner_id": "${partnerId}", "RRN": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0, "mterminal_id": 0, "status": "2,4,5,6", "payment_type_qris": "1,2,3", "period": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth,
                    'Accept-Language' : lang
                }
                const getDataQrisReport = await axios.post(BaseURL + "/QRIS/QRISTransMerchantReport", { data: dataParams }, { headers: headers })
                // console.log(getDataQrisReport, 'ini user detal funct');
                if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token === null) {
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1}))
                    setPageNumberTransactionQrisApiPartner(getDataQrisReport.data.response_data)
                    setTotalPageTransactionQrisApiPartner(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionQrisApiPartner(getDataQrisReport.data.response_data.results)
                    setPendingTransactionQrisApiPartner(false)
                } else if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token !== null) {
                    setUserSession(getDataQrisReport.data.response_new_token)
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1}))
                    setPageNumberTransactionQrisApiPartner(getDataQrisReport.data.response_data)
                    setTotalPageTransactionQrisApiPartner(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionQrisApiPartner(getDataQrisReport.data.response_data.results)
                    setPendingTransactionQrisApiPartner(false)
                }
            } else {
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"trans_id": "", "partner_trans_id": "", "sub_partner_id": "", "RRN": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0, "mterminal_id": 0, "status": "2,4,5,6", "payment_type_qris": "1,2,3", "period": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth,
                    'Accept-Language' : "ID"
                }
                const getDataQrisReport = await axios.post(BaseURL + "/QRIS/QRISTransMerchantReport", { data: dataParams }, { headers: headers })
                // console.log(getDataQrisReport, 'ini user detal funct');
                if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token === null) {
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1}))
                    setPageNumberTransactionQrisApiAdmin(getDataQrisReport.data.response_data)
                    setTotalPageTransactionQrisApiAdmin(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionQrisApiAdmin(getDataQrisReport.data.response_data.results)
                    setPendingTransactionQrisApiAdmin(false)
                } else if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token !== null) {
                    setUserSession(getDataQrisReport.data.response_new_token)
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1}))
                    setPageNumberTransactionQrisApiAdmin(getDataQrisReport.data.response_data)
                    setTotalPageTransactionQrisApiAdmin(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionQrisApiAdmin(getDataQrisReport.data.response_data.results)
                    setPendingTransactionQrisApiAdmin(false)
                }

            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterTransactionQrisApiReport(transId, partnerTransId, partnerId, rrn, partnerNameId, brandNou, outletNou, idKasirNou, statusQris, dateId, periode, page, rowPerPage, lang, channelPembayaran) {
        try {
            if (user_role === "102") {
                setPendingTransactionQrisApiPartner(true)
                setIsFilterTransactionQrisApiPartner(true)
                setActivePageTransactionQrisApiPartner(page)
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"trans_id": "${transId}", "partner_trans_id": "${partnerTransId}", "sub_partner_id": "${partnerId}", "RRN": "${rrn}", "merchant_nou": 0, "brand_nou": ${brandNou}, "outlet_nou": ${outletNou}, "mterminal_id": ${idKasirNou}, "status": "${statusQris.length !== 0 ? statusQris : "2,4,5,6"}", "payment_type_qris": "${channelPembayaran !== 0 ? channelPembayaran : "1,2,3"}", "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page < 1) ? 1 : page}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth,
                    'Accept-Language' : lang
                }
                const getDataQrisReport = await axios.post(BaseURL + "/QRIS/QRISTransMerchantReport", { data: dataParams }, { headers: headers })
                // console.log(getDataQrisReport, 'ini user detal funct');
                if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token === null) {
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1}))
                    setPageNumberTransactionQrisApiPartner(getDataQrisReport.data.response_data)
                    setTotalPageTransactionQrisApiPartner(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionQrisApiPartner(getDataQrisReport.data.response_data.results)
                    setPendingTransactionQrisApiPartner(false)
                } else if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token !== null) {
                    setUserSession(getDataQrisReport.data.response_new_token)
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1}))
                    setPageNumberTransactionQrisApiPartner(getDataQrisReport.data.response_data)
                    setTotalPageTransactionQrisApiPartner(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionQrisApiPartner(getDataQrisReport.data.response_data.results)
                    setPendingTransactionQrisApiPartner(false)
                }
            } else {
                setPendingTransactionQrisApiAdmin(true)
                setIsFilterTransactionQrisApiAdmin(true)
                setActivePageTransactionQrisApiAdmin(page)
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"trans_id": "${transId}", "partner_trans_id": "${partnerTransId}", "sub_partner_id": "", "RRN": "${rrn}", "merchant_nou": ${partnerNameId}, "brand_nou": ${brandNou}, "outlet_nou": ${outletNou}, "mterminal_id": ${idKasirNou}, "status": "${statusQris.length !== 0 ? statusQris : "2,4,5,6"}", "payment_type_qris": "${channelPembayaran !== 0 ? channelPembayaran : "1,2,3"}", "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page < 1) ? 1 : page}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth,
                    'Accept-Language' : "ID"
                }
                const getDataQrisReport = await axios.post(BaseURL + "/QRIS/QRISTransMerchantReport", { data: dataParams }, { headers: headers })
                // console.log(getDataQrisReport, 'ini user detal funct');
                if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token === null) {
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1}))
                    setPageNumberTransactionQrisApiAdmin(getDataQrisReport.data.response_data)
                    setTotalPageTransactionQrisApiAdmin(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionQrisApiAdmin(getDataQrisReport.data.response_data.results)
                    setPendingTransactionQrisApiAdmin(false)
                } else if (getDataQrisReport.status === 200 && getDataQrisReport.data.response_code === 200 && getDataQrisReport.data.response_new_token !== null) {
                    setUserSession(getDataQrisReport.data.response_new_token)
                    getDataQrisReport.data.response_data.results = getDataQrisReport.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1}))
                    setPageNumberTransactionQrisApiAdmin(getDataQrisReport.data.response_data)
                    setTotalPageTransactionQrisApiAdmin(getDataQrisReport.data.response_data.max_page)
                    setDataTransactionQrisApiAdmin(getDataQrisReport.data.response_data.results)
                    setPendingTransactionQrisApiAdmin(false)
                }

            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    function ExportTransactionQrisApiReportHandler(isFilter, transId, partnerTransId, partnerId, rrn, partnerNameId, brandNou, outletNou, idKasirNou, statusQris, dateId, periode, lang, role) {
        if (isFilter) {
            async function dataExportFilter(transId, partnerTransId, partnerId, rrn, partnerNameId, brandNou, outletNou, idKasirNou, statusQris, dateId, periode, lang) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"trans_id": "${transId}", "partner_trans_id": "${partnerTransId}", "sub_partner_id": "${role === "102" ? partnerId : ""}", "RRN": "${rrn}", "merchant_nou": ${role !== "102" ? partnerNameId : 0}, "brand_nou": ${brandNou}, "outlet_nou": ${outletNou}, "mterminal_id": ${idKasirNou}, "status": "${statusQris.length !== 0 ? statusQris : "2,4,5,6"}", "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth,
                        'Accept-Language' : role !== "102" ? "ID" : lang
                    }
                    const dataExportFilter = await axios.post(BaseURL + "/QRIS/QRISTransMerchantReport", {data: dataParams}, { headers: headers });
                    if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        if (role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].trans_id, "Waktu Request": data[i].qris_request, "Waktu Bayar": data[i].qris_paid, "No. Referensi": data[i].reference_label !== null ? data[i].reference_label : "-", "RRN": data[i].rrn, "Tipe QR": data[i].qr_type, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].partner_name, "Nama Brand": data[i].brand_name, "Nama Outlet": data[i].outlet_name, "ID Kasir": data[i].terminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].mdr, "Pendapatan": data[i].partner_income, "Status": data[i].status})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].trans_id, "Waktu Request": data[i].qris_request, "Waktu Bayar": data[i].qris_paid, "No. Referensi": data[i].reference_label !== null ? data[i].reference_label : "-", "RRN": data[i].rrn, "Tipe QR": data[i].qr_type, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].partner_name, "Nama Brand": data[i].brand_name, "Nama Outlet": data[i].outlet_name, "ID Kasir": data[i].terminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].mdr, "Pendapatan Ezee": data[i].ezee_income, "Pendapatan Partner": data[i].partner_income, "Status": data[i].status})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi QRIS API.xlsx");
                    } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token !== null) {
                        setUserSession(dataExportFilter.data.response_new_token)
                        const data = dataExportFilter.data.response_data.results
                        let dataExcel = []
                        if (role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].trans_id, "Waktu Request": data[i].qris_request, "Waktu Bayar": data[i].qris_paid, "No. Referensi": data[i].reference_label !== null ? data[i].reference_label : "-", "RRN": data[i].rrn, "Tipe QR": data[i].qr_type, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].partner_name, "Nama Brand": data[i].brand_name, "Nama Outlet": data[i].outlet_name, "ID Kasir": data[i].terminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].mdr, "Pendapatan": data[i].partner_income, "Status": data[i].status})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].trans_id, "Waktu Request": data[i].qris_request, "Waktu Bayar": data[i].qris_paid, "No. Referensi": data[i].reference_label !== null ? data[i].reference_label : "-", "RRN": data[i].rrn, "Tipe QR": data[i].qr_type, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].partner_name, "Nama Brand": data[i].brand_name, "Nama Outlet": data[i].outlet_name, "ID Kasir": data[i].terminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].mdr, "Pendapatan Ezee": data[i].ezee_income, "Pendapatan Partner": data[i].partner_income, "Status": data[i].status})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi QRIS API.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(transId, partnerTransId, partnerId, rrn, partnerNameId, brandNou, outletNou, idKasirNou, statusQris, dateId, periode, lang)
        } else {
            async function dataExportTransactionQrisApi(lang, role, partnerId) {
                try {
                    const auth = 'Bearer ' + getToken();
                    const dataParams = encryptData(`{"trans_id": "", "partner_trans_id": "", "sub_partner_id": "${role === "102" ? partnerId : ""}", "RRN": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0, "mterminal_id": 0, "status": "2,4,5,6", "period": 2, "date_from": "", "date_to": "", "page": 1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': auth,
                        'Accept-Language' : role !== "102" ? "ID" : lang
                    }
                    const dataExportTransactionQris = await axios.post(BaseURL + "/QRIS/QRISTransMerchantReport", {data: dataParams}, { headers: headers });
                    if (dataExportTransactionQris.status === 200 && dataExportTransactionQris.data.response_code === 200 && dataExportTransactionQris.data.response_new_token === null) {
                        const data = dataExportTransactionQris.data.response_data.results
                        let dataExcel = []
                        if (role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].trans_id, "Waktu Request": data[i].qris_request, "Waktu Bayar": data[i].qris_paid, "No. Referensi": data[i].reference_label !== null ? data[i].reference_label : "-", "RRN": data[i].rrn, "Tipe QR": data[i].qr_type, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].partner_name, "Nama Brand": data[i].brand_name, "Nama Outlet": data[i].outlet_name, "ID Kasir": data[i].terminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].mdr, "Pendapatan": data[i].partner_income, "Status": data[i].status})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].trans_id, "Waktu Request": data[i].qris_request, "Waktu Bayar": data[i].qris_paid, "No. Referensi": data[i].reference_label !== null ? data[i].reference_label : "-", "RRN": data[i].rrn, "Tipe QR": data[i].qr_type, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].partner_name, "Nama Brand": data[i].brand_name, "Nama Outlet": data[i].outlet_name, "ID Kasir": data[i].terminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].mdr, "Pendapatan Ezee": data[i].ezee_income, "Pendapatan Partner": data[i].partner_income, "Status": data[i].status})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi QRIS API.xlsx");
                    } else if (dataExportTransactionQris.status === 200 && dataExportTransactionQris.data.response_code === 200 && dataExportTransactionQris.data.response_new_token !== null) {
                        setUserSession(dataExportTransactionQris.data.response_new_token)
                        const data = dataExportTransactionQris.data.response_data.results
                        let dataExcel = []
                        if (role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].trans_id, "Waktu Request": data[i].qris_request, "Waktu Bayar": data[i].qris_paid, "No. Referensi": data[i].reference_label !== null ? data[i].reference_label : "-", "RRN": data[i].rrn, "Tipe QR": data[i].qr_type, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].partner_name, "Nama Brand": data[i].brand_name, "Nama Outlet": data[i].outlet_name, "ID Kasir": data[i].terminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].mdr, "Pendapatan": data[i].partner_income, "Status": data[i].status})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].trans_id, "Waktu Request": data[i].qris_request, "Waktu Bayar": data[i].qris_paid, "No. Referensi": data[i].reference_label !== null ? data[i].reference_label : "-", "RRN": data[i].rrn, "Tipe QR": data[i].qr_type, "Partner Trans ID": data[i].partner_trans_id, "Nama Partner": data[i].partner_name, "Nama Brand": data[i].brand_name, "Nama Outlet": data[i].outlet_name, "ID Kasir": data[i].terminal_name, "Nominal Transaksi": data[i].amount, "Potongan MDR": data[i].mdr, "Pendapatan Ezee": data[i].ezee_income, "Pendapatan Partner": data[i].partner_income, "Status": data[i].status})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, "Riwayat Transaksi QRIS API.xlsx");
                    }
                } catch (error) {
                    // console.log(error);
                    history.push(errorCatch(error.response.status))
                }
            }
            dataExportTransactionQrisApi(lang, role, partnerId)
        }
    }

    function resetButtonTransactionQrisApi (param) {
        if (param === "admin") {
            getTransactionQrisApiReport(activePageTransactionQrisApiAdmin, "ID", partnerId)
            setSelectedGrupName([])
            getGrupInQrisTransactionHandler()
            setSelectedBrandNameAdmin([])
            setSelectedOutletNameAdmin([])
            setSelectedIdKasirAdmin([])
            setInputHandleTransactionApiAdmin({
                idTransaksi: "",
                periode: 0,
                rrn: "",
                partnerTransId: "",
                statusQris: "",
                channelPembayaran: 0,
            })
            setDataBrandInQris([])
            setDataOutletInQris([])
            setDataIdKasirInQris([])
            setIsFilterTransactionQrisApiAdmin(false)
            setShowDateTransactionQrisApiAdmin("none")
            setDateRangeTransactionQrisApiAdmin([])
            setStateTransactionQrisApiAdmin(null)
        } else {
            getTransactionQrisApiReport(activePageTransactionQrisApiPartner, language === null ? 'EN' : language.flagName, partnerId)
            setSelectedBrandNamePartner([])
            getBrandInQrisTransactionHandler(user_role === "102" ? 0 : partnerId)
            setSelectedOutletNamePartner([])
            setSelectedIdKasirPartner([])
            setInputHandleTransactionApiPartner({
                idTransaksi: "",
                periode: 0,
                rrn: "",
                partnerTransId: "",
                statusQris: "",
                channelPembayaran: 0,
            })
            setDataOutletInQris([])
            setDataIdKasirInQris([])
            setIsFilterTransactionQrisApiPartner(false)
            setShowDateTransactionQrisApiPartner("none")
            setDateRangeTransactionQrisApiPartner([])
            setStateTransactionQrisApiPartner(null)
        }
    }


    const [dataTransactionQrisApiAdmin, setDataTransactionQrisApiAdmin] = useState([])
    const [showDateTransactionQrisApiAdmin, setShowDateTransactionQrisApiAdmin] = useState("none")
    const [dateRangeTransactionQrisApiAdmin, setDateRangeTransactionQrisApiAdmin] = useState([])
    const [stateTransactionQrisApiAdmin, setStateTransactionQrisApiAdmin] = useState(null)
    const [activePageTransactionQrisApiAdmin, setActivePageTransactionQrisApiAdmin] = useState(1)
    const [pageNumberTransactionQrisApiAdmin, setPageNumberTransactionQrisApiAdmin] = useState({})
    const [totalPageTransactionQrisApiAdmin, setTotalPageTransactionQrisApiAdmin] = useState(0)
    const [pendingTransactionQrisApiAdmin, setPendingTransactionQrisApiAdmin] = useState(true)
    const [isFilterTransactionQrisApiAdmin, setIsFilterTransactionQrisApiAdmin] = useState(false)
    const [inputHandleTransactionApiAdmin, setInputHandleTransactionApiAdmin] = useState({
        idTransaksi: "",
        periode: 0,
        rrn: "",
        partnerTransId: "",
        statusQris: "",
        channelPembayaran: 0,
    })
    const [selectedGrupName, setSelectedGrupName] = useState([])
    const [selectedBrandNameAdmin, setSelectedBrandNameAdmin] = useState([])
    const [selectedOutletNameAdmin, setSelectedOutletNameAdmin] = useState([])
    const [selectedIdKasirAdmin, setSelectedIdKasirAdmin] = useState([])

    function handleChangeTransactionQrisApiAdmin(e) {
        setInputHandleTransactionApiAdmin({
            ...inputHandleTransactionApiAdmin,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeTransactionQrisApiAdmin(e) {
        if (e.target.value === "7") {
            setShowDateTransactionQrisApiAdmin("")
            setInputHandleTransactionApiAdmin({
                ...inputHandleTransactionApiAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateTransactionQrisApiAdmin("none")
            setDateRangeTransactionQrisApiAdmin([])
            setInputHandleTransactionApiAdmin({
                ...inputHandleTransactionApiAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateTransactionQrisApiAdmin(item) {
        setStateTransactionQrisApiAdmin(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeTransactionQrisApiAdmin(item)
        }
    }

    function handlePageChangeTransactionQrisApiAdmin(page) {
        if (isFilterTransactionQrisApiAdmin) {
            setActivePageTransactionQrisApiAdmin(page)
            filterTransactionQrisApiReport((inputHandleTransactionApiAdmin.idTransaksi), inputHandleTransactionApiAdmin.partnerTransId, partnerId, inputHandleTransactionApiAdmin.rrn, (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0), (selectedBrandNameAdmin.length !== 0 ? selectedBrandNameAdmin.map((item, idx) => item.value) : 0), (selectedOutletNameAdmin.length !== 0 ? selectedOutletNameAdmin.map((item, idx) => item.value) : 0), (selectedIdKasirAdmin.length !== 0 ? selectedIdKasirAdmin.map((item, idx) => item.value) : 0), inputHandleTransactionApiAdmin.statusQris, inputHandleTransactionApiAdmin.periode, dateRangeTransactionQrisApiAdmin, page, 10, language === null ? 'EN' : language.flagName, inputHandleTransactionApiAdmin.channelPembayaran)
        } else {
            setActivePageTransactionQrisApiAdmin(page)
            getTransactionQrisApiReport(page, language === null ? 'EN' : language.flagName, partnerId)
        }
    }

    function handleChangePartnerNameAdmin(e) {
        getBrandInQrisTransactionHandler(e.value)
        setDataOutletInQris([])
        setDataIdKasirInQris([])
        setSelectedGrupName([e])
        setSelectedBrandNameAdmin([])
        setSelectedOutletNameAdmin([])
        setSelectedIdKasirAdmin([])
    }

    function handleChangeBrandAdmin(e) {
        getOutletInQrisTransactionHandler(e.value)
        setDataIdKasirInQris([])
        setSelectedBrandNameAdmin([e])
        setSelectedOutletNameAdmin([])
        setSelectedIdKasirAdmin([])
    }

    function handleChangeOutletAdmin(e) {
        getIdKasirInQrisTransactionHandler(e.value)
        setSelectedOutletNameAdmin([e])
        setSelectedIdKasirAdmin([])
    }

    function handleChangeIdKasirAdmin(e) {
        setSelectedIdKasirAdmin([e])
    }

    const [dataTransactionQrisApiPartner, setDataTransactionQrisApiPartner] = useState([])
    const [showDateTransactionQrisApiPartner, setShowDateTransactionQrisApiPartner] = useState("none")
    const [dateRangeTransactionQrisApiPartner, setDateRangeTransactionQrisApiPartner] = useState([])
    const [stateTransactionQrisApiPartner, setStateTransactionQrisApiPartner] = useState(null)
    const [activePageTransactionQrisApiPartner, setActivePageTransactionQrisApiPartner] = useState(1)
    const [pageNumberTransactionQrisApiPartner, setPageNumberTransactionQrisApiPartner] = useState({})
    const [totalPageTransactionQrisApiPartner, setTotalPageTransactionQrisApiPartner] = useState(0)
    const [pendingTransactionQrisApiPartner, setPendingTransactionQrisApiPartner] = useState(true)
    const [isFilterTransactionQrisApiPartner, setIsFilterTransactionQrisApiPartner] = useState(false)
    const [inputHandleTransactionApiPartner, setInputHandleTransactionApiPartner] = useState({
        idTransaksi: "",
        periode: 0,
        rrn: "",
        partnerTransId: "",
        statusQris: "",
        channelPembayaran: 0,
    })
    const [selectedBrandNamePartner, setSelectedBrandNamePartner] = useState([])
    const [selectedOutletNamePartner, setSelectedOutletNamePartner] = useState([])
    const [selectedIdKasirPartner, setSelectedIdKasirPartner] = useState([])

    function handleChangeTransactionQrisApiPartner(e) {
        setInputHandleTransactionApiPartner({
            ...inputHandleTransactionApiPartner,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeTransactionQrisApiPartner(e) {
        if (e.target.value === "7") {
            setShowDateTransactionQrisApiPartner("")
            setInputHandleTransactionApiPartner({
                ...inputHandleTransactionApiPartner,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateTransactionQrisApiPartner("none")
            setDateRangeTransactionQrisApiPartner([])
            setInputHandleTransactionApiPartner({
                ...inputHandleTransactionApiPartner,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateTransactionQrisApiPartner(item) {
        setStateTransactionQrisApiPartner(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeTransactionQrisApiPartner(item)
        }
    }

    function handlePageChangeTransactionQrisApiPartner(page) {
        if (isFilterTransactionQrisApiPartner) {
            setActivePageTransactionQrisApiPartner(page)
            filterTransactionQrisApiReport((inputHandleTransactionApiPartner.idTransaksi), inputHandleTransactionApiPartner.partnerTransId, partnerId, inputHandleTransactionApiPartner.rrn, 0, (selectedBrandNamePartner.length !== 0 ? selectedBrandNamePartner.map((item, idx) => item.value) : 0), (selectedOutletNamePartner.length !== 0 ? selectedOutletNamePartner.map((item, idx) => item.value) : 0), (selectedIdKasirPartner.length !== 0 ? selectedIdKasirPartner.map((item, idx) => item.value) : 0), inputHandleTransactionApiPartner.statusQris, inputHandleTransactionApiPartner.periode, dateRangeTransactionQrisApiPartner, page, 10, language === null ? 'EN' : language.flagName, inputHandleTransactionApiPartner.channelPembayaran)
        } else {
            setActivePageTransactionQrisApiPartner(page)
            getTransactionQrisApiReport(page, language === null ? 'EN' : language.flagName, partnerId)
        }
    }

    function handleChangeBrandPartner(e) {
        getOutletInQrisTransactionHandler(e.value)
        setDataIdKasirInQris([])
        setSelectedBrandNamePartner([e])
        setSelectedOutletNamePartner([])
        setSelectedIdKasirPartner([])
    }

    function handleChangeOutletPartner(e) {
        getIdKasirInQrisTransactionHandler(e.value)
        setSelectedOutletNamePartner([e])
        setSelectedIdKasirPartner([])
    }

    function handleChangeIdKasirPartner(e) {
        setSelectedIdKasirPartner([e])
    }

    const columnsAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.pay_trans_code,
            width: "150px",
            wrap: true
        },
        {
            name: 'Waktu Request',
            selector: row => row.qris_request,
            width: "150px"
        },
        {
            name: 'Waktu Bayar',
            selector: row => row.qris_paid,
            width: "150px"
        },
        {
            name: 'No. Referensi',
            selector: row => row.reference_label !== null ? row.reference_label : "-",
            wrap: true,
            width: "150px"
        },
        {
            name: 'RRN',
            selector: row => row.rrn !== null ? row.rrn : "-",
            wrap: true,
            width: "150px"
        },
        {
            name: 'Tipe QR',
            selector: row => row.qr_type,
            width: "140px"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            wrap: true,
            width: "180px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.partner_name,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.brand_name,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.outlet_name,
            wrap: true,
            width: "150px"
        },
        {
            name: 'ID Kasir',
            selector: row => row.terminal_name,
            width: "100px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.amount, true, 2),
            width: "180px"
        },
        {
            name: 'Potongan MDR',
            selector: row => convertToRupiah(row.mdr, true, 2),
            width: "150px"
        },
        {
            name: 'Pendapatan Ezee',
            selector: row => convertToRupiah(row.ezee_income, true, 2),
            width: "190px"
        },
        {
            name: 'Pendapatan Partner',
            selector: row => convertToRupiah(row.partner_income, true, 2),
            width: "190px"
        },
        {
            name: 'Status',
            selector: row => row.status,
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

    const columnsPartner = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.pay_trans_code,
            width: "150px",
            wrap: true
        },
        {
            name: 'Waktu Request',
            selector: row => row.qris_request,
            width: "150px"
        },
        {
            name: 'Waktu Bayar',
            selector: row => row.qris_paid,
            width: "150px"
        },
        {
            name: 'No. Referensi',
            selector: row => row.reference_label !== null ? row.reference_label : "-",
            wrap: true,
            width: "150px"
        },
        {
            name: 'RRN',
            selector: row => row.rrn !== null ? row.rrn : "-",
            wrap: true,
            width: "150px"
        },
        {
            name: 'Tipe QR',
            selector: row => row.qr_type,
            width: "140px"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.partner_trans_id,
            wrap: true,
            width: "180px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.partner_name,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.brand_name,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.outlet_name,
            wrap: true,
            width: "150px"
        },
        {
            name: 'ID Kasir',
            selector: row => row.terminal_name,
            width: "100px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.amount, true, 2),
            width: "180px"
        },
        {
            name: 'Potongan MDR',
            selector: row => convertToRupiah(row.mdr, true, 2),
            width: "150px"
        },
        {
            name: 'Pendapatan',
            selector: row => convertToRupiah(row.partner_income, true, 2),
            width: "190px"
        },
        {
            name: 'Status',
            selector: row => row.status,
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

    const customStylesQris = {
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

    const customStylesSelectedOption = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: "none",
            color: "#888888",
            fontSize: "14px",
            fontFamily: "Nunito"
        }),
        control: (provided, state) => ({
            ...provided,
            border: "1px solid #E0E0E0",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "Nunito",
            height: "40px",
        })
    }

    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
          <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          <div>Loading...</div>
        </div>
    );

    useEffect(() => {
        userDetails()
        if (user_role !== "102") {
            getGrupInQrisTransactionHandler()
        }
    }, [])


    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            {
                user_role === "102" ? (
                    <>
                        <span className='breadcrumbs-span' style={{ cursor: "pointer" }}>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; <Link to={"/riwayat-transaksi/transaksi-qris"}>Transaksi</Link> &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS API</span>
                        <div className="head-title">
                            <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi QRIS API</h2>
                        </div>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            <Row className=''>
                                <Col xs={4} className="d-flex justify-content-between align-items-center qrisInput mt-4">
                                    <span>ID Transaksi</span>
                                    <input name="idTransaksi" value={inputHandleTransactionApiPartner.idTransaksi} onChange={(e) => handleChangeTransactionQrisApiPartner(e)} type='text' className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Periode</span>
                                    <Form.Select name='periode'  value={inputHandleTransactionApiPartner.periode} onChange={(e) => handleChangePeriodeTransactionQrisApiPartner(e)} className="input-text-riwayat ms-3">
                                        <option defaultChecked disabled value={0}>Pilih Periode</option>
                                        <option value={2}>Hari Ini</option>
                                        <option value={3}>Kemarin</option>
                                        <option value={4}>7 Hari Terakhir</option>
                                        <option value={5}>Bulan Ini</option>
                                        <option value={6}>Bulan Kemarin</option>
                                        <option value={7}>Pilih Range Tanggal</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span className="me-4">RRN</span>
                                    <input name="rrn" value={inputHandleTransactionApiPartner.rrn} onChange={(e) => handleChangeTransactionQrisApiPartner(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan RRN'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Partner Trans ID</span>
                                    <input name="partnerTransId" value={inputHandleTransactionApiPartner.partnerTransId} onChange={(e) => handleChangeTransactionQrisApiPartner(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan Partner Trans ID'/>
                                </Col>
                                <Col
                                    xs={4}
                                    className='text-end mt-4'
                                    style={{ display: showDateTransactionQrisApiPartner }}
                                >
                                    <DateRangePicker
                                        onChange={pickDateTransactionQrisApiPartner}
                                        value={stateTransactionQrisApiPartner}
                                        clearIcon={null}
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Brand</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataBrandInQris}
                                            value={selectedBrandNamePartner}
                                            onChange={(selected) => handleChangeBrandPartner(selected)}
                                            placeholder="Pilih Brand"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Outlet</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataOutletInQris}
                                            value={selectedOutletNamePartner}
                                            onChange={(selected) => handleChangeOutletPartner(selected)}
                                            placeholder="Pilih Outlet"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Kasir</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataIdKasirInQris}
                                            value={selectedIdKasirPartner}
                                            onChange={(selected) => handleChangeIdKasirPartner(selected)}
                                            placeholder="Pilih Kasir"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Status</span>
                                    <Form.Select name="statusQris" value={inputHandleTransactionApiPartner.statusQris} onChange={(e) => handleChangeTransactionQrisApiPartner(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                        <option defaultChecked disabled value={""}>Pilih Status</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={4}>Gagal</option>
                                        <option value={5}>Menunggu Pembayaran</option>
                                        <option value={6}>Kadaluwarsa</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Channel Pembayaran</span>
                                    <Form.Select name="channelPembayaran" value={inputHandleTransactionApiPartner.channelPembayaran} onChange={(e) => handleChangeTransactionQrisApiPartner(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                        <option defaultChecked disabled value={0}>Pilih Channel Pembayaran</option>
                                        {/* <option value={2}>Semua Channel</option> */}
                                        <option value={1}>QRIS</option>
                                        <option value={2}>AliPay</option>
                                        <option value={3}>WeChatPay</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => filterTransactionQrisApiReport((inputHandleTransactionApiPartner.idTransaksi), inputHandleTransactionApiPartner.partnerTransId, partnerId, inputHandleTransactionApiPartner.rrn, (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0), (selectedBrandNamePartner.length !== 0 ? selectedBrandNamePartner.map((item, idx) => item.value) : 0), (selectedOutletNamePartner.length !== 0 ? selectedOutletNamePartner.map((item, idx) => item.value) : 0), (selectedIdKasirPartner.length !== 0 ? selectedIdKasirPartner.map((item, idx) => item.value) : 0), inputHandleTransactionApiPartner.statusQris, inputHandleTransactionApiPartner.periode, dateRangeTransactionQrisApiPartner, 1, 10, language === null ? 'EN' : language.flagName, inputHandleTransactionApiPartner.channelPembayaran)}
                                                className={(inputHandleTransactionApiPartner.periode !== 0 || dateRangeTransactionQrisApiPartner.length !== 0 || (dateRangeTransactionQrisApiPartner.length !== 0 && inputHandleTransactionApiPartner.idTransaksi.length !== 0) || (dateRangeTransactionQrisApiPartner.length !== 0 && inputHandleTransactionApiPartner.partnerTransId.length !== 0) || (dateRangeTransactionQrisApiPartner.length !== 0 && inputHandleTransactionApiPartner.rrn.length !== 0) || (dateRangeTransactionQrisApiPartner.length !== 0 && inputHandleTransactionApiPartner.statusQris.length !== 0) ? 'btn-ez-on' : 'btn-ez')}
                                                disabled={inputHandleTransactionApiPartner.periode === 0 || (inputHandleTransactionApiPartner.periode === 0 && inputHandleTransactionApiPartner.idTransaksi.length === 0) || (inputHandleTransactionApiPartner.periode === 0 && inputHandleTransactionApiPartner.partnerTransId.length === 0) || (inputHandleTransactionApiPartner.periode === 0 && inputHandleTransactionApiPartner.rrn.length === 0) || (inputHandleTransactionApiPartner.periode === 0 && inputHandleTransactionApiPartner.rrn.length === 0) || (inputHandleTransactionApiPartner.periode === 0 && inputHandleTransactionApiPartner.statusQris.length === 0)}
                                            >
                                                Terapkan
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => resetButtonTransactionQrisApi("partner")}
                                                className={(inputHandleTransactionApiPartner.periode !== 0 || dateRangeTransactionQrisApiPartner.length !== 0 || inputHandleTransactionApiPartner.idTransaksi.length !== 0 || inputHandleTransactionApiPartner.partnerTransId.length !== 0 || inputHandleTransactionApiPartner.rrn.length !== 0 || inputHandleTransactionApiPartner.statusQris.length !== 0 || selectedBrandNamePartner.length !== 0 || selectedOutletNamePartner.length !== 0 || selectedIdKasirPartner.length !== 0) ? 'btn-reset' : 'btn-ez-reset'}
                                                disabled={inputHandleTransactionApiPartner.periode === 0 && dateRangeTransactionQrisApiPartner.length === 0 && inputHandleTransactionApiPartner.idTransaksi.length === 0 && inputHandleTransactionApiPartner.partnerTransId.length === 0 && inputHandleTransactionApiPartner.rrn.length === 0 && inputHandleTransactionApiPartner.statusQris.length === 0 && selectedBrandNamePartner.length === 0 && selectedOutletNamePartner.length === 0 && selectedIdKasirPartner.length === 0}
                                            >
                                                Atur Ulang
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {
                                dataTransactionQrisApiPartner.length !== 0 && (
                                    <div style={{ marginBottom: 30 }} className='mt-3'>
                                        <Link className="export-span" onClick={() => ExportTransactionQrisApiReportHandler(isFilterTransactionQrisApiPartner, (inputHandleTransactionApiPartner.idTransaksi), inputHandleTransactionApiPartner.partnerTransId, partnerId, inputHandleTransactionApiPartner.rrn, (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0), (selectedBrandNamePartner.length !== 0 ? selectedBrandNamePartner.map((item, idx) => item.value) : 0), (selectedOutletNamePartner.length !== 0 ? selectedOutletNamePartner.map((item, idx) => item.value) : 0), (selectedIdKasirPartner.length !== 0 ? selectedIdKasirPartner.map((item, idx) => item.value) : 0), inputHandleTransactionApiPartner.statusQris, inputHandleTransactionApiPartner.periode, dateRangeTransactionQrisApiPartner, language === null ? 'EN' : language.flagName, user_role)}>Export</Link>
                                    </div>
                                )
                            }
                            <div className="div-table mt-5 pb-4">
                                <DataTable
                                    columns={columnsPartner}
                                    data={dataTransactionQrisApiPartner}
                                    customStyles={customStylesQris}
                                    highlightOnHover
                                    progressPending={pendingTransactionQrisApiPartner}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageTransactionQrisApiPartner}</div>
                                <Pagination
                                    activePage={activePageTransactionQrisApiPartner}
                                    itemsCountPerPage={pageNumberTransactionQrisApiPartner.row_per_page}
                                    totalItemsCount={(pageNumberTransactionQrisApiPartner.row_per_page*pageNumberTransactionQrisApiPartner.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeTransactionQrisApiPartner}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <span className='breadcrumbs-span' style={{ cursor: "pointer" }}>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; <Link to={"/riwayat-transaksi/transaksi-qris"}>Transaksi</Link> &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS API</span>
                        <div className="head-title">
                            <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Transaksi QRIS API</h2>
                        </div>
                        <div className='base-content mt-3'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                            <Row className=''>
                                <Col xs={4} className="d-flex justify-content-between align-items-center qrisInput mt-4">
                                    <span>ID Transaksi</span>
                                    <input name="idTransaksi" value={inputHandleTransactionApiAdmin.idTransaksi} onChange={(e) => handleChangeTransactionQrisApiAdmin(e)} type='text' className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Periode</span>
                                    <Form.Select name='periode' value={inputHandleTransactionApiAdmin.periode} onChange={(e) => handleChangePeriodeTransactionQrisApiAdmin(e)} className="input-text-riwayat ms-3">
                                        <option defaultChecked disabled value={0}>Pilih Periode</option>
                                        <option value={2}>Hari Ini</option>
                                        <option value={3}>Kemarin</option>
                                        <option value={4}>7 Hari Terakhir</option>
                                        <option value={5}>Bulan Ini</option>
                                        <option value={6}>Bulan Kemarin</option>
                                        <option value={7}>Pilih Range Tanggal</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span className="me-4">RRN</span>
                                    <input name="rrn" value={inputHandleTransactionApiAdmin.rrn} onChange={(e) => handleChangeTransactionQrisApiAdmin(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan RRN'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Partner Trans ID</span>
                                    <input name="partnerTransId" value={inputHandleTransactionApiAdmin.partnerTransId} onChange={(e) => handleChangeTransactionQrisApiAdmin(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan Partner Trans ID'/>
                                </Col>
                                <Col
                                    xs={4}
                                    className='text-end mt-4'
                                    style={{ display: showDateTransactionQrisApiAdmin }}
                                >
                                    <DateRangePicker
                                        onChange={pickDateTransactionQrisApiAdmin}
                                        value={stateTransactionQrisApiAdmin}
                                        clearIcon={null}
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span >Nama Partner</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataGrupInQris}
                                            value={selectedGrupName}
                                            onChange={(selected) => handleChangePartnerNameAdmin(selected)}
                                            placeholder="Pilih Nama Partner"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Brand</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataBrandInQris}
                                            value={selectedBrandNameAdmin}
                                            onChange={(selected) => handleChangeBrandAdmin(selected)}
                                            placeholder="Pilih Brand"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Nama Outlet</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataOutletInQris}
                                            value={selectedOutletNameAdmin}
                                            onChange={(selected) => handleChangeOutletAdmin(selected)}
                                            placeholder="Pilih Outlet"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>ID Kasir</span>
                                    <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataIdKasirInQris}
                                            value={selectedIdKasirAdmin}
                                            onChange={(selected) => handleChangeIdKasirAdmin(selected)}
                                            placeholder="Pilih Kasir"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                            filterOption={customFilter}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Status</span>
                                    <Form.Select name="statusQris" value={inputHandleTransactionApiAdmin.statusQris} onChange={(e) => handleChangeTransactionQrisApiAdmin(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                        <option defaultChecked disabled value={""}>Pilih Status</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={4}>Gagal</option>
                                        <option value={5}>Menunggu Pembayaran</option>
                                        <option value={6}>Kadaluwarsa</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                    <span>Channel Pembayaran</span>
                                    <Form.Select name="channelPembayaran" value={inputHandleTransactionApiAdmin.channelPembayaran} onChange={(e) => handleChangeTransactionQrisApiAdmin(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                        <option defaultChecked disabled value={0}>Pilih Channel Pembayaran</option>
                                        {/* <option value={2}>Semua Channel</option> */}
                                        <option value={1}>QRIS</option>
                                        <option value={2}>AliPay</option>
                                        <option value={3}>WeChatPay</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => filterTransactionQrisApiReport((inputHandleTransactionApiAdmin.idTransaksi), inputHandleTransactionApiAdmin.partnerTransId, partnerId, inputHandleTransactionApiAdmin.rrn, (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0), (selectedBrandNameAdmin.length !== 0 ? selectedBrandNameAdmin.map((item, idx) => item.value) : 0), (selectedOutletNameAdmin.length !== 0 ? selectedOutletNameAdmin.map((item, idx) => item.value) : 0), (selectedIdKasirAdmin.length !== 0 ? selectedIdKasirAdmin.map((item, idx) => item.value) : 0), inputHandleTransactionApiAdmin.statusQris, inputHandleTransactionApiAdmin.periode, dateRangeTransactionQrisApiAdmin, 1, 10, language === null ? 'EN' : language.flagName, inputHandleTransactionApiAdmin.channelPembayaran)}
                                                className={(inputHandleTransactionApiAdmin.periode !== 0 || dateRangeTransactionQrisApiAdmin.length !== 0 || (dateRangeTransactionQrisApiAdmin.length !== 0 && inputHandleTransactionApiAdmin.idTransaksi.length !== 0) || (dateRangeTransactionQrisApiAdmin.length !== 0 && inputHandleTransactionApiAdmin.partnerTransId.length !== 0) || (dateRangeTransactionQrisApiAdmin.length !== 0 && inputHandleTransactionApiAdmin.rrn.length !== 0) || (dateRangeTransactionQrisApiAdmin.length !== 0 && inputHandleTransactionApiAdmin.statusQris.length !== 0) ? 'btn-ez-on' : 'btn-ez')}
                                                disabled={inputHandleTransactionApiAdmin.periode === 0 || (inputHandleTransactionApiAdmin.periode === 0 && inputHandleTransactionApiAdmin.idTransaksi.length === 0) || (inputHandleTransactionApiAdmin.periode === 0 && inputHandleTransactionApiAdmin.partnerTransId.length === 0) || (inputHandleTransactionApiAdmin.periode === 0 && inputHandleTransactionApiAdmin.rrn.length === 0) || (inputHandleTransactionApiAdmin.periode === 0 && inputHandleTransactionApiAdmin.rrn.length === 0) || (inputHandleTransactionApiAdmin.periode === 0 && inputHandleTransactionApiAdmin.statusQris.length === 0)}
                                            >
                                                Terapkan
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => resetButtonTransactionQrisApi("admin")}
                                                className={(inputHandleTransactionApiAdmin.periode !== 0 || dateRangeTransactionQrisApiAdmin.length !== 0 || inputHandleTransactionApiAdmin.idTransaksi.length !== 0 || inputHandleTransactionApiAdmin.partnerTransId.length !== 0 || inputHandleTransactionApiAdmin.rrn.length !== 0 || inputHandleTransactionApiAdmin.statusQris.length !== 0 || selectedGrupName.length !== 0 || selectedBrandNameAdmin.length !== 0 || selectedOutletNameAdmin.length !== 0 || selectedIdKasirAdmin.length !== 0) ? 'btn-reset' : 'btn-ez-reset'}
                                                disabled={inputHandleTransactionApiAdmin.periode === 0 && dateRangeTransactionQrisApiAdmin.length === 0 && inputHandleTransactionApiAdmin.idTransaksi.length === 0 && inputHandleTransactionApiAdmin.partnerTransId.length === 0 && inputHandleTransactionApiAdmin.rrn.length === 0 && inputHandleTransactionApiAdmin.statusQris.length === 0 && selectedGrupName.length === 0 && selectedBrandNameAdmin.length === 0 && selectedOutletNameAdmin.length === 0 && selectedIdKasirAdmin.length === 0}
                                            >
                                                Atur Ulang
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {
                                dataTransactionQrisApiAdmin.length !== 0 && (
                                    <div style={{ marginBottom: 30 }} className='mt-3'>
                                        <Link className="export-span" onClick={() => ExportTransactionQrisApiReportHandler(isFilterTransactionQrisApiAdmin, (inputHandleTransactionApiAdmin.idTransaksi), inputHandleTransactionApiAdmin.partnerTransId, partnerId, inputHandleTransactionApiAdmin.rrn, (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0), (selectedBrandNameAdmin.length !== 0 ? selectedBrandNameAdmin.map((item, idx) => item.value) : 0), (selectedOutletNameAdmin.length !== 0 ? selectedOutletNameAdmin.map((item, idx) => item.value) : 0), (selectedIdKasirAdmin.length !== 0 ? selectedIdKasirAdmin.map((item, idx) => item.value) : 0), inputHandleTransactionApiAdmin.statusQris, inputHandleTransactionApiAdmin.periode, dateRangeTransactionQrisApiAdmin, language === null ? 'EN' : language.flagName, user_role)}>Export</Link>
                                    </div>
                                )
                            }
                            <div className="div-table mt-5 pb-4">
                                <DataTable
                                    columns={columnsAdmin}
                                    data={dataTransactionQrisApiAdmin}
                                    customStyles={customStylesQris}
                                    highlightOnHover
                                    progressPending={pendingTransactionQrisApiAdmin}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageTransactionQrisApiAdmin}</div>
                                <Pagination
                                    activePage={activePageTransactionQrisApiAdmin}
                                    itemsCountPerPage={pageNumberTransactionQrisApiAdmin.row_per_page}
                                    totalItemsCount={(pageNumberTransactionQrisApiAdmin.row_per_page*pageNumberTransactionQrisApiAdmin.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeTransactionQrisApiAdmin}
                                />
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default TransaksiQrisApi