import React, { useEffect, useState } from 'react'
import { BaseURL, CustomLoader, convertToRupiah, errorCatch, getRole, getToken, language, setUserSession } from '../../function/helpers'
import { eng } from '../../components/Language'
import { Col, Form, Row } from '@themesberg/react-bootstrap'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import CurrencyInput from 'react-currency-input-field'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import DataTable, { defaultThemes } from 'react-data-table-component';
import Pagination from 'react-js-pagination'
import encryptData from '../../function/encryptData'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import $ from 'jquery'
import ReactSelect, { components } from 'react-select';

function SettlementVAUSDPartner() {

    const history = useHistory()
    const user_role = getRole()
    const [isSettlementVAUSD, setIsSettlementVAUSD] = useState(100)
    const [listMerchant, setListMerchant] = useState([])
    const [selectedPengajuanMerchantVAUSDAdmin, setSelectedPengajuanMerchantVAUSDAdmin] = useState([])
    const [selectedRiwayatMerchantVAUSDAdmin, setSelectedRiwayatMerchantVAUSDAdmin] = useState([])

    async function getListMerchant() {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "partner_id": "" }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            console.log(dataParams, 'dataParams');
            const dataListMerchant = await axios.post(BaseURL + "/VirtualAccountUSD/MerchantVAUSD", {data: dataParams}, {headers: headers})
            console.log(dataListMerchant, "dataListMerchant");
            if (dataListMerchant.status === 200 && dataListMerchant.data.response_code === 200 && dataListMerchant.data.response_new_token === null) {
                let newArr = []
                dataListMerchant.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mpartner_id
                    obj.label = e.mpartner_name
                    newArr.push(obj)
                })
                setListMerchant(newArr)
            } else if (dataListMerchant.status === 200 && dataListMerchant.data.response_code === 200 && dataListMerchant.data.response_new_token !== null) {
                setUserSession(dataListMerchant.data.response_new_token)
                let newArr = []
                dataListMerchant.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.mpartner_id
                    obj.label = e.mpartner_name
                    newArr.push(obj)
                })
                setListMerchant(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
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

    // ADMIN PENGAJUAN STATE MANAGEMENT

    const [listPengajuanSettlementVAUSDAdmin, setListPengajuanSettlementVAUSDAdmin] = useState([])
    const [pendingPengajuanSettlementVAUSDAdmin, setPendingPengajuanSettlementVAUSDAdmin] = useState(false)
    const [showDatePengajuanSettlementVAUSDAdmin, setShowDatePengajuanSettlementVAUSDAdmin] = useState("none")
    const [statePengajuanSettlementVAUSDAdmin, setStatePengajuanSettlementVAUSDAdmin] = useState(null)
    const [dateRangePengajuanSettlementVAUSDAdmin, setDateRangePengajuanSettlementVAUSDAdmin] = useState([])
    const [inputHandlePengajuanSettlementVAUSDAdmin, setInputHandlePengajuanSettlementVAUSDAdmin] = useState({
        periodePengajuanSettlementVAUSDAdmin: 0,
        idSettlementPengajuanSettlementVAUSDAdmin: "",
        namaMerchantPengajuanSettlementVAUSDAdmin: "",
    })
    const [totalPagePengajuanSettlementVAUSDAdmin, setTotalPagePengajuanSettlementVAUSDAdmin] = useState(0)
    const [activePagePengajuanSettlementVAUSDAdmin, setActivePagePengajuanSettlementVAUSDAdmin] = useState(1)
    const [pageNumberPengajuanSettlementVAUSDAdmin, setPageNumberPengajuanSettlementVAUSDAdmin] = useState({})

    // ADMIN PENGAJUAN STATE MANAGEMENT END

    // ADMIN PENGAJUAN FUNCTION

    function handleChangePeriodePengajuanSettlementVAUSDAdmin(e) {
        if (e.target.value === "7") {
            setShowDatePengajuanSettlementVAUSDAdmin("")
            setInputHandlePengajuanSettlementVAUSDAdmin({
                ...inputHandlePengajuanSettlementVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDatePengajuanSettlementVAUSDAdmin("none")
            setDateRangePengajuanSettlementVAUSDAdmin([])
            setInputHandlePengajuanSettlementVAUSDAdmin({
                ...inputHandlePengajuanSettlementVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDatePengajuanSettlementVAUSDAdmin(item) {
        setStatePengajuanSettlementVAUSDAdmin(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangePengajuanSettlementVAUSDAdmin(item)
        }
    }

    function handlePageChangePengajuanSettlementVAUSDAdmin(page) {
        setActivePagePengajuanSettlementVAUSDAdmin(page)
        getListPengajuanSettlementVAUSDAdmin(page, inputHandlePengajuanSettlementVAUSDAdmin.idSettlementPengajuanSettlementVAUSDAdmin, inputHandlePengajuanSettlementVAUSDAdmin.namaMerchantPengajuanSettlementVAUSDAdmin, inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin, dateRangePengajuanSettlementVAUSDAdmin)
    }

    function resetButtonPengajuanSettlementVAUSDAdminHandle() {
        setShowDatePengajuanSettlementVAUSDAdmin("none")
        setStatePengajuanSettlementVAUSDAdmin(null)
        setDateRangePengajuanSettlementVAUSDAdmin([])
        setInputHandlePengajuanSettlementVAUSDAdmin({
            periodePengajuanSettlementVAUSDAdmin: 0,
            idSettlementPengajuanSettlementVAUSDAdmin: "",
            namaMerchantPengajuanSettlementVAUSDAdmin: "",
        })
        setSelectedPengajuanMerchantVAUSDAdmin([])
        setSelectedRiwayatMerchantVAUSDAdmin([])
    }

    async function getListPengajuanSettlementVAUSDAdmin(page, idSettlement, namaMerchant, dateId, dateRange) {
        try {
            // setPendingPengajuanSettlementVAUSDAdmin(true)
            setActivePagePengajuanSettlementVAUSDAdmin(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "code": "${idSettlement}", "username": "", "merchant_name": "${namaMerchant}", "page": ${page}, "row_per_page": 10, "date_from": "${Number(dateId) === 7 ? dateRange[0] : ""}", "date_to": "${Number(dateId) === 7 ? dateRange[1] : ""}", "period": ${Number(dateId) !== 0 ? Number(dateId) : 2} }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            console.log(dataParams, 'dataParams');
            const dataListPengajuanSettlementVAUSDAdmin = await axios.post(BaseURL + "/VirtualAccountUSD/GetWithdrawRequestforAdmin", {data: dataParams}, {headers: headers})
            console.log(dataListPengajuanSettlementVAUSDAdmin, 'dataListPengajuanSettlementVAUSDAdmin');
            if (dataListPengajuanSettlementVAUSDAdmin.status === 200 && dataListPengajuanSettlementVAUSDAdmin.data.response_code === 200 && dataListPengajuanSettlementVAUSDAdmin.data.response_new_token === null) {
                // setPageNumberPengajuanSettlementVAUSDAdmin(dataListPengajuanSettlementVAUSDAdmin.data.response_data)
                // setTotalPagePengajuanSettlementVAUSDAdmin(dataListPengajuanSettlementVAUSDAdmin.data.response_data.max_page)
                // setListPengajuanSettlementVAUSDAdmin(dataListPengajuanSettlementVAUSDAdmin.data.response_data.results)
                setPendingPengajuanSettlementVAUSDAdmin(false)
            } else if (dataListPengajuanSettlementVAUSDAdmin.status === 200 && dataListPengajuanSettlementVAUSDAdmin.data.response_code === 200 && dataListPengajuanSettlementVAUSDAdmin.data.response_new_token !== null) {
                setUserSession(dataListPengajuanSettlementVAUSDAdmin.data.response_new_token)
                // setPageNumberPengajuanSettlementVAUSDAdmin(dataListPengajuanSettlementVAUSDAdmin.data.response_data)
                // setTotalPagePengajuanSettlementVAUSDAdmin(dataListPengajuanSettlementVAUSDAdmin.data.response_data.max_page)
                // setListPengajuanSettlementVAUSDAdmin(dataListPengajuanSettlementVAUSDAdmin.data.response_data.results)
                setPendingPengajuanSettlementVAUSDAdmin(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    // ADMIN PENGAJUAN FUNCTION END

    // ADMIN RIWAYAT STATE MANAGEMENT

    const [listRiwayatSettlementVAUSDAdmin, setListRiwayatSettlementVAUSDAdmin] = useState([])
    const [pendingRiwayatSettlementVAUSDAdmin, setPendingRiwayatSettlementVAUSDAdmin] = useState(false)

    const [showDatePengajuanRiwayatSettlementVAUSDAdmin, setShowDatePengajuanRiwayatSettlementVAUSDAdmin] = useState("none")
    const [statePengajuanRiwayatSettlementVAUSDAdmin, setStatePengajuanRiwayatSettlementVAUSDAdmin] = useState(null)
    const [dateRangePengajuanRiwayatSettlementVAUSDAdmin, setDateRangePengajuanRiwayatSettlementVAUSDAdmin] = useState([])

    const [showDateTerimaRiwayatSettlementVAUSDAdmin, setShowDateTerimaRiwayatSettlementVAUSDAdmin] = useState("none")
    const [stateTerimaRiwayatSettlementVAUSDAdmin, setStateTerimaRiwayatSettlementVAUSDAdmin] = useState(null)
    const [dateRangeTerimaRiwayatSettlementVAUSDAdmin, setDateRangeTerimaRiwayatSettlementVAUSDAdmin] = useState([])

    const [inputHandleRiwayatSettlementVAUSDAdmin, setInputHandleRiwayatSettlementVAUSDAdmin] = useState({
        periodePengajuanRiwayatSettlementVAUSDAdmin: 0,
        periodeTerimaRiwayatSettlementVAUSDAdmin: 0,
        idSettlementRiwayatSettlementVAUSDAdmin: "",
        namaMerchantRiwayatSettlementVAUSDAdmin: "",
        statusRiwayatSettlementVAUSDAdmin: 0,
    })
    const [totalPageRiwayatSettlementVAUSDAdmin, setTotalPageRiwayatSettlementVAUSDAdmin] = useState(0)
    const [activePageRiwayatSettlementVAUSDAdmin, setActivePageRiwayatSettlementVAUSDAdmin] = useState(1)
    const [pageNumberRiwayatSettlementVAUSDAdmin, setPageNumberRiwayatSettlementVAUSDAdmin] = useState({})

    // ADMIN RIWAYAT STATE MANAGEMENT END

    // ADMIN RIWAYAT FUNCTION

    function handleChangePeriodePengajuanRiwayatSettlementVAUSDAdmin(e) {
        if (e.target.value === "7") {
            setShowDatePengajuanRiwayatSettlementVAUSDAdmin("")
            setInputHandleRiwayatSettlementVAUSDAdmin({
                ...inputHandleRiwayatSettlementVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDatePengajuanRiwayatSettlementVAUSDAdmin("none")
            setDateRangePengajuanRiwayatSettlementVAUSDAdmin([])
            setInputHandleRiwayatSettlementVAUSDAdmin({
                ...inputHandleRiwayatSettlementVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function handleChangePeriodeTerimaRiwayatSettlementVAUSDAdmin(e) {
        if (e.target.value === "7") {
            setShowDateTerimaRiwayatSettlementVAUSDAdmin("")
            setInputHandleRiwayatSettlementVAUSDAdmin({
                ...inputHandleRiwayatSettlementVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateTerimaRiwayatSettlementVAUSDAdmin("none")
            setDateRangeTerimaRiwayatSettlementVAUSDAdmin([])
            setInputHandleRiwayatSettlementVAUSDAdmin({
                ...inputHandleRiwayatSettlementVAUSDAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDatePengajuanRiwayatSettlementVAUSDAdmin(item) {
        setStatePengajuanRiwayatSettlementVAUSDAdmin(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangePengajuanRiwayatSettlementVAUSDAdmin(item)
        }
    }

    function pickDateTerimaRiwayatSettlementVAUSDAdmin(item) {
        setStateTerimaRiwayatSettlementVAUSDAdmin(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
            setDateRangeTerimaRiwayatSettlementVAUSDAdmin(item)
        }
    }

    function handlePageChangeRiwayatSettlementVAUSDAdmin(page) {
        setActivePageRiwayatSettlementVAUSDAdmin(page)
        getListRiwayatSettlementVAUSDAdmin(page, inputHandleRiwayatSettlementVAUSDAdmin.idSettlementRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.namaMerchantRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin, dateRangePengajuanRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin, dateRangeTerimaRiwayatSettlementVAUSDAdmin)
    }

    function resetButtonRiwayatSettlementVAUSDAdminHandle() {
        setShowDatePengajuanRiwayatSettlementVAUSDAdmin("none")
        setStatePengajuanRiwayatSettlementVAUSDAdmin(null)
        setDateRangePengajuanRiwayatSettlementVAUSDAdmin([])
        setInputHandleRiwayatSettlementVAUSDAdmin({
            periodePengajuanRiwayatSettlementVAUSDAdmin: 0,
            periodeTerimaRiwayatSettlementVAUSDAdmin: 0,
            idSettlementRiwayatSettlementVAUSDAdmin: "",
            namaMerchantRiwayatSettlementVAUSDAdmin: "",
            statusRiwayatSettlementVAUSDAdmin: 0,
        })
        setSelectedPengajuanMerchantVAUSDAdmin([])
        setSelectedRiwayatMerchantVAUSDAdmin([])
    }

    async function getListRiwayatSettlementVAUSDAdmin(page, idSettlement, namaMerchant, dateIdPengajuan, dateRangePengajuan, dateIdRiwayat, dateRangeRiwayat) {
        try {
            // setPendingRiwayatSettlementVAUSDAdmin(true)
            setActivePageRiwayatSettlementVAUSDAdmin(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "code": "${idSettlement}", "username": "", "merchant_name": "${namaMerchant}", "page": ${page}, "row_per_page": 10, "date_from": "${Number(dateIdPengajuan) === 7 ? dateRangePengajuan[0] : ""}", "date_to": "${Number(dateIdPengajuan) === 7 ? dateRangePengajuan[1] : ""}", "period": ${Number(dateIdPengajuan) !== 0 ? Number(dateIdPengajuan) : 2} }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            console.log(dataParams, 'dataParams');
            const dataListRiwayatSettlementVAUSDAdmin = await axios.post(BaseURL + "/VirtualAccountUSD/GetWithdrawRequestforAdmin", {data: dataParams}, {headers: headers})
            console.log(dataListRiwayatSettlementVAUSDAdmin, 'dataListRiwayatSettlementVAUSDAdmin');
            if (dataListRiwayatSettlementVAUSDAdmin.status === 200 && dataListRiwayatSettlementVAUSDAdmin.data.response_code === 200 && dataListRiwayatSettlementVAUSDAdmin.data.response_new_token === null) {
                // setPageNumberRiwayatSettlementVAUSDAdmin(dataListRiwayatSettlementVAUSDAdmin.data.response_data)
                // setTotalPageRiwayatSettlementVAUSDAdmin(dataListRiwayatSettlementVAUSDAdmin.data.response_data.max_page)
                // setListRiwayatSettlementVAUSDAdmin(dataListRiwayatSettlementVAUSDAdmin.data.response_data.results)
                setPendingRiwayatSettlementVAUSDAdmin(false)
            } else if (dataListRiwayatSettlementVAUSDAdmin.status === 200 && dataListRiwayatSettlementVAUSDAdmin.data.response_code === 200 && dataListRiwayatSettlementVAUSDAdmin.data.response_new_token !== null) {
                setUserSession(dataListRiwayatSettlementVAUSDAdmin.data.response_new_token)
                // setPageNumberRiwayatSettlementVAUSDAdmin(dataListRiwayatSettlementVAUSDAdmin.data.response_data)
                // setTotalPageRiwayatSettlementVAUSDAdmin(dataListRiwayatSettlementVAUSDAdmin.data.response_data.max_page)
                // setListRiwayatSettlementVAUSDAdmin(dataListRiwayatSettlementVAUSDAdmin.data.response_data.results)
                setPendingRiwayatSettlementVAUSDAdmin(false)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    // ADMIN RIWAYAT FUNCTION END

    // PARTNER STATE MANAGEMENT

    const [ballanceSettlementVAUSDPartner, setBallanceSettlementVAUSDPartner] = useState({})
    const [isCurrencySettlementVAUSDPartner, setIsCurrencySettlementVAUSDPartner] = useState("USD")
    const [nominalPengajuanSettlementVAUSDPartner, setNominalPengajuanSettlementVAUSDPartner] = useState("0")
    const [listSettlementVAUSDPartner, setListSettlementVAUSDPartner] = useState([])
    const [pendingSettlementVAUSDPartner, setPendingSettlementVAUSDPartner] = useState(false)
    const [inputHandleSettlementVAUSDPartner, setInputHandleSettlementVAUSDPartner] = useState({
        idTransaksiSettlementVAUSDPartner: "",
        periodeRequestSettlementVAUSDPartner: 0,
        periodeTerimaSettlementVAUSDPartner: 0,
        statusSettlementVAUSDPartner: "",
    })
    const [showDateRequestSettlementVAUSDPartner, setShowDateRequestSettlementVAUSDPartner] = useState("none")
    const [stateRequestSettlementVAUSDPartner, setStateRequestSettlementVAUSDPartner] = useState(null)
    const [dateRangeRequestSettlementVAUSDPartner, setDateRangeRequestSettlementVAUSDPartner] = useState([])

    const [showDateTerimaSettlementVAUSDPartner, setShowDateTerimaSettlementVAUSDPartner] = useState("none")
    const [stateTerimaSettlementVAUSDPartner, setStateTerimaSettlementVAUSDPartner] = useState(null)
    const [dateRangeTerimaSettlementVAUSDPartner, setDateRangeTerimaSettlementVAUSDPartner] = useState([])

    const [totalPageSettlementVAUSDPartner, setTotalPageSettlementVAUSDPartner] = useState(0)
    const [activePageSettlementVAUSDPartner, setActivePageSettlementVAUSDPartner] = useState(1)
    const [pageNumberSettlementVAUSDPartner, setPageNumberSettlementVAUSDPartner] = useState({})

    // PARTNER STATE MANAGEMENT END

    console.log(nominalPengajuanSettlementVAUSDPartner, 'nominalPengajuanSettlementVAUSDPartner');

    // PARTNER FUNCTION

    function pickDateVAUSDPartner(item, param) {
        if (param === "request") {
            setStateRequestSettlementVAUSDPartner(item)
            if (item !== null) {
                item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
                setDateRangeRequestSettlementVAUSDPartner(item)
            }
        } else {
            setStateTerimaSettlementVAUSDPartner(item)
            if (item !== null) {
                item = item.map(el => el.toLocaleDateString('fr-CA').split("").join(""))
                setDateRangeTerimaSettlementVAUSDPartner(item)
            }
        }
    }

    function handlePageChangeSettlementVAUSDPartner(page) {
        setActivePageSettlementVAUSDPartner(page)
        getListSettlementRequestVAUSDPartner(page, inputHandleSettlementVAUSDPartner.idTransaksiSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner, dateRangeRequestSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner, dateRangeTerimaSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.statusSettlementVAUSDPartner)
    }

    async function getUserDataSettlementPartner(lang) {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type': 'application/json',
                'Authorization' : auth,
                // 'Accept-Language' : lang
            }
            const dataUserSettlement = await axios.post(BaseURL + "/VirtualAccountUSD/GetWithdrawConfiguration", {data: ""}, {headers: headers})
            console.log(dataUserSettlement, 'dataUserSettlement');
            if (dataUserSettlement.status === 200 && dataUserSettlement.data.response_code === 200 && dataUserSettlement.data.response_new_token === null) {
                setBallanceSettlementVAUSDPartner(dataUserSettlement.data.response_data.results)
            } else if (dataUserSettlement.status === 200 && dataUserSettlement.data.response_code === 200 && dataUserSettlement.data.response_new_token !== null) {
                setUserSession(dataUserSettlement.data.response_new_token)
                setBallanceSettlementVAUSDPartner(dataUserSettlement.data.response_data.results)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getListSettlementRequestVAUSDPartner(page, idTransaksi, dateIdRequest, dateRangeRequest, dateIdTerima, dateRangeTerima, statusId) {
        try {
            // setPendingSettlementVAUSDPartner(true)
            setActivePageSettlementVAUSDPartner(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "code" : "${idTransaksi}", "partner_id": "", "csv_status_id": "${statusId.length !== 0 ? statusId : "2,3"}", "page": ${page}, "row_per_page": 10, "date_from": "${Number(dateIdRequest) === 7 ? dateRangeRequest[0] : ""}", "date_to": "${Number(dateIdRequest) === 7 ? dateRangeRequest[1] : ""}", "period": ${Number(dateIdRequest) !== 0 ? Number(dateIdRequest) : 2}, "acc_date_from": "${Number(dateIdTerima) === 7 ? dateRangeTerima[0] : ""}", "acc_date_to": "${Number(dateIdTerima) === 7 ? dateRangeTerima[1] : ""}", "acc_period": ${Number(dateIdTerima) !== 0 ? Number(dateIdTerima) : 2} }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
                // 'Accept-Language' : "ID"
            }
            console.log(dataParams, 'dataParams');
            const dataListSettlementRequest = await axios.post(BaseURL + "/VirtualAccountUSD/WithdrawHistory", {data: dataParams}, {headers: headers})
            console.log(dataListSettlementRequest, 'dataListSettlementRequest');
            if (dataListSettlementRequest.status === 200 && dataListSettlementRequest.data.response_code === 200 && dataListSettlementRequest.data.response_new_token === null) {
                // setPageNumberSettlementVAUSDPartner(dataListSettlementRequest.data.response_data)
                // setTotalPageSettlementVAUSDPartner(dataListSettlementRequest.data.response_data.max_page)
                // setListSettlementVAUSDPartner(dataListSettlementRequest.data.response_data.results)
            } else if (dataListSettlementRequest.status === 200 && dataListSettlementRequest.data.response_code === 200 && dataListSettlementRequest.data.response_new_token !== null) {
                setUserSession(dataListSettlementRequest.data.response_new_token)
                // setPageNumberSettlementVAUSDPartner(dataListSettlementRequest.data.response_data)
                // setTotalPageSettlementVAUSDPartner(dataListSettlementRequest.data.response_data.max_page)
                // setListSettlementVAUSDPartner(dataListSettlementRequest.data.response_data.results)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function submitSettlementVAUSDPartner(accName, accNumber, currency, bankCode, amount) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "acc_name": "${accName}", "acc_number": "${accNumber}", "amount": "${amount}", "currency": "${currency}", "mbank_code": "${bankCode}" }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth,
            }
            console.log(dataParams, 'dataParams');
            // const submitedSettlement = await axios.post(BaseURL + "/VirtualAccountUSD/WithdrawVAUSDInsert", {data: dataParams}, {headers: headers})
            // console.log(submitedSettlement, 'submitedSettlement');
            // if (submitedSettlement.status === 200 && submitedSettlement.data.response_code === 200 && submitedSettlement.data.response_new_token === null) {

            // } else if (submitedSettlement.status === 200 && submitedSettlement.data.response_code === 200 && submitedSettlement.data.response_new_token !== null) {
            //     setUserSession(submitedSettlement.data.response_new_token)
            // }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    // PARTNER FUNCTION END

    useEffect(() => {
        if (user_role !== "102") {
            getListMerchant()
            getListPengajuanSettlementVAUSDAdmin(activePagePengajuanSettlementVAUSDAdmin, inputHandlePengajuanSettlementVAUSDAdmin.idSettlementPengajuanSettlementVAUSDAdmin, inputHandlePengajuanSettlementVAUSDAdmin.namaMerchantPengajuanSettlementVAUSDAdmin, inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin, dateRangePengajuanSettlementVAUSDAdmin)
        } else{
            getUserDataSettlementPartner(language === null ? 'EN' : language.flagName)
            getListSettlementRequestVAUSDPartner(activePageSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.idTransaksiSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner, dateRangeRequestSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner, dateRangeTerimaSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.statusSettlementVAUSDPartner)
        }
    }, [])

    function pindahHalaman(param) {
        if (param === "pengajuan") {
            getListPengajuanSettlementVAUSDAdmin(activePagePengajuanSettlementVAUSDAdmin, inputHandlePengajuanSettlementVAUSDAdmin.idSettlementPengajuanSettlementVAUSDAdmin, inputHandlePengajuanSettlementVAUSDAdmin.namaMerchantPengajuanSettlementVAUSDAdmin, inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin, dateRangePengajuanSettlementVAUSDAdmin)
            settlementVAUSDTabs(100)
        } else if (param === "riwayat") {
            getListRiwayatSettlementVAUSDAdmin(1, inputHandleRiwayatSettlementVAUSDAdmin.idSettlementRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.namaMerchantRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin, dateRangePengajuanRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin, dateRangeTerimaRiwayatSettlementVAUSDAdmin)
            settlementVAUSDTabs(101)
        }
    }

    function settlementVAUSDTabs(isTabs){
        setIsSettlementVAUSD(isTabs)
        if (isTabs === 100) {
            $('#riwayatTab').removeClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').removeClass('menu-detail-akun-span-active')
            $('#pengajuanTab').addClass('menu-detail-akun-hr-active')
            $('#pengajuanSpan').addClass('menu-detail-akun-span-active')
        } else if (isTabs === 101) {
            $('#pengajuanTab').removeClass('menu-detail-akun-hr-active')
            $('#pengajuanSpan').removeClass('menu-detail-akun-span-active')
            $('#riwayatTab').addClass('menu-detail-akun-hr-active')
            $('#riwayatSpan').addClass('menu-detail-akun-span-active')
        }
    }

    const columnsPengajuanSettlementVAUSDAdmin = [
        {
            name: 'No',
            selector: row => row.No,
            width: "3%",
            wrap: true,
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Settlement',
            selector: row => row.code,
            width: "150px",
            wrap: true,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
            // sortable: true
        },
        {
            name: 'Tanggal pengajuan',
            selector: row => row.request_date !== undefined ? row.request_date : "-",
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Tanggal terima',
            selector: row => row.accept_date,
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.destination_bank,
            // sortable: true,
            wrap: true,
            width: "170px",
        },
        {
            name: 'Nomor rekening',
            selector: row => row.account_number,
            // sortable: true,
            // width: "175px"
            wrap: true,
            width: "150px",
        },
        {
            name: 'Nama pemilik rekening',
            selector: row => row.account_name,
            // sortable: true,
            wrap: true,
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.request_amount, false, 2)}` }</div>,
            width: "200px",
        },
        {
            name: 'Nominal pengajuan',
            selector: row => row.request,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.request, false, 2)}` }</div>,
            width: "175px"
        },
        {
            name: 'Biaya',
            selector: row => row.fee,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.fee, false, 2)}` }</div>,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Total settlement',
            selector: row => row.total,
            width: "130px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.total, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            width: "170px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.status_id === 1 || row.status_id === 7 || row.status_id === 11 || row.status_id === 12,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                {
                    when: row => row.status_id === 4 || row.status_id === 9 || row.status_id === 13,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.status_id === 3 || row.status_id === 5 || row.status_id === 6 || row.status_id === 8 || row.status_id === 10 || row.status_id === 14 || row.status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
        {
            name: 'Konfirmasi diterima',
            selector: row => row.settled_amount,
            width: "190px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.settled_amount, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
    ];

    const columnsRiwayatSettlementVAUSDAdmin = [
        {
            name: 'No',
            selector: row => row.No,
            width: "3%",
            wrap: true,
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Settlement',
            selector: row => row.code,
            width: "150px",
            wrap: true,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
            // sortable: true
        },
        {
            name: 'Tanggal pengajuan',
            selector: row => row.request_date !== undefined ? row.request_date : "-",
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Tanggal terima',
            selector: row => row.accept_date,
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.destination_bank,
            // sortable: true,
            wrap: true,
            width: "170px",
        },
        {
            name: 'Nomor rekening',
            selector: row => row.account_number,
            // sortable: true,
            // width: "175px"
            wrap: true,
            width: "150px",
        },
        {
            name: 'Nama pemilik rekening',
            selector: row => row.account_name,
            // sortable: true,
            wrap: true,
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.request_amount, false, 2)}` }</div>,
            width: "200px",
        },
        {
            name: 'Nominal pengajuan',
            selector: row => row.request,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.request, false, 2)}` }</div>,
            width: "175px"
        },
        {
            name: 'Biaya',
            selector: row => row.fee,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.fee, false, 2)}` }</div>,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Total settlement',
            selector: row => row.total,
            width: "130px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.total, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            width: "170px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.status_id === 1 || row.status_id === 7 || row.status_id === 11 || row.status_id === 12,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                {
                    when: row => row.status_id === 4 || row.status_id === 9 || row.status_id === 13,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.status_id === 3 || row.status_id === 5 || row.status_id === 6 || row.status_id === 8 || row.status_id === 10 || row.status_id === 14 || row.status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
        {
            name: 'Konfirmasi diterima',
            selector: row => row.settled_amount,
            width: "190px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.settled_amount, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
    ];

    const columnsSettlementVAUSDPartner = [
        {
            name: 'No',
            selector: row => row.No,
            width: "3%",
            wrap: true,
            maxWidth: 'fit-content !important'
        },
        {
            name: 'ID Settlement',
            selector: row => row.code,
            width: "150px",
            wrap: true,
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} onClick={() => detailListTransferHandler(row.tvatrans_trx_id)}>{row.tvatrans_trx_id}</Link>
            // sortable: true
        },
        {
            name: 'Tanggal pengajuan',
            selector: row => row.request_date !== undefined ? row.request_date : "-",
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Tanggal terima',
            selector: row => row.accept_date,
            // selector: row => row.tvatrans_process_date_format !== null ? row.tvatrans_process_date_format : "-",
            wrap: true,
            width: "180px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.destination_bank,
            // sortable: true,
            wrap: true,
            width: "170px",
        },
        {
            name: 'Nomor rekening',
            selector: row => row.account_number,
            // sortable: true,
            // width: "175px"
            wrap: true,
            width: "150px",
        },
        {
            name: 'Nama pemilik rekening',
            selector: row => row.account_name,
            // sortable: true,
            wrap: true,
            // cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.request_amount, false, 2)}` }</div>,
            width: "200px",
        },
        {
            name: 'Nominal pengajuan',
            selector: row => row.request,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.request, false, 2)}` }</div>,
            width: "175px"
        },
        {
            name: 'Biaya',
            selector: row => row.fee,
            // sortable: true,
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.fee, false, 2)}` }</div>,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Total settlement',
            selector: row => row.total,
            width: "130px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.total, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            width: "170px",
            // sortable: true,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px 0px", margin: "6px", width: "100%", borderRadius: 4 },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 2,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86", }
                },
                {
                    when: row => row.status_id === 1 || row.status_id === 7 || row.status_id === 11 || row.status_id === 12,
                    style: { background: "#FEF4E9", color: "#F79421", }
                },
                {
                    when: row => row.status_id === 4 || row.status_id === 9 || row.status_id === 13,
                    style: { background: "#FDEAEA", color: "#EE2E2C", }
                },
                {
                    when: row => row.status_id === 3 || row.status_id === 5 || row.status_id === 6 || row.status_id === 8 || row.status_id === 10 || row.status_id === 14 || row.status_id === 15,
                    style: { background: "#F0F0F0", color: "#888888", }
                }
            ],
        },
        {
            name: 'Konfirmasi diterima',
            selector: row => row.settled_amount,
            width: "190px",
            // sortable: true
            cell: row => <div style={{ display: "flex", flexDirection: "row", justifyContent: "right", alignItem: "right" }}>{ `USD ${convertToRupiah(row.settled_amount, false, 2)}` }</div>,
            style: { display: "flex", flexDirection: "row", justifyContent: "right", }
        },
    ];

    const customStylesSettlementVAUSD = {
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
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Settlement</span>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; VA USD</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Settlement VA USD</h2>
            </div>
            {
                user_role !== "102" ?
                    <div className='base-content pb-4'>
                        <div className='detail-akun-menu' style={{fontFamily: "Exo", display: 'flex', height: 33}}>
                            <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => pindahHalaman("pengajuan")} id="pengajuanTab">
                                <span className='menu-detail-akun-span menu-detail-akun-span-active' id="pengajuanSpan">Pengajuan Settlement</span>
                            </div>
                            <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("riwayat")} id="riwayatTab">
                                <span className='menu-detail-akun-span' id="riwayatSpan">Riwayat Settlement</span>
                            </div>
                        </div>
                        <hr className='hr-style mb-4' style={{marginTop: -2}}/>
                        {
                            isSettlementVAUSD === 100 ?
                                <>
                                    <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                                    <Row className='mt-4'>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: (showDatePengajuanSettlementVAUSDAdmin === "none") ? "33%" : "33%" }}>
                                            <span className="me-3">Periode Pengajuan <span style={{ color: "red" }}>*</span></span>
                                            <Form.Select name='periodePengajuanSettlementVAUSDAdmin' className="input-text-riwayat ms-4" value={inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin} onChange={handleChangePeriodePengajuanSettlementVAUSDAdmin}>
                                                <option defaultChecked disabled value={0}>Pilih Periode</option>
                                                <option value={2}>Hari Ini</option>
                                                <option value={3}>Kemarin</option>
                                                <option value={4}>7 Hari Terakhir</option>
                                                <option value={5}>Bulan Ini</option>
                                                <option value={6}>Bulan Kemarin</option>
                                                <option value={7}>Pilih Range Tanggal</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                                            <span style={{ marginRight: 64 }}>ID Settlement</span>
                                            <input onChange={(e) => setInputHandlePengajuanSettlementVAUSDAdmin({ ...inputHandlePengajuanSettlementVAUSDAdmin, [e.target.name]: e.target.value })} value={inputHandlePengajuanSettlementVAUSDAdmin.idSettlementPengajuanSettlementVAUSDAdmin} name="idSettlementPengajuanSettlementVAUSDAdmin" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan ID Settlement'/>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                                            <span style={{ marginRight: 32 }}>Nama Merchant</span>
                                            <div className="dropdown dropDisbursePartner" style={{ width: "12rem" }}>
                                                <ReactSelect
                                                    // isMulti
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={listMerchant}
                                                    // allowSelectAll={true}
                                                    value={selectedPengajuanMerchantVAUSDAdmin}
                                                    onChange={(selected) => setSelectedPengajuanMerchantVAUSDAdmin([selected])}
                                                    placeholder="Pilih Nama Merchant"
                                                    components={{ Option }}
                                                    styles={customStylesSelectedOption}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={4} style={{ display: showDatePengajuanSettlementVAUSDAdmin }} className='text-end pe-3'>
                                            <DateRangePicker
                                                onChange={pickDatePengajuanSettlementVAUSDAdmin}
                                                value={statePengajuanSettlementVAUSDAdmin}
                                                clearIcon={null}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={5}>
                                            <Row>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        onClick={() => getListPengajuanSettlementVAUSDAdmin(1, inputHandlePengajuanSettlementVAUSDAdmin.idSettlementPengajuanSettlementVAUSDAdmin, inputHandlePengajuanSettlementVAUSDAdmin.namaMerchantPengajuanSettlementVAUSDAdmin, inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin, dateRangePengajuanSettlementVAUSDAdmin)}
                                                        className={(inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 0 || (inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 7 && dateRangePengajuanSettlementVAUSDAdmin.length === 0)) ? "btn-ez" : "btn-ez-on"}
                                                        disabled={(inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 0 || (inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 7 && dateRangePengajuanSettlementVAUSDAdmin.length === 0))}
                                                    >
                                                        Terapkan
                                                    </button>
                                                </Col>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        onClick={resetButtonPengajuanSettlementVAUSDAdminHandle}
                                                        className={(inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 0 || (inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 7 && dateRangePengajuanSettlementVAUSDAdmin.length === 0)) ? "btn-ez-reset" : "btn-reset"}
                                                        disabled={(inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 0 || (inputHandlePengajuanSettlementVAUSDAdmin.periodePengajuanSettlementVAUSDAdmin === 7 && dateRangePengajuanSettlementVAUSDAdmin.length === 0))}
                                                    >
                                                        Atur Ulang
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <div className="div-table pb-4">
                                        <DataTable
                                            columns={columnsPengajuanSettlementVAUSDAdmin}
                                            data={listPengajuanSettlementVAUSDAdmin}
                                            customStyles={customStylesSettlementVAUSD}
                                            noDataComponent={'Tidak ada data'}
                                            highlightOnHover
                                            progressPending={pendingPengajuanSettlementVAUSDAdmin}
                                            progressComponent={<CustomLoader />}
                                        />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Halaman : {totalPagePengajuanSettlementVAUSDAdmin}</div>
                                        <Pagination
                                            activePage={activePagePengajuanSettlementVAUSDAdmin}
                                            itemsCountPerPage={pageNumberPengajuanSettlementVAUSDAdmin.row_per_page}
                                            totalItemsCount={(pageNumberPengajuanSettlementVAUSDAdmin.row_per_page*pageNumberPengajuanSettlementVAUSDAdmin.max_page)}
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={handlePageChangePengajuanSettlementVAUSDAdmin}
                                        />
                                    </div>
                                </>
                            :
                                <>
                                    <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                                    <Row className='mt-4'>
                                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                                            <span style={{ marginRight: 64 }}>ID Settlement</span>
                                            <input onChange={(e) => setInputHandleRiwayatSettlementVAUSDAdmin({ ...inputHandleRiwayatSettlementVAUSDAdmin, [e.target.name]: e.target.value })} value={inputHandleRiwayatSettlementVAUSDAdmin.idSettlementRiwayatSettlementVAUSDAdmin} name="idSettlementPengajuanSettlementVAUSDAdmin" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan ID Settlement'/>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                                            <span style={{ marginRight: 32 }}>Nama Merchant</span>
                                            <div className="dropdown dropDisbursePartner" style={{ width: "12rem" }}>
                                                <ReactSelect
                                                    // isMulti
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={listMerchant}
                                                    // allowSelectAll={true}
                                                    value={selectedRiwayatMerchantVAUSDAdmin}
                                                    onChange={(selected) => setSelectedRiwayatMerchantVAUSDAdmin([selected])}
                                                    placeholder="Pilih Nama Merchant"
                                                    components={{ Option }}
                                                    styles={customStylesSelectedOption}
                                                />
                                            </div>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-start align-items-center">
                                            <span style={{ marginRight: 32 }}>Status</span>
                                            <Form.Select name="statusRiwayatSettlementVAUSDAdmin" className='input-text-riwayat ms-5' style={{ display: "inline" }} value={inputHandleRiwayatSettlementVAUSDAdmin.statusRiwayatSettlementVAUSDAdmin} onChange={(e) => setInputHandleRiwayatSettlementVAUSDAdmin({ ...inputHandleRiwayatSettlementVAUSDAdmin, [e.target.name]: e.target.value })}>
                                                <option defaultChecked disabled value={0}>Pilih Status</option>
                                                <option value={1}>Ditransfer</option>
                                                <option value={2}>Diterima</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: (showDatePengajuanRiwayatSettlementVAUSDAdmin === "none") ? "33%" : "33%" }}>
                                            <span className="me-3">Periode Pengajuan <span style={{ color: "red" }}>*</span></span>
                                            <Form.Select name='periodePengajuanSettlementVAUSDAdmin' className="input-text-riwayat ms-4" value={inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin} onChange={handleChangePeriodePengajuanRiwayatSettlementVAUSDAdmin}>
                                                <option defaultChecked disabled value={0}>Pilih Periode</option>
                                                <option value={2}>Hari Ini</option>
                                                <option value={3}>Kemarin</option>
                                                <option value={4}>7 Hari Terakhir</option>
                                                <option value={5}>Bulan Ini</option>
                                                <option value={6}>Bulan Kemarin</option>
                                                <option value={7}>Pilih Range Tanggal</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: (showDateTerimaRiwayatSettlementVAUSDAdmin === "none") ? "33%" : "33%" }}>
                                            <span className="me-3">Periode Pengajuan <span style={{ color: "red" }}>*</span></span>
                                            <Form.Select name='periodeTerimaRiwayatSettlementVAUSDAdmin' className="input-text-riwayat ms-4" value={inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin} onChange={handleChangePeriodeTerimaRiwayatSettlementVAUSDAdmin}>
                                                <option defaultChecked disabled value={0}>Pilih Periode</option>
                                                <option value={2}>Hari Ini</option>
                                                <option value={3}>Kemarin</option>
                                                <option value={4}>7 Hari Terakhir</option>
                                                <option value={5}>Bulan Ini</option>
                                                <option value={6}>Bulan Kemarin</option>
                                                <option value={7}>Pilih Range Tanggal</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={4} style={{ display: showDatePengajuanRiwayatSettlementVAUSDAdmin }} className='text-end pe-3'>
                                            <DateRangePicker
                                                onChange={pickDatePengajuanRiwayatSettlementVAUSDAdmin}
                                                value={statePengajuanRiwayatSettlementVAUSDAdmin}
                                                clearIcon={null}
                                            />
                                        </Col>
                                        <Col xs={4} style={{ display: showDateTerimaRiwayatSettlementVAUSDAdmin }} className='text-end pe-3'>
                                            <DateRangePicker
                                                onChange={pickDateTerimaRiwayatSettlementVAUSDAdmin}
                                                value={stateTerimaRiwayatSettlementVAUSDAdmin}
                                                clearIcon={null}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={5}>
                                            <Row>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        onClick={() => getListRiwayatSettlementVAUSDAdmin(1, inputHandleRiwayatSettlementVAUSDAdmin.idSettlementRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.namaMerchantRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin, dateRangePengajuanRiwayatSettlementVAUSDAdmin, inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin, dateRangeTerimaRiwayatSettlementVAUSDAdmin)}
                                                        className={
                                                            (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length === 0) ||
                                                            inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length === 0))
                                                            ? "btn-ez" : "btn-ez-on"
                                                        }
                                                        disabled={
                                                            (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length === 0) ||
                                                            inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length === 0))
                                                        }
                                                    >
                                                        Terapkan
                                                    </button>
                                                </Col>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        onClick={resetButtonRiwayatSettlementVAUSDAdminHandle}
                                                        className={
                                                            (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length === 0) ||
                                                            inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length === 0))
                                                            ? "btn-ez-reset" : "btn-reset"
                                                        }
                                                        disabled={
                                                            (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodePengajuanRiwayatSettlementVAUSDAdmin === 7 && dateRangePengajuanRiwayatSettlementVAUSDAdmin.length === 0) ||
                                                            inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 0 || (inputHandleRiwayatSettlementVAUSDAdmin.periodeTerimaRiwayatSettlementVAUSDAdmin === 7 && dateRangeTerimaRiwayatSettlementVAUSDAdmin.length === 0))
                                                        }
                                                    >
                                                        Atur Ulang
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <div className="div-table pb-4">
                                        <DataTable
                                            columns={columnsRiwayatSettlementVAUSDAdmin}
                                            data={listRiwayatSettlementVAUSDAdmin}
                                            customStyles={customStylesSettlementVAUSD}
                                            noDataComponent={'Tidak ada data'}
                                            highlightOnHover
                                            progressPending={pendingRiwayatSettlementVAUSDAdmin}
                                            progressComponent={<CustomLoader />}
                                        />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Halaman : {totalPageRiwayatSettlementVAUSDAdmin}</div>
                                        <Pagination
                                            activePage={activePageRiwayatSettlementVAUSDAdmin}
                                            itemsCountPerPage={pageNumberRiwayatSettlementVAUSDAdmin.row_per_page}
                                            totalItemsCount={(pageNumberRiwayatSettlementVAUSDAdmin.row_per_page*pageNumberRiwayatSettlementVAUSDAdmin.max_page)}
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={handlePageChangeRiwayatSettlementVAUSDAdmin}
                                        />
                                    </div>
                                </>
                        }
                    </div>
                :
                    <>
                        <div className='base-content pb-4'>
                            <div className='ms-3'>
                                <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Ajukan Settlement VA USD</span>
                                <Row className='d-flex justify-content-start'>
                                    <Col xs={3} className="card-information mt-3" style={{border: '1px solid #EBEBEB', height: 'fit-content', padding: '12px 0px 12px 16px'}}>
                                        <div className="p-info" style={{ width: "auto" }}>Jumlah Saldo</div>
                                        <div style={{ fontFamily: "Exo", fontSize: 25, fontWeight: 700, paddingRight: 20, marginTop: 5 }}>{`USD ${convertToRupiah(ballanceSettlementVAUSDPartner?.USD?.balance, false, 2)}`}</div>
                                        {
                                            isCurrencySettlementVAUSDPartner === "IDR" &&
                                            <div style={{ fontFamily: "Nunito", fontSize: 12, paddingRight: 20, marginTop: 5 }}>
                                            <span style={{ fontWeight: 400 }}>Konversi IDR: </span><span style={{ fontWeight: 600 }}>{`IDR ${convertToRupiah(ballanceSettlementVAUSDPartner?.IDR?.balance, false, 2)}`}</span>
                                            </div>
                                        }
                                    </Col>
                                </Row>
                            </div>
                            <table style={{ width: "100%", marginLeft: "unset" }} className="table-form mt-4">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td style={{ width: 200 }}>Mata Uang</td>
                                        <Row className='ms-1'>
                                            <Col xs={1}>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="inlineCheckbox1"
                                                        name={"USD"}
                                                        value={"USD"}
                                                        onChange={(e) => {setIsCurrencySettlementVAUSDPartner(e.target.value); setNominalPengajuanSettlementVAUSDPartner("0")}}
                                                        checked={isCurrencySettlementVAUSDPartner !== "USD" ? false : true}
                                                        // checked={edited === true ? fitur[0] : inputHandle.fiturs ? inputHandle.fiturs : 0}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        style={{ fontWeight: 400, fontSize: "14px" }}
                                                        for="inlineCheckbox1"
                                                    >
                                                        USD
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col xs={1}>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="inlineCheckbox1"
                                                        name={"IDR"}
                                                        value={"IDR"}
                                                        onChange={(e) => {setIsCurrencySettlementVAUSDPartner(e.target.value); setNominalPengajuanSettlementVAUSDPartner("0")}}
                                                        checked={isCurrencySettlementVAUSDPartner !== "IDR" ? false : true}
                                                        // checked={edited === true ? fitur[0] : inputHandle.fiturs ? inputHandle.fiturs : 0}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        style={{ fontWeight: 400, fontSize: "14px" }}
                                                        for="inlineCheckbox1"
                                                    >
                                                        IDR
                                                    </label>
                                                </div>
                                            </Col>
                                        </Row>
                                    </tr>
                                    {
                                        isCurrencySettlementVAUSDPartner !== "USD" &&
                                        <tr>
                                            <td style={{ width: 200 }}></td>
                                            <Row className='ms-1'>
                                                <Col>
                                                    <div className="form-check form-check-inline" style={{ paddingLeft: "unset" }}>
                                                        <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 700, textDecorationLine: "underline", color: "var(--contoh-secondary-40-warna-utama, #077E86)", paddingRight: 20, marginTop: 5 }}>USD 1 = IDR {convertToRupiah(ballanceSettlementVAUSDPartner?.one_usd_to_idr, false, 2)}</div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </tr>
                                    }
                                    <br />
                                    <tr>
                                        <td>Bank Tujuan</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input-text-ez"
                                                value={"bankTujuan"}
                                                name="bankTujuan"
                                                disabled
                                                style={{ width: "100%", marginLeft: "unset" }}
                                            />
                                            {/* <Form.Select name='bankTujuan' className='input-text-user' style={{ display: "inline" }} value={"bankTujuan"} onChange={(e) => '{ setAlertFeeType(false); setBiayaHandle({ ...biayaHandle, feeType: Number(e.target.value), fee: "" }) }'}>
                                                <option defaultValue disabled value={0}>Pilih Bank Tujuan</option>
                                                <option value={100}>Fix Fee</option>
                                                <option value={101}>Persentase</option>
                                            </Form.Select> */}
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>Nomor Rekening</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input-text-ez"
                                                value={"nomorRekening"}
                                                name="nomorRekening"
                                                disabled
                                                style={{ width: "100%", marginLeft: "unset" }}
                                            />
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>Nama Pemilik Rekening</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="input-text-ez"
                                                value={"namaPemilikRekening"}
                                                name="namaPemilikRekening"
                                                disabled
                                                style={{ width: "100%", marginLeft: "unset" }}
                                            />
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>Nominal Pengajuan</td>
                                        <td>
                                            <CurrencyInput
                                                className="input-text-user"
                                                value={nominalPengajuanSettlementVAUSDPartner}
                                                onValueChange={(e) => setNominalPengajuanSettlementVAUSDPartner(e)}
                                                placeholder="0"
                                                style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600, color: "#383838" }}
                                                groupSeparator={"."}
                                                decimalSeparator={','}
                                                prefix={`${isCurrencySettlementVAUSDPartner} `}
                                                // maxLength={biayaHandle.feeType === 101 ? 3 : false}
                                                // suffix={biayaHandle.feeType === 0 || biayaHandle.feeType === 100 ? "" : "%"}
                                            />
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>Biaya Settlement</td>
                                        <td>
                                            <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, color: "#B9121B" }}>- {isCurrencySettlementVAUSDPartner} {isCurrencySettlementVAUSDPartner !== "USD" ? ballanceSettlementVAUSDPartner?.IDR?.fee : ballanceSettlementVAUSDPartner?.USD?.fee}</div>
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>Total Settlement</td>
                                        <td>
                                            {/* <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 700 }}>{isCurrencySettlementVAUSDPartner} 0</div> */}
                                            <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 700 }}>{isCurrencySettlementVAUSDPartner} {convertToRupiah(Number(nominalPengajuanSettlementVAUSDPartner !== undefined ? nominalPengajuanSettlementVAUSDPartner : 0) - Number(isCurrencySettlementVAUSDPartner !== "USD" ? ballanceSettlementVAUSDPartner?.IDR?.fee : ballanceSettlementVAUSDPartner?.USD?.fee), false, 2)}</div>
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>Sisa Saldo</td>
                                        <td>
                                            <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 700 }}>{isCurrencySettlementVAUSDPartner} {convertToRupiah(Number(isCurrencySettlementVAUSDPartner !== "USD" ? ballanceSettlementVAUSDPartner?.IDR?.balance : ballanceSettlementVAUSDPartner?.USD?.balance) - Number(nominalPengajuanSettlementVAUSDPartner !== undefined ? nominalPengajuanSettlementVAUSDPartner : 0) - Number(isCurrencySettlementVAUSDPartner !== "USD" ? ballanceSettlementVAUSDPartner?.IDR?.fee : ballanceSettlementVAUSDPartner?.USD?.fee), false, 2)}</div>
                                        </td>
                                    </tr>
                                    <br />
                                    <tr>
                                        <td>
                                            <button
                                                onClick={() => submitSettlementVAUSDPartner('accName', 'accNumber', isCurrencySettlementVAUSDPartner, 'bankCode', (Number(nominalPengajuanSettlementVAUSDPartner !== undefined ? nominalPengajuanSettlementVAUSDPartner : 0) - Number(isCurrencySettlementVAUSDPartner !== "USD" ? ballanceSettlementVAUSDPartner?.IDR?.fee : ballanceSettlementVAUSDPartner?.USD?.fee)))}
                                                className={(nominalPengajuanSettlementVAUSDPartner === undefined || Number(nominalPengajuanSettlementVAUSDPartner) === 0) ? 'btn-ez' : 'btn-ez-on'}
                                                disabled={(nominalPengajuanSettlementVAUSDPartner === undefined || Number(nominalPengajuanSettlementVAUSDPartner) === 0)}
                                            >
                                                Ajukan
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='base-content my-4 pb-5'>
                            <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>{language === null ? eng.filter : language.filter}</span>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span style={{ marginRight: 64 }}>ID Transaksi</span>
                                    <input onChange={(e) => "handleChangePartner(e)"} value={inputHandleSettlementVAUSDPartner.idTransaksiSettlementVAUSDPartner} name="idTransaksiSettlementVAUSDPartner" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: (showDateRequestSettlementVAUSDPartner === "none") ? "33%" : "33%" }}>
                                    <span className="me-3">Periode Request<span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periodeRequestSettlementVAUSDPartner' className="input-text-riwayat ms-5" value={inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner} onChange={(e) => "handleChangePeriodeVAUSDPartner(e)"}>
                                        <option defaultChecked disabled value={0}>{language === null ? eng.pilihPeriode : language.pilihPeriode}</option>
                                        <option value={2}>{language === null ? eng.hariIni : language.hariIni}</option>
                                        <option value={3}>{language === null ? eng.kemarin : language.kemarin}</option>
                                        <option value={4}>{language === null ? eng.tujuhHariTerakhir : language.tujuhHariTerakhir}</option>
                                        <option value={5}>{language === null ? eng.bulanIni : language.bulanIni}</option>
                                        <option value={6}>{language === null ? eng.bulanKemarin : language.bulanKemarin}</option>
                                        <option value={7}>{language === null ? eng.pilihRangeTanggal : language.pilihRangeTanggal}</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-start align-items-center">
                                    <span style={{ marginRight: 32 }}>Status</span>
                                    <input onChange={(e) => "handleChangePartner(e)"} value={inputHandleSettlementVAUSDPartner.statusSettlementVAUSDPartner} name="statusSettlementVAUSDPartner" type='text' className='input-text-riwayat ms-3' placeholder='Masukkan No. VA'/>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={4} className="d-flex justify-content-between align-items-center" style={{ width: (showDateTerimaSettlementVAUSDPartner === "none") ? "33%" : "33%" }}>
                                    <span className="me-3">Periode Terima<span style={{ color: "red" }}>*</span></span>
                                    <Form.Select name='periodeRequestSettlementVAUSDPartner' className="input-text-riwayat ms-5" value={inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner} onChange={(e) => "handleChangePeriodeVAUSDPartner(e)"}>
                                        <option defaultChecked disabled value={0}>{language === null ? eng.pilihPeriode : language.pilihPeriode}</option>
                                        <option value={2}>{language === null ? eng.hariIni : language.hariIni}</option>
                                        <option value={3}>{language === null ? eng.kemarin : language.kemarin}</option>
                                        <option value={4}>{language === null ? eng.tujuhHariTerakhir : language.tujuhHariTerakhir}</option>
                                        <option value={5}>{language === null ? eng.bulanIni : language.bulanIni}</option>
                                        <option value={6}>{language === null ? eng.bulanKemarin : language.bulanKemarin}</option>
                                        <option value={7}>{language === null ? eng.pilihRangeTanggal : language.pilihRangeTanggal}</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={4} style={{ display: showDateRequestSettlementVAUSDPartner }} className='text-start ps-5'>
                                    <DateRangePicker
                                        onChange={(page) => pickDateVAUSDPartner(page, "request")}
                                        value={stateRequestSettlementVAUSDPartner}
                                        clearIcon={null}
                                    />
                                </Col>
                                <Col xs={4} style={{ display: showDateTerimaSettlementVAUSDPartner }} className='text-start ps-5'>
                                    <DateRangePicker
                                        onChange={(page) => pickDateVAUSDPartner(page, "terima")}
                                        value={stateTerimaSettlementVAUSDPartner}
                                        clearIcon={null}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={5}>
                                    <Row>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                onClick={() => getListSettlementRequestVAUSDPartner(1, inputHandleSettlementVAUSDPartner.idTransaksiSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner, dateRangeRequestSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.periodeTerimaSettlementVAUSDPartner, dateRangeTerimaSettlementVAUSDPartner, inputHandleSettlementVAUSDPartner.statusSettlementVAUSDPartner)}
                                                className='btn-ez-on'
                                                // className={(inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeVAUSDPartner.length === 0)) ? "btn-ez" : "btn-ez-on"}
                                                // disabled={(inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeVAUSDPartner.length === 0))}
                                            >
                                                {language === null ? eng.terapkan : language.terapkan}
                                            </button>
                                        </Col>
                                        <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                            <button
                                                className='btn-reset'
                                                // onClick={resetButtonVAUSDPartnerHandle}
                                                // className={(inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeVAUSDPartner.length === 0)) ? "btn-ez-reset" : "btn-reset"}
                                                // disabled={(inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 0 || (inputHandleSettlementVAUSDPartner.periodeRequestSettlementVAUSDPartner === 7 && dateRangeVAUSDPartner.length === 0))}
                                            >
                                                {language === null ? eng.aturUlang : language.aturUlang}
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div className="div-table pb-4">
                                <DataTable
                                    columns={columnsSettlementVAUSDPartner}
                                    data={listSettlementVAUSDPartner}
                                    customStyles={customStylesSettlementVAUSD}
                                    noDataComponent={language === null ? eng.tidakAdaData : language.tidakAdaData}
                                    highlightOnHover
                                    progressPending={pendingSettlementVAUSDPartner}
                                    progressComponent={<CustomLoader />}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                <div style={{ marginRight: 10, marginTop: 10 }}>{language === null ? eng.totalHalaman : language.totalHalaman} : {totalPageSettlementVAUSDPartner}</div>
                                <Pagination
                                    activePage={activePageSettlementVAUSDPartner}
                                    itemsCountPerPage={pageNumberSettlementVAUSDPartner.row_per_page}
                                    totalItemsCount={(pageNumberSettlementVAUSDPartner.row_per_page*pageNumberSettlementVAUSDPartner.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={handlePageChangeSettlementVAUSDPartner}
                                />
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}

export default SettlementVAUSDPartner