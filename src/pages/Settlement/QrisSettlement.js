import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import { useState } from 'react'
import $ from 'jquery'
import { Col, Form, Image, Row } from '@themesberg/react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import { agenLists } from '../../data/tables'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { BaseURL, convertToRupiah, currentDate, customFilter, errorCatch, firstDayLastMonth, firstDayThisMonth, getRole, getToken, lastDayLastMonth, lastDayThisMonth, setUserSession, sevenDaysAgo, yesterdayDate } from '../../function/helpers'
import axios from 'axios'
import { useEffect } from 'react'
import encryptData from '../../function/encryptData'
import ReactSelect, { components } from 'react-select'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

const QrisSettlement = () => {
    const history = useHistory()
    const user_role = getRole()
    const access_token = getToken();
    const [isSettlementOtomatis, setIsSettlementOtomatis] = useState(true)

    const [partnerId, setPartnerId] = useState("")
    const [settleType, setSettleType] = useState(0)
    const [showDateSettlementQrisOtomatisMerchant, setShowDateSettlementQrisOtomatisMerchant] = useState("none")
    const [dateRangeSettlementQrisOtomatisMerchant, setDateRangeSettlementQrisOtomatisMerchant] = useState([])
    const [stateSettlementQrisOtomatisMerchant, setStateSettlementQrisOtomatisMerchant] = useState(null)
    const [activePageSettlementQrisOtomatisMerchant, setActivePageSettlementQrisOtomatisMerchant] = useState(1)
    const [pageNumberSettlementQrisOtomatisMerchant, setPageNumberSettlementQrisOtomatisMerchant] = useState({})
    const [totalPageSettlementQrisOtomatisMerchant, setTotalPageSettlementQrisOtomatisMerchant] = useState(0)
    const [isFilterSettlementQrisOtomatisMerchant, setIsFilterSettlementQrisOtomatisMerchant] = useState(false)
    const [pendingSettlementQrisOtomatisMerchant, setPendingSettlementQrisOtomatisMerchant] = useState(true)
    const [dataSettlementQrisOtomatisMerchant, setDataSettlementQrisOtomatisMerchant] = useState([])
    const [inputHandleSettlementQrisOtomatisMerchant, setInputHandleSettlementQrisOtomatisMerchant] = useState({
        idSettlement: "",
        periode: 0,
        statusQris: 0 
    })

    const [showDateSettlementQrisManualMerchant, setShowDateSettlementQrisManualMerchant] = useState("none")
    const [dateRangeSettlementQrisManualMerchant, setDateRangeSettlementQrisManualMerchant] = useState([])
    const [stateSettlementQrisManualMerchant, setStateSettlementQrisManualMerchant] = useState(null)
    const [activePageSettlementQrisManualMerchant, setActivePageSettlementQrisManualMerchant] = useState(1)
    const [pageNumberSettlementQrisManualMerchant, setPageNumberSettlementQrisManualMerchant] = useState({})
    const [totalPageSettlementQrisManualMerchant, setTotalPageSettlementQrisManualMerchant] = useState(0)
    const [isFilterSettlementQrisManualMerchant, setIsFilterSettlementQrisManualMerchant] = useState(false)
    const [pendingSettlementQrisManualMerchant, setPendingSettlementQrisManualMerchant] = useState(true)
    const [dataSettlementQrisManualMerchant, setDataSettlementQrisManualMerchant] = useState([])
    const [inputHandleSettlementQrisManualMerchant, setInputHandleSettlementQrisManualMerchant] = useState({
        idSettlement: "",
        periode: 0,
        statusQris: 0 
    })

    const [showDateSettlementQrisManualAdmin, setShowDateSettlementQrisManualAdmin] = useState("none")
    const [dateRangeSettlementQrisManualAdmin, setDateRangeSettlementQrisManualAdmin] = useState([])
    const [stateSettlementQrisManualAdmin, setStateSettlementQrisManualAdmin] = useState(null)
    const [activePageSettlementQrisManualAdmin, setActivePageSettlementQrisManualAdmin] = useState(1)
    const [pageNumberSettlementQrisManualAdmin, setPageNumberSettlementQrisManualAdmin] = useState({})
    const [totalPageSettlementQrisManualAdmin, setTotalPageSettlementQrisManualAdmin] = useState(0)
    const [isFilterSettlementQrisManualAdmin, setIsFilterSettlementQrisManualAdmin] = useState(false)
    const [pendingSettlementQrisManualAdmin, setPendingSettlementQrisManualAdmin] = useState(true)
    const [dataSettlementQrisManualAdmin, setDataSettlementQrisManualAdmin] = useState([])
    const [inputHandleSettlementQrisManualAdmin, setInputHandleSettlementQrisManualAdmin] = useState({
        idSettlement: "",
        periode: 0,
        statusQris: 0 
    })

    const [dataGrupInQris, setDataGrupInQris] = useState([])
    const [selectedGrupName, setSelectedGrupName] = useState([])

    const [dataBrandInQris, setDataBrandInQris] = useState([])
    const [selectedBrandName, setSelectedBrandName] = useState([])

    const [dataOutletInQris, setDataOutletInQris] = useState([])
    const [selectedOutletName, setSelectedOutletName] = useState([])

    function handleChangeGrup(e) {
        setSelectedGrupName([e])
        getBrandInQrisTransactionHandler(e.value)
    }

    function handleChangeBrand(e) {
        setSelectedBrandName([e])
        if (user_role === "100") {
            getOutletInQrisTransactionHandler(e.value)
        }
    }

    function handleChangeOutlet(e) {
        setSelectedOutletName([e])
    }

    function handleChangeSettleQrisOtomatisMerchant(e) {
        setInputHandleSettlementQrisOtomatisMerchant({
            ...inputHandleSettlementQrisOtomatisMerchant,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeSettlementQrisOtomatisMerchant(e) {
        if (e.target.value === "7") {
            setShowDateSettlementQrisOtomatisMerchant("")
            setInputHandleSettlementQrisOtomatisMerchant({
                ...inputHandleSettlementQrisOtomatisMerchant,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateSettlementQrisOtomatisMerchant("none")
            setInputHandleSettlementQrisOtomatisMerchant({
                ...inputHandleSettlementQrisOtomatisMerchant,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateSettlementQrisOtomatisMerchant(item) {
        setStateSettlementQrisOtomatisMerchant(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeSettlementQrisOtomatisMerchant(item)
        }
    }

    function handleChangeSettleQrisManualMerchant(e) {
        setInputHandleSettlementQrisManualMerchant({
            ...inputHandleSettlementQrisManualMerchant,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeSettlementQrisManualMerchant(e) {
        if (e.target.value === "7") {
            setShowDateSettlementQrisManualMerchant("")
            setInputHandleSettlementQrisManualMerchant({
                ...inputHandleSettlementQrisManualMerchant,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateSettlementQrisManualMerchant("none")
            setStateSettlementQrisManualMerchant(null)
            setDateRangeSettlementQrisManualMerchant([])
            setInputHandleSettlementQrisManualMerchant({
                ...inputHandleSettlementQrisManualMerchant,
                [e.target.name] : e.target.value.split(",")
            })
        }
    }

    function pickDateSettlementQrisManualMerchant(item) {
        setStateSettlementQrisManualMerchant(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeSettlementQrisManualMerchant(item)
        }
    }

    function handleChangeSettleQrisManualAdmin(e) {
        setInputHandleSettlementQrisManualAdmin({
            ...inputHandleSettlementQrisManualAdmin,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeSettlementQrisManualAdmin(e) {
        if (e.target.value === "7") {
            setShowDateSettlementQrisManualAdmin("")
            setInputHandleSettlementQrisManualAdmin({
                ...inputHandleSettlementQrisManualAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateSettlementQrisManualAdmin("none")
            setStateSettlementQrisManualAdmin(null)
            setDateRangeSettlementQrisManualAdmin([])
            setInputHandleSettlementQrisManualAdmin({
                ...inputHandleSettlementQrisManualAdmin,
                [e.target.name] : e.target.value.split(",")
            })
        }
    }

    function pickDateSettlementQrisManualAdmin(item) {
        setStateSettlementQrisManualAdmin(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeSettlementQrisManualAdmin(item)
        }
    }

    function disbursementTabs(isTabs){
        setIsSettlementOtomatis(isTabs)
        if(!isTabs){
            $('#detailakuntab').removeClass('menu-detail-akun-hr-active')
            $('#detailakunspan').removeClass('menu-detail-akun-span-active')
            $('#konfigurasitab').addClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').addClass('menu-detail-akun-span-active')
        }else{
            $('#konfigurasitab').removeClass('menu-detail-akun-hr-active')
            $('#konfigurasispan').removeClass('menu-detail-akun-span-active')
            $('#detailakuntab').addClass('menu-detail-akun-hr-active')
            $('#detailakunspan').addClass('menu-detail-akun-span-active')
        }
    }
    function pindahHalaman (param) {
        if (param === "otomatis") {
            disbursementTabs(true)
        } else {
            disbursementTabs(false)
        }
    }

    function resetButtonSettlementQrisOtomatisMerchant () {
        getDataSettlementQrisOtomatisMerchantHandler(1)
        setInputHandleSettlementQrisOtomatisMerchant({
            idSettlement: "",
            periode: 0,
            statusQris: 0 
        })
        setShowDateSettlementQrisOtomatisMerchant("none")
        setDateRangeSettlementQrisOtomatisMerchant([])
        setStateSettlementQrisOtomatisMerchant(null)
        setSelectedBrandName([])
        setSelectedOutletName([])

    }

    function resetButtonSettlementQrisManual (param) {
        if (param === "merchant") {
            getDataSettlementQrisManualHandler(user_role, 1, partnerId)
            setInputHandleSettlementQrisManualMerchant({
                idSettlement: "",
                periode: 0,
                statusQris: 0 
            })
            setShowDateSettlementQrisManualMerchant("none")
            setDateRangeSettlementQrisManualMerchant([])
            setStateSettlementQrisManualMerchant(null)
            setSelectedBrandName([])
            setSelectedOutletName([])
        } else {
            getDataSettlementQrisManualHandler(user_role, 1, partnerId)
            setInputHandleSettlementQrisManualAdmin({
                idSettlement: "",
                periode: 0,
                statusQris: 0 
            })
            setShowDateSettlementQrisManualAdmin("none")
            setDateRangeSettlementQrisManualAdmin([])
            setStateSettlementQrisManualAdmin(null)
            setSelectedGrupName([])
            setSelectedBrandName([])
            setSelectedOutletName([])
        }

    }

    const columnsSettleOtomatisAdmin = [
        {
            name: 'No',
            selector: row => row.id,
            width: "67px"
        },
        {
            name: 'ID Settlement',
            selector: row => row.IDAgen,
        },
        {
            name: 'Waktu',
            selector: row => row.noHp
        },
        {
            name: 'Tujuan Settlement',
            selector: row => row.IDAgen,
        },
        {
            name: 'Nama Grup',
            selector: row => row.namaAgen,
        },
        {
            name: 'Nama Brand',
            selector: row => row.namaAgen,
        },
        {
            name: 'Nama Outlet',
            selector: row => row.namaAgen,
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.namaAgen,
        },
        {
            name: 'Nomor Rekening',
            selector: row => row.kodeUnik,
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.kodeUnik,
        },
        {
            name: 'Jumlah Transaksi',
            selector: row => row.noRekening,
        },
        {
            name: 'Total Transaksi',
            selector: row => row.noRekening,
        },
        {
            name: 'Total MDR',
            selector: row => row.noRekening,
        },
        {
            name: 'Biaya Admin',
            selector: row => row.noRekening,
        },
        {
            name: 'Nominal Settlement',
            selector: row => row.noRekening,
        },
        {
            name: 'Status',
            selector: row => row.status,
        },
    ];

    console.log(settleType[0]?.mqrismerchant_settle_group, "settleType[0]?.mqrismerchant_settle_group");

    const columnsSettleOtomatisMerchant = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px"
        },
        {
            name: 'ID Settlement',
            selector: row => row.tqrissettl_code,
            width: "170px"
        },
        {
            name: 'Waktu',
            selector: row => row.tqrissettl_crtdt,
            width: "160px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.BrandName,
            omit: user_role === "106" ? (settleType[0]?.mqrismerchant_settle_group === 101 ? true : false) : user_role === "107" ? (settleType[0]?.mqrismerchant_settle_group === 102 ? true : false) : true,
        },
        {
            name: 'Nama Outlet',
            selector: row => row.StoreName,
            omit: (user_role === "106" || user_role === "107") ? (settleType[0]?.mqrismerchant_settle_group === 103 ? false : true) : true,
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.mbank_name,
            width: "160px"
        },
        {
            name: 'Nomor Rekening',
            selector: row => row.tqrissettl_bank_acc_num_to,
            width: "160px"
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.tqrissettl_bank_acc_name_to,
            width: "220px"
        },
        {
            name: 'Jumlah Transaksi',
            selector: row => row.tqrissettl_trx_count,
            width: "160px"
        },
        {
            name: 'Total Transaksi',
            selector: row => convertToRupiah(row.tqrissettl_trx_amount, true, 2),
            width: "160px"
        },
        {
            name: 'Total MDR',
            selector: row => convertToRupiah(row.tqrissettl_total_mdr, true, 2),
            width: "140px"
        },
        {
            name: 'Biaya Admin',
            selector: row => convertToRupiah(row.tqrissettl_admin_fee, true, 2),
            width: "140px"
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.tqrissettl_total_settle, true, 2),
            width: "200px"
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name,
        },
    ];

    const columnsSettleManualMerchant = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px"
        },
        {
            name: 'ID Settlement',
            selector: row => row.ID,
            width: "150px"
        },
        {
            name: 'Waktu Pengajuan',
            selector: row => row.waktu_pengajuan,
            width: "180px"
        },
        {
            name: 'Waktu Diterima',
            selector: row => row.waktu_diterima,
            width: "180px"
        },
        {
            name: 'Jenis Merchant',
            selector: row => row.jenis_merchant,
            width: "160px"
        },
        {
            name: 'Tujuan Settlement',
            selector: row => row.tujuan_settle,
            width: "170px"
        },
        {
            name: 'Nama Grup',
            selector: row => row.nama_grup,
            width: "160px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.nama_brand,
            width: "160px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.nama_outlet,
            width: "160px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.bank_tujuan,
            width: "130px"
        },
        {
            name: 'Nomor Rekening',
            selector: row => row.norek_penerima,
            width: "160px"
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.nama_penerima,
            width: "230px"
        },
        {
            name: 'Jumlah Transaksi',
            selector: row => row.noRekening,
            width: "160px"
        },
        {
            name: 'Biaya Admin',
            selector: row => row.biaya_admin,
            width: "130px"
        },
        {
            name: 'Nominal Settlement',
            selector: row => row.total_settle,
            width: "190px"
        },
        {
            name: 'Status',
            selector: row => row.status,
            width: "160px"
        },
    ];

    const columnsSettleManualAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px"
        },
        {
            name: 'ID Settlement',
            selector: row => row.ID,
            width: "150px"
        },
        {
            name: 'Waktu Pengajuan',
            selector: row => row.waktu_pengajuan,
            width: "180px"
        },
        {
            name: 'Waktu Diterima',
            selector: row => row.waktu_diterima,
            width: "180px"
        },
        {
            name: 'Jenis Merchant',
            selector: row => row.jenis_merchant,
            width: "160px"
        },
        {
            name: 'Tujuan Settlement',
            selector: row => row.tujuan_settle,
            width: "170px"
        },
        {
            name: 'Nama Grup',
            selector: row => row.nama_grup,
            width: "160px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.nama_brand,
            width: "160px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.nama_outlet,
            width: "160px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.bank_tujuan,
            width: "130px"
        },
        {
            name: 'Nomor Rekening',
            selector: row => row.norek_penerima,
            width: "160px"
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.nama_penerima,
            width: "230px"
        },
        {
            name: 'Jumlah Transaksi',
            selector: row => row.noRekening,
            width: "160px"
        },
        {
            name: 'Biaya Admin',
            selector: row => row.biaya_admin,
            width: "130px"
        },
        {
            name: 'Nominal Settlement',
            selector: row => row.total_settle,
            width: "190px"
        },
        {
            name: 'Status',
            selector: row => row.status,
            width: "160px"
        },
    ];

    async function getSettlementTypeHandler() {
        try {
            const auth = "Bearer " + access_token
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataSettleType = await axios.post(BaseURL + "/QRIS/QRISGetSettleType", { data: "" }, { headers: headers })
            // console.log(dataSettleType, 'ini user detal funct');
            if (dataSettleType.status === 200 && dataSettleType.data.response_code === 200 && dataSettleType.data.response_new_token === null) {
                setSettleType(dataSettleType.data.response_data.results)
                userDetails(dataSettleType.data.response_data.results[0].mqrismerchant_settle_type)
            } else if (dataSettleType.status === 200 && dataSettleType.data.response_code === 200 && dataSettleType.data.response_new_token !== null) {
                setUserSession(dataSettleType.data.response_new_token)
                setSettleType(dataSettleType.data.response_data.results)
                userDetails(dataSettleType.data.response_data.results[0].mqrismerchant_settle_type)
            }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    async function userDetails(settleType) {
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
                if (user_role === "106") {
                    getBrandInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
                    if (settleType === 102) {
                        getDataSettlementQrisManualHandler(user_role, activePageSettlementQrisManualMerchant, userDetail.data.response_data.muser_partnerdtl_id)
                    } else {
                        getDataSettlementQrisOtomatisMerchantHandler(activePageSettlementQrisOtomatisMerchant)
                    }
                } else if (user_role === "107") {
                    getOutletInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
                } else if (user_role === "100") {
                    getDataSettlementQrisManualHandler(user_role, activePageSettlementQrisManualAdmin, userDetail.data.response_data.muser_partnerdtl_id)
                }
            } else if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length !== 0) {
                setUserSession(userDetail.data.response_new_token)
                setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
                if (user_role === "106") {
                    getBrandInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
                    if (settleType === 102) {
                        getDataSettlementQrisManualHandler(user_role, activePageSettlementQrisManualMerchant, userDetail.data.response_data.muser_partnerdtl_id)
                    } else {
                        getDataSettlementQrisOtomatisMerchantHandler(activePageSettlementQrisOtomatisMerchant)
                    }
                } else if (user_role === "107") {
                    getOutletInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
                } else if (user_role === "100") {
                    getDataSettlementQrisManualHandler(user_role, activePageSettlementQrisManualAdmin, userDetail.data.response_data.muser_partnerdtl_id)
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
            const dataParams = encryptData(`{"mmerchant_nou": ${nouGrup}}`)
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

    async function getDataSettlementQrisOtomatisMerchantHandler(currentPage) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"settle_code": "", "status" : "1,2,7,9", "period": 2, "date_from": "", "date_to": "", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataReportSettleQris = await axios.post(BaseURL + "/QRIS/QRISSettlementAutomaticPaging", { data: dataParams }, { headers: headers })
            // console.log(dataReportSettleQris, 'ini user detal funct');
            if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token === null) {
                dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1}))
                setPageNumberSettlementQrisOtomatisMerchant(dataReportSettleQris.data.response_data)
                setTotalPageSettlementQrisOtomatisMerchant(dataReportSettleQris.data.response_data.max_page)
                setDataSettlementQrisOtomatisMerchant(dataReportSettleQris.data.response_data.results)
                setPendingSettlementQrisOtomatisMerchant(false)
            } else if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token !== null) {
                setUserSession(dataReportSettleQris.data.response_new_token)
                dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1}))
                setPageNumberSettlementQrisOtomatisMerchant(dataReportSettleQris.data.response_data)
                setTotalPageSettlementQrisOtomatisMerchant(dataReportSettleQris.data.response_data.max_page)
                setDataSettlementQrisOtomatisMerchant(dataReportSettleQris.data.response_data.results)
                setPendingSettlementQrisOtomatisMerchant(false)
            }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    async function filterDataSettlementQrisOtomatisMerchantHandler(idSettle, dateId, periode, statusQris, page, rowPerPage) {
        try {
            setPendingSettlementQrisOtomatisMerchant(true)
            setIsFilterSettlementQrisOtomatisMerchant(true)
            setActivePageSettlementQrisOtomatisMerchant(page)
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"settle_code": "${idSettle}", "status" : "${statusQris}", "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "page": ${(page < 1) ? 1 : page}, "row_per_page": ${rowPerPage}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataReportSettleQris = await axios.post(BaseURL + "/QRIS/QRISSettlementAutomaticPaging", { data: dataParams }, { headers: headers })
            // console.log(dataReportSettleQris, 'ini user detal funct');
            if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token === null) {
                dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1}))
                setPageNumberSettlementQrisOtomatisMerchant(dataReportSettleQris.data.response_data)
                setTotalPageSettlementQrisOtomatisMerchant(dataReportSettleQris.data.response_data.max_page)
                setDataSettlementQrisOtomatisMerchant(dataReportSettleQris.data.response_data.results)
                setPendingSettlementQrisOtomatisMerchant(false)
            } else if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token !== null) {
                setUserSession(dataReportSettleQris.data.response_new_token)
                dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1}))
                setPageNumberSettlementQrisOtomatisMerchant(dataReportSettleQris.data.response_data)
                setTotalPageSettlementQrisOtomatisMerchant(dataReportSettleQris.data.response_data.max_page)
                setDataSettlementQrisOtomatisMerchant(dataReportSettleQris.data.response_data.results)
                setPendingSettlementQrisOtomatisMerchant(false)
            }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    async function getDataSettlementQrisManualHandler(role, currentPage, partnerId) {
        try {
            if (role === "106" || role === "107" || role === "108") {
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"settlementCode": "", "groupID" : ${partnerId}, "brandID" : 0, "outletID" : 0, "statusid" : "", "date_from": "2023-11-29", "date_to": "2023-11-29", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const dataReportSettleQris = await axios.post(BaseURL + "/QRIS/ManualSettleQRIS", { data: dataParams }, { headers: headers })
                // console.log(dataReportSettleQris, 'ini user detal funct');
                if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token === null) {
                    dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                    setPageNumberSettlementQrisManualMerchant(dataReportSettleQris.data.response_data)
                    setTotalPageSettlementQrisManualMerchant(dataReportSettleQris.data.response_data.max_page)
                    setDataSettlementQrisManualMerchant(dataReportSettleQris.data.response_data.results)
                    setPendingSettlementQrisManualMerchant(false)
                } else if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token !== null) {
                    setUserSession(dataReportSettleQris.data.response_new_token)
                    dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                    setPageNumberSettlementQrisManualMerchant(dataReportSettleQris.data.response_data)
                    setTotalPageSettlementQrisManualMerchant(dataReportSettleQris.data.response_data.max_page)
                    setDataSettlementQrisManualMerchant(dataReportSettleQris.data.response_data.results)
                    setPendingSettlementQrisManualMerchant(false)
                }
            } else if (role === "100") {
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"settlementCode": "", "groupID" : 0, "brandID" : 0, "outletID" : 0, "statusid" : "", "date_from": "2023-11-29", "date_to": "2023-11-29", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const dataReportSettleQris = await axios.post(BaseURL + "/QRIS/ManualSettleQRIS", { data: dataParams }, { headers: headers })
                // console.log(dataReportSettleQris, 'ini user detal funct');
                if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token === null) {
                    dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                    setPageNumberSettlementQrisManualAdmin(dataReportSettleQris.data.response_data)
                    setTotalPageSettlementQrisManualAdmin(dataReportSettleQris.data.response_data.max_page)
                    setDataSettlementQrisManualAdmin(dataReportSettleQris.data.response_data.results)
                    setPendingSettlementQrisManualAdmin(false)
                } else if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token !== null) {
                    setUserSession(dataReportSettleQris.data.response_new_token)
                    dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage-1)*10) : idx + 1}));
                    setPageNumberSettlementQrisManualAdmin(dataReportSettleQris.data.response_data)
                    setTotalPageSettlementQrisManualAdmin(dataReportSettleQris.data.response_data.max_page)
                    setDataSettlementQrisManualAdmin(dataReportSettleQris.data.response_data.results)
                    setPendingSettlementQrisManualAdmin(false)
                }
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterDataSettlementQrisManualHandler(settlementCode, groupId, brandId, outletId, statusId, periode, dateRange, role, partnerId, page, rowPerPage) {
        try {
            if (role === "106" || role === "107" || role === "108") {
                setPendingSettlementQrisManualMerchant(true)
                setIsFilterSettlementQrisManualMerchant(true)
                setActivePageSettlementQrisManualMerchant(page)
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"settlementCode": "${settlementCode}", "groupID" : ${partnerId}, "brandID" : ${brandId}, "outletID" : ${outletId}, "statusid" : "${statusId}", "date_from": "${(periode.length !== 0) ? (periode === "7" ? dateRange[0] : periode[0]) : ""}", "date_to": "${(periode.length !== 0) ? periode === "7" ? dateRange[1] : periode[1] : ""}", "page": ${(page < 1) ? 1 : page}, "row_per_page": ${rowPerPage}}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const dataReportSettleQris = await axios.post(BaseURL + "/QRIS/ManualSettleQRIS", { data: dataParams }, { headers: headers })
                // console.log(dataReportSettleQris, 'ini user detal funct');
                if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token === null) {
                    dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
                    setPageNumberSettlementQrisManualMerchant(dataReportSettleQris.data.response_data)
                    setTotalPageSettlementQrisManualMerchant(dataReportSettleQris.data.response_data.max_page)
                    setDataSettlementQrisManualMerchant(dataReportSettleQris.data.response_data.results)
                    setPendingSettlementQrisManualMerchant(false)
                } else if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token !== null) {
                    setUserSession(dataReportSettleQris.data.response_new_token)
                    dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
                    setPageNumberSettlementQrisManualMerchant(dataReportSettleQris.data.response_data)
                    setTotalPageSettlementQrisManualMerchant(dataReportSettleQris.data.response_data.max_page)
                    setDataSettlementQrisManualMerchant(dataReportSettleQris.data.response_data.results)
                    setPendingSettlementQrisManualMerchant(false)
                }
            } else if (user_role === "100") {
                setPendingSettlementQrisManualAdmin(true)
                setIsFilterSettlementQrisManualAdmin(true)
                setActivePageSettlementQrisManualAdmin(page)
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"settlementCode": "${settlementCode}", "groupID" : ${groupId}, "brandID" : ${brandId}, "outletID" : ${outletId}, "statusid" : "${statusId}", "date_from": "${(periode.length !== 0) ? (periode === "7" ? dateRange[0] : periode[0]) : ""}", "date_to": "${(periode.length !== 0) ? periode === "7" ? dateRange[1] : periode[1] : ""}", "page": ${(page < 1) ? 1 : page}, "row_per_page": ${rowPerPage}}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const dataReportSettleQris = await axios.post(BaseURL + "/QRIS/ManualSettleQRIS", { data: dataParams }, { headers: headers })
                // console.log(dataReportSettleQris, 'ini user detal funct');
                if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token === null) {
                    dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
                    setPageNumberSettlementQrisManualAdmin(dataReportSettleQris.data.response_data)
                    setTotalPageSettlementQrisManualAdmin(dataReportSettleQris.data.response_data.max_page)
                    setDataSettlementQrisManualAdmin(dataReportSettleQris.data.response_data.results)
                    setPendingSettlementQrisManualAdmin(false)
                } else if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token !== null) {
                    setUserSession(dataReportSettleQris.data.response_new_token)
                    dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page-1)*10) : idx + 1}));
                    setPageNumberSettlementQrisManualAdmin(dataReportSettleQris.data.response_data)
                    setTotalPageSettlementQrisManualAdmin(dataReportSettleQris.data.response_data.max_page)
                    setDataSettlementQrisManualAdmin(dataReportSettleQris.data.response_data.results)
                    setPendingSettlementQrisManualAdmin(false)
                }
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    const customStylesSettlementQris = {
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

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
          <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          <div>Loading...</div>
        </div>
    );

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

    useEffect(() => {
        if (!access_token) {
          history.push('/login');
        }
        getSettlementTypeHandler()
        if (user_role === "100") {
            getGrupInQrisTransactionHandler()
        }
        // userDetails()
      }, [access_token])

    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp; Settlement &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Settlement QRIS</h2>
            </div>
            {
                user_role === "100" ? (
                    <>
                        <div className='detail-akun-menu mt-4' style={{display: 'flex', height: 33}}>
                            <div className='detail-akun-tabs menu-detail-akun-hr-active' onClick={() => pindahHalaman("otomatis")} id="detailakuntab">
                                <span className='menu-detail-akun-span menu-detail-akun-span-active' id="detailakunspan">Settlement Otomatis</span>
                            </div>
                            <div className='detail-akun-tabs' style={{marginLeft: 15}} onClick={() => pindahHalaman("manual")} id="konfigurasitab">
                                <span className='menu-detail-akun-span' id="konfigurasispan">Settlement Manual</span>
                            </div>
                        </div>
                        <hr className='hr-style' style={{marginTop: -2}}/>
                        {
                            isSettlementOtomatis ? (
                                <div className='base-content mb-4 pb-4'>
                                    <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                                    <Row className='mt-4'>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>ID Settlement</span>
                                            <input name="idTransaksiDanaMasukAdmin" type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Periode</span>
                                            <Form.Select name='periodeDanaMasukAdmin' className="input-text-riwayat ms-3">
                                                <option defaultChecked disabled value={0}>Pilih Periode</option>
                                                <option value={2}>Hari Ini</option>
                                                <option value={3}>Kemarin</option>
                                                <option value={4}>7 Hari Terakhir</option>
                                                <option value={5}>Bulan Ini</option>
                                                <option value={6}>Bulan Kemarin</option>
                                                <option value={7}>Pilih Range Tanggal</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Status</span>
                                            <Form.Select name="statusDanaMasukAdmin" className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                                <option defaultChecked disabled value="">Pilih Status</option>
                                                <option value={2}>Berhasil</option>
                                                <option value={1}>Dalam Proses</option>
                                                <option value={7}>Menunggu Pembayaran</option>
                                                <option value={9}>Kadaluwarsa</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row className="mt-4">
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Nama Grup</span>
                                            <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                                                <option defaultValue disabled value={0}>Pilih Grup</option>
                                                <option value={1}>Periode Buat</option>
                                                <option value={2}>Periode Proses</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Nama Brand</span>
                                            <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                                                <option defaultValue disabled value={0}>Pilih Brand</option>
                                                <option value={1}>Periode Buat</option>
                                                <option value={2}>Periode Proses</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Nama Outlet</span>
                                            <Form.Select name='tipePeriodeAdmin' className='input-text-riwayat ms-4' style={{ display: "inline" }}>
                                                <option defaultValue disabled value={0}>Pilih Outlet</option>
                                                <option value={1}>Periode Buat</option>
                                                <option value={2}>Periode Proses</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={5}>
                                            <Row>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        className='btn-ez-on'
                                                    >
                                                        Terapkan
                                                    </button>
                                                </Col>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        className='btn-reset'
                                                    >
                                                        Atur Ulang
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <div style={{ marginBottom: 30 }} className='mt-3'>
                                        <Link className="export-span">Export</Link>
                                    </div>
                                    <div className="div-table mt-5 pb-4">
                                        <DataTable
                                            columns={columnsSettleOtomatisAdmin}
                                            data={agenLists}
                                            customStyles={customStylesSettlementQris}
                                            highlightOnHover
                                            // progressPending={pendingTransferAdmin}
                                            progressComponent={<CustomLoader />}
                                            // pagination
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className='base-content mb-4 pb-4'>
                                    <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                                    <Row className='mt-4'>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>ID Settlement</span>
                                            <input name="idSettlement" value={inputHandleSettlementQrisManualAdmin.idSettlement} onChange={(e) => handleChangeSettleQrisManualAdmin(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Periode</span>
                                            <Form.Select name='periode'  value={inputHandleSettlementQrisManualAdmin.periode} onChange={(e) => handleChangePeriodeSettlementQrisManualAdmin(e)} className="input-text-riwayat ms-3">
                                                <option defaultChecked disabled value={0}>Pilih Periode</option>
                                                <option value={([`${currentDate}`, `${currentDate}`])}>Hari Ini</option>
                                                <option value={([`${yesterdayDate}`, `${yesterdayDate}`])}>Kemarin</option>
                                                <option value={([`${sevenDaysAgo}`, `${yesterdayDate}`])}>7 Hari Terakhir</option>
                                                <option value={([`${firstDayThisMonth}`, `${lastDayThisMonth}`])}>Bulan Ini</option>
                                                <option value={([`${firstDayLastMonth}`, `${lastDayLastMonth}`])}>Bulan Kemarin</option>
                                                <option value={7}>Pilih Range Tanggal</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Status</span>
                                            <Form.Select name="statusQris" value={inputHandleSettlementQrisManualAdmin.statusQris} onChange={(e) => handleChangeSettleQrisManualAdmin(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                                <option defaultChecked disabled value={0}>Pilih Status</option>
                                                <option value={2}>Berhasil</option>
                                                <option value={1}>Dalam Proses</option>
                                                <option value={7}>Menunggu Pembayaran</option>
                                                <option value={9}>Kadaluwarsa</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row className="mt-4">
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Nama Grup</span>
                                            <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                                <ReactSelect
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={dataGrupInQris}
                                                    value={selectedGrupName}
                                                    onChange={(selected) => handleChangeGrup(selected)}
                                                    placeholder="Pilih Grup"
                                                    components={{ Option }}
                                                    styles={customStylesSelectedOption}
                                                    filterOption={customFilter}
                                                />
                                            </div>
                                        </Col>
                                        <Col xs={4} className='text-end mt-4' style={{ display: showDateSettlementQrisManualAdmin }}>
                                            <DateRangePicker
                                                onChange={pickDateSettlementQrisManualAdmin}
                                                value={stateSettlementQrisManualAdmin}
                                                clearIcon={null}
                                            />
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Nama Brand</span>
                                            <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                                <ReactSelect
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={dataBrandInQris}
                                                    value={selectedBrandName}
                                                    onChange={(selected) => handleChangeBrand(selected)}
                                                    placeholder="Pilih Brand"
                                                    components={{ Option }}
                                                    styles={customStylesSelectedOption}
                                                    filterOption={customFilter}
                                                />
                                            </div>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Nama Outlet</span>
                                            <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                                <ReactSelect
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={dataOutletInQris}
                                                    value={selectedOutletName}
                                                    onChange={(selected) => handleChangeOutlet(selected)}
                                                    placeholder="Pilih Outlet"
                                                    components={{ Option }}
                                                    styles={customStylesSelectedOption}
                                                    filterOption={customFilter}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={5}>
                                            <Row>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        className={(inputHandleSettlementQrisManualAdmin.periode !== 0 || (dateRangeSettlementQrisManualAdmin.length !== 0 && inputHandleSettlementQrisManualAdmin.idSettlement.length !== 0) || (dateRangeSettlementQrisManualAdmin.length !== 0 && inputHandleSettlementQrisManualAdmin.statusQris !== 0) || (dateRangeSettlementQrisManualAdmin.length !== 0 && selectedGrupName[0].value !== undefined) || (dateRangeSettlementQrisManualAdmin.length !== 0 && selectedBrandName[0].value !== undefined) || (dateRangeSettlementQrisManualAdmin.length !== 0 && selectedOutletName[0].value !== undefined)) ? 'btn-ez-on' : 'btn-ez'}
                                                        disabled={inputHandleSettlementQrisManualAdmin.periode === 0 || (inputHandleSettlementQrisManualAdmin.periode === 0 && inputHandleSettlementQrisManualAdmin.idSettlement.length === 0) || (inputHandleSettlementQrisManualAdmin.periode === 0 && inputHandleSettlementQrisManualAdmin.statusQris === 0) || (inputHandleSettlementQrisManualAdmin.periode === 0 && selectedGrupName[0].value === undefined) || (inputHandleSettlementQrisManualAdmin.periode === 0 && selectedBrandName[0].value === undefined) || (inputHandleSettlementQrisManualAdmin.periode === 0 && selectedOutletName[0].value === undefined)}
                                                        onClick={() => filterDataSettlementQrisManualHandler(inputHandleSettlementQrisManualAdmin.idSettlement, (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0), (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), inputHandleSettlementQrisManualAdmin.statusQris, inputHandleSettlementQrisManualAdmin.periode, dateRangeSettlementQrisManualAdmin, user_role, partnerId, 1, 10)}
                                                    >
                                                        Terapkan
                                                    </button>
                                                </Col>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        className={(inputHandleSettlementQrisManualAdmin.periode !== 0 || dateRangeSettlementQrisManualAdmin.length !== 0 || inputHandleSettlementQrisManualAdmin.idSettlement.length !== 0 || inputHandleSettlementQrisManualAdmin.statusQris !== 0 || selectedGrupName.length !== 0 || selectedBrandName.length !== 0 || selectedOutletName.length !== 0) ? 'btn-reset' : 'btn-ez-reset'}
                                                        disabled={inputHandleSettlementQrisManualAdmin.periode === 0 && dateRangeSettlementQrisManualAdmin.length === 0 && inputHandleSettlementQrisManualAdmin.idSettlement.length === 0 && inputHandleSettlementQrisManualAdmin.statusQris === 0 && selectedGrupName.length === 0 && selectedBrandName.length === 0 && selectedOutletName.length === 0}
                                                        onClick={() => resetButtonSettlementQrisManual("admin")}
                                                    >
                                                        Atur Ulang
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <div style={{ marginBottom: 30 }} className='mt-3'>
                                        <Link className="export-span">Export</Link>
                                    </div>
                                    <div className="div-table mt-5 pb-4">
                                        <DataTable
                                            columns={columnsSettleManualAdmin}
                                            data={dataSettlementQrisManualAdmin}
                                            customStyles={customStylesSettlementQris}
                                            highlightOnHover
                                            progressPending={pendingSettlementQrisManualAdmin}
                                            progressComponent={<CustomLoader />}
                                        />
                                    </div>
                                </div>
                                
                            )
                        }
                    </>
                ) : (
                    <>
                        {
                            settleType[0]?.mqrismerchant_settle_type === 102 ? (
                                <>
                                    <div className='base-content mt-3'>
                                        <span className='mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Ajukan Settlement QRIS</span>
                                        <div className='mt-3'>Tujuan settlement : <span style={{ fontWeight: 700, fontFamily: "Nunito", fontSize: 14, color: "#383838" }}>Group</span> </div>
                                        <div className="card-information base-content-qris mt-3">
                                            <p style={{ color: "#383838", fontSize: 12 }}>Jumlah saldo</p>
                                            <p className="p-amount" style={{ fontFamily: "Exo" }}>Rp 100.000.000</p>
                                            <p className="mt-2"  style={{ fontFamily: "Nunito", fontSize: 10, color: "#888888" }}>Total keseluruhan saldo semua brand dan outlet</p>
                                        </div>
                                        <Row className='align-items-center'>
                                            <Col xs={2} className='mt-4'>
                                                <div>Rekening Tujuan</div>
                                            </Col>
                                            <Col xs={10} className='mt-4'>
                                                <Form.Select name="channelDirectDebit" className='input-text-user'>
                                                    <option defaultChecked disabled value={0}>Pilih rekening tujuan</option>
                                                    <option value={36}>OneKlik</option>
                                                    <option value={37}>Mandiri</option>
                                                </Form.Select>
                                            </Col>
                                            <Col xs={2} className='mt-3'>
                                                <div>Nominal Pengajuan</div>
                                            </Col>
                                            <Col xs={10} className='d-flex justify-content-between align-items-center mt-3'>
                                                <Form.Control
                                                    type='text'
                                                    className='input-text-user'
                                                    placeholder='Rp'
                                                />
                                            </Col>
                                            <Col xs={12} className='d-flex justify-content-between align-items-center mt-3'>
                                                <div>Biaya settlement</div>
                                                <div className='biaya-settlement-qris'>Rp. 5.000</div>
                                            </Col>
                                            <Col xs={12} className='d-flex justify-content-between align-items-center mt-3'>
                                                <div>Total settlement</div>
                                                <div className='saldo-dan-total-settlement'>Rp. 505.000</div>
                                            </Col>
                                            <Col xs={12} className='d-flex justify-content-between align-items-center mt-3'>
                                                <div>Sisa saldo</div>
                                                <div className='saldo-dan-total-settlement'>Rp. 9.995.000</div>
                                            </Col>
                                        </Row>
                                        <Row className='mt-4 pb-4'>
                                            <Col xs={5}>
                                                <Row>
                                                    <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                        <button
                                                            className='btn-ez-on'
                                                        >
                                                            Ajukan
                                                        </button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className='base-content mt-3'>
                                        <Row className='mt-1'>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                                <span>ID Settlement</span>
                                                <input name="idSettlement" value={inputHandleSettlementQrisManualMerchant.idSettlement} onChange={(e) => handleChangeSettleQrisManualMerchant(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                            </Col>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                                <span>Periode</span>
                                                <Form.Select name="periode" value={inputHandleSettlementQrisManualMerchant.periode} onChange={(e) => handleChangePeriodeSettlementQrisManualMerchant(e)} className="input-text-riwayat ms-3">
                                                    <option defaultChecked disabled value={0}>Pilih Periode</option>
                                                    <option value={([`${currentDate}`, `${currentDate}`])}>Hari Ini</option>
                                                    <option value={([`${yesterdayDate}`, `${yesterdayDate}`])}>Kemarin</option>
                                                    <option value={([`${sevenDaysAgo}`, `${yesterdayDate}`])}>7 Hari Terakhir</option>
                                                    <option value={([`${firstDayThisMonth}`, `${lastDayThisMonth}`])}>Bulan Ini</option>
                                                    <option value={([`${firstDayLastMonth}`, `${lastDayLastMonth}`])}>Bulan Kemarin</option>
                                                    <option value={7}>Pilih Range Tanggal</option>
                                                </Form.Select>
                                            </Col>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                                <span>Status</span>
                                                <Form.Select name="statusQris" value={inputHandleSettlementQrisManualMerchant.statusQris} onChange={(e) => handleChangeSettleQrisManualMerchant(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                                    <option defaultChecked disabled value="">Pilih Status</option>
                                                    <option value={2}>Berhasil</option>
                                                    <option value={1}>Dalam Proses</option>
                                                    <option value={7}>Menunggu Pembayaran</option>
                                                    <option value={9}>Kadaluwarsa</option>
                                                </Form.Select>
                                            </Col>
                                            {
                                                user_role === "106" && (
                                                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                                        <span>Nama Brand</span>
                                                        <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                                            <ReactSelect
                                                                closeMenuOnSelect={true}
                                                                hideSelectedOptions={false}
                                                                options={dataBrandInQris}
                                                                value={selectedBrandName}
                                                                onChange={(selected) => handleChangeBrand(selected)}
                                                                placeholder="Pilih Brand"
                                                                components={{ Option }}
                                                                styles={customStylesSelectedOption}
                                                                filterOption={customFilter}
                                                            />
                                                        </div>
                                                    </Col>
                                                )
                                            }
                                            <Col xs={4} className='text-end mt-4' style={{ display: showDateSettlementQrisManualMerchant }}>
                                                <DateRangePicker
                                                    onChange={pickDateSettlementQrisManualMerchant}
                                                    value={stateSettlementQrisManualMerchant}
                                                    clearIcon={null}
                                                />
                                            </Col>
                                            {
                                                (user_role === "106" || user_role === "107") && (
                                                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                                        <span>Nama Outlet</span>
                                                        <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                                            <ReactSelect
                                                                closeMenuOnSelect={true}
                                                                hideSelectedOptions={false}
                                                                options={dataOutletInQris}
                                                                value={selectedOutletName}
                                                                onChange={(selected) => handleChangeOutlet(selected)}
                                                                placeholder="Pilih Outlet"
                                                                components={{ Option }}
                                                                styles={customStylesSelectedOption}
                                                                filterOption={customFilter}
                                                            />
                                                        </div>
                                                    </Col>
                                                ) 
                                            }
                                        </Row>
                                        <Row className='mt-4'>
                                            <Col xs={5}>
                                                <Row>
                                                    <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                        <button
                                                            className={(inputHandleSettlementQrisManualMerchant.periode !== 0 || (dateRangeSettlementQrisManualMerchant.length !== 0 && inputHandleSettlementQrisManualMerchant.idSettlement.length !== 0) || (dateRangeSettlementQrisManualMerchant.length !== 0 && inputHandleSettlementQrisManualMerchant.statusQris !== 0) || (dateRangeSettlementQrisManualMerchant.length !== 0 && selectedBrandName[0].value !== undefined) || (dateRangeSettlementQrisManualMerchant.length !== 0 && selectedOutletName[0].value !== undefined)) ? 'btn-ez-on' : 'btn-ez'}
                                                            disabled={inputHandleSettlementQrisManualMerchant.periode === 0 || (inputHandleSettlementQrisManualMerchant.periode === 0 && inputHandleSettlementQrisManualMerchant.idSettlement.length === 0) || (inputHandleSettlementQrisManualMerchant.periode === 0 && inputHandleSettlementQrisManualMerchant.statusQris === 0) || (inputHandleSettlementQrisManualMerchant.periode === 0 && selectedBrandName[0].value === undefined) || (inputHandleSettlementQrisManualMerchant.periode === 0 && selectedOutletName[0].value === undefined)}
                                                            onClick={() => filterDataSettlementQrisManualHandler(inputHandleSettlementQrisManualMerchant.idSettlement, null, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), inputHandleSettlementQrisManualMerchant.statusQris, inputHandleSettlementQrisManualMerchant.periode, dateRangeSettlementQrisManualMerchant, user_role, partnerId, 1, 10)}
                                                        >
                                                            Terapkan
                                                        </button>
                                                    </Col>
                                                    <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                        <button
                                                            className={(inputHandleSettlementQrisManualMerchant.periode !== 0 || dateRangeSettlementQrisManualMerchant.length !== 0 || inputHandleSettlementQrisManualMerchant.idSettlement.length !== 0 || inputHandleSettlementQrisManualMerchant.statusQris !== 0 || selectedBrandName.length !== 0 || selectedOutletName.length !== 0) ? 'btn-reset' : 'btn-ez-reset'}
                                                            disabled={inputHandleSettlementQrisManualMerchant.periode === 0 && dateRangeSettlementQrisManualMerchant.length === 0 && inputHandleSettlementQrisManualMerchant.idSettlement.length === 0 && inputHandleSettlementQrisManualMerchant.statusQris === 0 && selectedBrandName.length === 0 && selectedOutletName.length === 0}
                                                            onClick={() => resetButtonSettlementQrisManual("merchant")}
                                                        >
                                                            Atur Ulang
                                                        </button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <div style={{ marginBottom: 20 }} className='mt-3 d-flex justify-content-between align-items-center'>
                                            <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600, color: "#383838" }}>Daftar pengajuan settlement</div>
                                            <Link className="export-span">Export</Link>
                                        </div>
                                        <div className="div-table pb-4">
                                            <DataTable
                                                columns={columnsSettleManualMerchant}
                                                data={dataSettlementQrisManualMerchant}
                                                customStyles={customStylesSettlementQris}
                                                highlightOnHover
                                                progressPending={pendingSettlementQrisManualMerchant}
                                                progressComponent={<CustomLoader />}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='base-content mt-3'>
                                    <Row className='mt-1'>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>ID Settlement</span>
                                            <input name="idSettlement" value={inputHandleSettlementQrisOtomatisMerchant.idSettlement} onChange={(e) => handleChangeSettleQrisOtomatisMerchant(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Transaksi'/>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Periode</span>
                                            <Form.Select name="periode" value={inputHandleSettlementQrisOtomatisMerchant.periode} onChange={(e) => handleChangePeriodeSettlementQrisOtomatisMerchant(e)} className="input-text-riwayat ms-3">
                                                <option defaultChecked disabled value={0}>Pilih Periode</option>
                                                <option value={2}>Hari Ini</option>
                                                <option value={3}>Kemarin</option>
                                                <option value={4}>7 Hari Terakhir</option>
                                                <option value={5}>Bulan Ini</option>
                                                <option value={6}>Bulan Kemarin</option>
                                                <option value={7}>Pilih Range Tanggal</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Status</span>
                                            <Form.Select name="statusQris" value={inputHandleSettlementQrisOtomatisMerchant.statusQris} onChange={(e) => handleChangeSettleQrisOtomatisMerchant(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                                <option defaultChecked disabled value={0}>Pilih Status</option>
                                                <option value={2}>Berhasil</option>
                                                <option value={1}>Dalam Proses</option>
                                                <option value={7}>Menunggu Pembayaran</option>
                                                <option value={9}>Kadaluwarsa</option>
                                            </Form.Select>
                                        </Col>
                                        {
                                            user_role === "106" && (
                                                settleType[0]?.mqrismerchant_settle_type !== 101 ? (
                                                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                                        <span>Nama Brand</span>
                                                        <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                                            <ReactSelect
                                                                closeMenuOnSelect={true}
                                                                hideSelectedOptions={false}
                                                                options={dataBrandInQris}
                                                                value={selectedBrandName}
                                                                onChange={(selected) => handleChangeBrand(selected)}
                                                                placeholder="Pilih Brand"
                                                                components={{ Option }}
                                                                styles={customStylesSelectedOption}
                                                                filterOption={customFilter}
                                                            />
                                                        </div>
                                                    </Col>
                                                ) : ""
                                            )
                                        }
                                        {
                                            user_role === "106" ? (
                                                settleType[0]?.mqrismerchant_settle_group === 101 ? (
                                                    <Col xs={4}></Col>
                                                ) : (
                                                    ""
                                                )
                                            )   : (
                                                ""
                                            )
                                        }
                                        <Col xs={4} className='text-end mt-4' style={{ display: showDateSettlementQrisOtomatisMerchant }}>
                                            <DateRangePicker
                                                onChange={pickDateSettlementQrisOtomatisMerchant}
                                                value={stateSettlementQrisOtomatisMerchant}
                                                clearIcon={null}
                                            />
                                        </Col>
                                        {
                                            (user_role === "106" || user_role === "107") && (
                                                settleType[0]?.mqrismerchant_settle_group === 103 ? (
                                                    <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                                        <span>Nama Outlet</span>
                                                        <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                                            <ReactSelect
                                                                closeMenuOnSelect={true}
                                                                hideSelectedOptions={false}
                                                                options={dataOutletInQris}
                                                                value={selectedOutletName}
                                                                onChange={(selected) => handleChangeOutlet(selected)}
                                                                placeholder="Pilih Outlet"
                                                                components={{ Option }}
                                                                styles={customStylesSelectedOption}
                                                                filterOption={customFilter}
                                                            />
                                                        </div>
                                                    </Col>
                                                ) : ""
                                            ) 
                                        }
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col xs={5}>
                                            <Row>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        className={(inputHandleSettlementQrisOtomatisMerchant.periode !== 0 || dateRangeSettlementQrisOtomatisMerchant.length !== 0 || (dateRangeSettlementQrisOtomatisMerchant.length !== 0 && inputHandleSettlementQrisOtomatisMerchant.idSettlement.length !== 0) || (dateRangeSettlementQrisOtomatisMerchant.length !== 0 && inputHandleSettlementQrisOtomatisMerchant.statusQris.length !== 0)) ? 'btn-ez-on' : 'btn-ez'}
                                                        disabled={inputHandleSettlementQrisOtomatisMerchant.periode === 0 || (inputHandleSettlementQrisOtomatisMerchant.periode === 0 && inputHandleSettlementQrisOtomatisMerchant.idSettlement.length === 0) || (inputHandleSettlementQrisOtomatisMerchant.periode === 0 && inputHandleSettlementQrisOtomatisMerchant.statusQris === 0)}
                                                        onClick={() => filterDataSettlementQrisOtomatisMerchantHandler(inputHandleSettlementQrisOtomatisMerchant.idSettlement, inputHandleSettlementQrisOtomatisMerchant.periode, dateRangeSettlementQrisOtomatisMerchant, inputHandleSettlementQrisOtomatisMerchant.statusQris, activePageSettlementQrisOtomatisMerchant, 10 )}
                                                    >
                                                        Terapkan
                                                    </button>
                                                </Col>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        className={(inputHandleSettlementQrisOtomatisMerchant.periode !== 0 || dateRangeSettlementQrisOtomatisMerchant.length !== 0 || (dateRangeSettlementQrisOtomatisMerchant.length !== 0 && inputHandleSettlementQrisOtomatisMerchant.idSettlement.length !== 0) || (dateRangeSettlementQrisOtomatisMerchant.length !== 0 && inputHandleSettlementQrisOtomatisMerchant.statusQris.length !== 0)) ? 'btn-reset' : 'btn-ez-reset'}
                                                        disabled={inputHandleSettlementQrisOtomatisMerchant.periode === 0 || (inputHandleSettlementQrisOtomatisMerchant.periode === 0 && inputHandleSettlementQrisOtomatisMerchant.idSettlement.length === 0) || (inputHandleSettlementQrisOtomatisMerchant.periode === 0 && inputHandleSettlementQrisOtomatisMerchant.statusQris === 0)}
                                                        onClick={() => resetButtonSettlementQrisOtomatisMerchant()}
                                                    >
                                                        Atur Ulang
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <div style={{ marginBottom: 20 }} className='mt-3 d-flex justify-content-between align-items-center'>
                                        <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600, color: "#383838" }}>Daftar pengajuan settlement</div>
                                        {
                                            dataSettlementQrisOtomatisMerchant.length !== 0 && (
                                                <Link className="export-span">Export</Link>
                                            )
                                        }
                                    </div>
                                    <div className="div-table pb-4">
                                        <DataTable
                                            columns={columnsSettleOtomatisMerchant}
                                            data={dataSettlementQrisOtomatisMerchant}
                                            customStyles={customStylesSettlementQris}
                                            highlightOnHover
                                            progressPending={pendingSettlementQrisOtomatisMerchant}
                                            progressComponent={<CustomLoader />}
                                        />
                                    </div>
                                </div>
                            )
                        }
                        
                    </>
                )
            }
        </div>
    )
}

export default QrisSettlement