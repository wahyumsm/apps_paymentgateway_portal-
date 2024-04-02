import React, { useEffect, useMemo, useState } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import $ from 'jquery'
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Image, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { FilterComponentQrisGrup, FilterComponentQris } from '../../components/FilterComponentQris';
import { BaseURL, errorCatch, getToken, setUserSession } from '../../function/helpers';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import encryptData from '../../function/encryptData';
import Pagination from 'react-js-pagination';

const DaftarMerchantQris = () => {
    const history = useHistory()
    const [isMerchantQris, setIsMerchantQris] = useState("merchantGrup")
    function disbursementTabs(isTabs){
        if(isTabs === "merchantGrup"){
            setIsMerchantQris(isTabs)
            setFilterTextBrand('')
            getListDataBrandQrisHandler(1)
            setFilterTextOutlet('')
            getListDataOutletQrisHandler(1)
            $('#merchantGrup').addClass('menu-detail-akun-hr-active')
            $('#merchantGrupspan').addClass('menu-detail-akun-span-active')
            $('#merchantBrand').removeClass('menu-detail-akun-hr-active')
            $('#merchantBrandspan').removeClass('menu-detail-akun-span-active')
            $('#merchantOutlet').removeClass('menu-detail-akun-hr-active')
            $('#merchantOutletspan').removeClass('menu-detail-akun-span-active')
        } else if (isTabs === "merchantBrand") {
            setIsMerchantQris(isTabs)
            setFilterTextGrup('')
            getListDataGrupQrisHandler(1)
            setFilterTextOutlet('')
            getListDataOutletQrisHandler(1)
            $('#merchantGrup').removeClass('menu-detail-akun-hr-active')
            $('#merchantGrupspan').removeClass('menu-detail-akun-span-active')
            $('#merchantBrand').addClass('menu-detail-akun-hr-active')
            $('#merchantBrandspan').addClass('menu-detail-akun-span-active')
            $('#merchantOutlet').removeClass('menu-detail-akun-hr-active')
            $('#merchantOutletspan').removeClass('menu-detail-akun-span-active')
        } else {
            setIsMerchantQris(isTabs)
            setFilterTextGrup('')
            getListDataGrupQrisHandler(1)
            setFilterTextBrand('')
            getListDataBrandQrisHandler(1)
            $('#merchantGrup').removeClass('menu-detail-akun-hr-active')
            $('#merchantGrupspan').removeClass('menu-detail-akun-span-active')
            $('#merchantBrand').removeClass('menu-detail-akun-hr-active')
            $('#merchantBrandspan').removeClass('menu-detail-akun-span-active')
            $('#merchantOutlet').addClass('menu-detail-akun-hr-active')
            $('#merchantOutletspan').addClass('menu-detail-akun-span-active')
        }
    }

    /*DAFTAR MERCHANT GRUP QRIS */
    
    const [pageNumberDataGrupQris, setPageNumberDataGrupQris] = useState({})
    const [totalPageDataGrupQris, setTotalPageDataGrupQris] = useState(0)
    const [activePageDataGrupQris, setActivePageDataGrupQris] = useState(1)
    const [pendingDataGrupQris, setPendingDataGrupQris] = useState(true)
    const [isFilterDataGrupQris, setIsFilterDataGrupQris] = useState(false)
    const [dataMerchantGrupQris, setDataMerchantGrupQris] = useState([])
    const [filterTextGrup, setFilterTextGrup] = React.useState('');
    const [resetPaginationToggleGrup, setResetPaginationToggleGrup] = React.useState(false);
    const filteredItemsGrup = dataMerchantGrupQris.filter(
        item => item.mmerchant_name && item.mmerchant_name.toLowerCase().includes(filterTextGrup.toLowerCase()),
    );
    const subHeaderComponentMemoGrup = useMemo(() => {
        const handleClear = () => {
            if (filterTextGrup) {
                setResetPaginationToggleGrup(!resetPaginationToggleGrup);
                setFilterTextGrup('');
            }
        };
        function handleChangeFilterQris (e) {
            setFilterTextGrup(e.target.value)
            filterListDataGrupQrisHandler(e.target.value, activePageDataGrupQris, 10)
        }
        return (
            <FilterComponentQrisGrup onFilter={e => handleChangeFilterQris(e)} onClear={handleClear} filterText={filterTextGrup} title="Pencarian :" placeholder="Masukkan nama grup" onClickAddMerchant={() => history.push(`/pilih-jenis-usaha`)} />
        );	}, [filterTextGrup, resetPaginationToggleGrup]
    );

    function handlePageChangeDataGrupQris(page) {
        if (isFilterDataGrupQris) {
            setActivePageDataGrupQris(page)
            filterListDataGrupQrisHandler(filterTextGrup, page, 10)
        } else {
            setActivePageDataGrupQris(page)
            getListDataGrupQrisHandler(page)
        }
    }

    async function getListDataGrupQrisHandler(page) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"mmerchant_name": "", "date_from": "", "date_to": "", "page": ${(page !== 0) ? page : 1}, "row_per_page": 10}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const datamerchantGrup = await axios.post(BaseURL + "/QRIS/OnboardingGetListMerchant", { data: dataParams }, { headers: headers })
            // console.log(datamerchantGrup, 'ini user detal funct');
            if (datamerchantGrup.status === 200 && datamerchantGrup.data.response_code === 200 && datamerchantGrup.data.response_new_token.length === 0) {
                setPageNumberDataGrupQris(datamerchantGrup.data.response_data)
                setTotalPageDataGrupQris(datamerchantGrup.data.response_data.max_page)
                setDataMerchantGrupQris(datamerchantGrup.data.response_data.results.list_data)
                setPendingDataGrupQris(false)
            } else if (datamerchantGrup.status === 200 && datamerchantGrup.data.response_code === 200 && datamerchantGrup.data.response_new_token.length !== 0) {
                setUserSession(datamerchantGrup.data.response_new_token)
                setPageNumberDataGrupQris(datamerchantGrup.data.response_data)
                setTotalPageDataGrupQris(datamerchantGrup.data.response_data.max_page)
                setDataMerchantGrupQris(datamerchantGrup.data.response_data.results.list_data)
                setPendingDataGrupQris(false)
            }
    } catch (error) {
            // console.log(error);
            history.push(errorCatch(error.response.status))
        }
    }

    async function filterListDataGrupQrisHandler(merchantName, page, rowPerPage) {
        try {
            setPendingDataGrupQris(true)
            setIsFilterDataGrupQris(true)
            setActivePageDataGrupQris(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"mmerchant_name":"${merchantName}", "date_from": "", "date_to": "", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const datamerchantGrup = await axios.post(BaseURL + "/QRIS/OnboardingGetListMerchant", { data: dataParams }, { headers: headers })
            // console.log(datamerchantGrup, 'ini user detal funct');
            if (datamerchantGrup.status === 200 && datamerchantGrup.data.response_code === 200 && datamerchantGrup.data.response_new_token.length === 0) {
                setPageNumberDataGrupQris(datamerchantGrup.data.response_data)
                setTotalPageDataGrupQris(datamerchantGrup.data.response_data.max_page)
                setDataMerchantGrupQris(datamerchantGrup.data.response_data.results.list_data)
                setPendingDataGrupQris(false)
            } else if (datamerchantGrup.status === 200 && datamerchantGrup.data.response_code === 200 && datamerchantGrup.data.response_new_token.length !== 0) {
                setUserSession(datamerchantGrup.data.response_new_token)
                setPageNumberDataGrupQris(datamerchantGrup.data.response_data)
                setTotalPageDataGrupQris(datamerchantGrup.data.response_data.max_page)
                setDataMerchantGrupQris(datamerchantGrup.data.response_data.results.list_data)
                setPendingDataGrupQris(false)
            }
    } catch (error) {
          // console.log(error);
          history.push(errorCatch(error.response.status))
        }
    }

    function getPageRegisterQris (id, step, businessTypeId, settleId, merchantNou, userNou, statusId) {
        if (statusId === 106 || statusId === 107) {
            if (step === 1) {
                if (businessTypeId === 2) {
                    history.push(`/form-info-pemilik-perorangan/${id}`)
                } else if (businessTypeId === 3) {
                    history.push(`/form-tidak-berbadan-hukum/${id}`)
                } else if (businessTypeId === 1) {
                    history.push(`/form-info-pemilik-badan-usaha/${id}`)
                }
            } 
            
            if (step === 2) {
                if (businessTypeId === 2) {
                    history.push(`/form-info-usaha-perorangan/${id}`)
                } else if (businessTypeId === 1) {
                    history.push(`/form-info-usaha-badan-usaha/${id}`)
                    window.location.reload()
                }
            } 
            
            if (step === 3) {
                if (businessTypeId === 1) {
                    history.push(`/form-dokumen-usaha-badan-usaha/${id}`)
                }
            } 
            
            if (step === 200) {
                history.push(`/pengaturan-merchant/${id}/101/${businessTypeId}`)
            }
    
            if (step === 201) {
                history.push(`/formulir-daftar-settlement/${settleId}/${merchantNou}/${userNou}/${id}`)
            }
        } else {
            history.push(`/detail-merchant-grup/${id}`)
        }
    }

    const columnsGrup = [
        {
            name: 'No',
            selector: row => row.number,
            width: '67px'
        },
        {
            name: 'ID merchant',
            selector: row => row.mmerchant_id,
            width: "130px"
        },
        {
            name: 'Waktu bergabung',
            selector: row => row.mmerchant_crtdt_format,
            width: "170px"
        },
        {
            name: 'Nama merchant', 
            selector: row => row.mmerchant_name,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Tujuan settlement',
            selector: row => row.mqrissettlegroup_name,
            wrap: true,
            width: "180px"
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "unset", margin: "6px 6px 6px 0px", borderRadius: 4,  },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 105 || row.status_id === 108,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.status_id === 106 || row.status_id === 107 || row.status_id === 109,
                    style: { background: "#FEF4E9", color: "#F79421", width: "150px"}
                },
                {
                    when: row => row.status_id === 110,
                    style: { background: "#FEF4E9", color: "#B9121B", width: "150px"}
                }
            ],
        },
        {
            name: 'Aksi',
            width: "170px",
            cell: (row) => (
                <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">{(row.status_id  === 106 || row.status_id === 107) ? 'Lanjutkan daftar' : 'Lihat'}</div></Tooltip>}>
                    <FontAwesomeIcon onClick={() => getPageRegisterQris(row.mprofile_id, row.step, row.business_type_id, row.mqrissettlegroup_id, row.merchant_nou, row.merchant_nou, row.status_id)} icon={(row.status_id === 106 || row.status_id === 107) ? faPencilAlt : faEye} className="me-2" style={{cursor: "pointer"}} />
                </OverlayTrigger> 
            ),
        },
    ];

    /*DAFTAR MERCHANT BRAND QRIS */

    const [pageNumberDataBrandQris, setPageNumberDataBrandQris] = useState({})
    const [totalPageDataBrandQris, setTotalPageDataBrandQris] = useState(0)
    const [activePageDataBrandQris, setActivePageDataBrandQris] = useState(1)
    const [pendingDataBrandQris, setPendingDataBrandQris] = useState(true)
    const [isFilterDataBrandQris, setIsFilterDataBrandQris] = useState(false)
    const [dataMerchantBrandQris, setDataMerchantBrandQris] = useState([])
    const [filterTextBrand, setFilterTextBrand] = React.useState('');
    const [resetPaginationToggleBrand, setResetPaginationToggleBrand] = React.useState(false);
    const filteredItemsBrand = dataMerchantBrandQris.filter(
        item => item.moutlet_name && item.moutlet_name.toLowerCase().includes(filterTextBrand.toLowerCase()),
    );
    const subHeaderComponentMemoBrand = useMemo(() => {
        const handleClear = () => {
            if (filterTextBrand) {
                setResetPaginationToggleBrand(!resetPaginationToggleBrand);
                setFilterTextBrand('');
            }
        };

        function handleChangeFilterQris (e) {
            setFilterTextBrand(e.target.value)
            filterListDataBrandQrisHandler(e.target.value, activePageDataBrandQris, 10)
        }
        return (
            <FilterComponentQris onFilter={e => handleChangeFilterQris(e)} onClear={handleClear} filterText={filterTextBrand} title="Pencarian :" placeholder="Masukkan nama brand" onClickAddMerchant={() => history.push(`/formulir-info-pemilik-brand`)} addMerchant="Tambah brand" />
        );	}, [filterTextBrand, resetPaginationToggleBrand]
    );

    function handlePageChangeDataBrandQris(page) {
        if (isFilterDataBrandQris) {
            setActivePageDataBrandQris(page)
            filterListDataBrandQrisHandler(filterTextBrand, page, 10)
        } else {
            setActivePageDataBrandQris(page)
            getListDataBrandQrisHandler(page)
        }
    }

    async function getListDataBrandQrisHandler(page) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"outlet_name": "", "date_from": "", "date_to": "", "page": ${(page !== 0) ? page : 1}, "row_per_page": 10}`)
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

    async function filterListDataBrandQrisHandler(merchantName, page, rowPerPage) {
        try {
            setPendingDataBrandQris(true)
            setIsFilterDataBrandQris(true)
            setActivePageDataBrandQris(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"outlet_name":"${merchantName}", "date_from": "", "date_to": "", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
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

    function getPageRegisterQrisBrand (id, step, businessTypeId, settleId, merchantNou, userNou, statusId) {
        if (statusId === 106 || statusId === 107) {
            if (step === 1) {
                history.push(`/formulir-info-pemilik-brand/${id}`)
            } else if (step === 2) {
                history.push(`/formulir-info-usaha-brand/${id}`)
            } else if (step === 3) {
                history.push(`/form-dokumen-usaha-brand-badan-usaha/${id}`)
            } else if (step === 200) {
                history.push(`/pengaturan-merchant/${id}/102/${businessTypeId}`)
            } else if (step === 201) {
                history.push(`/form-info-rekening-brand/${settleId}/${merchantNou}/${userNou}/${id}`)
            } else if (step === 300) {
                history.push(`/detail-merchant-brand/${id}`)
            }
        } else {
            history.push(`/detail-merchant-brand/${id}`)
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
            width: "130px"
        },
        {
            name: 'Waktu bergabung',
            selector: row => row.moutlet_created_date_format,
            width: "170px"
        },
        {
            name: 'Nama grup', 
            selector: row => row.mmerchant_name,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Nama brand', 
            selector: row => row.moutlet_name,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Tujuan settlement',
            selector: row => row.mqrissettlegroup_name,
            wrap: true,
            width: "180px"
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "unset", margin: "6px 6px 6px 0px", borderRadius: 4,  },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 105 || row.status_id === 108,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.status_id === 106 || row.status_id === 107 || row.status_id === 109,
                    style: { background: "#FEF4E9", color: "#F79421", width: "150px"}
                },
                {
                    when: row => row.status_id === 110,
                    style: { background: "#FEF4E9", color: "#B9121B", width: "150px"}
                }
            ],
        },
        {
            name: 'Aksi',
            width: "170px",
            cell: (row) => (
                <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">{(row.status_id === 106 || row.status_id === 107) ? 'Lanjutkan daftar' : 'Lihat'}</div></Tooltip>}>
                    <FontAwesomeIcon onClick={() => getPageRegisterQrisBrand(row.mprofile_id, row.step, row.business_type_id, row.mqrissettlegroup_id, row.mmerchant_nou, row.moutlet_nou, row.status_id)} icon={(row.status_id === 106 || row.status_id === 107) ? faPencilAlt : faEye} className="me-2" style={{cursor: "pointer"}} />
                </OverlayTrigger> 
            ),
        },
    ];

    /*DAFTAR MERCHANT OUTLET QRIS */

    const [pageNumberDataOutletQris, setPageNumberDataOutletQris] = useState({})
    const [totalPageDataOutletQris, setTotalPageDataOutletQris] = useState(0)
    const [activePageDataOutletQris, setActivePageDataOutletQris] = useState(1)
    const [pendingDataOutletQris, setPendingDataOutletQris] = useState(true)
    const [isFilterDataOutletQris, setIsFilterDataOutletQris] = useState(false)
    const [dataMerchantOutletQris, setDataMerchantOutletQris] = useState([])
    const [filterTextOutlet, setFilterTextOutlet] = React.useState('');
    const [resetPaginationToggleOutlet, setResetPaginationToggleOutlet] = React.useState(false);
    const filteredItemsOutlet = dataMerchantOutletQris.filter(
        item => item.mstore_name && item.mstore_name.toLowerCase().includes(filterTextOutlet.toLowerCase()),
    );
    const subHeaderComponentMemoOutlet = useMemo(() => {
        const handleClear = () => {
            if (filterTextOutlet) {
                setResetPaginationToggleOutlet(!resetPaginationToggleOutlet);
                setFilterTextOutlet('');
            }
        };

        function handleChangeFilterQris (e) {
            setFilterTextOutlet(e.target.value)
            filterListDataOutletQrisHandler(e.target.value, activePageDataOutletQris, 10)
        }
        return (
            <FilterComponentQris onFilter={e => handleChangeFilterQris(e)} onClear={handleClear} filterText={filterTextOutlet} title="Pencarian :" placeholder="Masukkan nama outlet" onClickAddMerchant={() => history.push(`/formulir-info-pemilik-outlet`)} addMerchant="Tambah outlet" />
        );	}, [filterTextOutlet, resetPaginationToggleOutlet]
    );

    function handlePageChangeDataOutletQris(page) {
        if (isFilterDataOutletQris) {
            setActivePageDataOutletQris(page)
            filterListDataOutletQrisHandler(filterTextOutlet, page, 10)
        } else {
            setActivePageDataOutletQris(page)
            getListDataOutletQrisHandler(page)
        }
    }

    async function getListDataOutletQrisHandler(page) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"store_name": "", "date_from": "", "date_to": "", "page": ${(page !== 0) ? page : 1}, "row_per_page": 10}`)
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

    async function filterListDataOutletQrisHandler(merchantName, page, rowPerPage) {
        try {
            setPendingDataOutletQris(true)
            setIsFilterDataOutletQris(true)
            setActivePageDataOutletQris(page)
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"store_name":"${merchantName}", "date_from": "", "date_to": "", "page": ${(page !== 0) ? page : 1}, "row_per_page": ${(rowPerPage !== 0) ? rowPerPage : 10}}`)
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

    function getPageRegisterQrisOutlet (id, step, businessTypeId, settleId, merchantNou, userNou, statusId) {
        if (statusId === 106 || statusId === 107) {
            if (step === 1) {
                history.push(`/formulir-info-pemilik-outlet/${id}`)
            } else if (step === 2) {
                history.push(`/formulir-info-usaha-outlet/${id}`)
            } else if (step === 3) {
                history.push(`/form-dokumen-usaha-outlet/${id}`)
            } else if (step === 200) {
                history.push(`/pengaturan-merchant/${id}/103/${businessTypeId}`)
            } else if (step === 201) {
                history.push(`/form-info-rekening-outlet/${settleId}/${merchantNou}/${userNou}/${id}`)
            } else if (step === 300) {
                history.push(`/detail-merchant-outlet/${id}`)
            }
        } else {
            history.push(`/detail-merchant-outlet/${id}`)
        }
    }

    const columnsOutlet = [
        {
            name: 'No',
            selector: row => row.number,
            width: '67px'
        },
        {
            name: 'ID outlet',
            selector: row => row.mstore_id,
            width: "150px"
        },
        {
            name: 'Waktu bergabung',
            selector: row => row.mstore_create_date_format,
            width: "170px"
        },
        {
            name: 'Nama outlet', 
            selector: row => row.mstore_name,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Tercetak di QRIS', 
            selector: row => (row.name_in_qris === null) ? "-" : row.name_in_qris,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Tujuan settlement',
            selector: row => row.mqrissettlegroup_name,
            wrap: true,
            width: "180px"
        },
        {
            name: 'Status',
            selector: row => row.status_name,
            style: { display: "flex", flexDirection: "row", justifyContent: "center", alignItem: "center", padding: "unset", margin: "6px 6px 6px 0px", borderRadius: 4,  },
            conditionalCellStyles: [
                {
                    when: row => row.status_id === 105 || row.status_id === 108,
                    style: { background: "rgba(7, 126, 134, 0.08)", color: "#077E86" }
                },
                {
                    when: row => row.status_id === 106 || row.status_id === 107 || row.status_id === 109,
                    style: { background: "#FEF4E9", color: "#F79421", width: "150px"}
                },
                {
                    when: row => row.status_id === 110,
                    style: { background: "#FEF4E9", color: "#B9121B", width: "150px"}
                }
            ],
        },
        {
            name: 'Aksi',
            width: "170px",
            cell: (row) => (
                <div className='d-flex justify-content-center align-items-center'>
                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">{(row.status_id === 106 || row.status_id === 107) ? 'Lanjutkan daftar' : 'Lihat'}</div></Tooltip>}>
                        <FontAwesomeIcon onClick={() => getPageRegisterQrisOutlet(row.mprofile_id, row.step, row.business_type_id, row.mqrissettlegroup_id, row.merchant_nou, row.mstore_nou, row.status_id)} icon={(row.status_id === 106 || row.status_id === 107) ? faPencilAlt : faEye} className="me-2" style={{cursor: "pointer"}} />
                    </OverlayTrigger> 
                    <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">{(row.status_id === 108) && "Download QRIS"}</div></Tooltip>}>
                        <a href={row.qris_url} download className='ms-3'><FontAwesomeIcon icon={(row.status_id === 108) && faDownload} className="me-2" style={{cursor: "pointer"}} /></a>
                    </OverlayTrigger> 
                </div>
            ),
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                
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
        getListDataGrupQrisHandler(activePageDataGrupQris)
        getListDataBrandQrisHandler(activePageDataBrandQris)
        getListDataOutletQrisHandler(activePageDataOutletQris)
    }, [])
    

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar Merchant</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Daftar Merchant</h2>
            </div>
            <div className='detail-akun-menu mt-4' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' id="merchantGrup" onClick={() => disbursementTabs("merchantGrup")}>
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="merchantGrupspan">Merchant grup</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="merchantBrand" onClick={() => disbursementTabs("merchantBrand")}>
                    <span className='menu-detail-akun-span' id="merchantBrandspan">Merchant brand</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="merchantOutlet" onClick={() => disbursementTabs("merchantOutlet")}>
                    <span className='menu-detail-akun-span' id="merchantOutletspan">Merchant outlet</span>
                </div>
            </div>
            <hr className='hr-style' style={{marginTop: -2}}/>
            {
                isMerchantQris === "merchantGrup" ? (
                    <div className='base-content positiion-relative'>
                        <div className="div-table">
                            <DataTable
                                columns={columnsGrup}
                                data={filteredItemsGrup}
                                customStyles={customStyles}
                                highlightOnHover
                                progressPending={pendingDataGrupQris}
                                progressComponent={<CustomLoader />}
                                subHeader
                                subHeaderComponent={subHeaderComponentMemoGrup}
                                persistTableHead
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "groove" }}>
                            <div style={{ marginRight: 10, marginTop: 10 }}>Total Page: {totalPageDataGrupQris}</div>
                            <Pagination
                                activePage={activePageDataGrupQris}
                                itemsCountPerPage={pageNumberDataGrupQris.row_per_page}
                                totalItemsCount={(pageNumberDataGrupQris.row_per_page*pageNumberDataGrupQris.max_page)}
                                pageRangeDisplayed={5}
                                itemClass="page-item"
                                linkClass="page-link"
                                onChange={handlePageChangeDataGrupQris}
                            />
                        </div>
                    </div>
                ) : isMerchantQris === "merchantBrand" ? (
                    <div className='base-content positiion-relative'>
                        <div className="div-table">
                            <DataTable
                                columns={columnsBrand}
                                data={filteredItemsBrand}
                                customStyles={customStyles}
                                highlightOnHover
                                progressPending={pendingDataBrandQris}
                                progressComponent={<CustomLoader />}
                                subHeader
                                subHeaderComponent={subHeaderComponentMemoBrand}
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
                    </div>
                ) : (
                    <div className='base-content positiion-relative'>
                        <div className="div-table">
                            <DataTable
                                columns={columnsOutlet}
                                data={filteredItemsOutlet}
                                customStyles={customStyles}
                                highlightOnHover
                                progressPending={pendingDataOutletQris}
                                progressComponent={<CustomLoader />}
                                subHeader
                                subHeaderComponent={subHeaderComponentMemoOutlet}
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
                    </div>
                )
            }
        </div>
    )
}

export default DaftarMerchantQris