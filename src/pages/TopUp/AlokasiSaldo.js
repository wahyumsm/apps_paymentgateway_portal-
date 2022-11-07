import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Table, Modal, Alert, Toast, Image } from '@themesberg/react-bootstrap'
import { BaseURL, convertFormatNumber, convertToRupiah, getRole, getToken, setUserSession } from '../../function/helpers'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { Link, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons"
import Checklist from '../../assets/icon/checklist_icon.svg'
import axios from 'axios'
import encryptData from '../../function/encryptData'
import noteIconRed from "../../assets/icon/note_icon_red.svg"
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/DateRangePicker'
import DataTable from 'react-data-table-component'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import Pagination from 'react-js-pagination'
import gagalMasukAlokasi from '../../assets/icon/gagaltopup_icon.svg'

function AlokasiSaldo() {

    const user_role = getRole()
    const [balance, setBalance] = useState({})
    const history = useHistory();
    const [balanceDetail, setBalanceDetail] = useState([])
    const [disbursementChannel, setDisbursementChannel] = useState([])
    const [showModalSaveAlokasiSaldo, setShowModalSaveAlokasiSaldo] = useState(false)
    const [showAlertSuccess, setShowAlertSuccess] = useState(false)
    const [showAlertSaldoTidakCukup, setShowAlertSaldoTidakCukup] = useState(false)
    const [showModalAlokasi, setShowModalAlokasi] = useState(false)
    const [disburseBCA, setDisburseBCA] = useState({
        id: "32",
        checked: true,
        minAlokasi: false,
        addedAmount: 0
    })
    const [disburseDana, setDisburseDana] = useState({
        id: "31",
        checked: false,
        minAlokasi: false,
        addedAmount: 0
    })
    const [disburseMandiri, setDisburseMandiri] = useState({
        id: "33",
        checked: false,
        minAlokasi: false,
        addedAmount: 0
    })
    
    const [disburseInterbank, setDisburseInterbank] = useState({
        id: "28",
        checked: false,
        minAlokasi: false,
        addedAmount: 0
    })
    const [addedDisbursementChannels, setaddedDisbursementChannels] = useState([{
        id: "32",
        addedAmount: 0
    }])
    const [inputHandle, setInputHandle] = useState({
        nominalBCA: 0,
        nominalDana: 0,
        checklistBCA: true,
        DanaFlag: false,
        BCAFlag: false,
        MandiriFlag: false,
    })

    const [periodeRiwayatAlokasiSaldo, setPeriodeRiwayatAlokasiSaldo] = useState(0)
    const [showDateRiwayatAlokasiSaldo, setShowDateRiwayatAlokasiSaldo] = useState("none")
    const [stateRiwayatAlokasiSaldo, setStateRiwayatAlokasiSaldo] = useState(null)
    const [dateRangeRiwayatAlokasiSaldo, setDateRangeRiwayatAlokasiSaldo] = useState([])
    const [listRiwayat, setListRiwayat] = useState([])
    const [pendingAlokasiSaldo, setPendingAlokasiSaldo] = useState(true)
    const [isFilterHistory, setIsFilterHistory] = useState(false)
    const [totalPageRiwayatAlokasiSaldo, setTotalPageRiwayatAlokasiSaldo] = useState(1)
    const [activePageRiwayatAlokasiSaldo, setActivePageRiwayatAlokasiSaldo] = useState(1)
    const [pageNumberRiwayatAlokasiSaldo, setPageNumberRiwayatAlokasiSaldo] = useState({})
    const [tujuanAlokasiSaldo, setTujuanAlokasiSaldo] = useState(0)
    const [isSorting, setIsSorting] = useState(false)
    const [isDesc, setIsDesc] = useState({
        orderField: "tpartballchannel_crtdt",
        orderIdTanggal: true,
        orderIdStatus: true,
    })

    function convertToRupiahFunct(sisaSaldo, alokasiDana, alokasiBCA, alokasiMandiri, alokasiInterbank) {
        let finalSisaSaldo = Number(sisaSaldo) - Number(alokasiDana) - Number(alokasiBCA) - Number(alokasiMandiri) - Number(alokasiInterbank)
        setTimeout(() => {
            if (finalSisaSaldo < 0) {
                setShowAlertSaldoTidakCukup(true)
            } else {
                setShowAlertSaldoTidakCukup(false)
            }
        }, 500);
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0}).format(finalSisaSaldo)
    }

    function resetButtonHandle() {
        setPeriodeRiwayatAlokasiSaldo(0)
        setDateRangeRiwayatAlokasiSaldo([])
        setTujuanAlokasiSaldo(0)
        setShowDateRiwayatAlokasiSaldo("none")
        setStateRiwayatAlokasiSaldo(null)
    }

    function handleChangeTujuanAlokasi(e) {
        setTujuanAlokasiSaldo(e.target.value)
    }

    function sortingHandle(sortColumn, value, isFilter, dateId, dateRange, payTypeId, channelDisburse) {
        setIsSorting(true)
        let newPayTypeId = []
        if (payTypeId === 0) {
            channelDisburse.forEach(item => newPayTypeId.push(item.mpaytype_id))
        }
        if (sortColumn === "tpartballchannel_crtdt" && !isFilter) {
            setIsDesc({
                ...isDesc,
                orderField: sortColumn,
                orderIdTanggal: value,
                orderIdStatus: true
            })
            historyAlokasiSaldo(1, value, sortColumn, (payTypeId === 0 ? newPayTypeId : payTypeId))
        } else if (sortColumn === "tpartballchannel_crtdt" && isFilter) {
            setIsDesc({
                ...isDesc,
                orderField: sortColumn,
                orderIdTanggal: value,
                orderIdStatus: true
            })
            filterHistoryAlokasiSaldo(1, dateId, dateRange, (payTypeId === 0 ? newPayTypeId : payTypeId), value, sortColumn)
        } else if (sortColumn === "mstatus_name" && !isFilter) {
            setIsDesc({
                ...isDesc,
                orderField: sortColumn,
                orderIdTanggal: true,
                orderIdStatus: value
            })
            historyAlokasiSaldo(1, value, sortColumn, (payTypeId === 0 ? newPayTypeId : payTypeId))
        } else if (sortColumn === "mstatus_name" && isFilter) {
            setIsDesc({
                ...isDesc,
                orderField: sortColumn,
                orderIdTanggal: true,
                orderIdStatus: value
            })
            filterHistoryAlokasiSaldo(1, dateId, dateRange, (payTypeId === 0 ? newPayTypeId : payTypeId), value, sortColumn)
        }
    }

    function handlePageChangeAlokasiSaldo(page, isFilter, detId, dateRange, payTypeId, isDescending, channelDisburse) {
        setActivePageRiwayatAlokasiSaldo(page)
        let newPayTypeId = []
        if (payTypeId === 0) {
            channelDisburse.forEach(item => newPayTypeId.push(item.mpaytype_id))
        }
        if (isFilter) {
            filterHistoryAlokasiSaldo(page, detId, dateRange, (payTypeId === 0 ? newPayTypeId : payTypeId), (isDescending.orderField === "tpartballchannel_crtdt") ? isDescending.orderIdTanggal : isDescending.orderIdStatus, isDescending.orderField)
        } else if (!isFilter) {
            historyAlokasiSaldo(page, (isDescending.orderField === "tpartballchannel_crtdt") ? isDescending.orderIdTanggal : isDescending.orderIdStatus, isDescending.orderField, (payTypeId === 0 ? newPayTypeId : payTypeId))
        }
    }

    function pickDateRiwayatAlokasiSaldo(item) {
        setStateRiwayatAlokasiSaldo(item)
        if (item !== null) {
            item = item.map(el => el.toLocaleDateString('en-CA'))
            setDateRangeRiwayatAlokasiSaldo(item)
        }
    }

    function handleChangePeriodeRiwayatAlokasiSaldo(e) {
        if (e.target.value === "7") {
            setShowDateRiwayatAlokasiSaldo("")
            setPeriodeRiwayatAlokasiSaldo(e.target.value)
        } else {
            setShowDateRiwayatAlokasiSaldo("none")
            setPeriodeRiwayatAlokasiSaldo(e.target.value)
        }
    }

    function handleChecklist(e, catId) {
        if (e.target.id === "31") {
            setDisburseDana({
                ...disburseDana,
                cat_id: catId,
                checked: e.target.checked,
                addedAmount: 0
            })
        } else if (e.target.id === "32") {
            setDisburseBCA({
                ...disburseBCA,
                cat_id: catId,
                checked: e.target.checked,
                addedAmount: 0
            })
        } else if (e.target.id === "33") {
            setDisburseMandiri({
                ...disburseMandiri,
                cat_id: catId,
                checked: e.target.checked,
                addedAmount: 0
            })
        } else if (e.target.id === "28") {
            setDisburseInterbank({
                ...disburseInterbank,
                cat_id: catId,
                checked: e.target.checked,
                addedAmount: 0
            })
        }
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.checked,
            [`nominal${(e.target.name).slice(9)}`]: 0
        })
    }

    function handleChangeAmount(e, catId, minimalAlokasiSaldo) {
        if (e.target.id === "31" && Number(e.target.value) < minimalAlokasiSaldo) {
            setDisburseDana({
                ...disburseDana,
                cat_id: catId,
                minAlokasi: true,
                addedAmount: Number(e.target.value)
            })
        } else if (e.target.id === "31" && Number(e.target.value) >= minimalAlokasiSaldo) {
            setDisburseDana({
                ...disburseDana,
                cat_id: catId,
                minAlokasi: (Number(e.target.value) === 0) ? true : false,
                addedAmount: Number(e.target.value)
            })
        } else if (e.target.id === "32" && Number(e.target.value) < minimalAlokasiSaldo) {
            setDisburseBCA({
                ...disburseBCA,
                cat_id: catId,
                minAlokasi: true,
                addedAmount: Number(e.target.value)
            })
        } else if (e.target.id === "32" && Number(e.target.value) >= minimalAlokasiSaldo) {
            setDisburseBCA({
                ...disburseBCA,
                cat_id: catId,
                minAlokasi: (Number(e.target.value) === 0) ? true : false,
                addedAmount: Number(e.target.value)
            })
        } else if (e.target.id === "33" && Number(e.target.value) < minimalAlokasiSaldo) {
            setDisburseMandiri({
                ...disburseMandiri,
                cat_id: catId,
                minAlokasi: true,
                addedAmount: Number(e.target.value)
            })
        } else if (e.target.id === "33" && Number(e.target.value) >= minimalAlokasiSaldo) {
            setDisburseMandiri({
                ...disburseMandiri,
                cat_id: catId,
                minAlokasi: (Number(e.target.value) === 0) ? true : false,
                addedAmount: Number(e.target.value)
            })
        } else if (e.target.id === "28" && Number(e.target.value) < minimalAlokasiSaldo) {
            setDisburseInterbank({
                ...disburseInterbank,
                cat_id: catId,
                minAlokasi: true,
                addedAmount: Number(e.target.value)
            })
        } else if (e.target.id === "28" && Number(e.target.value) >= minimalAlokasiSaldo) {
            setDisburseInterbank({
                ...disburseInterbank,
                cat_id: catId,
                minAlokasi: (Number(e.target.value) === 0) ? true : false,
                addedAmount: Number(e.target.value)
            })
        }
        setInputHandle({
            ...inputHandle,
            [e.target.name]: Number(e.target.value).toString()
        })
    }

    function handleChangeText(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name]: e.target.value
        })
        addedDisbursementChannels.forEach(item => {
            if (!item.channel) {
                setaddedDisbursementChannels([
                    ...addedDisbursementChannels,
                    {
                        channel: e.target.name,
                        addedAmount: e.target.value
                    }
                ])
            } else if (item.channel && item.channel === e.target.name) {
                setaddedDisbursementChannels([
                    ...addedDisbursementChannels,
                    {
                        addedAmount: e.target.value
                    }
                ])
            }
        })
        // setNominalBCA(e.target.value)
    }

    function handleChangeNumber(e) {
        setInputHandle({
            ...inputHandle,
            [e.target.name]: Number(e.target.value).toString()
        })
        // setNominalBCA(Number(e.target.value).toString())
    }

    function setOnBlurFunction(value, key) {
        setInputHandle({
            ...inputHandle,
            [key]: true
        })
    }

    function setOnFocusFunction(value, key) {
        setInputHandle({
            ...inputHandle,
            [key]: false
        })
    }

    function closeAlokasi () {
        history.push("/laporan");
        setShowModalAlokasi(false)
    }

    async function getBalance() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const balance = await axios.post(BaseURL + "/Partner/GetBalance", { data: "" }, { headers: headers })
            if (balance.status === 200 && balance.data.response_code === 200 && balance.data.response_new_token.length === 0) {
                setBalance(balance.data.response_data)
                if (balance.data.response_data.balance_detail.length !== 0) {
                    setBalanceDetail(balance.data.response_data.balance_detail)
                } else {
                    setShowModalAlokasi(true)
                }
            } else if (balance.status === 200 && balance.data.response_code === 200 && balance.data.response_new_token.length !== 0) {
                setUserSession(balance.data.response_new_token)
                setBalance(balance.data.response_data)
                if (balance.data.response_data.balance_detail.length !== 0) {
                    setBalanceDetail(balance.data.response_data.balance_detail)
                } else {
                    setShowModalAlokasi(true)
                }
            }
        } catch (error) {
            // console.log(error);
        }
    }

    async function getDisbursementChannel() {
        try {
            const auth = "Bearer " + getToken()
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const disbursementChannel = await axios.post(BaseURL + "/Partner/ListDisburseChannel", { data: "" }, { headers: headers })
            // console.log(disbursementChannel, 'disbursement channel');
            if (disbursementChannel.status === 200 && disbursementChannel.data.response_code === 200 && disbursementChannel.data.response_new_token.length === 0) {
                setDisbursementChannel(disbursementChannel.data.response_data)
                let payTypeId = []
                disbursementChannel.data.response_data = disbursementChannel.data.response_data.forEach(item => payTypeId.push(String(item.mpaytype_id)))
                historyAlokasiSaldo(1, true, isDesc.orderField, payTypeId)
            } else if (disbursementChannel.status === 200 && disbursementChannel.data.response_code === 200 && disbursementChannel.data.response_new_token.length !== 0) {
                setUserSession(disbursementChannel.data.response_new_token)
                setDisbursementChannel(disbursementChannel.data.response_data)
                let payTypeId = []
                disbursementChannel.data.response_data = disbursementChannel.data.response_data.forEach(item => payTypeId.push(String(item.mpaytype_id)))
                historyAlokasiSaldo(1, true, isDesc.orderField, payTypeId)
    }
        } catch (error) {
            // console.log(error);
        }
    }

    async function saveAlokasiSaldo(channelDana, channelBCA, channelMandiri, channelInterbank) {
        try {
            setShowModalSaveAlokasiSaldo(false)
            let newArr = []
            if (channelDana.checked === true) {
                newArr.push({
                    mpaytype_id: Number(channelDana.id),
                    mpaycat_id: Number(channelDana.cat_id),
                    amount: Number(channelDana.addedAmount),
                })
            }
            if (channelBCA.checked === true) {
                newArr.push({
                    mpaytype_id: Number(channelBCA.id),
                    mpaycat_id: Number(channelBCA.cat_id),
                    amount: Number(channelBCA.addedAmount),
                })
            }
            if (channelMandiri.checked === true) {
                newArr.push({
                    mpaytype_id: Number(channelMandiri.id),
                    mpaycat_id: Number(channelMandiri.cat_id),
                    amount: Number(channelMandiri.addedAmount),
                })
            }
            if (channelInterbank.checked === true) {
                newArr.push({
                    mpaytype_id: Number(channelInterbank.id),
                    mpaycat_id: Number(channelInterbank.cat_id),
                    amount: Number(channelInterbank.addedAmount),
                })
            }
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(JSON.stringify(newArr))
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const savedAlokasiSaldo = await axios.post(BaseURL + "/Partner/SplitDisburseChannel", { data: dataParams }, { headers: headers })
            if (savedAlokasiSaldo.status === 200 && savedAlokasiSaldo.data.response_code === 200 && savedAlokasiSaldo.data.response_new_token.length === 0) {
                setShowAlertSuccess(true)
                setTimeout(() => {
                    setShowAlertSuccess(false)
                    window.location.reload()
                }, 2000);
            } else if (savedAlokasiSaldo.status === 200 && savedAlokasiSaldo.data.response_code === 200 && savedAlokasiSaldo.data.response_new_token.length !== 0) {
                setUserSession(savedAlokasiSaldo.data.response_new_token)
                setShowAlertSuccess(true)
                setTimeout(() => {
                    setShowAlertSuccess(false)
                    window.location.reload()
                }, 2000);
            }
        } catch (error) {
            // console.log(error);
        }
    }

    async function historyAlokasiSaldo(currentPage, isDescending, orderField, payTypeId) {
        try {
            if ((isDescending === undefined && orderField === undefined) || (isDescending === true && orderField === "tpartballchannel_crtdt")) {
                isDescending = 0
                orderField = "tpartballchannel_crtdt"
            } else if (isDescending === false && orderField === "tpartballchannel_crtdt") {
                isDescending = 1
                orderField = "tpartballchannel_crtdt"
            } else if (isDescending === true && orderField === "mstatus_name") {
                isDescending = 0
                orderField = "mstatus_name"
            } else if (isDescending === false && orderField === "mstatus_name") {
                isDescending = 1
                orderField = "mstatus_name"
            }
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{
                "date_from": "",
                "date_to": "",
                "dateID": 5,
                "page": ${(currentPage === 0) ? 1 : currentPage},
                "row_per_page": 10,
                "order_id": ${isDescending},
                "order_field": "${orderField}",
                "statusID": [ "1", "2" ],
                "paytypeID": [${payTypeId}]
            }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const ballanceAllocation = await axios.post(BaseURL + "/Partner/HistoryBallanceAllocation", { data: dataParams }, { headers: headers })
            if (ballanceAllocation.status === 200 && ballanceAllocation.data.response_code === 200 && ballanceAllocation.data.response_new_token.length === 0) {
                ballanceAllocation.data.response_data.results = ballanceAllocation.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberRiwayatAlokasiSaldo(ballanceAllocation.data.response_data)
                setActivePageRiwayatAlokasiSaldo(ballanceAllocation.data.response_data.page)
                setTotalPageRiwayatAlokasiSaldo(ballanceAllocation.data.response_data.max_page)
                setListRiwayat(ballanceAllocation.data.response_data.results)
                setPendingAlokasiSaldo(false)
            } else if (ballanceAllocation.status === 200 && ballanceAllocation.data.response_code === 200 && ballanceAllocation.data.response_new_token.length !== 0) {
                setUserSession(ballanceAllocation.data.response_new_token)
                ballanceAllocation.data.response_data.results = ballanceAllocation.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberRiwayatAlokasiSaldo(ballanceAllocation.data.response_data)
                setActivePageRiwayatAlokasiSaldo(ballanceAllocation.data.response_data.page)
                setTotalPageRiwayatAlokasiSaldo(ballanceAllocation.data.response_data.max_page)
                setListRiwayat(ballanceAllocation.data.response_data.results)
                setPendingAlokasiSaldo(false)
            }
        } catch (error) {
            // console.log(error);
        }
    }

    async function filterHistoryAlokasiSaldo(currentPage, dateId, dateRange, payTypeId, isDescending, orderField) {
        try {
            setIsFilterHistory(true)
            setPendingAlokasiSaldo(true)
            // console.log(disbursementChannel, 'ini disburchannel dari luar');
            let newPayTypeId = []
            if (payTypeId === 0) {
                disbursementChannel.forEach(item => newPayTypeId.push(item.mpaytype_id))
            }
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{ "date_from": "${(dateRange.length !== 0) ? dateRange[0] : ""}", "date_to": "${(dateRange.length !== 0) ? dateRange[1] : ""}", "dateID": ${(dateId !== undefined) ? dateId : 2}, "page": ${(currentPage === 0) ? 1 : currentPage}, "row_per_page": 10, "order_id": ${(isDescending === undefined || isDescending) ? 0 : 1}, "order_field": "${(orderField === undefined) ? "tpartballchannel_crtdt" : orderField}", "statusID": [ "1", "2" ], "paytypeID": [ ${(payTypeId === 0) ? newPayTypeId : payTypeId} ] }`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const filterHistory = await axios.post(BaseURL + "/Partner/HistoryBallanceAllocation", { data: dataParams }, { headers: headers })
            if (filterHistory.status === 200 && filterHistory.data.response_code === 200 && filterHistory.data.response_new_token.length === 0) {
                filterHistory.data.response_data.results = filterHistory.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberRiwayatAlokasiSaldo(filterHistory.data.response_data)
                setActivePageRiwayatAlokasiSaldo(filterHistory.data.response_data.page)
                setTotalPageRiwayatAlokasiSaldo(filterHistory.data.response_data.max_page)
                setListRiwayat(filterHistory.data.response_data.results)
                setPendingAlokasiSaldo(false)
            } else if (filterHistory.status === 200 && filterHistory.data.response_code === 200 && filterHistory.data.response_new_token.length !== 0) {
                setUserSession(filterHistory.data.response_new_token)
                filterHistory.data.response_data.results = filterHistory.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                setPageNumberRiwayatAlokasiSaldo(filterHistory.data.response_data)
                setActivePageRiwayatAlokasiSaldo(filterHistory.data.response_data.page)
                setTotalPageRiwayatAlokasiSaldo(filterHistory.data.response_data.max_page)
                setListRiwayat(filterHistory.data.response_data.results)
                setPendingAlokasiSaldo(false)
            }
        } catch (error) {
            // console.log(error);
        }
    }

    useEffect(() => {
        getBalance()
        getDisbursementChannel()
    }, [])

    // const columnsRiwayatAlokasiSaldo = [
    //     {
    //         name: 'No',
    //         selector: row => row.number,
    //         width: "57px",
    //         style: { justifyContent: "center" }
    //     },
    //     {
    //         name: 'Tanggal Alokasi',
    //         selector: row => row.tpartballchannel_crtdt_format,
    //         // sortable: true
    //         width: "150px",
    //         style: { justifyContent: "center" }
    //     },
    //     {
    //         name: 'Tujuan Alokasi',
    //         selector: row => row.mpaytype_name,
    //         // sortable: true
    //         width: "150px",
    //         style: { justifyContent: "center" }
    //     },
    //     {
    //         name: 'Total Alokasi',
    //         selector: row => row.tpartballchannel_amount_rp,
    //         style: { justifyContent: "flex-end" },
    //         width: "150px",
    //         // sortable: true,
    //     },
    //     {
    //         name: 'Saldo Awal Tersedia',
    //         selector: row => row.tpartballchannel_balance_before_rp,
    //         width: "224px",
    //         style: { justifyContent: "flex-end", },
    //         // sortable: true,
    //     },
    //     {
    //         name: 'Sisa Saldo Tersedia',
    //         selector: row => row.tpartballchannel_balance_after_rp,
    //         width: "224px",
    //         style: { justifyContent: "flex-end", },
    //         // sortable: true,
    //     },
    //     {
    //         name: 'Status',
    //         selector: row => row.mstatus_name,
    //         // cell:  (row) => (row.tparttopup_status_id === 1 || row.tparttopup_status_id === 7) ? <Link style={{color: "#F79421"}} onClick={() => detailTopUpHandler(row.tparttopup_code)}>{row.mstatus_name_ind}</Link> : (row.tparttopup_status_id === 2) ? <div style={{color: "#077E86"}}>{row.mstatus_name_ind}</div> : (row.tparttopup_status_id === 4) ? <div style={{color: "#B9121B"}}>{row.mstatus_name_ind}</div> : (row.tparttopup_status_id === 3 || row.tparttopup_status_id === 5 || row.tparttopup_status_id === 6 || row.tparttopup_status_id === 8 || row.tparttopup_status_id === 9 || row.tparttopup_status_id === 10 || row.tparttopup_status_id === 11 || row.tparttopup_status_id === 12 || row.tparttopup_status_id === 13 || row.tparttopup_status_id === 14 || row.tparttopup_status_id === 15) && <div style={{color: "#888888"}}>{row.mstatus_name_ind}</div>, 
    //         // width: "150px",
    //         // sortable: true,
    //         style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "6px", width: "100%", borderRadius: 4 },
    //         conditionalCellStyles: [
    //             {
    //                 when: row => row.tpartballchannel_status_id === 2,
    //                 style: { background: "rgba(7, 126, 134, 0.08)", paddingLeft: "unset" }
    //             },
    //             {
    //                 when: row => row.tpartballchannel_status_id === 1 || row.tpartballchannel_status_id === 7, 
    //                 className: ['detailStatus'],
    //                 style: { cursor:"pointer", textDecoration: "underline", background: "rgba(247, 148, 33, 0.08)", paddingLeft: "unset", '&:hover': {cursor: 'pointer', backgroundColor: '#FFFFFF'},},
    //                 option: {'&:hover': {backgroundColor: "#FFFFFF"} }
    //             },
    //             {
    //                 when: row => row.tpartballchannel_status_id === 4,
    //                 style: { background: "rgba(185, 18, 27, 0.08)", paddingLeft: "unset" }
    //             },
    //             {
    //                 when: row => row.tpartballchannel_status_id === 3 || row.tpartballchannel_status_id === 5 || row.tpartballchannel_status_id === 6 || row.tpartballchannel_status_id === 8 || row.tpartballchannel_status_id === 9 || row.tpartballchannel_status_id === 10 || row.tpartballchannel_status_id === 11 || row.tpartballchannel_status_id === 12 || row.tpartballchannel_status_id === 13 || row.tpartballchannel_status_id === 14 || row.tpartballchannel_status_id === 15,
    //                 style: { background: "#F0F0F0", paddingLeft: "unset" }
    //             }
    //         ],
    //     },
    // ];

    // const customStyles = {
    //     headCells: {
    //         style: {
    //             backgroundColor: '#F2F2F2',
    //             border: '12px',
    //             fontWeight: 'bold',
    //             fontSize: '16px',
    //             display: 'flex',
    //             justifyContent: 'center',
    //         },
    //     },
    // };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
            <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
            <div>Loading...</div>
        </div>
    );

    return (
        <div className="py-5 mt-5 content-page">
            <div className="head-title">
                <span className='breadcrumbs-span'>{(user_role === "102") ? "Beranda" : <Link to={"/"}>Beranda</Link>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Alokasi Saldo</span>
            </div>
            <br/>
            <div className="main-content">
                <span className='mt-4' style={{fontWeight: 600}}>Alokasi Saldo</span>
                <Row className='mt-2'>
                    <Col lg={4} className="mb-2">
                        <div className="card-information base-content-beranda" style={{ padding: "15px 25px" }}>
                            <p className="p-info">Saldo Tersedia</p>
                            <p className="p-amount">{(balance.balance !== undefined) ? convertToRupiah(balance.balance) :"Rp 0"}</p>
                        </div>
                    </Col>
                    {
                        balanceDetail.length !== 0 &&
                        balanceDetail.map(item => {
                            return (
                                <Col lg={4} className="mb-2" key={item.mpartballchannel_id}>
                                    <div className="card-information base-content-beranda" style={{ padding: "15px 25px" }}>
                                        <p className="p-info">Alokasi Saldo di {item.mpaytype_name}</p>
                                        <p className="p-amount">{(item.mpartballchannel_balance !== 0) ? convertToRupiah(item.mpartballchannel_balance) : "Rp 0"}</p>
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
                <div className='mt-4'>
                    <span className='mt-4' style={{fontWeight: 600}}>Alokasikan Saldo</span>
                    <div className='base-content mt-2' style={{ padding: "20px 40px" }}>
                        <span style={{fontWeight: 600}}>Pilih Tujuan Alokasi Saldo</span>
                        <Row className='alokasi-saldo mt-3' style={{ verticalAlign: "middle" }}>
                            {
                                disbursementChannel.length !== 0 &&
                                disbursementChannel.map(item => {
                                    return (
                                        <Col xs={2} key={item.mpaytype_id}>
                                            {/* <img src={item.mpaytype_icon} alt={item.mpaytype_name} /> */}
                                            <Form.Check onChange={(e) => handleChecklist(e, item.mpaytype_mpaycat_id)} name={`checklist${item.mpaytype_name}`} checked={(item.mpaytype_name === "BCA") ? inputHandle.checklistBCA : inputHandle[`checklist${item.mpaytype_name}`]} label={item.mpaytype_name} id={item.mpaytype_id} htmlFor={item.mpaytype_id} />
                                        </Col>
                                    )
                                })
                            }
                            {/* <Col xs={1}>
                                <Form.Check label="Dana" id="Dana" htmlFor="Dana" />
                            </Col> */}
                        </Row>
                        <div className='mt-4' style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "outset" }}></div>
                        <div className='alokasi-amount mt-2'>
                            <Row>
                                {
                                    (disburseDana.checked === false && disburseBCA.checked === false && disburseMandiri.checked === false && disburseInterbank.checked === false) ?
                                    <span style={{ fontSize: 14, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Tujuan alokasi wajib dipilih salah satu.</span> :
                                    disbursementChannel.length !== 0 &&
                                    disbursementChannel.map(item => {
                                        return (
                                            (inputHandle[`checklist${item.mpaytype_name}`] !== undefined && inputHandle[`checklist${item.mpaytype_name}`] === true) ?
                                            <Col lg={5} key={item.mpaytype_id}>
                                                <span style={{fontWeight: 600}}>{item.mpaytype_name}</span>
                                                <Form.Control onChange={(e) => handleChangeAmount(e, item.mpaytype_mpaycat_id, item.min_topup_allocation)} value={inputHandle[`nominal${item.mpaytype_name}`] === 0 ? 0 : inputHandle[`nominal${item.mpaytype_name}`]} min={0} className='input-text-ez' style={{ width: "70%", marginLeft: "unset" }} placeholder="Rp" id={item.mpaytype_id} name={`nominal${item.mpaytype_name}`} type='number' onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} />
                                                {/* {
                                                    inputHandle[`${item.mpaytype_name}Flag`] === true?
                                                    <Form.Control onBlur={() => setOnBlurFunction(!inputHandle[`${item.mpaytype_name}Flag`], `${item.mpaytype_name}Flag`)} onChange={handleChangeNumber} className='input-text-ez' style={{ width: "70%", marginLeft: "unset" }} placeholder="Rp" name={item.mpaytype_name} type="number" value={inputHandle.nominalBCA === 0 ? "Rp" : inputHandle.nominalBCA} onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()} /> :
                                                    <Form.Control onFocus={() => setOnFocusFunction(!inputHandle[`${item.mpaytype_name}Flag`], `${item.mpaytype_name}Flag`)} onChange={handleChangeText} className='input-text-ez' style={{ width: "70%", marginLeft: "unset" }} placeholder="Rp" name={item.mpaytype_name} type="text" value={inputHandle.nominalBCA === 0 ? "Rp" : convertFormatNumber(inputHandle.nominalBCA)} />
                                                    
                                                } */}
                                                {
                                                    item.mpaytype_id === 28 && disburseInterbank.minAlokasi === true && showAlertSaldoTidakCukup === false ? // kena minimal alokasi & saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}>Minimal saldo yang dialokasikan {(item.min_topup_allocation === 0) ? `lebih dari ${item.min_topup_allocation}` : convertFormatNumber(item.min_topup_allocation)}</span> :
                                                    item.mpaytype_id === 28 && disburseInterbank.minAlokasi === true && showAlertSaldoTidakCukup === true ? // kena minimal alokasi & tidak saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    item.mpaytype_id === 28 && disburseInterbank.minAlokasi === false && showAlertSaldoTidakCukup === true ? // tidak kena minimal alokasi & tidak saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    item.mpaytype_id === 31 && disburseDana.minAlokasi === true && showAlertSaldoTidakCukup === false ? // kena minimal alokasi & saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}>Minimal saldo yang dialokasikan {(item.min_topup_allocation === 0) ? `lebih dari ${item.min_topup_allocation}` : convertFormatNumber(item.min_topup_allocation)}</span> :
                                                    item.mpaytype_id === 31 && disburseDana.minAlokasi === true && showAlertSaldoTidakCukup === true ? // kena minimal alokasi & tidak saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    item.mpaytype_id === 31 && disburseDana.minAlokasi === false && showAlertSaldoTidakCukup === true ? // tidak kena minimal alokasi & tidak saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    item.mpaytype_id === 32 && disburseBCA.minAlokasi === true && showAlertSaldoTidakCukup === false ?// kena minimal alokasi & saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}>Minimal saldo yang dialokasikan {(item.min_topup_allocation === 0) ? `lebih dari ${item.min_topup_allocation}` : convertFormatNumber(item.min_topup_allocation)}</span> :
                                                    item.mpaytype_id === 32 && disburseBCA.minAlokasi === true && showAlertSaldoTidakCukup === true ? // kena minimal alokasi & tidak saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    item.mpaytype_id === 32 && disburseBCA.minAlokasi === false && showAlertSaldoTidakCukup === true ?
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    item.mpaytype_id === 33 && disburseMandiri.minAlokasi === true && showAlertSaldoTidakCukup === false ? // kena minimal alokasi & saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}>Minimal saldo yang dialokasikan {(item.min_topup_allocation === 0) ? `lebih dari ${item.min_topup_allocation}` : convertFormatNumber(item.min_topup_allocation)}</span> :
                                                    item.mpaytype_id === 33 && disburseMandiri.minAlokasi === true && showAlertSaldoTidakCukup === true ? // kena minimal alokasi & tidak saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    item.mpaytype_id === 33 && disburseMandiri.minAlokasi === false && showAlertSaldoTidakCukup === true ? // tidak kena minimal alokasi & tidak saldo cukup
                                                    <span style={{ fontSize: 12, color: "#B9121B" }}><img src={noteIconRed} alt='iconRed' className='me-1' />Saldo Tidak Mencukupi</span> :
                                                    <span style={{ fontSize: 12, color: "#C4C4C4" }}>Masukkan nominal saldo yang akan dialokasikan.</span>
                                                }
                                            </Col> : null
                                        )
                                    })
                                }
                            </Row>
                        </div>
                        <div className='mt-4' style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "outset" }}></div>
                        <div className='alokasi-ringkasan mt-2'>
                            <span className='mb-3' style={{fontWeight: 600}}>Ringkasan</span>
                            <Table style={{ marginTop: 20 }}>
                                <tr>
                                    <td>
                                        <span>Saldo Tersedia</span>
                                    </td>
                                    <td>
                                        <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{(balance.balance !== undefined) ? convertToRupiah(balance.balance) :"Rp 0"}</span>
                                    </td>
                                </tr>
                                {/* {
                                    addedDisbursementChannels.length !== 0 &&
                                    addedDisbursementChannels.map(item => {
                                        return (
                                            <tr>
                                                <td>
                                                    <span>Alokasi ke {(item.id === "31") ? "Dana" : (item.id === "32") ? "BCA" : (item.id === "33") ? "Mandiri" : null}</span>
                                                </td>
                                                <td>
                                                    <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{convertToRupiah(item.addedAmount)}</span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                } */}
                                {
                                    disbursementChannel.length !== 0 ?
                                    disbursementChannel.map(item => {
                                        return (
                                            <tr>
                                                {
                                                    (item.mpaytype_id === 31 && disburseDana.checked === true) ?
                                                    <>
                                                        <td>
                                                            <span>Alokasi ke {(item.mpaytype_id === 31 && disburseDana.checked === true) ? "Dana" : null}</span>
                                                        </td>
                                                        <td>
                                                            <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{convertToRupiah((item.mpaytype_id === 31) ? disburseDana.addedAmount : (item.mpaytype_id === 32) ? disburseBCA.addedAmount : (item.mpaytype_id === 33) ? disburseMandiri.addedAmount : (item.mpaytype_id === 28) ? disburseInterbank.addedAmount : 0)}</span>
                                                        </td>
                                                    </> :
                                                    (item.mpaytype_id === 32 && disburseBCA.checked === true) ?
                                                    <>
                                                        <td>
                                                            <span>Alokasi ke {(item.mpaytype_id === 32 && disburseBCA.checked === true) ? "BCA" : null}</span>
                                                        </td>
                                                        <td>
                                                            <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{convertToRupiah((item.mpaytype_id === 31) ? disburseDana.addedAmount : (item.mpaytype_id === 32) ? disburseBCA.addedAmount : (item.mpaytype_id === 33) ? disburseMandiri.addedAmount : (item.mpaytype_id === 28) ? disburseInterbank.addedAmount : 0)}</span>
                                                        </td>
                                                    </> :
                                                    (item.mpaytype_id === 33 && disburseMandiri.checked === true) ?
                                                    <>
                                                        <td>
                                                            <span>Alokasi ke {(item.mpaytype_id === 33 && disburseMandiri.checked === true) ? "Mandiri" : null}</span>
                                                        </td>
                                                        <td>
                                                            <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{convertToRupiah((item.mpaytype_id === 31) ? disburseDana.addedAmount : (item.mpaytype_id === 32) ? disburseBCA.addedAmount : (item.mpaytype_id === 33) ? disburseMandiri.addedAmount : (item.mpaytype_id === 28) ? disburseInterbank.addedAmount : 0)}</span>
                                                        </td>
                                                    </> :
                                                    (item.mpaytype_id === 28 && disburseInterbank.checked === true) ?
                                                    <>
                                                        <td>
                                                            <span>Alokasi ke {(item.mpaytype_id === 28 && disburseInterbank.checked === true) ? "Interbank LLG" : null}</span>
                                                        </td>
                                                        <td>
                                                            <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{convertToRupiah((item.mpaytype_id === 31) ? disburseDana.addedAmount : (item.mpaytype_id === 32) ? disburseBCA.addedAmount : (item.mpaytype_id === 33) ? disburseMandiri.addedAmount : (item.mpaytype_id === 28) ? disburseInterbank.addedAmount : 0)}</span>
                                                        </td>
                                                    </> : null
                                                }
                                            </tr>
                                        )
                                    }) : null
                                }
                            </Table>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "dotted", borderTopColor: "#C4C4C4" }}></div>
                            <Table style={{ marginTop: -10 }}>
                                <tr>
                                        <td>
                                            <span style={{ fontSize: 16, fontWeight: 600 }}>Saldo Tersisa</span>
                                        </td>
                                        <td>
                                            {
                                                showAlertSaldoTidakCukup ?
                                                // <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600, color: "#B9121B" }}>{convertToRupiahFunct((balance.balance !== undefined ? balance.balance : 0) - (Number(disburseDana.addedAmount)) - (Number(disburseBCA.addedAmount)) - (Number(disburseMandiri.addedAmount)))}</span> :
                                                <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600, color: "#B9121B" }}>{convertToRupiahFunct((balance.balance !== undefined) ? balance.balance : 0, disburseDana.addedAmount, disburseBCA.addedAmount, disburseMandiri.addedAmount, disburseInterbank.addedAmount)}</span> :
                                                <span style={{ display: "flex", justifyContent: "flex-end", fontWeight: 600 }}>{convertToRupiahFunct((balance.balance !== undefined) ? balance.balance : 0, disburseDana.addedAmount, disburseBCA.addedAmount, disburseMandiri.addedAmount, disburseInterbank.addedAmount)}</span>
                                            }
                                        </td>
                                    </tr>
                            </Table>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "outset" }}></div>
                            <div className='mt-2'>
                                <Row>
                                    <Col xxl={10}>
                                        <span style={{ fontSize: 18, fontWeight: 600 }}>Keterangan</span>
                                    </Col>
                                    <Row>
                                        <Col xxl={10}>
                                            <span style={{ color: "#888888", marginLeft: 10 }}><FontAwesomeIcon style={{ width: 5, marginRight: 5 }} icon={faCircle} /> Anda dapat mengalokasikan seluruh atau hanya sebagian saldo anda.</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xxl={10}>
                                            <span style={{ color: "#888888", marginLeft: 10 }}><FontAwesomeIcon style={{ width: 5, marginRight: 5 }} icon={faCircle} /> Anda dapat mengalokasikan saldo ke BCA dan DANA atau hanya salah satu saja.</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xxl={10}>
                                            <span style={{ color: "#888888", marginLeft: 10 }}><FontAwesomeIcon style={{ width: 5, marginRight: 5 }} icon={faCircle} /> Jika anda belum mengalokasikan saldo yang anda miliki, maka anda tidak bisa menggunakan saldo tersebut.</span>
                                        </Col>
                                    </Row>
                                </Row>
                            </div>
                        </div>
                        <div className='mt-4' style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "outset" }}></div>
                        <div style={{ display: "flex", justifyContent: "end", marginRight: -15, width: "unset", padding: "0px 15px" }}>
                            <button
                                onClick={() => setShowModalSaveAlokasiSaldo(true)}
                                className={((disburseDana.checked === true && disburseDana.minAlokasi === true) || (disburseDana.checked === true && disburseDana.minAlokasi === false && disburseDana.addedAmount === 0) || (disburseBCA.checked === true && disburseBCA.minAlokasi === true) || (disburseBCA.checked === true && disburseBCA.minAlokasi === false && disburseBCA.addedAmount === 0) || (disburseMandiri.checked === true && disburseMandiri.minAlokasi === true) || (disburseMandiri.checked === true && disburseMandiri.minAlokasi === false && disburseMandiri.addedAmount === 0) || (disburseInterbank.checked === true && disburseInterbank.minAlokasi === true) || (disburseInterbank.checked === true && disburseInterbank.minAlokasi === false && disburseInterbank.addedAmount === 0) || (disburseDana.checked === false && disburseBCA.checked === false && disburseMandiri.checked === false && disburseInterbank.checked === false) || showAlertSaldoTidakCukup === true) ? "btn-off mt-3 mb-3" : 'add-button mt-3 mb-3'}
                                style={{ maxWidth: 'max-content', padding: 7, height: 40, }}
                                disabled={(disburseDana.checked === true && disburseDana.minAlokasi === true) || (disburseDana.checked === true && disburseDana.minAlokasi === false && disburseDana.addedAmount === 0) || (disburseBCA.checked === true && disburseBCA.minAlokasi === true) || (disburseBCA.checked === true && disburseBCA.minAlokasi === false && disburseBCA.addedAmount === 0) || (disburseMandiri.checked === true && disburseMandiri.minAlokasi === true) || (disburseMandiri.checked === true && disburseMandiri.minAlokasi === false && disburseMandiri.addedAmount === 0) || (disburseInterbank.checked === true && disburseInterbank.minAlokasi === true) || (disburseInterbank.checked === true && disburseInterbank.minAlokasi === false && disburseInterbank.addedAmount === 0) || (disburseDana.checked === false && disburseBCA.checked === false && disburseMandiri.checked === false && disburseInterbank.checked === false) || showAlertSaldoTidakCukup === true}
                            >
                                Alokasikan Saldo
                            </button>
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    <span className='mt-4' style={{fontWeight: 600}}>Riwayat Alokasi Saldo</span>
                    <div className='base-content mt-2' style={{ padding: "20px 40px" }}>
                        <span style={{fontWeight: 600}}>Filter</span>
                        <Row className='mt-4'>
                            <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: "33.4%" }}>
                                <span className='me-1'>Periode*</span>
                                <Form.Select name='periodeRiwayatAlokasiSaldo' className="input-text-ez" value={(periodeRiwayatAlokasiSaldo !== 0) ? periodeRiwayatAlokasiSaldo : 0} onChange={(e) => handleChangePeriodeRiwayatAlokasiSaldo(e)}>
                                    <option defaultChecked disabled value={0}>Pilih Periode</option>
                                    <option value={2}>Hari Ini</option>
                                    <option value={3}>Kemarin</option>
                                    <option value={4}>7 Hari Terakhir</option>
                                    <option value={5}>Bulan Ini</option>
                                    <option value={6}>Bulan Kemarin</option>
                                    <option value={7}>Pilih Range Tanggal</option>
                                </Form.Select>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-start align-items-center" style={{ width: "32%" }}>
                                <span>Tujuan Alokasi</span>
                                <Form.Select name="tujuanAlokasiSaldo" className='input-text-ez' style={{ display: "inline" }} value={tujuanAlokasiSaldo} onChange={(e) => handleChangeTujuanAlokasi(e)}>
                                    <option defaultChecked disabled value={0}>Pilih Status</option>
                                    {
                                        disbursementChannel.map(item => (
                                            <option key={item.mpaytype_id} value={item.mpaytype_id}>{item.mpaytype_name}</option>
                                        ))
                                    }
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col xs={4} className="d-flex justify-content-center align-items-center" style={{ marginLeft: 7 }}>
                                <div className="my-2" style={{ display: showDateRiwayatAlokasiSaldo }}>
                                    <DateRangePicker
                                        onChange={pickDateRiwayatAlokasiSaldo}
                                        value={stateRiwayatAlokasiSaldo}
                                        clearIcon={null}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => filterHistoryAlokasiSaldo(1, periodeRiwayatAlokasiSaldo, dateRangeRiwayatAlokasiSaldo, tujuanAlokasiSaldo)}
                                            className={(periodeRiwayatAlokasiSaldo !== 0 || (periodeRiwayatAlokasiSaldo !== 0 && dateRangeRiwayatAlokasiSaldo.length !== 0)) ? "btn-ez-on" : "btn-ez"}
                                            disabled={(periodeRiwayatAlokasiSaldo === 0 || (periodeRiwayatAlokasiSaldo === 0 && dateRangeRiwayatAlokasiSaldo.length === 0))}
                                        >
                                            Terapkan
                                        </button>
                                    </Col>
                                    <Col xs={6} style={{ width: "unset", padding: "0px 15px" }}>
                                        <button
                                            onClick={() => resetButtonHandle()}
                                            className={(periodeRiwayatAlokasiSaldo !== 0 || (periodeRiwayatAlokasiSaldo !== 0 && dateRangeRiwayatAlokasiSaldo.length !== 0)) ? "btn-reset" : "btn-ez"}
                                            disabled={(periodeRiwayatAlokasiSaldo === 0 || (periodeRiwayatAlokasiSaldo === 0 && dateRangeRiwayatAlokasiSaldo.length === 0))}
                                        >
                                            Atur Ulang
                                        </button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <div className="div-table" style={{ paddingBottom: 20, marginBottom: 20, display: "flex", justifyContent: "center"}}>
                            {
                                listRiwayat.length === 0 ?
                                <div style={{padding: 24}}>There are no records to display</div> :
                                <table className="mt-3" id="tableAlokasiSaldo" style={(!pendingAlokasiSaldo) ? { width: "100%" } : { display: "flex", flexWrap: "wrap", justifyContent: "center", width: "100%" }} >
                                    <thead style={{ height: 50 }}>
                                        <tr>
                                            <th style={{ width: 55, background: "#F3F4F5", cursor: "pointer", textAlign: "center" }}>No</th>
                                            <th onClick={() => sortingHandle("tpartballchannel_crtdt", !isDesc.orderIdTanggal, isFilterHistory, periodeRiwayatAlokasiSaldo, dateRangeRiwayatAlokasiSaldo, tujuanAlokasiSaldo, disbursementChannel)} style={{ width: 155, background: "#F3F4F5", cursor: "pointer", textAlign: "center" }}>
                                                Tanggal Alokasi
                                                {
                                                    isDesc.orderIdTanggal ?
                                                    <span><FontAwesomeIcon icon={faSortDown} size="lg" className="ms-2" /></span> :
                                                    <span><FontAwesomeIcon icon={faSortUp} size="lg" className="ms-2" /></span>
                                                }
                                            </th>
                                            <th style={{ width: 155, background: "#F3F4F5", textAlign: "center" }}>Tujuan Alokasi</th>
                                            <th style={{ width: 155, background: "#F3F4F5", textAlign: "center" }}>Total Alokasi</th>
                                            <th style={{ width: 155, background: "#F3F4F5", textAlign: "center" }}>Saldo Awal Tersedia</th>
                                            <th style={{ width: 155, background: "#F3F4F5", textAlign: "center" }}>Sisa Saldo Tersedia</th>
                                            <th onClick={() => sortingHandle("mstatus_name", !isDesc.orderIdStatus, isFilterHistory, periodeRiwayatAlokasiSaldo, dateRangeRiwayatAlokasiSaldo, tujuanAlokasiSaldo, disbursementChannel)} style={{ width: 155, textAlign: "center", background: "#F3F4F5", cursor: "pointer", textAlign: "center" }}>
                                                Status
                                                {
                                                    isDesc.orderIdStatus ?
                                                    <span><FontAwesomeIcon icon={faSortDown} size="lg" className="ms-2" /></span> :
                                                    <span><FontAwesomeIcon icon={faSortUp} size="lg" className="ms-2" /></span>
                                                }
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            !pendingAlokasiSaldo ?
                                                listRiwayat.map(item => (
                                                    <tr key={item.tpartballchannel_id} style={{ borderBottom: "hidden", fontSize: 14 }}>
                                                        <td style={{ width: 55, textAlign: "center" }}>{item.number}</td>
                                                        <td style={{ width: 155, textAlign: "center" }}>{item.tpartballchannel_crtdt_format}</td>
                                                        <td style={{ width: 155, textAlign: "center" }}>{item.mpaytype_name}</td>
                                                        <td style={{ paddingRight: 20, width: 155, textAlign: "end" }}>{item.tpartballchannel_amount_rp}</td>
                                                        <td style={{ paddingRight: 20, width: 155, textAlign: "end" }}>{item.tpartballchannel_balance_before_rp}</td>
                                                        <td style={{ paddingRight: 20, width: 155, textAlign: "end" }}>{item.tpartballchannel_balance_after_rp}</td>
                                                        <td 
                                                            style={{ 
                                                                background:
                                                                    (item.tpartballchannel_status_id === 2) ? "rgba(7, 126, 134, 0.08)" :
                                                                    (item.tpartballchannel_status_id === 1 || item.tpartballchannel_status_id === 7) ? "#FEF4E9" :
                                                                    (item.tpartballchannel_status_id === 4) ? "#FDEAEA" :
                                                                    (item.tpartballchannel_status_id === 3 || item.tpartballchannel_status_id === 5 || item.tpartballchannel_status_id === 6 || item.tpartballchannel_status_id === 8 || item.tpartballchannel_status_id === 9 || item.tpartballchannel_status_id === 10 || item.tpartballchannel_status_id === 11 || item.tpartballchannel_status_id === 12 || item.tpartballchannel_status_id === 13 || item.tpartballchannel_status_id === 14 || item.tpartballchannel_status_id === 15) ? "#F0F0F0" :
                                                                    null,
                                                                color:
                                                                    (item.tpartballchannel_status_id === 2) ? "#077E86" :
                                                                    (item.tpartballchannel_status_id === 1 || item.tpartballchannel_status_id === 7) ? "#F79421" :
                                                                    (item.tpartballchannel_status_id === 4) ? "#EE2E2C" :
                                                                    (item.tpartballchannel_status_id === 3 || item.tpartballchannel_status_id === 5 || item.tpartballchannel_status_id === 6 || item.tpartballchannel_status_id === 8 || item.tpartballchannel_status_id === 9 || item.tpartballchannel_status_id === 10 || item.tpartballchannel_status_id === 11 || item.tpartballchannel_status_id === 12 || item.tpartballchannel_status_id === 13 || item.tpartballchannel_status_id === 14 || item.tpartballchannel_status_id === 15) ? "#888888" :
                                                                    null
                                                                    ,
                                                                margin: 6,
                                                                padding: "6px 0px",
                                                                display: "flex",
                                                                flexDirection: "row",
                                                                justifyContent: "center",
                                                                alignItem: "center",
                                                                borderRadius: 4,
                                                            }}
                                                        >
                                                            {item.mstatus_name}
                                                        </td>
                                                    </tr>
                                                )) :
                                            <div >
                                                <CustomLoader />
                                            </div>
                                        }
                                    </tbody>
                                </table>
                            }
                            {/* <table className="table table-bordered mt-3" id="tableInvoice" style={{ width: "100%" }} hover >
                                <thead>
                                    <tr>
                                        {
                                            !payment.isDesc ? (
                                            <th onClick={() => handleClickSort(payment.id, "tpaylink_code", isFilterPaylink)} style={{ width: 155, background: "#F3F4F5", cursor: "pointer" }} className="align-items-center">
                                                Payment ID
                                                <span><FontAwesomeIcon icon={faSortUp} size="lg" className="ms-2" /></span>
                                            </th>
                                            ) : (
                                            <th onClick={() => handleClickSort(payment.id, "tpaylink_code", isFilterPaylink)} style={{ width: 155, background: "#F3F4F5", cursor: "pointer" }} className="align-items-center">
                                                Payment ID
                                                <span><FontAwesomeIcon icon={faSortDown} size="lg" className="ms-2" /></span>
                                            </th>
                                            )
                                        }
                                        <th style={{ background: "#F3F4F5" }}>ID Referensi</th>
                                        {
                                            !dates.isDesc ? (
                                                <th onClick={() => handleClickSort(dates.id, "tpaylink_crtdt", isFilterPaylink)} style={{ background: "#F3F4F5", cursor: "pointer" }}>
                                                    Tanggal Pembuatan
                                                    <span><FontAwesomeIcon icon={faSortUp} size="lg" className="ms-2" /></span>
                                                </th>
                                            ) : (
                                                <th onClick={() => handleClickSort(dates.id, "tpaylink_crtdt", isFilterPaylink)} style={{ background: "#F3F4F5", cursor: "pointer" }}>
                                                    Tanggal Pembuatan
                                                    <span><FontAwesomeIcon icon={faSortDown} size="lg" className="ms-2" /></span>
                                                </th>
                                            )
                                        }
                                        {
                                            !status.isDesc ? (
                                                <th onClick={() => handleClickSort(status.id, "mstatus_name", isFilterPaylink)} style={{ background: "#F3F4F5", cursor: "pointer" }}>
                                                    Status
                                                    <span><FontAwesomeIcon icon={faSortUp} size="lg" className="ms-2" /></span>
                                                </th>
                                            ) : (
                                                <th onClick={() => handleClickSort(status.id, "mstatus_name", isFilterPaylink)} style={{ background: "#F3F4F5", cursor: "pointer" }}>
                                                    Status
                                                    <span><FontAwesomeIcon icon={faSortDown} size="lg" className="ms-2" /></span>
                                                </th>
                                            )
                                        }
                                        <th style={{ background: "#F3F4F5" }}>Aksi</th>
                                    </tr>
                                </thead>
                                {
                                    !pendingPaylink ? (
                                        <tbody className="table-group-divider">
                                            {
                                                listPaylink !== 0 &&
                                                listPaylink.map((item) => {
                                                    return (
                                                        <tr>
                                                            <td style={{ paddingLeft: 18, width: 155 }}>
                                                                {item.tpaylink_code}
                                                            </td>
                                                            <td style={{ paddingLeft: 18, width: 155 }}>
                                                                {item.tpaylink_ref_id}
                                                            </td>
                                                            <td style={{ paddingLeft: 16, width: 155 }}>
                                                                {item.tpaylink_crtdt.slice(0, 10).replace(/-/g, "/") + ", " + item.tpaylink_crtdt.slice(11, 16)}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    background:
                                                                        (item.tvatrans_status_id === 2 && "rgba(7, 126, 134, 0.08)") ||
                                                                        (item.tvatrans_status_id === 1 && "#EBF8EC") ||
                                                                        (item.tvatrans_status_id === 7 && "rgba(247, 148, 33, 0.08)") ||
                                                                        ((item.tvatrans_status_id === 9 || item.tvatrans_status_id === 16) && "rgba(185, 18, 27, 0.08)") ||
                                                                        (item.tvatrans_status_id === 17 && isClick ? "red" : "#EBF8EC" ) ||
                                                                        (item.tvatrans_status_id === 18 && "#F0F0F0"),
                                                                    color:
                                                                        (item.tvatrans_status_id === 2 && "#077E86") ||
                                                                        (item.tvatrans_status_id === 1 && "#3DB54A") ||
                                                                        (item.tvatrans_status_id === 7 && "#F79421") ||
                                                                        ((item.tvatrans_status_id === 9 || item.tvatrans_status_id === 16) && "#B9121B") ||
                                                                        (item.tvatrans_status_id === 17 && "#3DB54A") ||
                                                                        (item.tvatrans_status_id === 18 && "#888888"),
                                                                    textDecoration: (item.tvatrans_status_id === 17 ? "underline" : "unset" ),
                                                                    cursor: (item.tvatrans_status_id === 17 ? "pointer" : "unset"),
                                                                    margin: 6,
                                                                    padding: "6px 0px",
                                                                    display: "flex",
                                                                    flexDirection: "row",
                                                                    justifyContent: "center",
                                                                    alignItem: "center",
                                                                    borderRadius: 4,
                                                                }}
                                                                onMouseEnter={item.tvatrans_status_id === 17 ? hoverHandler : null}
                                                                onMouseLeave={item.tvatrans_status_id === 17 ? normalHandler : null}
                                                                className="ms-2"
                                                                onClick={(e) => clickHandler(e, item.tpaylink_id)}
                                                            >
                                                                {item.mstatus_name}
                                                            </td>
                                                            <td>
                                                                <div className=" ms-2 d-flex justify-content-start align-items-center">
                                                                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip style={{ maxWidth: 200, width: 105 }}>Lihat Detail</Tooltip>}>
                                                                        <FontAwesomeIcon icon={faEye} onClick={() => detailPaymentHandler(item.tpaylink_id)} className="me-2" style={{ cursor: "pointer" }} />
                                                                    </OverlayTrigger>
                                                                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip style={{ maxWidth: 200, width: 105 }}>Salin Link</Tooltip>}>
                                                                        <FontAwesomeIcon icon={faClone} className="mx-2" onClick={() => copyLink(item.tpaylink_url)} style={{ cursor: "pointer", display: item.tvatrans_status_id === 17 ? "" : "none", }} />
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <CustomLoader />
                                        </tbody>
                                    )
                                }
                            </table> */}
                        </div>
                        {/* <div className="div-table mt-4 pb-4">
                            <Table hover>
                                <tr style={{ backgroundColor: '#F2F2F2', border: 14, fontWeight: 600, fontSize: '16px' }}>
                                    <th style={{ textAlign: "center" }}>No</th>
                                    <th style={{ textAlign: "center" }}>Tanggal Alokasi</th>
                                    <th style={{ textAlign: "center" }}>Tujuan Alokasi</th>
                                    <th style={{ textAlign: "center" }}>Total Alokasi</th>
                                    <th style={{ textAlign: "center" }}>Saldo Awal Tersedia</th>
                                    <th style={{ textAlign: "center" }}>Sisa Saldo Tersedia</th>
                                    <th style={{ textAlign: "center" }}>Status</th>
                                </tr>
                                <tbody>
                                    <tr>
                                        <td style={{ textAlign: "center" }}>1</td>
                                        <td style={{ textAlign: "center" }}>14:18, 16/09/2022</td>
                                        <td style={{ textAlign: "center" }}>BCA</td>
                                        <td style={{ textAlign: "right" }}>Rp22.000</td>
                                        <td style={{ textAlign: "right" }}>Rp1.443.201</td>
                                        <td style={{ textAlign: "end" }}>Rp1.421.201</td>
                                        <td style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "8px", width: "100%", borderRadius: 4, textAlign: "center", background: "rgba(7, 126, 134, 0.08)", }}>Succes</td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: "center" }}>2</td>
                                        <td style={{ textAlign: "center" }}>14:18, 16/09/2022</td>
                                        <td style={{ textAlign: "center" }}>BCA</td>
                                        <td style={{ textAlign: "right" }}>Rp22.000</td>
                                        <td style={{ textAlign: "right" }}>Rp1.443.201</td>
                                        <td style={{ textAlign: "end" }}>Rp1.421.201</td>
                                        <td style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "6px", margin: "8px", width: "100%", borderRadius: 4, textAlign: "center", background: "rgba(7, 126, 134, 0.08)", }}>Succes</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <DataTable
                                columns={columnsRiwayatAlokasiSaldo}
                                data={listRiwayat}
                                customStyles={customStyles}
                                progressPending={pendingAlokasiSaldo}
                                progressComponent={<CustomLoader />}
                            />
                        </div> */}
                        {
                            listRiwayat.length !== 0 &&
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -15, paddingTop: 12, borderTop: "groove" }}>
                            <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageRiwayatAlokasiSaldo}</div>
                                <Pagination
                                    activePage={activePageRiwayatAlokasiSaldo}
                                    itemsCountPerPage={pageNumberRiwayatAlokasiSaldo.row_per_page}
                                    totalItemsCount={(pageNumberRiwayatAlokasiSaldo.row_per_page*pageNumberRiwayatAlokasiSaldo.max_page)}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={(e) => handlePageChangeAlokasiSaldo(e, isFilterHistory, periodeRiwayatAlokasiSaldo, dateRangeRiwayatAlokasiSaldo, tujuanAlokasiSaldo, isDesc, disbursementChannel)}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Modal
                size="lg"
                centered
                show={showModalSaveAlokasiSaldo}
                onHide={() => setShowModalSaveAlokasiSaldo(false)}
                style={{ borderRadius: 8 }}
            >
                <Modal.Body style={{  width: "100%", padding: "12px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Exo", fontSize: 20, fontWeight: 700, marginBottom: "unset" }} className="text-center">Apakah Kamu Yakin Alokasikan Saldo?</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 16 }}>
                        <p style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 400, marginBottom: "unset" }} className="text-center">Saldo yang sudah di alokasikan tidak dapat dipindahkan atau ditarik ulang.</p>
                    </div>
                    <p>
                        
                    </p>                
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={() => setShowModalSaveAlokasiSaldo(false)} style={{ fontFamily: "Exo", color: "#888888", background: "#FFFFFF", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%", border: "1px solid #EBEBEB;" }} className="mx-2">Tidak</Button>
                        <Button onClick={() => saveAlokasiSaldo(disburseDana, disburseBCA, disburseMandiri, disburseInterbank)} style={{ fontFamily: "Exo", color: "black", background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", maxWidth: 125, maxHeight: 45, width: "100%", height: "100%" }}>Ya</Button>
                    </div>
                </Modal.Body>
            </Modal>
            {/* <Alert
                // variant='secondary'
                show={showAlertSuccess}
                // show={true}
                onClose={() => closeHandle()}
                style={{ backgroundColor: "#077E86" }}
            >
                <div className='d-flex justify-content-center'>
                    <div>
                        <img src={circleCheck} className='me-1 mb-1' style={{ verticalAlign: "middle" }} />
                        <span style={{ color: "#FFFFFF" }}>Alokasi Saldo Telah Berhasil</span>
                    </div>
                    <Button variant="close" size="xs" style={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }} onClick={() => setShowAlertSuccess(false)} />
                </div>
            </Alert> */}
            {
                showAlertSuccess &&
                <div className="d-flex justify-content-center align-items-center" style={{ zIndex: 3, position: "fixed", top: 70 }}>
                    <Toast style={{width: "900px", backgroundColor: "#077E86"}} onClose={() => setShowAlertSuccess(false)} show={showAlertSuccess} className="text-center" position="bottom-center">
                    <Toast.Body  className="text-center text-white"><span className="mx-2"><img src={Checklist} alt="checklist" /></span>Alokasi Saldo Telah Berhasil</Toast.Body>
                    </Toast>
                </div>
            }

            <Modal className="history-modal" size="sm" centered show={showModalAlokasi} onHide={() => closeAlokasi()}>
                <Modal.Body>
                    <div className="text-center mt-3"><img src={gagalMasukAlokasi} alt="alokasi saldo"/></div>
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 24,
                        marginBottom: 16,
                    }}
                    >
                    <p
                        style={{
                        fontFamily: "Exo",
                        fontSize: 20,
                        fontWeight: 700,
                        marginBottom: "unset",
                        }}
                        className="text-center"
                    >
                        You can't access Alokasi Saldo Page
                    </p>
                    </div>
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 12,
                        marginBottom: 16,
                    }}
                    >
                    <p
                        style={{
                        fontFamily: "Nunito",
                        fontSize: 14,
                        fontWeight: 400,
                        marginBottom: "unset",
                        }}
                        className="text-center"
                    >
                        Please contact your admin
                    </p>
                    </div>
                    <div 
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 12,
                        marginBottom: 16,
                    }}>
                    <Button
                        onClick={() => closeAlokasi()}
                        style={{
                        fontFamily: "Exo",
                        color: "#888888",
                        background: "#FFFFFF",
                        maxWidth: 125,
                        maxHeight: 45,
                        width: "100%",
                        height: "100%",
                        border: "1px solid #EBEBEB;",
                        borderColor: "#EBEBEB",
                        }}
                        className="mx-2"
                    >
                        Close
                    </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default AlokasiSaldo