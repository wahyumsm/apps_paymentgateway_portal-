import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import $ from 'jquery'
import { Col, Form, Image, OverlayTrigger, Row, Tooltip } from '@themesberg/react-bootstrap'
import DataTable, { defaultThemes } from 'react-data-table-component'
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { BaseURL, convertToRupiah, currentDate, customFilter, errorCatch, firstDayLastMonth, firstDayThisMonth, getRole, getToken, lastDayLastMonth, lastDayThisMonth, setUserSession, sevenDaysAgo, yesterdayDate } from '../../function/helpers'
import axios from 'axios'
import encryptData from '../../function/encryptData'
import ReactSelect, { components } from 'react-select'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import Pagination from 'react-js-pagination'
import * as XLSX from "xlsx"
import CurrencyInput from 'react-currency-input-field'
import circleInfo from "../../assets/icon/circle_without_bg_Icon.svg"

const QrisSettlement = () => {
    const history = useHistory()
    const user_role = getRole()
    const access_token = getToken();
    const [isSettlementOtomatis, setIsSettlementOtomatis] = useState(true)
    const [partnerId, setPartnerId] = useState("")
    const [settleType, setSettleType] = useState(0)

    const [showDateSettlementQrisOtomatisAdmin, setShowDateSettlementQrisOtomatisAdmin] = useState("none")
    const [dateRangeSettlementQrisOtomatisAdmin, setDateRangeSettlementQrisOtomatisAdmin] = useState([])
    const [stateSettlementQrisOtomatisAdmin, setStateSettlementQrisOtomatisAdmin] = useState(null)
    const [activePageSettlementQrisOtomatisAdmin, setActivePageSettlementQrisOtomatisAdmin] = useState(1)
    const [pageNumberSettlementQrisOtomatisAdmin, setPageNumberSettlementQrisOtomatisAdmin] = useState({})
    const [totalPageSettlementQrisOtomatisAdmin, setTotalPageSettlementQrisOtomatisAdmin] = useState(0)
    const [isFilterSettlementQrisOtomatisAdmin, setIsFilterSettlementQrisOtomatisAdmin] = useState(false)
    const [pendingSettlementQrisOtomatisAdmin, setPendingSettlementQrisOtomatisAdmin] = useState(true)
    const [dataSettlementQrisOtomatisAdmin, setDataSettlementQrisOtomatisAdmin] = useState([])
    const [inputHandleSettlementQrisOtomatisAdmin, setInputHandleSettlementQrisOtomatisAdmin] = useState({
        idSettlement: "",
        periode: 0,
        statusQris: "",
        channelPembayaran: 0,
    })

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
        statusQris: "",
        channelPembayaran: 0,
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
        statusQris: ""
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
        statusQris: ""
    })
    const [nominalPengajuan, setNominalPengajuan] = useState("")
    const [totalSettlement, setTotalSettlement] = useState(0)
    const [dataAccBankManualQrisSettleMerchant, setDataAccBankManualQrisSettleMerchant] = useState({})
    const [dataBalanceTypeManualQrisSettleMerchant, setDataBalanceTypeManualQrisSettleMerchant] = useState({})

    function handleChangeNominal (e, dataAccBank) {
        setNominalPengajuan(e)
        if (Object.keys(dataAccBank).length !== 0) {
            setTotalSettlement(Number(e) -  dataAccBank.biaya_admin)
        } else {
            setTotalSettlement(Number(e) -  0)
        }
    }

    const [dataBrandInQrisManualMerchant, setDataBrandInQrisManualMerchant] = useState([])
    const [selectedBrandNameQrisManualMerchant, setSelectedBrandNameQrisManualMerchant] = useState([])
    function handleChangeBrandQrisManualMerchant(e) {
        setSelectedBrandNameQrisManualMerchant([e])
        if (settleType[0]?.mqrismerchant_settle_group === 103) {
            getOutletInQrisManualHandler(e.value)
            setSelectedOutletNameQrisManualMerchant([])
        } else {
            getAccountBankSettlementQrisManualMerchantHandler(e.value, 0)
        }
    }


    const [dataOutletInQrisManualMerchant, setDataOutletInQrisManualMerchant] = useState([])
    const [selectedOutletNameQrisManualMerchant, setSelectedOutletNameQrisManualMerchant] = useState([])
    function handleChangeOutletQrisManualMerchant(e) {
        setSelectedOutletNameQrisManualMerchant([e])
        if  (settleType[0]?.mqrismerchant_settle_group === 103) {
            if (user_role === "106") {
                getAccountBankSettlementQrisManualMerchantHandler(selectedBrandNameQrisManualMerchant[0]?.value, e.value)
            } else {
                getAccountBankSettlementQrisManualMerchantHandler(partnerId, e.value)
            }
        }
    }

    const [dataGrupInQris, setDataGrupInQris] = useState([])
    const [selectedGrupName, setSelectedGrupName] = useState([])

    const [dataBrandInQris, setDataBrandInQris] = useState([])
    const [selectedBrandName, setSelectedBrandName] = useState([])

    const [dataOutletInQris, setDataOutletInQris] = useState([])
    const [selectedOutletName, setSelectedOutletName] = useState([])

    function handleChangeGrupAdmin(e) {
        getBrandInQrisTransactionHandler(e.value)
        setDataOutletInQris([])
        setSelectedGrupName([e])
        setSelectedBrandName([])
        setSelectedOutletName([])
    }

    function handleChangeBrandAdmin(e) {
        getOutletInQrisTransactionHandler(e.value)
        setSelectedBrandName([e])
        setSelectedOutletName([])
    }

    function handleChangeOutletAdmin(e) {
        setSelectedOutletName([e])
    }

    function handleChangeBrand(e) {
        setSelectedBrandName([e])
        if (user_role !== "102" && user_role !== "104") {
            getOutletInQrisTransactionHandler(e.value)
            setSelectedOutletName([])
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

    function handlePageChangeSettlementQrisOtomatisMerchant(page) {
        if (isFilterSettlementQrisOtomatisMerchant) {
            setActivePageSettlementQrisOtomatisMerchant(page)
            filterDataSettlementQrisOtomatisHandler(user_role, inputHandleSettlementQrisOtomatisMerchant.idSettlement, inputHandleSettlementQrisOtomatisMerchant.periode, dateRangeSettlementQrisOtomatisMerchant, inputHandleSettlementQrisOtomatisMerchant.statusQris, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0, selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0, page, 10, inputHandleSettlementQrisOtomatisMerchant.channelPembayaran)

        } else {
            setActivePageSettlementQrisOtomatisMerchant(page)
            getDataSettlementQrisOtomatisHandler(user_role, page)
        }
    }

    function handleChangeSettleQrisOtomatisAdmin(e) {
        setInputHandleSettlementQrisOtomatisAdmin({
            ...inputHandleSettlementQrisOtomatisAdmin,
            [e.target.name] : e.target.value
        })
    }

    function handleChangePeriodeSettlementQrisOtomatisAdmin(e) {
        if (e.target.value === "7") {
            setShowDateSettlementQrisOtomatisAdmin("")
            setInputHandleSettlementQrisOtomatisAdmin({
                ...inputHandleSettlementQrisOtomatisAdmin,
                [e.target.name] : e.target.value
            })
        } else {
            setShowDateSettlementQrisOtomatisAdmin("none")
            setInputHandleSettlementQrisOtomatisAdmin({
                ...inputHandleSettlementQrisOtomatisAdmin,
                [e.target.name] : e.target.value
            })
        }
    }

    function pickDateSettlementQrisOtomatisAdmin(item) {
        setStateSettlementQrisOtomatisAdmin(item)
        if (item !== null) {
          item = item.map(el => el.toLocaleDateString('en-CA'))
          setDateRangeSettlementQrisOtomatisAdmin(item)
        }
    }

    function handlePageChangeSettlementQrisOtomatisAdmin(page) {
        if (isFilterSettlementQrisOtomatisAdmin) {
            setActivePageSettlementQrisOtomatisAdmin(page)
            filterDataSettlementQrisOtomatisHandler(user_role, inputHandleSettlementQrisOtomatisAdmin.idSettlement, inputHandleSettlementQrisOtomatisAdmin.periode, dateRangeSettlementQrisOtomatisAdmin, inputHandleSettlementQrisOtomatisAdmin.statusQris, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0, selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0, page, 10, inputHandleSettlementQrisOtomatisAdmin.channelPembayaran)
        } else {
            setActivePageSettlementQrisOtomatisAdmin(page)
            getDataSettlementQrisOtomatisHandler(user_role, page)
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

    function handlePageChangeSettlementQrisManualMerchant(page) {
        if (isFilterSettlementQrisManualMerchant) {
            setActivePageSettlementQrisManualMerchant(page)
            filterDataSettlementQrisManualHandler(inputHandleSettlementQrisManualMerchant.idSettlement, 0, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), inputHandleSettlementQrisManualMerchant.statusQris, inputHandleSettlementQrisManualMerchant.periode, dateRangeSettlementQrisManualMerchant, user_role, partnerId, page, 10)

        } else {
            setActivePageSettlementQrisManualMerchant(page)
            getDataSettlementQrisManualHandler(user_role, page, partnerId)
        }
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

    function handlePageChangeSettlementQrisManualAdmin(page) {
        if (isFilterSettlementQrisManualAdmin) {
            setActivePageSettlementQrisManualAdmin(page)
            filterDataSettlementQrisManualHandler(inputHandleSettlementQrisManualAdmin.idSettlement, (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0), (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), inputHandleSettlementQrisManualAdmin.statusQris, inputHandleSettlementQrisManualAdmin.periode, dateRangeSettlementQrisManualAdmin, user_role, partnerId, page, 10)

        } else {
            setActivePageSettlementQrisManualAdmin(page)
            getDataSettlementQrisManualHandler(user_role, page, partnerId)
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
            getDataSettlementQrisManualHandler(user_role, 1, partnerId)
            setInputHandleSettlementQrisManualAdmin({
                idSettlement: "",
                periode: 0,
                statusQris: ""
            })
            setShowDateSettlementQrisManualAdmin("none")
            setDateRangeSettlementQrisManualAdmin([])
            setStateSettlementQrisManualAdmin(null)
            setDataBrandInQris([])
            setDataOutletInQris([])
            setSelectedGrupName([])
            setSelectedBrandName([])
            setSelectedOutletName([])
        } else {
            disbursementTabs(false)
            getDataSettlementQrisOtomatisHandler(user_role, 1)
            setInputHandleSettlementQrisOtomatisAdmin({
                idSettlement: "",
                periode: 0,
                statusQris: "",
                channelPembayaran: 0,
            })
            setShowDateSettlementQrisOtomatisAdmin("none")
            setDateRangeSettlementQrisOtomatisAdmin([])
            setStateSettlementQrisOtomatisAdmin(null)
            setDataBrandInQris([])
            setDataOutletInQris([])
            setSelectedGrupName([])
            setSelectedBrandName([])
            setSelectedOutletName([])
        }
    }

    function resetButtonSettlementQrisOtomatis (param) {
        if (param === "merchant") {
            getDataSettlementQrisOtomatisHandler(user_role, 1)
            setInputHandleSettlementQrisOtomatisMerchant({
                idSettlement: "",
                periode: 0,
                statusQris: "",
                channelPembayaran: 0,
            })
            setIsFilterSettlementQrisOtomatisMerchant(false)
            setShowDateSettlementQrisOtomatisMerchant("none")
            setDateRangeSettlementQrisOtomatisMerchant([])
            setStateSettlementQrisOtomatisMerchant(null)
            setSelectedBrandName([])
            setSelectedOutletName([])
        } else {
            getDataSettlementQrisOtomatisHandler(user_role, 1)
            setInputHandleSettlementQrisOtomatisAdmin({
                idSettlement: "",
                periode: 0,
                statusQris: "",
                channelPembayaran: 0,
            })
            setIsFilterSettlementQrisOtomatisAdmin(false)
            setShowDateSettlementQrisOtomatisAdmin("none")
            setDateRangeSettlementQrisOtomatisAdmin([])
            setStateSettlementQrisOtomatisAdmin(null)
            setDataBrandInQris([])
            setDataOutletInQris([])
            setSelectedGrupName([])
            setSelectedBrandName([])
            setSelectedOutletName([])
        }

    }

    function resetButtonSettlementQrisManual (param) {
        if (param === "merchant") {
            getDataSettlementQrisManualHandler(user_role, 1, partnerId)
            setInputHandleSettlementQrisManualMerchant({
                idSettlement: "",
                periode: 0,
                statusQris: ""
            })
            setIsFilterSettlementQrisManualMerchant(false)
            setShowDateSettlementQrisManualMerchant("none")
            setDateRangeSettlementQrisManualMerchant([])
            setStateSettlementQrisManualMerchant(null)
            setDataOutletInQris([])
            setSelectedBrandName([])
            setSelectedOutletName([])
        } else {
            getDataSettlementQrisManualHandler(user_role, 1, partnerId)
            setInputHandleSettlementQrisManualAdmin({
                idSettlement: "",
                periode: 0,
                statusQris: ""
            })
            setIsFilterSettlementQrisManualAdmin(false)
            setShowDateSettlementQrisManualAdmin("none")
            setDateRangeSettlementQrisManualAdmin([])
            setStateSettlementQrisManualAdmin(null)
            setDataBrandInQris([])
            setDataOutletInQris([])
            setSelectedGrupName([])
            setSelectedBrandName([])
            setSelectedOutletName([])
        }

    }

    const columnsSettleOtomatisAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px"
        },
        {
            name: 'ID Settlement',
            selector: row => row.tqrissettl_code,
            width: "190px",
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detail-settlement-qris/${row.mmerchant_nou === null ? "0" : row.mmerchant_nou}/${row.mstore_nou === null ? "0" : row.mstore_nou}/${row.moutlet_nou === null ? "0" : row.moutlet_nou}/${row.tqrissettl_id}`} >{row.tqrissettl_code}</Link>
        },
        // {
        //     name: 'Settlement atas Tanggal',
        //     selector: row => row.tqrissettl_crtdt,
        //     width: "230px"
        // },
        {
            name: 'Waktu Settlement',
            selector: row => row.tqrissettl_crtdt,
            width: "180px"
        },
        {
            name: 'Channel Pembayaran',
            selector: row => row.mpaytypeqris_name,
            width: "200px"
        },
        {
            name: 'Tujuan Settlement',
            selector: row => row.mqrissettlegroup_name,
            width: "170px"
        },
        {
            name: 'Nama Grup',
            selector: row => row.GroupName,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.BrandName,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.StoreName,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Bank Tujuan',
            selector: row => row.mbank_name,
            wrap: true,
            width: "130px"
        },
        {
            name: 'Nomor Rekening',
            selector: row => row.tqrissettl_bank_acc_num_to,
            width: "160px"
        },
        {
            name: 'Nama Pemilik Rekening',
            selector: row => row.tqrissettl_bank_acc_name_to,
            width: "230px"
        },
        {
            name: 'Jumlah Transaksi WeChat Pay',
            selector: row => convertToRupiah(row.tqrissettl_trx_count_wechatpay, false, 0),
            width: "280px"
        },
        {
            name: 'Jumlah Transaksi Alipay',
            selector: row => convertToRupiah(row.tqrissettl_trx_count_alipay, false, 0),
            width: "230px"
        },
        {
            name: 'Jumlah Transaksi QRIS',
            selector: row => convertToRupiah(row.tqrissettl_trx_count, false, 0),
            width: "230px"
        },
        // {
        //     name: 'Jumlah Transaksi',
        //     selector: row => convertToRupiah(row.tqrissettl_trx_count, false, 0),
        //     width: "230px"
        // },
        {
            name: 'Total Transaksi WeChat Pay',
            selector: row => convertToRupiah(row.tqrissettl_trx_amount_wechatpay, true, 2),
            width: "250px"
        },
        {
            name: 'Total Transaksi Alipay',
            selector: row => convertToRupiah(row.tqrissettl_trx_amount_alipay, true, 2),
            width: "230px"
        },
        {
            name: 'Total Transaksi QRIS',
            selector: row => convertToRupiah(row.tqrissettl_trx_amount, true, 2),
            width: "230px"
        },
        // {
        //     name: 'Total Transaksi',
        //     selector: row => convertToRupiah(row.tqrissettl_trx_amount, true, 2),
        //     width: "230px"
        // },
        {
            name: 'Total Transaksi Keseluruhan',
            selector: row => convertToRupiah((row.tqrissettl_trx_amount + row.tqrissettl_trx_amount_wechatpay + row.tqrissettl_trx_amount_alipay), true, 2),
            width: "250px"
        },
        {
            name: 'MDR WeChat Pay',
            selector: row => convertToRupiah(row.tqrissettl_total_mdr_wechatpay, true, 2),
            width: "180px"
        },
        {
            name: 'MDR Alipay',
            selector: row => convertToRupiah(row.tqrissettl_total_mdr_alipay, true, 2),
            width: "140px"
        },
        {
            name: 'MDR QRIS',
            selector: row => convertToRupiah(row.tqrissettl_total_mdr, true, 2),
            width: "140px"
        },
        {
            name: 'Total MDR',
            selector: row => convertToRupiah((row.tqrissettl_total_mdr + row.tqrissettl_total_mdr_wechatpay + row.tqrissettl_total_mdr_alipay), true, 2),
            width: "140px"
        },
        // {
        //     name: 'Total MDR',
        //     selector: row => convertToRupiah((row.tqrissettl_total_mdr), true, 2),
        //     width: "140px"
        // },
        {
            name: 'Transaksi sebelum Cashback',
            selector: row => convertToRupiah(row.trx_before_cashback, true, 2),
            width: "250px"
        },
        {
            name: 'Cashback',
            selector: row => convertToRupiah(row?.cashback, true, 2),
            width: "140px"
        },
        {
            name: 'Transaksi setelah Cashback',
            selector: row => convertToRupiah(row.trx_after_cashback, true, 2),
            width: "250px"
        },
        {
            name: 'Biaya Tambahan',
            selector: row => convertToRupiah(row.biaya_tambahan, true, 2),
            width: "200px"
        },
        // {
        //     name: 'Komisi Agen',
        //     selector: row => convertToRupiah(row.biaya_tambahan, true, 2),
        //     width: "200px"
        // },
        {
            name: 'Pendapatan Merchant',
            selector: row => convertToRupiah(row.pendapatan_merchant, true, 2),
            width: "200px"
        },
        {
            name: 'Biaya Admin',
            selector: row => convertToRupiah(row.tqrissettl_admin_fee, true, 2),
            width: "130px"
        },
        {
            name: 'Biaya Sameday',
            selector: row => convertToRupiah(row.sameday, true, 2),
            width: "180px"
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.nominal_settlement, true, 2),
            width: "190px"
        },
        // {
        //     name: 'Nominal Dispute',
        //     selector: row => convertToRupiah(row.tqrissettl_dispute, true, 2),
        //     width: "200px"
        // },
        // {
        //     name: 'Nett Settlement',
        //     selector: row => convertToRupiah(row.nett_settlement, true, 2),
        //     width: "200px"
        // },
        {
            name: 'Total Pendapatan Ezeelink',
            selector: row => convertToRupiah(row.pendapatan_ezee, true, 2),
            width: "250px"
        },
        {
            name: 'Status',
            selector: row => row.mstatus_name,
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

    const columnsSettleOtomatisMerchant = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px"
        },
        {
            name: 'ID Settlement',
            selector: row => row.tqrissettl_code,
            width: "190px",
            cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detail-settlement-qris/${row.mmerchant_nou === null ? "0" : row.mmerchant_nou}/${row.mstore_nou === null ? "0" : row.mstore_nou}/${row.moutlet_nou === null ? "0" : row.moutlet_nou}/${row.tqrissettl_id}`} >{row.tqrissettl_code}</Link>
        },
        // {
        //     name: 'Settlement atas Tanggal',
        //     selector: row => row.tqrissettl_crtdt,
        //     width: "230px"
        // },
        {
            name: 'Waktu Settlement',
            selector: row => row.tqrissettl_crtdt,
            width: "180px"
        },
        {
            name: 'Channel Pembayaran',
            selector: row => row.mpaytypeqris_name,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Nama Brand',
            selector: row => row.BrandName,
            wrap: true,
            omit: user_role === "106" ? true : user_role === "107" ? false : false,
            width: "200px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.StoreName,
            wrap: true,
            omit: user_role === "106" ? true : user_role === "107" ? true : false,
            width: "200px"
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
            name: 'Jumlah Transaksi WeChat Pay',
            selector: row => convertToRupiah(row.tqrissettl_trx_count_wechatpay, false, 0),
            width: "280px"
        },
        {
            name: 'Jumlah Transaksi Alipay',
            selector: row => convertToRupiah(row.tqrissettl_trx_count_alipay, false, 0),
            width: "230px"
        },
        {
            name: 'Jumlah Transaksi QRIS',
            selector: row => convertToRupiah(row.tqrissettl_trx_count, false, 0),
            width: "230px"
        },
        {
            name: 'Total Transaksi WeChat Pay',
            selector: row => convertToRupiah(row.tqrissettl_trx_amount_wechatpay, true, 2),
            width: "250px"
        },
        {
            name: 'Total Transaksi Alipay',
            selector: row => convertToRupiah(row.tqrissettl_trx_amount_alipay, true, 2),
            width: "230px"
        },
        {
            name: 'Total Transaksi QRIS',
            selector: row => convertToRupiah(row.tqrissettl_trx_amount, true, 2),
            width: "230px"
        },
        {
            name: 'Total Transaksi Keseluruhan',
            selector: row => convertToRupiah((row.tqrissettl_trx_amount + row.tqrissettl_trx_amount_wechatpay + row.tqrissettl_trx_amount_alipay), true, 2),
            width: "250px"
        },
        {
            name: 'MDR WeChat Pay',
            // name:
            // <>
            //     <OverlayTrigger
            //         placement="top"
            //         trigger={["hover"]}
            //         overlay={
            //             <Tooltip>MDR WeChat Pay = 0.05% x (Jumlah Transaksi WeChat Pay)</Tooltip>
            //         }
            //     >
            //         <div>
            //             MDR WeChat Pay
            //             <img
            //                 src={circleInfo}
            //                 alt="circle_info"
            //                 style={{ marginTop: -3, marginLeft: 3 }}
            //             />
            //         </div>
            //     </OverlayTrigger>
            // </>,
            selector: row => convertToRupiah(row.tqrissettl_total_mdr_wechatpay, true, 2),
            width: "180px"
        },
        {
            name: 'MDR Alipay',
            // name:
            // <>
            //     <OverlayTrigger
            //         placement="top"
            //         trigger={["hover"]}
            //         overlay={
            //             <Tooltip>MDR Alipay = 0.05% x (Jumlah Transaksi Alipay)</Tooltip>
            //         }
            //     >
            //         <div>
            //             MDR Alipay
            //             <img
            //                 src={circleInfo}
            //                 alt="circle_info"
            //                 style={{ marginTop: -3, marginLeft: 3 }}
            //             />
            //         </div>
            //     </OverlayTrigger>
            // </>,
            selector: row => convertToRupiah(row.tqrissettl_total_mdr_alipay, true, 2),
            width: "140px"
        },
        {
            name: 'MDR QRIS',
            selector: row => convertToRupiah(row.tqrissettl_total_mdr, true, 2),
            width: "140px"
        },
        {
            name: 'Total MDR',
            selector: row => convertToRupiah((row.tqrissettl_total_mdr + row.tqrissettl_total_mdr_wechatpay + row.tqrissettl_total_mdr_alipay), true, 2),
            width: "140px"
        },
        {
            name: 'Transaksi sebelum Cashback',
            selector: row => convertToRupiah(row.trx_before_cashback, true, 2),
            width: "250px"
        },
        {
            name: 'Cashback',
            // name:
            // <>
            //     <OverlayTrigger
            //         placement="top"
            //         trigger={["hover"]}
            //         overlay={
            //             <Tooltip>Cashback = 0.05% x (Jumlah Transaksi WeChat Pay + Alipay)</Tooltip>
            //         }
            //     >
            //         <div>
            //             Cashback
            //             <img
            //                 src={circleInfo}
            //                 alt="circle_info"
            //                 style={{ marginTop: -3, marginLeft: 3 }}
            //             />
            //         </div>
            //     </OverlayTrigger>
            // </>,
            selector: row => convertToRupiah(row.cashback, true, 2),
            width: "140px"
        },
        {
            name: 'Transaksi setelah Cashback',
            selector: row => convertToRupiah(row.trx_after_cashback, true, 2),
            width: "250px"
        },
        {
            name: 'Biaya Tambahan',
            // name:
            // <>
            //     <OverlayTrigger
            //         placement="top"
            //         trigger={["hover"]}
            //         overlay={
            //             <Tooltip>Biaya Tambahan = 0.05% x (Total Transaksi Keseluruhan)</Tooltip>
            //         }
            //     >
            //         <div>
            //             Biaya Tambahan
            //             <img
            //                 src={circleInfo}
            //                 alt="circle_info"
            //                 style={{ marginTop: -3, marginLeft: 3 }}
            //             />
            //         </div>
            //     </OverlayTrigger>
            // </>,
            selector: row => convertToRupiah(row.biaya_tambahan, true, 2),
            width: "200px"
        },
        // {
        //     name: 'Komisi Agen',
        //     selector: row => convertToRupiah(row.biaya_tambahan, true, 2),
        //     width: "200px"
        // },
        {
            name: 'Pendapatan Merchant',
            selector: row => convertToRupiah(row.pendapatan_merchant, true, 2),
            width: "200px"
        },
        {
            name: 'Biaya Admin',
            selector: row => convertToRupiah(row.tqrissettl_admin_fee, true, 2),
            width: "140px"
        },
        {
            name: 'Biaya Sameday',
            selector: row => convertToRupiah(row.sameday, true, 2),
            width: "180px"
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.nominal_settlement, true, 2),
            width: "200px"
        },
        // {
        //     name: 'Nominal Dispute',
        //     selector: row => convertToRupiah(row.tqrissettl_dispute, true, 2),
        //     width: "200px"
        // },
        // {
        //     name: 'Nett Settlement',
        //     selector: row => convertToRupiah(row.nett_settlement, true, 2),
        //     width: "200px"
        // },
        {
            name: 'Status',
            selector: row => row.mstatus_name,
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

    const columnsSettleManualMerchant = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px"
        },
        {
            name: 'ID Settlement',
            selector: row => row.ID,
            width: "190px",
            // cell: (row) => <Link style={{ textDecoration: "underline", color: "#077E86" }} to={`/detail-settlement-qris/${row.mmerchant_nou === null ? "0" : row.mmerchant_nou}/${row.mstore_nou === null ? "0" : row.mstore_nou}/${row.moutlet_nou === null ? "0" : row.moutlet_nou}/${row.tqrissettl_id}`} >{row.ID}</Link>
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
            name: 'Nama Brand',
            selector: row => row.nama_brand,
            wrap: "true",
            width: "160px",
            omit: user_role === "106" ? (settleType[0]?.mqrismerchant_settle_group === 101 ? true : false) : user_role === "107" ? (settleType[0]?.mqrismerchant_settle_group === 102 ? true : false) : true,
        },
        {
            name: 'Nama Outlet',
            selector: row => row.nama_outlet,
            wrap: "true",
            width: "160px",
            omit: (user_role === "106" || user_role === "107") ? (settleType[0]?.mqrismerchant_settle_group === 103 ? false : true) : true,
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
            name: 'Total Nominal',
            selector: row => convertToRupiah(row.amount, true, 2),
            width: "160px"
        },
        {
            name: 'Biaya Admin',
            selector: row => convertToRupiah(row.biaya_admin, true, 2),
            width: "130px"
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.total_settle, true, 2),
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

    const columnsSettleManualAdmin = [
        {
            name: 'No',
            selector: row => row.number,
            width: "57px"
        },
        {
            name: 'ID Settlement',
            selector: row => row.ID,
            width: "190px"
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
            wrap: true,
            width: "160px",
        },
        {
            name: 'Nama Brand',
            selector: row => row.nama_brand,
            wrap: "true",
            width: "160px"
        },
        {
            name: 'Nama Outlet',
            selector: row => row.nama_outlet,
            wrap: "true",
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
            name: 'Total Nominal',
            selector: row => convertToRupiah(row.amount, true, 2),
            width: "160px"
        },
        {
            name: 'Biaya Admin',
            selector: row => convertToRupiah(row.biaya_admin, true, 2),
            width: "130px"
        },
        {
            name: 'Nominal Settlement',
            selector: row => convertToRupiah(row.total_settle, true, 2),
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


    async function getAccountBankSettlementQrisManualMerchantHandler(brandNou, outletNou) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"brandID": ${brandNou}, "outletID": ${outletNou}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const getDataAccountBank = await axios.post(BaseURL + "/QRIS/GetBankAccount", { data: dataParams }, { headers: headers })
            // console.log(getDataAccountBank, 'ini user detal funct');
            if (getDataAccountBank.status === 200 && getDataAccountBank.data.response_code === 200 && getDataAccountBank.data.response_new_token === null) {
                setDataAccBankManualQrisSettleMerchant(getDataAccountBank.data.response_data.results)
                setTotalSettlement(Number(nominalPengajuan) - getDataAccountBank.data.response_data.results.biaya_admin)
            } else if (getDataAccountBank.status === 200 && getDataAccountBank.data.response_code === 200 && getDataAccountBank.data.response_new_token !== null) {
                setUserSession(getDataAccountBank.data.response_new_token)
                setDataAccBankManualQrisSettleMerchant(getDataAccountBank.data.response_data.results)
                setTotalSettlement(Number(nominalPengajuan) - getDataAccountBank.data.response_data.results.biaya_admin)
            }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    // async function getDataBalanceTypeManualSettleQris(settleGroup) {
    //     try {
    //         const auth = "Bearer " + access_token
    //         const dataParams = encryptData(`{"settle_group": ${settleGroup}}`)
    //         const headers = {
    //             'Content-Type':'application/json',
    //             'Authorization' : auth
    //         }
    //         const dataBalanceTypeManualSettleQris = await axios.post(BaseURL + "/QRIS/QRISGetBalance", { data: dataParams }, { headers: headers })
    //         // console.log(dataBalanceTypeManualSettleQris, 'ini user detal funct');
    //         if (dataBalanceTypeManualSettleQris.status === 200 && dataBalanceTypeManualSettleQris.data.response_code === 200 && dataBalanceTypeManualSettleQris.data.response_new_token === null) {
    //             setDataBalanceTypeManualQrisSettleMerchant(dataBalanceTypeManualSettleQris.data.response_data.results)
    //         } else if (dataBalanceTypeManualSettleQris.status === 200 && dataBalanceTypeManualSettleQris.data.response_code === 200 && dataBalanceTypeManualSettleQris.data.response_new_token !== null) {
    //             setUserSession(dataBalanceTypeManualSettleQris.data.response_new_token)
    //             setDataBalanceTypeManualQrisSettleMerchant(dataBalanceTypeManualSettleQris.data.response_data.results)
    //         }
    // } catch (error) {
    //       // console.log(error);
    //       history.push(errorCatch(error.response.status))
    //     }
    // }

    function submitSettleManual () {
        submitSettlementHandler(dataAccBankManualQrisSettleMerchant.ID, Number(nominalPengajuan), user_role === "106" ? partnerId : 0, user_role === "106" ? ((settleType[0]?.mqrismerchant_settle_group === 102 || settleType[0]?.mqrismerchant_settle_group === 103) ? selectedBrandNameQrisManualMerchant.map((item, idx) => item.value) : 0) : (user_role === "107" ? partnerId : 0), (user_role === "106" || user_role === "107") ? (settleType[0]?.mqrismerchant_settle_group === 103 ? selectedOutletNameQrisManualMerchant.map((item, idx) => item.value) : 0) : user_role === "108" ? partnerId : 0)
        setDataAccBankManualQrisSettleMerchant({})
        setNominalPengajuan("")
        setTotalSettlement(0)
        setSelectedBrandNameQrisManualMerchant([])
        setSelectedOutletNameQrisManualMerchant([])
    }

    async function submitSettlementHandler(merchSettle, settleAmount, groupId, brandId, outletId) {
        try {
            const auth = "Bearer " + access_token
            const dataParams = encryptData(`{"mqrismerchsettle_id": ${merchSettle}, "settle_amount": ${settleAmount}, "groupID" : ${groupId}, "brandID" : ${brandId}, "outletID" : ${outletId}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const dataSubmitSettle = await axios.post(BaseURL + "/QRIS/ApplySettlement", { data: dataParams }, { headers: headers })
            // console.log(dataSubmitSettle, 'ini user detal funct');
            if (dataSubmitSettle.status === 200 && dataSubmitSettle.data.response_code === 200 && dataSubmitSettle.data.response_new_token === null) {
                alert(dataSubmitSettle.data.response_data.results)
                window.location.reload()
            } else if (dataSubmitSettle.status === 200 && dataSubmitSettle.data.response_code === 200 && dataSubmitSettle.data.response_new_token !== null) {
                setUserSession(dataSubmitSettle.data.response_new_token)
                alert(dataSubmitSettle.data.response_data.results)
                window.location.reload()
            }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

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
                userDetails(dataSettleType.data.response_data.results[0]?.mqrismerchant_settle_type, dataSettleType.data.response_data.results[0]?.mqrismerchant_settle_group)
                // if (dataSettleType.data.response_data.results[0]?.mqrismerchant_settle_type === 102) {
                //     // getDataBalanceTypeManualSettleQris(dataSettleType.data.response_data.results[0]?.mqrismerchsettle_id)
                //     if (user_role === "106" && dataSettleType.data.response_data.results[0]?.mqrismerchant_settle_group === 101) {
                //         getAccountBankSettlementQrisManualMerchantHandler(0, 0)
                //     } else if (user_role === "107" && dataSettleType.data.response_data.results[0]?.mqrismerchant_settle_group === 102) {
                //         getAccountBankSettlementQrisManualMerchantHandler(0, 0)
                //     }
                // }
            } else if (dataSettleType.status === 200 && dataSettleType.data.response_code === 200 && dataSettleType.data.response_new_token !== null) {
                setUserSession(dataSettleType.data.response_new_token)
                setSettleType(dataSettleType.data.response_data.results)
                userDetails(dataSettleType.data.response_data.results[0]?.mqrismerchant_settle_type, dataSettleType.data.response_data.results[0]?.mqrismerchant_settle_group)
                // if (dataSettleType.data.response_data.results[0]?.mqrismerchant_settle_type === 102) {
                //     // getDataBalanceTypeManualSettleQris(dataSettleType.data.response_data.results[0]?.mqrismerchsettle_id)
                //     if ((user_role === "106" && dataSettleType.data.response_data.results[0]?.mqrismerchant_settle_group === 101) || (user_role === "107" && dataSettleType.data.response_data.results[0]?.mqrismerchant_settle_group === 102) || user_role === "108" && dataSettleType.data.response_data.results[0]?.mqrismerchant_settle_group === 103) {
                //         getAccountBankSettlementQrisManualMerchantHandler(0, 0)
                //     }
                // }
            }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    async function userDetails(settleType, settleGroup) {
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
                        if (settleGroup === 101) {
                            getAccountBankSettlementQrisManualMerchantHandler(0, 0)
                        }
                    } else {
                        getDataSettlementQrisOtomatisHandler(user_role, activePageSettlementQrisOtomatisMerchant)
                    }
                } else if (user_role === "107" || user_role === "108") {
                    getOutletInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
                    getOutletInQrisManualHandler(userDetail.data.response_data.muser_partnerdtl_id)
                    if (settleType === 102) {
                        getDataSettlementQrisManualHandler(user_role, activePageSettlementQrisManualMerchant, userDetail.data.response_data.muser_partnerdtl_id)
                        if (user_role === "107" && settleGroup === 102 ) {
                            getAccountBankSettlementQrisManualMerchantHandler(userDetail.data.response_data.muser_partnerdtl_id, 0)
                        } else if (user_role === "108" && settleGroup === 103) {
                            getAccountBankSettlementQrisManualMerchantHandler(0, userDetail.data.response_data.muser_partnerdtl_id)
                        }
                    } else {
                        getDataSettlementQrisOtomatisHandler(user_role, activePageSettlementQrisOtomatisMerchant)
                    }
                } else if (user_role === "102" || user_role === "104") {
                    getDataSettlementQrisOtomatisHandler(user_role, activePageSettlementQrisOtomatisAdmin)
                } else {
                    getDataSettlementQrisManualHandler(user_role, activePageSettlementQrisManualAdmin, userDetail.data.response_data.muser_partnerdtl_id)
                    getDataSettlementQrisOtomatisHandler(user_role, activePageSettlementQrisOtomatisAdmin)
                }
            } else if (userDetail.status === 200 && userDetail.data.response_code === 200 && userDetail.data.response_new_token.length !== 0) {
                setUserSession(userDetail.data.response_new_token)
                setPartnerId(userDetail.data.response_data.muser_partnerdtl_id)
                if (user_role === "106") {
                    getBrandInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
                    if (settleType === 102) {
                        getDataSettlementQrisManualHandler(user_role, activePageSettlementQrisManualMerchant, userDetail.data.response_data.muser_partnerdtl_id)
                        if (settleGroup === 101) {
                            getAccountBankSettlementQrisManualMerchantHandler(0, 0)
                        }
                    } else {
                        getDataSettlementQrisOtomatisHandler(user_role, activePageSettlementQrisOtomatisMerchant)
                    }
                } else if (user_role === "107" || user_role === "108") {
                    getOutletInQrisTransactionHandler(userDetail.data.response_data.muser_partnerdtl_id)
                    if (settleType === 102) {
                        getDataSettlementQrisManualHandler(user_role, activePageSettlementQrisManualMerchant, userDetail.data.response_data.muser_partnerdtl_id)
                        if (user_role === "107" && settleGroup === 102 ) {
                            getAccountBankSettlementQrisManualMerchantHandler(userDetail.data.response_data.muser_partnerdtl_id, 0)
                        } else if (user_role === "108" && settleGroup === 103) {
                            getAccountBankSettlementQrisManualMerchantHandler(0, userDetail.data.response_data.muser_partnerdtl_id)
                        }
                    } else {
                        getDataSettlementQrisOtomatisHandler(user_role, activePageSettlementQrisOtomatisMerchant)
                    }
                } else if (user_role === "102" || user_role === "104") {
                    getDataSettlementQrisOtomatisHandler(user_role, activePageSettlementQrisOtomatisAdmin)
                } else {
                    getDataSettlementQrisManualHandler(user_role, activePageSettlementQrisManualAdmin, userDetail.data.response_data.muser_partnerdtl_id)
                    getDataSettlementQrisOtomatisHandler(user_role, activePageSettlementQrisOtomatisAdmin)
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
                setDataBrandInQrisManualMerchant(newArr)
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
                setDataBrandInQrisManualMerchant(newArr)
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

    async function getOutletInQrisManualHandler(nouBrand) {
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
                setDataOutletInQrisManualMerchant(newArr)
            } else if (dataOutletQris.status === 200 && dataOutletQris.data.response_code === 200 && dataOutletQris.data.response_new_token !== null) {
                setUserSession(dataOutletQris.data.response_new_token)
                let newArr = []
                dataOutletQris.data.response_data.results.forEach(e => {
                    let obj = {}
                    obj.value = e.nou
                    obj.label = e.name
                    newArr.push(obj)
                })
                setDataOutletInQrisManualMerchant(newArr)
            }
        } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function getDataSettlementQrisOtomatisHandler(role, currentPage) {
        try {
            if (role === "106" || role === "107" || role === "108" || role === "102" || role === "104") {
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"settle_code": "", "status" : "2,4,5,6,8", "payment_type_qris": "1,2,3", "period": 2, "date_from": "", "date_to": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0, "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
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
            } else {
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"settle_code": "", "status" : "2,4,5,6,8", "payment_type_qris": "1,2,3", "period": 2, "date_from": "", "date_to": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0, "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const dataReportSettleQris = await axios.post(BaseURL + "/QRIS/QRISSettlementAutomaticPaging", { data: dataParams }, { headers: headers })
                // console.log(dataReportSettleQris, 'ini user detal funct');
                if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token === null) {
                    dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1}))
                    setPageNumberSettlementQrisOtomatisAdmin(dataReportSettleQris.data.response_data)
                    setTotalPageSettlementQrisOtomatisAdmin(dataReportSettleQris.data.response_data.max_page)
                    setDataSettlementQrisOtomatisAdmin(dataReportSettleQris.data.response_data.results)
                    setPendingSettlementQrisOtomatisAdmin(false)
                } else if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token !== null) {
                    setUserSession(dataReportSettleQris.data.response_new_token)
                    dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (currentPage > 1) ? (idx + 1)+((currentPage - 1) * 10) : idx + 1}))
                    setPageNumberSettlementQrisOtomatisAdmin(dataReportSettleQris.data.response_data)
                    setTotalPageSettlementQrisOtomatisAdmin(dataReportSettleQris.data.response_data.max_page)
                    setDataSettlementQrisOtomatisAdmin(dataReportSettleQris.data.response_data.results)
                    setPendingSettlementQrisOtomatisAdmin(false)
                }
            }
    } catch (error) {
          // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterDataSettlementQrisOtomatisHandler(role, idSettle, dateId, periode, statusQris, grupNou, brandNou, outletNou, page, rowPerPage, channelPembayaran) {
        try {
            console.log(role, 'role');
            if (role === "106" || role === "107" || role === "108" || role === "102" || role === "104") {
                setPendingSettlementQrisOtomatisMerchant(true)
                setIsFilterSettlementQrisOtomatisMerchant(true)
                setActivePageSettlementQrisOtomatisMerchant(page)
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"settle_code": "${idSettle}", "status" : "${statusQris.length !== 0 ? statusQris : "2,4,5,6,8"}", "payment_type_qris": "${Number(channelPembayaran) !== 0 ? channelPembayaran : "1,2,3"}", "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "merchant_nou": ${grupNou}, "brand_nou": ${brandNou}, "outlet_nou": ${outletNou}, "page": ${(page < 1) ? 1 : page}, "row_per_page": ${rowPerPage}}`)
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
            } else {
                setPendingSettlementQrisOtomatisAdmin(true)
                setIsFilterSettlementQrisOtomatisAdmin(true)
                setActivePageSettlementQrisOtomatisAdmin(page)
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"settle_code": "${idSettle}", "status" : "${statusQris.length !== 0 ? statusQris : "2,4,5,6,8"}", "payment_type_qris": "${Number(channelPembayaran) !== 0 ? channelPembayaran : "1,2,3"}", "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "merchant_nou": ${grupNou}, "brand_nou": ${brandNou}, "outlet_nou": ${outletNou}, "page": ${(page < 1) ? 1 : page}, "row_per_page": ${rowPerPage}}`)
                const headers = {
                    'Content-Type':'application/json',
                    'Authorization' : auth
                }
                const dataReportSettleQris = await axios.post(BaseURL + "/QRIS/QRISSettlementAutomaticPaging", { data: dataParams }, { headers: headers })
                console.log(dataReportSettleQris, 'ini user detal funct');
                if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token === null) {
                    dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1}))
                    setPageNumberSettlementQrisOtomatisAdmin(dataReportSettleQris.data.response_data)
                    setTotalPageSettlementQrisOtomatisAdmin(dataReportSettleQris.data.response_data.max_page)
                    setDataSettlementQrisOtomatisAdmin(dataReportSettleQris.data.response_data.results)
                    setPendingSettlementQrisOtomatisAdmin(false)
                } else if (dataReportSettleQris.status === 200 && dataReportSettleQris.data.response_code === 200 && dataReportSettleQris.data.response_new_token !== null) {
                    setUserSession(dataReportSettleQris.data.response_new_token)
                    dataReportSettleQris.data.response_data.results = dataReportSettleQris.data.response_data.results.map((obj, idx) => ({...obj, number: (page > 1) ? (idx + 1)+((page - 1) * 10) : idx + 1}))
                    setPageNumberSettlementQrisOtomatisAdmin(dataReportSettleQris.data.response_data)
                    setTotalPageSettlementQrisOtomatisAdmin(dataReportSettleQris.data.response_data.max_page)
                    setDataSettlementQrisOtomatisAdmin(dataReportSettleQris.data.response_data.results)
                    setPendingSettlementQrisOtomatisAdmin(false)
                }
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
                const dataParams = encryptData(`{"settlementCode": "", "groupID" : ${partnerId}, "brandID" : 0, "outletID" : 0, "statusid" : "2,4,5,6,8", "date_from": "${currentDate}", "date_to": "${currentDate}", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
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
            } else if (role !== "102" && role !== "104") {
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"settlementCode": "", "groupID" : 0, "brandID" : 0, "outletID" : 0, "statusid" : "2,4,5,6,8", "date_from": "${currentDate}", "date_to": "${currentDate}", "page": ${(currentPage < 1) ? 1 : currentPage}, "row_per_page": 10}`)
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
                const dataParams = encryptData(`{"settlementCode": "${settlementCode}", "groupID" : ${partnerId}, "brandID" : ${brandId}, "outletID" : ${outletId}, "statusid" : "${statusId.length !== 0 ? statusId : "2,4,5,6,8"}", "date_from": "${(periode.length !== 0) ? (periode === "7" ? dateRange[0] : periode[0]) : ""}", "date_to": "${(periode.length !== 0) ? periode === "7" ? dateRange[1] : periode[1] : ""}", "page": ${(page < 1) ? 1 : page}, "row_per_page": ${rowPerPage}}`)
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
            } else if (user_role !== "102" && user_role !== "104") {
                setPendingSettlementQrisManualAdmin(true)
                setIsFilterSettlementQrisManualAdmin(true)
                setActivePageSettlementQrisManualAdmin(page)
                const auth = "Bearer " + access_token
                const dataParams = encryptData(`{"settlementCode": "${settlementCode}", "groupID" : ${groupId}, "brandID" : ${brandId}, "outletID" : ${outletId}, "statusid" : "${statusId.length !== 0 ? statusId : "2,4,5,6,8"}", "date_from": "${(periode.length !== 0) ? (periode === "7" ? dateRange[0] : periode[0]) : ""}", "date_to": "${(periode.length !== 0) ? periode === "7" ? dateRange[1] : periode[1] : ""}", "page": ${(page < 1) ? 1 : page}, "row_per_page": ${rowPerPage}}`)
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

    function ExportReportSettlementQrisOtomatisHandler(role, isFilter, idSettle, dateId, periode, statusQris, grupNou, brandNou, outletNou, channelPembayaran) {
        if (role === "106" || role === "107" || role === "108" || role === "102" || role === "104") {
            if (isFilter) {
                async function dataExportFilter(idSettle, dateId, periode, statusQris, channelPembayaran) {
                    try {
                        const auth = 'Bearer ' + getToken();
                        const dataParams = encryptData(`{"settle_code": "${idSettle}", "status" : "${statusQris.length !== 0 ? statusQris : "2,4,5,6,8"}", "payment_type_qris": "${Number(channelPembayaran) !== 0 ? channelPembayaran : "1,2,3"}", "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "merchant_nou": ${grupNou}, "brand_nou": ${brandNou}, "outlet_nou": ${outletNou}, "page": 1, "row_per_page": 1000000}`)
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                        const dataExportFilter = await axios.post(BaseURL + "/QRIS/QRISSettlementAutomaticPaging", {data: dataParams}, { headers: headers });
                        if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                            const data = dataExportFilter.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                if (user_role === "106") {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Settlement atas Tanggal": data[i].tqrissettl_crtdt, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi QRIS": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_wechatpay + data[i].tqrissettl_trx_amount_alipay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_wechatpay + data[i].tqrissettl_total_mdr_alipay), "Transaksi sebelum Cashback": data[i].trx_before_cashback, "Cashback": data[i].cashback, "Transaksi setelah Cashback": data[i].trx_after_cashback, "Biaya Tambahan": data[i].biaya_tambahan, "Pendapatan Merchant": data[i].pendapatan_merchant, "Biaya Admin": data[i].tqrissettl_admin_fee, "Biaya Sameday": data[i].sameday, "Nominal Settlement": data[i].nominal_settlement, "Status": data[i].mstatus_name })
                                } else if (user_role === "107") {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Settlement atas Tanggal": data[i].tqrissettl_crtdt, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Nama Brand": data[i].BrandName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi QRIS": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_wechatpay + data[i].tqrissettl_trx_amount_alipay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_wechatpay + data[i].tqrissettl_total_mdr_alipay), "Transaksi sebelum Cashback": data[i].trx_before_cashback, "Cashback": data[i].cashback, "Transaksi setelah Cashback": data[i].trx_after_cashback, "Biaya Tambahan": data[i].biaya_tambahan, "Pendapatan Merchant": data[i].pendapatan_merchant, "Biaya Admin": data[i].tqrissettl_admin_fee, "Biaya Sameday": data[i].sameday, "Nominal Settlement": data[i].nominal_settlement, "Status": data[i].mstatus_name })
                                } else {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Settlement atas Tanggal": data[i].tqrissettl_crtdt, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Nama Brand": data[i].BrandName, "Nama Outlet": data[i].StoreName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi QRIS": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_wechatpay + data[i].tqrissettl_trx_amount_alipay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_wechatpay + data[i].tqrissettl_total_mdr_alipay), "Transaksi sebelum Cashback": data[i].trx_before_cashback, "Cashback": data[i].cashback, "Transaksi setelah Cashback": data[i].trx_after_cashback, "Biaya Tambahan": data[i].biaya_tambahan, "Pendapatan Merchant": data[i].pendapatan_merchant, "Biaya Admin": data[i].tqrissettl_admin_fee, "Biaya Sameday": data[i].sameday, "Nominal Settlement": data[i].nominal_settlement, "Status": data[i].mstatus_name })
                                }
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token !== null) {
                            setUserSession(dataExportFilter.data.response_new_token)
                            const data = dataExportFilter.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                if (user_role === "106") {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Settlement atas Tanggal": data[i].tqrissettl_crtdt, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi QRIS": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_wechatpay + data[i].tqrissettl_trx_amount_alipay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_wechatpay + data[i].tqrissettl_total_mdr_alipay), "Transaksi sebelum Cashback": data[i].trx_before_cashback, "Cashback": data[i].cashback, "Transaksi setelah Cashback": data[i].trx_after_cashback, "Biaya Tambahan": data[i].biaya_tambahan, "Pendapatan Merchant": data[i].pendapatan_merchant, "Biaya Admin": data[i].tqrissettl_admin_fee, "Biaya Sameday": data[i].sameday, "Nominal Settlement": data[i].nominal_settlement, "Status": data[i].mstatus_name })
                                } else if (user_role === "107") {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Settlement atas Tanggal": data[i].tqrissettl_crtdt, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Nama Brand": data[i].BrandName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi QRIS": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_wechatpay + data[i].tqrissettl_trx_amount_alipay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_wechatpay + data[i].tqrissettl_total_mdr_alipay), "Transaksi sebelum Cashback": data[i].trx_before_cashback, "Cashback": data[i].cashback, "Transaksi setelah Cashback": data[i].trx_after_cashback, "Biaya Tambahan": data[i].biaya_tambahan, "Pendapatan Merchant": data[i].pendapatan_merchant, "Biaya Admin": data[i].tqrissettl_admin_fee, "Biaya Sameday": data[i].sameday, "Nominal Settlement": data[i].nominal_settlement, "Status": data[i].mstatus_name })
                                } else {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Settlement atas Tanggal": data[i].tqrissettl_crtdt, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Nama Brand": data[i].BrandName, "Nama Outlet": data[i].StoreName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi QRIS": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_wechatpay + data[i].tqrissettl_trx_amount_alipay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_wechatpay + data[i].tqrissettl_total_mdr_alipay), "Transaksi sebelum Cashback": data[i].trx_before_cashback, "Cashback": data[i].cashback, "Transaksi setelah Cashback": data[i].trx_after_cashback, "Biaya Tambahan": data[i].biaya_tambahan, "Pendapatan Merchant": data[i].pendapatan_merchant, "Biaya Admin": data[i].tqrissettl_admin_fee, "Biaya Sameday": data[i].sameday, "Nominal Settlement": data[i].nominal_settlement, "Status": data[i].mstatus_name })
                                }
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        }
                    } catch (error) {
                        // console.log(error);
                        history.push(errorCatch(error.response.status))
                    }
                }
                dataExportFilter(idSettle, dateId, periode, statusQris, channelPembayaran)
            } else {
                async function dataExportSettlementQris() {
                    try {
                        const auth = 'Bearer ' + getToken();
                        const dataParams = encryptData(`{"settle_code": "", "status" : "2,4,5,6,8", "payment_type_qris": "1,2,3", "period": 2, "date_from": "", "date_to": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0, "page": 1, "row_per_page": 1000000}`)
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                        const dataExportSettlementQris = await axios.post(BaseURL + "/QRIS/QRISSettlementAutomaticPaging", {data: dataParams}, { headers: headers });
                        if (dataExportSettlementQris.status === 200 && dataExportSettlementQris.data.response_code === 200 && dataExportSettlementQris.data.response_new_token === null) {
                            const data = dataExportSettlementQris.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                if (user_role === "106") {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Settlement atas Tanggal": data[i].tqrissettl_crtdt, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi QRIS": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_wechatpay + data[i].tqrissettl_trx_amount_alipay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_wechatpay + data[i].tqrissettl_total_mdr_alipay), "Transaksi sebelum Cashback": data[i].trx_before_cashback, "Cashback": data[i].cashback, "Transaksi setelah Cashback": data[i].trx_after_cashback, "Biaya Tambahan": data[i].biaya_tambahan, "Pendapatan Merchant": data[i].pendapatan_merchant, "Biaya Admin": data[i].tqrissettl_admin_fee, "Biaya Sameday": data[i].sameday, "Nominal Settlement": data[i].nominal_settlement, "Status": data[i].mstatus_name })
                                } else if (user_role === "107") {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Settlement atas Tanggal": data[i].tqrissettl_crtdt, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Nama Brand": data[i].BrandName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi QRIS": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_wechatpay + data[i].tqrissettl_trx_amount_alipay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_wechatpay + data[i].tqrissettl_total_mdr_alipay), "Transaksi sebelum Cashback": data[i].trx_before_cashback, "Cashback": data[i].cashback, "Transaksi setelah Cashback": data[i].trx_after_cashback, "Biaya Tambahan": data[i].biaya_tambahan, "Pendapatan Merchant": data[i].pendapatan_merchant, "Biaya Admin": data[i].tqrissettl_admin_fee, "Biaya Sameday": data[i].sameday, "Nominal Settlement": data[i].nominal_settlement, "Status": data[i].mstatus_name })
                                } else {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Settlement atas Tanggal": data[i].tqrissettl_crtdt, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Nama Brand": data[i].BrandName, "Nama Outlet": data[i].StoreName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi QRIS": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_wechatpay + data[i].tqrissettl_trx_amount_alipay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_wechatpay + data[i].tqrissettl_total_mdr_alipay), "Transaksi sebelum Cashback": data[i].trx_before_cashback, "Cashback": data[i].cashback, "Transaksi setelah Cashback": data[i].trx_after_cashback, "Biaya Tambahan": data[i].biaya_tambahan, "Pendapatan Merchant": data[i].pendapatan_merchant, "Biaya Admin": data[i].tqrissettl_admin_fee, "Biaya Sameday": data[i].sameday, "Nominal Settlement": data[i].nominal_settlement, "Status": data[i].mstatus_name })
                                }
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        } else if (dataExportSettlementQris.status === 200 && dataExportSettlementQris.data.response_code === 200 && dataExportSettlementQris.data.response_new_token !== null) {
                            setUserSession(dataExportSettlementQris.data.response_new_token)
                            const data = dataExportSettlementQris.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                if (user_role === "106") {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Settlement atas Tanggal": data[i].tqrissettl_crtdt, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi QRIS": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_wechatpay + data[i].tqrissettl_trx_amount_alipay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_wechatpay + data[i].tqrissettl_total_mdr_alipay), "Transaksi sebelum Cashback": data[i].trx_before_cashback, "Cashback": data[i].cashback, "Transaksi setelah Cashback": data[i].trx_after_cashback, "Biaya Tambahan": data[i].biaya_tambahan, "Pendapatan Merchant": data[i].pendapatan_merchant, "Biaya Admin": data[i].tqrissettl_admin_fee, "Biaya Sameday": data[i].sameday, "Nominal Settlement": data[i].nominal_settlement, "Status": data[i].mstatus_name })
                                } else if (user_role === "107") {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Settlement atas Tanggal": data[i].tqrissettl_crtdt, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Nama Brand": data[i].BrandName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi QRIS": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_wechatpay + data[i].tqrissettl_trx_amount_alipay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_wechatpay + data[i].tqrissettl_total_mdr_alipay), "Transaksi sebelum Cashback": data[i].trx_before_cashback, "Cashback": data[i].cashback, "Transaksi setelah Cashback": data[i].trx_after_cashback, "Biaya Tambahan": data[i].biaya_tambahan, "Pendapatan Merchant": data[i].pendapatan_merchant, "Biaya Admin": data[i].tqrissettl_admin_fee, "Biaya Sameday": data[i].sameday, "Nominal Settlement": data[i].nominal_settlement, "Status": data[i].mstatus_name })
                                } else {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Settlement atas Tanggal": data[i].tqrissettl_crtdt, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Nama Brand": data[i].BrandName, "Nama Outlet": data[i].StoreName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi QRIS": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_wechatpay + data[i].tqrissettl_trx_amount_alipay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_wechatpay + data[i].tqrissettl_total_mdr_alipay), "Transaksi sebelum Cashback": data[i].trx_before_cashback, "Cashback": data[i].cashback, "Transaksi setelah Cashback": data[i].trx_after_cashback, "Biaya Tambahan": data[i].biaya_tambahan, "Pendapatan Merchant": data[i].pendapatan_merchant, "Biaya Admin": data[i].tqrissettl_admin_fee, "Biaya Sameday": data[i].sameday, "Nominal Settlement": data[i].nominal_settlement, "Status": data[i].mstatus_name })
                                }
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Transaksi QRIS.xlsx");
                        }
                    } catch (error) {
                        // console.log(error);
                        history.push(errorCatch(error.response.status))
                    }
                }
                dataExportSettlementQris()
            }
        } else {
            if (isFilter) {
                async function dataExportFilter(idSettle, dateId, periode, statusQris, channelPembayaran) {
                    try {
                        const auth = 'Bearer ' + getToken();
                        const dataParams = encryptData(`{"settle_code": "${idSettle}", "status" : "${statusQris.length !== 0 ? statusQris : "2,4,5,6,8"}", "payment_type_qris": "${Number(channelPembayaran) !== 0 ? channelPembayaran : "1,2,3"}", "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "merchant_nou": ${grupNou}, "brand_nou": ${brandNou}, "outlet_nou": ${outletNou}, "page": 1, "row_per_page": 1000000}`)
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                        const dataExportFilter = await axios.post(BaseURL + "/QRIS/QRISSettlementAutomaticPaging", {data: dataParams}, { headers: headers });
                        if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                            const data = dataExportFilter.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Tujuan Settlement": data[i].mqrissettlegroup_name, "Nama Grup": data[i].GroupName, "Nama Brand": data[i].BrandName, "Nama Outlet": data[i].StoreName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi Qris": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_alipay + data[i].tqrissettl_trx_amount_wechatpay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_alipay + data[i].tqrissettl_total_mdr_wechatpay), "Biaya Admin": data[i].tqrissettl_admin_fee, "Nominal Transaksi": data[i].nominal_settlement, Status: data[i].mstatus_name })
                                // dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Waktu": data[i].tqrissettl_crtdt, "Tujuan Settlement": data[i].mqrissettlegroup_name, "Nama Grup": data[i].GroupName, "Nama Brand": data[i].BrandName, "Nama Outlet": data[i].StoreName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi": data[i].tqrissettl_trx_count, "Total Nominal": data[i].tqrissettl_trx_amount, "Total MDR": data[i].tqrissettl_total_mdr, "Biaya Admin": data[i].tqrissettl_admin_fee, "Nominal Transaksi": data[i].nominal_settlement, Status: data[i].mstatus_name })
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token !== null) {
                            setUserSession(dataExportFilter.data.response_new_token)
                            const data = dataExportFilter.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Tujuan Settlement": data[i].mqrissettlegroup_name, "Nama Grup": data[i].GroupName, "Nama Brand": data[i].BrandName, "Nama Outlet": data[i].StoreName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi Qris": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_alipay + data[i].tqrissettl_trx_amount_wechatpay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_alipay + data[i].tqrissettl_total_mdr_wechatpay), "Biaya Admin": data[i].tqrissettl_admin_fee, "Nominal Transaksi": data[i].nominal_settlement, Status: data[i].mstatus_name })
                                // dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Waktu": data[i].tqrissettl_crtdt, "Tujuan Settlement": data[i].mqrissettlegroup_name, "Nama Grup": data[i].GroupName, "Nama Brand": data[i].BrandName, "Nama Outlet": data[i].StoreName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi": data[i].tqrissettl_trx_count, "Total Nominal": data[i].tqrissettl_trx_amount, "Total MDR": data[i].tqrissettl_total_mdr, "Biaya Admin": data[i].tqrissettl_admin_fee, "Nominal Transaksi": data[i].nominal_settlement, Status: data[i].mstatus_name })
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        }
                    } catch (error) {
                        // console.log(error);
                        history.push(errorCatch(error.response.status))
                    }
                }
                dataExportFilter(idSettle, dateId, periode, statusQris, channelPembayaran)
            } else {
                async function dataExportSettlementQris() {
                    try {
                        const auth = 'Bearer ' + getToken();
                        const dataParams = encryptData(`{"settle_code": "", "status" : "2,4,5,6,8", "payment_type_qris": "1,2,3", "period": 2, "date_from": "", "date_to": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0, "page": 1, "row_per_page": 1000000}`)
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                        const dataExportSettlementQris = await axios.post(BaseURL + "/QRIS/QRISSettlementAutomaticPaging", {data: dataParams}, { headers: headers });
                        if (dataExportSettlementQris.status === 200 && dataExportSettlementQris.data.response_code === 200 && dataExportSettlementQris.data.response_new_token === null) {
                            const data = dataExportSettlementQris.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Tujuan Settlement": data[i].mqrissettlegroup_name, "Nama Grup": data[i].GroupName, "Nama Brand": data[i].BrandName, "Nama Outlet": data[i].StoreName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi Qris": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_alipay + data[i].tqrissettl_trx_amount_wechatpay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_alipay + data[i].tqrissettl_total_mdr_wechatpay), "Biaya Admin": data[i].tqrissettl_admin_fee, "Nominal Transaksi": data[i].nominal_settlement, Status: data[i].mstatus_name })
                                // dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Waktu": data[i].tqrissettl_crtdt, "Tujuan Settlement": data[i].mqrissettlegroup_name, "Nama Grup": data[i].GroupName, "Nama Brand": data[i].BrandName, "Nama Outlet": data[i].StoreName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi": data[i].tqrissettl_trx_count, "Total Nominal": data[i].tqrissettl_trx_amount, "Total MDR": data[i].tqrissettl_total_mdr, "Biaya Admin": data[i].tqrissettl_admin_fee, "Nominal Transaksi": data[i].nominal_settlement, Status: data[i].mstatus_name })
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        } else if (dataExportSettlementQris.status === 200 && dataExportSettlementQris.data.response_code === 200 && dataExportSettlementQris.data.response_new_token !== null) {
                            setUserSession(dataExportSettlementQris.data.response_new_token)
                            const data = dataExportSettlementQris.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Waktu Settlement": data[i].tqrissettl_crtdt, "Channel Pembayaran": data[i].mpaytypeqris_name, "Tujuan Settlement": data[i].mqrissettlegroup_name, "Nama Grup": data[i].GroupName, "Nama Brand": data[i].BrandName, "Nama Outlet": data[i].StoreName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi WeChat Pay": data[i].tqrissettl_trx_count_wechatpay, "Jumlah Transaksi Alipay": data[i].tqrissettl_trx_count_alipay, "Jumlah Transaksi Qris": data[i].tqrissettl_trx_count, "Total Transaksi WeChat Pay": data[i].tqrissettl_trx_amount_wechatpay, "Total Transaksi Alipay": data[i].tqrissettl_trx_amount_alipay, "Total Transaksi QRIS": data[i].tqrissettl_trx_amount, "Total Transaksi Keseluruhan": (data[i].tqrissettl_trx_amount + data[i].tqrissettl_trx_amount_alipay + data[i].tqrissettl_trx_amount_wechatpay), "MDR WeChat Pay": data[i].tqrissettl_total_mdr_wechatpay, "MDR Alipay": data[i].tqrissettl_total_mdr_alipay, "MDR QRIS": data[i].tqrissettl_total_mdr, "Total MDR": (data[i].tqrissettl_total_mdr + data[i].tqrissettl_total_mdr_alipay + data[i].tqrissettl_total_mdr_wechatpay), "Biaya Admin": data[i].tqrissettl_admin_fee, "Nominal Transaksi": data[i].nominal_settlement, Status: data[i].mstatus_name })
                                // dataExcel.push({ No: i + 1, "ID Settlement": data[i].tqrissettl_code, "Waktu": data[i].tqrissettl_crtdt, "Tujuan Settlement": data[i].mqrissettlegroup_name, "Nama Grup": data[i].GroupName, "Nama Brand": data[i].BrandName, "Nama Outlet": data[i].StoreName, "Bank Tujuan": data[i].mbank_name, "Nomor Rekening": data[i].tqrissettl_bank_acc_num_to, "Nama Pemilik Rekening": data[i].tqrissettl_bank_acc_name_to, "Jumlah Transaksi": data[i].tqrissettl_trx_count, "Total Nominal": data[i].tqrissettl_trx_amount, "Total MDR": data[i].tqrissettl_total_mdr, "Biaya Admin": data[i].tqrissettl_admin_fee, "Nominal Transaksi": data[i].nominal_settlement, Status: data[i].mstatus_name })
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Transaksi QRIS.xlsx");
                        }
                    } catch (error) {
                        // console.log(error);
                        history.push(errorCatch(error.response.status))
                    }
                }
                dataExportSettlementQris()
            }
        }
    }

    function ExportReportDetailsSettlementQrisOtomatisHandler(role, isFilter, idSettle, dateId, periode, statusQris, grupNou, brandNou, outletNou, channelPembayaran) {
        if (role === "106" || role === "107" || role === "108" || role === "102" || role === "104") {
            if (isFilter) {
                async function dataExportFilter(idSettle, dateId, periode, statusQris, channelPembayaran) {
                    try {
                        const auth = 'Bearer ' + getToken();
                        const dataParams = encryptData(`{"settle_code": "${idSettle}", "status" : "${statusQris.length !== 0 ? statusQris : "2,4,5,6,8"}", "payment_type_qris": "${Number(channelPembayaran) !== 0 ? channelPembayaran : "1,2,3"}", "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "merchant_nou": ${grupNou}, "brand_nou": ${brandNou}, "outlet_nou": ${outletNou}}`)
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                        const dataExportFilter = await axios.post(BaseURL + "/QRIS/QRISSettleAutomaticExportDetail", {data: dataParams}, { headers: headers });
                        if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                            const data = dataExportFilter.data.response_data.results.list
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                if (user_role === "106") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 101) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    } else if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Nama Brand": data[i].settl_brand_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Nama Brand": data[i].settl_brand_name, "Nama Outlet": data[i].settl_store_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    }
                                } else if (user_role === "107") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Nama Outlet": data[i].settl_store_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    }
                                } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                }
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token !== null) {
                            setUserSession(dataExportFilter.data.response_new_token)
                            const data = dataExportFilter.data.response_data.results.list
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                if (user_role === "106") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 101) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    } else if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Nama Brand": data[i].settl_brand_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Nama Brand": data[i].settl_brand_name, "Nama Outlet": data[i].settl_store_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    }
                                } else if (user_role === "107") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Nama Outlet": data[i].settl_store_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    }
                                } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                }
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        }
                    } catch (error) {
                        // console.log(error);
                        history.push(errorCatch(error.response.status))
                    }
                }
                dataExportFilter(idSettle, dateId, periode, statusQris, channelPembayaran)
            } else {
                async function dataExportSettlementQris() {
                    try {
                        const auth = 'Bearer ' + getToken();
                        const dataParams = encryptData(`{"settle_code": "", "status" : "2,4,5,6,8", "payment_type_qris": "1,2,3", "period": 2, "date_from": "", "date_to": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0}`)
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                        const dataExportSettlementQris = await axios.post(BaseURL + "/QRIS/QRISSettleAutomaticExportDetail", {data: dataParams}, { headers: headers });
                        if (dataExportSettlementQris.status === 200 && dataExportSettlementQris.data.response_code === 200 && dataExportSettlementQris.data.response_new_token === null) {
                            const data = dataExportSettlementQris.data.response_data.results.list
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                if (user_role === "106") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 101) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    } else if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Nama Brand": data[i].settl_brand_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Nama Brand": data[i].settl_brand_name, "Nama Outlet": data[i].settl_store_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    }
                                } else if (user_role === "107") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Nama Outlet": data[i].settl_store_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    }
                                } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                }
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        } else if (dataExportSettlementQris.status === 200 && dataExportSettlementQris.data.response_code === 200 && dataExportSettlementQris.data.response_new_token !== null) {
                            setUserSession(dataExportSettlementQris.data.response_new_token)
                            const data = dataExportSettlementQris.data.response_data.results.list
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                if (user_role === "106") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 101) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    } else if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Nama Brand": data[i].settl_brand_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Nama Brand": data[i].settl_brand_name, "Nama Outlet": data[i].settl_store_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    }
                                } else if (user_role === "107") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Nama Outlet": data[i].settl_store_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                    }
                                } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                                }
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Transaksi QRIS.xlsx");
                        }
                    } catch (error) {
                        // console.log(error);
                        history.push(errorCatch(error.response.status))
                    }
                }
                dataExportSettlementQris()
            }
        } else {
            if (isFilter) {
                async function dataExportFilter(idSettle, dateId, periode, statusQris, grupNou, brandNou, outletNou, channelPembayaran) {
                    try {
                        const auth = 'Bearer ' + getToken();
                        const dataParams = encryptData(`{ "settle_code": "${idSettle}", "status": "${statusQris.length !== 0 ? statusQris : "2,4,5,6,8"}", "payment_type_qris": "${Number(channelPembayaran) !== 0 ? channelPembayaran : "1,2,3"}", "period": ${dateId}, "date_from": "${(periode.length !== 0) ? periode[0] : ""}", "date_to": "${(periode.length !== 0) ? periode[1] : ""}", "merchant_nou": ${grupNou}, "brand_nou": ${brandNou}, "outlet_nou": ${outletNou} }`)
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                        const dataExportFilter = await axios.post(BaseURL + "/QRIS/QRISSettleAutomaticExportDetail", {data: dataParams}, { headers: headers });
                        if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                            const data = dataExportFilter.data.response_data.results.list
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Channel Pembayaran": data[i].settl_payment_type_name, "Tujuan Settlement": data[i].settl_group_type, "Nama Grup": data[i].settl_group_name, "Nama Brand": data[i].settl_brand_name, "Nama Outlet": data[i].settl_store_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Details Settlement QRIS.xlsx");
                        } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token !== null) {
                            setUserSession(dataExportFilter.data.response_new_token)
                            const data = dataExportFilter.data.response_data.results.list
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Channel Pembayaran": data[i].settl_payment_type_name, "Tujuan Settlement": data[i].settl_group_type, "Nama Grup": data[i].settl_group_name, "Nama Brand": data[i].settl_brand_name, "Nama Outlet": data[i].settl_store_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Details Settlement QRIS.xlsx");
                        }
                    } catch (error) {
                        // console.log(error);
                        history.push(errorCatch(error.response.status))
                    }
                }
                dataExportFilter(idSettle, dateId, periode, statusQris, grupNou, brandNou, outletNou, channelPembayaran)
            } else {
                async function dataExportSettlementQris() {
                    try {
                        const auth = 'Bearer ' + getToken();
                        const dataParams = encryptData(`{"settle_code": "", "status" : "2,4,5,6,8", "payment_type_qris": "1,2,3", "period": 2, "date_from": "", "date_to": "", "merchant_nou": 0, "brand_nou": 0, "outlet_nou": 0}`)
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                        const dataExportSettlementQris = await axios.post(BaseURL + "/QRIS/QRISSettleAutomaticExportDetail", {data: dataParams}, { headers: headers });
                        if (dataExportSettlementQris.status === 200 && dataExportSettlementQris.data.response_code === 200 && dataExportSettlementQris.data.response_new_token === null) {
                            const data = dataExportSettlementQris.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Channel Pembayaran": data[i].settl_payment_type_name, "Tujuan Settlement": data[i].settl_group_type, "Nama Grup": data[i].settl_group_name, "Nama Brand": data[i].settl_brand_name, "Nama Outlet": data[i].settl_store_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Details Settlement QRIS.xlsx");
                        } else if (dataExportSettlementQris.status === 200 && dataExportSettlementQris.data.response_code === 200 && dataExportSettlementQris.data.response_new_token !== null) {
                            setUserSession(dataExportSettlementQris.data.response_new_token)
                            const data = dataExportSettlementQris.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Settlement": data[i].settl_code, "Waktu Settlement": data[i].settl_crtdt, "Channel Pembayaran": data[i].settl_payment_type_name, "Tujuan Settlement": data[i].settl_group_type, "Nama Grup": data[i].settl_group_name, "Nama Brand": data[i].settl_brand_name, "Nama Outlet": data[i].settl_store_name, "Bank Tujuan": data[i].settl_bank_name, "Nomor Rekening": data[i].settl_acc_num_to, "Nama Pemilik Rekening": data[i].settl_acc_name_to, "Jumlah Transaksi": data[i].settl_trx_count, "Total Nominal": data[i].settl_trx_amount, "Total MDR": data[i].settl_total_mdr, "Biaya Admin": data[i].settl_admin_fee, "Nominal Settlement": data[i].settl_total_settle, "Status Settlement": data[i].settl_status_name, "ID Transaksi": data[i].trx_code, "RRN": data[i].trx_partner_trans_id, "Waktu Transaksi": data[i].trx_trx_date, "Nominal Transaksi": data[i].trx_amount, "Potongan MDR": data[i].trx_mdr, "Pendapatan": data[i].trx_fee, "Status Transaksi": data[i].trx_status })
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Details Settlement QRIS.xlsx");
                        }
                    } catch (error) {
                        // console.log(error);
                        history.push(errorCatch(error.response.status))
                    }
                }
                dataExportSettlementQris()
            }
        }
    }

    function ExportReportSettlementQrisManualHandler(role, isFilter, settlementCode, groupId, brandId, outletId, statusId, periode, dateRange, partnerId) {
        if (role === "106" || role === "107" || role === "108") {
            if (isFilter) {
                async function dataExportFilter(settlementCode, brandId, outletId, statusId, periode, dateRange, partnerId) {
                    try {
                        const auth = 'Bearer ' + getToken();
                        const dataParams = encryptData(`{"settlementCode": "${settlementCode}", "groupID" : ${partnerId}, "brandID" : ${brandId}, "outletID" : ${outletId}, "statusid" : "${statusId.length !== 0 ? statusId : "2,4,5,6,8"}", "date_from": "${(periode.length !== 0) ? (periode === "7" ? dateRange[0] : periode[0]) : ""}", "date_to": "${(periode.length !== 0) ? periode === "7" ? dateRange[1] : periode[1] : ""}", "page": 1, "row_per_page": 1000000}`)
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                        const dataExportFilter = await axios.post(BaseURL + "/QRIS/ManualSettleQRIS", {data: dataParams}, { headers: headers });
                        if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                            const data = dataExportFilter.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                if (user_role === "106") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 101) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    } else if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Nama Brand": data[i].nama_brand, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Nama Brand": data[i].nama_brand, "Nama Outlet": data[i].nama_outlet, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    }
                                } else if (user_role === "107") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Nama Outlet": data[i].nama_outlet, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    }
                                } else {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                }
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token !== null) {
                            setUserSession(dataExportFilter.data.response_new_token)
                            const data = dataExportFilter.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                if (user_role === "106") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 101) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    } else if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Nama Brand": data[i].nama_brand, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Nama Brand": data[i].nama_brand, "Nama Outlet": data[i].nama_outlet, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    }
                                } else if (user_role === "107") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Nama Outlet": data[i].nama_outlet, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    }
                                } else {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                }
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        }
                    } catch (error) {
                        // console.log(error);
                        history.push(errorCatch(error.response.status))
                    }
                }
                dataExportFilter(settlementCode, brandId, outletId, statusId, periode, dateRange, partnerId)
            } else {
                async function dataExportSettlementQris(partnerId) {
                    try {
                        const auth = 'Bearer ' + getToken();
                        const dataParams = encryptData(`{"settlementCode": "", "groupID" : ${partnerId}, "brandID" : 0, "outletID" : 0, "statusid" : "2,4,5,6,8", "date_from": "${currentDate}", "date_to": "${currentDate}", "page": 1, "row_per_page": 1000000}`)
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                        const dataExportSettlementQris = await axios.post(BaseURL + "/QRIS/ManualSettleQRIS", {data: dataParams}, { headers: headers });
                        if (dataExportSettlementQris.status === 200 && dataExportSettlementQris.data.response_code === 200 && dataExportSettlementQris.data.response_new_token === null) {
                            const data = dataExportSettlementQris.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                if (user_role === "106") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 101) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    } else if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Nama Brand": data[i].nama_brand, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Nama Brand": data[i].nama_brand, "Nama Outlet": data[i].nama_outlet, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    }
                                } else if (user_role === "107") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Nama Outlet": data[i].nama_outlet, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    }
                                } else {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                }
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        } else if (dataExportSettlementQris.status === 200 && dataExportSettlementQris.data.response_code === 200 && dataExportSettlementQris.data.response_new_token !== null) {
                            setUserSession(dataExportSettlementQris.data.response_new_token)
                            const data = dataExportSettlementQris.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                if (user_role === "106") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 101) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    } else if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Nama Brand": data[i].nama_brand, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Nama Brand": data[i].nama_brand, "Nama Outlet": data[i].nama_outlet, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    }
                                } else if (user_role === "107") {
                                    if (settleType[0]?.mqrismerchant_settle_group === 102) {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    } else {
                                        dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Nama Outlet": data[i].nama_outlet, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                    }
                                } else {
                                    dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                                }
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Transaksi QRIS.xlsx");
                        }
                    } catch (error) {
                        // console.log(error);
                        history.push(errorCatch(error.response.status))
                    }
                }
                dataExportSettlementQris(partnerId)
            }
        } else if (role !== "102" && role !== "104") {
            if (isFilter) {
                async function dataExportFilter(settlementCode, groupId, brandId, outletId, statusId, periode, dateRange) {
                    try {
                        const auth = 'Bearer ' + getToken();
                        const dataParams = encryptData(`{"settlementCode": "${settlementCode}", "groupID" : ${groupId}, "brandID" : ${brandId}, "outletID" : ${outletId}, "statusid" : "${statusId.length !== 0 ? statusId : "2,4,5,6,8"}", "date_from": "${(periode.length !== 0) ? (periode === "7" ? dateRange[0] : periode[0]) : ""}", "date_to": "${(periode.length !== 0) ? periode === "7" ? dateRange[1] : periode[1] : ""}", "page": 1, "row_per_page": 1000000}`)
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                        const dataExportFilter = await axios.post(BaseURL + "/QRIS/ManualSettleQRIS", {data: dataParams}, { headers: headers });
                        if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token === null) {
                            const data = dataExportFilter.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Jenis Merchant": data[i].jenis_merchant, "Tujuan Settlement": data[i].tujuan_settle, "Nama Grup": data[i].nama_grup, "Nama Brand": data[i].nama_brand, "Nama Outlet": data[i].nama_outlet, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        } else if (dataExportFilter.status === 200 && dataExportFilter.data.response_code === 200 && dataExportFilter.data.response_new_token !== null) {
                            setUserSession(dataExportFilter.data.response_new_token)
                            const data = dataExportFilter.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Jenis Merchant": data[i].jenis_merchant, "Tujuan Settlement": data[i].tujuan_settle, "Nama Grup": data[i].nama_grup, "Nama Brand": data[i].nama_brand, "Nama Outlet": data[i].nama_outlet, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        }
                    } catch (error) {
                        // console.log(error);
                        history.push(errorCatch(error.response.status))
                    }
                }
                dataExportFilter(settlementCode, groupId, brandId, outletId, statusId, periode, dateRange)
            } else {
                async function dataExportSettlementQris() {
                    try {
                        const auth = 'Bearer ' + getToken();
                        const dataParams = encryptData(`{"settlementCode": "", "groupID" : 0, "brandID" : 0, "outletID" : 0, "statusid" : "2,4,5,6,8", "date_from": "${currentDate}", "date_to": "${currentDate}", "page": 1, "row_per_page": 1000000}`)
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': auth
                        }
                        const dataExportSettlementQris = await axios.post(BaseURL + "/QRIS/ManualSettleQRIS", {data: dataParams}, { headers: headers });
                        if (dataExportSettlementQris.status === 200 && dataExportSettlementQris.data.response_code === 200 && dataExportSettlementQris.data.response_new_token === null) {
                            const data = dataExportSettlementQris.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Jenis Merchant": data[i].jenis_merchant, "Tujuan Settlement": data[i].tujuan_settle, "Nama Grup": data[i].nama_grup, "Nama Brand": data[i].nama_brand, "Nama Outlet": data[i].nama_outlet, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Settlement QRIS.xlsx");
                        } else if (dataExportSettlementQris.status === 200 && dataExportSettlementQris.data.response_code === 200 && dataExportSettlementQris.data.response_new_token !== null) {
                            setUserSession(dataExportSettlementQris.data.response_new_token)
                            const data = dataExportSettlementQris.data.response_data.results
                            let dataExcel = []
                            for (let i = 0; i < data.length; i++) {
                                dataExcel.push({ No: i + 1, "ID Settlement": data[i].ID, "Waktu Pengajuan": data[i].waktu_pengajuan, "Waktu Diterima": data[i].waktu_diterima, "Jenis Merchant": data[i].jenis_merchant, "Tujuan Settlement": data[i].tujuan_settle, "Nama Grup": data[i].nama_grup, "Nama Brand": data[i].nama_brand, "Nama Outlet": data[i].nama_outlet, "Bank Tujuan": data[i].bank_tujuan, "Nomor Rekening": data[i].norek_penerima, "Nama Pemilik Rekening": data[i].nama_penerima, "Total Nominal": data[i].amount, "Biaya Admin": data[i].biaya_admin, "Nominal Settlement": data[i].total_settle, Status: data[i].status })
                            }
                            let workSheet = XLSX.utils.json_to_sheet(dataExcel);
                            let workBook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
                            XLSX.writeFile(workBook, "Riwayat Transaksi QRIS.xlsx");
                        }
                    } catch (error) {
                        // console.log(error);
                        history.push(errorCatch(error.response.status))
                    }
                }
                dataExportSettlementQris()
            }
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
        if (user_role !== "102" || user_role !== "104" || user_role !== "106" || user_role !== "107" || user_role !== "108") {
            getGrupInQrisTransactionHandler()
        }
    }, [access_token])

    return (
        <div className='main-content mt-5' style={{ padding: "37px 27px 37px 27px" }}>
            <span className='breadcrumbs-span'>Settlement &nbsp; <img alt="" src={breadcrumbsIcon} />  &nbsp;QRIS</span>
            <div className="head-title">
                <h2 className="h4 mt-4" style={{ fontFamily: "Exo", fontSize: 18, fontWeight: 700 }}>Settlement QRIS</h2>
            </div>
            {
                (user_role === "106" || user_role === "107" || user_role === "108" || user_role === "102" || user_role === "104") ? (
                    <>
                        {
                            settleType[0]?.mqrismerchant_settle_type === 102 ? (
                                <>
                                    <div className='base-content mt-3'>
                                        <span className='mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Ajukan Settlement QRIS</span>
                                        <div className='mt-3'>Tujuan settlement : <span style={{ fontWeight: 700, fontFamily: "Nunito", fontSize: 14, color: "#383838" }}>{settleType[0]?.mqrismerchant_settle_group === 101 ? `Group` : settleType[0]?.mqrismerchant_settle_group === 102 ? `Brand` : `Outlet`}</span> </div>
                                        {
                                            user_role === "106" && (
                                                (settleType[0]?.mqrismerchant_settle_group === 102 || settleType[0]?.mqrismerchant_settle_group === 103) && (
                                                    <Row className='align-items-center'>
                                                        <Col xs={2} className='mt-3'>
                                                            <div>Brand</div>
                                                        </Col>
                                                        <Col xs={10} className='mt-3'>
                                                            <div className="dropdown dropPartnerAddUser">
                                                                <ReactSelect
                                                                    closeMenuOnSelect={true}
                                                                    hideSelectedOptions={false}
                                                                    options={dataBrandInQrisManualMerchant}
                                                                    value={selectedBrandNameQrisManualMerchant}
                                                                    onChange={(selected) => handleChangeBrandQrisManualMerchant(selected)}
                                                                    placeholder="Pilih Brand"
                                                                    components={{ Option }}
                                                                    styles={customStylesSelectedOption}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                )
                                            )
                                        }
                                        {
                                            (user_role === "106" || user_role === "107") && (
                                                settleType[0]?.mqrismerchant_settle_group === 103 && (
                                                    <Row className='align-items-center'>
                                                        <Col xs={2} className='mt-3'>
                                                            <div>Outlet</div>
                                                        </Col>
                                                        <Col xs={10} className='mt-3'>
                                                            <div className="dropdown dropPartnerAddUser">
                                                                <ReactSelect
                                                                    closeMenuOnSelect={true}
                                                                    hideSelectedOptions={false}
                                                                    options={dataOutletInQrisManualMerchant}
                                                                    value={selectedOutletNameQrisManualMerchant}
                                                                    onChange={(selected) => handleChangeOutletQrisManualMerchant(selected)}
                                                                    placeholder="Pilih Outlet"
                                                                    components={{ Option }}
                                                                    styles={customStylesSelectedOption}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                )
                                            )
                                        }
                                        <div className="card-information base-content-qris mt-3">
                                            <p style={{ color: "#383838", fontSize: 12 }}>Jumlah saldo</p>
                                            <p className="p-amount" style={{ fontFamily: "Exo" }}>{convertToRupiah(Object.keys(dataAccBankManualQrisSettleMerchant).length === 0 ? 0 : dataAccBankManualQrisSettleMerchant.balance, true, 0)}</p>
                                            <p className="mt-2"  style={{ fontFamily: "Nunito", fontSize: 10, color: "#888888" }}>{user_role === "106" ? (settleType[0]?.mqrismerchant_settle_group === 101 ? "Total keseluruhan saldo semua brand dan outlet" : settleType[0]?.mqrismerchant_settle_group === 102 ? "Total keseluruhan saldo semua outlet" : "Total keseluruhan saldo outlet yang dipilih") : user_role === "107" ? (settleType[0]?.mqrismerchant_settle_group === 102 ? "Total keseluruhan saldo semua outlet" : "Total keseluruhan saldo outlet yang dipilih") : ""}</p>
                                        </div>
                                        <Row className='align-items-center'>
                                            <Col xs={2} className='mt-4' >
                                                <div>Rekening Tujuan</div>
                                            </Col>
                                            <Col xs={10} className='mt-4'>
                                                <div className='input-text-user' style={{ padding: "10px", fontSize: 13 }}>{Object.keys(dataAccBankManualQrisSettleMerchant).length === 0 ? "Pilih rekening tujuan" : (dataAccBankManualQrisSettleMerchant.acc_name === null ? "Pilih rekening tujuan" : `${dataAccBankManualQrisSettleMerchant.acc_name} - ${dataAccBankManualQrisSettleMerchant.acc_num}  (${dataAccBankManualQrisSettleMerchant.bank_name})`)}</div>
                                            </Col>
                                            <Col xs={2} className='mt-3'>
                                                <div>Nominal Pengajuan</div>
                                            </Col>
                                            <Col xs={10} style={{ color: "000000" }} className='d-flex justify-content-between align-items-center mt-3 position-relative'>
                                                <div className='position-absolute ms-2' style={{ fontSize: 14, color: "#888888", fontFamily: "Nunito" }}>Rp</div>
                                                <CurrencyInput
                                                    className="input-nominal-qris-settlement text-end"
                                                    value={nominalPengajuan}
                                                    onValueChange={(e) => handleChangeNominal(e, dataAccBankManualQrisSettleMerchant)}
                                                    groupSeparator={"."}
                                                    decimalSeparator={','}
                                                    placeholder='0'
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", ".", ","].includes(evt.key) && evt.preventDefault()}
                                                />
                                            </Col>
                                            <Col xs={12} className='d-flex justify-content-between align-items-center mt-3'>
                                                <div>Biaya settlement</div>
                                                <div className='biaya-settlement-qris'>{convertToRupiah(Object.keys(dataAccBankManualQrisSettleMerchant).length === 0 ? 0 : dataAccBankManualQrisSettleMerchant.biaya_admin, true, 0)}</div>
                                            </Col>
                                            <Col xs={12} className='d-flex justify-content-between align-items-center mt-3'>
                                                <div>Uang yang diterima</div>
                                                <div className='saldo-dan-total-settlement'>{convertToRupiah(nominalPengajuan === undefined || nominalPengajuan.length === 0 ? 0 : (totalSettlement > dataAccBankManualQrisSettleMerchant.balance ? 0 : (totalSettlement) < 0 ? 0 : (totalSettlement)), true, 0)}</div>
                                            </Col>
                                            <Col xs={12} className='d-flex justify-content-between align-items-center mt-3'>
                                                <div>Sisa saldo</div>
                                                <div className='saldo-dan-total-settlement'>{Object.keys(dataAccBankManualQrisSettleMerchant).length === 0 ? "Rp 0" : convertToRupiah(((nominalPengajuan !== undefined && nominalPengajuan.length !== 0) ? ((dataAccBankManualQrisSettleMerchant.balance - dataAccBankManualQrisSettleMerchant.biaya_admin - (totalSettlement)) < 0 ? 0 : (dataAccBankManualQrisSettleMerchant.balance - dataAccBankManualQrisSettleMerchant.biaya_admin - (totalSettlement))) : dataAccBankManualQrisSettleMerchant.balance), true, 0)}</div>
                                            </Col>
                                        </Row>
                                        <Row className='mt-4 pb-4'>
                                            <Col xs={5}>
                                                <Row>
                                                    <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                        <button
                                                            className={(nominalPengajuan !== undefined && nominalPengajuan.length !== 0 && Number(nominalPengajuan) !== 0 && Number(nominalPengajuan) >= 50000 && dataAccBankManualQrisSettleMerchant.balance - dataAccBankManualQrisSettleMerchant.biaya_admin - (totalSettlement) >= 0 && Object.keys(dataAccBankManualQrisSettleMerchant).length !== 0 ) ? 'btn-ez-on' : 'btn-ez'}
                                                            disabled={nominalPengajuan === undefined || nominalPengajuan.length === 0 || Number(nominalPengajuan) === 0 || Number(nominalPengajuan) < 50000 || dataAccBankManualQrisSettleMerchant.balance - dataAccBankManualQrisSettleMerchant.biaya_admin - (totalSettlement) < 0 || Object.keys(dataAccBankManualQrisSettleMerchant).length === 0}
                                                            onClick={() => submitSettleManual()}
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
                                                <input name="idSettlement" value={inputHandleSettlementQrisManualMerchant.idSettlement} onChange={(e) => handleChangeSettleQrisManualMerchant(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Settlement'/>
                                            </Col>
                                            <Col xs={4} className="d-flex justify-content-between align-items-center">
                                                <span>Periode <span style={{ color: "red" }}>*</span></span>
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
                                                    <option defaultChecked disabled value={""}>Pilih Status</option>
                                                    <option value={5}>Diminta</option>
                                                    <option value={2}>Berhasil</option>
                                                    <option value={8}>Ditransfer</option>
                                                    <option value={4}>Gagal</option>
                                                    <option value={6}>Kadaluwarsa</option>
                                                </Form.Select>
                                            </Col>
                                            {
                                                user_role === "106" &&
                                                (settleType[0]?.mqrismerchant_settle_group === 102 || settleType[0]?.mqrismerchant_settle_group === 103) && (
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
                                                (user_role === "106" || user_role === "107") &&
                                                (settleType[0]?.mqrismerchant_settle_group === 103) && (
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
                                                            className={(inputHandleSettlementQrisManualMerchant.periode !== 0 || (dateRangeSettlementQrisManualMerchant.length !== 0 && inputHandleSettlementQrisManualMerchant.idSettlement.length !== 0) || (dateRangeSettlementQrisManualMerchant.length !== 0 && inputHandleSettlementQrisManualMerchant.statusQris.length !== 0) || (dateRangeSettlementQrisManualMerchant.length !== 0 && selectedBrandName[0].value !== undefined) || (dateRangeSettlementQrisManualMerchant.length !== 0 && selectedOutletName[0].value !== undefined)) ? 'btn-ez-on' : 'btn-ez'}
                                                            disabled={inputHandleSettlementQrisManualMerchant.periode === 0 || (inputHandleSettlementQrisManualMerchant.periode === 0 && inputHandleSettlementQrisManualMerchant.idSettlement.length === 0) || (inputHandleSettlementQrisManualMerchant.periode === 0 && inputHandleSettlementQrisManualMerchant.statusQris.length === 0) || (inputHandleSettlementQrisManualMerchant.periode === 0 && selectedBrandName[0].value === undefined) || (inputHandleSettlementQrisManualMerchant.periode === 0 && selectedOutletName[0].value === undefined)}
                                                            onClick={() => filterDataSettlementQrisManualHandler(inputHandleSettlementQrisManualMerchant.idSettlement, null, (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), inputHandleSettlementQrisManualMerchant.statusQris, inputHandleSettlementQrisManualMerchant.periode, dateRangeSettlementQrisManualMerchant, user_role, partnerId, 1, 10)}
                                                        >
                                                            Terapkan
                                                        </button>
                                                    </Col>
                                                    <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                        <button
                                                            className={(inputHandleSettlementQrisManualMerchant.periode !== 0 || dateRangeSettlementQrisManualMerchant.length !== 0 || inputHandleSettlementQrisManualMerchant.idSettlement.length !== 0 || inputHandleSettlementQrisManualMerchant.statusQris.length !== 0 || selectedBrandName.length !== 0 || selectedOutletName.length !== 0) ? 'btn-reset' : 'btn-ez-reset'}
                                                            disabled={inputHandleSettlementQrisManualMerchant.periode === 0 && dateRangeSettlementQrisManualMerchant.length === 0 && inputHandleSettlementQrisManualMerchant.idSettlement.length === 0 && inputHandleSettlementQrisManualMerchant.statusQris.length === 0 && selectedBrandName.length === 0 && selectedOutletName.length === 0}
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
                                            {
                                                dataSettlementQrisManualMerchant.length !== 0 && (
                                                <div>
                                                    {/* <Link onClick={() => ExportReportDetailsSettlementQrisOtomatisHandler(user_role, isFilterSettlementQrisManualMerchant, inputHandleSettlementQrisManualMerchant.idSettlement, inputHandleSettlementQrisManualMerchant.periode, dateRangeSettlementQrisManualMerchant, inputHandleSettlementQrisManualMerchant.statusQris, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0, selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0)} className="export-span">Export Details</Link> */}
                                                    <Link style={{ marginRight: 15 }} onClick={() => ExportReportSettlementQrisManualHandler(user_role, isFilterSettlementQrisManualMerchant, inputHandleSettlementQrisManualMerchant.idSettlement, (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0), (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), inputHandleSettlementQrisManualMerchant.statusQris, inputHandleSettlementQrisManualMerchant.periode, dateRangeSettlementQrisManualMerchant, partnerId)} className="export-span">Export Summary</Link>
                                                </div>
                                                )
                                            }
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
                                        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                            <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageSettlementQrisManualMerchant}</div>
                                            <Pagination
                                                activePage={activePageSettlementQrisManualMerchant}
                                                itemsCountPerPage={pageNumberSettlementQrisManualMerchant.row_per_page}
                                                totalItemsCount={(pageNumberSettlementQrisManualMerchant.row_per_page*pageNumberSettlementQrisManualMerchant.max_page)}
                                                pageRangeDisplayed={5}
                                                itemClass="page-item"
                                                linkClass="page-link"
                                                onChange={handlePageChangeSettlementQrisManualMerchant}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='base-content mt-3'>
                                    <Row className='mt-1'>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>ID Settlement</span>
                                            <input name="idSettlement" value={inputHandleSettlementQrisOtomatisMerchant.idSettlement} onChange={(e) => handleChangeSettleQrisOtomatisMerchant(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Settlement'/>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center">
                                            <span>Periode <span style={{ color: "red" }}>*</span></span>
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
                                                <option defaultChecked disabled value={""}>Pilih Status</option>
                                                <option value={5}>Diminta</option>
                                                <option value={2}>Berhasil</option>
                                                <option value={8}>Ditransfer</option>
                                                <option value={4}>Gagal</option>
                                                <option value={6}>Kadaluwarsa</option>
                                            </Form.Select>
                                        </Col>
                                        {
                                            user_role === "106" && (
                                                settleType[0]?.mqrismerchant_settle_group !== 101 ? (
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
                                                        disabled={inputHandleSettlementQrisOtomatisMerchant.periode === 0 || (inputHandleSettlementQrisOtomatisMerchant.periode === 0 && inputHandleSettlementQrisOtomatisMerchant.idSettlement.length === 0) || (inputHandleSettlementQrisOtomatisMerchant.periode === 0 && inputHandleSettlementQrisOtomatisMerchant.statusQris.length === 0)}
                                                        onClick={() => filterDataSettlementQrisOtomatisHandler(user_role, inputHandleSettlementQrisOtomatisMerchant.idSettlement, inputHandleSettlementQrisOtomatisMerchant.periode, dateRangeSettlementQrisOtomatisMerchant, inputHandleSettlementQrisOtomatisMerchant.statusQris, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0, selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0, activePageSettlementQrisOtomatisMerchant, 10, inputHandleSettlementQrisOtomatisMerchant.channelPembayaran)}
                                                    >
                                                        Terapkan
                                                    </button>
                                                </Col>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        className={(inputHandleSettlementQrisOtomatisMerchant.periode !== 0 || dateRangeSettlementQrisOtomatisMerchant.length !== 0 || (dateRangeSettlementQrisOtomatisMerchant.length !== 0 && inputHandleSettlementQrisOtomatisMerchant.idSettlement.length !== 0) || (dateRangeSettlementQrisOtomatisMerchant.length !== 0 && inputHandleSettlementQrisOtomatisMerchant.statusQris.length !== 0)) ? 'btn-reset' : 'btn-ez-reset'}
                                                        disabled={inputHandleSettlementQrisOtomatisMerchant.periode === 0 || (inputHandleSettlementQrisOtomatisMerchant.periode === 0 && inputHandleSettlementQrisOtomatisMerchant.idSettlement.length === 0) || (inputHandleSettlementQrisOtomatisMerchant.periode === 0 && inputHandleSettlementQrisOtomatisMerchant.statusQris.length === 0)}
                                                        onClick={() => resetButtonSettlementQrisOtomatis("merchant")}
                                                    >
                                                        Atur Ulang
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <div style={{ marginBottom: 10 }} className='mt-3 d-flex justify-content-between align-items-center'>
                                        <div style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600, color: "#383838" }}>Daftar pengajuan settlement</div>
                                        {
                                            dataSettlementQrisOtomatisMerchant.length !== 0 && (
                                            <div style={{ marginBottom: 30 }} className='mt-3'>
                                                {/* {
                                                    user_role !== "102" && user_role !== "104" &&
                                                    <Link onClick={() => ExportReportDetailsSettlementQrisOtomatisHandler(user_role, isFilterSettlementQrisOtomatisMerchant, inputHandleSettlementQrisOtomatisMerchant.idSettlement, inputHandleSettlementQrisOtomatisMerchant.periode, dateRangeSettlementQrisOtomatisMerchant, inputHandleSettlementQrisOtomatisMerchant.statusQris, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0, selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0, inputHandleSettlementQrisOtomatisMerchant.channelPembayaran)} className="export-span">Export Details</Link>
                                                } */}
                                                <Link style={{ marginRight: 15 }} onClick={() => ExportReportSettlementQrisOtomatisHandler(user_role, isFilterSettlementQrisOtomatisMerchant, inputHandleSettlementQrisOtomatisMerchant.idSettlement, inputHandleSettlementQrisOtomatisMerchant.periode, dateRangeSettlementQrisOtomatisMerchant, inputHandleSettlementQrisOtomatisMerchant.statusQris, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0, selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0, inputHandleSettlementQrisOtomatisMerchant.channelPembayaran)} className="export-span">Export</Link>
                                            </div>
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
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageSettlementQrisOtomatisMerchant}</div>
                                        <Pagination
                                            activePage={activePageSettlementQrisOtomatisMerchant}
                                            itemsCountPerPage={pageNumberSettlementQrisOtomatisMerchant.row_per_page}
                                            totalItemsCount={(pageNumberSettlementQrisOtomatisMerchant.row_per_page*pageNumberSettlementQrisOtomatisMerchant.max_page)}
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={handlePageChangeSettlementQrisOtomatisMerchant}
                                        />
                                    </div>
                                </div>
                            )
                        }

                    </>
                ) : (
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
                                    <Row className=''>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                            <span>ID Settlement</span>
                                            <input name="idSettlement" value={inputHandleSettlementQrisOtomatisAdmin.idSettlement} onChange={(e) => handleChangeSettleQrisOtomatisAdmin(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Settlement'/>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                            <span>Periode <span style={{ color: "red" }}>*</span></span>
                                            <Form.Select name="periode" value={inputHandleSettlementQrisOtomatisAdmin.periode} onChange={(e) => handleChangePeriodeSettlementQrisOtomatisAdmin(e)} className="input-text-riwayat ms-3">
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
                                            <span>Status</span>
                                            <Form.Select name="statusQris" value={inputHandleSettlementQrisOtomatisAdmin.statusQris} onChange={(e) => handleChangeSettleQrisOtomatisAdmin(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                                <option defaultChecked disabled value={""}>Pilih Status</option>
                                                <option value={5}>Diminta</option>
                                                <option value={2}>Berhasil</option>
                                                <option value={8}>Ditransfer</option>
                                                <option value={4}>Gagal</option>
                                                <option value={6}>Kadaluwarsa</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                            <span>Nama Grup</span>
                                            <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                                <ReactSelect
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={dataGrupInQris}
                                                    value={selectedGrupName}
                                                    onChange={(selected) => handleChangeGrupAdmin(selected)}
                                                    placeholder="Pilih Grup"
                                                    components={{ Option }}
                                                    styles={customStylesSelectedOption}
                                                    filterOption={customFilter}
                                                />
                                            </div>
                                        </Col>
                                        <Col xs={4} className='text-end mt-4' style={{ display: showDateSettlementQrisOtomatisAdmin }}>
                                            <DateRangePicker
                                                onChange={pickDateSettlementQrisOtomatisAdmin}
                                                value={stateSettlementQrisOtomatisAdmin}
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
                                                    value={selectedBrandName}
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
                                                    value={selectedOutletName}
                                                    onChange={(selected) => handleChangeOutletAdmin(selected)}
                                                    placeholder="Pilih Outlet"
                                                    components={{ Option }}
                                                    styles={customStylesSelectedOption}
                                                    filterOption={customFilter}
                                                />
                                            </div>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                            <span>Channel Pembayaran</span>
                                            <Form.Select name="channelPembayaran" value={inputHandleSettlementQrisOtomatisAdmin.channelPembayaran} onChange={(e) => handleChangeSettleQrisOtomatisAdmin(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                                <option defaultChecked disabled value={0}>Pilih Channel Pembayaran</option>
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
                                                        className={(inputHandleSettlementQrisOtomatisAdmin.periode !== 0 || dateRangeSettlementQrisOtomatisAdmin.length !== 0 || (dateRangeSettlementQrisOtomatisAdmin.length !== 0 && inputHandleSettlementQrisOtomatisAdmin.idSettlement.length !== 0) || (dateRangeSettlementQrisOtomatisAdmin.length !== 0 && inputHandleSettlementQrisOtomatisAdmin.statusQris.length !== 0)) ? 'btn-ez-on' : 'btn-ez'}
                                                        disabled={inputHandleSettlementQrisOtomatisAdmin.periode === 0 || (inputHandleSettlementQrisOtomatisAdmin.periode === 0 && inputHandleSettlementQrisOtomatisAdmin.idSettlement.length === 0) || (inputHandleSettlementQrisOtomatisAdmin.periode === 0 && inputHandleSettlementQrisOtomatisAdmin.statusQris.length === 0)}
                                                        onClick={() => filterDataSettlementQrisOtomatisHandler(user_role, inputHandleSettlementQrisOtomatisAdmin.idSettlement, inputHandleSettlementQrisOtomatisAdmin.periode, dateRangeSettlementQrisOtomatisAdmin, inputHandleSettlementQrisOtomatisAdmin.statusQris, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0, selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0, activePageSettlementQrisOtomatisAdmin, 10, inputHandleSettlementQrisOtomatisAdmin.channelPembayaran )}
                                                    >
                                                        Terapkan
                                                    </button>
                                                </Col>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        className={(inputHandleSettlementQrisOtomatisAdmin.periode !== 0 || dateRangeSettlementQrisOtomatisAdmin.length !== 0 || (dateRangeSettlementQrisOtomatisAdmin.length !== 0 && inputHandleSettlementQrisOtomatisAdmin.idSettlement.length !== 0) || (dateRangeSettlementQrisOtomatisAdmin.length !== 0 && inputHandleSettlementQrisOtomatisAdmin.statusQris.length !== 0)) ? 'btn-reset' : 'btn-ez-reset'}
                                                        disabled={inputHandleSettlementQrisOtomatisAdmin.periode === 0 || (inputHandleSettlementQrisOtomatisAdmin.periode === 0 && inputHandleSettlementQrisOtomatisAdmin.idSettlement.length === 0) || (inputHandleSettlementQrisOtomatisAdmin.periode === 0 && inputHandleSettlementQrisOtomatisAdmin.statusQris.length === 0)}
                                                        onClick={() => resetButtonSettlementQrisOtomatis("admin")}
                                                    >
                                                        Atur Ulang
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {
                                        dataSettlementQrisOtomatisAdmin.length !== 0 && (
                                            <div style={{ marginBottom: 30 }} className='mt-3'>
                                                <Link onClick={() => ExportReportDetailsSettlementQrisOtomatisHandler(user_role, isFilterSettlementQrisOtomatisAdmin, inputHandleSettlementQrisOtomatisAdmin.idSettlement, inputHandleSettlementQrisOtomatisAdmin.periode, dateRangeSettlementQrisOtomatisAdmin, inputHandleSettlementQrisOtomatisAdmin.statusQris, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0, selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0, inputHandleSettlementQrisOtomatisAdmin.channelPembayaran)} className="export-span">Export Details</Link>
                                                <Link style={{ marginRight: 15 }} onClick={() => ExportReportSettlementQrisOtomatisHandler(user_role, isFilterSettlementQrisOtomatisAdmin, inputHandleSettlementQrisOtomatisAdmin.idSettlement, inputHandleSettlementQrisOtomatisAdmin.periode, dateRangeSettlementQrisOtomatisAdmin, inputHandleSettlementQrisOtomatisAdmin.statusQris, selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0, selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0, selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0, inputHandleSettlementQrisOtomatisAdmin.channelPembayaran)} className="export-span">Export Summary</Link>
                                            </div>
                                        )
                                    }
                                    <div className="div-table mt-5 pb-4">
                                        <DataTable
                                            columns={columnsSettleOtomatisAdmin}
                                            data={dataSettlementQrisOtomatisAdmin}
                                            customStyles={customStylesSettlementQris}
                                            highlightOnHover
                                            progressPending={pendingSettlementQrisOtomatisAdmin}
                                            progressComponent={<CustomLoader />}
                                        />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageSettlementQrisOtomatisAdmin}</div>
                                        <Pagination
                                            activePage={activePageSettlementQrisOtomatisAdmin}
                                            itemsCountPerPage={pageNumberSettlementQrisOtomatisAdmin.row_per_page}
                                            totalItemsCount={(pageNumberSettlementQrisOtomatisAdmin.row_per_page*pageNumberSettlementQrisOtomatisAdmin.max_page)}
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={handlePageChangeSettlementQrisOtomatisAdmin}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className='base-content mb-4 pb-4'>
                                    <span className='font-weight-bold mb-4' style={{fontWeight: 600, fontFamily: "Exo", fontSize: 16}}>Filter</span>
                                    <Row className=''>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                            <span>ID Settlement</span>
                                            <input name="idSettlement" value={inputHandleSettlementQrisManualAdmin.idSettlement} onChange={(e) => handleChangeSettleQrisManualAdmin(e)} type='text'className='input-text-riwayat ms-3' placeholder='Masukkan ID Settlement'/>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                            <span>Periode <span style={{ color: "red" }}>*</span></span>
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
                                        <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                            <span>Status</span>
                                            <Form.Select name="statusQris" value={inputHandleSettlementQrisManualAdmin.statusQris} onChange={(e) => handleChangeSettleQrisManualAdmin(e)} className='input-text-riwayat ms-3' style={{ display: "inline" }}>
                                                <option defaultChecked disabled value={""}>Pilih Status</option>
                                                <option value={5}>Diminta</option>
                                                <option value={2}>Berhasil</option>
                                                <option value={8}>Ditransfer</option>
                                                <option value={4}>Gagal</option>
                                                <option value={6}>Kadaluwarsa</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                            <span>Nama Grup</span>
                                            <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                                <ReactSelect
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={dataGrupInQris}
                                                    value={selectedGrupName}
                                                    onChange={(selected) => handleChangeGrupAdmin(selected)}
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
                                        <Col xs={4} className="d-flex justify-content-between align-items-center mt-4">
                                            <span>Nama Brand</span>
                                            <div className="dropdown dropSaldoPartner" style={{ width: "11.7rem" }}>
                                                <ReactSelect
                                                    closeMenuOnSelect={true}
                                                    hideSelectedOptions={false}
                                                    options={dataBrandInQris}
                                                    value={selectedBrandName}
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
                                                    value={selectedOutletName}
                                                    onChange={(selected) => handleChangeOutletAdmin(selected)}
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
                                                        className={(inputHandleSettlementQrisManualAdmin.periode !== 0 || (dateRangeSettlementQrisManualAdmin.length !== 0 && inputHandleSettlementQrisManualAdmin.idSettlement.length !== 0) || (dateRangeSettlementQrisManualAdmin.length !== 0 && inputHandleSettlementQrisManualAdmin.statusQris.length !== 0) || (dateRangeSettlementQrisManualAdmin.length !== 0 && selectedGrupName[0].value !== undefined) || (dateRangeSettlementQrisManualAdmin.length !== 0 && selectedBrandName[0].value !== undefined) || (dateRangeSettlementQrisManualAdmin.length !== 0 && selectedOutletName[0].value !== undefined)) ? 'btn-ez-on' : 'btn-ez'}
                                                        disabled={inputHandleSettlementQrisManualAdmin.periode === 0 || (inputHandleSettlementQrisManualAdmin.periode === 0 && inputHandleSettlementQrisManualAdmin.idSettlement.length === 0) || (inputHandleSettlementQrisManualAdmin.periode === 0 && inputHandleSettlementQrisManualAdmin.statusQris.length === 0) || (inputHandleSettlementQrisManualAdmin.periode === 0 && selectedGrupName[0].value === undefined) || (inputHandleSettlementQrisManualAdmin.periode === 0 && selectedBrandName[0].value === undefined) || (inputHandleSettlementQrisManualAdmin.periode === 0 && selectedOutletName[0].value === undefined)}
                                                        onClick={() => filterDataSettlementQrisManualHandler(inputHandleSettlementQrisManualAdmin.idSettlement, (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0), (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), inputHandleSettlementQrisManualAdmin.statusQris, inputHandleSettlementQrisManualAdmin.periode, dateRangeSettlementQrisManualAdmin, user_role, partnerId, 1, 10)}
                                                    >
                                                        Terapkan
                                                    </button>
                                                </Col>
                                                <Col xs={6} style={{ width: "40%", padding: "0px 15px" }}>
                                                    <button
                                                        className={(inputHandleSettlementQrisManualAdmin.periode !== 0 || dateRangeSettlementQrisManualAdmin.length !== 0 || inputHandleSettlementQrisManualAdmin.idSettlement.length !== 0 || inputHandleSettlementQrisManualAdmin.statusQris.length !== 0 || selectedGrupName.length !== 0 || selectedBrandName.length !== 0 || selectedOutletName.length !== 0) ? 'btn-reset' : 'btn-ez-reset'}
                                                        disabled={inputHandleSettlementQrisManualAdmin.periode === 0 && dateRangeSettlementQrisManualAdmin.length === 0 && inputHandleSettlementQrisManualAdmin.idSettlement.length === 0 && inputHandleSettlementQrisManualAdmin.statusQris.length === 0 && selectedGrupName.length === 0 && selectedBrandName.length === 0 && selectedOutletName.length === 0}
                                                        onClick={() => resetButtonSettlementQrisManual("admin")}
                                                    >
                                                        Atur Ulang
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {
                                        dataSettlementQrisManualAdmin.length !== 0 && (
                                            <div style={{ marginBottom: 30 }} className='mt-3'>
                                                <Link onClick={() => ExportReportSettlementQrisManualHandler(user_role, isFilterSettlementQrisManualAdmin, inputHandleSettlementQrisManualAdmin.idSettlement, (selectedGrupName.length !== 0 ? selectedGrupName.map((item, idx) => item.value) : 0), (selectedBrandName.length !== 0 ? selectedBrandName.map((item, idx) => item.value) : 0), (selectedOutletName.length !== 0 ? selectedOutletName.map((item, idx) => item.value) : 0), inputHandleSettlementQrisManualAdmin.statusQris, inputHandleSettlementQrisManualAdmin.periode, dateRangeSettlementQrisManualAdmin, partnerId)} className="export-span">Export</Link>
                                            </div>
                                        )
                                    }
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
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageSettlementQrisManualAdmin}</div>
                                        <Pagination
                                            activePage={activePageSettlementQrisManualAdmin}
                                            itemsCountPerPage={pageNumberSettlementQrisManualAdmin.row_per_page}
                                            totalItemsCount={(pageNumberSettlementQrisManualAdmin.row_per_page*pageNumberSettlementQrisManualAdmin.max_page)}
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={handlePageChangeSettlementQrisManualAdmin}
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