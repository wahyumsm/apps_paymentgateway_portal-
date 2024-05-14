import React, { useEffect, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import filePdfQris from "../../../assets/icon/file_pdf_qris.svg";
import $ from 'jquery'
import { Col, FormControl, Image, OverlayTrigger, Row, Tooltip } from '@themesberg/react-bootstrap';
import alertIconYellow from '../../../assets/icon/note_icon_grey.svg'
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import loadingEzeelink from "../../../assets/img/technologies/Double Ring-1s-303px.svg"
import { BaseURL, errorCatch, getToken, setUserSession } from '../../../function/helpers';
import encryptData from '../../../function/encryptData';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import uploadIcon from "../../../assets/icon/upload_icon.svg"
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import search from "../../../assets/icon/search_icon.svg"

const DetailMerchantGrup = () => {
    const history = useHistory()
    const { profileId } = useParams()
    const [isMerchantQris, setIsMerchantQris] = useState(true)
    const [dataDetailGrup, setDataDetailGrup] = useState({})
    const [imageTempatUsaha, setImageTempatUsaha] = useState([])
    function disbursementTabs(isTabs){
        if(isTabs === true){
            setIsMerchantQris(isTabs)
            $('#infoMerchant').addClass('menu-detail-akun-hr-active')
            $('#infoMerchantspan').addClass('menu-detail-akun-span-active')
            $('#settlementMerchant').removeClass('menu-detail-akun-hr-active')
            $('#settlementMerchantspan').removeClass('menu-detail-akun-span-active')
        } else {
            setIsMerchantQris(isTabs)
            $('#infoMerchant').removeClass('menu-detail-akun-hr-active')
            $('#infoMerchantspan').removeClass('menu-detail-akun-span-active')
            $('#settlementMerchant').addClass('menu-detail-akun-hr-active')
            $('#settlementMerchantspan').addClass('menu-detail-akun-span-active')
        }
    }

    async function getListDataDetailGrupQrisHandler(profileId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"profile_id": ${profileId}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const datamerchantGrup = await axios.post(BaseURL + "/QRIS/OnboardingGetProfileMerchant", { data: dataParams }, { headers: headers })
            // console.log(datamerchantGrup, 'ini user detal funct');
            if (datamerchantGrup.status === 200 && datamerchantGrup.data.response_code === 200 && datamerchantGrup.data.response_new_token.length === 0) {
                const data1 = datamerchantGrup.data.response_data.results.mprofbus_photos_url_1 === null ? "" : datamerchantGrup.data.response_data.results.mprofbus_photos_url_1.split()
                const data2 = datamerchantGrup.data.response_data.results.mprofbus_photos_url_2 === null ? "" : datamerchantGrup.data.response_data.results.mprofbus_photos_url_2.split()
                const data3 = datamerchantGrup.data.response_data.results.mprofbus_photos_url_3 === null ? "" : datamerchantGrup.data.response_data.results.mprofbus_photos_url_3.split()
                const dataName1 = datamerchantGrup.data.response_data.results.mprofbus_photos_name_1 === null ? "" : datamerchantGrup.data.response_data.results.mprofbus_photos_name_1.split()
                const dataName2 = datamerchantGrup.data.response_data.results.mprofbus_photos_name_2 === null ? "" : datamerchantGrup.data.response_data.results.mprofbus_photos_name_2.split()
                const dataName3 = datamerchantGrup.data.response_data.results.mprofbus_photos_name_3 === null ? "" : datamerchantGrup.data.response_data.results.mprofbus_photos_name_3.split()
                if (data1.length === 0) {
                    setImageTempatUsaha([])
                } else {
                    const newData = (data1.concat(data2).concat(data3)).filter((str) => str !== "")
                    const newDataName = (dataName1.concat(dataName2).concat(dataName3))
                    let newArrImage = []
                    newData.forEach(async (item, id) => {
                        const obj = {}
                        const response = await fetch(item)
                        const blob = await response.blob();
                        const file = new File([blob], `image${id+1}.jpg`, {type: blob.type});
                        obj.data = file
                        obj.url = item
                        obj.name = newDataName[id]
                        newArrImage.push(obj)
                    })
                    setImageTempatUsaha(newArrImage)
                }
                setDataDetailGrup(datamerchantGrup.data.response_data.results)
                if (datamerchantGrup.data.response_data.results.settle_group === "Brand") {
                    getListDataBrandQrisHandler(activePageDataBrandQris, datamerchantGrup.data.response_data.results.mprofile_merchant_id)
                } else {
                    getListDataOutletQrisHandler(activePageDataOutletQris, datamerchantGrup.data.response_data.results.mprofile_merchant_id, datamerchantGrup.data.response_data.results.mprofile_outlet_nou === null ? 0 : datamerchantGrup.data.response_data.results.mprofile_outlet_nou )
                }
            } else if (datamerchantGrup.status === 200 && datamerchantGrup.data.response_code === 200 && datamerchantGrup.data.response_new_token.length !== 0) {
                setUserSession(datamerchantGrup.data.response_new_token)
                const data1 = datamerchantGrup.data.response_data.results.mprofbus_photos_url_1 === null ? "" : datamerchantGrup.data.response_data.results.mprofbus_photos_url_1.split()
                const data2 = datamerchantGrup.data.response_data.results.mprofbus_photos_url_2 === null ? "" : datamerchantGrup.data.response_data.results.mprofbus_photos_url_2.split()
                const data3 = datamerchantGrup.data.response_data.results.mprofbus_photos_url_3 === null ? "" : datamerchantGrup.data.response_data.results.mprofbus_photos_url_3.split()
                const dataName1 = datamerchantGrup.data.response_data.results.mprofbus_photos_name_1 === null ? "" : datamerchantGrup.data.response_data.results.mprofbus_photos_name_1.split()
                const dataName2 = datamerchantGrup.data.response_data.results.mprofbus_photos_name_2 === null ? "" : datamerchantGrup.data.response_data.results.mprofbus_photos_name_2.split()
                const dataName3 = datamerchantGrup.data.response_data.results.mprofbus_photos_name_3 === null ? "" : datamerchantGrup.data.response_data.results.mprofbus_photos_name_3.split()
                if (data1.length === 0) {
                    setImageTempatUsaha([])
                } else {
                    const newData = (data1.concat(data2).concat(data3)).filter((str) => str !== "")
                    const newDataName = (dataName1.concat(dataName2).concat(dataName3))
                    let newArrImage = []
                    newData.forEach(async (item, id) => {
                        const obj = {}
                        const response = await fetch(item)
                        const blob = await response.blob();
                        const file = new File([blob], `image${id+1}.jpg`, {type: blob.type});
                        obj.data = file
                        obj.url = item
                        obj.name = newDataName[id]
                        newArrImage.push(obj)
                    })
                    setImageTempatUsaha(newArrImage)
                }
                setDataDetailGrup(datamerchantGrup.data.response_data.results)
                if (datamerchantGrup.data.response_data.results.settle_group === "Brand") {
                    getListDataBrandQrisHandler(activePageDataBrandQris, datamerchantGrup.data.response_data.results.mprofile_merchant_id)
                } else {
                    getListDataOutletQrisHandler(activePageDataOutletQris, datamerchantGrup.data.response_data.results.mprofile_merchant_id, datamerchantGrup.data.response_data.results.mprofile_outlet_nou === null ? 0 : datamerchantGrup.data.response_data.results.mprofile_outlet_nou )
                }
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    /* TAMBAH SETTLEMENT TUJUAN BRAND */

    const [pageNumberDataBrandQris, setPageNumberDataBrandQris] = useState({})
    const [totalPageDataBrandQris, setTotalPageDataBrandQris] = useState(0)
    const [activePageDataBrandQris, setActivePageDataBrandQris] = useState(1)
    const [pendingDataBrandQris, setPendingDataBrandQris] = useState(true)
    const [isFilterDataBrandQris, setIsFilterDataBrandQris] = useState(false)
    const [dataMerchantBrandQris, setDataMerchantBrandQris] = useState([])

    function handleChangeFilteBrandrQris (e) {
        setFilterTextBrand(e.target.value)
        filterListDataBrandQrisHandler(dataDetailGrup?.mprofile_merchant_id, e.target.value, activePageDataBrandQris, 10)
    }
    const [filterTextBrand, setFilterTextBrand] = React.useState('');
    const filteredItemsBrand = dataMerchantBrandQris.filter(
        item => item.moutlet_name && item.moutlet_name.toLowerCase().includes(filterTextBrand.toLowerCase()),
    );

    function getPageRegisterQris (id, settleId, merchantNou, userNou, statusId, type) {
        if (statusId === 106 || statusId === 107) {
            if (type === 2) {
                history.push(`/formulir-tambah-settlement/${settleId}/${merchantNou}/${userNou}?type=2`)
            } else {
                history.push(`/formulir-tambah-settlement/${settleId}/${merchantNou}/${userNou}?type=3`)
            }
        } else {
            history.push(`/detail-settlement/${id}/${settleId}`)
        }
    }

    const columnsBrand = [
        {
            name: 'No',
            selector: row => row.number,
            width: '67px'
        },
        {
            name: 'ID brand',
            selector: row => row.moutlet_id,
        },
        {
            name: 'Waktu terdaftar',
            selector: row => row.moutlet_created_date_format,
        },
        {
            name: 'Nama brand', 
            selector: row => row.moutlet_name,
            wrap: true,
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "unset", margin: "6px 6px 6px 0px", borderRadius: 4  },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 105,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.status_id === 106 || row.status_id === 107,
                    style: { background: "#FEF4E9", color: "#F79421", width: "150px"}
                }
            ],
        },
        {
            name: 'Aksi',
            cell: (row) => (
                <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">{(row.status_id === 106 || row.status_id === 107) ? 'Lanjutkan daftar' : 'Lihat Detail'}</div></Tooltip>}>
                    <FontAwesomeIcon onClick={() => getPageRegisterQris(row.mprofile_id, row.mqrissettlegroup_id, row.mmerchant_nou, row.moutlet_nou, row.status_id, 2)} icon={(row.status_id === 106 || row.status_id === 107) ? faPencilAlt : faEye} className="me-2" style={{cursor: "pointer"}} />
                </OverlayTrigger>
              ),
        },
    ];

    function handlePageChangeDataBrandQris(page) {
        if (isFilterDataBrandQris) {
            setActivePageDataBrandQris(page)
            filterListDataBrandQrisHandler(dataDetailGrup?.mprofile_merchant_id, filterTextBrand, page, 10)
        } else {
            setActivePageDataBrandQris(page, )
            getListDataBrandQrisHandler(page, dataDetailGrup?.mprofile_merchant_id)
        }
    }

    async function getListDataBrandQrisHandler(page, merchantNou) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"merchant_nou": ${merchantNou}, "outlet_name": "", "date_from": "", "date_to": "", "page": ${(page !== 0) ? page : 1}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const datamerchantBrand = await axios.post(BaseURL + "/QRIS/OnboardingGetListOutlet", { data: dataParams }, { headers: headers })
            // console.log(datamerchantBrand, 'ini user detal funct');
            if (datamerchantBrand.status === 200 && datamerchantBrand.data.response_code === 200 && datamerchantBrand.data.response_new_token.length === 0) {
                setPageNumberDataBrandQris(datamerchantBrand.data.response_data)
                setTotalPageDataBrandQris(datamerchantBrand.data.response_data.max_page)
                setDataMerchantBrandQris(datamerchantBrand.data.response_data.results.list_data)
                setPendingDataBrandQris(false)
            } else if (datamerchantBrand.status === 200 && datamerchantBrand.data.response_code === 200 && datamerchantBrand.data.response_new_token.length !== 0) {
                setUserSession(datamerchantBrand.data.response_new_token)
                setPageNumberDataBrandQris(datamerchantBrand.data.response_data)
                setTotalPageDataBrandQris(datamerchantBrand.data.response_data.max_page)
                setDataMerchantBrandQris(datamerchantBrand.data.response_data.results.list_data)
                setPendingDataBrandQris(false)
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterListDataBrandQrisHandler(merchantNou, brandName, page, rowPerPage) {
        try {
            setPendingDataBrandQris(true)
            setIsFilterDataBrandQris(true)
            setActivePageDataBrandQris(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"merchant_nou": ${merchantNou}, "outlet_name":"${brandName}", "date_from": "", "date_to": "", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const datamerchantBrand = await axios.post(BaseURL + "/QRIS/OnboardingGetListOutlet", { data: dataParams }, { headers: headers })
            // console.log(datamerchantBrand, 'ini user detal funct');
            if (datamerchantBrand.status === 200 && datamerchantBrand.data.response_code === 200 && datamerchantBrand.data.response_new_token.length === 0) {
                setPageNumberDataBrandQris(datamerchantBrand.data.response_data)
                setTotalPageDataBrandQris(datamerchantBrand.data.response_data.max_page)
                setDataMerchantBrandQris(datamerchantBrand.data.response_data.results.list_data)
                setPendingDataBrandQris(false)
            } else if (datamerchantBrand.status === 200 && datamerchantBrand.data.response_code === 200 && datamerchantBrand.data.response_new_token.length !== 0) {
                setUserSession(datamerchantBrand.data.response_new_token)
                setPageNumberDataBrandQris(datamerchantBrand.data.response_data)
                setTotalPageDataBrandQris(datamerchantBrand.data.response_data.max_page)
                setDataMerchantBrandQris(datamerchantBrand.data.response_data.results.list_data)
                setPendingDataBrandQris(false)
            }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    /* TAMBAH SETTLEMENT TUJUAN OUTLET */

    const [pageNumberDataOutletQris, setPageNumberDataOutletQris] = useState({})
    const [totalPageDataOutletQris, setTotalPageDataOutletQris] = useState(0)
    const [activePageDataOutletQris, setActivePageDataOutletQris] = useState(1)
    const [pendingDataOutletQris, setPendingDataOutletQris] = useState(true)
    const [isFilterDataOutletQris, setIsFilterDataOutletQris] = useState(false)
    const [dataMerchantOutletQris, setDataMerchantOutletQris] = useState([])

    function handleChangeFilterQris (e) {
        setFilterTextOutlet(e.target.value)
        filterListDataOutletQrisHandler(dataDetailGrup?.mprofile_merchant_id, dataDetailGrup?.mprofile_outlet_nou, e.target.value, activePageDataOutletQris, 10)
    }
    const [filterTextOutlet, setFilterTextOutlet] = React.useState('');
    const filteredItemsOutlet = dataMerchantOutletQris.filter(
        item => item.mstore_name && item.mstore_name.toLowerCase().includes(filterTextOutlet.toLowerCase()),
    );

    const columnsOutlet = [
        {
            name: 'No',
            selector: row => row.number,
            width: '67px'
        },
        {
            name: 'ID outlet',
            selector: row => row.mstore_id,
        },
        {
            name: 'Waktu terdaftar',
            selector: row => row.mstore_create_date_format,
        },
        {
            name: 'Nama brand', 
            selector: row => row.moutlet_name,
            wrap: true,
        },
        {
            name: 'Nama outlet', 
            selector: row => row.mstore_name,
            wrap: true,
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "unset", margin: "6px 6px 6px 0px", borderRadius: 4  },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 105,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.status_id === 106 || row.status_id === 107,
                    style: { background: "#FEF4E9", color: "#F79421", width: "150px"}
                }
            ],
        },
        {
            name: 'Aksi',
            cell: (row) => (
                <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">{(row.status_id === 106 || row.status_id === 107) ? 'Lanjutkan daftar' : 'Lihat Detail'}</div></Tooltip>}>
                    <FontAwesomeIcon onClick={() => getPageRegisterQris(row.mprofile_id, row.mqrissettlegroup_id, row.merchant_nou, row.mstore_nou, row.status_id, 3)} icon={(row.status_id === 106 || row.status_id === 107) ? faPencilAlt : faEye} className="me-2" style={{cursor: "pointer"}} />
                </OverlayTrigger>
              ),
        },
    ];

    function handlePageChangeDataOutletQris(page) {
        if (isFilterDataOutletQris) {
            setActivePageDataOutletQris(page)
            filterListDataOutletQrisHandler(dataDetailGrup?.mprofile_merchant_id, dataDetailGrup?.mprofile_outlet_nou, filterTextOutlet, page, 10)
        } else {
            setActivePageDataOutletQris(page)
            getListDataOutletQrisHandler(page, dataDetailGrup?.mprofile_merchant_id, dataDetailGrup?.mprofile_outlet_nou === null ? 0 : dataDetailGrup?.mprofile_outlet_nou)
        }
    }

    async function getListDataOutletQrisHandler(page, merchantNou, outletNou) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"merchant_nou": ${merchantNou}, "outlet_nou": ${outletNou}, "outlet_name": "", "date_from": "", "date_to": "", "page": ${(page !== 0) ? page : 1}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const datamerchantOutlet = await axios.post(BaseURL + "/QRIS/OnboardingGetListStore", { data: dataParams }, { headers: headers })
            // console.log(datamerchantOutlet, 'ini user detal funct');
            if (datamerchantOutlet.status === 200 && datamerchantOutlet.data.response_code === 200 && datamerchantOutlet.data.response_new_token.length === 0) {
                setPageNumberDataOutletQris(datamerchantOutlet.data.response_data)
                setTotalPageDataOutletQris(datamerchantOutlet.data.response_data.max_page)
                setDataMerchantOutletQris(datamerchantOutlet.data.response_data.results.list_data)
                setPendingDataOutletQris(false)
            } else if (datamerchantOutlet.status === 200 && datamerchantOutlet.data.response_code === 200 && datamerchantOutlet.data.response_new_token.length !== 0) {
                setUserSession(datamerchantOutlet.data.response_new_token)
                setPageNumberDataOutletQris(datamerchantOutlet.data.response_data)
                setTotalPageDataOutletQris(datamerchantOutlet.data.response_data.max_page)
                setDataMerchantOutletQris(datamerchantOutlet.data.response_data.results.list_data)
                setPendingDataOutletQris(false)
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterListDataOutletQrisHandler(merchantNou, outletNou, brandName, page, rowPerPage) {
        try {
            setPendingDataOutletQris(true)
            setIsFilterDataOutletQris(true)
            setActivePageDataOutletQris(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"merchant_nou": ${merchantNou}, "outlet_nou": ${outletNou}, "outlet_name":"${brandName}", "date_from": "", "date_to": "", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const datamerchantOutlet = await axios.post(BaseURL + "/QRIS/OnboardingGetListStore", { data: dataParams }, { headers: headers })
            // console.log(datamerchantOutlet, 'ini user detal funct');
            if (datamerchantOutlet.status === 200 && datamerchantOutlet.data.response_code === 200 && datamerchantOutlet.data.response_new_token.length === 0) {
                setPageNumberDataOutletQris(datamerchantOutlet.data.response_data)
                setTotalPageDataOutletQris(datamerchantOutlet.data.response_data.max_page)
                setDataMerchantOutletQris(datamerchantOutlet.data.response_data.results.list_data)
                setPendingDataOutletQris(false)
            } else if (datamerchantOutlet.status === 200 && datamerchantOutlet.data.response_code === 200 && datamerchantOutlet.data.response_new_token.length !== 0) {
                setUserSession(datamerchantOutlet.data.response_new_token)
                setPageNumberDataOutletQris(datamerchantOutlet.data.response_data)
                setTotalPageDataOutletQris(datamerchantOutlet.data.response_data.max_page)
                setDataMerchantOutletQris(datamerchantOutlet.data.response_data.results.list_data)
                setPendingDataOutletQris(false)
            }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                paddingRight: 'none'
                
            },
        },
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
          <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          <div>Loading...</div>
        </div>
    );

    useEffect(() => {
        getListDataDetailGrupQrisHandler(profileId)
    }, [])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span onClick={() => history.push('/')} style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span onClick={() => history.push('/daftar-merchant-qris')} style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Detail merchant</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Detail merchant grup</h2>
            </div>
            <div className='detail-akun-menu mt-4' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' id="infoMerchant" onClick={() => disbursementTabs(true)}>
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="infoMerchantspan">Info merchant</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="settlementMerchant" onClick={() => disbursementTabs(false)}>
                    <span className='menu-detail-akun-span' id="settlementMerchantspan">Settlement merchant</span>
                </div>
            </div>
            <hr className='hr-style' style={{marginTop: -2}}/>
            {
                isMerchantQris === true ? (
                    dataDetailGrup?.mprofdtl_bustype === 1 ? (
                        <div className='base-content' style={{ marginTop: -15 }}>
                            <div className="waktu-bergabung-detail">Waktu bergabung : {dataDetailGrup?.created_date}</div>
                            <div className="nama-merchant-in-detail mt-2">{dataDetailGrup?.mprofbus_name}</div>
                            {/* <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>ID pengguna</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Kata sandi</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>12345abcde</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>sad12i3ui</Col>
                            </Row> */}
                            <hr/>
                            <div className='title-sub-content-detail-merchant'>Info pemilik</div>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Nama pemilik usaha sesuai akta pendirian/perubahan terakhir</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Nomor eKTP / KITAS pemilik usaha sesuai akta pendirian/perubahan terakhir</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofdtl_name}</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofdtl_identity_no}</Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Peran pendaftar</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Kewarganegaraan pemilik usaha</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofdtl_register_role_name}</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofdtl_identity_type_name}</Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>No telepon pemilik usaha</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Foto eKTP / KITAS pemilik usaha sesuai akta pendirian/perubahan terakhir</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofdtl_mobile}</Col>
                                <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                    <img src={String(dataDetailGrup?.mprofdtl_identity_url).slice(-3) === "pdf" ? filePdfQris : dataDetailGrup?.mprofdtl_identity_url} alt="foto 1" width="150px" height="90px" />
                                    <div className='isi-content-detail-merchant ms-2'>{dataDetailGrup?.mprofdtl_identity_filename}</div>
                                </Col>
                            </Row>
                            <hr/>
                            <div className='title-sub-content-detail-merchant'>Info usaha</div>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Nama perusahaan</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Bentuk perusahaan</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofbus_name}</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofbus_company_type_name === "" ? "-" : dataDetailGrup?.mprofbus_company_type_name}</Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Kategori usaha</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Alamat usaha</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mbuscat_name}</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofbus_address}</Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Pendapatan pertahun</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Jenis toko</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mbusinc_desc}</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>{(dataDetailGrup?.mprofbus_shop_type_id === "2,1" || dataDetailGrup?.mprofbus_shop_type_id === "1,2") ? "Toko Fisik & Toko Online" : (dataDetailGrup?.mprofbus_shop_type_id === "1") ? "Toko Fisik" : "Toko Online"}</Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Kode pos</Col>
                                {
                                    dataDetailGrup?.mprofbus_shop_type_id !== null && (
                                        <Col xs={6} className='sub-title-detail-merchant'>Foto tempat usaha</Col>
                                    )
                                }
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofbus_postal_code}</Col>
                                {
                                    dataDetailGrup?.mprofbus_shop_type_id !== null && (
                                        <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                        {
                                            imageTempatUsaha.length !== 0 ?
                                            imageTempatUsaha.map((item, id) => {
                                                return (
                                                    <div className='d-flex justify-content-start flex-column align-items-center ms-1' key={id}>
                                                        <img src={item.url} alt="alt" width="150px" height="90px" className='pt-4 text-start' />
                                                        <div className='pt-2 text-wrap' style={{ width: 150 }}>{item.name}</div>
                                                    </div>
                                                )
                                            }) : "-"
                                        }
                                        </Col>
                                    )
                                }
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Sudah pernah mendaftar QRIS ?</Col>
                                {
                                    dataDetailGrup?.mprofbus_shop_type_id !== null && (
                                        <Col xs={6} className='sub-title-detail-merchant'>Link / Website toko</Col>
                                    )
                                }
                                
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofbus_is_have_QRIS === false ? `Tidak` : `Ya`}</Col>
                                {
                                    dataDetailGrup?.mprofbus_shop_type_id !== null && (
                                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofbus_online_shop_url }</Col>
                                    )
                                }
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Kode refferal</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofilefee_user_referal_code}</Col>
                            </Row>
                            <hr/>
                            <div className='title-sub-content-detail-merchant'>Dokumen usaha</div>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Dokumen NPWP perusahaan</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Dokumen NIB perusahaan</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                    <img src={String(dataDetailGrup?.mprofdoc_npwp_url).slice(-3) === "pdf" ? filePdfQris : dataDetailGrup?.mprofdoc_npwp_url} alt="foto 1" width="150px" height="90px" />
                                    <div className='isi-content-detail-merchant ms-2'>{dataDetailGrup?.mprofdoc_npwp_url_name}</div>
                                </Col>
                                <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                    <img src={String(dataDetailGrup?.mprofdoc_NIB_url).slice(-3) === "pdf" ? filePdfQris : dataDetailGrup?.mprofdoc_NIB_url} alt="foto 1" width="150px" height="90px" />
                                    <div className='isi-content-detail-merchant ms-2'>{dataDetailGrup?.mprofdoc_NIB_url_name}</div>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Akta pendirian perusahaan atau perubahan terakhir</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>SK Kementerian Kehakiman</Col>
                            </Row>
                            <Row className='mt-1 pb-4'>
                                <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                    <img src={String(dataDetailGrup?.mprofdoc_akta_pendirian_url).slice(-3) === "pdf" ? filePdfQris : dataDetailGrup?.mprofdoc_akta_pendirian_url} alt="foto 1" width="150px" height="90px" />
                                    <div className='isi-content-detail-merchant ms-2'>{dataDetailGrup?.mprofdoc_akta_pendirian_url_name}</div>
                                </Col>
                                <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                    <img src={String(dataDetailGrup?.mpromprofdoc_SK_url).slice(-3) === "pdf" ? filePdfQris : dataDetailGrup?.mpromprofdoc_SK_url} alt="foto 1" width="150px" height="90px" />
                                    <div className='isi-content-detail-merchant ms-2'>{dataDetailGrup?.mprofdoc_SK_url_name}</div>
                                </Col>
                            </Row>
                            {/* <div className='text-end mt-3 pb-4'>
                                <button className='button-ubah-info-merchant-detail'>
                                    Ubah info merchant
                                </button>
                            </div> */}
                        </div>
                    ) : dataDetailGrup?.mprofdtl_bustype === 2 ? (
                        <div className='base-content' style={{ marginTop: -15 }}>
                            <div className="waktu-bergabung-detail">Waktu bergabung : {dataDetailGrup?.created_date}</div>
                            <div className="nama-merchant-in-detail mt-2">{dataDetailGrup?.mprofbus_name}</div>
                            {/* <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>ID pengguna</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Kata sandi</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>12345abcde</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>sad12i3ui</Col>
                            </Row> */}
                            <hr/>
                            <div className='title-sub-content-detail-merchant'>Info pemilik</div>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Nama pemilik usaha sesuai akta pendirian/perubahan terakhir</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Kewarganegaraan pemilik usaha</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofdtl_name}</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofdtl_identity_type_name}</Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Nomor eKTP / KITAS pemilik usaha sesuai akta pendirian/perubahan terakhir</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Foto eKTP / KITAS pemilik usaha sesuai akta pendirian/perubahan terakhir</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofdtl_identity_no}</Col>
                                <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                    <img src={String(dataDetailGrup?.mprofdtl_identity_url).slice(-3) === "pdf" ? filePdfQris : dataDetailGrup?.mprofdtl_identity_url} alt="foto 1" width="150px" height="90px" />
                                    <div className='isi-content-detail-merchant ms-2'>{dataDetailGrup?.mprofdtl_identity_filename}</div>
                                </Col>
                            </Row>
                            <hr/>
                            <div className='title-sub-content-detail-merchant'>Info usaha</div>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Nama perusahaan</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Bentuk perusahaan</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofbus_name}</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofbus_company_type_name === "" ? "-" : dataDetailGrup?.mprofbus_company_type_name}</Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Kategori usaha</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Alamat usaha</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mbuscat_name}</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofbus_address}</Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Pendapatan pertahun</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Jenis toko</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mbusinc_desc}</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>{(dataDetailGrup?.mprofbus_shop_type_id === "2,1" || dataDetailGrup?.mprofbus_shop_type_id === "1,2") ? "Toko Fisik & Toko Online" : (dataDetailGrup?.mprofbus_shop_type_id === "1") ? "Toko Fisik" : "Toko Online"}</Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Kode pos</Col>
                                {
                                    dataDetailGrup?.mprofbus_shop_type_id !== null && (
                                        <Col xs={6} className='sub-title-detail-merchant'>Foto tempat usaha</Col>
                                    )
                                }
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofbus_postal_code}</Col>
                                {
                                    dataDetailGrup?.mprofbus_shop_type_id !== null && (
                                        <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                        {
                                            imageTempatUsaha.length !== 0 ?
                                            imageTempatUsaha.map((item, id) => {
                                                return (
                                                    <div className='d-flex justify-content-start flex-column align-items-center ms-1' key={id}>
                                                        <img src={item.url} alt="alt" width="150px" height="90px" className='pt-4 text-start' />
                                                        <div className='pt-2 text-wrap' style={{ width: 150 }}>{item.name}</div>
                                                    </div>
                                                )
                                            }) : "-"
                                        }
                                        </Col>
                                    )
                                }
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Sudah pernah mendaftar QRIS ?</Col>
                                {
                                    dataDetailGrup?.mprofbus_shop_type_id !== null && (
                                        <Col xs={6} className='sub-title-detail-merchant'>Link / Website toko</Col>
                                    )
                                }
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofbus_is_have_QRIS === false ? `Tidak` : `Ya`}</Col>
                                {
                                    dataDetailGrup?.mprofbus_shop_type_id !== null && (
                                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofbus_online_shop_url }</Col>
                                    )
                                }
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Kode refferal</Col>
                            </Row>
                            <Row className='mt-1 pb-5'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofilefee_user_referal_code}</Col>
                            </Row>
                            {/* <div className='text-end mt-3 pb-4'>
                                <button className='button-ubah-info-merchant-detail'>
                                    Ubah info merchant
                                </button>
                            </div> */}
                        </div>
                    ) : (
                        <div className='base-content' style={{ marginTop: -15 }}>
                            <div className="waktu-bergabung-detail">Waktu bergabung : {dataDetailGrup?.created_date}</div>
                            <div className="nama-merchant-in-detail mt-2">{dataDetailGrup?.mprofbus_name === null ? "-" : dataDetailGrup?.mprofbus_name}</div>
                            {/* <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>ID pengguna</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Kata sandi</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>12345abcde</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>sad12i3ui</Col>
                            </Row> */}
                            <hr/>
                            <div className='title-sub-content-detail-merchant'>Info pemilik</div>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Nama pemilik usaha sesuai akta pendirian/perubahan terakhir</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>Nomor eKTP / KITAS pemilik usaha sesuai akta pendirian/perubahan terakhir</Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofdtl_name}</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofdtl_identity_no}</Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col xs={6} className='sub-title-detail-merchant'>Email</Col>
                                <Col xs={6} className='sub-title-detail-merchant'>No telepon penanggung jawab</Col>
                            </Row>
                            <Row className='mt-1 pb-4'>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofdtl_email}</Col>
                                <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.mprofdtl_mobile}</Col>
                            </Row>
                            {/* <div className='text-end mt-3 pb-4'>
                                <button className='button-ubah-info-merchant-detail'>
                                    Ubah info merchant
                                </button>
                            </div> */}
                        </div>
                    )
                ) : (
                    <div className='base-content' style={{ marginTop: -15 }}>
                        <div className='title-sub-content-detail-merchant'>Info settlement</div>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Jenis settlement</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Tujuan transfer settlement</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.settle_type === null ? "-" : dataDetailGrup?.settle_type}</Col>
                            <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.settle_group}</Col>
                        </Row>
                        {
                            dataDetailGrup?.settle_group === "Group" && (
                                <>
                                    <Row className='mt-3'>
                                        <Col xs={6} className='sub-title-detail-merchant'>Nama bank</Col>
                                        <Col xs={6} className='sub-title-detail-merchant'>Nomor rekening</Col>
                                    </Row>
                                    <Row className='mt-1'>
                                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.bank_name}</Col>
                                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.settle_account_number}</Col>
                                    </Row>
                                    <Row className='mt-3'>
                                        <Col xs={6} className='sub-title-detail-merchant'>Nama pemilik rekening</Col>
                                    </Row>
                                    <Row className='mt-1 pb-5'>
                                        <Col xs={6} className='isi-content-detail-merchant'>{dataDetailGrup?.settle_account_name}</Col>
                                    </Row>
                                </>
                            )
                        }
                        {
                            dataDetailGrup?.settle_group === "Brand" ? (
                                <>
                                    <hr/>
                                    <div className='title-sub-content-detail-merchant'>Daftar settlement</div>
                                    <div className='alert-form-info-pemilik py-4 mt-3'>
                                        <img src={alertIconYellow} alt="icon" />
                                        <div className='ms-2'>Jika ingin mendaftarkan settlement dengan “Upload dokumen”, Kamu bisa menggunakan format dokumen excel yang sudah disediakan: <span style={{ color: "#077E86", fontFamily: "Exo", fontWeight: 700, cursor: "pointer", textDecorationLine: "underline" }}>Download template.</span></div>
                                    </div>
                                    <div className="div-table mt-4" >
                                        <div className="d-flex justify-content-between align-items-center" style={{ width: "inherit" }}>
                                            <div className="d-flex justify-content-center align-items-center mb-4">
                                                <div style={{fontSize: 16, fontWeight: 400,fontFamily: "Nunito", colr: "#383838"}}>Pencarian : </div>
                                                <div className="d-flex justify-content-between align-items-center ms-3 position-relative" style={{width: 300}}>
                                                    <div className="position-absolute left-3 px-1"><img src={search} alt="search" /></div>
                                                    <FormControl
                                                        className="ps-5"
                                                        id="search"
                                                        type="text"
                                                        placeholder="Masukkan nama brand"
                                                        aria-label="Search Input"
                                                        value={filterTextBrand}
                                                        onChange={(e) => handleChangeFilteBrandrQris(e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end align-items-center mb-4">
                                                <button className="me-3" style={{ color: "#077E86", fontFamily: "Exo", fontSize: 14, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 200, height: 48, border: "1px solid var(--contoh-secondary-40-warna-utama, #077E86);", borderRadius: 4 }}>
                                                    <img
                                                        src={uploadIcon}
                                                        // onClick={() => editInTableHandler(row.number)}
                                                        style={{ cursor: "pointer" }}
                                                        alt="icon edit"
                                                    /> Upload dokumen
                                                </button>
                                                <button onClick={() => history.push(`/formulir-tambah-settlement/102/${dataDetailGrup?.mprofile_merchant_id}/${dataDetailGrup?.moutlet_nou}?type=${2}`)} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 230, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                                                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah settlement
                                                </button>
                                            </div>
                                        </div>
                                        <DataTable
                                            columns={columnsBrand}
                                            data={filteredItemsBrand}
                                            customStyles={customStyles}
                                            highlightOnHover
                                            progressPending={pendingDataBrandQris}
                                            progressComponent={<CustomLoader />}
                                            persistTableHead
                                        />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageDataBrandQris}</div>
                                        <Pagination
                                            activePage={activePageDataBrandQris}
                                            itemsCountPerPage={pageNumberDataBrandQris.row_per_page}
                                            totalItemsCount={(pageNumberDataBrandQris.row_per_page*pageNumberDataBrandQris.max_page)}
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={handlePageChangeDataBrandQris}
                                        />
                                    </div>
                                </>
                            ) : dataDetailGrup?.settle_group === "Outlet / Store" ? (
                                <>
                                    <hr/>
                                    <div className='title-sub-content-detail-merchant'>Daftar settlement</div>
                                    <div className='alert-form-info-pemilik py-4 mt-3'>
                                        <img src={alertIconYellow} alt="icon" />
                                        <div className='ms-2'>Jika ingin mendaftarkan settlement dengan “Upload dokumen”, Kamu bisa menggunakan format dokumen excel yang sudah disediakan: <span style={{ color: "#077E86", fontFamily: "Exo", fontWeight: 700, cursor: "pointer", textDecorationLine: "underline" }}>Download template.</span></div>
                                    </div>
                                    <div className="div-table mt-4" >
                                        <div className="d-flex justify-content-between align-items-center" style={{ width: "inherit" }}>
                                            <div className="d-flex justify-content-center align-items-center mb-4">
                                                <div style={{fontSize: 16, fontWeight: 400,fontFamily: "Nunito", colr: "#383838"}}>Pencarian : </div>
                                                <div className="d-flex justify-content-between align-items-center ms-3 position-relative" style={{width: 300}}>
                                                    <div className="position-absolute left-3 px-1"><img src={search} alt="search" /></div>
                                                    <FormControl
                                                        className="ps-5"
                                                        id="search"
                                                        type="text"
                                                        placeholder="Masukkan nama outlet"
                                                        aria-label="Search Input"
                                                        value={filterTextOutlet}
                                                        onChange={(e) => handleChangeFilterQris(e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end align-items-center mb-4">
                                                <button className="me-3" style={{ color: "#077E86", fontFamily: "Exo", fontSize: 14, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 200, height: 48, border: "1px solid var(--contoh-secondary-40-warna-utama, #077E86);", borderRadius: 4 }}>
                                                    <img
                                                        src={uploadIcon}
                                                        // onClick={() => editInTableHandler(row.number)}
                                                        style={{ cursor: "pointer" }}
                                                        alt="icon edit"
                                                    /> Upload dokumen
                                                </button>
                                                <button onClick={() => history.push(`/formulir-tambah-settlement/103/${dataDetailGrup?.mprofile_merchant_id}/${dataDetailGrup?.mstore_nou}?type=${3}`)} style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 700, alignItems: "center", padding: "12px 24px", gap: 8, width: 230, height: 48, background: "linear-gradient(180deg, #F1D3AC 0%, #E5AE66 100%)", border: "0.6px solid #2C1919", borderRadius: 6 }}>
                                                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} /> Tambah settlement
                                                </button>
                                            </div>
                                        </div>
                                        <DataTable
                                            columns={columnsOutlet}
                                            data={filteredItemsOutlet}
                                            customStyles={customStyles}
                                            highlightOnHover
                                            progressPending={pendingDataOutletQris}
                                            progressComponent={<CustomLoader />}
                                            persistTableHead
                                        />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                                        <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageDataOutletQris}</div>
                                        <Pagination
                                            activePage={activePageDataOutletQris}
                                            itemsCountPerPage={pageNumberDataOutletQris.row_per_page}
                                            totalItemsCount={(pageNumberDataOutletQris.row_per_page*pageNumberDataOutletQris.max_page)}
                                            pageRangeDisplayed={5}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            onChange={handlePageChangeDataOutletQris}
                                        />
                                    </div>
                                </>
                            ) : ""
                        }
                    </div>
                )
            }
        </div>
    )
}

export default DetailMerchantGrup