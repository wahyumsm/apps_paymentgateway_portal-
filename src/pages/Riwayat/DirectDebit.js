import { Button, Col, Container, Form, Modal, Row } from '@themesberg/react-bootstrap';
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import { BaseURL, convertToRupiah, errorCatch, getRole, getToken, language, replaceText, setUserSession, CustomLoader } from '../../function/helpers';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import encryptData from '../../function/encryptData';
import axios from 'axios';
import ReactSelect, { components } from 'react-select';
import Pagination from 'react-js-pagination';
import { DateRangePicker } from 'rsuite';
import * as XLSX from "xlsx"
import { eng } from '../../components/Language';

const RiwayatDirectDebit = () => {

    const user_role = getRole()
    const access_token = getToken();
    const history = useHistory();
    const [partnerId, setPartnerId] = useState("")
    const [dataListUser, setDataListUser] = useState([])
    const [selectedNamaUserDirectDebit, setSelectedNamaUserDirectDebit] = useState([])
    const [dataDirectDebit, setDataDirectDebit] = useState([])
    const [dataListPartner, setDataListPartner] = useState([])
    const [activePageDirectDebit, setActivePageDirectDebit] = useState(1)
    const [totalPageDirectDebit, setTotalPageDirectDebit] = useState(0)
    const [pageNumberDirectDebit, setPageNumberDirectDebit] = useState({})
    const [isFilterDirectDebit, setIsFilterDirectDebit] = useState(false)
    const [showModalDetailDirectDebit, setShowModalDetailDirectDebit] = useState(false)
    const [dateRangeDirectDebit, setDateRangeDirectDebit] = useState([])
    const [showDateDirectDebit, setShowDateDirectDebit] = useState("none")
    const [stateDirectDebit, setStateDirectDebit] = useState(null)
    const [openDetailFee, setOpenDetailFee] = useState(false)
    const [dataDetail, setDataDetail] = useState({})
    const [pendingDirectDebit, setPendingDirectDebit] = useState(true)

    const [selectedPartnerDirectDebit, setSelectedPartnerDirectDebit] = useState([])
    const [inputHandle, setInputHandle] = useState({
        idTrans: "",
        partnerTransId : "",
        partnerId: "",
        statusId: [],
        fiturId: 0,
        periode: 0,
    })

    const { combine, allowedMaxDays, afterToday } = DateRangePicker;
    const currentDate = new Date().toISOString().split('T')[0]
    const oneMonthAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate() + 1).toISOString().split('T')[0]
    const column = [{}]
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

    const showCheckboxes = () => {
        if (!openDetailFee) {
          setOpenDetailFee(true);
        } else {
          setOpenDetailFee(false);
        }
    };

    function handleChange(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name] : e.target.value
        })
    }

    function handlePageChangeRiwayatDirectDebit(page) {
        if (isFilterDirectDebit) {
            setActivePageDirectDebit(page);
            filterListDirectDebit(Number(inputHandle.idTrans), dateRangeDirectDebit, inputHandle.periode, user_role === "102" ? inputHandle.partnerId : selectedPartnerDirectDebit.length !== 0 ? selectedPartnerDirectDebit[0].value : "", selectedNamaUserDirectDebit[0].value, inputHandle.partnerTransId, inputHandle.fiturId, inputHandle.statusId, page, 10, language === null ? 'EN' : language.flagName)
        } else {
            setActivePageDirectDebit(page);
            getDirectDebit(page, user_role === "102" ? partnerId : "", language === null ? 'EN' : language.flagName);
        }
    }

    function handleChangePeriodeDirectDebit(e) {
        if (e.target.value === "7") {
            setShowDateDirectDebit("")
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateDirectDebit("none")
            setDateRangeDirectDebit([])
            setInputHandle({
                ...inputHandle,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateDirectDebit(item) {
        setStateDirectDebit(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangeDirectDebit(item)
        }
    }

    async function userDetails() {
        try {
          const auth = "Bearer " + access_token
          const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const userDetail = await axios.post(BaseURL + "/Account/GetUserProfile", { data: "" }, { headers: headers })
          // console.log(userDetail, 'ini user detal funct');
          if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length === 0) {
            setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
            getDirectDebit(activePageDirectDebit, userDetail.data.response_data.muser_partnerdtl_id, language === null ? 'EN' : language.flagName)
          } else if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length !== 0) {
            setUserSession(userDetail.data.response_new_token)
            setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
            getDirectDebit(activePageDirectDebit, userDetail.data.response_data.muser_partnerdtl_id, language === null ? 'EN' : language.flagName)
          }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    async function listPartner() {
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

    async function listUser() {
        try {
          const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"partner_id": "", "mobile_number":""}`)
            const headers = {
              'Content-Type':'application/json',
              'Authorization' : auth
          }
          const dataUser = await axios.post(BaseURL + "/Home/GetAllDirectDebitUser", { data: dataParams }, { headers: headers })
        //   console.log(dataUser, 'ini user detal funct');
          if (dataUser.status === 200 && dataUser.data.response_code === 200 && dataUser.data.response_new_token.length === 0) {
            let newDataUser = []
            dataUser.data.response_data.results.forEach(e => {
                let obj = {}
                obj.value = e.mdirdebituser_mobile
                obj.label = e.mdirdebituser_fullname
                newDataUser.push(obj)
            })
            setDataListUser(newDataUser)
          } else if (dataUser.status === 200 && dataUser.data.response_code === 200 && dataUser.data.response_new_token.length !== 0) {
            setUserSession(dataUser.data.response_new_token)
            let newDataUser = []
            dataUser.data.response_data.results.forEach(e => {
                let obj = {}
                obj.value = e.mdirdebituser_mobile
                obj.label = e.mdirdebituser_fullname
                newDataUser.push(obj)
            })
            setDataListUser(newDataUser)
          }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    async function getDirectDebit(currentPage, partnerId, lang) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"transactionID":0, "date_from":"", "date_to":"", "dateID": 0, "partner_id": "${user_role === "102" ? partnerId : ""}", "mobile_number":"", "partner_transid": "", "fitur_id": 0, "statusID":[2,4], "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : user_role !== "102" ? "ID" : lang
            }
            const dataRiwayatDirectDebit = await axios.post(BaseURL + "/Report/GetListTransDirectDebit", { data: dataParams }, { headers: headers })
            if (dataRiwayatDirectDebit.data.response_code === 200 && dataRiwayatDirectDebit.status === 200 && dataRiwayatDirectDebit.data.response_new_token.length === 0) {
                dataRiwayatDirectDebit.data.response_data.results = dataRiwayatDirectDebit.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1 }));
                setDataDirectDebit(dataRiwayatDirectDebit.data.response_data.results)
                setPageNumberDirectDebit(dataRiwayatDirectDebit.data.response_data)
                setTotalPageDirectDebit(dataRiwayatDirectDebit.data.response_data.max_page)
                setPendingDirectDebit(false)
            } else if (dataRiwayatDirectDebit.data.response_code === 200 && dataRiwayatDirectDebit.status === 200 && dataRiwayatDirectDebit.data.response_new_token.length !== 0) {
                setUserSession(dataRiwayatDirectDebit.data.response_new_token)
                dataRiwayatDirectDebit.data.response_data.results = dataRiwayatDirectDebit.data.response_data.results.map((obj, id) => ({ ...obj, number: (currentPage > 1) ? (id + 1)+((currentPage-1)*10) : id + 1 }));
                setDataDirectDebit(dataRiwayatDirectDebit.data.response_data.results)
                setPageNumberDirectDebit(dataRiwayatDirectDebit.data.response_data)
                setTotalPageDirectDebit(dataRiwayatDirectDebit.data.response_data.max_page)
                setPendingDirectDebit(false)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    async function filterListDirectDebit(idTrans, periode, dateId, partnerId, userMobile, partnerTransId, fiturId, statusId, page, rowPerPage, lang) {
        try {
            setPendingDirectDebit(true)
            setIsFilterDirectDebit(true)
            setActivePageDirectDebit(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"transactionID": "${idTrans.length !== 0 ? idTrans : ""}", "date_from":"${periode.length !== 0 ? periode[0] : ""}", "date_to":"${periode.length !== 0 ? periode[1] : ""}", "dateID": ${dateId}, "partner_id": "${partnerId}", "mobile_number":"${userMobile}", "partner_transid": "${partnerTransId}", "fitur_id": ${fiturId}, "statusID": [${(statusId.length !== 0) ? statusId : [2,4]}], "page":${(page !== 0) ? page : 1}, "row_per_page": ${rowPerPage !== 0 ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                'Accept-Language' : user_role !== "102" ? "ID" : lang
            }
            const dataRiwayatDirectDebit = await axios.post(BaseURL + "/Report/GetListTransDirectDebit", { data: dataParams }, { headers: headers })
            if (dataRiwayatDirectDebit.data.response_code === 200 && dataRiwayatDirectDebit.status === 200 && dataRiwayatDirectDebit.data.response_new_token.length === 0) {
                dataRiwayatDirectDebit.data.response_data.results = dataRiwayatDirectDebit.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1 }));
                setDataDirectDebit(dataRiwayatDirectDebit.data.response_data.results)
                setPageNumberDirectDebit(dataRiwayatDirectDebit.data.response_data)
                setTotalPageDirectDebit(dataRiwayatDirectDebit.data.response_data.max_page)
                setPendingDirectDebit(false)
            } else if (dataRiwayatDirectDebit.data.response_code === 200 && dataRiwayatDirectDebit.status === 200 && dataRiwayatDirectDebit.data.response_new_token.length !== 0) {
                setUserSession(dataRiwayatDirectDebit.data.response_new_token)
                dataRiwayatDirectDebit.data.response_data.results = dataRiwayatDirectDebit.data.response_data.results.map((obj, id) => ({ ...obj, number: (page > 1) ? (id + 1)+((page-1)*10) : id + 1 }));
                setDataDirectDebit(dataRiwayatDirectDebit.data.response_data.results)
                setPageNumberDirectDebit(dataRiwayatDirectDebit.data.response_data)
                setTotalPageDirectDebit(dataRiwayatDirectDebit.data.response_data.max_page)
                setPendingDirectDebit(false)
            }
        } catch (error) {
          // console.log(error)
          history.push(errorCatch(error.response.status))
        }
    }

    function getDetailDataDirectDebit (number) {
        const findData = dataDirectDebit.find((item) => item.number === number)
        // console.log(findData);
        setDataDetail(findData)
        setShowModalDetailDirectDebit(true)
    }


    function resetButtonDirectDebit(param) {
        getDirectDebit(activePageDirectDebit, user_role === "102" ? partnerId : "", language === null ? 'EN' : language.flagName)
        if (param === "Direct Debit") {
            setInputHandle({
                ...inputHandle,
                idTrans: "",
                partnerId: "",
                partnerTransId: "",
                statusId: [],
                periode: 0,
                fiturId: 0
            })
            setSelectedPartnerDirectDebit([])
            setStateDirectDebit(null)
            setDateRangeDirectDebit([])
            setShowDateDirectDebit("none")
        }
    }

    function ExportDataDirectDebit (isFilter, idTrans, periode, dateId, partnerId, userMobile, partnerTransId, fiturId, statusId) {
        if (isFilter) {
            async function dataExportFilter (idTrans, periode, dateId, partnerId, userMobile, partnerTransId, fiturId, statusId) {
                try {
                    const auth = "Bearer " + getToken()
                    const dataParams = encryptData(`{"transactionID":"${idTrans.length !== 0 ? idTrans : ""}", "date_from":"${periode.length !== 0 ? periode[0] : ""}", "date_to":"${periode.length !== 0 ? periode[1] : ""}", "dateID": ${dateId}, "partner_id": "${partnerId}", "mobile_number":"${userMobile}", "partner_transid": "${partnerTransId}", "fitur_id": ${fiturId}, "statusID": [${(statusId.length !== 0) ? statusId : [2,4]}], "page":1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type':'application/json',
                        'Authorization' : auth
                    }
                    const listDataDirectDebit = await axios.post(BaseURL + "/Report/GetListTransDirectDebit", { data: dataParams }, { headers: headers })
                    // console.log(listDataDirectDebit, "ini data riwayat");
                    if (listDataDirectDebit.data.response_code === 200 && listDataDirectDebit.status === 200 && listDataDirectDebit.data.response_new_token.length === 0) {
                        const data = listDataDirectDebit.data.response_data.results;
                        let dataExcel = []
                        if (user_role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].tdirectdebit_id, [language === null ? eng.waktu : language.waktu]: data[i].tdirectdebit_crtdt_format, [language === null ? eng.namaUser : language.namaUser]: data[i].mdirdebituser_fullname, [language === null ? eng.noHandphone : language.noHandphone]: data[i].mdirdebituser_mobile, [language === null ? eng.channelDirectDebit : language.channelDirectDebit]: data[i].mpaytype_name, [language === null ? eng.nominalTransaksi : language.nominalTransaksi]: data[i].tdirectdebit_partner_fee, [language === null ? eng.status : language.status]: data[i].mppobstatus_name})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdirectdebit_id, "Waktu": data[i].tdirectdebit_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nama User": data[i].mdirdebituser_fullname, "Partner Trans ID": data[i].tdirectdebit_transaction_id, "Channel Direct Debit": data[i].mpaytype_name, "No Handphone": data[i].mdirdebituser_mobile, "Nominal Transaksi": data[i].tdirectdebit_amount, "Biaya Admin": data[i].tdirectdebit_fee, "Biaya Bank": data[i].tdirectdebit_bank_fee, "Biaya Pajak": data[i].tdirectdebit_tax_fee, "Total Biaya": data[i].tdirectdebit_total_fee, "Total Akhir": data[i].tdirectdebit_total_amount, "Status": data[i].mppobstatus_name})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.riwayatTransaksiDirectDebitExcel : language.riwayatTransaksiDirectDebitExcel} .xlsx"`);
                    } else if (listDataDirectDebit.data.response_code === 200 && listDataDirectDebit.status === 200 && listDataDirectDebit.data.response_new_token.length !== 0) {
                        setUserSession(listDataDirectDebit.data.response_new_token)
                        const data = listDataDirectDebit.data.response_data.results;
                        let dataExcel = []
                        if (user_role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].tdirectdebit_id, [language === null ? eng.waktu : language.waktu]: data[i].tdirectdebit_crtdt_format, [language === null ? eng.namaUser : language.namaUser]: data[i].mdirdebituser_fullname, [language === null ? eng.noHandphone : language.noHandphone]: data[i].mdirdebituser_mobile, [language === null ? eng.channelDirectDebit : language.channelDirectDebit]: data[i].mpaytype_name, [language === null ? eng.nominalTransaksi : language.nominalTransaksi]: data[i].tdirectdebit_partner_fee, [language === null ? eng.status : language.status]: data[i].mppobstatus_name})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdirectdebit_id, "Waktu": data[i].tdirectdebit_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nama User": data[i].mdirdebituser_fullname, "Partner Trans ID": data[i].tdirectdebit_transaction_id, "Channel Direct Debit": data[i].mpaytype_name, "No Handphone": data[i].mdirdebituser_mobile, "Nominal Transaksi": data[i].tdirectdebit_amount, "Biaya Admin": data[i].tdirectdebit_fee, "Biaya Bank": data[i].tdirectdebit_bank_fee, "Biaya Pajak": data[i].tdirectdebit_tax_fee, "Total Biaya": data[i].tdirectdebit_total_fee, "Total Akhir": data[i].tdirectdebit_total_amount, "Status": data[i].mppobstatus_name})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.riwayatTransaksiDirectDebitExcel : language.riwayatTransaksiDirectDebitExcel} .xlsx"`);
                    }
                } catch (error) {
                  // console.log(error)
                  history.push(errorCatch(error.response.status))
                }
            }
            dataExportFilter(idTrans, periode, dateId, partnerId, userMobile, partnerTransId, fiturId, statusId)
        } else {
            async function dataExportDefault () {
                try {
                    const auth = "Bearer " + getToken()
                    const dataParams = encryptData(`{"transactionID": 0, "date_from":"", "date_to":"", "dateID":1, "partner_id": "", "mobile_number":"", "partner_transid": "", "fitur_id": 0, "statusID":[2,4], "page":1, "row_per_page": 1000000}`)
                    const headers = {
                        'Content-Type':'application/json',
                        'Authorization' : auth
                    }
                    const listDataDirectDebit = await axios.post(BaseURL + "/Report/GetListTransDirectDebit", { data: dataParams }, { headers: headers })
                    // console.log(listDataDirectDebit, "ini data riwayat");
                    if (listDataDirectDebit.data.response_code === 200 && listDataDirectDebit.status === 200 && listDataDirectDebit.data.response_new_token.length === 0) {
                        const data = listDataDirectDebit.data.response_data.results;
                        let dataExcel = []
                        if (user_role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].tdirectdebit_id, [language === null ? eng.waktu : language.waktu]: data[i].tdirectdebit_crtdt_format, [language === null ? eng.namaUser : language.namaUser]: data[i].mdirdebituser_fullname, [language === null ? eng.noHandphone : language.noHandphone]: data[i].mdirdebituser_mobile, [language === null ? eng.channelDirectDebit : language.channelDirectDebit]: data[i].mpaytype_name, [language === null ? eng.nominalTransaksi : language.nominalTransaksi]: data[i].tdirectdebit_partner_fee, [language === null ? eng.status : language.status]: data[i].mppobstatus_name})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdirectdebit_id, "Waktu": data[i].tdirectdebit_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nama User": data[i].mdirdebituser_fullname, "Partner Trans ID": data[i].tdirectdebit_transaction_id, "Channel Direct Debit": data[i].mpaytype_name, "No Handphone": data[i].mdirdebituser_mobile, "Nominal Transaksi": data[i].tdirectdebit_amount, "Biaya Admin": data[i].tdirectdebit_fee, "Biaya Bank": data[i].tdirectdebit_bank_fee, "Biaya Pajak": data[i].tdirectdebit_tax_fee, "Total Biaya": data[i].tdirectdebit_total_fee, "Total Akhir": data[i].tdirectdebit_total_amount, "Status": data[i].mppobstatus_name})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.riwayatTransaksiDirectDebitExcel : language.riwayatTransaksiDirectDebitExcel} .xlsx"`);
                    } else if (listDataDirectDebit.data.response_code === 200 && listDataDirectDebit.status === 200 && listDataDirectDebit.data.response_new_token.length !== 0) {
                        setUserSession(listDataDirectDebit.data.response_new_token)
                        const data = listDataDirectDebit.data.response_data.results;
                        let dataExcel = []
                        if (user_role === "102") {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ [language === null ? eng.no : language.no]: i + 1, [language === null ? eng.idTransaksi : language.idTransaksi]: data[i].tdirectdebit_id, [language === null ? eng.waktu : language.waktu]: data[i].tdirectdebit_crtdt_format, [language === null ? eng.namaUser : language.namaUser]: data[i].mdirdebituser_fullname, [language === null ? eng.noHandphone : language.noHandphone]: data[i].mdirdebituser_mobile, [language === null ? eng.channelDirectDebit : language.channelDirectDebit]: data[i].mpaytype_name, [language === null ? eng.nominalTransaksi : language.nominalTransaksi]: data[i].tdirectdebit_partner_fee, [language === null ? eng.status : language.status]: data[i].mppobstatus_name})
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Transaksi": data[i].tdirectdebit_id, "Waktu": data[i].tdirectdebit_crtdt_format, "Nama Partner": data[i].mpartner_name, "Nama User": data[i].mdirdebituser_fullname, "Partner Trans ID": data[i].tdirectdebit_transaction_id, "Channel Direct Debit": data[i].mpaytype_name, "No Handphone": data[i].mdirdebituser_mobile, "Nominal Transaksi": data[i].tdirectdebit_amount, "Biaya Admin": data[i].tdirectdebit_fee, "Biaya Bank": data[i].tdirectdebit_bank_fee, "Biaya Pajak": data[i].tdirectdebit_tax_fee, "Total Biaya": data[i].tdirectdebit_total_fee, "Total Akhir": data[i].tdirectdebit_total_amount, "Status": data[i].mppobstatus_name})
                            }
                        }
                        let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                        let workBook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                        XLSX.writeFile(workBook, `${language === null ? eng.riwayatTransaksiDirectDebitExcel : language.riwayatTransaksiDirectDebitExcel} .xlsx"`);
                    }
                } catch (error) {
                  // console.log(error)
                  history.push(errorCatch(error.response.status))
                }
            }
            dataExportDefault()
        }
    }

    const columnPartner = [
        {
            name: language === null ? eng.no : language.no,
            selector: row => row.number,
            width: "67px"
        },
        {
            name: language === null ? eng.idTransaksi : language.idTransaksi,
            selector: row => row.tdirectdebit_id
        },
        {
            name: language === null ? eng.waktu : language.waktu,
            selector: row => row.tdirectdebit_crtdt_format,
            width: "145px"
        },
        {
            name: language === null ? eng.namaUser : language.namaUser,
            selector: row => row.mdirdebituser_fullname,
            width: "160px"
        },
        {
            name: language === null ? eng.noHandphone : language.noHandphone,
            selector: row => row.mdirdebituser_mobile === null ? "-" : row.mdirdebituser_mobile,
            width: "170px"
        },
        {
            name: language === null ? eng.channelDirectDebit : language.channelDirectDebit,
            selector: row => replaceText(row.mpaytype_name),
            width: "185px"
        },
        {
            name: language === null ? eng.nominalTransaksi : language.nominalTransaksi,
            selector: row => convertToRupiah(row.tdirectdebit_amount, false, 0),
            width: "170px"
        },
        {
            name: language === null ? eng.status : language.status,
            selector: row => row.mppobstatus_name,
            width: "150px",
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 12px", margin: "6px 0px", width: "50%", borderRadius: 4, fontFamily: "Nunito", fontSize: 14, fontWeight: 600 },
            conditionalCellStyles: [
                {
                    when: row => row.tdirectdebit_ppob_status !== 7,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.tdirectdebit_ppob_status === 7,
                    style: { background: "#FDEAEA", color: "#EE2E2C" }
                }
            ],
        },
    ];

    const columnAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "67px"
        },
        {
            name: 'ID Transaksi',
            selector: row => row.tdirectdebit_id,
            cell: (row) => <div style={{ textDecoration: "underline", color: "#077E86", cursor: "pointer" }} onClick={() => getDetailDataDirectDebit(row.number)}>{row.tdirectdebit_id}</div>,
            width: "130px"
        },
        {
            name: 'Waktu',
            selector: row => row.tdirectdebit_crtdt_format,
            width: "145px"
        },
        {
            name: 'Partner Trans ID',
            selector: row => row.tdirectdebit_transaction_id,
            width: "175px"
        },
        {
            name: 'Nama Partner',
            selector: row => row.mpartner_name,
            width: "180px"
        },
        {
            name: 'Nama User',
            selector: row => row.mdirdebituser_fullname,
            width: "160px"
        },
        {
            name: 'Channel Direct Debit',
            selector: row => replaceText(row.mpaytype_name),
            width: "185px"
        },
        {
            name: 'No Handphone',
            selector: row => row.mdirdebituser_mobile === null ? "-" : row.mdirdebituser_mobile,
            width: "170px"
        },
        {
            name: 'Nominal Transaksi',
            selector: row => convertToRupiah(row.tdirectdebit_amount, false, 0),
            width: "170px"
        },
        {
            name: 'Biaya Admin',
            selector: row => row.tdirectdebit_fee === null ? convertToRupiah(0, false, 0) : convertToRupiah(row.tdirectdebit_fee, false, 0),
            width: "170px"
        },
        {
            name: 'Biaya Bank',
            selector: row => convertToRupiah(row.tdirectdebit_bank_fee, false, 0),
            width: "170px"
        },
        {
            name: 'Biaya Pajak',
            selector: row => convertToRupiah(row.tdirectdebit_tax_fee, false, 0),
            width: "170px"
        },
        {
            name: 'Total Biaya',
            selector: row => convertToRupiah(row.tdirectdebit_total_fee, false, 0),
            width: "170px"
        },
        {
            name: 'Total Akhir',
            selector: row => convertToRupiah(row.tdirectdebit_total_amount, false, 0),
            width: "170px"
        },
        {
            name: 'Status',
            selector: row => row.mppobstatus_name,
            width: "150px",
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 12px", margin: "6px 0px", width: "50%", borderRadius: 4, fontFamily: "Nunito", fontSize: 14, fontWeight: 600 },
            conditionalCellStyles: [
                {
                    when: row => row.tdirectdebit_ppob_status !== 7,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.tdirectdebit_ppob_status === 7,
                    style: { background: "#FDEAEA", color: "#EE2E2C" }
                }
            ],
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

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: '600',
                fontSize: '14px',
                fontFamily: "Exo",
                display: 'flex',
                justifyContent: 'flex-start',
                width: '150px'
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

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        getDirectDebit(activePageDirectDebit, partnerId, language === null ? 'EN' : language.flagName)
        listUser()
        if (user_role !== "102") {
            listPartner()
        } else {
            userDetails()
        }
    }, [])

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span' style={{ fontSize: 14 }}>
                <span style={{ cursor: "pointer" }}>
                    {user_role === "102" ? (language === null ? eng.laporan : language.laporan) : `Beranda`}
                </span>{" "}
                <img alt="" src={breadcrumbsIcon} /> &nbsp;
                <span style={{ cursor: "pointer" }}>
                    {user_role !== "102" ? "Transaksi" : (language === null ? eng.transaksi : language.transaksi)}
                </span>{" "} &nbsp;
                <img alt="" src={breadcrumbsIcon} /> &nbsp;
                    {user_role !== "102" ? "Direct Debit" : (language === null ? eng.directDebit : language.directDebit)}
            </span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>{user_role !== "102" ? "Transaksi" : (language === null ? eng.transaksi : language.transaksi)}</h2>
            </div>
            <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>{user_role === "102" ? (user_role !== "102" ? "Transaksi Direct Debit User" : (language === null ? eng.transaksiDirectDebitUser : language.transaksiDirectDebitUser)) : `Transaksi Direct Debit Partner`}</h2>
            <div className='base-content'>
                <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>{user_role !== "102" ? "Filter" : (language === null ? eng.filter : language.filter)}</span>
                {
                    user_role === "102" ? (
                        <>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>{language === null ? eng.namaUser : language.namaUser}</div>
                                    <div className="dropdown dropTopupPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataListUser}
                                            value={selectedNamaUserDirectDebit}
                                            onChange={(selected) => setSelectedNamaUserDirectDebit([selected])}
                                            placeholder={language === null ? eng.placeholderNamaUser : language.placeholderNamaUser}
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>{language === null ? eng.channel : language.channel}</div>
                                    <Form.Select
                                        name="fiturId"
                                        value={inputHandle.fiturId}
                                        onChange={(e) => handleChange(e)}
                                        className="input-text-ez"
                                    >
                                        <option defaultChecked disabled value={0}>{language === null ? eng.channelDirectDebit : language.channelDirectDebit}</option>
                                        <option value={36}>One Klik</option>
                                        <option value={37}>Mandiri</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>{language === null ? eng.idTransaksi : language.idTransaksi}</div>
                                    <input
                                        type="text"
                                        className="input-text-edit"
                                        placeholder={language === null ? eng.idTransaksi : language.idTransaksi}
                                        name="idTrans"
                                        value={inputHandle.idTrans.length === 0 ? "" : inputHandle.idTrans}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>{language === null ? eng.periode : language.periode} <span style={{ color: "red" }}>*</span></div>
                                    <Form.Select
                                        name="periode"
                                        className="input-text-ez"
                                        value={inputHandle.periode}
                                        onChange={(e) => handleChangePeriodeDirectDebit(e)}
                                    >
                                        <option defaultChecked disabled value={0}>{language === null ? eng.periodeTransaksi : language.periodeTransaksi}</option>
                                        <option value={2}>{language === null ? eng.hariIni : language.hariIni}</option>
                                        <option value={3}>{language === null ? eng.kemarin : language.kemarin}</option>
                                        <option value={4}>{language === null ? eng.tujuhHariTerakhir : language.tujuhHariTerakhir}</option>
                                        <option value={5}>{language === null ? eng.bulanIni : language.bulanIni}</option>
                                        <option value={6}>{language === null ? eng.bulanKemarin : language.bulanKemarin}</option>
                                        <option value={7}>{language === null ? eng.pilihRangeTanggal : language.pilihRangeTanggal}</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>{language === null ? eng.status : language.status}</div>
                                    <Form.Select name="statusId" value={inputHandle.statusId} className='input-text-ez' onChange={(e) => handleChange(e)} style={{ display: "inline" }}>
                                        <option defaultChecked disabled value="">{language === null ? eng.statusTransaksi : language.statusTransaksi}</option>
                                        <option value={2}>{language === null ? eng.berhasil : language.berhasil}</option>
                                        <option value={4}>{language === null ? eng.gagal : language.gagal}</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-3' style={{ display: showDateDirectDebit }}>
                                <Col xs={4}>
                                    <div >
                                        <DateRangePicker
                                            onChange={(e) => pickDateDirectDebit(e)}
                                            ranges={column}
                                            value={stateDirectDebit}
                                            clearIcon={null}
                                            character=' - '
                                            cleanable={true}
                                            placement='bottomStart'
                                            size='lg'
                                            placeholder={language === null ? eng.pilihRangeTanggal : language.pilihRangeTanggal}
                                            disabledDate={combine(allowedMaxDays(90), afterToday())}
                                            className='datePicker'
                                            locale={Locale}
                                            format="yyyy-MM-dd"
                                            defaultCalendarValue={[new Date(`${oneMonthAgo}`), new Date(`${currentDate}`)]}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "8px 16px" }}>
                                            <button
                                                onClick={() => filterListDirectDebit(Number(inputHandle.idTrans), dateRangeDirectDebit, inputHandle.periode, partnerId, selectedNamaUserDirectDebit.length !== 0 ? selectedNamaUserDirectDebit[0].value : "", inputHandle.partnerTransId, inputHandle.fiturId, inputHandle.statusId, 1, 10, language === null ? 'EN' : language.flagName)}
                                                className={(inputHandle.periode !== 0 || dateRangeDirectDebit.length !== 0 || (dateRangeDirectDebit.length !== 0 && inputHandle.idTrans !== 0) || (dateRangeDirectDebit.length !== 0 && inputHandle.partnerTransId.length !== 0) || (dateRangeDirectDebit.length !== 0 && inputHandle.statusId.length !== 0) || ((dateRangeDirectDebit.length !== 0 && inputHandle.fiturId !== 0))) ? 'btn-ez-on' : 'btn-ez'}
                                                disabled={inputHandle.periode === 0 || (inputHandle.periode === 0 && inputHandle.idTrans === 0) || (inputHandle.periode === 0 && inputHandle.partnerTransId.length === 0) || (inputHandle.periode === 0 && inputHandle.statusId.length === 0) || (inputHandle.periode === 0 && inputHandle.fiturId === 0)}
                                            >
                                                {language === null ? eng.terapkan : language.terapkan}
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "8px 16px" }}>
                                            <button
                                                onClick={() => resetButtonDirectDebit("Direct Debit")}
                                                className={(inputHandle.periode !== 0 || dateRangeDirectDebit.length !== 0 || (dateRangeDirectDebit.length !== 0 && inputHandle.idTrans !== 0) || (dateRangeDirectDebit.length !== 0 && inputHandle.partnerTransId.length !== 0) || (dateRangeDirectDebit.length !== 0 && inputHandle.statusId.length !== 0) || (dateRangeDirectDebit.length !== 0 && inputHandle.fiturId !== 0)) ? 'btn-reset'  : 'btn-ez-reset'}
                                                disabled={inputHandle.periode === 0 || (inputHandle.periode === 0 && inputHandle.idTrans === 0) || (inputHandle.periode === 0 && inputHandle.partnerTransId.length === 0) || (inputHandle.periode === 0 && inputHandle.statusId.length === 0) || (inputHandle.periode === 0 && inputHandle.fiturId === 0)}
                                            >
                                                {language === null ? eng.aturUlang : language.aturUlang}
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {
                                dataDirectDebit.length !== 0 &&
                                <div className='mt-3 mb-5'>
                                    <Link onClick={() => ExportDataDirectDebit(isFilterDirectDebit, Number(inputHandle.idTrans), dateRangeDirectDebit, inputHandle.periode, selectedPartnerDirectDebit.length !== 0 ? selectedPartnerDirectDebit[0].value : "", selectedNamaUserDirectDebit.length !== 0 ? selectedNamaUserDirectDebit[0].value : "", inputHandle.partnerTransId, inputHandle.fiturId, inputHandle.statusId)} className='export-span' style={{ textDecoration: "underline", color: "#077E86" }} >{language === null ? eng.export : language.export}</Link>
                                </div>
                            }
                            <div className="div-table mt-3 scroll-direct-debit">
                                <DataTable
                                    columns={columnPartner}
                                    data={dataDirectDebit}
                                    customStyles={customStyles}
                                    noDataComponent={language === null ? eng.tidakAdaData : language.tidakAdaData}
                                    highlightOnHover
                                    progressPending={pendingDirectDebit}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div
                                className='mt-3'
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginTop: -15,
                                    paddingTop: 12,
                                    borderTop: "groove",
                                }}
                            >
                                <div style={{ marginRight: 10, marginTop: 10 }}>
                                {language === null ? eng.totalHalaman : language.totalHalaman} : {totalPageDirectDebit}
                                </div>
                                <Pagination
                                    activePage={activePageDirectDebit}
                                    itemsCountPerPage={pageNumberDirectDebit.row_per_page}
                                    totalItemsCount={
                                        pageNumberDirectDebit.row_per_page * pageNumberDirectDebit.max_page
                                    }
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeRiwayatDirectDebit}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Nama Partner</div>
                                    <div className="dropdown dropDirectDebit" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataListPartner}
                                            value={selectedPartnerDirectDebit}
                                            onChange={(selected) => setSelectedPartnerDirectDebit([selected])}
                                            placeholder="Pilih Nama Partner"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Nama User</div>
                                    <div className="dropdown dropTopupPartner" style={{ width: "11.7rem" }}>
                                        <ReactSelect
                                            closeMenuOnSelect={true}
                                            hideSelectedOptions={false}
                                            options={dataListUser}
                                            value={selectedNamaUserDirectDebit}
                                            onChange={(selected) => setSelectedNamaUserDirectDebit([selected])}
                                            placeholder="Pilih Nama User"
                                            components={{ Option }}
                                            styles={customStylesSelectedOption}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>ID Transaksi</div>
                                    <input
                                        type="text"
                                        className="input-text-edit"
                                        placeholder="Masukkan ID Transaksi"
                                        name="idTrans"
                                        value={inputHandle.idTrans.length === 0 ? "" : inputHandle.idTrans}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Partner Trans ID</div>
                                    <input
                                        type="text"
                                        className="input-text-edit"
                                        placeholder="Masukkan Partner Trans ID"
                                        name="partnerTransId"
                                        value={inputHandle.partnerTransId.length === 0 ? "" : inputHandle.partnerTransId}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Channel</div>
                                    <Form.Select
                                        name="fiturId"
                                        value={inputHandle.fiturId}
                                        onChange={(e) => handleChange(e)}
                                        className="input-text-ez"
                                    >
                                        <option defaultChecked disabled value={0}>Channel Direct Debit</option>
                                        <option value={36}>OneKlik</option>
                                        <option value={37}>Mandiri</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Periode <span style={{ color: "red" }}>*</span></div>
                                    <Form.Select
                                        name="periode"
                                        className="input-text-ez"
                                        value={inputHandle.periode}
                                        onChange={(e) => handleChangePeriodeDirectDebit(e)}
                                    >
                                        <option defaultChecked disabled value={0}>Periode Transaksi</option>
                                        <option value={2}>Hari Ini</option>
                                        <option value={3}>Kemarin</option>
                                        <option value={4}>7 Hari Terakhir</option>
                                        <option value={5}>Bulan Ini</option>
                                        <option value={6}>Bulan Kemarin</option>
                                        <option value={7}>Pilih Range Tanggal</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center">
                                    <div>Status</div>
                                    <Form.Select name="statusId" value={inputHandle.statusId} className='input-text-ez' onChange={(e) => handleChange(e)} style={{ display: "inline" }}>
                                        <option defaultChecked disabled value="">Status Transaksi</option>
                                        <option value={2}>Berhasil</option>
                                        <option value={4}>Gagal</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4}></Col>
                                <Col xs={4}>
                                    <div style={{ display: showDateDirectDebit }}>
                                        <DateRangePicker
                                            onChange={(e) => pickDateDirectDebit(e)}
                                            ranges={column}
                                            value={stateDirectDebit}
                                            clearIcon={null}
                                            character=' - '
                                            cleanable={true}
                                            placement='bottomEnd'
                                            size='lg'
                                            placeholder="Select Date Range"
                                            disabledDate={combine(allowedMaxDays(90), afterToday())}
                                            className='datePicker'
                                            locale={Locale}
                                            format="yyyy-MM-dd"
                                            defaultCalendarValue={[new Date(`${oneMonthAgo}`), new Date(`${currentDate}`)]}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4}></Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col xs={6} style={{ width: "unset", padding: "8px 16px" }}>
                                    <button
                                        onClick={() => filterListDirectDebit(Number(inputHandle.idTrans), dateRangeDirectDebit, inputHandle.periode, selectedPartnerDirectDebit.length !== 0 ? selectedPartnerDirectDebit[0].value : "", selectedNamaUserDirectDebit.length !== 0 ? selectedNamaUserDirectDebit[0].value : "", inputHandle.partnerTransId, inputHandle.fiturId, inputHandle.statusId, 1, 10, language === null ? 'EN' : language.flagName)}
                                        className={(inputHandle.periode !== 0 || dateRangeDirectDebit.length !== 0 || (dateRangeDirectDebit.length !== 0 && inputHandle.idTrans !== 0) || (dateRangeDirectDebit.length !== 0 && inputHandle.partnerTransId.length !== 0) || (dateRangeDirectDebit.length !== 0 && inputHandle.statusId.length !== 0) || (dateRangeDirectDebit.length !== 0 && selectedPartnerDirectDebit.length !== 0) || (dateRangeDirectDebit.length !== 0 && inputHandle.fiturId !== 0)) ? 'btn-ez-on' : 'btn-ez'}
                                        disabled={inputHandle.periode === 0 || (inputHandle.periode === 0 && inputHandle.idTrans === 0) || (inputHandle.periode === 0 && inputHandle.partnerTransId.length === 0) || (inputHandle.periode === 0 && inputHandle.statusId.length === 0) || (inputHandle.periode === 0 && selectedPartnerDirectDebit.length === 0) || (inputHandle.periode === 0 && inputHandle.fiturId === 0)}
                                    >
                                        Terapkan
                                    </button>
                                </Col>
                                <Col xs={6} style={{ width: "unset", padding: "8px 16px" }}>
                                    <button
                                        onClick={() => resetButtonDirectDebit("Direct Debit")}
                                        className={(inputHandle.periode !== 0 || dateRangeDirectDebit.length !== 0 || (dateRangeDirectDebit.length !== 0 && inputHandle.idTrans !== 0) || (dateRangeDirectDebit.length !== 0 && inputHandle.partnerTransId.length !== 0) || (dateRangeDirectDebit.length !== 0 && inputHandle.statusId.length !== 0) || (dateRangeDirectDebit.length !== 0 && selectedPartnerDirectDebit.length !== 0) || (dateRangeDirectDebit.length !== 0 && inputHandle.fiturId !== 0)) ? 'btn-reset'  : 'btn-ez-reset'}
                                        disabled={inputHandle.periode === 0 || (inputHandle.periode === 0 && inputHandle.idTrans === 0) || (inputHandle.periode === 0 && inputHandle.partnerTransId.length === 0) || (inputHandle.periode === 0 && inputHandle.statusId.length === 0) || (inputHandle.periode === 0 && selectedPartnerDirectDebit.length === 0) || (inputHandle.periode === 0 && inputHandle.fiturId === 0)}
                                    >
                                        Atur Ulang
                                    </button>
                                </Col>
                            </Row>
                            {
                                dataDirectDebit.length !== 0 &&
                                <div className='mt-3 mb-5'>
                                    <Link onClick={() => ExportDataDirectDebit(isFilterDirectDebit, inputHandle.idTrans, dateRangeDirectDebit, inputHandle.periode, selectedPartnerDirectDebit.length !== 0 ? selectedPartnerDirectDebit[0].value : "", selectedNamaUserDirectDebit.length !== 0 ? selectedNamaUserDirectDebit[0].value : "", inputHandle.partnerTransId, inputHandle.fiturId, inputHandle.statusId)} className='export-span' style={{ textDecoration: "underline", color: "#077E86" }} >Export</Link>
                                </div>
                            }
                            <div className="div-table mt-3 scroll-direct-debit">
                                <DataTable
                                    columns={columnAdmin}
                                    data={dataDirectDebit}
                                    customStyles={customStyles}
                                    highlightOnHover
                                    progressPending={pendingDirectDebit}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div
                                className='mt-3'
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginTop: -15,
                                    paddingTop: 12,
                                    borderTop: "groove",
                                }}
                            >
                                <div style={{ marginRight: 10, marginTop: 10 }}>
                                    Total Page: {totalPageDirectDebit}
                                </div>
                                <Pagination
                                    activePage={activePageDirectDebit}
                                    itemsCountPerPage={pageNumberDirectDebit.row_per_page}
                                    totalItemsCount={
                                        pageNumberDirectDebit.row_per_page * pageNumberDirectDebit.max_page
                                    }
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeRiwayatDirectDebit}
                                />
                            </div>
                            <Modal centered show={showModalDetailDirectDebit} onHide={() => setShowModalDetailDirectDebit(false)} style={{ borderRadius: 8 }}>
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
                                                <Col>{dataDetail.tdirectdebit_transaction_id}</Col>
                                                <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 4, maxWidth: 175, width: "100%", height: 32, fontWeight: 400,
                                                    background: "rgba(7, 126, 134, 0.08)",
                                                    color: "#077E86" }}
                                                >
                                                    {dataDetail.mppobstatus_name}
                                                </Col>
                                                <br />
                                            </Row>
                                            <div style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: -10 }}>{dataDetail.tdirectdebit_crtdt_format}</div>
                                            <center>
                                                <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                                            </center>
                                            <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, }}>Detail Pengiriman</div>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>
                                                <Col>Nama User</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>No Handphone User</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                                                <Col>{dataDetail.mdirdebituser_fullname}</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>{dataDetail.mdirdebituser_mobile === null ? "-" : dataDetail.mdirdebituser_mobile}</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 400, marginTop: 12 }}>
                                                <Col>Nama Partner</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>ID Partner</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600 }}>
                                                <Col>{dataDetail.mpartner_name}</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>{dataDetail.tdirectdebit_partner_id}</Col>
                                            </Row>
                                            <center>
                                                <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, height: 1, padding: "0px 24px", backgroundColor: "#EBEBEB" }} />
                                            </center>
                                            <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, }}>Rincian Dana</div>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                <Col style={{ fontWeight: 400 }}>Nominal Transaksi</Col>
                                                <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(dataDetail.tdirectdebit_partner_fee, true, 0)}</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                <Col style={{ fontWeight: 400 }}>Channel Direct Debit</Col>
                                                <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{dataDetail.mpaytype_name}</Col>
                                            </Row>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                <Col style={{ fontWeight: 400 }}>Total Biaya</Col>
                                                <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>
                                                    {
                                                        openDetailFee ? (
                                                            <div className='d-flex justify-content-center align-items-center' onClick={showCheckboxes} style={{ cursor: "pointer" }}>
                                                                <div>{convertToRupiah(dataDetail.tdirectdebit_fee + dataDetail.tdirectdebit_bank_fee + dataDetail.tdirectdebit_tax_fee)}</div>
                                                                <FontAwesomeIcon icon={faChevronUp} className="mx-2" />
                                                            </div>
                                                        ) : (
                                                            <div className='d-flex justify-content-center align-items-center' onClick={showCheckboxes} style={{ cursor: "pointer" }}>
                                                                <div>{convertToRupiah(dataDetail.tdirectdebit_fee + dataDetail.tdirectdebit_bank_fee + dataDetail.tdirectdebit_tax_fee)}</div>
                                                                <FontAwesomeIcon icon={faChevronDown} className="mx-2" />
                                                            </div>
                                                        )
                                                    }
                                                </Col>
                                            </Row>
                                            {
                                                openDetailFee && (
                                                    <div style={{ background: "rgba(196, 196, 196, 0.12)", borderRadius: 4, padding: 8 }} className='mt-2'>
                                                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400 }}>
                                                            <Col style={{ fontWeight: 400 }}>Biaya Admin</Col>
                                                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(dataDetail.tdirectdebit_fee === null ? 0 : dataDetail.tdirectdebit_amount, true, 0)}</Col>
                                                        </Row>
                                                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                            <Col style={{ fontWeight: 400 }}>Biaya Bank</Col>
                                                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(dataDetail.tdirectdebit_bank_fee, true, 0)}</Col>
                                                        </Row>
                                                        <Row style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginTop: 12 }}>
                                                            <Col style={{ fontWeight: 400 }}>Biaya Pajak</Col>
                                                            <Col style={{  display: "flex", justifyContent: "end", fontWeight: 600 }}>{convertToRupiah(dataDetail.tdirectdebit_tax_fee, true, 0)}</Col>
                                                        </Row>
                                                    </div>
                                                )
                                            }
                                            <center>
                                                <div style={{ display: "flex", justifyContent: "center", margin: "20px -15px 15px -15px", width: 420, padding: "0px 24px", border: "1px dashed #EBEBEB" }} />
                                            </center>
                                            <Row style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 700, marginTop: 12 }}>
                                                <Col>Total</Col>
                                                <Col style={{ display: "flex", justifyContent: "end" }}>{convertToRupiah(dataDetail.tdirectdebit_amount, true, 0)}</Col>
                                            </Row>
                                        </Container>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                                        <Button variant="primary" onClick={() => setShowModalDetailDirectDebit(false)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Kembali</Button>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default RiwayatDirectDebit